---
id: dsa-patterns
title: Frequency counters and pointer patterns
track: dsa
order: 4
level: Foundation
minutes: 32
summary: Recognize when counts, sorted pointers, windows, and prefix sums remove repeated work.
tags: frequency-counter, two-pointers, sliding-window, prefix-sum
---

## Mental model

Pattern ek reusable invariant hai, bas problem ke keyword se match karne wali trick nahi. Frequency counter multiplicity remember karta hai; two pointers impossible pairs discard karte hain. Sliding window neighboring contiguous ranges ka work reuse karti hai. Prefix sums repeated range addition ko subtraction mein convert karte hain.

## Frequency counters

Anagrams ke liye baar-baar character search/delete karne ke bajay counts compare karo. Text semantics pehle define karo: neeche Unicode code points count hote hain, case preserve hota hai, aur accents normalize ya grapheme clusters combine nahi hote.

```js
function isAnagram(a, b) {
  const counts = new Map();
  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  for (const ch of b) {
    if (!counts.has(ch)) return false;
    const remaining = counts.get(ch) - 1;
    if (remaining === 0) counts.delete(ch);
    else counts.set(ch, remaining);
  }
  return counts.size === 0;
}
```

Usual hash-map assumption par expected O(n + m) time aur distinct characters ke liye O(k) space. Sirf Set use karne se multiplicity lose hogi: `aab` aur `abb` mein distinct characters same hain, lekin anagrams nahi hain.

Alternative approach hai dono strings sort karke compare karna — correct hai, code chhota hai, lekin O(n log n) time hai. Counter version linear hai. Interview mein dono mention karo aur tradeoff bolo: sorting version zero extra state rakhta hai aur unusual alphabets par bhi kaam karta hai, counting version faster hai lekin alphabet ke proportional memory leta hai.

### Deriving the sliding anagram search

Frequency counter ka asli power tab dikhta hai jab woh window ke saath move kare. Problem: string `text` mein `pattern` ka koi permutation substring ke roop mein exist karta hai?

```js
// Step 1: brute force — har window ke liye fresh counts banao.
// Windows: n - m + 1, har window ka count O(m). Total O(nm).
//
// Bottleneck: adjacent windows sirf DO characters se differ karte hain
// (ek left se nikalta hai, ek right se aata hai) — phir bhi hum m counts
// dobara build kar rahe hain.

function containsPermutation(text, pattern) {
  const m = pattern.length;
  if (m === 0 || m > text.length) return m === 0;

  const need = new Map();
  for (const ch of pattern) need.set(ch, (need.get(ch) ?? 0) + 1);

  // `deficit` = kitne distinct characters abhi bhi required count par nahi hain.
  let deficit = need.size;

  const adjust = (ch, delta) => {
    if (!need.has(ch)) return;
    const before = need.get(ch);
    const after = before - delta;    // delta +1 = character window mein aaya
    need.set(ch, after);
    if (before === 0 && after !== 0) deficit++;   // ek satisfied character toota
    if (after === 0 && before !== 0) deficit--;   // ek character ab exactly satisfied
  };

  for (let right = 0; right < text.length; right++) {
    adjust(text[right], 1);
    if (right >= m) adjust(text[right - m], -1);  // window size exactly m rakho
    if (right >= m - 1 && deficit === 0) return true;
  }
  return false;
}
```

Derivation ka core yeh hai: har window ke liye poora count compare karne ke bajay hum ek **aggregate counter `deficit`** maintain karte hain jo "kitne characters abhi mismatch hain" batata hai. Window slide karne par sirf do characters change hote hain, so `deficit` ko O(1) mein update kiya ja sakta hai — aur final check `deficit === 0` bhi O(1) hai.

Har index at most do `adjust` calls trigger karta hai, so O(n) time aur pattern ke distinct characters ke liye O(k) space. Yeh "per-window recompute → maintain an aggregate" transformation sliding window ka sabse reusable idea hai, chahe aggregate sum ho, distinct count ho ya deficit.

## Two pointers on sorted data

```js
function pairWithSum(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
```

Sum chhota hai toh current left element ko right se bhi chhote partner ke saath pair karke target tak nahi pahunch sakte. Isliye left discard karna safe hai. Sum bada ho toh mirror argument se right move karna safe hai. Dono pointers maximum n positions move karte hain: O(n) time, O(1) extra space.

Input pehle se sorted hona chahiye. Khud sort karoge toh total complexity aur original indices dono change ho sakte hain. Interview mein sorting ka cost silently ignore mat karo.

### Three sum: where duplicate handling actually decides the grade

`threeSum` ka classic ask hai: unique triplets `[a, b, c]` return karo jinka sum zero ho. Yahan algorithm easy hai, **deduplication** hi asli test hai.

```js
function threeSum(nums) {
  const a = [...nums].sort((x, y) => x - y);   // copy, so caller ka array safe
  const result = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (a[i] > 0) break;                       // sorted: aage sab positive, sum > 0
    if (i > 0 && a[i] === a[i - 1]) continue;  // same first element dobara mat lo
    let left = i + 1;
    let right = a.length - 1;
    while (left < right) {
      const sum = a[i] + a[left] + a[right];
      if (sum < 0) { left++; continue; }
      if (sum > 0) { right--; continue; }
      result.push([a[i], a[left], a[right]]);
      // Dono sides ke duplicates skip karo, warna same triplet repeat hoga.
      while (left < right && a[left] === a[left + 1]) left++;
      while (left < right && a[right] === a[right - 1]) right--;
      left++;
      right--;
    }
  }
  return result;
}
```

Kyun yeh correct hai: outer loop pehla element fix karta hai, andar ka two-pointer scan us fixed value ke liye saare valid pairs O(n) mein dhoondh leta hai. Sorting ke kaaran equal values contiguous hain, isliye "previous ke equal ho toh skip karo" har distinct combination ko exactly ek baar emit karta hai.

Complexity: sorting O(n log n), phir n outer iterations × O(n) inner scan = O(n²). Total O(n²) time. Auxiliary space O(n) sorted copy ke liye (output alag). Ek common galat "optimization" hai results ko `Set` mein JSON strings ki tarah daal kar dedupe karna — woh kaam kar jaata hai lekin O(n²) triplets tak extra memory aur serialization cost add karta hai, aur interviewer ko batata hai ki sorted structure ka use nahi samjha.

`a[i] > 0` wala early break bhi sorted invariant ka direct consequence hai: agar sabse chhota chosen element hi positive hai, toh teenon positive hain aur sum kabhi zero nahi ho sakta.

## Sliding windows

Exactly `k` contiguous elements ka maximum sum chahiye toh pehla window calculate karo. Next window mein departing element subtract aur arriving element add karo.

```js
function maxWindowSum(nums, k) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];
    best = Math.max(best, sum);
  }
  return best;
}
```

Yeh fixed-size version negative numbers par bhi correct hai. Variable-size “sum bada ho toh shrink karo” method ko monotonic relationship chahiye, jaise nonnegative inputs. Negative value remove karne se sum increase ho sakta hai, so wahi reasoning arbitrary signed arrays par fail hoti hai.

Longest substring without repeating characters mein each character ka last index store kar sakte ho. `left = max(left, lastIndex + 1)` use karo. Left ko backward move karna already-discarded invalid characters ko window mein wapas la sakta hai.

### Variable-size window: the shrink condition is the whole design

```js
// Smallest contiguous subarray with sum >= target. Nonnegative inputs only.
function minWindowSum(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    // Invariant after this loop: [left, right] ka sum < target, ya left > right.
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}
```

`left` kabhi decrease nahi hota aur `right` kabhi decrease nahi hota, isliye dono milkar at most 2n moves karte hain — nested `while` ke bawajood total O(n) time, O(1) auxiliary space. Yeh wahi aggregate-analysis argument hai jo monotonic stack mein lagta hai.

Nonnegative constraint yahan decorative nahi hai. Shrink step ka justification hai: "left element hatane se sum ghatega, so agar ab bhi `>= target` hai toh chhota window mil gaya." Negative values allowed ho toh element hatane se sum **badh** sakta hai, monotone relationship toot jaata hai, aur yeh window approach silently wrong answers deti hai. Us case mein prefix sums + monotonic deque (ya sorted structure) chahiye — approach hi badalti hai, patch nahi.

Har sliding window problem ko teen questions se design karo:

| Question | Fixed window (`k` elements) | Variable window (condition-driven) |
| --- | --- | --- |
| Kab expand karein? | Har iteration mein exactly ek | Har iteration mein exactly ek |
| Kab shrink karein? | Jab size `k` exceed kare | Jab window condition violate ya satisfy kare |
| Answer kab record karein? | Jab size exactly `k` ho | Shrink loop ke andar (minimum) ya baahar (maximum) |

Maximum-length problems mein answer shrink loop ke **baad** record hota hai (window ab valid hai), aur minimum-length problems mein shrink loop ke **andar** (window abhi bhi valid hai, shrink karne se pehle). Yeh ek line ki placement hi sabse common silent bug hai.

## Prefix sums

`prefix[0] = 0` aur `prefix[i + 1] = prefix[i] + nums[i]` define karo. Half-open range `[left, right)` ka sum `prefix[right] - prefix[left]` hai. Construction O(n) time/space, har range query O(1).

Sum `k` wale subarrays count karne ke liye current prefix se pehle `currentPrefix - k` kitni baar aaya hai, count karo. Counter `{0: 1}` se seed karo taaki index zero se start hone wale ranges bhi count hon. Existence aur count ke problems alag hain: Set enough ho sakta hai existence ke liye, multiplicity ke liye Map count chahiye.

```js
function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]);   // empty prefix ek baar dekha gaya hai
  let prefix = 0;
  let count = 0;
  for (const n of nums) {
    prefix += n;
    count += seen.get(prefix - k) ?? 0;  // pehle count karo
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1); // phir current prefix record karo
  }
  return count;
}
```

Order matter karta hai: current prefix ko record karne se **pehle** lookup karo. `k === 0` par ulta order har index ko apne saath pair kar dega aur empty subarrays count ho jayenge. `{0: 1}` seed bhi essential hai — bina uske `countSubarraysWithSum([3], 3)` zero return karega, kyunki index 0 se shuru hone wala valid subarray kisi earlier prefix se match nahi kar paata.

Yeh version signed numbers par bhi correct hai — yahi iska sliding window se bada advantage hai. Window approach ko monotone shrink chahiye; prefix-sum + hash map ko sirf equality chahiye, ordering assumption nahi. Time O(n) expected, space O(n) worst case (saare prefixes distinct).

### Difference arrays: the inverse trick

Prefix sum repeated *queries* ko O(1) banata hai. Uska mirror image — **difference array** — repeated range *updates* ko O(1) banata hai.

```js
// "Range [l, r] ke har element mein v add karo" wali q updates, phir final array.
function applyRangeUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;
    diff[r + 1] -= v;      // r ke baad effect band
  }
  const result = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];    // running prefix hi final value hai
    result[i] = running;
  }
  return result;
}
```

Naive approach har update par O(r - l) work karta hai: q updates par worst case O(qn). Difference array har update ko O(1) mein record karta hai aur end mein ek O(n) sweep se sab materialize karta hai: total O(n + q).

Yeh pattern interval scheduling aur "kitni meetings ek saath chal rahi hain" jaise problems ka core hai — har meeting start par `+1`, end par `-1`, phir running sum ka maximum hi peak concurrency hai. Trade-off saaf hai: prefix sum static array par fast queries deta hai, difference array batch updates ke baad ek final read deta hai. Dono ek saath interleaved chahiye (update aur query mixed) toh Fenwick tree / segment tree ki taraf jaana padta hai, jo dono ko O(log n) mein karte hain.

## Pick the right pattern

| Signal in the problem statement | Likely pattern | Why |
| --- | --- | --- |
| "Contiguous" + fixed length | Fixed sliding window | Adjacent windows ka overlap reuse hota hai |
| "Contiguous" + "longest/shortest satisfying X" | Variable sliding window | Monotone shrink condition chahiye |
| "Contiguous" + sum equals / count of | Prefix sum + hash map | Signed values par bhi correct |
| Sorted input + pair/triplet | Two pointers | Ek side discard karna provable hai |
| "Count/multiplicity" comparison | Frequency counter | Set multiplicity lose kar deta hai |
| Many range updates, one final read | Difference array | Update O(1), single O(n) materialization |
| Unsorted + "does X exist" | Hash set | Sorting ka log factor bachta hai |

Ek shortcut jo aksar galat hota hai: "contiguous" dekh kar turant sliding window likhna. Window tabhi valid hai jab shrink/expand ka effect **monotone** ho. Negative numbers, ya "exactly k distinct" jaise non-monotone conditions, window ko silently tod dete hain. Aise case mein "exactly k = atMost(k) − atMost(k−1)" wali decomposition ek reliable rescue hai, kyunki `atMost` monotone hoti hai.

## Common mistakes

- **Wrong assumption:** Sliding window har contiguous-subarray problem par lagti hai. **Why it breaks:** Window ka shrink step is argument par depend karta hai ki element hatane se aggregate ek hi direction mein move karega. Negative numbers ke saath `sum -= nums[left]` sum ko badha sakta hai, so "abhi bhi `>= target` hai" wali loop condition meaningless ho jaati hai — code chalega, answers galat honge. **Fix:** Shrink karne se pehle monotonicity explicitly verify karo. Signed values par prefix sums + hash map (equality-based) ya monotonic deque use karo.
- **Wrong assumption:** Two pointers ke liye bas do variables `left` aur `right` chahiye. **Why it breaks:** Discard step ki correctness **sorted order** par tikki hai. Unsorted array par `left++` karna un pairs ko bhi chhod deta hai jo valid the — kyunki "aage sirf bade elements aayenge" wali guarantee hi nahi hai. **Fix:** Pehle bolo ki input sorted hai ya tum sort karoge (aur us O(n log n) ko complexity mein add karo), aur agar original indices return karni hain toh values ke saath indices bhi carry karo.
- **Wrong assumption:** Prefix-sum count map ko empty se initialize karna theek hai. **Why it breaks:** Index 0 se shuru hone wala subarray kisi *earlier* prefix se match nahi karta — uska "earlier prefix" empty prefix (value 0) hai, jo map mein hai hi nahi. `countSubarraysWithSum([5], 5)` galat 0 dega. **Fix:** Map ko `{0: 1}` se seed karo, aur current prefix record karne se *pehle* lookup karo.
- **Wrong assumption:** Frequency counter ke liye plain object `{}` Map jitna hi safe hai. **Why it breaks:** Plain object ke keys strings mein coerce hote hain (`1` aur `'1'` collide karte hain), aur `constructor`/`toString` jaise inherited prototype keys par `counts[key]` unexpectedly truthy function return karta hai — `'constructor'` string count karte hi bug. **Fix:** `Map` use karo, ya `Object.create(null)` se prototype-less object banao.
- **Wrong assumption:** Longest-unique-substring mein `left = lastSeen.get(ch) + 1` likhna enough hai. **Why it breaks:** Agar us character ka previous occurrence current window ke *baahar* (left se pehle) tha, toh yeh `left` ko peeche khinch leta hai aur already-discarded duplicate characters window mein wapas aa jaate hain. `'abba'` par 3 return hoga instead of 2. **Fix:** `left = Math.max(left, lastSeen.get(ch) + 1)` — left ko monotonically non-decreasing rakho.

## Where this shows up in real systems

Sliding window rate limiting ka literal implementation hai: "pichhle 60 seconds mein is API key se kitni requests aayi" ek time-based variable window hai, jahan expire ho chuke timestamps window ke left se drop hote hain. Fixed-bucket counters se yeh isliye better hai kyunki woh bucket boundary par burst allow kar dete hain.

Frequency counters observability pipelines mein har jagah hain — log lines par top-k error signatures nikalna wahi multiplicity-vs-distinctness distinction hai (Set galat answer dega). Prefix sums aur difference arrays analytics ke cumulative metrics aur capacity planning mein aate hain: "har interval par kitne concurrent sessions" ka classic solution start/end par `+1/-1` mark karke ek sweep karna hai, exactly upar wala difference-array pattern. Two pointers merge-join mein dikhta hai — do sorted streams ko join karne ke liye database engine bilkul yahi "chhote side ko aage badhao" wala rule use karta hai.

## Practice and answer

**Prompt:** Sorted `[1, 2, 4, 6, 9]` mein sum 8 wala pair find karo.

**Answer:** `(1,9)` bada hai, `(1,6)` chhota hai, aur `(2,6)` match deta hai. Original sorted array mein indices `[1,3]` hain.

**Prompt:** `maxWindowSum([-5, -2, -9], 2)` kya return karega?

**Answer:** `-7`. Best ko zero initialize karoge toh accidentally empty window allow kar doge, jabki exactly two elements required hain.

**Prompt:** "Exactly k distinct characters wale subarrays count karo" ko sliding window se kaise solve karoge, jabki `exactly k` monotone condition nahi hai?

**Answer:** Decomposition use karo: `exactly(k) = atMost(k) − atMost(k − 1)`. `atMost(k)` monotone hai — window shrink karne se distinct count kabhi badhta nahi — isliye standard variable window usme kaam karti hai. Do linear passes, total O(n). Direct "exactly" window likhne ki koshish mein shrink condition ambiguous ho jaati hai aur solution silently wrong ho jaata hai.

**Prompt:** `threeSum` mein dedup ke liye results ko `Set` of JSON strings mein daalna acceptable hai?

**Answer:** Correct hai, lekin weaker answer hai. Output triplets O(n²) tak ho sakti hain, aur har ek ko serialize karke hash karna extra time aur memory leta hai. Sorted array mein equal values contiguous hain, isliye "previous ke barabar ho toh skip" O(1) mein wahi dedup deta hai. Interviewer yahi dekhta hai ki tumne sorted structure ka use kiya ya usse bypass karke brute-force dedup kiya.

**Prompt:** `countSubarraysWithSum` ki worst-case space kya hai, aur woh kab hit hoti hai?

**Answer:** O(n). Jab saare prefix sums distinct hon (jaise saare elements positive), map mein n + 1 entries jaati hain. "Map sirf O(k) leta hai" bolna tab valid hota jab values ki range chhoti ho — general signed input par aisi koi bound nahi hai.

## Source check

[ECMAScript keyed collections](https://tc39.es/ecma262/multipage/keyed-collections.html) Map/Set behavior define karta hai. [MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) comparator aur mutation semantics document karta hai, jo `threeSum` ke sorted-copy step ke liye relevant hai. [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/) aggregate/amortized counting arguments validate karta hai. Upar ke algorithms aur correctness arguments original worked examples hain.
