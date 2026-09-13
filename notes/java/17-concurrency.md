---
id: java-concurrency
title: Concurrency synchronization and virtual threads
track: java
order: 17
level: Advanced
minutes: 25
summary: Atomicity, visibility, cancellation aur bounded concurrency ko alag samjho.
tags: concurrency, threads, virtual-threads, locks
visual: thread-sync
---

## Mental model

Concurrency multiple tasks ko progress karne deti hai; parallelism same time multiple CPU cores par execution hai. Shared mutable state ke teen questions hain: operation atomic hai? latest write visible hai? allowed ordering kya hai? `volatile` visibility help karta hai, lekin `count++` ko atomic nahi banata because read, add and write separate actions hain.

> **Core takeaway:** A compound read-modify-write needs synchronization as a whole.

## Protect an invariant

```java
final class Inventory {
    private int remaining;
    Inventory(int initial) {
        if (initial < 0) throw new IllegalArgumentException();
        remaining = initial;
    }
    synchronized boolean reserve() {
        if (remaining == 0) return false;
        remaining--;
        return true;
    }
}
```

Lock complete check-and-update protect karta hai. Getter bhi same synchronization discipline follow kare jab value concurrent readers ko expose ho. Single counter increment ke liye AtomicInteger useful hai; multiple related fields ki invariant ke liye independent atomics enough nahi ho sakte.

## A visible race condition

Race condition dikhne ke liye do threads ka interleaving explicitly reproduce karna helpful hai:

```java
class UnsafeCounter {
    private int count = 0;
    void increment() { count++; } // read, add, write — three separate steps
    int get() { return count; }
}

UnsafeCounter counter = new UnsafeCounter();
Runnable work = () -> {
    for (int i = 0; i < 100_000; i++) counter.increment();
};
Thread t1 = new Thread(work);
Thread t2 = new Thread(work);
t1.start(); t2.start();
t1.join(); t2.join();
System.out.println(counter.get()); // usually less than 200,000
```

Dono thread same `count` value read kar sakte hain interleaved fashion mein — thread A ne 41 read kiya, thread B bhi 41 read kiya (A ka write abhi visible nahi hua), dono 42 likh dete hain, ek increment lost ho gaya. Fix: `synchronized void increment()` ya `AtomicInteger` — dono correct `count == 200_000` denge.

## Deadlock: two locks, two orders

```java
class Account {
    private final Object lock = new Object();
    private long balance;

    static void transfer(Account from, Account to, long amount) {
        synchronized (from.lock) {
            synchronized (to.lock) { // if another thread locks `to` then `from`, deadlock
                from.balance -= amount;
                to.balance += amount;
            }
        }
    }
}
```

Thread 1 `transfer(accountA, accountB, 100)` call karta hai (locks A then B). Simultaneously thread 2 `transfer(accountB, accountA, 50)` call karta hai (locks B then A). Thread 1 A hold karke B ka wait karta hai; thread 2 B hold karke A ka wait karta hai — dono forever block. Fix: locks ko hamesha ek consistent global order mein acquire karo, jaise account ID se sort karke:

```java
static void transfer(Account from, Account to, long amount) {
    Account first = from.id < to.id ? from : to;
    Account second = from.id < to.id ? to : from;
    synchronized (first.lock) {
        synchronized (second.lock) {
            from.balance -= amount;
            to.balance += amount;
        }
    }
}
```

Ab dono directions se transfer same order mein locks acquire karta hai, isliye circular wait possible nahi.

## Executors and cancellation

Raw threads create karne se lifecycle management tedious hota hai. Executor task submission aur execution policy separate karta hai. Bound resource access with semaphore, queue limit, timeout and rejection policy. Cancellation cooperative hai: interrupted status check karo, blocking APIs ka InterruptedException handle karo, aur interruption swallow mat karo. `Thread.sleep` synchronization mechanism nahi hai.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
try {
    Future<Integer> future = pool.submit(() -> slowComputation());
    int result = future.get(2, TimeUnit.SECONDS); // bounded wait, not indefinite
} catch (TimeoutException e) {
    // task still running in the background unless it checks interruption
} finally {
    pool.shutdown(); // stop accepting new tasks, let running ones finish
    if (!pool.awaitTermination(5, TimeUnit.SECONDS)) {
        pool.shutdownNow(); // interrupt running tasks
    }
}
```

`pool.shutdown()` bhoolna ek common leak hai: application band nahi hoti kyunki non-daemon pool threads alive rehte hain. `future.get()` bina timeout ke ek stuck task par indefinitely block ho sakta hai. `shutdownNow()` bhi guarantee nahi deta ki task turant rukega — cooperative cancellation ke liye task ke andar `Thread.interrupted()` check hona zaroori hai.

Deadlock avoid karne ke liye consistent lock order, short critical sections aur nested external calls minimize karo. Lock hold karke slow HTTP call karna other tasks ka progress unnecessarily rokta hai. Race conditions reproduce karne ke liye sleeps ki jagah barriers/latches use karna more reliable hai.

## Virtual threads

Virtual threads Java 21 mein final feature bane. Yeh many blocking I/O tasks ke liye lightweight thread-per-task model enable karte hain. CPU-bound computation ko faster processor nahi milta, aur database connections, memory and downstream quotas still finite hain. Virtual threads ko pool karke scarce resource model mat karo; resource concurrency independently limit karo. [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)

Version matters: synchronized-region pinning ka behavior JDK 24 ke JEP 491 se change hua. Purana blanket advice ki har synchronized block virtual thread carrier permanently occupy karega current JVMs par blindly apply mat karo. Native/foreign calls and runtime-specific behavior profiling se inspect karo. [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)

## CompletableFuture and pitfalls

Async composition mein executor ownership clear rakho. `thenApply` transform karta hai; `thenCompose` nested async result flatten karta hai. `join` ko wrong execution pool ke task ke andar block karna starvation create kar sakta hai. Failure, timeout and cancellation behavior happy path jitna explicitly design karo.

```java
CompletableFuture<Order> orderFuture = CompletableFuture
    .supplyAsync(() -> fetchOrder(orderId), ioExecutor)
    .thenCompose(order -> CompletableFuture
        .supplyAsync(() -> enrichWithPricing(order), ioExecutor))
    .exceptionally(ex -> {
        log.warn("order enrichment failed", ex);
        return Order.fallback(orderId);
    });
```

`exceptionally`/`handle` explicitly likhna zaroori hai — agar koi stage exception throw kare aur koi recovery stage na ho, chain ka final result ek failed future ban jaata hai, aur agar koi usse `join()` na kare toh exception silently kahin log bhi nahi hoti. `ioExecutor` ko dono stages mein pass karna important hai; default `supplyAsync` common `ForkJoinPool.commonPool()` use karta hai jo poori application mein shared hota hai — ek slow blocking task usme daalne se unrelated parallel streams/futures bhi starve ho sakte hain.

## ThreadLocal leaks in pooled threads

```java
class RequestContext {
    private static final ThreadLocal<String> CURRENT_USER = new ThreadLocal<>();
    static void set(String user) { CURRENT_USER.set(user); }
    static String get() { return CURRENT_USER.get(); }
    static void clear() { CURRENT_USER.remove(); }
}
```

Servlet containers aur executor pools threads ko reuse karte hain. Agar request handling ke end mein `RequestContext.clear()` call karna bhool jao, agla unrelated request usi pooled thread par chale toh usse pichhle request ka `CURRENT_USER` value dikh sakta hai — ek user ke data doosre user ko leak ho sakta hai. Fix: `try/finally` mein guaranteed cleanup karo, ya Spring jaise frameworks ke request-scoped filters/interceptors use karo jo yeh lifecycle already manage karte hain.

## Common mistakes

- **Wrong assumption:** `volatile` field increment (`volatileCount++`) ko thread-safe bana deta hai. **Why it breaks:** `volatile` sirf visibility guarantee karta hai — latest write dusre threads ko dikhegi. Lekin `count++` khud read-modify-write teen steps hain; do threads same value read karke dono apna increment likh sakte hain, ek update lost ho jaata hai. **Fix:** `AtomicInteger`/`AtomicLong` ka `incrementAndGet()` use karo, ya `synchronized` block se poora operation protect karo.
- **Wrong assumption:** `ExecutorService` ko `shutdown()` kiye bina bhi application cleanly exit ho jayegi kyunki JVM garbage collect kar dega. **Why it breaks:** Fixed/cached thread pool ke non-daemon threads active rehte hain jab tak explicitly shut down na ho; yeh JVM ko exit hone se rokte hain, aur Spring context shutdown ke baad bhi orphaned threads resource hold kar sakte hain. **Fix:** Pool ko `@PreDestroy`/application shutdown hook mein explicitly `shutdown()` phir `awaitTermination` karo.
- **Wrong assumption:** Increasing thread pool size hamesha throughput badhata hai. **Why it breaks:** Agar bottleneck downstream (database connections, external API rate limit) hai, zyada threads sirf zyada concurrent requests downstream par bhejte hain — jisse connection pool exhaustion, increased contention, aur worse latency ho sakti hai, better throughput nahi. **Fix:** Pool size ko downstream capacity ke against tune karo; pehle bottleneck measure karo phir pool resize karo.

## In a real backend service

Request-scoped correlation IDs, security context aur tenant info aksar `ThreadLocal` ya Spring ke request-scoped beans mein store hote hain — cleanup missed hone par cross-request data leak ek real production incident class hai. Executor-based async processing (jaise order-confirmation email background mein bhejna) mein bounded thread pool aur explicit timeout/cancellation policy honi chahiye, warna ek slow downstream dependency poora pool exhaust karke unrelated requests ko bhi block kar sakta hai.

## Interview questions

**Volatile versus synchronized?** Volatile read/write visibility and ordering guarantees deta hai for that variable. Synchronized mutually exclusive critical section plus happens-before relation provide karta hai. Multi-step invariant ke liye lock ya suitable atomic operation chahiye.

**Will more threads fix a slow database?** Usually nahi. Connection contention, queueing and downstream overload badh sakte hain. First query latency, pool wait and resource utilization measure karo.

**How does a deadlock happen with two locks, and how do you prevent it?** Deadlock tab hota hai jab thread A lock1 hold karke lock2 ka wait kare, aur simultaneously thread B lock2 hold karke lock1 ka wait kare — circular wait. Prevention: saare threads locks ko hamesha same consistent order mein acquire karein (jaise ID se sorted), taaki circular wait structurally possible na ho.

## Practice

Two workers se 100,000 increments run karo, unsafe count observe karo, phir atomic correction karo. Inventory race ko coordinated start ke saath test karo. Finally one slow task cancel karke verify karo ki resource release hota hai. Phir do-account transfer deadlock ko reproduce karo (dono directions se simultaneously transfer chala kar), aur consistent lock-ordering se fix karo. Last mein ek pooled-thread ThreadLocal leak simulate karo: cleanup skip karke ek "wrong user" read reproduce karo, phir `finally` block se fix karo.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Two threads each increment a shared plain int 1000 times. Is 2000 guaranteed, and how would you repair the counter?

> **Hint:** Reading, adding, and writing are separate steps.

**Answer guide — compare after attempting:** 2000 is not guaranteed because increments can overwrite each other. Use a lock around the full update or an appropriate atomic counter. Wait for both threads before inspecting the result. Merely declaring the field volatile does not make increment atomic.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [Virtual thread guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [JDK 24 virtual-thread changes](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- [Concurrency utilities](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
