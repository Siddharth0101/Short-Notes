---
id: dsa-searching
title: Searching and binary search boundaries
track: dsa
order: 5
level: Intermediate
minutes: 31
summary: Search sorted data and monotone answer spaces without boundary bugs.
tags: linear-search, binary-search, lower-bound, strings
visual: binary-search
---

## Mental model

Linear search har candidate check karta hai. Binary search prove karta hai ki remaining candidates ka poora half discard ho sakta hai. Is proof ke liye sorted data ya monotone predicate chahiye. Arbitrary unsorted input par binary search chalana correctness bug hai, sirf performance issue nahi.

## A reusable lower bound

`lowerBound` first index return karta hai jahan value target se greater ya equal hai. Aisi value na ho toh `values.length` insertion position return hoti hai. Half-open interval `[left, right)` use karke boundaries consistent rakho.

```js
function lowerBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function binarySearch(values, target) {
  const index = lowerBound(values, target);
  return index < values.length && values[index] === target ? index : -1;
}
```

Invariant: left se pehle ke indices target se chhote hain; right se onward indices target se greater/equal hain. Har iteration unknown interval reduce karti hai. Termination par `left === right`, isliye yahi first feasible position hai. Constant-time indexed access assume karke O(log n) time aur O(1) auxiliary space hai.

`[1, 3, 3, 3, 8]` mein target 3 ke liye first mid 2 hai, so right 2 banega; phir 1; phir index 0 ki value left ko 1 karegi. Answer index 1 hai, arbitrary duplicate nahi. Inclusive exact-search variant alag invariant use karta hai; updates dono variants ke mix mat karo.

### Upper bound and the range of equals

`upperBound` first index deta hai jahan value target se **strictly greater** hai. Sirf ek comparison change hoti hai:

```js
function upperBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] <= target) left = mid + 1;   // <= instead of <
    else right = mid;
  }
  return left;
}

// Duplicates count without scanning:
const count = upperBound(values, t) - lowerBound(values, t); // O(log n)
// Full equal range as a half-open interval:
const range = [lowerBound(values, t), upperBound(values, t)];
```

Dono functions ka **shape identical** hai — same half-open interval, same loop condition, same mid formula, same `left = mid + 1` / `right = mid` updates. Sirf predicate badalta hai. Isliye yeh dono ko ek generic form mein sochna sabse safe habit hai:

> "Array ko ek boolean sequence samjho: `false false false true true true`. Binary search **first `true`** ka index dhoondhti hai."

`lowerBound` ke liye predicate hai `values[i] >= target`; `upperBound` ke liye `values[i] > target`. Feasibility problems ke liye predicate `isFeasible(candidate)` hota hai. Ek hi template yaad rakhna aur sirf predicate badalna boundary bugs ko drastically kam karta hai — versus har variant ke liye alag `left <= right` / `right = mid - 1` combination yaad karne ki koshish karna.

Ek important precondition: predicate ko **monotone** hona chahiye. Agar sequence `false true false true` hai toh "first true" well-defined nahi hai aur binary search arbitrary result dega, error nahi. Interview mein monotonicity explicitly bolo — yahi woh statement hai jo algorithm ko justify karta hai.

## Search a monotone answer space

Packages ko original order mein D days ke andar ship karna hai. Chosen capacity ke liye greedily har day fill karo jab tak next package capacity exceed nahi karega. Ek capacity feasible hai toh saari larger capacities bhi feasible hain. Largest single weight se total weight tak first feasible capacity search karo.

Har feasibility check O(n) hai, so integer capacity range R par O(n log R) time milta hai. Binary search yahan packages sorted hone ki wajah se nahi, feasibility monotone hone ki wajah se work karta hai. Packages sort karna original order constraint violate karega.

```js
function shipWithinDays(weights, days) {
  // Brute force: har capacity ko max weight se total tak try karo -> O(n * totalWeight).
  // Bottleneck: feasibility monotone hai, phir bhi hum linearly scan kar rahe hain.
  const canShip = (capacity) => {
    let usedDays = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > capacity) { usedDays++; load = 0; } // naya din shuru
      load += w;
    }
    return usedDays <= days;
  };

  let left = Math.max(...weights);        // koi package split nahi ho sakta
  let right = weights.reduce((s, w) => s + w, 0); // sab ek hi din mein
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canShip(mid)) right = mid;        // feasible: yeh ya isse chhota answer
    else left = mid + 1;                  // infeasible: strictly bada chahiye
  }
  return left;
}
```

Teen cheezein yahan deliberately set ki gayi hain aur interview mein inhe justify karna padta hai.

**Search bounds.** `left` ko 1 se start karna galat nahi hai lekin loose hai; `Math.max(...weights)` se chhoti koi capacity feasible ho hi nahi sakti, kyunki ek package ko todha nahi ja sakta. `right` ko total weight rakhna guarantee karta hai ki kam se kam ek feasible candidate range mein hai — yeh binary search ke liye essential hai, warna loop ek infeasible value return kar dega.

**Monotonicity proof.** Agar capacity `c` feasible hai, toh `c + 1` bhi feasible hai — same day-grouping abhi bhi valid hai. Isliye feasibility sequence `false…false true…true` hai aur "first true" well-defined hai. Yeh proof kiye bina binary search likhna guesswork hai.

**Greedy inner check.** `canShip` greedy hai: jitna load ho sakta hai daalo, phir naya din. Yeh optimal isliye hai ki kisi package ko jaan-boojh kar agle din shift karne se current day ki capacity waste hoti hai aur remaining days kabhi kam nahi hote — exchange argument. Inner check khud ek greedy correctness proof maangta hai, aur strong candidates usse alag se state karte hain.

Complexity: `canShip` O(n), aur range ki width R = total − max par log R iterations. Total O(n log R). Note karo ki yeh **log of the answer range** hai, `log n` nahi — "binary search hai so O(log n)" bolna yahan galat hai. Space O(1).

### When O(n log n) beats O(n)

Binary search ka ek non-obvious use hai: kabhi kabhi log factor accept karna better engineering hai. Agar tumhe ek array par **many** membership queries chalani hain, toh options hain — har query O(n) linear scan (total O(qn)), ya ek baar sort O(n log n) + per query O(log n) (total O(n log n + q log n)), ya hash set O(n) build + O(1) per query (total O(n + q) expected).

Hash set asymptotically best hai, phir bhi sorted array + binary search real systems mein aksar jeet jaata hai: memory contiguous hai (better cache behavior), koi hash collision worst case nahi, order-based queries (range, predecessor, successor, k-th) bhi free mil jaati hain, aur data immutable ho toh serialize/mmap karna trivial hai. Hash set sirf equality queries de sakta hai. Yahi reason hai ki database indexes B-trees par bane hain, hash tables par nahi — range scans ke bina index adhoora hai.

## String searching

Text length n aur pattern length m ke liye naive matching har possible starting position try karta hai, aur up to m characters compare karta hai: worst O(nm) time, indexed code-unit comparison mein O(1) extra space.

KMP longest-prefix-suffix table preprocess karke partial matches ka work reuse karta hai: O(n + m) time aur O(m) space. JavaScript string indices UTF-16 code units hain; user-perceived character multiple units ka ho sakta hai. Requirements mein Unicode semantics clarify karo.

## Rotated sorted array: half the array is always sorted

Sorted array ko unknown pivot par rotate kiya gaya hai (`[4,5,6,7,0,1,2]`). Global sortedness gayi, lekin ek **local invariant** bacha hai jo binary search ko zinda rakhta hai.

```js
function searchRotated(values, target) {
  let left = 0;
  let right = values.length - 1;   // inclusive interval — deliberate choice
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] === target) return mid;

    if (values[left] <= values[mid]) {
      // Left half [left, mid] definitely sorted hai.
      if (values[left] <= target && target < values[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      // Warna right half [mid, right] definitely sorted hai.
      if (values[mid] < target && target <= values[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}
```

Key insight: kisi bhi `mid` par **kam se kam ek half sorted hota hai** (dono ho sakte hain, lekin dono un-sorted nahi ho sakte). Sorted half mein range check O(1) mein bata deta hai ki target wahan ho sakta hai ya nahi — aur nahi ho sakta toh poora half discard. Yeh wahi "half discard karne ka proof" hai, bas local sortedness se derive kiya gaya.

`values[left] <= values[mid]` mein `<=` (not `<`) zaroori hai: jab interval mein sirf do elements hon toh `left === mid` ho sakta hai, aur strict `<` us case ko galat branch mein bhej deta hai.

Complexity O(log n) time, O(1) space — **distinct values ke saath**. Duplicates allow ho toh yeh bound tootta hai: `[1,1,1,0,1,1]` mein `values[left] === values[mid] === values[right]` hai aur kisi half ko discard karne ka koi valid argument nahi bachta. Standard fix hai us case mein `left++; right--;` karna, jo worst case O(n) le jaata hai. Interview mein duplicates ke baare mein poochna aur yeh degradation batana strong signal hai.

Yahan inclusive `[left, right]` interval jaan-boojh kar use kiya hai kyunki hum exact match dhoondh rahe hain, insertion position nahi. Do styles mix mat karo — ek problem mein ek hi convention rakho aur usse consistently follow karo.

## Common mistakes

- Inclusive `right = n - 1` ko half-open updates ke saath mix karna.
- `mid === left` par `left = mid` likhna; interval shrink nahi hoga aur infinite loop ho sakta hai.
- Lower-bound result par equality check kiye bina exact match claim karna.
- Fresh input sort karne ka cost ignore karke overall O(log n) bolna.
- Bitwise midpoint arithmetic se JavaScript values ko signed 32-bit integers mein truncate karna.

In failure modes ko detail mein dekho, kyunki har ek ka signature interview mein alag dikhta hai:

- **Wrong assumption:** `mid = Math.floor((left + right) / 2)` hamesha safe hai. **Why it breaks:** Bade indices ya values par `left + right` overflow kar sakta hai — JavaScript numbers mein yeh `Number.MAX_SAFE_INTEGER` ke aage precision loss hai, aur Java/C++ mein classic 32-bit integer overflow (yeh bug JDK ke binary search mein years tak tha). Log-ranges par binary search karte waqt (jaise `0` se `10^15` ka answer space) yeh real risk hai. **Fix:** `left + Math.floor((right - left) / 2)` likho — yeh difference par kaam karta hai, sum par nahi. Aur `(left + right) >> 1` se bilkul bacho: bitwise operators JavaScript values ko signed 32-bit mein truncate karte hain, so 2³¹ se bade indices silently corrupt ho jaate hain.
- **Wrong assumption:** Loop condition `left < right` aur `left <= right` interchangeable hain, bas ek extra iteration ka farak hai. **Why it breaks:** Yeh dono alag invariants belong karte hain. `left < right` half-open `[left, right)` ke saath chalta hai jahan `right` kabhi candidate nahi hota aur termination par `left === right` hi answer hai. `left <= right` inclusive `[left, right]` ke saath chalta hai jahan `right` bhi candidate hai aur termination par `left > right` (no match) hota hai. Ek convention ka loop condition doosre ke updates ke saath milane par ya toh answer miss hota hai ya infinite loop. **Fix:** Pehle interval convention likho (comment mein), phir uske corresponding condition aur dono updates; aadha-aadha mix mat karo.
- **Wrong assumption:** Binary search sirf sorted arrays par lagti hai. **Why it breaks:** Yeh under-application hai — real requirement **monotone predicate** hai. "Minimum capacity jo feasible ho", "maximum speed jo deadline meet kare", "first bad version" — inme koi sorted array nahi hai, phir bhi binary search perfectly applicable hai. Is insight ke bina candidate O(n log R) solution ko O(n · R) brute force chhod deta hai. **Fix:** Har optimization problem par poocho: "kya answer ke upar ya neeche sab feasible/infeasible hai?" Haan toh answer space par binary search karo.
- **Wrong assumption:** Sorted array mein binary search kar raha hoon, so complexity O(log n) hai. **Why it breaks:** Agar array tumne khud sort kiya hai toh dominant term O(n log n) hai — binary search ka log usme gum ho jaata hai. Aur single lookup ke liye sort karna hamesha loss hai (O(n) linear scan sasta hai). Sorting tab hi paisa vasool hai jab multiple queries amortize karein. **Fix:** Total cost report karo: "sort O(n log n) once, phir har query O(log n); q queries par O((n + q) log n)". Ek query ho toh linear scan defend karo.
- **Wrong assumption:** Floating-point answer space par bhi `while (left < right)` chalega. **Why it breaks:** Reals par "next candidate" jaisi koi cheez nahi hai; `left` aur `right` kabhi exactly equal nahi honge aur loop hang kar jaayega, ya floating rounding ke kaaran non-deterministically exit karega. **Fix:** Fixed iteration count use karo (`for (let i = 0; i < 100; i++)` — har iteration interval half karti hai, 100 iterations kisi bhi practical precision ke liye kaafi zyada hain) ya explicit epsilon tolerance (`while (right - left > 1e-9)`). Required precision ko problem contract ka part banao.

## Where this shows up in real systems

Database indexes binary search ka sabse bada production deployment hain. B-tree ek high-fanout generalization hai: har node mein hazaaron sorted keys hoti hain, aur ek node ke andar binary search chalti hai. Fanout isliye bada rakha jaata hai kyunki disk/SSD read ki cost per-node fixed hai — teen-chaar levels mein billions of rows tak pahunch jaate hain. Yehi reason hai ki B-tree index range queries (`WHERE created_at BETWEEN …`) aur `ORDER BY` support karta hai jabki hash index nahi.

Feasibility-space binary search operations mein bhi dikhta hai: "minimum instance count jo p99 latency SLO meet kare", "largest batch size jo memory limit ke andar fit ho", "first commit jisme bug aaya" — `git bisect` literally binary search hai ek monotone predicate (`commit is broken`) par, aur uski correctness usi monotonicity assumption par tikki hai. Agar bug intermittent hai toh predicate monotone nahi rehta aur bisect galat commit blame karta hai — theory ka direct practical consequence.

Version rollouts aur capacity autoscaling mein bhi yehi shape hai. Aur distributed systems mein consistent-hashing rings par node lookup ek `lowerBound` hi hota hai: hash value ke liye ring mein first node `>= hash` dhoondhna, wrap-around ke saath.

## Practice and answer

**Prompt:** Sorted array mein target ke duplicates count karne hain, scan kiye bina kaise?

**Answer:** First index `>= target` aur first index `> target` find karke subtract karo. Dono O(log n) hain. Upper bound mein `values[mid] <= target` hone par left aage move karta hai.

**Prompt:** `([], 4)` aur `([1,2], 4)` ke lower-bound results?

**Answer:** 0 aur 2. Insertion position return karna intentional hai; exact search missing match ko −1 mein convert karta hai.

**Prompt:** Binary search loop hang kar raha hai. Sabse pehle kya check karoge?

**Answer:** Yeh check karo ki har iteration mein interval **strictly** shrink ho raha hai. Classic culprit `left = mid` hai jab `mid === left` ho sakta hai (jo do-element interval mein floor division se hota hai). Half-open template mein updates hamesha `left = mid + 1` aur `right = mid` hone chahiye — dono mein se kam se kam ek boundary ko `mid` cross karna chahiye. Doosra check: loop condition aur interval convention match kar rahe hain ya nahi.

**Prompt:** Ek sorted array mein ek hi lookup karna hai. Kya binary search hamesha linear scan se better hai?

**Answer:** Asymptotically haan, practically hamesha nahi. Chhote n (roughly dozens of elements) par linear scan ka sequential memory access aur branch prediction binary search ke unpredictable jumps se tez ho sakta hai. Isiliye real library implementations chhote ranges par linear scan par fall back karti hain. Interview answer: "O(log n) asymptotically better hai, lekin chhote n par constant factors aur cache behavior linear scan ko jeeta sakte hain" — yeh nuance samajhne ka signal deta hai.

**Prompt:** `searchRotated` ko duplicates wale array par chalaya toh complexity kya ho jaati hai, aur kyun?

**Answer:** Worst case O(n). Jab `values[left] === values[mid] === values[right]` ho (jaise `[1,1,1,0,1]`), toh yeh decide karne ka koi O(1) tarika nahi hai ki pivot kis taraf hai — dono halves consistent dikhte hain. Kisi half ko discard karne ka proof hi unavailable hai, so `left++; right--;` karke ek-ek element shrink karna padta hai. Discard step ka justification hi binary search ka core hai; woh gaya toh log bound bhi gaya.

**Prompt:** "First bad version" problem mein API call expensive hai. Kaunsi cheez complexity se zyada matter karti hai?

**Answer:** **Calls ki count**, jo exactly O(log n) hai — aur wahi optimize karna hai, per-call constant nahi. Yahan linear scan O(n) API calls karega, jo latency aur rate limits ki wajah se practically unusable hai. Yeh ek accha example hai jahan cost model "operations" nahi, "expensive external calls" hai; complexity analysis ke liye sahi unit choose karna answer ka hissa hai.

## Source check

[Princeton binary search](https://algs4.cs.princeton.edu/11model/BinarySearch.java.html) aur [substring search](https://algs4.cs.princeton.edu/53substring/) reference algorithms provide karte hain. Half-open lower-bound example original variant hai.
