import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function example(relative, binding) {
  const markdown = await readFile(new URL(`../../examples/${relative}`, import.meta.url), 'utf8');
  const code = markdown.match(/```js\n([\s\S]*?)```/)?.[1];
  assert(code, relative);
  return vm.runInNewContext(`${code}\n${binding}`, { console: { log() {} } });
}

test('Greedy chapter example matches exhaustive compatible subsets and preserves input', async () => {
  const select = await example('dsa/13-greedy-intervals.md', 'selectMeetings');
  const universe = [
    [-2, 0],
    [0, 1],
    [0, 3],
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 4],
  ];
  for (let mask = 0; mask < 1 << universe.length; mask++) {
    const input = universe.filter((_, i) => mask & (1 << i)).map((x) => [...x]);
    const before = structuredClone(input);
    let optimal = 0;
    for (let subset = 0; subset < 1 << input.length; subset++) {
      const chosen = input.filter((_, i) => subset & (1 << i)).sort((a, b) => a[0] - b[0]);
      if (chosen.every((x, i) => !i || chosen[i - 1][1] <= x[0]))
        optimal = Math.max(optimal, chosen.length);
    }
    const result = select(input);
    assert.equal(result.length, optimal);
    assert(result.every((x, i) => !i || result[i - 1][1] <= x[0]));
    assert.deepEqual(input, before);
  }
  assert.throws(() => select([[2, 2]]), { name: 'RangeError' });
});

test('Fenwick chapter example matches direct sums after point updates and at boundaries', async () => {
  const Fenwick = await example('dsa/14-tries-range-bits.md', 'Fenwick');
  assert.equal(new Fenwick(0).prefix(0), 0);
  for (const size of [1, 2, 7, 16]) {
    const direct = Array(size).fill(0);
    const tree = new Fenwick(size);
    for (let step = 0; step < 30; step++) {
      const index = (step * 7) % size;
      const delta = (step % 9) - 4;
      direct[index] += delta;
      tree.add(index, delta);
      for (let left = 0; left <= size; left++) {
        for (let right = left; right <= size; right++) {
          assert.equal(
            tree.prefix(right) - tree.prefix(left),
            direct.slice(left, right).reduce((a, b) => a + b, 0),
          );
        }
      }
    }
    assert.throws(() => tree.add(-1, 1), { name: 'RangeError' });
    assert.throws(() => tree.prefix(size + 1), { name: 'RangeError' });
  }
});

test('Token bucket example respects burst/refill bounds, rejection state and clock contract', async () => {
  const consume = await example('system-design/13-consistency-limits.md', 'consume');
  let state = { tokens: 2, at: 0 };
  const outcomes = [];
  for (const now of [0, 0, 0, 500, 1000]) {
    const result = consume(state, now, 2, 1);
    state = result.bucket;
    outcomes.push(result.allowed);
  }
  assert.deepEqual(outcomes, [true, true, false, false, true]);
  assert.equal(consume({ tokens: 0, at: 0 }, 500, 2, 1).retryMs, 500);
  assert.equal(consume({ tokens: 0, at: 0 }, 100000, 2, 1).bucket.tokens, 1);
  assert.throws(() => consume(state, 999, 2, 1), { name: 'RangeError' });
  assert.throws(() => consume(state, 1000, 2, 1, 3), { name: 'RangeError' });
  state = { tokens: 3, at: 0 };
  let admitted = 0;
  for (let now = 0; now <= 10000; now += 100) {
    const result = consume(state, now, 3, 2);
    state = result.bucket;
    admitted += Number(result.allowed);
    assert(state.tokens >= 0 && state.tokens <= 3);
    assert(admitted <= 3 + (2 * now) / 1000);
  }
});

test('Browser preference example normalizes known versions and rejects malformed/future data', async () => {
  const decode = await example('javascript/19-browser-persistence.md', 'decodePreferences');
  const normalize = (raw) => JSON.parse(JSON.stringify(decode(raw)));
  const fallback = { version: 2, theme: 'system', completed: [] };
  for (const raw of [null, '', '{', 'null', '[]', '12', '{"version":999,"completed":["keep"]}']) {
    assert.deepEqual(normalize(raw), fallback);
  }
  assert.deepEqual(normalize('{"version":1,"theme":"dark","completed":["a","a",3,"","b"]}'), {
    version: 2,
    theme: 'dark',
    completed: ['a', 'b'],
  });
  assert.deepEqual(normalize('{"version":2,"theme":"bad","completed":{}}'), fallback);
});

async function sourceLoader() {
  const source = await readFile(
    new URL(
      '../../06_System_Design/04_BACKEND_FOR_FRONTEND/02_API_Paradigms_REST_GraphQL_gRPC.js',
      import.meta.url,
    ),
    'utf8',
  );
  return vm.runInNewContext(`${source}\nSimpleDataLoader`, { console: { log() {} } });
}

test('Source batch loader preserves duplicate key positions and separates overlapping async batches', async () => {
  const Loader = await sourceLoader();
  const calls = [];
  let finishFirst;
  const loader = new Loader((keys) => {
    calls.push([...keys]);
    if (calls.length === 1)
      return new Promise((resolve) => {
        finishFirst = resolve;
      });
    return keys.map((key) => `teacher-${key}`);
  });
  const first = Promise.all([loader.load(7), loader.load(2), loader.load(7)]);
  await Promise.resolve();
  const second = loader.load(9);
  assert.equal(await second, 'teacher-9');
  finishFirst(['teacher-7', 'teacher-2', 'teacher-7']);
  assert.deepEqual(await first, ['teacher-7', 'teacher-2', 'teacher-7']);
  assert.deepEqual(calls, [[7, 2, 7], [9]]);
});

test('Source batch loader settles every caller on thrown, rejected and malformed batches', async () => {
  const Loader = await sourceLoader();
  for (const failing of [
    () => {
      throw new Error('sync failure');
    },
    async () => {
      throw new Error('async failure');
    },
    () => [],
    () => ({ 0: 'not-an-array' }),
  ]) {
    let fail = true;
    const loader = new Loader((keys) => (fail ? failing() : keys));
    const results = await Promise.allSettled([loader.load(1), loader.load(2)]);
    assert.deepEqual(
      results.map((result) => result.status),
      ['rejected', 'rejected'],
    );
    assert(results.every((result) => typeof result.reason?.message === 'string'));
    fail = false;
    assert.equal(await loader.load(3), 3);
  }
});

test('Permutation window matches a Unicode code-point brute-force oracle', async () => {
  const markdown = await readFile(new URL('../../examples/dsa/04-problem-solving-patterns.md', import.meta.url), 'utf8');
  const code = [...markdown.matchAll(/```js\n([\s\S]*?)```/g)].map(x => x[1]).find(x => x.includes('function containsPermutation'));
  const contains = vm.runInNewContext(`${code}\ncontainsPermutation`);
  const words = [''];
  for (let length = 1; length <= 3; length++) {
    for (const prefix of words.filter(x => Array.from(x).length === length - 1)) {
      for (const ch of ['a', '😀', '\u0301']) words.push(prefix + ch);
    }
  }
  for (const text of words) for (const pattern of words) {
    const chars = Array.from(text);
    const wanted = Array.from(pattern).sort().join('');
    const size = Array.from(pattern).length;
    let expected = size === 0;
    for (let i = 0; i + size <= chars.length; i++) {
      if (chars.slice(i, i + size).sort().join('') === wanted) expected = true;
    }
    assert.equal(contains(text, pattern), expected, JSON.stringify({ text, pattern }));
  }
});

test('New JS walkthroughs produce the documented state and scheduling traces', async () => {
  const cases = [
    ['01-js-variables.md', [[7, 4]]],
    ['03-js-conditionals.md', [[['retry', 'pass', 'pass', 'distinction', 'invalid']]]],
    ['05-js-functions.md', [[35]]],
    ['06-js-arrays-objects.md', [['Asha', 3, true]]],
    ['09-scope-closures.md', [[1, 'Count: 0']]],
    ['13-this-prototypes-classes.md', [[5], [9], [5]]],
    ['15-async-event-loop.md', [['executor'], ['sync-end'], ['reaction', 7]]],
  ];
  for (const [file, expected] of cases) {
    const markdown = await readFile(new URL(`../../examples/javascript/${file}`, import.meta.url), 'utf8');
    const section = markdown.split('## Depth walkthrough — andar kya ho raha hai?')[1];
    const code = section.match(/```js\n([\s\S]*?)```/)?.[1];
    assert(code, file);
    const output = [];
    vm.runInNewContext(code, { console: { log: (...values) => output.push(values) } });
    await Promise.resolve();
    assert.deepEqual(JSON.parse(JSON.stringify(output)), expected, file);
  }
});

test('Actual mapLimit example bounds active jobs and preserves duplicate positions through failures', { timeout: 2000 }, async () => {
  const markdown = await readFile(new URL('../../examples/javascript/16-async-patterns.md', import.meta.url), 'utf8');
  const code = markdown.match(/```javascript\n([\s\S]*?)```/)[1];
  const mapLimit = vm.runInNewContext(`${code}\nmapLimit`);
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
  };
  const gates = [deferred(), deferred(), deferred()];
  const thirdStarted = deferred();
  const started = [];
  let active = 0, maximum = 0;
  const resultPromise = mapLimit(['same', 'same', 'reject', 'throw'], 2, (value, index) => {
    started.push(index);
    active++;
    maximum = Math.max(maximum, active);
    if (index === 3) { active--; throw new Error('sync'); }
    if (index === 2) thirdStarted.resolve();
    return gates[index].promise.finally(() => active--);
  });
  assert.deepEqual(started, [0, 1]);
  gates[1].resolve('second');
  await thirdStarted.promise;
  assert.deepEqual(started, [0, 1, 2]);
  gates[2].reject(new Error('async'));
  gates[0].resolve('first');
  const result = await resultPromise;
  assert.equal(maximum, 2);
  assert.equal(active, 0);
  assert.deepEqual(Array.from(result, x => x.status), ['fulfilled', 'fulfilled', 'rejected', 'rejected']);
  assert.equal(result[0].value, 'first');
  assert.equal(result[1].value, 'second');
  assert.equal(result[2].reason.message, 'async');
  assert.equal(result[3].reason.message, 'sync');
  assert.equal((await mapLimit([], 2, () => assert.fail('empty mapper'))).length, 0);
  await assert.rejects(mapLimit([1], 0, x => x), { name: 'RangeError' });
});
