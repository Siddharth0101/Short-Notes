---
id: mongodb-query-production-lab
title: MongoDB query plans and Node streaming lab
track: mongodb
order: 6
level: Advanced
minutes: 28
summary: Index tab useful hai jab uska order actual filter aur sort pattern ko support kare.
tags: mongodb, indexes, explain, streams, backpressure
---

## Mental model — simple soch

Index maintained access path hai, free speed switch nahi. Query equality filters, ordering aur ranges se start karo; representative data ka plan dekho. Node streaming related memory problem solve karti hai: data gradually process karo, taaki slow consumer ke liye whole result buffer na karna pade.

> **Core takeaway:** Index tab useful hai jab uska order actual filter aur sort pattern ko support kare.

## Design one real access pattern

Tenant ke recent paid orders descending creation order mein chahiye. Timestamp repeat ho sakta hai, isliye stable tie-breaker rakho.

```javascript
db.orders.createIndex({ tenantId: 1, status: 1, createdAt: -1, _id: -1 });
db.orders.find({ tenantId: 't1', status: 'paid' })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .explain('executionStats');
```

Winning plan, returned count, examined keys/documents padho. Small nReturned aur huge scan warning hai, ek specific fix ka proof nahi. Selectivity, sorting aur distribution matter karte hain. Status-only query ko tenant-scoped index ka same leading prefix benefit nahi milega.

Next page mein createdAt aur _id dono lexicographic cursor condition mein lo. BSON types lose kiye bina encode karo. Cursor validate aur har request par tenant filter lagao; cursor authorization nahi hai.

## Stream without whole-file buffering

```javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('export.ndjson'),
  createGzip(),
  createWriteStream('export.ndjson.gz'),
);
```

pipeline completion/errors/backpressure coordinate karti hai. Example existing file compress karta hai; API export mein DB cursor cleanup, disconnect handling aur auth bhi chahiye. Stream se pehle cursor giant array mein collect karna memory objective tod dega.

## Consistency and modeling decisions

Single-document updates atomic hain. Unique index races mein uniqueness protect karta hai; find-then-insert nahi. Multi-document invariant par transaction chahiye ho sakti hai; pehle ownership boundary design karo. Bounded children embed karke atomic update easy ho sakta hai; unbounded arrays growth/update cost badhati hain.

Replication/ack settings failure semantics affect karti hain. Successful local read universally fresh global view nahi hai. Own-write ke baad freshness need, read routing aur failover define karo. Fixed delay freshness ki heuristic hai, proof nahi.

## Practice

One large tenant plus many small tenants ka skewed data banao; dono plans compare karo. Sort-supporting index remove karke blocking sort dekho. Stream destination slow karke memory stabilization, phir error inject karke resource close verify karo.

## Interview questions — bolkar practice karo

**Har filter ka separate index?** Nahi. Compound access pattern, write/storage cost dekho; index intersection sab solve karega, assume mat karo.

**Backpressure overload eliminate karta hai?** Woh cooperating boundaries mein pacing propagate karta hai. Full service ko admission control, deadlines aur bounded queues bhi chahiye.

## Depth walkthrough — andar kya ho raha hai?

### Explain report ko ratio aur workload se interpret karo

Query 20 results return karti hai aur 50,000 documents examine karti hai. Ratio inefficient access ka signal hai, lekin exact index choose karne ke liye predicates, sort aur data distribution chahiye. One dominant tenant aur many small tenants same index par different workload pressure de sakte hain.

Descending createdAt, _id ordering mein next page last pair se strictly smaller pair maangti hai: older timestamp, ya same timestamp aur smaller ID. Sirf timestamp condition same-time documents skip kar sakti hai. Cursor BSON types preserve kare, aur tenant scope har request mein server derive/enforce kare.

Keyset pagination stable ordering improve karti hai; concurrent insert/delete ke beech immutable snapshot automatically nahi deti. Product ko live feed chahiye ya fixed export snapshot, decide karo. Offset pagination deep page par skipped work badha sakti hai; workload measurement se justify karo.

**Practice:** Duplicate timestamps wala small fixture banao aur page-size 2 se all rows enumerate karo. Stable fixture mein duplicates/skips na hon. Phir concurrent insert karke documented live-pagination semantics compare karo; unexpected guarantee claim mat karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** User ki published notes newest-first list karni hain. Index candidate do aur representative data par usse judge karo.

> **Hint — chhota ishara:** Equality fields sort field se pehle aa sakti hain.

**Answer guide — pehle khud karo, phir compare karo:** userId, status, descending createdAt ka compound index try karo; stable pagination ke liye tie-breaker add karo. Explain execution stats, examined documents/keys aur sort behavior compare karo. Selectivity, write aur storage cost dekho; sirf index exist karna success nahi hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MongoDB compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/) aur [Node streams](https://nodejs.org/api/stream.html) mein examples ka reference padho.
