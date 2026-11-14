---
id: java-type-metadata
title: Java type modeling — enums, sealed types and annotations
track: java
order: 17
level: Intermediate
minutes: 3
summary: Enum — fixed named values and their associated behaviour.
tags: enums, sealed, records, annotations, reflection
---

## Quick revision

> Revision target — Model closed choices and runtime metadata with stable external contracts.

- Enum — fixed named values and their associated behaviour.
- Annotation — metadata; a framework/tool interprets the behaviour.
- Retention — SOURCE, CLASS, RUNTIME decide where the metadata is available.
- Reflection — inspects types/members at runtime; think about the access and maintenance cost.
- Type erasure — most generic type arguments are not directly available on runtime objects.
- Sealed type — restricts the permitted subtypes.
- Pattern matching — makes a type test and extraction readable.
- Enum comparison — constants of the same enum type can be compared safely with ==.
- Annotation target — Target defines which declarations/type uses the metadata is allowed on.
- Reflection failure — handle a missing member/access error; string-based coupling can break in a refactor.

### Edge cases and reasoning

- Enum persistence — an ordinal reorder can change the stored meaning; keep a stable name/code mapping and an unknown-version policy.
- Sealed evolution — a new permitted subtype affects consumer exhaustiveness/serialization; test the compatibility of a versioned public contract.
- Reflection boundary — modules/access policy can block private member access; do not assume reflection is an unrestricted bypass.

## Understand it with an example

- Scenario — The stored code of order status PENDING is `pending`; the display order of the enum constants changes in the codebase.
- Reasoning — With an explicit code mapping an old record still resolves to PENDING. Choose a documented reject/fallback for an unknown code.
- Catch — If you treat ordinal0 as a durable meaning, a reorder can change the meaning of stored data; type safety is not a replacement for schema compatibility.

## Recall and practice

- Question — What is the risk of saving the enum ordinal in the database and then reordering the constants?
- Answer — The old number can represent a new constant; a stable external code and an explicit migration are the safer contract.
- Try it yourself — Map an order status enum to a stable code; verify reject/recover for an unknown persisted code and the allowed status transitions.

## Practice questions

### Easy · `valueOf` on an enum

```java
enum Status { ACTIVE, BLOCKED }
Status s = Status.valueOf("active");
```

<details>
<summary>Answer</summary>

- Result — `IllegalArgumentException: No enum constant Status.active`; a case-sensitive exact match.
- Safe parse — normalize the input (`toUpperCase(Locale.ROOT)`) and handle the exception to give a clear validation error.
- Compare — comparing enums with `==` is safe (singleton constants).

</details>

### Easy · Saving an enum's `ordinal()` in the DB

<details>
<summary>Answer</summary>

- Problem — adding a new constant in the middle/reordering changes the meaning of old rows (`1` is now a different status).
- Fix — store `name()`, or an explicit stable code field (`enum Status { ACTIVE("A") ... }`).
- JPA — `@Enumerated(EnumType.STRING)`; the default `ORDINAL` is risky.

</details>

### Medium · Sealed types + an exhaustive switch

`Shape` should have only `Circle` and `Square`, and the area calculation must not miss a case.

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

- Exhaustive — no need for a `default`; if you permit a new `Triangle`, the compiler raises an error at every such switch.
- Record patterns — destructure directly with `case Circle(double r) ->` (Java 21+).

</details>

### Medium · An annotation is not visible to reflection

```java
@interface Audited {}
@Audited class Payment {}
System.out.println(Payment.class.isAnnotationPresent(Audited.class));
```

<details>
<summary>Answer</summary>

- Output — `false`.
- Why — the default retention is `CLASS`; the annotation is in the class file but runtime reflection does not get it.
- Fix — `@Retention(RetentionPolicy.RUNTIME)` and the right `@Target(ElementType.TYPE)`.

</details>

### Hard · The limits of type erasure

Why do none of these three compile, and what is the workaround?

```java
void save(List<String> names) {}
void save(List<Integer> ids) {}          // 1
<T> T create() { return new T(); }       // 2
if (obj instanceof List<String>) {}       // 3 (obj: Object)
```

<details>
<summary>Answer</summary>

- 1 — the erasure of both methods is the same `save(List)` → a name clash. Give them different names.
- 2 — the type of `T` is not known at runtime; pass a `Class<T> type` and call `type.getDeclaredConstructor().newInstance()`, or use a `Supplier<T>`.
- 3 — a generic type argument is not checked at runtime; `instanceof List<?>` is allowed, so check the elements separately.
- Lesson — generics are compile-time safety; only the raw class survives at runtime.

</details>

## Sources — further reading

- [Records](https://dev.java/learn/records/)
- [annotations](https://dev.java/learn/annotations/)
- [sealed classes](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/17-type-metadata.md)
