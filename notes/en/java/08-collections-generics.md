---
id: java-collections-generics
title: Collections generics and choosing data structures
track: java
order: 8
level: Intermediate
minutes: 4
summary: List — ordered, duplicates allowed; Set — unique; Map — key/value pairs.
tags: collections, generics, hashmap, pecs
---

## Quick revision

> Revision target — Choose a collection from the access pattern and distinguish the contracts of a view, a copy and an order.

- List — ordered, duplicates allowed; Set — unique; Map — key/value pairs.
- ArrayList — fast indexed access; a middle insert/delete needs shifting.
- LinkedList — useful for node operations; random access is O(n).
- HashMap — expected O(1) lookup; not thread-safe.
- TreeMap — sorted keys; operations are O(log n).
- Generics — compile-time type safety; avoid raw types.
- PECS — producer `extends`, consumer `super`.
- Comparator — defines a consistent ordering; avoid subtraction overflow.
- Concurrent collection — thread-safe operations; you still have to design multi-step invariants.
- Iterator remove — use a supported iterator's remove for safe deletion during traversal.
- Unmodifiable view — blocks writes, but external changes to the underlying collection can still show.
- Generic invariance — you cannot assign a `List<Integer>` to a `List<Number>`.

### Ordering and generic bounds

- Comparable — the type's natural order through compareTo; a Comparator gives an external/custom ordering.
- Generic bound — `<T extends Number>` constrains the accepted type; the wildcard ? represents an unknown compatible type.

### Concurrent collections

- ConcurrentHashMap — supports concurrent reads/writes; do not assume multiple calls are one atomic transaction.
- CopyOnWriteArrayList — updates copy the array; useful when reads are very frequent and writes are rare.
- Weakly consistent iterator — tolerates concurrent changes; do not assume an exact point-in-time snapshot.

### Edge cases and reasoning

- List.copyOf boundary — gives an unmodifiable snapshot of the structure and rejects null elements; the mutable elements inside are not deep-copied.
- Removal overload — List<Integer>.remove(1) removes the index; remove(Integer.valueOf(1)) removes the value.
- Ordering equality — sorted sets/maps treat a comparator zero as the same key; an ordering inconsistent with equals can surprise you.

## Research notes: A read-only view is not an immutable snapshot

- The wrapper blocks changes through its own interface, but if the backing list changes, the view shows that change.

## Understand it with an example

- Scenario — Create an unmodifiable view and a `List.copyOf` snapshot of the original list `[A, B]`; then add C to the original.
- Reasoning — The view shows `[A, B, C]`; the snapshot's structure stays `[A, B]`. Structural mutation through either one is blocked.
- Catch — If the elements are mutable objects, the snapshot does not deep-copy them either; container immutability and element immutability are separate.

## Recall and practice

- Question — What is left after remove(1) on a List<Integer> [1,2,3]?
- Answer — [1,3]; a primitive int argument selects the index overload, so pass an Integer object to remove the value 1.
- Try it yourself — Compare the original list, an unmodifiable view and copyOf; predict the visible effects of a backing add and an element mutation.

## Practice questions

### Easy · Choose the right collection

(a) Fast read by index, adds at the end. (b) Unique tags, order does not matter. (c) Username → user lookup. (d) A leaderboard sorted by score. (e) Unique items in insertion order.

<details>
<summary>Answer</summary>

- (a) `ArrayList` — `O(1)` index, amortized `O(1)` append.
- (b) `HashSet`.
- (c) `HashMap` — average `O(1)` lookup.
- (d) `TreeMap` / `TreeSet` — sorted, `O(log n)`.
- (e) `LinkedHashSet`.
- `LinkedList` — rarely the best; random access is `O(n)` and it is cache-unfriendly.

</details>

### Easy · The `remove(1)` surprise

```java
List<Integer> nums = new ArrayList<>(List.of(5, 7, 1));
nums.remove(1);
System.out.println(nums);
```

<details>
<summary>Answer</summary>

- Output — `[5, 1]`; `remove(int index)` was chosen, so the `7` at index 1 was removed, not the value `1`.
- Remove a value — `nums.remove(Integer.valueOf(1))` → `[5, 7]`.
- Lesson — both overloads match on a `List<Integer>`; write the intent explicitly.

</details>

### Medium · Generics invariance and PECS

You cannot pass a `List<Integer>` to `double sum(List<Number> nums)`. Why? What is the right signature, and what about a method that "adds"?

<details>
<summary>Answer</summary>

- Invariance — `List<Integer>` is not a subtype of `List<Number>`; otherwise the method could put a `Double` in it and corrupt the integer list.
- Read (producer) — `double sum(List<? extends Number> nums)`.
- Write (consumer) — `void fill(List<? super Integer> out)`.
- PECS — Producer Extends, Consumer Super.

</details>

### Medium · Multi-key sorting

Sort employees by department (A→Z), then salary (high→low), then name.

<details>
<summary>Answer</summary>

```java
employees.sort(
    Comparator.comparing(Employee::department)
        .thenComparing(Employee::salary, Comparator.reverseOrder())
        .thenComparing(Employee::name));
```

- `reverseOrder()` only on the salary key; if you put `.reversed()` on the whole chain, everything is reversed.
- Nulls — `Comparator.nullsLast(...)` if the field can be null.
- `List.sort` is stable — equal elements keep their relative order.

</details>

### Hard · Unmodifiable view vs copy

```java
List<String> base = new ArrayList<>(List.of("a"));
List<String> view = Collections.unmodifiableList(base);
List<String> copy = List.copyOf(base);
base.add("b");
System.out.println(view + " " + copy);
view.add("c");
```

<details>
<summary>Answer</summary>

- Print — `[a, b] [a]`.
- `view` — a read-only wrapper; changes to the backing list show through.
- `copy` — an independent immutable snapshot (nulls not allowed).
- Last line — `UnsupportedOperationException`.
- Use — to expose an internal list from a class, a snapshot (`List.copyOf`) is safer; use a view when you want a live read-only window.

</details>

## Sources — further reading

- [Oracle unmodifiable collections](https://docs.oracle.com/en/java/javase/21/core/creating-immutable-lists-sets-and-maps.html)

- [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html)

- [Generics tutorial](https://dev.java/learn/generics/)
- [Source — Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List))
- [Collections framework](https://dev.java/learn/api/collections-framework/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/08-collections-generics.md)
