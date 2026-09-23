# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A reusable lower bound

```js
function lowerBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function binarySearch(values, target) {
  const index = lowerBound(values, target);
  return index < values.length && values[index] === target ? index : -1;
}
```

```js
function upperBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] <= target) left = mid + 1;   // <= instead of <
    else right = mid;
  }
  return left;
}

// Duplicates count without scanning:
const count = upperBound(values, t) - lowerBound(values, t); // O(log n)
// Full equal range as a half-open interval:
const range = [lowerBound(values, t), upperBound(values, t)];
```

## Search a monotone answer space

```js
function shipWithinDays(weights, days) {
  // Brute force: har capacity ko max weight se total tak try karo -> O(n * totalWeight).
  // Bottleneck: feasibility monotone hai, phir bhi hum linearly scan kar rahe hain.
  const canShip = (capacity) => {
    let usedDays = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > capacity) { usedDays++; load = 0; } // naya din shuru
      load += w;
    }
    return usedDays <= days;
  };

  let left = Math.max(...weights);        // koi package split nahi ho sakta
  let right = weights.reduce((s, w) => s + w, 0); // sab ek hi din mein
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canShip(mid)) right = mid;        // feasible: yeh ya isse chhota answer
    else left = mid + 1;                  // infeasible: strictly bada chahiye
  }
  return left;
}
```

## Rotated sorted array: half the array is always sorted

```js
function searchRotated(values, target) {
  let left = 0;
  let right = values.length - 1;   // inclusive interval — deliberate choice
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] === target) return mid;

    if (values[left] <= values[mid]) {
      // Left half [left, mid] definitely sorted hai.
      if (values[left] <= target && target < values[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      // Warna right half [mid, right] definitely sorted hai.
      if (values[mid] < target && target <= values[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}
```
