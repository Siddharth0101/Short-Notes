---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 2
summary: Package — a namespace for related classes.
tags: packages, interfaces, encapsulation
---

## Quick revision

> Revision target — Give the caller a stable contract and keep the details of a replaceable implementation inside the boundary.

- Package — a namespace for related classes.
- Access — private: the class; package-private: the package; public: the visible API.
- Protected — package access plus inheritance rules; not blanket public access.
- Interface — a behaviour contract; you can implement multiple interfaces.
- Abstract class — shared state/implementation plus abstract methods.
- Dependency inversion — depend on the contract instead of the concrete implementation.
- Default method — an interface can provide an implementation; conflicts have to be resolved.
- Interface static method — called through the interface name; it does not behave like instance inheritance.
- Import — resolves the short name; it does not create an object at runtime.
- Package-private API — shrink the public surface by keeping the implementation inside the package.

### Edge cases and reasoning

- Interface conflict — if the same default method is inherited from unrelated interfaces, the class needs an explicit resolution/override.
- API visibility — exposing an inaccessible implementation type in a public class's signature complicates the usable contract.
- Substitution contract — an interface implementation must not unexpectedly tighten the input restrictions/failure promises.

## Understand it with an example

- Scenario — Checkout needs a `PaymentGateway`; the real gateway is injected in production and a deterministic fake in tests.
- Reasoning — Checkout handles the agreed success/failure result. When the provider is replaced, checkout's business rules can stay the same.
- Catch — An interface is not only method names: the implementations must also follow the contract for a timeout, a rejection and a duplicate payment consistently.

## Recall and practice

- Question — If two interfaces provide the same default method, will Java pick an arbitrary winner?
- Answer — Resolve a conflict of unrelated defaults with an explicit override; understand the class/inheritance precedence rule separately.
- Try it yourself — Build a PaymentGateway interface and a fake implementation; let the caller test success/failure without depending on a concrete provider.

## Practice questions

### Easy · Access modifiers

`private`, package-private (no keyword), `protected`, `public` — who is visible from where?

<details>
<summary>Answer</summary>

- `private` — the same class only.
- Package-private — classes of the same package.
- `protected` — the same package + subclasses in another package (through inheritance).
- `public` — everywhere (if the module exports it).
- Default rule — start with the least visibility; a public API becomes a contract.

</details>

### Easy · Interface or abstract class?

<details>
<summary>Answer</summary>

- Interface — a capability/contract; a class can implement several interfaces; no state (instance fields).
- Abstract class — shared state + a partial implementation; only one parent class.
- Rule — an interface for the public contract; an internal abstract base class for sharing common code.

</details>

### Medium · Default method conflict

```java
interface Camera { default String name() { return "camera"; } }
interface Phone { default String name() { return "phone"; } }
class SmartPhone implements Camera, Phone { }
```

<details>
<summary>Answer</summary>

- Result — a compile error: `SmartPhone` inherits unrelated defaults for `name()`.
- Fix — override it and choose/combine:

```java
public String name() { return Phone.super.name() + "+" + Camera.super.name(); }
```

- Rule — class method > more specific interface > explicit resolution.

</details>

### Medium · `protected` across packages

```java
package a;
public class Base { protected int x; }

package b;
public class Child extends a.Base {
    void f(a.Base other, Child sibling) {
        this.x = 1;
        sibling.x = 2;
        other.x = 3;
    }
}
```

Which line will not compile?

<details>
<summary>Answer</summary>

- `other.x = 3` — an error. In another package, a subclass can access a `protected` member only through a reference of its own type (`Child` or its subtypes).
- `this.x` and `sibling.x` — valid.
- Lesson — `protected` is not "all subclasses on every object"; it is subtle, so use it sparingly in an API.

</details>

### Hard · Dependency inversion refactor

```java
class OrderService {
    private final MySqlOrderRepo repo = new MySqlOrderRepo();
    void place(Order o) { repo.save(o); }
}
```

Make this testable and DB-independent.

<details>
<summary>Answer</summary>

```java
interface OrderRepository { void save(Order order); }

class OrderService {
    private final OrderRepository repo;
    OrderService(OrderRepository repo) { this.repo = Objects.requireNonNull(repo); }
    void place(Order order) { repo.save(order); }
}

// test
class InMemoryOrderRepo implements OrderRepository {
    final List<Order> saved = new ArrayList<>();
    public void save(Order order) { saved.add(order); }
}
```

- Inversion — the high-level `OrderService` depends on an abstraction; the MySQL detail is injected from outside.
- Test — a unit test without a DB, using an in-memory fake.
- Spring — this is exactly the constructor injection the container does automatically.

</details>

## Sources — further reading

- [Official reference yahan padho](https://dev.java/learn/packages/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/06-packages-interfaces.md)
