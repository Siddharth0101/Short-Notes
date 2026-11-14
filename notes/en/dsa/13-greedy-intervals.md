---
id: dsa-greedy-intervals
title: Greedy and intervals — proving the choice and the boundary contract
track: dsa
order: 13
level: Intermediate
minutes: 3
summary: Greedy — a local choice at every step; global correctness needs a proof.
tags: greedy, intervals, sweep-line, proofs
---

## Quick revision

> Revision target — Justify the local choice with exchange reasoning and counterexamples.

- Greedy — a local choice at every step; global correctness needs a proof.
- Exchange argument — replace a choice of the optimal solution with the greedy one without lowering the quality.
- Interval scheduling — earliest finish is useful for the maximum non-overlapping count.
- Merge intervals — sort by start; extend the end on an overlap.
- Boundary — make the contract clear: do touching intervals overlap or not.
- Meeting rooms — a min-heap of active end times, or a sweep line.
- Weighted intervals — earliest finish alone is not enough; DP is used.
- Verification — compare with the brute-force optimum on small cases.
- Greedy failure — with arbitrary coin denominations, largest coin first does not guarantee the minimum number of coins.
- Sweep tie — the order of starts/ends at the same coordinate must match the overlap definition.
- Proof habit — search for a small counterexample; passing the samples is not a proof of correctness.

### Edge cases and reasoning

- End-time proof — the earliest-finishing compatible interval maximizes the room left for the future; search for a counterexample to longest/earliest-start selection.
- Meeting sweep — for half-open intervals [start,end) an end comes before a start at the same time; closed intervals have a different tie rule.
- Weighted recurrence — on sorted finishes best[i]=max(best[i-1],weight[i]+best[p(i)]); p(i) is the last compatible predecessor, found with a binary search.

## Understand it with an example

- Scenario — The maximum count is needed among the half-open meetings `[1,4)`, `[2,3)`, `[3,5)`.
- Reasoning — Take the earliest finish `[2,3)`, then `[3,5)`; the count is 2. Taking the earliest start `[1,4)` fits only 1 meeting here.
- Catch — This is an unweighted count objective; with different rewards, earliest finish alone does not guarantee the optimum. Keep the overlap rule for a touching endpoint explicit.

## Recall and practice

- Question — For coins [1,3,4] and amount 6, what do largest-first and the optimum give?
- Answer — Greedy gives 4+1+1, three coins; the optimum is 3+3, two. With arbitrary denominations a local choice is not a proof.
- Try it yourself — Compare an interval scheduler with brute force on small cases; cover touching, identical and nested intervals and a weighted counterexample.

## Practice questions

### Easy · Merge intervals

`[[1,3],[2,6],[8,10],[15,18]]` → `[[1,6],[8,10],[15,18]]`.

<details>
<summary>Answer</summary>

```js
function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}
```

- Sort by start — overlapping intervals become adjacent.
- Boundary — `[1,2]` and `[2,3]` touch; `<=` merges them (clarify the contract).
- `Math.max` — so a contained interval (`[1,10]`, `[2,3]`) does not shrink the end.

</details>

### Medium · Minimum removals for non-overlapping

`[[1,2],[2,3],[3,4],[1,3]]` → `1`.

<details>
<summary>Answer</summary>

```js
function eraseOverlap(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removed = 0, end = -Infinity;
  for (const [s, e] of sorted) {
    if (s >= end) end = e;   // keep
    else removed++;          // overlap → drop
  }
  return removed;
}
```

- Earliest end first — leaves the most room for the rest.
- Exchange argument — swap the first interval of the optimal solution with the earliest-ending one; the result does not get worse.
- Sorting by start can fail here (a long early interval blocks everything).

</details>

### Medium · Meeting rooms required

`[[0,30],[5,10],[15,20]]` → `2`.

<details>
<summary>Answer</summary>

```js
function minRooms(meetings) {
  const events = [];
  for (const [s, e] of meetings) events.push([s, 1], [e, -1]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // same time: the end (-1) first
  let rooms = 0, best = 0;
  for (const [, delta] of events) {
    rooms += delta;
    best = Math.max(best, rooms);
  }
  return best;
}
```

- Sweep line — +1 on a start, −1 on an end, track the max concurrent.
- Tie rule — `[1,5]` and `[5,8]` can share one room, so the end comes first at the same time.

</details>

### Medium · When does greedy fail?

Coins `[1, 3, 4]`, amount `6`. What does the "largest coin first" greedy give?

<details>
<summary>Answer</summary>

- Greedy — `4 + 1 + 1` = 3 coins.
- Optimal — `3 + 3` = 2 coins.
- Lesson — greedy needs a proof (an exchange argument); if you find a counterexample, use DP.
- The Indian/US coin systems are "canonical", so greedy works there — not for every set.

</details>

### Hard · Weighted job scheduling

Jobs `(start, end, profit)`; the max profit of non-overlapping jobs. Why does greedy fail, and how does DP work?

<details>
<summary>Answer</summary>

```js
function maxProfit(jobs) {
  const sorted = [...jobs].sort((a, b) => a.end - b.end);
  const ends = sorted.map((job) => job.end);
  const dp = Array(sorted.length + 1).fill(0); // dp[i] = best for the first i jobs
  for (let i = 1; i <= sorted.length; i++) {
    const job = sorted[i - 1];
    let lo = 0, hi = i - 1; // last job jiska end <= job.start
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ends[mid] <= job.start) lo = mid + 1;
      else hi = mid;
    }
    dp[i] = Math.max(dp[i - 1], dp[lo] + job.profit);
  }
  return dp[sorted.length];
}
```

- Greedy fails — earliest end can choose a small profit and block a large one.
- Recurrence — skip (`dp[i−1]`) or take (`profit + dp[compatible prefix]`).
- `O(n log n)` — a sort + a binary search for every job.

</details>

## Sources — further reading

- [Princeton greedy lecture](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/04GreedyAlgorithmsI.pdf)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/13-greedy-intervals.md)
