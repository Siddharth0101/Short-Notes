---
id: java-concurrency-production
title: Java concurrency under real resource limits
track: java
order: 16
level: Advanced
minutes: 4
summary: Bounded pool — a limit on workers and the queue; rejection or backpressure on overload.
tags: java, concurrency, virtual-threads, executors, backpressure
---

## Quick revision

> Revision target — Design concurrency together with queue, deadline and scarce-resource limits.

- Bounded pool — a limit on workers and the queue; rejection/backpressure on overload.
- Deadline — the time budget of the whole operation; no layer should wait without limit.
- Cancellation — cancelling a future does not guarantee that the underlying I/O stops.
- Virtual thread — blocking concurrency is cheap; database/remote capacity is not unlimited.
- Semaphore — limits concurrent access to a scarce resource.
- CompletableFuture — async composition; keep the choice of executor for blocking work explicit.
- ThreadLocal — clean up request data; it can leak on reused threads.
- Shutdown — stop new work, give in-flight work a bounded wait, close resources.
- CAS loop — if compare-and-set fails, retry from the latest state; monitor the contention cost.
- CPU work — more threads do not magically add cores; oversubscription can slow things down.
- Queue latency — include waiting time along with service time; throughput alone can hide overload.

### Task coordination

- BlockingQueue — a producer/consumer handoff; put/take can wait, and bounded capacity controls overload.
- CountDownLatch — await until the count reaches zero; one-shot coordination, it does not reset.
- CyclicBarrier — a fixed group waits until all arrive; it can be reused in the next round.
- Phaser — a flexible barrier for multiple phases and a changing participant count.
- ForkJoinPool — work stealing for divide-and-conquer tasks; useful for small independent subtasks.

### Edge cases and reasoning

- Executor starvation — if tasks of the same bounded pool block on their own queued child tasks, the workers can be exhausted/deadlocked.
- Future error flow — CompletableFuture handle transforms success/failure; exceptionally can give a recovery, and a whenComplete observer can affect the outcome by throwing itself.
- Permit ownership — release in finally after a successful semaphore acquire; do not release an unacquired permit on a timeout/rejection.

## Research notes: Virtual threads still need task ownership

- Virtual threads support many tasks without a dedicated platform thread for every blocking task.

## Understand it with an example

- Scenario — There are3 permits for a remote service and10 tasks arrive together; active calls must stay bounded at3.
- Reasoning — After a successful acquire the call runs and releases in finally; the remaining tasks wait/are rejected within the remaining deadline. The acquired permit is released even when the provider fails.
- Catch — A timed-out acquisition never took a permit; a release on that path would incorrectly add capacity. More threads do not increase the provider's capacity.

## Recall and practice

- Question — Why does adding virtual threads not automatically remove the wait on a database pool?
- Answer — Connections and DB capacity are bounded; more waiting tasks are not a throughput guarantee, and you still need an admission limit/deadline.
- Try it yourself — Write a semaphore wrapper for a remote call; verify no permit leak and bounded active calls on success, an exception, a timeout and an interrupted acquisition.

## Practice questions

### Easy · A pool with an unbounded queue

Why does `Executors.newFixedThreadPool(10)` eat memory in a traffic spike?

<details>
<summary>Answer</summary>

- Why — behind it is an unbounded `LinkedBlockingQueue`; if tasks arrive faster than they are processed, the queue keeps growing (memory + latency).
- Fix — an explicit `ThreadPoolExecutor` with a bounded `ArrayBlockingQueue` and a rejection policy (`CallerRunsPolicy` or a fast-fail 503).
- Principle — rejecting early on overload is better than a minutes-long queue.

</details>

### Medium · Two remote calls in parallel + a timeout

Call the profile and orders services in parallel, with a 2 second timeout, and a fallback if one fails.

<details>
<summary>Answer</summary>

```java
CompletableFuture<Profile> profile = CompletableFuture
    .supplyAsync(() -> profileClient.get(id), ioExecutor)
    .orTimeout(2, TimeUnit.SECONDS);
CompletableFuture<List<Order>> orders = CompletableFuture
    .supplyAsync(() -> orderClient.list(id), ioExecutor)
    .completeOnTimeout(List.of(), 2, TimeUnit.SECONDS)
    .exceptionally(error -> List.of());
Dashboard dashboard = profile.thenCombine(orders, Dashboard::new).join();
```

- Executor — do not run blocking I/O on the common ForkJoin pool; use a dedicated bounded executor.
- Timeout — `orTimeout` completes the future, it does not stop the underlying HTTP call; set a timeout on the client too.
- Errors — the profile is required (propagate the failure), orders are optional (an empty fallback).

</details>

### Medium · At most 10 concurrent calls to an external API

<details>
<summary>Answer</summary>

```java
private final Semaphore permits = new Semaphore(10);

Response call(Request request) throws InterruptedException {
    if (!permits.tryAcquire(500, TimeUnit.MILLISECONDS)) throw new TooBusyException();
    try {
        return client.send(request);
    } finally {
        permits.release();
    }
}
```

- `finally` — the permit comes back even on an exception; otherwise permits leak and everything blocks.
- `tryAcquire(timeout)` — a bounded wait + a clear error instead of waiting forever.
- Release only when the acquire actually happened.

</details>

### Medium · When virtual threads?

<details>
<summary>Answer</summary>

- Good — very many blocking I/O tasks (HTTP, DB) — high concurrency with simple thread-per-request code.
- No benefit — CPU-bound work; there are still only so many cores.
- Do not pool them — `Executors.newVirtualThreadPerTaskExecutor()`; limit the downstream with a Semaphore.
- Version note — in JDK 21–23 blocking inside `synchronized` could pin the carrier thread; this was largely fixed in JDK 24. Avoid large objects in a `ThreadLocal`.

</details>

### Hard · Graceful shutdown

When the app stops, the executor's in-flight tasks should finish, but with no more than a 30 second wait.

<details>
<summary>Answer</summary>

```java
void shutdown(ExecutorService executor) {
    executor.shutdown(); // naye tasks band
    try {
        if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
            List<Runnable> dropped = executor.shutdownNow(); // interrupt
            log.warn("Dropped {} queued tasks", dropped.size());
            executor.awaitTermination(5, TimeUnit.SECONDS);
        }
    } catch (InterruptedException e) {
        executor.shutdownNow();
        Thread.currentThread().interrupt();
    }
}
```

- `shutdown` vs `shutdownNow` — the first is graceful, the second sends an interrupt and empties the queue.
- Tasks must respect the interrupt — otherwise they keep running even after `shutdownNow`.
- Dropped tasks — for durable work keep it in a queue/DB so that it resumes on restart.

</details>

## Sources — further reading

- [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html)

- [Source yahan padho — Dev.java](https://dev.java/learn/new-features/virtual-threads/)
- [Oracle virtual threads guide](https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html)
- [Semaphore API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/16-concurrency-production.md)
