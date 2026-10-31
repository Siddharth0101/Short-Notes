---
id: java-type-metadata
title: Java type modeling — enums, sealed types aur annotations
track: java
order: 17
level: Intermediate
minutes: 3
summary: Enum — fixed named values aur associated behavior.
tags: enums, sealed, records, annotations, reflection
---

## Quick revision

> Revision target — Closed choices aur runtime metadata ko stable external contracts ke saath model karo.

- Enum — fixed named values aur associated behavior.
- Annotation — metadata; behavior framework/tool interpret karta hai.
- Retention — SOURCE, CLASS, RUNTIME se metadata availability decide hoti hai.
- Reflection — runtime types/members inspect; access aur maintenance cost socho.
- Type erasure — most generic type arguments runtime objects par directly available nahi.
- Sealed type — permitted subtypes restrict karta hai.
- Pattern matching — type test aur extraction ko readable banata hai.
- Enum comparison — same enum type ke constants == se safely compare kar sakte ho.
- Annotation target — metadata kin declarations/type uses par allowed hai, Target se define.
- Reflection failure — missing member/access error handle; string-based coupling refactor mein toot sakti hai.

### Edge cases aur reasoning

- Enum persistence — ordinal reorder se stored meaning badal sakta hai; stable named/code mapping aur unknown-version policy rakho.
- Sealed evolution — new permitted subtype consumer exhaustiveness/serialization ko affect; versioned public contract ka compatibility test karo.
- Reflection boundary — modules/access policy private member access block kar sakti hai; reflection ko unrestricted bypass assume mat karo.

## Example se samjho

- Scenario — Order status PENDING ka stored code `pending` hai; codebase mein enum constants ka display order badalta hai.
- Reasoning — Explicit code mapping se old record ab bhi PENDING resolve hoga. Unknown code par documented reject/fallback choose karo.
- Catch — Ordinal0 ko durable meaning maanoge toh reorder stored data ka meaning badal sakta hai; type safety schema compatibility ki replacement nahi.

## Recall aur practice

- Sawal — Enum ordinal database mein save karke constants reorder karne ka risk?
- Jawaab — Purana number naya constant represent kar sakta; stable external code aur explicit migration safer contract hai.
- Khud try karo — Order status enum ko stable code se map karo; unknown persisted code reject/recover aur allowed status transitions verify karo.

## Practice questions

### Easy · Enum ka `valueOf`

```java
enum Status { ACTIVE, BLOCKED }
Status s = Status.valueOf("active");
```

<details>
<summary>Answer</summary>

- Result — `IllegalArgumentException: No enum constant Status.active`; case-sensitive exact match.
- Safe parse — input normalize karo (`toUpperCase(Locale.ROOT)`) aur exception handle karke clear validation error do.
- Compare — enums `==` se compare karna safe hai (singleton constants).

</details>

### Easy · Enum ka `ordinal()` DB mein save karna

<details>
<summary>Answer</summary>

- Problem — beech mein naya constant add/reorder karne par purane rows ka meaning badal jaata hai (`1` ab doosra status).
- Fix — `name()` store karo, ya explicit stable code field (`enum Status { ACTIVE("A") ... }`).
- JPA — `@Enumerated(EnumType.STRING)`; default `ORDINAL` risky hai.

</details>

### Medium · Sealed types + exhaustive switch

`Shape` ke sirf `Circle` aur `Square` hone chahiye aur area calculation mein koi case miss na ho.

<details>
<summary>Answer</summary>

```java
sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

static double area(Shape shape) {
    return switch (shape) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Square s -> s.side() * s.side();
    };
}
```

- Exhaustive — `default` ki zaroorat nahi; naya `Triangle` permit karoge toh compiler har aisi switch par error dega.
- Record patterns — `case Circle(double r) ->` se direct destructure (Java 21+).

</details>

### Medium · Annotation reflection mein nahi dikh rahi

```java
@interface Audited {}
@Audited class Payment {}
System.out.println(Payment.class.isAnnotationPresent(Audited.class));
```

<details>
<summary>Answer</summary>

- Output — `false`.
- Kyun — default retention `CLASS`; annotation class file mein hai par runtime reflection ko nahi milti.
- Fix — `@Retention(RetentionPolicy.RUNTIME)` aur sahi `@Target(ElementType.TYPE)`.

</details>

### Hard · Type erasure ki limits

Yeh teeno kyun compile nahi hote, aur workaround?

```java
void save(List<String> names) {}
void save(List<Integer> ids) {}          // 1
<T> T create() { return new T(); }       // 2
if (obj instanceof List<String>) {}       // 3 (obj: Object)
```

<details>
<summary>Answer</summary>

- 1 — dono methods ka erasure `save(List)` same → name clash. Alag naam do.
- 2 — runtime par `T` ka type pata nahi; `Class<T> type` pass karo aur `type.getDeclaredConstructor().newInstance()`, ya `Supplier<T>`.
- 3 — generic type argument runtime par check nahi hota; `instanceof List<?>` allowed hai, elements alag se check karo.
- Lesson — generics compile-time safety hai; runtime par sirf raw class bachti hai.

</details>

## Sources — aur padhne ke liye

- [Records](https://dev.java/learn/records/)
- [annotations](https://dev.java/learn/annotations/)
- [sealed classes](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/17-type-metadata.md)
