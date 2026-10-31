---
id: java-concurrency-production
title: Java concurrency under real resource limits
track: java
order: 16
level: Advanced
minutes: 4
summary: Bounded pool — workers aur queue ki limit; overload par rejection/backpressure.
tags: java, concurrency, virtual-threads, executors, backpressure
---

## Quick revision

> Revision target — Concurrency ko queue, deadline aur scarce-resource limits ke saath design karo.

- Bounded pool — workers aur queue ki limit; overload par rejection/backpressure.
- Deadline — poore operation ka time budget; har layer unlimited wait na kare.
- Cancellation — future cancel karne se underlying I/O zaroor ruke, guarantee nahi.
- Virtual thread — blocking concurrency cheap; database/remote capacity unlimited nahi.
- Semaphore — scarce resource par concurrent access limit karo.
- CompletableFuture — async composition; blocking work ke executor ka choice explicit rakho.
- ThreadLocal — request data cleanup karo; reused threads par leakage ho sakti hai.
- Shutdown — new work roko, in-flight work ko bounded wait, resources close.
- CAS loop — compare-and-set fail ho toh latest state se retry; contention cost monitor.
- CPU work — more threads se cores magically nahi badhte; oversubscription slow kar sakti hai.
- Queue latency — service time ke saath waiting time include; throughput alone overload hide kar sakta hai.

### Task coordination

- BlockingQueue — producer/consumer handoff; put/take wait kar sakte hain, bounded capacity overload control karti hai.
- CountDownLatch — count zero hone tak await; one-shot coordination, reset nahi hota.
- CyclicBarrier — fixed group sab pahunchne tak wait; next round mein reuse ho sakta hai.
- Phaser — multiple phases aur changing participant count ke liye flexible barrier.
- ForkJoinPool — divide-and-conquer tasks ke liye work stealing; chhote independent subtasks useful.

### Edge cases aur reasoning

- Executor starvation — same bounded pool ke tasks apne queued child tasks par block karein toh workers exhaust/deadlock ho sakte hain.
- Future error flow — CompletableFuture handle success/failure transform; exceptionally recovery de sakta, whenComplete observation khud throw karke outcome affect kar sakta.
- Permit ownership — successful semaphore acquire ke baad finally release; timeout/rejection par unacquired permit release mat karo.

## Research notes: Virtual threads still need task ownership

- Virtual threads har blocking task ke liye dedicated platform thread ke bina many tasks support karti hain.

## Example se samjho

- Scenario — Remote service ke liye3 permits hain aur10 tasks ek saath aaye; active calls ko3 tak bound rakhna hai.
- Reasoning — Successful acquire ke baad call run aur finally release; baaki tasks remaining deadline tak wait/reject. Provider fail ho tab bhi acquired permit release hota hai.
- Catch — Timed-out acquisition ne permit liya hi nahi; us path par release capacity incorrectly badha dega. More threads provider capacity increase nahi karte.

## Recall aur practice

- Sawal — Virtual threads badhaane se database pool ka wait automatically kyun nahi mit-ta?
- Jawaab — Connections aur DB capacity bounded hain; more waiting tasks throughput guarantee nahi, admission limit/deadline still chahiye.
- Khud try karo — Remote-call semaphore wrapper likho; success, exception, timeout aur interrupted acquisition par no permit leak aur bounded active calls verify karo.

## Practice questions

### Easy · Unbounded queue wala pool

`Executors.newFixedThreadPool(10)` traffic spike mein memory kyun kha jaata hai?

<details>
<summary>Answer</summary>

- Kyun — iske peeche unbounded `LinkedBlockingQueue`; tasks process se tez aayein toh queue badhti rehti hai (memory + latency).
- Fix — explicit `ThreadPoolExecutor` with bounded `ArrayBlockingQueue` aur rejection policy (`CallerRunsPolicy` ya fast fail 503).
- Principle — overload par jaldi reject karna, minute-lambi queue se behtar hai.

</details>

### Medium · Do remote calls parallel + timeout

Profile aur orders service parallel call karo, 2 second timeout ke saath, aur ek fail ho toh fallback.

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

- Executor — blocking I/O ko common ForkJoin pool par mat chalao; dedicated bounded executor.
- Timeout — `orTimeout` future ko complete karta hai, underlying HTTP call ko nahi rokta; client par bhi timeout set karo.
- Errors — profile required hai (fail propagate), orders optional (empty fallback).

</details>

### Medium · External API ko max 10 concurrent calls

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

- `finally` — exception par bhi permit wapas; warna permits leak hokar sab block.
- `tryAcquire(timeout)` — hamesha wait karne ki jagah bounded wait + clear error.
- Release sirf tab jab acquire hua ho.

</details>

### Medium · Virtual threads kab?

<details>
<summary>Answer</summary>

- Achhe — bahut saare blocking I/O tasks (HTTP, DB) — thread-per-request simple code ke saath high concurrency.
- Fayda nahi — CPU-bound kaam; cores utne hi hain.
- Pool mat karo — `Executors.newVirtualThreadPerTaskExecutor()`; downstream limit Semaphore se.
- Version note — JDK 21–23 mein `synchronized` ke andar blocking carrier thread pin kar sakta tha; JDK 24 mein yeh largely fix hua. `ThreadLocal` mein bade objects avoid karo.

</details>

### Hard · Graceful shutdown

App band hote waqt executor ke in-flight tasks finish ho jaayein, par 30 second se zyada wait nahi.

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

- `shutdown` vs `shutdownNow` — pehla graceful, doosra interrupt bhejta aur queue khaali karta hai.
- Tasks interrupt respect karein — warna `shutdownNow` ke baad bhi chalte rahenge.
- Dropped tasks — durable kaam ho toh queue/DB mein rakho taaki restart par resume ho.

</details>

## Sources — aur padhne ke liye

- [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html)

- [Source yahan padho — Dev.java](https://dev.java/learn/new-features/virtual-threads/)
- [Oracle virtual threads guide](https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html)
- [Semaphore API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/16-concurrency-production.md)
