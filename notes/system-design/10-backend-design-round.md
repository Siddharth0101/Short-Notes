---
id: system-design-backend-design-round
title: Java backend design interview and reservation correctness
track: system-design
order: 10
level: Advanced
minutes: 1
summary: Reservation — available stock ko atomic check-and-decrement/claim karo.
tags: backend, java, system-design, idempotency, transactions
visual: transaction-race
---

## Quick revision

- Reservation — available stock ko atomic check-and-decrement/claim karo.
- Overselling — separate read-then-write race karta hai; database invariant enforce karo.
- Idempotency — duplicate request same reservation/result reuse kare.
- Expiry — reservation lifecycle aur release worker define karo.
- Payment uncertainty — timeout ko failure ka proof mat maano; reconcile karo.
- Concurrency — conflict/lock strategy workload aur contention se choose.
- Evidence — duplicate, concurrent, timeout aur retry cases walkthrough karo.

## Sources — aur padhne ke liye

- [PostgreSQL concurrency](https://www.postgresql.org/docs/18/mvcc.html)
- [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/10-backend-design-round.md)
