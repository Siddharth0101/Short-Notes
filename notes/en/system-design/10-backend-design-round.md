---
id: system-design-backend-design-round
title: Java backend design interview and reservation correctness
track: system-design
order: 10
level: Advanced
minutes: 3
summary: Reservation — claim available stock with an atomic check-and-decrement.
tags: backend, java, system-design, idempotency, transactions
visual: transaction-race
---

## Quick revision

> Revision target — Protect reservation state changes with an exact claim identity and a conditional transition.

- Reservation — claim available stock with an atomic check-and-decrement/claim.
- Overselling — a separate read-then-write races; enforce the invariant in the database.
- Idempotency — a duplicate request reuses the same reservation/result.
- Expiry — define the reservation lifecycle and the release worker.
- Payment uncertainty — do not take a timeout as proof of failure; reconcile.
- Concurrency — choose the conflict/lock strategy from the workload and contention.
- Evidence — walk through the duplicate, concurrent, timeout and retry cases.
- Unique claim — a conditional write/constraint decides the winner; a deterministic conflict response for the loser.
- Reservation token — a release must match the exact active claim; an old retry must not remove a new reservation.
- Clock boundary — define the authoritative clock for expiry and the delayed-worker behaviour.

### Edge cases and reasoning

- Payment/expiry race — payment confirmation and the expiry worker do a conditional transition on the same reservation version/state; prevent a double release/late confirmation.
- Lease clock ownership — the client countdown is a display aid; authoritative expiration comes from the server/database contract, and stale worker writes are stopped by a version/fencing guard.
- Fairness requirement — the first successful atomic claim is not necessarily the first human click; a strict queue/fairness requirement needs a separate ordering design.

## Understand it with an example

- Scenario — Reservation R has expired; the first release increments the stock once. The same expiry job is retried.
- Reasoning — Stock should return only when the release transitions the active R to expired. If the retry sees R already expired, there is no extra increment; the durable transition and the inventory effect stay consistent.
- Catch — Releasing by SKU alone can affect a new reservation; check the exact reservation identity/version and define the losing outcome of the payment race.

## Recall and practice

- Question — If the expiry worker and a successful payment arrive at the same time, is just clearing the timer enough?
- Answer — No; a durable conditional state transition decides the winner. The losing path follows a defined refund/reconcile policy.
- Try it yourself — Show a last-item reservation interleaving; verify the stock invariant for two callers, an expiry/payment race, a lost response and a duplicate release.

## Practice questions

### Easy · Which clock decides expiry?

A seat hold lasts 10 minutes. Every app server checks expiry with its own `LocalDateTime.now()`. The problem?

<details>
<summary>Answer</summary>

- Clock skew — the servers' clocks differ; expired according to one server, valid according to another.
- Fix — check expiry against DB time (`now()`) in an atomic query: `WHERE held_until > now()`.
- Store — UTC timestamps; the timezone at display time.

</details>

### Medium · Preventing overselling

100 tickets for a concert; 103 were sold in flash traffic. How do you prevent it?

<details>
<summary>Answer</summary>

- Counter — `UPDATE events SET sold = sold + 1 WHERE id = ? AND sold < capacity`; row count 0 = sold out.
- Per-seat — `seats(seat_id, status, holder)` + a conditional update `WHERE status = 'available'`.
- Unique claim — `UNIQUE (event_id, seat_id)` on bookings.
- A read-then-write check (`SELECT sold` then `UPDATE`) fails under concurrency.

</details>

### Medium · The race between payment and hold expiry

The user paid, but the payment success webhook arrived 5 seconds after the hold expired. The seat had already gone to someone else.

<details>
<summary>Answer</summary>

- Atomic transition — on the webhook, `UPDATE holds SET status = 'confirmed' WHERE id = ? AND status = 'held'` (expired holds are already marked `expired`).
- Lose case — the confirm fails → an automatic refund + a clear message to the user.
- Reduce — extend the hold when payment starts (grace), or limit the payment intent to before the hold expiry.
- Source of truth — the reservation state machine, reconciled with the payment provider's status.

</details>

### Medium · Make the booking API idempotent

<details>
<summary>Answer</summary>

- Client — an `Idempotency-Key` for every booking attempt.
- Server — stores the result with the key + user; a retry returns the same booking.
- DB — the booking insert and the key record in the same transaction.
- Payment — pass an idempotency key to the provider too (no double charge).

</details>

### Hard · Flash sale at scale

100,000 users arrive at once for 1000 discounted items. The design?

<details>
<summary>Answer</summary>

- Front door — a waiting room/queue tokens; rate limits; protection against bots.
- Inventory — a fast atomic counter (Redis `DECR`, roll back on negative) as the gate; the final truth is conditional updates in the DB.
- Holds — a short expiry; a payment window; release on timeout.
- Reconciliation — detect and fix a counter vs DB mismatch.
- Fairness — clarify the requirement (first-come vs lottery); communication: say "sold out" early.

</details>

## Sources — further reading

- [PostgreSQL concurrency](https://www.postgresql.org/docs/18/mvcc.html)
- [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/10-backend-design-round.md)
