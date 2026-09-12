export function binarySearchTrace(values, target) {
  const frames = [];
  let left = 0,
    right = values.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const found = values[mid] === target;
    frames.push({
      title: found ? `Found ${target} at index ${mid}` : `Compare ${values[mid]} with ${target}`,
      explanation: found
        ? 'Target mil gaya. Sorted order allowed us to discard half the remaining candidates each time.'
        : `${values[mid]} ${values[mid] < target ? '<' : '>'} ${target}. ${values[mid] < target ? 'Left half including mid discard karo; left = mid + 1.' : 'Right half including mid discard karo; right = mid − 1.'}`,
      cells: values.map((value, i) => ({
        value,
        label: `index ${i}`,
        status: i === mid ? (found ? 'found' : 'active') : i < left || i > right ? 'muted' : 'idle',
      })),
      metrics: [`left = ${left}`, `mid = ${mid}`, `right = ${right}`],
      found,
    });
    if (found) return frames;
    if (values[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  frames.push({
    title: 'Target is not present',
    explanation:
      'Search interval empty hai: left > right. Return −1. Missing values are a normal result, not an error.',
    cells: values.map((value, i) => ({ value, label: `index ${i}`, status: 'muted' })),
    metrics: [`left = ${left}`, `right = ${right}`, 'return −1'],
    found: false,
  });
  return frames;
}

export function bubbleSortTrace(input) {
  const values = [...input];
  const frames = [
    {
      title: 'Start with an unsorted array',
      explanation:
        'Adjacent elements compare karo. Agar left value badi hai, swap them. Each pass fixes the largest remaining value at the end.',
      bars: values.map((value) => ({ value, status: 'idle' })),
    },
  ];
  for (let end = values.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      frames.push({
        title: `Compare ${values[j]} and ${values[j + 1]}`,
        explanation:
          values[j] > values[j + 1]
            ? 'Wrong order. Next step mein in dono ko swap karenge.'
            : 'Already ordered. Move to the next adjacent pair.',
        bars: values.map((value, i) => ({
          value,
          status: i === j || i === j + 1 ? 'active' : i > end ? 'found' : 'idle',
        })),
      });
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        swapped = true;
        frames.push({
          title: 'Swap the adjacent pair',
          explanation:
            'The larger value moves one position to the right. Sirf adjacent pair change hua.',
          bars: values.map((value, i) => ({
            value,
            status: i === j || i === j + 1 ? 'active' : i > end ? 'found' : 'idle',
          })),
        });
      }
    }
    if (!swapped) break;
  }
  frames.push({
    title: 'Every element is in order',
    explanation:
      'Worst/average time O(n²), best O(n) with early exit; auxiliary space O(1). This animation stores snapshots for teaching, so its own memory usage is larger.',
    bars: values.map((value) => ({ value, status: 'found' })),
    result: values,
  });
  return frames;
}

export const GRAPH = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
};
export function bfsTrace(graph = GRAPH, start = 'A') {
  const queue = [start],
    seen = new Set([start]),
    order = [],
    frames = [];
  frames.push({
    title: `Enqueue ${start}`,
    explanation:
      'Queue FIFO hoti hai. Start vertex ko enqueue karte waqt visited mark karo, so duplicates cannot enter.',
    graph: true,
    seen: [...seen],
    active: start,
    queue: [...queue],
    order: [],
  });
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] || [])
      if (!seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
      }
    frames.push({
      title: `Visit ${node} and discover its neighbors`,
      explanation: `Unseen neighbors ko queue ke end mein add kiya. Queue: ${queue.join(', ') || 'empty'}. Discovery on enqueue avoids revisiting cycles.`,
      graph: true,
      active: node,
      seen: [...seen],
      queue: [...queue],
      order: [...order],
    });
  }
  frames.push({
    title: 'Traversal complete',
    explanation:
      'BFS visits reachable vertices in distance layers. For unweighted graphs, first discovery gives a shortest edge-count distance. O(V + E) time with adjacency lists and an efficient queue.',
    graph: true,
    seen: [...seen],
    order: [...order],
    queue: [],
  });
  return frames;
}

export function fibonacciTrace(n) {
  const dp = Array(n + 1).fill(null);
  dp[0] = 0;
  if (n > 0) dp[1] = 1;
  const snapshot = (title, explanation, i) => ({
    title,
    explanation,
    cells: dp.map((value, index) => ({
      value: value ?? '·',
      label: `dp[${index}]`,
      status:
        index === i
          ? 'found'
          : index === i - 1 || index === i - 2
            ? 'active'
            : value === null
              ? 'muted'
              : 'idle',
    })),
    result: dp[n],
  });
  const frames = [
    snapshot(
      'Start with the base cases',
      'dp[0] = 0 and dp[1] = 1. Har larger answer previous two answers se banega.',
      -1,
    ),
  ];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    frames.push(
      snapshot(
        `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        'Same subproblem dobara solve mat karo. Store the answer and reuse it. Tabulation fills dependencies before their dependents.',
        i,
      ),
    );
  }
  frames.push(
    snapshot(
      `Fibonacci(${n}) = ${dp[n]}`,
      'O(n) time and O(n) space for this table. Only the previous two values are needed, so a value-only solution can reduce auxiliary space to O(1).',
      n,
    ),
  );
  return frames;
}
