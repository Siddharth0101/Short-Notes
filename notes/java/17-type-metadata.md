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

## Recall aur practice

- Sawal — Enum ordinal database mein save karke constants reorder karne ka risk?
- Jawaab — Purana number naya constant represent kar sakta; stable external code aur explicit migration safer contract hai.
- Khud try karo — Order status enum ko stable code se map karo; unknown persisted code reject/recover aur allowed status transitions verify karo.

## Sources — aur padhne ke liye

- [Records](https://dev.java/learn/records/)
- [annotations](https://dev.java/learn/annotations/)
- [sealed classes](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/17-type-metadata.md)
