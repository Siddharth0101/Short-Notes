# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Authorize the resource in the query

```js
// Express 5 excerpt. requireUser verifies a session/token and supplies req.user.
// Topic is a Mongoose model; ObjectId validation happens before querying.
app.patch("/api/topics/:id", requireUser, async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: "Invalid topic id" });
  }
  if (typeof req.body.title !== "string" || !req.body.title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const topic = await Topic.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    { $set: { title: req.body.title.trim() } },
    { new: true, runValidators: true }
  );
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json({ data: topic });
});
```
