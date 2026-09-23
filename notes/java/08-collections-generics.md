---
id: java-collections-generics
title: Collections generics and choosing data structures
track: java
order: 8
level: Intermediate
minutes: 1
summary: List — ordered, duplicates allowed; Set — unique; Map — key/value pairs.
tags: collections, generics, hashmap, pecs
---

## Quick revision

- List — ordered, duplicates allowed; Set — unique; Map — key/value pairs.
- ArrayList — indexed access fast; middle insert/delete shifting maangta hai.
- LinkedList — node operations useful; random access O(n).
- HashMap — expected O(1) lookup; thread-safe nahi.
- TreeMap — sorted keys; operations O(log n).
- Generics — compile-time type safety; raw types se bacho.
- PECS — producer `extends`, consumer `super`.
- Comparator — consistent ordering define; subtraction overflow se bacho.
- Concurrent collection — thread-safe operations; multi-step invariants phir bhi design karo.

## Research notes: A read-only view is not an immutable snapshot

- Wrapper apne interface se changes rokta hai, lekin backing list change hogi toh view mein woh change dikhega.

## Sources — aur padhne ke liye

- [Generics tutorial](https://dev.java/learn/generics/)
- [Source — Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List))
- [Collections framework](https://dev.java/learn/api/collections-framework/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/08-collections-generics.md)
