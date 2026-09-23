# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Collectors beyond groupingBy

```java
Map<String, Integer> latestScoreByTopic = attempts.stream()
    .collect(Collectors.toMap(
        Attempt::topic,
        Attempt::score,
        (existing, incoming) -> incoming // merge function: keep the later one
    ));
```

```java
Map<Boolean, List<Attempt>> passFail = attempts.stream()
    .collect(Collectors.partitioningBy(a -> a.score() >= 50));
List<Attempt> passed = passFail.get(true);
```

```java
var stats = attempts.stream()
    .collect(Collectors.teeing(
        Collectors.counting(),
        Collectors.averagingInt(Attempt::score),
        (count, average) -> "count=" + count + " avg=" + average
    ));
```

## Optional without ceremony

```java
Optional<String> title = findTitleById(id);
// avoid: title.isPresent() ? title.get() : "untitled" — reintroduces the null-check style
String safe = title.orElse("untitled");
String computed = title.orElseGet(() -> expensiveDefaultTitle()); // supplier runs only if empty

Optional<String> upper = title.map(String::toUpperCase); // stays empty if title was empty
```

## Research notes: Keep the source when traversing twice

```java
var values = java.util.List.of(2, 4, 7);
long even = values.stream().filter(n -> n % 2 == 0).count();
int total = values.stream().mapToInt(Integer::intValue).sum();
System.out.println(even + ":" + total); // 2:13
```
