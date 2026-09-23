---
id: dsa-heaps
title: Heaps and priority queues
track: dsa
order: 10
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Princeton's priority queues chapter](https://algs4.cs.princeton.edu/24pq/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/10-heaps-and-priority-queues.md)
