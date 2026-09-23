---
id: dsa-tries-range-bits
title: Tries, bitmasks aur range queries — advanced structures ka practical bridge
track: dsa
order: 14
level: Advanced
minutes: 1
summary: Trie — characters/prefixes ka tree; lookup O(word length).
tags: trie, bitmask, fenwick, segment-tree
---

## Quick revision

- Trie — characters/prefixes ka tree; lookup O(word length).
- Bitmask — small set ko bits mein represent karo.
- Bit operations — set `mask | bit`, test `mask & bit`, clear `mask & ~bit`.
- JS bits — number bitwise operators 32-bit integers use karte hain; large masks carefully handle karo.
- Fenwick tree — point update/prefix sum O(log n).
- Lowbit — `i & -i`; update mein add, prefix query mein subtract.
- Range sum — prefix(r) minus prefix(l - 1).
- Segment tree — flexible range queries/updates; merge rule define karo.
- Lazy propagation — range updates ko defer karke pending tags propagate karo.

## Sources — aur padhne ke liye

- [Princeton tries](https://algs4.cs.princeton.edu/52trie/)
- [CMU Fenwick problem](https://www.cs.cmu.edu/~eugene/teach/acm10b/prob/101013.pdf)
- [MDN bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/14-tries-range-bits.md)
