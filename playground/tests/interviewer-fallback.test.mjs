import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  QuotaError,
  quotaFromResponse,
  nextQuotaReset,
} from '../../server/providers/quota.mjs';
import { ModelRouter, reasoningModels } from '../../server/providers/model-routing.mjs';
import { runRoutedTurn } from '../../server/agent/routed-turn.mjs';
import { specialists } from '../../server/agent/specialists.mjs';
import { LIMITS } from '../../server/agent/guardrails.mjs';
import { AgentError } from '../../server/agent/errors.mjs';
import { Sessions } from '../../server/sessions/service.mjs';
import { AvailabilityError } from '../../server/providers/availability.mjs';
import { geminiGenerate } from '../../server/providers/gemini.mjs';

test('reasoning fallback configuration is ordered, deduplicated, bounded and optional', () => {
  assert.deepEqual(
    reasoningModels({
      GEMINI_MODEL: 'primary',
      GEMINI_FALLBACK_MODELS: 'backup, primary, backup, small',
    }),
    ['primary', 'backup', 'small'],
  );
  assert.deepEqual(reasoningModels({ GEMINI_MODEL: 'primary' }), ['primary']);
  assert.throws(() => reasoningModels({ GEMINI_FALLBACK_MODELS: 'a,b,c' }), /at most two/);
  assert.throws(() => reasoningModels({ GEMINI_MODEL: 'https://bad.example' }), /valid/);
});

test('429 switches to the next model, respects cooldown, then returns to the preferred model', async () => {
  let now = 1000,
    exhausted = true;
  const called = [];
  const router = new ModelRouter({ now: () => now });
  const generate = async (model) => {
    called.push(model);
    if (model === 'primary' && exhausted)
      throw new QuotaError('quota', { model, retryAfterMs: 90000 });
    return model;
  };
  const first = await router.run(generate, { models: ['primary', 'backup', 'small'] });
  assert.equal(first.routing.model, 'backup');
  assert.equal(first.routing.fallback, true);
  await router.run(generate, { models: ['primary', 'backup', 'small'] });
  assert.deepEqual(called, ['primary', 'backup', 'backup']);
  now += 90001;
  exhausted = false;
  assert.equal(
    (await router.run(generate, { models: ['primary', 'backup'] })).routing.fallback,
    false,
  );
});

test('exhausting every model is bounded and subsequent retries do not call cooling models', async () => {
  const router = new ModelRouter({ now: () => 1000 });
  let calls = 0;
  const generate = async (model) => {
    calls++;
    throw new QuotaError('quota', { model, daily: true, retryAfterMs: 600000 });
  };
  for (let i = 0; i < 2; i++)
    await assert.rejects(
      router.run(generate, { models: ['primary', 'backup', 'small'] }),
      (error) => {
        assert.equal(error.status, 429);
        assert.equal(error.retryAfterMs, 600000);
        assert.match(error.message, /daily/);
        return true;
      },
    );
  assert.equal(calls, 3);
});

test('authentication, malformed output, safety errors and cancellation never trigger model hopping', async () => {
  for (const status of [400, 401, 403, 404, 500, 502, 503]) {
    const router = new ModelRouter();
    let calls = 0;
    await assert.rejects(
      router.run(
        async () => {
          calls++;
          throw new AgentError('no retry', status);
        },
        { models: ['primary', 'backup'] },
      ),
      { status },
    );
    assert.equal(calls, 1);
  }
  let called = false;
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    new ModelRouter().run(
      async () => {
        called = true;
      },
      { models: ['primary'], signal: controller.signal },
    ),
    /timed out/,
  );
  assert.equal(called, false);
});

test('daily quota metadata and Retry-After are retained without leaking upstream details', async () => {
  const now = Date.parse('2026-10-01T10:00:00Z');
  const response = new Response(
    JSON.stringify({
      error: {
        message: 'secret-key project private-answer',
        details: [
          {
            '@type': 'type.googleapis.com/google.rpc.QuotaFailure',
            violations: [
              {
                quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier',
                quotaMetric: 'requests',
              },
            ],
          },
          { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '25s' },
        ],
      },
    }),
    { status: 429, headers: { 'Retry-After': '90' } },
  );
  const error = await quotaFromResponse(response, 'primary', 'Interviewer', now);
  assert.equal(error.daily, true);
  assert.equal(error.retryAfterMs, Date.parse('2026-10-02T07:00:00Z') - now);
  assert.doesNotMatch(JSON.stringify(error) + error.message, /secret-key|private-answer/);
  const minute = await quotaFromResponse(
    new Response('{}', { status: 429, headers: { 'Retry-After': '120' } }),
    'primary',
  );
  assert.equal(minute.retryAfterMs, 120000);
  assert.equal(minute.daily, false);
  const malformed = await quotaFromResponse(
    new Response('x'.repeat(70000), { status: 429 }),
    'primary',
  );
  assert.equal(malformed.retryAfterMs, 60000);
});

test('daily reset calculations account for Pacific daylight saving transitions', () => {
  for (const [date, expected] of [
    ['2026-03-08T07:30:00Z', '2026-03-08T08:00:00Z'],
    ['2026-03-08T10:30:00Z', '2026-03-09T07:00:00Z'],
    ['2026-11-01T07:30:00Z', '2026-11-02T08:00:00Z'],
    ['2026-11-01T10:30:00Z', '2026-11-02T08:00:00Z'],
  ])
    assert.equal(
      new Date(nextQuotaReset(Date.parse(date))).toISOString(),
      new Date(expected).toISOString(),
    );
});

const content = {
  subjects: [{ id: 'javascript', name: 'JavaScript' }],
  notes: [],
  questions: [
    {
      id: 'first',
      track: 'javascript',
      tags: ['machine-coding'],
      question: 'First tentative task',
    },
    {
      id: 'second',
      track: 'javascript',
      tags: ['machine-coding'],
      question: 'Successful task',
    },
  ],
};
const session = () => ({
  id: 'test',
  subject: 'javascript',
  language: 'english',
  phase: 'coding',
  durationMinutes: 60,
  messages: [],
  assessments: [],
  hintsUsed: 0,
  coding: null,
  agentMemory: { coding: { messages: [], assessments: [] } },
});
const input = { action: 'transition', elapsedMs: 1800000 };
const call = (name, args, model) => ({
  role: 'model',
  parts: [{ functionCall: { name, args, id: 'call' } }],
  providerSteps: [
    { type: 'thought', signature: `${model}-signature` },
    { type: 'function_call', id: 'call', name, arguments: args },
  ],
});

for (const Failure of [QuotaError, AvailabilityError])
  test(`mid-loop ${Failure.name} restarts cleanly, rolls back tools, and pins signed history`, async () => {
    const s = session(),
      seen = [];
    const counts = {};
    const generate = async ({ model, contents }) => {
      seen.push(model);
      counts[model] = (counts[model] || 0) + 1;
      if (counts[model] === 1) {
        assert.equal(
          contents.some((message) => message.providerSteps),
          false,
        );
        assert.equal(
          JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]).coding,
          null,
        );
        return call(
          'assign_coding',
          { questionId: model === 'primary' ? 'first' : 'second' },
          model,
        );
      }
      assert.ok(
        contents.some(
          (message) => message.providerSteps?.[0].signature === `${model}-signature`,
        ),
      );
      if (model === 'primary') throw new Failure('unavailable', { model });
      return call(
        'respond',
        { message: 'Implement the successful task.', speech: 'Implement the successful task.' },
        model,
      );
    };
    const reply = await runRoutedTurn(s, input, content, specialists.coding, {
      generate,
      router: new ModelRouter(),
      models: ['primary', 'backup'],
    });
    assert.deepEqual(seen, ['primary', 'primary', 'backup', 'backup']);
    assert.equal(s.coding.id, 'second');
    assert.equal(reply.modelRouting.model, 'backup');
    assert.deepEqual(reply.trace.modelAttempts, [
      { model: 'primary', status: Failure === QuotaError ? 'rate-limit' : 'unavailable' },
      { model: 'backup', status: 'ok' },
    ]);
  });

test('fallback shares the model/tool budget and deadline rather than resetting them', async () => {
  const s = session();
  let calls = 0;
  let signal;
  const generate = async (request) => {
    signal ??= request.signal;
    assert.equal(request.signal, signal);
    calls++;
    if (request.model === 'primary' && calls === 5) throw new QuotaError('quota');
    return call('get_questions', { kind: 'coding' }, request.model);
  };
  await assert.rejects(
    runRoutedTurn(s, input, content, specialists.coding, {
      generate,
      router: new ModelRouter(),
      models: ['primary', 'backup'],
    }),
    /tool limit/,
  );
  assert.equal(calls, LIMITS.rounds);
  assert.equal(s.coding, null);
});

test('actual session persistence commits a successful fallback only once and retains model metadata', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'shortnotes-fallback-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const env = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    GEMINI_FALLBACK_MODELS: process.env.GEMINI_FALLBACK_MODELS,
  };
  Object.assign(process.env, {
    GEMINI_API_KEY: 'fake',
    GEMINI_MODEL: 'test-primary',
    GEMINI_FALLBACK_MODELS: 'test-backup',
  });
  t.after(() => {
    for (const [key, value] of Object.entries(env))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  });
  const models = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    const { model } = JSON.parse(options.body);
    models.push(model);
    if (model === 'test-primary') return new Response('{}', { status: 429 });
    return new Response(
      JSON.stringify({
        steps: [
          {
            type: 'function_call',
            id: 'finish',
            name: 'respond',
            arguments: { message: 'How did you build it?', speech: 'How did you build it?' },
          },
        ],
      }),
    );
  });
  const sessions = new Sessions(directory, content);
  const started = await sessions.create({ subject: 'javascript', language: 'english' });
  const request = { action: 'answer', text: 'I built a notes app.', requestId: 'same-answer' };
  const result = await sessions.update(started.id, request);
  assert.deepEqual(models, ['test-primary', 'test-backup']);
  assert.equal(result.modelRouting.model, 'test-backup');
  assert.equal(result.messages.length, 3);
  const again = await sessions.update(started.id, request);
  assert.equal(again.messages.length, 3);
  assert.equal(models.length, 2);
  const stored = await sessions.get(started.id);
  assert.equal(stored.agentMemory.intro.messages.length, 3);
  assert.equal(stored.requests.length, 1);
});

test('all exhausted attempts leave the candidate state unchanged', async () => {
  const s = session(),
    before = structuredClone(s);
  await assert.rejects(
    runRoutedTurn(s, input, content, specialists.coding, {
      generate: async ({ model, contents }) => {
        if (contents.some((message) => message.providerSteps))
          throw new QuotaError('quota', { model });
        return call('assign_coding', { questionId: 'first' }, model);
      },
      router: new ModelRouter(),
      models: ['primary', 'backup'],
    }),
    { status: 429 },
  );
  assert.deepEqual(s, before);
});

test('upstream overload fails over immediately, respects a short cooldown, and keeps a usable backup', async (t) => {
  const old = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'fake';
  t.after(() => {
    if (old === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = old;
  });
  const calls = [];
  let now = 1000;
  const router = new ModelRouter({ now: () => now });
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    const { model } = JSON.parse(options.body);
    calls.push(model);
    return model === 'primary'
      ? new Response('private-upstream-detail', {
          status: 503,
          headers: { 'Retry-After': '45' },
        })
      : Response.json({
          steps: [
            {
              type: 'function_call',
              name: 'respond',
              id: 'reply',
              arguments: { message: 'Question', speech: 'Question' },
            },
          ],
        });
  });
  const attempt = (model, { canFailover }) =>
    geminiGenerate({
      model,
      canFailover,
      system: 'Test',
      contents: [],
      signal: AbortSignal.timeout(5000),
    });
  const first = await router.run(attempt, { models: ['primary', 'backup'] });
  assert.equal(first.routing.model, 'backup');
  assert.equal(first.attempts[0].status, 'unavailable');
  await router.run(attempt, { models: ['primary', 'backup'] });
  assert.deepEqual(calls, ['primary', 'backup', 'backup']);
  now += 45001;
  await router.run(attempt, { models: ['primary', 'backup'] });
  assert.deepEqual(calls.slice(-2), ['primary', 'backup']);
});

test('all-busy and mixed quota/overload failures return bounded 503 cooldowns without retry loops', async () => {
  const router = new ModelRouter({ now: () => 1000 });
  let calls = 0;
  const attempt = async (model) => {
    calls++;
    throw model === 'primary'
      ? new QuotaError('quota', { retryAfterMs: 60000 })
      : new AvailabilityError();
  };
  for (let i = 0; i < 2; i++)
    await assert.rejects(router.run(attempt, { models: ['primary', 'backup'] }), (error) => {
      assert.equal(error.status, 503);
      assert.equal(error.retryAfterMs, 30000);
      assert.match(error.message, /answer is preserved/);
      return true;
    });
  assert.equal(calls, 2);
});
