---
id: interview-dsa
title: DSA problem solving interview playbook
track: interview
order: 5
level: Intermediate
minutes: 3
summary: Start — input/output, constraints aur edge cases clarify karo.
tags: dsa, interview, problem-solving, complexity, practice
visual: dynamic-programming
---

## Quick revision

> Revision target — Optimized solution se pehle constraints, invariant aur counterexample ka reasoning dikhao.

- Start — input/output, constraints aur edge cases clarify karo.
- Brute force — correct baseline aur complexity bolo.
- Optimize — repeated work identify; pattern blindly apply mat karo.
- Invariant — loop/recursion ke har step par kya true rehta hai.
- Complexity — time + extra space + recursion stack; input variables define karo.
- Verify — empty, singleton, duplicates, extremes aur normal example.
- Tradeoff — sorting mutates? extra memory? streaming input? contract check karo.
- Think aloud — next decision aur reason bolo; har typed character narrate karna zaroori nahi.
- Counterexample — proposed pattern ko negative/duplicate/extreme input se challenge.
- Incomplete solution — working part, remaining bug aur next step honestly batao.

### Quick answer checks

- Pattern selection — sorted data, monotonicity, negative values aur required output se pattern choose karo.
- Code review — bounds, duplicates, visited timing, overflow aur auxiliary space check karo.

### Edge cases aur reasoning

- Solution proof steps — invariant initially true, each step preserves, termination se desired result; sample dry-run proof ka replacement nahi.
- Hint ownership — hint ke baad apna state/invariant derive aur next unseen case solve; copied code ko independent performance evidence mat maano.
- Complexity assumptions — output materialization, sorting mutation, integer range aur heap duplicates qualify; separate n,m dimensions preserve karo.

## Research notes: Prove before optimizing

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Example se samjho

- Scenario — Unsorted `[3,1,2]` mein target 3 ke distinct indices chahiye; tum sorted two-pointer elimination propose karte ho.
- Reasoning — Unsorted order par pointer proof valid nahi. Hash lookup with prior indices ya indexed copy sort karke original indices preserve karne ka tradeoff explain karo.
- Catch — Correct pair values milna required indices ka complete answer nahi; one-element input, duplicates aur no-solution contract bhi test karo.

## Recall aur practice

- Sawal — Binary search explanation mein sorted input ke alawa kaunsa correctness evidence chahiye?
- Jawaab — Candidate interval invariant, each branch safe elimination, progress/termination aur missing/duplicate answer contract.
- Khud try karo — 30-minute drill: brute force, optimized invariant, code, tests; empty, duplicate, extreme aur counterexample cases ke time/space justify karo.

## Practice questions

### Easy · Problem ke pehle 3 minute

<details>
<summary>Answer</summary>

- Restate — apne shabdon mein problem aur input/output types.
- Clarify — constraints (n size, negatives, duplicates, empty input, sorted?).
- Examples — ek normal, ek edge case haath se.
- Brute force — bolo aur complexity; phir optimize karne ka direction.

</details>

### Medium · Invariant bolkar solution prove karo

Sliding window "longest substring without repeats" ka invariant kya bologe?

<details>
<summary>Answer</summary>

- Invariant — har step ke baad `s[start..end]` mein koi repeat nahi, aur `last` map har char ka latest index rakhta hai.
- Maintenance — repeat mila toh `start` ko previous index + 1 par; invariant restore.
- Termination — `end` har step badhta, `start` kabhi peeche nahi → `O(n)`.
- Correctness — har `end` ke liye best valid window dekhi.

</details>

### Medium · Stuck ho gaye — kya karoge?

<details>
<summary>Answer</summary>

- Think aloud — jo try kiya aur kyun fail hua bolo.
- Simplify — chhota case, sorted case, ya extra space allow karke socho.
- Patterns — "pairs → hash/two pointers", "subarray sum → prefix", "top k → heap", "min/max feasible → binary search on answer".
- Hint — lo aur explicitly batao kaise use kar rahe ho; partial correct solution bhi value deta hai.

</details>

### Medium · Complexity assumptions

"Hash map lookup `O(1)` hai" — kab galat?

<details>
<summary>Answer</summary>

- Average vs worst — collisions/adversarial input par `O(n)`.
- Key cost — string keys hash karne mein `O(length)`.
- Resize — amortized `O(1)`; single insert kabhi `O(n)`.
- Bolna — "average O(1), assuming good hashing; keys length L ho toh O(L)".

</details>

### Hard · Full walkthrough: Top K frequent elements

<details>
<summary>Answer</summary>

```js
function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [x, c] of count) buckets[c].push(x);
  const out = [];
  for (let c = buckets.length - 1; c > 0 && out.length < k; c--) {
    for (const x of buckets[c]) {
      out.push(x);
      if (out.length === k) break;
    }
  }
  return out;
}
```

- Brute — count + sort by frequency: `O(n log n)`.
- Heap — size-k min-heap: `O(n log k)`.
- Bucket sort — frequency max `n` → `O(n)` time, `O(n)` space.
- Tests — `k = distinct count`, all same, ties (order clarify karo).

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [Princeton's analysis](https://algs4.cs.princeton.edu/14analysis/)
- [graph traversal reference](https://algs4.cs.princeton.edu/41graph/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/05-dsa-playbook.md)
