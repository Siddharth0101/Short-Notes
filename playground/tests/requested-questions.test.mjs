import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { interviewQuestions } from '../src/data/interviewQuestions.js';
import {
  requestedQuestions,
  answerAdditions,
  reusedChecklist,
} from '../src/data/requestedQuestions.js';
import { INTERVIEW_TOPICS, questionTopic } from '../src/data/interviewTopics.js';

const byId = new Map(interviewQuestions.map((item) => [item.id, item]));
const jsBlocks = (markdown) =>
  [...markdown.matchAll(/```(?:js|javascript)\n([\s\S]*?)\n```/g)].map((match) => match[1]);

test('Checklist additions keep stable identities, supported topics, and existing canonical answers', () => {
  const topics = new Set(INTERVIEW_TOPICS.map((item) => item.id));
  for (const item of interviewQuestions) assert(topics.has(questionTopic(item)), item.id);
  for (const item of requestedQuestions) {
    assert(item.noteId && item.sources?.length, item.id);
    assert.equal(interviewQuestions.filter((other) => other.id === item.id).length, 1);
    assert.equal((item.answer.match(/^```/gm) || []).length % 2, 0, item.id);
  }
  for (const [id, addition] of Object.entries(answerAdditions)) {
    assert(byId.has(id), id);
    assert(byId.get(id).answer.endsWith(addition), id);
    assert(!requestedQuestions.some((item) => item.id === id), id);
  }
  for (const id of Object.keys(reusedChecklist)) assert(byId.has(id), id);
});

test('JavaScript fences are syntactically valid, including the repaired escape example', () => {
  for (const item of interviewQuestions) {
    for (const code of jsBlocks(`${item.promptCode || ''}\n${item.answer}`)) {
      assert.doesNotThrow(() => new vm.Script(code), item.id);
    }
  }
});

function runExample(id) {
  const output = [];
  const context = vm.createContext({ console: { log: (...args) => output.push(args) } });
  for (const code of jsBlocks(byId.get(id).answer))
    new vm.Script(code).runInContext(context, { timeout: 1000 });
  return JSON.parse(JSON.stringify(output));
}

test('Original output examples produce the answers taught by the bank', () => {
  assert.deepEqual(runExample('iq-js-02'), [[5, 8, 2]]);
  assert.deepEqual(runExample('iq-js-03'), [[99], [12]]);
  assert.deepEqual(runExample('iq-js-16'), [[35]]);
  assert.deepEqual(runExample('iq-added-js-array-methods'), [
    [[10, 20, 30]],
    [[10, 15]],
    [30],
    [null],
  ]);
  assert.deepEqual(runExample('iq-added-js-array-check'), [['object'], [true], [false], [false]]);
  assert.deepEqual(runExample('iq-added-js-call-apply-bind'), [[25], [27], [30]]);
  assert.deepEqual(runExample('iq-added-js-escape'), [["It's time to study"], ['C:\\notes']]);
  assert.deepEqual(runExample('iq-added-dsa-prefix-count'), [[3]]);
});

async function timedTrace(code) {
  const output = [],
    jobs = [];
  let now = 0,
    serial = 0;
  const context = vm.createContext({
    console: { log: (...values) => output.push({ at: now, values }) },
    setTimeout: (callback, delay = 0) => {
      const id = ++serial;
      jobs.push({ id, at: now + delay, callback });
      return id; // browser-like numeric handle, deliberately not a promise
    },
  });
  new vm.Script(code).runInContext(context, { timeout: 1000 });
  // Let native promise jobs settle without waiting the educational timer durations.
  await new Promise(setImmediate);
  while (jobs.length) {
    jobs.sort((a, b) => a.at - b.at || a.id - b.id);
    const job = jobs.shift();
    now = job.at;
    job.callback();
    await new Promise(setImmediate);
  }
  return JSON.parse(JSON.stringify(output));
}

test('Timer puzzles distinguish handles from completion promises and use relative delays', async () => {
  const original = await timedTrace(jsBlocks(byId.get('iq-added-js-await-timers').promptCode)[0]);
  assert.deepEqual(
    original.map((x) => x.values[0]),
    ['a', 'b', 'e', 'd', 'c'],
  );
  const repaired = await timedTrace(jsBlocks(byId.get('iq-added-js-await-timers').answer)[0]);
  assert.deepEqual(
    repaired.map((x) => x.values[0]),
    ['a', 'b', 'c', 'd', 'e'],
  );
  const delayed = await timedTrace(jsBlocks(byId.get('iq-added-js-delay-output').promptCode)[0]);
  assert.deepEqual(delayed, [
    { at: 6000, values: ['second'] },
    { at: 16000, values: ['first'] },
  ]);
  const loop = await timedTrace(jsBlocks(byId.get('iq-added-js-loop-output').promptCode)[0]);
  assert.deepEqual(
    loop.map((x) => x.values[0]),
    [0, 1, 2, 3, 4, 5],
  );
});
