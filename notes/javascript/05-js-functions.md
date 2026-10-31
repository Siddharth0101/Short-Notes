---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 3
summary: Function — reusable kaam; inputs lo aur result return karo.
tags: fundamentals, js, functions
---

## Quick revision

> Revision target — Function ka input, returned result aur side effect alag batao; caller ko kya badlega predict karo.

- Function — reusable kaam; inputs lo aur result return karo.
- Parameter — definition ka naam; argument — call ki actual value.
- `return` — result deta hai aur function se turant bahar nikalta hai.
- No return — normal function ka result `undefined` hota hai.
- `console.log` — screen par dikhata hai; caller ko result return nahi karta.
- Default parameter — argument missing/undefined ho tab default lagta hai.
- Function declaration — apne scope mein declaration se pehle call ho sakti hai.
- Arrow — concise function; apna `this` nahi hota.
- Pure function — same input par same output; outside state change nahi karti.
- Rest parameter — `(...args)` extra arguments ko array mein collect karta hai.
- Higher-order function — function ko input le ya function return kare.
- Early return — `return` ke baad same function ka remaining code skip hota hai.

### Function style

- Declarative — desired transformation bolo; unnecessary mutation se bacho.
- Function expression — initialization se pehle call nahi; const/let TDZ aur var undefined ka behavior alag.
- IIFE — function define karke turant call; isolated setup/scope ke liye.
- Currying — f(a, b) ko f(a)(b) jaise staged calls mein badlo.
- Callback — function ko baad mein invoke karne ke liye pass karo; fn aur fn() alag.

### Edge cases aur reasoning

- Argument mutation — object property update caller ko dikhti hai; local parameter ko reassign karna caller binding nahi badalta.
- Arrow object return — () => ({id: 1}) object return karta hai; braces bina parentheses function body samjhi jaati hain.
- Default with null — f(x = 5) mein f(undefined) default leta hai; f(null) null rakhta hai.

## Example se samjho

```js
function addItem(items, item) {
  return [...items, item];
}
const original = ["JS"];
const updated = addItem(original, "React");
console.log(original.length, updated.length); // 1 2
```

- Contract — function naya outer array return karti hai; caller ko replacement explicitly use karna hoga.
- Catch — array ke andar objects hon toh unke references abhi shared hain; yeh deep clone nahi hai.
- Check — result ignore karne par original unchanged rahe; missing return wale variant se `undefined` milega.

## Recall aur practice

- Sawal — function reset(x) { x = []; } caller ki array ko empty kyun nahi karta?
- Jawaab — Parameter local binding hai; reassign se caller reference nahi badalta. Mutation ya returned replacement ka explicit contract do.
- Khud try karo — Pure calculateTotal(items, taxRate) likho; default tax, empty items, invalid price aur inputs unchanged check karo.

## Practice questions

### Easy · Arrow function ka missing return

```js
const double = (n) => { n * 2 };
const makeUser = () => { name: 'Asha' };
console.log(double(4), makeUser());
```

<details>
<summary>Answer</summary>

- Output — `undefined undefined`.
- `double` — `{}` block body hai; explicit `return` chahiye ya `(n) => n * 2`.
- `makeUser` — `{ name: ... }` block + label ban gaya; object return ke liye `() => ({ name: 'Asha' })`.

</details>

### Easy · Default parameter kab lagta hai?

```js
function greet(name = 'Guest') {
  return `Hi ${name}`;
}
console.log(greet(), greet(undefined), greet(null), greet(''));
```

<details>
<summary>Answer</summary>

- Output — `Hi Guest`, `Hi Guest`, `Hi null`, `Hi ` (empty).
- Rule — default sirf missing ya `undefined` argument par lagta hai.
- `null` bhi handle karna ho — `name ?? 'Guest'` function body mein likho.

</details>

### Medium · Declaration vs expression hoisting

```js
console.log(add(2, 3));
console.log(sub(5, 1));
function add(a, b) { return a + b; }
const sub = function (a, b) { return a - b; };
```

<details>
<summary>Answer</summary>

- Pehla log — `5`; function declaration poori hoist hoti hai.
- Doosra — `ReferenceError`; `sub` ek `const` binding hai jo TDZ mein hai.
- `var sub` hota toh — `TypeError: sub is not a function` (value `undefined`).

</details>

### Medium · Argument ko mutate karna

```js
function addTag(user, tag) {
  user.tags.push(tag);
  user = { tags: [] };
  return user;
}
const u = { tags: ['a'] };
const result = addTag(u, 'b');
console.log(u.tags, result.tags);
```

<details>
<summary>Answer</summary>

- Output — `['a', 'b']` aur `[]`.
- Kyun — JS reference ki copy pass karta hai; `push` shared object badalta hai, par `user = ...` sirf local parameter ko re-point karta hai.
- Pure version — `return { ...user, tags: [...user.tags, tag] };` caller ka data safe rehta hai.

</details>

### Hard · `curry` implement karo

`curry(fn)` likho taaki `curry(add3)(1)(2)(3)`, `curry(add3)(1, 2)(3)` aur `curry(add3)(1, 2, 3)` sab `6` dein.

<details>
<summary>Answer</summary>

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
const add3 = (a, b, c) => a + b + c;
```

- Base case — collected args `fn.length` (declared params) tak pahunch jaayein toh call.
- Closure — har partial call `args` yaad rakhta hai; naya array banta hai, shared mutation nahi.
- Catch — `fn.length` default/rest params se pehle tak hi count karta hai; aise functions ke liye arity explicitly pass karo.

</details>

## Sources — aur padhne ke liye

- [MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/05-js-functions.md)
