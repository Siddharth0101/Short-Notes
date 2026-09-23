---
id: mongo-mongoose-validation-relations
title: Mongoose schemas validation and relationships
track: mongodb
order: 4
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Mongoose validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose populate](https://mongoosejs.com/docs/populate.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/04-mongoose-validation-relations.md)
