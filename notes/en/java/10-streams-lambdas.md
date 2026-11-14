---
id: java-streams-lambdas
title: Lambdas streams and Optional
track: java
order: 10
level: Intermediate
minutes: 4
summary: Lambda — an implementation of a functional interface.
tags: streams, lambdas, optional, collectors
---

## Quick revision

> Revision target — Trace the lazy pipeline, the terminal operation and the result contract of a collector.

- Lambda — an implementation of a functional interface.
- Functional interface — a contract with one abstract method.
- Stream — a lazy data pipeline; it executes on a terminal operation.
- `map` — transform; `filter` — select; `flatMap` — flatten nested results.
- `reduce` — associative accumulation; choose a valid identity.
- `collect` — gathers the results into a collection/grouping.
- Stream reuse — the same stream cannot be reused after a terminal operation.
- Side effects — avoid shared mutable state in a pipeline.
- Parallel stream — look at the workload, the thread pool and the merge cost; not always faster.
- Optional — models a missing result; avoid an unchecked `get()`.
- `findFirst`/`findAny` — the first in encounter order / any matching element; the parallel result can differ.
- `orElseGet` — a fallback supplier only when needed; the orElse argument is evaluated up front.
- Method reference — adapts an existing method to a functional interface, such as String::trim.

### Functional interfaces and collectors

- Predicate — T → boolean; check with test, combine with and/or/negate.
- Function interface — T → R; apply transforms, andThen runs the next function.
- Consumer — T → void; a side effect through accept; Supplier — no input → T, a value from get.
- Collectors — joining concatenates strings; groupingBy makes groups by key; a downstream collector summarizes the grouped result.
- Stream matching — anyMatch/allMatch/noneMatch short-circuit; false/true/true on an empty stream.
- Optional creation — of(null) is an error; ofNullable for a nullable value; empty for absence.

### Edge cases and reasoning

- Stream.toList result — gives an unmodifiable list; if you need modification, collect explicitly into a suitable mutable collection.
- Duplicate map key — Collectors.toMap fails on duplicate keys without a merge policy; choose the sum/first/last contract consciously.
- Reduction identity — in a parallel reduce the identity can be applied on every partition; a non-neutral identity can produce a wrong total.

## Research notes: Keep the source when traversing twice

- A stream describes processing and is consumed by a terminal operation.

## Understand it with an example

- Scenario — The values `[2, 3, 4]` are to be filtered for even, mapped to the square, then summed.
- Reasoning — After the filter, 2 and 4; from the map, 4 and 16; the terminal sum is 20. The sum of an empty input is zero.
- Catch — Building the result by mutating a shared list from the pipeline is an unnecessary side effect; use a terminal collector/reduction and do not reuse a consumed stream.

## Recall and practice

- Question — If the Optional is present, will orElse(expensive()) run the expensive function?
- Answer — Yes; the argument is evaluated eagerly. Use an orElseGet supplier for a lazy fallback.
- Try it yourself — Sum orders per customer; verify the duplicate-key merge, an empty input and equivalent sequential/parallel totals.

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
- A stream is a one-time pipeline; create a new stream from the source (`list`): `list.stream()...`.

</details>

### Easy · Laziness

```java
Stream.of(1, 2, 3).map(x -> {
    System.out.println("map " + x);
    return x * 2;
});
```

What will be printed?

<details>
<summary>Answer</summary>

- Nothing — intermediate operations are lazy; without a terminal operation (`toList`, `forEach`, `count`) the pipeline never runs.
- Short-circuit — with `findFirst` only the needed elements are processed.

</details>

### Medium · `toMap` duplicate key

```java
Map<String, User> byEmail = users.stream()
    .collect(Collectors.toMap(User::email, u -> u));
```

What if two users have the same email?

<details>
<summary>Answer</summary>

- Result — `IllegalStateException: Duplicate key ...`.
- Fix — give a merge function: `Collectors.toMap(User::email, u -> u, (first, second) -> first)`.
- Or grouping — `Collectors.groupingBy(User::email)` when you want all of them.
- Null values — `toMap` throws `NullPointerException` on a null value.

</details>

### Medium · `Optional` misuse

```java
User u = repo.findById(id).get();
String name = repo.findName(id).orElse(loadDefaultName()); // expensive DB call
```

<details>
<summary>Answer</summary>

- `get()` — `NoSuchElementException` when empty; `orElseThrow(() -> new NotFoundException(id))` makes the intent clear.
- `orElse(x)` — `x` is always evaluated (even when present); `orElseGet(this::loadDefaultName)` for lazy.
- Use Optional sparingly in fields/parameters; it was made for return types.

</details>

### Hard · Top 3 customers by spend

From a `List<Order>` (customerId, amount `BigDecimal`), work out the total spend per customer and return the top 3 descending.

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

- `reducing(identity, mapper, op)` — a `BigDecimal` sum; `summingDouble` would lose precision for money.
- Ties — `.thenComparing(Map.Entry.comparingByKey())` if you need a deterministic order.
- Large data — doing this aggregation in the DB (`GROUP BY ... ORDER BY ... LIMIT 3`) is cheaper.

</details>

## Sources — further reading

- [Stream learning path](https://dev.java/learn/api/streams/)
- [Stream API contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)
- [Optional API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/10-streams-lambdas.md)
