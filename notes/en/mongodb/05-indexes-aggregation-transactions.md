---
id: mongo-indexes-aggregation-transactions
title: Indexes aggregation geospatial queries and transactions
track: mongodb
order: 5
level: Advanced
minutes: 4
summary: Index — can make a query fast; it adds storage and write cost.
tags: indexes, aggregation, transactions, geospatial, explain, performance
visual: aggregation-pipeline
---

## Quick revision

> Revision target — Reason about pipeline cardinality, index cost and the scope of a multi-document transaction.

- Index — can make a query fast; it adds storage and write cost.
- Compound index — match the field order to the filters/sort/range.
- Unique index — rejects a duplicate key in the database.
- Aggregation — a pipeline of `$match` → transform/group → sort/project.
- `$unwind` — turns array elements into separate rows.
- `$lookup` — joins collections; check the cardinality and the indexes.
- Geospatial — the correct GeoJSON/index for a location query.
- Transaction — multi-document atomicity; needs a session, retries and deployment support.
- TTL — background expiry; deletion at the exact deadline is not guaranteed.
- Early filtering — suitable $match stages can reduce the downstream documents; inspect the actual optimized plan.
- Unbounded array — document growth and update cost; consider a bucket/reference model.
- Write concern — the acknowledgement/durability requirement; define the exact guarantee of a successful response.

### Read guarantees

- Read concern — which visibility/isolation guarantee a read needs; a separate setting from write acknowledgement.
- Read preference — which replica member a read goes to; secondary reads can be stale because of replication lag.
- Causal session — read-your-writes/order guarantees with majority reads + majority writes; keep operations in the session sequential.
- Causal isolation — a causal session does not block other writers; their interleaved updates can be visible.
- Transaction routing — a Mongo transaction with reads uses the primary read preference.

### Array indexes

- Multikey index — array elements are indexed; an index on an array field can become multikey automatically.
- Compound multikey — at most one array-valued field among the indexed fields of one document is allowed.
- Unique multikey — uniqueness is across documents; repeated array elements in the same document are not rejected automatically.

### Edge cases and reasoning

- Transaction retry side effect — the driver can rerun the callback; do not execute email/payment non-idempotently in the callback, use a durable outbox.
- Transaction parallelism — keep the operations of a transaction on the same session sequential; do not assume Promise.all is a supported parallel transaction workflow.
- TTL business check — enforce expiry in the query for an expired token/lease; do not turn background deletion lag into a validity guarantee.

## Research notes: Match the version you actually read

- An atomic update does not make a separate read-then-replace workflow race-free.

## Understand it with an example

- Scenario — An order has the items `[tea,book]`; an aggregation needs the order count, but the pipeline unwinds items first.
- Reasoning — After the unwind there are two rows from the same order. Counting rows gives 2, counting distinct order identities gives 1; group according to the intended grain.
- Catch — An index or a transaction does not fix a logical counting mistake; trace the document count/shape at each stage and keep array growth bounded.

## Recall and practice

- Question — Why is repeating a payment request on a transaction callback retry dangerous?
- Answer — A database attempt's rollback/retry does not undo the external provider's effect; enforce payment identity and a durable workflow separately.
- Try it yourself — Build a two-document transfer plan; verify the correct outcome for a transient retry, an unknown commit, a duplicate external notification and a delayed TTL deletion.

## Practice questions

### Easy · Which queries does a compound index help?

The index is `{ status: 1, createdAt: -1 }`. Which queries will use it efficiently?

<details>
<summary>Answer</summary>

- Yes — `find({ status: 'paid' })`, `find({ status: 'paid' }).sort({ createdAt: -1 })`.
- No (not efficiently) — `find({ createdAt: { $gte: d } })` alone; the index prefix starts with `status`.
- ESR rule — Equality fields first, Sort fields in the middle, Range fields last.

</details>

### Easy · Business logic on a TTL index

There is a TTL index on a session's `expiresAt`. Does an expired session disappear immediately?

<details>
<summary>Answer</summary>

- No — the TTL monitor runs periodically (~60s); the delete can be delayed.
- Rule — check `expiresAt > now` on read too; TTL is only cleanup.
- Field — it must be of type `Date`.

</details>

### Medium · Top 5 products by revenue in the last 30 days

Orders: `{ createdAt, status, items: [{ productId, qty, price }] }`.

<details>
<summary>Answer</summary>

```js
db.orders.aggregate([
  { $match: { status: 'paid', createdAt: { $gte: since } } },
  { $unwind: '$items' },
  { $group: { _id: '$items.productId', revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
  { $sort: { revenue: -1 } },
  { $limit: 5 },
]);
```

- `$match` first — the index is used and fewer documents move on.
- `$unwind` — every item becomes a separate document; `$group` by productId.
- Money — prices as integer paise or `Decimal128`, not double.

</details>

### Medium · All comments inside the post

In a viral post the comments array can reach hundreds of thousands. The problems?

<details>
<summary>Answer</summary>

- The 16 MB document limit — an unbounded array eventually fails.
- Performance — every read/update handles a large document; the multikey index becomes very large.
- Fix — a separate `comments` collection (a `postId` + `createdAt` index) with paging; in the post only `commentCount` and perhaps the latest 3 (the subset pattern).

</details>

### Hard · Transaction retries and side effects

```js
await session.withTransaction(async () => {
  await orders.insertOne(order, { session });
  await inventory.updateOne({ sku }, { $inc: { stock: -1 } }, { session });
  await sendEmail(order); // !
});
```

What can go wrong?

<details>
<summary>Answer</summary>

- Retry — `withTransaction` can run the callback again on `TransientTransactionError`/an unknown commit → the email is sent twice.
- Rollback — the email was sent but the transaction aborted → the customer gets mail for a non-existent order.
- Fix — side effects after the commit: write an `outbox` document inside the transaction, and a worker sends the email later (idempotently).
- Requirements — transactions need a replica set/sharded cluster; write concern `majority` for durability.

</details>

## Sources — further reading

- [MongoDB transaction application retries](https://www.mongodb.com/docs/manual/core/transactions-in-applications/)

- [MongoDB — isolation and consistency](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/)
- [MongoDB — read preference](https://www.mongodb.com/docs/manual/core/read-preference/)
- [MongoDB — multikey indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/)

- [Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [Aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/05-indexes-aggregation-transactions.md)
