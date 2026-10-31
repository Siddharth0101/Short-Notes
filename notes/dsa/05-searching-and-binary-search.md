---
id: dsa-searching
title: Searching and binary search boundaries
track: dsa
order: 5
level: Intermediate
minutes: 3
summary: Linear search — unsorted data scan; O(n).
tags: linear-search, binary-search, lower-bound, strings
visual: binary-search
---

## Quick revision

> Revision target — Candidate interval aur safe elimination se binary search ka boundary answer derive karo.

- Linear search — unsorted data scan; O(n).
- Binary search — sorted range ya monotonic predicate; O(log n) decisions.
- Invariant — answer kis interval mein ho sakta hai, pehle define karo.
- Mid — `lo + floor((hi - lo) / 2)`.
- Lower bound — pehla index jahan value target se chhoti nahi.
- Upper bound — pehla index jahan value target se badi.
- Duplicates — any match aur first/last match alag contracts.
- Answer search — feasible/infeasible monotonic boundary par search karo.
- Termination — har branch interval shrink kare; empty range handle karo.
- Overflow-safe answer — numeric search range chosen number type mein fit honi chahiye.
- Rotated search — sorted half identify; duplicates decision ambiguous karke worst cost badha sakte hain.
- Predicate cost — answer search O(log range × feasibility-check cost).

### String search

- Naive substring search — har start par pattern compare; worst O(nm).
- KMP — prefix table se repeated comparison bachta hai; O(n + m).
- KMP fallback — mismatch par matched prefix reuse; text pointer unnecessarily reset nahi.

### Edge cases aur reasoning

- Half-open search — [lo,hi) mein hi excluded; lower_bound ka missing answer n ho sakta, n-index dereference mat karo.
- Feasibility direction — predicate false→true ya true→false identify; boundary updates us direction aur answer contract se match karo.
- Progress arithmetic — midpoint round/update combination infinite loop na kare; two-element interval dry-run essential hai.

## Example se samjho

- Scenario — Sorted `[2,5,5,9]` mein lower_bound(6) ke liye half-open interval[0,4) lo.
- Reasoning — mid2 ki value5 chhoti, lo=3; mid3 ki value9 enough, hi=3. Boundary3 insertion position hai, exact match nahi.
- Catch — Target10 par answer4 yani n milega; use valid array index samajhkar dereference mat karo. Har branch interval shrink honi chahiye.

## Recall aur practice

- Sawal — Sorted [1,2,2,4] mein lower_bound(2), upper_bound(2) aur count?
- Jawaab — 1, 3 aur 2; half-open equal range [1,3) hai.
- Khud try karo — Lower/upper bound likho; empty array, all duplicates, target below/above range aur two-element interval termination verify karo.

## Practice questions

### Easy · Binary search likho

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

- Invariant — target agar hai toh `[lo, hi]` ke andar.
- Progress — `mid ± 1` se range hamesha chhoti; infinite loop nahi.
- `O(log n)`; sorted input zaroori.

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

- Half-open — answer `nums.length` bhi ho sakta hai (insert position).
- Upper bound — condition `nums[mid] <= target`.
- `>>> 1` — non-negative ints ke liye floor divide.

</details>

### Medium · Target ki first aur last position

`[5,7,7,8,8,10]`, target `8` → `[3, 4]`; missing → `[-1, -1]`.

<details>
<summary>Answer</summary>

```js
function searchRange(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(nums, target + 1) - 1; // integers ke liye
  return [first, last];
}
```

- Do binary searches — duplicates par bhi `O(log n)`; mil jaane ke baad linear expand worst case `O(n)`.
- Non-integer values — `target + 1` ki jagah upper bound function.

</details>

### Medium · Rotated sorted array mein search

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

- Key — har step mein ek half sorted hota hai; check karo target usme hai ya nahi.
- Duplicates allowed hon toh worst case `O(n)`.

</details>

### Hard · Binary search on answer (ship packages)

`weights` order mein ship karne hain `days` din mein; minimum ship capacity batao.

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

- Monotonic — capacity `c` chal jaaye toh `c+1` bhi chalegi; isliye answer space par binary search.
- Bounds — sabse bhaari package (`lo`) se total sum (`hi`) tak.
- Complexity — `O(n log(sum))`.

</details>

## Sources — aur padhne ke liye

- [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Princeton binary search](https://algs4.cs.princeton.edu/11model/BinarySearch.java.html)
- [substring search](https://algs4.cs.princeton.edu/53substring/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/05-searching-and-binary-search.md)
