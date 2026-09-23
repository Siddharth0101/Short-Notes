---
id: java-concurrency
title: Concurrency synchronization and virtual threads
track: java
order: 15
level: Advanced
minutes: 1
summary: Thread — concurrent execution; shared mutable state par coordination chahiye.
tags: concurrency, threads, virtual-threads, locks
visual: thread-sync
---

## Quick revision

- Thread — concurrent execution; shared mutable state par coordination chahiye.
- Race condition — result scheduling par depend karta hai.
- `synchronized` — same monitor par mutual exclusion + visibility.
- `volatile` — visibility/order guarantee; `count++` atomic nahi.
- AtomicInteger — single-variable atomic updates; multi-field rule alag handle karo.
- Happens-before — writes ki visibility/order ka formal relation.
- Deadlock — locks cyclic order mein wait; consistent lock order rakho.
- Executor — tasks submit karo; lifecycle aur shutdown manage karo.
- Interrupt — cooperative cancellation signal; catch karke blindly swallow mat karo.

## Sources — aur padhne ke liye

- [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- [Concurrency utilities](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/15-concurrency.md)
