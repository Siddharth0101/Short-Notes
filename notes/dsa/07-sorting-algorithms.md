---
id: dsa-sorting
title: Sorting from elementary methods to divide and conquer
track: dsa
order: 7
level: Intermediate
minutes: 3
summary: Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
tags: sorting, merge-sort, quick-sort, radix-sort, stability
visual: sorting
---

## Quick revision

- Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
- Selection sort — minimum select; O(n²), generally unstable.
- Insertion sort — sorted prefix mein insert; O(n²), nearly sorted input par useful.
- Merge sort — split + merge; O(n log n), array version extra O(n) space.
- Quicksort — partition + recurse; average O(n log n), worst O(n²).
- Three-way partition — less/equal/greater regions; duplicates ke liye useful.
- Heap sort — O(n log n), typical array version O(1) extra space.
- Radix/counting — key range/digits ki assumptions par depend karte hain.
- Quickselect — kth item; expected O(n), worst O(n²).
- Stability — equal-key items ka original order bachta hai.
- Comparator — consistent ordering; JS numeric sort mein `(a, b) => a - b`.
- Inversions — merge ke waqt cross inversions count; O(n log n).
- Comparison lower bound — arbitrary comparison sorting worst-case Ω(n log n); restricted-key algorithms different assumptions use karte hain.
- Stable merge — equal keys par left item pehle lo toh original order preserve kar sakte ho.
- Pivot choice — randomized pivot adversarial pattern risk kam; worst-case bound automatically remove nahi hota.

### Selection aur memory

- Quickselect cost — expected O(n), worst O(n²); pivot strategy matter karti hai.
- Sort memory — merge sort usually O(n) auxiliary; quicksort recursion depth balanced O(log n), worst O(n).

### Edge cases aur reasoning

- Counting sort bound — integer range k ke saath O(n+k) time/space; sparse huge values par range allocation unsuitable.
- Quicksort partition contract — Hoare/Lomuto boundaries different; recursion intervals ko chosen partition return meaning se match karo.
- Stable multi-key ordering — secondary order preserve karke primary stable sort composite ordering de sakta; comparator tuple contract clearer ho sakta.

## Recall aur practice

- Sawal — Numeric [10,2,1] par JS default sort versus numeric comparator ka output?
- Jawaab — Default string order [1,10,2]; numeric comparator [1,2,10]. Default sort original array bhi mutate karta hai.
- Khud try karo — Sort result verify karo; ordered output, preserved multiplicities, stability contract aur all-equal pivot case ki termination check karo.

## Sources — aur padhne ke liye

- [Princeton sorting reference](https://algs4.cs.princeton.edu/cheatsheet/)
- [MDN Array sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/07-sorting-algorithms.md)
