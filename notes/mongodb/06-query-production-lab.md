---
id: mongodb-query-production-lab
title: MongoDB query plans and Node streaming lab
track: mongodb
order: 6
level: Advanced
minutes: 25
summary: Reason from access patterns and backpressure instead of adding indexes blindly.
tags: mongodb, indexes, explain, streams, backpressure
---

## Mental model

An index is a maintained access path, not a free speed switch. Start with the query's equality filters, ordering and range conditions, then check the plan on representative data. Node streaming solves a related resource problem: process data incrementally so a slow consumer does not require buffering the whole result.

> **Core takeaway:** An index is useful when its ordering matches the actual filter and sort pattern.

## Design one real access pattern

Suppose a tenant's recent paid orders are requested in descending creation order. Use a stable tie-breaker because timestamps can repeat.

```javascript
db.orders.createIndex({ tenantId: 1, status: 1, createdAt: -1, _id: -1 });
db.orders.find({ tenantId: 't1', status: 'paid' })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .explain('executionStats');
```

Read the winning plan, returned count and examined keys/documents. A small nReturned with huge documents examined is a warning, not proof of one particular fix. Selectivity, sort support and data distribution matter. A query for status alone does not have the same useful leading prefix as the tenant-scoped query above.

For the next page, anchor both createdAt and _id with a lexicographic condition. Encode cursor values without losing BSON types. Validate cursor shape and apply the tenant filter on every request; a cursor is not authorization.

## Stream without whole-file buffering

```javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('export.ndjson'),
  createGzip(),
  createWriteStream('export.ndjson.gz'),
);
```

pipeline coordinates stream completion, errors and backpressure. This example compresses an existing file; an API export also needs database cursor cleanup, client-disconnect handling and authorization. Do not collect the cursor into a giant array before streaming, because that defeats the memory objective.

## Consistency and modeling decisions

Single-document updates are atomic. A unique index protects uniqueness under races; application-level find-then-insert does not. Multi-document invariants may require transactions, but design the ownership boundary first. Embedding bounded child data can make an invariant easier to update atomically. Unbounded arrays create document growth and update-cost problems.

Replication and acknowledgement settings affect failure semantics. Do not equate a successful local read with a universally fresh global view. State what the user needs after their own write, how reads are routed and what happens during failover. A fixed delay before reading is a heuristic, not a proof of freshness.

## Practice

Generate skewed data: one large tenant and many small tenants. Compare the plan for both rather than only a uniform toy dataset. Remove the sort-supporting index and inspect whether a blocking sort appears. For streaming, slow the destination and watch memory stabilize; then force a destination error and verify resources close.

## Interview questions

**Should every filter field get a separate index?** No. Compound access patterns, write cost and storage must be considered; inspect plans rather than assuming index intersection will solve everything.

**Does backpressure eliminate overload?** It propagates pacing within cooperating boundaries. Admission control, deadlines and bounded queues are still needed across the full service.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** You list a user's published notes newest first. Suggest an index candidate and describe how to judge it on representative data.

> **Hint:** Equality fields can precede the sort field.

**Answer guide — compare after attempting:** Try a compound index on userId, status, and descending createdAt, adding a stable tie-breaker if pagination requires it. Compare explain execution statistics, examined rows/keys, and sorting behavior. Include write/storage cost and real selectivity; do not declare success just because an index exists.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/) and [Node streams](https://nodejs.org/api/stream.html) are the primary references for the examples.
