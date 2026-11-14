---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 3
summary: Class — the type and behaviour of an object; object — an actual instance.
tags: fundamentals, java, classes, constructors
---

## Quick revision

> Revision target — Separate an object's valid states, constructor ownership and shared versus instance data.

- Class — the type/behaviour of an object; object — an actual instance.
- Constructor — initializes the object; it has no return type.
- `this` — the current object; `this(...)` — calls a constructor of the same class.
- Instance field — the data of each object; static field — class-level shared data.
- Encapsulation — keep fields private and make valid changes through methods.
- Constructor rule — on invalid input, fail before an invalid object is created.
- Default constructor — once you write a constructor yourself, you no longer get the automatic no-arg constructor.
- Constructor chaining — shared initialization through this(...); a constructor cycle is not allowed.
- Object alias — when the same reference is shared, a mutation can be visible to both callers.
- Static counter — all instances share it; coordinate concurrent updates.

### Constructor behavior

- `super` — accesses a superclass member/constructor; an explicit call to an overridden method.
- Initializer — field/block initialization is part of the constructor lifecycle.

### Class members

- Static dispatch — a static method is selected by the class/reference type; not dispatched like instance overriding.

### Edge cases and reasoning

- Safe construction — avoid publishing this or calling an overridable method from a constructor; the subclass/state may not be fully initialized.
- Defensive ownership — if you receive a mutable collection in a constructor, take an owned copy; external mutation must not bypass the invariant.
- Final field limit — a final reference cannot be reassigned; the contents of the referenced collection can still be mutable.

## Understand it with an example

- Scenario — A BankAccount balance must be nonnegative in the constructor; a withdraw amount must be positive and within the available balance.
- Reasoning — The constructor should reject an invalid opening balance; withdraw should validate and then change state. A private field stops a direct invalid assignment through the public API.
- Catch — Merely writing a getter/setter is not the goal of encapsulation; if the setter allows a negative balance, the business invariant still breaks.

## Recall and practice

- Question — Does a private final List<String> field automatically make an immutable object?
- Answer — No; the reference is fixed but the list can be mutable. You need a defensive copy and controlled exposure.
- Try it yourself — Build a Course class; verify that external list modification does not change the internal students, an invalid student is rejected and instances are independent.

## Practice questions

### Easy · The default constructor is gone

```java
class Person {
    String name;
    Person(String name) { this.name = name; }
}
Person p = new Person();
```

<details>
<summary>Answer</summary>

- Result — a compile error: constructor `Person()` not found.
- Rule — the compiler provides a default no-arg constructor only when you write no constructor at all.
- Fix — explicitly add `Person() { this("Unknown"); }` (if there is a sensible default).

</details>

### Easy · Forgot `this`

```java
class User {
    String name;
    User(String name) { name = name; }
}
System.out.println(new User("Asha").name);
```

<details>
<summary>Answer</summary>

- Output — `null`.
- Why — the parameter `name` shadows the field; `name = name` assigns the parameter to itself.
- Fix — `this.name = name;` (the IDE warns "assignment to itself").

</details>

### Medium · Static vs instance counter

```java
class Ticket {
    static int count = 0;
    int id;
    Ticket() { count++; id = count; }
}
new Ticket();
Ticket t = new Ticket();
System.out.println(t.id + " " + Ticket.count);
```

<details>
<summary>Answer</summary>

- Output — `2 2`.
- `static count` — class-level, shared by all objects.
- `id` — each object's own; this unique id pattern is safe only single-threaded (`AtomicInteger` for multi-thread).

</details>

### Medium · Storing a list in a constructor

```java
class Course {
    private final List<String> students;
    Course(List<String> students) { this.students = students; }
    List<String> getStudents() { return students; }
}
```

What happens if the caller changes their list later? The fix?

<details>
<summary>Answer</summary>

- Problem — `Course` and the caller share the same list; `final` locks only the reference, not the contents. Anyone can `add` through the getter too.
- Fix — `this.students = List.copyOf(students);` (an immutable copy, rejects nulls) and the getter returns that.
- Rule — a defensive copy on mutable input/output when the class owns invariants.

</details>

### Hard · Immutable `Money`

Design `Money(amount, currency)`: no negatives allowed, the currency is mandatory, `plus` returns a new object in the same currency, and equality is independent of the amount's scale.

<details>
<summary>Answer</summary>

```java
public record Money(BigDecimal amount, String currency) {
    public Money {
        Objects.requireNonNull(currency, "currency");
        if (amount == null || amount.signum() < 0) throw new IllegalArgumentException("amount >= 0");
        amount = amount.setScale(2, RoundingMode.HALF_EVEN); // 10 and 10.00 are equal
    }
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("currency mismatch");
        return new Money(amount.add(other.amount), currency);
    }
}
```

- Record — final fields, `equals/hashCode/toString` for free; compact constructor validation + normalization.
- Scale normalize — otherwise `BigDecimal("10").equals(new BigDecimal("10.00"))` would be false.
- Immutable — operations return a new object; thread-safe sharing.

</details>

## Sources — further reading

- [Dev.java classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/04-java-classes-constructors.md)
