# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

```js
topicSchema.post("save", function logCreation(doc) {
  if (doc.wasNew) analytics.track("topic_created", { id: doc._id });
});
```

## Relationships and read cost

```js
// Author schema doesn't store a topics array; it's derived via virtual populate.
userSchema.virtual("topics", {
  ref: "Topic",
  localField: "_id",
  foreignField: "author"
});

// await User.findById(id).populate("topics").lean({ virtuals: true });
```
