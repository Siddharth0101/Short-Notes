---
id: spring-background-cache
title: Spring background jobs and caching — understand lifecycle and ownership
track: spring-boot
order: 11
level: Advanced
minutes: 3
summary: `@Async` — work on an executor; in the default proxy mode a self-call can bypass it.
tags: spring, scheduling, caching, async, idempotency
---

## Quick revision

> Revision target — Give background work and a cache an explicit identity, ownership and recovery boundary.

- `@Async` — work on an executor; in the default proxy mode a self-call can bypass it.
- Scheduled job — duplicate execution is possible across multiple instances.
- Job identity — stop duplicate effects with idempotency/a claim/a lock.
- Bounded executor — define the workers, the queue and the rejection policy.
- `@Cacheable` — reuses the cached result for a matching key.
- Cache key — include all relevant args, the tenant and the permission scope.
- Eviction — invalidate/update stale entries after a write.
- Transaction/cache — a database commit and a cache update are not automatically atomic.
- Cache stampede — concurrent loaders on the same miss; choose a single-flight/locking/jitter strategy.
- Job lease — the old worker can still be running after expiry; you need a guard that rejects stale writes.
- Scheduler overlap — define whether the next run is allowed before the previous run completes.

### Edge cases and reasoning

- Async error ownership — the exception of a void @Async method does not reach the caller through a Promise; define a handler/logging or a future-return contract.
- Schedule clock — fixedDelay is a gap after the previous completion; fixedRate is a schedule cadence, and actual overlap depends on the executor/config.
- Post-commit invalidation — an after-commit action avoids clearing the cache for a rollback, but a crash gap remains; consider durable invalidation/an outbox.

## Understand it with an example

- Scenario — Two app instances run the same daily export schedule; both can send the report to the same customer.
- Reasoning — Design an export operation identity and a durable claim/dedupe; a repeat execution should reuse/skip the same business effect. The recovery owner after a worker failure should be clear.
- Catch — A per-instance scheduler gives no global once-only guarantee; lease expiry does not stop the old worker, so you still need a stale-write guard and bounded retries.

## Recall and practice

- Question — Does the old worker automatically stop executing when the job lease expires?
- Answer — No; a stale worker can still be running. Reject obsolete side effects with a fencing/version check and idempotent writes.
- Try it yourself — Build a two-instance scheduled export plan; verify a duplicate claim, lease expiry, a write failure and the cache commit/crash window.

## Practice questions

### Easy · Why did `@Async` not run asynchronously?

<details>
<summary>Answer</summary>

- `@EnableAsync` is missing.
- Self-invocation — a call from the same class bypasses the proxy.
- Errors — the exception of a `void` async method does not reach the caller; use an `AsyncUncaughtExceptionHandler` or return a `CompletableFuture`.
- Executor — define a bounded `ThreadPoolTaskExecutor`; do not leave it on unbounded defaults.

</details>

### Medium · A scheduled job is running three times

The nightly invoice job ran 3 times on 3 replicas and customers got 3 emails.

<details>
<summary>Answer</summary>

- Why — `@Scheduled` runs independently in every instance.
- Fix — a distributed lock/lease (ShedLock with a DB, or a DB row lease) so that only one instance runs.
- Idempotency — skip duplicates on a re-run using a job state table (`invoice_sent_at`).
- Overlap — `fixedDelay` keeps a gap after the previous run ends; `fixedRate` can overlap on a slow run.

</details>

### Medium · `@Cacheable` is returning wrong data

```java
@Cacheable("prices")
public Price price(String sku, String currency) { ... }
```

First `("A", "INR")` was called, and then `("A", "USD")` also returns the INR price? (A custom key generator `key = "#sku"` is set.)

<details>
<summary>Answer</summary>

- Why — the cache key is only `sku`; the currency is not in the key.
- Fix — `@Cacheable(cacheNames = "prices", key = "#sku + ':' + #currency")` or leave the default key (all the params).
- More traps — caching mutable entities (if the caller mutates one, the cache changes), an unbounded cache, the intent of null values.

</details>

### Medium · Stale cache after an update

In an update the service evicts the cache first and the DB transaction commits afterwards. Sometimes the old price ends up cached again. Why?

<details>
<summary>Answer</summary>

- Race — after the evict and before the commit, a read fetches the old value from the DB and caches it again.
- Fix — evict after the commit: invalidate in a `@TransactionalEventListener(phase = AFTER_COMMIT)`.
- Extra safety — a short TTL so that even a rare race heals itself.

</details>

### Hard · Cache stampede

The cache entry of a popular product expired; 2000 concurrent requests hit the DB. Mitigations?

<details>
<summary>Answer</summary>

- Single flight — only one request loads from the DB and the rest wait; `@Cacheable(sync = true)` in one instance, a distributed lock across instances.
- Jittered TTL — so that all keys do not expire together.
- Refresh ahead / stale-while-revalidate — a background refresh before expiry, or a refresh while serving the old value.
- Protection — a concurrency limit/bulkhead on the DB, so that a cache miss does not bring the whole system down.

</details>

## Sources — further reading

- [Scheduling/async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [cache annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/11-spring-background-cache.md)
