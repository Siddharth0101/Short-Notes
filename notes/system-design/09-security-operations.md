---
id: design-security-operations
title: Security observability and production operations
track: system-design
order: 9
level: Advanced
minutes: 29
summary: SLO mein good event, eligible request aur measurement window define karo, tab target ka meaning clear hota hai.
tags: security, observability, deployment, reliability
visual: request-flow
---

## Mental model — simple soch

Production system ko build karne ke saath operate and recover bhi karna padta hai. Security trust boundaries define karti hai. Observability unexpected behavior investigate karne ka evidence deti hai. Deployment and recovery procedures changes ko controlled banate hain. Har box ke saath owner, failure signal and recovery action socho.

> **Core takeaway:** SLO mein good event, eligible request aur measurement window define karo, tab target ka meaning clear hota hai.

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

Client-supplied user/tenant IDs authority nahi. Server authenticated identity derive kare and every resource query scope enforce kare. Upload path, file size and MIME claims validate karo. Rich-text/Markdown HTML rendering mein untrusted HTML sanitize or disallow karo. Database parameterization, secure cookie policy and secret rotation implementation details ko architecture decisions support karte hain.

Browser UI authorization feedback de sakti hai, but server checks remain required. CSRF protection credential transport se decide hoti hai; CORS access control ka substitute nahi. Threat model assets, attacker capabilities and boundaries enumerate kare without every hypothetical feature adding complexity. [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

### Broken object-level authorization structurally kaise rokein

Sabse common real-world API vulnerability exotic nahi hai — wo ek missing `WHERE owner_id = ?` hai:

```java
// Vulnerable: authenticated hai, lekin authorized nahi
@GetMapping("/api/notes/{id}")
Note get(@PathVariable long id) {
    return noteRepository.findById(id).orElseThrow();
}
// Koi bhi logged-in user /api/notes/9137 hit karke doosre ka note padh sakta hai
```

Code review par yeh dikhta hai, lekin problem yeh hai ki 200 endpoints mein ek bhoolna inevitable hai. Isliye fix discipline nahi, structure hona chahiye. Teen layered options, increasing robustness:

- **Scoped repository methods.** `findByIdAndOwnerId(id, currentUser)` hi expose karo; plain `findById` ko repository interface se hata do taaki insecure version likhna possible hi na ho.
- **Tenant filter at the data layer.** Hibernate filters, ya PostgreSQL row-level security policies jo `current_setting('app.tenant_id')` par filter karein. Isse ek bhoola hua predicate bhi data leak nahi karta kyunki database khud enforce karta hai.
- **Contract tests.** Har resource endpoint ke liye ek automatic test jo tenant A ke token se tenant B ka ID hit kare aur 404 expect kare. Yeh test suite naye endpoints ke saath grow karna chahiye.

Aur response code deliberately choose karo: unauthorized resource ke liye 404 dena (403 nahi) existence leak nahi karta. 403 dene ka matlab hai attacker ko confirm ho gaya ki wo ID exist karti hai, jo enumeration ko useful bana deta hai.

### Rate limiting ko numbers do

"Rate limit lagao" tab tak useless hai jab tak limit kis cheez par aur kitni ho, wo decide na ho. Ek useful starting table:

| Endpoint class | Limit | Key | Kyun |
| --- | --- | --- | --- |
| Login / password reset | 5 per 15 min | IP + account | Credential stuffing ko economically unviable banao |
| Signup | 3 per hour | IP | Bot account creation |
| Read APIs (authenticated) | 100-300 per min | User ID | Normal usage se kaafi upar, scraping se neeche |
| Write APIs | 20-60 per min | User ID | Accidental client loops aur abuse |
| Expensive search/export | 5-10 per min | User ID | Ek user database ko monopolize na kare |

IP par limit karna alone kaafi nahi hai — mobile carriers aur corporate NATs hazaaron users ko ek IP ke peeche rakhte hain, toh strict IP limit legitimate users ko block karta hai. Authenticated traffic ke liye user/tenant ID better key hai; IP ko sirf unauthenticated endpoints par use karo. Aur limit hit hone par 429 ke saath `Retry-After` header do, warna clients turant retry karke situation kharab karenge.

Ek aur layer jo aksar miss hoti hai: **concurrency limit, rate limit nahi.** Ek user 10 requests/min bhej sakta hai lekin agar har request 30 s ka export hai toh wo 5 workers occupy kar leta hai. Per-user concurrent in-flight request limit (jaise 3) is case ko rate limit se better handle karta hai.

## Signals and correlation

Metrics trends and aggregate health dikhati hain. Logs discrete event context deti hain. Traces distributed request path and timing connect karti hain. OpenTelemetry instrumentation/export standards provide karta hai; telemetry storage and analysis backend separate decision hai. [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)

Track request rate, error fraction and latency distributions. Dependencies ke liye pool wait, timeouts and saturation observe karo. Queue ke liye oldest event age and retry count useful hain. Trace/request IDs logs se correlate karo. Passwords, authorization headers and note contents automatically log mat karo.

## SLO and alert example

Assume study API target 99.9% successful eligible requests over 30 days, and p95 latency below 300 ms under agreed load. Define eligible requests and excluded expected errors explicitly. Alert based on sustained user impact or error-budget consumption, not every transient spike. High average latency p99 tail hide kar sakti hai; distribution inspect karo.

Error-budget burn rate alerting threshold-based alerting se behtar hai kyunki wo urgency ko severity se link karti hai. 30-day window par 99.9% target ka budget 0.1% failed requests hai. Burn rate = current error rate ÷ budget rate:

| Burn rate | Error rate | Budget kab khatam | Response |
| --- | --- | --- | --- |
| 1x | 0.1% | 30 days | Normal, koi action nahi |
| 6x | 0.6% | 5 days | Ticket, business hours mein dekho |
| 14x | 1.4% | ~2 days | Page on-call |
| 100x | 10% | ~7 hours | Immediate page, likely incident |

Isse do practical faayde hain. Ek, 2 AM ka ek 30-second spike (jo 1x burn ke barabar hai) koi page fire nahi karta — on-call fatigue kam hoti hai, aur fatigue hi wo cheez hai jisse real alerts miss hote hain. Do, ek slow-burn degradation jo threshold kabhi cross nahi karti (jaise permanently 0.5% errors) ab visible ho jaati hai, kyunki wo budget steadily khaa rahi hai.

### Telemetry ka cost aur cardinality

Observability free nahi hai, aur uska sabse common failure cardinality explosion hai. Metric ka cost uske label combinations ka product hota hai:

```text
http_requests_total{endpoint, method, status, region}
  50 endpoints × 5 methods × 8 statuses × 3 regions = 6,000 time series  -> theek hai

usme user_id label add kar do:
  6,000 × 100,000 users = 600,000,000 time series  -> metrics backend gir jaayegi
```

Rule: metric labels sirf **bounded, low-cardinality** dimensions ke liye hain (endpoint, status class, region, tenant tier). Unbounded identifiers (user ID, order ID, request ID, raw URL with IDs) logs aur traces mein jaate hain, metrics mein nahi — wahan wo searchable hote hain bina har unique value ka permanent time series banaye.

Log volume ka bhi budget banao. 2,000 rps × 2 log lines/request × 500 bytes = 2 MB/s ≈ 173 GB/day — retention aur cost dono par yeh bada number hai. Practical approach: successful requests ke liye ek structured summary line, errors ke liye full context, aur debug-level ko sampled ya dynamically enable-able rakho. Traces ko head-based sampling (jaise 1%) ke saath rakho lekin error traces ko hamesha keep karo — kyunki jo request fail hui wahi wo hai jise tum dekhna chahoge.

### Graceful degradation ladder

Outage binary nahi hona chahiye. Har critical page ke liye pehle se decide karo ki dependency fail hone par kya hoga:

| Dependency down | Degraded behavior | Kya still kaam karta hai |
| --- | --- | --- |
| Recommendation service | Section hide karo | Poora catalog, search, checkout |
| Search service | Category browse par fallback | Browsing aur checkout |
| Cache | Rate-limited database reads | Reads slower but correct |
| Read replica | Primary se read (limited) | Sab kuch, higher primary load |
| Payment provider | Order ko `pending_payment` mein save karo, baad mein retry | Cart, browsing, order capture |
| Primary database | Read-only mode from cache/replica | Browsing; writes clearly blocked |

Sabse important row aakhri do hain. Payment provider down hone par order ko capture karke pending rakhna revenue bachata hai versus checkout ko outright fail karna. Aur explicit read-only mode ("abhi editing available nahi hai, aapka data safe hai") ek generic 500 se kaafi behtar user experience hai — aur wo mode pehle se implement aur tested hona chahiye, incident ke dauran improvise nahi.

## Safe release and recovery

Readiness means instance request accept kar sakti hai; liveness means process unhealthy enough restart appropriate hai. Dependency outage ko liveness failure banaoge toh fleet restart storm ho sakta hai. Graceful shutdown new work stop karke in-flight requests drain kare, within bounded time.

Database migrations expand-contract pattern follow kar sakti hain: new compatible column add, both versions tolerate, data backfill, callers migrate, old field later remove. Application rollback destructive schema migration undo guarantee nahi karta. Backup restore drill RPO (acceptable data loss window) and RTO (recovery duration target) validate kare. Replica alone backup nahi.

Expand-contract ka timeline concrete karo, kyunki "baad mein remove kar denge" wala step aksar kabhi nahi hota:

```text
week 1  add nullable column new_status; naya code dono likhe, purana padhe
week 1  deploy (rollback safe: purana code naya column ignore karta hai)
week 2  backfill batch job — chunked, throttled, resumable
week 2  naya code new_status se padhna shuru kare (feature flag ke peeche)
week 3  verify: koi bhi code path old_status nahi padh raha (metrics se confirm)
week 4  drop old_status  <- yahi wo irreversible step hai
```

Backfill ko chunked aur throttled rakhna zaroori hai: ek `UPDATE notes SET new_status = ...` jo 50 million rows ko ek transaction mein touch kare, wo lock hold karega, replication lag ko minutes tak le jaayega, aur WAL/disk bhar sakta hai. 5,000-row batches with a short sleep between them 10x slow hai lekin production ko affect nahi karti — aur production ko affect na karna hi asli requirement hai.

Backup ke liye yaad rakho ki untested backup ek assumption hai, guarantee nahi. Drill mein specifically yeh measure karo: restore command kitne minutes mein complete hua (RTO ka bada hissa), restored data kitna purana tha (RPO), aur kya application us restored database se actually boot hui. Teesra step sabse zyada skip hota hai aur sabse zyada surprises deta hai (missing extensions, mismatched schema version, missing secrets).

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** JWT stateless hai isliye logout aur revocation ke liye alag mechanism ki zaroorat nahi. **Why it breaks:** Signed token expiry tak valid rehta hai chahe user logout kare, password badle, ya admin account suspend kare. 24-hour expiry ka matlab hai ek chura hua token 24 ghante tak kaam karega, aur server ke paas usse rokne ka koi tarika nahi. **Fix:** Access token ko short-lived rakho (5-15 minutes) plus refresh token jise revoke kiya ja sake, ya ek revocation list/version check rakho (`token_version` user row mein; mismatch par reject).
- **Wrong assumption:** Liveness probe ko dependency health check se joda ja sakta hai taaki unhealthy instance restart ho jaaye. **Why it breaks:** Database down hone par *saare* instances ek saath liveness fail karte hain aur orchestrator sabko restart kar deta hai. Restarted instances cold cache aur cold connection pools ke saath aate hain, database ko connection storm milta hai, aur ab recovery database ke theek hone ke baad bhi nahi hoti — restart loop khud outage extend karta hai. **Fix:** Liveness sirf process-level health check kare (deadlock, unrecoverable state). Dependency health readiness mein daalo (traffic mat bhejo) ya better, usse degraded-mode response mein handle karo.
- **Wrong assumption:** CORS configure karne se API secure ho jaati hai. **Why it breaks:** CORS ek browser-enforced policy hai jo sirf cross-origin JavaScript reads ko restrict karti hai — curl, server-side clients aur mobile apps usse bilkul ignore karte hain. Aur `Access-Control-Allow-Origin: *` ke saath bhi agar endpoint authenticated hai toh wo kisi non-browser client ke liye poori tarah accessible hai. **Fix:** Authorization ko server par har request par enforce karo; CORS ko browser ke liye ek additional restriction maano, access control mechanism nahi.
- **Wrong assumption:** Secrets ko environment variables mein rakhna secure enough hai. **Why it breaks:** Env vars child processes ko inherit hote hain, crash dumps aur error reporting tools mein aksar capture ho jaate hain, `/proc` se readable ho sakte hain, aur rotation ke liye redeploy chahiye — isliye practice mein secrets saalon tak rotate nahi hote. **Fix:** Secret manager use karo jo runtime par fetch aur rotate kar sake, secrets ko log/error reporting se explicitly exclude karo, aur rotation ko ek tested routine banao, emergency procedure nahi.
- **Wrong assumption:** Alert jitne zyada utna better coverage. **Why it breaks:** 50 alerts mein se 45 noise hon toh on-call unhe mute ya ignore karna seekh jaata hai, aur wo ek asli alert bhi usi noise mein kho jaata hai. Alert fatigue observability ki sabse badi practical failure hai. **Fix:** Alert sirf us cheez par lagao jo *user ko affect kar rahi hai aur human action demand karti hai*. Har alert ke saath ek runbook link ho; agar koi alert ke liye runbook nahi likha ja sakta toh wo alert dashboard hona chahiye, page nahi.

## Interview questions — bolkar practice karo

**What would you alert on?** User-facing symptoms such as failed requests, latency SLO burn or delayed processing; diagnostic resource metrics investigation guide karengi.

**What is the difference between RPO and RTO?** RPO data loss tolerance time window hai. RTO service restore karne ka target time hai. Backup frequency and restore automation respectively influence karte hain.

**Why redact logs?** Logs widely searchable and long-lived ho sakte hain; secret exposure blast radius badhta hai. Useful identifiers and structured error context generally enough hote hain.

**Multi-tenant data isolation kaise guarantee karoge?** Application code par bharosa nahi karunga kyunki ek bhoola hua predicate hi poora isolation todh deta hai. Structural layers lagaunga: repository API mein sirf tenant-scoped methods expose karo, database par row-level security ya query filter enforce karo taaki bhoolne par bhi rows na milein, aur ek automated test suite rakho jo har resource endpoint ko cross-tenant ID se hit karke 404 verify kare. Highest-sensitivity tenants ke liye separate database/schema bhi ek valid option hai, bas uska operational cost (migrations × N) explicitly accept karna padta hai.

**Production incident mein first 10 minutes mein kya karoge?** Pehle impact establish karunga — kitne users, kaun sa flow, kab se — kyunki communication aur severity usi se decide hoti hai. Uske saath-saath "kya badla" dekhta hoon: recent deploy, feature flag change, config change, ya traffic spike; zyadatar incidents in chaar mein se ek se aate hain. Root cause samajhne se pehle mitigation prefer karta hoon — rollback, flag off, traffic shed — kyunki users ko theek karna aur samajhna do alag kaam hain aur pehla zyada urgent hai. Timeline aur observations likhta rehta hoon taaki postmortem accurate ho.

**Kaunse cheezein production mein deploy karne se pehle rollback-safe honi chahiye?** Har schema change jo destructive hai (column/table drop, type narrowing, constraint tightening) rollback-unsafe hai, isliye unhe hamesha expand-contract se multi-step karta hoon. Feature flags ko default-off deploy karta hoon taaki code deploy aur feature enable do alag events hon — isse rollback ka matlab flag off karna ho jaata hai, jo seconds mein hota hai, redeploy ke minutes mein nahi. Aur message/event schema changes ko backward-compatible rakhna padta hai kyunki queue mein purane format ke messages already pade ho sakte hain.

## Practice

Database outage tabletop run karo: API status, retries, alerts and recovery list karo. Restore sample backup into isolated environment. Rolling deployment simulate karo jahan old aur new code ek schema ke saath simultaneously chalti hain.

Phir ek authorization test likho jo tenant A ke token se tenant B ke resource IDs par har endpoint hit kare; dekho kitne endpoints 200 return karte hain. Uske baad apne service ke top 5 dependencies ke liye degradation ladder likho — har ek ke fail hone par kya band hoga aur kya chalta rahega — aur verify karo ki kam se kam do behaviors actually implemented hain, sirf documented nahi. Last mein apne metrics mein cardinality audit karo: koi label aisa hai jo user/request/order ID carry kar raha ho?

## Research notes: Turn an SLO into a concrete budget

Target se pehle user-visible indicator choose karo. Successful eligible checkouts / eligible attempts, process uptime se alag hai. Exclusions/window define karo.

99.9% success aur 1,000,000 eligible requests par 1000 failures allowed. 700 ke baad window budget mein 300 bachti hain. Request budget automatically downtime minutes nahi hai.

**Interview check:** Sirf internal health checks success indicator kyun nahi?

**Answer:** Process healthy response de sakta hai jab actual user workflow fail ho. Meaningful external outcome measure aur internal metrics se diagnose karo.

**Practice:** Declined cards expected business outcome hain ya service failure, apne SLO mein decide karo.

[Source yahan padho — Google SRE](https://sre.google/sre-book/service-level-objectives/). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Trust boundary har hop par explicit honi chahiye

Browser userId bhejta hai; API authenticated principal derive karti hai; downstream service forwarded identity consume karti hai. Kaunsa hop header replace/verify karta hai, specify karo. Internal network location alone authenticated identity nahi. Resource ownership query enforce kare.

Operations mein deploy success process started se stronger claim hai: correct version, healthy dependency access, successful representative traffic aur compatible schema verify karo. Rollback decision user impact aur recovery path par based ho, just log volume par nahi.

**Practice:** Shared database outage mein liveness fail karake all instances restart karna kya improve karega? Often reconnect storm worsen ho sakti hai. Readiness, dependency diagnosis aur bounded retries separately reason karo. Restore drill backup exists claim se stronger evidence deta hai: restored data usable aur recovery target ke andar ho.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** 1,000,000 eligible requests aur 99.9% success target mein kitne bad events allowed hain? Alert se pehle kya define karoge?

> **Hint — chhota ishara:** Allowed failure fraction ko event count se multiply karo.

**Answer guide — pehle khud karo, phir compare karo:** Window mein 1000 bad events allowed hain. Window, eligible traffic, success semantics aur data source define karo. Request-based availability aur time-based downtime alag hain; 1000 errors se automatically offline minutes nahi nikalte.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Kubernetes container probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
