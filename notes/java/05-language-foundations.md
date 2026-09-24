---
id: java-language-foundations
title: Java foundations review and conversion edge cases
track: java
order: 5
level: Foundation
minutes: 1
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

## Sources — aur padhne ke liye

- [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
- [Java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/05-language-foundations.md)
