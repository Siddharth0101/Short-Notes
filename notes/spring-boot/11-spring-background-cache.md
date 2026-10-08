---
id: spring-background-cache
title: Spring background jobs aur caching — lifecycle aur ownership samjho
track: spring-boot
order: 11
level: Advanced
minutes: 3
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
- Cache stampede — same miss par concurrent loaders; single-flight/locking/jitter strategy choose.
- Job lease — expiry ke baad old worker ab bhi chal sakta hai; stale writes reject karne ka guard chahiye.
- Scheduler overlap — previous run complete hone se pehle next run allowed hai ya nahi, define karo.

### Edge cases aur reasoning

- Async error ownership — void @Async exception caller Promise se nahi milti; handler/logging ya future-return contract define karo.
- Schedule clock — fixedDelay previous completion ke baad gap; fixedRate schedule cadence, actual overlap executor/config se depend.
- Post-commit invalidation — after-commit action rollback ke badle cache clear avoid kare, par crash gap bachega; durable invalidation/outbox consider karo.

## Recall aur practice

- Sawal — Job lease expire hone se old worker execute karna automatically band ho jaata hai?
- Jawaab — Nahi; stale worker still running ho sakta. Fencing/version check aur idempotent writes se obsolete side effects reject karo.
- Khud try karo — Two-instance scheduled export plan banao; duplicate claim, lease expiry, write failure aur cache commit/crash window verify karo.

## Sources — aur padhne ke liye

- [Scheduling/async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [cache annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/11-spring-background-cache.md)
