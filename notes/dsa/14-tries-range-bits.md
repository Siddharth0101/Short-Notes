---
id: dsa-tries-range-bits
title: Tries, bitmasks aur range queries — advanced structures ka practical bridge
track: dsa
order: 14
level: Advanced
minutes: 33
summary: Query shape se structure choose karo: prefix ke liye trie, subset ke liye mask aur changing range sums ke liye Fenwick tree.
tags: trie, bitmask, fenwick, segment-tree
---

## Mental model — simple soch

Map exact key lookup mein strong hai, lekin “ca se start hone wale words?” alag query hai. Prefix sum static range total fast deta hai, lekin ek element update ke baad suffix rebuild chahiye. Advanced structure ka naam yaad karne se pehle workload likho: keys ka shape, queries, updates aur required aggregate.

> **Core takeaway:** Structure us repeated work ko save kare jo tumhari actual queries baar-baar karti hain.

Hashing, trees, prefix sums aur complexity prerequisites hain. Yeh chapter core DSA ke baad extension hai. Trie, mask aur Fenwick interchangeable nahi; inhe ek decision map se connect kar rahe hain.

## Trie ko shared-prefix tree ki tarah dekho

Words `car`, `cat`, `care` insert karo. Root se `c → a` path shared hai; phir r/t branches hain. End-of-word marker zaroori hai: `car` complete word hai aur `care` ka prefix bhi. `ca` path present hone se `ca` dictionary word hona prove nahi hota.

Har node par children Map aur terminal boolean rakh sakte ho. Insert/search L symbols traverse karta hai, assuming expected constant-time child lookup. Prefix ke baad all completions output karne ka time output size par bhi depend karega. “Autocomplete O(L)” bolkar thousand results enumerate karne ka cost ignore mat karo. Suggestions ko top-k score/limit ke saath bounded rakho.

Case folding, Unicode normalization aur locale policy pehle define karo. JavaScript `for...of` Unicode code points deta hai, user-perceived grapheme cluster necessarily nahi. Word delete karte waqt terminal unset karo aur sirf unused path nodes prune karo; `car` delete karne se `care` nahi mitna chahiye.

## Bitmask chhote subsets ka compact representation hai

Flags read=1, write=2, share=4 lo. Read+share mask 5 hai. `(mask & 2) !== 0` write check karta hai. `mask | flag` add, `mask & ~flag` remove aur `mask ^ flag` toggle karta hai. Toggle “ensure present” nahi hai: existing flag ko off kar dega.

JavaScript Number bitwise operators 32-bit integers par operate karte hain; arbitrary-width integer assume mat karo. Larger masks ke liye BigInt operators consistently use karo; Number aur BigInt mix mat karo. Subset enumeration 2^n states hai: compact representation exponential state count ko linear nahi banati. Authorization decision ko trusted server-side rule hi enforce kare.

## Fenwick tree — updated sums ke liye blocks

Static prefix array ke contrast mein Fenwick partial sums ke overlapping binary blocks rakhta hai. API yahan `prefix(end)` ko half-open `[0,end)` sum define karti hai. `add(index,delta)` point increment karta hai, assignment nahi. Neeche small in-memory arrays, finite values aur safe integer bitwise index range ka teaching implementation hai; huge arrays/numeric overflow production contract alag chahiye.

```js
class Fenwick {
  constructor(size) {
    if (!Number.isInteger(size) || size < 0 || size > 1_000_000) throw new RangeError('size');
    this.size = size;
    this.tree = Array(size + 1).fill(0);
  }
  add(index, delta) {
    if (!Number.isInteger(index) || index < 0 || index >= this.size || !Number.isFinite(delta)) {
      throw new RangeError('update');
    }
    for (let i = index + 1; i <= this.size; i += i & -i) this.tree[i] += delta;
  }
  prefix(end) {
    if (!Number.isInteger(end) || end < 0 || end > this.size) throw new RangeError('end');
    let sum = 0;
    for (let i = end; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }
}
const values = [2, 1, 3, 4];
const sums = new Fenwick(values.length);
values.forEach((value, index) => sums.add(index, value));
console.log(sums.prefix(3) - sums.prefix(1)); // 4: indices 1,2
sums.add(1, 5);
console.log(sums.prefix(3) - sums.prefix(1)); // 9
```

`i & -i` lowest set bit ka block size deta hai. Query block end se peeche jump karti hai; update containing blocks ko aage change karta hai. Internal index 1-based hai; zero par update loop stuck ho sakta tha, isliye public index ko +1 kiya. Update/query O(log n), storage O(n); shown repeated-add build O(n log n).

Range minimum ke liye prefix difference kaam nahi karta: minimum invertible nahi hai. Segment tree associative operation aur identity ke saath range aggregate support kar sakti hai. Sum identity 0, minimum identity +Infinity. Range updates ke liye lazy propagation separate extension hai; sirf tree banane se update semantics solve nahi hoti.

## Practice — workload se choose karo

Read-only array par ten thousand sums: prefix array simple hai. Frequent point increments plus sums: Fenwick. Arbitrary point changes plus range min: segment tree. Exact full word membership: Set enough ho sakta hai; bounded prefix suggestions: trie evaluate karo. Har choice ki memory aur output cost bhi compare karo.

## Depth walkthrough — andar kya ho raha hai?

### Fenwick ke jumps ko concrete blocks se derive karo

Internal index 6 binary 110 hai; lowest set bit 2, toh tree[6] last two positions ka block sum rakhta hai. Prefix(6) tree[6] leta hai, index 4 par jump, tree[4] first four positions cover karti hai. Disjoint blocks 4+2 se six values covered; double counting nahi.

Public index 1 update karoge toh internal index 2 se start: blocks 2,4,8... change honge, kyunki un sabke range mein changed element aata hai. Query downward blocks consume karti hai; update upward containing blocks repair karta hai. One-based internal indexing loop progress ke liye crucial hai.

Trie search `ca` par path milna exact word proof nahi. car/care insert karo: car node terminal aur child e dono rakhti hai. car delete mein terminal clear karna care path preserve karega. Subtree pruning tabhi safe jab terminal false aur children empty hon.

**Practice:** Static array ke liye prefix sums build O(n), query O(1) enough ho sakti hai. Frequent arbitrary min updates ke liye segment tree ka parent min(left,right) invariant use hota hai; minimum ko prefix difference se undo nahi kar sakte. Structure choose karte waqt operation, identity, update aur output cost four columns mein compare karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Trie mein terminal marker aur child path dono kyun chahiye?

**Apply — khud try karo:** [2,1,3,4] mein index 1 ko 6 assign karna hai. Fenwick add ko kya doge? Phir [1,3) sum?

> **Hint — chhota ishara:** add delta leta hai; new minus old calculate karo.

**Answer guide — pehle khud karo, phir compare karo:** Delta 6−1=5 do. [1,3) sum 6+3=9. Assignment API banani ho toh current values separately rakho. Prefix(0)=0 aur empty range sum=0 bhi check karo.

**Exit check — aage badhne se pehle:** Explain karo ki prefix-min subtraction se arbitrary range minimum kyun nahi milta.

## Sources — aur padhne ke liye

[Princeton tries](https://algs4.cs.princeton.edu/52trie/), [CMU Fenwick problem](https://www.cs.cmu.edu/~eugene/teach/acm10b/prob/101013.pdf) aur [MDN bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND) se mechanism aur language limits compare karo.
