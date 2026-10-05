import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Sessions } from '../../server/sessions/service.mjs';
import { elapsed, phaseAt } from '../../server/sessions/clock.mjs';
import { executeTool } from '../../server/tools/registry.mjs';
import { validateReply } from '../../server/agent/guardrails.mjs';
import { runInterviewTurn } from '../../server/agent/hub.mjs';

const content = {
  subjects: [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
  ],
  notes: [
    {
      id: 'js-closures',
      track: 'javascript',
      title: 'Closures',
      body: 'Functions retain access to their lexical environment.',
      tags: [],
    },
    { id: 'java-classes', track: 'java', title: 'Classes', body: 'Java classes.', tags: [] },
  ],
  questions: [
    {
      id: 'js-theory',
      track: 'javascript',
      question: 'What is a closure?',
      answer: ['Lexical scope'],
      tags: [],
      noteId: 'js-closures',
    },
    {
      id: 'js-coding',
      track: 'javascript',
      question: 'Implement a counter',
      promptCode: 'Build an incrementing counter.',
      tags: ['machine-coding'],
      noteId: 'js-closures',
    },
    {
      id: 'java-coding',
      track: 'java',
      question: 'Build a Java cache',
      tags: ['machine-coding'],
      noteId: 'java-classes',
    },
  ],
};
const assessment = {
  topic: 'closures',
  verdict: 'partial',
  evidence: 'Candidate mentioned scope but not retained access.',
  chapterId: 'js-closures',
};
const call = (name, args) => ({ role: 'model', parts: [{ functionCall: { name, args } }] });
const respond = (extra = {}) =>
  call('respond', {
    message: 'How did you implement that?',
    speech: 'How did you implement that?',
    ...extra,
  });

async function fixture(t, generate = async () => respond()) {
  const directory = await mkdtemp(join(tmpdir(), 'shortnotes-agent-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sessions = new Sessions(directory, content, generate);
  const session = await sessions.create({ subject: 'javascript', language: 'english' });
  return { sessions, session };
}
async function setPhase(sessions, id, phase, elapsedMs = 0) {
  const session = await sessions.get(id);
  Object.assign(session, { phase, elapsedMs, runningSince: Date.now() });
  await sessions.save(session);
  return session;
}

test('sessions start with an introduction and reject unsupported subjects', async (t) => {
  const { sessions, session } = await fixture(t);
  assert.equal(session.phase, 'intro');
  assert.equal(session.durationMinutes, 60);
  assert.match(session.messages[0].text, /tell me about yourself/i);
  await assert.rejects(sessions.create({ subject: 'unknown' }), { status: 400 });
  await assert.rejects(sessions.get('../../.env'), { status: 404 });
});

test('clock excludes pause duration and phase scheduling never moves backward', () => {
  const base = {
    durationMinutes: 60,
    elapsedMs: 120000,
    runningSince: 1000,
    status: 'active',
    phase: 'intro',
  };
  assert.equal(elapsed(base, 31000), 150000);
  assert.equal(elapsed({ ...base, status: 'paused' }, 9999999), 120000);
  assert.equal(phaseAt({ ...base, elapsedMs: 6 * 60000, status: 'paused' }), 'theory');
  assert.equal(phaseAt({ ...base, phase: 'coding', status: 'paused' }), 'coding');
  assert.equal(elapsed(base, 9999999), 60 * 60000);
});

test('pause and resume retain elapsed time and paused answers do not call the model', async (t) => {
  let calls = 0;
  const { sessions, session } = await fixture(t, async () => {
    calls++;
    return respond();
  });
  const paused = await sessions.update(session.id, { action: 'pause', requestId: 'pause' });
  assert.equal(paused.status, 'paused');
  const persisted = await sessions.get(session.id);
  persisted.runningSince -= 10 * 60000;
  await sessions.save(persisted);
  await assert.rejects(
    sessions.update(session.id, { action: 'answer', text: 'Hello', requestId: 'answer' }),
    { status: 409 },
  );
  const resumed = await sessions.update(session.id, { action: 'resume', requestId: 'resume' });
  assert.equal(resumed.status, 'active');
  assert.ok(Math.abs(resumed.elapsedMs - paused.elapsedMs) < 1000);
  assert.equal(calls, 0);
});

test('manual next at an expired intro advances to theory without skipping coding', async (t) => {
  const { sessions, session } = await fixture(t);
  await setPhase(sessions, session.id, 'intro', 6 * 60000);
  const next = await sessions.update(session.id, { action: 'next', requestId: 'next' });
  assert.equal(next.phase, 'theory');
});

test('tool access is scoped and coding tasks cannot cross subjects or use theory questions', () => {
  const session = { subject: 'javascript', phase: 'coding', coding: null };
  assert.throws(() =>
    executeTool('get_questions', { kind: 'theory' }, session, content, ['search_notes', 'respond']),
  );
  assert.throws(() =>
    executeTool('assign_coding', { questionId: 'java-coding' }, session, content),
  );
  assert.throws(() => executeTool('assign_coding', { questionId: 'js-theory' }, session, content));
  assert.equal(session.coding, null);
  const result = executeTool('assign_coding', { questionId: 'js-coding' }, session, content);
  assert.equal(result.id, 'js-coding');
  assert.equal(
    executeTool('assign_coding', { questionId: 'java-coding' }, session, content).id,
    'js-coding',
  );
  const retrieved = executeTool('search_notes', { query: 'classes' }, session, content);
  assert.ok(retrieved.every((note) => note.id !== 'java-classes'));
});

test('guardrails drop grading on hints and discard unrelated revision links', () => {
  const session = { subject: 'javascript', phase: 'theory' };
  const reply = validateReply(
    {
      message: 'Think about scope.',
      speech: 'Think about scope.',
      assessment,
      reviewChapterIds: ['js-closures', 'java-classes', 'invented'],
    },
    session,
    content,
    'hint',
  );
  assert.equal(reply.assessment, undefined);
  assert.deepEqual(reply.reviewChapterIds, ['js-closures']);
  assert.throws(() => validateReply({ message: '', speech: 'Empty.' }, session, content, 'answer'));
});

test('model tool loop returns retrieval results before the final answer', async (t) => {
  let count = 0;
  const { sessions, session } = await fixture(t, async (payload) => {
    count++;
    if (count === 1) return call('search_notes', { query: 'closures' });
    const toolResponse = payload.contents
      .flatMap((message) => message.parts)
      .find((part) => part.functionResponse?.name === 'search_notes');
    assert.ok(toolResponse);
    assert.match(JSON.stringify(toolResponse), /js-closures/);
    return respond({ assessment });
  });
  await setPhase(sessions, session.id, 'theory');
  const result = await sessions.update(session.id, {
    action: 'answer',
    text: 'Closures use scope.',
    requestId: 'answer',
  });
  assert.equal(count, 2);
  assert.equal(result.assessments.length, 1);
  assert.equal(result.assessments[0].verdict, 'partial');
  const saved = await sessions.get(session.id);
  assert.equal(saved.agentMemory.theory.messages.length, 2);
  assert.equal(saved.agentMemory.theory.assessments.length, 1);
  assert.equal(saved.agentMemory.intro.messages.length, 1);
  assert.equal(saved.agentMemory.coding.messages.length, 0);
});

test('failed provider turns roll back transcript, assignments, hints, and retry IDs', async (t) => {
  let count = 0;
  const { sessions, session } = await fixture(t, async () => {
    if (++count === 1) return call('assign_coding', { questionId: 'js-coding' });
    throw new Error('Simulated provider outage');
  });
  await setPhase(sessions, session.id, 'coding');
  const before = await sessions.get(session.id);
  await assert.rejects(sessions.update(session.id, { action: 'hint', requestId: 'failed-hint' }));
  assert.deepEqual(await sessions.get(session.id), before);
});

test('successful request retries are idempotent', async (t) => {
  let calls = 0;
  const { sessions, session } = await fixture(t, async () => {
    calls++;
    return respond();
  });
  const input = { action: 'answer', text: 'I built a notes app.', requestId: 'same-request' };
  const first = await sessions.update(session.id, input);
  const retry = await sessions.update(session.id, input);
  assert.equal(calls, 1);
  assert.deepEqual(retry.messages, first.messages);
});

test('concurrent turns on the same session are rejected until the in-flight turn commits', async (t) => {
  let release, started;
  const ready = new Promise((resolve) => {
    started = resolve;
  });
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const { sessions, session } = await fixture(t, async () => {
    started();
    await pending;
    return respond();
  });
  const first = sessions.update(session.id, {
    action: 'answer',
    text: 'My introduction.',
    requestId: 'first',
  });
  await ready;
  try {
    await assert.rejects(
      sessions.update(session.id, {
        action: 'answer',
        text: 'Duplicate.',
        requestId: 'second',
      }),
      { status: 409 },
    );
  } finally {
    release();
  }
  await first;
  assert.equal((await sessions.get(session.id)).messages.length, 3);
});

test('bounded tool loops terminate and failed turns leave durable state unchanged', async (t) => {
  let calls = 0;
  const { sessions, session } = await fixture(t, async () => {
    calls++;
    return call('unknown_tool', {});
  });
  const before = await sessions.get(session.id);
  await assert.rejects(
    sessions.update(session.id, { action: 'answer', text: 'Hello.', requestId: 'loop' }),
  );
  assert.ok(calls > 0 && calls <= 8);
  assert.deepEqual(await sessions.get(session.id), before);
});

test('theory specialist receives its own memory without coding private messages', async (t) => {
  const { sessions, session } = await fixture(t);
  const stored = await setPhase(sessions, session.id, 'theory');
  stored.agentMemory = {
    intro: { messages: [], assessments: [] },
    theory: {
      messages: [{ role: 'user', text: 'THEORY_PRIVATE_MEMORY', phase: 'theory' }],
      assessments: [],
    },
    coding: {
      messages: [{ role: 'user', text: 'CODING_PRIVATE_MEMORY', phase: 'coding' }],
      assessments: [],
    },
    review: { messages: [], assessments: [] },
  };
  await runInterviewTurn(
    stored,
    { action: 'answer', text: 'Explain closures.', elapsedMs: 0 },
    content,
    async (payload) => {
      const prompt = JSON.stringify(payload);
      assert.match(prompt, /THEORY_PRIVATE_MEMORY/);
      assert.doesNotMatch(prompt, /CODING_PRIVATE_MEMORY/);
      return respond();
    },
  );
});

test('ending generates a review and completed sessions reject further answers', async (t) => {
  const { sessions, session } = await fixture(t, async () => respond({ assessment }));
  const ended = await sessions.update(session.id, { action: 'end', requestId: 'end' });
  assert.equal(ended.phase, 'review');
  assert.equal(ended.status, 'completed');
  assert.equal(ended.assessments.length, 0);
  await assert.rejects(
    sessions.update(session.id, {
      action: 'answer',
      text: 'One more thing.',
      requestId: 'late-answer',
    }),
    { status: 409 },
  );
});

test('hint turns persist hint usage without grading the candidate', async (t) => {
  const { sessions, session } = await fixture(t, async () => respond({ assessment }));
  await setPhase(sessions, session.id, 'theory');
  const result = await sessions.update(session.id, { action: 'hint', requestId: 'hint' });
  assert.equal(result.hintsUsed, 1);
  assert.equal(result.assessments.length, 0);
});

test('provider keeps credentials in headers and sanitizes upstream errors', async (t) => {
  const { geminiGenerate } = await import('../../server/providers/gemini.mjs');
  const oldKey = process.env.GEMINI_API_KEY,
    oldModel = process.env.GEMINI_MODEL;
  process.env.GEMINI_API_KEY = 'fake-test-secret-never-use';
  process.env.GEMINI_MODEL = 'gemini-2.5-flash';
  t.after(() => {
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
    if (oldModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = oldModel;
  });
  let bodyRead = false;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.doesNotMatch(url, /fake-test-secret/);
    assert.equal(options.headers['x-goog-api-key'], 'fake-test-secret-never-use');
    assert.doesNotMatch(options.body, /fake-test-secret/);
    return {
      ok: false,
      status: 429,
      json: async () => {
        bodyRead = true;
        return { secret: 'fake-test-secret-never-use' };
      },
    };
  });
  await assert.rejects(geminiGenerate({ system: 'Interview', contents: [] }), (error) => {
    assert.equal(error.status, 429);
    assert.doesNotMatch(error.message, /fake-test-secret/);
    return true;
  });
  assert.equal(bodyRead, false);
});

test('HTTP API rejects foreign hosts, origins, malformed payloads, and hides internal errors', async (t) => {
  const { makeServer } = await import('../../server/api/http.mjs');
  const { request } = await import('node:http');
  const { sessions } = await fixture(t);
  const server = makeServer(sessions, {
    configured: true,
    model: 'test-model',
    allowedOrigins: new Set(['http://localhost:5173']),
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const send = (path, { method = 'GET', headers = {}, body } = {}) =>
    new Promise((resolve, reject) => {
      const req = request(
        { hostname: '127.0.0.1', port: server.address().port, path, method, headers },
        (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: JSON.parse(Buffer.concat(chunks).toString()),
            }),
          );
        },
      );
      req.on('error', reject);
      req.end(body);
    });
  const health = await send('/api/interviewer/health');
  assert.equal(health.status, 200);
  assert.deepEqual(Object.keys(health.data).sort(), [
    'configured',
    'model',
    'storage',
    'subjects',
    'voice',
  ]);
  assert.deepEqual(Object.keys(health.data.voice).sort(), [
    'liveTranscription',
    'speech',
    'transcription',
  ]);
  assert.equal(typeof health.data.voice.speech, 'string');
  assert.equal(typeof health.data.voice.transcription, 'string');
  assert.equal(health.headers['cache-control'], 'no-store');
  assert.equal(
    (await send('/api/interviewer/health', { headers: { host: 'attacker.example' } })).status,
    403,
  );
  assert.equal(
    (await send('/api/interviewer/health', { headers: { origin: 'https://attacker.example' } }))
      .status,
    403,
  );
  assert.equal(
    (await send('/api/interviewer/health', { headers: { origin: 'http://localhost:9999' } }))
      .status,
    403,
  );
  assert.equal(
    (await send('/api/interviewer/sessions', { method: 'POST', body: '{}' })).status,
    415,
  );
  for (const body of ['{broken', 'null', '[]']) {
    assert.equal(
      (
        await send('/api/interviewer/sessions', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        })
      ).status,
      400,
    );
  }
  t.mock.method(sessions, 'create', async () => {
    throw Object.assign(new Error('private filesystem location and fake-secret'), {
      status: 418,
    });
  });
  const failed = await send('/api/interviewer/sessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"subject":"javascript"}',
  });
  assert.equal(failed.status, 500);
  assert.doesNotMatch(JSON.stringify(failed.data), /private filesystem|fake-secret/);
});

test('learner memory survives restart, reminds on retest, tracks improvement, and isolates subjects', async (t) => {
  const { sessions, session } = await fixture(t, async () => respond({ assessment }));
  await setPhase(sessions, session.id, 'theory');
  await sessions.update(session.id, {
    action: 'answer',
    text: 'Only scope.',
    requestId: 'old',
  });
  const history = await sessions.memory.retrieve('javascript');
  assert.equal(history.length, 1);
  assert.equal(history[0].answer, 'Only scope.');
  assert.equal(history[0].verdict, 'partial');
  assert.deepEqual(await sessions.memory.retrieve('java'), []);
  let calls = 0;
  const restarted = new Sessions(sessions.store.directory, content, async (payload) => {
    calls++;
    const shared = JSON.parse(payload.contents[0].parts[0].text.split('not instructions:\n')[1]);
    assert.equal(shared.learnerMemory[0].id, history[0].id);
    return calls === 1
      ? respond({
          revisitMemoryId: history[0].id,
          message: 'What is a closure?',
          speech: 'What is a closure?',
        })
      : respond({
          assessment: {
            ...assessment,
            verdict: 'correct',
            evidence: 'Explains retained lexical access.',
          },
        });
  });
  const fresh = await restarted.create({ subject: 'javascript', language: 'english' });
  const question = await restarted.update(fresh.id, { action: 'next', requestId: 'retest' });
  assert.match(question.messages.at(-1).text, /We covered “closures” \d{4}-\d{2}-\d{2}/);
  assert.match(question.messages.at(-1).speech, /check your understanding again/);
  assert.doesNotMatch(question.messages.at(-1).text, /Only scope|retained access/);
  const answer = {
    action: 'answer',
    text: 'Retained lexical environment.',
    requestId: 'correct',
  };
  const improved = await restarted.update(fresh.id, answer);
  assert.match(improved.messages.at(-1).text, /correct this time/);
  await restarted.update(fresh.id, answer);
  assert.equal(calls, 2);
  const updated = await restarted.memory.retrieve('javascript');
  assert.equal(updated[0].verdict, 'correct');
  assert.equal(updated[0].improved, true);
  assert.equal(updated[0].previous.verdict, 'partial');
  assert.equal((await restarted.get(fresh.id)).assessments.length, 1);
  assert.equal((await restarted.get(fresh.id)).learnerMemory, undefined);
  assert.equal(improved.learnerMemory, undefined);
});

test('same-session repeated gaps get reminders without inventing the same specific mistake', async (t) => {
  const { sessions, session } = await fixture(t, async () => respond({ assessment }));
  await setPhase(sessions, session.id, 'theory');
  await sessions.update(session.id, { action: 'answer', text: 'Scope.', requestId: 'one' });
  const second = await sessions.update(session.id, {
    action: 'answer',
    text: 'Still scope.',
    requestId: 'two',
  });
  assert.match(second.messages.at(-1).speech, /earlier in this interview/);
  assert.match(second.messages.at(-1).text, /still needs work/);
  assert.doesNotMatch(second.messages.at(-1).text, /same mistake|same question/);
});

test('failed turns cannot change long-term evidence and fabricated revisit IDs are rejected', async (t) => {
  let fail = false;
  const { sessions, session } = await fixture(t, async () =>
    fail ? respond({ revisitMemoryId: 'invented-history' }) : respond({ assessment }),
  );
  await setPhase(sessions, session.id, 'theory');
  await sessions.update(session.id, { action: 'answer', text: 'Scope.', requestId: 'good' });
  const before = await sessions.memory.retrieve('javascript');
  fail = true;
  await assert.rejects(
    sessions.update(session.id, { action: 'answer', text: 'Failed.', requestId: 'bad' }),
  );
  assert.deepEqual(await sessions.memory.retrieve('javascript'), before);
});

test('memory supports legacy assessments, bounded context, corrupt history and deletion', async (t) => {
  const { writeFile, unlink } = await import('node:fs/promises');
  const { sessions, session } = await fixture(t);
  const stored = await sessions.get(session.id);
  stored.assessments = Array.from({ length: 50 }, (_, i) => ({
    ...assessment,
    topic: `topic ${i}`,
    phase: 'theory',
    at: Date.now() + i,
    evidence: 'Evidence.'.repeat(200),
  }));
  await sessions.save(stored);
  await writeFile(
    join(sessions.store.directory, '00000000-0000-0000-0000-000000000000.json'),
    '{bad json',
  );
  const memory = await sessions.memory.retrieve('javascript');
  assert.ok(memory.length > 0 && memory.length <= 24);
  assert.ok(memory.reduce((size, entry) => size + JSON.stringify(entry).length, 0) <= 20000);
  assert.equal(memory[0].topic, 'topic 49');
  assert.equal(memory[0].answer, '');
  assert.equal(memory[0].correction, '');
  await unlink(sessions.store.path(session.id));
  assert.deepEqual(await sessions.memory.retrieve('javascript'), []);
});

test('resolved memory is not described as an unresolved past failure', () => {
  const session = {
    id: 'current',
    subject: 'javascript',
    phase: 'theory',
    language: 'english',
    learnerMemory: [
      {
        id: 'old:0',
        sessionId: 'old',
        topic: 'closures',
        phase: 'theory',
        at: 1,
        verdict: 'correct',
      },
    ],
  };
  const reply = validateReply(
    { message: 'Explain retained access.', speech: 'Explain retained access.', assessment },
    session,
    content,
    'answer',
  );
  assert.match(reply.message, /earlier answer was correct/);
  assert.doesNotMatch(reply.message, /still needs work/);
  assert.throws(() =>
    validateReply(
      { message: 'Question', speech: 'Question', revisitMemoryId: 'fake' },
      session,
      content,
      'next',
    ),
  );
});

test('hub-selected retests require the exact memory reference before responding', () => {
  const old = {
    id: 'old:0',
    sessionId: 'old',
    topic: 'closures',
    phase: 'theory',
    at: 1,
    verdict: 'partial',
  };
  const session = {
    id: 'current',
    subject: 'javascript',
    phase: 'theory',
    language: 'english',
    learnerMemory: [old],
    revisitTarget: old,
  };
  const response = { message: 'What is a closure?', speech: 'What is a closure?' };
  assert.throws(() => validateReply(response, session, content, 'next'), /hub selected/);
  const result = validateReply({ ...response, revisitMemoryId: old.id }, session, content, 'next');
  assert.match(result.speech, /We covered/);
  assert.equal(result.memoryReference.id, old.id);
});

test('automatic theory-to-coding handoff preserves assessment ownership and answer phase', async (t) => {
  let calls = 0;
  const { sessions, session } = await fixture(t, async ({ contents }) => {
    const shared = JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]);
    assert.equal(shared.phase, 'coding');
    assert.equal(shared.questionBeingAnswered.phase, 'theory');
    if (++calls === 1) return call('assign_coding', { questionId: 'js-coding' });
    return respond({ assessment });
  });
  const stored = await setPhase(sessions, session.id, 'theory', 30 * 60000);
  stored.activeAgent = 'theory';
  const question = {
    id: 'theory-question',
    role: 'assistant',
    text: 'What is a closure?',
    phase: 'theory',
    agent: 'theory',
  };
  stored.messages.push(question);
  stored.agentMemory.theory.messages.push(question);
  await sessions.save(stored);
  const result = await sessions.update(session.id, {
    action: 'answer',
    text: 'Lexical scope.',
    requestId: 'boundary-answer',
  });
  const saved = await sessions.get(session.id);
  assert.equal(result.phase, 'coding');
  assert.equal(result.messages.at(-2).phase, 'theory');
  assert.equal(result.messages.at(-2).action, 'answer');
  assert.equal(saved.agentMemory.theory.assessments.length, 1);
  assert.equal(saved.agentMemory.coding.assessments.length, 0);
  assert.equal(saved.handoffs.at(-1).from, 'theory');
  assert.equal(saved.handoffs.at(-1).to, 'coding');
});

test('complete interview lifecycle delegates every specialist and reviews actual coding evidence', async (t) => {
  const phases = new Set();
  const { sessions, session } = await fixture(t, async ({ contents }) => {
    const shared = JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]);
    phases.add(shared.phase);
    if (shared.phase === 'coding' && !shared.coding) {
      const assigned = contents.some((m) =>
        m.parts.some((p) => p.functionResponse?.name === 'assign_coding'),
      );
      if (!assigned) return call('assign_coding', { questionId: 'js-coding' });
    }
    if (shared.phase === 'review') {
      assert.equal(shared.submittedCodeAttempts, 1);
      assert.equal(shared.hintsUsed, 1);
    }
    return respond({ assessment });
  });
  await sessions.update(session.id, {
    action: 'answer',
    text: 'I implemented a notes app.',
    requestId: 'intro',
  });
  await sessions.update(session.id, { action: 'next', requestId: 'theory' });
  await sessions.update(session.id, {
    action: 'answer',
    text: 'Functions retain lexical bindings.',
    requestId: 'theory-answer',
  });
  await sessions.update(session.id, { action: 'next', requestId: 'coding' });
  await sessions.update(session.id, { action: 'hint', code: 'let count;', requestId: 'hint' });
  await sessions.update(session.id, {
    action: 'answer',
    text: 'Here is my counter.',
    code: 'let count = 0; const next = () => ++count;',
    requestId: 'code-answer',
  });
  await sessions.update(session.id, { action: 'next', requestId: 'review' });
  const result = await sessions.update(session.id, {
    action: 'end',
    code: 'let count = 0;',
    requestId: 'end',
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.assessments.length, 2);
  assert.deepEqual([...phases], ['intro', 'theory', 'coding', 'review']);
  const saved = await sessions.get(session.id);
  assert.equal(saved.handoffs.length, 3);
  assert.equal(saved.agentMemory.intro.assessments.length, 0);
  assert.equal(saved.agentMemory.theory.assessments.length, 1);
  assert.equal(saved.agentMemory.coding.assessments.length, 1);
  assert.equal(saved.agentMemory.review.assessments.length, 0);
  assert.ok(Object.values(saved.agentMemory).every((memory) => memory.messages.length > 0));
});
