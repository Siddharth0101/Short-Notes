---
id: java-streams-lambdas
title: Lambdas streams and Optional
track: java
order: 10
level: Intermediate
minutes: 4
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
- `findFirst`/`findAny` — encounter-order first / koi matching element; parallel result differ kar sakta hai.
- `orElseGet` — fallback supplier zaroorat par; orElse argument pehle evaluate hota hai.
- Method reference — existing method ko functional interface se adapt, jaise String::trim.

### Functional interfaces aur collectors

- Predicate — T → boolean; test se check, and/or/negate se combine.
- Function interface — T → R; apply transform, andThen next function chalata hai.
- Consumer — T → void; accept se side effect; Supplier — no input → T, get se value.
- Collectors — joining strings jodta; groupingBy keys ke groups; downstream collector grouped result summarize karta hai.
- Stream matching — anyMatch/sab allMatch/noneMatch short-circuit; empty stream par false/true/true.
- Optional creation — of(null) error; nullable value ke liye ofNullable; absence ke liye empty.

### Edge cases aur reasoning

- Stream.toList result — unmodifiable list deta hai; modification chahiye toh explicitly suitable mutable collection collect karo.
- Duplicate map key — Collectors.toMap duplicate keys par merge policy bina fail; sum/first/last contract consciously choose karo.
- Reduction identity — parallel reduce mein identity har partition par apply ho sakti hai; non-neutral identity wrong total bana sakti hai.

## Research notes: Keep the source when traversing twice

- Stream processing describe karti hai aur terminal operation se consume hoti hai.

## Recall aur practice

- Sawal — Optional present ho tab orElse(expensive()) expensive function run karega?
- Jawaab — Haan; argument eagerly evaluate hota hai. Lazy fallback ke liye orElseGet supplier use karo.
- Khud try karo — Orders customer-wise sum karo; duplicate key merge, empty input aur sequential/parallel equivalent totals verify karo.

## Sources — aur padhne ke liye

- [Stream learning path](https://dev.java/learn/api/streams/)
- [Source yahan padho — Dev.java](https://dev.java/learn/api/streams/)
- [Stream API contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)
- [Optional API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/10-streams-lambdas.md)
