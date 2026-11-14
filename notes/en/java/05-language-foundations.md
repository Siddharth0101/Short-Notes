---
id: java-language-foundations
title: Java foundations review and conversion edge cases
track: java
order: 5
level: Foundation
minutes: 3
summary: Primitive types — byte, short, int, long, float, double, char, boolean.
tags: types, casting, strings, arrays
visual: java-memory
---

## Quick revision

> Revision target — Predict the result of equality, numeric range and conversion by looking at the type.

- Primitive types — byte, short, int, long, float, double, char, boolean.
- Wrapper — the object type of a primitive; unboxing null throws `NullPointerException`.
- String — immutable; use `.equals()` to compare content.
- `==` — compares the value of primitives, the reference identity of objects.
- `StringBuilder` — a mutable buffer for repeated string building.
- Overflow — integer arithmetic can wrap; use checked math/range validation.
- Casting — narrowing can lose data; do not cast blindly.
- `final` — the variable cannot be reassigned; the object is not automatically immutable.
- Autoboxing — converts a primitive to its wrapper; do not treat wrapper identity as numeric equality.
- BigDecimal — decimal arithmetic; keep precision/scale/rounding explicit.
- Char — a UTF-16 code unit; an emoji is not guaranteed to fit in one char.

### String behavior

- String pool — literals can be reused; use `.equals()` for content equality.
- StringBuffer — a synchronized mutable buffer; StringBuilder is unsynchronized.

### Edge cases and reasoning

- Decimal construction — BigDecimal("0.1") preserves the intended decimal; new BigDecimal(0.1) captures the binary floating approximation.
- Decimal equality — BigDecimal equals compares value+scale; compareTo is numeric ordering, so 2.0/2.00 behave differently for equality.
- Checked arithmetic — Math.addExact/multiplyExact throw on overflow; convert to long before the arithmetic when you need the larger range.

## Understand it with an example

- Scenario — In `int price = 1_500_000_000; long total = price * 2;` the total can be wrong even though the destination is a long.
- Reasoning — The multiplication happens in int and overflows first. `(long) price * 2` gives `3000000000` in long arithmetic.
- Catch — A cast after the result is assigned does not restore lost information; change the operand type before the operation or choose checked arithmetic.

## Recall and practice

- Question — The outcome of `new BigDecimal("2.0").equals(new BigDecimal("2.00"))` and of the numeric compareTo?
- Answer — equals is false; compareTo is zero. The chosen equality semantics matter in HashMap keys and sorted collections.
- Try it yourself — Calculate a money total with string-based BigDecimal; verify the scale/rounding contract and the overflow of a max-int addition.

## Practice questions

### Easy · String `==` vs `equals`

```java
String a = "hi";
String b = "hi";
String c = new String("hi");
System.out.println((a == b) + " " + (a == c) + " " + a.equals(c));
```

<details>
<summary>Answer</summary>

- Output — `true false true`.
- Literals — the same object from the string pool, so `a == b`.
- `new String` — a new object; `==` compares references.
- Rule — always `equals` for content (null-safe: `Objects.equals(a, c)`).

</details>

### Easy · Integer cache trap

```java
Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));
```

<details>
<summary>Answer</summary>

- Output — `true false` (with default settings).
- Why — `Integer.valueOf` returns cached objects for `-128..127`; new objects at 128.
- Fix — compare wrappers with `equals`, or use the primitive `int`.

</details>

### Medium · `BigDecimal` construction and equality

```java
System.out.println(new BigDecimal(0.1));
System.out.println(new BigDecimal("2.0").equals(new BigDecimal("2.00")));
System.out.println(new BigDecimal("2.0").compareTo(new BigDecimal("2.00")));
```

<details>
<summary>Answer</summary>

- Line 1 — `0.1000000000000000055511151231257827...`; you get the exact binary value of the double.
- Line 2 — `false`; `equals` compares the scale too.
- Line 3 — `0`; use `compareTo` for numeric comparison.
- Use — `new BigDecimal("0.1")` or `BigDecimal.valueOf(0.1)`.

</details>

### Medium · Casting results

```java
System.out.println((int) 3.99);
System.out.println((int) -3.99);
System.out.println((byte) 200);
System.out.println(Math.addExact(Integer.MAX_VALUE, 1));
```

<details>
<summary>Answer</summary>

- `3`, `-3` — a double→int cast truncates (towards zero).
- `-56` — the `byte` range is `-128..127`; 200 wraps (200 − 256).
- Last — `ArithmeticException: integer overflow`; `addExact` does not wrap silently.

</details>

### Hard · Find the three bugs

```java
Map<String, Integer> stock = new HashMap<>();
int left = stock.get("pen");                    // 1
Integer a = 1000, b = 1000;
if (a == b) System.out.println("same");         // 2
double total = 0.1 * 3;                         // 3 (price total)
```

<details>
<summary>Answer</summary>

- 1 — `get` returns `null`, and auto-unboxing to `int` → `NullPointerException`. Fix: `stock.getOrDefault("pen", 0)`.
- 2 — it compares `Integer` references; 1000 is outside the cache → false. Fix: `a.equals(b)` or `int`.
- 3 — `0.30000000000000004`; for money use `BigDecimal` or a `long` in the smallest unit.

</details>

## Sources — further reading

- [Oracle BigDecimal contract](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/math/BigDecimal.html)

- [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
- [Java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/05-language-foundations.md)
