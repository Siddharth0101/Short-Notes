---
id: dsa-dynamic-programming
title: Dynamic programming from state to recurrence
track: dsa
order: 12
level: Advanced
minutes: 4
summary: DP — overlapping subproblems ke results reuse karo.
tags: dynamic-programming, memoization, tabulation, coin-change, knapsack
visual: dynamic-programming
---

## Quick revision

> Revision target — State meaning, base case aur transition likhkar DP ko table se pehle explain karo.

- DP — overlapping subproblems ke results reuse karo.
- State — subproblem ko uniquely define karne wali minimum information.
- Transition — smaller states se current answer ka relation.
- Base case — smallest states ke known answers.
- Memoization — top-down recursion + cache.
- Tabulation — bottom-up dependency order mein fill karo.
- Complexity — states × transition cost; storage alag count.
- 0/1 knapsack — one-array optimization mein capacity reverse scan.
- Unbounded choice — reuse allowed; loop order contract ke hisaab se.
- Reconstruction — choices/parents store karo jab actual solution chahiye.
- Optimization — sirf required prior states rakho; dependency overwrite mat karo.
- Counting order — coin loop aur amount loop ka order combinations vs permutations change kar sakta hai.
- Impossible state — infinity/negative sentinel safely choose; overflow aur invalid transitions avoid.
- DAG view — DP states dependencies ka graph; valid evaluation order pehle dependencies solve kare.

### Common DP states

- Grid traveler — state row/column; blocked/boundary cells ke base cases clear karo.
- Coin change — minimum coins aur combination count alag transitions maangte hain.
- LCS — two-prefix state; matching chars par diagonal + 1, warna neighboring maximum.

### Edge cases aur reasoning

- LIS quadratic — dp[i]=1+max(dp[j]) for j<i and a[j]<a[i]; O(n²) time, O(n) space for strictly increasing subsequence.
- LIS tails — smallest tail per length + lower_bound gives O(n log n) length; tails array actual valid subsequence necessarily nahi.
- Edit distance — prefix states; match diagonal unchanged, otherwise 1+min(insert,delete,replace); O(nm) time, rolling rows O(min(n,m)) space.
- Memo key completeness — index alone insufficient when budget/previous choice changes result; all future-relevant information key mein include karo.
- Counting precision — many-path counts safe-integer bound cross kar sakte; BigInt/modulus contract explicitly choose karo.

## Research notes: Numeric magnitude can dominate DP

- O(nW) knapsack numeric capacity W par depend karta hai.

## Example se samjho

- Scenario — Steps1 ya2 allowed; n stairs tak pahunchne ke ways count karo. ways(0)=1, ways(1)=1.
- Reasoning — Last move1 ya2 tha, isliye ways(n)=ways(n−1)+ways(n−2). n=3 par3 ways:111,12,21; har required state once compute ho sakta hai.
- Catch — Zero stairs ka one empty path counting base hai; minimum-cost problem ka base alag ho sakta hai. Large counts ke numeric precision contract ko mention karo.

## Recall aur practice

- Sawal — 0/1 knapsack capacity forward scan se same item reuse kaise hota hai?
- Jawaab — Current item ka updated smaller-capacity state later read hota; reverse scan previous-item states preserve karta hai.
- Khud try karo — LIS [3,1,2,2,4] result3 aur edit distance kitten→sitting result3 verify karo; empty inputs aur duplicate strictness explain karo.

## Practice questions

### Easy · State aur recurrence pehchano

Climbing stairs (1 ya 2 steps) mein state, transition aur base case kya hai?

<details>
<summary>Answer</summary>

- State — `ways(i)` = step `i` tak pahunchne ke tareeke.
- Transition — `ways(i) = ways(i − 1) + ways(i − 2)`.
- Base — `ways(0) = 1`, `ways(1) = 1`.
- Space — sirf last do values chahiye → `O(1)`.

</details>

### Medium · Minimum coins

`coins = [1, 2, 5]`, `amount = 11` → `3`. Impossible ho toh `-1`.

<details>
<summary>Answer</summary>

```js
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

- Impossible state — `Infinity` se, `0` se nahi (warna galat minimum).
- Unbounded — har coin dobara use ho sakta hai.
- `O(amount × coins)`.

</details>

### Medium · Ways count: loop order kyun matter karta hai?

`coins = [1, 2]`, `amount = 3`. Combinations (`1+2` aur `2+1` same) ka count chahiye.

<details>
<summary>Answer</summary>

```js
function countWays(coins, amount) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) dp[a] += dp[a - coin];
  }
  return dp[amount];
}
```

- Answer — `2` (`1+1+1`, `1+2`).
- Coins outer — har combination ek fixed coin order mein bana; duplicates nahi.
- Amount outer, coins inner — ordered sequences (permutations) ginta hai → `3`.
- Bade counts — BigInt ya modulo.

</details>

### Medium · Longest common subsequence

`"abcde"`, `"ace"` → `3`.

<details>
<summary>Answer</summary>

```js
function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
```

- State — `dp[i][j]` = `a` ke pehle `i` aur `b` ke pehle `j` chars ka LCS.
- Reconstruction — table se backtrack karke actual subsequence.
- `O(mn)` time; sirf length chahiye toh do rows se `O(n)` space.

</details>

### Hard · 0/1 knapsack in 1D

`weights`, `values`, `capacity`; har item max ek baar. Max value?

<details>
<summary>Answer</summary>

```js
function knapsack(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = capacity; c >= weights[i]; c--) { // reverse!
      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}
```

- Reverse loop — `dp[c - w]` abhi purane (item use se pehle) row ka hai; forward loop same item ko kai baar use kar deta (unbounded).
- `O(n × capacity)` — capacity bahut badi ho toh yeh pseudo-polynomial approach slow.

</details>

### Hard · LIS in `O(n log n)`

`[10,9,2,5,3,7,101,18]` → `4`.

<details>
<summary>Answer</summary>

```js
function lengthOfLIS(nums) {
  const tails = []; // tails[k] = length k+1 wali increasing subsequence ka smallest end
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
```

- `tails` sorted rehta hai — har `x` lower bound position par replace/append.
- `tails` khud actual LIS nahi; sirf length sahi hai (sequence ke liye parent pointers).
- Strictly increasing — `<`; non-decreasing ke liye `<=`.

</details>

## Sources — aur padhne ke liye

- [MIT dynamic programming course materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/pages/lecture-notes/)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf)
- [Princeton's recursion and dynamic programming discussion](https://introcs.cs.princeton.edu/java/23recursion/)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/12-dynamic-programming.md)
