---
id: dsa-heaps
title: Heaps and priority queues
track: dsa
order: 10
level: Intermediate
minutes: 3
summary: Heap — complete binary tree with parent-child priority rule.
tags: heap, priority-queue, top-k, heapify
visual: heap-insert
---

## Quick revision

> Revision target — Heap invariant ko top-k candidates ke bounded set se relate karo.

- Heap — complete binary tree with parent-child priority rule.
- Min-heap — smallest root; max-heap — largest root.
- Peek — O(1); insert/extract — O(log n).
- Heapify — bottom-up heap build O(n).
- Array layout — zero-based children `2i + 1`, `2i + 2`; parent `floor((i - 1) / 2)`.
- Top-k largest — size-k min-heap; O(n log k).
- Priority queue — priority ke hisaab se next item; full sorting guaranteed nahi.
- Stale entry — priority update ka old queue entry pop par skip karo.
- Tie-breaker — equal priorities ka deterministic order define karo.
- K-way merge — har sorted source ka next candidate heap mein; O(total items × log k).
- Streaming median — lower half max-heap, upper half min-heap; sizes/order balanced rakho.
- Arbitrary delete — item locate karne ke liye index map ya lazy deletion chahiye.

### Heap costs

- Heap operations — push/pop O(log n); arbitrary lookup O(n); bottom-up heap build O(n).

### Edge cases aur reasoning

- Heap versus sorted array — root minimum hai, remaining array fully sorted nahi; arbitrary lookup binary search se valid nahi.
- Top-k bound — k>n, k=0 aur duplicate-ranking contract define; result sorted chahiye toh additional O(k log k) work count karo.
- Priority mutation — heap ke andar object priority change se invariant automatically restore nahi; update-key/reinsert plus stale guard chahiye.

## Example se samjho

- Scenario — Top2 largest ke liye stream `[5,1,8,3]` aur size2 min-heap use karo.
- Reasoning — 5,1 se candidates{1,5};8 root1 replace karta: {5,8};3 discard. Root5 current retained values ka smallest, final top2 are5 and8.
- Catch — Heap array sorted result nahi; ordered output chahiye toh separate extraction/sort cost jodo. k=0 ko root access se pehle handle karo.

## Recall aur practice

- Sawal — Bottom-up heap build n times O(log n) insert karne jaisa O(n log n) kyun nahi?
- Jawaab — Most nodes low height par hain; sum of their sift-down work O(n), per-node worst bound tight total nahi.
- Khud try karo — Top-3 stream with duplicates trace karo; heap size<=3, correct membership, sorted-output cost aur changed priority handling verify karo.

## Practice questions

### Easy · Heap array layout

Index `i` (0-based) ke parent aur children? Min-heap property kya hai?

<details>
<summary>Answer</summary>

- Parent — `Math.floor((i − 1) / 2)`; children — `2i + 1`, `2i + 2`.
- Min-heap — har parent apne children se `<=`; root minimum.
- Sorted nahi — siblings ke beech koi order nahi.
- Costs — peek `O(1)`, push/pop `O(log n)`.

</details>

### Medium · MinHeap implement karo

JS mein built-in priority queue nahi. `push`, `pop`, `peek`, `size` ke saath MinHeap likho.

<details>
<summary>Answer</summary>

```js
class MinHeap {
  constructor(compare = (a, b) => a - b) { this.items = []; this.compare = compare; }
  get size() { return this.items.length; }
  peek() { return this.items[0]; }
  push(value) {
    const a = this.items;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.items;
    if (!a.length) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.compare(a[l], a[m]) < 0) m = l;
        if (r < a.length && this.compare(a[r], a[m]) < 0) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}
```

- Push — end mein daalo, upar bubble.
- Pop — root nikalo, last ko root par rakh kar neeche sift.
- Comparator — objects/priorities ke liye; tie-breaker se deterministic order.

</details>

### Medium · Top-k largest in `O(n log k)`

<details>
<summary>Answer</summary>

```js
function topK(nums, k) {
  const heap = new MinHeap();
  for (const x of nums) {
    heap.push(x);
    if (heap.size > k) heap.pop(); // sabse chhota hatao
  }
  const out = [];
  while (heap.size) out.push(heap.pop());
  return out.reverse();
}
```

- Size-k min-heap — root = current k-th largest; chhote elements turant bahar.
- Complexity — `O(n log k)` time, `O(k)` space; poora sort `O(n log n)`.
- Streaming — data ek saath memory mein na ho tab bhi kaam karta hai.

</details>

### Medium · Merge k sorted arrays

<details>
<summary>Answer</summary>

```js
function mergeK(arrays) {
  const heap = new MinHeap((a, b) => a.value - b.value);
  arrays.forEach((arr, list) => arr.length && heap.push({ value: arr[0], list, index: 0 }));
  const out = [];
  while (heap.size) {
    const { value, list, index } = heap.pop();
    out.push(value);
    if (index + 1 < arrays[list].length)
      heap.push({ value: arrays[list][index + 1], list, index: index + 1 });
  }
  return out;
}
```

- Heap mein har list ka sirf current head — size `k`.
- Complexity — `O(N log k)` (N = total elements).

</details>

### Hard · Streaming median

Numbers ek-ek aate hain; har step par median chahiye.

<details>
<summary>Answer</summary>

```js
class MedianFinder {
  constructor() {
    this.low = new MinHeap((a, b) => b - a); // max-heap: chhota half
    this.high = new MinHeap();                // min-heap: bada half
  }
  add(x) {
    this.low.push(x);
    this.high.push(this.low.pop());           // low ka max high mein
    if (this.high.size > this.low.size) this.low.push(this.high.pop());
  }
  median() {
    if (!this.low.size) return null;
    return this.low.size > this.high.size
      ? this.low.peek()
      : (this.low.peek() + this.high.peek()) / 2;
  }
}
```

- Invariant — `low` ke saare elements `<=` `high` ke; sizes equal ya `low` ek zyada.
- Costs — add `O(log n)`, median `O(1)`.

</details>

## Sources — aur padhne ke liye

- [Princeton's priority queues chapter](https://algs4.cs.princeton.edu/24pq/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/10-heaps-and-priority-queues.md)
