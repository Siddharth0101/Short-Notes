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

> Revision target — Access pattern se collection choose karo aur view, copy, order ke contracts distinguish karo.

- List — ordered, duplicates allowed; Set — unique; Map — key/value pairs.
- ArrayList — indexed access fast; middle insert/delete shifting maangta hai.
- LinkedList — node operations useful; random access O(n).
- HashMap — expected O(1) lookup; thread-safe nahi.
- TreeMap — sorted keys; operations O(log n).
- Generics — compile-time type safety; raw types se bacho.
- PECS — producer `extends`, consumer `super`.
- Comparator — consistent ordering define; subtraction overflow se bacho.
- Concurrent collection — thread-safe operations; multi-step invariants phir bhi design karo.
- Iterator remove — supported iterator ka remove safe traversal deletion ke liye use karo.
- Unmodifiable view — writes block, underlying collection ke external changes phir bhi dikh sakte hain.
- Generic invariance — `List<Integer>` ko `List<Number>` assign nahi kar sakte.

### Ordering aur generic bounds

- Comparable — type ka natural order compareTo; Comparator external/custom ordering deta hai.
- Generic bound — `<T extends Number>` accepted type constrain; wildcard ? unknown compatible type represent karta hai.

### Concurrent collections

- ConcurrentHashMap — concurrent reads/writes support; multiple calls ko ek atomic transaction assume mat karo.
- CopyOnWriteArrayList — updates array copy karte hain; reads bahut zyada aur writes rare hon tab useful.
- Weakly consistent iterator — concurrent changes tolerate; exact point-in-time snapshot assume mat karo.

### Edge cases aur reasoning

- List.copyOf boundary — unmodifiable snapshot structure deta hai, null elements reject; contained mutable elements deep-copy nahi hote.
- Removal overload — List<Integer>.remove(1) index remove; remove(Integer.valueOf(1)) value remove karta hai.
- Ordering equality — sorted sets/maps comparator zero ko same key maante; equals se inconsistent ordering surprise de sakti hai.

## Research notes: A read-only view is not an immutable snapshot

- Wrapper apne interface se changes rokta hai, lekin backing list change hogi toh view mein woh change dikhega.

## Example se samjho

- Scenario — Original list `[A, B]` ki unmodifiable view aur `List.copyOf` snapshot banao; phir original mein C add karo.
- Reasoning — View `[A, B, C]` dikhati hai; snapshot structure `[A, B]` rehta hai. Dono ke through structural mutation blocked hai.
- Catch — Elements mutable objects hon toh snapshot bhi un objects ko deep-copy nahi karta; container immutability aur element immutability alag hain.

## Recall aur practice

- Sawal — List<Integer> [1,2,3] par remove(1) ke baad kya bachega?
- Jawaab — [1,3]; primitive int argument index overload select karta hai, value 1 remove karne ko Integer object do.
- Khud try karo — Original list, unmodifiable view aur copyOf compare karo; backing add aur element mutation ke visible effects predict karo.

## Practice questions

### Easy · Sahi collection choose karo

(a) Index se fast read, end mein add. (b) Unique tags, order matter nahi. (c) Username → user lookup. (d) Sorted leaderboard by score. (e) Insertion order wale unique items.

<details>
<summary>Answer</summary>

- (a) `ArrayList` — `O(1)` index, amortized `O(1)` append.
- (b) `HashSet`.
- (c) `HashMap` — average `O(1)` lookup.
- (d) `TreeMap` / `TreeSet` — sorted, `O(log n)`.
- (e) `LinkedHashSet`.
- `LinkedList` — rarely best; random access `O(n)` aur cache-unfriendly.

</details>

### Easy · `remove(1)` ka surprise

```java
List<Integer> nums = new ArrayList<>(List.of(5, 7, 1));
nums.remove(1);
System.out.println(nums);
```

<details>
<summary>Answer</summary>

- Output — `[5, 1]`; `remove(int index)` choose hua, isliye index 1 wala `7` hata, value `1` nahi.
- Value remove — `nums.remove(Integer.valueOf(1))` → `[5, 7]`.
- Lesson — `List<Integer>` par dono overloads match karte hain; intent explicit likho.

</details>

### Medium · Generics invariance aur PECS

`List<Integer>` ko `double sum(List<Number> nums)` mein pass nahi kar sakte. Kyun? Sahi signature kya hai, aur "add karne" wale method ka?

<details>
<summary>Answer</summary>

- Invariance — `List<Integer>` `List<Number>` ka subtype nahi; warna method usme `Double` daal deta aur integer list corrupt hoti.
- Read (producer) — `double sum(List<? extends Number> nums)`.
- Write (consumer) — `void fill(List<? super Integer> out)`.
- PECS — Producer Extends, Consumer Super.

</details>

### Medium · Multi-key sorting

Employees ko department (A→Z), phir salary (high→low), phir name se sort karo.

<details>
<summary>Answer</summary>

```java
employees.sort(
    Comparator.comparing(Employee::department)
        .thenComparing(Employee::salary, Comparator.reverseOrder())
        .thenComparing(Employee::name));
```

- `reverseOrder()` sirf salary key par; poore chain par `.reversed()` lagaoge toh sab ulta ho jaayega.
- Nulls — `Comparator.nullsLast(...)` agar field null ho sakta hai.
- `List.sort` stable hai — equal elements ka relative order same rehta hai.

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
- `view` — read-only wrapper; backing list ke changes dikhte hain.
- `copy` — independent immutable snapshot (nulls allowed nahi).
- Last line — `UnsupportedOperationException`.
- Use — class se internal list expose karni ho toh snapshot (`List.copyOf`) safer; live read-only window chahiye toh view.

</details>

## Sources — aur padhne ke liye

- [Oracle unmodifiable collections](https://docs.oracle.com/en/java/javase/21/core/creating-immutable-lists-sets-and-maps.html)

- [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html)

- [Generics tutorial](https://dev.java/learn/generics/)
- [Source — Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List))
- [Collections framework](https://dev.java/learn/api/collections-framework/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/08-collections-generics.md)
