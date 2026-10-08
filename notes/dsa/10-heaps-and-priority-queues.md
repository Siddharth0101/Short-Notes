---
id: dsa-heaps
title: Heaps and priority queues
track: dsa
order: 10
level: Intermediate
minutes: 3
summary: Heap — complete binary tree with parent-child priority rule.
tags: heap, priority-queue, top-k, heapify
---

## Quick revision

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

## Recall aur practice

- Sawal — Bottom-up heap build n times O(log n) insert karne jaisa O(n log n) kyun nahi?
- Jawaab — Most nodes low height par hain; sum of their sift-down work O(n), per-node worst bound tight total nahi.
- Khud try karo — Top-3 stream with duplicates trace karo; heap size<=3, correct membership, sorted-output cost aur changed priority handling verify karo.

## Sources — aur padhne ke liye

- [Princeton's priority queues chapter](https://algs4.cs.princeton.edu/24pq/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/10-heaps-and-priority-queues.md)
