---
id: java-object-model
title: Objects OOP records and equality
track: java
order: 7
level: Foundation
minutes: 1
summary: Inheritance — subclass superclass ka behavior extend karti hai.
tags: oop, records, equality, interfaces
---

## Quick revision

- Inheritance — subclass superclass ka behavior extend karti hai.
- Overriding — compatible method redefine; runtime object se dispatch.
- Overloading — argument types/list se compile-time selection.
- Composition — has-a relation; behavior delegate karo.
- `equals`/`hashCode` — equal objects ke hash codes equal hone chahiye.
- Mutable map key — hash-relevant field badla toh lookup toot sakta hai.
- Record — data carrier; referenced mutable objects deep-immutable nahi hote.
- Defensive copy — mutable input/output share na karo jab immutability chahiye.
- Equality contract — reflexive, symmetric, transitive aur consistent behavior rakho.
- Final class — subclass nahi ban sakti; existing instance data automatically immutable nahi.
- Object copy — shallow clone/copy ke nested references shared ho sakte hain.

## Sources — aur padhne ke liye

- [Object API contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Records](https://dev.java/learn/records/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/07-object-model.md)
