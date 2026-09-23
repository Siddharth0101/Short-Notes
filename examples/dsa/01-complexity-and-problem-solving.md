# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## The solving loop

```js
function maximum(values) {
  if (values.length === 0) return undefined;
  let best = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > best) best = values[i];
  }
  return best;
}
```

## Derive an optimization, don't guess it

```js
// Step 1: brute force. Har (start, end) pair ka sum recompute karo.
function maxSubarrayBrute(nums) {
  let best = -Infinity;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];          // incremental, so inner body O(1)
      best = Math.max(best, sum);
    }
  }
  return best;
}
```

```js
// Step 2: identify the invariant. `current` = best sum of a subarray ENDING at i.
function maxSubarray(nums) {
  if (nums.length === 0) return undefined; // contract: empty subarray allowed nahi
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // Either extend the previous best-ending-here, or restart at nums[i].
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
```
