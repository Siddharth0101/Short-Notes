---
id: mongo-mongoose-validation-relations
title: Mongoose schemas validation and relationships
track: mongodb
order: 4
level: Intermediate
minutes: 3
summary: Mongoose — a schema/model layer for MongoDB.
tags: mongoose, schemas, validation, populate, middleware, lean
---

## Quick revision

> Revision target — Make the boundaries clear between ODM convenience and database-enforced invariants.

- Mongoose — a schema/model layer for MongoDB.
- Schema — field types, defaults, validators and hooks.
- Model — the API for querying/creating a collection's documents.
- Validation — check persistence rules as well as client input.
- `unique` — a unique index declaration; not a normal validator.
- Update validators — check the options/limitations of the update methods.
- Populate — resolves references; evaluate the join-like cost/query volume.
- `lean()` — plain objects; no document methods/change tracking.
- Hook — do not assume save and query middleware behave the same.
- Document/query hooks — do not treat the hooks/context of save and updateOne as interchangeable.
- Virtual field — a computed representation; no persisted field/index is created automatically.
- Version check — an explicit optimistic-concurrency contract to avoid overwriting from a stale read.

### Edge cases and reasoning

- Update validation scope — runValidators covers the updated supported paths/operators; $inc and whole-document invariants are not covered automatically.
- Query await reuse — a Mongoose Query is not a real reusable Promise; repeated execution can cause unwanted failure/work, so share the exec result deliberately.
- Lean feature boundary — with the default lean, document getters/virtuals/save are unavailable; verify the actual contract of plugins/options separately.

## Understand it with an example

- Scenario — Two signup requests for the same email both see no user in the application lookup, then both insert.
- Reasoning — The database's unique index rejects the concurrent duplicate at the final boundary. The API maps the duplicate-key result to a documented conflict.
- Catch — A pre-check does not prevent the race; do not treat the unique declaration as a normal field validator. In tests verify actual index readiness and the outcome of a concurrent insert.

## Recall and practice

- Question — With a schema max validator and runValidators:true, will $inc always enforce the bound?
- Answer — No; Mongoose update validators do not check $inc. A conditional DB update/an appropriate invariant guard is needed.
- Try it yourself — Compare save versus update validation; verify the duplicate index error, the $inc bound, a missing required path and the lean response shape.

## Practice questions

### Easy · `unique: true` is not a validator

Duplicate emails were found even with `email: { type: String, unique: true }`. How?

<details>
<summary>Answer</summary>

- `unique` — not a Mongoose validator, only a hint to build an index.
- The index was never built — `autoIndex` was off, or the collection already had duplicates so index creation failed.
- Fix — create the index from a migration/script (after cleaning the duplicates) and map `E11000` to `409`.

</details>

### Easy · Validation skipped on update

```js
await User.findByIdAndUpdate(id, { age: -5 });
```

The schema has `min: 0`. What happens?

<details>
<summary>Answer</summary>

- Default — update validators do not run; `-5` is saved.
- Fix — `{ runValidators: true }` (and `new: true` for the updated doc).
- Limit — update validators run only on the paths mentioned in the update, and `this` is not the document.

</details>

### Medium · When to use `lean()`?

<details>
<summary>Answer</summary>

- `lean()` — plain JS objects; hydration is skipped, less memory, fast reads.
- You do not get — getters/setters, virtuals (by default), `save()`, document methods.
- Use — read-only API responses/lists; full documents for edit-then-save flows.

</details>

### Medium · The password hash was bypassed

A `pre('save')` hook hashes the password. The admin panel uses `User.updateOne({ _id }, { password })` and the plain password was saved.

<details>
<summary>Answer</summary>

- Why — `save` middleware runs only on `doc.save()` / `create`, not on queries like `updateOne`.
- Fix — always change the password through one service function that hashes and saves; or handle it in query middleware (`pre('updateOne')`).
- Defence — `select: false` on the password field in the schema, and a test that detects plain text.

</details>

### Hard · A lost update in concurrent edits

Two admins load the same product document and call `doc.save()`. The second save wipes the first one's changes. The fix in Mongoose?

<details>
<summary>Answer</summary>

```js
const productSchema = new Schema({ name: String, price: Number }, { optimisticConcurrency: true });
```

- `optimisticConcurrency` — `save()` matches the version (`__v`); a mismatch throws a `VersionError`.
- Handle — `409 Conflict` + show the latest data, and the user applies the change again.
- Alternative — targeted atomic updates (`$set` only the changed fields) so unrelated fields are not overwritten.

</details>

## Sources — further reading

- [Mongoose update validation caveats](https://mongoosejs.com/docs/validation.html)
- [Mongoose query execution contracts](https://mongoosejs.com/docs/queries.html)

- [Mongoose populate](https://mongoosejs.com/docs/populate.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/04-mongoose-validation-relations.md)
