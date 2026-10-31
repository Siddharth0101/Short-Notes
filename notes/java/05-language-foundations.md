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

> Revision target — Equality, numeric range aur conversion ke result ko type dekhkar predict karo.

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

## Example se samjho

- Scenario — `int price = 1_500_000_000; long total = price * 2;` mein destination long hone ke bawajood wrong total aa sakta hai.
- Reasoning — Multiplication int mein hoti hai aur overflow pehle hota hai. `(long) price * 2` long arithmetic mein `3000000000` deta hai.
- Catch — Result assign hone ke baad cast lost information restore nahi karta; operand type operation se pehle badlo ya checked arithmetic choose karo.

## Recall aur practice

- Sawal — `new BigDecimal("2.0").equals(new BigDecimal("2.00"))` aur numeric compareTo ka outcome?
- Jawaab — equals false; compareTo zero. HashMap keys aur sorted collections mein chosen equality semantics matter karti hain.
- Khud try karo — Money total string-based BigDecimal se calculate karo; scale/rounding contract aur max-int addition overflow verify karo.

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
- Literals — string pool se same object, isliye `a == b`.
- `new String` — naya object; `==` reference compare karta hai.
- Rule — content ke liye hamesha `equals` (null-safe: `Objects.equals(a, c)`).

</details>

### Easy · Integer cache trap

```java
Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));
```

<details>
<summary>Answer</summary>

- Output — `true false` (default settings mein).
- Kyun — `Integer.valueOf` `-128..127` cached objects deta hai; 128 par naye objects.
- Fix — wrappers ko `equals` se compare karo, ya primitive `int` use karo.

</details>

### Medium · `BigDecimal` construction aur equality

```java
System.out.println(new BigDecimal(0.1));
System.out.println(new BigDecimal("2.0").equals(new BigDecimal("2.00")));
System.out.println(new BigDecimal("2.0").compareTo(new BigDecimal("2.00")));
```

<details>
<summary>Answer</summary>

- Line 1 — `0.1000000000000000055511151231257827...`; double ka exact binary value aa jaata hai.
- Line 2 — `false`; `equals` scale bhi compare karta hai.
- Line 3 — `0`; numeric comparison ke liye `compareTo`.
- Use — `new BigDecimal("0.1")` ya `BigDecimal.valueOf(0.1)`.

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

- `3`, `-3` — double→int cast truncate karta hai (zero ki taraf).
- `-56` — `byte` range `-128..127`; 200 wrap hota hai (200 − 256).
- Last — `ArithmeticException: integer overflow`; `addExact` silent wrap nahi karta.

</details>

### Hard · Teen bugs dhundo

```java
Map<String, Integer> stock = new HashMap<>();
int left = stock.get("pen");                    // 1
Integer a = 1000, b = 1000;
if (a == b) System.out.println("same");         // 2
double total = 0.1 * 3;                         // 3 (price total)
```

<details>
<summary>Answer</summary>

- 1 — `get` `null` deta hai, `int` mein auto-unboxing → `NullPointerException`. Fix: `stock.getOrDefault("pen", 0)`.
- 2 — `Integer` references compare; 1000 cache ke bahar → false. Fix: `a.equals(b)` ya `int`.
- 3 — `0.30000000000000004`; money ke liye `BigDecimal` ya paise mein `long`.

</details>

## Sources — aur padhne ke liye

- [Oracle BigDecimal contract](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/math/BigDecimal.html)

- [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
- [Java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/05-language-foundations.md)
