---
id: dsa-hashing
title: Hash tables maps and sets
track: dsa
order: 3
level: Intermediate
minutes: 3
summary: Hash table — maps a key to a bucket; collision handling is required.
tags: hashing, map, set, collisions, two-sum
visual: hash-collisions
---

## Quick revision

> Revision target — Solve the difference between membership and frequency with the correct key representation.

- Hash table — maps a key to a bucket; collision handling is required.
- Lookup — expected O(1); do not blindly claim a worst-case guarantee.
- Collision — handle multiple keys with chaining or probing.
- Load factor — entries/capacity; when it is high, the resize/probe cost grows.
- Map — key/value lookup; Set — membership/uniqueness.
- Object key — a JS Map compares by identity; equal-looking objects are different keys.
- Canonical key — avoid collisions when encoding a composite identity.
- LRU — a hash map + a doubly linked list give O(1) lookup and recency updates.
- Resize — a rehash makes one operation expensive; the amortized insertion cost of a growing table is a separate matter.
- Frequency map — when you need multiplicity rather than presence, a boolean Set is not enough.
- Hash/equality — equal keys need compatible hashes; do not treat a collision as proof of an unequal key.

### Edge cases and reasoning

- Probing deletion — in open addressing a deleted slot keeps a tombstone; emptying it can stop the search for a later collided key prematurely.
- LRU update — refresh recency when overwriting an existing key; give an explicit contract for zero capacity and for map/list consistency on eviction.
- Composite identity — delimiter-only concatenation can be ambiguous; preserve distinct tuples with a length prefix/structured serialization.

## Research notes: Expected and amortized are different guarantees

- When the capacity doubles, the work of resizing is spread across many inserts.

## Understand it with an example

- Scenario — Target 8, values `[4,4]`; two-sum must return distinct indices.
- Reasoning — At the first 4, seen is empty, then index 0 is stored. The second 4 finds its complement 4 already there: the answer is [0,1]. Under the expected hash-lookup model the scan is O(n).
- Catch — Store the current item before the lookup and a single `[4]` can pair with itself; preserve the required multiplicity and the order of operations.

## Recall and practice

- Question — Why is comparing anagram characters with a Set wrong for repeated letters?
- Answer — A Set loses multiplicity; aab and abb have the same character set but different frequencies.
- Try it yourself — Build a frequency-map anagram checker and a capacity-2 LRU; verify duplicates, refresh on overwrite, zero capacity and the lookup of an evicted key.

## Practice questions

### Easy · Two Sum in `O(n)`

<details>
<summary>Answer</summary>

```js
function twoSum(nums, target) {
  const seen = new Map(); // value → index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
```

- Check first, insert after — the same element is never used twice.
- `O(n)` average time, `O(n)` space (sorting + two pointers uses `O(1)` space but loses the indexes).

</details>

### Easy · Object vs `Map` as hash table

```js
const counts = {};
counts[1] = 'a';
counts['1'] = 'b';
console.log(Object.keys(counts), counts.toString);
```

<details>
<summary>Answer</summary>

- Keys — `['1']`; object keys become strings, so `1` and `'1'` collide.
- `counts.toString` — you get an inherited function; user keys such as `'constructor'`/`'__proto__'` cause surprises.
- `Map` — preserves the key type, has no prototype keys, and offers `size` and insertion order.

</details>

### Medium · Group anagrams

`["eat","tea","tan","ate","nat","bat"]` → `[["eat","tea","ate"],["tan","nat"],["bat"]]`.

<details>
<summary>Answer</summary>

```js
function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = [...word].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
```

- Canonical key — the sorted letters; all anagrams share the same key.
- Complexity — `O(n · k log k)`; for lowercase a–z a 26-count signature gives `O(n · k)`.

</details>

### Medium · A Set of coordinates does not dedupe

```js
const visited = new Set();
visited.add([1, 2]);
console.log(visited.has([1, 2]));
```

<details>
<summary>Answer</summary>

- Output — `false`; arrays are compared by reference.
- Fix — a canonical primitive key: `visited.add(\`${r},${c}\`)` or the number `r * cols + c`.
- Rule — build a stable string/number key for a composite identity.

</details>

### Hard · LRU cache `O(1)`

Both `get(key)` and `put(key, value)` are `O(1)`; when the capacity is full, evict the least recently used.

<details>
<summary>Answer</summary>

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value); // most recent at end
    return value;
  }
  put(key, value) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
  }
}
```

- `Map` insertion order — the first key = the least recent.
- Update — make an existing key recent with delete + set.
- Language-agnostic version — a hash map + a doubly linked list.

</details>

## Sources — further reading

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)
- [Princeton's hash tables chapter](https://algs4.cs.princeton.edu/34hash/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/03-hash-tables-and-sets.md)
