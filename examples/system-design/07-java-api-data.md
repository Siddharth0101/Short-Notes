# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Begin with a modular service

```text
HTTP layer -> application use cases -> domain rules
                        |
                  persistence ports
                        |
                  SQL repositories
```

## Contracts and resource shape

```http
GET /api/notes?topic=java&limit=20&after=opaque-cursor
POST /api/notes
PATCH /api/notes/42
If-Match: "version-7"
```

```sql
-- Cursor: last page ka (created_at, id) pair
SELECT id, title, created_at
FROM notes
WHERE owner_id = :owner
  AND (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

```text
GET /dashboard
  -> orders service: list 20 orders          (1 call, 15 ms)
  -> for each order: user service GET /users/{id}   (20 calls × 20 ms)
  -> for each order: product service GET /products/{id} (20 calls × 20 ms)

Total: 41 network calls. Sequential: ~815 ms. Even fully parallel: ~55 ms
       but downstream ko 40 requests ek single user request se mile.
```

```sql
CREATE TABLE idempotency_key (
  key           text        NOT NULL,
  tenant_id     bigint      NOT NULL,
  request_hash  text        NOT NULL,   -- payload fingerprint
  status        text        NOT NULL,   -- in_progress | completed
  response_body jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, key)
);
```

## Capacity and pool reasoning

```text
demand   = 500 rps × 0.2 s = 100 connections needed
capacity = 20 connections
=> 80 requests/s worth of work ko wait karna padega

Queue build hoti hai -> pool wait time badhta hai
-> request timeout hota hai -> client retry karta hai
-> arrival rate 500 se 800 rps -> aur zyada queue
```
