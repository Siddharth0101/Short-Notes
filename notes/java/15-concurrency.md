---
id: java-concurrency
title: Concurrency synchronization and virtual threads
track: java
order: 15
level: Advanced
minutes: 4
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
- Lock identity — different lock objects same shared data ko protect nahi karte.
- Wait condition — wait ke baad condition loop mein recheck; spurious wakeups possible.
- Join — thread completion wait; timeout/interrupt behavior define karo.

### Thread execution

- Runnable — run ka result void; Callable value return aur checked exception throw kar sakta hai.
- Thread start — start nayi thread schedule; run directly call karo toh current thread mein execute.
- Thread states — NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED; RUNNING separate enum state nahi.
- Sleep/wait — sleep monitor release nahi karta; wait owned monitor release karke notification/condition ka wait karta hai.

### Explicit locks

- ReentrantLock — same thread dobara acquire kar sakta hai; successful lock ke baad finally mein unlock karo.
- tryLock — turant ya timeout tak acquisition try; false par lock-owning code mat chalao.
- Interruptible lock — `lockInterruptibly()` waiting thread ke interrupt par acquisition chhod sakta hai.
- Fair lock — longest waiter ko preference; throughput cost ho sakti hai, untimed tryLock fairness follow nahi karta.

### Edge cases aur reasoning

- Atomic compound rule — available>=n check aur decrement same protected boundary mein; separate atomic reads/writes whole invariant safe nahi banate.
- Interrupt recovery — InterruptedException catch karke propagate ya interrupt status restore; cancellation contract silently discard mat karo.
- Condition notification — notifyAll waiters ko wake karta hai, condition true prove nahi; lock reacquire karke while mein predicate recheck karo.

## Recall aur practice

- Sawal — AtomicInteger stock.get()>0 phir decrementAndGet oversell ko automatically rokta hai?
- Jawaab — Nahi; check/decrement separate operations race kar sakti hain. CAS loop ya shared atomic boundary mein condition enforce karo.
- Khud try karo — Concurrent last-ticket claim banao; two callers mein exactly one success, stock nonnegative aur interrupt/shutdown outcome verify karo.

## Sources — aur padhne ke liye

- [Oracle — ReentrantLock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)

- [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- [Concurrency utilities](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/15-concurrency.md)
