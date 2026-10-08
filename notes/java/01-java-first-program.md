---
id: java-first-program
title: First Java program variables and primitive types
track: java
order: 1
level: Foundation
minutes: 3
summary: JDK — Java develop karne ke tools; JVM — bytecode chalane ka runtime.
tags: fundamentals, java, first, program
---

## Quick revision

- JDK — Java develop karne ke tools; JVM — bytecode chalane ka runtime.
- Compile/run — `javac Main.java` → `java Main`.
- `main` — standard entry point `public static void main(String[] args)`.
- Class/file — public top-level class ka naam filename se match karo.
- Primitive — direct primitive value; reference — object ka reference ya null.
- Variable — declared type compatible value hi assign karo.
- `println` — output ke baad newline; `print` — same line.
- Bytecode — compiled class instructions; compatible JVM execute karti hai.
- Local variable — use se pehle assign karna zaroori; fields ko default values milti hain.
- Command-line args — main ka String array; numeric input explicitly parse/validate karo.

### Edge cases aur reasoning

- Compile-time versus runtime — syntax/type errors compilation mein; null access, missing runtime dependency jaise failures execution mein aate hain.
- Classpath — JVM ko classes/dependencies locate karne ka path; package name aur output-directory structure align karo.
- Version compatibility — newer target bytecode purane JVM par fail ho sakta hai; build release aur deployed runtime compatible rakho.

## Recall aur practice

- Sawal — javac successful ho gaya toh application ka har input safe prove hota hai?
- Jawaab — Nahi; compiler type/syntax check karta hai, runtime input, resources aur business rules ki separate validation chahiye.
- Khud try karo — Packaged Hello class compile/run karo; missing classpath, invalid numeric argument aur normal argument ka outcome explain karo.

## Sources — aur padhne ke liye

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/01-java-first-program.md)
