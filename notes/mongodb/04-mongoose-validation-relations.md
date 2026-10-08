---
id: mongo-mongoose-validation-relations
title: Mongoose schemas validation and relationships
track: mongodb
order: 4
level: Intermediate
minutes: 3
summary: Mongoose — MongoDB ke liye schema/model layer.
tags: mongoose, schemas, validation, populate, middleware, lean
---

## Quick revision

- Mongoose — MongoDB ke liye schema/model layer.
- Schema — field types, defaults, validators aur hooks.
- Model — collection ke documents query/create karne ka API.
- Validation — client input ke saath persistence rules bhi check karo.
- `unique` — unique index declaration; normal validator nahi.
- Update validators — update methods mein options/limitations check karo.
- Populate — references resolve; joins jaisa cost/query volume evaluate karo.
- `lean()` — plain objects; document methods/change tracking nahi.
- Hook — save aur query middleware ka behavior same assume mat karo.
- Document/query hooks — save aur updateOne ke hooks/context ko interchangeable mat samjho.
- Virtual field — computed representation; persisted field/index automatic nahi banta.
- Version check — stale read se overwrite avoid karne ke liye optimistic concurrency ka explicit contract.

### Edge cases aur reasoning

- Update validation scope — runValidators updated supported paths/operators par; $inc aur whole-document invariants automatically cover nahi.
- Query await reuse — Mongoose Query real reusable Promise nahi; repeated execution unwanted failure/work de sakti, exec result deliberately share karo.
- Lean feature boundary — default lean document getters/virtuals/save unavailable; plugins/options ka actual contract separately verify karo.

## Recall aur practice

- Sawal — Schema max validator aur runValidators:true ke saath $inc always bound enforce karega?
- Jawaab — Nahi; Mongoose update validators $inc check nahi karte. Conditional DB update/appropriate invariant guard chahiye.
- Khud try karo — Save versus update validation compare karo; duplicate index error, $inc bound, missing required path aur lean response shape verify karo.

## Sources — aur padhne ke liye

- [Mongoose update validation caveats](https://mongoosejs.com/docs/validation.html)
- [Mongoose query execution contracts](https://mongoosejs.com/docs/queries.html)

- [Mongoose validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose populate](https://mongoosejs.com/docs/populate.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/04-mongoose-validation-relations.md)
