---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 28
summary: Access patterns se schema, indexes, pagination, and consistency decisions justify karo.
tags: mongodb, interview, indexes, schema, transactions
visual: mongo-index
---

## Mental model

MongoDB discussion schema-less slogan se start mat karo. Documents ka shape, growth limits, read/write patterns aur invariants define karo. “Flexible schema” ka matlab validation ya deliberate modeling unnecessary nahi; production systems ko predictable contracts phir bhi chahiye.

> **Core takeaway:** A database answer needs a query pattern, correctness rule, and evidence from a plan.

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

Score each 0–2: access-pattern clarity, bounded schema, index reasoning, consistency, evidence. Strong candidate field order justify karta hai, exact query likhta hai, aur expected plan explain karta hai. “NoSQL fast hota hai” actionable answer nahi.

## Practice and answer

**Prompt:** Stock 1 hai; two buyers simultaneously purchase karte hain. Read stock then decrement safe hai?

**Answer:** Separate read/check/write race kar sakte hain. Same document par predicate `stock: {$gte: quantity}` aur atomic `$inc: {stock: -quantity}` use karo, phir matched/modified outcome inspect karo. Order record ke saath cross-document consistency separately design karni hogi.

## Assessed mock: Node and database production round

**Prompt:** Design a tenant feed query and an idempotent webhook handler.

**Round structure:** Spend 5 minutes clarifying requirements and assumptions, 20 minutes implementing or drawing the core flow, 10 minutes investigating failures, and 5 minutes defending tradeoffs. These are practice targets, not a claim about any company's interview format.

**Failure injection:** Deliver the same webhook to two instances, then restart one; inspect a large tenant query plan.

**Strong-answer evidence:** Durable deduplication, object-level authorization, a justified index, and bounded work.

Score each dimension from 0 to 2: correctness, concrete example, failure handling, and tradeoff reasoning. Zero means missing or incorrect; one means plausible but untested; two means demonstrated with a trace, test, or explicit invariant. A high total with a correctness gap still needs revision.

After the round, write the smallest counterexample that broke your first approach, repair it, and explain the change aloud without notes. Use the chapter's answer-reveal questions for focused revision before repeating the mock.

## Research notes: Justify the query from its workload

Microsoft includes testing and problem-solving in its technical interview guidance.

**Original practice round:** Design a tenant-scoped activity query sorted newest-first. Specify stable pagination and identify which fields belong in its index.

**Failure injection:** Insert events with tied timestamps while paging and compare tiny versus large tenants.

**Evidence to bring:** Check query results, cursor boundaries and actual examined work. Explain the write/storage cost of the proposed index.

The employer source supports the assessment approach; this exercise is original practice, not a reported company question.

**Interview check:** How should you review this round after attempting it?

**Answer:** Keep the first failing example, explain the mistaken assumption, and show how your repair changes the behavior. Separate what you demonstrated from what you would investigate with more time.

**Practice:** Repeat with a different failure while explaining your reasoning aloud.

[Read the source — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Defend a recent-orders endpoint for one customer. Specify filtering, stable pagination, an index candidate, and how you would verify it.

> **Hint:** Equal timestamps require a tie-breaker for deterministic ordering.

**Answer guide — compare after attempting:** Filter by authorized customer identity and sort by timestamp plus unique ID. Use a matching compound index candidate and a cursor containing the ordering values. Inspect execution statistics on realistic data and test tied timestamps. Explain concurrent insert behavior and index write cost.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Source check
[MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/), [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/), aur [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/) claims ke official references hain.
