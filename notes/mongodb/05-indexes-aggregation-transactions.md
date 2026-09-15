---
id: mongo-indexes-aggregation-transactions
title: Indexes aggregation geospatial queries and transactions
track: mongodb
order: 5
level: Advanced
minutes: 38
summary: Atomic conditional update ek document ke invariant ko check aur change ek saath karke bacha sakti hai.
tags: indexes, aggregation, transactions, geospatial, explain, performance
visual: aggregation-pipeline
---

## Mental model — simple soch

Index collection ka extra ordered lookup structure hai. Read ko faster banane ki cost storage, memory aur every relevant write par maintenance hai. Index existing query pattern ke liye design karo, sirf har field par index add mat karo. Aggregation documents ko stages se process karti hai. Transaction multiple writes ko common commit/rollback boundary deti hai; slow data model ko automatically fast nahi banati.

> **Core takeaway:** Atomic conditional update ek document ke invariant ko check aur change ek saath karke bacha sakti hai.

## Index around an actual query

```js
db.topics.createIndex({ track: 1, published: 1, createdAt: -1, _id: -1 });

db.topics.find({ track: "react", published: true })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .explain("executionStats");
```

Equality fields prefix mein hain aur next fields required sort match karte hain. Equality-Sort-Range useful guideline hai, universal optimality theorem nahi. Range selectivity aur sort needs ke tradeoffs measure karo. Compound index ka field order matters karta hai; prefix fields absent hon to intended efficient lookup/sort support nahi mil sakta. Index present hone se query automatically fully efficient nahi hoti.

Explain mein winning plan, returned count, keys examined aur documents examined dekho. Collection scan broad workload ke liye reasonable bhi ho sakta hai; IXSCAN label alone success metric nahi hai. Covered query required data index se return kar sakti hai when conditions hold. Multi-key arrays, partial indexes aur unique constraints ke specific rules separately inspect karo.

`explain("executionStats")` ke `queryPlanner.rejectedPlans` array un alternative plans ko dikhata hai jo optimizer ne consider karke reject kiye — yeh useful hai jab confirm karna ho ki koi doosra existing index accidentally better candidate tha ya nahi. `executionStats.executionStages` ek nested stage tree hoti hai (jaise `FETCH` ke andar `IXSCAN`); har stage ka apna `nReturned`/`executionTimeMillisEstimate` hota hai, isliye slow query ka exact bottleneck stage (index lookup vs document fetch vs sort) identify kiya ja sakta hai. `totalKeysExamined` versus `totalDocsExamined` versus `nReturned` ka ratio ek quick sanity signal hai: 500,000 keys examine karke 20 documents return karna batata hai ki index prefix selective nahi hai us specific query ke liye, chahe IXSCAN use ho raha ho.

## More aggregation stages

```js
db.sessions.aggregate([
  { $match: { completed: true } },
  { $addFields: { minutesRounded: { $round: ["$minutes", 0] } } },
  {
    $facet: {
      byTrack: [
        { $group: { _id: "$track", total: { $sum: "$minutes" } } },
        { $sort: { total: -1 } }
      ],
      byBucket: [
        { $bucket: {
            groupBy: "$minutes",
            boundaries: [0, 15, 30, 60, 120],
            default: "120+",
            output: { count: { $sum: 1 } }
        } }
      ]
    }
  }
]);
```

`$addFields` naya computed field add karta hai bina existing fields drop kiye (`$project` ke opposite mein, jo explicitly listed fields ke alawa sab drop kar deta hai unless `1`/`0` carefully mix karo). `$facet` ek hi pipeline run se multiple independent aggregations (`byTrack`, `byBucket`) parallel-branch karta hai — dashboard-style multi-metric queries ke liye useful, lekin har facet ka apna memory/time cost hota hai isliye bahut saare heavy facets ek saath mat daalo. `$bucket` continuous numeric range ko discrete histogram buckets mein group karta hai, jaise "0-15 min", "15-30 min" reading-time distribution.

`$unwind` ka `includeArrayIndex` option original array position preserve karta hai jab array ko rows mein expand karo:

```js
db.topics.aggregate([
  { $unwind: { path: "$tags", includeArrayIndex: "tagPosition" } }
]);
```

Isse pehla tag (`tagPosition: 0`) baaki tags se differentiate ho sakta hai, jaise primary-tag ranking logic mein.

## Aggregation pipeline

```js
db.sessions.aggregate([
  { $match: { completed: true, startedAt: { $gte: ISODate("2026-01-01") } } },
  { $group: { _id: "$track", totalMinutes: { $sum: "$minutes" }, sessions: { $sum: 1 } } },
  { $sort: { totalMinutes: -1 } },
  { $project: { _id: 0, track: "$_id", totalMinutes: 1, sessions: 1 } }
]);
```

Match data narrow karta hai; group shape aur cardinality change karta hai; sort ordering aur project output contract define karte hain. `$unwind` array elements ko rows/documents mein expand karta hai, isliye totals accidentally multiply ho sakte hain. `$lookup` related collection combine karta hai; join key indexing aur intermediate payload inspect karo. Early selective filtering useful hai, lekin optimizer actual stage placement adjust kar sakta hai.

## Geospatial and consistency

GeoJSON Point coordinates `[longitude, latitude]` order mein hote hain. Spherical earth queries ke liye 2dsphere index relevant hai. `$near` distance ordering de sakta hai; `$geoWithin` region membership ke liye useful hai. Units aur coordinate ranges validate karo; reversed latitude/longitude plausible but wrong results de sakte hain.

Single document operation already atomic hoti hai. Multiple account/booking documents ko jointly change karna ho to replica-set/sharded deployment par supported transactions use karo; standalone server transaction environment nahi hai. Driver transaction callback retry ho sakta hai, isliye external email/payment call us callback mein directly mat rakho. Session har participating operation ko pass karo. External side effects ke liye outbox plus idempotent worker pattern useful hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `explain()` mein `IXSCAN` dikhne ka matlab hai query already optimal hai. **Why it breaks:** Index scan phir bhi bahut saare keys examine karke thode documents return kar sakta hai, jaise low-selectivity leading field ya sort stage jo memory mein separately ho raha ho (`SORT` stage without index support). **Fix:** `totalKeysExamined`/`totalDocsExamined`/`nReturned` ka ratio dekho aur stage tree mein `SORT`/`FETCH` stages ka cost bhi inspect karo, sirf top-level scan type par mat ruko.
- **Wrong assumption:** `$match` pipeline mein jahan bhi likho, order matter nahi karta kyunki MongoDB "smart optimizer" hai. **Why it breaks:** Optimizer kuch reordering karta hai, lekin `$match` ko `$lookup`/`$unwind` ke baad likhna (jab pehle likha ja sakta tha) unnecessary intermediate documents process karwa sakta hai — bade collections par yeh real performance difference banata hai. **Fix:** Selective `$match`/`$sort` stages ko jitna ho sake pipeline mein early rakho taaki baad ke stages kam data par kaam karein.
- **Wrong assumption:** Transaction use karne se poora application automatically "consistent" ho jaata hai, chahe data model kaisa bhi ho. **Why it breaks:** Transaction sirf multiple operations ko ek atomic commit/rollback boundary deta hai; agar underlying data model hi galat shape mein hai (jaise heavily contended single document jisme sab kuch race kar raha hai), transaction sirf latency/retry overhead add karega bina real problem solve kiye. **Fix:** Pehle data model ko access pattern ke hisaab se simplify karne ka option evaluate karo; transaction ko last resort ke roop mein genuinely-cross-document invariants ke liye use karo.

## Practice

Ten-thousand sample sessions par report run karo. Index se pehle/baad same query plan compare karo. Duplicate sort timestamps add karke cursor tie-breaker test karo. Simulated transaction failure se verify karo ki half-completed booking persist nahi hoti.

## Interview questions — bolkar practice karo

**Q. Index har query fast karega?** Nahi. Selectivity, prefix, sort, projection aur workload matter karte hain; writes costlier ho sakti hain.

**Q. Transaction retry mein email kyun risky hai?** Callback repeat hone par email duplicate send ho sakta hai; database rollback external delivery undo nahi karta.

## Research notes: Match the version you actually read

Atomic update separate read-then-replace workflow ko race-free nahi banati. Write filter mein expected version match karo.

```js
const result = await orders.updateOne(
  { _id: orderId, version: expectedVersion },
  { $set: { status: 'confirmed' }, $inc: { version: 1 } },
);
if (result.matchedCount === 0) {
  throw new Error('Missing order or concurrent change');
}
```

Conflict par fresh decision chahiye. Actual repository boundary par tenant/authorization constraints include karo.

**Interview check:** Single-document atomicity multi-document workflow cover karti hai?

**Answer:** Nahi. Individual operations atomic hokar bhi complete workflow partial ho sakta hai. Invariant multiple documents par ho toh suitable transaction ya explicit recovery design karo.

**Practice:** Same version ke saath two writes race karwao aur matchedCount dekho.

[Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Pipeline stage order intermediate data ka meaning badalta hai

Orders match, unwind items, group by product: unwind ke baad one row one item occurrence represent karti hai. Order-level total sum us stage par repeat karoge toh order amount multiply ho sakta hai. Har stage ke baad sample row aur count likho.

Early selective match workload reduce kar sakta hai, lekin optimizer behavior/query support verify karo. Compound index field order actual equality/sort/range pattern se derive karo. Extra indexes reads improve karke write/storage maintenance cost badha sakti hain.

**Practice:** Two orders with multiple items ka hand-calculated expected aggregation banao. Empty array/missing field behavior decide karo. Transaction multi-document writes coordinate kar sakti hai; deployment support, retryable errors aur side effects outside DB separate concerns hain. Transaction retry callback mein external charge blindly repeat mat karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Stock 1 hai aur do buyers ek-ek item kharid rahe hain. Filter, update aur success signal define karo.

> **Hint — chhota ishara:** Eligibility aur decrement same write mein rakho.

**Answer guide — pehle khud karo, phir compare karo:** Product ID plus stock>=1 filter use karo; `$inc` se -1 karo. Pehla successful decrement stock zero karega; doosri operation match nahi karegi. Matched/modified result check karo. Related multi-document work ke liye separate consistency design chahiye.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/) prefix rules explain karta hai. [Aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) stages aur [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/) atomic boundaries ka reference hain.
