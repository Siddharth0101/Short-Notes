# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Worked implementation

```javascript
async function mapLimit(items, limit, mapper) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = {
          status: 'fulfilled',
          value: await mapper(items[index], index),
        };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}
```

## Research notes: Independent outcomes with allSettled

```js
const outcomes = await Promise.allSettled([
  Promise.resolve({ unread: 4 }),
  Promise.reject(new Error('Recommendations unavailable')),
]);
console.log(outcomes.map(item => item.status));
// ["fulfilled", "rejected"]
```
