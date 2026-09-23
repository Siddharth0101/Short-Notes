---
id: js-this-prototypes-classes
title: This binding prototypes and classes
track: javascript
order: 13
level: Intermediate
minutes: 1
summary: Regular `this` — function kaise call hua usse decide hota hai.
tags: this, prototype, classes, oop, inheritance
---

## Quick revision

- Regular `this` — function kaise call hua usse decide hota hai.
- Arrow `this` — surrounding scope se aata hai; `call`/`bind` se change nahi hota.
- Detached method — `const f = obj.method` receiver kho deta hai.
- `call` — args alag; `apply` — args array-like; `bind` — naya bound function.
- Prototype — missing property prototype chain mein search hoti hai.
- Class — prototype-based object creation ka syntax; methods prototype par hote hain.
- `new` — object banata, prototype jodta aur constructor call karta hai.
- `extends`/`super` — inheritance; derived constructor mein `this` se pehle `super()`.
- Own property — `Object.hasOwn()` inherited property ko include nahi karta.
- Private field — `#name` class ke bahar directly accessible nahi.

## Sources — aur padhne ke liye

- [MDN working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/13-this-prototypes-classes.md)
