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

- Primitive types — byte, short, int, long, float, double, char, boolean.
- Wrapper — primitive ka object type; unboxing null se `NullPointerException`.
- String — immutable; content compare ke liye `.equals()`.
- `==` — primitives ki value, objects ki reference identity compare.
- `StringBuilder` — repeated string building mein mutable buffer.
- Overflow — integer arithmetic wrap ho sakti hai; checked math/range validation use karo.
- Casting — narrowing mein data lose ho sakta hai; blindly cast mat karo.
- `final` — variable reassign nahi; object automatically immutable nahi.
- Autoboxing — primitive wrapper mein convert; wrapper identity ko numeric equality mat samjho.
- BigDecimal — decimal arithmetic; precision/scale/rounding explicit rakho.
- Char — UTF-16 code unit; emoji ek char mein fit hona guaranteed nahi.

### String behavior

- String pool — literals reuse ho sakte hain; content equality ke liye `.equals()`.
- StringBuffer — synchronized mutable buffer; StringBuilder unsynchronized.

### Edge cases aur reasoning

- Decimal construction — BigDecimal("0.1") intended decimal preserve; new BigDecimal(0.1) binary floating approximation capture karta hai.
- Decimal equality — BigDecimal equals value+scale compare; compareTo numeric ordering, isliye 2.0/2.00 ka equality behavior different.
- Checked arithmetic — Math.addExact/multiplyExact overflow par throw; long conversion arithmetic se pehle karo jab larger range chahiye.

## Recall aur practice

- Sawal — `new BigDecimal("2.0").equals(new BigDecimal("2.00"))` aur numeric compareTo ka outcome?
- Jawaab — equals false; compareTo zero. HashMap keys aur sorted collections mein chosen equality semantics matter karti hain.
- Khud try karo — Money total string-based BigDecimal se calculate karo; scale/rounding contract aur max-int addition overflow verify karo.

## Sources — aur padhne ke liye

- [Oracle BigDecimal contract](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/math/BigDecimal.html)

- [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
- [Java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/05-language-foundations.md)
