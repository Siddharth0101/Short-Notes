---
id: dsa-monotonic-stack-lab
title: Monotonic stacks and amortized reasoning
track: dsa
order: 8
level: Advanced
minutes: 3
summary: Monotonic stack — keep the candidates in increasing or decreasing order.
tags: dsa, monotonic-stack, amortized, arrays
visual: monotonic-stack
---

## Quick revision

> Revision target — Justify linear total work from the unresolved candidates and the pop condition.

- Monotonic stack — keep the candidates in increasing/decreasing order.
- Next greater — pop/resolve the unresolved candidates smaller than the current value.
- Indices — when you need distance/position, store indices instead of values.
- Duplicates — strict vs non-strict comparison is decided by the contract of the question.
- Amortized O(n) — every item is pushed once and popped at most once.
- Daily temperatures — the index of the warmer day minus the old index is the answer.
- Unresolved — keep a default answer for items left at the end of the scan.
- Histogram area — the popped bar's height × the width between the nearest smaller boundaries.
- Circular next-greater — a two-pass scan with wrapped indices; keep the answers/stack additions bounded.
- Monotonic deque — maintain a sliding maximum by removing the expired front and the dominated back.

### Edge cases and reasoning

- Histogram width — after a pop, the width between the smaller left index and the current right boundary = right-left-1; keep the sentinel convention explicit.
- Equal heights — the > versus >= pop policy assigns equal candidates differently; prove consistency against the area/next-strict answer contract.
- Deque expiry — remove an index that has left the window from the front before answering; remove dominated values from the back; maintain the two invariants separately.

## Understand it with an example

- Scenario — Use a stack of indices for the strict next-greater of the values `[3,1,4]`.
- Reasoning — Push 3 and 1 unresolved; when 4 arrives, both 1 and 3 resolve to 4. The answer for the last 4 is the absent sentinel. Every index has one push and at most one pop.
- Catch — Do not automatically call a nested while O(n²); the total pops are bounded by n. An equal value is not the answer for strict greater.

## Recall and practice

- Question — Is the max area of the histogram [2,2] 2 or 4?
- Answer — 4; adjacent equal heights form a width of 2. The strict/non-strict stack policy must account for the shared span correctly.
- Try it yourself — Trace the histogram area and the sliding maximum; verify equal heights, increasing/decreasing values, k=1 and the policy for an invalid k.

## Practice questions

### Easy · Next greater element trace

For every element of `[2, 1, 2, 4, 3]` give the next greater (the first larger one to its right); `-1` if there is none.

<details>
<summary>Answer</summary>

- Output — `[4, 2, 4, -1, -1]`.
- Note — for the first `2` the next greater is `4` (the `2` in between is equal, not greater).
- Stack idea — unresolved indexes sit on the stack; when a larger element arrives, it is their answer.

</details>

### Medium · Daily temperatures

For each day, after how many days does it get warmer? `[73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`.

<details>
<summary>Answer</summary>

```js
function dailyTemperatures(temps) {
  const answer = Array(temps.length).fill(0);
  const stack = []; // indexes, temps decreasing
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
```

- Store indexes — the value is not enough to compute a distance.
- Amortized `O(n)` — every index is pushed once and popped once.

</details>

### Medium · Circular next greater

The circular array `[1, 2, 1]` → `[2, -1, 2]`.

<details>
<summary>Answer</summary>

```js
function nextGreaterCircular(nums) {
  const n = nums.length;
  const answer = Array(n).fill(-1);
  const stack = [];
  for (let k = 0; k < 2 * n; k++) {
    const i = k % n;
    while (stack.length && nums[i] > nums[stack.at(-1)]) answer[stack.pop()] = nums[i];
    if (k < n) stack.push(i);
  }
  return answer;
}
```

- Two passes — the second pass finds the wrap-around candidates.
- Push only in the first pass — every index is resolved only once.

</details>

### Hard · Largest rectangle in a histogram

`[2,1,5,6,2,3]` → `10`.

<details>
<summary>Answer</summary>

```js
function largestRectangle(heights) {
  const stack = []; // increasing heights ke indexes
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]; // sentinel flush
    while (stack.length && h < heights[stack.at(-1)]) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack.at(-1) : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}
```

- On a pop — the bar's right boundary is `i` (the first smaller), its left boundary is the new stack top.
- Width — `i − left − 1`; when the stack is empty the bar extends to the left edge.
- Sentinel `0` — flushes the bars left at the end.

</details>

### Hard · Sliding window maximum

`nums = [1,3,-1,-3,5,3,6,7]`, `k = 3` → `[3,3,5,5,6,7]`.

<details>
<summary>Answer</summary>

```js
function maxSlidingWindow(nums, k) {
  const deque = []; // indexes, values decreasing
  let head = 0;
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > head && nums[deque.at(-1)] <= nums[i]) deque.pop();
    deque.push(i);
    if (deque[head] <= i - k) head++; // expired front
    if (i >= k - 1) out.push(nums[deque[head]]);
  }
  return out;
}
```

- Monotonic deque — the front is always the max of the current window.
- Expiry — remove the front index once it is outside the window.
- `O(n)` — every index is added/removed once (a head pointer makes the front pop `O(1)`).

</details>

## Sources — further reading

- [MIT algorithms materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/08-monotonic-stack-lab.md)
