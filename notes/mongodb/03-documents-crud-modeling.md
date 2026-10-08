---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 3
summary: Document — BSON fields ka record; collection related documents rakhti hai.
tags: mongodb, crud, bson, modeling, embedding, references
---

## Quick revision

- Document — BSON fields ka record; collection related documents rakhti hai.
- CRUD — insert, find, update, delete.
- Filter — precise conditions; untrusted query objects directly accept mat karo.
- `$set` — selected fields update; full replacement alag operation.
- Embed — saath read/update hone wala bounded data.
- Reference — shared, independently changing ya unbounded relation.
- Atomicity — single-document write atomic; multiple documents ke liye boundary plan karo.
- Schema design — query/access pattern se start karo.
- `$inc` — atomic numeric increment; application read-then-write race se bacho.
- Projection — needed fields hi return; network payload aur sensitive-field exposure kam.
- `$elemMatch` — array ke ek hi element ko saari supplied conditions satisfy karni hoti hain.

### Document identity

- ObjectId — identifier; timestamp ko authorization proof mat samjho.

### Edge cases aur reasoning

- Conditional decrement — {_id, stock:{$gte:n}} filter + $inc:{stock:-n} single atomic claim; matched count se success decide karo.
- Upsert race — same logical key par concurrent upserts duplicate bana sakti hain without suitable unique index; duplicate outcome handle karo.
- Array predicate trap — separate dot conditions different array elements match kar sakti hain; same-element contract ke liye $elemMatch.

## Research notes: Model bounded growth and data ownership

- Embedding related data ko reads/atomic updates ke liye saath rakhti hai.

## Recall aur practice

- Sawal — Atomic $inc alone stock ko negative hone se rokta hai?
- Jawaab — Nahi; increment atomic hai, invariant conditional filter se enforce. stock>=requested ko same update predicate mein rakho.
- Khud try karo — Last-stock reservation query likho; two callers mein one success, no negative stock aur duplicate operation receipt verify karo.

## Sources — aur padhne ke liye

- [MongoDB elemMatch](https://www.mongodb.com/docs/manual/reference/operator/query/elemmatch/)

- [Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/data-modeling/)
- [MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/03-documents-crud-modeling.md)
