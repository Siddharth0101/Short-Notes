---
id: java-jvm-memory
title: JVM memory garbage collection and diagnosis
track: java
order: 11
level: Advanced
minutes: 22
summary: Reachability, allocation aur profiling se memory issues ko reason karo.
tags: jvm, memory, garbage-collection, profiling
visual: gc-sweep
---

## Mental model

JVM abstract execution model aur actual optimized runtime ko distinguish karo. Model mein each thread ke stack frames method invocation state hold karte hain; heap shared object storage hai. Primitive/reference distinction memory location decide nahi karta. Primitive instance field object ka part ho sakta hai, while local reference stack frame mein modeled hoti hai. JIT actual storage optimize kar sakta hai.

> **Core takeaway:** A memory leak can consist of reachable objects that are no longer useful.

## Trace references before locations

```java
final class Note {
    int revisions;
}
static void edit(Note localCopy) {
    localCopy.revisions++;
    localCopy = new Note();
    localCopy.revisions = 99;
}
// Note original = new Note(); edit(original);
// original.revisions is 1, not 99.
```

Diagram conceptual hai; physical address ya mandatory layout promise nahi:

```text
caller frame                  heap
original -------------------> Note { revisions: 1 }

edit frame
localCopy -- after reassignment --> Note { revisions: 99 }
```

Argument mein reference value copy hui. Original object mutation caller ko visible hai; local reassignment caller variable change nahi karti. Method return ke baad second object unreachable ho sakta hai if no other reachable reference exists.

## Garbage collection and leaks

Collector GC roots se reachability track karta hai. Unreachable object collection ke liye eligible hai; immediate collection guaranteed nahi. Object cycle collection prevent nahi karta jab whole cycle unreachable ho. Memory leak Java mein tab bhi possible hai jab unwanted objects reachable rakhe ja rahe hon: unbounded static maps, listeners, thread locals or queues. [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)

Heap exhaustion aur StackOverflowError different failures hain. Infinite recursion stack depth exhaust kar sakti hai even with free heap. Container process memory heap se zyada hai: thread stacks, code cache, direct buffers, metadata and native libraries contribute karte hain.

## Common leak patterns beyond unbounded caches

```java
class ReportBuilder {
    private static final List<ReportBuilder> ALL_INSTANCES = new ArrayList<>();
    ReportBuilder() { ALL_INSTANCES.add(this); } // never removed — classic leak
}
```

Static collection ka koi bhi element add-only ho aur kabhi remove na ho, toh yeh instances forever reachable rehte hain GC roots se — chahe application logic unhe "done" samajh chuki ho. Non-static inner class bhi implicitly apne enclosing instance ka reference rakhti hai:

```java
class ReportService {
    private final byte[] largeBuffer = new byte[10_000_000];
    class Listener { /* implicitly holds ReportService.this */ }
    Listener createListener() { return new Listener(); }
}
```

Agar `Listener` instance kahin long-lived registry mein register ho jaaye (jaise event bus), poora `ReportService` object — uska `largeBuffer` sameet — reachable rehta hai jab tak listener unregister na ho, chahe `ReportService` khud kahin use na ho raha ho. Fix: static nested class use karo jab enclosing instance ki zaroorat na ho, ya listener registries mein weak references (`WeakReference`, `WeakHashMap`) consider karo.

## Garbage collectors, briefly

JVM multiple collector algorithms provide karta hai jo different pause-time/throughput tradeoffs dete hain. G1 (default in modern JDKs) heap ko regions mein baant kar zyada predictable pause times target karta hai. ZGC aur Shenandoah bahut low-latency workloads ke liye designed hain, very large heaps par bhi short pauses target karte hain, thoda extra CPU/throughput cost ke saath. Collector choice application ke latency-sensitivity aur heap size par depend karta hai — ek chhoti batch job ke liye default settings usually fine hain; ek latency-critical API ke liye collector aur heap sizing measured tuning maangte hain. [Garbage collector tuning guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)

## Diagnose in order

1. Symptom define karo: latency spikes, high allocation, rising live heap, CPU saturation ya crash.
2. Metrics correlate karo: request rate, heap after collection, pause duration, allocation rate and CPU.
3. Java Flight Recorder or profiler se workload evidence capture karo.
4. Heap dump mein retained size and reference paths inspect karo; sensitive data handling consider karo.
5. Small targeted change karo, same workload par before/after compare karo.

Synthetic capacity example: 200,000 cached values at estimated 1 KB payload already roughly 200 MB raw payload hain. Object headers, strings, map entries and alignment extra hain. Yeh estimate measurement substitute nahi; retained size actual structure par depend karega.

## Common traps

`System.gc()` reliable memory-management policy nahi hai. Bigger heap leak fix nahi karta; failure delay ho sakti hai. Every latency spike ko GC bolna bhi wrong: database waits and locks inspect karo. Microbenchmark mein JVM warmup aur dead-code elimination account kiye bina timings misleading ho sakti hain.

- **Wrong assumption:** Static field mein object store karna kabhi memory issue nahi de sakta kyunki yeh "just one reference" hai. **Why it breaks:** Static fields class loader lifetime tak jeete hain — application-lifetime tak. Ek static `List`/`Map` mein items add karte jaana aur kabhi remove na karna, poori application lifetime mein slowly heap grow karega, aur symptom sirf hours/days baad visible hoga. **Fix:** Static mutable collections avoid karo jab tak genuinely lifetime-scoped cache na ho with a bounded eviction policy (size limit, TTL).
- **Wrong assumption:** Non-static inner class use karne mein koi memory implication nahi hai, sirf syntax convenience hai. **Why it breaks:** Non-static inner class instance implicitly apne enclosing outer instance ka reference hold karta hai. Agar inner instance kahin long-lived jagah (cache, listener registry) store ho jaaye, poora outer object — uske saare fields sameet — unreachable nahi ho paata. **Fix:** Jab enclosing instance access ki zaroorat na ho, static nested class use karo.
- **Wrong assumption:** Heap dump lena production incident ke time safe aur cheap operation hai. **Why it breaks:** Heap dump generation ke dauran JVM typically stop-the-world pause leta hai jo heap size ke proportional time le sakta hai — bade heaps par yeh seconds se minutes tak ho sakta hai, jo already-struggling production service ko aur zyada unavailable bana deta hai. **Fix:** Heap dumps ko staging/replica environment mein reproduce karke lo jab possible ho; production mein lena ho toh maintenance window aur traffic draining consider karo.

## In a real backend service

Long-running Spring Boot services mein sabse common leak sources hote hain: unbounded in-memory caches (jaise `Map` ko manually cache jaisa use karna without eviction), event listener registries jinme unregister step miss ho jaata hai, aur ThreadLocal cleanup missed hona pooled-thread environments mein (chapter 6 se related). JFR ya APM tool (jaise New Relic/Datadog) se allocation profiling production mein continuously chalti rehti hai taaki ek slow memory growth incident banne se pehle hi dikh jaaye.

## Interview questions

**Can Java have memory leaks?** Haan. Garbage collector unused business data ko nahi samajhta; reachable data retain hota hai even when application logically no longer needs it.

**Are all objects always physically on heap?** JVM model heap allocations describe karta hai, but optimizations like escape analysis and scalar replacement allocations eliminate kar sakte hain. Code correctness memory-layout guesses par depend nahi honi chahiye.

**Why can a non-static inner class cause a memory leak?** Non-static inner class object implicitly enclosing outer instance ka reference carry karta hai (`Outer.this`). Agar inner object outer se zyada der tak reachable rehta hai (jaise kisi listener registry mein), toh poora outer object bhi unreachable nahi ho pata, chahe application logically usse discard kar chuki ho.

## Practice

Unbounded cache ko bounded eviction policy mein convert karo. Increasing-load test se post-GC live memory compare karo. Ek retained listener ka reference path draw karo, aur removal lifecycle document karo. Phir ek non-static inner class ko static registry mein register karke outer-instance leak reproduce karo, aur static nested class se fix karo.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A service retains every processed request in a static map. Why can garbage collection run successfully while heap usage keeps growing?

> **Hint:** Reachability prevents collection even after business work is finished.

**Answer guide — compare after attempting:** The static map keeps request objects reachable. Inspect heap retention paths and map growth, then bound or expire entries according to the real retention need. More frequent garbage collection does not fix an unbounded owner. Verify memory stabilizes under repeated load.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)
- [Java Flight Recorder API and controls](https://docs.oracle.com/en/java/javase/21/docs/api/jdk.jfr/jdk/jfr/package-summary.html)
