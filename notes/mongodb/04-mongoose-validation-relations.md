---
id: mongo-mongoose-validation-relations
title: Mongoose schemas validation and relationships
track: mongodb
order: 4
level: Intermediate
minutes: 3
summary: Mongoose — MongoDB ke liye schema/model layer.
tags: mongoose, schemas, validation, populate, middleware, lean
---

## Quick revision

> Revision target — ODM convenience aur database-enforced invariants ki boundaries clear karo.

- Mongoose — MongoDB ke liye schema/model layer.
- Schema — field types, defaults, validators aur hooks.
- Model — collection ke documents query/create karne ka API.
- Validation — client input ke saath persistence rules bhi check karo.
- `unique` — unique index declaration; normal validator nahi.
- Update validators — update methods mein options/limitations check karo.
- Populate — references resolve; joins jaisa cost/query volume evaluate karo.
- `lean()` — plain objects; document methods/change tracking nahi.
- Hook — save aur query middleware ka behavior same assume mat karo.
- Document/query hooks — save aur updateOne ke hooks/context ko interchangeable mat samjho.
- Virtual field — computed representation; persisted field/index automatic nahi banta.
- Version check — stale read se overwrite avoid karne ke liye optimistic concurrency ka explicit contract.

### Edge cases aur reasoning

- Update validation scope — runValidators updated supported paths/operators par; $inc aur whole-document invariants automatically cover nahi.
- Query await reuse — Mongoose Query real reusable Promise nahi; repeated execution unwanted failure/work de sakti, exec result deliberately share karo.
- Lean feature boundary — default lean document getters/virtuals/save unavailable; plugins/options ka actual contract separately verify karo.

## Example se samjho

- Scenario — Two signup requests same email ke liye application lookup mein no user dekhti hain, phir dono insert karti hain.
- Reasoning — Database unique index concurrent duplicate ko final boundary par reject karta hai. API duplicate-key result ko documented conflict mein map kare.
- Catch — Pre-check race prevent nahi karta; unique declaration ko normal field validator mat samjho. Tests mein actual index readiness aur concurrent insert outcome verify karo.

## Recall aur practice

- Sawal — Schema max validator aur runValidators:true ke saath $inc always bound enforce karega?
- Jawaab — Nahi; Mongoose update validators $inc check nahi karte. Conditional DB update/appropriate invariant guard chahiye.
- Khud try karo — Save versus update validation compare karo; duplicate index error, $inc bound, missing required path aur lean response shape verify karo.

## Practice questions

### Easy · `unique: true` validator nahi hai

`email: { type: String, unique: true }` ke baad bhi duplicate emails mile. Kaise?

<details>
<summary>Answer</summary>

- `unique` — Mongoose validator nahi, sirf index banane ka hint.
- Index nahi bana — `autoIndex` band tha, ya collection mein pehle se duplicates the to index creation fail.
- Fix — migration/script se index create karo (duplicates clean karke) aur `E11000` ko `409` mein map karo.

</details>

### Easy · Update par validation skip

```js
await User.findByIdAndUpdate(id, { age: -5 });
```

Schema mein `min: 0` hai. Kya hoga?

<details>
<summary>Answer</summary>

- Default — update validators nahi chalte; `-5` save ho jaata hai.
- Fix — `{ runValidators: true }` (aur `new: true` updated doc ke liye).
- Limit — update validators sirf update mein mention paths par chalte hain, aur `this` document nahi hota.

</details>

### Medium · `lean()` kab?

<details>
<summary>Answer</summary>

- `lean()` — plain JS objects; hydration skip, kam memory, fast reads.
- Nahi milta — getters/setters, virtuals (by default), `save()`, document methods.
- Use — read-only API responses/lists; edit-then-save flows mein full documents.

</details>

### Medium · Password hash bypass ho gaya

`pre('save')` hook password hash karta hai. Admin panel `User.updateOne({ _id }, { password })` use karta hai aur plain password save ho gaya.

<details>
<summary>Answer</summary>

- Kyun — `save` middleware sirf `doc.save()` / `create` par chalta hai, `updateOne` jaisi queries par nahi.
- Fix — password change hamesha ek service function se jo hash karke save kare; ya query middleware (`pre('updateOne')`) handle kare.
- Defence — schema mein password field `select: false` aur plain-text detect karne wala test.

</details>

### Hard · Concurrent edits mein lost update

Do admins same product document load karke `doc.save()` karte hain. Doosre ka save pehle ke changes mita deta hai. Mongoose mein fix?

<details>
<summary>Answer</summary>

```js
const productSchema = new Schema({ name: String, price: Number }, { optimisticConcurrency: true });
```

- `optimisticConcurrency` — `save()` version (`__v`) match karta hai; mismatch par `VersionError`.
- Handle — `409 Conflict` + latest data dikhao, user dobara apply kare.
- Alternative — targeted atomic updates (`$set` sirf changed fields) taaki unrelated fields overwrite na hon.

</details>

## Sources — aur padhne ke liye

- [Mongoose update validation caveats](https://mongoosejs.com/docs/validation.html)
- [Mongoose query execution contracts](https://mongoosejs.com/docs/queries.html)

- [Mongoose populate](https://mongoosejs.com/docs/populate.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/04-mongoose-validation-relations.md)
