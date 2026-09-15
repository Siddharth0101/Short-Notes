---
id: dsa-dynamic-programming
title: Dynamic programming from state to recurrence
track: dsa
order: 12
level: Advanced
minutes: 43
summary: DP state mein itni information honi chahiye ki future choices decide ho sakein; irrelevant history store karna zaroori nahi.
tags: dynamic-programming, memoization, tabulation, coin-change, knapsack
visual: dynamic-programming
---

## Mental model — simple soch

Dynamic programming repeated subproblems ke answers reuse karta hai. State aisi information honi chahiye jo remaining decision ko fully determine kare. Agar future answer path ke kisi ignored detail par depend karta hai, cache key incomplete hai aur result wrong ho sakta hai.

Five steps follow karo: state ka plain-language meaning, choices/transition, base cases, evaluation order, final answer location. Complexity usually **number of distinct states × work per state** se nikalti hai, plus output construction aur arithmetic cost.

> **Core takeaway:** DP state mein itni information honi chahiye ki future choices decide ho sakein; irrelevant history store karna zaroori nahi.

## Memoization and tabulation

Memoization recursive demand par state solve karta hai aur cache karta hai. Tabulation dependencies ke order mein table fill karta hai. Memoization naturally only reached states evaluate kar sakta hai; tabulation call-stack limit avoid karta hai aur memory compression ko visible banata hai.

Fibonacci mein `fib(n) = fib(n - 1) + fib(n - 2)` overlapping states repeat karta hai. Memoization O(n) arithmetic operations tak reduce karta hai. Iteration sirf previous two results retain kar sakti hai. Large BigInt values ke saath addition constant cost nahi, so “O(n) time” ko arithmetic-operation model samjho.

### The full derivation, one problem, three forms

Coin change ko teenon forms mein likh kar dekho — yahi progression interview mein narrate karna chahiye.

```js
// Form 1: pure recursion. Correct, but exponential.
function coinsBrute(coins, amount) {
  if (amount === 0) return 0;
  if (amount < 0) return Infinity;
  let best = Infinity;
  for (const c of coins) best = Math.min(best, 1 + coinsBrute(coins, amount - c));
  return best;
}
// Recursion tree: har node C branches, depth amount/min(coins) -> O(C^(A/min))
// Bottleneck: coinsBrute(coins, 7) alag-alag raston se baar-baar call hota hai.

// Form 2: memoization (top-down). Same recurrence, cached.
function coinsMemo(coins, amount, cache = new Map()) {
  if (amount === 0) return 0;
  if (amount < 0) return Infinity;
  if (cache.has(amount)) return cache.get(amount);
  let best = Infinity;
  for (const c of coins) best = Math.min(best, 1 + coinsMemo(coins, amount - c, cache));
  cache.set(amount, best);
  return best;
}
// Distinct states: A + 1. Work per state: C. -> O(A*C) time, O(A) space.
// Lekin recursion depth O(A/min(coins)) — bade amount par stack overflow.

// Form 3: tabulation (bottom-up). Stack-safe, aur memory compression visible.
// -> upar wala minimumCoins(). Same O(A*C) time, O(A) space, koi recursion nahi.
```

Teen observations jo interview mein value add karte hain:

1. **Memoization ne recurrence nahi badli**, sirf repeated evaluation hataayi. Agar Form 1 galat hoti toh Form 2 bhi galat hoti — cache correctness nahi deta. Isliye pehle recurrence justify karo, phir cache add karo.
2. **Complexity ka formula** yahan literally dikhta hai: distinct states (A + 1) × work per state (C) = O(A·C). Yeh har DP problem par apply hota hai, aur interview mein isi form mein bolna chahiye.
3. **Top-down aur bottom-up equivalent nahi hain.** Top-down sirf **reachable** states evaluate karta hai — agar coins `[100]` hon aur amount 10⁶ ho, toh memo version sirf 10⁴ states chhuega, jabki tabulation poora 10⁶-size array bharega. Ulta, tabulation stack-safe hai aur rolling-array compression allow karta hai. Sparse reachable state space → top-down; dense states ya deep recursion → bottom-up.

## Minimum coin change

Unlimited positive integer coin denominations ke saath amount banane ke minimum coins chahiye. `dp[a]` ka meaning hai exact amount a banane ke minimum coins; unreachable state Infinity hai.

```js
function minimumCoins(coins, amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new RangeError('amount must be a nonnegative integer');
  }
  if (coins.some(c => !Number.isInteger(c) || c <= 0)) {
    throw new RangeError('coins must be positive integers');
  }
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

Last selected coin c ho to previous amount `a - c` solve karna padta hai. Har valid last coin try karne se optimal possibility cover hoti hai. O(A*C) time, O(A) space, where A target amount aur C denomination count hai. Ye pseudo-polynomial hai: A ki numeric value mein polynomial, uske binary encoding length mein necessarily polynomial nahi.

Coins `[1,3,4]` aur amount 6 mein greedy `4+1+1` se 3 coins leti hai; DP `3+3` se 2 find karti hai. Local largest coin choice globally optimal hona guaranteed nahi.

### Reconstructing the actual answer, not just its value

`dp[amount]` sirf count deta hai. Actual coins chahiye toh har state par **choice record** karo:

```js
function coinsUsed(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  const choice = Array(amount + 1).fill(-1);   // dp[a] achieve karne wala last coin
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
        choice[a] = coin;                      // decision store karo
      }
    }
  }
  if (dp[amount] === Infinity) return null;

  const used = [];
  for (let a = amount; a > 0; a -= choice[a]) used.push(choice[a]); // backtrack
  return used;
}
```

Yeh ek important design point hai: **rolling-array space optimization reconstruction ko todh deti hai.** Agar tum sirf do rows rakhoge (O(min(A, C)) space), toh backtracking ke liye purani rows available hi nahi hongi. Choice chahiye toh ya poora table rakho (O(A) ya O(nm) space), ya divide-and-conquer reconstruction jaise advanced technique use karo (Hirschberg's algorithm LCS ko O(min(n,m)) space mein reconstruct karta hai, O(nm) time par).

Interview mein yeh trade-off explicitly bolna chahiye: "agar sirf optimal value chahiye toh main space O(A) se O(1) tak compress kar sakta hoon; actual sequence chahiye toh poora table rakhna padega."

## Longest increasing subsequence: two correct solutions

Ek hi problem ke do solutions jinka comparison sabse instructive DP exercises mein se hai.

```js
// Solution 1: classic DP. dp[i] = LIS length ending exactly at index i.
function lisQuadratic(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);   // answer kisi bhi index par end ho sakta hai
}
// O(n^2) time, O(n) space. State: "index i par end hone wali best length."
```

State definition mein "**ending exactly at i**" critical hai. "First i elements ki LIS" define karoge toh recurrence ban hi nahi paayegi — kyunki `nums[i]` ko extend karne ke liye tumhe pata hona chahiye ki previous subsequence ka **last element** kya tha, aur woh information us state mein hai hi nahi. Yeh "state that doesn't capture enough information" ka textbook example hai.

```js
// Solution 2: patience sorting. tails[k] = smallest possible tail of an
// increasing subsequence of length k+1 seen so far.
function lisNLogN(nums) {
  const tails = [];
  for (const n of nums) {
    // First index jahan tails[idx] >= n (lowerBound) — chapter 04 wala template.
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;                    // replace, ya append agar lo === tails.length
  }
  return tails.length;
}
// O(n log n) time, O(n) space.
```

Do baatein jo isko interview-grade banati hain. Pehla, `tails` **LIS nahi hai** — woh ek valid increasing subsequence bhi nahi ho sakti. Uski sirf **length** meaningful hai. Yeh common misunderstanding hai, aur isse clearly bolna samajh dikhata hai. Doosra, `tails` hamesha sorted rehta hai (invariant), isliye binary search valid hai — aur wahi invariant algorithm ko O(n log n) banata hai.

Kyun `tails[k]` ko smallest possible tail rakhna optimal hai: chhota tail future elements ko extend karne ke zyada mauke deta hai, aur usse koi possibility lose nahi hoti kyunki length k ki subsequence toh already exist karti hai. Yeh ek exchange argument hai — greedy correctness ka standard proof shape.

Ab practical question: **n log n hamesha better hai?** Nahi. n ≤ 1000 par O(n²) version simpler, debug karne mein aasan, aur actual subsequence reconstruct karna trivial hai (parent pointers rakho). O(n log n) version se subsequence reconstruct karna genuinely tricky hai (indices track karne padte hain). Agar constraints allow karein toh simpler solution ship karna better engineering hai — aur interview mein dono jaan-na aur tradeoff bolna sabse strong answer hai.

## Counting and knapsack variants

Minimum coins, number of ordered sequences, aur number of unordered combinations alag problems hain. Counting combinations mein coin outer loop aur amounts increasing inner loop standard recurrence deta hai; amount outer loop with coin inner loop usually ordered sequences count karta hai. Meaning define kiye bina loops interchange mat karo.

0/1 knapsack mein each item once use hota hai. Two-dimensional state `dp[i][capacity]` first i items se best value represent kar sakta hai. One-array optimization mein capacity **descending** update karo, taaki current item same iteration mein repeatedly reuse na ho. Unbounded knapsack mein ascending update intentional reuse enable karta hai.

```js
// 0/1 knapsack, one-dimensional. Capacity DESCENDING — yeh line hi sab decide karti hai.
function knapsack(items, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (const { weight, value } of items) {
    for (let c = capacity; c >= weight; c--) {     // descending!
      dp[c] = Math.max(dp[c], dp[c - weight] + value);
    }
  }
  return dp[capacity];
}

// Unbounded knapsack: same code, ASCENDING loop — reuse intentionally allowed.
function unboundedKnapsack(items, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (const { weight, value } of items) {
    for (let c = weight; c <= capacity; c++) {     // ascending!
      dp[c] = Math.max(dp[c], dp[c - weight] + value);
    }
  }
  return dp[capacity];
}
```

Do functions ka difference **ek loop direction** hai, aur woh do alag problems solve karte hain. Reasoning: `dp[c - weight]` ko padhte waqt tumhe decide karna hai ki woh value **current item ko include karne se pehle** ki hai ya **uske baad** ki. Descending order mein `dp[c - weight]` abhi tak is iteration mein update nahi hua, so woh "previous row" hai — item ek hi baar use hua. Ascending order mein woh already update ho chuka ho sakta hai, so item dobara use ho sakta hai.

Yeh 1D compression ka hidden cost hai: 2D version (`dp[i][c]`) mein yeh ambiguity hai hi nahi, kyunki rows explicitly separate hain. Agar confuse ho toh **pehle 2D likho, phir compress karo** — aur compression karte waqt yeh explicitly verify karo ki har read "purani row" se aa raha hai ya "nayi row" se.

Longest common subsequence mein `dp[i][j]` two prefixes ki LCS length hai. Last characters match ho to diagonal +1; otherwise max of dropping one side. O(nm) time, full table O(nm) space. Sirf length chahiye to two rows enough ho sakti hain; sequence reconstruct karne ke liye decisions ya another reconstruction strategy chahiye.

```js
function editDistance(a, b) {
  const n = a.length, m = b.length;
  // dp[i][j] = a ke pehle i characters ko b ke pehle j characters mein
  //            convert karne ke minimum operations.
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;   // i deletions
  for (let j = 0; j <= m; j++) dp[0][j] = j;   // j insertions

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];  // free match
      else dp[i][j] = 1 + Math.min(
        dp[i - 1][j - 1],   // replace
        dp[i - 1][j],       // delete from a
        dp[i][j - 1]        // insert into a
      );
    }
  }
  return dp[n][m];
}
```

Base cases hi aadha kaam hain aur aksar galat likhe jaate hain: `dp[i][0] = i` (poora prefix delete karo, `0` nahi), `dp[0][j] = j` (poora prefix insert karo). Inhe zero se fill karna ek plausible-dikhne wala galat answer deta hai jo chhote symmetric test cases par pakda nahi jaata.

Har cell ek constant number of predecessors dekhta hai, so O(nm) time aur O(nm) space. Sirf distance chahiye toh do rows kaafi hain — O(min(n, m)) space. Yeh DP ka sabse widely deployed example hai: spell checkers, `diff`, fuzzy search, DNA sequence alignment, aur "did you mean?" suggestions sab isi recurrence par chalte hain.

## Is it even a DP problem?

DP ke do necessary conditions hain, aur interview mein inhe naam se bolna chahiye:

1. **Optimal substructure** — bade problem ka optimal solution chhote subproblems ke optimal solutions se banta hai. Shortest path mein yeh hota hai; *longest simple path* mein **nahi** hota (woh NP-hard hai, kyunki subpath ka optimal choice poore path ki vertex-reuse constraint todh sakta hai).
2. **Overlapping subproblems** — same subproblem baar-baar aata hai. Yeh na ho toh caching kuch nahi bachata aur plain divide-and-conquer (merge sort, binary search) sahi tool hai.

Aur DP ko greedy se distinguish karna: greedy tab kaam karta hai jab local optimal choice provably global optimal ka hissa ho (exchange argument se prove hota hai). Coins `[1, 3, 4]` par greedy fail hota hai (amount 6 par `4+1+1` = 3 coins, optimal `3+3` = 2), lekin coins `[1, 5, 10, 25]` par kaam karta hai — kyunki wahan denominations ka structure special hai. **"Greedy kaam kar raha hai" ko test cases se conclude mat karo**; ya proof do, ya DP likho.

| Signal | Likely technique |
| --- | --- |
| "Minimum/maximum/count of ways" + choices at each step | DP |
| Overlapping subproblems in the recursion tree | Memoization |
| Local choice provably safe (exchange argument exists) | Greedy |
| Non-overlapping halves | Divide and conquer |
| Small n (≤ 20) + subset state | Bitmask DP |
| Monotone predicate on the answer | Binary search on answer |

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** State ko "kaunsa index par hoon" jitna simple rakhna hamesha kaafi hai. **Why it breaks:** State mein woh saari information honi chahiye jo **remaining decisions ko determine** karti hai. LIS mein "first i elements ki LIS length" state se recurrence bann hi nahi sakti, kyunki extend karne ke liye previous element ki **value** chahiye — isliye state "index i par end hone wali LIS" hona chahiye. Stock-trading problems mein "abhi share hold kiya hua hai ya nahi" ek zaroori dimension hai. **Fix:** State ko ek poore English/Hinglish sentence mein likho, phir poocho: "is sentence se kya main agla decision le sakta hoon?" Nahi toh dimension missing hai.
- **Wrong assumption:** Memoization add karne se galat recursion sahi ho jayegi. **Why it breaks:** Cache sirf repeated evaluation hataata hai; woh recurrence ki correctness par koi effect nahi daalta. Aur agar cache key state ke saare relevant dimensions capture nahi karti, toh alag states collide karke **wrong answers** dete hain — aur yeh bug consistent lagta hai, random nahi, isliye pakadna mushkil hai. **Fix:** Pehle bina cache ke recurrence ko chhote inputs par verify karo, phir cache add karo. Cache key mein har woh parameter daalo jo result ko affect karta hai.
- **Wrong assumption:** 1D knapsack mein loop direction sirf style ki baat hai. **Why it breaks:** Descending capacity loop `dp[c - weight]` ko "previous row" se padhta hai (item ek baar use), ascending "current row" se (item repeatedly use). Direction ulti karne se 0/1 knapsack chup-chaap unbounded knapsack ban jaata hai aur galat (aksar zyada) answer deta hai. **Fix:** Pehle 2D version likho jahan rows explicitly alag hain, phir compress karo — aur compression ke baad verify karo ki har read intended row se aa raha hai.
- **Wrong assumption:** Pseudo-polynomial O(A·C) ka matlab efficient hai. **Why it breaks:** A input ki **numeric value** hai, uski encoding length nahi. Amount 10⁹ par `Array(10⁹)` allocate karna memory mein fail karega, chahe "polynomial" likha ho. Subset-sum/knapsack NP-hard hain exactly isi wajah se. **Fix:** Constraints dekho. Value bada hai lekin items kam hain toh meet-in-the-middle ya top-down memo (sirf reachable states) better ho sakta hai. Complexity bolte waqt "pseudo-polynomial in A" explicitly kaho.
- **Wrong assumption:** Rolling-array optimization hamesha free hai. **Why it breaks:** Sirf do rows rakhoge toh **reconstruction impossible** ho jaata hai — actual coin list, actual subsequence, actual edit script nikalne ke liye purani rows chahiye. Aur kabhi-kabhi answer khud multiple rows par depend karta hai (jaise `dp[i-2]`), jise do-row scheme silently todh deti hai. **Fix:** Pehle decide karo ki value chahiye ya solution. Solution chahiye toh poora table rakho (ya Hirschberg-style divide-and-conquer reconstruction use karo); value chahiye tabhi compress karo.
- **Wrong assumption:** Top-down memoization aur bottom-up tabulation hamesha interchangeable hain. **Why it breaks:** Top-down sirf reachable states evaluate karta hai — sparse state space par yeh massively better hai (coins `[100]`, amount 10⁶: 10⁴ states versus 10⁶). Lekin usme recursion depth O(A) tak ja sakti hai aur JavaScript mein stack overflow deta hai. Bottom-up stack-safe hai aur space compression allow karta hai, lekin har state evaluate karta hai. **Fix:** Reachable state density aur recursion depth dono estimate karke choose karo, aur apni choice ka reason interview mein bolo.
- **Wrong assumption:** Greedy kaam kar raha hai kyunki saare test cases pass ho rahe hain. **Why it breaks:** Greedy ki correctness proof maangti hai (exchange argument), test cases nahi. Coin change par greedy `[1, 5, 10, 25]` par sahi hai aur `[1, 3, 4]` par galat — aur galat case dhoondhne ke liye specific input chahiye. Production mein yeh "mostly correct" bug ban jaata hai. **Fix:** Ya greedy ke liye exchange argument likho ("optimal solution ko greedy choice ke saath swap karne se woh worse nahi hota"), ya DP use karo. Proof na de pao toh greedy claim mat karo.

## Where this shows up in real systems

Edit distance ka production footprint sabse bada hai: `git diff` aur har code-review diff view LCS-based algorithms par chalte hain, spell checkers aur search engines ke "did you mean" suggestions edit distance se aate hain, aur bioinformatics mein sequence alignment (Needleman–Wunsch, Smith–Waterman) literally yeh recurrences hain — wahan Hirschberg's linear-space technique zaroori ho jaati hai kyunki sequences millions of characters lambi hoti hain.

Resource allocation knapsack ka hi shape hai: ad auction mein budget ke andar best bids chunna, cloud mein instance packing, aur build/CI mein limited runners par jobs schedule karna. Pricing aur inventory optimization mein multi-stage decision problems DP se solve hote hain.

Text processing mein Viterbi algorithm (hidden Markov models ke liye) speech recognition aur part-of-speech tagging mein use hota hai — woh ek DP over states and time steps hai. Query optimizers database mein join order choose karne ke liye DP use karte hain (System R ka classic algorithm bitmask DP over relation subsets hai — wahi "n ≤ 20 par 2ⁿ acceptable hai" wali reasoning). Aur regex engines ke NFA simulation aur wildcard matching bhi DP tables par chalte hain, jo backtracking-based engines ke catastrophic worst case ko avoid karte hain.

Interview-level lesson jo production mein bhi lagta hai: caching aur DP ek hi cheez ke do naam hain, aur dono mein sabse costly bug **incomplete cache key** hai — chahe woh DP state ho ya HTTP response cache jisme `Accept-Language` shaamil karna bhool gaye.

## Practice and answer

**Prompt:** Coins `[2]`, amount 3 aur amount 0 ke answers kya hain?

**Answer:** `-1` aur `0`. Zero coins amount zero banate hain; unreachable states ko zero initialize karna false solutions introduce karega.

**Prompt:** House robber mein state aur recurrence define karo.

**Answer:** `best[i]` first i houses se best non-adjacent total hai. Current house skip karo `best[i-1]`, ya take karo `value[i-1] + best[i-2]`; maximum choose karo. Empty prefix zero hai, aur rolling two values se O(1) auxiliary space possible hai when only amount required.

**Prompt:** LIS ke liye state "first i elements ki LIS length" define kiya. Kyun kaam nahi karega?

**Answer:** Kyunki `nums[i]` ko extend karne ka decision lene ke liye tumhe previous subsequence ka **last element** pata hona chahiye, aur woh information is state mein hai hi nahi. Do alag subsequences ki length same ho sakti hai lekin tails alag — aur future decisions tail par depend karte hain. Correct state "index i par **end** hone wali LIS length" hai, jo tail ko implicitly fix kar deti hai. Yeh "state must determine the remaining decisions" wale rule ka direct demonstration hai.

**Prompt:** 0/1 knapsack ka 1D loop ascending kar diya. Kya hoga, aur kaise pakdoge?

**Answer:** Woh unbounded knapsack ban jayega — ek hi item multiple baar count ho jayega, aur answer optimal se **zyada** aayega. Pakadne ka fastest test: ek single item (weight 3, value 10) aur capacity 9 lo. Correct 0/1 answer 10 hai; ascending loop 30 dega (item teen baar). Root cause yeh hai ki ascending order mein `dp[c - weight]` current item ke liye already update ho chuka hota hai, so tum "previous row" ki jagah "current row" padh rahe ho.

**Prompt:** Ek DP solution likha jo sahi lag raha hai lekin ek edge case par galat answer de raha hai. Bina debugger ke kaise verify karoge?

**Answer:** Brute-force reference implementation likho (chhote inputs par exponential chalega, koi baat nahi) aur dono ko chhote random inputs par compare karo — yeh "differential testing" hai aur DP bugs pakadne ka sabse reliable tarika hai. Manual verification ke liye chhoti table haath se bharo aur har cell ke liye poocho ki uska value kis state se aaya. Ek check base cases par focus karo, kyunki DP bugs ka bada fraction wahin hota hai (`dp[0]` ko 0 vs Infinity, `dp[i][0] = i` vs 0). Aur unreachable states ko sentinel (`Infinity`/`-1`) se initialize karo, `0` se nahi — `0` ek valid-dikhne wala answer hai jo silently propagate hota hai.

**Prompt:** Amount 10⁹ aur 5 coin denominations. `O(A*C)` DP kyun fail karega aur kya alternative hai?

**Answer:** `Array(10⁹ + 1)` roughly gigabytes memory maangta hai — allocation hi fail hogi. Yeh pseudo-polynomial complexity ka practical consequence hai: A input ki numeric value hai, uski encoding length (~30 bits) nahi. Alternatives: top-down memoization jo sirf **reachable** states chhuta hai (agar denominations bade hain toh reachable states bahut kam hain), number-theoretic approach (Chicken McNugget / Frobenius reasoning chhote denomination sets par), ya problem constraints ko dobara clarify karna — aisa input aksar signal hota hai ki intended solution DP hai hi nahi.

**Prompt:** Interviewer poochta hai "LIS ka O(n log n) solution aata hai?" Tum O(n²) likh chuke ho. Best response kya hai?

**Answer:** Patience-sorting approach describe karo: `tails[k]` = length k+1 wali increasing subsequence ka smallest possible tail, aur har element ke liye binary search se uski jagah replace karo. Saath mein do nuances bolo — (1) `tails` array **LIS nahi hai**, sirf uski length meaningful hai; (2) actual subsequence reconstruct karna is version mein extra index tracking maangta hai, jabki O(n²) version mein parent pointers se trivial hai. Agar n ≤ 1000 hai toh O(n²) version ship karna genuinely better engineering ho sakta hai. Yeh answer algorithm knowledge aur judgment dono dikhata hai.

## Capstone: prove an optimized solution

Teen problems implement karo: negative values ke saath target-sum subarrays count, nonnegative weights ke shortest paths, aur 0/1 knapsack. Har problem ke liye small inputs par simple exhaustive/slower reference solver bhi rakho.

### Acceptance criteria

- Code se pehle invariant/recurrence aur uski input assumptions likho.
- Target-sum count mein empty input, zero target, repeated prefix sums aur negatives check karo.
- Shortest paths mein disconnected nodes, parallel edges, zero weights aur stale heap entries check karo. Unsupported negative weights reject karo ya suitable algorithm ko route karo.
- Knapsack mein same item do baar select nahi hona chahiye. Ek item aur uske weight se double capacity lekar descending iteration ka reason dikhao.
- Small inputs enumerate karo ya seeded random inputs par optimized/reference answers compare karo.
- Time aur auxiliary space mein recursion stack, heap duplicates aur preprocessing bhi include karo.

### Interview defense

Tempting wrong algorithm ka counterexample do, phir repairing invariant samjhao. Ek example hand-trace karo aur numeric bounds batao. Stretch task: chosen path/items reconstruct karo; memory optimization ke baad kaunsa extra reconstruction data chahiye, explain karo.

## Research notes: Numeric magnitude can dominate DP

O(nW) knapsack numeric capacity W par depend karta hai. W ko binary mein likhne ke liye lagbhag log2(W) bits chahiye. Isliye yeh pseudopolynomial complexity hai: number ki value aur encoded input length alag hain.

100 items aur capacity one billion par lagbhag 100 billion state visits honge. Table allocate karne se pehle constraints check karo. Value-based state, approximation ya smaller-item-count approach chahiye ho sakta hai.

**Interview check:** Huge capacity ke liye sirf DP memory kam karna kaafi kyun nahi?

**Answer:** O(nW) storage ko O(W) karne se O(nW) time nahi badalta. Dono estimate karo. Total value ko dimension banana ya smaller item count use karna feasibility badal sakta hai.

**Practice:** Same item count aur millionfold different capacities ka work compare karo.

[Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### State ka meaning recurrence se pehle define karo

0/1 knapsack mein dp[i][capacity] first i items se best value represent kar sakta hai. Item i choose karo toh previous-row remaining capacity use hoti hai, taaki same item repeat na ho. One-dimensional optimization mein capacity descending iterate karna isi dependency ko preserve karta hai. Ascending update same item reuse karke unbounded variant ban sakti hai.

Minimum coins, number of combinations aur number of ordered sequences same input par different transitions/loop orders maangte hain. State meaning mix karne se plausible number wrong question answer karta hai. Base zero amount ka result min-coins mein 0, count-combinations mein 1 empty choice ho sakta hai.

**Practice:** Tiny amount/items brute-force enumerate karo. Optimized answer ke saath reconstruction chahiye toh parent/choice storage plan karo; compressed memory se lost decisions automatically recover nahi hote. Complexity reachable states × per-state transition cost se derive karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Nonnegative house values `[2,7,9,3,1]` ke liye maximum nonadjacent sum nikalo. State define karke har prefix ka answer likho.

> **Hint — chhota ishara:** Current house skip karne aur use lene plus do positions pehle ka best answer compare karo.

**Answer guide — pehle khud karo, phir compare karo:** `best[i]` first i houses ka best sum hai. best[0]=0 se prefix answers 2, 7, 11, 11, 12 milte hain. Final 12. Recurrence `max(best[i-1], value[i-1]+best[i-2])` hai; first house ka base case alag handle karo. Empty input ka answer 0 hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[Princeton's recursion and dynamic programming discussion](https://introcs.cs.princeton.edu/java/23recursion/) repeated recursive work aur memoization ko cover karta hai. [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/) states × work-per-state wale cost model ko support karta hai. Coin-change, knapsack, LIS aur edit-distance recurrences aur unke derivations original exercises hain.

## Is concept ko aur practice karo

- [Greedy aur intervals — choice ka proof aur boundary ka contract](13-greedy-intervals.md)
- [Tries, bitmasks aur range queries — advanced structures ka practical bridge](14-tries-range-bits.md)
