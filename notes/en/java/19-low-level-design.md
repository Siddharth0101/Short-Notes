---
id: java-low-level-design
title: Low-level design — from requirements to classes and invariants
track: java
order: 19
level: Advanced
minutes: 3
summary: LLD — turn requirements into objects, responsibilities and contracts.
tags: lld, oop, design, concurrency, contracts
---

## Quick revision

> Revision target — Derive responsibilities, allowed transitions and the atomic business operation from the requirements.

- LLD — turn requirements into objects, responsibilities and contracts.
- Invariant — a business rule that holds after every valid operation.
- SRP — one clear responsibility/reason to change for a class.
- Open/closed — provide extension points; do not grow a giant switch for every change.
- Liskov — a subtype must not break the base contract.
- Strategy — interchangeable behaviour; factory — the creation decision.
- Composition — consider delegation before inheritance.
- Concurrency — enforce a shared invariant inside an atomic boundary.
- Testing — verify public behaviour and failure paths.
- Interface segregation — do not force a client to implement/use unnecessary methods.
- State machine — explicit allowed transitions; reject an invalid order of operations.
- Composition root — wire the dependencies at one clear assembly point.

### Edge cases and reasoning

- Dependency direction — a high-level rule must not be tightly coupled directly to a low-level provider contract; keep ownership clear with narrow ports/adapters.
- Pattern fit — a strategy/factory should solve an actual variation; in an interview explain the requirement/invariant before the pattern name.
- Atomic model boundary — even when several object methods are safe separately, protect the invariant of the combined booking operation with a transaction/lock.

## Understand it with an example

- Scenario — MeetingRoom reserve(room,start,end) should reject an overlapping booking on the same room; cancellation happens once, only on an active booking.
- Reasoning — The room policy decides the overlap, the booking identity tracks the lifecycle, and the repository enforces the atomic claim. Failure paths can be tested with a fake clock/repository.
- Catch — A separate save after an availability getter can give two callers the same slot; define the whole reservation boundary along with the class diagram.

## Recall and practice

- Question — Why are synchronized getters/setters, each on their own, not enough for a library checkout?
- Answer — The availability check and the loan creation can interleave; the whole claim needs a shared atomic boundary.
- Try it yourself — Build a library lending LLD; give the exact contract for a one-copy/two-users race, a repeated request, the overdue policy and a persistence failure.

## Practice questions

### Easy · Single responsibility

```java
class ReportService {
    List<Row> fetch() { /* SQL */ }
    byte[] toPdf(List<Row> rows) { /* layout */ }
    void email(byte[] pdf) { /* SMTP */ }
}
```

What is the problem with this?

<details>
<summary>Answer</summary>

- Three reasons to change — the query, the PDF layout and the email provider in one class.
- Split — `ReportRepository`, `PdfRenderer`, `ReportMailer`; `ReportService` only orchestrates.
- Benefit — test the PDF without a DB; change the email provider without touching the report logic.

</details>

### Medium · The entities and invariants of a parking lot

<details>
<summary>Answer</summary>

- Entities — `ParkingLot`, `Level`, `Spot` (size), `Vehicle` (type), `Ticket`, `Payment`, `PricingPolicy`.
- Invariants — one vehicle per spot; a vehicle only in a spot of a compatible size; one active ticket per vehicle; the fee paid on exit.
- Behaviour — `park(vehicle) → Ticket`, `unpark(ticket) → Fee`; a pluggable spot allocation strategy (nearest, by level).
- Concurrency — two gates must not allocate the same spot (an atomic allocate).

</details>

### Medium · Strategy for discount rules

Checkout has festival, coupon and loyalty discounts — and new ones will keep coming. The design instead of an `if/else` chain?

<details>
<summary>Answer</summary>

```java
interface DiscountRule {
    boolean applies(Cart cart);
    Money discount(Cart cart);
}

Money bestDiscount(Cart cart, List<DiscountRule> rules) {
    return rules.stream()
        .filter(rule -> rule.applies(cart))
        .map(rule -> rule.discount(cart))
        .max(Comparator.naturalOrder())
        .orElse(Money.ZERO);
}
```

- Open/closed — a new rule is a new class; the checkout code stays the same.
- Explicit policy — write down the business rule: "best one" or "stack all".
- Test — a separate unit test for every rule.

</details>

### Medium · Order state machine

Order states: `CREATED → PAID → SHIPPED → DELIVERED`, and `CANCELLED` only before shipping. How do you prevent invalid transitions?

<details>
<summary>Answer</summary>

```java
enum OrderStatus {
    CREATED, PAID, SHIPPED, DELIVERED, CANCELLED;
    boolean canMoveTo(OrderStatus next) {
        return switch (this) {
            case CREATED -> next == PAID || next == CANCELLED;
            case PAID -> next == SHIPPED || next == CANCELLED;
            case SHIPPED -> next == DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
    }
}
```

- One place — `Order.moveTo(next)` checks and throws; the setters are not public.
- Persistence — the DB update is conditional too: `WHERE id = ? AND status = 'PAID'`, so that concurrent transitions do not collide.

</details>

### Hard · Seat booking race

In movie booking two users book the same seat at once. The design at both the in-memory and the DB level?

<details>
<summary>Answer</summary>

- In-memory (single instance) — a `ConcurrentHashMap<SeatId, BookingId>` and `putIfAbsent`; whoever gets `null` wins.
- Multi-instance (real) — DB `UNIQUE (show_id, seat_id)` on bookings; a failed insert = seat taken. Or `UPDATE seats SET held_by = ? WHERE id = ? AND held_by IS NULL` with a row count check.
- Hold expiry — a temporary hold for payment + `held_until`; release expired holds.
- Idempotency — a retry returns the same booking, with no duplicate charge.

</details>

## Sources — further reading

- [ConcurrentHashMap atomic operations](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Clock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Clock.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/19-low-level-design.md)
