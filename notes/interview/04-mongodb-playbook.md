---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 31
summary: Database answer mein query pattern, correctness rule aur execution plan ka evidence hona chahiye.
tags: mongodb, interview, indexes, schema, transactions
visual: mongo-index
---

## Mental model — simple soch

MongoDB discussion schema-less slogan se start mat karo. Documents ka shape, growth limits, read/write patterns aur invariants define karo. “Flexible schema” ka matlab validation ya deliberate modeling unnecessary nahi; production systems ko predictable contracts phir bhi chahiye.

> **Core takeaway:** Database answer mein query pattern, correctness rule aur execution plan ka evidence hona chahiye.

## Representative questions and answers

**Embed or reference order items?** Bounded order line items order ke saath read hote hain aur purchased price ka historical snapshot chahiye, so embedding useful ho sakta hai. Customer ke saare lifetime orders customer document mein embed karna unbounded growth create karega. Independent product catalog reference aur order-specific snapshot saath coexist kar sakte hain.

**Which index supports user order history?** Query `userId` equality aur `createdAt` descending sort use karti hai, so `{userId: 1, createdAt: -1, _id: -1}` starting candidate hai. `_id` tie-breaker deterministic order deta hai. Explain plan aur realistic data se validate karo; index har unrelated query ke liye automatically useful nahi.

**Does updateMany update all documents atomically?** Har individual document modification atomic hai, poora multi-document operation automatically all-or-nothing transaction nahi. Cross-document invariant ko transaction ya different aggregate model chahiye. Concurrent updates ke beech predicate re-evaluation aur conditional updates ka role explain karo.

**What do secondary reads trade off?** Read preference routing control karta hai, read concern visibility/isolation aur write concern acknowledgement conditions. Secondary read stale ho sakti hai; client read-after-write requirement ko explicit consistency configuration aur workflow se satisfy karo.

**How do you prevent duplicate usernames under concurrent signups?** Application-level precheck (`findOne` phir `insertOne`) race condition ke against safe nahi hai — do concurrent requests dono precheck pass kar sakti hain phir dono insert try karengi. `username` field par unique index authoritative guarantee deta hai; database duplicate ko reject karega chahe application logic race kar jaaye. Duplicate-key error (code 11000) ko catch karke ek clean 409 conflict response mein map karo, generic 500 mat do.

**When does `$lookup` become a scaling problem?** `$lookup` runtime join hai — har input document ke liye foreign collection scan/lookup hoti hai, aur agar join key par index nahi hai to yeh effectively nested loop ban jaata hai jo bade collections par slow ho jaata hai. Frequently-joined, rarely-changing data (jaise category name) ko denormalize/snapshot karna ek alternative hai jo read-time join cost ko write-time cost se replace karta hai. `$lookup` ko occasional reporting/admin queries ke liye theek maano, hot request-path ke liye carefully evaluate karo with explain.

**How would you expire password-reset tokens automatically?** TTL index ek field (jaise `expiresAt`, ek `Date` value) par set karo with `expireAfterSeconds: 0`; MongoDB background process periodically expired documents ko automatically delete kar deta hai. Yeh application code se manual cleanup job likhne se simpler hai for ephemeral data jaise reset tokens, session records ya rate-limit counters. TTL deletion approximate timing par chalta hai (exact-second guarantee nahi), isliye security-critical validation (token already expired ya nahi) ko application check se bhi enforce karo, sirf TTL cleanup par depend mat karo.

**When would you reach for change streams instead of polling?** Change streams replica set/sharded cluster ke oplog par based real-time notification dete hain jab matching documents insert/update/delete hote hain — jaise live dashboard ya notification system jo "naya order aaya" turant react kare bina database ko baar-baar poll kiye. Polling (periodic `find` with a timestamp filter) simpler hai aur kam moving parts, lekin latency aur wasted queries introduce karta hai jab changes infrequent hon. Change stream consumer ko resume token store karna chahiye taaki restart ke baad missed events na ho.

## Query design drill

Descending cursor pagination mein last record ka timestamp aur unique ID cursor mein store karo. Cursor ko validate karo aur authorization filter every page par apply karo.

```js
const filter = {
  userId,
  $or: [
    { createdAt: { $lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
  ],
};
const page = await orders.find(filter)
  .sort({ createdAt: -1, _id: -1 })
  .limit(21)
  .toArray(); // show 20; extra record tells us if another page exists
```

First page par cursor predicate omit karo. Timestamp/ID ko correct BSON types mein parse karo, raw untrusted object ko query mein merge mat karo. Pagination live dataset ka perfect historical snapshot guarantee nahi karti; concurrent edits aur deletions ki product policy decide karo.

## Debugging scenario

Explain mein index scan hai, but 500,000 keys examine karke 20 documents return hote hain. Index exists hone se query efficient prove nahi hoti. Predicate selectivity, field order, sort stage, examined/returned ratio aur index coverage inspect karo. Additional index write/storage cost introduce karta hai, so workload-wide impact assess karo.

## Self-review rubric

Access-pattern clarity, bounded schema, index reasoning, consistency aur evidence ko separately 0–2 score do. Strong candidate field order justify karta hai, exact query likhta hai, aur expected plan explain karta hai. “NoSQL fast hota hai” actionable answer nahi.

## Practice and answer

**Prompt:** Stock 1 hai; two buyers simultaneously purchase karte hain. Read stock then decrement safe hai?

**Answer:** Separate read/check/write race kar sakte hain. Same document par predicate `stock: {$gte: quantity}` aur atomic `$inc: {stock: -quantity}` use karo, phir matched/modified outcome inspect karo. Order record ke saath cross-document consistency separately design karni hogi.

## Assessed mock: Node and database production round

**Prompt:** Tenant feed query aur idempotent webhook handler design karo.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Same webhook do instances ko do, phir ek restart karo. Large tenant ka query plan inspect karo.

**Strong-answer evidence:** Durable deduplication, object-level authorization, justified index aur bounded work dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Justify the query from its workload

Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

**Original practice round:** Tenant-scoped activity query newest-first sort karo. Stable pagination aur index fields define karo.

**Failure injection:** Paging ke dauran tied timestamps wale events insert karo; small/large tenants compare karo.

**Evidence to bring:** Query results, cursor boundaries aur actual examined work check karo. Proposed index ka write/storage cost samjhao.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Query optimize karne se pehle workload ka evidence maango

Exact filter, sort, page size, tenant skew aur write rate identify karo. Index candidate ke baad examined keys/documents, returned rows aur sort behavior compare karo. Index exists ko optimized prove mat bolo. Schema mein bounded aggregate aur unbounded event history distinguish karo.

Auth answer valid token se start hokar resource authorization tak jaaye. Integration answer duplicate webhook aur crash window handle kare. Stream answer producer pacing aur disconnect cleanup explain kare, just “chunks use hoti hain” nahi.

**Mock drill:** 20 rows return, huge scan, one hot tenant. Pehle competing causes do, phir discriminating measurements. Proposed index ka write/storage cost mention karo. No database available ho toh plan expected behavior label karo; measured performance invent mat karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Ek customer ke recent-orders endpoint ka design do: filter, stable pagination, index candidate aur verification explain karo.

> **Hint — chhota ishara:** Same timestamp par unique ID tie-breaker deterministic order deta hai.

**Answer guide — pehle khud karo, phir compare karo:** Authorized customer se filter karo; timestamp plus unique ID se sort karo. Matching compound index try karo aur cursor mein ordering values rakho. Realistic data par execution stats aur tied timestamps test karo. Concurrent inserts aur index ke write cost ko bhi explain karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/), [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/), aur [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/) claims ke official references hain.

## Backend debugging ka clear handoff

Original prompt: “CI mein tests kabhi pass, kabhi fail hote hain.” Pehle failure isolate karo: fixed port conflict, shared collection cleanup, unfinished promise ya unstable external dependency? Ek hi baar sab timeouts increase karna root-cause evidence nahi deta.

Handoff mein test command, isolated reproduction, fixture identity, expected/actual response aur first divergent observation do. Real database constraint ka test mock se replace karne se suite fast ho sakti hai, lekin original guarantee disappear ho jaayegi; tradeoff explain karo.

**Practice:** Graceful shutdown ke dauran 500 errors aati hain aur teammate DB pehle close karta hai. **Answer guide:** Existing requests abhi DB use kar rahi hain. New work drain, bounded active-request grace aur uske baad resource close sequence propose karo. Hung dependency ka deadline case bhi test karo. Report mein “server stopped” ke saath accepted operation ka outcome aur remaining recovery work likho.

[Node testing aur shutdown](../mongodb/09-testing-shutdown.md) se real local request evidence banao.

## Machine coding — implementation round bhi karo

[Machine coding practice bank](../MACHINE_CODING_PRACTICE.md) mein apne subject ke do P1 rounds se shuru karo. Prompt ke acceptance checks answer reveal se pehle attempt karo; timebox ke baad demo, scorecard aur interviewer follow-up complete karo. Java backend ke liye Java aur Spring Boot, MongoDB ke liye Node aur MongoDB, frontend ke liye HTML/CSS aur React/Redux ke rounds bhi lo.
