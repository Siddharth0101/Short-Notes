---
id: js-conditionals
title: Decisions with if else and boolean logic
track: javascript
order: 3
level: Foundation
minutes: 3
summary: `if` — condition truthy ho toh block chalta hai.
tags: fundamentals, js, conditionals
---

## Quick revision

- `if` — condition truthy ho toh block chalta hai.
- `else if` — pehli matching branch chalti hai; baaki skip.
- `else` — koi condition match na ho toh fallback.
- `&&` — pehla falsy ya last operand return; `||` — pehla truthy ya last operand.
- `!` — truthiness ko ulta boolean banata hai.
- Ternary — `condition ? yes : no`; chhoti value selection ke liye.
- `switch` — cases strict equality se match; fall-through rokne ko `break`.
- Boundary — `age >= 18` mein 18 included hai; 17, 18, 19 se check karo.
- Guard clause — invalid/finished case par early return; nesting kam hoti hai.
- Optional value — `user?.age ?? 0` missing user/age handle karta hai, valid zero bachata hai.
- Assignment trap — `if (x = 5)` assign karta hai; comparison ke liye `===`.

### Short-circuit assignment

- Logical assignment — `||=`, `&&=`, `??=` condition meet hone par hi assign.

### Edge cases aur reasoning

- Optional call — fn?.() missing function handle karta hai; present non-function value par TypeError phir bhi aata hai.
- Chain boundary — (user?.address).city nullish user par throw kar sakta hai; grouping continuous optional chain todti hai.
- Decision table — overlapping rules mein priority explicit rakho; discount/auth branches ko examples se verify karo.

## Recall aur practice

- Sawal — price = 0 ho toh price ? price : 100 free item ko kaise treat karega?
- Jawaab — Zero falsy hai, result 100; missing price aur valid zero ke liye nullish check chahiye.
- Khud try karo — Shipping rule likho: missing total reject, total >= 500 free, otherwise 40; 0, 499, 500 aur undefined verify karo.

## Sources — aur padhne ke liye

- [MDN optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

- [MDN control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/03-js-conditionals.md)
