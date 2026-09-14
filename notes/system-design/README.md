# System design — ordered course

[All courses](../README.md)

Before starting: [Performance suspense and production quality](../react/10-performance-production.md) · [JPA Hibernate and Spring transactions](../spring-boot/06-jpa-transactions.md) · [Java concurrency under real resource limits](../java/16-concurrency-production.md).

Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](../STUDY_GUIDE.md) for session plans and self-review.

## Stage 1: Shared design foundations

Clarify requirements and capacity before choosing scaling and caching components.

1. [Requirements capacity and design interviews](01-requirements-capacity.md)
2. [Scaling caching replication and partitioning](02-scaling-caching.md)

**Stage checkpoint:** State workload, latency, freshness and correctness assumptions for a service.

## Stage 2: React frontend architecture

Design rendering, state and performance before the frontend interview case.

3. [React architecture rendering and delivery](03-react-architecture.md)
4. [React state server data and cache consistency](04-react-data-state.md)
5. [Frontend performance accessibility and resilience](05-frontend-performance.md)
6. [Frontend system design interview from requirements to failure](06-frontend-design-round.md)

**Stage checkpoint:** Design an accessible catalog with URL state, caching and stale-request handling.

## Stage 3: Java backend architecture

Design APIs and data boundaries, then messaging, reliability and operations.

7. [Java backend API and data architecture](07-java-api-data.md)
8. [Messaging outbox retries and distributed workflows](08-messaging-reliability.md)
9. [Security observability and production operations](09-security-operations.md)
10. [Java backend design interview and reservation correctness](10-backend-design-round.md)

**Stage checkpoint:** Explain a reservation invariant, retry identity and failure recovery timeline.

## Stage 4: End-to-end case studies

Combine frontend and backend reasoning only after studying both sides.

11. [Case study React storefront and Java checkout](11-commerce-case-study.md)
12. [Case study collaborative notes and real-time chat](12-realtime-case-study.md)

**Stage checkpoint:** Walk through checkout and real-time reconnection failures without losing durable state.
