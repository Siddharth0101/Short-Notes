---
id: design-scaling-caching
title: Scaling caching replication and partitioning
track: system-design
order: 2
level: Advanced
minutes: 27
summary: Read paths speed up karo without freshness aur failure behavior lose kiye.
tags: caching, scaling, replication, sharding
visual: caching
---

## Mental model

Scale karna work distribute ya avoid karna hai. Cache repeated work avoid karti hai. Replica reads distribute kar sakti hai. Sharding data ownership partition karti hai. Load balancer requests distribute karta hai. Har mechanism consistency, cost and operational tradeoffs introduce karta hai; ek tool sab bottlenecks solve nahi karta.

> **Core takeaway:** A cache reduces origin work only for the requests it can safely reuse.

## Layered read path

```text
browser cache -> CDN -> load balancer -> Java instances
                                             |
                                        shared cache
                                             |
                                      primary database
                                        /         \
                                   replica     replica
```

Stateless app instances easy horizontal scale hote hain when session/shared state appropriate external storage mein ho. Load balancer health check ready-to-serve state reflect kare. Autoscaling lag hoti hai, so admission limits and capacity headroom remain necessary.

## HTTP caching

Content-hashed JavaScript public long-lived immutable cache candidate hai. HTML update policy different hoti hai. `no-cache` storage ban nahi karta; reuse se pehle validation require karta hai. `no-store` storage prohibit karta hai for conforming caches. Private personalized responses ko public shared cache se segregate karo. Cache key mein representation-affecting inputs include karo. [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

## Cache-aside and invalidation

```text
read: cache hit -> return
      cache miss -> read database -> populate cache -> return
write: commit database -> invalidate affected cache keys
```

Simple invalidate-after-write pattern mein race still possible: in-flight old read invalidation ke baad stale value refill kar sakti hai. Versioned values, event-driven invalidation, short TTL or stronger coordination choose based on tolerated staleness. TTL expiry freshness bound ka part hai, strict latest-value guarantee nahi.

Stampede tab hota hai jab hot key expire hote hi many callers database hit karein. Single-flight refresh, randomized TTL and stale-while-refresh where safe help kar sakte hain. Cache outage ko all traffic straight database par dump karna dependency cascade create kar sakta hai; fallback rate limits plan karo.

### Stampede ka actual math

Maan lo ek homepage key hai jise 5,000 rps hit karti hain, aur us key ko rebuild karne mein 200 ms lagte hain. Key expire hui:

```text
t=0 ms    key expires
t=0-200ms har arriving request miss dekhti hai aur rebuild start karti hai
          5,000 rps × 0.2 s = 1,000 concurrent rebuilds
t=200ms   1,000 identical queries database par, 999 ka result waste
```

Ek normal database jo 200 concurrent queries handle karti hai, 1,000 par saturate hokar rebuild time 200 ms se 2 s kar degi — jisse aur zyada requests window mein aayengi, matlab problem khud ko amplify karti hai. Yeh ek single key se poore service ka outage hai.

Teen mechanisms, increasing strength ke order mein:

| Mechanism | Kya karta hai | Cost |
| --- | --- | --- |
| Randomized TTL (jitter) | Multiple keys ko simultaneously expire hone se rokta hai | Ek hot key ke stampede ko solve nahi karta |
| Single-flight / lock | Ek hi rebuild chalta hai, baaki uska result wait karte hain | Waiters ko rebuild latency milti hai; lock holder crash ka timeout chahiye |
| Stale-while-revalidate | Expired value serve karte raho, background mein ek refresh chale | Bounded staleness accept karni padti hai |

Production answer usually teeno ka combination hai: jitter for the many-keys case, single-flight for the hot-key case, aur stale-while-revalidate taaki koi bhi user rebuild latency na dekhe. SWR sabse strong hai kyunki wo rebuild ko user ke critical path se poori tarah hata deta hai — bas uske liye staleness budget explicitly accept karna padta hai, jo har data ke liye acceptable nahi (checkout price ke liye nahi).

### Cache down ho jaaye toh kya hota hai

Ye scenario design review mein aksar skip hota hai aur production mein sabse mehenga sabak hota hai. Upar wale example mein 10,000 rps at 95% hit rate = 500 rps database par. Cache poori tarah down hui:

```text
normal:  10,000 rps × 5% miss  =    500 rps database
outage:  10,000 rps × 100% miss = 10,000 rps database  (20x)
```

Database 10,000 rps handle nahi karti, toh queries queue hoti hain, latency badhti hai, application timeouts hote hain, clients retry karte hain, aur arrival rate 10,000 se upar chala jaata hai. Recovery bhi mushkil hai: cache wapas aa bhi jaaye toh wo empty hai, aur usse warm karne ke liye wahi traffic database se guzarna padega jo database ko gira rahi hai. Isliye cache outage aksar self-healing nahi hota — usse manually traffic shed karke recover karna padta hai.

Design defenses jo *pehle se* honi chahiye:

- **Concurrency limit on the miss path.** Maximum N concurrent database reads allow karo (jaise 100); usse upar requests ko turant 503 ya degraded response do. Isse database survive karti hai aur kuch users served rehte hain — sabko failure dene se better.
- **Local in-process cache as second tier.** Har app instance mein ek chhoti caffeine/LRU cache with 5-10 s TTL rakho. Shared cache down hone par yeh hot keys ka bada hissa absorb karti hai, aur per-instance hone ki wajah se shared failure domain nahi hai.
- **Serve stale from any available tier.** Agar shared cache ne last-known value di hai (chahe expired ho) aur database reachable nahi hai, expired value serve karna aksar error page se better product decision hai — bas usse explicitly decide karo, accidentally mat karo.

### Cache write strategies

| Strategy | Consistency | Write latency | Kab use karo |
| --- | --- | --- | --- |
| Cache-aside (lazy) | Eventual, races possible | Unaffected | Default; read-heavy, staleness tolerable |
| Read-through | Same as cache-aside | Unaffected | Jab cache library hi loading own kare |
| Write-through | Cache aur DB sync mein | Badhti hai (do writes) | Jab miss cost bahut high ho aur write rate low |
| Write-behind (write-back) | Weakest — crash par data loss | Sabse kam | Metrics/counters jahan kuch loss acceptable hai |

Write-behind ko business data ke liye choose karna ek classic design-review red flag hai: agar cache node crash hua toh committed-dikhne wale writes gayab ho jaate hain, aur user ko iska koi signal nahi milta. Counters aur analytics ke liye theek hai, orders ke liye nahi.

## Worked estimate

Assume 10,000 reads/s and 95% cache hit rate. Miss path approximately 500 reads/s receive karega, excluding refresh work and uneven key distribution. Hit rate 80% par database load 2,000 reads/s ho jata hai: fourfold increase. Capacity planning average cache success pe overly depend na kare. Cached 1 million values at estimated 1 KB payload require about 1 GB payload, plus keys and storage-engine overhead.

## Replication and sharding

Async replica lag read-your-writes experience break kar sakta hai. Recent writer ko primary read, version-aware routing or wait mechanism consider karo. Replica backup ka replacement nahi; accidental deletion replicate ho sakti hai. Shard key tenant ID locality provide kar sakti hai, but one huge tenant hot shard create karega. Rebalancing, cross-shard queries and transactions design costs hain.

Network partition ke during distributed system ko availability and consistency behavior consciously choose karna padta hai. CAP ka "pick any two always" mnemonic oversimplifies; normal operation latency and consistency choices bhi separate hain.

### Replica lag ko number do

"Replica lag" ko vague rakhna useless hai; usse measure karo aur uska budget banao. Typical async replication par same-region lag normally 10-100 ms hota hai, lekin teen situations mein wo seconds ya minutes mein chala jaata hai: bulk write (ek migration ya batch job), long-running query jo replica par replay block karti hai, aur network saturation. Design ko worst case handle karna chahiye, average ko nahi.

Practical routing policy jo kaam karti hai:

```text
write   -> primary, aur response mein commit position/timestamp return karo
read    -> agar request "recent writer" hai (last write < 5 s ago, session
           cookie/token se pata chal raha hai) -> primary se padho
        -> warna replica se padho
        -> agar replica lag threshold (jaise 2 s) se zyada hai -> primary par failover
```

Yeh "sticky primary for N seconds" pattern simple hai aur read-your-writes ke 95% cases solve kar deta hai. Uska cost yeh hai ki active writers ka traffic primary par jaata hai — agar workload write-heavy hai toh yeh offload ka benefit hi khatam kar deta hai, aur us case mein replica reads shayad galat solution hain.

### Hot shard kaise banta hai

Tenant ID par shard karna natural lagta hai kyunki queries usually single tenant ki hoti hain. Lekin real customer distribution skewed hoti hai:

```text
10,000 tenants, 8 shards, hash(tenant_id) se distribute
largest tenant = total traffic ka 25%

=> uska shard ~25% + (baaki 75% ÷ 8) ≈ 34% traffic carry karta hai
   jabki uniform expectation 12.5% thi — ~2.7x overload
```

Aur yeh shard resize karne se theek nahi hota: 16 shards karne par bhi wo ek tenant ek hi shard par rehta hai, kyunki shard key uski granularity hai. Isliye shard key choose karte waqt sabse pehle yeh poochho: "kya koi single key value itni badi ho sakti hai ki ek shard usse akela na sambhale?" Agar haan, toh ya toh composite key chahiye (`tenant_id + bucket`), ya large tenants ke liye dedicated shards ka provision, ya us tenant ke read path ko cache se offload karna.

Resharding ka cost bhi pehle se socho: 8 se 16 shards jaana matlab poora dataset move karna, dual-write window maintain karna, aur consistency verify karna — yeh weeks ka project hai, ek afternoon ka config change nahi. Consistent hashing ya virtual buckets (jaise 1,024 logical buckets jo physical shards par map hote hain) yeh migration bahut sasti bana dete hain, isliye wo decision pehle din lena chahiye.

## Common mistakes

- **Wrong assumption:** Cache-aside invalidation ke baad cache consistent ho jaati hai. **Why it breaks:** Ek reader ne database se purani value padh li thi lekin abhi tak cache mein set nahi ki; writer ne database update karke cache invalidate kar diya; ab reader apni purani value cache mein likh deta hai. Cache ab indefinitely stale hai — TTL expire hone tak koi usse theek nahi karega, aur wo stale value freshly-written dikhti hai. **Fix:** Staleness ko explicitly bound karo (short TTL), ya versioned writes use karo (value ke saath version store karo, purani version overwrite na kare), ya invalidate ke bajaye write-through se cache update karo jahan consistency zyada matter karti hai.
- **Wrong assumption:** Cache hit rate 95% hai toh database ko 5% load milta hai, safe hai. **Why it breaks:** Hit rate ek average hai jo failure mode hide karta hai — cache outage, mass eviction (memory pressure), ya ek deployment jo cache key format badal deta hai, sab 0% hit rate produce karte hain. Us instant mein database ko 20x load milta hai jiske liye usse kabhi size nahi kiya gaya. **Fix:** Database ko us load ke liye size karo jo wo *bina cache ke* absorb kar sake, ya miss path par explicit concurrency limit aur load shedding lagao. Cache ko latency optimization maano, capacity dependency nahi.
- **Wrong assumption:** Read replica add karne se write scaling bhi improve hoti hai. **Why it breaks:** Har replica primary ki *saari* writes replay karti hai — matlab replicas write throughput ka koi hissa nahi lete, ulta primary par replication overhead add karte hain. 5 replicas ka matlab hai wahi write load 6 machines par duplicate ho raha hai. **Fix:** Write bottleneck ke liye sharding, batching, ya write path simplification (kam indexes, kam triggers, async secondary effects) chahiye. Replicas sirf read scaling aur failover ke liye hain.
- **Wrong assumption:** TTL bada rakhne se cache zyada effective hai. **Why it breaks:** Lamba TTL memory mein cold keys retain karta hai jisse hot keys evict ho sakti hain, aur staleness window ko user-visible bana deta hai (user ne apna profile update kiya, 1 ghante tak purana naam dikhta raha). Aur invalidation bug ho toh uska blast radius TTL jitna lamba hota hai. **Fix:** TTL ko data ki acceptable staleness se derive karo, memory se nahi; hot-key retention ke liye LRU/LFU eviction policy par bharosa karo.
- **Wrong assumption:** Cache mein sab kuch daal do, memory sasti hai. **Why it breaks:** Low hit-rate entries (jaise per-user search results jo dobara kabhi query nahi hote) memory bharke high-value entries evict karti hain — effective hit rate girta hai aur cache add karne se pehle se kharab performance milti hai. Saath hi har entry serialization/deserialization CPU bhi kharch karti hai. **Fix:** Cache candidate ke liye do sawaal poochho: reuse probability kya hai, aur recompute cost kya hai. Dono high hon tabhi cache karo.

## Interview questions

**How do you cache private data safely?** User/tenant-aware keys, authorization before exposure, explicit lifetime, logout/session changes handling and protected shared-cache policy define karta hoon.

**When shard?** Index/query tuning, vertical capacity and replication insufficient hon, and partitionable workload clear ho. Sharding operational complexity early incur nahi karunga.

**Cache invalidate karoge ya update?** Default invalidate karta hoon kyunki wo simple hai aur stale-write races kam hoti hain — agla reader fresh value load kar lega. Update (write-through) tab choose karta hoon jab key itni hot ho ki uska miss stampede risk create kare, ya rebuild itna mehenga ho ki ek miss bhi p99 kharab kar de. Update ka hidden cost yeh hai ki do concurrent writers cache mein out-of-order values likh sakte hain, isliye update karte waqt version/timestamp compare karna chahiye.

**Multi-region mein read scale karna hai — kya karoge?** Pehle poochhungaa ki data read-mostly hai ya nahi, aur staleness budget kya hai. Read-mostly public content ke liye CDN plus regional read replicas simplest hai aur usually sufficient. Agar writes bhi regionally distributed hain, toh main data ko ownership ke hisaab se partition karne ki koshish karunga — har record ka ek home region ho jo uske writes own kare — taaki cross-region consensus har write par na chale. Multi-master ko last option rakhta hoon kyunki uska conflict resolution application-level semantics demand karta hai, aur "last write wins" silently user data kha jaata hai.

**Cache ka hit rate suddenly gir gaya — kya check karoge?** Sabse pehle deployment history, kyunki cache key format ka change (ek naya field key mein add ho gaya) instantly hit rate zero kar deta hai aur yeh sabse common cause hai. Uske baad memory/eviction metrics — agar eviction rate spike hui hai toh koi naya code low-value entries daal raha hai ya dataset badh gaya hai. Phir TTL changes aur upstream traffic mix (naye unique keys, jaise ek crawler jo har URL variant hit kar raha hai). Diagnosis ke dauran database load monitor karna zaroori hai kyunki yehi wo window hai jahan cascade shuru ho sakta hai.

## Practice

Hot-key expiry simulate karo. Cache disabled condition mein maximum safe fallback throughput derive karo. Recent edit replica se stale aaye toh UI and routing policy specify karo.

Phir stampede reproduce karo: ek key ko 200 ms rebuild cost do, 200 concurrent readers chalao, aur count karo ki kitne rebuilds hue. Single-flight lock lagakar dobara count karo. Uske baad cache-aside race reproduce karo — reader ko database read ke baad artificially 100 ms pause karao, us beech mein write plus invalidate chalao, aur verify karo ki cache mein stale value baith gayi. Last mein apne shard key ke liye skew calculate karo: top tenant ka traffic share nikaalo aur estimate karo ki uska shard uniform expectation se kitna guna load lega.

## Research notes: Define behavior beyond capacity

Request count poorly represents capacity when request costs differ. Identify the scarce resource and choose what to reject or degrade before waiting grows without bound.

Original policy: omit recommendations under overload while preserving an article. Checkout cannot invent inventory results to seem available. Specify degraded behavior as a product contract and monitor it separately from full success.

**Interview check:** Why is an unlimited queue a poor overload strategy?

**Answer:** It converts overload into growing latency and memory use. Expired requests can still consume resources. Bound waiting and prioritize or reject work according to explicit requirements.

**Practice:** Compare accepted throughput, rejection rate, queue age and latency during a burst.

[Read the source — Google SRE](https://sre.google/sre-book/handling-overload/). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** At 1000 reads/second with a 90% hit rate, estimate origin reads. What happens immediately after a cold restart?

> **Hint:** A hit-rate estimate is conditional on a warm cache.

**Answer guide — compare after attempting:** A warm cache sends about 100 reads/second to origin, ignoring refresh overhead. A cold cache may send close to 1000 until populated. Discuss request coalescing, controlled warming, and admission limits; size the failure plan instead of assuming the steady-state hit rate always holds.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [PostgreSQL replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Amazon Builders Library caching challenges](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
