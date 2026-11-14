---
id: js-types-operators
title: Value types operators and explicit conversion
track: javascript
order: 2
level: Foundation
minutes: 3
summary: Primitive types — string, number, boolean, undefined, null, bigint and symbol.
tags: fundamentals, js, types, operators
---

## Quick revision

> Revision target — Identify the type of the input; do not mix up conversion, comparison and the missing-value fallback.

- Primitive types — string, number, boolean, undefined, null, bigint and symbol.
- Object — a reference value with properties; arrays and functions are objects too.
- `undefined` — no value has been assigned; `null` — a deliberately empty value.
- `typeof null` — gives `"object"`; it is an old language quirk.
- `===` — equality without type conversion; `==` may convert.
- `+` — with a string operand it can concatenate: `"5" + 2` → `"52"`.
- Conversion — `Number("5")` → `5`; `Number("abc")` → `NaN`.
- Falsy — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`; `[]` and `{}` are truthy.
- `??` — falls back only on null/undefined; `||` falls back on every falsy value.
- `NaN` — check it with `Number.isNaN(value)`; `NaN === NaN` is false.
- `Object.is` — treats NaN as equal to itself, but +0 and -0 as different.
- Boolean conversion — `Boolean("false")` is true; a non-empty string is truthy.
- Operator precedence — multiply first, add after; use parentheses when in doubt.

### Edge cases and reasoning

- Mixed arithmetic — 1n + 1 is a TypeError; convert intentionally at the type boundary and verify precision loss.
- Equality by identity — objects with the same contents are not ===; both operands must be the same reference.
- Input number — Number("") produces zero; for a required input, reject the empty string before conversion.

## Understand it with an example

```js
const input = "0";
console.log(input + 1);          // "01"
console.log(Number(input) + 1); // 1
console.log(0 || 10, 0 ?? 10);  // 10 0
```

- Trace — `+` concatenates when a string is involved; addition happens after explicit numeric conversion.
- Catch — `Number("")` gives zero; in a required field, reject empty input before conversion.
- Check — predict the fallback results for `null`, `undefined`, `""` and `0` in a separate table.

## Recall and practice

- Question — What do 0 || 10 and 0 ?? 10 output?
- Answer — The first gives 10, the second 0; || falls back on any falsy value, ?? only on nullish ones.
- Try it yourself — Build a number parser; write the acceptance rules for empty, whitespace, "0", "12x", Infinity and a valid decimal.

## Practice questions

### Easy · Surprises from `typeof`

```js
console.log(typeof null, typeof [], typeof undefined, typeof NaN, typeof function () {});
```

<details>
<summary>Answer</summary>

- Output — `object object undefined number function`.
- `typeof null` — a historical bug; write `value === null` for a null check.
- Array — `typeof` gives object; use `Array.isArray(value)`.
- `NaN` — its type is still number; it is just an invalid numeric result.

</details>

### Easy · Coercion with `+` and the other operators

```js
console.log('5' + 3, '5' - 3, '5' * '2', true + 1, [] + {});
```

<details>
<summary>Answer</summary>

- Output — `53 2 10 2 [object Object]`.
- `+` — concatenation when either operand is a string.
- `-`, `*` — both operands are converted to numbers.
- `[] + {}` — both become strings: `''` + `'[object Object]'`.

</details>

### Medium · `||` vs `??`

```js
const settings = { volume: 0, title: '' };
console.log(settings.volume || 50, settings.volume ?? 50);
console.log(settings.title || 'Untitled', settings.title ?? 'Untitled');
console.log(settings.missing ?? 'default');
```

<details>
<summary>Answer</summary>

- Line 1 — `50 0`.
- Line 2 — `Untitled` and the empty string `''`.
- Line 3 — `default`.
- Rule — `||` replaces every falsy value (`0`, `''`, `false`); `??` replaces only `null`/`undefined`. Use `??` when `0` or `''` can be valid.

</details>

### Medium · Check `NaN` the right way

```js
const price = Number('12abc');
console.log(price === NaN, Number.isNaN(price), isNaN('hello'), Number.isNaN('hello'), Object.is(price, NaN));
```

<details>
<summary>Answer</summary>

- Output — `false true true false true`.
- `NaN === NaN` — always false; equality cannot catch NaN.
- Global `isNaN` — converts first, so `'hello'` gives true; `Number.isNaN` does not convert.
- `Object.is` — treats NaN as equal to NaN (and `+0`/`-0` as different).

</details>

### Hard · Write a safe quantity parser

Build `toQuantity(input)`: `" 3 "` → `3`; reject (throw on) `""`, `"3.5"`, `"abc"`, `"-2"` and very large numbers.

<details>
<summary>Answer</summary>

```js
function toQuantity(input) {
  const text = String(input).trim();
  if (!/^\d+$/.test(text)) throw new TypeError(`Invalid quantity: ${input}`);
  const value = Number(text);
  if (!Number.isSafeInteger(value)) throw new RangeError('Quantity too large');
  return value;
}
```

- Regex first — `Number('')` gives `0` and `parseInt('3abc')` silently gives `3`; both are rejected here.
- `isSafeInteger` — integers above `2**53` are no longer exact.
- Tests — `' 3 '`, `''`, `'3.5'`, `'1e3'`, `'-2'`, `'9007199254740993'`.

</details>

## Sources — further reading

- [MDN expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/02-js-types-operators.md)
