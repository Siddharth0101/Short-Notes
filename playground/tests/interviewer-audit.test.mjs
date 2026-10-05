import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContext } from '../../server/agent/context.mjs';
import { LIMITS, validateTool } from '../../server/agent/guardrails.mjs';
import { runAgent } from '../../server/agent/runtime.mjs';
import { LearnerMemory } from '../../server/memory/learner-memory.mjs';

const session = () => ({
  id: 'test',
  subject: 'javascript',
  language: 'english',
  phase: 'theory',
  durationMinutes: 60,
  messages: [
    {
      role: 'assistant',
      text: 'Explain closures before we change rounds.',
      phase: 'intro',
      agent: 'intro',
    },
  ],
  assessments: [],
  hintsUsed: 0,
  agentMemory: { theory: { messages: [], assessments: [] } },
});
const input = { action: 'answer', text: 'Lexical bindings.', elapsedMs: 1000 };
const content = { notes: [], questions: [] };
const call = (name, args) => ({ functionCall: { name, args } });
const finish = () => ({
  role: 'model',
  parts: [call('respond', { message: 'Next question.', speech: 'Next question.' })],
});
const shared = (contents) =>
  JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]);

test('specialist handoffs preserve the complete question being answered', () => {
  const s = session();
  s.messages[0].text = 'Q'.repeat(14000);
  const context = shared(buildContext(s, input, { id: 'theory' }));
  assert.equal(context.questionBeingAnswered.text.length, 14000);
  assert.equal(context.questionBeingAnswered.phase, 'intro');
});

test('assessment context is bounded and oversized code history is explicitly truncated', () => {
  const s = session();
  s.assessments = Array.from({ length: 60 }, (_, i) => ({
    topic: `topic ${i}`,
    evidence: 'x'.repeat(1500),
    verdict: 'partial',
  }));
  s.agentMemory.theory.messages = [
    { role: 'user', text: 'Recent answer', code: 'x'.repeat(30000) },
  ];
  const contents = buildContext(s, input, { id: 'theory' });
  const assessments = shared(contents).assessments;
  assert.ok(assessments.length < 60);
  assert.equal(assessments.at(-1).topic, 'topic 59');
  assert.match(contents[1].parts[0].text, /Earlier message truncated/);
  assert.ok(contents[1].parts[0].text.length <= LIMITS.historyChars);
  assert.equal(JSON.parse(contents.at(-1).parts[0].text).answer, input.text);
});

test('total prompt budget stops calls before sending oversized provider context', async () => {
  const s = session();
  s.coding = { prompt: 'x'.repeat(LIMITS.promptChars) };
  let calls = 0;
  await assert.rejects(
    runAgent(s, input, content, async () => {
      calls++;
      return finish();
    }),
    /context limit/,
  );
  assert.equal(calls, 0);
});

test('repeated retrieval batches cannot exceed the per-turn tool execution budget', async () => {
  let rounds = 0;
  const result = await runAgent(session(), input, content, async ({ contents }) => {
    rounds++;
    if (rounds <= 2)
      return {
        role: 'model',
        parts: Array.from({ length: 8 }, () => call('search_notes', { query: 'closures' })),
      };
    const responses = contents.at(-1).parts;
    assert.equal(responses.filter((p) => p.functionResponse.response.error).length, 4);
    return finish();
  });
  assert.equal(result.tools.length, LIMITS.turnToolCalls);
  assert.ok(
    result.trace.steps
      .filter((s) => s.type === 'model')
      .every((s) => s.promptChars <= LIMITS.promptChars),
  );
});

test('oversized question-bank results are marked incomplete instead of flooding context', async () => {
  let rounds = 0;
  const data = {
    ...content,
    questions: [{ id: 'q', track: 'javascript', tags: [], answer: '\\'.repeat(50000) }],
  };
  await runAgent(session(), input, data, async ({ contents }) => {
    if (++rounds === 1)
      return { role: 'model', parts: [call('get_questions', { kind: 'theory' })] };
    const result = contents.at(-1).parts[0].functionResponse.response.result;
    assert.equal(result.truncated, true);
    assert.ok(JSON.stringify(result).length <= LIMITS.toolResultChars);
    return finish();
  });
});

test('schema validation rejects inherited-property argument names', () => {
  assert.throws(
    () =>
      validateTool('search_notes', { query: 'x', constructor: 'injected' }, ['search_notes']),
    /Unexpected argument/,
  );
});

test('same-timestamp memory chooses the latest numeric assessment position', async () => {
  const s = session();
  s.assessments = Array.from({ length: 12 }, (_, i) => ({
    topic: 'closures',
    phase: 'theory',
    at: 1,
    verdict: i === 11 ? 'correct' : 'partial',
    evidence: 'test',
  }));
  const memory = new LearnerMemory({
    async *assessmentSessions() {
      yield s;
    },
  });
  const result = await memory.retrieve('javascript');
  assert.equal(result[0].id, 'test:11');
  assert.equal(result[0].improved, true);
});

test('coding time budget preserves the review window including fractional minutes', async () => {
  const { roundBudget } = await import('../../server/sessions/clock.mjs');
  const s = { ...session(), phase: 'coding' };
  assert.equal(roundBudget(s, 30 * 60000), 25);
  assert.equal(roundBudget(s, 54 * 60000), 1);
  assert.equal(roundBudget(s, 54.5 * 60000), 0.5);
  assert.equal(roundBudget(s, 55 * 60000), 0);
  assert.equal(roundBudget(s, 0), 25);
  const context = shared(
    buildContext(s, { ...input, elapsedMs: 54.5 * 60000 }, { id: 'coding' }),
  );
  assert.equal(context.suggestedRoundMinutes, 0);
  assert.equal(context.roundRemainingSeconds, 30);
});

test('code attempt counts exclude hints and end drafts, include current answers and support legacy history', async () => {
  const { submittedCodeAttempts } = await import('../../server/sessions/evidence.mjs');
  const s = {
    messages: [
      { role: 'user', action: 'hint', text: 'help', code: 'draft' },
      { role: 'user', action: 'end', text: 'end', code: 'draft' },
      { role: 'user', action: 'answer', text: 'Here is my implementation', code: 'submitted' },
      { role: 'user', text: 'Can I have a hint?', code: 'legacy draft' },
      { role: 'user', text: 'End interview and review my performance.', code: 'legacy draft' },
      { role: 'user', text: 'Please review my code.', code: 'legacy submission' },
    ],
  };
  assert.equal(submittedCodeAttempts(s, { action: 'end', code: 'draft' }), 2);
  assert.equal(submittedCodeAttempts(s, { action: 'answer', code: 'new submission' }), 3);
  assert.equal(submittedCodeAttempts(s, { action: 'answer', code: '  ' }), 2);
});
