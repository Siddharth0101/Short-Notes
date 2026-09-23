# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Frequency counters

```js
function isAnagram(a, b) {
  const counts = new Map();
  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  for (const ch of b) {
    if (!counts.has(ch)) return false;
    const remaining = counts.get(ch) - 1;
    if (remaining === 0) counts.delete(ch);
    else counts.set(ch, remaining);
  }
  return counts.size === 0;
}
```

```js
// Step 1: brute force — har window ke liye fresh counts banao.
// Windows: n - m + 1, har window ka count O(m). Total O(nm).
//
// Bottleneck: adjacent windows sirf DO characters se differ karte hain
// (ek left se nikalta hai, ek right se aata hai) — phir bhi hum m counts
// dobara build kar rahe hain.

function containsPermutation(text, pattern) {
  // Dono inputs ko Unicode code points mein padho.
  text = Array.from(text);
  pattern = Array.from(pattern);
  const m = pattern.length;
  if (m === 0 || m > text.length) return m === 0;

  const need = new Map();
  for (const ch of pattern) need.set(ch, (need.get(ch) ?? 0) + 1);

  // `deficit` = kitne distinct characters abhi bhi required count par nahi hain.
  let deficit = need.size;

  const adjust = (ch, delta) => {
    if (!need.has(ch)) return;
    const before = need.get(ch);
    const after = before - delta;    // delta +1 = character window mein aaya
    need.set(ch, after);
    if (before === 0 && after !== 0) deficit++;   // ek satisfied character toota
    if (after === 0 && before !== 0) deficit--;   // ek character ab exactly satisfied
  };

  for (let right = 0; right < text.length; right++) {
    adjust(text[right], 1);
    if (right >= m) adjust(text[right - m], -1);  // window size exactly m rakho
    if (right >= m - 1 && deficit === 0) return true;
  }
  return false;
}
```

## Two pointers on sorted data

```js
function pairWithSum(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
```

```js
function threeSum(nums) {
  const a = [...nums].sort((x, y) => x - y);   // copy, so caller ka array safe
  const result = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (a[i] > 0) break;                       // sorted: aage sab positive, sum > 0
    if (i > 0 && a[i] === a[i - 1]) continue;  // same first element dobara mat lo
    let left = i + 1;
    let right = a.length - 1;
    while (left < right) {
      const sum = a[i] + a[left] + a[right];
      if (sum < 0) { left++; continue; }
      if (sum > 0) { right--; continue; }
      result.push([a[i], a[left], a[right]]);
      // Dono sides ke duplicates skip karo, warna same triplet repeat hoga.
      while (left < right && a[left] === a[left + 1]) left++;
      while (left < right && a[right] === a[right - 1]) right--;
      left++;
      right--;
    }
  }
  return result;
}
```

## Sliding windows

```js
function maxWindowSum(nums, k) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];
    best = Math.max(best, sum);
  }
  return best;
}
```

```js
// Smallest contiguous subarray with sum >= target. Nonnegative inputs only.
function minWindowSum(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    // Invariant after this loop: [left, right] ka sum < target, ya left > right.
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}
```

## Prefix sums

```js
function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]);   // empty prefix ek baar dekha gaya hai
  let prefix = 0;
  let count = 0;
  for (const n of nums) {
    prefix += n;
    count += seen.get(prefix - k) ?? 0;  // pehle count karo
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1); // phir current prefix record karo
  }
  return count;
}
```

```js
// "Range [l, r] ke har element mein v add karo" wali q updates, phir final array.
function applyRangeUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;
    diff[r + 1] -= v;      // r ke baad effect band
  }
  const result = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];    // running prefix hi final value hai
    result[i] = running;
  }
  return result;
}
```
