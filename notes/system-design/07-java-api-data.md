---
id: design-java-api-data
title: Java backend API and data architecture
track: system-design
order: 7
level: Intermediate
minutes: 26
summary: Domain boundaries, contracts aur concurrent writes ko deliberate design karo.
tags: java, api, data-modeling, consistency
visual: request-flow
---

## Mental model

Backend business invariants ka authority hai. React buttons hide karne se authorization enforce nahi hoti. API design transport details ko stable use cases mein translate karta hai. Data model query needs and correctness requirements support kare; tables ko random entity nouns se create karna enough nahi.

> **Core takeaway:** The service boundary should enforce business invariants and own persistence decisions.

## Begin with a modular service

```text
HTTP layer -> application use cases -> domain rules
                        |
                  persistence ports
                        |
                  SQL repositories
```

Notes module content own kare, progress module study state own kare, account module identity reference kare. Same database initially local transactions simplify kar sakti hai. Module boundaries enforce karo so future extraction possible ho, lekin network hop tabhi add karo jab need ho.

## Contracts and resource shape

```http
GET /api/notes?topic=java&limit=20&after=opaque-cursor
POST /api/notes
PATCH /api/notes/42
If-Match: "version-7"
```

Stable pagination sorting mein unique tie-breaker chahiye. Cursor client ke liye opaque rakho; authorization and validation still apply hoti hain. Conditional update lost-update detection support kar sakti hai: client base representation tag send kare, server mismatch par 412 return kare. HTTP method idempotence ka meaning intended server effect hai, response body necessarily identical hona nahi. [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

DTOs input/output contract define karein. Persistence entity directly expose karne se schema changes API break kar sakte hain and sensitive fields leak ho sakti hain. Error object stable code and safe detail de. Backward-compatible addition usually easier hai than field removal; consumer usage and version policy plan karo.

### Offset pagination kyun 10x par todta hai

`LIMIT 20 OFFSET 0` fast hai; `LIMIT 20 OFFSET 100000` nahi. Database ko pehle 100,000 rows scan karke discard karne padte hain, phir 20 return karne hote hain — cost offset ke saath linearly badhti hai:

| Offset | Rows database ko touch karne padte hain | Typical latency |
| --- | --- | --- |
| 0 | 20 | ~2 ms |
| 1,000 | 1,020 | ~5 ms |
| 100,000 | 100,020 | ~200-800 ms |

Iske do consequences hain. Ek, deep pages user ke liye slow hain — lekin usually koi page 5,000 tak nahi jaata, toh yeh apne aap mein emergency nahi. Do, aur yeh asli problem hai: crawlers aur export scripts *deliberately* deep offsets hit karte hain, aur wahi queries connection pool ko seconds tak hold karti hain. Ek export job jo 500 pages fetch karta hai poore service ki tail latency kharab kar deta hai.

Keyset (cursor) pagination isse structurally fix karta hai — har page ka cost constant rehta hai:

```sql
-- Cursor: last page ka (created_at, id) pair
SELECT id, title, created_at
FROM notes
WHERE owner_id = :owner
  AND (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

`(owner_id, created_at DESC, id DESC)` par composite index ho toh database seedha starting point par seek karta hai. Tie-breaker `id` mandatory hai — bina uske same `created_at` wale rows page boundaries par duplicate ya skip ho sakte hain, aur yeh bug production mein months tak notice nahi hota. Tradeoff: keyset "jump to page 47" support nahi karta. Agar product ko numbered pages chahiye hi, toh offset rakho lekin ek maximum offset enforce karo (jaise 10,000) aur bulk access ke liye alag export API do.

### N+1 sirf ORM problem nahi hai

Classic N+1: 20 notes fetch kiye, phir har note ka author lazily load hua — 1 + 20 = 21 queries. Har query 2 ms bhi ho toh 42 ms, aur 20 connection acquisitions. `JOIN FETCH` ya batch loading se yeh 1-2 queries ho jaata hai.

Lekin same shape API gateway/BFF layer par bhi dohrata hai, aur wahan zyada mehenga hai kyunki har hop network hai, in-process nahi:

```text
GET /dashboard
  -> orders service: list 20 orders          (1 call, 15 ms)
  -> for each order: user service GET /users/{id}   (20 calls × 20 ms)
  -> for each order: product service GET /products/{id} (20 calls × 20 ms)

Total: 41 network calls. Sequential: ~815 ms. Even fully parallel: ~55 ms
       but downstream ko 40 requests ek single user request se mile.
```

Yahan do costs hain jo alag hain. Latency parallelism se theek ho jaati hai. Load amplification nahi hoti — 1,000 dashboard rps ka matlab user service ke liye 20,000 rps hai, aur wahi amplification 10x traffic par downstream ko pehle giraati hai. Fix batch endpoints hain (`GET /users?ids=1,2,3`) ya dataloader-style request-scoped batching plus a short-TTL cache un entities ke liye jo ek hi response mein baar-baar repeat hote hain.

### Write path idempotency

POST inherently idempotent nahi hai, isliye retry-safe banane ke liye explicit mechanism chahiye. Minimum viable design:

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

Flow: request aane par row insert karne ki koshish karo. Insert succeed hua toh tum owner ho, business work karo, phir same transaction mein status `completed` aur response store karo. Insert unique-violation de toh existing row dekho — `completed` hai aur `request_hash` match karta hai toh stored response return karo; `in_progress` hai toh 409 ya retry-after do; hash mismatch hai toh 422 (same key, different payload — client bug hai, silently accept mat karo). Key ko tenant se scope karna zaroori hai warna ek tenant doosre ki key guess karke uska response padh sakta hai.

Retention bhi decide karo: keys hamesha ke liye rakhna table ko unbounded banata hai. 24-48 hours typical hai, aur wo window client ke retry policy se lamba hona chahiye.

## Database correctness

Suppose bookmark table unique `(user_id, note_id)` rakhti hai. App duplicate check helpful UX de sakta hai, but unique constraint concurrent duplicates prevent karta hai. Tenant predicates queries mein consistently apply karo. Deletion policy decide karo: cascade, restrict, soft deletion or archival; each query complexity and retention consequence rakhta hai.

Transaction isolation chosen database pe verify karo. PostgreSQL Read Committed statement-level snapshots use karta hai; Repeatable Read and Serializable stronger, different guarantees and retry situations provide karte hain. Serializable transaction failure ko application retry karna pad sakta hai, and complete business operation safe retry hona chahiye. [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

## Capacity and pool reasoning

Assume 500 requests/s and average database connection hold time 20 ms: idealized average busy connections approximately 10 hai. Real pool sizing headroom, bursts, multiple queries, database CPU and competing services consider karegi. Pool 500 karna average demand se justified nahi. Observe pool wait and database saturation before increasing it.

Ab dekho ki yeh 10x par kaise todta hai. Suppose ek downstream dependency slow ho gayi aur average hold time 20 ms se 200 ms ho gaya (kyunki transaction ke andar ek HTTP call thi — ek common anti-pattern). Ab 500 rps ke liye 100 busy connections chahiye. Agar pool 20 ka hai:

```text
demand   = 500 rps × 0.2 s = 100 connections needed
capacity = 20 connections
=> 80 requests/s worth of work ko wait karna padega

Queue build hoti hai -> pool wait time badhta hai
-> request timeout hota hai -> client retry karta hai
-> arrival rate 500 se 800 rps -> aur zyada queue
```

Yeh classic congestion collapse hai: system throughput badhne ke bajaye ghatta hai kyunki har request timeout hone se pehle resources consume karti hai aur phir retry ek naya request ban jaata hai. Teen defenses hain jo saath mein lagti hain. Ek, **transaction ke andar external network call kabhi mat karo** — connection hold time ko database work tak limit rakho. Do, pool acquisition par timeout chhota rakho (jaise 250 ms) taaki request fail-fast ho aur thread block hokar na baithe; slow failure fast failure se kharab hai. Teen, retries par budget lagao aur load shedding rakho — jab pool wait threshold cross kare toh naye requests ko 503 do, kyunki 90% requests ko turant reject karna 100% ko slowly timeout karne se better user outcome hai.

Pool sizing ka counter-intuitive part: pool badhana aksar galat fix hai. 100 connections database par 100 concurrent queries banati hain, aur ek 8-core database machine par 100 concurrent queries context switching aur lock contention se *sabki* latency badha deti hain. Bottleneck agar database CPU hai toh pool badhane se sirf queue database ke andar shift hota hai, jahan usse control karna aur mushkil hai.

## Common mistakes

- **Wrong assumption:** `@Transactional` method ke andar REST call ya message publish karna theek hai kyunki sab ek hi logical operation hai. **Why it breaks:** Database transaction ab network latency ke barabar lambi ho jaati hai — connection aur row locks 200-2000 ms tak hold hote hain, jisse pool exhaust hota hai aur unrelated requests block ho jaati hain. Aur external call rollback nahi hoti: transaction fail hone par email ja chuka hota hai. **Fix:** External effect ko transaction ke bahar karo, ya outbox pattern se commit ke baad asynchronously trigger karo.
- **Wrong assumption:** JPA entities ko directly REST response mein return karna DRY hai. **Why it breaks:** Lazy associations serialization ke dauran trigger hokar N+1 queries chalati hain (aur aksar `LazyInitializationException` deti hain), internal fields jaise `passwordHash` ya `internalNotes` accidentally leak ho sakte hain, aur koi bhi schema rename API contract todh deta hai. **Fix:** Explicit DTOs/projections use karo; repository se seedha DTO project karna aksar fastest bhi hota hai kyunki sirf needed columns aate hain.
- **Wrong assumption:** Unique constraint lagane ke bajaye code mein `if (exists) return error` check kar lena kaafi hai. **Why it breaks:** Do concurrent requests dono check karengi, dono ko "not exists" milega, dono insert karengi — duplicate row ban jaayegi. Check aur insert ke beech ka window microseconds ka hai lekin production traffic par wo window regularly hit hoti hai. **Fix:** Database constraint ko authority banao aur unique-violation exception ko gracefully 409 mein map karo; app-level check sirf better error message ke liye rakho.
- **Wrong assumption:** `PUT` idempotent hai isliye retry-safe hai, aur `POST` ko bas `PUT` bana do. **Why it breaks:** HTTP method ki idempotency ek *specification-level intent* hai, automatic implementation guarantee nahi. Ek `PUT /notes/42` jo internally `version = version + 1` karta hai, ya jo har call par audit event emit karta hai, retry par different state produce karega. **Fix:** Idempotency ko implementation mein enforce karo — absolute values set karo (increment nahi), aur side effects ko idempotency key se dedupe karo.
- **Wrong assumption:** Soft delete (`deleted_at` column) safe default hai. **Why it breaks:** Har query ko `WHERE deleted_at IS NULL` yaad rakhna padta hai, aur ek bhoola hua filter deleted data ko wapas UI mein la deta hai. Unique constraints bhi todhte hain: user ne `alice@example.com` delete kiya, ab wahi email dobara register nahi ho sakta kyunki soft-deleted row constraint hold kar rahi hai. **Fix:** Soft delete ko deliberate choice banao jahan recovery/audit genuinely chahiye; us case mein partial unique index (`WHERE deleted_at IS NULL`) use karo aur filtering ko repository base layer par centralize karo.

## Interview questions

**Why not microservices immediately?** Team ownership, independently scaling workloads and deployment cadence can justify them. Otherwise distributed consistency, monitoring and operations additional costs hain that modular monolith avoid kar sakta hai.

**How do you prevent lost updates?** Version checking or appropriate locking use karo, and conflict behavior client ko expose karo. "Read then write" without concurrency check unsafe ho sakta hai.

**Optimistic aur pessimistic locking mein kaise choose karoge?** Conflict probability se. Agar do users ka same row par simultaneously likhna rare hai (user apna hi note edit kar raha hai), optimistic version check better hai — koi lock hold nahi hota, throughput high rehta hai, aur rare conflict par user ko retry/merge dikha dete hain. Agar contention high hai (ek popular product ka inventory counter, ek shared counter), optimistic approach retry storm ban jaata hai kyunki har attempt fail hoke dobara chalta hai — wahan `SELECT ... FOR UPDATE` ya ek single atomic UPDATE statement better hai. Rule: low contention par optimistic, high contention par pessimistic ya atomic write.

**Breaking API change kaise ship karoge?** Ideally karta hi nahi — expand/contract se additive change karta hoon. Jab genuinely field remove ya semantics change karni ho toh: pehle naya field add karke dono populate karo, consumers ko migrate karne ka window do (usage metrics se track karo ki purana field kaun padh raha hai), phir tab remove karo jab usage zero ho. Agar consumers external hain aur coordinate nahi kar sakte, versioned endpoint (`/v2/notes`) do aur `/v1` ke liye deprecation timeline plus sunset headers publish karo. Silently field ka meaning badalna sabse kharab option hai kyunki wo runtime par fail hota hai, deploy par nahi.

**Ek endpoint slow hai — kaise diagnose karoge?** Layer by layer. Pehle dekho time kahan ja raha hai: application CPU, database wait, ya downstream call. Trace ya simple timing logs se yeh 30 seconds mein pata chal jaata hai. Database wait hai toh `EXPLAIN ANALYZE` chalaunga aur sequential scan ya bad join order dekhungaa. Query fast hai lekin endpoint slow hai toh query *count* dekhungaa — aksar N+1 hota hai. Aur agar p50 fine hai par p99 kharab hai, toh problem query nahi hai, contention hai: pool wait, lock wait ya GC pause.

## Practice

Bookmark create/delete semantics document karo. Same version se two title updates send karo; one should conflict according to chosen policy. Tenant A ke token se tenant B ke cursor and IDs test karo.

Uske baad pool exhaustion reproduce karo: pool size 5 set karo, ek endpoint mein transaction ke andar 500 ms sleep daalo, aur 50 concurrent requests bhejo — observe karo ki *unrelated* endpoints bhi slow ho gaye. Phir sleep ko transaction ke bahar nikalo aur difference dekho. Last mein idempotency table implement karke same POST 5 baar bhejo (parallel mein bhi), aur verify karo ki exactly ek row bani aur paanchon responses identical the.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Two requests reserve the last seat. Explain why checking availability and later inserting a reservation without coordination is unsafe.

> **Hint:** Both callers can observe availability before either writes.

**Answer guide — compare after attempting:** Use an atomic conditional update, suitable lock, or database constraint within the chosen transaction design. One request succeeds; the other gets a defined conflict/unavailable result. Check affected rows and test concurrent attempts. A cache cannot be the sole authority for scarce inventory.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)
