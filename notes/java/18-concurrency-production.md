---
id: java-concurrency-production
title: Java concurrency under real resource limits
track: java
order: 18
level: Advanced
minutes: 25
summary: Separate thread scheduling from database capacity and cancellation semantics.
tags: java, concurrency, virtual-threads, executors, backpressure
---

## Mental model

Threads execution schedule karte hain; they do not create database connections, CPU cores or downstream capacity. A service can accept thousands of concurrent requests and still have only twenty usable database connections. Bound the scarce resource explicitly instead of hoping the scheduler protects it.

> **Core takeaway:** More runnable tasks do not create more database connections or downstream capacity.

## Choose the bottleneck first

CPU-bound work needs a concurrency level related to available cores and measurement. Blocking I/O can benefit from more concurrent tasks, including virtual threads on Java 21+, but the remote service still has limits. Virtual threads improve the cost of waiting; they do not make an individual SQL query faster.

Avoid universal advice about synchronized pinning across JDK releases. Runtime behavior changed in newer JDKs. State the deployed version and profile it before replacing locking code. Keep critical sections small for correctness and contention reasons regardless of scheduling details.

## Bound admission independently

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

final class PartnerGateway {
    private final Semaphore permits = new Semaphore(20);

    String load() throws InterruptedException {
        if (!permits.tryAcquire(100, TimeUnit.MILLISECONDS)) {
            throw new IllegalStateException("Partner capacity exhausted");
        }
        try {
            return callPartnerWithTimeout();
        } finally {
            permits.release();
        }
    }

    private String callPartnerWithTimeout() {
        // Teaching stub: real client must configure connection and request deadlines.
        return "response";
    }
}
```

A permit is released only after successful acquisition. The finally block protects against normal returns and exceptions. The admission timeout bounds waiting for a slot; it does not bound the subsequent network call. In a multi-instance deployment, this is twenty calls per instance, not a global twenty-call guarantee.

## Failure ownership

Future cancellation may request interruption; interrupt-aware code must cooperate. A database query or external server may continue after the caller gives up. If catching InterruptedException at a boundary that cannot rethrow it, usually restore interrupt status and return or abort work appropriately. Do not swallow interruption and continue an infinite retry loop.

CompletableFuture makes composition convenient, but an async stage's executor matters. Blocking partner calls on a shared pool can delay unrelated work. Specify execution ownership, deadline propagation and what happens to sibling work when one result is no longer useful.

## Practice

Run fifty simulated callers against a limit of three. Track current and maximum active calls with atomics. Make one call throw and verify later callers can still acquire permits. Interrupt a waiter and verify the count does not increase incorrectly. Then simulate a slow dependency and explain admission rejection versus execution timeout in separate metrics.

## Interview questions

**Why not pool virtual threads?** They are designed to be inexpensive task threads; pool or limit scarce resources separately. A virtual-thread-per-task executor is different from unlimited external work.

**Does volatile make count++ atomic?** No. Visibility does not combine read, add and write into one atomic operation; use appropriate synchronization or atomic operations.

## Research notes: Virtual threads still need task ownership

Virtual threads support many blocking tasks without one platform thread per task. They do not make CPU work faster or create downstream capacity. Define the task owner, deadline and cancellation policy.

Interruption is cooperative. Propagate `InterruptedException` when appropriate, or restore interruption and exit deliberately when the method cannot propagate it. Catching and continuing forever defeats cancellation.

Virtual threads are non-preview from Java 21. Pinning behavior is JDK-dependent; use guidance for the runtime you deploy.

**Interview check:** Why can ten thousand virtual threads overload twenty database connections?

**Answer:** Connections and database execution remain scarce. Bound admission to that resource, measure waiting and enforce deadlines. Cheap waiting threads do not increase downstream throughput.

**Practice:** Cancel a blocked task and verify every owned resource is released.

[Read the source — Dev.java](https://dev.java/learn/new-features/virtual-threads/). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** There are 100 request tasks and a database pool of 10 connections. Describe what to measure before increasing the task count.

> **Hint:** Separate waiting for a connection from executing a query.

**Answer guide — compare after attempting:** Measure pool acquisition wait, active connections, query latency, timeouts, and throughput. At most 10 tasks can hold those connections simultaneously. Bound admission and use deadlines; increasing tasks can increase waiting without increasing completed work.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[Oracle virtual threads guide](https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html) provides runtime-specific adoption guidance. [Semaphore API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html) defines acquisition behavior.
