---
id: java-streams-lambdas
title: Lambdas streams and Optional
track: java
order: 10
level: Intermediate
minutes: 19
summary: Lazy pipelines, reduction aur side effects ka clear mental model banao.
tags: streams, lambdas, optional, collectors
---

## Mental model

Lambda behavior ko value ki tarah pass karne ka compact syntax hai. Stream collection nahi, data processing pipeline hai: source, intermediate transformations, terminal operation. Stream use karna automatically multithreaded execution nahi banata. Pipeline ko mathematical transformation jaisa rakho: input se output, minimal hidden mutation.

> **Core takeaway:** Stream pipelines should express transformations without hidden shared mutation.

## Functional interfaces

Functional interface ka ek abstract method hota hai. Predicate test karta hai, Function transform karta hai, Consumer side effect karta hai, Supplier value produce karta hai. Method reference lambda ka compact equivalent ho sakta hai. Captured local variable final ya effectively final hona chahiye; captured object itself mutable ho sakta hai, jo concurrency bugs ka source ban sakta hai.

## A practical pipeline

```java
record Attempt(String topic, int score) {}

List<Attempt> attempts = List.of(
    new Attempt("java", 60),
    new Attempt("react", 90),
    new Attempt("java", 80)
);
Map<String, Double> averages = attempts.stream()
    .collect(Collectors.groupingBy(
        Attempt::topic,
        Collectors.averagingInt(Attempt::score)
    ));
```

Expected output values java=70.0 and react=90.0 hain; map iteration order pe depend mat karo. Pehle data shape identify karo: attempts se grouped numeric aggregate. Nested loop se equivalent implement karna pipeline ki correctness check karne mein help karta hai.

## Laziness and reduction

`filter` aur `map` normally terminal operation tak work start nahi karte. `findFirst`, `anyMatch` aur `limit` short-circuit kar sakte hain. `sorted` ko generally upstream elements buffer karne padte hain. Stream once consume hone ke baad reuse nahi kar sakte; source se new stream create karo. [Stream learning path](https://dev.java/learn/api/streams/)

`reduce` identity actual neutral element honi chahiye aur combiner associative hona chahiye, particularly parallel use mein. Sum identity zero hai; subtraction associative nahi. Mutable collection aggregation ke liye `collect` clearer hai. Stream pipeline mein externally shared ArrayList par `forEach(add)` parallel safety break karta hai.

## Collectors beyond groupingBy

`Collectors.toMap` duplicate keys par default merge function na hone se `IllegalStateException` throw karta hai — production data mein duplicates almost guaranteed hote hain:

```java
Map<String, Integer> latestScoreByTopic = attempts.stream()
    .collect(Collectors.toMap(
        Attempt::topic,
        Attempt::score,
        (existing, incoming) -> incoming // merge function: keep the later one
    ));
```

Merge function explicitly likhna force karta hai ki duplicate-key policy conscious decision ho — "last wins", "keep max", ya "throw" — silent crash nahi. `Collectors.partitioningBy` boolean predicate se do groups (true/false) banata hai, jab groupingBy zyada generic hota hai:

```java
Map<Boolean, List<Attempt>> passFail = attempts.stream()
    .collect(Collectors.partitioningBy(a -> a.score() >= 50));
List<Attempt> passed = passFail.get(true);
```

`teeing` collector (Java 12+) ek hi pass mein do independent aggregations combine karta hai, jab dono ke liye alag stream traverse karna wasteful lagta ho:

```java
var stats = attempts.stream()
    .collect(Collectors.teeing(
        Collectors.counting(),
        Collectors.averagingInt(Attempt::score),
        (count, average) -> "count=" + count + " avg=" + average
    ));
```

## Optional without ceremony

Optional absent return value model kar sakta hai. `.get()` bina existence reasoning ke use karna null-check problem ko new syntax mein repeat karta hai. `map`, `flatMap`, `orElseThrow`, `orElseGet` compose karo. `orElse(expensive())` argument eagerly evaluate hota hai; supplier-based `orElseGet` fallback lazily invoke karta hai. Optional ko har entity field ya every method parameter mein wrap karna necessary nahi.

```java
Optional<String> title = findTitleById(id);
// avoid: title.isPresent() ? title.get() : "untitled" — reintroduces the null-check style
String safe = title.orElse("untitled");
String computed = title.orElseGet(() -> expensiveDefaultTitle()); // supplier runs only if empty

Optional<String> upper = title.map(String::toUpperCase); // stays empty if title was empty
```

`Optional.of(value)` null argument par turant `NullPointerException` throw karta hai — yeh intentional hai, kyunki `Optional.of` assert karta hai ki value definitely present hai. Jab value genuinely null ho sakti hai, `Optional.ofNullable(value)` use karo. Common misuse: `Optional<List<String>>` field ya method parameter — collection khud hi empty-state represent kar sakti hai (`List.of()`), Optional wrapper redundant complexity add karta hai.

## Common traps

Parallel streams small inputs pe slower ho sakte hain because splitting, scheduling and merging cost hoti hai. Blocking network calls ko common parallel pool mein daalna uncontrolled contention de sakta hai. Benchmark realistic workload aur latency distribution; one warm run se conclusion mat nikalo. `.toList()` unmodifiable result deta hai, so mutability explicitly choose karo.

- **Wrong assumption:** Stream ek baar consume hone ke baad usi variable se dobara operations chala sakte hain (jaise pehle `count()` phir `collect()`). **Why it breaks:** Terminal operation stream ko close/consume kar deta hai; usi stream reference par dobara terminal operation call karne se `IllegalStateException: stream has already been operated upon or closed` milta hai. **Fix:** Agar same data par multiple aggregations chahiye, source (List/collection) se har baar naya `.stream()` banao, ya `teeing` collector se single-pass mein combine karo.
- **Wrong assumption:** `Optional.of(possiblyNullValue)` safe hai jab tak aage `.orElse()` lagate ho. **Why it breaks:** `Optional.of` khud construction time par null check karta hai aur turant NPE throw karta hai agar argument null ho — yeh exception `.orElse()` tak pahunchne se pehle hi aa jaati hai. **Fix:** Value null ho sakti hai toh `Optional.ofNullable` use karo, `Optional.of` sirf tab jab value ka non-null hona already guaranteed ho.
- **Wrong assumption:** `Collectors.groupingBy` har group ke liye ek `ArrayList` collector automatically thread-safe deta hai. **Why it breaks:** Sequential stream mein yeh fine hai, lekin parallel stream ke saath bina proper concurrent-safe downstream collector ke groupingBy internally synchronized merging karta hai jo bade datasets par contention create kar sakta hai — plain correctness toh rehta hai but performance benefit khatam ho jaata hai. **Fix:** Parallel aggregation ke liye pehle measure karo ki parallel actually faster hai; agar zaroorat ho toh `Collectors.groupingByConcurrent` ke saath `parallelStream()` combine karo.

## In a real backend service

Report/analytics endpoints mein `groupingBy` + `averagingInt`/`summingLong` combination bahut common hai — jaise "topic ke hisaab se average score" ya "day ke hisaab se order count". `Optional` service layer mein repository lookups ke return type ke roop mein dikhta hai (`Optional<Note>` se `orElseThrow(NoteNotFoundException::new)`), jabki DTO fields mein Optional generally avoid kiya jaata hai kyunki JSON serialization awkward ho jaati hai.

## Interview questions

**Map versus flatMap?** Map har input ko one output value banata hai. FlatMap har input se produced stream ko flatten karta hai, jaise orders se order lines.

**Why avoid side effects in intermediate operations?** Evaluation lazy, short-circuited or optimized ho sakti hai. Business correctness logging/mutation ke incidental execution par depend nahi honi chahiye.

**Why does Collectors.toMap throw on duplicate keys by default?** Bina explicit merge function ke, collector ko pata nahi ki duplicate key mile toh kaunsi value rakhni hai — silently ek value discard karne ki jagah yeh fail-fast throw karta hai taaki data-quality issue caller ko turant dikhe, hidden data loss na ho.

## Practice

Duplicate-free tags alphabetically return karo. Then second-highest distinct score find karo without assuming two values exist. Apna solution empty data, duplicate scores and missing values par explain karo. Phir `Collectors.toMap` ko duplicate-key input par bina merge function ke exception reproduce karo, phir merge function add karke fix karo.

## Research notes: Keep the source when traversing twice

A stream describes processing and is consumed by a terminal operation. Retain the collection or a stream-producing function for independent traversals.

```java
var values = java.util.List.of(2, 4, 7);
long even = values.stream().filter(n -> n % 2 == 0).count();
int total = values.stream().mapToInt(Integer::intValue).sum();
System.out.println(even + ":" + total); // 2:13
```

Keep transformations free of shared mutable side effects. Parallel processing is a workload and concurrency decision.

**Interview check:** Why should count and sum not reuse the same Stream variable?

**Answer:** The first terminal operation consumes it. Create another stream from the source or design a suitable single-pass reduction when warranted.

**Practice:** Explain the risks of mutating a shared ArrayList from parallel forEach.

[Read the source — Dev.java](https://dev.java/learn/api/streams/). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Replace a stream that appends into an external ArrayList with a pipeline producing names of active users. Why is parallelizing the original dangerous?

> **Hint:** Collect the result through the stream operation itself.

**Answer guide — compare after attempting:** Filter active users, map to names, then collect using the required result-list contract. Concurrent writes to an ordinary shared ArrayList are unsafe. Also clarify whether callers need a mutable result; Java's Stream.toList returns an unmodifiable list.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [Stream learning path](https://dev.java/learn/api/streams/)
- [Stream API contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)
- [Optional API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)
