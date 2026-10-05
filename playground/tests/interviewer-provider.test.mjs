import test from 'node:test';
import assert from 'node:assert/strict';
import { interactionHistory, geminiGenerate } from '../../server/providers/gemini.mjs';
import { loadContent, subjects } from '../../server/knowledge/repository.mjs';

test('provider replays exact signed steps and associates tool results with their call IDs', () => {
  const steps = [
    { type: 'thought', signature: 'signed-thought', summary: [] },
    {
      type: 'function_call',
      id: 'call-1',
      name: 'search_notes',
      arguments: { query: 'scope' },
      signature: 'signed-call',
    },
  ];
  const result = interactionHistory([
    { role: 'user', parts: [{ text: 'Explain scope' }] },
    { role: 'model', parts: [{ functionCall: { name: 'search_notes' } }], providerSteps: steps },
    {
      role: 'user',
      parts: [
        {
          functionResponse: {
            id: 'call-1',
            name: 'search_notes',
            response: { result: [{ id: 'js-scope' }] },
          },
        },
      ],
    },
  ]);
  assert.equal(result[0].type, 'user_input');
  assert.deepEqual(result.slice(1, 3), steps);
  assert.equal(result[3].call_id, 'call-1');
  assert.equal(result[3].type, 'function_result');
});

test('interactions adapter sends stateless scoped tools and returns calls without losing signatures', async (t) => {
  const old = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'fake-test-key';
  t.after(() => {
    if (old === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = old;
  });
  const steps = [
    {
      type: 'function_call',
      id: 'finish',
      name: 'respond',
      arguments: { message: 'Hello', speech: 'Hello' },
      signature: 'keep-me',
    },
  ];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.tools.length, 1);
    assert.equal(body.tools[0].parameters.type, 'object');
    assert.equal(body.tools[0].parameters.properties.message.type, 'string');
    assert.deepEqual(body.generation_config.tool_choice.allowed_tools.tools, ['respond']);
    return { ok: true, status: 200, json: async () => ({ steps }) };
  });
  const response = await geminiGenerate({
    system: 'interview',
    contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
    forceRespond: true,
    tools: [
      {
        name: 'respond',
        description: 'Respond',
        parameters: { type: 'OBJECT', properties: { message: { type: 'STRING' } } },
      },
    ],
  });
  assert.equal(response.parts[0].functionCall.id, 'finish');
  assert.deepEqual(response.providerSteps, steps);
});

test('every selectable subject has notes and a coding task with an existing owning chapter', async () => {
  const content = await loadContent();
  for (const subject of subjects) {
    assert.ok(content.notes.some((n) => n.track === subject.id));
    const tasks = content.questions.filter(
      (q) => q.track === subject.id && q.tags?.includes('machine-coding'),
    );
    assert.ok(tasks.length, `No coding task for ${subject.id}`);
    assert.ok(
      tasks.some((q) => content.notes.some((n) => n.id === q.noteId && n.track === subject.id)),
      `No linked task for ${subject.id}`,
    );
  }
});
