---
id: dsa-linear-structures
title: Linked lists stacks and queues
track: dsa
order: 2
level: Intermediate
minutes: 36
summary: Implement pointer changes and choose LIFO or FIFO without hiding operation costs.
tags: linked-list, stack, queue, pointers, monotonic-stack
---

## Mental model

Array positions ko directly access karna easy banata hai. Linked list mein relevant node already ho toh local links change karna easy hota hai. Stack last-in first-out aur queue first-in first-out access expose karte hain. Yeh access contracts hain, jinhe different storage structures se implement kar sakte ho.

## Linked list operations

Singly linked list mein `head`, optionally `tail`, aur length store karo. Har node ke `value` aur `next` hote hain. Prepend O(1), tail pointer ke saath append O(1), index i tak pahunchna O(i). Tail remove karna O(n), kyunki predecessor find karna padta hai. Doubly linked list ka `prev` known node removal O(1) banata hai, lekin extra pointers aur invariants maintain karne padte hain.

```js
function reverseList(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const next = current.next; // save before overwriting
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
```

Reversed prefix `previous` par end hota hai; unprocessed suffix `current` se start hota hai. Time O(n), extra space O(1). Yeh links mutate karta hai aur acyclic input assume karta hai. Wrapper tail store karta ho toh old head ko new tail banana mat bhoolo.

Floyd cycle detector slow ko one aur fast ko two links move karta hai. Meet hone par ek pointer head par reset karo aur dono one step move karo; next meeting cycle entry hai. O(n) time aur O(1) space. Node identity compare karo, values nahi: different nodes ki values equal ho sakti hain.

```js
function cycleStart(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {          // identity comparison, not slow.value === fast.value
      let entry = head;
      while (entry !== slow) { entry = entry.next; slow = slow.next; }
      return entry;               // cycle ka pehla node
    }
  }
  return null;                    // fast null tak pahunch gaya: no cycle
}
```

Reset step ka reasoning aksar "yaad kar liya" wale category mein chala jaata hai, lekin derivation chhoti hai. Maan lo cycle start head se `m` steps door hai aur cycle ki length `L` hai. Meeting ke waqt slow ne `m + k` steps liye hain (`k` = cycle mein meeting point ka offset) aur fast ne exactly double, `2(m + k)`. Fast ne slow se jitna extra chala woh cycle ka poora multiple hona chahiye: `2(m + k) − (m + k) = m + k`, so `m + k` cycle length ka multiple hai. Iska matlab meeting point se `m` aur steps chalne par tum exactly cycle start par pahunchoge — aur head se bhi `m` steps par wahi node hai. Isliye dono pointers ek-ek step chalte hue cycle start par milte hain.

Yeh "why does the invariant hold" wala answer hi interview mein farak banata hai. Sirf code likhne par interviewer poochega "reset kyun head par?" — aur derivation ke bina wahan atak jaana common hai.

### Why a dummy head removes an entire class of bugs

Linked-list problems ka sabse common bug head node ka special-casing hai. Dummy (sentinel) node us branch ko structurally hata deta hai:

```js
// Remove all nodes with a given value — bina dummy ke head deletion special case hai.
function removeAll(head, value) {
  const dummy = { next: head };        // dummy.next hi eventual naya head hai
  let prev = dummy;
  let current = head;
  while (current !== null) {
    if (current.value === value) prev.next = current.next; // prev advance nahi hota
    else prev = current;
    current = current.next;
  }
  return dummy.next;                   // head change hua ho toh bhi correct
}
```

Dummy ke bina do alag code paths chahiye: head delete karna (head pointer update karo) aur middle node delete karna (predecessor ka next update karo). Dummy ke saath **har node ka ek predecessor hai**, isliye ek hi path kaafi hai.

Dhyan do ki delete hone par `prev` advance **nahi** hota — consecutive matching nodes (`[1, 1, 1]` value 1 ke saath) par `prev` ko aage badha dena ek node skip kar deta hai. Time O(n), space O(1).

### Merging two sorted lists

```js
function mergeSorted(a, b) {
  const dummy = { next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;   // remaining suffix ko link karo, copy nahi
  return dummy.next;
}
```

Arrays ke merge se ek structural difference hai: yahan **koi allocation nahi hoti**. Hum existing nodes ke `next` pointers rewire kar rahe hain, isliye O(1) auxiliary space hai — array version ko O(n) output array chahiye. Time O(n + m).

Last line bhi linked lists ka advantage dikhati hai: remaining suffix ko ek pointer assignment se attach kar diya, element-by-element copy nahi kiya. Yeh property external merge sort aur k-way merge mein bhi useful hai.

## Stack applications

Array-backed stack mein usual dynamic-array model ke under `push()`/`pop()` use karo. Balanced brackets ke liye opening brackets stack mein rakho, aur closing bracket ko latest unmatched opener se match karo. End mein nonempty stack ka matlab kuch openers close nahi hue.

Monotonic stack unresolved next-greater ya next-smaller queries ke indices store karta hai. Har index ek baar push aur maximum ek baar pop hota hai, so nested while ke bawajood total O(n) operations ho sakte hain. Distance chahiye ya equal values ki positions distinguish karni hain toh values ke bajay indices store karo.

```js
// Har din ke liye: kitne din baad warmer temperature aaya? Nahi aaya toh 0.
function dailyTemperatures(temps) {
  const answer = new Array(temps.length).fill(0);
  const stack = [];   // INDICES of days whose answer is still unknown
                      // invariant: stack ke temperatures strictly decreasing hain
  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
      const day = stack.pop();       // is din ka answer aaj mila
      answer[day] = i - day;         // indices store kiye isliye distance nikli
    }
    stack.push(i);
  }
  return answer;                     // stack mein bache din: koi warmer day nahi
}
```

**Aggregate analysis ko literally likho.** Nested `while` dekh kar O(n²) bolna reflex hai, lekin sahi counting yeh hai: loop body mein har index exactly ek baar `push` hota hai, aur ek baar pop hone ke baad woh stack mein wapas kabhi nahi aata. Isliye poore run mein total pops ≤ n. Total operations = n pushes + at most n pops = O(n) time, O(n) space worst case (strictly decreasing input, jahan kuch bhi pop nahi hota).

Yeh wahi amortized argument hai jo dynamic array resize aur two-stack queue mein lagta hai: **per-iteration maximum multiply karne ke bajay lifetime events count karo.** Ek individual iteration O(n) pops kar sakti hai, phir bhi sequence ka total O(n) hai.

Values ki jagah indices store karna deliberate hai. Values se `answer[day] = i - day` nikalna possible hi nahi hota, aur equal temperatures wale alag din distinguish nahi hote. Yeh ek reusable rule hai: agar answer mein **position ya distance** chahiye, stack mein index rakho.

Strict `>` vs `>=` bhi contract decide karta hai: `>` ke saath equal temperatures ek doosre ko resolve nahi karte (strictly warmer chahiye), `>=` ke saath karte. Problem statement se yeh explicitly clarify karo.

### Constant-time minimum with a stack

"Stack jo `push`, `pop`, aur `getMin` teenon O(1) mein kare" ek classic design question hai. Naive approach har `getMin` par scan karta hai (O(n)); trick yeh hai ki har element ke saath **us waqt ka minimum** bhi store kar do:

```js
class MinStack {
  #items = [];  // { value, min } pairs

  push(value) {
    const min = this.#items.length === 0
      ? value
      : Math.min(value, this.#items[this.#items.length - 1].min);
    this.#items.push({ value, min });
  }

  pop() { return this.#items.pop()?.value; }
  peek() { return this.#items[this.#items.length - 1]?.value; }
  getMin() { return this.#items[this.#items.length - 1]?.min; }
}
```

Insight yeh hai ki stack ki LIFO discipline history ko implicitly preserve karti hai: jab tum ek element pop karte ho, tumhe exactly wahi state wapas chahiye jo usse pehle thi — aur woh state already neeche wale entry mein stored hai. Koi recomputation nahi chahiye.

Teenon operations O(1) hain, space O(n) (per entry ek extra number). Ek optimization hai sirf tab `min` push karna jab woh change ho (separate min-stack), jo memory bachata hai lekin equal-minimum values par careful pop logic maangta hai. Yeh trade-off explicitly bolna interview mein accha lagta hai.

## Queue implementation

```js
class Queue {
  #items = [];
  #head = 0;

  enqueue(value) { this.#items.push(value); }
  get size() { return this.#items.length - this.#head; }

  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.#items[this.#head];
    this.#items[this.#head++] = undefined; // release object reference
    if (this.#head >= 1024 && this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return value;
  }
}
```

Periodic compaction dequeue ko amortized O(1) banati hai, occasional O(k) copying ke saath. Backing array mein bounded additive slack aur current live occupancy ke proportional storage rehta hai. `undefined` valid queued value ho toh empty return ambiguous hai; production API explicit result/empty wrapper de sakti hai.

Do stacks se queue banane mein input stack ki saari entries output stack par tab transfer karo jab output empty ho. Har item maximum ek baar transfer hota hai: enqueue/dequeue amortized O(1), storage O(n), lekin ek individual dequeue worst-case O(n) ho sakta hai. Amortized aur per-operation worst-case ko mix mat karo.

```js
class QueueFromStacks {
  #input = [];
  #output = [];

  enqueue(value) { this.#input.push(value); }   // hamesha O(1)

  dequeue() {
    if (this.#output.length === 0) {
      // Bulk transfer: order reverse hota hai, isliye output ka top = oldest item.
      while (this.#input.length > 0) this.#output.push(this.#input.pop());
    }
    return this.#output.pop();                  // amortized O(1), worst case O(n)
  }
}
```

Transfer **sirf tab** karo jab output empty ho — har dequeue par transfer karoge toh order galat ho jayega aur cost bhi. Har item apne lifetime mein exactly ek baar input se output move hota hai, isliye n operations ka total O(n) hai.

Yahan ek genuinely important distinction hai jo interview mein aata hai: **amortized O(1) aur worst-case O(1) alag guarantees hain.** Agar system latency-sensitive hai (real-time audio, trading, game loop), toh ek occasional O(n) dequeue spike unacceptable ho sakti hai, chahe average perfect ho. Us case mein circular buffer (fixed capacity, true O(1) worst case) ya linked-list queue better fit hai. Same reasoning garbage-collected languages mein GC pauses par apply hoti hai — average throughput accha, p99 latency kharab.

### Sliding window maximum: a monotonic deque

Ek problem jo stack aur queue dono ka reasoning combine karti hai: size-k window ke har position ka maximum nikalo.

```js
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = [];   // INDICES, values strictly decreasing (front = current max)
  let head = 0;       // shift() avoid karne ke liye head index

  for (let i = 0; i < nums.length; i++) {
    // 1. Window se bahar nikal chuke index ko front se drop karo.
    if (deque.length - head > 0 && deque[head] <= i - k) head++;
    // 2. Peeche se saare chhote-ya-barabar elements drop karo:
    //    woh kabhi maximum nahi ban sakte, kyunki nums[i] naya aur bada hai.
    while (deque.length - head > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]); // front hamesha window max
  }
  return result;
}
```

Discard ka proof: agar `nums[i] >= nums[j]` hai aur `i > j`, toh `j` kabhi bhi kisi future window ka maximum nahi ho sakta — `i` har us window mein present hoga jisme `j` hai (aur usse zyada windows mein bhi), aur uski value badi ya barabar hai. Isliye `j` ko permanently drop karna safe hai. Yeh exactly wahi "discard karna provably safe hai" wala argument hai jo two pointers mein tha.

Complexity: har index ek baar push aur at most ek baar pop hota hai → O(n) time, O(k) space (deque mein at most k live indices). Naive approach har window par O(k) scan karta (O(nk)), aur heap-based approach O(n log k) deta. Deque version dono ko beat karta hai kyunki woh "kaun kabhi jeet hi nahi sakta" wali information exploit karta hai.

## Boundary checklist

Empty list, single node, head removal aur tail removal manually trace karo. Pointer overwrite karne se pehle next reference save karo. List length, head aur tail ko saath update karo. Empty queue ko dequeue karna controlled behavior hona chahiye, accidental negative size nahi.

## Array versus linked list: the honest comparison

| Operation | Dynamic array | Singly linked list |
| --- | --- | --- |
| Access by index | O(1) | O(i) |
| Append at end | Amortized O(1) | O(1) with tail pointer |
| Prepend at front | O(n) (shift everything) | O(1) |
| Insert/delete at known node | O(n) (shift) | O(1) given the predecessor |
| Search by value | O(n) | O(n) |
| Memory per element | Compact, contiguous | Extra pointer per node + allocator overhead |
| Cache behavior | Excellent (sequential prefetch) | Poor (pointer chasing, scattered memory) |

Table asymptotics mein linked list ko achha dikhati hai, lekin **practice mein arrays usually jeet jaate hain** jab tak tumhe middle-insertion heavy workload aur already-held node references dono na hon. Reason cache locality hai: array traversal CPU ke prefetcher ke liye predictable hai, jabki linked list ka har `next` ek potential cache miss hai — jo ek memory access ko dozens of cycles mehenga bana deta hai. Constant factors yahan itne bade hain ki O(n) array shift aksar O(1) linked-list insert ko real benchmarks par beat kar deta hai chhote-se-medium n par.

Isiliye modern standard libraries linked list ko rarely default banati hain, aur JavaScript mein toh built-in linked list hai hi nahi — `Array` aur `Map` almost sab kuch cover kar lete hain. Linked lists interview mein pointer-reasoning test karne ke liye zinda hain, aur production mein specific jagah par (LRU cache ki intrusive doubly linked list, free-list allocators, kernel structures) jahan O(1) removal with a held reference genuinely chahiye.

## Common mistakes

- **Wrong assumption:** Linked-list deletion O(1) hai. **Why it breaks:** Yeh statement adhoora hai — O(1) tabhi hai jab tumhare paas **predecessor ka reference already ho**. Singly linked list mein value se node dhoondhna O(n) hai, aur last node delete karne ke liye predecessor tak traverse karna bhi O(n). Doubly linked list mein held node ki removal genuinely O(1) hai, lekin har node par ek extra pointer aur zyada invariants ka cost hai. **Fix:** Hamesha bolo "O(1) given a reference to the node and its predecessor"; search cost alag se state karo.
- **Wrong assumption:** Reversal loop mein `current.next = previous` likhne ke baad `current = current.next` se aage badh jaunga. **Why it breaks:** Us line par `current.next` ko already overwrite kar chuke ho, so tum aage jaane ke bajay peeche (`previous` par) chale jaoge — infinite loop ya truncated list. **Fix:** Pointer rewire karne se **pehle** `const next = current.next` save karo. Rule: koi bhi pointer overwrite karne se pehle usse jo reachable tha usko capture kar lo.
- **Wrong assumption:** JavaScript array ko queue ki tarah `push` + `shift` se use karna theek hai. **Why it breaks:** `shift()` baaki saare elements ko ek position aage move karta hai (engine optimizations ke bawajood yeh general case mein O(n) hai), so n dequeues O(n²) ban jaate hain. BFS par yeh bada input milte hi timeout karta hai aur bug dikhta nahi — code "correct" hota hai, bas slow. **Fix:** Head index rakho (`queue[head++]`) aur periodically compact karo, ya explicit ring buffer / linked-list queue use karo.
- **Wrong assumption:** Head-index queue memory bhi O(live items) rakhta hai. **Why it breaks:** Bina compaction ke consumed slots array mein bane rehte hain aur unme stored object references GC hone se roke rehte hain — ek long-running queue unbounded memory grow karti hai chahe uska `size` chhota ho. **Fix:** Consumed slot ko `undefined` set karo (reference release), aur `head` bade hone par backing array ko compact karo — dono cheezein upar wale `Queue` implementation mein deliberately hain.
- **Wrong assumption:** Monotonic stack wala nested `while` O(n²) hai. **Why it breaks:** Yeh per-iteration worst case ko n se multiply karne ka result hai, jo loose bound deta hai. Correct counting lifetime events par hoti hai: har index ek baar push hota hai aur at most ek baar pop, so total operations 2n hain. **Fix:** Nested loops dekh kar multiply mat karo — poore run mein har element kitni baar touch hota hai, woh count karo. Yehi aggregate method dynamic array resize aur two-stack queue par bhi apply hota hai.
- **Wrong assumption:** `dequeue()` ka `undefined` return karna hamesha "queue empty" ka reliable signal hai. **Why it breaks:** Agar `undefined` khud ek valid queued value hai, toh empty aur "undefined stored tha" indistinguishable ho jaate hain — caller ki loop condition silently galat behave karti hai. **Fix:** Size explicitly check karo (`while (q.size > 0)`), ya API ko `{ ok: boolean, value }` wrapper return karwao, ya empty par throw karo. Sentinel value ko ambiguous mat chhodo.

## Where this shows up in real systems

Stacks ka sabse literal production use call stack hi hai — har exception trace, har debugger step wahi LIFO structure dikhata hai, aur unbounded recursion ka stack overflow uski capacity limit ka direct consequence hai. Undo/redo do stacks se banta hai, aur expression evaluation/parsing (JSON, regex engines, bracket matching in editors) sab stack-driven hain.

Queues distributed systems ki backbone hain: message brokers (SQS, Kafka consumer groups), task queues (Celery, BullMQ), aur har web server ka request backlog. Wahan queue ki theory ka ek practical extension bhi milta hai — **bounded** queue capacity, kyunki unbounded queue backpressure ko latency mein convert kar deti hai aur eventually memory exhaust karti hai. Yehi reason hai ki thread pools ko explicit queue limit aur rejection policy ke saath configure kiya jaata hai.

Doubly linked list ka classic production use LRU cache hai: hash map node reference deta hai (O(1) lookup) aur doubly linked list us node ko O(1) mein list ke front par move karta hai (recency update) ya tail se evict karta hai. Yahan linked list isliye jeetti hai kyunki hum node reference **already hold** karte hain — wahi single condition jiske bina linked list arrays se haar jaati hai. Deque-based sliding window monitoring systems mein "pichhle 5 minute ka max" jaise rolling aggregates ke liye use hoti hai.

## Practice and answer

**Prompt:** “Linked-list deletion O(1) hai” incomplete kyun hai?

**Answer:** Node aur necessary predecessor information already honi chahiye. Value search O(n) le sakti hai; singly linked list ka last node delete karne ke liye predecessor dhoondhna padta hai.

**Prompt:** Daily temperatures `[70, 72, 71, 75]` mein warmer day ke waits?

**Answer:** `[1, 2, 1, 0]`. Decreasing temperatures ke indices stack mein rakho. 75 aane par 71 aur 72 dono unresolved positions solve ho jaati hain.

**Prompt:** Floyd cycle detection mein meeting ke baad ek pointer ko head par reset kyun karte hain?

**Answer:** Kyunki meeting point cycle start se utni hi door hai jitna head cycle start se hai (modulo cycle length). Derivation: slow ne `m + k` steps liye, fast ne `2(m + k)`, aur unka difference `m + k` cycle length ka multiple hona chahiye. Isliye head se aur meeting point se ek-ek step chalne wale do pointers exactly cycle start par milte hain. Yeh statement prove kar sakna hi answer ko "yaad kiya hua" se alag karta hai.

**Prompt:** `push`/`pop`/`getMin` teenon O(1) chahiye. `getMin` ke liye ek variable rakhna kyun kaafi nahi?

**Answer:** Single `min` variable push par toh correct update ho jaata hai, lekin jab woh minimum **pop** ho jaaye toh naya minimum nikalne ka koi tarika nahi bachta — poora stack scan karna padega (O(n)). Har entry ke saath "us waqt ka minimum" store karne se pop apne aap previous state restore kar deta hai, kyunki LIFO discipline history ko implicitly preserve karti hai. Space O(n), teenon operations O(1).

**Prompt:** Sliding window maximum ke liye size-k max-heap (O(n log k)) aur monotonic deque (O(n)) mein se kya choose karoge?

**Answer:** Deque, jab window fixed-size ho aur slide karti ho — woh O(n) hai aur expired indices ko front se O(1) mein drop karta hai, jabki heap se arbitrary expired element remove karna O(k) ya lazy-deletion bookkeeping maangta hai. Heap tab better hai jab window fixed-size na ho, ya elements arbitrary order mein remove/insert hote hon, ya top-k chahiye sirf top-1 nahi. Deque ka advantage ek specific structural fact se aata hai: "chhota aur purana element kabhi jeet hi nahi sakta", jo sirf sliding-window setting mein true hai.

**Prompt:** BFS ka code correct hai lekin bade graph par timeout kar raha hai. Sabse pehle kya dekhoge?

**Answer:** Queue implementation. `queue.shift()` har dequeue par baaki elements ko move karta hai, so V dequeues O(V²) ban jaate hain — algorithm O(V + E) hone ke bawajood. Fix head index (`queue[head++]`) ya proper ring buffer hai. Doosra check: visited enqueue ke waqt mark ho raha hai ya dequeue ke waqt — dequeue par marking se same vertex multiple baar queue mein aa sakta hai aur kaam exponentially badh sakta hai.

## Source check

[Princeton stacks and queues](https://algs4.cs.princeton.edu/13stacks/) access contracts, linked representations aur resizing-array implementations explain karta hai. [MDN Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) front-removal semantics document karta hai, jo queue implementation choice ke liye relevant hai. Monotonic stack/deque ke aggregate-analysis arguments original worked derivations hain.
