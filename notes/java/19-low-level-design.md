---
id: java-low-level-design
title: Low-level design — requirements se classes aur invariants tak
track: java
order: 19
level: Advanced
minutes: 1
summary: LLD — requirements ko objects, responsibilities aur contracts mein badlo.
tags: lld, oop, design, concurrency, contracts
---

## Quick revision

- LLD — requirements ko objects, responsibilities aur contracts mein badlo.
- Invariant — business rule har valid operation ke baad bache.
- SRP — class ki ek clear responsibility/change reason.
- Open/closed — extension points do; har change ke liye giant switch na badhao.
- Liskov — subtype base contract na tode.
- Strategy — interchangeable behavior; factory — creation ka decision.
- Composition — inheritance se pehle delegation consider karo.
- Concurrency — shared invariant ko atomic boundary ke andar enforce karo.
- Testing — public behavior aur failure paths verify karo.
- Interface segregation — client ko unnecessary methods implement/use karne par force mat karo.
- State machine — allowed transitions explicit; invalid order of operations reject karo.
- Composition root — dependencies ek clear assembly point par wire karo.

## Sources — aur padhne ke liye

- [ConcurrentHashMap atomic operations](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Clock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Clock.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/19-low-level-design.md)
