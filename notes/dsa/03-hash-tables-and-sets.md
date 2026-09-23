---
id: dsa-hashing
title: Hash tables maps and sets
track: dsa
order: 3
level: Intermediate
minutes: 1
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

## Research notes: Expected and amortized are different guarantees

- Capacity double karne par resizing ka work bahut saare inserts mein spread hota hai.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)
- [Princeton's hash tables chapter](https://algs4.cs.princeton.edu/34hash/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/03-hash-tables-and-sets.md)
