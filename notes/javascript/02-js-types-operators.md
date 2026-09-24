---
id: js-types-operators
title: Value types operators and explicit conversion
track: javascript
order: 2
level: Foundation
minutes: 2
summary: Primitive types — string, number, boolean, undefined, null, bigint aur symbol.
tags: fundamentals, js, types, operators
---

## Quick revision

- Primitive types — string, number, boolean, undefined, null, bigint aur symbol.
- Object — properties wala reference value; arrays aur functions bhi objects hain.
- `undefined` — value assign nahi hui; `null` — jaan-boojhkar empty value.
- `typeof null` — `"object"` aata hai; yeh purana language quirk hai.
- `===` — type conversion bina equality; `==` conversion kar sakta hai.
- `+` — string operand ho toh concatenation ho sakti hai: `"5" + 2` → `"52"`.
- Conversion — `Number("5")` → `5`; `Number("abc")` → `NaN`.
- Falsy — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`; `[]` aur `{}` truthy.
- `??` — sirf null/undefined par fallback; `||` har falsy value par fallback.
- `NaN` — `Number.isNaN(value)` se check karo; `NaN === NaN` false hai.
- `Object.is` — NaN ko itself equal, lekin +0 aur -0 ko different maanta hai.
- Boolean conversion — `Boolean("false")` true; non-empty string truthy hoti hai.
- Operator precedence — multiply pehle, add baad mein; doubt ho toh parentheses lagao.

## Sources — aur padhne ke liye

- [MDN expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/02-js-types-operators.md)
