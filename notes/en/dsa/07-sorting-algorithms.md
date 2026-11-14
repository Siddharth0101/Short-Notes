---
id: dsa-sorting
title: Sorting from elementary methods to divide and conquer
track: dsa
order: 7
level: Intermediate
minutes: 3
summary: Bubble sort — adjacent swaps; O(n²), and O(n) at best with the early-exit variant.
tags: sorting, merge-sort, quick-sort, radix-sort, stability
visual: sorting
---

## Quick revision

> Revision target — Along with ordering, verify the stability, mutation and memory contract too.

- Bubble sort — adjacent swaps; O(n²), with the early-exit variant the best case is O(n).
- Selection sort — select the minimum; O(n²), generally unstable.
- Insertion sort — insert into the sorted prefix; O(n²), useful on nearly sorted input.
- Merge sort — split + merge; O(n log n), the array version needs O(n) extra space.
- Quicksort — partition + recurse; average O(n log n), worst O(n²).
- Three-way partition — less/equal/greater regions; useful for duplicates.
- Heap sort — O(n log n), the typical array version uses O(1) extra space.
- Radix/counting — depend on assumptions about the key range/digits.
- Quickselect — the kth item; expected O(n), worst O(n²).
- Stability — the original order of equal-key items is kept.
- Comparator — a consistent ordering; in a JS numeric sort use `(a, b) => a - b`.
- Inversions — count the cross inversions during the merge; O(n log n).
- Comparison lower bound — arbitrary comparison sorting is Ω(n log n) in the worst case; restricted-key algorithms use different assumptions.
- Stable merge — take the left item first on equal keys and you can preserve the original order.
- Pivot choice — a randomized pivot lowers the risk of an adversarial pattern; the worst-case bound is not removed automatically.

### Selection and memory

- Quickselect cost — expected O(n), worst O(n²); the pivot strategy matters.
- Sort memory — merge sort usually O(n) auxiliary; quicksort recursion depth is O(log n) when balanced and O(n) in the worst case.

### Edge cases and reasoning

- Counting sort bound — O(n+k) time/space for an integer range k; allocating the range is unsuitable for sparse huge values.
- Quicksort partition contract — Hoare/Lomuto boundaries differ; match the recursion intervals to what the chosen partition returns.
- Stable multi-key ordering — a stable sort on the primary key that preserves a secondary order can give a composite ordering; a comparator tuple contract can be clearer.

## Understand it with an example

- Scenario — Stable-sort the records `(A,2),(B,1),(C,2)` by numeric score.
- Reasoning — The expected order is `(B,1),(A,2),(C,2)`; among the equal score 2, A came first, so it stays before C.
- Catch — Sorted numbers alone do not prove stability; give duplicate-key records IDs. Decide separately whether input mutation is allowed or a copy is needed.

## Recall and practice

- Question — On numeric [10,2,1], what do the JS default sort and a numeric comparator output?
- Answer — The default string order gives [1,10,2]; the numeric comparator gives [1,2,10]. The default sort also mutates the original array.
- Try it yourself — Verify a sort result; check the ordered output, preserved multiplicities, the stability contract and termination in the all-equal pivot case.

## Practice questions

### Easy · Why does a stable sort matter?

Employees are first sorted by name. Now they are sorted by department. What is the difference between a stable and an unstable sort?

<details>
<summary>Answer</summary>

- Stable — the name order is preserved within the same department.
- Unstable — people in the same department can be shuffled.
- JS — `Array.prototype.sort` is required to be stable since ES2019.
- Alternative — both keys in one comparator: `a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name)`.

</details>

### Medium · Merge sort

<details>
<summary>Answer</summary>

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}
```

- `<=` — on equal keys the left goes first → stable.
- Complexity — always `O(n log n)`; `O(n)` extra memory.

</details>

### Medium · The worst case of quicksort

How does quicksort run on an already sorted array with the first element as the pivot?

<details>
<summary>Answer</summary>

- Worst — every partition splits into `0` and `n−1` → `O(n²)` time and `O(n)` recursion depth.
- Fix — a random pivot or median-of-three; recurse into the smaller side first.
- Duplicates — a three-way partition for many equal values.

</details>

### Medium · Sort colors (Dutch national flag)

Turn `[2,0,2,1,1,0]` into `[0,0,1,1,2,2]` in place, in one pass.

<details>
<summary>Answer</summary>

```js
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) [nums[low++], nums[mid++]] = [nums[mid], nums[low]];
    else if (nums[mid] === 1) mid++;
    else [nums[mid], nums[high--]] = [nums[high], nums[mid]];
  }
}
```

- Regions — `[0, low)` holds 0s, `[low, mid)` holds 1s, `(high, end]` holds 2s.
- After a swap with 2 do not advance `mid` — the element that arrived has not been checked yet.
- `O(n)`, `O(1)` space.

</details>

### Medium · Kth largest (quickselect)

<details>
<summary>Answer</summary>

```js
function kthLargest(nums, k) {
  const target = nums.length - k; // sorted index
  let lo = 0, hi = nums.length - 1;
  while (true) {
    const pivotIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[pivotIndex], nums[hi]] = [nums[hi], nums[pivotIndex]];
    let store = lo;
    for (let i = lo; i < hi; i++) if (nums[i] < nums[hi]) [nums[i], nums[store++]] = [nums[store], nums[i]];
    [nums[store], nums[hi]] = [nums[hi], nums[store]];
    if (store === target) return nums[store];
    if (store < target) lo = store + 1;
    else hi = store - 1;
  }
}
```

- Average `O(n)` — recurse into only one side; worst `O(n²)` (unlikely with a random pivot).
- The input is mutated; copy it if needed.
- Alternative — a size-k min-heap, `O(n log k)`.

</details>

### Hard · Count inversions

Pairs `(i, j)` where `i < j` and `a[i] > a[j]`. `[2,4,1,3,5]` → `3`. `O(n log n)` is required.

<details>
<summary>Answer</summary>

```js
function countInversions(arr) {
  function sort(a) {
    if (a.length <= 1) return [a, 0];
    const mid = a.length >> 1;
    const [left, x] = sort(a.slice(0, mid));
    const [right, y] = sort(a.slice(mid));
    const merged = [];
    let i = 0, j = 0, count = x + y;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else {
        merged.push(right[j++]);
        count += left.length - i; // all remaining items of left are larger
      }
    }
    return [merged.concat(left.slice(i), right.slice(j)), count];
  }
  return sort(arr)[1];
}
```

- Merge step — when the right element goes first, every remaining left item is larger than it → that many inversions.
- `<=` — equal values are not an inversion.
- `O(n log n)`; brute force is `O(n²)`.

</details>

## Sources — further reading

- [Princeton sorting reference](https://algs4.cs.princeton.edu/cheatsheet/)
- [MDN Array sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/07-sorting-algorithms.md)
