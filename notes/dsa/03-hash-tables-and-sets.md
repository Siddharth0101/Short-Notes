---
id: dsa-hashing
title: Hash tables maps and sets
track: dsa
order: 3
level: Intermediate
minutes: 3
summary: Hash table — key ko bucket mein map; collision handling zaroori.
tags: hashing, map, set, collisions, two-sum
---

## Quick revision

> Revision target — Membership aur frequency ke difference ko correct key representation se solve karo.

- Hash table — key ko bucket mein map; collision handling zaroori.
- Lookup — expected O(1); worst-case guarantee blindly mat bolo.
- Collision — chaining ya probing se multiple keys handle karo.
- Load factor — entries/capacity; zyada ho toh resize/probe cost badhta hai.
- Map — key/value lookup; Set — membership/uniqueness.
- Object key — JS Map mein identity se compare; equal-looking objects alag keys.
- Canonical key — composite identity encode karte waqt collisions avoid karo.
- LRU — hash map + doubly linked list se lookup/recency updates O(1).
- Resize — rehash ek operation expensive; growing table ka amortized insertion cost alag.
- Frequency map — presence se zyada multiplicity chahiye, toh boolean Set enough nahi.
- Hash/equality — equal keys ko compatible hashes; collision ko unequal key ka proof mat samjho.

### Edge cases aur reasoning

- Probing deletion — open addressing mein deleted slot tombstone rakhe; empty karne se later collided key search prematurely ruk sakti.
- LRU update — existing key overwrite par recency refresh; capacity zero aur eviction ke map/list consistency ka explicit contract.
- Composite identity — delimiter-only concatenation ambiguous ho sakti; length-prefix/structured serialization se distinct tuples preserve karo.

## Research notes: Expected and amortized are different guarantees

- Capacity double karne par resizing ka work bahut saare inserts mein spread hota hai.

## Example se samjho

- Scenario — Target8, values `[4,4]`; two-sum ko distinct indices return karne hain.
- Reasoning — First4 par seen empty, phir index0 store. Second4 ko complement4 pehle se milega: answer[0,1]. Expected hash lookup model mein scan O(n) hai.
- Catch — Current item ko lookup se pehle store karoge toh single `[4]` apne aap se pair ho sakta hai; required multiplicity aur operation order preserve karo.

## Recall aur practice

- Sawal — Set se anagram characters compare karna repeated letters ke liye kyun wrong?
- Jawaab — Set multiplicity lose karta; aab aur abb ka same character set hai par frequencies different.
- Khud try karo — Frequency-map anagram checker aur capacity-2 LRU banao; duplicates, overwrite refresh, zero capacity aur evicted lookup verify karo.

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

- Check pehle, insert baad mein — same element do baar use nahi hota.
- `O(n)` average time, `O(n)` space (sorting + two pointers `O(1)` space par indexes kho deta).

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

- Keys — `['1']`; object keys string ban jaati hain, `1` aur `'1'` collide.
- `counts.toString` — inherited function milta hai; `'constructor'`/`'__proto__'` jaise user keys surprises dete hain.
- `Map` — key type preserve, prototype keys nahi, `size`, insertion order.

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

- Canonical key — sorted letters; saare anagrams same key.
- Complexity — `O(n · k log k)`; lowercase a–z ho toh 26-count signature se `O(n · k)`.

</details>

### Medium · Coordinates ka Set dedupe nahi karta

```js
const visited = new Set();
visited.add([1, 2]);
console.log(visited.has([1, 2]));
```

<details>
<summary>Answer</summary>

- Output — `false`; arrays reference se compare hote hain.
- Fix — canonical primitive key: `visited.add(\`${r},${c}\`)` ya `r * cols + c` number.
- Rule — composite identity ke liye stable string/number key banao.

</details>

### Hard · LRU cache `O(1)`

`get(key)` aur `put(key, value)` dono `O(1)`; capacity full ho toh least-recently-used evict.

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

- `Map` insertion order — first key = least recent.
- Update — existing key ko delete + set karke recent banao.
- Language-agnostic version — hash map + doubly linked list.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)
- [Princeton's hash tables chapter](https://algs4.cs.princeton.edu/34hash/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/03-hash-tables-and-sets.md)
