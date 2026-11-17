// Second set of visual-lab topics. Algorithm traces are computed (so they stay correct for any
// input); concept walkthroughs are fixed frames. English frame text lives in visuals.en.js.
import { GRAPH } from '../lib/traces.js';

const lane = (name, items) => ({ name, items });
const frame = (title, explanation, lanes) => ({ title, explanation, lanes });
const say = (lang, hinglish, english) => (lang === 'en' ? english : hinglish);

export function twoPointersTrace(values, target, lang) {
  const frames = [];
  let left = 0;
  let right = values.length - 1;
  const snapshot = (title, explanation, status) =>
    frames.push({
      title,
      explanation,
      cells: values.map((value, i) => ({
        value,
        label: i === left && i === right ? 'L · R' : i === left ? 'L' : i === right ? 'R' : `i${i}`,
        status: status(i),
      })),
      metrics: [`L = ${left}`, `R = ${right}`, `target = ${target}`],
    });
  const pointers = (i) =>
    i === left || i === right ? 'active' : i < left || i > right ? 'muted' : 'idle';
  snapshot(
    say(lang, 'Dono ends se shuru karo', 'Start from both ends'),
    say(
      lang,
      `Array sorted hai. L sabse chhoti value par hai, R sabse badi par. Target sum ${target} hai.`,
      `The array is sorted. L sits on the smallest value and R on the largest. The target sum is ${target}.`,
    ),
    pointers,
  );
  while (left < right) {
    const sum = values[left] + values[right];
    if (sum === target) {
      snapshot(
        `${values[left]} + ${values[right]} = ${target}`,
        say(
          lang,
          'Pair mil gaya. Har step par ek hi pointer hila, isliye total kaam O(n) aur extra space O(1) hai.',
          'Pair found. Only one pointer moved per step, so the total work is O(n) with O(1) extra space.',
        ),
        (i) => (i === left || i === right ? 'found' : 'muted'),
      );
      return frames;
    }
    const small = sum < target;
    snapshot(
      `${values[left]} + ${values[right]} = ${sum}`,
      small
        ? say(
            lang,
            `${sum} < ${target}: sum chhota hai. Sirf L ko aage badhane se sum badh sakta hai, isliye L++.`,
            `${sum} < ${target}: the sum is too small. Only moving L right can raise it, so L++.`,
          )
        : say(
            lang,
            `${sum} > ${target}: sum bada hai. Sirf R ko peeche laane se sum ghat sakta hai, isliye R--.`,
            `${sum} > ${target}: the sum is too large. Only moving R left can lower it, so R--.`,
          ),
      pointers,
    );
    if (small) left++;
    else right--;
  }
  snapshot(
    say(lang, 'Koi pair nahi mila', 'No pair exists'),
    say(
      lang,
      'L aur R mil gaye: har candidate reject ho chuka. Input unsorted ho toh pehle sort karo ya hash set use karo.',
      'L and R met: every candidate has been ruled out. For unsorted input, sort first or use a hash set.',
    ),
    () => 'muted',
  );
  return frames;
}

export function slidingWindowTrace(values, k, lang) {
  const frames = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += values[i];
  let best = sum;
  let bestStart = 0;
  const snapshot = (start, title, explanation, done = false) =>
    frames.push({
      title,
      explanation,
      cells: values.map((value, i) => ({
        value,
        label: `i${i}`,
        status: done
          ? i >= bestStart && i < bestStart + k
            ? 'found'
            : 'muted'
          : i >= start && i < start + k
            ? 'active'
            : 'idle',
      })),
      metrics: [`window sum = ${sum}`, `best = ${best}`, `k = ${k}`],
      result: best,
    });
  snapshot(
    0,
    say(lang, `Pehli window ka sum ${sum}`, `The first window sums to ${sum}`),
    say(
      lang,
      `Pehle ${k} elements ek baar add karo. Abhi tak yahi best hai.`,
      `Add the first ${k} elements once. That is the best so far.`,
    ),
  );
  for (let start = 1; start + k <= values.length; start++) {
    const leaving = values[start - 1];
    const entering = values[start + k - 1];
    sum += entering - leaving;
    const improved = sum > best;
    if (improved) {
      best = sum;
      bestStart = start;
    }
    snapshot(
      start,
      `− ${leaving} + ${entering} → ${sum}`,
      improved
        ? say(
            lang,
            'Window ek step slide hui: bahar jaane wala element ghatao, andar aane wala jodo. Naya best mila.',
            'The window slid one step: subtract the element that left, add the one that entered. A new best.',
          )
        : say(
            lang,
            'Window slide hui. Poora sum dobara nahi nikala — sirf do values badli. Best wahi hai.',
            'The window slid. The whole sum was not recomputed — only two values changed. The best is unchanged.',
          ),
    );
  }
  snapshot(
    bestStart,
    say(lang, `Best window ka sum ${best}`, `The best window sums to ${best}`),
    say(
      lang,
      'Har element ek baar andar aaya aur ek baar bahar gaya: time O(n), extra space O(1). Har window ko dobara jodne wala brute force O(n·k) leta.',
      'Every element entered once and left once: O(n) time, O(1) extra space. Brute force that re-adds each window would take O(n·k).',
    ),
    true,
  );
  return frames;
}

export function dfsTrace(graph = GRAPH, start = 'A', lang) {
  const seen = new Set();
  const order = [];
  const stack = [];
  const frames = [];
  const snapshot = (title, explanation, active) =>
    frames.push({
      title,
      explanation,
      graph: true,
      active,
      seen: [...seen],
      queue: [...stack],
      order: [...order],
      listLabel: say(lang, 'CALL STACK · NEECHE → UPAR', 'CALL STACK · BOTTOM → TOP'),
    });
  function visit(node) {
    seen.add(node);
    order.push(node);
    stack.push(node);
    snapshot(
      say(lang, `${node} visit karo`, `Visit ${node}`),
      say(
        lang,
        `${node} ko visited mark kiya aur call stack par rakha. Ab iske pehle unvisited neighbor mein gehre jao.`,
        `Mark ${node} visited and push it on the call stack. Now go deeper into its first unvisited neighbour.`,
      ),
      node,
    );
    for (const next of graph[node] || []) if (!seen.has(next)) visit(next);
    stack.pop();
    if (stack.length)
      snapshot(
        say(
          lang,
          `${node} se wapas ${stack.at(-1)} par`,
          `Backtrack from ${node} to ${stack.at(-1)}`,
        ),
        say(
          lang,
          `${node} ke saare neighbors visited hain. Call return hoti hai aur ${stack.at(-1)} apna agla neighbor check karta hai.`,
          `Every neighbour of ${node} is visited. The call returns and ${stack.at(-1)} checks its next neighbour.`,
        ),
        stack.at(-1),
      );
  }
  visit(start);
  snapshot(
    say(lang, 'Traversal complete ho gaya', 'The traversal is complete'),
    say(
      lang,
      'DFS ek raaste par jitna gehra ja sake jaata hai, phir backtrack karta hai. Time O(V + E). Recursion depth lambe path jitni ho sakti hai — bahut gehre graph par explicit stack use karo. DFS shortest path ki guarantee nahi deta.',
      'DFS goes as deep as it can along one path, then backtracks. Time is O(V + E). Recursion depth can equal the longest path — use an explicit stack for very deep graphs. DFS does not guarantee a shortest path.',
    ),
    null,
  );
  return frames;
}

// A small binary search tree: [left, right] children by value.
const TREE = {
  8: [3, 10],
  3: [1, 6],
  10: [null, 14],
  1: [null, null],
  6: [4, 7],
  14: [13, null],
  4: [null, null],
  7: [null, null],
  13: [null, null],
};
const TREE_LAYOUT = {
  points: {
    8: [180, 36],
    3: [95, 100],
    10: [265, 100],
    1: [45, 164],
    6: [145, 164],
    14: [315, 164],
    4: [110, 232],
    7: [180, 232],
    13: [280, 232],
  },
  edges: [
    ['8', '3'],
    ['8', '10'],
    ['3', '1'],
    ['3', '6'],
    ['10', '14'],
    ['6', '4'],
    ['6', '7'],
    ['14', '13'],
  ],
};

export function inorderTrace(lang) {
  const frames = [];
  const stack = [];
  const order = [];
  const snapshot = (title, explanation, active) =>
    frames.push({
      title,
      explanation,
      graph: TREE_LAYOUT,
      active: active == null ? null : String(active),
      seen: order.map(String),
      queue: stack.map(String),
      order: order.map(String),
      listLabel: say(lang, 'STACK · NEECHE → UPAR', 'STACK · BOTTOM → TOP'),
      orderLabel: 'INORDER OUTPUT',
      result: [...order],
    });
  let current = 8;
  while (current != null || stack.length) {
    if (current != null) {
      const pushed = [];
      while (current != null) {
        stack.push(current);
        pushed.push(current);
        current = TREE[current][0];
      }
      snapshot(
        say(
          lang,
          `Left jaate raho: ${pushed.join(', ')} push`,
          `Keep going left: push ${pushed.join(', ')}`,
        ),
        say(
          lang,
          'Inorder mein pehle poora left subtree aata hai. Isliye raaste ke har node ko stack par rakhkar left child par jao.',
          'Inorder handles the whole left subtree first. So push each node on the way and move to its left child.',
        ),
        pushed.at(-1),
      );
    }
    const node = stack.pop();
    order.push(node);
    snapshot(
      say(lang, `${node} visit karo`, `Visit ${node}`),
      say(
        lang,
        `${node} ka left subtree ho chuka. Ab node khud, phir uska right subtree. Output: ${order.join(', ')}.`,
        `The left subtree of ${node} is done. Now the node itself, then its right subtree. Output: ${order.join(', ')}.`,
      ),
      node,
    );
    current = TREE[node][1];
  }
  snapshot(
    say(lang, 'Inorder output sorted hai', 'The inorder output is sorted'),
    say(
      lang,
      'BST ka inorder traversal values ko ascending order mein deta hai. Har node ek baar push aur ek baar pop hua: time O(n), stack space O(h), jahan h tree ki height hai.',
      'An inorder traversal of a BST yields the values in ascending order. Every node is pushed once and popped once: O(n) time and O(h) stack space, where h is the height of the tree.',
    ),
    null,
  );
  return frames;
}

export function reverseListTrace(values, lang) {
  const frames = [];
  let reversed = [];
  let remaining = [...values];
  const chain = (list) => (list.length ? `${list.join(' → ')} → null` : 'null');
  const snapshot = (title, explanation) =>
    frames.push({
      title,
      explanation,
      lanes: [
        lane(say(lang, 'Reversed hissa · prev se shuru', 'Reversed part · starts at prev'), [
          chain(reversed),
        ]),
        lane(say(lang, 'Bacha hua hissa · curr se shuru', 'Remaining part · starts at curr'), [
          chain(remaining),
        ]),
      ],
      metrics: [
        `prev = ${reversed[0] ?? 'null'}`,
        `curr = ${remaining[0] ?? 'null'}`,
        `next = ${remaining[1] ?? 'null'}`,
      ],
      result: [...reversed],
    });
  snapshot(
    say(lang, 'Teen pointers se shuru karo', 'Start with three pointers'),
    say(
      lang,
      'prev = null, curr = head. Har step mein sirf ek link ki direction badlegi.',
      'prev = null and curr = head. Each step flips the direction of exactly one link.',
    ),
  );
  while (remaining.length) {
    const node = remaining[0];
    const next = remaining[1] ?? 'null';
    remaining = remaining.slice(1);
    reversed = [node, ...reversed];
    snapshot(
      say(lang, `${node}.next ko peeche ghumao`, `Point ${node}.next backwards`),
      say(
        lang,
        `Pehle next = ${next} save kiya, warna baaki list kho jaati. Phir ${node}.next = prev. Ab prev = ${node} aur curr = ${next}.`,
        `First save next = ${next}, or the rest of the list would be lost. Then set ${node}.next = prev. Now prev = ${node} and curr = ${next}.`,
      ),
    );
  }
  snapshot(
    say(lang, 'prev naya head hai', 'prev is the new head'),
    say(
      lang,
      'curr null ho gaya, loop khatam. prev reversed list ka head hai. Time O(n), extra space O(1); recursive version call stack ki wajah se O(n) space leta hai.',
      'curr became null, so the loop ends. prev is the head of the reversed list. Time O(n), extra space O(1); the recursive version uses O(n) space for the call stack.',
    ),
  );
  return frames;
}

export function heapInsertTrace(heap, value, lang) {
  const items = [...heap, value];
  const frames = [];
  let index = items.length - 1;
  const parentOf = (i) => Math.floor((i - 1) / 2);
  const snapshot = (title, explanation, done = false) => {
    const parent = index > 0 ? parentOf(index) : -1;
    frames.push({
      title,
      explanation,
      cells: items.map((item, i) => ({
        value: item,
        label: `i${i}`,
        status:
          i === index ? (done ? 'found' : 'active') : !done && i === parent ? 'active' : 'idle',
      })),
      metrics: [`i = ${index}`, `parent = ${parent >= 0 ? parent : '—'}`],
      result: [...items],
    });
  };
  snapshot(
    say(lang, `${value} ko end mein add karo`, `Append ${value} at the end`),
    say(
      lang,
      'Heap ek complete binary tree hai jo array mein rakha jaata hai. Naya element last index par jaata hai taaki shape complete rahe. Parent ka index floor((i − 1) / 2) hai.',
      'A heap is a complete binary tree stored in an array. The new element goes to the last index so the shape stays complete. The parent index is floor((i − 1) / 2).',
    ),
  );
  while (index > 0) {
    const parent = parentOf(index);
    if (items[parent] <= items[index]) {
      snapshot(
        `${items[parent]} ≤ ${items[index]}`,
        say(
          lang,
          'Parent chhota ya barabar hai: min-heap property theek hai. Sift-up yahin rukta hai.',
          'The parent is smaller or equal: the min-heap property holds. Sift-up stops here.',
        ),
      );
      break;
    }
    const title = say(
      lang,
      `${items[parent]} > ${items[index]}: swap karo`,
      `${items[parent]} > ${items[index]}: swap`,
    );
    [items[parent], items[index]] = [items[index], items[parent]];
    index = parent;
    snapshot(
      title,
      say(
        lang,
        'Child apne parent se chhota tha, isliye dono swap hue. Ab naye parent se compare karo.',
        'The child was smaller than its parent, so they swapped. Now compare with the new parent.',
      ),
    );
  }
  snapshot(
    say(lang, 'Heap property wapas theek hai', 'The heap property is restored'),
    say(
      lang,
      `${value} index ${index} par ruk gaya. Insert zyada se zyada tree ki height jitne swaps karta hai: O(log n). Root (index 0) hamesha minimum hota hai.`,
      `${value} settled at index ${index}. An insert makes at most height-many swaps: O(log n). The root (index 0) is always the minimum.`,
    ),
    true,
  );
  return frames;
}

export function hashChainTrace(keys, size, lookup, lang) {
  const buckets = Array.from({ length: size }, () => []);
  const frames = [];
  let entries = 0;
  const snapshot = (title, explanation, active = -1) =>
    frames.push({
      title,
      explanation,
      lanes: buckets.map((items, i) =>
        lane(`bucket ${i}${i === active ? ' ◀' : ''}`, items.map(String)),
      ),
      metrics: [
        `buckets = ${size}`,
        `entries = ${entries}`,
        `load factor = ${(entries / size).toFixed(1)}`,
      ],
      result: buckets.map((items) => [...items]),
    });
  snapshot(
    say(lang, 'Khaali table', 'An empty table'),
    say(
      lang,
      `Table mein ${size} buckets hain. Hash function: h(key) = key % ${size}. Yeh sirf samjhane ke liye simple hash hai.`,
      `The table has ${size} buckets. Hash function: h(key) = key % ${size}. It is a deliberately simple teaching hash.`,
    ),
  );
  for (const key of keys) {
    const bucket = key % size;
    const collision = buckets[bucket].length > 0;
    buckets[bucket].push(key);
    entries++;
    snapshot(
      `insert ${key}: ${key} % ${size} = ${bucket}`,
      collision
        ? say(
            lang,
            `Bucket ${bucket} pehle se bhara tha: collision. Separate chaining mein key usi bucket ki list mein jud jaati hai.`,
            `Bucket ${bucket} was already occupied: a collision. With separate chaining the key joins that bucket's list.`,
          )
        : say(
            lang,
            `Bucket ${bucket} khaali tha. Key seedha wahin gayi — yahi O(1) average case hai.`,
            `Bucket ${bucket} was empty. The key went straight in — this is the O(1) average case.`,
          ),
      bucket,
    );
  }
  const bucket = lookup % size;
  const position = buckets[bucket].indexOf(lookup);
  snapshot(
    `lookup ${lookup}: bucket ${bucket}`,
    position >= 0
      ? say(
          lang,
          `Hash seedha bucket ${bucket} par le gaya. Chain mein ${position + 1} comparison ke baad key mili. Chain jitni lambi, lookup utna slow.`,
          `The hash led straight to bucket ${bucket}. The key was found after ${position + 1} comparison(s) in the chain. The longer the chain, the slower the lookup.`,
        )
      : say(
          lang,
          `Bucket ${bucket} ki poori chain dekhi, key nahi mili. Absent key ke liye poori chain scan hoti hai.`,
          `The whole chain in bucket ${bucket} was scanned and the key is absent. A missing key costs a full chain scan.`,
        ),
    bucket,
  );
  snapshot(
    say(lang, 'Load factor par nazar rakho', 'Watch the load factor'),
    say(
      lang,
      'Load factor = entries / buckets. Yeh badhta hai toh chains lambi hoti hain. Real hash tables ek threshold par resize karke saari keys rehash karte hain — ek resize mehenga hai, par insert ka amortized cost O(1) rehta hai.',
      'Load factor = entries / buckets. As it grows, chains get longer. Real hash tables resize at a threshold and rehash every key — one resize is expensive, but the amortized cost of an insert stays O(1).',
    ),
  );
  return frames;
}

export function tokenBucketTrace(lang) {
  const capacity = 3;
  const bursts = [
    { at: 0, requests: 4 },
    { at: 1, requests: 2 },
    { at: 4, requests: 1 },
  ];
  let tokens = capacity;
  let last = 0;
  let id = 0;
  const accepted = [];
  const rejected = [];
  const frames = [];
  const snapshot = (title, explanation, at) =>
    frames.push({
      title,
      explanation,
      cells: Array.from({ length: capacity }, (_, i) => ({
        value: i < tokens ? '●' : '○',
        label: `token ${i + 1}`,
        status: i < tokens ? 'found' : 'muted',
      })),
      lanes: [lane('Accepted', [...accepted]), lane('Rejected · 429', [...rejected])],
      metrics: [`t = ${at}s`, `tokens = ${tokens} / ${capacity}`, 'refill = 1 token/s'],
      result: { accepted: accepted.length, rejected: rejected.length },
    });
  snapshot(
    say(lang, 'Bucket bhari hui hai', 'The bucket starts full'),
    say(
      lang,
      `Capacity ${capacity} tokens hai aur refill 1 token per second. Har request ek token kharch karti hai.`,
      `Capacity is ${capacity} tokens and the refill rate is 1 token per second. Every request spends one token.`,
    ),
    0,
  );
  for (const burst of bursts) {
    if (burst.at > last) {
      const elapsed = burst.at - last;
      const refill = Math.min(capacity - tokens, elapsed);
      tokens += refill;
      last = burst.at;
      snapshot(
        say(
          lang,
          `t = ${burst.at}s: ${refill} token refill`,
          `t = ${burst.at}s: ${refill} token(s) refilled`,
        ),
        say(
          lang,
          `${elapsed} second beete. Tokens capacity (${capacity}) se upar kabhi nahi jaate — isi se burst ki limit tay hoti hai.`,
          `${elapsed} second(s) passed. Tokens never exceed the capacity (${capacity}) — that is what bounds a burst.`,
        ),
        burst.at,
      );
    }
    for (let i = 0; i < burst.requests; i++) {
      id++;
      if (tokens > 0) {
        tokens--;
        accepted.push(`req ${id} @ ${burst.at}s`);
        snapshot(
          say(lang, `Request ${id} accept hui`, `Request ${id} is accepted`),
          say(
            lang,
            `Ek token kharch hua; ${tokens} bache hain.`,
            `One token was spent; ${tokens} left.`,
          ),
          burst.at,
        );
      } else {
        rejected.push(`req ${id} @ ${burst.at}s`);
        snapshot(
          say(lang, `Request ${id} reject: 429`, `Request ${id} is rejected: 429`),
          say(
            lang,
            'Bucket khaali hai. Server 429 Too Many Requests aur Retry-After bhejta hai; request ko queue nahi kiya jaata.',
            'The bucket is empty. The server answers 429 Too Many Requests with Retry-After; the request is not queued.',
          ),
          burst.at,
        );
      }
    }
  }
  snapshot(
    say(lang, 'Burst allowed, average rate bounded', 'Bursts allowed, average rate bounded'),
    say(
      lang,
      'Token bucket chhota burst (capacity tak) allow karta hai, par lambe time ka average refill rate se bandha rehta hai. Kai servers hon toh tokens ka count shared aur atomic rakhna padta hai.',
      'A token bucket allows a short burst (up to its capacity) while the long-run average stays bounded by the refill rate. With several servers, the token count must be shared and updated atomically.',
    ),
    last,
  );
  return frames;
}

export const moreVisuals = [
  {
    id: 'two-pointers',
    name: 'Two pointers: pair sum',
    track: 'dsa',
    icon: 'search',
    variants: true,
    description:
      'Sorted array mein dono ends se pointers chalao aur har step par ek candidate hatao.',
    code: 'let left = 0, right = a.length - 1;\nwhile (left < right) {\n  const sum = a[left] + a[right];\n  if (sum === target) return [left, right];\n  if (sum < target) left++;\n  else right--;\n}\nreturn null;',
    takeaway:
      'Two pointers tabhi kaam karta hai jab order (yahan sorted array) batata ho ki kaunsa pointer hilana safe hai. Har step ek candidate hamesha ke liye hata deta hai, isliye O(n²) pairs ki jagah O(n) kaam hota hai.',
    trace: (lang, variant) => twoPointersTrace([1, 3, 4, 6, 8, 11, 15], variant ? 20 : 14, lang),
  },
  {
    id: 'sliding-window',
    name: 'Sliding window: best sum of k',
    track: 'dsa',
    icon: 'layers',
    variants: true,
    description:
      'Fixed size window ko slide karo: ek value bahar, ek andar — poora sum dobara nahi.',
    code: 'let sum = 0;\nfor (let i = 0; i < k; i++) sum += a[i];\nlet best = sum;\nfor (let i = k; i < a.length; i++) {\n  sum += a[i] - a[i - k];\n  best = Math.max(best, sum);\n}\nreturn best;',
    takeaway:
      'Window slide hone par sirf do values badalti hain, isliye har window O(1) mein update hoti hai. Yeh fixed-size window hai; variable-size window mein condition tootne par left pointer aage badhate hain.',
    trace: (lang, variant) =>
      slidingWindowTrace(variant ? [4, 2, 1, 7, 8, 1, 2] : [2, 1, 5, 1, 3, 2, 6], 3, lang),
  },
  {
    id: 'dfs',
    name: 'Depth-first search',
    track: 'dsa',
    icon: 'network',
    description: 'Ek raaste par end tak jao, phir backtrack karke agla raasta lo.',
    code: 'const seen = new Set();\nfunction dfs(node) {\n  seen.add(node);\n  for (const next of graph[node]) {\n    if (!seen.has(next)) dfs(next);\n  }\n}\ndfs(start);',
    takeaway:
      'DFS ko stack chahiye — recursion mein call stack hi woh stack hai. Cycle wale graph mein visited set zaroori hai. Shortest path chahiye toh unweighted graph par BFS use karo.',
    trace: (lang) => dfsTrace(GRAPH, 'A', lang),
  },
  {
    id: 'tree-traversal',
    name: 'Inorder traversal of a BST',
    track: 'dsa',
    icon: 'network',
    description: 'Left, node, right — aur BST se values sorted order mein nikalti dekho.',
    code: 'const stack = [];\nlet node = root;\nwhile (node || stack.length) {\n  while (node) {\n    stack.push(node);\n    node = node.left;\n  }\n  node = stack.pop();\n  visit(node.value);\n  node = node.right;\n}',
    takeaway:
      'Inorder = left subtree, node, right subtree. BST mein left ki saari values chhoti aur right ki badi hoti hain, isliye inorder output sorted aata hai. Skewed tree mein height n ho sakti hai, tab stack space O(n) ho jaata hai.',
    trace: (lang) => inorderTrace(lang),
  },
  {
    id: 'linked-list-reversal',
    name: 'Reversing a linked list',
    track: 'dsa',
    icon: 'path',
    description: 'prev, curr aur next se ek-ek link ki direction palto.',
    code: 'let prev = null;\nlet curr = head;\nwhile (curr) {\n  const next = curr.next; // save the rest\n  curr.next = prev;       // flip one link\n  prev = curr;\n  curr = next;\n}\nreturn prev;',
    takeaway:
      'Link palatne se pehle next save karna zaroori hai, warna baaki list tak pahunchne ka raasta kho jaata hai. Loop ke end mein prev naya head hota hai, curr nahi.',
    trace: (lang) => reverseListTrace([1, 2, 3, 4], lang),
  },
  {
    id: 'heap-insert',
    name: 'Min-heap insert (sift up)',
    track: 'dsa',
    icon: 'layers',
    variants: true,
    description: 'Naya element end mein jodo aur parent se compare karke upar chadhao.',
    code: 'heap.push(value);\nlet i = heap.length - 1;\nwhile (i > 0) {\n  const parent = Math.floor((i - 1) / 2);\n  if (heap[parent] <= heap[i]) break;\n  [heap[parent], heap[i]] = [heap[i], heap[parent]];\n  i = parent;\n}',
    takeaway:
      'Heap poora sorted nahi hota — sirf parent ≤ children ka rule hota hai. Isiliye insert aur remove-min O(log n) hain aur minimum dekhna O(1). Array mein index i ke children 2i + 1 aur 2i + 2 par hote hain.',
    trace: (lang, variant) => heapInsertTrace([2, 5, 3, 9, 6, 8], variant ? 4 : 1, lang),
  },
  {
    id: 'hash-collisions',
    name: 'Hash table collisions',
    track: 'dsa',
    icon: 'database',
    description: 'Keys ko buckets mein jaate, takraate aur chain banate dekho.',
    code: 'const index = hash(key) % buckets.length;\nfor (const entry of buckets[index]) {\n  if (entry.key === key) return entry.value; // scan the chain\n}\nbuckets[index].push({ key, value });\n// When load factor crosses a threshold: resize + rehash.',
    takeaway:
      'Hash table ka O(1) average hai, guarantee nahi. Achha hash keys ko buckets mein phailata hai; kharab hash ya zyada load factor chains lambi karke lookup ko O(n) ki taraf le jaata hai. Java ka HashMap bahut lambi bucket ko tree mein badal deta hai.',
    trace: (lang) => hashChainTrace([12, 7, 20, 15, 9], 5, 7, lang),
  },
  {
    id: 'token-bucket',
    name: 'Token bucket rate limiter',
    track: 'system-design',
    icon: 'layers',
    source: 'https://www.rfc-editor.org/rfc/rfc6585#section-4',
    language: 'text',
    description: 'Tokens refill hote, burst nikalte aur khaali bucket par 429 aate dekho.',
    code: 'on request:\n  refill tokens by elapsedSeconds * rate (cap at capacity)\n  if tokens >= 1:\n    tokens -= 1\n    allow\n  else:\n    reject with 429 + Retry-After',
    takeaway:
      'Capacity burst ka size tay karti hai aur refill rate lamba average. Limit kis key par hai (user, IP, API key) yeh pehle tay karo. Distributed setup mein read-modify-write atomic hona chahiye, warna do servers ek hi token do baar de denge.',
    trace: (lang) => tokenBucketTrace(lang),
  },
  {
    id: 'hoisting-tdz',
    name: 'Hoisting and the temporal dead zone',
    track: 'javascript',
    icon: 'code',
    source:
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz',
    description: 'var, let aur function declaration ko creation se execution tak follow karo.',
    code: "console.log(a); // undefined\nvar a = 1;\ntry {\n  console.log(b);\n} catch (error) {\n  console.log(error.name); // ReferenceError\n}\nlet b = 2;\nsayHi(); // works\nfunction sayHi() {\n  console.log('hi');\n}",
    takeaway:
      'Declarations scope ke shuru mein register hoti hain, par initialization alag hai: var undefined se shuru hota hai, let/const apni line tak TDZ mein rehte hain, aur function declaration poori body ke saath ready hoti hai. Function expression apne variable ka rule follow karta hai.',
    frames: [
      frame(
        'Creation phase: bindings register hoti hain',
        'Code chalne se pehle engine scope ki declarations register karta hai. var ko undefined milta hai, let binding ban jaati hai par uninitialized rehti hai, aur function declaration poori ready hoti hai.',
        [
          lane('Scope bindings', [
            'a → undefined (var)',
            'b → <uninitialized> (TDZ)',
            'sayHi → function',
          ]),
          lane('Console', []),
        ],
      ),
      frame(
        'console.log(a) → undefined',
        'a ki binding exist karti hai aur uski value abhi undefined hai. Isliye error nahi aata — bas value abhi assign nahi hui.',
        [
          lane('Scope bindings', [
            'a → undefined',
            'b → <uninitialized> (TDZ)',
            'sayHi → function',
          ]),
          lane('Console', ['undefined']),
        ],
      ),
      frame(
        'var a = 1 ab assign hota hai',
        'Declaration pehle hi ho chuki thi; is line par sirf assignment hota hai.',
        [
          lane('Scope bindings', ['a → 1', 'b → <uninitialized> (TDZ)', 'sayHi → function']),
          lane('Console', ['undefined']),
        ],
      ),
      frame(
        'console.log(b) TDZ mein hai',
        'b ki binding hai, par let b line tak use padhna mana hai. Engine ReferenceError throw karta hai, jo yahan catch hokar log hota hai.',
        [
          lane('Scope bindings', ['a → 1', 'b → <uninitialized> (TDZ)', 'sayHi → function']),
          lane('Console', ['undefined', 'ReferenceError']),
        ],
      ),
      frame(
        'let b = 2: TDZ khatam',
        'Declaration line chalte hi b initialize hota hai. Ab se b normal variable ki tarah padha ja sakta hai.',
        [
          lane('Scope bindings', ['a → 1', 'b → 2', 'sayHi → function']),
          lane('Console', ['undefined', 'ReferenceError']),
        ],
      ),
      frame(
        'sayHi() declaration se pehle bhi chalta',
        'Function declaration creation phase mein hi poori body ke saath bind ho jaati hai, isliye use file mein kahin bhi call kar sakte ho.',
        [
          lane('Scope bindings', ['a → 1', 'b → 2', 'sayHi → function']),
          lane('Console', ['undefined', 'ReferenceError', 'hi']),
        ],
      ),
    ],
  },
  {
    id: 'prototype-chain',
    name: 'Property lookup on the prototype chain',
    track: 'javascript',
    icon: 'code',
    source:
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain',
    description: 'Property ko object se uske prototypes tak dhundte dekho.',
    code: 'const animal = { eats: true };\nconst dog = Object.create(animal);\ndog.barks = true;\n\ndog.barks;      // own property\ndog.eats;       // found on animal\ndog.toString;   // found on Object.prototype\ndog.fly;        // undefined\ndog.eats = false; // creates an own property',
    takeaway:
      'Read chain par upar tak jaata hai jab tak property mile ya null aaye. Write (normal data property) hamesha object par khud hota hai — woh prototype ko nahi badalta, bas use shadow karta hai. class syntax isi mechanism ke upar bani hai.',
    frames: [
      frame(
        'Teen objects, ek chain',
        'dog ka [[Prototype]] animal hai, aur animal ka Object.prototype. Chain null par khatam hoti hai.',
        [
          lane('dog (own)', ['barks: true']),
          lane('animal', ['eats: true']),
          lane('Object.prototype', ['toString()', 'hasOwnProperty()', '[[Prototype]]: null']),
        ],
      ),
      frame(
        'dog.barks — own property',
        'Engine sabse pehle object ki apni properties dekhta hai. barks dog par hi hai, isliye lookup yahin ruk jaata hai.',
        [
          lane('dog (own)', ['barks: true ✓ found']),
          lane('animal', ['eats: true']),
          lane('Object.prototype', ['toString()', 'hasOwnProperty()']),
        ],
      ),
      frame(
        'dog.eats — ek level upar',
        'dog par eats nahi hai. Engine [[Prototype]] follow karke animal tak jaata hai aur wahan value milti hai.',
        [
          lane('dog (own)', ['barks: true', 'eats: not here ↑']),
          lane('animal', ['eats: true ✓ found']),
          lane('Object.prototype', ['toString()', 'hasOwnProperty()']),
        ],
      ),
      frame(
        'dog.toString — do level upar',
        'dog aur animal dono par toString nahi hai. Lookup Object.prototype tak pahunchta hai — isiliye lagbhag har object ke paas yeh methods hote hain.',
        [
          lane('dog (own)', ['toString: not here ↑']),
          lane('animal', ['toString: not here ↑']),
          lane('Object.prototype', ['toString() ✓ found']),
        ],
      ),
      frame(
        'dog.fly — chain khatam, undefined',
        'Poori chain mein fly nahi mila aur agla prototype null hai. Missing property padhne par undefined milta hai, error nahi.',
        [
          lane('dog (own)', ['fly: not here ↑']),
          lane('animal', ['fly: not here ↑']),
          lane('Object.prototype', ['fly: not here → null']),
          lane('Result', ['undefined']),
        ],
      ),
      frame(
        'dog.eats = false — shadowing',
        'Assignment dog par nayi own property banata hai. animal.eats ab bhi true hai; dog ka apna eats use chhupa (shadow) deta hai.',
        [
          lane('dog (own)', ['barks: true', 'eats: false (own)']),
          lane('animal', ['eats: true (unchanged)']),
          lane('Object.prototype', ['toString()', 'hasOwnProperty()']),
        ],
      ),
    ],
  },
  {
    id: 'debounce-throttle',
    name: 'Debounce vs. throttle',
    track: 'javascript',
    icon: 'clock',
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/Debounce',
    description: 'Same events par debounce aur throttle ke calls ka farq timeline par dekho.',
    code: 'function debounce(fn, wait) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}\n\nfunction throttle(fn, wait) {\n  let last = -Infinity;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= wait) {\n      last = now;\n      fn(...args);\n    }\n  };\n}',
    takeaway:
      'Debounce shaanti ka wait karta hai — search box ke liye sahi. Throttle chalti activity mein fixed rate par call deta hai — scroll ya resize ke liye sahi. Yeh trailing debounce aur leading throttle hai; libraries ke leading/trailing options behavior badal dete hain.',
    frames: [
      frame(
        't = 0 ms: pehla event',
        'Debounce 300 ms ka timer lagata hai. Leading throttle turant call chalata hai aur 300 ms ki window shuru karta hai.',
        [
          lane('Events', ['#1 @ 0']),
          lane('Debounce · wait 300', ['timer → 300']),
          lane('Throttle · every 300', ['call #1 @ 0']),
        ],
      ),
      frame(
        't = 100 ms: doosra event',
        'Debounce purana timer cancel karke naya lagata hai. Throttle ki window abhi chal rahi hai, isliye yeh event drop hota hai.',
        [
          lane('Events', ['#1 @ 0', '#2 @ 100']),
          lane('Debounce · wait 300', ['timer reset → 400']),
          lane('Throttle · every 300', ['call #1 @ 0', '#2 ignored']),
        ],
      ),
      frame(
        't = 200 ms: teesra event',
        'Events aate rahenge toh debounce kabhi fire nahi hoga — timer baar-baar reset hota hai.',
        [
          lane('Events', ['#1 @ 0', '#2 @ 100', '#3 @ 200']),
          lane('Debounce · wait 300', ['timer reset → 500']),
          lane('Throttle · every 300', ['call #1 @ 0', '#2 ignored', '#3 ignored']),
        ],
      ),
      frame(
        't = 300 ms: chautha event',
        'Pichhle throttled call ko 300 ms ho gaye, isliye throttle phir call chalata hai. Debounce ka timer ek baar aur reset hota hai.',
        [
          lane('Events', ['#1 @ 0', '#2 @ 100', '#3 @ 200', '#4 @ 300']),
          lane('Debounce · wait 300', ['timer reset → 600']),
          lane('Throttle · every 300', ['call #1 @ 0', 'call #2 @ 300']),
        ],
      ),
      frame(
        't = 600 ms: shaanti ke baad debounce',
        '300 ms tak koi naya event nahi aaya. Debounce ab ek call chalata hai — sabse latest event (#4) ke arguments ke saath.',
        [
          lane('Events', ['#1 … #4', 'quiet since 300']),
          lane('Debounce · wait 300', ['call #1 @ 600 (args of #4)']),
          lane('Throttle · every 300', ['call #1 @ 0', 'call #2 @ 300']),
        ],
      ),
      frame(
        't = 900 ms: ek akela event',
        'Throttle turant call chalata hai kyunki window khatam ho chuki hai. Debounce phir se 300 ms wait karega.',
        [
          lane('Events', ['#1 … #4', '#5 @ 900']),
          lane('Debounce · wait 300', ['call #1 @ 600', 'timer → 1200']),
          lane('Throttle · every 300', ['call #1 @ 0', 'call #2 @ 300', 'call #3 @ 900']),
        ],
      ),
      frame(
        't = 1200 ms: final count',
        '5 events aaye. Debounce ne 2 calls kiye (har pause ke baad ek), throttle ne 3 (har 300 ms mein zyada se zyada ek).',
        [
          lane('Events', ['5 events']),
          lane('Debounce · wait 300', ['call #1 @ 600', 'call #2 @ 1200']),
          lane('Throttle · every 300', ['call #1 @ 0', 'call #2 @ 300', 'call #3 @ 900']),
        ],
      ),
    ],
  },
  {
    id: 'effect-lifecycle',
    name: 'The lifecycle of an effect',
    track: 'react',
    icon: 'react',
    language: 'jsx',
    source: 'https://react.dev/learn/lifecycle-of-reactive-effects',
    description: 'Effect ka setup, skip aur cleanup — mount se unmount tak dekho.',
    code: 'function ChatRoom({ roomId }) {\n  useEffect(() => {\n    const connection = connect(roomId);\n    return () => connection.disconnect();\n  }, [roomId]);\n  return <h1>Welcome to {roomId}</h1>;\n}',
    takeaway:
      'Effect ko component ke lifecycle se nahi, sync ke start aur stop se socho: setup sync shuru karta hai, cleanup rokta hai. Dependency badle toh pehle purani values wala cleanup chalta hai, phir nayi values wala setup.',
    frames: [
      frame(
        'Mount: commit ke baad setup',
        'React pehle render aur DOM commit karta hai. Uske baad effect ka setup chalta hai aur "general" room se connect hota hai.',
        [
          lane('Render', ['roomId = "general"']),
          lane('Commit', ['<h1>Welcome to general</h1>']),
          lane('Effect', ['setup → connect("general")']),
        ],
      ),
      frame(
        'Re-render, dependency same',
        'Parent ke kaaran component dobara render hua, par roomId wahi hai. React dependencies compare karta hai aur effect ko skip kar deta hai.',
        [
          lane('Render', ['roomId = "general" (same)']),
          lane('Commit', ['no DOM change']),
          lane('Effect', ['skipped — [roomId] unchanged']),
        ],
      ),
      frame(
        'Dependency badli: pehle cleanup',
        'roomId "travel" ho gaya. Commit ke baad React pehle purane effect ka cleanup purani value ke saath chalata hai.',
        [
          lane('Render', ['roomId = "travel"']),
          lane('Commit', ['<h1>Welcome to travel</h1>']),
          lane('Effect', ['cleanup → disconnect("general")']),
        ],
      ),
      frame(
        'Phir nayi value ka setup',
        'Cleanup ke baad naya setup nayi roomId ke saath chalta hai. Har render ka effect apne render ki values dekhta hai.',
        [
          lane('Render', ['roomId = "travel"']),
          lane('Commit', ['<h1>Welcome to travel</h1>']),
          lane('Effect', ['setup → connect("travel")']),
        ],
      ),
      frame(
        'Unmount: aakhri cleanup',
        'Component screen se hata. React aakhri effect ka cleanup chalata hai taaki connection khula na reh jaaye.',
        [
          lane('Render', ['component removed']),
          lane('Commit', ['<h1> removed from DOM']),
          lane('Effect', ['cleanup → disconnect("travel")']),
        ],
      ),
      frame(
        'Development Strict Mode ka extra cycle',
        'Development mein Strict Mode mount par ek extra setup → cleanup chalata hai. Agar cleanup theek hai toh user ko koi farq nahi dikhta; farq dikhe toh cleanup missing hai.',
        [
          lane('Development only', [
            'setup → connect("general")',
            'cleanup → disconnect("general")',
            'setup → connect("general")',
          ]),
          lane('Production', ['setup → connect("general")']),
        ],
      ),
    ],
  },
  {
    id: 'navigation-stack',
    name: 'Navigation: stack, tabs and deep links',
    track: 'react-native',
    icon: 'phone',
    language: 'jsx',
    source: 'https://docs.expo.dev/router/basics/navigation/',
    description:
      'Push, back, tab switch, deep link aur replace par screen history kaise badalti hai, dekho.',
    code: "// Tabs at the root; the Orders tab has its own stack.\nrouter.push('/orders/42'); // open a detail screen on top\nrouter.back(); // remove the top screen\nrouter.replace('/login'); // swap the top screen, no new history entry\n// Deep link: shortnotes://orders/42 can open the detail directly",
    takeaway:
      'Stack plates ka dher hai: push upar rakhta hai, back upar wali hatata hai. Har tab ka apna dher hai jo switch karne par wahin ruka rehta hai. Deep link se aao toh initial route se neeche wali screen rakho, aur jahan wapas nahi aana (login, payment ke baad) wahan replace karo.',
    frames: [
      frame(
        'App khula: Home tab',
        'Root par do tabs hain: Home aur Orders. Har tab ka apna history hota hai. Abhi Home dikh raha hai; Orders ke stack mein sirf list screen hai.',
        [
          lane('Tabs', ['Home (active)', 'Orders']),
          lane('Orders stack', ['/orders']),
          lane('On screen', ['Home']),
        ],
      ),
      frame(
        'Orders tab par switch',
        'Tab badalne se Home band nahi hota — woh apni scroll position aur state ke saath peeche ruka rehta hai. Ab Orders stack ki top screen dikhti hai.',
        [
          lane('Tabs', ['Home', 'Orders (active)']),
          lane('Orders stack', ['/orders']),
          lane('On screen', ['/orders']),
        ],
      ),
      frame(
        "router.push('/orders/42')",
        'Detail screen stack ke upar rakhi gayi. Neeche wali list unmount nahi hui, bas dhak gayi. Back ka matlab ab yahi upar wali screen hatana hai.',
        [
          lane('Tabs', ['Home', 'Orders (active)']),
          lane('Orders stack', ['/orders', '/orders/42']),
          lane('On screen', ['/orders/42']),
        ],
      ),
      frame(
        'router.back()',
        'Upar wali screen hat gayi aur unmount hui. Neeche wali list usi state ke saath wapas dikhti hai — dobara load nahi karni padti.',
        [
          lane('Tabs', ['Home', 'Orders (active)']),
          lane('Orders stack', ['/orders']),
          lane('On screen', ['/orders']),
        ],
      ),
      frame(
        'Deep link: shortnotes://orders/42',
        'App band thi aur notification ke link se seedha detail khuli. Agar neeche list na rakhi hoti toh back dabane par app hi band ho jaati. Initial route list ko stack ke neeche rakh deta hai.',
        [
          lane('Tabs', ['Home', 'Orders (active)']),
          lane('Orders stack', ['/orders (initial route)', '/orders/42']),
          lane('On screen', ['/orders/42']),
        ],
      ),
      frame(
        "router.replace('/login')",
        'Session expire hua. replace upar wali screen ko badal deta hai, naya history entry nahi jodta — login ke baad back dabane par expired detail wapas nahi aata.',
        [
          lane('Tabs', ['Home', 'Orders (active)']),
          lane('Orders stack', ['/orders', '/login']),
          lane('On screen', ['/login']),
        ],
      ),
    ],
  },
  {
    id: 'spring-proxy',
    name: 'Spring proxies and the self-call trap',
    track: 'spring-boot',
    icon: 'layers',
    language: 'java',
    source:
      'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html',
    description:
      '@Transactional call proxy se guzarti hai — aur this.method() par kyun nahi, dekho.',
    code: '@Service\nclass OrderService {\n  @Transactional\n  public void place(Order order) { /* insert order, reserve stock */ }\n\n  public void placeAll(List<Order> orders) {\n    orders.forEach(this::place); // self-call: skips the proxy\n  }\n}\n// OrderController calls orderService.place(order) through the proxy',
    takeaway:
      'Spring @Transactional, @Async aur @Cacheable ka kaam bean ke aage khade proxy se karta hai. Bahar se aayi call proxy se guzarti hai; class ke andar this.method() asli object ko seedha call karta hai aur advice skip ho jaati hai. Transaction ki boundary us method par rakho jise bahar se bulaya jaata hai, ya logic alag bean mein le jao.',
    frames: [
      frame(
        'Startup: container proxy banata hai',
        '@Transactional method dekh kar Spring asli OrderService ke aage ek proxy rakhta hai. Controller ko jo inject hota hai, woh proxy hai, asli object nahi.',
        [
          lane('Call', ['OrderController → orderService (proxy)']),
          lane('Proxy', ['OrderService proxy → target OrderService']),
          lane('Transaction', []),
        ],
      ),
      frame(
        'controller → orderService.place(order)',
        'Call proxy se guzarti hai. Proxy pehle transaction kholta hai, phir asli place() chalata hai.',
        [
          lane('Call', ['controller → proxy.place()']),
          lane('Proxy', ['begin transaction', 'target.place()']),
          lane('Transaction', ['open']),
        ],
      ),
      frame(
        'place() mein RuntimeException',
        'Exception proxy tak wapas aati hai. Default rule mein runtime exception par rollback hota hai, toh order aur stock dono wapas.',
        [
          lane('Call', ['controller → proxy.place()']),
          lane('Proxy', ['exception seen → rollback']),
          lane('Transaction', ['rolled back']),
        ],
      ),
      frame(
        'controller → orderService.placeAll(orders)',
        'placeAll par @Transactional nahi hai, toh proxy bina transaction ke call aage bhej deta hai.',
        [
          lane('Call', ['controller → proxy.placeAll()']),
          lane('Proxy', ['no advice → target.placeAll()']),
          lane('Transaction', ['none']),
        ],
      ),
      frame(
        'this.place(order): self-call',
        'Andar se this.place() asli object ka seedha call hai — proxy ko pata hi nahi chalta, isliye @Transactional yahan kaam nahi karta. Har repository call apne aap commit hoti hai; teesra order fail ho toh pehle do wapas nahi aate.',
        [
          lane('Call', ['target.placeAll() → this.place()']),
          lane('Proxy', ['bypassed']),
          lane('Transaction', ['none — each repository call commits on its own']),
        ],
      ),
      frame(
        'Fix: boundary bahar wale method par',
        'placeAll ko @Transactional banao (ya place ko alag bean mein rakho) taaki call proxy se guzre. Ab saare orders ek transaction mein: sab commit ya sab rollback.',
        [
          lane('Call', ['controller → proxy.placeAll()']),
          lane('Proxy', ['begin transaction', 'target.placeAll()']),
          lane('Transaction', ['open → commit all or roll back all']),
        ],
      ),
    ],
  },
  {
    id: 'stream-pipeline',
    name: 'A lazy Java stream, element by element',
    track: 'java',
    icon: 'coffee',
    language: 'java',
    source: 'https://dev.java/learn/api/streams/',
    description:
      'filter → map → findFirst: element ek-ek karke kaise chalte hain aur kab ruk jaate hain, dekho.',
    code: 'Optional<Integer> first = List.of(5, 12, 8, 21, 30).stream()\n    .filter(n -> n > 10) // keep the big ones\n    .map(n -> n * 2) // double them\n    .findFirst(); // Optional[24]',
    takeaway:
      'Stream lazy hai: intermediate operations sirf pipeline jodte hain, terminal operation chalaata hai. Har element poori pipeline se ek-ek karke guzarta hai, aur findFirst jaisa short-circuit operation jawab milte hi ruk jaata hai. Ek stream ek hi baar consume hoti hai.',
    frames: [
      frame(
        'Pipeline bani, kuch chala nahi',
        'filter aur map sirf steps jodte hain. Terminal operation (findFirst) ke bina ek bhi element process nahi hota.',
        [
          lane('Source', ['5', '12', '8', '21', '30']),
          lane('filter(n > 10)', []),
          lane('map(n * 2)', []),
          lane('Result', []),
        ],
      ),
      frame(
        'findFirst(): 5 aata hai',
        'Elements ek-ek karke poori pipeline se guzarte hain, stage-by-stage batch mein nahi. 5 filter par ruk gaya, kyunki 5 > 10 false hai.',
        [
          lane('Source', ['12', '8', '21', '30']),
          lane('filter(n > 10)', ['5 ✗']),
          lane('map(n * 2)', []),
          lane('Result', []),
        ],
      ),
      frame(
        '12 pass, map ne 24 banaya',
        '12 > 10, isliye aage gaya aur map ne use 24 banaya. findFirst ko pehla result mil gaya.',
        [
          lane('Source', ['8', '21', '30']),
          lane('filter(n > 10)', ['5 ✗', '12 ✓']),
          lane('map(n * 2)', ['12 → 24']),
          lane('Result', ['Optional[24]']),
        ],
      ),
      frame(
        'Short-circuit: baaki chhue bhi nahi',
        '8, 21 aur 30 kabhi filter tak pahunche hi nahi. Bade ya infinite stream mein yahi kaam bachata hai.',
        [
          lane('Source', ['8 (never read)', '21 (never read)', '30 (never read)']),
          lane('filter(n > 10)', ['5 ✗', '12 ✓']),
          lane('map(n * 2)', ['12 → 24']),
          lane('Result', ['Optional[24]']),
        ],
      ),
      frame(
        'Same stream dobara? IllegalStateException',
        'Ek stream ek hi baar consume hoti hai; dobara chahiye toh source se nayi stream banao. Result Optional hai — get() ki jagah orElse ya orElseThrow se khaali case sambhalo.',
        [
          lane('Source', ['stream already consumed']),
          lane('filter(n > 10)', []),
          lane('map(n * 2)', []),
          lane('Result', ['Optional[24]', 'reuse → IllegalStateException']),
        ],
      ),
    ],
  },
  {
    id: 'reference-copy',
    name: 'References, shallow copies and deep copies',
    track: 'javascript',
    icon: 'code',
    source: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone',
    description:
      'b = a, spread aur structuredClone mein kaun naya object banata hai aur kaun address share karta hai, dekho.',
    code: "const a = { name: 'Asha', tags: ['js'] };\nconst b = a; // same object\nconst c = { ...a }; // shallow copy\nb.name = 'Ravi';\nc.tags.push('react');\nconst d = structuredClone(a); // deep copy",
    takeaway:
      'Variable mein object nahi, uska address hota hai. b = a address copy karta hai, spread sirf bahar wala level copy karta hai (andar ke arrays/objects share), aur structuredClone har level par naye objects banata hai — functions par error deta hai aur class instance ko plain object bana deta hai.',
    frames: [
      frame(
        "const a = { name: 'Asha', tags: ['js'] }",
        'Heap mein object #1 bana, aur uski tags array alag object #2 hai. Variable a mein object nahi, #1 ka address (reference) hai.',
        [
          lane('Variables', ['a → #1']),
          lane('Heap', ['#1 { name: "Asha", tags: → #2 }', '#2 ["js"]']),
        ],
      ),
      frame(
        'const b = a',
        'Koi naya object nahi bana. b ko wahi address mila — a aur b ek hi object dekhte hain.',
        [
          lane('Variables', ['a → #1', 'b → #1']),
          lane('Heap', ['#1 { name: "Asha", tags: → #2 }', '#2 ["js"]']),
        ],
      ),
      frame(
        'const c = { ...a }',
        'Spread naya bahar wala object #3 banata hai, par tags ka address hi copy hota hai — #2 ab dono objects share karte hain. Isi ko shallow copy kehte hain.',
        [
          lane('Variables', ['a → #1', 'b → #1', 'c → #3']),
          lane('Heap', [
            '#1 { name: "Asha", tags: → #2 }',
            '#2 ["js"]',
            '#3 { name: "Asha", tags: → #2 }',
          ]),
        ],
      ),
      frame(
        "b.name = 'Ravi'",
        'b aur a ek hi object #1 hain, isliye a.name bhi "Ravi" ho gaya. c alag object #3 hai, uska name "Asha" hi rahega.',
        [
          lane('Variables', ['a → #1', 'b → #1', 'c → #3']),
          lane('Heap', [
            '#1 { name: "Ravi", tags: → #2 }',
            '#2 ["js"]',
            '#3 { name: "Asha", tags: → #2 }',
          ]),
        ],
      ),
      frame(
        "c.tags.push('react')",
        'c.tags wahi array #2 hai jo a.tags — shallow copy ka jaal. a.tags bhi ab ["js", "react"] hai.',
        [
          lane('Variables', ['a → #1', 'b → #1', 'c → #3']),
          lane('Heap', [
            '#1 { name: "Ravi", tags: → #2 }',
            '#2 ["js", "react"]',
            '#3 { name: "Asha", tags: → #2 }',
          ]),
        ],
      ),
      frame(
        'const d = structuredClone(a)',
        'Deep copy har level par naye objects banata hai: #4 aur uski apni array #5. Ab d mein kuch bhi badlo, a par asar nahi.',
        [
          lane('Variables', ['a → #1', 'b → #1', 'c → #3', 'd → #4']),
          lane('Heap', [
            '#1 { name: "Ravi", tags: → #2 }',
            '#2 ["js", "react"]',
            '#3 { name: "Asha", tags: → #2 }',
            '#4 { name: "Ravi", tags: → #5 }',
            '#5 ["js", "react"]',
          ]),
        ],
      ),
    ],
  },
  {
    id: 'sql-query-order',
    name: 'The order a SQL query runs in',
    track: 'java',
    icon: 'database',
    language: 'sql',
    source: 'https://www.postgresql.org/docs/current/sql-select.html',
    description: 'SELECT pehle likhte ho, par chalta FROM se hai — har clause ke baad rows dekho.',
    code: "SELECT customer_id, SUM(amount) AS total\nFROM orders\nWHERE status = 'paid'\nGROUP BY customer_id\nHAVING SUM(amount) > 500\nORDER BY total DESC\nLIMIT 2;",
    takeaway:
      'Likhte SELECT se hain, par logical order FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT hai. Row ka filter WHERE mein, group ka filter HAVING mein; SELECT ka alias ORDER BY mein chalta hai, WHERE mein nahi. Optimizer andar se kaam ka order badal sakta hai, par result isi logical order jaisa hota hai.',
    frames: [
      frame(
        'FROM orders',
        'Query SELECT se likhi hai, par database pehle FROM se saari rows uthata hai.',
        [
          lane('Clause', ['FROM orders']),
          lane('Rows', [
            'o1 · A · 300 · paid',
            'o2 · A · 400 · paid',
            'o3 · B · 900 · cancelled',
            'o4 · B · 200 · paid',
            'o5 · C · 700 · paid',
            'o6 · D · 600 · paid',
            'o7 · D · 50 · paid',
          ]),
        ],
      ),
      frame(
        "WHERE status = 'paid'",
        'Grouping se pehle har row alag se check hoti hai. o3 cancelled hai, hat gayi. Isliye SUM jaisa aggregate WHERE mein nahi likh sakte — groups abhi bane hi nahi.',
        [
          lane('Clause', ["WHERE status = 'paid'"]),
          lane('Rows', [
            'o1 · A · 300 · paid',
            'o2 · A · 400 · paid',
            'o4 · B · 200 · paid',
            'o5 · C · 700 · paid',
            'o6 · D · 600 · paid',
            'o7 · D · 50 · paid',
          ]),
        ],
      ),
      frame(
        'GROUP BY customer_id',
        'Bachi rows customer ke hisaab se groups mein, aur har group ka SUM.',
        [
          lane('Clause', ['GROUP BY customer_id']),
          lane('Rows', ['A: o1 + o2 → 700', 'B: o4 → 200', 'C: o5 → 700', 'D: o6 + o7 → 650']),
        ],
      ),
      frame(
        'HAVING SUM(amount) > 500',
        'Ab poora group dekh kar filter: B ka total 200 hai, isliye B hat gaya.',
        [
          lane('Clause', ['HAVING SUM(amount) > 500']),
          lane('Rows', ['A → 700', 'C → 700', 'D → 650']),
        ],
      ),
      frame(
        'SELECT customer_id, SUM(amount) AS total',
        'Columns aur alias yahan bante hain. Isliye total alias WHERE mein nahi chalta (tab tak bana hi nahi tha), par ORDER BY mein chalta hai.',
        [lane('Clause', ['SELECT … AS total']), lane('Rows', ['(A, 700)', '(C, 700)', '(D, 650)'])],
      ),
      frame(
        'ORDER BY total DESC · LIMIT 2',
        'Sort ke baad pehli do rows. A aur C ka total barabar hai, isliye un dono ka aapas ka order guaranteed nahi — pagination mein tie-breaker do: ORDER BY total DESC, customer_id.',
        [
          lane('Clause', ['ORDER BY total DESC', 'LIMIT 2']),
          lane('Rows', ['(A, 700)', '(C, 700)']),
        ],
      ),
    ],
  },
];
