# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trace the order

```js
console.log("A");
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("B");
// Browser output: A, B, C, D
```

## Fetch with explicit failure handling

```js
async function getTopic(id, signal) {
  const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
    signal,
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Topic request failed (${response.status})`);
  }
  return response.json();
}

const controller = new AbortController();
try {
  const topics = await Promise.all([
    getTopic("closures", controller.signal),
    getTopic("promises", controller.signal)
  ]);
  console.log(topics);
} catch (error) {
  if (error.name !== "AbortError") console.error(error.message);
}
// Top-level await requires a module. Call controller.abort() to cancel.
```

## Retrying transient failures

```js
async function withRetry(fn, { attempts = 3, baseDelay = 300 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await new Promise(resolve => setTimeout(resolve, baseDelay * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
}

await withRetry(() => getTopic("closures"));
```

```js
// Same logic, two styles
function loadProfileThen(id) {
  return getTopic(id)
    .then(topic => enrich(topic))
    .catch(error => {
      console.error(error.message);
      throw error;
    });
}

async function loadProfileAsync(id) {
  try {
    const topic = await getTopic(id);
    return await enrich(topic);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
```

## Depth walkthrough — andar kya ho raha hai?

```js
const pending = new Promise(resolve => {
  console.log('executor');
  resolve(7);
});
pending.then(value => console.log('reaction', value));
console.log('sync-end');
// executor → sync-end → reaction 7
```
