---
id: dsa-searching
title: Searching and binary search boundaries
track: dsa
order: 5
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Princeton binary search](https://algs4.cs.princeton.edu/11model/BinarySearch.java.html)
- [substring search](https://algs4.cs.princeton.edu/53substring/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/05-searching-and-binary-search.md)
