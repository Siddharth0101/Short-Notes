---
id: js-modern-data-collections
title: Objects arrays and modern data transformations
track: javascript
order: 7
level: Intermediate
minutes: 5
summary: `map` — har item transform karke naya array.
tags: arrays, objects, map, set, destructuring, immutability
---

## Quick revision

- `map` — har item transform karke naya array.
- `filter` — matching items ka naya array.
- `reduce` — items se ek accumulated result; initial value dena clear rehta hai.
- `find` — pehla matching item; na mile toh `undefined`.
- `some`/`every` — koi match / sab match; empty array par false / true.
- `Set` — unique values; object uniqueness reference se hoti hai.
- `Map` — kisi bhi type ki keys; insertion order preserve hota hai.
- Destructuring — array/object se values seedha variables mein nikalo.
- Spread — values expand; rest — bachi values collect.
- `?.` — null/undefined par access rokta hai; missing variable declaration nahi bachata.
- `sort` — original array badalta hai; numbers ke liye `(a, b) => a - b`.
- Grouping — key ke hisaab se buckets banao; accumulator har step return karo.
- `flatMap` — transform ke baad result ek level flatten karta hai.
- Empty reduce — initial value bina empty array par reduce error deta hai.
- Mutation trap — map naya array banata hai, par callback shared nested object mutate kar sakta hai.

### Object aur string helpers

- Enhanced literal — property shorthand, method shorthand aur computed keys.
- String methods — includes/start/end checks, slice, split/join aur replace se text process karo.
- String length — UTF-16 code units count; visible characters ka exact count nahi.

### Array transformations

- `forEach` — side-effect iteration; result array nahi aur async completion wait nahi.
- `flat` — nested arrays flatten; `flatMap` — map + one-level flatten.
- `findIndex` — first matching index; missing par -1.
- `Array.from` — iterable/array-like ko array mein convert.
- Immutable methods — `toSorted`, `toReversed`, `toSpliced`, `with` naya array dete hain.

### Array helpers

- `at` — negative index end se count; arr.at(-1) last item deta hai.
- `fill` — original array ke slots replace; same object fill karo toh references shared rehte hain.
- `includes`/`indexOf` — boolean membership / first index; missing index -1, includes NaN ko recognize karta hai.
- Sparse array — empty slots aur explicit undefined same nahi; map/forEach holes skip karte hain.
- Array mutation — push/pop/shift/unshift/splice/sort/reverse/fill original badalte hain; copy chahiye toh non-mutating approach lo.

### Weak collections

- WeakMap — object key ko alive nahi rakhta; object-linked metadata/cache ke liye useful.
- WeakSet — objects ki weak membership; visited markers object ko memory mein forcefully retain nahi karte.
- Weak enumeration — keys/values list, iteration aur size available nahi; garbage collection ka timing fixed nahi.

### Iteration protocol

- `Symbol.iterator` — iterable ka method iterator return karta hai; `for...of` isi protocol se values leta hai.
- Iterator result — `next()` se `{value, done}`; done true ho toh traversal complete.
- Array-like — numeric indexes + length; `Symbol.iterator` bina automatically iterable nahi.
- Independent iterators — har traversal ka separate cursor rakho; shared iterator nested loops ka progress mix kar sakta hai.

### Edge cases aur reasoning

- Set equality — SameValueZero se NaN deduplicate aur +0/-0 same; alag object references separate entries rehte hain.
- Destructure safely — missing/null object ko seedha destructure karna fail; boundary par fallback aur field validation alag karo.
- Sort comparator — negative/zero/positive ordering consistent rakho; boolean comparator total order define nahi karta.

## Recall aur practice

- Sawal — new Set([NaN, NaN, {}, {}]).size kitna hai?
- Jawaab — 3; NaN values merge, dono independently created objects alag references hain.
- Khud try karo — Orders ko customer ID se group karo; empty data, repeated customer aur missing ID policy verify karo; original orders mutate mat karo.

## Sources — aur padhne ke liye

- [javascript.info — WeakMap/WeakSet](https://javascript.info/weakmap-weakset)
- [javascript.info — iterables](https://javascript.info/iterable)

- [MDN Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/07-modern-data-collections.md)
