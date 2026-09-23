# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Query design drill

```js
const filter = {
  userId,
  $or: [
    { createdAt: { $lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
  ],
};
const page = await orders.find(filter)
  .sort({ createdAt: -1, _id: -1 })
  .limit(21)
  .toArray(); // show 20; extra record tells us if another page exists
```
