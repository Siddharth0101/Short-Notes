# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Generics and PECS

```java
static <T> void copyInto(
        List<? extends T> source,
        List<? super T> destination) {
    for (T item : source) destination.add(item);
}

List<Integer> scores = List.of(10, 20);
List<Number> numbers = new ArrayList<>();
copyInto(scores, numbers);
```

```java
static double sum(List<? extends Number> readOnlySource) {
    double total = 0;
    for (Number n : readOnlySource) total += n.doubleValue();
    // readOnlySource.add(5); // compile error — could be a List<Double> underneath
    return total;
}

static void fillWithZeros(List<? super Integer> writableTarget, int count) {
    for (int i = 0; i < count; i++) writableTarget.add(0);
    // Integer value = writableTarget.get(0); // compile error — could only be Object safely
}
```

## Concrete frequency map

```java
Map<String, Integer> counts = new HashMap<>();
for (String word : List.of("java", "react", "java")) {
    counts.merge(word, 1, Integer::sum);
}
System.out.println(counts.get("java")); // 2
```

## Iterating and mutating safely

```java
List<String> topics = new ArrayList<>(List.of("java", "spring", "sql"));
Iterator<String> it = topics.iterator();
while (it.hasNext()) {
    if (it.next().equals("sql")) {
        it.remove(); // safe — the iterator itself drives the structural change
    }
}
```

```java
List<Attempt> ranked = new ArrayList<>(attempts);
ranked.sort(
    Comparator.comparingInt(Attempt::score).reversed()
        .thenComparing(Attempt::topic)
);
```

## Research notes: A read-only view is not an immutable snapshot

```java
var names = new java.util.ArrayList<String>();
names.add("Nia");
var view = java.util.Collections.unmodifiableList(names);
names.add("Dev");
System.out.println(view.size()); // 2
```
