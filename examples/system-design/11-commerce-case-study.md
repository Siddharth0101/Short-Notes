# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Scope and assumed workload

```text
React storefront -> CDN -> catalog reads -> cache -> product DB
        |
        +-> Java checkout -> order DB + outbox
                  |               |
              inventory       event broker
                  |
              payment provider
```

```text
30,000 users ek product page par, sale 12:00:00 par start
12:00:00-12:00:10 window mein sab "Buy" dabate hain

checkout attempts ≈ 30,000 in 10 s = 3,000 rps
   (normal peak 2,320 reads/s tha, aur writes 0.12/s)
inventory row par load: 3,000 attempts/s; concurrent attempts latency par depend hain
successful orders: maximum 500 — baaki 29,500 ko fail karna hai, fast
```

## API contracts

```http
POST /api/checkout/intents
Idempotency-Key: 018f2c1a-7b3e-7c9d-9f21-3a4b5c6d7e8f
Content-Type: application/json

{ "cartId": "cart_9x2", "addressId": "addr_44", "shippingMethod": "standard" }

201 Created
{
  "intentId": "int_7Kq",
  "status": "requires_payment",
  "lineItems": [{ "sku": "SKU-1", "qty": 2, "unitPriceMinor": 49900 }],
  "totals": { "subtotalMinor": 99800, "shippingMinor": 4900, "taxMinor": 8700,
              "grandTotalMinor": 113400, "currency": "INR" },
  "priceQuoteExpiresAt": "2026-09-11T12:14:00Z",
  "reservationExpiresAt": "2026-09-11T12:14:00Z",
  "paymentClientSecret": "pi_..._secret_..."
}

409 Conflict   -> same Idempotency-Key, different payload fingerprint
422 Unprocessable -> item unavailable, price changed beyond tolerance
```

```http
GET /api/checkout/intents/int_7Kq
200 OK
{ "intentId": "int_7Kq", "status": "processing", "orderId": null,
  "pollAfterMs": 1000 }

# status: requires_payment | processing | requires_action | confirmed | failed | expired
```

```http
POST /api/webhooks/payments
Stripe-Signature: t=...,v1=...

# Server: signature verify -> event_id se dedupe -> allowed transition apply
# 200 turant return karo, heavy processing async karo (provider timeout hota hai)
```

## Data model sketch

```sql
CREATE TABLE checkout_intent (
  id                text PRIMARY KEY,
  user_id           bigint NOT NULL,
  idempotency_key   text   NOT NULL,
  request_hash      text   NOT NULL,
  status            text   NOT NULL,        -- state machine ke values
  quote_json        jsonb  NOT NULL,        -- frozen prices at quote time
  quote_expires_at  timestamptz NOT NULL,
  order_id          bigint REFERENCES orders(id),
  UNIQUE (user_id, idempotency_key)
);

CREATE TABLE inventory (
  sku        text PRIMARY KEY,
  on_hand    int  NOT NULL CHECK (on_hand >= 0),
  reserved   int  NOT NULL CHECK (reserved >= 0)
  -- available = on_hand - reserved (derived, store mat karo)
);

CREATE TABLE reservation (
  id          bigserial PRIMARY KEY,
  intent_id   text NOT NULL REFERENCES checkout_intent(id),
  sku         text NOT NULL,
  qty         int  NOT NULL CHECK (qty > 0),
  state       text NOT NULL,   -- held | committed | released
  expires_at  timestamptz NOT NULL,
  UNIQUE (intent_id, sku)
);

CREATE TABLE payment_attempt (
  id                bigserial PRIMARY KEY,
  intent_id         text NOT NULL REFERENCES checkout_intent(id),
  provider_ref      text UNIQUE,            -- provider ka payment intent id
  provider_idem_key text NOT NULL,
  status            text NOT NULL,          -- initiated | succeeded | failed | unknown
  amount_minor      bigint NOT NULL,
  UNIQUE (intent_id, provider_idem_key)
);

CREATE TABLE processed_webhook (
  event_id    text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now()
);
```

## Concurrency and inventory

```sql
UPDATE inventory
SET available = available - :quantity
WHERE product_id = :id AND available >= :quantity;
```

```java
// Deterministic ordering se circular wait structurally impossible ho jaata hai
List<CartLine> lines = cart.lines().stream()
    .sorted(Comparator.comparing(CartLine::sku))
    .toList();
for (CartLine line : lines) {
    int updated = inventory.tryReserve(line.sku(), line.qty()); // atomic conditional update
    if (updated == 0) throw new OutOfStockException(line.sku()); // poori transaction rollback
}
```

## The hardest correctness problem: payment confirmed, reservation already expired

```text
12:00:00  reservation banti hai, expires_at = 12:15:00
12:00:05  payment provider par charge initiate hota hai
12:00:06  user ko 3D Secure/bank OTP screen milti hai
12:14:50  user abhi bhi OTP page par hai (bank slow tha)
12:15:00  expiry job chalti hai -> reservation released -> stock wapas available
12:15:30  koi aur buyer wahi last unit khareed leta hai
12:16:10  bank confirm karta hai -> provider webhook: payment succeeded

ab: paisa liya ja chuka hai, lekin stock available nahi hai
```

```sql
-- Expiry job sirf un reservations ko release kare jinka payment shuru hi nahi hua,
-- aur release ko conditional rakho taaki concurrent transition na haare
UPDATE reservation
SET state = 'released'
WHERE state = 'held'                  -- payment_pending ko kabhi nahi chhuta
  AND expires_at < now()
RETURNING id, sku, qty;
```

## Failure scenarios

```text
requires_payment -> processing        allowed
processing       -> confirmed         allowed
processing       -> failed            allowed
confirmed        -> failed            REJECTED (log karo, alert karo)
confirmed        -> confirmed         no-op (duplicate webhook)
failed           -> confirmed         allowed only via reconciliation, with audit
```
