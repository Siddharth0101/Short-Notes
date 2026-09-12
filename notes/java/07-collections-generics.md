---
id: java-collections-generics
title: Collections generics and choosing data structures
track: java
order: 7
level: Intermediate
minutes: 20
summary: Collection contracts, complexity aur PECS ko practical examples se revise karo.
tags: collections, generics, hashmap, pecs
---

## Mental model

Collection ka interface behavior batata hai; implementation performance aur ordering decisions leta hai. Pehle requirement likho: duplicates allowed? insertion order important? fast lookup? sorted ranges? thread safety? Uske baad collection choose karo. Har problem mein HashMap use karna aur har ordering problem mein sorting karna unnecessary complexity la sakta hai.

## Choosing an implementation

| Need | Starting choice | Tradeoff |
| --- | --- | --- |
| Indexed sequence | ArrayList | Middle inserts shift elements |
| Unique membership | HashSet | Stable iteration order promise nahi |
| Key lookup | HashMap | Average constant-time operations depend on hashing |
| Sorted keys or ranges | TreeMap | Logarithmic lookup and update |
| Queue or stack | ArrayDeque | Null elements allowed nahi |
| Insertion order map | LinkedHashMap | Extra links use memory |

LinkedList ka insertion O(1) tab useful hai jab node position already available ho; index tak traversal O(n) hai. Real hardware par allocation and locality bhi matter karte hain. Concurrent access ke liye collection selection alone compound workflow atomic nahi banata.

## Generics and PECS

`List<Integer>` subtype of `List<Number>` nahi hai. Agar hota, Number-list reference se Double insert karke Integer list corrupt kar sakte the. Wildcards flexible read/write boundaries banate hain: producer extends, consumer super. [Generics tutorial](https://dev.java/learn/generics/)

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

`? extends Number` se Number read kar sakte ho, lekin arbitrary Integer add nahi kar sakte: actual backing list Double ki bhi ho sakti hai. Type erasure ka matlab generic type arguments generally runtime object identity mein retained nahi hote. Raw types compiler protection bypass kar dete hain, aur failure baad mein ClassCastException ban sakta hai.

PECS mnemonic yaad rakhne ka simplest tarika: **P**roducer **E**xtends, **C**onsumer **S**uper. Wildcard bound method ki intent describe karta hai, list ki actual identity nahi:

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

`sum` sirf padhta hai isliye `? extends Number` safe hai; `fillWithZeros` sirf likhta hai isliye `? super Integer` safe hai. Jis method ko dono karna ho (read specific type aur write bhi), unbounded ya exact generic type parameter (`List<T>`) chahiye — wildcard wahan kaam nahi karega.

## Concrete frequency map

```java
Map<String, Integer> counts = new HashMap<>();
for (String word : List.of("java", "react", "java")) {
    counts.merge(word, 1, Integer::sum);
}
System.out.println(counts.get("java")); // 2
```

Yeh ordinary map single-thread use assume karta hai. Shared counters ke liye ConcurrentHashMap and atomic map operations consider karo; separate `get` plus `put` lost updates de sakte hain.

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

`Iterator.remove()` list ki modCount ko iterator ke expected count ke saath consistent rakhta hai. Comparator chaining readable multi-key sorting deta hai:

```java
List<Attempt> ranked = new ArrayList<>(attempts);
ranked.sort(
    Comparator.comparingInt(Attempt::score).reversed()
        .thenComparing(Attempt::topic)
);
```

`comparingInt` boxing avoid karta hai; plain `Comparator.comparing(Attempt::score)` `Integer` object banake compare karta, jo bade collections mein extra allocation cost karta hai.

## Common traps

`Arrays.asList` fixed-size view hai; `List.of` unmodifiable aur null-rejecting hai. Unmodifiable wrapper underlying mutable collection ke future changes reflect kar sakta hai. Fail-fast iterators bug detection mein help karte hain, synchronization guarantee nahi dete. Comparator subtraction overflow kar sakti hai: `Integer.compare(a, b)` use karo.

- **Wrong assumption:** For-each loop ke andar `list.remove(item)` call karna safe hai. **Why it breaks:** For-each internally iterator use karta hai; loop body se directly collection modify karne se `ConcurrentModificationException` throw hoti hai kyunki iterator ka expected modCount collection ke actual modCount se mismatch ho jaata hai. **Fix:** `Iterator.remove()` use karo, ya `removeIf` predicate se batch removal karo, ya pehle ek copy par iterate karo.
- **Wrong assumption:** `HashMap` insertion order preserve karta hai jaise chhote test runs mein observe hua tha. **Why it breaks:** HashMap iteration order hash bucket layout par depend karta hai, jo resize/rehash ke baad change ho sakta hai — koi contract insertion order guarantee nahi karta, sirf coincidence se chhote maps mein consistent dikh sakta hai. **Fix:** Order matter kare toh explicitly `LinkedHashMap` (insertion order) ya `TreeMap` (sorted order) use karo.
- **Wrong assumption:** `List.of(a, b, c)` se bana list normal `ArrayList` jaisa hai, bas thoda safer hai. **Why it breaks:** `List.of` ka result completely unmodifiable hai — `.set()`, `.add()`, `.sort()` sab `UnsupportedOperationException` denge, aur null elements bhi reject honge construction time par hi. **Fix:** Mutable working copy chahiye toh explicitly `new ArrayList<>(List.of(...))` wrap karo.

## In a real backend service

Repository layer se return hone wale collections ko usually unmodifiable rakha jaata hai (`List.copyOf` ya `Collections.unmodifiableList`) taaki controller layer accidentally domain state mutate na kar de. `PECS` pattern service-layer utility methods mein dikhta hai — jaise ek `mergeInto(List<? super OrderLine> target, List<? extends OrderLine> source)` helper jo different concrete list types ke saath kaam kare bina caller ko exact generic type expose kiye.

## Interview questions

**HashMap versus TreeMap?** HashMap key equality/hash contract use karta hai and ordering promise nahi karta. TreeMap comparator/natural ordering se sorted keys maintain karta hai, range operations support karta hai.

**Why must equals and hashCode agree?** Hash lookup bucket hash se choose karta hai, then equality check karta hai. Equal objects different hashes return karenge toh logical duplicates aur failed retrieval possible hain.

**Why does modifying a list during a for-each loop throw an exception?** For-each ke peeche iterator hota hai jo collection ka modCount snapshot rakhta hai. Loop ke andar collection ko directly modify karne se modCount badal jaata hai, aur agli `next()` call par iterator yeh mismatch detect karke `ConcurrentModificationException` throw karta hai — yeh silent data corruption se better hai.

## Practice

Top three frequent words return karo; ties alphabetical rakho. Phir API ko `List<? extends CharSequence>` accept karne ke tradeoff explain karo. Empty input, repeated keys and case normalization test karo. Last mein ek for-each loop se list se element remove karke `ConcurrentModificationException` reproduce karo, phir `Iterator.remove()` ya `removeIf` se fix karo.

## Sources

- [Collections framework](https://dev.java/learn/api/collections-framework/)
- [Generics tutorial](https://dev.java/learn/generics/)
