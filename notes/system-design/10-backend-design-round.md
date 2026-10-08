---
id: system-design-backend-design-round
title: Java backend design interview and reservation correctness
track: system-design
order: 10
level: Advanced
minutes: 3
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
- Unique claim — conditional write/constraint winner decide kare; loser ko deterministic conflict response.
- Reservation token — release exact active claim match kare; old retry new reservation na hataaye.
- Clock boundary — expiry ke authoritative clock aur delayed worker behavior define.

### Edge cases aur reasoning

- Payment/expiry race — payment confirmation aur expiry worker same reservation version/state par conditional transition kare; double release/late confirmation prevent karo.
- Lease clock ownership — client countdown display aid; authoritative expiration server/database contract se, stale worker writes version/fencing guard se.
- Fairness requirement — first successful atomic claim necessarily human first click nahi; strict queue/fairness requirement ho toh separate ordering design chahiye.

## Recall aur practice

- Sawal — Expiry worker aur successful payment same waqt aaye toh sirf timer clear karna enough?
- Jawaab — Nahi; durable conditional state transition winner decide. Losing path defined refund/reconcile policy follow kare.
- Khud try karo — Last-item reservation interleaving show karo; two callers, expiry/payment race, lost response aur duplicate release par stock invariant verify karo.

## Sources — aur padhne ke liye

- [PostgreSQL concurrency](https://www.postgresql.org/docs/18/mvcc.html)
- [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/10-backend-design-round.md)
