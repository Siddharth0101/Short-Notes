---
id: design-java-api-data
title: Java backend API and data architecture
track: system-design
order: 7
level: Intermediate
minutes: 3
summary: Layers — controller contract, service rules, repository persistence.
tags: java, api, data-modeling, consistency
visual: request-flow
---

## Quick revision

- Layers — controller contract, service rules, repository persistence.
- Transaction — business invariant ko atomic database boundary mein rakho.
- Constraint — uniqueness/foreign-key/check se invalid state database par roko.
- Idempotency key — same operation retry ka same durable result.
- Pagination — stable order + bounded size; large feeds mein cursor useful.
- Pool — DB connections scarce resource; wait time aur saturation monitor karo.
- Outbox — business write aur event row same transaction mein.
- Migration — compatible rollout; old/new versions coexist kar sakein.
- ETag/If-Match — resource version match ho tab update; lost-update conflict surface karo.
- Bulk endpoint — bounded batch size; partial success/error response contract clear.
- Read model — optimized query view; source write model se freshness/lag explicitly define.

### SQL transactions aur views

- View — saved query; regular view data ki separate copy nahi.
- Materialized view — stored result; refresh/freshness strategy chahiye.
- ACID — atomicity, consistency, isolation, durability ke guarantees.
- Savepoint — transaction ke ek part tak rollback.
- CTE — WITH se named intermediate query.
- Recursive CTE — base + recursive step; cycle/termination guard rakho.
- Lock/deadlock — short transactions, consistent order aur retry policy.
- Read anomaly — isolation level ke hisaab se repeat reads aur concurrent writes ka outcome differ.
- Transaction duration — remote call ke liye locks unnecessarily hold mat karo.

### SQL index selection

- B-tree — equality/range/order mein common; har index B-tree nahi.
- Partial index — selected rows only; query predicate compatible ho.
- Expression index — indexed expression se matching query useful ho sakti hai.
- GIN/GiST — specialized search/operator classes ke liye.
- Index-only scan — covering columns ke saath visibility conditions bhi matter.
- Write amplification — extra indexes har write par maintenance badhate hain; unused indexes review karo.
- Sort support — index ordering tabhi useful jab query predicates/direction compatible hon.
- Plan evidence — rows estimated vs actual ka large mismatch statistics/data-skew issue signal kar sakta hai.

### PostgreSQL internals

- Page — disk/storage I/O ka block; rows/index entries pages mein.
- Buffer cache — hot pages memory mein; cache hit/miss latency badalta hai.
- WAL — changes ka durable log recovery ke liye.
- MVCC — row versions se concurrent snapshots; old versions cleanup chahiye.
- Vacuum — dead-row cleanup/space reuse; exact behavior PostgreSQL-specific.
- Planner — statistics se cost estimate; stale stats bad plan de sakti hain.
- Locks — conflicting operations coordinate; waits/deadlocks measure karo.
- Durability — commit guarantee storage/log configuration se tied hai.
- Checkpoint — dirty-page persistence aur log recovery work coordinate; latency spikes monitor.
- Long snapshot — old row versions retain kar sakta hai; transaction age inspect.
- Hot page — concentrated updates contention la sakti hain; access pattern aur index keys evaluate.

### Backend for frontend

- Fan-out — independent calls bounded parallel; partial failure contract.
- Token translation — browser credentials ko internal identity se safely map.
- Caching — user/tenant scope + freshness; private payload mix mat karo.

### SQL index tradeoffs

- BRIN — block-range summaries; physical order se correlated huge tables mein useful, exact row lookup nahi.
- Hash index — PostgreSQL equality queries ke liye; range/order ke liye B-tree consider.
- INCLUDE — non-key payload columns index mein; index-only execution ki visibility conditions phir bhi matter.

## Sources — aur padhne ke liye

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/07-java-api-data.md)
