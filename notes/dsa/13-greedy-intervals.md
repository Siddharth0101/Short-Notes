---
id: dsa-greedy-intervals
title: Greedy aur intervals — choice ka proof aur boundary ka contract
track: dsa
order: 13
level: Intermediate
minutes: 3
summary: Greedy — har step local choice; global correctness ka proof chahiye.
tags: greedy, intervals, sweep-line, proofs
---

## Quick revision

> Revision target — Local choice ko exchange reasoning aur counterexamples se justify karo.

- Greedy — har step local choice; global correctness ka proof chahiye.
- Exchange argument — optimal solution ki choice ko greedy se replace karke quality na gire.
- Interval scheduling — maximum non-overlap count ke liye earliest finish useful.
- Merge intervals — start sort karo; overlap par end extend.
- Boundary — touching intervals overlap hain ya nahi, contract clear karo.
- Meeting rooms — active end-times ka min-heap ya sweep line.
- Weighted intervals — earliest finish alone enough nahi; DP use hota hai.
- Verification — small cases ke brute-force optimum se compare karo.
- Greedy failure — coin denominations arbitrary hon toh largest coin first minimum coins guarantee nahi.
- Sweep tie — same coordinate par starts/ends ka order overlap definition se match.
- Proof habit — chhota counterexample search karo; sample pass hona correctness proof nahi.

### Edge cases aur reasoning

- End-time proof — earliest finishing compatible interval future room maximize karta; longest/earliest-start selection ka counterexample search karo.
- Meeting sweep — half-open intervals [start,end) mein same-time end before start; closed intervals ka tie rule different.
- Weighted recurrence — sorted finishes par best[i]=max(best[i-1],weight[i]+best[p(i)]); p(i) last compatible predecessor, binary search se find karo.

## Example se samjho

- Scenario — Half-open meetings `[1,4)`, `[2,3)`, `[3,5)` mein maximum count chahiye.
- Reasoning — Earliest finish `[2,3)` lo, phir `[3,5)`; count2. Earliest start `[1,4)` lene par yahan sirf1 meeting fit hoti hai.
- Catch — Ye unweighted count objective hai; rewards different hon toh earliest finish alone optimum guarantee nahi. Touching endpoint ka overlap rule explicit rakho.

## Recall aur practice

- Sawal — Coins [1,3,4] amount6 par largest-first aur optimal result kya hai?
- Jawaab — Greedy 4+1+1 three coins; optimum 3+3 two. Arbitrary denominations mein local choice proof nahi.
- Khud try karo — Interval scheduler brute force se small cases compare karo; touching, identical, nested intervals aur weighted counterexample cover karo.

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

- Sort by start — overlapping intervals adjacent aa jaate hain.
- Boundary — `[1,2]` aur `[2,3]` touch karte hain; `<=` unhe merge karta hai (contract clarify karo).
- `Math.max` — contained interval (`[1,10]`, `[2,3]`) end chhota na kare.

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

- Earliest end first — baaki ke liye sabse zyada jagah chhodta hai.
- Exchange argument — optimal solution ke pehle interval ko earliest-ending se swap karo; result kharab nahi hota.
- Start sort yahan fail ho sakta hai (lamba early interval sab block karta hai).

</details>

### Medium · Meeting rooms required

`[[0,30],[5,10],[15,20]]` → `2`.

<details>
<summary>Answer</summary>

```js
function minRooms(meetings) {
  const events = [];
  for (const [s, e] of meetings) events.push([s, 1], [e, -1]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // same time: end (-1) pehle
  let rooms = 0, best = 0;
  for (const [, delta] of events) {
    rooms += delta;
    best = Math.max(best, rooms);
  }
  return best;
}
```

- Sweep line — start par +1, end par −1, max concurrent.
- Tie rule — `[1,5]` aur `[5,8]` ek room share kar sakte hain, isliye same time par end pehle.

</details>

### Medium · Greedy kab fail hota hai?

Coins `[1, 3, 4]`, amount `6`. "Sabse bada coin pehle" greedy kya dega?

<details>
<summary>Answer</summary>

- Greedy — `4 + 1 + 1` = 3 coins.
- Optimal — `3 + 3` = 2 coins.
- Lesson — greedy ke liye proof chahiye (exchange argument); counterexample mile toh DP.
- Indian/US coin systems "canonical" hain, isliye wahan greedy kaam karta hai — har set mein nahi.

</details>

### Hard · Weighted job scheduling

Jobs `(start, end, profit)`; non-overlapping jobs ka max profit. Greedy kyun fail aur DP kaise?

<details>
<summary>Answer</summary>

```js
function maxProfit(jobs) {
  const sorted = [...jobs].sort((a, b) => a.end - b.end);
  const ends = sorted.map((job) => job.end);
  const dp = Array(sorted.length + 1).fill(0); // dp[i] = pehle i jobs ka best
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

- Greedy fail — earliest end chhota profit choose kar sakta hai aur bada block ho jaata hai.
- Recurrence — skip (`dp[i−1]`) ya take (`profit + dp[compatible prefix]`).
- `O(n log n)` — sort + har job ke liye binary search.

</details>

## Sources — aur padhne ke liye

- [Princeton greedy lecture](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/04GreedyAlgorithmsI.pdf)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/13-greedy-intervals.md)
