---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 3
summary: Document — a record of BSON fields; a collection holds related documents.
tags: mongodb, crud, bson, modeling, embedding, references
---

## Quick revision

> Revision target — Choose the document shape from the read pattern, bounded growth and the atomic update predicate.

- Document — a record of BSON fields; a collection holds related documents.
- CRUD — insert, find, update, delete.
- Filter — precise conditions; do not accept untrusted query objects directly.
- `$set` — updates the selected fields; a full replacement is a different operation.
- Embed — bounded data that is read/updated together.
- Reference — a shared, independently changing or unbounded relation.
- Atomicity — a single-document write is atomic; plan the boundary for multiple documents.
- Schema design — start from the query/access pattern.
- `$inc` — an atomic numeric increment; avoid an application read-then-write race.
- Projection — return only the fields needed; a smaller network payload and less exposure of sensitive fields.
- `$elemMatch` — one and the same array element has to satisfy all the supplied conditions.

### Document identity

- ObjectId — an identifier; do not treat its timestamp as proof of authorization.

### Edge cases and reasoning

- Conditional decrement — the filter {_id, stock:{$gte:n}} + $inc:{stock:-n} is a single atomic claim; decide success from the matched count.
- Upsert race — concurrent upserts on the same logical key can create duplicates without a suitable unique index; handle the duplicate outcome.
- Array predicate trap — separate dot conditions can match different array elements; use $elemMatch for a same-element contract.

## Research notes: Model bounded growth and data ownership

- Embedding keeps related data together for reads/atomic updates.

## Understand it with an example

- Scenario — The array entries are `{color:red,size:S}` and `{color:blue,size:L}`; the query wants the same item to be red and L.
- Reasoning — Separate dot predicates can match red from the first element and L from the second. Combine the same-element requirement in $elemMatch; here there is no match.
- Catch — A matching document does not mean every condition is true on the same nested object; model the array element scope explicitly in the query contract.

## Recall and practice

- Question — Does an atomic $inc alone stop stock from going negative?
- Answer — No; the increment is atomic, but the invariant is enforced by a conditional filter. Put stock>=requested in the same update predicate.
- Try it yourself — Write a last-stock reservation query; verify one success between two callers, no negative stock and a receipt for a duplicate operation.

## Practice questions

### Easy · An update without an operator

```js
await users.updateOne({ _id: id }, { name: 'Asha' });
```

<details>
<summary>Answer</summary>

- Result — a Node driver error: update document requires atomic operators.
- Fix — `{ $set: { name: 'Asha' } }`.
- To change the whole document — `replaceOne(filter, newDoc)` (the other fields are removed).

</details>

### Easy · Embed or reference?

A user's address and a user's orders — what do you embed and what do you reference?

<details>
<summary>Answer</summary>

- Address — embed; it is read with the user, small and bounded.
- Orders — a separate collection with a `userId` reference; unbounded growth (the 16 MB document limit), independent queries/paging.
- Rule — decide from the access pattern + growth + update frequency; "what is read together, stays together".

</details>

### Medium · Decrement stock atomically

Two customers buy the last item at the same time. The stock must not go negative — write the query.

<details>
<summary>Answer</summary>

```js
const result = await products.updateOne(
  { _id: productId, stock: { $gte: qty } },
  { $inc: { stock: -qty } },
);
if (result.modifiedCount === 0) throw new Error('Out of stock');
```

- Atomic — a single-document update is atomic; the condition and the decrement are one operation.
- A read-then-write (`findOne` → check → `updateOne`) creates a race.

</details>

### Medium · The array query trap

```js
db.orders.find({ 'items.sku': 'A', 'items.qty': { $gt: 5 } });
```

Does the order `{ items: [{ sku: 'A', qty: 1 }, { sku: 'B', qty: 9 }] }` match?

<details>
<summary>Answer</summary>

- Yes — the two conditions were satisfied by different array elements.
- When the same element is required:

```js
db.orders.find({ items: { $elemMatch: { sku: 'A', qty: { $gt: 5 } } } });
```

</details>

### Hard · One cart per user (an upsert race)

```js
await carts.updateOne({ userId }, { $setOnInsert: { items: [] } }, { upsert: true });
```

Two parallel requests sometimes create two carts. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Race — both upserts can see "no document found" and both insert.
- Fix — a unique index: `carts.createIndex({ userId: 1 }, { unique: true })`.
- Now — the second insert gives `E11000 duplicate key`; retry the operation on that error (now the document is found and updated).
- Rule — always enforce a uniqueness invariant with a unique index; an app-level check is race-prone.

</details>

## Sources — further reading

- [MongoDB elemMatch](https://www.mongodb.com/docs/manual/reference/operator/query/elemmatch/)

- [MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/03-documents-crud-modeling.md)
