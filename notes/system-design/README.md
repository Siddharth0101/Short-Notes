# System design — quick revision

[Saare courses](../README.md)

Shuru karne se pehle: [Performance suspense and production quality](../react/10-performance-production.md) · [JPA Hibernate and Spring transactions](../spring-boot/06-jpa-transactions.md) · [Java concurrency under real resource limits](../java/16-concurrency-production.md).

Har chapter mein short Hinglish one-liners hain; code examples optional link par hain. Revision routine ke liye [study guide](../STUDY_GUIDE.md) padho.

## Stage 1: Design ki common foundation

Scaling/cache choose karne se pehle requirements/capacity clear karo.

1. [Requirements capacity and design interviews](01-requirements-capacity.md)
2. [Scaling caching replication and partitioning](02-scaling-caching.md)

**Stage checkpoint — khud karke dikhao:** Workload, latency, freshness aur correctness assumptions likho.

## Stage 2: React frontend architecture samjho

Frontend case se pehle rendering, state aur performance design karo.

3. [React architecture rendering and delivery](03-react-architecture.md)
4. [React state server data and cache consistency](04-react-data-state.md)
5. [Frontend performance accessibility and resilience](05-frontend-performance.md)
6. [Frontend system design interview from requirements to failure](06-frontend-design-round.md)

**Stage checkpoint — khud karke dikhao:** URL state, cache aur stale-request handling wala accessible catalog banao.

## Stage 3: Java backend architecture samjho

API/data boundaries ke baad messaging, reliability aur operations padho.

7. [Java backend API and data architecture](07-java-api-data.md)
8. [Messaging outbox retries and distributed workflows](08-messaging-reliability.md)
9. [Security observability and production operations](09-security-operations.md)
10. [Java backend design interview and reservation correctness](10-backend-design-round.md)

**Stage checkpoint — khud karke dikhao:** Reservation invariant, retry identity aur failure timeline explain karo.

## Stage 4: End-to-end case studies karo

Dono sides padhkar frontend/backend reasoning combine karo.

11. [Case study React storefront and Java checkout](11-commerce-case-study.md)
12. [Case study collaborative notes and real-time chat](12-realtime-case-study.md)

**Stage checkpoint — khud karke dikhao:** Checkout/reconnect failure mein durable state bachne ka flow trace karo.

## Stage 5: Distributed guarantees aur API contracts defend karo

Read consistency, global limits aur API styles ko workload/failure history se compare karo.

13. [Consistency aur distributed rate limiting — guarantees pehle likho](13-consistency-limits.md)
14. [REST, GraphQL aur gRPC — protocol se pehle contract choose karo](14-api-contracts.md)

**Stage checkpoint — khud karke dikhao:** Replica lag, limiter outage aur batch lookup failure ke expected outcomes define karo.

## Stage 6: OS aur networking fundamentals se diagnose karo

Request latency ko process, memory, network aur shared-resource layers mein trace karo.

15. [OS aur networking interviews — slow request ko layer-wise diagnose karo](15-os-network-debugging.md)

**Stage checkpoint — khud karke dikhao:** DNS/TCP/TLS failure, pool wait aur unknown write outcome ko evidence se separate karo.
