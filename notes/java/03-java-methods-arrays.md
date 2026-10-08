---
id: java-methods-arrays
title: Java methods arrays and strings
track: java
order: 3
level: Foundation
minutes: 3
summary: Method — typed parameters lo, declared type ka result return karo.
tags: fundamentals, java, methods, arrays
---

## Quick revision

- Method — typed parameters lo, declared type ka result return karo.
- `void` — return value nahi; early `return` allowed.
- Overloading — same naam, different parameter list; return type alone enough nahi.
- Pass-by-value — reference ki copy pass hoti hai; object mutate ho sakta hai.
- Array — fixed length; index `0` se `length - 1`.
- 2D array — arrays ka array; rows ki lengths alag ho sakti hain.
- Varargs — multiple arguments array ki tarah milte hain; last parameter hota hai.
- Array length — fixed property; String length() method hai.
- Bounds — invalid index par ArrayIndexOutOfBoundsException; negative/empty cases check karo.
- Return contract — non-void method ke har normally completing path ko value chahiye.

### Method calls

- Varargs overload — ambiguity avoid; explicit method contracts rakho.

### Edge cases aur reasoning

- Array covariance — Object[] mein actual String[] reference possible; incompatible write ArrayStoreException de sakti hai.
- Copy depth — Arrays.copyOf outer array copy karta hai; object elements aur 2D rows ke references shared ho sakte hain.
- String transform — immutable String operation naya result de sakti hai; returned value assign kiye bina original nahi badlega.

## Recall aur practice

- Sawal — Method mein parameter = new int[0] karne se caller array kyun unchanged?
- Jawaab — Reference value ki local copy reassign hoti hai; caller binding same array ko point karti rehti hai.
- Khud try karo — Ragged 2D array sum likho; empty rows, null-row policy aur original input unchanged verify karo.

## Sources — aur padhne ke liye

- [Dev.java arrays](https://dev.java/learn/arrays/)
- [classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/03-java-methods-arrays.md)
