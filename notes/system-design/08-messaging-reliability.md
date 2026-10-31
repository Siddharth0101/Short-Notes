---
id: design-messaging-reliability
title: Messaging outbox retries and distributed workflows
track: system-design
order: 8
level: Advanced
minutes: 3
summary: Dual write — DB success + message failure se inconsistent state ban sakti hai.
tags: messaging, outbox, idempotency, sagas
visual: outbox-pattern
---

## Quick revision

> Revision target — Backlog, delivery, durable effects aur retries ke guarantees ko separately reason karo.

- Dual write — DB success + message failure se inconsistent state ban sakti hai.
- Outbox — data/event same commit; relay later publish kare.
- At-least-once — duplicates expected; consumer idempotent banao.
- Consumer transaction — event dedupe marker aur business effect same atomic boundary mein.
- Ordering — usually partition/key scope; global order costly.
- Retry — backoff + jitter + deadline + attempt limit.
- Retry amplification — layers ke retries multiply ho sakte hain; shared budget rakho.
- Backpressure — producers ko slow/reject; queue unlimited mat badhao.
- Drain time — backlog / (processing rate - arrival rate), jab processing faster ho.
- DLQ — failed messages ke owner, diagnosis aur safe replay ka plan.
- Saga — steps + compensations; distributed ACID rollback nahi.
- Poison message — deterministic failure ko endless retry mat karo; quarantine + diagnosis.
- Fencing token — newer lease owner ke token se stale worker writes reject.
- Replay — consumer schema, idempotency aur event retention safe reprocessing support kare.

### Edge cases aur reasoning

- Dedup retention — receipt cleanup ke baad delayed/replayed event duplicate effect kar sakta; replay horizon aur business identity align karo.
- Ack ordering — effect+dedupe commit ke baad broker ack; ack pehle ho aur crash aaye toh event lose ho sakta.
- Outbox ordering — multiple relay workers same aggregate events reorder kar sakte; sequence/version aur publish partition contract chahiye.

## Research notes: Budget retries across the call graph

- Dependency already struggle kar rahi ho tab retries aur capacity leti hain.

## Example se samjho

- Scenario — Queue backlog 600 jobs hai, worker capacity 50 jobs/s aur continuing arrivals 30 jobs/s assume karo.
- Reasoning — Net drain 20 jobs/s; stable rates par backlog clear hone ka rough time 30 seconds. New arrivals ignore karoge toh galat 12 seconds estimate milega.
- Catch — Arrival rate capacity tak ya usse upar ho toh finite drain time nahi; expensive jobs, retries aur downstream limits actual rate reduce kar sakte hain.

## Recall aur practice

- Sawal — Consumer commit ke baad ack se pehle crash kare toh expected behavior?
- Jawaab — Redelivery possible; same event ki durable dedupe check duplicate business effect roke, phir ack safely kare.
- Khud try karo — Outbox/consumer crash timeline likho; before commit, after publish, after effect commit aur delayed replay par invariants verify karo.

## Practice questions

### Easy · Dual write problem

```java
orderRepo.save(order);           // DB commit
kafka.send("order-created", ...); // crash yahan ho toh?
```

<details>
<summary>Answer</summary>

- Problem — DB aur broker do alag systems; ek succeed, doosra fail → order hai par event nahi (ya ulta).
- Fix — transactional outbox: event ko same DB transaction mein `outbox` table mein likho; relay baad mein publish kare.
- Alternative — CDC (log-based) jo outbox table stream kare.

</details>

### Medium · Outbox ki guarantees

<details>
<summary>Answer</summary>

- Delivery — at-least-once: relay publish ke baad crash → dobara publish.
- Consumers — idempotent hone chahiye (event id dedupe).
- Ordering — same aggregate ke events same partition key se; relay order mein publish kare.
- Cleanup — published rows mark/delete, retention policy.

</details>

### Medium · Idempotent consumer

`payment-captured` event do baar aaya aur customer ko do baar points mile.

<details>
<summary>Answer</summary>

- Table — `processed_events(event_id primary key)`.
- Same transaction — event id insert + points update; duplicate insert fail → skip.
- Ack — DB commit ke baad hi broker ko ack; warna crash par message lost.
- Retention — dedupe records broker ke redelivery window se zyada time tak rakho.

</details>

### Medium · Poison message aur DLQ

Ek malformed message consumer ko baar-baar crash karata hai aur poori queue atak gayi.

<details>
<summary>Answer</summary>

- Retries — limited attempts with backoff; non-retryable errors (validation) turant DLQ.
- DLQ — failed message + error reason; alert on DLQ growth.
- Replay — bug fix ke baad DLQ se controlled replay (idempotent consumers ki wajah se safe).
- Ordering — ek message ke liye poori partition block mat karo, jab tak strict ordering requirement na ho.

</details>

### Hard · Order saga

Order flow: inventory reserve → payment charge → shipment create. Payment fail ho toh? Orchestration vs choreography?

<details>
<summary>Answer</summary>

- Saga — local transactions ka sequence; failure par compensating actions (inventory release, payment refund).
- Orchestration — central orchestrator state machine chalaata hai; flow visible, single place for timeouts.
- Choreography — services events par react karti hain; loose coupling, par flow samajhna mushkil.
- Must — har step idempotent, timeouts (payment pending), compensation bhi retryable, saga state persisted.
- Isolation — beech ke states (reserved but unpaid) dusre users ko dikhte hain; holds expire hone chahiye.

</details>

## Sources — aur padhne ke liye

- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Source yahan padho — AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf)
- [Timeouts retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/08-messaging-reliability.md)
