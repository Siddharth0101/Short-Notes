---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 1
summary: Class — object ka type/behavior; object — actual instance.
tags: fundamentals, java, classes, constructors
---

## Quick revision

- Class — object ka type/behavior; object — actual instance.
- Constructor — object initialize; return type nahi hota.
- `this` — current object; `this(...)` — same class ka constructor call.
- Instance field — har object ka data; static field — class-level shared data.
- Encapsulation — fields private rakho, methods se valid changes karao.
- Constructor rule — invalid input par invalid object banne se pehle fail karo.
- Default constructor — khud constructor likhne par auto no-arg constructor nahi milta.
- Constructor chaining — this(...) se shared initialization; constructor cycle allowed nahi.
- Object alias — same reference share ho toh mutation dono callers ko dikh sakti hai.
- Static counter — all instances share karte hain; concurrent updates coordinate karo.

## Sources — aur padhne ke liye

- [Dev.java classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/04-java-classes-constructors.md)
