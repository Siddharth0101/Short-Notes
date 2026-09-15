---
id: spring-background-cache
title: Spring background jobs aur caching — lifecycle aur ownership samjho
track: spring-boot
order: 11
level: Advanced
minutes: 33
summary: Scheduler trigger deta hai aur cache repeated reads bachata hai; durable completion aur correct invalidation ka design alag chahiye.
tags: spring, scheduling, caching, async, idempotency
---

## Mental model — simple soch

HTTP request finish hone ke baad email bhejna ya hourly report banana background work hai. `@Scheduled` clock se callback trigger kar sakta hai; trigger aana durable job complete hone ka proof nahi. Cache previous calculation reuse karta hai; cache annotation data freshness ki complete policy nahi banati.

> **Core takeaway:** Work ka owner, retry aur completion record define karo. Cache ko source of truth ki tarah treat mat karo.

Beans/DI, transactions, security aur deployment notes prerequisites hain. Yahan Spring Framework annotation model samjhaya hai; actual Boot project mein selected version ka cache provider, scheduler/executor configuration aur dependencies chahiye. Neeche standalone Java program nahi, configured Spring application ka excerpt hai.

## Cache ke key mein poori identity rakho

```java
// Excerpt: @EnableCaching, configured CacheManager, repository bean required.
@Service
class CourseLookup {
    private final CourseRepository repository;
    CourseLookup(CourseRepository repository) { this.repository = repository; }

    @Cacheable(cacheNames = "courseTitles", key = "#p0 + ':' + #p1")
    public String title(long tenantId, long courseId) {
        return repository.findTitle(tenantId, courseId);
    }
}
```

Example mein tenantId aur courseId numeric hain, isliye separator-based key unambiguous hai. Arbitrary user strings ke liye delimiter collisions avoid karne ko structured key use karo. Sirf courseId rakhoge aur tenants ke local IDs overlap karenge toh wrong tenant ka cached data mil sakta hai. Cache hit path par bhi authorization contract enforce hona chahiye; cache ko permission gate bypass mat banne do.

`@Cacheable` available entry reuse kar sakta hai; `@CachePut` method execute karke result cache karta hai; `@CacheEvict` entry remove karta hai. TTL/provider capacity explicitly configure karo; annotation se automatic universal TTL nahi milta. Missing-data/null cache policy bhi decide karo. Local caches each instance par alag hote hain.

## Write ke saath invalidation ko trace karo

Course title update ke baad old cache entry remove karni hai. Eviction transaction commit se pehle ho aur reader old database value refill kar de toh stale result bach sakta hai. After-commit invalidation yeh particular window reduce karti hai, lekin slow pre-commit reader baad mein stale refill kar sakta hai. Stronger freshness requirement ke liye versions ya coordinated design chahiye.

Cache update ko database transaction ka atomic extension assume mat karo. Failure ke baad bounded staleness tolerate ho toh TTL plus observable invalidation retry ek defensible approach hai. Financial authorization jaise decisions ko stale presentation cache par depend mat karao.

## Scheduled aur async ka actual boundary

Fixed delay mein next run pichhle completion ke baad delay se trigger hota hai; fixed rate intended periodic schedule express karta hai. Actual overlap/execution scheduler configuration aur task model par depend karega. Long task ke liye runtime, timeout aur next-trigger policy define karo. Timezone explicit rakho jab cron business time follow karta ho.

Two app replicas same scheduler bean run kar sakti hain. Per-process scheduler cluster-wide leader election nahi hai. Durable jobs ko database/queue mein identity do. Worker claim atomically kare, lease expiry/retry define kare aur side effect idempotent ho. Lease expire hone ke baad old worker ab bhi run kar raha ho toh duplicate execution possible hai; ownership token/version se stale writes reject karne ka design socho.

`@Async` proxy-mediated invocation executor par work bhej sakti hai. Self-invocation same proxy boundary cross nahi karti. Request-thread transaction ya ThreadLocal identity automatically correct worker context ban jaayegi assume mat karo. Needed immutable IDs explicitly pass karo; worker apni transaction aur authorization requirement establish kare. Bounded executor/queue aur rejection policy rakho. Void async failure caller ke ordinary try/catch tak nahi aati; error observation define karo.

## Practice — report job ka state machine

Report status pending → running → succeeded/failed rakho. Job ID, attempt, claimed owner, lease expiry aur output location record karo. File complete hone se pehle succeeded mark karna broken contract hai. Worker crash after file upload/before status update par retry same job ke existing artifact ko reconcile kare.

Metrics mein queue age, running duration, retries, failed jobs aur cache hit/miss/eviction dekho. High hit rate wrong-tenant data ko correct nahi banati. Shutdown par new jobs claim band karo, active work bounded grace do aur unfinished work next worker recover kar sake.

## Depth walkthrough — andar kya ho raha hai?

### Scheduled method aur durable job same promise nahi karte

Two app replicas same schedule run karein toh task duplicate execute ho sakti hai. Single in-memory timer cluster-wide exactly-one execution prove nahi karta. Job identity, distributed coordination ya naturally idempotent update ka contract choose karo.

Async method return karke caller success assume kar le, phir process crash ho, toh in-memory task lose ho sakti hai. Durable acceptance chahiye toh persistent queue/job record aur acknowledgement boundary define karo. Failure retry observable ho; exception log alone completion contract nahi.

Cache mutation race: read old DB value, write commits new value and invalidates cache, old reader cache refill karta hai. Invalidation call exist hone se this interleaving disappear nahi hoti. **Practice:** Timeline draw karke allowed staleness aur version/TTL/coordination choice justify karo. Cache key tenant/user relevant scope retain kare; cached result authorization policy bypass na kare.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Scheduler trigger aur durable job completion mein farq kya hai?

**Apply — khud try karo:** Do replicas same invoice-email job claim karte hain. Duplicate email ko reduce karne aur recovery ka design do.

> **Hint — chhota ishara:** Database claim aur external side effect ke beech crash window trace karo.

**Answer guide — pehle khud karo, phir compare karo:** Atomic claim plus job identity use karo. Provider supports kare toh stable idempotency key do; completion durable record karo. Provider idempotency absent ho toh send/ack crash window mein duplicates fully eliminate hone ka claim mat karo. Retry/duplicate policy explicit rakho.

**Exit check — aage badhne se pehle:** Same service ke direct self-call par async/cache behavior ki expectation explain karo.

## Sources — aur padhne ke liye

[Scheduling/async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html) aur [cache annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html) ke proxy aur configuration rules padho.
