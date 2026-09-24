---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://dev.java/learn/packages/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/06-packages-interfaces.md)
