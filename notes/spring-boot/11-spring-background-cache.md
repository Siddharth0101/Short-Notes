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

> Revision target — Background work aur cache ko explicit identity, ownership aur recovery boundary do.

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

## Example se samjho

- Scenario — Two app instances same daily export schedule run karte hain; dono same customer ko report bhej sakte hain.
- Reasoning — Export operation identity aur durable claim/dedupe design karo; repeat execution same business effect reuse/skip kare. Worker failure ke baad recovery owner clear ho.
- Catch — Per-instance scheduler global once-only guarantee nahi deta; lease expiry old worker rok nahi deti, stale write guard aur bounded retries phir bhi chahiye.

## Recall aur practice

- Sawal — Job lease expire hone se old worker execute karna automatically band ho jaata hai?
- Jawaab — Nahi; stale worker still running ho sakta. Fencing/version check aur idempotent writes se obsolete side effects reject karo.
- Khud try karo — Two-instance scheduled export plan banao; duplicate claim, lease expiry, write failure aur cache commit/crash window verify karo.

## Practice questions

### Easy · `@Async` async kyun nahi chala?

<details>
<summary>Answer</summary>

- `@EnableAsync` missing.
- Self-invocation — same class se call proxy bypass karta hai.
- Errors — `void` async method ka exception caller tak nahi aata; `AsyncUncaughtExceptionHandler` ya `CompletableFuture` return karo.
- Executor — bounded `ThreadPoolTaskExecutor` define karo, unbounded defaults par mat chhodo.

</details>

### Medium · Scheduled job teen baar chal raha hai

Nightly invoice job 3 replicas par 3 baar chala aur customers ko 3 emails gaye.

<details>
<summary>Answer</summary>

- Kyun — `@Scheduled` har instance mein independently chalta hai.
- Fix — distributed lock/lease (ShedLock with DB, ya DB row lease) taaki ek hi instance chale.
- Idempotency — job state table (`invoice_sent_at`) se dobara run hone par duplicates skip.
- Overlap — `fixedDelay` pichle run ke khatam hone ke baad gap rakhta hai; `fixedRate` slow run par overlap kara sakta hai.

</details>

### Medium · `@Cacheable` galat data de raha hai

```java
@Cacheable("prices")
public Price price(String sku, String currency) { ... }
```

Pehle `("A", "INR")` call hua, phir `("A", "USD")` par bhi INR price aa raha hai? (Custom key generator `key = "#sku"` set hai.)

<details>
<summary>Answer</summary>

- Kyun — cache key sirf `sku` hai; currency key mein nahi.
- Fix — `@Cacheable(cacheNames = "prices", key = "#sku + ':' + #currency")` ya default key (saare params) rehne do.
- Aur traps — mutable entities cache karna (caller mutate kare toh cache badal jaaye), unbounded cache, null values ka intent.

</details>

### Medium · Update ke baad stale cache

Service update mein pehle cache evict karta hai, phir DB transaction commit hoti hai. Kabhi purana price wapas cache ho jaata hai. Kyun?

<details>
<summary>Answer</summary>

- Race — evict ke baad, commit se pehle, koi read DB se purana value padh kar dobara cache kar deta hai.
- Fix — commit ke baad evict: `@TransactionalEventListener(phase = AFTER_COMMIT)` mein invalidate.
- Extra safety — short TTL taaki rare race bhi khud heal ho.

</details>

### Hard · Cache stampede

Popular product ka cache entry expire hua; 2000 concurrent requests DB par gir gayi. Mitigations?

<details>
<summary>Answer</summary>

- Single flight — ek hi request DB se load kare, baaki wait; ek instance mein `@Cacheable(sync = true)`, multi-instance mein distributed lock.
- Jittered TTL — saari keys ek saath expire na hon.
- Refresh ahead / stale-while-revalidate — expiry se pehle background refresh, ya purana value serve karte hue refresh.
- Protection — DB par concurrency limit/bulkhead, taaki cache miss poore system ko na giraye.

</details>

## Sources — aur padhne ke liye

- [Scheduling/async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [cache annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/11-spring-background-cache.md)
