---
id: spring-testing
title: Spring Boot unit slice and integration testing
track: spring-boot
order: 8
level: Intermediate
minutes: 1
summary: Unit test — service rule ko Spring context bina test karo.
tags: spring, testing, integration
---

## Quick revision

- Unit test — service rule ko Spring context bina test karo.
- Slice test — MVC/JPA jaise limited layer ka wiring/behavior.
- `@SpringBootTest` — broad application integration; cost zyada.
- Testcontainers — real service/database behavior ke tests.
- MockMvc — HTTP contract without full external server.
- Isolation — test data unique/clean rakho; parallel tests ek-doosre ko na tod dein.
- Rollback caveat — separate HTTP thread ka transaction test rollback se cover na ho.
- Context reuse — compatible cached test context suite fast karta hai; unnecessary full resets avoid.
- HTTP boundary — JSON shape, status aur validation errors assert; sirf service return value enough nahi.
- External stub — timeout/malformed response simulate; real integration ka substitute samajhkar use karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/08-testing.md)
