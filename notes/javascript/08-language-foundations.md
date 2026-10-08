---
id: js-language-foundations
title: Foundations checkpoint and reliable input handling
track: javascript
order: 8
level: Foundation
minutes: 3
summary: Expression — value banata hai; statement — instruction chalata hai.
tags: variables, types, coercion, functions, fundamentals
---

## Quick revision

- Expression — value banata hai; statement — instruction chalata hai.
- Strict mode — silent mistakes ke kuch cases errors ban jaate hain.
- Primitive — immutable value; variable ko nayi value assign ho sakti hai.
- Object — properties mutate ho sakti hain; assignment reference value copy karta hai.
- Pass-by-value — JS arguments values hain; object argument ki value reference hoti hai.
- Coercion — implicit type conversion; boundary par explicit conversion clearer hai.
- Short-circuit — `&&`, `||`, `??` zaroorat padne par hi right side evaluate karte hain.
- Destructuring default — sirf `undefined` par lagta hai, `null` par nahi.
- Equality — `Object.is(NaN, NaN)` true; `Object.is(0, -0)` false.
- `in` operator — own aur inherited properties dono check karta hai.
- Automatic semicolon — `return` ke turant baad newline unexpected undefined de sakti hai.
- `delete` — object property hataata hai; array slot delete karne se length shrink nahi hoti.

### Edge cases aur reasoning

- Error handling — throw failure propagate karta hai; catch recover ya meaningful rethrow kare, error silently swallow mat karo.
- Finally control flow — finally ka return/throw earlier return/error override kar sakta hai; cleanup ko outcome-changing logic se bachao.
- Strict scope — ES modules/classes automatically strict; script behavior compare karte waqt execution context specify karo.

## Recall aur practice

- Sawal — try mein return 1 aur finally mein return 2 ho toh caller ko kya milega?
- Jawaab — 2; finally ka control flow previous return replace karta hai, isliye cleanup block mein return avoid karo.
- Khud try karo — Validated divide(a,b) likho; zero divisor, non-number aur normal result cover karo, caller ko meaningful error dikhao.

## Sources — aur padhne ke liye

- [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/08-language-foundations.md)
