---
id: mongo-documents-crud-modeling
title: Documents CRUD and access-driven modeling
track: mongodb
order: 3
level: Foundation
minutes: 3
summary: Document — BSON fields ka record; collection related documents rakhti hai.
tags: mongodb, crud, bson, modeling, embedding, references
---

## Quick revision

> Revision target — Document shape ko read pattern, bounded growth aur atomic update predicate se choose karo.

- Document — BSON fields ka record; collection related documents rakhti hai.
- CRUD — insert, find, update, delete.
- Filter — precise conditions; untrusted query objects directly accept mat karo.
- `$set` — selected fields update; full replacement alag operation.
- Embed — saath read/update hone wala bounded data.
- Reference — shared, independently changing ya unbounded relation.
- Atomicity — single-document write atomic; multiple documents ke liye boundary plan karo.
- Schema design — query/access pattern se start karo.
- `$inc` — atomic numeric increment; application read-then-write race se bacho.
- Projection — needed fields hi return; network payload aur sensitive-field exposure kam.
- `$elemMatch` — array ke ek hi element ko saari supplied conditions satisfy karni hoti hain.

### Document identity

- ObjectId — identifier; timestamp ko authorization proof mat samjho.

### Edge cases aur reasoning

- Conditional decrement — {_id, stock:{$gte:n}} filter + $inc:{stock:-n} single atomic claim; matched count se success decide karo.
- Upsert race — same logical key par concurrent upserts duplicate bana sakti hain without suitable unique index; duplicate outcome handle karo.
- Array predicate trap — separate dot conditions different array elements match kar sakti hain; same-element contract ke liye $elemMatch.

## Research notes: Model bounded growth and data ownership

- Embedding related data ko reads/atomic updates ke liye saath rakhti hai.

## Example se samjho

- Scenario — Array entries `{color:red,size:S}` aur `{color:blue,size:L}` hain; query ko same item red aur L chahiye.
- Reasoning — Separate dot predicates red pehle aur L doosre element se match kar sakti hain. Same-element requirement ko $elemMatch mein combine karo; yahan match nahi hai.
- Catch — Matching document ka matlab har condition same nested object par true nahi; query contract mein array element scope explicitly model karo.

## Recall aur practice

- Sawal — Atomic $inc alone stock ko negative hone se rokta hai?
- Jawaab — Nahi; increment atomic hai, invariant conditional filter se enforce. stock>=requested ko same update predicate mein rakho.
- Khud try karo — Last-stock reservation query likho; two callers mein one success, no negative stock aur duplicate operation receipt verify karo.

## Practice questions

### Easy · Update bina operator

```js
await users.updateOne({ _id: id }, { name: 'Asha' });
```

<details>
<summary>Answer</summary>

- Result — Node driver error: update document requires atomic operators.
- Fix — `{ $set: { name: 'Asha' } }`.
- Poora document badalna ho — `replaceOne(filter, newDoc)` (baaki fields hat jaate hain).

</details>

### Easy · Embed ya reference?

User ka address aur user ke orders — kya embed karoge, kya reference?

<details>
<summary>Answer</summary>

- Address — embed; user ke saath padha jaata hai, chhota aur bounded.
- Orders — alag collection with `userId` reference; unbounded growth (16 MB document limit), independent queries/paging.
- Rule — access pattern + growth + update frequency se decide; "jo saath padha jaaye, saath rakho".

</details>

### Medium · Stock atomically ghatao

Do customers ek saath last item kharidte hain. Stock negative na ho — query likho.

<details>
<summary>Answer</summary>

```js
const result = await products.updateOne(
  { _id: productId, stock: { $gte: qty } },
  { $inc: { stock: -qty } },
);
if (result.modifiedCount === 0) throw new Error('Out of stock');
```

- Atomic — single document update atomic hai; condition aur decrement ek operation mein.
- Read-then-write (`findOne` → check → `updateOne`) race deta hai.

</details>

### Medium · Array query ka trap

```js
db.orders.find({ 'items.sku': 'A', 'items.qty': { $gt: 5 } });
```

Order `{ items: [{ sku: 'A', qty: 1 }, { sku: 'B', qty: 9 }] }` match karega?

<details>
<summary>Answer</summary>

- Haan — dono conditions alag-alag array elements se satisfy ho gayi.
- Same element chahiye:

```js
db.orders.find({ items: { $elemMatch: { sku: 'A', qty: { $gt: 5 } } } });
```

</details>

### Hard · Ek user ka ek hi cart (upsert race)

```js
await carts.updateOne({ userId }, { $setOnInsert: { items: [] } }, { upsert: true });
```

Do parallel requests par kabhi do carts ban jaate hain. Kyun aur fix?

<details>
<summary>Answer</summary>

- Race — dono upserts ko "document nahi mila" dikh sakta hai aur dono insert kar dete hain.
- Fix — unique index: `carts.createIndex({ userId: 1 }, { unique: true })`.
- Ab — doosra insert `E11000 duplicate key` deta hai; us error par operation retry karo (ab document milega aur update hoga).
- Rule — uniqueness invariant hamesha unique index se; app-level check race-prone.

</details>

## Sources — aur padhne ke liye

- [MongoDB elemMatch](https://www.mongodb.com/docs/manual/reference/operator/query/elemmatch/)

- [MongoDB CRUD operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/03-documents-crud-modeling.md)
