---
id: java-concurrency
title: Concurrency synchronization and virtual threads
track: java
order: 15
level: Advanced
minutes: 4
summary: Thread — concurrent execution; shared mutable state needs coordination.
tags: concurrency, threads, virtual-threads, locks
visual: thread-sync
---

## Quick revision

> Revision target — Explain the exact atomic boundary and visibility guarantee of shared state through an interleaving.

- Thread — concurrent execution; shared mutable state needs coordination.
- Race condition — the result depends on scheduling.
- `synchronized` — mutual exclusion + visibility on the same monitor.
- `volatile` — a visibility/order guarantee; `count++` is not atomic.
- AtomicInteger — single-variable atomic updates; handle a multi-field rule separately.
- Happens-before — the formal relation for the visibility/order of writes.
- Deadlock — locks wait in a cyclic order; keep a consistent lock order.
- Executor — submit tasks; manage the lifecycle and shutdown.
- Interrupt — a cooperative cancellation signal; do not catch and blindly swallow it.
- Lock identity — different lock objects do not protect the same shared data.
- Wait condition — recheck the condition in a loop after wait; spurious wakeups are possible.
- Join — waits for a thread to complete; define the timeout/interrupt behaviour.

### Thread execution

- Runnable — the result of run is void; a Callable can return a value and throw a checked exception.
- Thread start — start schedules a new thread; calling run directly executes in the current thread.
- Thread states — NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED; RUNNING is not a separate enum state.
- Sleep/wait — sleep does not release the monitor; wait releases the owned monitor and waits for a notification/condition.

### Explicit locks

- ReentrantLock — the same thread can acquire it again; unlock in finally after a successful lock.
- tryLock — tries acquisition immediately or until a timeout; on false, do not run the lock-owning code.
- Interruptible lock — `lockInterruptibly()` can abandon acquisition when the waiting thread is interrupted.
- Fair lock — a preference for the longest waiter; it can cost throughput, and an untimed tryLock does not follow fairness.

### Edge cases and reasoning

- Atomic compound rule — the available>=n check and the decrement in the same protected boundary; separate atomic reads/writes do not make the whole invariant safe.
- Interrupt recovery — catch InterruptedException and propagate it or restore the interrupt status; do not silently discard the cancellation contract.
- Condition notification — notifyAll wakes the waiters, it does not prove the condition is true; reacquire the lock and recheck the predicate in a while.

## Understand it with an example

- Scenario — count is0; T1 and T2 both read count and add1 to their local value.
- Reasoning — T1 writes1, T2 writes1; you get1 instead of the expected2. The whole increment inside a shared lock, or an atomic increment, prevents the lost update.
- Catch — Volatile gives fresh visibility, it does not make a compound read-add-write atomic; for a multi-field invariant a single-variable atomic is not enough either.

## Recall and practice

- Question — Does AtomicInteger stock.get()>0 followed by decrementAndGet automatically prevent an oversell?
- Answer — No; check/decrement are separate operations and can race. Enforce the condition in a CAS loop or a shared atomic boundary.
- Try it yourself — Build a concurrent last-ticket claim; verify exactly one success among two callers, nonnegative stock and the interrupt/shutdown outcome.

## Practice questions

### Easy · The `count++` race

Two threads each run `count++` 1000 times on a shared `int count`. Why is the result not 2000?

<details>
<summary>Answer</summary>

- Why — `count++` is three steps, read → add → write; both threads read the same old value and overwrite each other (a lost update).
- Fix — `AtomicInteger.incrementAndGet()` or a `synchronized` block.
- `volatile` is not enough — it gives visibility, it does not make a compound operation atomic.

</details>

### Easy · `start()` vs `run()`

```java
Thread t = new Thread(() -> System.out.println(Thread.currentThread().getName()));
t.run();
t.start();
```

<details>
<summary>Answer</summary>

- `t.run()` — a normal method call in the current thread (e.g. `main`); no new thread.
- `t.start()` — creates a new thread that runs `run()` (`Thread-0`).
- `start()` twice — `IllegalThreadStateException`.

</details>

### Medium · The stop flag is never seen

```java
class Worker implements Runnable {
    private boolean running = true;
    public void run() { while (running) { /* work */ } }
    void stop() { running = false; }
}
```

`stop()` was called from another thread but the loop kept running. Why?

<details>
<summary>Answer</summary>

- Visibility — without a happens-before, the worker thread can see an old cached value; the JIT can also hoist the loop condition.
- Fix — `private volatile boolean running`.
- Better — thread interruption (`Thread.interrupted()`) or the executor's `shutdownNow()`; blocking calls wake up too.

</details>

### Medium · Deadlock

Thread A: `lock(account1)` then `lock(account2)`. Thread B: `lock(account2)` then `lock(account1)`. What can happen, and the fix?

<details>
<summary>Answer</summary>

- Deadlock — each holds one lock and waits for the other, forever.
- Fix 1 — a global lock order: always lock the smaller account id first.
- Fix 2 — `ReentrantLock.tryLock(timeout)`; if it is not acquired, release and retry/back off.
- Diagnose — `jstack <pid>` / `jcmd <pid> Thread.print` shows "Found one Java-level deadlock".

</details>

### Hard · Handle an interrupt correctly

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

What is the problem? Write a correct worker loop.

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

- Swallow — an interrupt is a cancellation signal; ignoring it makes shutdown hang (the thread never stops).
- Restore — catching clears the interrupt flag; set it again so the code above finds out.
- Rule — either propagate `InterruptedException`, or restore the flag and exit.

</details>

## Sources — further reading

- [Oracle — ReentrantLock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)

- [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- [Concurrency utilities](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/15-concurrency.md)
