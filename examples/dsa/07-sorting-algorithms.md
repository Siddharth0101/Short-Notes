# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Choosing an algorithm

```js
function insertionSort(values) {
  const a = [...values];
  for (let i = 1; i < a.length; i++) {
    const value = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > value) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = value;
  }
  return a;
}
```

## Merge sort

```js
function mergeSort(values) {
  if (values.length <= 1) return [...values];
  const mid = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, mid));
  const right = mergeSort(values.slice(mid));
  const output = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    output.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  while (i < left.length) output.push(left[i++]);
  while (j < right.length) output.push(right[j++]);
  return output;
}
```

```js
function mergeSortInPlace(values) {
  const a = [...values];           // ek baar copy (caller ka array safe rahe)
  const buffer = new Array(a.length); // ek hi scratch buffer, reused
  sortRange(a, buffer, 0, a.length);
  return a;

  function sortRange(a, buf, lo, hi) {   // half-open [lo, hi)
    if (hi - lo <= 1) return;
    const mid = lo + ((hi - lo) >> 1);
    sortRange(a, buf, lo, mid);
    sortRange(a, buf, mid, hi);
    if (a[mid - 1] <= a[mid]) return;    // already ordered: merge skip karo
    merge(a, buf, lo, mid, hi);
  }

  function merge(a, buf, lo, mid, hi) {
    let i = lo, j = mid, k = lo;
    while (i < mid && j < hi) buf[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    for (let t = lo; t < hi; t++) a[t] = buf[t];
  }
}
```

## Quicksort in detail

```js
// Lomuto partition: [lo, hi] inclusive, pivot = a[hi].
function partition(a, lo, hi) {
  const pivot = a[hi];
  let boundary = lo;              // invariant: a[lo..boundary-1] <= pivot
  for (let i = lo; i < hi; i++) {
    if (a[i] <= pivot) {
      [a[boundary], a[i]] = [a[i], a[boundary]];
      boundary++;
    }
  }
  [a[boundary], a[hi]] = [a[hi], a[boundary]]; // pivot apni final jagah par
  return boundary;                // yeh index ab permanently correct hai
}

function quickSort(values) {
  const a = [...values];
  sort(0, a.length - 1);
  return a;

  function sort(lo, hi) {
    while (lo < hi) {
      // Randomized pivot: adversarial inputs ka expected behavior fix karta hai.
      const r = lo + Math.floor(Math.random() * (hi - lo + 1));
      [a[r], a[hi]] = [a[hi], a[r]];
      const p = partition(a, lo, hi);
      // Chhoti side par recurse, badi side par loop — stack O(log n) bounded.
      if (p - lo < hi - p) { sort(lo, p - 1); lo = p + 1; }
      else { sort(p + 1, hi); hi = p - 1; }
    }
  }
}
```

```js
// a ko `<pivot`, `=pivot`, `>pivot` mein todo. Equal region ko recursion skip karti hai.
function threeWaySort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
  let lt = lo, i = lo, gt = hi;
  while (i <= gt) {
    if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
    else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; } // i++ nahi!
    else i++;
  }
  threeWaySort(a, lo, lt - 1);
  threeWaySort(a, gt + 1, hi);   // [lt, gt] sab equal hain, done
  return a;
}
```

```js
function quickSelect(values, k) {        // k is 0-based
  const a = [...values];
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const r = lo + Math.floor(Math.random() * (hi - lo + 1));
    [a[r], a[hi]] = [a[hi], a[r]];
    const p = partition(a, lo, hi);
    if (p === k) return a[p];
    if (p < k) lo = p + 1;               // ek hi side, doosri discard
    else hi = p - 1;
  }
  return a[lo];
}
```

## Counting inversions: sorting as a measurement tool

```js
function countInversions(values) {
  const a = [...values];
  const buf = new Array(a.length);
  return sortCount(0, a.length);

  function sortCount(lo, hi) {
    if (hi - lo <= 1) return 0;
    const mid = lo + ((hi - lo) >> 1);
    let count = sortCount(lo, mid) + sortCount(mid, hi);
    let i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
      if (a[i] <= a[j]) buf[k++] = a[i++];
      else {
        // a[j] left half ke saare remaining elements se chhota hai.
        count += mid - i;      // ek hi step mein (mid - i) inversions counted
        buf[k++] = a[j++];
      }
    }
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    for (let t = lo; t < hi; t++) a[t] = buf[t];
    return count;
  }
}
```

## JavaScript built-in sorting

```js
[10, 9, 1].sort();                    // [1, 10, 9] — string comparison, not numeric
[10, 9, 1].sort((a, b) => a - b);     // [1, 9, 10]
[10, 9, 1].toSorted((a, b) => a - b); // [1, 9, 10], original array unchanged

// Multi-key comparator: pehle team (ascending), phir score (descending).
const byTeamThenScore = (x, y) =>
  x.team.localeCompare(y.team) || y.score - x.score;
```
