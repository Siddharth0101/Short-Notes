---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 3
summary: Model — reads/writes aur growth se embedding/reference choose karo.
tags: mongodb, interview, indexes, schema, transactions
visual: mongo-index
---

## Quick revision

> Revision target — Query design ko data shape, cardinality aur actual execution evidence ke order mein explain karo.

- Model — reads/writes aur growth se embedding/reference choose karo.
- Index — real filter/sort + explain evidence se justify.
- Transaction — single-document atomicity enough hai ya multi-document invariant hai?
- Mongoose — unique index validator nahi; middleware method-specific hota hai.
- Express — middleware order aur async error ownership explain karo.
- Security — object/tenant authorization har request par.
- Debug handoff — query, plan, timings aur smallest reproducible case do.
- Query answer — filter, projection, sort, index aur expected cardinality saath bolo.
- Webhook scenario — signature, durable receipt, dedupe aur repeated delivery trace.
- Failure scope — client retry, app rollback aur provider side effect alag identify.

### Quick answer checks

- Query plan answer — filter + index + examined/returned counts; sirf index name bolna enough nahi.
- API retry answer — timeout ke baad write ho chuki ho sakti hai; idempotency key/reconciliation explain karo.

### Edge cases aur reasoning

- Query reasoning sequence — read shape→growth bound→index→plan→write cost; index name first bolne se workload justification missing rahegi.
- Atomicity counterexample — single write atomic hone se separate read/write safe nahi; conditional predicate aur affected-count trace do.
- Validation boundaries — Mongoose rule, unique DB index aur API authorization different guards; each failure ka owner identify karo.

## Research notes: Justify the query from its workload

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Example se samjho

- Scenario — Tenant ke latest 20 orders chahiye; result creation time par sort hota hai aur two orders ka timestamp equal hai.
- Reasoning — Authenticated tenant predicate aur deterministic tie-breaker ID define karo. Cursor mein ordering boundary represent karo; candidate index ko explain/workload se evaluate karo.
- Catch — Timestamp-only cursor equal-time rows skip/duplicate kar sakta hai; extra index read speed ke saath write/storage cost laata hai. Sirf index name answer nahi.

## Recall aur practice

- Sawal — Mongoose unique:true duplicate user rejection ko normal validation error kyun nahi banata?
- Jawaab — Database unique index enforce karta; duplicate-key error map karo, index readiness aur concurrent insert acceptance verify karo.
- Khud try karo — Tenant query aur last-stock update design karo; explain metrics, $inc validator caveat, duplicate webhook aur other-tenant rejection defend karo.

## Practice questions

### Easy · Blog model ka answer structure

<details>
<summary>Answer</summary>

- Access patterns pehle — post page (post + author name + recent comments), user's posts list, comments paging.
- Model — `posts` (authorId, authorName snapshot, tags, commentCount), `comments` alag collection (`postId`, `createdAt`).
- Indexes — `{ authorId: 1, createdAt: -1 }`, `{ postId: 1, createdAt: -1 }`, `{ tags: 1 }`.
- Trade-off — authorName duplicate; profile rename par background update.

</details>

### Medium · Slow query answer

<details>
<summary>Answer</summary>

- Reproduce — exact filter, sort, projection, data size.
- `explain('executionStats')` — COLLSCAN? keys/docs examined vs returned? in-memory SORT?
- Fix — ESR order compound index; projection; pagination by range.
- Verify — explain dobara + latency metrics; index write cost mention karo.

</details>

### Medium · Atomicity counterexample

"MongoDB mein `orders.insertOne` aur `inventory.updateOne` alag calls hain — kya galat ho sakta hai?"

<details>
<summary>Answer</summary>

- Crash beech mein — order bana, stock nahi ghata (ya ulta).
- Concurrency — do orders same last item.
- Fix — conditional decrement pehle (`stock: { $gte: qty }`), phir order; ya multi-document transaction; ya single document model (reservation) + outbox.
- Bolna — single-document operations atomic hain; multi-document ke liye explicit design.

</details>

### Medium · Webhook scenario answer

"Payment provider webhook duplicate aur late aata hai — kaise handle karoge?"

<details>
<summary>Answer</summary>

- Verify — signature on raw body.
- Dedupe — event id unique index.
- State machine — order transitions conditional (`status: 'pending'` → `paid`).
- Ack — durable save ke baad `200`; processing async.
- Reconcile — scheduled job provider se pending payments check.

</details>

### Hard · Express + Mongo API retries ke saath design

Mobile client `POST /orders` timeout par retry karta hai. End-to-end idempotent design?

<details>
<summary>Answer</summary>

```js
app.post('/orders', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ code: 'IDEMPOTENCY_KEY_REQUIRED' });
  const existing = await idempotency.findOne({ userId: req.user.id, key });
  if (existing) return res.status(existing.status).json(existing.body);
  const session = client.startSession();
  try {
    let response;
    await session.withTransaction(async () => {
      const order = await createOrder(req.user.id, req.body, session);
      response = { status: 201, body: { id: order._id } };
      await idempotency.insertOne({ userId: req.user.id, key, ...response }, { session });
    });
    res.status(response.status).json(response.body);
  } catch (error) {
    if (error.code === 11000) {
      const saved = await idempotency.findOne({ userId: req.user.id, key });
      return res.status(saved.status).json(saved.body);
    }
    throw error;
  } finally {
    await session.endSession();
  }
});
```

- Unique index — `{ userId: 1, key: 1 }`; concurrent retries mein ek hi jeetega.
- Same transaction — order + key record; half state nahi.
- Payload hash — same key, different body → `422` (production mein add karo).

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/04-mongodb-playbook.md)
