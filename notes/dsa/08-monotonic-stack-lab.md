---
id: dsa-monotonic-stack-lab
title: Monotonic stacks and amortized reasoning
track: dsa
order: 8
level: Advanced
minutes: 25
summary: Derive next-greater answers with invariants and prove the linear bound.
tags: dsa, monotonic-stack, amortized, arrays
visual: monotonic-stack
---

## Mental model

A monotonic stack stores unresolved candidates in an order that makes future elimination cheap. Do not memorize a while condition first. Ask: what does a stored index still need, and what new value makes that index permanently resolvable?

For daily temperatures, each day needs the first later strictly warmer day. Store indices of days whose warmer answer is unknown. Their temperatures remain non-increasing from bottom to top; equal temperatures are allowed because equal is not warmer.

## Worked solution

```javascript
function dailyTemperatures(temperatures) {
  const waits = Array(temperatures.length).fill(0);
  const stack = [];
  for (let today = 0; today < temperatures.length; today++) {
    while (stack.length &&
      temperatures[today] > temperatures[stack.at(-1)]) {
      const previous = stack.pop();
      waits[previous] = today - previous;
    }
    stack.push(today);
  }
  return waits;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
// [1, 1, 4, 2, 1, 1, 0, 0]
```

When 72 arrives at index 5, it resolves 69 at index 4 and 71 at index 3. It cannot resolve 75 at index 2, so that index stays. The stack records indices rather than just temperatures because the output is a distance and duplicate values need distinct identities.

## Proof before complexity

Every popped index has a smaller temperature than today's. If an earlier intervening day had been warmer, that index would already have been popped. Therefore today is its first warmer day. Any index left at the end has no later warmer day, so its initialized zero is correct.

The nested while does not imply quadratic total work. Each index is pushed once and popped at most once. Across all outer iterations there are at most n pops, giving O(n) time and O(n) auxiliary stack space; the output itself also uses O(n). This is aggregate amortized analysis, not an average-case assumption about random inputs.

## Variants and traps

For next greater-or-equal, equality changes the elimination condition. For a circular array, scan a second logical pass while avoiding duplicate unresolved pushes and use modular indexing carefully. For stock span, combine consecutive smaller-or-equal prices; the answer's meaning changes, so do not copy the temperature comparison blindly.

Histogram maximum rectangle uses increasing heights and calculates the width available when a shorter bar closes a candidate. Duplicate-height handling and sentinel boundaries deserve explicit examples. A sliding-window maximum usually needs a deque, because expired candidates leave from the front while dominated candidates leave from the back.

## Practice

Trace [], [30], [30, 30], [40, 30, 20] and [20, 30, 40]. Write a quadratic reference solution that scans forward for each day and compare it against the stack solution on small random arrays. The reference can be slow because its purpose is to validate reasoning on small cases. Then explain the strict versus non-strict comparison without looking at code.

## Interview questions

**Why store indices?** They retain identity and allow distances or expiration checks without a second lookup.

**When is a monotonic stack the wrong tool?** Arbitrary online updates or range queries may need a tree or other structure; future elimination is no longer permanent under all update models.

## Sources

[MIT algorithms materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/) provide supporting foundations for invariants and complexity analysis. The worked problem and implementation here are original.
