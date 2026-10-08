import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function snippet(relative, binding) {
  const markdown = await readFile(new URL(`../../examples/${relative}`, import.meta.url), 'utf8');
  const code = [...markdown.matchAll(/```js\n([\s\S]*?)```/g)]
    .map(match => match[1])
    .find(block => block.includes(`function ${binding}(`));
  assert(code, `${relative}: missing ${binding}`);
  return vm.runInNewContext(`${code}\n${binding}`);
}

test('SCC example matches mutual reachability for every three-vertex directed graph without mutation', async () => {
  const components = await snippet('dsa/11-graphs-and-shortest-paths.md', 'stronglyConnectedComponents');
  assert.equal(components(new Map()).length, 0);
  for (let mask = 0; mask < 1 << 9; mask++) {
    const graph = new Map([0, 1, 2].map(node => [node, []]));
    for (let from = 0; from < 3; from++) {
      for (let to = 0; to < 3; to++) {
        if (mask & (1 << (from * 3 + to))) graph.get(from).push(to);
      }
    }
    const before = structuredClone(graph);
    const groups = components(graph).map(group => new Set(group));
    const membership = node => groups.findIndex(group => group.has(node));
    assert.equal(groups.reduce((sum, group) => sum + group.size, 0), 3);
    assert.equal(new Set(groups.flatMap(group => [...group])).size, 3);
    const reach = start => {
      const found = new Set([start]);
      const queue = [start];
      for (let head = 0; head < queue.length; head++) {
        for (const next of graph.get(queue[head])) {
          if (!found.has(next)) {
            found.add(next);
            queue.push(next);
          }
        }
      }
      return found;
    };
    const reachable = [0, 1, 2].map(reach);
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        assert.equal(membership(a) === membership(b), reachable[a].has(b) && reachable[b].has(a), `graph ${mask}: ${a}/${b}`);
      }
    }
    assert.deepEqual(graph, before);
  }
});

test('SCC example includes neighbor-only sinks, arbitrary vertex identities and deep iterative paths', async () => {
  const components = await snippet('dsa/11-graphs-and-shortest-paths.md', 'stronglyConnectedComponents');
  const objectVertex = {};
  const graph = new Map([
    [objectVertex, [null, null]],
    [null, [objectVertex, 'sink']],
    ['isolated', []],
  ]);
  const groups = components(graph).map(group => new Set(group));
  assert(groups.some(group => group.size === 2 && group.has(objectVertex) && group.has(null)));
  assert(groups.some(group => group.size === 1 && group.has('sink')));
  assert(groups.some(group => group.size === 1 && group.has('isolated')));
  const size = 12000;
  const path = new Map(Array.from({ length: size - 1 }, (_, i) => [i, [i + 1]]));
  const result = components(path);
  assert.equal(result.length, size);
  assert(result.every(group => group.length === 1));
});

test('Compact edit distance matches the existing full-table reference and documented boundaries', async () => {
  const compact = await snippet('dsa/12-dynamic-programming.md', 'editDistanceCompact');
  const fullTable = await snippet('dsa/12-dynamic-programming.md', 'editDistance');
  const words = ['', 'a', 'b', 'aa', 'ab', 'ba', 'bb', 'aba', 'aab', 'baa', 'kitten', 'sitting'];
  for (const a of words) {
    for (const b of words) {
      assert.equal(compact(a, b), fullTable(a, b), `${a}/${b}`);
      assert.equal(compact(a, b), compact(b, a));
    }
  }
  for (const [a, b, expected] of [
    ['kitten', 'sitting', 3],
    ['😀', '', 1],
    ['😀a', '😀b', 1],
    ['😀😀', '😀', 1],
    ['é', 'e\u0301', 2],
    ['', 'aaaa', 4],
  ]) assert.equal(compact(a, b), expected);
  assert.throws(() => compact(null, 'a'), { name: 'TypeError' });
  assert.throws(() => compact('a', []), { name: 'TypeError' });
});
