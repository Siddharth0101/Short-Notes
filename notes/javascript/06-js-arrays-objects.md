---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 3
summary: Array — ordered values; index zero se start hota hai.
tags: fundamentals, js, arrays, objects
visual: reference-copy
---

## Quick revision

> Revision target — List aur record ka shape choose karo; nested update mein exactly kaunse references copy hue samjho.

- Array — ordered values; index zero se start hota hai.
- Object — named properties; `user.name` ya `user[key]` se padho.
- `push`/`pop` — array ke end par add/remove karte hain.
- `const` object — properties badal sakti hain; reference reassign nahi hota.
- Reference copy — `b = a` se dono same object ko point karte hain.
- Shallow copy — `{...a}`/`[...a]` outer copy banate hain; nested objects shared rehte hain.
- Equality — do alag `{}` objects `===` se equal nahi hote.
- Missing property — value `undefined`; existence ke liye `Object.hasOwn(obj, key)`.
- `Array.isArray` — actual array check; `typeof []` object aata hai.
- `slice`/`splice` — slice copy; splice original array mein insert/delete karta hai.
- Dynamic key — bracket access mein expression evaluate hota hai: `obj[field]`.

### Edge cases aur reasoning

- Deep copy boundary — structuredClone supported data aur cycles copy karta hai; functions/DOM nodes copy nahi, custom prototypes preserve nahi hote.
- JSON copy loss — undefined/functions omit, Dates strings banti hain, BigInt/cycles fail; generic deep clone mat samjho.
- Nested update — outer spread ke saath changed nested object bhi copy karo; untouched branches ka reference reuse kar sakte ho.

## Example se samjho

```js
const user = { name: "Asha", address: { city: "Delhi" } };
const moved = {
  ...user,
  address: { ...user.address, city: "Pune" },
};
console.log(user.address.city, moved.address.city); // Delhi Pune
```

- Trace — outer record aur changed `address` dono naye objects hain; old user ka address preserve hota hai.
- Catch — sirf `{ ...user }` banao aur nested city mutate karo toh original ka shared address bhi badlega.
- Check — `user !== moved` aur `user.address !== moved.address` dono true hone chahiye.

## Recall aur practice

- Sawal — const b = {...a}; b.address.city = "Pune" se a kyun badal sakta hai?
- Jawaab — Outer object naya hai, address ka reference shared hai; changed address ko separately copy karna hoga.
- Khud try karo — User address immutably update karo; original city unchanged, new user/address references aur unchanged preferences reference verify karo.

## Practice questions

### Easy · Reference equality

```js
console.log([1, 2] === [1, 2], {} === {});
const a = [1];
const b = a;
b.push(2);
console.log(a, a === b);
```

<details>
<summary>Answer</summary>

- Line 1 — `false false`; har literal naya object hai, `===` identity compare karta hai.
- Line 2 — `[1, 2] true`; `b` same array ka doosra naam hai.

</details>

### Easy · `slice` vs `splice`

```js
const list = [10, 20, 30, 40];
const s = list.slice(1, 3);
const r = list.splice(1, 2);
console.log(s, r, list);
```

<details>
<summary>Answer</summary>

- Output — `[20, 30] [20, 30] [10, 40]`.
- `slice(start, end)` — copy, end exclusive, original same.
- `splice(start, count)` — original se remove karke removed items return karta hai.

</details>

### Medium · Shallow copy trap

```js
const original = { name: 'Asha', address: { city: 'Pune' } };
const copy = { ...original };
copy.name = 'Ravi';
copy.address.city = 'Delhi';
console.log(original.name, original.address.city);
```

<details>
<summary>Answer</summary>

- Output — `Asha Delhi`.
- Spread — sirf top level copy; `address` dono mein same object hai.
- Fix — `{ ...original, address: { ...original.address } }` ya `structuredClone(original)`.

</details>

### Medium · JSON copy kya kho deta hai?

```js
const data = { when: new Date(0), skip: undefined, fn() {}, n: NaN, set: new Set([1]) };
console.log(JSON.parse(JSON.stringify(data)));
```

<details>
<summary>Answer</summary>

- Output — `{ when: '1970-01-01T00:00:00.000Z', n: null, set: {} }`.
- Lost — `undefined` aur functions drop; `Date` string ban gaya; `NaN` → `null`; `Set` → `{}`.
- Better — `structuredClone` `Date`, `Map`, `Set` rakhta hai, par functions/DOM nodes par throw karta hai. `BigInt` par `JSON.stringify` khud throw karta hai.

</details>

### Hard · Immutable nested update

```js
const state = {
  users: [
    { id: 1, profile: { name: 'A', tags: ['x'] } },
    { id: 2, profile: { name: 'B', tags: [] } },
  ],
};
```

`addTag(state, id, tag)` likho jo `state` mutate na kare aur sirf badla hua path copy kare.

<details>
<summary>Answer</summary>

```js
function addTag(state, id, tag) {
  return {
    ...state,
    users: state.users.map((user) =>
      user.id !== id
        ? user
        : { ...user, profile: { ...user.profile, tags: [...user.profile.tags, tag] } },
    ),
  };
}
```

- Structural sharing — unchanged users same reference rehte hain; React memo/selectors cheap compare kar paate hain.
- Check — `next.users[1] === state.users[1]` true, `next.users[0] !== state.users[0]` true, `state` ke tags same.
- Missing id — sab users same rehte hain, par naya `state` object phir bhi banta hai; chaho toh pehle check karke `state` return karo.

</details>

## Sources — aur padhne ke liye

- [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)

- [MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)
- [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/06-js-arrays-objects.md)
