---
id: dsa-patterns
title: Frequency counters and pointer patterns
track: dsa
order: 4
level: Foundation
minutes: 2
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

### Pattern choice

- Negative window — negative numbers ke saath sum-based shrink logic monotonic nahi; prefix-sum/map pattern consider.
- Prefix seed — sum zero ki initial frequency 1 rakho, taaki index zero se matching subarray count ho.
- Pointer movement — sorted order/monotonic rule prove karke left/right move; arbitrary move candidates miss kar sakta hai.

### Matrix patterns

- Matrix flatten — rectangular grid mein index = row × cols + col; row = floor(index/cols), col = index % cols.
- Matrix transpose — rows aur columns swap; rectangular input m×n se n×m banta hai.
- Matrix edges — empty, 1×1, single row aur single column par traversal dry-run karo.
- Spiral traversal — top/bottom/left/right boundaries shrink karo; single remaining row/column dobara visit mat karo.
- Square rotation — 90° clockwise ke liye transpose, phir har row reverse; rectangular output ke dimensions swap hote hain.

## Sources — aur padhne ke liye

- [Yangshun Tay — matrix cheatsheet](https://www.techinterviewhandbook.org/algorithms/matrix/)

- [ECMAScript keyed collections](https://tc39.es/ecma262/multipage/keyed-collections.html)
- [MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/04-problem-solving-patterns.md)
