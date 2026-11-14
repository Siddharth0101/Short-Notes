---
id: mongodb-query-production-lab
title: MongoDB query plans and Node streaming lab
track: mongodb
order: 6
level: Advanced
minutes: 3
summary: `explain` — look at the chosen plan, the keys/docs examined and the returned count.
tags: mongodb, indexes, explain, streams, backpressure
---

## Quick revision

> Revision target — Assess query speed from a representative workload and examined/returned evidence.

- `explain` — look at the chosen plan, the keys/docs examined and the returned count.
- Selectivity — how much data the filter removes; merely having an index is not enough.
- Covered query — the result can come from the index alone; the fetch cost is saved.
- Stable pagination — a sort + a unique tie-breaker; a deep skip can be costly.
- Cursor — read records in batches/chunks.
- Export — stream with backpressure; clean up the cursor/resource on a disconnect.
- Query budget — enforce a limit, a timeout and the tenant filter.
- Projection cost — a smaller payload is useful; verify the actual index/plan for covered execution.
- Cursor batch — the batch size is a memory/round-trip tradeoff; the total returned data limit is separate.
- Explain comparison — compare before/after on the same representative filter/data distribution.

### Edge cases and reasoning

- Cursor timeout scope — the server's maxTimeMS bounds the query work; the full client/network operation needs a separate deadline/cancellation.
- Index ratio context — interpret keys/docs examined versus returned in the light of the workload; with zero results or low cardinality the ratio alone can mislead.
- Explain cache difference — an explain execution does not exactly reproduce normal plan-cache behaviour; validate together with production telemetry.

## Understand it with an example

- Scenario — Two candidate plans return 10 records for the same query; the first examines 10000 documents, the second 12.
- Reasoning — The second is useful evidence of less scanning; compare latency, key scans, sort work and write/storage cost under the same data conditions.
- Catch — One sample does not prove a universal winner; check empty results, hot tenants and a changed data distribution. The IXSCAN label alone is not proof of efficiency.

## Recall and practice

- Question — Is seeing IXSCAN sufficient proof that a query is efficient?
- Answer — No; a huge key scan, a document fetch or a blocking sort is still expensive. Look at the examined counts, latency and a representative distribution.
- Try it yourself — Inspect a tenant+createdAt+ID cursor query; verify same-time records, no results, a deep page and the cursor closing on a disconnect.

## Practice questions

### Easy · Reading `explain`

`executionStats` shows `COLLSCAN`, `totalDocsExamined: 500000`, `nReturned: 20`. What does it mean?

<details>
<summary>Answer</summary>

- `COLLSCAN` — a full collection scan; no index was used.
- Ratio — 500,000 docs read for 20 results; very wasteful.
- Target — `IXSCAN`, with `totalKeysExamined` and `totalDocsExamined` close to `nReturned`.

</details>

### Medium · Covered query

The index is `{ email: 1, name: 1 }`. Why is the query `find({ email }, { name: 1 })` not covered?

<details>
<summary>Answer</summary>

- `_id` — the default projection includes `_id`, which is not in the index; the document has to be fetched.
- Fix — `find({ email }, { _id: 0, name: 1 })`.
- Check — `totalDocsExamined: 0` and `PROJECTION_COVERED` in `explain`.

</details>

### Medium · Slow `skip` pagination

`find().sort({ createdAt: -1 }).skip(50000).limit(20)` is slow. Something better?

<details>
<summary>Answer</summary>

```js
db.posts.find({
  $or: [
    { createdAt: { $lt: last.createdAt } },
    { createdAt: last.createdAt, _id: { $lt: last._id } },
  ],
}).sort({ createdAt: -1, _id: -1 }).limit(20);
// index: { createdAt: -1, _id: -1 }
```

- `skip` — the skipped entries are traversed too; deep pages slow down linearly.
- Range/keyset — continue from the last seen key; an `_id` tie-breaker prevents duplicates/skips.

</details>

### Medium · A CSV export of 2 million documents

<details>
<summary>Answer</summary>

```js
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

app.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  const cursor = orders.find({}, { projection: { _id: 1, total: 1 } }).batchSize(1000);
  const toCsv = new Transform({
    objectMode: true,
    transform(doc, _enc, done) { done(null, `${doc._id},${doc.total}\n`); },
  });
  await pipeline(cursor.stream(), toCsv, res);
});
```

- Do not call `toArray()` — all the data ends up in memory.
- `pipeline` — backpressure for a slow client, and the cursor closes on a client disconnect.
- Projection — only the fields needed; handle CSV escaping (commas/quotes) too.

</details>

### Hard · Fast in staging, slow in production

The same query takes 5ms in staging and 2s in prod. How do you investigate?

<details>
<summary>Answer</summary>

- Indexes — does that index exist in prod? (`getIndexes()`); is a background build pending?
- Data distribution — in prod `status: 'active'` may be 90% of the docs → the index is not selective; consider a compound/partial index.
- Explain on prod — `executionStats` and `allPlansExecution`; if the plan cache chose a wrong plan, clear the plan cache/use a hint (temporarily).
- Load — concurrent writes, a working set that does not fit in RAM (disk reads), the slow query profiler/logs.

</details>

## Sources — further reading

- [MongoDB explain and plan-cache behavior](https://www.mongodb.com/docs/manual/reference/explain-results/)
- [MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [Node streams](https://nodejs.org/api/stream.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/06-query-production-lab.md)
