---
id: js-language-foundations
title: Foundations checkpoint and reliable input handling
track: javascript
order: 8
level: Foundation
minutes: 3
summary: Expression — produces a value; statement — carries out an instruction.
tags: variables, types, coercion, functions, fundamentals
---

## Quick revision

> Revision target — Build the path from raw input to a trusted value; explain the order of validation and error cleanup.

- Expression — produces a value; statement — carries out an instruction.
- Strict mode — some cases of silent mistakes become errors.
- Primitive — an immutable value; the variable can still be assigned a new value.
- Object — its properties can be mutated; assignment copies the reference value.
- Pass-by-value — JS arguments are values; for an object argument the value is a reference.
- Coercion — implicit type conversion; explicit conversion at the boundary is clearer.
- Short-circuit — `&&`, `||`, `??` evaluate the right side only when needed.
- Destructuring default — applies only for `undefined`, not for `null`.
- Equality — `Object.is(NaN, NaN)` is true; `Object.is(0, -0)` is false.
- `in` operator — checks both own and inherited properties.
- Automatic semicolon — a newline right after `return` can give an unexpected undefined.
- `delete` — removes an object property; deleting an array slot does not shrink the length.

### Edge cases and reasoning

- Error handling — throw propagates a failure; catch should recover or rethrow meaningfully, never silently swallow the error.
- Finally control flow — a return/throw in finally can override an earlier return/error; keep cleanup free of outcome-changing logic.
- Strict scope — ES modules/classes are automatically strict; state the execution context when comparing script behaviour.

## Understand it with an example

```js
function readAge(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const age = Number(raw);
  return Number.isInteger(age) && age >= 0 ? age : null;
}
console.log(readAge("0"), readAge(""), readAge("2.5")); // 0 null null
```

- Contract — this helper accepts non-negative integer values; the maximum age and the allowed textual format are separate product rules.
- Catch — `if (!age)` rejects a valid zero; compare the invalid sentinel `null` explicitly.
- Check — also try whitespace, a negative value and non-numeric text; keep the return shapes for success and failure consistent.

## Recall and practice

- Question — If try has return 1 and finally has return 2, what does the caller get?
- Answer — 2; the control flow of finally replaces the previous return, so avoid return in a cleanup block.
- Try it yourself — Write a validated divide(a,b); cover a zero divisor, a non-number and a normal result, and show the caller a meaningful error.

## Practice questions

### Easy · A newline after `return`

```js
function getConfig() {
  return
  {
    debug: true
  };
}
console.log(getConfig());
```

<details>
<summary>Answer</summary>

- Output — `undefined`.
- Why — automatic semicolon insertion turns it into `return;`; the object below is an unreachable block.
- Fix — start the object on the same line as `return {`.

</details>

### Easy · `in`, `undefined` and own properties

```js
const obj = { a: undefined };
console.log('a' in obj, obj.a === undefined, 'b' in obj, 'toString' in obj, Object.hasOwn(obj, 'toString'));
```

<details>
<summary>Answer</summary>

- Output — `true true false true false`.
- `in` — whether the key exists (the prototype chain too); its value may be `undefined`.
- `Object.hasOwn` — only the object's own property; the inherited `toString` gives false.

</details>

### Medium · `finally` and `return`

```js
function a() {
  try { return 'try'; } finally { console.log('cleanup'); }
}
function b() {
  try { throw new Error('boom'); } finally { return 'finally'; }
}
console.log(a(), b());
```

<details>
<summary>Answer</summary>

- Output — first `cleanup`, then `try finally`.
- `a` — `finally` runs before the return and does not change the value.
- `b` — the `return` in `finally` silently swallows the error.
- Rule — `finally` is for cleanup only; do not write `return`/`throw` in it.

</details>

### Medium · Destructuring defaults with `null`

```js
const { a = 1, b = 2, c: { d = 3 } = {} } = { a: null, b: undefined };
console.log(a, b, d);
```

<details>
<summary>Answer</summary>

- Output — `null 2 3`.
- Default only for `undefined` — the value of `a` is `null`, so the default did not apply.
- Nested — `c` is missing, so the `= {}` default was destructured and `d` got `3`; without `= {}` a `TypeError` would be thrown.

</details>

### Hard · `parseAge` for form input

Write `parseAge(raw)`: trim, required, an integer `0–130`. Do not throw; return `{ ok: true, value }` or `{ ok: false, error }`.

<details>
<summary>Answer</summary>

```js
function parseAge(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return { ok: false, error: 'Age required' };
  if (!/^\d{1,3}$/.test(text)) return { ok: false, error: 'Whole number likho' };
  const value = Number(text);
  if (value > 130) return { ok: false, error: '0 se 130 ke beech' };
  return { ok: true, value };
}
```

- Trap — `Number(' ')` and `Number('')` both give `0`; so the empty check comes first.
- Result object — the UI can show an error without try/catch; unexpected bugs can still throw.
- Tests — `''`, `'  '`, `'25'`, `' 25 '`, `'2.5'`, `'-1'`, `'131'`, `null`.

</details>

## Sources — further reading

- [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/08-language-foundations.md)
