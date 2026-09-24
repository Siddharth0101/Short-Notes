---
id: mongo-indexes-aggregation-transactions
title: Indexes aggregation geospatial queries and transactions
track: mongodb
order: 5
level: Advanced
minutes: 1
summary: Index — query fast kar sakta hai; storage aur write cost badhta hai.
tags: indexes, aggregation, transactions, geospatial, explain, performance
visual: aggregation-pipeline
---

## Quick revision

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

## Research notes: Match the version you actually read

- Atomic update separate read-then-replace workflow ko race-free nahi banati.

## Sources — aur padhne ke liye

- [Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [Aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/05-indexes-aggregation-transactions.md)
