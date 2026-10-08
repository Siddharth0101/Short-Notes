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

## Recall aur practice

- Sawal — Heap usage normal ho phir bhi process memory limit exceed kaise kar sakta hai?
- Jawaab — Native buffers/stacks/metaspace aur other process memory heap ke bahar ho sakti hai; total RSS aur relevant metrics inspect karo.
- Khud try karo — Unbounded cache versus bounded cache ka retained-data estimate banao; heap dump mein owner/root aur eviction policy identify karo.

## Sources — aur padhne ke liye

- [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)
- [Garbage collector tuning guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Java Flight Recorder API and controls](https://docs.oracle.com/en/java/javase/21/docs/api/jdk.jfr/jdk/jfr/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/11-jvm-memory.md)
