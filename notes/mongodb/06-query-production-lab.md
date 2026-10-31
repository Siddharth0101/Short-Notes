---
id: mongodb-query-production-lab
title: MongoDB query plans and Node streaming lab
track: mongodb
order: 6
level: Advanced
minutes: 3
summary: `explain` — chosen plan, keys/docs examined aur returned count dekho.
tags: mongodb, indexes, explain, streams, backpressure
---

## Quick revision

> Revision target — Query speed ko representative workload aur examined/returned evidence se assess karo.

- `explain` — chosen plan, keys/docs examined aur returned count dekho.
- Selectivity — filter kitna data hataata hai; sirf index hona enough nahi.
- Covered query — result index se mil sakta hai; fetch cost bachti hai.
- Stable pagination — sort + unique tie-breaker; deep skip costly ho sakta hai.
- Cursor — batches/chunks mein records read karo.
- Export — stream with backpressure; disconnect par cursor/resource cleanup.
- Query budget — limit, timeout aur tenant filter enforce karo.
- Projection cost — smaller payload useful; covered execution ke liye actual index/plan verify.
- Cursor batch — batch size memory/round-trip tradeoff; total returned data limit alag.
- Explain comparison — same representative filter/data distribution par before/after compare.

### Edge cases aur reasoning

- Cursor timeout scope — server maxTimeMS query work bound karta hai; full client/network operation ko separate deadline/cancellation chahiye.
- Index ratio context — keys/docs examined versus returned workload se interpret; zero results ya low cardinality mein ratio alone misleading ho sakta.
- Explain cache difference — explain execution normal plan-cache behavior ko exactly reproduce nahi; production telemetry ke saath validate karo.

## Example se samjho

- Scenario — Two candidate plans same query ke10 records return karte hain; first10000 documents, second12 documents examine karta hai.
- Reasoning — Second less scanning ka useful evidence hai; latency, key scans, sort work aur write/storage cost same data conditions mein compare karo.
- Catch — One sample universal winner prove nahi; empty results, hot tenants aur changed data distribution check karo. IXSCAN label alone efficiency ka proof nahi.

## Recall aur practice

- Sawal — IXSCAN dekhna query efficient hone ka sufficient proof hai?
- Jawaab — Nahi; huge key scan, document fetch ya blocking sort still expensive. Examined counts, latency aur representative distribution dekho.
- Khud try karo — Tenant+createdAt+ID cursor query inspect karo; same-time records, no results, deep page aur disconnect par cursor close verify karo.

## Practice questions

### Easy · `explain` padhna

`executionStats` mein `COLLSCAN`, `totalDocsExamined: 500000`, `nReturned: 20`. Matlab?

<details>
<summary>Answer</summary>

- `COLLSCAN` — poora collection scan, index use nahi hua.
- Ratio — 20 results ke liye 5 lakh docs padhe; bahut wasteful.
- Target — `IXSCAN`, `totalKeysExamined` aur `totalDocsExamined` `nReturned` ke kareeb.

</details>

### Medium · Covered query

Index `{ email: 1, name: 1 }`. Query `find({ email }, { name: 1 })` covered kyun nahi hai?

<details>
<summary>Answer</summary>

- `_id` — default projection mein `_id` aata hai jo index mein nahi; document fetch karna padta hai.
- Fix — `find({ email }, { _id: 0, name: 1 })`.
- Check — `explain` mein `totalDocsExamined: 0` aur `PROJECTION_COVERED`.

</details>

### Medium · `skip` pagination slow

`find().sort({ createdAt: -1 }).skip(50000).limit(20)` slow hai. Better?

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

- `skip` — skipped entries bhi traverse hote hain; deep pages linear slow.
- Range/keyset — last seen key se aage; `_id` tie-breaker duplicates/skips rokta hai.

</details>

### Medium · 20 lakh documents CSV export

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

- `toArray()` mat karo — saara data memory mein.
- `pipeline` — slow client par backpressure, client disconnect par cursor close.
- Projection — sirf zaroori fields; CSV escaping (commas/quotes) bhi handle karo.

</details>

### Hard · Staging mein fast, production mein slow

Same query staging mein 5ms, prod mein 2s. Kaise investigate karoge?

<details>
<summary>Answer</summary>

- Indexes — prod mein woh index exist karta hai? (`getIndexes()`); background build pending?
- Data distribution — prod mein `status: 'active'` 90% docs ho sakte hain → index selective nahi; compound/partial index sochna.
- Explain prod par — `executionStats` aur `allPlansExecution`; plan cache ne galat plan choose kiya ho toh plan cache clear/hint (temporary).
- Load — concurrent writes, working set RAM mein fit nahi (disk reads), slow query profiler/logs.

</details>

## Sources — aur padhne ke liye

- [MongoDB explain and plan-cache behavior](https://www.mongodb.com/docs/manual/reference/explain-results/)
- [MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [Node streams](https://nodejs.org/api/stream.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/06-query-production-lab.md)
