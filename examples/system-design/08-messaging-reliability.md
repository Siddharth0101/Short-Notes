# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## The dual-write problem

```text
single database transaction
  update order status
  insert outbox(event_id, aggregate_id, version, payload)
          |
        commit
          |
relay -> broker -> consumer transaction
                    insert processed_event(event_id UNIQUE)
                    apply business update
```

```java
@Transactional
public void handle(OrderPaidEvent event) {
    try {
        // Unique constraint on event_id — yeh hi asli dedupe mechanism hai
        processedEvents.insert(event.id(), Instant.now());
    } catch (DuplicateKeyException alreadyHandled) {
        return; // Safe skip: pichhli baar business write commit ho chuki thi
    }
    shipments.createFor(event.orderId());   // same transaction
    // commit: dono saath, ya dono nahi
}
```

```text
insert processed_event + set notification_state = 'pending'   [commit]
                     |
       external call with provider idempotency key
                     |
set notification_state = 'sent' with provider message id       [commit]
```

## Backpressure and retry budgets

```text
backlog        = 1,800,000 events
worker rate    = 1,500/s
arrival rate   = 2,000/s  (abhi bhi aa rahe hain)

drain rate = 1,500 - 2,000 = -500/s  -> kabhi drain nahi hoga
```

```text
drain rate = 1,500 - 800 = 700/s
drain time = 1,800,000 / 700 ≈ 2,571 s ≈ 43 minutes
```

```text
browser retry (2) × gateway retry (3) × service retry (3) = 18 attempts
ek user click se 18 downstream calls, jab dependency already struggling hai
```

## Sagas and compensation

```text
reserve inventory  (compensate: release)         <- easily reversible
charge payment     (compensate: refund)          <- reversible with delay/cost
create shipment    (compensate: cancel if unshipped)
send confirmation  (compensate: none possible)   <- last, always
```
