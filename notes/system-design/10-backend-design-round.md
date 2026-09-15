---
id: system-design-backend-design-round
title: Java backend design interview and reservation correctness
track: system-design
order: 10
level: Advanced
minutes: 28
summary: Reservation ki correctness competing state transitions, especially expiry aur confirmation, par depend karti hai.
tags: backend, java, system-design, idempotency, transactions
visual: transaction-race
---

## Mental model — simple soch

Backend design ki starting point database brand nahi, invariant hai. Booking service mein one seat ki maximum one active reservation ho; confirmed payment traceable ho aur retries second logical booking create na karein. Availability and latency choices follow these correctness requirements.

> **Core takeaway:** Reservation ki correctness competing state transitions, especially expiry aur confirmation, par depend karti hai.

## Start with a narrow architecture

React client stateless Java API call karta hai jiske peeche relational DB hai. Reservation aur idempotency record same transaction mein rakho. Delivery wait required na ho toh async notification worker add karo. Scaling/ownership/isolation justify kare tab service split karo.

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

Key authenticated caller aur operation se scope karo. Different payload ke saath reused key conflict hai, valid retry nahi. Concurrent duplicates unique key/transaction se coordinate hon; preliminary existence check alone enough nahi.

## Payment and expiration races

Payment provider ka wait karte waqt DB transaction open mat rakho. Pending/confirmed/expired/cancelled transitions explicit rakho. Provider payment accept karke response lose kar sakta hai; unknown outcome stable provider ID se reconcile karo.

Expiry/confirmation race mein dono current state atomically verify karein. Late payment policy choose karo: reject+refund ya capacity available ho toh reacquire. Diagram business decision replace nahi karta.

## Scale the reads and protect the writes

Event descriptions/public availability hints cache kar sakte ho; capacity authoritative write par validate karo. Displayed seat reservation guarantee nahi. Replica stale ho sakti hai; immediate confirmation committed result ya explicit freshness policy use kare.

Event-based partitioning popular event ko hot partition bana sakti hai. Complex cross-partition coordination se pehle admission/waiting room write path protect kar sakte hain. Global queue single contended seat update faster nahi banati.

## Reliability and operations

Relay broker ack ke baad sent-mark se pehle crash kare toh outbox event twice publish ho sakta hai. Consumer durable ID dedup ko side effect se atomically coordinate kare where possible. External effect ke liye provider idempotency/reconciliation chahiye.

Reservation success, conflicts, lock/pool wait, event lag aur reconciliation backlog track karo. API/DB/payment mein operation ID correlate karo bina credentials/sensitive payload logs mein daale. Restore/replay test karo, sirf health nahi.

## Practice

Three timelines banao: two users one seat; payment success response lost; expiry/webhook race. Har boundary ka durable state, next transition aur user message batao. Peak writes/reads separately estimate aur first load-test bottleneck identify karo.

## Interview questions — bolkar practice karo

**Exactly-once delivery booking duplicate solve karti hai?** Claim ka scope hota hai. Business dedup ko stable identity aur side-effect boundary par atomic invariant phir bhi chahiye.

**Local lock multiple instances ki seats protect karega?** Nahi. All writers shared authority ya valid distributed ownership protocol se coordinate karein.

## Depth walkthrough — andar kya ho raha hai?

### Booking workflow mein “unknown” bhi real state hai

Client reserve request bhejti hai. Server commit karta hai, response network mein lost. Client timeout se booking failure conclude nahi kar sakti. Same idempotency identity par retry/status lookup se committed result recover karna hoga. New identity se duplicate booking risk create hota hai.

One seat ki active reservation invariant atomic conditional update/constraint own kare. Payment provider aur local database ek ordinary transaction share nahi karte. Provider success ke baad local update fail ho toh webhook/reconciliation recovery define karo. Expired reservation par late payment aaye toh re-acquire/refund/manual handling policy product decide kare.

Read cache catalog fast kar sakti hai; final seat claim authoritative write path se check hoga. Queue throughput smooth kar sakti hai, sold-out truth magically create nahi karti. Scale diagram se pehle durable state transitions prove karo.

**Practice:** Timeline table mein client action, local DB state, provider state, retry identity aur next recovery action columns banao. Duplicate webhook aur reversed event order include karo. “Exactly once” bolne ke bajay deduplication scope aur atomic boundary specify karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Payment confirmation aate waqt reservation expire hoti hai. Possible terminal outcomes aur forbidden outcome likho.

> **Hint — chhota ishara:** Expiry aur payment ko durable state par competing transitions samjho.

**Answer guide — pehle khud karo, phir compare karo:** Atomically decide karo ki confirmation active reservation consume kar sakti hai ya nahi. Expiry jeete toh payment refund/reconcile karo ya explicit new fulfillment decision lo. Already-reallocated seat ka silent promise kabhi mat karo. Transition history persist aur duplicate callbacks safe rakho.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[PostgreSQL concurrency](https://www.postgresql.org/docs/18/mvcc.html) mein transactions padho. [Java concurrency APIs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html) local coordination aur uska scope explain karti hain.
