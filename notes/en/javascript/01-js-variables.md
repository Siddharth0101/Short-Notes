---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 3
summary: Variable — a name given to a value.
tags: fundamentals, js, variables
visual: hoisting-tdz
---

## Quick revision

> Revision target — Tell a binding apart from a value; predict reassignment, mutation and shadowing separately.

- Variable — a name given to a value.
- `var` — function-scoped; you can redeclare it and assign it again.
- `let` — block-scoped; you can assign the value again.
- `const` — block-scoped; the binding cannot be reassigned, but an object's properties can change.
- TDZ — read `let`/`const` before the declaration and you get a `ReferenceError`.
- Hoisting — before the `var` declaration you get `undefined`, not the assigned value.
- `=` — evaluate the right side, then store it in the variable on the left.
- Primitive copy — after `let b = a`, changing `a` does not change `b`.
- Naming — `score` and `Score` are different; a name cannot start with a digit.
- Default — `const` first; use `let` when you need reassignment.
- Shadowing — the same name in an inner scope hides the outer variable.
- Redeclaration — declaring `let`/`const` again in the same scope is an error.
- Initialization — after `let x;` the value is undefined; `const` needs a value at its declaration.

### Edge cases and reasoning

- Top-level binding — a var in a classic browser script can become a window property; let/const and module bindings do not automatically become window properties.
- Block lifetime — the lexical name is unavailable outside its block; a reachable closure can still retain that binding.
- Undeclared assignment — in strict mode a missing declaration throws ReferenceError; avoid accidental globals.

## Understand it with an example

```js
const cart = { items: 1 };
const saved = cart;
cart.items = 2;
let count = cart.items;
count = 3;
console.log(saved.items, cart.items, count); // 2 2 3
```

- Trace — `saved` and `cart` reach the same object; `count` holds an independent copy of the number.
- Catch — a `const` name cannot be bound to another object; it does not freeze the object's properties.
- Check — run `cart = { items: 4 }` in a separate snippet; the assignment throws a `TypeError`.

## Recall and practice

- Question — What is the difference between const cart = []; cart.push(1) and cart = []?
- Answer — push mutates the same array; reassignment tries to change the const binding, hence a TypeError.
- Try it yourself — Shadow an outer score inside a block; predict the output inside and outside, and check same-scope redeclaration in a separate snippet.

## Practice questions

### Easy · `const` object: mutate vs reassign

```js
const user = { name: 'Asha' };
user.name = 'Ravi';     // line 2
user = { name: 'Kabir' }; // line 3
```

Which line throws an error, and why?

<details>
<summary>Answer</summary>

- Line 3 — `TypeError: Assignment to constant variable.`
- Line 2 — runs fine; `const` only locks the binding, not the values inside the object.
- Catch — to lock the object as well use `Object.freeze(user)`; even that is only shallow.

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

- First log — `undefined`; the `var` declaration is hoisted and initialized to `undefined`.
- Second log — `ReferenceError: Cannot access 'b' before initialization`.
- Why — `let` is hoisted too, but it stays in the TDZ until its declaration line.

</details>

### Medium · Block shadowing and redeclaration

```js
let count = 1;
{
  let count = 2;
  count++;
}
console.log(count);
```

What is the output? What if you write `var` instead of `let` in both places?

<details>
<summary>Answer</summary>

- `let` version — `1`; a separate `count` binding was created inside the block, the outer one is untouched.
- `var` version — `3`; `var` is not block-scoped, so both are the same binding and redeclaration is allowed.
- Interview line — "`let`/`const` give block scope; `var` gives function scope and silent redeclaration."

</details>

### Medium · Undeclared assignment

```js
function setup() {
  total = 10;
}
setup();
console.log(total);
```

What is the result in a normal script and in an ES module (or with `'use strict'`)?

<details>
<summary>Answer</summary>

- Sloppy script — `10`; an undeclared assignment accidentally creates a global property.
- Module / strict mode — `ReferenceError: total is not defined`.
- Fix — `let total = 10` (or return the value from the function); accidental globals bring bugs and name clashes.

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
- Swap — destructuring builds a new array from the right side, so no temp variable is needed.
- `y = x` — both point to the same object; `y.n = 5` changes the shared object.
- `y = { n: 9 }` — only the binding of `y` moved to a new object; `x` is still on the old object (n = 5).

</details>

## Sources — further reading

- [MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/01-js-variables.md)
