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

> Revision target — Shared state ka exact atomic boundary aur visibility guarantee interleaving se explain karo.

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

## Example se samjho

- Scenario — count0 hai; T1 aur T2 dono count read karke apni local value mein1 add karte hain.
- Reasoning — T1 writes1, T2 writes1; expected2 ki jagah1. Shared lock ke andar whole increment ya atomic increment lost update rokta hai.
- Catch — Volatile fresh visibility deta hai, compound read-add-write ko atomic nahi; multi-field invariant ke liye single-variable atomic bhi enough nahi.

## Recall aur practice

- Sawal — AtomicInteger stock.get()>0 phir decrementAndGet oversell ko automatically rokta hai?
- Jawaab — Nahi; check/decrement separate operations race kar sakti hain. CAS loop ya shared atomic boundary mein condition enforce karo.
- Khud try karo — Concurrent last-ticket claim banao; two callers mein exactly one success, stock nonnegative aur interrupt/shutdown outcome verify karo.

## Practice questions

### Easy · `count++` race

Do threads ek shared `int count` ko 1000-1000 baar `count++` karte hain. Result 2000 kyun nahi aata?

<details>
<summary>Answer</summary>

- Kyun — `count++` read → add → write teen steps hai; dono threads same purani value padh kar overwrite karte hain (lost update).
- Fix — `AtomicInteger.incrementAndGet()` ya `synchronized` block.
- `volatile` kaafi nahi — visibility deta hai, compound operation atomic nahi banata.

</details>

### Easy · `start()` vs `run()`

```java
Thread t = new Thread(() -> System.out.println(Thread.currentThread().getName()));
t.run();
t.start();
```

<details>
<summary>Answer</summary>

- `t.run()` — current thread (e.g. `main`) mein normal method call; naya thread nahi.
- `t.start()` — naya thread banata hai jo `run()` chalata hai (`Thread-0`).
- `start()` do baar — `IllegalThreadStateException`.

</details>

### Medium · Stop flag kabhi dikhta hi nahi

```java
class Worker implements Runnable {
    private boolean running = true;
    public void run() { while (running) { /* work */ } }
    void stop() { running = false; }
}
```

`stop()` doosre thread se call hua par loop chalta raha. Kyun?

<details>
<summary>Answer</summary>

- Visibility — bina happens-before ke worker thread purani cached value dekh sakta hai; JIT loop condition hoist bhi kar sakta hai.
- Fix — `private volatile boolean running`.
- Better — thread interruption (`Thread.interrupted()`) ya executor `shutdownNow()`; blocking calls bhi wake hote hain.

</details>

### Medium · Deadlock

Thread A: `lock(account1)` phir `lock(account2)`. Thread B: `lock(account2)` phir `lock(account1)`. Kya ho sakta hai aur fix?

<details>
<summary>Answer</summary>

- Deadlock — dono ek-ek lock pakad kar doosre ka wait karte hain, hamesha ke liye.
- Fix 1 — global lock order: hamesha chhote account id ka lock pehle.
- Fix 2 — `ReentrantLock.tryLock(timeout)`; na mile toh release karke retry/backoff.
- Diagnose — `jstack <pid>` / `jcmd <pid> Thread.print` "Found one Java-level deadlock" dikhata hai.

</details>

### Hard · Interrupt ko sahi handle karo

```java
while (true) {
    try {
        Task task = queue.take();
        process(task);
    } catch (InterruptedException e) {
        // ignore
    }
}
```

Problem kya hai? Correct worker loop likho.

<details>
<summary>Answer</summary>

```java
public void run() {
    try {
        while (!Thread.currentThread().isInterrupted()) {
            Task task = queue.take();
            process(task);
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt(); // status restore
    } finally {
        cleanup();
    }
}
```

- Swallow — interrupt cancellation signal hai; ignore karne par shutdown hang hota hai (thread kabhi nahi rukta).
- Restore — catch karne par interrupt flag clear ho jaata hai; upar ke code ko pata chale isliye wapas set karo.
- Rule — ya toh `InterruptedException` propagate karo, ya flag restore karke exit.

</details>

## Sources — aur padhne ke liye

- [Oracle — ReentrantLock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)

- [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- [Concurrency utilities](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/15-concurrency.md)
