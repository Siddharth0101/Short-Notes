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

## Sources

[Oracle virtual threads guide](https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html) provides runtime-specific adoption guidance. [Semaphore API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html) defines acquisition behavior.
