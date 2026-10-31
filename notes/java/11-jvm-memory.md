---
id: java-jvm-memory
title: JVM memory garbage collection and diagnosis
track: java
order: 11
level: Advanced
minutes: 3
summary: JVM stack — per-thread frames/local state; heap — objects ka managed area.
tags: jvm, memory, garbage-collection, profiling
visual: gc-sweep
---

## Quick revision

> Revision target — Memory symptom se retained owner, heap/native budget aur right diagnostic tool identify karo.

- JVM stack — per-thread frames/local state; heap — objects ka managed area.
- Reachability — unreachable objects GC ke liye eligible; immediate collection guaranteed nahi.
- Memory leak — unused objects ab bhi reachable reh jaate hain.
- GC roots — thread stacks/static references jaise roots se reachability trace hoti hai.
- Heap dump — retained objects dekho; thread dump — blocked/waiting execution dekho.
- `OutOfMemoryError` — heap ke alawa native/metaspace limits bhi check karo.
- GC tuning — allocation, pause aur live-set evidence se start karo.
- Metaspace — class metadata; classloader leaks memory retain kar sakte hain.
- Stack overflow — excessive recursion/depth se; heap allocation problem se alag.
- JIT — hot code optimize karta hai; benchmark warm-up aur dead-code elimination ka dhyaan.

### Edge cases aur reasoning

- Native budget — direct buffers, thread stacks aur native libraries heap ke bahar memory leti hain; container limit heap limit se alag.
- Retained versus shallow — object ka own size aur uski reachability se retained graph size different; leak evidence retention path se lo.
- Finalization reliance — GC timing resource cleanup contract nahi; files/sockets ke liye explicit close use karo.

## Example se samjho

- Scenario — Har request ka payload static Map mein store hota hai aur entries kabhi remove nahi hoti.
- Reasoning — Requests finish hone ke baad bhi Map root se payload reachable hain; GC unhe reclaim nahi karega. Retention path aur entry growth inspect karo.
- Catch — Heap size badhana leak ka ownership fix nahi; bounded retention/eviction chahiye, aur total process memory mein non-heap usage bhi count hoti hai.

## Recall aur practice

- Sawal — Heap usage normal ho phir bhi process memory limit exceed kaise kar sakta hai?
- Jawaab — Native buffers/stacks/metaspace aur other process memory heap ke bahar ho sakti hai; total RSS aur relevant metrics inspect karo.
- Khud try karo — Unbounded cache versus bounded cache ka retained-data estimate banao; heap dump mein owner/root aur eviction policy identify karo.

## Practice questions

### Easy · `StackOverflowError` vs `OutOfMemoryError`

<details>
<summary>Answer</summary>

- `StackOverflowError` — ek thread ka call stack bhar gaya; aksar base case ke bina recursion.
- `OutOfMemoryError: Java heap space` — heap mein reachable objects ke liye jagah nahi bachi.
- Location — local primitives aur references stack frame mein; objects heap par.
- Fix alag — recursion ko loop/base case; heap ke liye leak dhundo ya sizing check karo.

</details>

### Easy · Object GC ke liye kab eligible hai?

```java
Node a = new Node();
Node b = new Node();
a.next = b;
b.next = a;
a = null;
b = null;
```

<details>
<summary>Answer</summary>

- Dono nodes eligible — GC roots (stack variables, static fields, active threads) se reachable nahi.
- Cycle — Java GC reachability dekhta hai, reference count nahi; cycles bhi collect hote hain.
- Note — eligible hone ka matlab turant free hona nahi; GC apne time par chalta hai.

</details>

### Medium · Static cache leak

```java
class PriceService {
    private static final Map<String, Price> CACHE = new HashMap<>();
    Price get(String sku) {
        return CACHE.computeIfAbsent(sku, this::load);
    }
}
```

Production mein heap dheere-dheere badhta hai. Kyun aur fix?

<details>
<summary>Answer</summary>

- Cause — static map GC root se reachable hai; har naya SKU hamesha ke liye store hota hai (unbounded).
- Fix — size + expiry wala cache (Caffeine: `maximumSize`, `expireAfterWrite`) ya `LinkedHashMap` `removeEldestEntry` se LRU.
- Thread-safety — `HashMap.computeIfAbsent` concurrent calls ke liye safe nahi; `ConcurrentHashMap` ya cache library.

</details>

### Medium · OOM ko diagnose karna

Service har kuch ghante mein `OutOfMemoryError` deti hai. Data kaise collect karoge?

<details>
<summary>Answer</summary>

- Heap dump — `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps`; live process par `jcmd <pid> GC.heap_dump file.hprof`.
- Quick view — `jcmd <pid> GC.class_histogram` se kaunsi classes sabse zyada instances rakhti hain.
- Analyze — Eclipse MAT dominator tree; retained size dekho (shallow nahi) aur path to GC roots.
- GC logs — `-Xlog:gc*` se pata chale heap after-GC baseline badh raha hai (leak) ya spikes hain (load).

</details>

### Hard · Container ne JVM ko kill kiya, OOM error nahi aaya

512 MiB container, `-Xmx512m`. Pod `OOMKilled` hota hai par Java mein `OutOfMemoryError` nahi. Kyun?

<details>
<summary>Answer</summary>

- Heap hi poori memory nahi — metaspace, thread stacks, code cache, direct/native buffers, GC structures heap ke bahar hain.
- `-Xmx` = container limit → total process memory limit se upar jaata hai, kernel process kill karta hai.
- Fix — `-XX:MaxRAMPercentage=70` (ya explicit chhota `-Xmx`) aur headroom; thread count aur direct buffers limit karo.
- Monitor — container RSS aur `jcmd <pid> VM.native_memory summary` (Native Memory Tracking on karke).

</details>

## Sources — aur padhne ke liye

- [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)
- [Garbage collector tuning guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Java Flight Recorder API and controls](https://docs.oracle.com/en/java/javase/21/docs/api/jdk.jfr/jdk/jfr/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/11-jvm-memory.md)
