# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Token bucket ka original local model

```js
function consume(bucket, now, capacity, perSecond, cost = 1) {
  if (![bucket.tokens, bucket.at, now, capacity, perSecond, cost].every(Number.isFinite) ||
      capacity <= 0 || perSecond <= 0 || cost <= 0 || cost > capacity || now < bucket.at ||
      bucket.tokens < 0 || bucket.tokens > capacity) throw new RangeError('Invalid bucket');
  const tokens = Math.min(capacity, bucket.tokens + (now - bucket.at) * perSecond / 1000);
  const allowed = tokens >= cost;
  return {
    allowed,
    bucket: { tokens: allowed ? tokens - cost : tokens, at: now },
    retryMs: allowed ? 0 : Math.ceil((cost - tokens) * 1000 / perSecond),
  };
}
let state = { tokens: 2, at: 0 };
for (const now of [0, 0, 0, 500, 1000]) {
  const result = consume(state, now, 2, 1);
  state = result.bucket;
  console.log(result.allowed);
}
// true, true, false, false, true
```
