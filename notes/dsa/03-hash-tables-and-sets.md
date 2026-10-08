---
id: dsa-hashing
title: Hash tables maps and sets
track: dsa
order: 3
level: Intermediate
minutes: 3
summary: Hash table — key ko bucket mein map; collision handling zaroori.
tags: hashing, map, set, collisions, two-sum
---

## Quick revision

- Hash table — key ko bucket mein map; collision handling zaroori.
- Lookup — expected O(1); worst-case guarantee blindly mat bolo.
- Collision — chaining ya probing se multiple keys handle karo.
- Load factor — entries/capacity; zyada ho toh resize/probe cost badhta hai.
- Map — key/value lookup; Set — membership/uniqueness.
- Object key — JS Map mein identity se compare; equal-looking objects alag keys.
- Canonical key — composite identity encode karte waqt collisions avoid karo.
- LRU — hash map + doubly linked list se lookup/recency updates O(1).
- Resize — rehash ek operation expensive; growing table ka amortized insertion cost alag.
- Frequency map — presence se zyada multiplicity chahiye, toh boolean Set enough nahi.
- Hash/equality — equal keys ko compatible hashes; collision ko unequal key ka proof mat samjho.

### Edge cases aur reasoning

- Probing deletion — open addressing mein deleted slot tombstone rakhe; empty karne se later collided key search prematurely ruk sakti.
- LRU update — existing key overwrite par recency refresh; capacity zero aur eviction ke map/list consistency ka explicit contract.
- Composite identity — delimiter-only concatenation ambiguous ho sakti; length-prefix/structured serialization se distinct tuples preserve karo.

## Research notes: Expected and amortized are different guarantees

- Capacity double karne par resizing ka work bahut saare inserts mein spread hota hai.

## Recall aur practice

- Sawal — Set se anagram characters compare karna repeated letters ke liye kyun wrong?
- Jawaab — Set multiplicity lose karta; aab aur abb ka same character set hai par frequencies different.
- Khud try karo — Frequency-map anagram checker aur capacity-2 LRU banao; duplicates, overwrite refresh, zero capacity aur evicted lookup verify karo.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)
- [Princeton's hash tables chapter](https://algs4.cs.princeton.edu/34hash/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/03-hash-tables-and-sets.md)
