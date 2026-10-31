---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 3
summary: Class — object ka type/behavior; object — actual instance.
tags: fundamentals, java, classes, constructors
---

## Quick revision

> Revision target — Object ke valid states, constructor ownership aur shared versus instance data alag karo.

- Class — object ka type/behavior; object — actual instance.
- Constructor — object initialize; return type nahi hota.
- `this` — current object; `this(...)` — same class ka constructor call.
- Instance field — har object ka data; static field — class-level shared data.
- Encapsulation — fields private rakho, methods se valid changes karao.
- Constructor rule — invalid input par invalid object banne se pehle fail karo.
- Default constructor — khud constructor likhne par auto no-arg constructor nahi milta.
- Constructor chaining — this(...) se shared initialization; constructor cycle allowed nahi.
- Object alias — same reference share ho toh mutation dono callers ko dikh sakti hai.
- Static counter — all instances share karte hain; concurrent updates coordinate karo.

### Constructor behavior

- `super` — superclass member/constructor access; overridden method ko explicit call.
- Initializer — field/block initialization constructor lifecycle ka part.

### Class members

- Static dispatch — static method class/reference type se select; instance overriding jaisa dispatch nahi.

### Edge cases aur reasoning

- Safe construction — constructor se this publish ya overridable method call avoid; subclass/state fully initialized nahi ho sakti.
- Defensive ownership — mutable collection constructor mein receive karo toh owned copy lo; external mutation invariant ko bypass na kare.
- Final field limit — final reference reassign nahi hota; referenced collection ke contents ab bhi mutable ho sakte hain.

## Example se samjho

- Scenario — BankAccount balance constructor mein nonnegative hona chahiye; withdraw amount positive aur available balance ke andar hona chahiye.
- Reasoning — Constructor invalid opening balance reject kare; withdraw validate karke state badle. Private field direct invalid assignment ko public API se rokta hai.
- Catch — Sirf getter/setter banana encapsulation ka goal nahi; setter agar negative balance allow kare toh business invariant phir bhi tootega.

## Recall aur practice

- Sawal — private final List<String> field automatically immutable object banata hai?
- Jawaab — Nahi; reference fixed hai, list mutable ho sakti hai. Defensive copy aur controlled exposure chahiye.
- Khud try karo — Course class banao; external list modification internal students ko na badle, invalid student reject aur instances independent verify karo.

## Practice questions

### Easy · Default constructor gayab

```java
class Person {
    String name;
    Person(String name) { this.name = name; }
}
Person p = new Person();
```

<details>
<summary>Answer</summary>

- Result — compile error: constructor `Person()` not found.
- Rule — compiler default no-arg constructor tabhi deta hai jab tum koi constructor na likho.
- Fix — explicitly `Person() { this("Unknown"); }` add karo (agar sensible default ho).

</details>

### Easy · `this` bhool gaye

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
- Kyun — parameter `name` field ko shadow karta hai; `name = name` parameter ko khud par assign karta hai.
- Fix — `this.name = name;` (IDE warning "assignment to itself" deta hai).

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
- `static count` — class-level, saare objects share karte hain.
- `id` — har object ka apna; yeh unique id pattern sirf single-threaded mein safe (multi-thread ke liye `AtomicInteger`).

</details>

### Medium · Constructor mein list store karna

```java
class Course {
    private final List<String> students;
    Course(List<String> students) { this.students = students; }
    List<String> getStudents() { return students; }
}
```

Caller baad mein apni list badle toh kya hoga? Fix?

<details>
<summary>Answer</summary>

- Problem — `Course` aur caller same list share karte hain; `final` sirf reference lock karta hai, contents nahi. Getter se bhi koi `add` kar sakta hai.
- Fix — `this.students = List.copyOf(students);` (immutable copy, nulls reject) aur getter wahi return kare.
- Rule — mutable input/output par defensive copy jab class invariants own karti ho.

</details>

### Hard · Immutable `Money`

`Money(amount, currency)` design karo: negative allowed nahi, currency mandatory, `plus` same currency mein naya object de, equality amount ke scale se independent ho.

<details>
<summary>Answer</summary>

```java
public record Money(BigDecimal amount, String currency) {
    public Money {
        Objects.requireNonNull(currency, "currency");
        if (amount == null || amount.signum() < 0) throw new IllegalArgumentException("amount >= 0");
        amount = amount.setScale(2, RoundingMode.HALF_EVEN); // 10 aur 10.00 equal
    }
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("currency mismatch");
        return new Money(amount.add(other.amount), currency);
    }
}
```

- Record — final fields, `equals/hashCode/toString` free; compact constructor validation + normalization.
- Scale normalize — warna `BigDecimal("10").equals(new BigDecimal("10.00"))` false hota.
- Immutable — operations naya object return karte hain; thread-safe sharing.

</details>

## Sources — aur padhne ke liye

- [Dev.java classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/04-java-classes-constructors.md)
