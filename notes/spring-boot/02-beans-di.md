---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 1
summary: Bean — Spring container ka managed object.
tags: spring, beans, dependency-injection
---

## Quick revision

- Bean — Spring container ka managed object.
- DI — dependencies bahar se milti hain; khud har jagah `new` nahi karte.
- Constructor injection — required dependencies explicit aur testable.
- Singleton scope — container mein ek instance; automatically thread-safe nahi.
- `@Qualifier`/`@Primary` — multiple matching beans mein selection clear karo.
- Lifecycle — initialization aur destruction callbacks resource ownership se match karo.
- Circular dependency — responsibilities/design split karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/02-beans-di.md)
