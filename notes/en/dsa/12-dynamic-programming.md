---
id: dsa-dynamic-programming
title: Dynamic programming from state to recurrence
track: dsa
order: 12
level: Advanced
minutes: 4
summary: DP — reuse the results of overlapping subproblems.
tags: dynamic-programming, memoization, tabulation, coin-change, knapsack
visual: dynamic-programming
---

## Quick revision

> Revision target — Explain a DP before the table by writing the meaning of the state, the base case and the transition.

- DP — reuse the results of overlapping subproblems.
- State — the minimum information that uniquely defines a subproblem.
- Transition — the relation of the current answer to smaller states.
- Base case — the known answers of the smallest states.
- Memoization — top-down recursion + a cache.
- Tabulation — fill bottom-up in dependency order.
- Complexity — states × transition cost; count storage separately.
- 0/1 knapsack — in the one-array optimization, scan the capacity in reverse.
- Unbounded choice — reuse is allowed; the loop order follows the contract.
- Reconstruction — store choices/parents when the actual solution is needed.
- Optimization — keep only the prior states you need; do not overwrite a dependency.
- Counting order — the order of the coin loop and the amount loop can change combinations into permutations.
- Impossible state — choose an infinity/negative sentinel safely; avoid overflow and invalid transitions.
- DAG view — DP states form a graph of dependencies; a valid evaluation order solves dependencies first.

### Common DP states

- Grid traveler — the state is row/column; make the base cases for blocked/boundary cells clear.
- Coin change — minimum coins and the combination count need different transitions.
- LCS — a two-prefix state; diagonal + 1 on matching chars, otherwise the neighbouring maximum.

### Edge cases and reasoning

- LIS quadratic — dp[i]=1+max(dp[j]) for j<i and a[j]<a[i]; O(n²) time, O(n) space for strictly increasing subsequence.
- LIS tails — smallest tail per length + lower_bound gives O(n log n) length; the tails array is not necessarily an actual valid subsequence.
- Edit distance — prefix states; match diagonal unchanged, otherwise 1+min(insert,delete,replace); O(nm) time, rolling rows O(min(n,m)) space.
- Memo key completeness — the index alone is insufficient when the budget/previous choice changes the result; include all future-relevant information in the key.
- Counting precision — many-path counts can cross the safe-integer bound; choose a BigInt/modulus contract explicitly.

## Research notes: Numeric magnitude can dominate DP

- The O(nW) knapsack depends on the numeric capacity W.

## Understand it with an example

- Scenario — Steps of 1 or 2 are allowed; count the ways to reach n stairs. ways(0)=1, ways(1)=1.
- Reasoning — The last move was 1 or 2, so ways(n)=ways(n−1)+ways(n−2). For n=3 there are 3 ways: 111, 12, 21; each required state can be computed once.
- Catch — One empty path for zero stairs is the base of counting; a minimum-cost problem can have a different base. Mention the numeric precision contract for large counts.

## Recall and practice

- Question — How does a forward capacity scan in 0/1 knapsack reuse the same item?
- Answer — The current item's updated smaller-capacity state is read later; a reverse scan preserves the previous-item states.
- Try it yourself — Verify that the LIS of [3,1,2,2,4] is 3 and the edit distance kitten→sitting is 3; explain empty inputs and duplicate strictness.

## Practice questions

### Easy · Identify the state and recurrence

In climbing stairs (1 or 2 steps), what are the state, the transition and the base case?

<details>
<summary>Answer</summary>

- State — `ways(i)` = the number of ways to reach step `i`.
- Transition — `ways(i) = ways(i − 1) + ways(i − 2)`.
- Base — `ways(0) = 1`, `ways(1) = 1`.
- Space — only the last two values are needed → `O(1)`.

</details>

### Medium · Minimum coins

`coins = [1, 2, 5]`, `amount = 11` → `3`. Return `-1` if it is impossible.

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

- Impossible state — start from `Infinity`, not `0` (otherwise the minimum is wrong).
- Unbounded — every coin can be used again.
- `O(amount × coins)`.

</details>

### Medium · Counting ways: why does the loop order matter?

`coins = [1, 2]`, `amount = 3`. The count of combinations is needed (`1+2` and `2+1` are the same).

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
- Coins outer — every combination is built in one fixed coin order; no duplicates.
- Amount outer, coins inner — counts ordered sequences (permutations) → `3`.
- Large counts — BigInt or a modulo.

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

- State — `dp[i][j]` = the LCS of the first `i` chars of `a` and the first `j` chars of `b`.
- Reconstruction — backtrack through the table for the actual subsequence.
- `O(mn)` time; if only the length is needed, two rows give `O(n)` space.

</details>

### Hard · 0/1 knapsack in 1D

`weights`, `values`, `capacity`; each item at most once. The max value?

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

- Reverse loop — `dp[c - w]` still belongs to the old row (before the item is used); a forward loop would use the same item several times (unbounded).
- `O(n × capacity)` — when the capacity is very large this pseudo-polynomial approach is slow.

</details>

### Hard · LIS in `O(n log n)`

`[10,9,2,5,3,7,101,18]` → `4`.

<details>
<summary>Answer</summary>

```js
function lengthOfLIS(nums) {
  const tails = []; // tails[k] = smallest end of an increasing subsequence of length k+1
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

- `tails` stays sorted — every `x` replaces/appends at its lower-bound position.
- `tails` itself is not the actual LIS; only the length is right (use parent pointers for the sequence).
- Strictly increasing — `<`; use `<=` for non-decreasing.

</details>

## Sources — further reading

- [MIT dynamic programming course materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/pages/lecture-notes/)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf)
- [Princeton's recursion and dynamic programming discussion](https://introcs.cs.princeton.edu/java/23recursion/)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/12-dynamic-programming.md)
