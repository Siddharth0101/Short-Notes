---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 3
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

### Edge cases aur reasoning

- Deep copy boundary — structuredClone supported data aur cycles copy karta hai; functions/DOM nodes copy nahi, custom prototypes preserve nahi hote.
- JSON copy loss — undefined/functions omit, Dates strings banti hain, BigInt/cycles fail; generic deep clone mat samjho.
- Nested update — outer spread ke saath changed nested object bhi copy karo; untouched branches ka reference reuse kar sakte ho.

## Recall aur practice

- Sawal — const b = {...a}; b.address.city = "Pune" se a kyun badal sakta hai?
- Jawaab — Outer object naya hai, address ka reference shared hai; changed address ko separately copy karna hoga.
- Khud try karo — User address immutably update karo; original city unchanged, new user/address references aur unchanged preferences reference verify karo.

## Sources — aur padhne ke liye

- [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)

- [MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)
- [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/06-js-arrays-objects.md)
