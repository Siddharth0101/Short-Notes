---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 2
summary: Package — related classes ka namespace.
tags: packages, interfaces, encapsulation
---

## Quick revision

> Revision target — Caller ko stable contract do aur replaceable implementation ki details boundary ke andar rakho.

- Package — related classes ka namespace.
- Access — private: class; package-private: package; public: visible API.
- Protected — package access plus inheritance rules; blanket public access nahi.
- Interface — behavior contract; multiple interfaces implement kar sakte ho.
- Abstract class — shared state/implementation plus abstract methods.
- Dependency inversion — concrete implementation ki jagah contract par depend karo.
- Default method — interface implementation de sakta hai; conflicts resolve karne padte hain.
- Interface static method — interface name se call; instance inheritance jaisa behavior nahi.
- Import — short name resolve karta hai; runtime object creation nahi.
- Package-private API — implementation ko package ke andar rakhkar public surface chhoti karo.

### Edge cases aur reasoning

- Interface conflict — unrelated interfaces ka same default method inherit ho toh class mein explicit resolution/override chahiye.
- API visibility — public class ke signature mein inaccessible implementation type dena usable contract complicate karta hai.
- Substitution contract — interface implementation input restrictions/failure promises ko unexpectedly tighten na kare.

## Example se samjho

- Scenario — Checkout ko `PaymentGateway` chahiye; production mein real gateway aur test mein deterministic fake inject hota hai.
- Reasoning — Checkout agreed success/failure result handle karta hai. Provider replacement par checkout ke business rules same reh sakte hain.
- Catch — Interface sirf method names nahi: timeout, rejection aur duplicate payment ka contract bhi implementations ko consistently follow karna hoga.

## Recall aur practice

- Sawal — Do interfaces same default method dein toh Java arbitrary winner choose karega?
- Jawaab — Unrelated defaults ka conflict explicitly override se resolve karo; class/inheritance precedence ka rule separately samjho.
- Khud try karo — PaymentGateway interface aur fake implementation banao; caller ko concrete provider dependency ke bina success/failure test karne do.

## Practice questions

### Easy · Access modifiers

`private`, package-private (no keyword), `protected`, `public` — kaun kahan se dikhta hai?

<details>
<summary>Answer</summary>

- `private` — sirf same class.
- Package-private — same package ki classes.
- `protected` — same package + doosre package ki subclasses (inheritance ke through).
- `public` — har jagah (module exports ho toh).
- Default rule — sabse kam visibility se shuru karo; public API ek contract ban jaata hai.

</details>

### Easy · Interface ya abstract class?

<details>
<summary>Answer</summary>

- Interface — capability/contract; class kai interfaces implement kar sakti hai; state (instance fields) nahi.
- Abstract class — shared state + partial implementation; sirf ek parent class.
- Rule — public contract ke liye interface; common code share karne ke liye internal abstract base class.

</details>

### Medium · Default method conflict

```java
interface Camera { default String name() { return "camera"; } }
interface Phone { default String name() { return "phone"; } }
class SmartPhone implements Camera, Phone { }
```

<details>
<summary>Answer</summary>

- Result — compile error: `SmartPhone` inherits unrelated defaults for `name()`.
- Fix — override karke choose/combine karo:

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

Kaunsi line compile nahi hogi?

<details>
<summary>Answer</summary>

- `other.x = 3` — error. Doosre package mein subclass `protected` member sirf apne type (`Child` ya uske subtypes) ke reference se access kar sakta hai.
- `this.x` aur `sibling.x` — valid.
- Lesson — `protected` "sab subclasses har object par" nahi; yeh subtle hai, isliye API mein kam use karo.

</details>

### Hard · Dependency inversion refactor

```java
class OrderService {
    private final MySqlOrderRepo repo = new MySqlOrderRepo();
    void place(Order o) { repo.save(o); }
}
```

Isse testable aur DB-independent banao.

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

- Inversion — high-level `OrderService` abstraction par depend karta hai; MySQL detail bahar inject hoti hai.
- Test — in-memory fake se bina DB unit test.
- Spring — yahi constructor injection hai jo container automatically karta hai.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://dev.java/learn/packages/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/06-packages-interfaces.md)
