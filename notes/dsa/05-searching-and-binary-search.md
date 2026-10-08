---
id: dsa-searching
title: Searching and binary search boundaries
track: dsa
order: 5
level: Intermediate
minutes: 3
summary: Linear search — unsorted data scan; O(n).
tags: linear-search, binary-search, lower-bound, strings
visual: binary-search
---

## Quick revision

- Linear search — unsorted data scan; O(n).
- Binary search — sorted range ya monotonic predicate; O(log n) decisions.
- Invariant — answer kis interval mein ho sakta hai, pehle define karo.
- Mid — `lo + floor((hi - lo) / 2)`.
- Lower bound — pehla index jahan value target se chhoti nahi.
- Upper bound — pehla index jahan value target se badi.
- Duplicates — any match aur first/last match alag contracts.
- Answer search — feasible/infeasible monotonic boundary par search karo.
- Termination — har branch interval shrink kare; empty range handle karo.
- Overflow-safe answer — numeric search range chosen number type mein fit honi chahiye.
- Rotated search — sorted half identify; duplicates decision ambiguous karke worst cost badha sakte hain.
- Predicate cost — answer search O(log range × feasibility-check cost).

### String search

- Naive substring search — har start par pattern compare; worst O(nm).
- KMP — prefix table se repeated comparison bachta hai; O(n + m).
- KMP fallback — mismatch par matched prefix reuse; text pointer unnecessarily reset nahi.

### Edge cases aur reasoning

- Half-open search — [lo,hi) mein hi excluded; lower_bound ka missing answer n ho sakta, n-index dereference mat karo.
- Feasibility direction — predicate false→true ya true→false identify; boundary updates us direction aur answer contract se match karo.
- Progress arithmetic — midpoint round/update combination infinite loop na kare; two-element interval dry-run essential hai.

## Recall aur practice

- Sawal — Sorted [1,2,2,4] mein lower_bound(2), upper_bound(2) aur count?
- Jawaab — 1, 3 aur 2; half-open equal range [1,3) hai.
- Khud try karo — Lower/upper bound likho; empty array, all duplicates, target below/above range aur two-element interval termination verify karo.

## Sources — aur padhne ke liye

- [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Princeton binary search](https://algs4.cs.princeton.edu/11model/BinarySearch.java.html)
- [substring search](https://algs4.cs.princeton.edu/53substring/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/05-searching-and-binary-search.md)
