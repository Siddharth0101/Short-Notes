---
id: interview-dsa
title: DSA problem solving interview playbook
track: interview
order: 5
level: Intermediate
minutes: 31
summary: Algorithm ko fast bolne se pehle prove karo ki woh requested answer sahi nikalta hai.
tags: dsa, interview, problem-solving, complexity, practice
visual: dynamic-programming
---

## Mental model — simple soch

Coding interview mein interviewer ko tumhara reasoning inspect karna hota hai. Har line narrate karne ke bajaye assumptions, invariant aur tradeoff communicate karo. Correct brute force ek useful baseline hai; optimization tab meaningful hai jab lost repeated work clearly identify kar sako.

> **Core takeaway:** Algorithm ko fast bolne se pehle prove karo ki woh requested answer sahi nikalta hai.

## A 35-minute structure

| Time | Work | Deliverable |
| --- | --- | --- |
| 0–4 minutes | Clarify input/output and constraints | Concrete examples and edge cases |
| 4–8 minutes | Brute force and bottleneck | Correct baseline complexity |
| 8–14 minutes | Choose invariant/data structure | Why discarding or caching is safe |
| 14–27 minutes | Implement | Coherent code with explicit contract |
| 27–35 minutes | Trace and analyze | Adversarial examples and time/space |

Constraint questions genuinely matter: sorted input, duplicates, negative values, mutation permission, and output indices versus values solution choice change karte hain. Problem statement already answer de raha ho to repeated clarification se time waste mat karo.

## Representative questions and answers

**What makes binary search applicable?** Search predicate monotone hona chahiye. Sorted numeric array one example hai; minimum feasible capacity another. Har iteration invariant preserve karke unknown interval strictly reduce kare.

**Why is a nested loop sometimes O(n)?** Agar inner loop monotone pointer/stack items consume karta hai aur each item at most once process hota hai, total movement O(n) ho sakta hai. Per-iteration maximum multiply karna loose bound ho sakta hai; aggregate actual work count karo.

**Why choose BFS for minimum jumps?** Jab each valid transition ka equal cost hai, BFS layers transition count represent karte hain. Weighted costs ho to first discovered path cheapest necessarily nahi; graph constraints se algorithm choose karo.

**How do you start DP?** State ko sentence mein define karo: `dp[a]` exact amount a banane ke minimum coins. Last choice enumerate karo, base case define karo, dependency order choose karo. Memoization add karne se wrong recurrence correct nahi hoti.

**When would you pick an O(n log n) solution over an O(n) one?** Jab O(n) wale solution ki hidden costs decision badal dein. Teen common cases: (1) **Space** — k-th largest ke liye quickselect O(n) expected hai lekin poora array memory mein maangta hai aur usse mutate karta hai, jabki size-k heap O(n log k) time aur sirf O(k) space leta hai, so ek billion-event stream par heap hi feasible hai. (2) **Worst-case guarantee** — quickselect ka worst case O(n²) hai aur hashing ka O(n) (adversarial collisions); latency SLO wale system mein guaranteed O(n log n) probabilistic O(n) se better hai, yehi reason hai ki C++ ka introsort depth limit par heapsort par switch karta hai. (3) **Constant factors aur cache behavior** — hash set ka O(1) lookup pointer chasing aur hash computation ke saath aata hai, jabki sorted array par binary search contiguous memory par chalta hai aur saath mein range/predecessor queries bhi free deta hai. Interview answer ka shape: "asymptotically X better hai, lekin in constraints mein Y choose karunga kyunki…" — bound aur constraint dono name karo.

**How do you verify correctness without running the code?** Char layers use karo. (1) **Invariant** — loop ke har iteration ke baad kya true rehta hai, aur termination par woh invariant answer kaise deta hai. Binary search mein: "left se pehle sab target se chhote hain, right se onward sab `>=` hain," so `left === right` par wahi first feasible position hai. (2) **Progress measure** — koi nonnegative quantity name karo jo har iteration mein strictly decrease ho, taaki termination guarantee ho (interval width, remaining length, unvisited count). (3) **Hand-trace ek adversarial example** — empty input, single element, saare duplicates, saare negative, already sorted. Bug ka bada fraction base cases aur boundaries mein hota hai, middle logic mein nahi. (4) **Ek independent second method se cross-check** — BST validation ko bounds-recursion se bhi karo aur inorder-increasing check se bhi; do independent approaches ka same answer strongest available evidence hai jab compiler paas nahi hai. Brute-force reference likh kar chhote random inputs par compare karna (differential testing) bhi yahi idea hai.

**Given a set of constraints, how do you choose between two data structures?** Structure ko uske **supported operations** se choose karo, uske naam se nahi. Concretely, LRU cache ke liye akela hash map kaafi nahi hai — woh O(1) lookup deta hai lekin recency ordering nahi rakhta, so eviction O(n) scan maangta hai; akeli doubly linked list ordering rakhti hai aur held node par O(1) removal deti hai, lekin key se node dhoondhna O(n) hai. Dono ko synchronized rakhne se dono operations O(1) ho jaate hain. Yehi pattern indexed heap (heap + position map) aur database secondary indexes mein hai. Doosra example: heap versus balanced BST — dono "ordered" hain, lekin heap sirf extract-min deta hai (arbitrary search O(n)) jabki BST search, range aur successor bhi deta hai; agar sirf "next highest priority" chahiye toh heap ka chhota constant factor jeetta hai. Decision procedure: required operations list karo, har candidate ke liye unka cost likho, phir binding constraint (memory, worst-case latency, streaming versus in-memory, mutation allowed ya nahi) se tie todo.

**Why is a monotonic stack O(n) when it has a nested while loop?** Kyunki per-iteration worst case ko n se multiply karna loose bound deta hai; sahi method **lifetime events count karna** hai. Har index exactly ek baar push hota hai, aur ek baar pop hone ke baad woh stack mein kabhi wapas nahi aata — so poore run mein at most n pops hain. Total operations = n pushes + ≤ n pops = O(n), chahe koi ek iteration O(n) pops kar le. Yahi aggregate argument teen aur jagah repeat hota hai: dynamic array resize (geometric growth se total copies < 2n), two-stack queue (har item lifetime mein ek baar transfer), aur variable sliding window (left aur right dono monotonically aage badhte hain, total ≤ 2n moves). Saath mein yeh bhi bolo ki amortized O(1) aur worst-case O(1) alag guarantees hain — ek individual operation abhi bhi O(n) ho sakta hai, jo p99 latency wale systems mein matter karta hai.

**Why does Dijkstra break on negative edges, and what breaks exactly?** Dijkstra ka core claim yeh hai: jab heap se sabse chhoti tentative distance wala node pop hota hai, uska distance **final** hai. Proof: us node tak koi aur path kisi abhi-unsettled node se hoke jayega, jiski tentative distance already isse badi ya barabar hai — aur nonnegative weights ke kaaran aage jaakar total ghat nahi sakta. Ek negative edge is last step ko todh deta hai: badi tentative distance wala node baad mein chhota total de sakta hai, lekin already-settled node dobara visit nahi hota. Result silently galat aata hai, exception nahi — isiliye "negative weights possible hain?" ek zaroori clarifying question hai. Alternatives: DAG ho toh topological-order relaxation (O(V + E), negative weights bhi handle karta hai), general graph par Bellman–Ford (O(VE), aur reachable negative cycles detect kar leta hai). Negative cycle ho toh shortest path **define hi nahi** hota, kyunki cycle repeat karke cost unbounded neeche ja sakti hai — yeh distinction bhi bolna chahiye.

## Worked coding drill

Longest substring without repeated Unicode code points ki length return karo. Code-point indexing ke liye input ko array mein convert kiya hai; grapheme clusters ka contract alag hoga.

```js
function longestUnique(text) {
  const chars = [...text];
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < chars.length; right++) {
    const previous = lastSeen.get(chars[right]);
    if (previous !== undefined) left = Math.max(left, previous + 1);
    lastSeen.set(chars[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

Invariant: `[left, right]` mein repeated characters nahi. Previous occurrence current window ke bahar ho to `left` backward nahi jaana chahiye. Typical hashing assumption par expected O(n) time; converted character array plus map O(n) auxiliary space. “Only map O(k)” bolkar initial conversion ignore mat karo.

## Self-review rubric

Each 0–2 score: problem contract, correctness argument, implementation, complexity, validation. Wrong approach early catch karke fix karna useful signal hai. Code finish na ho to remaining plan aur current invariant clear rakho; unverified solution ko complete claim mat karo.

## Practice and answer

**Prompt:** `longestUnique('abba')` kya return karega aur common bug kya hai?

**Answer:** 2. Second b left ko 2 par move karta hai; final a ka previous index 0 left ko backward 1 par nahi la sakta. `Math.max` isi regression ko prevent karta hai.

**Prompt:** Next-day revision mein same problem repeat karna ya new problem?

**Answer:** Pehle missed invariant ko blank editor mein reproduce karo, phir similar pattern ka changed constraint solve karo. Pattern transfer verify karo, exact code memorization nahi.

## Assessed mock: Algorithm reasoning round

**Prompt:** Negatives ke saath target-sum subarrays solve karo; phir weighted/unweighted graph ke shortest-path approaches compare karo.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Repeated prefix sums, disconnected vertices aur misleading first-discovered weighted path do.

**Strong-answer evidence:** Invariant, wrong approach ka counterexample, accurate complexity aur reference-solver checks dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Prove before optimizing

Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

**Original practice round:** Sorted array mein first position nikalo jahan value target se kam nahi. Half-open interval aur har iteration ke baad possible answer range define karo.

**Failure injection:** Empty input, all-equal values, missing target aur dono ends ke bahar targets do.

**Evidence to bring:** Shrinking interval trace karo, discarded regions justify karo, O(log n) time aur constant auxiliary space explain karo. Ek output example full correctness proof nahi hai.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Aath minute mein list ki first repeated value nikalo; complexity aur test cases defend karo. Extra memory forbidden ho toh kya badlega?

> **Hint:** Input modify kar sakte ho ya nahi, aur original scan order important hai ya nahi, pehle clear karo.

**Answer guide — compare after attempting:** Set scan expected O(n) time, O(n) space mein first-repeat order bachata hai. Empty, distinct aur multiple-repeat cases test karo. Extra memory aur mutation dono allowed na hon toh repeated scans O(n²) time, O(1) extra space lete hain. Sorting order badal deti hai, isliye first-repeat semantics directly preserve nahi hoti.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[Princeton's analysis](https://algs4.cs.princeton.edu/14analysis/) aur [graph traversal reference](https://algs4.cs.princeton.edu/41graph/) complexity and BFS properties support karte hain. The mock process and drills original practice material hain.
