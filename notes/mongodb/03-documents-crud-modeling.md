---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 28
summary: Collections, BSON, CRUD operators aur embedding-versus-referencing ko actual access patterns se decide karo.
tags: mongodb, crud, bson, modeling, embedding, references
---

## Mental model

MongoDB document database hai. Collection related documents group karti hai aur BSON strings/numbers ke alawa ObjectId, dates aur other types support karta hai. Flexible schema ka matlab no data design nahi hai. Document shape ko actual read/write patterns, growth, ownership aur consistency requirements ke hisaab se choose karo. Application schema aur database validation dono data quality improve kar sakte hain.

> **Core takeaway:** Model documents around reads and bounded growth; single-document atomicity does not cover unrelated documents.

## CRUD in mongosh

```js
db.topics.insertOne({
  slug: "event-loop", title: "Event loop", track: "javascript",
  minutes: 20, published: true, tags: ["async", "runtime"],
  stats: { views: 0 }, createdAt: new Date()
});

db.topics.find(
  { track: "javascript", minutes: { $lte: 25 }, published: true },
  { title: 1, minutes: 1, _id: 0 }
).sort({ minutes: 1 });

db.topics.updateOne(
  { slug: "event-loop" },
  { $inc: { "stats.views": 1 }, $addToSet: { tags: "interview" } }
);

db.topics.deleteOne({ slug: "unused-draft", published: false });
```

Find ka first object filter hai aur second projection. Dot notation nested fields address karti hai. `$set` selected fields update karta hai; `$inc` atomic increment express karta hai; `$push` array mein append karta hai aur `$addToSet` duplicate value avoid karta hai. Replacement operation existing document fields remove kar sakti hai; partial update aur replace intentionally choose karo. Update result mein matchedCount aur modifiedCount inspect karo; no match successful write operation ho sakta hai, business success nahi.

## Embed or reference

Bounded, together-read aur together-owned data embed karna convenient hai. Topic ke short metadata aur small settings embedded ho sakte hain. Unbounded comments, independent users aur heavily reused entities references ke better candidates ho sakte hain. Embedding data duplication create kare to source of truth aur update propagation policy define karo.

Single-document writes atomic hoti hain. Concurrent counter updates read-modify-write application loop se karoge to increments lose ho sakte hain; `$inc` operation use karo. Business condition filter mein include karke conditional update kar sakte ho, jaise available seats greater than zero. Multiple documents ko all-or-nothing update karna ho to transaction evaluate karo, lekin pehle data model simplify karne ka option dekho.

## More embed-versus-reference scenarios

Ek hi rule sab jagah fit nahi hoti — actual access pattern har case mein compare karo:

- **Blog post comments:** Comments unbounded grow kar sakte hain aur independently paginate/moderate hote hain, isliye separate `comments` collection with `postId` reference better hai. Post document ke andar sirf `commentCount` cache field rakhna reads ke liye sufficient hota hai, without embedding sab comments.
- **User's shipping addresses:** Bounded (typically 1-5 addresses), hamesha user ke saath read hoti hain, aur independently query nahi hoti — embedding natural fit hai.
- **Product catalog with categories:** Category apne aap mein reused entity hai (multiple products same category share karte hain) aur independently update hoti hai — reference se duplication aur stale-name problem avoid hoti hai. Lekin order line item mein product ka `name`/`price` snapshot embed karna correct hai, kyunki historical order ko category rename se affect nahi hona chahiye.
- **Chat messages in a conversation:** Messages potentially unbounded aur high write-frequency hote hain; separate collection with `conversationId` index rakhna scaling ke liye better hai. Conversation document sirf `lastMessagePreview` aur participant list embed kar sakta hai for fast list-view rendering.
- **Social "following" list:** Kisi user ke followers lakhon tak ja sakte hain — unbounded array field document size limit se takra sakta hai aur every update poora document rewrite karega. Yeh classic reference-only case hai: separate `follows` collection with `{followerId, followeeId}` documents aur compound index.

Pattern yeh hai: **bounded + read-together + rarely-independently-queried → embed**; **unbounded, ya independently owned/queried, ya heavily reused → reference**. Jab dono signals mix hote hain (jaise product catalog example), snapshot-at-write-time ek useful middle ground hota hai — reference for the live entity, embedded snapshot for historical accuracy.

## Tools and operational context

Atlas managed deployment option hai; Compass graphical exploration tool hai; mongosh interactive command interface hai. Inka role database semantics change karna nahi hai. Development aur production databases clearly separate karo. User credentials least privileges follow karein aur connection string secrets logs/repo mein na aayein. ObjectId ko UI string mein serialize karna aur query mein correct BSON type use karna boundary concern hai.

## Gotchas

Unbounded arrays document growth aur write contention create kar sakti hain. MongoDB document size limit ko schema planning mein consider karo. Missing field aur explicit null ke query semantics carefully inspect karo. Array ke multiple conditions same element par apply karni ho to `$elemMatch` relevant hai; independent dotted predicates different array elements se match ho sakti hain.

## Common mistakes

- **Wrong assumption:** "Document database hai to schema design ki zaroorat nahi, jo bhi shape aaye insert kar do." **Why it breaks:** Inconsistent document shapes application code ko har jagah defensive `if (field exists)` checks se bhar dete hain, aur query/index design impossible ho jaata hai jab same logical field alag-alag documents mein alag types/names mein ho. **Fix:** Application-level schema (Mongoose ya manual validation) aur/ya database-level `$jsonSchema` validator define karo, chahe fields optional hi kyun na hon.
- **Wrong assumption:** Ek array field mein items push karte rehna hamesha safe hai kyunki MongoDB "flexible" hai. **Why it breaks:** Array unbounded grow kare to document ek din 16MB BSON limit ke paas pahunch sakta hai, aur har update poora document phir se disk par rewrite kar sakta hai — write latency degrade hoti hai jaise-jaise array badhta jaata hai. **Fix:** Growth ka realistic upper bound estimate karo; agar unbounded hai to separate collection with a reference field use karo.
- **Wrong assumption:** `updateOne` ka `matchedCount: 1` milna business-level success guarantee karta hai. **Why it breaks:** Filter match ho sakta hai lekin `$set` value already same ho to `modifiedCount` zero aa sakta hai — yeh bug nahi hai, lekin agar code sirf `matchedCount` check kar raha hai to woh "no actual change hua" case ko miss kar sakta hai jahan calling code ne ek real state-transition expect ki thi. **Fix:** `matchedCount` aur `modifiedCount` dono ko unke apne specific meaning ke saath inspect karo, aur business logic explicitly decide kare ki no-op update success hai ya nahi.

## Practice

Notes, users, bookmarks aur reading sessions ka model draw karo. Har relationship ke liye cardinality, read frequency aur maximum growth likho. Bookmark duplicate prevention ke liye compound unique index plan karo. Concurrent view increments run karke result compare karo.

## Interview questions

**Q. MongoDB joins support nahi karta?** Aggregation `$lookup` related data combine kar sakta hai; join availability aur ideal data model separate questions hain.

**Q. Schema-less means validation unnecessary?** Nahi. Consistent contracts application correctness aur future migrations ke liye essential hain.

## Research notes: Model bounded growth and data ownership

Embedding can keep related data together for reading or atomic updates. References can separate lifecycles and avoid unbounded growth. Estimate growth before embedding an array.

Original decision: an order's purchase-time address is bounded historical data; embedding it can make sense. A customer's entire activity history grows indefinitely and needs a separate or bounded storage model.

For duplicated fields, decide whether each is historical fact or a cache that must follow changes.

**Interview check:** Is every duplicated field a schema mistake?

**Answer:** No. A deliberate snapshot or read optimization may justify duplication. Specify whether it is immutable history or cached data and define refresh behavior for the latter.

**Practice:** Estimate the size of two years of customer activity.

[Read the source — MongoDB](https://www.mongodb.com/docs/manual/data-modeling/). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** An article may receive millions of comments. Should all comments live in its document? Propose storage for a page of recent comments.

> **Hint:** An unbounded child collection changes the embedding tradeoff.

**Answer guide — compare after attempting:** Store comments separately with article identity and a stable ordering field; index for the paginated query. A small bounded preview may be embedded if useful. Specify how it stays consistent. Avoid loading or rewriting the entire comment history for a single page.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/) command semantics ka reference hai. [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/) access-pattern-based schema design explain karta hai.
