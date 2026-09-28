---
id: dsa-tries-range-bits
title: Tries, bitmasks aur range queries — advanced structures ka practical bridge
track: dsa
order: 14
level: Advanced
minutes: 2
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
- Coordinate compression — sparse ordered values ko dense ranks; actual distance separately retain karo.
- Prefix trie terminal — word ending marker chahiye; path exist hona complete word ka proof nahi.
- Segment merge — associative operation required; empty-range identity compatible honi chahiye.

### Advanced patterns

- Sweep line — sorted event boundaries process; same-coordinate tie policy define karo.
- Rolling hash — sliding substring fingerprint; collision possible, zaroorat par equality verify.

### Bit tricks

- Kth bit toggle — zero-based k par `mask ^ (1 << k)` bit flip karta hai; integer width ka dhyaan rakho.
- Power of two — positive n ke liye `(n & (n - 1)) === 0`; zero ko pehle exclude karo.
- Bitwise precedence — bit test `(n & (1 << k)) !== 0` likho; parentheses hataane se comparison pehle evaluate ho sakta hai.

## Sources — aur padhne ke liye

- [Yangshun Tay — binary cheatsheet](https://www.techinterviewhandbook.org/algorithms/binary/)

- [Princeton tries](https://algs4.cs.princeton.edu/52trie/)
- [CMU Fenwick problem](https://www.cs.cmu.edu/~eugene/teach/acm10b/prob/101013.pdf)
- [MDN bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/14-tries-range-bits.md)
