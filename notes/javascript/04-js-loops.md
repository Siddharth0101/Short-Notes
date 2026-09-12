---
id: js-loops
title: Loops counters and accumulators
track: javascript
order: 4
level: Foundation
minutes: 12
summary: Repeat a task with a clear start stopping condition and update.
tags: fundamentals, js, loops
---

## Mental model

A loop repeats statements while a condition permits another iteration. Har iteration ke start par socho: what have I already processed, and what remains? A counter tracks position or repetition; an accumulator combines results. These are different responsibilities, even though both often use numeric variables.

## Trace a for loop

```javascript
let total = 0;
for (let day = 1; day <= 3; day = day + 1) {
  total = total + day;
  console.log(day, total);
}
// 1 1
// 2 3
// 3 6
```

The initializer runs once. Before each iteration the condition is checked. If true, the body runs and then the update runs. After day becomes 4, the condition fails. At the start of each iteration, total contains the sum of the earlier days. This sentence is a simple invariant you can use to reason about correctness.

## Other loop shapes

A while loop separates initialization and update from the loop header. It is useful when repetition depends on a changing condition rather than a fixed count. Always identify what makes the loop stop. A do...while body runs at least once, which is a different contract. break exits the nearest loop; continue skips the rest of the current iteration. With a while loop, make sure continue does not skip the only update that can reach termination.

The variable declared with let inside the for header belongs to that loop's scope. You can reuse the name in another independent loop. Later, arrays will give you collections to traverse; for...of visits their values without a manual index when you do not need the position.

## Practice

Sum integers from 1 through 5 without writing the final result directly. Make a table with counter, total before and total after each iteration. Then change the task to numbers from 0 through 4 and explain the boundaries. Finally print only even numbers from 1 through 10 using the remainder operator and a condition.

## Check before moving on

You should recognize an off-by-one error and an update that never happens. Explain why total must be initialized outside the loop. Next, package a repeatable task into a function so callers can use it with different inputs.

## Sources

[MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration) explains loop forms and control statements.
