---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 1
summary: Array — ordered values; index zero se start hota hai.
tags: fundamentals, js, arrays, objects
---

## Quick revision

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

## Sources — aur padhne ke liye

- [MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)
- [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/06-js-arrays-objects.md)
