export function binarySearchTrace(values, target) {
  const frames = [];
  let left = 0,
    right = values.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const found = values[mid] === target;
    frames.push({
      title: found
        ? `Target ${target} index ${mid} par mila`
        : `${values[mid]} ko ${target} se compare karo`,
      explanation: found
        ? 'Target mil gaya. Sorted order ki wajah se har comparison par bache candidates ka aadha hissa hata sake.'
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
    title: 'Target present nahi hai',
    explanation:
      'Search interval empty hai: left > right. −1 return karo. Target absent hona valid result hai, program error nahi.',
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
      title: 'Unsorted array se shuru karo',
      explanation:
        'Paas-paas ke elements compare karo. Left value badi ho toh swap karo. Har pass remaining maximum ko end tak pahunchata hai.',
      bars: values.map((value) => ({ value, status: 'idle' })),
    },
  ];
  for (let end = values.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      frames.push({
        title: `${values[j]} aur ${values[j + 1]} compare karo`,
        explanation:
          values[j] > values[j + 1]
            ? 'Wrong order. Next step mein in dono ko swap karenge.'
            : 'Order sahi hai. Agle adjacent pair par jao.',
        bars: values.map((value, i) => ({
          value,
          status: i === j || i === j + 1 ? 'active' : i > end ? 'found' : 'idle',
        })),
      });
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        swapped = true;
        frames.push({
          title: 'Adjacent pair ko swap karo',
          explanation: 'Badi value ek position right gayi. Sirf adjacent pair badla hai.',
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
    title: 'Saare elements sorted hain',
    explanation:
      'Worst/average time O(n²), early exit ke saath best O(n); extra space O(1). Animation samjhane ke liye snapshots store karti hai, isliye animation ki apni memory zyada hai.',
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
      'Queue FIFO hoti hai. Start vertex ko enqueue karte waqt visited mark karo, taaki duplicate entry na aaye.',
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
      title: `${node} visit karo aur neighbors discover karo`,
      explanation: `Unseen neighbors ko queue ke end mein add kiya. Queue: ${queue.join(', ') || 'empty'}. Enqueue par visited mark karne se cycle mein same vertex baar-baar add nahi hota.`,
      graph: true,
      active: node,
      seen: [...seen],
      queue: [...queue],
      order: [...order],
    });
  }
  frames.push({
    title: 'Traversal complete ho gaya',
    explanation:
      'BFS reachable vertices ko distance layers mein visit karta hai. Unweighted graph mein first discovery minimum edge-count distance deti hai. Adjacency list aur efficient queue ke saath O(V + E) time; yahan animation ke snapshots aur Array.shift ka extra cost alag hai.',
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
      'Base cases se shuru karo',
      'dp[0] = 0 and dp[1] = 1. Har larger answer previous two answers se banega.',
      -1,
    ),
  ];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    frames.push(
      snapshot(
        `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        'Same subproblem dobara solve mat karo. Answer store karke reuse karo. Tabulation mein jis answer par agla answer depend hai, use pehle calculate karte hain.',
        i,
      ),
    );
  }
  frames.push(
    snapshot(
      `Fibonacci(${n}) = ${dp[n]}`,
      'Is table ka time O(n), space O(n) hai. Sirf final value chahiye toh pichhli do values rakho; extra space O(1) ho sakta hai.',
      n,
    ),
  );
  return frames;
}
