---
id: java-collections-generics
title: Collections generics and choosing data structures
track: java
order: 8
level: Intermediate
minutes: 4
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
- Iterator remove — supported iterator ka remove safe traversal deletion ke liye use karo.
- Unmodifiable view — writes block, underlying collection ke external changes phir bhi dikh sakte hain.
- Generic invariance — `List<Integer>` ko `List<Number>` assign nahi kar sakte.

### Ordering aur generic bounds

- Comparable — type ka natural order compareTo; Comparator external/custom ordering deta hai.
- Generic bound — `<T extends Number>` accepted type constrain; wildcard ? unknown compatible type represent karta hai.

### Concurrent collections

- ConcurrentHashMap — concurrent reads/writes support; multiple calls ko ek atomic transaction assume mat karo.
- CopyOnWriteArrayList — updates array copy karte hain; reads bahut zyada aur writes rare hon tab useful.
- Weakly consistent iterator — concurrent changes tolerate; exact point-in-time snapshot assume mat karo.

### Edge cases aur reasoning

- List.copyOf boundary — unmodifiable snapshot structure deta hai, null elements reject; contained mutable elements deep-copy nahi hote.
- Removal overload — List<Integer>.remove(1) index remove; remove(Integer.valueOf(1)) value remove karta hai.
- Ordering equality — sorted sets/maps comparator zero ko same key maante; equals se inconsistent ordering surprise de sakti hai.

## Research notes: A read-only view is not an immutable snapshot

- Wrapper apne interface se changes rokta hai, lekin backing list change hogi toh view mein woh change dikhega.

## Recall aur practice

- Sawal — List<Integer> [1,2,3] par remove(1) ke baad kya bachega?
- Jawaab — [1,3]; primitive int argument index overload select karta hai, value 1 remove karne ko Integer object do.
- Khud try karo — Original list, unmodifiable view aur copyOf compare karo; backing add aur element mutation ke visible effects predict karo.

## Sources — aur padhne ke liye

- [Oracle unmodifiable collections](https://docs.oracle.com/en/java/javase/21/core/creating-immutable-lists-sets-and-maps.html)

- [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html)

- [Generics tutorial](https://dev.java/learn/generics/)
- [Source — Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List))
- [Collections framework](https://dev.java/learn/api/collections-framework/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/08-collections-generics.md)
