---
id: interview-java
title: Java backend interview playbook
track: interview
order: 2
level: Advanced
minutes: 3
summary: Java equality — `==` compares references; `.equals()` compares logical value and depends on how the contract is implemented.
tags: java, interview, spring, concurrency, transactions
visual: thread-sync
---

## Quick revision

> Revision target — In a Java/backend answer, give the exact failure boundary and an observable verification.

- Java equality — `==` is reference; `.equals()` is logical value and depends on the contract's implementation.
- Hash key — keep equals/hashCode consistent; do not mutate a key.
- Concurrency — identify the shared state and the exact atomic boundary.
- `volatile` — visibility; a multi-step increment is not atomic.
- Transaction — explain the rule + isolation + the rollback/retry boundary.
- JPA — recognize N+1, lazy loading and optimistic-lock conflicts.
- Incident — give the symptom, evidence, cause, fix and verification.
- Design — split responsibilities through interfaces; explain the failure path too.
- Transaction scenario — list exactly which writes commit/roll back together.
- Concurrency trace — demonstrate the race with an interleaving of two callers.
- Pool debugging — separate the bottleneck using active, idle, waiting and query timings.

### Quick answer checks

- Java answer — distinguish value/reference, thread visibility and the transaction boundary with a code example.
- SQL answer — first clarify nulls, duplicates, ties and concurrent updates; verify the shape of the result.

### Edge cases and reasoning

- Incident timeline — give the exact chronology of the interleaving/query/commit; show reproduced evidence and a counterexample before blaming a model/library.
- Production qualifier — distinguish a thread-safe single operation from a transaction-wide invariant; substantiate a throughput gain with resource capacity.
- Failure honesty — do not label an unknown commit a failed write; give a concrete path for retry, reconciliation and a duplicate receipt.

## Research notes: Defend a failure boundary

- In the linked Microsoft technical guidance, testing and problem-solving are part of the assessment too.

## Understand it with an example

- Scenario — In an incident API latency has grown; the database query measures 40 ms and the connection-acquisition wait 900 ms.
- Reasoning — The answer should connect the pool wait to the main part of the symptom; give inspecting active connections, long transactions and request concurrency as the next step.
- Catch — Without evidence do not claim the database is slow or threads are too few; a larger pool can increase database saturation. State the load-test result of the fix and the remaining limit.

## Recall and practice

- Question — In a stock check+decrement race answer, what evidence would you give the interviewer?
- Answer — A two-thread interleaving, the violation of the nonnegative invariant, the chosen conditional atomic write and the result of a concurrent acceptance test.
- Try it yourself — A 20-minute round: solve an equality key bug, a pool-wait incident and a last-stock claim; explain the normal, concurrent and lost-response cases.

## Practice questions

### Easy · Structure of an `equals`/`hashCode` answer

<details>
<summary>Answer</summary>

- Contract — equal objects have the same hashCode; reflexive, symmetric, transitive, consistent.
- Failure — overriding only `equals` → duplicates/misses in HashSet/HashMap.
- Fields — the same fields in both; do not keep mutable fields in a key.
- Modern — a `record` generates them automatically.

</details>

### Medium · "The API is slow in production" — how do you answer?

<details>
<summary>Answer</summary>

- Scope — which endpoint, since when, how many users, p50 vs p99, a deploy/traffic change?
- Evidence — metrics (the latency breakdown), traces, logs, the DB slow query log, pool wait, GC.
- Hypotheses — 2–3 likely causes, with the data that confirms/rejects each one.
- Mitigate — rollback/feature flag/scale out; then the root-cause fix and a regression test.
- Structure — a timeline: detect → mitigate → diagnose → fix → prevent.

</details>

### Medium · `@Transactional` did not roll back — the debugging answer

<details>
<summary>Answer</summary>

- Proxy — is the method public and called from outside the bean? (self-invocation bypasses it).
- Exception type — a checked exception commits by default; use `rollbackFor`.
- Swallowed — it was caught and logged but not thrown onward.
- Different transaction — `REQUIRES_NEW` or an async thread.
- Proof — the transaction start/commit in the logs (`logging.level.org.springframework.transaction=DEBUG`).

</details>

### Medium · The `HashMap` vs `ConcurrentHashMap` answer

<details>
<summary>Answer</summary>

- `HashMap` — single thread or externally synchronized; concurrent writes can corrupt the data.
- `ConcurrentHashMap` — thread-safe, fine-grained locking/CAS; `null` keys/values are not allowed.
- Compound ops — `computeIfAbsent` and `merge` are atomic per key; a `get` followed by a `put` is not atomic.
- Iterators — weakly consistent, with no `ConcurrentModificationException`.

</details>

### Hard · Notification service design (quick)

Email/SMS/push notifications to users; a per-user rate limit, retries and preferences.

<details>
<summary>Answer</summary>

- API — `POST /notifications` (idempotency key) → DB + outbox.
- Pipeline — queue → channel workers (email/SMS/push) with retries/backoff, DLQ.
- Preferences — check user opt-outs and quiet hours before sending.
- Limits — a per-user/channel token bucket; provider rate limits.
- Tracking — a status per attempt; dedupe on provider callbacks.
- Trade-offs — at-least-once delivery → rare duplicates; pass idempotency keys to the provider.

</details>

## Sources — further reading

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Java concurrency package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- [HashMap contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [virtual threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Spring transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/02-java-backend-playbook.md)
