---
id: interview-system-design
title: React and Java system design interview playbook
track: interview
order: 6
level: Advanced
minutes: 38
summary: Design ke decisions workload assumptions aur failure traces se samjhao, taaki tradeoffs ko check kiya ja sake.
tags: system-design, interview, react, java, architecture
visual: outbox-pattern
---

## Mental model — simple soch

System design box drawing exercise se zyada requirements aur tradeoffs ka argument hai. User action se data persistence aur visible response tak complete path explain karo. React frontend ki loading, focus aur stale-state behavior backend retries aur consistency se connected hai.

> **Core takeaway:** Design ke decisions workload assumptions aur failure traces se samjhao, taaki tradeoffs ko check kiya ja sake.

## A 45-minute design structure

1. **0–5 minutes:** Core flows, actors, permissions, exclusions, freshness/latency goals clarify karo.
2. **5–10 minutes:** Peak load, data growth, payload sizes, availability needs estimate karo.
3. **10–20 minutes:** API contracts, data model, ownership aur happy path sketch karo.
4. **20–35 minutes:** Highest-risk part deepen karo: contention, rendering scale, fan-out, consistency ya delivery.
5. **35–45 minutes:** Failures, observability, accessibility, capacity and tradeoffs review karo.

## Frontend prompt

**Design a React order dashboard with live status and search.** Server state query keys mein user/tenant, filters aur pagination include karo. UI state selected row, open panels aur draft filters hold kare. Shareable filters URL mein rakh sakte ho. Loading, partial failure, empty aur retry states explicitly define karo; previous results retain karne par updating indicator do.

Large table ke liye cursor pagination aur virtualization evaluate karo. Keyboard focus scroll/unmount se lose nahi hona chahiye. Realtime updates SSE, WebSocket ya polling se aa sakte hain; requirement decide karegi. Reconnection par missed events recover karne ke liye cursor/version ya authoritative refresh path rakho.

## Backend prompt

**Design a Java order API that tolerates retries.** POST request stable idempotency key carry kare. Authentication ke baad server key ko tenant/user scope aur request fingerprint ke saath durable store kare. Unique constraint/transaction concurrent duplicates coordinate kare; completed duplicate ko original result return karo, conflicting payload ko reject karo.

```text
React client -> API gateway -> Java order service -> database
                                     |
                           same transaction writes
                           order row + outbox event
                                     |
                                outbox relay
                                     |
                                   broker -> consumer
```

Outbox database change aur event intent ko same transaction mein persist karta hai. Relay crash/retry duplicate publish kar sakta hai, so consumer deduplication/idempotency design still required hai. “Exactly once” claim end-to-end boundary explain kiye bina mat karo.

## Representative questions and answers

**How do retries improve or harm availability?** Transient errors recover ho sakte hain, lekin retries load amplify karte hain. End-to-end deadlines, limited attempts, backoff/jitter aur retryable error classification do. Non-idempotent operation ko safe retry protocol ke bina repeat mat karo.

**Why can cache-aside return stale data after invalidation?** Concurrent reader old database value read karke writer invalidation ke baad old value cache mein set kar sakta hai. TTL stale duration bound kar sakta hai; version checks, coordinated writes ya stronger consistency designs requirement ke hisaab se choose karo.

**What would you measure?** User-visible success rate and latency, frontend interaction delay, API p95/p99, pool wait, dependency errors, database query cost aur event lag. Correlation IDs request path connect karein. Averages tail failures hide kar sakte hain.

**Ek feature ke liye acceptable staleness kaise decide karoge?** Staleness ko ek global setting nahi, per-field product decision maanta hoon, aur usse galat-value ke consequence se derive karta hoon. Chapter body text 30 minutes stale ho sakta hai kyunki nuksan koi nahi. Unread count 10-30 seconds stale acceptable hai — thoda galat number annoying hai, harmful nahi. Lekin user ka apna abhi-abhi kiya hua save 0 staleness demand karta hai, warna wo lagta hai data kho gaya. Aur checkout ka payable amount ya permission check kabhi stale nahi ho sakta kyunki wahan galat value ka matlab galat charge ya authorization bug hai. Number decide karne ke baad usse mechanism mein translate karta hoon: bade budget ke liye long TTL aur CDN, chhote ke liye short TTL plus background refetch, aur zero ke liye authoritative read (mutation response se cache seed karna, ya primary se padhna). Interview mein main yeh table hi bolta hoon — "consistency chahiye" jaisa vague statement kisi design decision ko justify nahi karta.

**Queue ya naya microservice kab *nahi* introduce karoge?** Jab caller ko result turant chahiye, tab queue sirf complexity hai — tumhe polling ya callback banana padega, aur user ka wait khatam nahi hota, sirf visible se invisible ho jaata hai. Payment authorization ya inventory check async karna isi category mein aata hai. Queue ka test main yeh rakhta hoon: "agar yeh kaam 5 minute late ho jaaye toh business consequence kya hai?" Koi nahi — async karo. User confuse hoga ya order galat banega — synchronous rakho. Aur queue add karte waqt uske saath bounded size, admission control aur DLQ bhi aane chahiye; bina backpressure ke queue overload ko solve nahi karti, usse unbounded latency mein convert kar deti hai. Microservice ke liye test alag hai: independent deployment cadence, alag scaling profile, ya alag team ownership genuinely ho tabhi. Sirf "code bada ho raha hai" ke liye service nikalna ek in-process function call ko ek network call bana deta hai jo fail ho sakti hai, slow ho sakti hai, aur ab distributed transaction, versioned contract aur cross-service tracing demand karti hai. Module boundaries pehle enforce karo, network hop baad mein.

**Write path ko end-to-end idempotent kaise banaoge?** Chain ke har link par alag mechanism chahiye, aur ek bhi missing ho toh guarantee toot jaati hai. Client ek stable key generate kare (UUID) aur retries mein wahi reuse kare — har retry par nayi key banana sabse common bug hai, kyunki phir server ke liye har retry ek naya request hai. Server us key ko tenant/user ke saath scope karke durable table mein `UNIQUE (tenant_id, key)` ke saath insert kare: insert jeeta toh wo owner hai aur kaam karta hai, unique violation mila toh existing record dekhta hai — completed hai toh stored response return karo, in-progress hai toh 409/retry-after do, aur payload fingerprint mismatch ho toh 422 do kyunki same key se alag request client ka bug hai. Database layer par business constraint bhi hona chahiye (jaise `UNIQUE (sender_id, client_msg_id)`) taaki app logic bypass hone par bhi duplicate na bane. Downstream external call ke liye provider ka apna idempotency key use karo, aur event publish ke liye outbox plus consumer-side dedupe on `event_id`. Yahan ek honest statement zaroori hai: yeh "exactly once" nahi hai, yeh at-least-once delivery plus deduplication hai — end result effectively-once dikhta hai, lekin mechanism naam batana matter karta hai.

**Ek dependency down ho jaaye toh graceful degradation kaise design karoge?** Har critical flow ke liye pehle se ek degradation ladder likhta hoon, incident ke waqt improvise nahi karta. Recommendation service down — section hide karo, baaki page normal chale. Search down — category browse par fallback do. Cache down — rate-limited database reads karo with a concurrency cap, taaki kuch users served rahein instead of database gir jaane par sab fail hon. Payment provider down — order ko `pending_payment` mein capture karo aur baad mein retry karo, checkout ko outright fail mat karo. Primary database down — explicit read-only mode ("editing abhi available nahi hai, aapka data safe hai") jo ek generic 500 se kaafi behtar hai. Teen implementation rules isse real banate hain: har degraded path ko feature flag ke peeche rakho taaki manually trigger ho sake, usse regularly test karo (game day) kyunki untested fallback usually toota hua hota hai, aur degraded state ko user ko honestly batao — silently purana data dikhana trust todhta hai. Aur timeout hamesha bounded rakho: infinite spinner sabse kharab degraded state hai kyunki user ko na progress pata hai na option.

**Product requirement se consistency model kaise choose karoge?** Requirement ko ek sentence mein likhwata hoon ki "galat ya purana value dikhne se kya hota hai," kyunki wahi answer model decide karta hai. Agar answer "kuch nahi, thodi der mein theek ho jaayega" hai toh eventual consistency theek hai — replica reads, cache, async propagation sab allowed hain, aur badle mein latency aur availability better milti hai. Agar answer "user confuse ho jaayega ki uska kaam save hua ya nahi" hai toh mujhe pura strong consistency nahi, sirf read-your-writes chahiye — wo sasta hai: mutation response se cache seed karo, ya us user ke recent writes ke baad kuch seconds primary se padho. Agar answer "do users ka kaam ek doosre ko contradict karega" hai toh monotonic reads aur causal ordering chahiye, jo per-entity sequence numbers se milta hai. Aur agar answer "paisa galat kategaa" ya "rule violate hoga" hai toh us specific invariant ke liye strong consistency chahiye — ek single-row atomic update, ek transaction, ya ek uniqueness constraint. Important part yeh hai ki main pura system ek model par nahi rakhta: ek hi product mein catalog eventually consistent hota hai aur inventory decrement strongly consistent — strong consistency ko sirf us chhote invariant tak limit rakhna hi design ka asli kaam hai.

## Self-review rubric

Each 0–2 score: requirements, API/data model, bottleneck analysis, failure handling, communication. Strong answer one tradeoff explicitly defends, one failure trace shows, aur one metric se success define karta hai. Har design mein microservices ya queue add karna required nahi; ownership aur scale justify karein.

## Practice and answer

**Prompt:** Average arrival 200 requests/s aur response time 0.5 s hai. Average in-flight requests roughly kitni hongi?

**Answer:** Stable system mein Little's Law se approximately 100. Ye average hai, safe pool capacity prescription nahi; bursts, tail latency aur dependency limits ke liye headroom aur load tests chahiye.

**Prompt:** Autocomplete mein accessible keyboard behavior kya hona chahiye?

**Answer:** Input focus usable rahe, Arrow keys active suggestion move karein, Enter select kare aur Escape popup dismiss kare. Proper combobox/listbox semantics aur active-option relationship expose karo; screen-reader announcement aur actual keyboard tests se validate karo.

## Assessed mock: System design tradeoff round

**Prompt:** Requirements se reconnect recovery tak collaboration service design karo.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Replay cursor expire karo, session ke beech access revoke karo, aur commit ke baad publish se pehle crash karo.

**Strong-answer evidence:** Consistency scope, durable recovery, capacity estimate aur slow-client bounds dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Expose assumptions and failure recovery

Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

**Original practice round:** Status queries wali job-processing service design karo. Queue product choose karne se pehle acknowledgement, retry identity aur retention define karo.

**Failure injection:** Business write ke baad acknowledgement se pehle worker crash karo; ek dependency slow karo.

**Evidence to bring:** Replay ke pehle/baad durable state trace karo. Transport redelivery aur duplicate business effect ka difference batao; waiting aur retries ki limits explain karo.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** 1000 concurrent editors ke notes service ka das-minute design do. Transport ya storage choose karne se pehle kaunse teen sawal clear karoge?

> **Hint:** Concurrent users ki count se edit rate, same-document contention aur durability needs nahi pata chalti.

**Answer guide — compare after attempting:** Edit frequency, ek document par simultaneous editors aur offline/conflict expectations pucho. Traffic derive karo; consistency, durable writes aur reconnect recovery decide karo. Ek rejected alternative ki concrete cost batao. Sirf boxes wala diagram in decisions ko replace nahi karta.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[AWS safe retries and idempotency](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/), [AWS transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html), aur [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) design details ke primary references hain.
