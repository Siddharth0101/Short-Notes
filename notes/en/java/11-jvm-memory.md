---
id: java-jvm-memory
title: JVM memory garbage collection and diagnosis
track: java
order: 11
level: Advanced
minutes: 3
summary: JVM stack — per-thread frames and local state; heap — the managed area for objects.
tags: jvm, memory, garbage-collection, profiling
visual: gc-sweep
---

## Quick revision

> Revision target — From a memory symptom, identify the retaining owner, the heap/native budget and the right diagnostic tool.

- JVM stack — per-thread frames/local state; heap — the managed area for objects.
- Reachability — unreachable objects are eligible for GC; immediate collection is not guaranteed.
- Memory leak — unused objects stay reachable.
- GC roots — reachability is traced from roots such as thread stacks/static references.
- Heap dump — look at retained objects; thread dump — look at blocked/waiting execution.
- `OutOfMemoryError` — check the native/metaspace limits too, besides the heap.
- GC tuning — start from allocation, pause and live-set evidence.
- Metaspace — class metadata; classloader leaks can retain memory.
- Stack overflow — from excessive recursion/depth; different from a heap allocation problem.
- JIT — optimizes hot code; mind benchmark warm-up and dead-code elimination.

### Edge cases and reasoning

- Native budget — direct buffers, thread stacks and native libraries take memory outside the heap; the container limit is separate from the heap limit.
- Retained versus shallow — an object's own size differs from the size of the graph retained through its reachability; take leak evidence from the retention path.
- Finalization reliance — GC timing is not a resource cleanup contract; use an explicit close for files/sockets.

## Understand it with an example

- Scenario — The payload of every request is stored in a static Map and the entries are never removed.
- Reasoning — Even after the requests finish, the payloads are reachable from the Map root; GC will not reclaim them. Inspect the retention path and the entry growth.
- Catch — Increasing the heap size does not fix the ownership of a leak; you need bounded retention/eviction, and non-heap usage counts towards total process memory too.

## Recall and practice

- Question — How can a process exceed its memory limit even when heap usage is normal?
- Answer — Native buffers/stacks/metaspace and other process memory can sit outside the heap; inspect total RSS and the relevant metrics.
- Try it yourself — Build a retained-data estimate for an unbounded cache versus a bounded cache; identify the owner/root and the eviction policy in a heap dump.

## Practice questions

### Easy · `StackOverflowError` vs `OutOfMemoryError`

<details>
<summary>Answer</summary>

- `StackOverflowError` — the call stack of one thread filled up; often recursion without a base case.
- `OutOfMemoryError: Java heap space` — no room is left in the heap for reachable objects.
- Location — local primitives and references in the stack frame; objects on the heap.
- Different fixes — a loop/base case for the recursion; for the heap, find the leak or check the sizing.

</details>

### Easy · When is an object eligible for GC?

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

- Both nodes are eligible — not reachable from the GC roots (stack variables, static fields, active threads).
- Cycle — Java GC looks at reachability, not a reference count; cycles are collected too.
- Note — being eligible does not mean being freed immediately; GC runs on its own schedule.

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

The heap grows slowly in production. Why, and the fix?

<details>
<summary>Answer</summary>

- Cause — the static map is reachable from a GC root; every new SKU is stored forever (unbounded).
- Fix — a cache with a size + expiry (Caffeine: `maximumSize`, `expireAfterWrite`) or an LRU from `LinkedHashMap` `removeEldestEntry`.
- Thread-safety — `HashMap.computeIfAbsent` is not safe for concurrent calls; use `ConcurrentHashMap` or a cache library.

</details>

### Medium · Diagnosing an OOM

A service throws `OutOfMemoryError` every few hours. How do you collect the data?

<details>
<summary>Answer</summary>

- Heap dump — `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps`; on a live process, `jcmd <pid> GC.heap_dump file.hprof`.
- Quick view — `jcmd <pid> GC.class_histogram` shows which classes hold the most instances.
- Analyze — the Eclipse MAT dominator tree; look at the retained size (not shallow) and the path to GC roots.
- GC logs — `-Xlog:gc*` tells you whether the after-GC heap baseline is rising (a leak) or there are spikes (load).

</details>

### Hard · The container killed the JVM, with no OOM error

A 512 MiB container, `-Xmx512m`. The pod is `OOMKilled` but there is no `OutOfMemoryError` in Java. Why?

<details>
<summary>Answer</summary>

- The heap is not all the memory — metaspace, thread stacks, the code cache, direct/native buffers and GC structures are outside the heap.
- `-Xmx` = the container limit → total process memory goes above the limit and the kernel kills the process.
- Fix — `-XX:MaxRAMPercentage=70` (or an explicit smaller `-Xmx`) and headroom; limit the thread count and direct buffers.
- Monitor — the container RSS and `jcmd <pid> VM.native_memory summary` (with Native Memory Tracking turned on).

</details>

## Sources — further reading

- [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)
- [Garbage collector tuning guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Java Flight Recorder API and controls](https://docs.oracle.com/en/java/javase/21/docs/api/jdk.jfr/jdk/jfr/package-summary.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/11-jvm-memory.md)
