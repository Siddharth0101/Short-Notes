---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 31
summary: Documents ko read patterns aur bounded growth se model karo; single-document atomicity unrelated documents ko cover nahi karti.
tags: mongodb, crud, bson, modeling, embedding, references
---

## Mental model — simple soch

MongoDB document database hai. Collection related documents group karti hai aur BSON strings/numbers ke alawa ObjectId, dates aur other types support karta hai. Flexible schema ka matlab no data design nahi hai. Document shape ko actual read/write patterns, growth, ownership aur consistency requirements ke hisaab se choose karo. Application schema aur database validation dono data quality improve kar sakte hain.

> **Core takeaway:** Documents ko read patterns aur bounded growth se model karo; single-document atomicity unrelated documents ko cover nahi karti.

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

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** "Document database hai to schema design ki zaroorat nahi, jo bhi shape aaye insert kar do." **Why it breaks:** Inconsistent document shapes application code ko har jagah defensive `if (field exists)` checks se bhar dete hain, aur query/index design impossible ho jaata hai jab same logical field alag-alag documents mein alag types/names mein ho. **Fix:** Application-level schema (Mongoose ya manual validation) aur/ya database-level `$jsonSchema` validator define karo, chahe fields optional hi kyun na hon.
- **Wrong assumption:** Ek array field mein items push karte rehna hamesha safe hai kyunki MongoDB "flexible" hai. **Why it breaks:** Array unbounded grow kare to document ek din 16MB BSON limit ke paas pahunch sakta hai, aur har update poora document phir se disk par rewrite kar sakta hai — write latency degrade hoti hai jaise-jaise array badhta jaata hai. **Fix:** Growth ka realistic upper bound estimate karo; agar unbounded hai to separate collection with a reference field use karo.
- **Wrong assumption:** `updateOne` ka `matchedCount: 1` milna business-level success guarantee karta hai. **Why it breaks:** Filter match ho sakta hai lekin `$set` value already same ho to `modifiedCount` zero aa sakta hai — yeh bug nahi hai, lekin agar code sirf `matchedCount` check kar raha hai to woh "no actual change hua" case ko miss kar sakta hai jahan calling code ne ek real state-transition expect ki thi. **Fix:** `matchedCount` aur `modifiedCount` dono ko unke apne specific meaning ke saath inspect karo, aur business logic explicitly decide kare ki no-op update success hai ya nahi.

## Practice

Notes, users, bookmarks aur reading sessions ka model draw karo. Har relationship ke liye cardinality, read frequency aur maximum growth likho. Bookmark duplicate prevention ke liye compound unique index plan karo. Concurrent view increments run karke result compare karo.

## Interview questions — bolkar practice karo

**Q. MongoDB joins support nahi karta?** Aggregation `$lookup` related data combine kar sakta hai; join availability aur ideal data model separate questions hain.

**Q. Schema-less means validation unnecessary?** Nahi. Consistent contracts application correctness aur future migrations ke liye essential hain.

## Research notes: Model bounded growth and data ownership

Embedding related data ko reads/atomic updates ke liye saath rakhti hai. References lifecycles separate aur unbounded growth avoid kar sakte hain. Array embed karne se pehle growth estimate karo.

Order ka purchase-time address bounded historical snapshot hai; embed karna useful ho sakta hai. Customer ki entire activity history indefinitely badhegi; separate/bounded storage model chahiye.

Duplicated field historical fact hai ya changes follow karne wali cache, har field ke liye decide karo.

**Interview check:** Kya har duplicated field schema mistake hai?

**Answer:** Nahi. Deliberate snapshot ya read optimization duplication justify kar sakti hai. Immutable history ya cached data clearly identify karo; cache ka refresh rule define karo.

**Practice:** Customer ki two-year activity ka size estimate karo.

[Source yahan padho — MongoDB](https://www.mongodb.com/docs/manual/data-modeling/). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Embed/reference choice ko growth aur atomicity se derive karo

Order ke bounded line items order aggregate ke saath read/update hote hain toh embedding useful ho sakti hai. User ke lifetime millions events one array mein embed karna unbounded growth create karta hai. Reference extra reads introduce kar sakti hai, lekin lifecycle/storage boundary better fit ho sakti hai.

Historical order price snapshot aur current product price different facts hain. Product price update par old order total change nahi hona chahiye. Duplication ko blindly normalize karne se history corrupt semantics ban sakti hai.

**Practice:** One document ke owner, maximum growth, common read shape aur update invariant likho. Atomic single-document update same document ke invariant preserve kar sakti hai; two independent documents automatically coordinated nahi. Schema flexible hone se application validation/version migration ki need disappear nahi hoti.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Article par millions of comments aa sakte hain. Kya sab ek document mein embed karoge? Recent-comments page ke liye storage design do.

> **Hint — chhota ishara:** Unbounded child collection embedding ke cost ko badal deti hai.

**Answer guide — pehle khud karo, phir compare karo:** Comments separate store karo, article identity aur stable ordering field rakho, paginated query ka index banao. Useful ho toh small bounded preview embed karo aur consistency rule batao. Ek page ke liye entire comment history load/rewrite mat karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/) command semantics ka reference hai. [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/) access-pattern-based schema design explain karta hai.
