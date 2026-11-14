---
id: dsa-searching
title: Searching and binary search boundaries
track: dsa
order: 5
level: Intermediate
minutes: 3
summary: Linear search — scan unsorted data; O(n).
tags: linear-search, binary-search, lower-bound, strings
visual: binary-search
---

## Quick revision

> Revision target — Derive the boundary answer of a binary search from the candidate interval and safe elimination.

- Linear search — scan unsorted data; O(n).
- Binary search — a sorted range or a monotonic predicate; O(log n) decisions.
- Invariant — first define which interval the answer can lie in.
- Mid — `lo + floor((hi - lo) / 2)`.
- Lower bound — the first index where the value is not smaller than the target.
- Upper bound — the first index where the value is greater than the target.
- Duplicates — any match and the first/last match are different contracts.
- Answer search — search on a monotonic feasible/infeasible boundary.
- Termination — every branch must shrink the interval; handle the empty range.
- Overflow-safe answer — the numeric search range must fit the chosen number type.
- Rotated search — identify the sorted half; duplicates can make the decision ambiguous and raise the worst-case cost.
- Predicate cost — answer search is O(log range × the cost of the feasibility check).

### String search

- Naive substring search — compare the pattern at every start; worst case O(nm).
- KMP — a prefix table avoids repeated comparison; O(n + m).
- KMP fallback — on a mismatch reuse the matched prefix; the text pointer is not reset unnecessarily.

### Edge cases and reasoning

- Half-open search — in [lo,hi) hi is excluded; a missing lower_bound answer can be n, so do not dereference index n.
- Feasibility direction — identify whether the predicate goes false→true or true→false; match the boundary updates to that direction and to the answer contract.
- Progress arithmetic — the midpoint rounding/update combination must not loop forever; a dry run on a two-element interval is essential.

## Understand it with an example

- Scenario — For lower_bound(6) in sorted `[2,5,5,9]`, take the half-open interval [0,4).
- Reasoning — The value 5 at mid 2 is too small, so lo=3; the value 9 at mid 3 is enough, so hi=3. Boundary 3 is the insertion position, not an exact match.
- Catch — For target 10 the answer is 4, that is n; do not dereference it as a valid array index. Every branch must shrink the interval.

## Recall and practice

- Question — In sorted [1,2,2,4], what are lower_bound(2), upper_bound(2) and the count?
- Answer — 1, 3 and 2; the half-open equal range is [1,3).
- Try it yourself — Write lower/upper bound; verify an empty array, all duplicates, a target below/above the range and termination on a two-element interval.

## Practice questions

### Easy · Write a binary search

<details>
<summary>Answer</summary>

```js
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

- Invariant — if the target exists it is inside `[lo, hi]`.
- Progress — `mid ± 1` always shrinks the range; no infinite loop.
- `O(log n)`; sorted input is required.

</details>

### Medium · Lower bound (first index `>= target`)

<details>
<summary>Answer</summary>

```js
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length; // half-open [lo, hi)
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo; // nums.length = sab chhote
}
```

- Half-open — the answer can also be `nums.length` (the insert position).
- Upper bound — the condition is `nums[mid] <= target`.
- `>>> 1` — a floor divide for non-negative ints.

</details>

### Medium · First and last position of the target

`[5,7,7,8,8,10]`, target `8` → `[3, 4]`; missing → `[-1, -1]`.

<details>
<summary>Answer</summary>

```js
function searchRange(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(nums, target + 1) - 1; // for integers
  return [first, last];
}
```

- Two binary searches — `O(log n)` even with duplicates; a linear expand after finding it is `O(n)` in the worst case.
- Non-integer values — an upper bound function instead of `target + 1`.

</details>

### Medium · Search in a rotated sorted array

`[4,5,6,7,0,1,2]`, target `0` → `4`. Distinct values.

<details>
<summary>Answer</summary>

```js
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {          // left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                               // right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

- Key — at every step one half is sorted; check whether the target is in it.
- If duplicates are allowed the worst case is `O(n)`.

</details>

### Hard · Binary search on answer (ship packages)

`weights` must be shipped in order within `days` days; give the minimum ship capacity.

<details>
<summary>Answer</summary>

```js
function shipWithinDays(weights, days) {
  const canShip = (cap) => {
    let used = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { used++; load = 0; }
      load += w;
    }
    return used <= days;
  };
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canShip(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

- Monotonic — if capacity `c` works then `c+1` works too; so binary search over the answer space.
- Bounds — from the heaviest package (`lo`) to the total sum (`hi`).
- Complexity — `O(n log(sum))`.

</details>

## Sources — further reading

- [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Princeton binary search](https://algs4.cs.princeton.edu/11model/BinarySearch.java.html)
- [substring search](https://algs4.cs.princeton.edu/53substring/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/05-searching-and-binary-search.md)
