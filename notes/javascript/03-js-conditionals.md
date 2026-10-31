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

> Revision target — Business rule ko boolean branches mein todo; valid zero aur missing value ko alag handle karo.

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

## Example se samjho

```js
function deliveryFee(total, isMember) {
  if (!Number.isFinite(total) || total < 0) return "invalid";
  if (isMember || total >= 500) return 0;
  return 40;
}
```

- Trace — invalid input pehle exit; valid input mein membership ya minimum total free delivery deta hai.
- Boundary — totals `499`, `500` aur `0` ko non-member ke saath check karo; expected fees `40`, `0`, `40` hain.
- Catch — rule yahan numeric total aur boolean membership assume karta hai; form ke raw strings pehle validate karo.

## Recall aur practice

- Sawal — price = 0 ho toh price ? price : 100 free item ko kaise treat karega?
- Jawaab — Zero falsy hai, result 100; missing price aur valid zero ke liye nullish check chahiye.
- Khud try karo — Shipping rule likho: missing total reject, total >= 500 free, otherwise 40; 0, 499, 500 aur undefined verify karo.

## Practice questions

### Easy · Truthy values gino

```js
const values = [0, '0', [], '', null, NaN, {}];
console.log(values.filter(Boolean).length);
```

<details>
<summary>Answer</summary>

- Output — `3`.
- Truthy — `'0'`, `[]`, `{}` (non-empty string aur har object truthy).
- Falsy — `0`, `''`, `null`, `NaN` (plus `false`, `undefined`, `0n`, `-0`).

</details>

### Easy · Grade function ka bug

```js
function grade(score) {
  if (score >= 50) return 'C';
  else if (score >= 75) return 'B';
  else if (score >= 90) return 'A';
  return 'F';
}
console.log(grade(95));
```

<details>
<summary>Answer</summary>

- Output — `C`; pehli true condition jeet jaati hai, baaki check hi nahi hoti.
- Fix — sabse strict condition pehle: `>= 90`, phir `>= 75`, phir `>= 50`.
- Boundary tests — `49, 50, 74, 75, 89, 90`; invalid input (`NaN`, `-1`, `101`) ka policy bhi decide karo.

</details>

### Medium · `switch` fall-through

```js
function label(day) {
  switch (day) {
    case 'sat':
    case 'sun':
      return 'weekend';
    case 'fri':
      console.log('almost');
    default:
      return 'weekday';
  }
}
console.log(label('fri'));
```

<details>
<summary>Answer</summary>

- Output — pehle `almost`, phir `weekday`.
- Kyun — `case 'fri'` mein `break`/`return` nahi, isliye execution `default` tak gir jaata hai.
- Note — `'sat'`/`'sun'` wala intentional fall-through hai; galti wala nahi. `switch` `===` se compare karta hai.

</details>

### Medium · Optional chaining aur logical assignment

```js
const config = { retry: 0, user: null };
config.retry ||= 3;
config.timeout ??= 1000;
console.log(config.retry, config.timeout, config.user?.name, config.user?.name.length);
```

<details>
<summary>Answer</summary>

- Output — `3 1000 undefined undefined`.
- `||=` — `0` falsy hai, isliye overwrite; `0` valid ho toh `??=` lo.
- `?.` short-circuit — `user` null hai toh poori chain `undefined` deti hai; `.length` evaluate hi nahi hota.
- Catch — `(config.user?.name).length` likha toh brackets chain todte hain → `TypeError`.

</details>

### Hard · Nested ifs ko guard clauses mein badlo

```js
function shippingFee(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.country === 'IN') {
        if (order.total >= 500) return 0;
        else return 40;
      } else {
        return 250;
      }
    } else {
      return 0;
    }
  }
}
```

Refactor karo aur test cases batao.

<details>
<summary>Answer</summary>

```js
function shippingFee(order) {
  if (!order || !Array.isArray(order.items)) throw new TypeError('order required');
  if (order.items.length === 0) return 0;
  if (order.country !== 'IN') return 250;
  return order.total >= 500 ? 0 : 40;
}
```

- Guard clauses — invalid/edge cases pehle return, main path flat rehta hai.
- Behaviour change — original `null` par silently `undefined` deta tha; ab explicit error. Yeh decision callers ke saath confirm karo.
- Cases — `null`, empty items, `'US'`, `'IN'` + 499, `'IN'` + 500.

</details>

## Sources — aur padhne ke liye

- [MDN optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

- [MDN control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/03-js-conditionals.md)
