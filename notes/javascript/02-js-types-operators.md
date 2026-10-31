---
id: js-types-operators
title: Value types operators and explicit conversion
track: javascript
order: 2
level: Foundation
minutes: 3
summary: Primitive types — string, number, boolean, undefined, null, bigint aur symbol.
tags: fundamentals, js, types, operators
---

## Quick revision

> Revision target — Input ka type pehchano; conversion, comparison aur missing-value fallback ko mix mat karo.

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

### Edge cases aur reasoning

- Mixed arithmetic — 1n + 1 TypeError; type boundary par intentional conversion karo, precision loss verify karo.
- Equality by identity — objects ke same contents hone se === true nahi; dono operands same reference hone chahiye.
- Input number — Number("") zero banata hai; required input mein empty string ko conversion se pehle reject karo.

## Example se samjho

```js
const input = "0";
console.log(input + 1);          // "01"
console.log(Number(input) + 1); // 1
console.log(0 || 10, 0 ?? 10);  // 10 0
```

- Trace — string ke saath `+` concatenation karta hai; explicit numeric conversion ke baad addition hota hai.
- Catch — `Number("")` zero deta hai; required field mein empty input ko conversion se pehle reject karo.
- Check — `null`, `undefined`, `""` aur `0` ke fallback results alag table mein predict karo.

## Recall aur practice

- Sawal — 0 || 10 aur 0 ?? 10 ka output kya hai?
- Jawaab — Pehla 10, doosra 0; || falsy ko fallback deta hai, ?? sirf nullish ko.
- Khud try karo — Number parser banao; empty, whitespace, "0", "12x", Infinity aur valid decimal ke acceptance rules likho.

## Practice questions

### Easy · `typeof` ki surprises

```js
console.log(typeof null, typeof [], typeof undefined, typeof NaN, typeof function () {});
```

<details>
<summary>Answer</summary>

- Output — `object object undefined number function`.
- `typeof null` — historical bug; null check ke liye `value === null` likho.
- Array — `typeof` object deta hai; `Array.isArray(value)` use karo.
- `NaN` — type number hi hai, bas invalid numeric result.

</details>

### Easy · `+` aur baaki operators ka coercion

```js
console.log('5' + 3, '5' - 3, '5' * '2', true + 1, [] + {});
```

<details>
<summary>Answer</summary>

- Output — `53 2 10 2 [object Object]`.
- `+` — koi operand string ho toh concatenation.
- `-`, `*` — dono operands number mein convert hote hain.
- `[] + {}` — dono string bante hain: `''` + `'[object Object]'`.

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
- Line 2 — `Untitled` aur empty string `''`.
- Line 3 — `default`.
- Rule — `||` har falsy (`0`, `''`, `false`) ko replace karta hai; `??` sirf `null`/`undefined` ko. Valid `0` ya `''` ho sakta hai toh `??` lo.

</details>

### Medium · `NaN` ko sahi tarah check karo

```js
const price = Number('12abc');
console.log(price === NaN, Number.isNaN(price), isNaN('hello'), Number.isNaN('hello'), Object.is(price, NaN));
```

<details>
<summary>Answer</summary>

- Output — `false true true false true`.
- `NaN === NaN` — hamesha false; equality se NaN pakda nahi jaata.
- Global `isNaN` — pehle convert karta hai, isliye `'hello'` true; `Number.isNaN` convert nahi karta.
- `Object.is` — NaN ko NaN ke equal maanta hai (aur `+0`/`-0` alag).

</details>

### Hard · Safe quantity parser likho

`toQuantity(input)` banao: `" 3 "` → `3`; `""`, `"3.5"`, `"abc"`, `"-2"` aur bahut bade numbers reject (throw) karo.

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

- Regex pehle — `Number('')` `0` deta hai aur `parseInt('3abc')` silently `3`; dono yahan reject.
- `isSafeInteger` — `2**53` ke upar integers exact nahi rehte.
- Tests — `' 3 '`, `''`, `'3.5'`, `'1e3'`, `'-2'`, `'9007199254740993'`.

</details>

## Sources — aur padhne ke liye

- [MDN expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/02-js-types-operators.md)
