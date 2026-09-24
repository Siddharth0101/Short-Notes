---
id: dsa-complexity
title: Complexity and problem solving
track: dsa
order: 1
level: Foundation
minutes: 1
summary: Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
tags: big-o, complexity, problem-solving, invariants
---

## Quick revision

- Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
- O(1) — constant; O(log n) — range shrink; O(n) — single scan.
- O(n log n) — efficient comparison sorts; O(n²) — many pairwise scans.
- Space — auxiliary memory aur recursion stack count karo.
- Worst/average/amortized — alag guarantees; interchangeable nahi.
- Amortized — operations ki sequence ka total cost average karo.
- Recursion — calls × per-call work; stack depth bhi count karo.
- Solve — constraints → brute force → bottleneck → invariant → optimize.
- JS trap — `shift`, `slice`, spread aur string copies ka cost mat bhoolo.
- Independent inputs — two lists sizes n,m hon toh O(n+m); blindly O(n) mat bolo.
- Log base — constant bases Big-O mein equivalent; repeated halving logarithmic growth deta hai.
- Output space — result materialize karna required ho toh minimum output-size cost bhi batao.

## Sources — aur padhne ke liye

- [Princeton algorithm analysis](https://algs4.cs.princeton.edu/14analysis/)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/01-complexity-and-problem-solving.md)
