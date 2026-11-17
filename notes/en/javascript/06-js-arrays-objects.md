---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 3
summary: Array — ordered values; the index starts at zero.
tags: fundamentals, js, arrays, objects
visual: reference-copy
---

## Quick revision

> Revision target — Choose the shape of a list and a record; in a nested update, know exactly which references were copied.

- Array — ordered values; the index starts at zero.
- Object — named properties; read with `user.name` or `user[key]`.
- `push`/`pop` — add/remove at the end of the array.
- `const` object — its properties can change; the reference cannot be reassigned.
- Reference copy — after `b = a` both point to the same object.
- Shallow copy — `{...a}`/`[...a]` make an outer copy; nested objects stay shared.
- Equality — two separate `{}` objects are not equal under `===`.
- Missing property — the value is `undefined`; use `Object.hasOwn(obj, key)` to test existence.
- `Array.isArray` — the real array check; `typeof []` gives object.
- `slice`/`splice` — slice copies; splice inserts/deletes in the original array.
- Dynamic key — bracket access evaluates an expression: `obj[field]`.

### Edge cases and reasoning

- Deep copy boundary — structuredClone copies supported data and cycles; it does not copy functions/DOM nodes and does not preserve custom prototypes.
- JSON copy loss — undefined/functions are omitted, Dates become strings, BigInt/cycles fail; do not treat it as a generic deep clone.
- Nested update — along with the outer spread, copy the changed nested object too; you can reuse the references of untouched branches.

## Understand it with an example

```js
const user = { name: "Asha", address: { city: "Delhi" } };
const moved = {
  ...user,
  address: { ...user.address, city: "Pune" },
};
console.log(user.address.city, moved.address.city); // Delhi Pune
```

- Trace — the outer record and the changed `address` are both new objects; the old user's address is preserved.
- Catch — make only `{ ...user }` and mutate the nested city, and the original's shared address changes too.
- Check — `user !== moved` and `user.address !== moved.address` must both be true.

## Recall and practice

- Question — Why can const b = {...a}; b.address.city = "Pune" change a?
- Answer — The outer object is new, but the address reference is shared; the changed address has to be copied separately.
- Try it yourself — Update a user's address immutably; verify the original city is unchanged, the new user/address references, and the unchanged preferences reference.

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

- Line 1 — `false false`; every literal is a new object, and `===` compares identity.
- Line 2 — `[1, 2] true`; `b` is a second name for the same array.

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
- `slice(start, end)` — a copy, end exclusive, original unchanged.
- `splice(start, count)` — removes from the original and returns the removed items.

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
- Spread — copies only the top level; `address` is the same object in both.
- Fix — `{ ...original, address: { ...original.address } }` or `structuredClone(original)`.

</details>

### Medium · What does a JSON copy lose?

```js
const data = { when: new Date(0), skip: undefined, fn() {}, n: NaN, set: new Set([1]) };
console.log(JSON.parse(JSON.stringify(data)));
```

<details>
<summary>Answer</summary>

- Output — `{ when: '1970-01-01T00:00:00.000Z', n: null, set: {} }`.
- Lost — `undefined` and functions are dropped; the `Date` became a string; `NaN` → `null`; `Set` → `{}`.
- Better — `structuredClone` keeps `Date`, `Map` and `Set`, but throws on functions/DOM nodes. On a `BigInt`, `JSON.stringify` itself throws.

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

Write `addTag(state, id, tag)` that does not mutate `state` and copies only the changed path.

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

- Structural sharing — unchanged users keep the same reference; React memo/selectors can compare cheaply.
- Check — `next.users[1] === state.users[1]` is true, `next.users[0] !== state.users[0]` is true, and the tags in `state` are the same.
- Missing id — all users stay the same, but a new `state` object is still created; if you prefer, check first and return `state`.

</details>

## Sources — further reading

- [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)

- [MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)
- [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/06-js-arrays-objects.md)
