---
id: dsa-patterns
title: Frequency counters and pointer patterns
track: dsa
order: 4
level: Foundation
minutes: 4
summary: Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
tags: frequency-counter, two-pointers, sliding-window, prefix-sum
visual: two-pointers
---

## Quick revision

> Revision target — Constraints se pointer/window/prefix pattern choose karo aur movement ka reason prove karo.

- Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
- Two pointers — ordered/partitioned structure par boundaries move karo.
- Sliding window — contiguous range ko incremental add/remove se maintain karo.
- Variable window — shrink condition valid honi chahiye; negative sums monotonicity tod sakte hain.
- Prefix sum — range sum `prefix[r + 1] - prefix[l]`.
- Prefix map — previous sums count karke target-sum subarrays nikalo.
- Invariant — pointer/window move ke baad jo rule true rehta hai.
- Dry run — duplicates, empty input aur exact boundary check karo.
- Difference array — range updates mark karke prefix accumulation se final values nikalo.
- Sorted two-sum — low sum par left badhao, high sum par right ghatao.
- Permutation window — same length ke window mein required character frequencies match karo.

### Pattern choice

- Negative window — negative numbers ke saath sum-based shrink logic monotonic nahi; prefix-sum/map pattern consider.
- Prefix seed — sum zero ki initial frequency 1 rakho, taaki index zero se matching subarray count ho.
- Pointer movement — sorted order/monotonic rule prove karke left/right move; arbitrary move candidates miss kar sakta hai.

### Matrix patterns

- Matrix flatten — rectangular grid mein index = row × cols + col; row = floor(index/cols), col = index % cols.
- Matrix transpose — rows aur columns swap; rectangular input m×n se n×m banta hai.
- Matrix edges — empty, 1×1, single row aur single column par traversal dry-run karo.
- Spiral traversal — top/bottom/left/right boundaries shrink karo; single remaining row/column dobara visit mat karo.
- Square rotation — 90° clockwise ke liye transpose, phir har row reverse; rectangular output ke dimensions swap hote hain.

### Edge cases aur reasoning

- Prefix update order — target-sum counting mein previous-prefix match pehle count, current prefix baad insert; empty subarray accidentally count mat karo.
- Window assumption — longest/shortest window ke shrink proof ko input constraints se justify; negative values par invariant dobara evaluate karo.
- Difference boundary — inclusive [l,r] update ke liye diff[l]+=v, diff[r+1]-=v when valid; final array prefix se recover.

## Example se samjho

- Scenario — Sorted `[1,3,4,6]`, target7; left1 aur right6 ka sum7, ek pair milta hai.
- Reasoning — Target8 hota toh sum7 chhota: left badhao, kyunki current left ke saath koi smaller right target tak nahi pahunchega. Agla sum9 par right ghatao.
- Catch — Unsorted input par elimination proof invalid hai; sorting original indices/order badal sakti hai, isliye input/output contract pehle clarify karo.

## Recall aur practice

- Sawal — [-1,1] target 0 mein positive-only shrinking window kyun unreliable hai?
- Jawaab — Add/remove se sum monotonic change nahi; target prefix differences frequency-map se count karo.
- Khud try karo — Subarray-sum count implement karo; [0,0], target0 ka result3, negatives aur starting-index-zero match verify karo.

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

- `O(n)` time; sort approach `O(n log n)`.

</details>

### Easy · Sorted array mein pair (two pointers)

Sorted `nums` mein do numbers dhundo jinka sum `target` ho.

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

- Pointer movement — sum chhota toh left badhao (bada value), bada toh right ghatao.
- `O(n)` time, `O(1)` space; sorted hona zaroori.

</details>

### Medium · Size `k` window ka max sum

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

- Slide — naya element add, purana remove; har window recompute nahi → `O(n)`.
- `best` pehli window se start (all-negative arrays par `0` galat hota).

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

- Variable window — duplicate mile toh `start` uske pichle occurrence ke aage.
- `>= start` check — window ke bahar wala purana index ignore.
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

- Idea — `prefix[j] − prefix[i] = k` → pehle wale prefixes mein `prefix − k` gino.
- Seed `{0: 1}` — index 0 se shuru hone wale subarrays.
- Sliding window yahan fail — negatives ke saath sum monotonic nahi.

</details>

### Hard · Matrix spiral order

`[[1,2,3],[4,5,6],[7,8,9]]` → `[1,2,3,6,9,8,7,4,5]`. Non-square matrix bhi.

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

- Boundaries — har side ke baad shrink.
- Guards — single row/column bachne par duplicate traversal rokte hain (`3×1`, `1×3` test karo).

</details>

## Sources — aur padhne ke liye

- [Yangshun Tay — matrix cheatsheet](https://www.techinterviewhandbook.org/algorithms/matrix/)

- [ECMAScript keyed collections](https://tc39.es/ecma262/multipage/keyed-collections.html)
- [MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/04-problem-solving-patterns.md)
