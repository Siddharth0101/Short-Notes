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

> Revision target — Lazy pipeline, terminal operation aur collector ke result contract ko trace karo.

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

## Example se samjho

- Scenario — Values `[2, 3, 4]` ko filter even, map square, phir sum karna hai.
- Reasoning — Filter ke baad 2 aur 4; map se 4 aur 16; terminal sum ka answer 20. Empty input ka sum zero hoga.
- Catch — Pipeline ko shared list mutate karke result banana unnecessary side effect hai; terminal collector/reduction use karo aur consumed stream dobara reuse mat karo.

## Recall aur practice

- Sawal — Optional present ho tab orElse(expensive()) expensive function run karega?
- Jawaab — Haan; argument eagerly evaluate hota hai. Lazy fallback ke liye orElseGet supplier use karo.
- Khud try karo — Orders customer-wise sum karo; duplicate key merge, empty input aur sequential/parallel equivalent totals verify karo.

## Practice questions

### Easy · Stream reuse

```java
Stream<String> names = list.stream();
long count = names.count();
List<String> upper = names.map(String::toUpperCase).toList();
```

<details>
<summary>Answer</summary>

- Result — `IllegalStateException: stream has already been operated upon or closed`.
- Stream ek baar ka pipeline hai; source (`list`) se naya stream banao: `list.stream()...`.

</details>

### Easy · Laziness

```java
Stream.of(1, 2, 3).map(x -> {
    System.out.println("map " + x);
    return x * 2;
});
```

Kya print hoga?

<details>
<summary>Answer</summary>

- Kuch nahi — intermediate operations lazy hain; terminal operation (`toList`, `forEach`, `count`) ke bina pipeline chalti hi nahi.
- Short-circuit — `findFirst` ke saath sirf zaroori elements process hote hain.

</details>

### Medium · `toMap` duplicate key

```java
Map<String, User> byEmail = users.stream()
    .collect(Collectors.toMap(User::email, u -> u));
```

Do users same email ke hon toh?

<details>
<summary>Answer</summary>

- Result — `IllegalStateException: Duplicate key ...`.
- Fix — merge function do: `Collectors.toMap(User::email, u -> u, (first, second) -> first)`.
- Ya grouping — `Collectors.groupingBy(User::email)` jab saare chahiye.
- Null values — `toMap` null value par `NullPointerException` deta hai.

</details>

### Medium · `Optional` misuse

```java
User u = repo.findById(id).get();
String name = repo.findName(id).orElse(loadDefaultName()); // expensive DB call
```

<details>
<summary>Answer</summary>

- `get()` — empty par `NoSuchElementException`; `orElseThrow(() -> new NotFoundException(id))` intent clear karta hai.
- `orElse(x)` — `x` hamesha evaluate hota hai (present ho tab bhi); lazy ke liye `orElseGet(this::loadDefaultName)`.
- Optional fields/parameters mein kam use karo; return type ke liye bana hai.

</details>

### Hard · Top 3 customers by spend

`List<Order>` (customerId, amount `BigDecimal`) se total spend per customer nikalo aur top 3 descending return karo.

<details>
<summary>Answer</summary>

```java
List<Map.Entry<String, BigDecimal>> top = orders.stream()
    .collect(Collectors.groupingBy(
        Order::customerId,
        Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)))
    .entrySet().stream()
    .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
    .limit(3)
    .toList();
```

- `reducing(identity, mapper, op)` — `BigDecimal` sum; `summingDouble` money ke liye precision kho deta.
- Ties — deterministic order chahiye toh `.thenComparing(Map.Entry.comparingByKey())`.
- Bada data — yeh aggregation DB (`GROUP BY ... ORDER BY ... LIMIT 3`) mein karna sasta hai.

</details>

## Sources — aur padhne ke liye

- [Stream learning path](https://dev.java/learn/api/streams/)
- [Stream API contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)
- [Optional API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/10-streams-lambdas.md)
