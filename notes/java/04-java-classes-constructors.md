---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 3
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

### Constructor behavior

- `super` — superclass member/constructor access; overridden method ko explicit call.
- Initializer — field/block initialization constructor lifecycle ka part.

### Class members

- Static dispatch — static method class/reference type se select; instance overriding jaisa dispatch nahi.

### Edge cases aur reasoning

- Safe construction — constructor se this publish ya overridable method call avoid; subclass/state fully initialized nahi ho sakti.
- Defensive ownership — mutable collection constructor mein receive karo toh owned copy lo; external mutation invariant ko bypass na kare.
- Final field limit — final reference reassign nahi hota; referenced collection ke contents ab bhi mutable ho sakte hain.

## Recall aur practice

- Sawal — private final List<String> field automatically immutable object banata hai?
- Jawaab — Nahi; reference fixed hai, list mutable ho sakti hai. Defensive copy aur controlled exposure chahiye.
- Khud try karo — Course class banao; external list modification internal students ko na badle, invalid student reject aur instances independent verify karo.

## Sources — aur padhne ke liye

- [Dev.java classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/04-java-classes-constructors.md)
