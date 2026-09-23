---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 1
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

## Sources — aur padhne ke liye

- [MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/01-js-variables.md)
