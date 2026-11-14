---
id: dsa-heaps
title: Heaps and priority queues
track: dsa
order: 10
level: Intermediate
minutes: 3
summary: Heap — a complete binary tree with a parent-child priority rule.
tags: heap, priority-queue, top-k, heapify
visual: heap-insert
---

## Quick revision

> Revision target — Relate the heap invariant to a bounded set of top-k candidates.

- Heap — a complete binary tree with a parent-child priority rule.
- Min-heap — the smallest at the root; max-heap — the largest at the root.
- Peek — O(1); insert/extract — O(log n).
- Heapify — a bottom-up heap build is O(n).
- Array layout — zero-based children `2i + 1`, `2i + 2`; parent `floor((i - 1) / 2)`.
- Top-k largest — a size-k min-heap; O(n log k).
- Priority queue — the next item by priority; full sorting is not guaranteed.
- Stale entry — after a priority update, skip the old queue entry when it is popped.
- Tie-breaker — define a deterministic order for equal priorities.
- K-way merge — the next candidate of every sorted source goes in the heap; O(total items × log k).
- Streaming median — the lower half in a max-heap, the upper half in a min-heap; keep the sizes/order balanced.
- Arbitrary delete — locating the item needs an index map or lazy deletion.

### Heap costs

- Heap operations — push/pop O(log n); arbitrary lookup O(n); a bottom-up heap build O(n).

### Edge cases and reasoning

- Heap versus sorted array — the root is the minimum, but the rest of the array is not fully sorted; a binary search for an arbitrary lookup is not valid.
- Top-k bound — define the contract for k>n, k=0 and duplicate ranking; if the result must be sorted, count the additional O(k log k) work.
- Priority mutation — changing an object's priority inside the heap does not restore the invariant automatically; update-key/reinsert plus a stale guard is needed.

## Understand it with an example

- Scenario — For the top 2 largest, use the stream `[5,1,8,3]` and a size-2 min-heap.
- Reasoning — 5,1 give the candidates {1,5}; 8 replaces the root 1: {5,8}; 3 is discarded. The root 5 is the smallest of the retained values, and the final top 2 are 5 and 8.
- Catch — A heap array is not a sorted result; if ordered output is needed, add the separate extraction/sort cost. Handle k=0 before accessing the root.

## Recall and practice

- Question — Why is a bottom-up heap build not O(n log n), like doing n inserts of O(log n)?
- Answer — Most nodes sit at a low height; the sum of their sift-down work is O(n), and the per-node worst bound is not a tight total.
- Try it yourself — Trace a top-3 stream with duplicates; verify heap size<=3, correct membership, the cost of sorted output and the handling of a changed priority.

## Practice questions

### Easy · Heap array layout

What are the parent and children of index `i` (0-based)? What is the min-heap property?

<details>
<summary>Answer</summary>

- Parent — `Math.floor((i − 1) / 2)`; children — `2i + 1`, `2i + 2`.
- Min-heap — every parent is `<=` its children; the root is the minimum.
- Not sorted — there is no order between siblings.
- Costs — peek `O(1)`, push/pop `O(log n)`.

</details>

### Medium · Implement a MinHeap

JS has no built-in priority queue. Write a MinHeap with `push`, `pop`, `peek` and `size`.

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

- Push — put it at the end, then bubble it up.
- Pop — take the root, move the last item to the root and sift it down.
- Comparator — for objects/priorities; a tie-breaker gives a deterministic order.

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

- Size-k min-heap — the root = the current k-th largest; smaller elements leave immediately.
- Complexity — `O(n log k)` time, `O(k)` space; a full sort is `O(n log n)`.
- Streaming — it works even when the data is not all in memory at once.

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

- Only the current head of each list is in the heap — size `k`.
- Complexity — `O(N log k)` (N = total elements).

</details>

### Hard · Streaming median

Numbers arrive one at a time; the median is needed at every step.

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
    this.high.push(this.low.pop());           // move the max of low into high
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

- Invariant — every element of `low` is `<=` those of `high`; the sizes are equal or `low` has one more.
- Costs — add `O(log n)`, median `O(1)`.

</details>

## Sources — further reading

- [Princeton's priority queues chapter](https://algs4.cs.princeton.edu/24pq/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/10-heaps-and-priority-queues.md)
