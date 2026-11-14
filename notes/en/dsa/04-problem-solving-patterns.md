---
id: dsa-patterns
title: Frequency counters and pointer patterns
track: dsa
order: 4
level: Foundation
minutes: 4
summary: Frequency counter — a map for repeated counts; it can avoid nested scans.
tags: frequency-counter, two-pointers, sliding-window, prefix-sum
visual: two-pointers
---

## Quick revision

> Revision target — Choose the pointer/window/prefix pattern from the constraints and prove the reason for each movement.

- Frequency counter — a map for repeated counts; it can avoid nested scans.
- Two pointers — move boundaries over an ordered/partitioned structure.
- Sliding window — maintain a contiguous range with incremental add/remove.
- Variable window — the shrink condition must be valid; negative sums can break monotonicity.
- Prefix sum — the range sum is `prefix[r + 1] - prefix[l]`.
- Prefix map — count previous sums to find target-sum subarrays.
- Invariant — the rule that stays true after a pointer/window move.
- Dry run — check duplicates, empty input and the exact boundary.
- Difference array — mark range updates and get the final values through prefix accumulation.
- Sorted two-sum — move left up on a low sum, move right down on a high sum.
- Permutation window — match the required character frequencies in a window of the same length.

### Pattern choice

- Negative window — with negative numbers, sum-based shrink logic is not monotonic; consider the prefix-sum/map pattern.
- Prefix seed — keep an initial frequency of 1 for sum zero, so a matching subarray from index zero is counted.
- Pointer movement — move left/right only after proving the sorted-order/monotonic rule; an arbitrary move can miss candidates.

### Matrix patterns

- Matrix flatten — in a rectangular grid index = row × cols + col; row = floor(index/cols), col = index % cols.
- Matrix transpose — swap rows and columns; a rectangular m×n input becomes n×m.
- Matrix edges — dry-run the traversal on empty, 1×1, a single row and a single column.
- Spiral traversal — shrink the top/bottom/left/right boundaries; do not revisit a single remaining row/column.
- Square rotation — for 90° clockwise transpose, then reverse every row; the dimensions of a rectangular output are swapped.

### Edge cases and reasoning

- Prefix update order — in target-sum counting, count the previous-prefix match first and insert the current prefix after; do not accidentally count the empty subarray.
- Window assumption — justify the shrink proof of a longest/shortest window from the input constraints; re-evaluate the invariant for negative values.
- Difference boundary — for an inclusive [l,r] update, diff[l]+=v and diff[r+1]-=v when valid; recover the final array through the prefix.

## Understand it with an example

- Scenario — Sorted `[1,3,4,6]`, target 7; left 1 and right 6 sum to 7, so one pair is found.
- Reasoning — If the target were 8, the sum 7 is too small: move left up, because no smaller right can reach the target with the current left. At the next sum 9, move right down.
- Catch — On unsorted input the elimination proof is invalid; sorting can change the original indices/order, so clarify the input/output contract first.

## Recall and practice

- Question — Why is a positive-only shrinking window unreliable for [-1,1] with target 0?
- Answer — The sum does not change monotonically with add/remove; count target prefix differences with a frequency map.
- Try it yourself — Implement a subarray-sum count; verify that [0,0] with target 0 gives 3, plus negatives and a match starting at index zero.

## Practice questions

### Easy · Valid anagram (frequency counter)

<details>
<summary>Answer</summary>

```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const ch of a) count.set(ch, (count.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const left = (count.get(ch) ?? 0) - 1;
    if (left < 0) return false;
    count.set(ch, left);
  }
  return true;
}
```

- `O(n)` time; the sort approach is `O(n log n)`.

</details>

### Easy · A pair in a sorted array (two pointers)

In sorted `nums`, find two numbers whose sum is `target`.

<details>
<summary>Answer</summary>

```js
function pairSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
```

- Pointer movement — if the sum is small move left up (a larger value); if it is large move right down.
- `O(n)` time, `O(1)` space; the input must be sorted.

</details>

### Medium · Max sum of a window of size `k`

<details>
<summary>Answer</summary>

```js
function maxWindowSum(nums, k) {
  if (k > nums.length) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}
```

- Slide — add the new element, remove the old one; no recomputing of every window → `O(n)`.
- `best` starts from the first window (`0` would be wrong for all-negative arrays).

</details>

### Medium · Longest substring without repeating characters

<details>
<summary>Answer</summary>

```js
function longestUnique(s) {
  const last = new Map();
  let start = 0, best = 0;
  for (let end = 0; end < s.length; end++) {
    const ch = s[end];
    if (last.has(ch) && last.get(ch) >= start) start = last.get(ch) + 1;
    last.set(ch, end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}
```

- Variable window — on a duplicate, move `start` just past its previous occurrence.
- The `>= start` check — ignores an old index that lies outside the window.
- `"abba"` → `2`; `O(n)`.

</details>

### Medium · Subarray sum equals `k` (negatives allowed)

<details>
<summary>Answer</summary>

```js
function countSubarrays(nums, k) {
  const seen = new Map([[0, 1]]); // prefix 0 ek baar
  let prefix = 0, count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}
```

- Idea — `prefix[j] − prefix[i] = k` → count `prefix − k` among the earlier prefixes.
- Seed `{0: 1}` — for subarrays that start at index 0.
- A sliding window fails here — with negatives the sum is not monotonic.

</details>

### Hard · Matrix spiral order

`[[1,2,3],[4,5,6],[7,8,9]]` → `[1,2,3,6,9,8,7,4,5]`. Non-square matrices too.

<details>
<summary>Answer</summary>

```js
function spiral(matrix) {
  const out = [];
  if (!matrix.length) return out;
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);
      left++;
    }
  }
  return out;
}
```

- Boundaries — shrink after each side.
- Guards — they prevent a duplicate traversal when a single row/column remains (test `3×1`, `1×3`).

</details>

## Sources — further reading

- [Yangshun Tay — matrix cheatsheet](https://www.techinterviewhandbook.org/algorithms/matrix/)

- [ECMAScript keyed collections](https://tc39.es/ecma262/multipage/keyed-collections.html)
- [MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/04-problem-solving-patterns.md)
