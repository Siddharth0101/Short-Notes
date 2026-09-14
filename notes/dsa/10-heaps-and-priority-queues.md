---
id: dsa-heaps
title: Heaps and priority queues
track: dsa
order: 10
level: Intermediate
minutes: 33
summary: Size-k min-heap ab tak dekhi gayi k largest values rakh sakta hai; root retained values mein sabse chhota hota hai.
tags: heap, priority-queue, top-k, heapify
---

## Mental model — simple soch

Priority queue ka contract hai “next highest-priority item do.” Binary min-heap is contract ko complete binary tree mein implement karta hai: har parent apne children se smaller ya equal hai. Root minimum hai, lekin siblings ya unrelated subtrees globally sorted nahi hote.

Array index `i` ke children `2*i + 1` aur `2*i + 2`, parent `floor((i - 1)/2)` hote hain. Complete shape tree ki height O(log n) rakhti hai. Insertion last position par karke bubble up karo; extraction mein last item root par laakar sink down karo.

> **Core takeaway:** Size-k min-heap ab tak dekhi gayi k largest values rakh sakta hai; root retained values mein sabse chhota hota hai.

## A numeric min-heap

```js
class MinHeap {
  values = [];
  get size() { return this.values.length; }
  peek() { return this.values[0]; }

  push(value) {
    const a = this.values;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }

  pop() {
    const a = this.values;
    if (a.length === 0) return undefined;
    const minimum = a[0];
    const last = a.pop();
    if (a.length === 0) return minimum;
    a[0] = last;
    let i = 0;
    while (2 * i + 1 < a.length) {
      let child = 2 * i + 1;
      if (child + 1 < a.length && a[child + 1] < a[child]) child++;
      if (a[i] <= a[child]) break;
      [a[i], a[child]] = [a[child], a[i]];
      i = child;
    }
    return minimum;
  }
}
```

Finite comparable numbers assume kiye hain; NaN se ordering fail hogi. Peek O(1), push/pop O(log n) worst-case heap-repair work, storage O(n). Backing dynamic array ki allocation policy occasional resize cost add kar sakti hai. External code ko `values` directly mutate karne dena production API mein avoid karo.

## Top k and scheduling

Largest k elements ke liye size-k min-heap rakho. Heap full hone par incoming item root se small/equal ho to discard kar sakte ho; larger ho to root replace karo. O(n log k) time, O(k) space; final sorted output ke liye O(k log k) additional work ho sakta hai.

```js
function topK(nums, k) {
  const heap = new MinHeap();   // MIN-heap for the k LARGEST — counterintuitive but key
  for (const n of nums) {
    if (heap.size < k) { heap.push(n); continue; }
    if (n > heap.peek()) {      // root = k candidates ka sabse chhota
      heap.pop();               // usse nikalo, naya bada daalo
      heap.push(n);
    }
  }
  return heap.values;           // k largest, unsorted
}
```

Min-heap kyun, max-heap kyun nahi — yeh question interview mein literally poochha jaata hai. Hum k largest rakhna chahte hain, isliye hume har naye element ko **apne current k candidates ke sabse kamzor** se compare karna hai, taaki usse replace kiya ja sake. Min-heap ka root exactly wahi weakest candidate hai, O(1) mein available. Max-heap ka root sabse strong candidate hota, jo kabhi evict nahi karna — useless for this operation.

Complexity comparison jo poori tarah bolni chahiye:

| Approach | Time | Space | Best when |
| --- | --- | --- | --- |
| Sort, then take last k | O(n log n) | O(n) | Output vaise bhi sorted chahiye, ya kai alag k |
| Size-k heap | O(n log k) | O(k) | k ≪ n, ya data streaming hai |
| Quickselect | O(n) expected, O(n²) worst | O(1) | Poora array memory mein hai, mutation allowed |

Heap ka O(k) space hi uska decisive advantage hai jab n huge ho — ek billion-event stream se top 100 nikalne ke liye tumhe billion elements store karne ki zaroorat nahi.

Scheduler priority ke saath insertion sequence store kar sakta hai taaki equal-priority jobs deterministic FIFO order follow karein. Priority mutate karne ke baad heap automatically repair nahi hota. Update operation do, remove/reinsert karo, ya versioned entries ke saath stale ones skip karo.

```js
// Tie-break by insertion order: heap comparator do fields dekhta hai.
let sequence = 0;
const entry = { priority, seq: sequence++, task };
const before = (a, b) => a.priority - b.priority || a.seq - b.seq;
```

Bina `seq` ke equal-priority jobs ka order heap ke internal swaps par depend karta hai — undefined aur run-to-run inconsistent. Yeh production schedulers mein real bug source hai ("same priority ki jobs random order mein chal rahi hain").

### Lazy deletion: how Dijkstra-style updates really work

Binary heap arbitrary element ko efficiently update nahi kar sakta — usko dhoondhna hi O(n) hai. Do practical solutions hain:

```js
// Approach 1: lazy deletion — stale entries push karo, pop par skip karo.
const best = new Map();                 // node -> best known distance
heap.push({ node, dist });              // purani entry heap mein padi rehti hai
// ...
const { node, dist } = heap.pop();
if (dist > (best.get(node) ?? Infinity)) continue;  // stale, ignore karo
```

Lazy approach mein heap size O(E) tak ja sakta hai (har relaxation ek entry), so space O(E) aur time O((V + E) log E). Code simple hai aur practice mein fast hai.

**Approach 2: indexed heap.** Ek `position` map rakho jo har element ki current heap index batata hai, aur usse swaps ke dauran update karte raho. Tab `decreaseKey(element, newValue)` O(log n) mein possible hai: value update karo aur bubble up karo. Heap size O(V) bounded rehta hai, so O((V + E) log V).

Interview mein dono bolna strong hai: "main lazy deletion use karunga kyunki code chhota hai aur sparse graphs par fast hai; agar memory tight hai ya dense graph hai toh indexed heap se heap size O(V) bound kar sakte hain." Yeh implementation-aware answer hai, na ki textbook bound repeat karna.

### Two heaps for a running median

Ek elegant pattern jo dikhata hai ki heap sirf "min ya max" ke liye nahi hai:

```js
class MedianStream {
  #low = new MaxHeap();    // chhoti aadhi values, root = unme se sabse badi
  #high = new MinHeap();   // badi aadhi values, root = unme se sabse chhoti

  add(value) {
    if (this.#low.size === 0 || value <= this.#low.peek()) this.#low.push(value);
    else this.#high.push(value);

    // Invariant: sizes at most 1 se differ karein, low >= high.
    if (this.#low.size > this.#high.size + 1) this.#high.push(this.#low.pop());
    else if (this.#high.size > this.#low.size) this.#low.push(this.#high.pop());
  }

  median() {
    if (this.#low.size === 0) return undefined;
    return this.#low.size > this.#high.size
      ? this.#low.peek()
      : (this.#low.peek() + this.#high.peek()) / 2;
  }
}
```

Invariant do parts ka hai: (1) `low` ke saare elements `high` ke saare elements se `<=` hain, aur (2) sizes at most 1 se differ karte hain. Dono milkar guarantee karte hain ki median hamesha **roots par** hai — beech ka element ya do beech ke elements exactly heap tops hain.

`add` O(log n), `median` O(1). Naive approach har query par sort karta (O(n log n) per query) ya sorted array maintain karta (insertion O(n)). Yeh pattern real systems mein latency percentile tracking jaisa hi hai, aur interview mein "kaunsa structure choose karoge aur kyun" ka clean demonstration deta hai.

## Why bottom-up heapify is linear

Array ke last internal node se root tak sink-down run karo. Most nodes leaves ke near hain aur hardly move karte hain; height h par roughly n/2^(h+1) nodes hain. Total work ka bound sum `n*h/2^(h+1)` hai, jo O(n) hai. Har node ko independently O(log n) assign karke O(n log n) bolna valid loose bound hai, lekin tight result miss karta hai.

```js
function heapify(a) {
  // Last internal node = parent of the last element.
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) sink(a, i, a.length);
  return a;
}

function sink(a, i, size) {
  while (2 * i + 1 < size) {
    let child = 2 * i + 1;
    if (child + 1 < size && a[child + 1] < a[child]) child++;
    if (a[i] <= a[child]) break;
    [a[i], a[child]] = [a[child], a[i]];
    i = child;
  }
}
```

Intuition ko numbers ke saath dekho: n = 1000 ke tree mein roughly 500 nodes leaves hain (0 work), 250 nodes ek level upar (at most 1 swap), 125 nodes do level upar (at most 2 swaps), aur sirf 1 root hai jo at most 10 swaps kar sakta hai. Bulk of the nodes bulk of the work nahi karte — yahi reason hai ki sum converge ho jaata hai.

Isliye "n elements ko heap mein daalna" ke do alag costs hain: n individual `push` calls O(n log n) lete hain, jabki array ko bottom-up `heapify` karna O(n) leta hai. Agar saara data pehle se available hai toh heapify strictly better hai. Streaming data par push ke alawa choice nahi hai. Yeh distinction interview mein aksar miss hoti hai.

## Heapsort: sorting with the same primitive

```js
function heapSort(values) {
  const a = [...values];
  buildMaxHeap(a);                       // O(n)
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];     // max ko uski final jagah par bhejo
    sinkMax(a, 0, end);                  // bacha hua heap repair karo — O(log n)
  }
  return a;                              // ascending order
}
```

Max-heap (min nahi) isliye use hota hai ki hum sabse bada element array ke **end** par bhejna chahte hain, jahan woh permanently settle ho jaata hai — aur heap ka region ek-ek karke shrink hota jaata hai. Ek hi array dono cheezein hold karti hai: prefix mein heap, suffix mein sorted output.

Complexity: build O(n) + n extractions × O(log n) = **O(n log n) worst case guaranteed**, aur auxiliary space O(1) (yeh wrapper copy ke alawa). Merge sort ko O(n) extra memory chahiye; quicksort ka worst case O(n²) hai. Heapsort dono weaknesses avoid karta hai.

Phir bhi production sorts heapsort ko default nahi banate, kyunki uska memory access pattern jumpy hai (`i → 2i+1`), jo cache-hostile hai — quicksort ka sequential partition scan practically 2–3× tez hota hai. Isiliye C++ ka introsort quicksort se shuru karta hai aur **sirf** tab heapsort par switch karta hai jab recursion depth suspicious ho jaaye: average-case speed bhi mil gayi aur worst-case guarantee bhi. Yeh "best asymptotics ≠ best choice" ka ek precise example hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Heap ka array sorted hota hai, ya kam se kam partially sorted order deta hai. **Why it breaks:** Heap property sirf **parent-child** relation par constraint lagati hai, siblings ya cousins ke beech koi order nahi hai. `[2, 5, 3, 9, 7]` valid min-heap hai lekin sorted nahi. `heap.values` ko sorted output ki tarah return karna silently galat hai. **Fix:** Sorted output chahiye toh sab elements pop karo (O(n log n)) ya heapsort chalao. Aur "heap se k-th element read kar lunga index se" wali soch bhi isi galatfehmi se aati hai.
- **Wrong assumption:** k largest elements ke liye max-heap use karna chahiye. **Why it breaks:** Max-heap ka root sabse bada candidate hai, jise tum kabhi evict nahi karoge — operation jo chahiye woh hai "current k candidates mein se sabse kamzor nikalo", aur woh min-heap ka root hai. Max-heap ke saath tumhe poore n elements heap mein daalne padenge (O(n) space) aur k baar pop karna padega. **Fix:** k **largest** ke liye size-k **min**-heap; k **smallest** ke liye size-k **max**-heap. Ulta lagta hai, isliye har baar ek line mein reason bolo.
- **Wrong assumption:** Heap mein rakhe object ki priority field change karne se heap khud ko fix kar lega. **Why it breaks:** Heap ek passive array hai — usse pata hi nahi chalta ki koi stored value badal gayi. Heap property silently violate ho jaati hai aur `pop` galat element return karta rehta hai, bina kisi error ke. **Fix:** Explicit `decreaseKey`/`increaseKey` operation do (indexed heap ke saath), ya remove-and-reinsert karo, ya lazy deletion use karo (naya entry push karo aur pop par stale entries skip karo).
- **Wrong assumption:** n elements se heap banane ka cost O(n log n) hai. **Why it breaks:** Yeh sirf tab sach hai jab tum n individual `push` calls karo. Agar poora array pehle se hai toh bottom-up `heapify` O(n) mein kaam karta hai, kyunki zyaadatar nodes leaves ke paas hain aur bilkul move nahi karte. **Fix:** "n pushes: O(n log n); bulk heapify of an existing array: O(n)" — dono ko alag se state karo, aur jo data available hai uske hisaab se choose karo.
- **Wrong assumption:** Equal-priority items FIFO order mein nikalenge. **Why it breaks:** Heap ties ko kisi defined order mein nahi rakhta — output internal swap sequence par depend karta hai, jo input order ke saath badal jaata hai. Scheduler mein yeh "same priority ki jobs random order mein chal rahi hain" wale non-deterministic bug ban jaata hai. **Fix:** Comparator mein insertion sequence number ko tie-breaker banao (`a.priority - b.priority || a.seq - b.seq`).
- **Wrong assumption:** Heap mein arbitrary value search O(log n) hai, BST ki tarah. **Why it breaks:** BST ka ordering har node par ek poora subtree discard karne deta hai. Heap ka parent-child rule aisi koi left/right partition nahi deta — target kisi bhi subtree mein ho sakta hai, so worst case O(n) full scan. **Fix:** Membership/lookup chahiye toh heap ke saath ek hash map rakho (position ya existence ke liye), ya balanced BST/sorted structure use karo. Heap ka contract sirf "extract-min/max" hai, "search" nahi.

## Where this shows up in real systems

Operating system aur runtime schedulers priority queues par chalte hain: task priorities, timer wheels, aur event loops ke `setTimeout` callbacks (Node ka timer implementation earliest-deadline ordering maintain karta hai). Har "next deadline kya hai" wali query heap ka classic case hai.

Dijkstra ka priority queue network routing (OSPF), maps/navigation aur game pathfinding (A*, jo Dijkstra ka heuristic-guided version hai) mein directly production code hai. Wahin lazy-deletion versus indexed-heap ka trade-off bhi real hai.

Data infrastructure mein heaps k-way merge ka engine hain: external merge sort aur LSM-tree compaction dono k sorted runs ko ek size-k heap se merge karte hain (har run ka current head heap mein, sabse chhota nikalo, us run ka agla element push karo). Yeh exactly O(n log k) hai aur memory O(k) — isiliye terabytes of data thodi si RAM mein sort ho jaata hai.

Observability mein two-heap median pattern aur top-k heaps roz use hote hain: "top 10 slowest endpoints", "top error signatures", rolling percentile approximations. Rate limiters aur connection pools bhi earliest-expiry ordering ke liye heaps use karte hain.

## Practice and answer

**Prompt:** Min-heap `[2, 5, 3, 9, 7]` se minimum pop karne ke baad ek valid array kya hai?

**Answer:** Last value 7 root par aayegi, smaller child 3 ke saath swap hoga: `[3, 5, 7, 9]`. Entire array sorted hona required nahi.

**Prompt:** Heap se arbitrary value lookup O(log n) kyun nahi?

**Answer:** Parent-child rule BST jaise left/right range nahi deta. Root se target comparison generally ek subtree discard nahi kar sakta, so worst-case O(n) scan chahiye.

**Prompt:** Ek billion events ka stream hai aur top 100 highest-value events chahiye. Kaunsa approach aur kyun?

**Answer:** Size-100 min-heap. Time O(n log k) jahan k = 100 (log 100 ≈ 7, effectively linear), aur space O(k) — sirf 100 elements memory mein. Sorting O(n log n) hai aur usse poore billion elements store karne padenge, jo feasible hi nahi. Quickselect O(n) expected hai lekin usse bhi poora array chahiye, so streaming setting mein applicable nahi. Yahan decisive constraint space hai, time nahi — yeh explicitly bolna important hai.

**Prompt:** Heap mein pade ek task ki priority badal gayi. Heap ko kaise sync karoge?

**Answer:** Heap automatically detect nahi karta — heap property silently violate ho jaati hai. Teen options hain: (1) lazy deletion — naya entry current priority ke saath push karo, aur pop par check karo ki entry stale hai ya nahi (simple, heap size O(number of updates) tak badh sakta hai); (2) indexed heap — ek `element → heap index` map maintain karo taaki `decreaseKey` O(log n) mein ho sake (heap size bounded, code complex); (3) remove-and-reinsert, jo bina index map ke O(n) search maangta hai. Practice mein lazy deletion sabse common hai.

**Prompt:** Heapsort ka worst case O(n log n) guaranteed hai aur space O(1) hai. Phir V8 aur Java default mein Timsort kyun use karte hain?

**Answer:** Do reasons. Pehla, cache behavior: heapsort ka `i → 2i+1` access pattern memory mein jump karta hai, jabki merge/quick sort largely sequential scans karte hain — real hardware par yeh 2–3× ka farak hai jo asymptotics mein nahi dikhta. Doosra, stability: Timsort stable hai (objects ke liye required) aur partially-sorted real data par O(n) tak gir jaata hai, jo heapsort kabhi nahi karta. Heapsort ka role worst-case **safety net** ka hai — C++ ka introsort quicksort se shuru karke recursion depth limit par heapsort par switch karta hai.

**Prompt:** `heapify` ki O(n) aur n pushes ki O(n log n) — dono correct bounds hain. Ek hi structure ke liye do alag costs kaise?

**Answer:** Kyunki operations alag hain. `push` element ko leaf par daal kar **upar** bubble karta hai, aur root tak ka path har element ke liye O(log n) ho sakta hai — aur zyadatar elements leaves par hain, so zyadatar pushes full-height work karte hain. Bottom-up `heapify` har node ko **neeche** sink karta hai, aur zyadatar nodes leaves ke paas hain jahan bache hue levels bahut kam hain. Sum `Σ n·h/2^(h+1)` converge karke O(n) deta hai. Same structure, ulta direction, alag total — isiliye bulk construction aur incremental insertion ko alag cost karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `[5,1,9,2,8,7]` se teen largest values rakho. End mein root kya hoga? Kya heap array fully sorted hoga?

> **Hint:** Size k se zyada hote hi retained candidates ka minimum hata do.

**Answer guide — compare after attempting:** 7, 8, 9 bachenge; root 7 yani third-largest value hoga. Heap array fully sorted nahi hota, sirf heap property follow karta hai. Positive bounded k ke liye O(n log k) time aur O(k) space. k=0 ka behavior alag define karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check

[Princeton's priority queues chapter](https://algs4.cs.princeton.edu/24pq/) heap operations aur linear sink-based heap construction ka reference hai.
