---
id: dsa-sorting
title: Sorting from elementary methods to divide and conquer
track: dsa
order: 7
level: Intermediate
minutes: 40
summary: Compare bubble, selection, insertion, merge, quick, heap, and radix sorting with explicit tradeoffs.
tags: sorting, merge-sort, quick-sort, radix-sort, stability
visual: sorting
---

## Mental model

Sorting ek order establish karti hai jisse duplicate grouping, interval scanning aur binary search easy ho jaate hain. Algorithm ko comparisons, moves, memory, stability aur key assumptions se judge karo. **Stable** ka matlab equal-key records ka original relative order preserve hona hai.

> **Core takeaway:** Stability preserves the input order of items with equal sort keys.

## Choosing an algorithm

| Algorithm | Best | Average or expected | Worst | Typical auxiliary space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble with early exit | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Randomized quicksort | O(n log n) | O(n log n) expected | O(n²) | O(log n) expected stack, O(n) worst | No |
| Heap | O(n) possible with all equal keys | O(n log n) | O(n log n) | O(1) iterative | No |
| LSD radix | O(d(n + b)) | O(d(n + b)) | O(d(n + b)) | O(n + b) | Stable digit passes required |

Yahan d digit count aur b radix hai. Radix key representation par depend karta hai; universal linear-time comparison sort nahi hai. Table usual implementations ke liye hai; aapke code ki allocations separately count karo.

Bubble out-of-order neighbors swap karta hai. Selection smallest remaining item ko next position par rakhta hai. Insertion already-sorted prefix mein next item insert karne ke liye larger values right shift karta hai. Small ya nearly sorted data par insertion useful ho sakta hai.

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

In-place core O(1) space use karta hai, lekin yeh wrapper input copy karta hai, so actual additional space O(n) hai. `>` use karne se equal values ek doosre ko cross nahi karti; `>=` stability change kar sakta hai.

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

Har level O(n) values merge karta hai aur O(log n) levels hain. Peak live auxiliary memory O(n), recursion depth O(log n), aur entire run ka total allocation O(n log n) ho sakta hai. Peak retained memory aur cumulative allocation alag metrics hain. Ties par left se select karna stability preserve karta hai.

Stability wali line ko slow down karke dekho. `output.push(left[i] <= right[j] ? left[i++] : right[j++])` mein `<=` ka matlab hai: tie par **left half wala element pehle** jaata hai. Left half original array mein pehle tha, isliye equal elements ka relative order preserve rehta hai. Sirf `<` likh do toh tie par right wala pehle jayega aur merge sort ki stability chali jayegi — ek character ka change, aur ek documented property gayab. Yeh interview mein "kya tumne sirf code yaad kiya ya samjha" ka clean test hai.

### An allocation-free merge sort

Upar wala version `slice` se copies banata hai, jo padhne mein easy hai lekin har level par fresh arrays allocate karta hai. Production-style version ek hi auxiliary buffer reuse karta hai aur index ranges par kaam karta hai:

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

Yahan peak auxiliary memory O(n) hai aur **total allocation bhi O(n)** — `slice` wala version cumulatively O(n log n) memory allocate karta tha, jo GC pressure banta hai. Asymptotic time dono ka O(n log n) hai, lekin real runtime mein yeh farak bada hota hai.

`a[mid - 1] <= a[mid]` wala check ek chhota lekin powerful optimization hai: agar left half ka last element right half ke first se bada nahi hai toh dono halves already merged order mein hain. Already-sorted input par yeh merge sort ko **O(n log n) se O(n) tak** le aata hai (recursion abhi bhi chalti hai lekin koi merge nahi hota). Real-world data aksar partially sorted hoti hai, isliye production sorts is tarah ke "run detection" par heavily depend karte hain — Timsort ka poora design hi existing sorted runs dhoondhne par based hai.

## Quicksort in detail

Merge sort predictable hai; quicksort average par tez hai kyunki woh in-place partition karta hai aur cache-friendly sequential access karta hai. Lekin uski correctness aur complexity dono pivot choice par tikki hain.

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

Partition ka invariant precisely yeh hai: loop ke har point par `a[lo..boundary-1]` mein sab pivot se `<=` hain, aur `a[boundary..i-1]` mein sab pivot se bade hain. Loop ke end mein pivot ko `boundary` par swap karne se woh apni **final sorted position** par aa jaata hai — isiliye recursion usse exclude karti hai aur progress guaranteed hai.

**Pivot choice hi worst case decide karti hai.** Fixed last-element pivot already-sorted array par har baar size-0 aur size-(n−1) partitions deta hai: `T(n) = T(n−1) + O(n)` → O(n²), aur recursion depth O(n) (stack overflow bhi). Yeh koi theoretical corner case nahi — already-sorted input sabse common real input hai. Randomization se expected time O(n log n) ho jaata hai aur koi *fixed* input adversarial nahi reh jaata (randomness ka source predictable ho toh yeh guarantee bhi kamzor hoti hai).

**Tail-call style recursion** (chhoti side recurse, badi side loop) auxiliary stack ko O(log n) tak bound karta hai worst case mein bhi, kyunki har recursive call array ko kam se kam aadha karti hai. Naive dono-side recursion worst case O(n) stack le sakti hai.

### Three-way partition for duplicate-heavy input

Agar array mein bahut saare equal elements hain (jaise flags, categories, boolean-ish data), standard quicksort unhe baar-baar partition karta rehta hai. Dutch national flag partition ek pass mein teen regions banata hai:

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

`gt` wale branch mein `i++` **nahi** hota, kyunki `gt` se aaya hua element abhi examine nahi hua hai — yeh classic bug hai. Distinct values ki count k ho toh yeh O(n log k) time deta hai: sirf k distinct values wali array (jaise ek million rows jinme 3 status values hain) par yeh standard quicksort ke O(n log n) se significantly tez hai.

### Quickselect: the same partition, without full sorting

Agar sirf k-th smallest element chahiye, poora sort karna zaroori nahi. Partition ke baad pivot ki final position pata hai, so sirf **ek** side mein recurse karo:

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

Expected time O(n): `n + n/2 + n/4 + … = 2n` — geometric series, isliye poora sorting ka log factor gayab ho jaata hai. Worst case O(n²) (bad pivots), aur auxiliary space O(1) is iterative form mein.

Yeh ek important interview point hai: "k-th largest" dekh kar turant sort (O(n log n)) ya heap (O(n log k)) bolna common hai, lekin quickselect expected O(n) deta hai. Tradeoff yeh hai ki quickselect input mutate karta hai, worst case quadratic hai, aur streaming data par kaam nahi karta (poora array chahiye) — jabki size-k heap ek stream par bhi chalta hai. Constraints se choose karo, reflex se nahi.

## Quicksort and radix details

Quicksort pivot ke around partition karke dono sides sort karta hai. Consistently extreme pivot O(n²) chain bana sakta hai; randomization expected balance deta hai. Duplicate-heavy input mein three-way partition useful hai. Array-filter version convenient hai, lekin arrays allocate karta hai, so in-place claim mat karo.

LSD radix nonnegative integer keys ko least-significant digit se group karta hai; phir next digit process hoti hai. Har digit pass stable hona chahiye. Negative values, decimals aur strings ko extra representation rules chahiye. Number integer precision lose hone ke baad digit extraction bhi unreliable ho sakti hai.

Radix ka har pass stable **hona hi chahiye** — yeh optional nahi hai. LSD radix ka poora argument yeh hai ki jab tum digit `d` par sort karte ho, tab digits `0..d-1` ka order pehle se correct hai aur stability usse preserve karti hai. Ek bhi unstable pass lower digits ka kaam mita deta hai aur final output galat aata hai.

Aur "radix linear hai" wala claim apne assumptions ke saath quote karo: O(d(n + b)) mein `d` key ki digit count hai, jo key universe ke saath badhta hai. n distinct keys ko represent karne ke liye kam se kam log n bits chahiye, so bade universes par `d` khud log n ke order ka ho jaata hai aur "linear" advantage gayab ho jaata hai. Radix tab jeetta hai jab keys **fixed, chhoti width** ki hon (32-bit integers, fixed-length IDs, dates) — universal comparison-sort replacement nahi hai.

## Counting inversions: sorting as a measurement tool

Sorting sirf order banane ke liye nahi hai — merge step khud ek counting mechanism hai. "Kitne pairs `(i, j)` hain jahan `i < j` lekin `a[i] > a[j]`" ka brute force O(n²) hai; merge sort usse O(n log n) mein karta hai:

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

`count += mid - i` hi poora trick hai: dono halves sorted hain, isliye jab right ka element left ke `a[i]` se chhota nikalta hai toh woh left ke **saare** remaining elements (`a[i..mid-1]`) ke saath inversion banata hai — sab ek saath count ho gaye, ek-ek karke nahi.

Yeh pattern "sorting ke dauran extra information accumulate karo" real interviews mein repeat hota hai (count of smaller elements to the right, reverse pairs, range counts). Idea yaad rakho: merge step do sorted sequences ke beech comparisons ko **batch** mein count kar sakta hai.

## JavaScript built-in sorting

`array.sort()` input mutate karta hai aur default string comparison use karta hai. Numeric ascending ke liye `(a, b) => a - b` do. Modern ECMAScript stable sort require karta hai, specific algorithm ya exact time/space nahi. `toSorted()` new sorted array return karta hai where supported. Comparator consistent, reflexive, antisymmetric aur transitive hona chahiye.

```js
[10, 9, 1].sort();                    // [1, 10, 9] — string comparison, not numeric
[10, 9, 1].sort((a, b) => a - b);     // [1, 9, 10]
[10, 9, 1].toSorted((a, b) => a - b); // [1, 9, 10], original array unchanged

// Multi-key comparator: pehle team (ascending), phir score (descending).
const byTeamThenScore = (x, y) =>
  x.team.localeCompare(y.team) || y.score - x.score;
```

`||` chaining yahan idiomatic hai: pehla non-zero comparison result jeetta hai, tie par agla key evaluate hota hai. Yeh "stable sort ka use karke do baar sort karo" wale approach se zyada explicit hai aur ek hi pass mein kaam karta hai.

Comparator contract violate karna real hazard hai. Ek comparator jo `true`/`false` return karta hai (`(a, b) => a > b`) galat hai — sort ko negative/zero/positive chahiye, aur `false` (0) "equal" ka matlab rakhta hai, so ordering silently corrupt hoti hai. Non-transitive comparator (jaise floating epsilon-based equality) implementation-defined garbage output de sakta hai — spec sirf yeh kehti hai ki aisi comparator ke saath result implementation-defined hai, crash guaranteed nahi. Isliye bug production mein "kabhi kabhi order galat" ban kar chhupta hai.

`sort` mutates — yeh React state, shared config objects aur frozen data ke saath real bug source hai. `[...arr].sort(cmp)` ya `arr.toSorted(cmp)` use karo jab caller ka array preserve karna ho.

## How production sorts actually work

Koi bhi serious standard library plain textbook algorithm ship nahi karti; sab **hybrid** hain, kyunki har algorithm ki weakness doosre ki strength hai:

| Runtime | Algorithm | Design idea |
| --- | --- | --- |
| V8 (`Array.prototype.sort`) | Timsort | Existing sorted runs detect karo, merge karo; chhote runs par binary insertion sort |
| Java objects (`Arrays.sort`) | Timsort variant | Stability chahiye (objects ki identity matter karti hai) |
| Java primitives | Dual-pivot quicksort | Stability irrelevant hai (equal ints indistinguishable), in-place speed jeetti hai |
| C++ `std::sort` | Introsort | Quicksort; depth limit cross ho toh heapsort par switch — O(n log n) worst case guarantee |

Do lessons yahan interview-worthy hain. Pehla, **primitives ke liye stability matter nahi karti** — do equal integers distinguishable nahi hain — isliye Java primitives par unstable-but-faster quicksort use karta hai aur objects par stable Timsort. Yeh design choice hi stability ki definition clarify kar deti hai.

Doosra, introsort ka fallback ek beautiful engineering pattern hai: quicksort ka average-case speed lo, lekin recursion depth `2 log n` cross karte hi heapsort par switch karke O(n²) worst case ko structurally impossible bana do. Adversarial input se protection randomization se bhi milti hai, lekin introsort worst-case **guarantee** deta hai, probabilistic assurance nahi. Jab latency SLO matter karti ho (p99, real-time systems), guarantee probability se better hai.

## Common mistakes

- **Wrong assumption:** `array.sort()` numbers ko numerically sort karta hai. **Why it breaks:** Bina comparator ke `sort` har element ko string mein convert karke lexicographic compare karta hai, so `[10, 9, 1]` se `[1, 10, 9]` milta hai. Chhote test data (single-digit numbers) par yeh bug dikhta hi nahi, aur production mein do-digit values aate hi surface karta hai. **Fix:** Numbers ke liye hamesha `(a, b) => a - b` do; strings ke liye locale-aware ordering chahiye toh `localeCompare` use karo.
- **Wrong assumption:** Sorting hamesha O(n log n) hai, so radix sort ka O(dn) claim galat hai. **Why it breaks:** O(n log n) lower bound sirf **comparison-based** sorting par apply hota hai — woh decision-tree argument hai (n! possible outputs ko distinguish karne ke liye log(n!) = Ω(n log n) comparisons chahiye). Radix sort comparisons karta hi nahi; woh key ki digit structure exploit karta hai, isliye bound uspar lagu nahi hota. **Fix:** Bound ko uske precondition ke saath quote karo. Aur radix ka apna caveat bolo: d (digit count) key ki bit-width par depend karta hai, aur bade universes par d khud log n ke order ka ho sakta hai.
- **Wrong assumption:** Quicksort ka worst case rare hai, so randomization optional optimization hai. **Why it breaks:** Fixed pivot (first ya last element) ke saath worst case exactly **already-sorted input** hai — jo real data mein sabse common case hai, rarest nahi. Us par O(n²) time aur O(n) recursion depth dono milte hain, so bade arrays par stack overflow bhi. **Fix:** Pivot randomize karo ya median-of-three use karo, aur chhoti partition par recurse karke badi par loop karo taaki stack O(log n) bounded rahe.
- **Wrong assumption:** In-place sorting ka matlab O(1) total memory hai. **Why it breaks:** Recursion stack bhi auxiliary space hai. Quicksort "in-place" hai lekin balanced case mein O(log n) stack aur naive worst case mein O(n) stack leta hai. Aur ek `[...values]` wrapper likh dene se poora in-place claim hi khatam ho jaata hai — O(n) copy ban gayi. **Fix:** "In-place partition, O(log n) recursion stack" bolo. Wrapper copy karte ho toh usse explicitly O(n) auxiliary space mein count karo.
- **Wrong assumption:** Stable sort chahiye toh bas do baar sort kar do — pehle secondary key, phir primary. **Why it breaks:** Yeh technique **sirf stable sort ke saath** kaam karti hai. Unstable sort (jaise Java ka primitive sort, ya koi bhi custom quicksort) doosre pass mein pehle pass ka order todh sakta hai, aur result non-deterministic dikhta hai. **Fix:** Ya toh documented-stable sort use karo (ECMAScript guarantee deta hai), ya ek hi comparator likho jo dono keys handle kare (`a.team.localeCompare(b.team) || b.score - a.score`) — yeh stability par depend hi nahi karta.
- **Wrong assumption:** "K-th largest chahiye" ka best answer sort karke index lena hai. **Why it breaks:** Sort O(n log n) hai jabki quickselect expected O(n) deta hai aur size-k heap O(n log k). Ek single k-th query ke liye poora array sort karna zyada kaam hai. **Fix:** Constraints se choose karo — quickselect (fastest expected, mutates, worst case O(n²)), heap (streaming-friendly, O(n log k)), ya sort (simplest, aur genuinely best jab kai alag k values chahiye ya output vaise bhi sorted chahiye).

## Where this shows up in real systems

Database query planners sorting ko explicitly cost karte hain. `ORDER BY` par agar matching index hai toh sort skip ho jaata hai (index already sorted order deta hai); nahi toh planner memory-based sort ya **external merge sort** choose karta hai jab data RAM mein fit nahi hoti. External merge sort merge sort ka disk version hai: chunks ko memory mein sort karke sorted runs likho, phir k-way merge (heap se) chalao. Yehi reason hai ki merge sort ki "sequential access" property matter karti hai — quicksort ka random access disk par bahut mehenga hai.

Sorting distributed systems mein shuffle stage ka core hai (MapReduce/Spark): reducers ko grouped keys chahiye, jo sort-based grouping se aati hain. Stability wahan bhi relevant hai jab records ke saath ordering metadata carry hoti hai.

Product-level examples bhi wahi tradeoffs dikhate hain: leaderboards ke liye top-k heap (poora sort nahi), log analysis mein timestamps ke saath tie-break ke liye stable multi-key comparator, aur "sabse zyada latency wale 10 endpoints" jaisa dashboard query jo quickselect-style partial selection se sasta ho jaata hai. Aur ek practical safety note — untrusted input se hash tables par adversarial collision attacks jitni known hain, utni hi known unstable/quadratic sorting par bhi hain; isliye introsort jaise worst-case-guaranteed hybrids production mein prefer kiye jaate hain.

## Practice and answer

**Prompt:** Selection sort equal records ka order kaise change kar sakta hai?

**Answer:** `[(2,A),(2,B),(1,C)]` mein direct minimum swap se `[(1,C),(2,B),(2,A)]` milta hai. Equal-key A aur B reverse ho gaye.

**Prompt:** Pehle name, phir stable team sort karne se team ke andar name order kyun bachta hai?

**Answer:** Equal-team records ka existing relative order preserve hota hai. Alternative mein explicit name tie-breaker wala comparator use karo.

**Prompt:** Merge step mein `<=` ko `<` kar do. Kaunsi property tootegi aur kaunsi bachi rahegi?

**Answer:** Output abhi bhi correctly sorted hoga — correctness intact hai. Lekin stability chali jayegi: tie par right half ka element pehle place hoga, jo equal elements ka original relative order reverse kar deta hai. Yeh ek clean example hai ki stability correctness se alag property hai, aur ek character se decide hoti hai.

**Prompt:** Ek million rows hain jinme `status` sirf `pending`/`active`/`closed` ho sakta hai. Standard quicksort kyun waste hai?

**Answer:** Standard two-way partition equal elements ko baar-baar recursively partition karta rehta hai, so O(n log n) comparisons lagte hain jabki sirf 3 distinct values hain. Three-way (Dutch national flag) partition equal region ko ek hi pass mein final jagah par rakh deta hai aur recursion usse skip karti hai: O(n log k) time jahan k = 3, effectively O(n). Duplicate-heavy data par yeh bada practical farak hai. Alternatively counting sort bhi yahan O(n) mein kaam kar deta hai kyunki key universe tiny hai.

**Prompt:** Interviewer kehta hai "quickselect O(n) hai, heap O(n log k) hai, so hamesha quickselect use karo." Kya jawab doge?

**Answer:** Quickselect expected O(n) hai, worst case O(n²), input mutate karta hai, aur poore array ko memory mein maangta hai. Size-k min-heap streaming input par chalta hai (data ek baar se guzre, saari memory mein na ho), O(k) space leta hai jo n ke bade hone par decisive hai, aur uska O(n log k) bound guaranteed hai probabilistic nahi. Ek billion-event stream se top 100 nikalna heap ka case hai; ek in-memory array se median nikalna quickselect ka. Constraints (streaming vs. in-memory, mutation allowed, worst-case guarantee needed) se choose karo.

**Prompt:** `[3, 1, 2].sort((a, b) => a > b)` kya return karega aur kyun?

**Answer:** Comparator boolean return kar raha hai, jo `1`/`0` mein coerce hota hai — negative value kabhi return hi nahi hoti. Sort ke liye "a, b se pehle aata hai" wali information hi missing hai, so behavior implementation-defined hai aur output aksar input jaisa hi (`[3, 1, 2]`) reh jaata hai. Correct comparator `(a, b) => a - b` hai, jo teenon cases (negative, zero, positive) return karta hai.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Records are `(A,2)`, `(B,1)`, `(C,2)` and are sorted by the number. What does a stable sort guarantee, and when does that matter?

> **Hint:** Only equal-key relative order is constrained by stability.

**Answer guide — compare after attempting:** A stable result is `(B,1)`, `(A,2)`, `(C,2)`. A stays before C. This matters when prior order carries meaning, such as earlier sorting by another field. Stability is distinct from runtime complexity and from whether sorting mutates its input.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Source check

[Princeton sorting reference](https://algs4.cs.princeton.edu/cheatsheet/) implementation-specific costs deta hai. [MDN Array sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) mutation, comparator aur stability behavior explain karta hai.
