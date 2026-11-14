---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 3
summary: Variable — value ko diya hua naam.
tags: fundamentals, js, variables
visual: hoisting-tdz
---

## Quick revision

> Revision target — Binding aur value ka farq samjho; reassignment, mutation aur shadowing ko alag predict karo.

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

## Example se samjho

```js
const cart = { items: 1 };
const saved = cart;
cart.items = 2;
let count = cart.items;
count = 3;
console.log(saved.items, cart.items, count); // 2 2 3
```

- Trace — `saved` aur `cart` same object tak pahunchte hain; `count` mein number ki independent copy hai.
- Catch — `const` naam ko doosre object se bind nahi kar sakte; object properties ko freeze nahi karta.
- Check — `cart = { items: 4 }` alag snippet mein chalao; assignment `TypeError` dega.

## Recall aur practice

- Sawal — const cart = []; cart.push(1) aur cart = [] mein kya farq hai?
- Jawaab — push same array mutate karta hai; reassignment const binding badalne ki koshish hai, isliye TypeError.
- Khud try karo — Ek block mein outer score shadow karo; andar/bahar output predict karo aur same-scope redeclaration ko separate snippet mein check karo.

## Practice questions

### Easy · `const` object: mutate vs reassign

```js
const user = { name: 'Asha' };
user.name = 'Ravi';     // line 2
user = { name: 'Kabir' }; // line 3
```

Kaunsi line error degi aur kyun?

<details>
<summary>Answer</summary>

- Line 3 — `TypeError: Assignment to constant variable.`
- Line 2 — chalegi; `const` sirf binding ko lock karta hai, object ke andar ki values nahi.
- Catch — object ko bhi lock karna ho toh `Object.freeze(user)`; woh bhi sirf shallow hai.

</details>

### Easy · `var` hoisting vs `let` TDZ

```js
console.log(a);
var a = 1;
console.log(b);
let b = 2;
```

<details>
<summary>Answer</summary>

- Pehla log — `undefined`; `var` declaration hoist hoke `undefined` se initialize hota hai.
- Doosra log — `ReferenceError: Cannot access 'b' before initialization`.
- Kyun — `let` bhi hoist hota hai, par declaration line tak TDZ mein rehta hai.

</details>

### Medium · Block shadowing aur redeclaration

```js
let count = 1;
{
  let count = 2;
  count++;
}
console.log(count);
```

Output kya hai? Agar dono jagah `let` ki jagah `var` likh do toh?

<details>
<summary>Answer</summary>

- `let` version — `1`; block ke andar alag `count` binding bani, outer untouched.
- `var` version — `3`; `var` block-scoped nahi, isliye dono ek hi binding hain aur redeclare allowed hai.
- Interview line — "`let`/`const` block scope dete hain; `var` function scope aur silent redeclaration deta hai."

</details>

### Medium · Undeclared assignment

```js
function setup() {
  total = 10;
}
setup();
console.log(total);
```

Normal script aur ES module (ya `'use strict'`) mein result kya hoga?

<details>
<summary>Answer</summary>

- Sloppy script — `10`; undeclared assignment accidentally global property bana deta hai.
- Module / strict mode — `ReferenceError: total is not defined`.
- Fix — `let total = 10` (ya function se value return karo); accidental globals bugs aur name clashes laate hain.

</details>

### Hard · Primitive copy vs reference copy

```js
let a = 1, b = 2;
[a, b] = [b, a];
let x = { n: 1 };
let y = x;
y.n = 5;
y = { n: 9 };
console.log(a, b, x.n, y.n);
```

<details>
<summary>Answer</summary>

- Output — `2 1 5 9`.
- Swap — destructuring right side ka naya array banata hai, isliye temp variable nahi chahiye.
- `y = x` — dono same object ko point karte hain; `y.n = 5` shared object badalta hai.
- `y = { n: 9 }` — sirf `y` ki binding naye object par gayi; `x` abhi bhi purane object (n = 5) par hai.

</details>

## Sources — aur padhne ke liye

- [MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/01-js-variables.md)
