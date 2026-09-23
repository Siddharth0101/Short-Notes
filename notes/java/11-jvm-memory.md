---
id: java-jvm-memory
title: JVM memory garbage collection and diagnosis
track: java
order: 11
level: Advanced
minutes: 1
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

## Sources — aur padhne ke liye

- [JVM runtime areas](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html)
- [Garbage collector tuning guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Java Flight Recorder API and controls](https://docs.oracle.com/en/java/javase/21/docs/api/jdk.jfr/jdk/jfr/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/11-jvm-memory.md)
