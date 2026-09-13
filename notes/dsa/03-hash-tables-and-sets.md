---
id: dsa-hashing
title: Hash tables maps and sets
track: dsa
order: 3
level: Intermediate
minutes: 29
summary: Hashing assumptions, collision handling, equality, and lookup-driven algorithms samjho.
tags: hashing, map, set, collisions, two-sum
---

## Mental model

Hash table key ko hash value aur phir bucket location mein map karta hai. Different keys same location par aa sakti hain: ise collision kehte hain. Hash match equality prove nahi karta, isliye collision ke baad actual key comparison zaroori hai.

Good distribution aur controlled load factor ke under typical hash operations expected O(1) ho sakte hain. Adversarial collisions ya unsuitable implementation mein worst case O(n) ho sakta hai. Hashing long string key ka cost bhi key length par depend kar sakta hai; har key ko automatically unit-size mat samjho.

> **Core takeaway:** Hashing trades additional storage for efficient key lookup under its assumptions.

## Collision strategies

**Separate chaining:** Har bucket entries ki list ya another structure rakhta hai. **Open addressing:** Entries table mein hi rehti hain; collision par probing se next location dhoondte hain. Open-addressed deletion ko empty slot se replace karna probe chain tod sakta hai, isliye tombstones ya appropriate reinsertion strategy chahiye.

Load factor `entries / buckets` hai. Resize mein existing entries rehash karni pad sakti hain, so ek operation costly hoga; geometric capacity growth se sequence ka amortized cost control hota hai. Fixed tiny bucket array ko infinite input par O(1) bolna wrong hai.

Amortized argument wahi hai jo dynamic array mein tha: capacity geometrically (typically 2×) badhti hai, isliye n inserts mein total rehash work `1 + 2 + 4 + … + n < 2n` hai — per insert amortized O(1). Lekin **individual** insert jo resize trigger kare woh O(n) hai. Latency-sensitive systems mein yeh visible spike banta hai, aur yehi reason hai ki production code aksar expected size ke saath map pre-size karta hai (`new HashMap<>(expectedCapacity)`) taaki resizes hi na hon.

| Strategy | Lookup behavior | Memory | Notes |
| --- | --- | --- | --- |
| Separate chaining | Bucket ki list scan | Extra per-node pointers | High load factor tolerate karta hai; poor cache locality |
| Open addressing (linear probe) | Contiguous slots probe | Compact, no pointers | Excellent cache behavior; load factor low rakhna padta hai (~0.7) |
| Open addressing + tombstones | Deleted slots marked | Tombstones jama hote hain | Periodic rebuild chahiye warna probes lambe hote jaate hain |

Open addressing mein deletion ka classic bug yeh hai: slot ko simply empty kar dena probe chain todh deta hai. Maan lo `A` aur `B` same bucket par hash hote hain aur `B` agle slot par gaya. `A` delete karke slot empty kar do, ab `B` ka lookup pehle slot par "empty" dekh kar turant "not found" return karega — jabki `B` wahin padda hai. Isliye tombstone (special "deleted" marker) rakha jaata hai jo probing rokta nahi, sirf insertion ke liye slot free batata hai.

## JavaScript Map and Set

Map arbitrary values ko keys bana sakta hai; Set distinct values store karta hai. Object keys identity-based hote hain. `new Set([{id: 1}, {id: 1}]).size` isliye 2 hai. SameValueZero equality NaN ko NaN ke equal aur +0/-0 ko same maanta hai. Insertion order defined hai, sorted-key order nahi.

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
```

Current element insert karne se **pehle** complement check hota hai, so same index twice use nahi hota. `[3,3]` target 6 par `[0,1]` milta hai. Typical hash assumptions par expected O(n) time aur O(n) space; ECMAScript formally average sublinear access require karta hai, exact implementation complexity prescribe nahi karta.

Derivation dekhna useful hai, kyunki yehi transformation baar-baar aata hai. Brute force har pair check karta hai: O(n²) time, O(1) space. **Bottleneck:** har index `i` par hum poora prefix dobara scan karte hain yeh dhoondhne ke liye ki `target - nums[i]` wahan tha ya nahi. Woh scan ek pure membership question hai — aur membership ka answer ek hash map O(1) expected mein de sakta hai. Isliye hum **time ko space se kharid rahe hain**: O(n²) → O(n) time, O(1) → O(n) space.

Yeh trade-off har hashing solution ka core hai aur interview mein explicitly bolna chahiye: "repeated linear scan ko constant-time lookup mein convert kar raha hoon, cost O(n) extra memory hai." Agar constraint ho ki extra space O(1) hona chahiye, toh answer badal jaata hai — sorted input par two pointers use karo (lekin tab original indices lose ho jaati hain, unless values ke saath indices carry karo).

### Designing a canonical key

Group anagrams ek achha exercise hai kyunki **key design hi poora solution hai**, algorithm trivial hai.

```js
function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = [...word].sort().join('');   // canonical signature
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
```

Sorted-letters key O(m log m) per word leta hai (m = word length), so total O(n · m log m). Alternative counting key O(m) per word deta hai, lekin **delimiter zaroori hai**:

```js
// Count vector for a-z. Delimiter ke bina "1,11" aur "11,1" collide kar sakte hain.
function countKey(word) {
  const counts = new Array(26).fill(0);
  for (const ch of word) counts[ch.charCodeAt(0) - 97]++;
  return counts.join('#');    // '#' separator — "1#11" != "11#1"
}
```

Agar `join('')` likh do toh counts `[1, 11, 0, …]` aur `[11, 1, 0, …]` dono `"111..."` ban jaate hain — do alag multisets ek hi key par, aur output silently galat. Yeh exactly wahi "ambiguous signature" bug hai jo real serialization code mein bhi hota hai.

Canonical key design ke teen rules: (1) **injective hona chahiye** — do semantically alag inputs kabhi same key na dein; (2) **deterministic** — same input hamesha same key; (3) **normalization explicit** — case sensitivity, Unicode normalization (`'é'` composed vs. decomposed), whitespace, aur alphabet assumptions contract mein likhe hon. Teenon mein se koi bhi miss ho toh bug data-dependent aur intermittent hota hai.

## Frequent applications

| Problem | Stored information | Common bug |
| --- | --- | --- |
| Anagram | Character multiplicity | Set use karke repeated counts lose karna |
| First non-repeating value | Frequency then original-order scan | Sorted keys se original order assume karna |
| Prefix-sum target count | Earlier prefix sum frequencies | Initial zero-prefix count miss karna |
| Group anagrams | Canonical signature to list | Ambiguous delimiter-free count signature |
| Duplicate request detection | Durable request key and result | Process restart par in-memory state lose karna |

Canonical key representation carefully design karo. Sorted letters signature easy hai but sorting cost add karta hai. Fixed alphabet count vector faster ho sakta hai, lekin alphabet, normalization aur delimiter rules explicit hone chahiye.

## A hash map plus a list: the LRU cache

Ek single structure se O(1) lookup **aur** O(1) recency ordering dono nahi milte — isliye do structures combine karne padte hain. Yeh interview mein sabse common "data structure design" question hai:

```js
class LRUCache {
  #map = new Map();          // JS Map insertion order preserve karta hai
  #capacity;

  constructor(capacity) { this.#capacity = capacity; }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);        // purani position hatao
    this.#map.set(key, value);    // end par dobara daalo = most recently used
    return value;
  }

  put(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) {
      const oldest = this.#map.keys().next().value; // first inserted = LRU
      this.#map.delete(oldest);
    }
  }
}
```

JavaScript ka `Map` yahan cheat code hai: uski **insertion order guarantee** hi recency list ka kaam kar deti hai, aur `delete` + `set` se element ko "end par move" kiya ja sakta hai. Sab operations expected O(1), space O(capacity).

Languages jahan yeh guarantee nahi hai (ya jab interviewer explicitly kahe "Map ki ordering mat use karo"), wahan classic solution hash map + **doubly linked list** hai: map `key → node` deta hai (O(1) lookup), aur doubly linked list us node ko O(1) mein front par move karta hai ya tail se evict karta hai. Yahan doubly linked list isliye jeetta hai kyunki hum node reference **already hold** karte hain — bina uske list traversal O(n) hoti aur poora design gir jaata.

Design lesson generalizable hai: **jab ek structure se do alag access patterns chahiye, do structures ko synchronized rakho.** Wahi idea indexed heap (heap + position map), two-heap median, aur database mein secondary indexes ke peeche hai. Cost yeh hai ki dono structures ko har mutation par consistently update karna padta hai — ek jagah update bhool jaana silent corruption hai.

## Common mistakes

- **Wrong assumption:** `map.get(key)` ka `undefined` return karna matlab key absent hai. **Why it breaks:** Stored value khud `undefined` ho sakti hai, so presence aur absence indistinguishable ho jaate hain. `counts.get(k) === undefined ? 1 : …` jaise patterns is ambiguity par silently galat branch le sakte hain. **Fix:** Presence ke liye `map.has(key)` use karo, aur default chahiye toh `map.get(k) ?? 0` likho — `??` sirf `null`/`undefined` par fire karta hai, `0` ya `''` par nahi (jabki `||` unpar bhi fire karta hai, jo counting code mein classic bug hai).
- **Wrong assumption:** Frequency counting ke liye plain object `{}` Map jitna safe hai. **Why it breaks:** Object keys strings mein coerce hote hain, so `1` aur `'1'` collide karte hain aur `obj[{a:1}]` sab objects ke liye `'[object Object]'` ban jaata hai. Aur inherited prototype keys hazard hain: `counts['constructor']` ek function return karta hai, `counts['toString']` bhi — `if (counts[word])` truthy nikal aata hai bina kisi count ke. **Fix:** `Map` use karo (arbitrary key types, no prototype chain), ya `Object.create(null)` se prototype-less object banao.
- **Wrong assumption:** Do objects jinki properties same hain woh ek hi Map key hain. **Why it breaks:** JavaScript `Map`/`Set` objects ko **identity** se compare karte hain, structural equality se nahi. `new Set([{id:1}, {id:1}]).size === 2` hai, aur `map.get({id:1})` hamesha `undefined` dega chahe `map.set({id:1}, x)` kiya ho. **Fix:** Ek canonical string/primitive key derive karo (`${id}:${type}`), ya value-based key ke liye stable serialization use karo (aur key order ka determinism ensure karo — `JSON.stringify` property insertion order follow karta hai, so `{a:1,b:2}` aur `{b:2,a:1}` alag strings dete hain).
- **Wrong assumption:** Hash map operations O(1) hain, period. **Why it breaks:** Yeh **expected** cost hai good hash distribution ke under. Adversarial input (attacker jo jaan-boojh kar colliding keys bheje) sab entries ko ek bucket mein daal kar har operation O(n) bana sakta hai — yeh ek real, exploited DoS class hai jo web frameworks ke query-parameter parsing ko target karti thi. Aur long string keys ka hash compute karna key length ke proportional hai, constant nahi. **Fix:** "Expected O(1) assuming good distribution" bolo. Untrusted keys par randomized/seeded hashing wali runtime ya library par rely karo, aur key count par limit lagao.
- **Wrong assumption:** Map par iterate karte hue usme entries delete/add karna safe hai. **Why it breaks:** JavaScript `Map` iteration mein iterate ke dauran add ki gayi entries **visit ho jaati hain** (spec live iteration define karta hai), so ek loop jo har entry ke liye naya entry add kare woh infinite chal sakta hai. Aur dusri languages mein (Java) yeh `ConcurrentModificationException` throw karta hai. **Fix:** Pehle keys snapshot lo (`[...map.keys()]`), phir modify karo; ya changes ko ek separate list mein collect karke loop ke baad apply karo.
- **Wrong assumption:** Set kaafi hai kyunki hume "elements compare" karne hain. **Why it breaks:** Set multiplicity discard karta hai. `aab` aur `abb` ke distinct characters identical hain lekin woh anagrams nahi hain; `[1,1,2]` aur `[1,2,2]` ka set same hai lekin multisets alag. **Fix:** Pehle decide karo ki problem **existence** ki hai ya **count** ki. Existence → Set; multiplicity → Map with counts. Yeh distinction interview mein aksar pehla filter hota hai.

## Where this shows up in real systems

Caching hash maps ka sabse visible production use hai: application-level caches, CDN edge caches, Redis (jo literally ek hash table server hai), aur database buffer pools. LRU eviction ka hash-map + doubly-linked-list design wahan literally implement hota hai, aur uske variants (LFU, ARC, Redis ka approximated LRU jo memory bachane ke liye sampling use karta hai) same trade-off space mein baithe hain.

Deduplication aur idempotency: payment aur messaging systems "yeh request pehle process ho chuki hai?" ko ek idempotency-key lookup se answer karte hain. Yahan canonical key design production-critical hai — key mein woh sab hona chahiye jo result ko determine karta ho, warna do alag requests ek dusre ka cached result le lengi. Aur in-memory map durable nahi hai: process restart par dedup state gayab, isliye yeh state database ya Redis mein rakhi jaati hai.

Distributed systems mein **consistent hashing** keys ko nodes par map karta hai is tarah ki node add/remove hone par sirf ek chhota fraction keys move ho — plain `hash % nodeCount` par ek node add karte hi lagbhag saari keys remap ho jaati hain, jo poore cache ko invalidate kar deta hai. Database indexes mein hash index equality lookups ke liye fast hai lekin range queries support nahi karta — isiliye default index B-tree hota hai (chapter 07 dekho). Aur content-addressed storage (Git objects, container image layers) hashing ka ek alag use hai: hash **identity** hi ban jaata hai, jahan collision resistance cryptographic requirement hai, sirf distribution nahi.

## Practice and answer

**Prompt:** `map.get(key)` undefined aaya. Kya key definitely absent hai?

**Answer:** Nahi; stored value khud undefined ho sakti hai. Presence distinguish karne ke liye `map.has(key)` use karo.

**Prompt:** Mutable object ko Map key banane ke baad uski property change ki. Key lookup lose ho jayega?

**Answer:** JavaScript Map object identity compare karta hai, so same object reference se lookup available rahega. Ye Java HashMap mein mutable equality/hash fields ke hazard se different behavior hai.

**Prompt:** `groupAnagrams` mein count-vector key ko `counts.join('')` se banaya. Kaunsa input break karega?

**Answer:** Koi bhi do words jinke counts multi-digit ho jaayein aur concatenation ambiguous ho — jaise counts `[1, 11, 0, …]` aur `[11, 1, 0, …]` dono `"111000…"` dete hain. Do alag multisets ek hi bucket mein chale jaate hain aur output galat groups deta hai. Fix delimiter hai (`join('#')`), ya fixed-width encoding. Yeh general serialization rule hai: variable-length fields ko concatenate karne se pehle unambiguous separator ya length prefix chahiye.

**Prompt:** Two Sum ko O(1) extra space mein solve karna hai. Kya badalna padega?

**Answer:** Hash map hata kar sorted array par two pointers use karne padenge — O(n log n) time (sorting) aur O(1) auxiliary space (agar in-place sort allowed hai). Lekin tab **original indices lose ho jaati hain**, so agar problem indices maangti hai toh values ke saath indices carry karni padengi, jo phir O(n) space le aata hai. Iska matlab yeh hai: O(1) space aur original indices ek saath generally possible nahi — yeh constraint conflict interviewer ke saath explicitly surface karna sahi jawab hai.

**Prompt:** Ek service untrusted user se JSON object leti hai aur uske keys ko ek map mein daalti hai. Kya risk hai?

**Answer:** Hash collision denial of service. Attacker aise thousands of keys bhej sakta hai jo same bucket par hash hoti hain, jisse har insert O(n) ho jaata hai aur n keys ka total O(n²) — ek chhoti payload se CPU exhaust. Yeh known exploited vulnerability class hai. Mitigations: seeded/randomized hashing wali runtime, incoming key count par hard limit, request body size limit, aur worst-case ke liye tree-based fallback (Java 8+ HashMap bade buckets ko balanced tree mein convert karta hai). Yeh dikhata hai ki "expected O(1)" ek assumption hai, guarantee nahi.

**Prompt:** LRU cache ke liye hash map + doubly linked list kyun, sirf hash map kyun nahi?

**Answer:** Hash map O(1) lookup deta hai lekin recency ordering nahi rakhta — "sabse purana kaunsa hai" answer karne ke liye poora map scan karna padega (O(n) per eviction). Doubly linked list ordering rakhti hai aur **held node reference** par O(1) removal/move-to-front deti hai, lekin usme key se node dhoondhna O(n) hai. Dono milkar donon operations O(1) karte hain: map se node reference milta hai, list se ordering. Yeh "ek access pattern par ek structure, dono ko sync mein rakho" wala general design pattern hai.

## Research notes: Expected and amortized are different guarantees

Doubling capacity spreads resizing work across many inserts: copied capacities form a geometric sum. Growing by one can repeatedly copy almost the entire structure.

Amortized cost concerns a sequence of operations. Expected hashing cost depends on assumptions about hash distribution. “Always O(1)” removes both qualifications.

Trace eight insertions with capacities 1, 2, 4, 8; list copy counts. Compare growth through every integer capacity.

**Interview check:** Can one insertion be linear despite constant amortized insertion?

**Answer:** Yes. One resize may copy the contents, while total resizing work across geometric growth is linear in the number of inserts. Amortized cost does not bound individual-operation latency.

**Practice:** Explain why separate shrink and grow thresholds prevent resize thrashing.

[Read the source — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Find the first repeated value in `[4,2,4,2]` while scanning left to right. Why must you test membership before insertion?

> **Hint:** The first duplicate encountered is determined by scan order.

**Answer guide — compare after attempting:** Keep a Set; check each value, then add unseen values. Return 4 at the third item. Empty and all-distinct inputs return the chosen no-duplicate result. Expected time is O(n), extra space O(n); specify equality semantics for nonprimitive inputs.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Source check

[ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects) access guarantees aur equality define karta hai. [Princeton's hash tables chapter](https://algs4.cs.princeton.edu/34hash/) collision strategies aur load-factor analysis explain karta hai.
