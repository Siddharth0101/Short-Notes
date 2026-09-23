---
id: spring-background-cache
title: Spring background jobs aur caching — lifecycle aur ownership samjho
track: spring-boot
order: 11
level: Advanced
minutes: 1
summary: `@Async` — executor par work; default proxy mode mein self-call bypass ho sakti hai.
tags: spring, scheduling, caching, async, idempotency
---

## Quick revision

- `@Async` — executor par work; default proxy mode mein self-call bypass ho sakti hai.
- Scheduled job — multiple instances par duplicate execution possible.
- Job identity — idempotency/claim/lock se duplicate effects roko.
- Bounded executor — workers, queue aur rejection policy define karo.
- `@Cacheable` — matching key ka cached result reuse.
- Cache key — all relevant args, tenant aur permission scope include karo.
- Eviction — write ke baad stale entries invalidate/update karo.
- Transaction/cache — database commit aur cache update atomic automatically nahi.

## Sources — aur padhne ke liye

- [Scheduling/async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [cache annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/11-spring-background-cache.md)
