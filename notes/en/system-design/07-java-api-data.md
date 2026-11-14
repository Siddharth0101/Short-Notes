---
id: design-java-api-data
title: Java backend API and data architecture
track: system-design
order: 7
level: Intermediate
minutes: 6
summary: Layers — controller contract, service rules, repository persistence.
tags: java, api, data-modeling, consistency
visual: request-flow
---

## Quick revision

> Revision target — Defend a backend contract with atomic writes, operation identity and the total resource budget.

- Layers — controller contract, service rules, repository persistence.
- Transaction — keep a business invariant inside an atomic database boundary.
- Constraint — stop invalid state at the database with uniqueness/foreign-key/check.
- Idempotency key — the same durable result for a retry of the same operation.
- Pagination — a stable order + a bounded size; a cursor is useful in large feeds.
- Pool — DB connections are a scarce resource; monitor wait time and saturation.
- Outbox — the business write and the event row in the same transaction.
- Migration — a compatible rollout; old/new versions can coexist.
- ETag/If-Match — update only when the resource version matches; surface a lost-update conflict.
- Bulk endpoint — a bounded batch size; a clear partial success/error response contract.
- Read model — an optimized query view; define its freshness/lag from the source write model explicitly.

### SQL transactions and views

- View — a saved query; a regular view is not a separate copy of the data.
- Materialized view — a stored result; it needs a refresh/freshness strategy.
- ACID — the guarantees of atomicity, consistency, isolation and durability.
- Savepoint — rolls back to a part of the transaction.
- CTE — a named intermediate query with WITH.
- Recursive CTE — a base + a recursive step; keep a cycle/termination guard.
- Lock/deadlock — short transactions, a consistent order and a retry policy.
- Read anomaly — the outcome of repeated reads and concurrent writes differs by isolation level.
- Transaction duration — do not hold locks unnecessarily for a remote call.

### SQL index selection

- B-tree — common for equality/range/order; not every index is a B-tree.
- Partial index — selected rows only; the query predicate must be compatible.
- Expression index — can help a query that matches the indexed expression.
- GIN/GiST — for specialized search/operator classes.
- Index-only scan — visibility conditions matter too, along with covering columns.
- Write amplification — extra indexes add maintenance on every write; review unused indexes.
- Sort support — index ordering helps only when the query predicates/direction are compatible.
- Plan evidence — a large mismatch between estimated and actual rows can signal a statistics/data-skew issue.

### PostgreSQL internals

- Page — the block of disk/storage I/O; rows/index entries live in pages.
- Buffer cache — hot pages in memory; a cache hit/miss changes the latency.
- WAL — a durable log of changes, for recovery.
- MVCC — concurrent snapshots through row versions; old versions need cleanup.
- Vacuum — dead-row cleanup/space reuse; the exact behaviour is PostgreSQL-specific.
- Planner — estimates cost from statistics; stale stats can give a bad plan.
- Locks — coordinate conflicting operations; measure waits/deadlocks.
- Durability — the commit guarantee is tied to the storage/log configuration.
- Checkpoint — coordinates dirty-page persistence and log recovery work; monitor latency spikes.
- Long snapshot — can retain old row versions; inspect the transaction age.
- Hot page — concentrated updates can bring contention; evaluate the access pattern and index keys.

### Backend for frontend

- Fan-out — independent calls in bounded parallel; a partial failure contract.
- Token translation — map browser credentials safely to an internal identity.
- Caching — user/tenant scope + freshness; do not mix private payloads.

### SQL index tradeoffs

- BRIN — block-range summaries; useful on huge tables correlated with physical order, not for an exact row lookup.
- Hash index — for PostgreSQL equality queries; consider a B-tree for range/order.
- INCLUDE — non-key payload columns in the index; the visibility conditions of index-only execution still matter.

### Edge cases and reasoning

- Idempotency payload binding — bind the key to the tenant+operation scope and a request fingerprint; reject a same key/different payload conflict.
- Receipt atomicity — the dedupe receipt and the business mutation in the same durable transaction; do not hide a missing effect behind a receipt-only success.
- Pool multiplication — replicas×per-instance pool size is the total DB connections; align application autoscaling with the DB admission budget.

## Understand it with an example

- Scenario — The database allows 120 connections for app traffic; six replicas have a pool maximum of 20. Autoscaling goes up to ten replicas.
- Reasoning — Six replicas can already take 120 possible connections; the theoretical total of ten replicas is 200. Budget the per-instance pool and the admission policy together with the deployment scale.
- Catch — You also need headroom for idle connections, admin/migration work and other services; adding app instances does not automatically add DB capacity.

## Recall and practice

- Question — If a different transfer amount arrives on the same idempotency key, is returning the cached success valid?
- Answer — Reject it as a contract violation/conflict; the key must be bound to the original operation payload, so do not give an unrelated request a success.
- Try it yourself — Build a transfer receipt schema/API; verify the outcomes of a concurrent same key, a changed payload, a lost response and expiry/replay retention.

## Practice questions

### Easy · The responsibility of each layer

<details>
<summary>Answer</summary>

- Controller — HTTP mapping, DTO validation, status codes.
- Service — business rules, transactions, orchestration.
- Repository — persistence queries.
- Rule — dependencies point inwards; the controller must not call the repository directly for business logic.

</details>

### Medium · Implement an idempotency key

<details>
<summary>Answer</summary>

- Table — `idempotency_keys(key, user_id, request_hash, status, response, created_at)`, unique `(user_id, key)`.
- Flow — the key claim + the business write + saving the response in the same transaction.
- Replay — same key + same hash → the stored response; same key + a different payload → `422`.
- In-progress — `409`/wait for a second concurrent request; an expiry policy.

</details>

### Medium · Choose the right index

Queries: (a) `WHERE status = 'pending' ORDER BY created_at` (pending rows 1%), (b) `WHERE lower(email) = ?`, (c) `SELECT id, total WHERE customer_id = ?`.

<details>
<summary>Answer</summary>

- (a) Partial index — `CREATE INDEX ON orders (created_at) WHERE status = 'pending'`; small and fast.
- (b) Expression index — `CREATE INDEX ON users (lower(email))` (or the `citext` type).
- (c) Covering — `CREATE INDEX ON orders (customer_id) INCLUDE (total)` → an index-only scan is possible.
- Cost — every index slows writes down; verify with `EXPLAIN (ANALYZE, BUFFERS)`.

</details>

### Medium · The effect of a long transaction

A report job keeps a PostgreSQL transaction open for 3 hours. What are the problems?

<details>
<summary>Answer</summary>

- MVCC — because of the old snapshot, VACUUM cannot clean dead rows → table/index bloat.
- Locks — if the job took locks, DDL/updates are blocked.
- Fix — reporting on a read replica, chunked queries, `idle_in_transaction_session_timeout`, short transactions.

</details>

### Hard · PostgreSQL deadlock

Logs: `deadlock detected`. The transfer API fails now and then. Why, and the fix?

<details>
<summary>Answer</summary>

- Cause — T1 locks row A then B, T2 locks row B then A; both wait → the DB aborts one.
- Fix — a consistent lock order (e.g. `SELECT ... WHERE id IN (a, b) ORDER BY id FOR UPDATE`).
- Retry — a transaction-level retry for deadlock/serialization failures (an idempotent operation).
- Keep short — the longer a lock is held, the bigger the deadlock window.

</details>

## Sources — further reading

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/07-java-api-data.md)
