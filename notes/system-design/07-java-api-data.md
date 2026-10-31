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

> Revision target — Atomic write, operation identity aur total resource budget se backend contract defend karo.

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

### Edge cases aur reasoning

- Idempotency payload binding — key ko tenant+operation scope aur request fingerprint se bind; same key/different payload conflict reject karo.
- Receipt atomicity — dedupe receipt aur business mutation same durable transaction mein; receipt-only success se missing effect hide mat karo.
- Pool multiplication — replicas×per-instance pool size total DB connections; autoscale application ko DB admission budget se align karo.

## Example se samjho

- Scenario — Database app traffic ke liye 120 connections allow karti hai; six replicas ka pool maximum 20 hai. Autoscaling ten replicas tak hoti hai.
- Reasoning — Six replicas already 120 possible connections le sakti hain; ten replicas ka theoretical total 200 hai. Per-instance pool aur admission policy deployment scale ke saath budget karo.
- Catch — Idle connections, admin/migration work aur other services ka headroom bhi chahiye; app instances badhana DB capacity automatically nahi badhata.

## Recall aur practice

- Sawal — Same idempotency key par different transfer amount aaye toh cached success return karna valid?
- Jawaab — Contract violation/conflict reject; key original operation payload se bound honi chahiye, unrelated request ko success mat do.
- Khud try karo — Transfer receipt schema/API banao; concurrent same key, changed payload, lost response aur expiry/replay retention ke outcomes verify karo.

## Practice questions

### Easy · Layers ki responsibility

<details>
<summary>Answer</summary>

- Controller — HTTP mapping, DTO validation, status codes.
- Service — business rules, transactions, orchestration.
- Repository — persistence queries.
- Rule — dependencies andar ki taraf; controller repository ko directly business logic ke liye call na kare.

</details>

### Medium · Idempotency key implement karo

<details>
<summary>Answer</summary>

- Table — `idempotency_keys(key, user_id, request_hash, status, response, created_at)`, unique `(user_id, key)`.
- Flow — same transaction mein key claim + business write + response save.
- Replay — same key + same hash → stored response; same key + different payload → `422`.
- In-progress — doosri concurrent request ko `409`/wait; expiry policy.

</details>

### Medium · Sahi index choose karo

Queries: (a) `WHERE status = 'pending' ORDER BY created_at` (pending rows 1%), (b) `WHERE lower(email) = ?`, (c) `SELECT id, total WHERE customer_id = ?`.

<details>
<summary>Answer</summary>

- (a) Partial index — `CREATE INDEX ON orders (created_at) WHERE status = 'pending'`; chhota aur fast.
- (b) Expression index — `CREATE INDEX ON users (lower(email))` (ya `citext` type).
- (c) Covering — `CREATE INDEX ON orders (customer_id) INCLUDE (total)` → index-only scan possible.
- Cost — har index writes slow karta hai; `EXPLAIN (ANALYZE, BUFFERS)` se verify.

</details>

### Medium · Long transaction ka asar

Ek report job PostgreSQL transaction 3 ghante khula rakhta hai. Kya problems?

<details>
<summary>Answer</summary>

- MVCC — purane snapshot ki wajah se VACUUM dead rows saaf nahi kar paata → table/index bloat.
- Locks — agar job ne locks liye toh DDL/updates blocked.
- Fix — read replica par reporting, chunked queries, `idle_in_transaction_session_timeout`, transactions short.

</details>

### Hard · PostgreSQL deadlock

Logs: `deadlock detected`. Transfer API kabhi-kabhi fail hota hai. Kyun aur fix?

<details>
<summary>Answer</summary>

- Cause — T1 row A phir B lock karta hai, T2 row B phir A; dono wait → DB ek ko abort karta hai.
- Fix — consistent lock order (e.g. `SELECT ... WHERE id IN (a, b) ORDER BY id FOR UPDATE`).
- Retry — deadlock/serialization failures ke liye transaction-level retry (idempotent operation).
- Keep short — lock jitni der, deadlock window utni badi.

</details>

## Sources — aur padhne ke liye

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/07-java-api-data.md)
