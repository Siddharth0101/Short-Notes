# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Start with a narrow architecture

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
