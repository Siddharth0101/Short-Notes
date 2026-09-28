---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 2
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
- `@Bean` — factory method ka returned object container manage karta hai.
- Prototype scope — har container lookup par naya instance; injected singleton automatically har call par refresh nahi karta.
- Optional dependency — absence valid ho tab explicit optional/provider contract; required bean ko silently hide mat karo.

### AOP aur proxies

- AOP — logging/transactions jaise cross-cutting work business method se separate.
- Aspect — related advice + pointcuts ka group.
- Join point — interception location; Spring AOP mein method execution.
- Pointcut — kin methods par advice lagegi.
- Advice — before, after, after-returning, after-throwing ya around.
- Around — proceed call aur result/error handling consciously karo.
- Limits — proxy type/final/private method restrictions samjho.
- Exception advice — logging ke baad original exception preserve; swallow karna caller/transaction behavior badalta hai.
- Proxy identity — injected bean proxy ho sakta hai; implementation-class assumptions avoid.
- Aspect test — external bean call aur internal self-call ka interception difference verify karo.
- Advice ordering — multiple aspects ka order security/transaction behavior badal sakta hai; explicit rakho.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/02-beans-di.md)
