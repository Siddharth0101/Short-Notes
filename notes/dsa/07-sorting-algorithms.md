---
id: dsa-sorting
title: Sorting from elementary methods to divide and conquer
track: dsa
order: 7
level: Intermediate
minutes: 3
summary: Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
tags: sorting, merge-sort, quick-sort, radix-sort, stability
visual: sorting
---

## Quick revision

> Revision target — Ordering ke saath stability, mutation aur memory contract bhi verify karo.

- Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
- Selection sort — minimum select; O(n²), generally unstable.
- Insertion sort — sorted prefix mein insert; O(n²), nearly sorted input par useful.
- Merge sort — split + merge; O(n log n), array version extra O(n) space.
- Quicksort — partition + recurse; average O(n log n), worst O(n²).
- Three-way partition — less/equal/greater regions; duplicates ke liye useful.
- Heap sort — O(n log n), typical array version O(1) extra space.
- Radix/counting — key range/digits ki assumptions par depend karte hain.
- Quickselect — kth item; expected O(n), worst O(n²).
- Stability — equal-key items ka original order bachta hai.
- Comparator — consistent ordering; JS numeric sort mein `(a, b) => a - b`.
- Inversions — merge ke waqt cross inversions count; O(n log n).
- Comparison lower bound — arbitrary comparison sorting worst-case Ω(n log n); restricted-key algorithms different assumptions use karte hain.
- Stable merge — equal keys par left item pehle lo toh original order preserve kar sakte ho.
- Pivot choice — randomized pivot adversarial pattern risk kam; worst-case bound automatically remove nahi hota.

### Selection aur memory

- Quickselect cost — expected O(n), worst O(n²); pivot strategy matter karti hai.
- Sort memory — merge sort usually O(n) auxiliary; quicksort recursion depth balanced O(log n), worst O(n).

### Edge cases aur reasoning

- Counting sort bound — integer range k ke saath O(n+k) time/space; sparse huge values par range allocation unsuitable.
- Quicksort partition contract — Hoare/Lomuto boundaries different; recursion intervals ko chosen partition return meaning se match karo.
- Stable multi-key ordering — secondary order preserve karke primary stable sort composite ordering de sakta; comparator tuple contract clearer ho sakta.

## Example se samjho

- Scenario — Records `(A,2),(B,1),(C,2)` ko numeric score se stable sort karna hai.
- Reasoning — Expected order `(B,1),(A,2),(C,2)`; equal score2 mein A pehle tha, isliye C se pehle rahega.
- Catch — Sorted numbers alone stability prove nahi karte; duplicate-key records ko IDs do. Input mutation allowed hai ya copy chahiye, separately decide karo.

## Recall aur practice

- Sawal — Numeric [10,2,1] par JS default sort versus numeric comparator ka output?
- Jawaab — Default string order [1,10,2]; numeric comparator [1,2,10]. Default sort original array bhi mutate karta hai.
- Khud try karo — Sort result verify karo; ordered output, preserved multiplicities, stability contract aur all-equal pivot case ki termination check karo.

## Practice questions

### Easy · Stable sort kyun matter karta hai?

Employees pehle name se sorted hain. Ab department se sort kiya. Stable aur unstable sort mein farq?

<details>
<summary>Answer</summary>

- Stable — same department ke andar name order preserved rehta hai.
- Unstable — same department wale shuffle ho sakte hain.
- JS — `Array.prototype.sort` ES2019 se stable required hai.
- Alternative — ek comparator mein dono keys: `a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name)`.

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

- `<=` — equal par left pehle → stable.
- Complexity — hamesha `O(n log n)`; extra `O(n)` memory.

</details>

### Medium · Quicksort ka worst case

First element pivot ke saath already sorted array par quicksort kaisa chalta hai?

<details>
<summary>Answer</summary>

- Worst — har partition `0` aur `n−1` mein split → `O(n²)` time aur `O(n)` recursion depth.
- Fix — random pivot ya median-of-three; recursion pehle chhote side par.
- Duplicates — bahut saare equal values par three-way partition.

</details>

### Medium · Sort colors (Dutch national flag)

`[2,0,2,1,1,0]` ko in-place `[0,0,1,1,2,2]` karo, ek pass mein.

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

- Regions — `[0, low)` 0s, `[low, mid)` 1s, `(high, end]` 2s.
- 2 swap ke baad `mid` nahi badhate — aaya hua element abhi check nahi hua.
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

- Average `O(n)` — sirf ek side recurse; worst `O(n²)` (random pivot se unlikely).
- Input mutate hota hai; zaroorat ho toh copy.
- Alternative — size-k min-heap `O(n log k)`.

</details>

### Hard · Inversions count karo

Pairs `(i, j)` jahan `i < j` aur `a[i] > a[j]`. `[2,4,1,3,5]` → `3`. `O(n log n)` chahiye.

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
        count += left.length - i; // left ke bache saare bade hain
      }
    }
    return [merged.concat(left.slice(i), right.slice(j)), count];
  }
  return sort(arr)[1];
}
```

- Merge step — right ka element pehle gaya toh left ke saare remaining usse bade → utne inversions.
- `<=` — equal values inversion nahi.
- `O(n log n)`; brute force `O(n²)`.

</details>

## Sources — aur padhne ke liye

- [Princeton sorting reference](https://algs4.cs.princeton.edu/cheatsheet/)
- [MDN Array sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/07-sorting-algorithms.md)
