# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## A visible race condition

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

## Executors and cancellation

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

## CompletableFuture and pitfalls

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

## ThreadLocal leaks in pooled threads

```java
class RequestContext {
    private static final ThreadLocal<String> CURRENT_USER = new ThreadLocal<>();
    static void set(String user) { CURRENT_USER.set(user); }
    static String get() { return CURRENT_USER.get(); }
    static void clear() { CURRENT_USER.remove(); }
}
```
