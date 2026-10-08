---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 3
summary: Variable — value ko diya hua naam.
tags: fundamentals, js, variables
---

## Quick revision

- Variable — value ko diya hua naam.
- `var` — function-scoped; dobara declare aur assign kar sakte ho.
- `let` — block-scoped; value dobara assign kar sakte ho.
- `const` — block-scoped; binding reassign nahi hoti, object ki properties badal sakti hain.
- TDZ — `let`/`const` ko declaration se pehle padho toh `ReferenceError`.
- Hoisting — `var` declaration se pehle `undefined` milta hai; assigned value nahi.
- `=` — right side calculate karo, phir left variable mein rakho.
- Primitive copy — `let b = a` ke baad `a` badalne se `b` nahi badalta.
- Naming — `score` aur `Score` alag; naam digit se start nahi hota.
- Default — pehle `const`; reassignment chahiye toh `let`.
- Shadowing — inner scope ka same naam outer variable ko hide karta hai.
- Redeclaration — same scope mein `let`/`const` dobara declare karna error hai.
- Initialization — `let x;` ke baad undefined; `const` ko declaration par value chahiye.

### Edge cases aur reasoning

- Top-level binding — browser classic script ka var window property ban sakta; let/const aur module bindings automatically window properties nahi.
- Block lifetime — block se bahar lexical naam unavailable; reachable closure us binding ko phir bhi retain kar sakta hai.
- Undeclared assignment — strict mode mein missing declaration par ReferenceError; accidental globals se bacho.

## Recall aur practice

- Sawal — const cart = []; cart.push(1) aur cart = [] mein kya farq hai?
- Jawaab — push same array mutate karta hai; reassignment const binding badalne ki koshish hai, isliye TypeError.
- Khud try karo — Ek block mein outer score shadow karo; andar/bahar output predict karo aur same-scope redeclaration ko separate snippet mein check karo.

## Sources — aur padhne ke liye

- [MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/01-js-variables.md)
