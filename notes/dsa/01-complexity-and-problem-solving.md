---
id: dsa-complexity
title: Complexity and problem solving
track: dsa
order: 1
level: Foundation
minutes: 30
summary: Complexity batati hai ki input badhne par kitna time aur extra memory lagegi; hidden operations bhi gino.
tags: big-o, complexity, problem-solving, invariants
---

## Mental model — simple soch

Algorithm decisions ka sequence hai jiske saath correctness ka reason bhi hona chahiye. Complexity batati hai ki input badhne par resource use kaise grow karega; exact milliseconds predict nahi karti. Pehle input sizes define karo: `n` elements, `m` characters, ya graph ke `V` vertices aur `E` edges. Har problem ko sirf ek `n` se describe karna useful nahi hota.

Yeh original revision notes hain. Inhe apne course aur existing exercises ke saath use karo. Interview mein code likhne se pehle problem ka contract clear karna answer ka important part hai.

> **Core takeaway:** Complexity batati hai ki input badhne par kitna time aur extra memory lagegi; hidden operations bhi gino.

## The solving loop

1. Output, constraints, duplicates, ordering aur mutation allowed hai ya nahi, clarify karo.
2. Small example manually solve karo; empty aur impossible cases bhi include karo.
3. Optimization se pehle correct brute-force solution explain karo.
4. Repeated work identify karo aur suitable data structure ya invariant choose karo.
5. Small steps mein implement karo, example trace karo, aur time aur auxiliary space separately state karo.

**Invariant** ek statement hai jo har iteration ke baad true rehti hai. Running maximum mein: “index `i` process karne ke baad `best`, indices `0..i` ki largest value hai.” Initialization, preservation aur termination milkar correctness explain karte hain.

```js
function maximum(values) {
  if (values.length === 0) return undefined;
  let best = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > best) best = values[i];
  }
  return best;
}
```

Finite numeric inputs ke liye `n - 1` comparisons hain: O(n) time, O(1) auxiliary space. Ek value return karne ke liye poora input copy nahi karna padta. `NaN` allowed ho toh comparison behavior ka separate contract chahiye.

## Growth and cases

| Growth | Typical example | n double hone ka effect |
| --- | --- | --- |
| O(1) | Usual RAM model mein indexed array read | Proportional growth nahi |
| O(log n) | Binary search | Ek extra halving step |
| O(n) | Full scan | Roughly twice the work |
| O(n log n) | Merge sort | Twice se thoda zyada |
| O(n²) | Har pair compare karna | Roughly four times |
| O(2ⁿ) | All subsets enumerate karna | Subset count square ho jaata hai |

Big O upper bound hai; Θ tight asymptotic bound aur Ω lower bound hai. Worst, average, expected aur amortized cost interchangeable nahi hain. Dynamic-array append amortized O(1) ho sakta hai even though occasional resize O(n) leta hai. Amortization operations ki sequence par cost spread karti hai, random inputs par nahi.

Do sequential loops O(n + m) lete hain. Independent sizes ke nested loops O(nm) ho sakte hain. Search interval halve karna logarithmic hai. Nested syntax automatically quadratic nahi: do monotone pointers agar total n positions each traverse karein toh total movement O(n) hi hai.

## Derive an optimization, don't guess it

Interview mein "O(n) solution yaad hai" bolna weak signal hai. Strong signal yeh hai ki brute force likh ke uska **bottleneck name** karo, phir usse remove karne wala invariant justify karo. Ek chhota example — maximum subarray sum (contiguous, at least one element):

```js
// Step 1: brute force. Har (start, end) pair ka sum recompute karo.
function maxSubarrayBrute(nums) {
  let best = -Infinity;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];          // incremental, so inner body O(1)
      best = Math.max(best, sum);
    }
  }
  return best;
}
```

Yeh already naive O(n³) nahi hai — inner loop sum incrementally maintain kar raha hai, so O(n²) time aur O(1) space. **Bottleneck:** har `start` ke liye poora suffix dobara scan hota hai. Question banta hai: index `end` par kya sach mein har possible start ki zaroorat hai?

```js
// Step 2: identify the invariant. `current` = best sum of a subarray ENDING at i.
function maxSubarray(nums) {
  if (nums.length === 0) return undefined; // contract: empty subarray allowed nahi
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // Either extend the previous best-ending-here, or restart at nums[i].
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
```

Reasoning: agar `current` (previous index par end hone wala best sum) negative hai, toh use extend karna har future subarray ko strictly worse banata hai — usse discard karna safe hai. Yahi "prefix ko discard karna safe hai" wali proof hi optimization ko justify karti hai, `Math.max` ka syntax nahi. O(n) time, O(1) auxiliary space, single pass.

Notice karo ki teenon versions ka **contract same** hai. Optimization ne answer nahi badla, sirf repeated work hataya. Jab optimized version ka answer brute force se alag aane lage, toh bug invariant mein hai — usually ek edge case jise invariant cover nahi karti (yahan: all-negative array, jahan `best = 0` initialize karna galat answer deta hai).

## Amortized analysis is not average case

Dynamic array (JavaScript ka `Array`, Java ka `ArrayList`, C++ ka `vector`) `push` par space khatam hone par naya bada buffer allocate karke sab copy karta hai. Ek individual push worst-case O(n) hai. Phir bhi n pushes ka **total** O(n) hai.

Capacity doubling ke saath copies sirf sizes 1, 2, 4, 8, …, n par hoti hain. Total copy work `1 + 2 + 4 + … + n < 2n` hai — geometric series ka sum uske last term ke constant multiple se bounded hota hai. Isliye per-push amortized cost O(1) hai.

Yeh **average case se different** hai. Average case input distribution par depend karta hai ("random input par expected cost"). Amortized cost kisi bhi input sequence par guaranteed hai — koi adversary aisa push sequence nahi bana sakta jo total cost n ke super-linear kar de. Capacity ko doubling ke bajay fixed `+1` se badhaoge toh total work `1 + 2 + … + n = Θ(n²)` ho jayega aur amortized bound tootega. Growth factor geometric hona hi proof ka core hai.

Same argument teen aur jagah repeat hota hai, aur interview mein inhe pehchanna useful hai:

| Structure | Costly rare operation | Why the total stays linear |
| --- | --- | --- |
| Dynamic array push | Resize and copy | Geometric growth, total copies < 2n |
| Hash table insert | Rehash all entries | Load factor threshold + geometric capacity growth |
| Monotonic stack scan | Inner while loop popping many items | Har element at most once push aur once pop hota hai |
| Two stacks as a queue | Bulk transfer input → output | Har item lifetime mein at most once transfer hota hai |

Monotonic stack wala case sabse zyada miss hota hai: nested `while` dekh kar log O(n²) bol dete hain. Correct method per-iteration maximum multiply karna nahi, balki **total pops count karna** hai — n elements push hue, so at most n pops possible hain.

## Recursive cost without hand-waving

Divide-and-conquer ka cost recurrence se nikalta hai. Merge sort: `T(n) = 2T(n/2) + Θ(n)`. Har level total Θ(n) merge work karta hai aur log n levels hain, so Θ(n log n).

Binary search: `T(n) = T(n/2) + Θ(1)` → Θ(log n), kyunki har level constant work aur log n levels hain.

Naive Fibonacci: `T(n) = T(n-1) + T(n-2) + Θ(1)` → exponential, roughly Θ(φⁿ). Recursion tree ke nodes hi count kar lo — yahi total calls hain.

Ek useful shortcut: **recursion tree draw karo, per level ka total work likho, phir levels par sum karo.** Agar per-level work constant reh raha hai (merge sort), answer `work-per-level × depth` hai. Agar per-level work geometrically shrink kar raha hai, root dominate karta hai. Agar grow kar raha hai, leaves dominate karti hain.

Recursion mein space alag se state karo: maximum simultaneous stack depth, total calls nahi. Permutations enumerate karne mein n! calls hoti hain lekin stack depth sirf O(n) hai.

## JavaScript cost traps

- `slice`, spread aur `map` nayi arrays allocate kar sakte hain; copies ko space analysis mein count karo.
- `shift()` remaining elements move kar sakta hai. Queue ke liye head index use karo.
- Recursion mein call-stack frames auxiliary space hain.
- ECMAScript Map average sublinear access require karta hai; language-level O(1) guarantee nahi. Expected constant-time hashing assume kar rahe ho toh bolo.
- `Number.MAX_SAFE_INTEGER` se bade integers exact nahi ho sakte. BigInt arithmetic ka cost value size ke saath grow karta hai.
- `array.indexOf` / `includes` / `find` sab linear scans hain. Loop ke andar inka use silently O(n²) bana deta hai — yeh sabse common accidental quadratic hai.
- String concatenation loop mein (`s += ch`) engine-dependent hai. Modern engines rope/slice optimizations use karte hain, lekin guarantee nahi; predictable behavior ke liye array mein push karke `join('')` karo.
- `delete obj.key` object ke hidden-class shape ko change kar sakta hai aur baad ke property access slow kar sakta hai. Dictionary use case ke liye `Map` prefer karo.
- Object spread `{...obj}` shallow copy hai aur O(number of own enumerable keys) hai. Reduce ke andar spread karna (`acc => ({...acc, [k]: v})`) classic O(n²) trap hai.

## Constraints tell you the target complexity

Interview mein input bounds ek strong hint hote hain. Roughly 10⁸ simple operations ek second ka order of magnitude hai (exact number language aur machine par depend karta hai, isliye ise rough calibration samjho, guarantee nahi):

| Given n | Plausible target | Typical approach |
| --- | --- | --- |
| n ≤ 12 | O(n!) | Full permutation enumeration |
| n ≤ 22 | O(2ⁿ · n) | Subset enumeration, bitmask DP |
| n ≤ 500 | O(n³) | Floyd–Warshall, interval DP |
| n ≤ 5,000 | O(n²) | Pairwise DP, simple nested loops |
| n ≤ 10⁵ | O(n log n) | Sorting, heaps, binary search on answer |
| n ≤ 10⁷ | O(n) | Single pass, counting, prefix sums |
| n astronomically large | O(log n) ya O(1) | Binary search, closed-form, matrix power |

Yeh table answer nahi deti, direction deti hai. `n ≤ 10⁵` par O(n²) likhne se pehle hi tumhe pata hona chahiye ki woh accept nahi hoga, aur `n ≤ 20` dekh kar exponential search ko turant reject mat karo — wahan wahi intended solution ho sakta hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Big O ke andar constants aur lower-order terms hamesha irrelevant hain, so O(n log n) hamesha O(n²) se behtar hai. **Why it breaks:** Asymptotic bound *large* n ke liye statement hai. n = 20 par heavy-constant merge sort insertion sort se slow ho sakta hai — yehi reason hai ki real library sorts chhote subarrays par insertion sort par switch karte hain. **Fix:** Complexity ko selection ka *first filter* samjho, final verdict nahi; actual n aur constant factors mention karo jab woh decision change karte hon.
- **Wrong assumption:** "Extra data structure use kiya, so space O(n) ho gayi" — aur input ko hi space maan lena. **Why it breaks:** Auxiliary space aur total space alag metrics hain. In-place algorithm input array ko hi mutate karta hai aur O(1) auxiliary space leta hai, lekin input toh phir bhi O(n) memory mein hai. **Fix:** Hamesha bolo "auxiliary space O(1), input excluded" — ambiguous "space O(1)" claim mat karo, aur recursion stack ko auxiliary space mein count karo.
- **Wrong assumption:** Hash map lookup O(1) hai, so hashing wala solution hamesha strictly better hai. **Why it breaks:** O(1) *expected* cost hai typical hashing assumptions ke under, aur string key ka hash compute karna key length ke proportional hota hai. Long keys ya adversarial collision patterns par yeh degrade hota hai; plus cache locality array ke muqable kharab hoti hai. **Fix:** "Expected O(1) assuming good hash distribution" bolo, aur key size ko cost model mein explicitly rakho jab keys unbounded ho sakti hain.
- **Wrong assumption:** Memoization add karne se koi bhi exponential recursion polynomial ban jaata hai. **Why it breaks:** Cache tabhi help karta hai jab distinct states ki count chhoti ho. Agar state mein poora path ya ek arbitrary set encode hota hai, distinct states khud exponential hain aur cache sirf memory kha jaata hai. Aur agar output ka size hi exponential hai (jaise saare subsets return karna), koi caching usse chhota nahi kar sakti. **Fix:** Pehle distinct states count karo, phir per-state work — complexity inka product hai. Output size ko hamesha ek separate lower bound ki tarah treat karo.
- **Wrong assumption:** Nested loop hamesha quadratic hai aur single loop hamesha linear. **Why it breaks:** Do monotone pointers wala nested `while` total O(n) movement karta hai; ulta, single `for` loop jiske andar `arr.includes(x)` hai woh O(n²) hai. Syntax shape cost nahi batati. **Fix:** Loop nesting count karne ke bajay *total operations* count karo — har element kitni baar touch hota hai, poore run mein.

## Where this shows up in real systems

Capacity planning aur incident analysis dono complexity reasoning par chalti hain. Ek endpoint jo per request database se N related rows fetch karta hai (N+1 query problem) staging par 50 rows ke saath theek dikhta hai aur production par 50,000 rows par time out karta hai — growth curve ka hi issue hai, code "galat" nahi tha. Similarly, ek in-memory cache jo kabhi evict nahi karta O(unbounded) space leta hai aur eventually OOM karta hai.

Amortized reasoning system design mein bhi wahi hai: log-structured storage (jaise LSM trees) individual writes ko fast rakhte hain aur periodically ek expensive compaction chalate hain; per-write amortized cost low rehta hai lekin ek unlucky request compaction pause dekh sakti hai. Isiliye production mein average latency ke saath **p99 latency** bhi measure hoti hai — amortized good aur per-operation good same cheez nahi hai, exactly jaise dynamic array ke resize par hota hai.

## Practice and answer

**Prompt:** Har item ke liye `values.includes(item + 1)` call karne ka worst-case cost?

**Answer:** Ek membership scan O(n), so total O(n²). Pehle Set banao; typical constant-time hashing assumption par total expected O(n), extra space O(n). Memory use karke repeated scans remove hue.

**Prompt:** Memoization ke saath bhi all subsets return karna O(n) kyun nahi?

**Answer:** 2ⁿ distinct positional subsets hain. Unke elements materialize karne mein Θ(n2ⁿ) total output entries banti hain. Required output size cache se disappear nahi hota.

**Prompt:** `nums.reduce((acc, n) => ({ ...acc, [n]: true }), {})` ki complexity kya hai?

**Answer:** O(n²) time aur O(n) final space. Har step accumulator ki saari existing keys copy karta hai, so total copied entries `1 + 2 + … + n = Θ(n²)` hain. Fix simple hai: ek hi object/Map mutate karo loop mein, ya `acc[n] = true; return acc;` — n allocations ke bajay ek.

**Prompt:** Dynamic array capacity ko doubling ke bajay 1.5× se badhaya jaaye toh amortized push cost kya hoga?

**Answer:** Still O(1). Proof sirf growth factor ke `> 1` constant hone par depend karta hai — total copy work geometric series hai jiska sum last term ke constant multiple se bounded hai (1.5× par factor roughly 3). Constant `+k` growth par hi bound tootta hai aur total Θ(n²) ban jaata hai.

**Prompt:** Ek function ke do arrays hain, lengths n aur m, aur woh nested loops se saare pairs compare karta hai. "O(n²)" bolna kab galat hai?

**Answer:** Jab n aur m independently vary karte hain. Correct bound O(nm) hai. Dono ko ek hi `n` mein collapse karna tab hi valid hai jab problem constraint kehti ho ki m = O(n). Interview mein multiple input sizes ko alag naam dena precision ka signal hai.

## Depth walkthrough — andar kya ho raha hai?

### Input variable define kiye bina Big-O incomplete hai

n users aur m orders hon toh separate scans O(n+m) hain. Har user ke liye all orders scan O(nm) ho sakta hai. Same letter n laga dene se independent dimensions hide hoti hain. String comparison/hash cost key length par depend kar sakti hai; “Map access O(1)” assumption ke scope ko label karo.

Worst-case one operation aur amortized sequence cost alag hain. Dynamic array occasional resize O(n) le sakti hai, while many appends ka aggregate linear ho. Average-case input probability model maangti hai; amortized proof random input assume karna zaroori nahi.

**Practice:** Nested loop mein inner pointer reset nahi hota aur total n positions move karta hai toh operation count directly gino. Syntax nested hone se automatic O(n²) nahi. Output khud size k hai toh enumerate karne ka Ω(k) lower bound ignore nahi ho sakta.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Outer loop n baar chalta hai. Inner loop j=1 se shuru karke j ko double karta hai jab tak j<n. Iska runtime nikalo; phir j++ wale version se compare karo.

> **Hint — chhota ishara:** 1, 2, 4, 8 likho aur gino ki n tak pahunchne mein kitne steps lagte hain.

**Answer guide — pehle khud karo, phir compare karo:** Doubling wale inner loop mein O(log n) steps hain, isliye total O(n log n) hai. j++ mein O(n) inner steps, yani total O(n²). Sirf counters store ho rahe hon toh auxiliary space O(1) hai. Logarithm samjhate waqt n>1 assume karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check

[Princeton algorithm analysis](https://algs4.cs.princeton.edu/14analysis/) cost model explain karta hai. Actual collection guarantees ke liye [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects) dekho.
