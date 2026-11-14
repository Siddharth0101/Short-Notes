---
id: java-object-model
title: Objects OOP records and equality
track: java
order: 7
level: Foundation
minutes: 3
summary: Inheritance — a subclass extends the behaviour of its superclass.
tags: oop, records, equality, interfaces
---

## Quick revision

> Revision target — Connect object identity, value equality and polymorphism to concrete collections behaviour.

- Inheritance — a subclass extends the behaviour of its superclass.
- Overriding — redefines a compatible method; dispatch is by the runtime object.
- Overloading — compile-time selection by the argument types/list.
- Composition — a has-a relation; delegate the behaviour.
- `equals`/`hashCode` — equal objects must have equal hash codes.
- Mutable map key — if a hash-relevant field changes, the lookup can break.
- Record — a data carrier; referenced mutable objects are not deeply immutable.
- Defensive copy — do not share mutable input/output when you need immutability.
- Equality contract — keep the behaviour reflexive, symmetric, transitive and consistent.
- Final class — cannot be subclassed; the data of an existing instance is not automatically immutable.
- Object copy — the nested references of a shallow clone/copy can be shared.

### Type relationships

- Upcast — a child through a parent reference; the overridden method comes from the runtime type.
- Downcast — it needs an actually compatible subtype; otherwise ClassCastException.
- Anonymous class — an inline unnamed implementation; a lambda is only for a functional interface.
- Nested class — a static nested class needs no outer instance; an inner class is linked to an outer instance.

### Edge cases and reasoning

- Record snapshot — a record's component list can be mutable; List.copyOf in the compact constructor can protect ownership.
- Hash contract direction — equal implies the same hash; the same hash does not prove equal, collisions are expected.
- Override restrictions — an overriding method cannot reduce visibility; it cannot make checked exceptions broader than the superclass contract.

## Understand it with an example

- Scenario — Two separately created `UserId("u7")` values represent the same logical user; you add both to a HashSet.
- Reasoning — With a compatible equals/hashCode implementation the set size stays one. With default identity equality the size can be two.
- Catch — If you mutate equality/hash fields after insertion, the lookup can become unreliable; choose a stable identity value.

## Recall and practice

- Question — If two unequal objects have the same hashCode, is the contract violated?
- Answer — No; a collision is allowed. The contract breaks when equal objects have different hash codes.
- Try it yourself — Implement immutable UserId equality; show separate traces for HashSet dedupe, a HashMap lookup and a mutable-field key failure.

## Practice questions

### Easy · Overriding vs overloading dispatch

```java
class Animal { String sound() { return "..."; } }
class Dog extends Animal { @Override String sound() { return "woof"; } }
static String describe(Animal a) { return "animal"; }
static String describe(Dog d) { return "dog"; }

Animal pet = new Dog();
System.out.println(pet.sound() + " " + describe(pet));
```

<details>
<summary>Answer</summary>

- Output — `woof animal`.
- Overriding — the runtime object (`Dog`) decides → dynamic dispatch.
- Overloading — the compile-time static type (`Animal`) decides.

</details>

### Medium · `equals` overridden, `hashCode` not

```java
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof Point p && p.x == x && p.y == y;
    }
}
Set<Point> set = new HashSet<>(List.of(new Point(1, 2)));
System.out.println(set.contains(new Point(1, 2)));
```

<details>
<summary>Answer</summary>

- Output — most likely `false`.
- Why — `HashSet` chooses the bucket by `hashCode` first; the default identity hash differs, so it never even reaches `equals`.
- Contract — equal objects must have the same `hashCode`. Fix: `Objects.hash(x, y)` or `record Point(int x, int y)`.

</details>

### Medium · A mutable key in a HashMap

```java
List<String> key = new ArrayList<>(List.of("a"));
Map<List<String>, Integer> map = new HashMap<>();
map.put(key, 1);
key.add("b");
System.out.println(map.get(key) + " " + map.size());
```

<details>
<summary>Answer</summary>

- Output — `null 1`.
- Why — the key's `hashCode` changed after the put; the entry is stuck in the old bucket.
- Rule — keep map keys immutable (`List.copyOf`, records with immutable fields, String).

</details>

### Medium · Records and the defensive copy

```java
record Team(String name, List<String> members) {}
List<String> list = new ArrayList<>(List.of("A"));
Team t = new Team("X", list);
list.add("B");
System.out.println(t.members());
```

<details>
<summary>Answer</summary>

- Output — `[A, B]`; a record is shallowly immutable, and the list is the same reference.
- Fix — a compact constructor: `public Team { members = List.copyOf(members); }`.
- Now `t.members().add(...)` throws `UnsupportedOperationException` too.

</details>

### Hard · Correct `equals`/`hashCode` for `Employee`

`Employee(id, email)`: two employees are equal when the `id` is the same and the email is the same case-insensitively. The implementation and the pitfalls?

<details>
<summary>Answer</summary>

```java
final class Employee {
    private final long id;
    private final String email;
    Employee(long id, String email) {
        this.id = id;
        this.email = email.toLowerCase(Locale.ROOT); // normalize once
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee other)) return false;
        return id == other.id && email.equals(other.email);
    }
    @Override public int hashCode() { return Objects.hash(id, email); }
}
```

- Normalize in constructor — both `equals` and `hashCode` must use the same normalized value; otherwise a case-insensitive `equals` + a case-sensitive `hashCode` breaks the contract.
- `Locale.ROOT` — protects against `toLowerCase` surprises in cases such as the Turkish locale.
- `final class` — so that a subclass with extra fields cannot break symmetry.

</details>

## Sources — further reading

- [Object API contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Records](https://dev.java/learn/records/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/07-object-model.md)
