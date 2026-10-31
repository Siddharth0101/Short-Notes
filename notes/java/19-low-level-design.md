---
id: java-low-level-design
title: Low-level design — requirements se classes aur invariants tak
track: java
order: 19
level: Advanced
minutes: 3
summary: LLD — requirements ko objects, responsibilities aur contracts mein badlo.
tags: lld, oop, design, concurrency, contracts
---

## Quick revision

> Revision target — Requirements se responsibilities, allowed transitions aur atomic business operation derive karo.

- LLD — requirements ko objects, responsibilities aur contracts mein badlo.
- Invariant — business rule har valid operation ke baad bache.
- SRP — class ki ek clear responsibility/change reason.
- Open/closed — extension points do; har change ke liye giant switch na badhao.
- Liskov — subtype base contract na tode.
- Strategy — interchangeable behavior; factory — creation ka decision.
- Composition — inheritance se pehle delegation consider karo.
- Concurrency — shared invariant ko atomic boundary ke andar enforce karo.
- Testing — public behavior aur failure paths verify karo.
- Interface segregation — client ko unnecessary methods implement/use karne par force mat karo.
- State machine — allowed transitions explicit; invalid order of operations reject karo.
- Composition root — dependencies ek clear assembly point par wire karo.

### Edge cases aur reasoning

- Dependency direction — high-level rule low-level provider contract par directly tightly coupled na ho; narrow ports/adapters se ownership clear rakho.
- Pattern fit — strategy/factory actual variation solve kare; interview mein pattern name se pehle requirement/invariant explain karo.
- Atomic model boundary — several object methods separately safe hon tab bhi combined booking operation ka invariant transaction/lock se protect karo.

## Example se samjho

- Scenario — MeetingRoom reserve(room,start,end) same room par overlapping booking reject kare; cancellation sirf active booking par once ho.
- Reasoning — Room policy overlap decide kare, booking identity lifecycle track kare, repository atomic claim enforce kare. Fake clock/repository se failure paths test ho sakte hain.
- Catch — Availability getter ke baad separate save two callers ko same slot de sakta hai; class diagram ke saath whole reservation boundary bhi define karo.

## Recall aur practice

- Sawal — Library checkout ke liye synchronized getters/setters separately enough kyun nahi?
- Jawaab — Availability check aur loan creation beech interleave ho sakte hain; whole claim ko shared atomic boundary chahiye.
- Khud try karo — Library lending LLD banao; one-copy/two-users race, repeated request, overdue policy aur persistence failure ka exact contract do.

## Practice questions

### Easy · Single responsibility

```java
class ReportService {
    List<Row> fetch() { /* SQL */ }
    byte[] toPdf(List<Row> rows) { /* layout */ }
    void email(byte[] pdf) { /* SMTP */ }
}
```

Isme kya problem hai?

<details>
<summary>Answer</summary>

- Teen reasons to change — query, PDF layout aur email provider ek class mein.
- Split — `ReportRepository`, `PdfRenderer`, `ReportMailer`; `ReportService` sirf orchestrate kare.
- Fayda — PDF test bina DB; email provider badlo bina report logic chhue.

</details>

### Medium · Parking lot ke entities aur invariants

<details>
<summary>Answer</summary>

- Entities — `ParkingLot`, `Level`, `Spot` (size), `Vehicle` (type), `Ticket`, `Payment`, `PricingPolicy`.
- Invariants — ek spot par ek vehicle; vehicle sirf compatible size wale spot mein; ek active ticket per vehicle; exit par fee paid.
- Behaviour — `park(vehicle) → Ticket`, `unpark(ticket) → Fee`; spot allocation strategy pluggable (nearest, by level).
- Concurrency — do gates same spot allocate na karein (atomic allocate).

</details>

### Medium · Discount rules ke liye Strategy

Checkout mein festival, coupon aur loyalty discount — aur naye aate rahenge. `if/else` chain ki jagah design?

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

- Open/closed — naya rule naya class; checkout code same.
- Policy explicit — "best one" ya "stack all" business rule likh ke rakho.
- Test — har rule alag unit test.

</details>

### Medium · Order state machine

Order states: `CREATED → PAID → SHIPPED → DELIVERED`, aur `CANCELLED` sirf ship se pehle. Invalid transitions kaise rokoge?

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

- Ek jagah — `Order.moveTo(next)` check karke throw kare; setters public na hon.
- Persistence — DB update bhi conditional ho: `WHERE id = ? AND status = 'PAID'`, taaki concurrent transitions na takrayein.

</details>

### Hard · Seat booking race

Movie booking mein do users same seat ek saath book karte hain. In-memory aur DB dono level par design?

<details>
<summary>Answer</summary>

- In-memory (single instance) — `ConcurrentHashMap<SeatId, BookingId>` aur `putIfAbsent`; `null` mila toh jeete.
- Multi-instance (real) — DB `UNIQUE (show_id, seat_id)` on bookings; insert fail = seat taken. Ya `UPDATE seats SET held_by = ? WHERE id = ? AND held_by IS NULL` row count check.
- Hold expiry — payment ke liye temporary hold + `held_until`; expired holds release.
- Idempotency — retry par same booking return, duplicate charge nahi.

</details>

## Sources — aur padhne ke liye

- [ConcurrentHashMap atomic operations](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Clock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Clock.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/19-low-level-design.md)
