---
id: dsa-tries-range-bits
title: Tries, bitmasks and range queries — a practical bridge to advanced structures
track: dsa
order: 14
level: Advanced
minutes: 4
summary: Trie — a tree of characters/prefixes; lookup is O(word length).
tags: trie, bitmask, fenwick, segment-tree
---

## Quick revision

> Revision target — Identify the invariants of prefix lookup, range aggregation and bit width.

- Trie — a tree of characters/prefixes; lookup is O(word length).
- Bitmask — represent a small set in bits.
- Bit operations — set `mask | bit`, test `mask & bit`, clear `mask & ~bit`.
- JS bits — the bitwise operators on a number use 32-bit integers; handle large masks carefully.
- Fenwick tree — point update/prefix sum in O(log n).
- Lowbit — `i & -i`; add it in an update, subtract it in a prefix query.
- Range sum — prefix(r) minus prefix(l - 1).
- Segment tree — flexible range queries/updates; define the merge rule.
- Lazy propagation — defer range updates and propagate the pending tags.
- Coordinate compression — sparse ordered values become dense ranks; retain the actual distances separately.
- Prefix trie terminal — a word-ending marker is needed; an existing path is not proof of a complete word.
- Segment merge — an associative operation is required; the empty-range identity must be compatible.

### Advanced patterns

- Sweep line — process sorted event boundaries; define the tie policy for the same coordinate.
- Rolling hash — a fingerprint of a sliding substring; collisions are possible, so verify equality when needed.

### Bit tricks

- Kth bit toggle — for a zero-based k, `mask ^ (1 << k)` flips the bit; mind the integer width.
- Power of two — for a positive n, `(n & (n - 1)) === 0`; exclude zero first.
- Bitwise precedence — write a bit test as `(n & (1 << k)) !== 0`; without the parentheses the comparison can be evaluated first.

### Edge cases and reasoning

- Fenwick index safety — a one-based update at index 0 has lowbit 0 and the loop can get stuck; map a public zero-based API to the internal index+1.
- Trie deletion — clear the word's terminal and prune shared prefix nodes only when unused; deleting one of app/apple must not break the other.
- Bit width boundary — Number shifts take the count modulo 32; 1<<32 is not the expected 33rd bit, and larger integer masks need consistent BigInt operators.
- Lazy tag composition — the order of a range assign and an add matters; combine a new tag with the pending old operation using the correct composition rule.

## Understand it with an example

- Scenario — Using a Fenwick structure for the values `[2,1,4]`, apply +3 at index 1 and get the sum of the range [1,2].
- Reasoning — The values become `[2,4,4]`; prefix through 2 is 10, prefix before 1 is 2, range sum 8. Map the public zero-based index 1 to the internal index 2.
- Catch — An internal update at index 0 has a lowbit of zero and the loop can stall; coordinate compression preserves order, not numeric distances.

## Recall and practice

- Question — Does the existence of the path app in a trie prove that app is a stored word?
- Answer — No; app is also a prefix of apple. A separate terminal marker is required.
- Try it yourself — Trace insert-delete of app/apple in a trie and a Fenwick update at the first/last index; verify prefix 0, an empty range and the behaviour of a >31-bit mask.

## Practice questions

### Easy · Bit tricks

Is `n` a power of two? How many 1 bits does `n` have? What should you watch for in JS?

<details>
<summary>Answer</summary>

```js
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;
function countBits(n) {
  let count = 0;
  while (n) { n &= n - 1; count++; } // lowest set bit hatao
  return count;
}
```

- `n & (n − 1)` — clears the lowest 1 bit.
- JS — the bitwise operators work on 32-bit signed integers; use `BigInt` for large numbers.
- Precedence — `n & 1 === 0` parses wrongly; add brackets: `(n & 1) === 0`.

</details>

### Medium · Implement a trie

`insert(word)`, `search(word)`, `startsWith(prefix)`.

<details>
<summary>Answer</summary>

```js
class Trie {
  constructor() { this.root = { children: new Map(), end: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch);
    }
    node.end = true;
  }
  #walk(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }
  search(word) { return this.#walk(word)?.end === true; }
  startsWith(prefix) { return this.#walk(prefix) !== null; }
}
```

- `end` flag — after inserting `"app"`, `search("ap")` is false and `startsWith("ap")` is true.
- Complexity — `O(L)` for a word of length `L`, independent of the total size.

</details>

### Medium · Single number and subsets via bitmask

(a) Every number appears twice except one — find it. (b) All subsets of `[a, b, c]` with a bitmask.

<details>
<summary>Answer</summary>

```js
const singleNumber = (nums) => nums.reduce((acc, x) => acc ^ x, 0);

function subsetsByMask(items) {
  const out = [];
  for (let mask = 0; mask < 1 << items.length; mask++) {
    out.push(items.filter((_, i) => mask & (1 << i)));
  }
  return out;
}
```

- XOR — `x ^ x = 0`, `x ^ 0 = x`; pairs cancel.
- Mask — bit `i` on = item `i` included; `2^n` masks.
- Limit — `1 << 31` is negative in JS; this form is safe only up to `n ≤ 30`.

</details>

### Medium · Range sum: prefix sums vs Fenwick

The array is fixed and there are many `sum(l, r)` queries. What if updates arrive too?

<details>
<summary>Answer</summary>

- Static — prefix sums: build `O(n)`, query `prefix[r + 1] − prefix[l]` in `O(1)`.
- With updates — the prefix array needs an `O(n)` rebuild on every update.
- Fenwick/segment tree — both update and query in `O(log n)`.
- Segment tree — more flexible operations such as min/max and lazy range updates.

</details>

### Hard · Implement a Fenwick tree

Point update and prefix/range sum.

<details>
<summary>Answer</summary>

```js
class Fenwick {
  constructor(n) { this.tree = new Array(n + 1).fill(0); } // 1-indexed
  add(index, delta) {
    for (let i = index + 1; i < this.tree.length; i += i & -i) this.tree[i] += delta;
  }
  prefix(index) { // sum of [0, index]
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }
  range(l, r) { return this.prefix(r) - (l > 0 ? this.prefix(l - 1) : 0); }
}
```

- `i & -i` — the lowbit; every node covers a range whose size is a power of two.
- 1-indexing — at index `0`, `lowbit = 0` would loop forever; hence the `+1` shift.
- To set a value — `add(i, newValue − current)`.

</details>

## Sources — further reading

- [Yangshun Tay — binary cheatsheet](https://www.techinterviewhandbook.org/algorithms/binary/)

- [Princeton tries](https://algs4.cs.princeton.edu/52trie/)
- [CMU Fenwick problem](https://www.cs.cmu.edu/~eugene/teach/acm10b/prob/101013.pdf)
- [MDN bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/14-tries-range-bits.md)
