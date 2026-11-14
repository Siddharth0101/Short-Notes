---
id: system-design-consistency-limits
title: Consistency and distributed rate limiting — write down the guarantees first
track: system-design
order: 13
level: Advanced
minutes: 3
summary: Strong consistency — the latest ordered state, according to the defined operation model.
tags: consistency, rate-limiting, token-bucket, distributed
visual: token-bucket
---

## Quick revision

> Revision target — Give consistency and rate-limit claims an operation scope, a clock and an atomic decision boundary.

- Strong consistency — the latest ordered state, according to the defined operation model.
- Eventual consistency — replicas converge once writes stop; no immediate freshness.
- Read-your-writes — you must not see the old value after your own write; it needs a routing/version strategy.
- Replica lag — stale reads are possible; do critical reads from the primary/with appropriate consistency.
- CAP — a consistency/availability tradeoff during a network partition; not a universal toggle in normal times.
- Token bucket — refillable tokens; controls the rate + the burst capacity.
- Distributed limiter — a shared atomic decision or an explicitly approximate limit.
- Fail-open/closed — decide the availability/security tradeoff for a limiter outage.
- Quorum — an overlap of the read/write sets is useful; alone it is not a complete proof of linearizability.
- Clock skew — do not treat client timestamps as unquestioned proof of a total global order.
- Monotonic reads — a user must not see state older than a version they saw before; it needs routing/version tracking.

### Edge cases and reasoning

- Linearizability — an atomic point between an operation's invocation/response, preserving real-time order; serializability is a different guarantee, about transactions.
- Consensus scope — Raft makes a leader/majority agree on a replicated log; under the safety contract a partitioned minority cannot make progress on committed writes.
- Token refill atomicity — refill+consume in the same decision boundary; keep distributed clocks/the time source and the burst cap consistent.
- Limiter scope — per-instance100rps with ten instances is not a global100rps; state the shared decision/partitioned quota or the approximate guarantee explicitly.
- Partition availability — CAP availability requires every request to a non-failing node to get a response; the definition differs from an ordinary uptime percentage.

## Understand it with an example

- Scenario — A token bucket has capacity 5 and refills 2 tokens/s. From an initially full bucket, five requests consume tokens at the same instant.
- Reasoning — A sixth immediate request follows the reject/wait policy. Two tokens refill over the next one second; the elapsed time and the consume must be accounted for in one atomic state update.
- Catch — The refill cap stays at 5; idle time gives no unlimited burst credit. Independent per-instance buckets do not enforce a global limit.

## Recall and practice

- Question — If every replica allows per-user100rps and there are ten replicas, is the global maximum exactly100rps?
- Answer — No; independent counters potentially allow1000rps. You need a globally coordinated quota or a bounded approximate contract.
- Try it yourself — Trace the partition cases of a linearizable claim and of a global limiter; justify minority writes, clock skew, retries and the fail-open/closed policy.

## Practice questions

### Easy · Strong or eventual?

A bank balance, a like count, a product description, inventory at checkout — what does each one need?

<details>
<summary>Answer</summary>

- Bank balance — strong (linearizable writes/reads at decision point).
- Like count — eventual; a little staleness is fine.
- Product description — eventual (cache OK).
- Inventory at checkout — strong at the reservation step; eventual on the listing page.

</details>

### Medium · Implement a token bucket

Per user 10 requests/second, burst 20. A multi-instance setup.

<details>
<summary>Answer</summary>

- State — `tokens`, `lastRefill` per key in Redis.
- Refill — `tokens = min(capacity, tokens + elapsed × rate)`; on a request, if `tokens >= 1` then `-1`.
- Atomicity — read-refill-decrement in one Lua script/atomic op, otherwise concurrent requests break the limit.
- Time — use the Redis server time (to avoid clock skew).

</details>

### Medium · Limiter down: fail-open or fail-closed?

<details>
<summary>Answer</summary>

- Fail-open — allow requests when the limiter is down; availability is the priority (normal APIs).
- Fail-closed — deny; security-sensitive (login brute force, expensive paid APIs).
- Middle — local in-memory fallback limits per instance.
- Decide per route and document it.

</details>

### Medium · State CAP correctly

<details>
<summary>Answer</summary>

- CAP — during a network partition a system chooses either consistency (rejecting some requests) or availability (stale/conflicting responses).
- "Pick 2 of 3" is misleading — without a partition you can have both; there is also a latency vs consistency trade-off (PACELC).
- Interview — state it for a specific operation: "in a partition we reject checkout writes and serve stale catalog reads."

</details>

### Hard · Distributed lock and fencing token

Worker A took a lease lock, a GC pause hit, the lease expired; Worker B took the lock; A wakes up and writes old data.

<details>
<summary>Answer</summary>

- Problem — a lease is time-based; the holder does not know that the lock is gone.
- Fencing token — the lock service gives an increasing number on every grant (33, 34...); storage accepts only writes with a greater-or-equal token; A's token 33 is rejected.
- Storage cooperation is necessary — the lock service alone does not give safety.
- Better — wherever possible, correctness from DB conditional updates/unique constraints, with the lock only for efficiency.

</details>

## Sources — further reading

- [Raft original consensus paper](https://raft.github.io/raft.pdf)

- [Redis rate-limiter patterns](https://redis.io/docs/latest/commands/incr/)
- [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/13-consistency-limits.md)
