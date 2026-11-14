---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 3
summary: Function — reusable work; take inputs and return a result.
tags: fundamentals, js, functions
---

## Quick revision

> Revision target — State a function's input, returned result and side effect separately; predict what changes for the caller.

- Function — reusable work; take inputs and return a result.
- Parameter — the name in the definition; argument — the actual value in the call.
- `return` — gives the result and exits the function immediately.
- No return — the result of a normal function is `undefined`.
- `console.log` — shows on screen; it does not return a result to the caller.
- Default parameter — the default applies when the argument is missing or undefined.
- Function declaration — can be called before its declaration within its scope.
- Arrow — a concise function; it has no `this` of its own.
- Pure function — same output for the same input; it does not change outside state.
- Rest parameter — `(...args)` collects extra arguments into an array.
- Higher-order function — takes a function as input or returns a function.
- Early return — after `return`, the remaining code of that function is skipped.

### Function style

- Declarative — state the desired transformation; avoid unnecessary mutation.
- Function expression — cannot be called before initialization; the const/let TDZ and var's undefined behave differently.
- IIFE — define a function and call it immediately; for isolated setup/scope.
- Currying — turn f(a, b) into staged calls like f(a)(b).
- Callback — pass a function to be invoked later; fn and fn() are different.

### Edge cases and reasoning

- Argument mutation — an object property update is visible to the caller; reassigning the local parameter does not change the caller's binding.
- Arrow object return — () => ({id: 1}) returns an object; without the parentheses the braces are read as a function body.
- Default with null — with f(x = 5), f(undefined) takes the default; f(null) keeps null.

## Understand it with an example

```js
function addItem(items, item) {
  return [...items, item];
}
const original = ["JS"];
const updated = addItem(original, "React");
console.log(original.length, updated.length); // 1 2
```

- Contract — the function returns a new outer array; the caller must use the replacement explicitly.
- Catch — if the array holds objects, their references are still shared; this is not a deep clone.
- Check — ignoring the result must leave the original unchanged; a variant with a missing return gives `undefined`.

## Recall and practice

- Question — Why does function reset(x) { x = []; } not empty the caller's array?
- Answer — The parameter is a local binding; reassigning it does not change the caller's reference. Give an explicit contract: mutation or a returned replacement.
- Try it yourself — Write a pure calculateTotal(items, taxRate); check the default tax, empty items, an invalid price and that the inputs stay unchanged.

## Practice questions

### Easy · The missing return in an arrow function

```js
const double = (n) => { n * 2 };
const makeUser = () => { name: 'Asha' };
console.log(double(4), makeUser());
```

<details>
<summary>Answer</summary>

- Output — `undefined undefined`.
- `double` — `{}` is a block body; it needs an explicit `return`, or write `(n) => n * 2`.
- `makeUser` — `{ name: ... }` became a block plus a label; to return an object write `() => ({ name: 'Asha' })`.

</details>

### Easy · When does a default parameter apply?

```js
function greet(name = 'Guest') {
  return `Hi ${name}`;
}
console.log(greet(), greet(undefined), greet(null), greet(''));
```

<details>
<summary>Answer</summary>

- Output — `Hi Guest`, `Hi Guest`, `Hi null`, `Hi ` (empty).
- Rule — the default applies only to a missing or `undefined` argument.
- To handle `null` as well — write `name ?? 'Guest'` in the function body.

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

- First log — `5`; a function declaration is hoisted in full.
- Second — `ReferenceError`; `sub` is a `const` binding that is in the TDZ.
- If it were `var sub` — `TypeError: sub is not a function` (the value is `undefined`).

</details>

### Medium · Mutating an argument

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

- Output — `['a', 'b']` and `[]`.
- Why — JS passes a copy of the reference; `push` changes the shared object, but `user = ...` only re-points the local parameter.
- Pure version — `return { ...user, tags: [...user.tags, tag] };` keeps the caller's data safe.

</details>

### Hard · Implement `curry`

Write `curry(fn)` so that `curry(add3)(1)(2)(3)`, `curry(add3)(1, 2)(3)` and `curry(add3)(1, 2, 3)` all give `6`.

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

- Base case — call once the collected args reach `fn.length` (the declared params).
- Closure — each partial call remembers `args`; a new array is created, with no shared mutation.
- Catch — `fn.length` counts only up to the first default/rest param; pass the arity explicitly for such functions.

</details>

## Sources — further reading

- [MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/05-js-functions.md)
