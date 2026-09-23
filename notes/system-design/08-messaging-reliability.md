---
id: design-messaging-reliability
title: Messaging outbox retries and distributed workflows
track: system-design
order: 8
level: Advanced
minutes: 1
summary: Dual write — DB success + message failure se inconsistent state ban sakti hai.
tags: messaging, outbox, idempotency, sagas
visual: outbox-pattern
---

## Quick revision

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

## Research notes: Budget retries across the call graph

- Dependency already struggle kar rahi ho tab retries aur capacity leti hain.

## Sources — aur padhne ke liye

- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Source yahan padho — AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf)
- [Timeouts retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/08-messaging-reliability.md)
