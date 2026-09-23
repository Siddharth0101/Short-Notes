---
id: js-modern-data-collections
title: Objects arrays and modern data transformations
track: javascript
order: 7
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [MDN Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/07-modern-data-collections.md)
