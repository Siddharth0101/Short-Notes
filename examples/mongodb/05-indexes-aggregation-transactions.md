# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Index around an actual query

```js
db.topics.createIndex({ track: 1, published: 1, createdAt: -1, _id: -1 });

db.topics.find({ track: "react", published: true })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .explain("executionStats");
```

## More aggregation stages

```js
db.sessions.aggregate([
  { $match: { completed: true } },
  { $addFields: { minutesRounded: { $round: ["$minutes", 0] } } },
  {
    $facet: {
      byTrack: [
        { $group: { _id: "$track", total: { $sum: "$minutes" } } },
        { $sort: { total: -1 } }
      ],
      byBucket: [
        { $bucket: {
            groupBy: "$minutes",
            boundaries: [0, 15, 30, 60, 120],
            default: "120+",
            output: { count: { $sum: 1 } }
        } }
      ]
    }
  }
]);
```

```js
db.topics.aggregate([
  { $unwind: { path: "$tags", includeArrayIndex: "tagPosition" } }
]);
```

## Aggregation pipeline

```js
db.sessions.aggregate([
  { $match: { completed: true, startedAt: { $gte: ISODate("2026-01-01") } } },
  { $group: { _id: "$track", totalMinutes: { $sum: "$minutes" }, sessions: { $sum: 1 } } },
  { $sort: { totalMinutes: -1 } },
  { $project: { _id: 0, track: "$_id", totalMinutes: 1, sessions: 1 } }
]);
```

## Research notes: Match the version you actually read

```js
const result = await orders.updateOne(
  { _id: orderId, version: expectedVersion },
  { $set: { status: 'confirmed' }, $inc: { version: 1 } },
);
if (result.matchedCount === 0) {
  throw new Error('Missing order or concurrent change');
}
```
