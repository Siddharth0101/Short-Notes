---
id: design-scaling-caching
title: Scaling caching replication and partitioning
track: system-design
order: 2
level: Advanced
minutes: 4
summary: Vertical scaling — one bigger machine; horizontal — more instances.
tags: caching, scaling, replication, sharding
visual: caching
---

## Quick revision

> Revision target — Connect a cache and a queue to backend protection, acceptable staleness and measurable capacity.

- Vertical scaling — one bigger machine; horizontal — more instances.
- Load balancer — distributes traffic; define the health and overload behaviour.
- Stateless service — request state lives in a shared store/the client contract; replicas are simpler.
- Cache-aside — on a miss, read the DB and fill the cache.
- TTL — the staleness window; not an exact consistency guarantee.
- Invalidation — update/delete the cache on writes; handle the races.
- Stampede — duplicate work on the same miss; coalescing, jitter or refresh control.
- Replication — copies for reads/availability; there can be lag.
- Partitioning — splits the data; think about key skew and hot partitions.
- Hot key — one popular key/shard becomes the bottleneck; consider replication, splitting or coalescing.
- Negative cache — cache a not-found result briefly; it needs a staleness rule after creation.
- Consistent hashing — a limited set of keys remap on a membership change; replicas/virtual nodes improve the balancing.

### Cache write policies

- Write-through — the cache layer completes the DB write synchronously; write latency goes up.
- Write-behind — the cache write first, the DB later; a crash before the flush risks data loss.
- Refresh-ahead — refreshes likely-needed entries before expiry; a wrong prediction causes extra backend work.

### Traffic and failover

- Active-passive — one instance serves traffic and a standby takes over on failure; detection/startup delays recovery.
- Active-active — multiple instances serve traffic; handle shared state and concurrent-write conflicts.
- L4/L7 balancer — routes by transport IP/port / routes by application details such as the HTTP path/header.

### Edge cases and reasoning

- Cache fill race — a reader fetches old data, a writer invalidates, and the reader refills the stale cache; it needs a version/fencing/fill coordination contract.
- Hot-key fanout — sharding distributes uniform keys, it does not automatically split one hot key; evaluate request coalescing/replicas/a domain partition.
- Overload queue — if arrivals exceed sustained capacity the queue grows; define admission limits/load shedding and deadline-aware rejection.

## Research notes: Define behavior beyond capacity

- When requests differ in cost, a count alone does not describe capacity well.

## Understand it with an example

- Scenario — The moment a popular key expires, 200 requests arrive; every miss can start the same expensive database query.
- Reasoning — Per-key in-flight request coalescing can let them share one fill. Keep a bounded rule for the waiters' deadlines and for retry/rejection when the fill fails.
- Catch — A guard in one process is not global coordination across multiple instances; sending all traffic to the DB on a cache outage can multiply the overload.

## Recall and practice

- Question — Does deleting the cache after a write make a stale read impossible?
- Answer — No; an in-flight old reader can refill the stale value. You need versioned entries/fill coordination or an explicit guarantee of bounded staleness.
- Try it yourself — Write a cache-aside race timeline and a cache outage fallback; verify that the DB is protected, the stampede is bounded and the private cache scope is correct.

## Practice questions

### Easy · Stateless services and sessions

The app servers have to scale horizontally, but the login session is in server memory. What are the options?

<details>
<summary>Answer</summary>

- Sticky sessions — simple, but the session is lost when a node dies and the load is uneven.
- Shared store — a session store such as Redis; the servers are stateless.
- Token-based — a signed token held by the client (a revocation design is necessary).
- Goal — any instance can serve any request.

</details>

### Medium · Cache-aside and the invalidation order

How do you update both the DB and the cache on a product update? What is the race in "delete the cache first, then update the DB"?

<details>
<summary>Answer</summary>

- Read — cache miss → read from the DB → set in the cache (with a TTL).
- Write — update the DB, then delete the cache key (not set).
- Race (delete first) — after the delete and before the DB update, a read caches the old value → a stale cache until the TTL.
- Mitigation — delete after the DB update, a short TTL, and if needed a delayed second delete / a version check.

</details>

### Medium · Hot key

A celebrity's profile is so popular that one Redis shard is at 100% CPU.

<details>
<summary>Answer</summary>

- Local cache — a small in-process cache (seconds of TTL) in the app instances → fewer requests reach the shard.
- Key replication — `profile:123#0..9` copies on different shards; read a random copy, a write updates/invalidates all of them.
- Request coalescing — a single fetch on a miss, the rest wait.
- Detect — spot hot keys through per-key metrics/sampling.

</details>

### Medium · Why consistent hashing?

10 cache nodes run on `hash(key) % N`. What happens when you add one node?

<details>
<summary>Answer</summary>

- Modulo — as soon as `N` changes, almost all keys map to a new node → a massive cache miss storm.
- Consistent hashing — keys and nodes on a ring; only ~`1/N` of the keys move when a node is added/removed.
- Virtual nodes — many points for each physical node → the load is distributed evenly.

</details>

### Hard · Read replicas and read-your-writes

A user updates their profile and the old name shows on a page refresh (reads come from replicas). The fix?

<details>
<summary>Answer</summary>

- Cause — async replication lag; the write goes to the primary, the read comes from a lagging replica.
- Option 1 — route the user's reads to the primary for a few seconds after their write.
- Option 2 — keep the write's LSN/version in the client session; use a replica only once it has reached that position.
- Option 3 — show the optimistic updated value in the UI (cosmetic, not a guarantee).
- Monitor — a replication lag metric and an alert.

</details>

## Sources — further reading

- [Donne Martin — System Design Primer](https://github.com/donnemartin/system-design-primer)

- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/handling-overload/)
- [PostgreSQL replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Amazon Builders Library caching challenges](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/02-scaling-caching.md)
