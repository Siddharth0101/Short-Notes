---
id: dsa-patterns
title: Frequency counters and pointer patterns
track: dsa
order: 4
level: Foundation
minutes: 1
summary: Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
tags: frequency-counter, two-pointers, sliding-window, prefix-sum
---

## Quick revision

- Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
- Two pointers — ordered/partitioned structure par boundaries move karo.
- Sliding window — contiguous range ko incremental add/remove se maintain karo.
- Variable window — shrink condition valid honi chahiye; negative sums monotonicity tod sakte hain.
- Prefix sum — range sum `prefix[r + 1] - prefix[l]`.
- Prefix map — previous sums count karke target-sum subarrays nikalo.
- Invariant — pointer/window move ke baad jo rule true rehta hai.
- Dry run — duplicates, empty input aur exact boundary check karo.
- Difference array — range updates mark karke prefix accumulation se final values nikalo.
- Sorted two-sum — low sum par left badhao, high sum par right ghatao.
- Permutation window — same length ke window mein required character frequencies match karo.

## Sources — aur padhne ke liye

- [ECMAScript keyed collections](https://tc39.es/ecma262/multipage/keyed-collections.html)
- [MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/04-problem-solving-patterns.md)
