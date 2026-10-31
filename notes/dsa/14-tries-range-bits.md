---
id: dsa-tries-range-bits
title: Tries, bitmasks aur range queries — advanced structures ka practical bridge
track: dsa
order: 14
level: Advanced
minutes: 4
summary: Trie — characters/prefixes ka tree; lookup O(word length).
tags: trie, bitmask, fenwick, segment-tree
---

## Quick revision

> Revision target — Prefix lookup, range aggregation aur bit width ke invariants identify karo.

- Trie — characters/prefixes ka tree; lookup O(word length).
- Bitmask — small set ko bits mein represent karo.
- Bit operations — set `mask | bit`, test `mask & bit`, clear `mask & ~bit`.
- JS bits — number bitwise operators 32-bit integers use karte hain; large masks carefully handle karo.
- Fenwick tree — point update/prefix sum O(log n).
- Lowbit — `i & -i`; update mein add, prefix query mein subtract.
- Range sum — prefix(r) minus prefix(l - 1).
- Segment tree — flexible range queries/updates; merge rule define karo.
- Lazy propagation — range updates ko defer karke pending tags propagate karo.
- Coordinate compression — sparse ordered values ko dense ranks; actual distance separately retain karo.
- Prefix trie terminal — word ending marker chahiye; path exist hona complete word ka proof nahi.
- Segment merge — associative operation required; empty-range identity compatible honi chahiye.

### Advanced patterns

- Sweep line — sorted event boundaries process; same-coordinate tie policy define karo.
- Rolling hash — sliding substring fingerprint; collision possible, zaroorat par equality verify.

### Bit tricks

- Kth bit toggle — zero-based k par `mask ^ (1 << k)` bit flip karta hai; integer width ka dhyaan rakho.
- Power of two — positive n ke liye `(n & (n - 1)) === 0`; zero ko pehle exclude karo.
- Bitwise precedence — bit test `(n & (1 << k)) !== 0` likho; parentheses hataane se comparison pehle evaluate ho sakta hai.

### Edge cases aur reasoning

- Fenwick index safety — one-based update index0 lowbit0 se loop atak sakta; public zero-based API ko internal index+1 map karo.
- Trie deletion — word terminal clear, shared prefix nodes tabhi prune when unused; app/apple mein ek delete se doosra na toote.
- Bit width boundary — Number shifts count modulo32; 1<<32 expected 33rd bit nahi, larger integer masks ke liye consistent BigInt operators chahiye.
- Lazy tag composition — range assign aur add ka order matter; new tag ko pending old operation ke correct composition rule se combine karo.

## Example se samjho

- Scenario — Values `[2,1,4]` ka Fenwick structure use karke index1 par +3 aur range[1,2] sum chahiye.
- Reasoning — Values `[2,4,4]`; prefix through2 is10, prefix before1 is2, range sum8. Public zero-based index1 ko internal index2 map karo.
- Catch — Internal update index0 se lowbit zero aur loop stall ho sakta hai; coordinate compression order preserve karti hai, numeric distances nahi.

## Recall aur practice

- Sawal — Trie mein app path exist karne se app stored word prove hota hai?
- Jawaab — Nahi; apple ka prefix bhi app hai. Separate terminal marker required hai.
- Khud try karo — Trie app/apple insert-delete aur Fenwick first/last-index update trace karo; prefix0, empty range aur >31-bit mask behavior verify karo.

## Practice questions

### Easy · Bit tricks

`n` power of two hai? `n` mein kitne 1 bits hain? JS mein kya dhyan rakhna?

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

- `n & (n − 1)` — sabse neeche wala 1 bit clear karta hai.
- JS — bitwise operators 32-bit signed integers par kaam karte hain; bade numbers ke liye `BigInt`.
- Precedence — `n & 1 === 0` galat parse hota hai; brackets lagao: `(n & 1) === 0`.

</details>

### Medium · Trie implement karo

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

- `end` flag — `"app"` insert kiya toh `search("ap")` false, `startsWith("ap")` true.
- Complexity — word length `L` par `O(L)`, total size par independent.

</details>

### Medium · Single number aur subsets via bitmask

(a) Har number do baar hai sivaay ek ke — use dhundo. (b) `[a, b, c]` ke saare subsets bitmask se.

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
- Limit — `1 << 31` JS mein negative; `n ≤ 30` tak hi is form mein safe.

</details>

### Medium · Range sum: prefix sums vs Fenwick

Array fixed hai aur bahut saare `sum(l, r)` queries. Agar updates bhi aayein toh?

<details>
<summary>Answer</summary>

- Static — prefix sums: build `O(n)`, query `prefix[r + 1] − prefix[l]` `O(1)`.
- Updates ke saath — prefix array har update par `O(n)` rebuild.
- Fenwick/segment tree — update aur query dono `O(log n)`.
- Segment tree — min/max, lazy range updates jaise zyada flexible operations.

</details>

### Hard · Fenwick tree implement karo

Point update aur prefix/range sum.

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

- `i & -i` — lowbit; har node ek power-of-two size range cover karta hai.
- 1-indexing — index `0` par `lowbit = 0` infinite loop deta; isliye `+1` shift.
- Update value set karna ho — `add(i, newValue − current)`.

</details>

## Sources — aur padhne ke liye

- [Yangshun Tay — binary cheatsheet](https://www.techinterviewhandbook.org/algorithms/binary/)

- [Princeton tries](https://algs4.cs.princeton.edu/52trie/)
- [CMU Fenwick problem](https://www.cs.cmu.edu/~eugene/teach/acm10b/prob/101013.pdf)
- [MDN bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/14-tries-range-bits.md)
