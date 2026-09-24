---
id: design-java-api-data
title: Java backend API and data architecture
track: system-design
order: 7
level: Intermediate
minutes: 1
summary: Layers — controller contract, service rules, repository persistence.
tags: java, api, data-modeling, consistency
visual: request-flow
---

## Quick revision

- Layers — controller contract, service rules, repository persistence.
- Transaction — business invariant ko atomic database boundary mein rakho.
- Constraint — uniqueness/foreign-key/check se invalid state database par roko.
- Idempotency key — same operation retry ka same durable result.
- Pagination — stable order + bounded size; large feeds mein cursor useful.
- Pool — DB connections scarce resource; wait time aur saturation monitor karo.
- Outbox — business write aur event row same transaction mein.
- Migration — compatible rollout; old/new versions coexist kar sakein.
- ETag/If-Match — resource version match ho tab update; lost-update conflict surface karo.
- Bulk endpoint — bounded batch size; partial success/error response contract clear.
- Read model — optimized query view; source write model se freshness/lag explicitly define.

## Sources — aur padhne ke liye

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/07-java-api-data.md)
