---
id: design-messaging-reliability
title: Messaging outbox retries and distributed workflows
track: system-design
order: 8
level: Advanced
minutes: 3
summary: Dual write — a DB success plus a message failure can leave inconsistent state.
tags: messaging, outbox, idempotency, sagas
visual: outbox-pattern
---

## Quick revision

> Revision target — Reason separately about the guarantees of backlog, delivery, durable effects and retries.

- Dual write — a DB success + a message failure can leave inconsistent state.
- Outbox — data/event in the same commit; a relay publishes later.
- At-least-once — duplicates are expected; make the consumer idempotent.
- Consumer transaction — the event dedupe marker and the business effect in the same atomic boundary.
- Ordering — usually scoped to a partition/key; global order is costly.
- Retry — backoff + jitter + a deadline + an attempt limit.
- Retry amplification — retries across layers can multiply; keep a shared budget.
- Backpressure — slow down/reject producers; do not let the queue grow without limit.
- Drain time — backlog / (processing rate - arrival rate), when processing is faster.
- DLQ — an owner, a diagnosis and a safe replay plan for failed messages.
- Saga — steps + compensations; not a distributed ACID rollback.
- Poison message — do not retry a deterministic failure endlessly; quarantine + diagnosis.
- Fencing token — reject a stale worker's writes using the newer lease owner's token.
- Replay — the consumer schema, idempotency and event retention must support safe reprocessing.

### Edge cases and reasoning

- Dedup retention — after receipt cleanup a delayed/replayed event can cause a duplicate effect; align the replay horizon with the business identity.
- Ack ordering — the broker ack after the effect+dedupe commit; if the ack goes first and a crash follows, the event can be lost.
- Outbox ordering — multiple relay workers can reorder the events of the same aggregate; it needs a sequence/version and a publish partition contract.

## Research notes: Budget retries across the call graph

- Retries take even more capacity when the dependency is already struggling.

## Understand it with an example

- Scenario — Assume a queue backlog of 600 jobs, a worker capacity of 50 jobs/s and continuing arrivals of 30 jobs/s.
- Reasoning — The net drain is 20 jobs/s; at stable rates the rough time to clear the backlog is 30 seconds. Ignore new arrivals and you get a wrong estimate of 12 seconds.
- Catch — If the arrival rate is at or above capacity there is no finite drain time; expensive jobs, retries and downstream limits can reduce the actual rate.

## Recall and practice

- Question — What is the expected behaviour if a consumer crashes after the commit but before the ack?
- Answer — Redelivery is possible; a durable dedupe check for the same event should stop the duplicate business effect and then ack safely.
- Try it yourself — Write an outbox/consumer crash timeline; verify the invariants before the commit, after the publish, after the effect commit and on a delayed replay.

## Practice questions

### Easy · Dual write problem

```java
orderRepo.save(order);           // DB commit
kafka.send("order-created", ...); // what if it crashes here?
```

<details>
<summary>Answer</summary>

- Problem — the DB and the broker are two separate systems; one succeeds, the other fails → the order exists but the event does not (or the reverse).
- Fix — a transactional outbox: write the event to an `outbox` table in the same DB transaction; a relay publishes it later.
- Alternative — CDC (log-based) that streams the outbox table.

</details>

### Medium · The guarantees of an outbox

<details>
<summary>Answer</summary>

- Delivery — at-least-once: a crash after the relay publishes → it publishes again.
- Consumers — must be idempotent (dedupe on the event id).
- Ordering — events of the same aggregate use the same partition key; the relay publishes in order.
- Cleanup — mark/delete published rows, with a retention policy.

</details>

### Medium · Idempotent consumer

The `payment-captured` event arrived twice and the customer got points twice.

<details>
<summary>Answer</summary>

- Table — `processed_events(event_id primary key)`.
- Same transaction — insert the event id + update the points; a duplicate insert fails → skip.
- Ack — ack the broker only after the DB commit; otherwise a crash loses the message.
- Retention — keep dedupe records for longer than the broker's redelivery window.

</details>

### Medium · Poison messages and the DLQ

One malformed message crashes the consumer again and again and the whole queue is stuck.

<details>
<summary>Answer</summary>

- Retries — limited attempts with backoff; non-retryable errors (validation) go straight to the DLQ.
- DLQ — the failed message + the error reason; alert on DLQ growth.
- Replay — a controlled replay from the DLQ after the bug fix (safe because the consumers are idempotent).
- Ordering — do not block a whole partition for one message, unless there is a strict ordering requirement.

</details>

### Hard · Order saga

The order flow: reserve inventory → charge payment → create shipment. What if the payment fails? Orchestration vs choreography?

<details>
<summary>Answer</summary>

- Saga — a sequence of local transactions; compensating actions on failure (release inventory, refund payment).
- Orchestration — a central orchestrator runs the state machine; the flow is visible, with a single place for timeouts.
- Choreography — services react to events; loose coupling, but the flow is hard to follow.
- Must — every step idempotent, timeouts (a pending payment), compensation retryable too, the saga state persisted.
- Isolation — in-between states (reserved but unpaid) are visible to other users; holds must expire.

</details>

## Sources — further reading

- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Source yahan padho — AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf)
- [Timeouts retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/08-messaging-reliability.md)
