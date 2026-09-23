---
id: java-streams-lambdas
title: Lambdas streams and Optional
track: java
order: 10
level: Intermediate
minutes: 1
summary: Lambda — functional interface ki implementation.
tags: streams, lambdas, optional, collectors
---

## Quick revision

- Lambda — functional interface ki implementation.
- Functional interface — ek abstract method wala contract.
- Stream — lazy data pipeline; terminal operation se execute hoti hai.
- `map` — transform; `filter` — select; `flatMap` — nested results flatten.
- `reduce` — associative accumulation; valid identity choose karo.
- `collect` — results ko collection/grouping mein jama karo.
- Stream reuse — terminal operation ke baad same stream reuse nahi.
- Side effects — pipeline mein shared mutable state avoid karo.
- Parallel stream — workload, thread pool aur merge cost dekho; always faster nahi.
- Optional — missing result model karo; unchecked `get()` se bacho.

## Research notes: Keep the source when traversing twice

- Stream processing describe karti hai aur terminal operation se consume hoti hai.

## Sources — aur padhne ke liye

- [Stream learning path](https://dev.java/learn/api/streams/)
- [Source yahan padho — Dev.java](https://dev.java/learn/api/streams/)
- [Stream API contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)
- [Optional API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/10-streams-lambdas.md)
