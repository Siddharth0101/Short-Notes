---
id: js-loops
title: Loops counters and accumulators
track: javascript
order: 4
level: Foundation
minutes: 3
summary: `for` — initialization → condition → body → update, repeated.
tags: fundamentals, js, loops
---

## Quick revision

> Revision target — Track the index, the accumulator and the exit condition in every iteration to catch off-by-one errors.

- `for` — initialization → condition → body → update, repeated.
- `while` — the condition is checked first; the body may run zero times.
- `do...while` — the body runs at least once.
- `for...of` — the values of an iterable; `for...in` — enumerable string keys.
- `break` — stops the loop; `continue` — skips the current iteration.
- Index — in an array it runs from `0` to `length - 1`; the condition is `i < length`.
- Infinite loop — the condition never becomes false; check the counter/update.
- Nested loop — derive the cost from the total number of iterations; do not always assume O(n²).
- Accumulator — initialize the total/count before the loop and update it inside.
- Reverse traversal — deleting from the end does not shift the remaining earlier indices.
- Iterable — `for...of` does not work directly on a plain object; you can use `Object.entries(obj)`.

### Edge cases and reasoning

- Per-iteration binding — let in a for loop gives callbacks a separate value per iteration; var gives one shared binding.
- Object key traversal — for...in can also yield inherited enumerable keys; prefer Object.keys/entries for own keys.
- Loop progress — every branch, including continue, must advance towards termination; if a while counter is skipped the loop can get stuck.

## Understand it with an example

```js
const values = [3, -1, 4];
let total = 0;
for (let i = 0; i < values.length; i++) {
  if (values[i] < 0) continue;
  total += values[i];
}
console.log(total); // 7
```

- Trace — at index `0` the total is `3`; index `1` is skipped; at index `2` the total is `7`.
- Catch — in a `for` loop the update expression still runs after `continue`; do not blindly assume the same for a manually incremented `while`.
- Check — the total of an empty array is `0`; the last element must be visited, but index `length` must not be accessed.

## Recall and practice

- Question — In a while loop, what failure is possible if continue comes before the counter increment?
- Answer — With the increment skipped the condition can stay unchanged, creating an infinite loop.
- Try it yourself — Write a sum of the positive numbers in an array; verify that empty input gives 0, negatives are skipped, zero is valid and the original array is unchanged.

## Practice questions

### Easy · Off-by-one sum

```js
const nums = [4, 8, 15];
let sum = 0;
for (let i = 0; i <= nums.length; i++) sum += nums[i];
console.log(sum);
```

<details>
<summary>Answer</summary>

- Output — `NaN`.
- Why — the last iteration reads `nums[3]`, which is `undefined`; `27 + undefined` → `NaN`.
- Fix — `i < nums.length`, or `for (const n of nums) sum += n`.

</details>

### Easy · `for...in` vs `for...of` on array

```js
const arr = ['a', 'b'];
arr.extra = 'x';
for (const k in arr) console.log(k);
for (const v of arr) console.log(v);
```

<details>
<summary>Answer</summary>

- `for...in` — `'0'`, `'1'`, `'extra'` (enumerable string keys, inherited ones too).
- `for...of` — `'a'`, `'b'` (the values from the iterator).
- Rule — `for...of` for values on arrays; `Object.keys/entries` for objects.

</details>

### Medium · The loop that never ends

```js
let n = 10;
while (n !== 0) {
  n -= 3;
}
```

What is the problem, and what would a safe condition be?

<details>
<summary>Answer</summary>

- Sequence — `10, 7, 4, 1, -2, ...`; it never lands exactly on `0` → infinite loop.
- Fix — `while (n > 0)`; match the exit condition to the direction of progress.
- Check — for every loop ask: "which value moves towards the exit on each iteration?"

</details>

### Medium · Find a pair and stop both loops

Write `findPair(nums, target)` that returns the first pair `[i, j]` (`i < j`) whose sum is `target`; return `null` if there is none.

<details>
<summary>Answer</summary>

```js
function findPair(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return null;
}
```

- Exit — a `return` inside the function stops both loops immediately; outside a function you would use a labelled `break outer`.
- Complexity — `O(n²)` time; keeping seen values in a `Map` gives `O(n)` time and `O(n)` space.
- `j = i + 1` — the same element is never used twice.

</details>

### Hard · The most frequent character

Write `topChar(text)`: return the character that appears most often; on a tie, the one seen first. Return `null` for an empty string. Emoji must be counted correctly too.

<details>
<summary>Answer</summary>

```js
function topChar(text) {
  const counts = new Map();
  for (const ch of text) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let best = null;
  let bestCount = 0;
  for (const [ch, count] of counts) {
    if (count > bestCount) [best, bestCount] = [ch, count];
  }
  return best;
}
```

- `for...of` string — iterates code points, so `'😀'` is one character; an index loop would yield its two UTF-16 halves.
- Tie — a `Map` keeps insertion order, and `>` (not `>=`) lets the earlier one win.
- Complexity — `O(n)` time, `O(k)` space (distinct characters).

</details>

## Sources — further reading

- [MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/04-js-loops.md)
