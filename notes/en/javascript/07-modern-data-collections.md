---
id: js-modern-data-collections
title: Objects arrays and modern data transformations
track: javascript
order: 7
level: Intermediate
minutes: 5
summary: `map` — transform every item into a new array.
tags: arrays, objects, map, set, destructuring, immutability
---

## Quick revision

> Revision target — Choose the right collection operation for transforming, selecting, aggregating and looking up.

- `map` — transform every item into a new array.
- `filter` — a new array of the matching items.
- `reduce` — one accumulated result from the items; giving an initial value keeps it clear.
- `find` — the first matching item; `undefined` if none is found.
- `some`/`every` — any match / all match; false / true on an empty array.
- `Set` — unique values; uniqueness of objects is by reference.
- `Map` — keys of any type; insertion order is preserved.
- Destructuring — pull values straight out of an array/object into variables.
- Spread — expands values; rest — collects the remaining values.
- `?.` — stops the access on null/undefined; it does not rescue a missing variable declaration.
- `sort` — changes the original array; for numbers use `(a, b) => a - b`.
- Grouping — build buckets by key; return the accumulator at every step.
- `flatMap` — flattens the result one level after the transform.
- Empty reduce — reduce on an empty array without an initial value throws an error.
- Mutation trap — map builds a new array, but the callback can still mutate a shared nested object.

### Object and string helpers

- Enhanced literal — property shorthand, method shorthand and computed keys.
- String methods — process text with includes/start/end checks, slice, split/join and replace.
- String length — counts UTF-16 code units; not the exact count of visible characters.

### Array transformations

- `forEach` — iteration for side effects; no result array and it does not wait for async completion.
- `flat` — flattens nested arrays; `flatMap` — map + a one-level flatten.
- `findIndex` — the first matching index; -1 when missing.
- `Array.from` — converts an iterable/array-like into an array.
- Immutable methods — `toSorted`, `toReversed`, `toSpliced`, `with` return a new array.

### Array helpers

- `at` — a negative index counts from the end; arr.at(-1) gives the last item.
- `fill` — replaces slots of the original array; fill with one object and the references are shared.
- `includes`/`indexOf` — boolean membership / first index; a missing index is -1, and includes recognizes NaN.
- Sparse array — empty slots and an explicit undefined are not the same; map/forEach skip holes.
- Array mutation — push/pop/shift/unshift/splice/sort/reverse/fill change the original; use a non-mutating approach when you need a copy.

### Weak collections

- WeakMap — does not keep its object key alive; useful for object-linked metadata/caches.
- WeakSet — weak membership of objects; visited markers do not forcibly retain the object in memory.
- Weak enumeration — no keys/values list, iteration or size; the timing of garbage collection is not fixed.

### Iteration protocol

- `Symbol.iterator` — an iterable's method that returns an iterator; `for...of` takes values through this protocol.
- Iterator result — `next()` gives `{value, done}`; when done is true the traversal is complete.
- Array-like — numeric indexes + length; not automatically iterable without `Symbol.iterator`.
- Independent iterators — keep a separate cursor for each traversal; a shared iterator can mix up the progress of nested loops.

### Edge cases and reasoning

- Set equality — SameValueZero deduplicates NaN and treats +0/-0 as the same; different object references stay separate entries.
- Destructure safely — destructuring a missing/null object directly fails; separate the fallback at the boundary from field validation.
- Sort comparator — keep negative/zero/positive ordering consistent; a boolean comparator does not define a total order.

## Understand it with an example

```js
const orders = [{ paid: true, total: 80 }, { paid: false, total: 50 }];
const paidTotal = orders
  .filter((order) => order.paid)
  .map((order) => order.total)
  .reduce((sum, total) => sum + total, 0);
console.log(paidTotal); // 80
```

- Trace — `filter` picks the eligible records, `map` the amounts, `reduce` builds the final total; the output shape differs at every stage.
- Catch — on an empty selection the initial `0` gives a safe result; an empty `reduce` without an initial value throws.
- Trade-off — intermediate arrays are created; start with readability, and consider a single pass on a measured hot path.

## Recall and practice

- Question — What is new Set([NaN, NaN, {}, {}]).size?
- Answer — 3; the NaN values merge, and the two independently created objects are different references.
- Try it yourself — Group orders by customer ID; verify empty data, a repeated customer and the policy for a missing ID; do not mutate the original orders.

## Practice questions

### Easy · The default `sort` trap

```js
const nums = [10, 1, 5, 100];
console.log(nums.sort());
```

<details>
<summary>Answer</summary>

- Output — `[1, 10, 100, 5]`; the default sort compares values as strings.
- Fix — `nums.sort((a, b) => a - b)`.
- Catch — `sort` mutates the original array; for a copy use `nums.toSorted(...)` or `[...nums].sort(...)`.

</details>

### Easy · `map(parseInt)`

```js
console.log(['1', '7', '11'].map(parseInt));
```

<details>
<summary>Answer</summary>

- Output — `[1, NaN, 3]`.
- Why — `map` passes `(value, index)` to the callback; `parseInt('7', 1)` has an invalid radix → `NaN`, `parseInt('11', 2)` → `3`.
- Fix — `.map(Number)` or `.map((s) => parseInt(s, 10))`.

</details>

### Medium · Grouping with `reduce`

Group `orders` by status: `{ paid: [...], pending: [...] }`. What happens on an empty array?

<details>
<summary>Answer</summary>

```js
const byStatus = orders.reduce((groups, order) => {
  (groups[order.status] ??= []).push(order);
  return groups;
}, {});
```

- Initial value `{}` — even an empty array gives `{}`; an empty `reduce` without an initial value throws a `TypeError`.
- Modern — `Object.groupBy(orders, (o) => o.status)` (ES2024) does the same job and returns a null-prototype object.
- Order — the original order is preserved within each group.

</details>

### Medium · `Set` and `Map` keys

```js
const s = new Set([1, '1', NaN, NaN, {}, {}]);
console.log(s.size);
const m = new Map([[{}, 'a']]);
console.log(m.get({}));
```

<details>
<summary>Answer</summary>

- `s.size` — `5`: `1`, `'1'`, one `NaN`, and two different objects.
- `m.get({})` — `undefined`; object keys match by reference, and a new `{}` is a different key.
- Rule — `Set`/`Map` use SameValueZero: `NaN` is equal, `1` and `'1'` are different.

</details>

### Hard · Build an iterable `range`

Build `range(start, end, step = 1)` that works in `for...of` and spread, supports a negative step, rejects `step = 0`, and gives a fresh iteration for every loop.

<details>
<summary>Answer</summary>

```js
function range(start, end, step = 1) {
  if (step === 0) throw new RangeError('step cannot be 0');
  return {
    *[Symbol.iterator]() {
      for (let i = start; step > 0 ? i < end : i > end; i += step) yield i;
    },
  };
}
const r = range(5, 0, -2);
console.log([...r], [...r]); // [5, 3, 1] [5, 3, 1]
```

- Iterable vs iterator — the object returns a new generator on every `Symbol.iterator` call, so two spreads are independent.
- Direction — the sign of the step decides the comparison; a wrong sign gives an empty range, not an infinite loop.
- Lazy — values are produced on demand; no array is allocated for large ranges.

</details>

## Sources — further reading

- [javascript.info — WeakMap/WeakSet](https://javascript.info/weakmap-weakset)
- [javascript.info — iterables](https://javascript.info/iterable)

- [MDN Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/07-modern-data-collections.md)
