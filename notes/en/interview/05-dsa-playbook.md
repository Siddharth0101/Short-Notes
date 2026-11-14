---
id: interview-dsa
title: DSA problem solving interview playbook
track: interview
order: 5
level: Intermediate
minutes: 3
summary: Start — clarify the input/output, constraints and edge cases.
tags: dsa, interview, problem-solving, complexity, practice
visual: dynamic-programming
---

## Quick revision

> Revision target — Before the optimized solution, show the reasoning behind the constraints, the invariant and a counterexample.

- Start — clarify the input/output, constraints and edge cases.
- Brute force — state a correct baseline and its complexity.
- Optimize — identify the repeated work; do not apply a pattern blindly.
- Invariant — what stays true at every step of the loop/recursion.
- Complexity — time + extra space + recursion stack; define the input variables.
- Verify — empty, singleton, duplicates, extremes and a normal example.
- Tradeoff — does sorting mutate? extra memory? streaming input? check the contract.
- Think aloud — say the next decision and its reason; narrating every typed character is not necessary.
- Counterexample — challenge the proposed pattern with a negative/duplicate/extreme input.
- Incomplete solution — state honestly the working part, the remaining bug and the next step.

### Quick answer checks

- Pattern selection — choose the pattern from sorted data, monotonicity, negative values and the required output.
- Code review — check bounds, duplicates, visited timing, overflow and auxiliary space.

### Edge cases and reasoning

- Solution proof steps — the invariant is true initially, each step preserves it, termination gives the desired result; a sample dry run does not replace a proof.
- Hint ownership — after a hint derive your own state/invariant and solve the next unseen case; do not count copied code as evidence of independent performance.
- Complexity assumptions — qualify output materialization, sorting mutation, the integer range and heap duplicates; keep separate n,m dimensions.

## Research notes: Prove before optimizing

- The linked Amazon guidance focuses on applying fundamentals to problems; merely memorizing details is not the learning goal.

## Understand it with an example

- Scenario — Distinct indices for target 3 are needed in the unsorted `[3,1,2]`; you propose sorted two-pointer elimination.
- Reasoning — The pointer proof is not valid on unsorted order. Explain the tradeoff: a hash lookup with prior indices, or sorting an indexed copy to preserve the original indices.
- Catch — Finding the correct pair of values is not the complete answer of required indices; also test a one-element input, duplicates and the no-solution contract.

## Recall and practice

- Question — In a binary search explanation, what correctness evidence is needed besides sorted input?
- Answer — The candidate-interval invariant, safe elimination in each branch, progress/termination and the contract for a missing/duplicate answer.
- Try it yourself — A 30-minute drill: brute force, the optimized invariant, code, tests; justify the time/space for the empty, duplicate, extreme and counterexample cases.

## Practice questions

### Easy · The first 3 minutes of a problem

<details>
<summary>Answer</summary>

- Restate — the problem in your own words and the input/output types.
- Clarify — the constraints (the size of n, negatives, duplicates, empty input, sorted?).
- Examples — one normal, one edge case by hand.
- Brute force — say it and its complexity; then the direction for optimizing.

</details>

### Medium · Prove a solution by stating its invariant

What invariant would you state for the sliding window "longest substring without repeats"?

<details>
<summary>Answer</summary>

- Invariant — after every step `s[start..end]` contains no repeat, and the `last` map holds the latest index of every char.
- Maintenance — on a repeat, move `start` to the previous index + 1; the invariant is restored.
- Termination — `end` advances every step and `start` never moves back → `O(n)`.
- Correctness — the best valid window has been seen for every `end`.

</details>

### Medium · You are stuck — what do you do?

<details>
<summary>Answer</summary>

- Think aloud — say what you tried and why it failed.
- Simplify — think about a small case, the sorted case, or allowing extra space.
- Patterns — "pairs → hash/two pointers", "subarray sum → prefix", "top k → heap", "min/max feasible → binary search on answer".
- Hint — take it and say explicitly how you are using it; a partially correct solution has value too.

</details>

### Medium · Complexity assumptions

"A hash map lookup is `O(1)`" — when is that wrong?

<details>
<summary>Answer</summary>

- Average vs worst — `O(n)` on collisions/adversarial input.
- Key cost — hashing string keys takes `O(length)`.
- Resize — amortized `O(1)`; a single insert is sometimes `O(n)`.
- Say it — "average O(1), assuming good hashing; O(L) when keys have length L".

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
- Heap — a size-k min-heap: `O(n log k)`.
- Bucket sort — the frequency is at most `n` → `O(n)` time, `O(n)` space.
- Tests — `k = distinct count`, all the same, ties (clarify the order).

</details>

## Sources — further reading

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [Princeton's analysis](https://algs4.cs.princeton.edu/14analysis/)
- [graph traversal reference](https://algs4.cs.princeton.edu/41graph/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/05-dsa-playbook.md)
