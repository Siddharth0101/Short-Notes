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

> Revision target — Reservation state changes ko exact claim identity aur conditional transition se protect karo.

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

## Example se samjho

- Scenario — Reservation R expired ho chuki hai; first release stock once increment karta hai. Same expiry job retry hoti hai.
- Reasoning — Release active R ko expired mein transition kare tabhi stock return ho. Retry R already expired dekhe toh extra increment nahi; durable transition aur inventory effect consistent hon.
- Catch — Sirf SKU se release karna new reservation ko affect kar sakta hai; exact reservation identity/version check karo aur payment race ka losing outcome define karo.

## Recall aur practice

- Sawal — Expiry worker aur successful payment same waqt aaye toh sirf timer clear karna enough?
- Jawaab — Nahi; durable conditional state transition winner decide. Losing path defined refund/reconcile policy follow kare.
- Khud try karo — Last-item reservation interleaving show karo; two callers, expiry/payment race, lost response aur duplicate release par stock invariant verify karo.

## Practice questions

### Easy · Expiry kis clock se?

Seat hold 10 minute ke liye. Har app server apne `LocalDateTime.now()` se expiry check karta hai. Problem?

<details>
<summary>Answer</summary>

- Clock skew — servers ki clocks alag; ek server ke hisaab se expired, doosre ke hisaab se valid.
- Fix — expiry check DB time (`now()`) se atomic query mein: `WHERE held_until > now()`.
- Store — UTC timestamps; display par timezone.

</details>

### Medium · Overselling rokna

Concert ke 100 tickets; flash traffic mein 103 bik gaye. Kaise rokoge?

<details>
<summary>Answer</summary>

- Counter — `UPDATE events SET sold = sold + 1 WHERE id = ? AND sold < capacity`; row count 0 = sold out.
- Per-seat — `seats(seat_id, status, holder)` + conditional update `WHERE status = 'available'`.
- Unique claim — `UNIQUE (event_id, seat_id)` on bookings.
- Read-then-write check (`SELECT sold` phir `UPDATE`) concurrency mein fail.

</details>

### Medium · Payment aur hold expiry ki race

User ne payment kiya, par payment success webhook hold expire hone ke 5 second baad aaya. Seat kisi aur ko mil chuki thi.

<details>
<summary>Answer</summary>

- Atomic transition — webhook par `UPDATE holds SET status = 'confirmed' WHERE id = ? AND status = 'held'` (expired holds pehle hi `expired` mark).
- Lose case — confirm fail → automatic refund + user ko clear message.
- Reduce — payment start par hold extend (grace), ya payment intent ko hold expiry se pehle hi limit.
- Source of truth — reservation state machine, payment provider status reconcile.

</details>

### Medium · Booking API idempotent banao

<details>
<summary>Answer</summary>

- Client — har booking attempt ke liye `Idempotency-Key`.
- Server — key + user ke saath result store; retry par wahi booking return.
- DB — booking insert aur key record same transaction.
- Payment — provider ko bhi idempotency key pass karo (double charge nahi).

</details>

### Hard · Flash sale at scale

1 lakh users ek saath 1000 discounted items ke liye aate hain. Design?

<details>
<summary>Answer</summary>

- Front door — waiting room/queue tokens; rate limits; bots ke liye protection.
- Inventory — fast atomic counter (Redis `DECR`, negative par rollback) as gate; final truth DB conditional updates.
- Holds — short expiry; payment window; release on timeout.
- Reconciliation — counter vs DB mismatch detect aur fix.
- Fairness — requirement clarify (first-come vs lottery); communication: "sold out" jaldi batao.

</details>

## Sources — aur padhne ke liye

- [PostgreSQL concurrency](https://www.postgresql.org/docs/18/mvcc.html)
- [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/10-backend-design-round.md)
