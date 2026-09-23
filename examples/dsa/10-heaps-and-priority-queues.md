# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A numeric min-heap

```js
class MinHeap {
  values = [];
  get size() { return this.values.length; }
  peek() { return this.values[0]; }

  push(value) {
    const a = this.values;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }

  pop() {
    const a = this.values;
    if (a.length === 0) return undefined;
    const minimum = a[0];
    const last = a.pop();
    if (a.length === 0) return minimum;
    a[0] = last;
    let i = 0;
    while (2 * i + 1 < a.length) {
      let child = 2 * i + 1;
      if (child + 1 < a.length && a[child + 1] < a[child]) child++;
      if (a[i] <= a[child]) break;
      [a[i], a[child]] = [a[child], a[i]];
      i = child;
    }
    return minimum;
  }
}
```

## Top k and scheduling

```js
function topK(nums, k) {
  const heap = new MinHeap();   // MIN-heap for the k LARGEST — counterintuitive but key
  for (const n of nums) {
    if (heap.size < k) { heap.push(n); continue; }
    if (n > heap.peek()) {      // root = k candidates ka sabse chhota
      heap.pop();               // usse nikalo, naya bada daalo
      heap.push(n);
    }
  }
  return heap.values;           // k largest, unsorted
}
```

```js
// Tie-break by insertion order: heap comparator do fields dekhta hai.
let sequence = 0;
const entry = { priority, seq: sequence++, task };
const before = (a, b) => a.priority - b.priority || a.seq - b.seq;
```

```js
// Approach 1: lazy deletion — stale entries push karo, pop par skip karo.
const best = new Map();                 // node -> best known distance
heap.push({ node, dist });              // purani entry heap mein padi rehti hai
// ...
const { node, dist } = heap.pop();
if (dist > (best.get(node) ?? Infinity)) continue;  // stale, ignore karo
```

```js
class MedianStream {
  #low = new MaxHeap();    // chhoti aadhi values, root = unme se sabse badi
  #high = new MinHeap();   // badi aadhi values, root = unme se sabse chhoti

  add(value) {
    if (this.#low.size === 0 || value <= this.#low.peek()) this.#low.push(value);
    else this.#high.push(value);

    // Invariant: sizes at most 1 se differ karein, low >= high.
    if (this.#low.size > this.#high.size + 1) this.#high.push(this.#low.pop());
    else if (this.#high.size > this.#low.size) this.#low.push(this.#high.pop());
  }

  median() {
    if (this.#low.size === 0) return undefined;
    return this.#low.size > this.#high.size
      ? this.#low.peek()
      : (this.#low.peek() + this.#high.peek()) / 2;
  }
}
```

## Why bottom-up heapify is linear

```js
function heapify(a) {
  // Last internal node = parent of the last element.
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) sink(a, i, a.length);
  return a;
}

function sink(a, i, size) {
  while (2 * i + 1 < size) {
    let child = 2 * i + 1;
    if (child + 1 < size && a[child + 1] < a[child]) child++;
    if (a[i] <= a[child]) break;
    [a[i], a[child]] = [a[child], a[i]];
    i = child;
  }
}
```

## Heapsort: sorting with the same primitive

```js
function heapSort(values) {
  const a = [...values];
  buildMaxHeap(a);                       // O(n)
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];     // max ko uski final jagah par bhejo
    sinkMax(a, 0, end);                  // bacha hua heap repair karo — O(log n)
  }
  return a;                              // ascending order
}
```
