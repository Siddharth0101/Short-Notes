# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trust boundaries

```text
untrusted browser
      |
 TLS + request limits
      |
authentication -> resource authorization -> validated use case
                                              |
                                      least-privilege storage
```

```java
// Vulnerable: authenticated hai, lekin authorized nahi
@GetMapping("/api/notes/{id}")
Note get(@PathVariable long id) {
    return noteRepository.findById(id).orElseThrow();
}
// Koi bhi logged-in user /api/notes/9137 hit karke doosre ka note padh sakta hai
```

## SLO and alert example

```text
http_requests_total{endpoint, method, status, region}
  50 endpoints × 5 methods × 8 statuses × 3 regions = 6,000 time series  -> theek hai

usme user_id label add kar do:
  6,000 × 100,000 users = 600,000,000 time series  -> metrics backend gir jaayegi
```

## Safe release and recovery

```text
week 1  add nullable column new_status; naya code dono likhe, purana padhe
week 1  deploy (rollback safe: purana code naya column ignore karta hai)
week 2  backfill batch job — chunked, throttled, resumable
week 2  naya code new_status se padhna shuru kare (feature flag ke peeche)
week 3  verify: koi bhi code path old_status nahi padh raha (metrics se confirm)
week 4  drop old_status  <- yahi wo irreversible step hai
```
