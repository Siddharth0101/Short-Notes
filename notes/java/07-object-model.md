---
id: java-object-model
title: Objects OOP records and equality
track: java
order: 7
level: Foundation
minutes: 3
summary: Inheritance — subclass superclass ka behavior extend karti hai.
tags: oop, records, equality, interfaces
---

## Quick revision

> Revision target — Object identity, value equality aur polymorphism ko concrete collections behavior se connect karo.

- Inheritance — subclass superclass ka behavior extend karti hai.
- Overriding — compatible method redefine; runtime object se dispatch.
- Overloading — argument types/list se compile-time selection.
- Composition — has-a relation; behavior delegate karo.
- `equals`/`hashCode` — equal objects ke hash codes equal hone chahiye.
- Mutable map key — hash-relevant field badla toh lookup toot sakta hai.
- Record — data carrier; referenced mutable objects deep-immutable nahi hote.
- Defensive copy — mutable input/output share na karo jab immutability chahiye.
- Equality contract — reflexive, symmetric, transitive aur consistent behavior rakho.
- Final class — subclass nahi ban sakti; existing instance data automatically immutable nahi.
- Object copy — shallow clone/copy ke nested references shared ho sakte hain.

### Type relationships

- Upcast — child ko parent reference; overridden method runtime type se.
- Downcast — actual compatible subtype chahiye; warna ClassCastException.
- Anonymous class — inline unnamed implementation; lambda sirf functional interface ke liye.
- Nested class — static nested ko outer instance nahi; inner class outer instance se linked.

### Edge cases aur reasoning

- Record snapshot — record component list mutable ho sakti hai; compact constructor mein List.copyOf ownership protect kar sakta hai.
- Hash contract direction — equal implies same hash; same hash se equal prove nahi, collisions expected hain.
- Override restrictions — overriding method visibility reduce nahi; checked exceptions superclass contract se broader nahi kar sakta.

## Example se samjho

- Scenario — Do separately created `UserId("u7")` values same logical user represent karti hain; HashSet mein dono add karte ho.
- Reasoning — Compatible equals/hashCode implementation par set size one rahega. Default identity equality par size two ho sakta hai.
- Catch — Insertion ke baad equality/hash fields mutate karoge toh lookup unreliable ho sakta hai; stable identity value choose karo.

## Recall aur practice

- Sawal — Do unequal objects ka hashCode same aaye toh contract violated hai?
- Jawaab — Nahi; collision allowed. Equal objects ke hash codes different hon toh contract break hota hai.
- Khud try karo — Immutable UserId equality implement karo; HashSet dedupe, HashMap lookup aur mutable-field key failure ka separate trace dikhao.

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
- Overriding — runtime object (`Dog`) decide karta hai → dynamic dispatch.
- Overloading — compile-time static type (`Animal`) decide karta hai.

</details>

### Medium · `equals` override, `hashCode` nahi

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
- Kyun — `HashSet` pehle `hashCode` se bucket choose karta hai; default identity hash alag hai, isliye `equals` tak pahunchta hi nahi.
- Contract — equal objects ka `hashCode` same hona chahiye. Fix: `Objects.hash(x, y)` ya `record Point(int x, int y)`.

</details>

### Medium · Mutable key HashMap mein

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
- Kyun — key ka `hashCode` put ke baad badal gaya; entry purane bucket mein phansi hai.
- Rule — map keys immutable rakho (`List.copyOf`, records with immutable fields, String).

</details>

### Medium · Record aur defensive copy

```java
record Team(String name, List<String> members) {}
List<String> list = new ArrayList<>(List.of("A"));
Team t = new Team("X", list);
list.add("B");
System.out.println(t.members());
```

<details>
<summary>Answer</summary>

- Output — `[A, B]`; record shallowly immutable hai, list same reference hai.
- Fix — compact constructor: `public Team { members = List.copyOf(members); }`.
- Ab `t.members().add(...)` bhi `UnsupportedOperationException` deta hai.

</details>

### Hard · `Employee` ke liye correct `equals`/`hashCode`

`Employee(id, email)`: do employees equal jab `id` same ho aur email case-insensitive same. Implementation aur pitfalls?

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

- Normalize in constructor — `equals` aur `hashCode` dono same normalized value use karein; warna case-insensitive `equals` + case-sensitive `hashCode` contract todta.
- `Locale.ROOT` — Turkish locale jaise cases mein `toLowerCase` surprise se bachata hai.
- `final class` — subclass extra fields ke saath symmetry na tode.

</details>

## Sources — aur padhne ke liye

- [Object API contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Records](https://dev.java/learn/records/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/07-object-model.md)
