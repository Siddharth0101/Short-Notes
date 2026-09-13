---
id: design-requirements-capacity
title: Requirements capacity and design interviews
track: system-design
order: 1
level: Foundation
minutes: 21
summary: User flows se constraints nikalo aur rough numbers se architecture justify karo.
tags: requirements, capacity, interviews, tradeoffs
visual: request-flow
---

## Mental model

System design boxes draw karne se pehle constraints choose karne ka exercise hai. Same notes product 100 personal users aur 10 million public readers ke liye different architecture demand kar sakta hai. Interview mein assumptions aloud bolo. Har component ka reason user behavior, reliability need ya measured bottleneck se connect hona chahiye.

> **Core takeaway:** Capacity estimates are consequences of explicit assumptions and units.

## Frame the problem

Functional requirements actions hain: search notes, bookmark chapter, sync progress, collaborate. Nonfunctional requirements quality define karte hain: p95 latency, availability, accessibility, durability, privacy and cost. Scope boundaries state karo, such as offline editing excluded in first version. Product ko improve karte waqt unsupported requirements invent karke infrastructure inflate mat karo.

```text
User journey -> API and screen states -> data model
                      |
                 workload estimates
                      |
             baseline architecture
                      |
              bottlenecks and failures
```

Baseline single React app, Java service and relational database ho sakta hai. Static content CDN se serve karo. Modules clean boundaries rakhte hain; independent microservices tab introduce karo jab measured needs justify karein.

## Worked capacity estimate

Assume 100,000 daily active learners, each 20 reads and 2 writes per day. These are interview assumptions, real product measurements nahi.

```text
reads/day       = 100,000 × 20 = 2,000,000
average read/s  = 2,000,000 / 86,400 ≈ 23
peak read/s     = 23 × assumed 10 peak factor ≈ 230
writes/day      = 200,000
average write/s ≈ 2.3
```

20 KB average response pe peak payload bandwidth roughly 4.6 MB/s hai before protocol overhead and compression. At 2 KB per progress event, raw daily write payload 400 MB hai; indexing, replicas and retention multiply storage needs. Estimate decimal units consistently use karta hai.

A stable system mein Little's Law intuition: average in-flight requests approximately throughput times average time-in-system. 230 requests/s at 0.2 s mean latency implies roughly 46 concurrent requests on average. p95 ko mean formula mein substitute mat karo. Queueing, burstiness and headroom separately matter karte hain.

## Sensitivity: assumption badalne par kya hota hai

Ek single number defend karne se zyada valuable yeh dikhana hai ki answer kis assumption par sensitive hai. Peak factor sabse fragile input hota hai kyunki wo product behavior se aata hai, infrastructure se nahi:

| Peak factor | Peak reads/s | Rough app instances at 300 rps each | Comment |
| --- | --- | --- | --- |
| 5x (flat global usage) | ~116 | 1 + 1 standby | Overprovisioned barely matters |
| 10x (single timezone) | ~230 | 2 + 1 | Baseline assumption |
| 30x (exam-season evening spike) | ~694 | 3 + 1 | Autoscale lag ab real risk hai |
| 100x (marketing push, push notification blast) | ~2,315 | 9 + 2 | Ab CDN/cache mandatory hai, optional nahi |

Notice karo ki 5x se 100x tak jaane par architecture *kind* change hota hai, sirf instance count nahi. 10x tak ek plain Java service plus database chal jaata hai; 100x par read path ko cache/CDN offload karna design requirement ban jaata hai. Interview mein yehi statement strong hai: "is assumption ke neeche design A theek hai, is threshold ke upar mujhe design B chahiye."

Push notification wala case specially mean hai: 100,000 users ko ek saath notification bhejna traffic ko ek 30-second window mein compress kar deta hai. 100,000 users × 30% open rate = 30,000 sessions in ~30 s ≈ 1,000 sessions/s, each firing 3-4 initial requests — matlab ~3,500 rps burst against a service jo average 23 rps dekhti hai. Fix architecture nahi, product hai: notification delivery ko 10-15 minutes mein jitter karke spread karo.

## Storage growth, not just storage

Storage estimate mein "aaj kitna data hai" se zyada "har mahine kitna badhta hai" matter karta hai, kyunki growth rate hi migration aur retention decisions force karti hai.

```text
progress events/day    = 200,000
bytes per event        = 2 KB (raw payload)
raw payload/day        = 400 MB
+ indexes and row overhead (assume 1.5x) = 600 MB/day
one year               ≈ 219 GB logical
× 3 copies (primary + 2 replicas)        ≈ 657 GB provisioned
+ 30-day point-in-time recovery WAL/backup ≈ additional 20-30%
```

Yeh numbers 219 GB ko "chhota" batate hain — single PostgreSQL instance comfortably handle karega. Lekin trajectory dekho: teen saal mein ~650 GB logical, aur agar DAU 10x ho gaya toh pehle saal mein hi 2 TB. Us point par backup/restore time RTO violate karne lagta hai, aur index rebuild maintenance window demand karta hai. Isliye retention policy design ka part hai, afterthought nahi: raw progress events 90 din rakho, usse purana daily-aggregate rows mein roll up karke 2 KB/event ko ~200 bytes/user/day tak compress karo. Ek retention rule aksar ek sharding project se sasta hota hai.

## Latency budget breakdown

"p95 under 300 ms" tabhi actionable hai jab usse hops mein todo. Ek typical logged-in read ka budget:

| Hop | Budget | Kya isse blow karta hai |
| --- | --- | --- |
| DNS + TLS handshake (cold) | 50-150 ms | Missing connection reuse, no keep-alive |
| CDN/edge to origin region | 20-80 ms | Cross-region origin, no edge cache |
| Load balancer + app queueing | 5-20 ms | Saturated pool, queue buildup |
| Auth/token validation | 1-10 ms | Remote introspection call per request |
| Business logic + serialization | 10-30 ms | N+1 queries, oversized DTOs |
| Database query (indexed) | 2-15 ms | Missing index, sequential scan |
| Client parse + render | 30-100 ms | Large JSON, blocking main thread |

Sum karo toh warm-connection case ~70-160 ms hai aur cold case 200 ms+ — matlab 300 ms budget realistic hai lekin comfortable nahi. Yahan se do actionable cheezein nikalti hain: ek, token validation ko local (signed JWT verification) rakho remote introspection ke bajaye, warna har request par ek extra network round trip budget ka 10-20% kha jaata hai. Do, ek hi page par teen sequential API calls (waterfall) budget ko 3x kar deti hain — parallel karo ya ek composed endpoint do.

Tail ke liye alag socho: p99 par database query 15 ms se 200 ms ho sakti hai (lock wait, cold buffer, autovacuum). Isliye timeout ko p99 se thoda upar set karo, average ke 2x par nahi — warna healthy-but-slow requests artificially fail hongi aur retry storm shuru hoga.

## Reliability budget

Availability SLO successful eligible requests ka fraction ho sakta hai. 99.9% time-based monthly target 30-day month mein about 43.2 minutes unavailable time allow karta hai; request-based SLO ka interpretation different ho sakta hai. Dependency chain availability blindly multiply tabhi karo jab independence and definitions assumptions valid hon. User-visible symptom alert karo, sirf CPU threshold nahi. [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)

Error budget ko concrete numbers mein rakho, warna wo slogan ban jaata hai:

| Monthly target | Allowed downtime (30-day) | Allowed failed requests at 2M reads/day |
| --- | --- | --- |
| 99% | ~7.2 hours | 600,000/month |
| 99.9% | ~43.2 minutes | 60,000/month |
| 99.95% | ~21.6 minutes | 30,000/month |
| 99.99% | ~4.3 minutes | 6,000/month |

99.9% se 99.99% jaana ek cosmetic upgrade nahi hai: 43 minutes mein manual human response possible hai, 4 minutes mein nahi. Matlab 99.99% claim karte hi automated failover, multi-AZ deployment, pre-warmed capacity aur tested runbooks mandatory ho jaate hain — cost step function hai, linear nahi. Interview mein target propose karne se pehle poochho ki 30 minutes ka outage business ko kya cost karta hai; agar answer "users thoda annoy honge" hai toh 99.99% over-engineering hai.

Dependency chain ka naive math bhi dhyan se: agar ek request 5 services touch karti hai aur har ek 99.9% available hai, independent failures assume karne par overall ~99.5% (~3.6 hours/month) milta hai — proposed SLO se kaafi kharab. Iske do real fixes hain: dependencies ko critical path se hatao (cache/fallback/async), ya failures ko correlated maano aur shared infrastructure ko single failure domain ki tarah treat karo.

## Common mistakes

- **Wrong assumption:** Capacity estimate ka matlab hai precise QPS number nikaalna, aur jitna precise utna better. **Why it breaks:** Input assumptions (DAU, actions/user, peak factor) khud 2-5x uncertain hain, toh 231.48 rps likhna false precision hai — aur wo precision reviewers ko sensitivity analysis se distract kar deti hai. **Fix:** Order of magnitude par commit karo ("hundreds of rps, thousands nahi") aur time us threshold ko identify karne mein lagao jahan design category badalti hai.
- **Wrong assumption:** Peak load ko average ka fixed 2-3x maan lena safe hai. **Why it breaks:** Real spikes product events se aate hain — push notification, sale start, exam deadline, cron jobs jo sab tenants ke liye ek hi minute par chalti hain. Ye 20-100x compression create karte hain, aur autoscaling ko new instances warm karne mein 60-180 seconds lagte hain, matlab spike ka pehla minute existing capacity par hi padta hai. **Fix:** Spike ka *source* name karo, uska duration estimate karo, aur decide karo ki spike ko absorb karna hai (headroom + queue) ya spread karna hai (jitter, staggered cron).
- **Wrong assumption:** Total users ka number scale ka best indicator hai. **Why it breaks:** 10 million registered users jinme 50,000 daily active hain, 50,000 DAU wale product jaisa load banate hain — lekin storage aur index size 10 million wale jaisi hoti hai. Ek hi "scale" word do alag constraints ko chhupa deta hai. **Fix:** Reads/s, writes/s, data volume aur concurrent connections ko alag-alag estimate karo; inme se sirf ek hi usually pehla bottleneck hota hai.
- **Wrong assumption:** Nonfunctional requirements ko "fast, reliable, secure" keh dena kaafi hai. **Why it breaks:** Yeh un-testable hai, isliye koi design choice inse justify nahi ho sakti — har architecture "fast" claim kar sakti hai. **Fix:** Har NFR ko number aur measurement point ke saath likho: "search results p95 under 400 ms as measured at the browser, over a 4G-class connection."

## Interview questions

**What do you do first?** Users, core flows, scope, scale and correctness requirements clarify karta hoon. Then simple design propose karke one important bottleneck deeply analyze karta hoon.

**How precise should capacity math be?** Order-of-magnitude enough hai to expose unrealistic choices. Assumptions explicit rakho and show sensitivity: peak factor 10 se 50 hua toh kya change hoga?

**What is a good tradeoff answer?** Choice, benefit, cost and trigger-to-revisit bolo. Example: single primary database consistency simplify karta hai; regional write latency badhe toh regional ownership design revisit karenge.

**Interviewer scale number nahi deta — kya karoge?** Main khud ek reasonable assumption propose karke usse label kar deta hoon: "maan lete hain 100,000 DAU, agar aap chahein toh 10 million par dobara chala leta hoon." Isse do cheezein hoti hain — design aage badhta hai, aur interviewer ko implicit invitation milti hai ki wo real constraint bata de. Assumption ko silently maan lena galti hai; usse aloud state karna aur baad mein uspe wapas aana strong signal hai.

**Aap 100x headroom kyun nahi design karte?** Kyunki unused capacity ka cost sirf paisa nahi hai — wo complexity hai jo har din pay karni padti hai. Sharded database, multi-region replication aur service mesh operate karna slow ho jaata hai, incidents debug karna mushkil, aur onboarding mehenga. Main current load ka 2-5x headroom rakhta hoon plus ek documented "next step" jo 10x par execute hoga, taaki growth par panic rewrite na karna pade.

**Availability target kaise choose karte ho?** Business impact se backwards. Poochhta hoon ki 30 minutes down rehne se kya hota hai — revenue loss, regulatory issue, ya sirf complaints? Uske baad target choose karta hoon aur uska operational cost explicitly bolta hoon: 99.9% ke liye human on-call kaafi hai, 99.99% ke liye automated failover aur regularly tested recovery chahiye.

## Practice

Video-learning platform ke liye same worksheet fill karo. Read-heavy catalog and write-sensitive checkout separately model karo. Fivefold traffic increase par first three measurements identify karo before adding any service.

Phir ek sensitivity exercise: apne estimate mein peak factor 10 se 50 karo aur likho ki kaunsa component *pehle* fail karega — app instances, connection pool, database CPU, ya bandwidth. Usually answer connection pool ya database hota hai, app instances nahi; yeh identify karna hi capacity work ka real output hai. Last mein retention rule design karo: kaunsa data 90 din baad aggregate mein collapse ho sakta hai, aur usse storage growth curve kitni flat hoti hai?

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Assume 100,000 daily users each make 20 reads per day. Estimate average reads/second and a 10× peak. What assumption would you validate first?

> **Hint:** There are 86,400 seconds in a day.

**Answer guide — compare after attempting:** Two million daily reads average about 23.1 requests/second; a 10× peak is about 231. Validate burstiness and reads per active user against observed traffic. These estimates exclude retries, background work, and downstream fan-out, which need separate accounting.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)
