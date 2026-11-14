---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 3
summary: Model — choose embedding or references from the reads, writes and growth.
tags: mongodb, interview, indexes, schema, transactions
visual: mongo-index
---

## Quick revision

> Revision target — Explain a query design in the order of data shape, cardinality and actual execution evidence.

- Model — choose embedding/references from the reads/writes and growth.
- Index — justify it from the real filter/sort + explain evidence.
- Transaction — is single-document atomicity enough, or is there a multi-document invariant?
- Mongoose — unique is an index, not a validator; middleware is method-specific.
- Express — explain the middleware order and who owns async errors.
- Security — object/tenant authorization on every request.
- Debug handoff — give the query, the plan, the timings and the smallest reproducible case.
- Query answer — state the filter, projection, sort, index and expected cardinality together.
- Webhook scenario — trace the signature, the durable receipt, dedupe and a repeated delivery.
- Failure scope — identify the client retry, the app rollback and the provider's side effect separately.

### Quick answer checks

- Query plan answer — the filter + the index + examined/returned counts; naming an index alone is not enough.
- API retry answer — the write may already have happened after a timeout; explain the idempotency key/reconciliation.

### Edge cases and reasoning

- Query reasoning sequence — read shape→growth bound→index→plan→write cost; naming the index first leaves the workload justification missing.
- Atomicity counterexample — a single write being atomic does not make a separate read/write safe; give the conditional predicate and an affected-count trace.
- Validation boundaries — a Mongoose rule, a unique DB index and API authorization are different guards; identify the owner of each failure.

## Research notes: Justify the query from its workload

- In the linked Microsoft technical guidance, testing and problem-solving are part of the assessment too.

## Understand it with an example

- Scenario — The latest 20 orders of a tenant are needed; the result is sorted by creation time and two orders have an equal timestamp.
- Reasoning — Define the authenticated tenant predicate and a deterministic tie-breaker ID. Represent the ordering boundary in the cursor; evaluate the candidate index against explain/the workload.
- Catch — A timestamp-only cursor can skip/duplicate equal-time rows; an extra index brings write/storage cost along with read speed. An index name alone is not the answer.

## Recall and practice

- Question — Why does Mongoose unique:true not turn a duplicate-user rejection into a normal validation error?
- Answer — The database's unique index enforces it; map the duplicate-key error, and verify index readiness and acceptance under a concurrent insert.
- Try it yourself — Design a tenant query and a last-stock update; defend the explain metrics, the $inc validator caveat, a duplicate webhook and the rejection of another tenant.

## Practice questions

### Easy · Answer structure for a blog model

<details>
<summary>Answer</summary>

- Access patterns first — the post page (post + author name + recent comments), the user's posts list, paging through comments.
- Model — `posts` (authorId, an authorName snapshot, tags, commentCount), and a separate `comments` collection (`postId`, `createdAt`).
- Indexes — `{ authorId: 1, createdAt: -1 }`, `{ postId: 1, createdAt: -1 }`, `{ tags: 1 }`.
- Trade-off — authorName is duplicated; a background update on a profile rename.

</details>

### Medium · Slow query answer

<details>
<summary>Answer</summary>

- Reproduce — the exact filter, sort, projection and data size.
- `explain('executionStats')` — COLLSCAN? keys/docs examined vs returned? an in-memory SORT?
- Fix — a compound index in ESR order; a projection; pagination by range.
- Verify — explain again + latency metrics; mention the write cost of the index.

</details>

### Medium · Atomicity counterexample

"In MongoDB, `orders.insertOne` and `inventory.updateOne` are separate calls — what can go wrong?"

<details>
<summary>Answer</summary>

- A crash in between — the order is created but the stock is not reduced (or the reverse).
- Concurrency — two orders for the same last item.
- Fix — the conditional decrement first (`stock: { $gte: qty }`), then the order; or a multi-document transaction; or a single-document model (a reservation) + an outbox.
- Say it — single-document operations are atomic; multi-document needs an explicit design.

</details>

### Medium · Webhook scenario answer

"The payment provider's webhook arrives duplicated and late — how do you handle it?"

<details>
<summary>Answer</summary>

- Verify — the signature on the raw body.
- Dedupe — a unique index on the event id.
- State machine — conditional order transitions (`status: 'pending'` → `paid`).
- Ack — `200` after a durable save; processing is async.
- Reconcile — a scheduled job checks pending payments with the provider.

</details>

### Hard · Design an Express + Mongo API with retries

The mobile client retries `POST /orders` on a timeout. An end-to-end idempotent design?

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

- Unique index — `{ userId: 1, key: 1 }`; among concurrent retries only one wins.
- Same transaction — the order + the key record; no half state.
- Payload hash — the same key with a different body → `422` (add this in production).

</details>

## Sources — further reading

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/04-mongodb-playbook.md)
