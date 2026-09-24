---
id: java-spring-rest
title: Spring dependency injection and REST APIs
track: spring-boot
order: 4
level: Intermediate
minutes: 1
summary: `@RestController` — HTTP response body return karne wala controller.
tags: spring, rest, dependency-injection, validation
visual: request-flow
---

## Quick revision

- `@RestController` — HTTP response body return karne wala controller.
- Mapping — path + HTTP method se handler choose.
- DTO — external request/response shape; persistence entity directly expose mat karo.
- Controller — parse/validate/response; service — business rules; repository — persistence.
- Status — create 201, missing 404, invalid input 400 jaise contract clear rakho.
- Idempotency — repeated request ka side effect contract define karo.
- Pagination — bounded size aur stable ordering do.
- Content negotiation — Accept expected response type; Content-Type sent body ka type.
- Path/query/body — resource identity / filters / structured payload ko suitable binding se lo.
- Entity exposure — internal fields, lazy relations aur schema changes API contract leak kar sakte hain.

## Sources — aur padhne ke liye

- [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring MVC annotated controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Spring Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/04-spring-rest.md)
