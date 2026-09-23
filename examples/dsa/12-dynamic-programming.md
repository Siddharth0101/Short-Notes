# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Memoization and tabulation

```js
// Form 1: pure recursion. Correct, but exponential.
function coinsBrute(coins, amount) {
  if (amount === 0) return 0;
  if (amount < 0) return Infinity;
  let best = Infinity;
  for (const c of coins) best = Math.min(best, 1 + coinsBrute(coins, amount - c));
  return best;
}
// Recursion tree: har node C branches, depth amount/min(coins) -> O(C^(A/min))
// Bottleneck: coinsBrute(coins, 7) alag-alag raston se baar-baar call hota hai.

// Form 2: memoization (top-down). Same recurrence, cached.
function coinsMemo(coins, amount, cache = new Map()) {
  if (amount === 0) return 0;
  if (amount < 0) return Infinity;
  if (cache.has(amount)) return cache.get(amount);
  let best = Infinity;
  for (const c of coins) best = Math.min(best, 1 + coinsMemo(coins, amount - c, cache));
  cache.set(amount, best);
  return best;
}
// Distinct states: A + 1. Work per state: C. -> O(A*C) time, O(A) space.
// Lekin recursion depth O(A/min(coins)) — bade amount par stack overflow.

// Form 3: tabulation (bottom-up). Stack-safe, aur memory compression visible.
// -> upar wala minimumCoins(). Same O(A*C) time, O(A) space, koi recursion nahi.
```

## Minimum coin change

```js
function minimumCoins(coins, amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new RangeError('amount must be a nonnegative integer');
  }
  if (coins.some(c => !Number.isInteger(c) || c <= 0)) {
    throw new RangeError('coins must be positive integers');
  }
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```js
function coinsUsed(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  const choice = Array(amount + 1).fill(-1);   // dp[a] achieve karne wala last coin
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
        choice[a] = coin;                      // decision store karo
      }
    }
  }
  if (dp[amount] === Infinity) return null;

  const used = [];
  for (let a = amount; a > 0; a -= choice[a]) used.push(choice[a]); // backtrack
  return used;
}
```

## Longest increasing subsequence: two correct solutions

```js
// Solution 1: classic DP. dp[i] = LIS length ending exactly at index i.
function lisQuadratic(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);   // answer kisi bhi index par end ho sakta hai
}
// O(n^2) time, O(n) space. State: "index i par end hone wali best length."
```

```js
// Solution 2: patience sorting. tails[k] = smallest possible tail of an
// increasing subsequence of length k+1 seen so far.
function lisNLogN(nums) {
  const tails = [];
  for (const n of nums) {
    // First index jahan tails[idx] >= n (lowerBound) — chapter 04 wala template.
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;                    // replace, ya append agar lo === tails.length
  }
  return tails.length;
}
// O(n log n) time, O(n) space.
```

## Counting and knapsack variants

```js
// 0/1 knapsack, one-dimensional. Capacity DESCENDING — yeh line hi sab decide karti hai.
function knapsack(items, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (const { weight, value } of items) {
    for (let c = capacity; c >= weight; c--) {     // descending!
      dp[c] = Math.max(dp[c], dp[c - weight] + value);
    }
  }
  return dp[capacity];
}

// Unbounded knapsack: same code, ASCENDING loop — reuse intentionally allowed.
function unboundedKnapsack(items, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (const { weight, value } of items) {
    for (let c = weight; c <= capacity; c++) {     // ascending!
      dp[c] = Math.max(dp[c], dp[c - weight] + value);
    }
  }
  return dp[capacity];
}
```

```js
function editDistance(a, b) {
  const n = a.length, m = b.length;
  // dp[i][j] = a ke pehle i characters ko b ke pehle j characters mein
  //            convert karne ke minimum operations.
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;   // i deletions
  for (let j = 0; j <= m; j++) dp[0][j] = j;   // j insertions

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];  // free match
      else dp[i][j] = 1 + Math.min(
        dp[i - 1][j - 1],   // replace
        dp[i - 1][j],       // delete from a
        dp[i][j - 1]        // insert into a
      );
    }
  }
  return dp[n][m];
}
```
