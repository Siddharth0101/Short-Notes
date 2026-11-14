// Step explanations exist in both notebook languages; Hinglish is the default.
const say = (lang, hinglish, english) => (lang === 'en' ? english : hinglish);

export function binarySearchTrace(values, target, lang) {
  const frames = [];
  let left = 0,
    right = values.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const found = values[mid] === target;
    frames.push({
      title: found
        ? say(
            lang,
            `Target ${target} index ${mid} par mila`,
            `Found target ${target} at index ${mid}`,
          )
        : say(
            lang,
            `${values[mid]} ko ${target} se compare karo`,
            `Compare ${values[mid]} with ${target}`,
          ),
      explanation: found
        ? say(
            lang,
            'Target mil gaya. Sorted order ki wajah se har comparison par bache candidates ka aadha hissa hata sake.',
            'Target found. Because the input is sorted, each comparison could discard half of the remaining candidates.',
          )
        : `${values[mid]} ${values[mid] < target ? '<' : '>'} ${target}. ${
            values[mid] < target
              ? say(
                  lang,
                  'Left half including mid discard karo; left = mid + 1.',
                  'Discard the left half including mid; left = mid + 1.',
                )
              : say(
                  lang,
                  'Right half including mid discard karo; right = mid − 1.',
                  'Discard the right half including mid; right = mid − 1.',
                )
          }`,
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
    title: say(lang, 'Target present nahi hai', 'The target is not present'),
    explanation: say(
      lang,
      'Search interval empty hai: left > right. −1 return karo. Target absent hona valid result hai, program error nahi.',
      'The search interval is empty: left > right. Return −1. A missing target is a valid result, not a program error.',
    ),
    cells: values.map((value, i) => ({ value, label: `index ${i}`, status: 'muted' })),
    metrics: [`left = ${left}`, `right = ${right}`, 'return −1'],
    found: false,
  });
  return frames;
}

export function bubbleSortTrace(input, lang) {
  const values = [...input];
  const frames = [
    {
      title: say(lang, 'Unsorted array se shuru karo', 'Start with the unsorted array'),
      explanation: say(
        lang,
        'Paas-paas ke elements compare karo. Left value badi ho toh swap karo. Har pass remaining maximum ko end tak pahunchata hai.',
        'Compare neighbouring elements. Swap when the left value is larger. Each pass carries the remaining maximum to the end.',
      ),
      bars: values.map((value) => ({ value, status: 'idle' })),
    },
  ];
  for (let end = values.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      frames.push({
        title: say(
          lang,
          `${values[j]} aur ${values[j + 1]} compare karo`,
          `Compare ${values[j]} and ${values[j + 1]}`,
        ),
        explanation:
          values[j] > values[j + 1]
            ? say(
                lang,
                'Wrong order. Next step mein in dono ko swap karenge.',
                'Wrong order. The next step swaps these two.',
              )
            : say(
                lang,
                'Order sahi hai. Agle adjacent pair par jao.',
                'The order is correct. Move to the next adjacent pair.',
              ),
        bars: values.map((value, i) => ({
          value,
          status: i === j || i === j + 1 ? 'active' : i > end ? 'found' : 'idle',
        })),
      });
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        swapped = true;
        frames.push({
          title: say(lang, 'Adjacent pair ko swap karo', 'Swap the adjacent pair'),
          explanation: say(
            lang,
            'Badi value ek position right gayi. Sirf adjacent pair badla hai.',
            'The larger value moved one position right. Only the adjacent pair changed.',
          ),
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
    title: say(lang, 'Saare elements sorted hain', 'Every element is sorted'),
    explanation: say(
      lang,
      'Worst/average time O(n²), early exit ke saath best O(n); extra space O(1). Animation samjhane ke liye snapshots store karti hai, isliye animation ki apni memory zyada hai.',
      'Worst and average time are O(n²); with the early exit the best case is O(n); extra space is O(1). The animation stores snapshots for teaching, so its own memory use is higher.',
    ),
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
export function bfsTrace(graph = GRAPH, start = 'A', lang) {
  const queue = [start],
    seen = new Set([start]),
    order = [],
    frames = [];
  frames.push({
    title: `Enqueue ${start}`,
    explanation: say(
      lang,
      'Queue FIFO hoti hai. Start vertex ko enqueue karte waqt visited mark karo, taaki duplicate entry na aaye.',
      'A queue is FIFO. Mark the start vertex visited as you enqueue it, so it can never be added twice.',
    ),
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
      title: say(
        lang,
        `${node} visit karo aur neighbors discover karo`,
        `Visit ${node} and discover its neighbours`,
      ),
      explanation: say(
        lang,
        `Unseen neighbors ko queue ke end mein add kiya. Queue: ${queue.join(', ') || 'empty'}. Enqueue par visited mark karne se cycle mein same vertex baar-baar add nahi hota.`,
        `Unseen neighbours joined the back of the queue. Queue: ${queue.join(', ') || 'empty'}. Marking visited at enqueue time stops a cycle from adding the same vertex again and again.`,
      ),
      graph: true,
      active: node,
      seen: [...seen],
      queue: [...queue],
      order: [...order],
    });
  }
  frames.push({
    title: say(lang, 'Traversal complete ho gaya', 'The traversal is complete'),
    explanation: say(
      lang,
      'BFS reachable vertices ko distance layers mein visit karta hai. Unweighted graph mein first discovery minimum edge-count distance deti hai. Adjacency list aur efficient queue ke saath O(V + E) time; yahan animation ke snapshots aur Array.shift ka extra cost alag hai.',
      'BFS visits reachable vertices in layers of distance. In an unweighted graph, the first discovery gives the minimum edge-count distance. With an adjacency list and an efficient queue the time is O(V + E); the snapshots and Array.shift in this animation cost extra.',
    ),
    graph: true,
    seen: [...seen],
    order: [...order],
    queue: [],
  });
  return frames;
}

export function fibonacciTrace(n, lang) {
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
      say(lang, 'Base cases se shuru karo', 'Start from the base cases'),
      say(
        lang,
        'dp[0] = 0 and dp[1] = 1. Har larger answer previous two answers se banega.',
        'dp[0] = 0 and dp[1] = 1. Every larger answer is built from the previous two.',
      ),
      -1,
    ),
  ];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    frames.push(
      snapshot(
        `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        say(
          lang,
          'Same subproblem dobara solve mat karo. Answer store karke reuse karo. Tabulation mein jis answer par agla answer depend hai, use pehle calculate karte hain.',
          'Never solve the same subproblem twice. Store the answer and reuse it. In tabulation, an answer is computed before anything that depends on it.',
        ),
        i,
      ),
    );
  }
  frames.push(
    snapshot(
      `Fibonacci(${n}) = ${dp[n]}`,
      say(
        lang,
        'Is table ka time O(n), space O(n) hai. Sirf final value chahiye toh pichhli do values rakho; extra space O(1) ho sakta hai.',
        'This table takes O(n) time and O(n) space. If you only need the final value, keep just the previous two; extra space can drop to O(1).',
      ),
      n,
    ),
  );
  return frames;
}
