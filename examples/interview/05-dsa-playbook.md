# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Worked coding drill

```js
function longestUnique(text) {
  const chars = [...text];
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < chars.length; right++) {
    const previous = lastSeen.get(chars[right]);
    if (previous !== undefined) left = Math.max(left, previous + 1);
    lastSeen.set(chars[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```
