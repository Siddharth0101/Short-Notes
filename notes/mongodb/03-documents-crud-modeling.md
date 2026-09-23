---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 1
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

## Research notes: Model bounded growth and data ownership

- Embedding related data ko reads/atomic updates ke liye saath rakhti hai.

## Sources — aur padhne ke liye

- [Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/data-modeling/)
- [MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/03-documents-crud-modeling.md)
