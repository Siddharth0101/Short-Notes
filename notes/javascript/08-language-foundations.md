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

> Revision target — Raw input se trusted value tak ka path banao; validation aur error cleanup ka order explain karo.

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

## Example se samjho

```js
function readAge(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const age = Number(raw);
  return Number.isInteger(age) && age >= 0 ? age : null;
}
console.log(readAge("0"), readAge(""), readAge("2.5")); // 0 null null
```

- Contract — yeh helper non-negative integer values accept karta hai; maximum age aur allowed textual format alag product rules hain.
- Catch — `if (!age)` valid zero reject karega; invalid sentinel `null` ko explicitly compare karo.
- Check — whitespace, negative value aur non-numeric text bhi try karo; success aur failure ke return shapes consistent rakho.

## Recall aur practice

- Sawal — try mein return 1 aur finally mein return 2 ho toh caller ko kya milega?
- Jawaab — 2; finally ka control flow previous return replace karta hai, isliye cleanup block mein return avoid karo.
- Khud try karo — Validated divide(a,b) likho; zero divisor, non-number aur normal result cover karo, caller ko meaningful error dikhao.

## Practice questions

### Easy · `return` ke baad newline

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
- Kyun — automatic semicolon insertion `return;` bana deta hai; neeche ka object unreachable block hai.
- Fix — object ko `return {` wali line par hi shuru karo.

</details>

### Easy · `in`, `undefined` aur own property

```js
const obj = { a: undefined };
console.log('a' in obj, obj.a === undefined, 'b' in obj, 'toString' in obj, Object.hasOwn(obj, 'toString'));
```

<details>
<summary>Answer</summary>

- Output — `true true false true false`.
- `in` — key exist karti hai ya nahi (prototype chain bhi); value `undefined` ho sakti hai.
- `Object.hasOwn` — sirf object ki apni property; inherited `toString` false.

</details>

### Medium · `finally` aur `return`

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

- Output — pehle `cleanup`, phir `try finally`.
- `a` — `finally` return se pehle chalta hai, value badalta nahi.
- `b` — `finally` ka `return` error ko silently nigal jaata hai.
- Rule — `finally` sirf cleanup ke liye; usme `return`/`throw` mat likho.

</details>

### Medium · Destructuring defaults with `null`

```js
const { a = 1, b = 2, c: { d = 3 } = {} } = { a: null, b: undefined };
console.log(a, b, d);
```

<details>
<summary>Answer</summary>

- Output — `null 2 3`.
- Default sirf `undefined` par — `a` ki value `null` hai, isliye default nahi laga.
- Nested — `c` missing hai, toh `= {}` default destructure hua aur `d` ko `3` mila; bina `= {}` ke `TypeError` aata.

</details>

### Hard · Form input ke liye `parseAge`

`parseAge(raw)` likho: trim karo, required, integer `0–130`. Throw mat karo; `{ ok: true, value }` ya `{ ok: false, error }` return karo.

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

- Trap — `Number(' ')` aur `Number('')` dono `0` dete hain; isliye empty check pehle.
- Result object — UI error dikha sakti hai bina try/catch ke; unexpected bugs ab bhi throw ho sakte hain.
- Tests — `''`, `'  '`, `'25'`, `' 25 '`, `'2.5'`, `'-1'`, `'131'`, `null`.

</details>

## Sources — aur padhne ke liye

- [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/08-language-foundations.md)
