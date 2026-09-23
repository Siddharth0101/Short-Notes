# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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
