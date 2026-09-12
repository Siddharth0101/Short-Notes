---
id: system-design-backend-design-round
title: Java backend design interview and reservation correctness
track: system-design
order: 10
level: Advanced
minutes: 25
summary: Design a booking API around invariants, transaction boundaries and retry recovery.
tags: backend, java, system-design, idempotency, transactions
visual: transaction-race
---

## Mental model

Backend design ki starting point database brand nahi, invariant hai. For a booking service: one seat can have at most one active reservation, a confirmed payment must be traceable, and retries must not create a second logical booking. Availability and latency choices follow these correctness requirements.

## Start with a narrow architecture

A React client calls a stateless Java API backed by a relational database. Keep reservation creation and its idempotency record in one transaction. Add a worker for asynchronous notifications when the user need does not require waiting for delivery. Do not split services until scaling, ownership or isolation requirements justify the distributed boundary.

```text
POST /reservations
Idempotency-Key: stable-client-operation-id
{ eventId, seatId }

Database transaction:
  claim operation key + request fingerprint
  claim available seat under an enforceable constraint
  write reservation
  write outbox event
  store operation outcome
COMMIT

Relay → publish event → idempotent notification consumer
```

Scope the key to the authenticated caller and operation. A reused key with a different payload is a conflict, not a valid retry. Concurrent duplicates must coordinate through a unique key and transaction behavior, rather than both passing a preliminary existence check.

## Payment and expiration races

Do not hold a database transaction open while waiting on a payment provider. Use explicit pending, confirmed, expired and cancelled transitions. The provider can accept a payment while the caller times out, so an unknown outcome needs reconciliation with a stable provider operation ID.

Reservation expiration and payment confirmation can race. Both transitions must verify the current state atomically. Define the business policy for late payment: reject confirmation and refund, or reacquire capacity if possible. An architecture diagram cannot substitute for this product decision.

## Scale the reads and protect the writes

Cache event descriptions and public availability hints, but validate capacity at the authoritative write boundary. A displayed available seat is not a reservation guarantee. Read replicas can serve stale data, so a user's immediate confirmation view should rely on the committed result or an explicit freshness policy.

Partitioning by event can make a very popular event a hot partition. Admission control and a waiting room can protect the write path before adding complicated cross-partition inventory coordination. A global queue does not increase the speed of a single contended seat update.

## Reliability and operations

An outbox relay may publish twice if it crashes after broker acknowledgement but before marking the row sent. Consumers deduplicate durable event IDs atomically with their side effects when possible. If a side effect is external, use that provider's idempotency or a reconciliation workflow.

Track reservation success, conflict rate, lock wait, pool wait, event lag and reconciliation backlog. Correlate user operation IDs across the Java API, database record and payment interaction without logging credentials or sensitive payloads. Test restore and replay procedures, not just process health.

## Practice

Walk through three timelines: two users claim one seat; payment succeeds but HTTP response is lost; expiration races a payment webhook. For each, state the durable records, allowed next transition and user-visible message. Estimate peak write traffic separately from read traffic and identify the first bottleneck worth load-testing.

## Interview questions

**Does exactly-once delivery solve booking duplication?** Delivery claims are scoped. Business deduplication still needs stable identity and an atomic invariant at the side-effect boundary.

**Can a local lock protect seats across instances?** No. All writers must coordinate through a shared authoritative mechanism or a valid distributed ownership protocol.

## Sources

[PostgreSQL concurrency control](https://www.postgresql.org/docs/18/mvcc.html) provides the transaction background. [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html) document local coordination primitives and their scope.
