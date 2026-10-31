---
id: mongo-indexes-aggregation-transactions
title: Indexes aggregation geospatial queries and transactions
track: mongodb
order: 5
level: Advanced
minutes: 4
summary: Index — query fast kar sakta hai; storage aur write cost badhta hai.
tags: indexes, aggregation, transactions, geospatial, explain, performance
visual: aggregation-pipeline
---

## Quick revision

> Revision target — Pipeline cardinality, index cost aur multi-document transaction scope reason karo.

- Index — query fast kar sakta hai; storage aur write cost badhta hai.
- Compound index — field order filters/sort/range se match karo.
- Unique index — duplicate key ko database par reject karta hai.
- Aggregation — `$match` → transform/group → sort/project pipeline.
- `$unwind` — array elements ko separate rows banata hai.
- `$lookup` — collections join; cardinality aur indexes check karo.
- Geospatial — location query ke liye correct GeoJSON/index.
- Transaction — multi-document atomicity; session, retries aur deployment support chahiye.
- TTL — background expiry; exact deadline par deletion guaranteed nahi.
- Early filtering — suitable $match stages downstream documents kam kar sakti hain; actual optimized plan inspect.
- Unbounded array — document growth aur update cost; bucket/reference model consider.
- Write concern — acknowledgement/durability requirement; successful response ka exact guarantee define karo.

### Read guarantees

- Read concern — read ko kaunsi visibility/isolation guarantee chahiye; write acknowledgement se alag setting.
- Read preference — read kis replica member par jayegi; secondary reads replication lag ki wajah se stale ho sakti hain.
- Causal session — majority reads + majority writes ke saath read-your-writes/order guarantees; session mein operations sequential rakho.
- Causal isolation — causal session doosre writers ko block nahi karti; unke interleaved updates dikh sakte hain.
- Transaction routing — reads wali Mongo transaction primary read preference use karti hai.

### Array indexes

- Multikey index — array elements index hote hain; array field par index automatically multikey ban sakta hai.
- Compound multikey — ek document mein indexed fields mein maximum ek array-valued field allowed.
- Unique multikey — uniqueness documents ke beech; same document ke repeated array elements automatically reject nahi hote.

### Edge cases aur reasoning

- Transaction retry side effect — driver callback rerun ho sakta; email/payment ko callback mein non-idempotently execute mat karo, durable outbox use karo.
- Transaction parallelism — same session transaction ke operations sequential rakho; Promise.all ko supported parallel transaction workflow assume mat karo.
- TTL business check — expired token/lease query mein expiry enforce; background deletion lag ko validity guarantee mat banao.

## Research notes: Match the version you actually read

- Atomic update separate read-then-replace workflow ko race-free nahi banati.

## Example se samjho

- Scenario — Order mein items `[tea,book]` hain; aggregation order count chahiye, par pipeline pehle items unwind karti hai.
- Reasoning — Unwind ke baad same order se two rows hain. Rows count karoge toh2, distinct order identity count karoge toh1; intended grain ke hisaab se group karo.
- Catch — Index ya transaction logical counting mistake fix nahi karte; each stage ka document count/shape trace karo aur arrays ki growth bounded rakho.

## Recall aur practice

- Sawal — Transaction callback retry par payment request dobara kyun dangerous hai?
- Jawaab — Database attempt rollback/retry external provider effect undo nahi karta; payment identity aur durable workflow alag enforce karo.
- Khud try karo — Two-document transfer plan banao; transient retry, unknown commit, duplicate external notification aur delayed TTL deletion ka correct outcome verify karo.

## Practice questions

### Easy · Compound index kin queries ko help karta hai?

Index `{ status: 1, createdAt: -1 }`. Kaunsi queries efficiently use karengi?

<details>
<summary>Answer</summary>

- Haan — `find({ status: 'paid' })`, `find({ status: 'paid' }).sort({ createdAt: -1 })`.
- Nahi (efficiently) — `find({ createdAt: { $gte: d } })` akela; index prefix `status` se shuru hota hai.
- ESR rule — Equality fields pehle, Sort fields beech mein, Range fields last.

</details>

### Easy · TTL index pe business logic

Session `expiresAt` par TTL index hai. Kya expire session turant gayab ho jaayega?

<details>
<summary>Answer</summary>

- Nahi — TTL monitor periodically (~60s) chalta hai; delete delay ho sakta hai.
- Rule — read par bhi `expiresAt > now` check karo; TTL sirf cleanup hai.
- Field — `Date` type honi chahiye.

</details>

### Medium · Last 30 days ke top 5 products by revenue

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

- `$match` pehle — index use hota hai aur kam documents aage jaate hain.
- `$unwind` — har item alag document; `$group` productId par.
- Money — prices integer paise mein ya `Decimal128`, double nahi.

</details>

### Medium · Post ke andar saare comments

Viral post mein comments array lakhon tak jaa sakta hai. Problems?

<details>
<summary>Answer</summary>

- 16 MB document limit — unbounded array eventually fail.
- Performance — har read/update bada document; multikey index bahut bada.
- Fix — `comments` alag collection (`postId` + `createdAt` index), paging; post mein sirf `commentCount` aur shayad latest 3 (subset pattern).

</details>

### Hard · Transaction retry aur side effects

```js
await session.withTransaction(async () => {
  await orders.insertOne(order, { session });
  await inventory.updateOne({ sku }, { $inc: { stock: -1 } }, { session });
  await sendEmail(order); // !
});
```

Kya galat ho sakta hai?

<details>
<summary>Answer</summary>

- Retry — `withTransaction` `TransientTransactionError`/unknown commit par callback dobara chala sakta hai → email do baar.
- Rollback — email bhej diya par transaction abort hua → customer ko non-existent order ka mail.
- Fix — side effects commit ke baad: transaction ke andar `outbox` document likho, worker baad mein email bheje (idempotent).
- Requirements — transactions replica set/sharded cluster par; write concern `majority` durability ke liye.

</details>

## Sources — aur padhne ke liye

- [MongoDB transaction application retries](https://www.mongodb.com/docs/manual/core/transactions-in-applications/)

- [MongoDB — isolation and consistency](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/)
- [MongoDB — read preference](https://www.mongodb.com/docs/manual/core/read-preference/)
- [MongoDB — multikey indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/)

- [Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [Aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/05-indexes-aggregation-transactions.md)
