---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 2
summary: Package — related classes ka namespace.
tags: packages, interfaces, encapsulation
---

## Quick revision

- Package — related classes ka namespace.
- Access — private: class; package-private: package; public: visible API.
- Protected — package access plus inheritance rules; blanket public access nahi.
- Interface — behavior contract; multiple interfaces implement kar sakte ho.
- Abstract class — shared state/implementation plus abstract methods.
- Dependency inversion — concrete implementation ki jagah contract par depend karo.
- Default method — interface implementation de sakta hai; conflicts resolve karne padte hain.
- Interface static method — interface name se call; instance inheritance jaisa behavior nahi.
- Import — short name resolve karta hai; runtime object creation nahi.
- Package-private API — implementation ko package ke andar rakhkar public surface chhoti karo.

### Edge cases aur reasoning

- Interface conflict — unrelated interfaces ka same default method inherit ho toh class mein explicit resolution/override chahiye.
- API visibility — public class ke signature mein inaccessible implementation type dena usable contract complicate karta hai.
- Substitution contract — interface implementation input restrictions/failure promises ko unexpectedly tighten na kare.

## Recall aur practice

- Sawal — Do interfaces same default method dein toh Java arbitrary winner choose karega?
- Jawaab — Unrelated defaults ka conflict explicitly override se resolve karo; class/inheritance precedence ka rule separately samjho.
- Khud try karo — PaymentGateway interface aur fake implementation banao; caller ko concrete provider dependency ke bina success/failure test karne do.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://dev.java/learn/packages/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/06-packages-interfaces.md)
