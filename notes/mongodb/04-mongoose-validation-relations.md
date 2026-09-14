---
id: mongo-mongoose-validation-relations
title: Mongoose schemas validation and relationships
track: mongodb
order: 4
level: Intermediate
minutes: 31
summary: Schema validation ek layer hai; concurrent writes ke rules DB constraints aur explicit update conditions se enforce hote hain.
tags: mongoose, schemas, validation, populate, middleware, lean
---

## Mental model — simple soch

Mongoose MongoDB ke upar object modeling layer hai. Schema document structure aur application behavior define karta hai; model collection operations ka interface deta hai; document individual hydrated instance hota hai. Mongoose validation application boundary hai, MongoDB index/constraint alag database boundary hai. In dono ko interchangeable samajhne se concurrency bugs aate hain.

> **Core takeaway:** Schema validation ek layer hai; concurrent writes ke rules DB constraints aur explicit update conditions se enforce hote hain.

## Define a study topic model

```js
import mongoose from "mongoose";
const { Schema } = mongoose;

const topicSchema = new Schema({
  slug: { type: String, required: true, trim: true },
  title: { type: String, required: true, maxlength: 160 },
  track: { type: String, enum: ["javascript", "react", "java", "mongodb"], required: true },
  minutes: { type: Number, min: 1, max: 240, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false }
}, { timestamps: true });

topicSchema.index({ slug: 1 }, { unique: true });
export const Topic = mongoose.model("Topic", topicSchema);

// Example usage after connecting and defining the User model:
// await Topic.find({ published: true }).populate("author", "name").lean();
```

Required fields, enums, numeric bounds aur string constraints invalid states reduce karte hain. Casting validation se pehle occur kar sakti hai; type cast failure ko meaningful API error map karo. `unique: true` validator nahi, unique index declaration helper hai. Concurrent duplicate insert ko database index reject karega; duplicate-key error ko conflict response handle karo. Production mein index creation controlled migration/deployment step rakho.

## Save versus query updates

Document `.save()` document validation aur relevant save middleware run karta hai. `updateOne`/`findOneAndUpdate` query update path hai; same hooks automatically assume mat karo. Update validators enable karne ke liye `runValidators: true` use karna pad sakta hai, aur woh updated paths/operators ki documented limitations follow karte hain. Cross-field invariant, jaise discount less than price, simple query validator se always safely enforce nahi hota; explicit service logic, conditional update ya suitable database constraints design karo.

Pre/post middleware audit logic ya normalization centralize kar sakta hai, lekin hidden network side effects tracing difficult bana sakte hain. Hooks model compilation se pehle register karo. Password hashing ko modified-password check ke bina run karoge to existing hash dobara hash ho sakta hai.

## Middleware, virtuals and computed fields in practice

```js
// Password hashing pre-save hook — guarded by isModified so re-saves don't re-hash.
topicSchema.pre("save", async function hashIfChanged(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

// Virtual: not stored in MongoDB, computed on read.
topicSchema.virtual("readingTimeLabel").get(function () {
  return `${this.minutes} min read`;
});

// toJSON transform: strip internal fields before sending to the client.
topicSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
    delete ret.internalNotes;
    return ret;
  }
});
```

`isModified("password")` check critical hai — bina isske, document ka koi bhi unrelated field update karke `.save()` call karne par password dobara hash ho jaayega (already-hashed value par hash apply hoke wrong hash ban jaayega, login tootega). Virtual `readingTimeLabel` database mein persist nahi hoti; sirf jab document access/serialize hota hai tab compute hoti hai — filter/sort operations mein virtual field use nahi kar sakte kyunki woh query engine ko dikhti hi nahi. `toJSON` transform ek centralized jagah hai jahan se internal-only fields (password hash, audit metadata) ko API response se consistently strip kar sakte ho, taaki har controller mein manually delete na karna pade.

Post hooks side effects ke liye useful hain, jaise document save hone ke baad ek analytics event emit karna:

```js
topicSchema.post("save", function logCreation(doc) {
  if (doc.wasNew) analytics.track("topic_created", { id: doc._id });
});
```

Post hook original operation complete hone ke baad chalta hai, isliye yahan thrown error ab save ko rollback nahi kar sakta — sirf logging/notification jaise non-critical side effects yahan rakho, core invariants pre-hooks/schema validation mein enforce karo.

## Relationships and read cost

Populate references ko related documents se replace karta hai; yeh foreign-key enforcement nahi hai. Missing referenced document possible hai. Related fields limit karo aur accidental large nested population avoid karo. Query count aur payload size observe karo. Virtual properties computed presentation data ke liye useful hain; persistence assume mat karo.

Lean plain objects return karta hai, hydrated document instances nahi. Read-only response paths par overhead reduce ho sakta hai, lekin document methods, change tracking aur normal hydration features available nahi hote. Getters/virtuals behavior ke liye installed version/plugins verify karo — by default `.lean()` ke saath virtuals evaluate nahi hoti unless explicitly enabled (`.lean({ virtuals: true })` ya plugin). Lean result par `.save()` nahi call kar sakte, aur instance methods (jo schema par define kiye the) bhi available nahi hote kyunki lean object prototype chain se disconnected plain object hai.

Populate ko virtuals ke saath bhi use kar sakte ho — "virtual populate" — jab reverse reference chahiye ho bina foreign key duplicate kiye:

```js
// Author schema doesn't store a topics array; it's derived via virtual populate.
userSchema.virtual("topics", {
  ref: "Topic",
  localField: "_id",
  foreignField: "author"
});

// await User.findById(id).populate("topics").lean({ virtuals: true });
```

Yeh pattern useful hai jab "many" side (Topic) already "one" side (User) ko reference karti hai, aur reverse direction (ek user ke saare topics) query karna ho bina User document mein ek array maintain kiye jo duplicate/stale ho sakta.

## Practice

Duplicate slug, missing author, invalid track aur too-large minutes create karke errors compare karo. Save aur query update paths par same rule test karo. Populate query ko projection ke saath inspect karo aur plain lean object ko document instance se compare karo.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Schema mein `required: true` lagane se database-level guarantee mil jaati hai jaise SQL `NOT NULL`. **Why it breaks:** Mongoose validation sirf Mongoose ke through hone wale writes par apply hoti hai — koi bhi direct driver insert, `mongosh` se manual write, ya migration script isse bypass kar sakta hai. **Fix:** Critical invariants ke liye MongoDB-level `$jsonSchema` collection validator bhi add karo jab guarantee application boundary se bahar bhi honi chahiye.
- **Wrong assumption:** `findOneAndUpdate` document ke saare `pre("save")` hooks automatically chalayegi jaise `.save()` chalati hai. **Why it breaks:** Query middleware (`pre("findOneAndUpdate")`) aur document middleware (`pre("save")`) alag hooks hain; ek dusre ko automatically trigger nahi karta, isliye `.save()` mein likha gaya password-hashing jaisa logic query-style update se silently skip ho sakta hai. **Fix:** Har write-path (save vs query update) ke liye explicitly socho ki kaunse hooks chalne chahiye, aur zaroorat ho to dono jagah equivalent logic register karo ya update path ko avoid karke `.save()` consistently use karo.
- **Wrong assumption:** `.lean()` lagाने से sirf performance milta hai, baaki sab same behave karta hai. **Why it breaks:** Lean object par virtuals (bina explicit option ke), instance methods, aur automatic getter transformations available nahi hote — code jo `doc.someVirtual` ya `doc.someMethod()` expect karta hai, silently `undefined`/error dega. **Fix:** Lean sirf un read paths par use karo jahan tumhe sirf plain data chahiye; jahan virtuals/methods chahiye, ya to hydrated document rakho ya `.lean({ virtuals: true })` explicitly enable karo.

## Interview questions — bolkar practice karo

**Q. Unique validator precheck enough hai?** Nahi. Two concurrent requests precheck pass kar sakti hain; unique database index authoritative protection deta hai.

**Q. Populate referential integrity ensure karta hai?** Nahi. It resolves reads; missing/deleted references aur lifecycle rules application/schema design handle karta hai.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Same email ke do requests application existence check pass karke user create karti hain. Duplicate committed records kaun rokega?

> **Hint:** Pre-check aur write ke beech doosri request aa sakti hai.

**Answer guide — compare after attempting:** Canonical email representation par DB unique index rakho aur duplicate-key error handle karo. Normalization before write define karo. Mongoose validation/existence query alone concurrency serialize nahi karti. Simultaneous submissions aur existing duplicate dono test karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Mongoose validation](https://mongoosejs.com/docs/validation.html) unique indexes aur update limitations explain karta hai. [Mongoose populate](https://mongoosejs.com/docs/populate.html) relationship queries ka reference hai.
