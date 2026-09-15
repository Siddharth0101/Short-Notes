---
id: dsa-recursion
title: Recursion and backtracking
track: dsa
order: 6
level: Intermediate
minutes: 32
summary: Backtracking mein ek branch ke changes undo karo, tabhi next branch ko sahi starting state milegi.
tags: recursion, backtracking, call-stack, subsets
visual: recursion-stack
---

## Mental model — simple soch

Recursive function ek state ko smaller states mein delegate karke solve karta hai. Har active call ke apne parameters aur local bindings hote hain. Base case solved state handle karta hai; progress measure ensure karta hai ki har branch eventually base case tak pahunche. “Function khud ko call karta hai” syntax explain karta hai, correctness nahi.

> **Core takeaway:** Backtracking mein ek branch ke changes undo karo, tabhi next branch ko sahi starting state milegi.

## Write the contract first

`sumFrom(nums, i)` ka contract hai: index i se end tak sum return karo. Empty suffix ka sum zero hai. Ek element consume karne se remaining suffix ki length strictly decrease hoti hai.

```js
function sumFrom(nums, i = 0) {
  if (i === nums.length) return 0;
  return nums[i] + sumFrom(nums, i + 1);
}
// sumFrom([2, 5, 1])
// 2 + (5 + (1 + 0)) = 8
```

Valid i ke liye O(n - i) time aur O(n - i) call-stack space hai. Har call mein `nums.slice(1)` use karoge toh repeated allocation aur copy work add hoga. Ordinary browser/Node runtime mein tail-call elimination assume mat karo; deep recursion stack overflow kar sakti hai.

## Trace the stack, don't just trust it

Recursion debug karne ka sabse reliable tarika hai stack ko literally likh dena — kaunsa frame kab push hota hai aur kaunsi value kis frame ko return hoti hai. `sumFrom([2, 5, 1])` ke liye:

```text
push  sumFrom(i=0)   -> needs nums[0] + sumFrom(1)
push  sumFrom(i=1)   -> needs nums[1] + sumFrom(2)
push  sumFrom(i=2)   -> needs nums[2] + sumFrom(3)
push  sumFrom(i=3)   -> base case, returns 0        <- deepest frame
pop   sumFrom(i=2)   returns 1 + 0 = 1
pop   sumFrom(i=1)   returns 5 + 1 = 6
pop   sumFrom(i=0)   returns 2 + 6 = 8              <- final answer
```

Do cheezein yahan explicitly dikhti hain. Pehla, **maximum depth 4 frames** hai — yeh auxiliary space hai, aur yeh total calls se alag metric hai. Doosra, kaam **unwinding par** ho raha hai: `nums[i] +` wala addition child ke return ke *baad* execute hota hai, isliye har frame ko apna `nums[i]` yaad rakhna padta hai jab tak child return na kare. Yahi reason hai ki yeh function tail-recursive nahi hai.

Isko tail-recursive banana ho toh accumulator pass karo:

```js
function sumFromTail(nums, i = 0, acc = 0) {
  if (i === nums.length) return acc;
  return sumFromTail(nums, i + 1, acc + nums[i]); // return ke baad kuch pending nahi
}
```

Ab har frame ke paas koi pending work nahi hai, so theoretically engine frame reuse kar sakta hai. Lekin **practical warning**: ES2015 spec mein proper tail calls define hain, phir bhi V8 (Chrome/Node) ne unhe ship nahi kiya. Iska matlab yeh rewrite JavaScript mein stack depth **kam nahi karta** — yeh sirf ek design habit hai jo Scheme/Scala jaisi languages mein payoff deti hai. Node mein depth roughly kuch hazaar frames par `RangeError: Maximum call stack size exceeded` deti hai (exact limit engine, flags aur frame size par depend karti hai). Agar `n` 10⁵ tak ja sakta hai, recursion likhne se pehle hi iterative version ya explicit stack plan karo.

## Recursion trees and repeated subproblems

Har recursive function ka cost uske **recursion tree ke nodes** se aata hai, na ki depth se. Naive Fibonacci isko sabse clearly dikhata hai:

```js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(5) ka tree:
//                 fib(5)
//            /              \
//        fib(4)            fib(3)
//        /     \           /     \
//    fib(3)   fib(2)   fib(2)   fib(1)
//    /   \     /   \    /   \
// fib(2) f(1) f(1) f(0) f(1) f(0)
```

`fib(3)` do baar compute hota hai, `fib(2)` teen baar. Tree ke nodes roughly `Θ(φⁿ)` hain (φ ≈ 1.618), lekin **distinct** arguments sirf n + 1 hain. Yeh gap hi memoization ka pura justification hai:

```js
function fibMemo(n, cache = new Map()) {
  if (n < 2) return n;
  if (cache.has(n)) return cache.get(n);
  const value = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  cache.set(n, value);
  return value;
}
```

Ab har distinct state exactly ek baar compute hota hai: O(n) arithmetic operations, O(n) cache space, aur depth abhi bhi O(n). Important nuance: memoization ne **exponential ko linear tab banaya jab distinct states thode the.** Agar state mein poora chosen path encode hota (jaise permutations mein), distinct states khud exponential hote aur cache kuch nahi bachata — sirf memory kha jaata. Isliye caching add karne se pehle hamesha "distinct states kitne hain" count karo.

Depth bhi yaad rakho: `fibMemo(100000)` cache ke bawajood stack overflow karega, kyunki pehla chain n se 0 tak bina return kiye descend karta hai. Bottom-up iteration (`for i = 2..n`) wahi O(n) time deta hai aur O(1) space tak compress ho sakta hai.

## Backtracking explores choices

Backtracking decision tree ka depth-first exploration hai: choose, explore, undo. Mutable path se result emit karte waqt snapshot copy karo. Undo caller ki original working state restore karta hai, taaki next branch independent rahe.

```js
function subsets(values) {
  const result = [];
  const chosen = [];
  function visit(index) {
    if (index === values.length) {
      result.push([...chosen]);
      return;
    }
    visit(index + 1); // exclude
    chosen.push(values[index]);
    visit(index + 1); // include
    chosen.pop(); // restore the caller's state
  }
  visit(0);
  return result;
}
```

n positions ke 2ⁿ subsets hain; copied output entries total Θ(n2ⁿ) hain. Output exclude karke recursion aur working path O(n) auxiliary space lete hain. Equal input values se unique value-subsets chahiye toh duplicate policy add karo. Yeh example positional subsets banata hai, so equal values ke outputs duplicate dikh sakte hain.

## Common variants

| Task | State | Choices | Completion |
| --- | --- | --- | --- |
| Permutations | Path and used positions | Har unused position | Path length n |
| Combination sum | Remaining target and start index | Allowed next candidate | Remaining target zero |
| Grid word search | Cell, word index, current visited path | Legal neighbors | Saare letters matched |
| N queens | Row and occupied columns/diagonals | Safe column | Saari rows filled |

Pruning tabhi karo jab prove kar sako ki branch se valid completion impossible hai. “Remaining target negative hai” positive candidates ke liye safe prune hai. Negative candidates allowed ho toh valid future completion discard ho sakti hai. Word search mein return par visited marks undo karo, kyunki dusra path same cell use kar sakta hai.

### Permutations with duplicates: sorting turns dedup into a local rule

Distinct permutations nikalna backtracking ka sabse instructive variant hai, kyunki naive approach duplicates emit karta hai aur "Set se dedupe kar lenge" wala fix costly hai.

```js
function permutations(values) {
  const a = [...values].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  const result = [];
  const path = [];
  const used = new Array(a.length).fill(false);

  function visit() {
    if (path.length === a.length) {
      result.push([...path]);            // snapshot, warna sab entries same reference
      return;
    }
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      // Equal values ke group mein hamesha leftmost unused wala hi choose karo.
      if (i > 0 && a[i] === a[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(a[i]);
      visit();
      path.pop();                        // undo: caller ki state restore
      used[i] = false;                   // undo: dono cheezein restore karni hain
    }
  }

  visit();
  return result;
}
// permutations([1, 1, 2]) -> [[1,1,2],[1,2,1],[2,1,1]] — 6 nahi, 3
```

Dedup rule ka proof: sorting ke baad equal values contiguous hain. Agar `a[i] === a[i-1]` hai aur `a[i-1]` abhi tak **use nahi hua**, iska matlab hum us group mein ek later copy ko pehle pick karne ki koshish kar rahe hain — woh exactly wahi output banayega jo leftmost copy pick karne se banta. Har distinct multiset arrangement ke liye ek hi canonical choice sequence allow karke duplicates tree level par hi cut ho jaate hain, output stage par nahi. Isliye pruning **time bhi bachata hai**, sirf output clean nahi karta.

Complexity: distinct permutations ki count P ho toh O(n · P) output entries, aur path/used/stack milakar O(n) auxiliary space (output ke alawa). Recursion depth exactly n hai.

`used[i] = false` bhoolna sabse common bug hai. `path.pop()` yaad reh jaata hai kyunki woh visible hai, lekin backtracking ka rule yeh hai ki **jo bhi mutate kiya, sab undo karo** — chahe woh path ho, visited flags hon, ya running sum.

### Pruning that provably preserves correctness

N-queens mein naive approach har board arrangement check karta hai; smart version constraint-based pruning use karta hai:

```js
function countNQueens(n) {
  const cols = new Set();
  const diag = new Set();       // row - col, identifies one diagonal
  const anti = new Set();       // row + col, identifies the other diagonal
  let count = 0;

  function placeRow(row) {
    if (row === n) { count++; return; }
    for (let col = 0; col < n; col++) {
      const d = row - col;
      const a = row + col;
      if (cols.has(col) || diag.has(d) || anti.has(a)) continue; // prune
      cols.add(col); diag.add(d); anti.add(a);
      placeRow(row + 1);
      cols.delete(col); diag.delete(d); anti.delete(a);          // undo all three
    }
  }

  placeRow(0);
  return count;
}
```

Do design decisions dhyan dene layak hain. Pehla, **har row mein exactly ek queen** wala structure hi ek bada prune hai — hum kabhi aise arrangements enumerate hi nahi karte jinme do queens same row mein hon. Doosra, `row - col` aur `row + col` diagonals ke stable identifiers hain, isliye conflict check O(1) hai; har baar board scan karna O(n) hota.

Pruning tabhi safe hai jab woh sirf aise branches kaate jinse koi valid completion possible hi nahi thi. Yahan woh trivially true hai (attacked square par queen rakhna kabhi valid solution nahi de sakta). Ulta example: "sum abhi target se bada ho gaya, prune karo" tab hi safe hai jab saare remaining candidates nonnegative hon — negative values allowed ho toh woh branch abhi bhi recover kar sakti thi, aur prune correctness todh deta hai.

## Recursion versus iteration

Explicit stack same frontier represent karke runtime call-stack limit avoid kar sakta hai. Postorder traversal mein parent ko children ke baad process karna hota hai; iske liye expanded flag ya separate processing frame use karo. Loop likhne se complexity automatically reduce nahi hoti: states kitne hain aur information kitni retain hoti hai, wahi important hai.

Recursive helper ko test karte waqt shared global state par bhi dhyan do. Har top-level invocation ko fresh output/path milna chahiye. Pure return-based recursion aur helper-based backtracking dono valid approaches hain, but mutation ka ownership clear rakho.

Yahan ek mechanical conversion hai jo deep recursion ke stack-overflow risk ko remove karti hai:

```js
// Recursive DFS on a tree — depth ke saath stack overflow kar sakta hai.
function depthRecursive(node) {
  if (node === null) return 0;
  return 1 + Math.max(depthRecursive(node.left), depthRecursive(node.right));
}

// Explicit-stack version: heap memory use hoti hai, runtime call stack nahi.
function depthIterative(root) {
  if (root === null) return 0;
  const stack = [{ node: root, depth: 1 }];
  let best = 0;
  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    best = Math.max(best, depth);
    if (node.left) stack.push({ node: node.left, depth: depth + 1 });
    if (node.right) stack.push({ node: node.right, depth: depth + 1 });
  }
  return best;
}
```

Complexity dono ki same hai: O(n) time, O(h) space (skewed tree par O(n)). Difference sirf yeh hai ki iterative version ka stack **heap par** hai, jo engine ke call-stack limit se bahut bada ho sakta hai. Ek 100,000-node linked-list-shaped tree recursive version ko crash karayega aur iterative version ko nahi.

Postorder isse thoda tricky hai kyunki parent ko children ke *baad* process karna hai. Do standard solutions hain: har frame par ek `expanded` flag rakho (pehli baar children push karo, doosri baar process karo), ya preorder ko `node, right, left` order mein chala kar result reverse kar do.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Base case likh diya, matlab recursion terminate ho jayegi. **Why it breaks:** Termination base case se nahi, **progress measure** se aati hai — har recursive call ko base case ki taraf strictly move karna chahiye. `visit(index)` ke andar galti se `visit(index)` likh dena, ya graph traversal mein visited mark na karna (jahan A → B → A cycle hai), infinite recursion deta hai chahe base case perfectly likha ho. **Fix:** Ek nonnegative integer quantity name karo (remaining length, remaining target, unvisited count) aur verify karo ki har call usse strictly decrease karta hai.
- **Wrong assumption:** Backtracking mein `path.pop()` kar diya, state restore ho gayi. **Why it breaks:** Recursive step ne jo bhi shared state chhui thi — `visited` array, `used` flags, running sum, grid cell ka overwritten character — sab restore honi chahiye. Sirf path pop karne se `used[i]` permanently true reh jaata hai aur baad ki branches valid choices skip kar deti hain, jisse **kam** results milte hain (silent wrong answer, crash nahi). **Fix:** Har `mutate` line ke saath uska mirror `undo` line turant likho, aur code review mein dono ko pair karke dekho.
- **Wrong assumption:** `result.push(path)` fine hai kyunki path mein correct values hain. **Why it breaks:** `path` ek single mutable array reference hai jo poori recursion share karti hai. Push karne ke baad bhi woh mutate hoti rehti hai, so end mein saari result entries same (usually empty) array ko point karti hain. **Fix:** Snapshot copy karo — `result.push([...path])`. Yeh O(n) per result hai aur usse complexity mein count karo.
- **Wrong assumption:** Memoization har recursive solution ko tez kar dega. **Why it breaks:** Cache tabhi kaam karta hai jab **same argument dobara** aaye. Backtracking mein state aksar poora path hota hai, jo har branch par unique hai — cache hit rate zero, aur memory linearly badhti rehti hai. Ulta, agar cache key state ka poora description nahi hai (ek relevant dimension miss hai), toh alag states collide karke **wrong answers** dete hain. **Fix:** Caching se pehle distinct-state count estimate karo, aur verify karo ki key mein wo saari information hai jis par future answer depend karta hai.
- **Wrong assumption:** Deep recursion ko tail-call style mein likhne se JavaScript mein stack overflow bach jayega. **Why it breaks:** ES2015 spec mein proper tail calls hain, lekin V8 (Node/Chrome) unhe implement nahi karta. Tail-recursive rewrite functionally correct hai par frames utne hi banenge. **Fix:** Bade inputs par explicit stack wala iterative version likho, ya problem ko bottom-up loop mein convert karo. Depth ko complexity ke saath explicitly state karo.
- **Wrong assumption:** Default parameter se cache pass karna (`function f(n, cache = new Map())`) sab calls mein share hota hai. **Why it breaks:** Default value har top-level call par **freshly evaluate** hoti hai, so `f(30)` aur baad mein `f(31)` alag caches use karenge — recursion ke andar sharing hoti hai, calls ke beech nahi. Ulta hazard: module-level `const cache = new Map()` use karna, jo tests ke beech state leak karta hai aur stale results de sakta hai agar inputs change hon. **Fix:** Cache ownership deliberately choose karo — per-invocation (default param ya inner closure) ya explicitly shared (caller cache pass kare), aur woh choice comment mein likho.

## Where this shows up in real systems

Recursion ka sabse common production form tree-shaped data traversal hai: filesystem walks, JSON/AST processing, DOM traversal, aur nested category hierarchies. Yahin woh stack-depth wali baat real banti hai — ek deeply nested ya adversarial JSON payload par naive recursive parser `RangeError` throw karta hai, aur yeh ek known denial-of-service class hai. Isliye robust parsers depth limit enforce karte hain ya explicit stack use karte hain.

Backtracking constraint solvers ka core engine hai: dependency resolvers (npm/Maven ka version resolution), scheduling aur timetabling, regex backtracking engines, aur configuration validation. Regex wala case interview mein bhi useful reference hai — catastrophic backtracking (`(a+)+b` jaisa pattern ek long non-matching string par) exactly wahi exponential recursion tree hai jo bina effective pruning ke explode ho jaata hai.

Memoization ka production analogue caching hai, aur wahi trap wapas aata hai: cache key mein har woh input honi chahiye jo result ko affect karti hai. Ek API response cache jo `Accept-Language` header ko key mein include karna bhool jaaye woh "DP state that doesn't capture enough information" ka literal real-world version hai — ek user ko doosre ki language ka cached response milta hai.

## Practice and answer

**Prompt:** `result.push(chosen)` subsets function ko kyun break karta hai?

**Answer:** Har result same array reference store karta hai. Future push/pop sab entries ko affect karte hain, aur end mein repeated empty-array references mil sakte hain. `[...chosen]` har completed path ka snapshot preserve karta hai.

**Prompt:** n items ki permutations enumerate karte waqt recursion depth kya hai?

**Answer:** O(n), even though n! leaves ho sakti hain. Total work aur maximum simultaneous stack depth alag measurements hain.

**Prompt:** `permutations([1, 1, 2])` mein dedup line `!used[i - 1]` ki jagah `used[i - 1]` likh do toh kya hoga?

**Answer:** Output ulta ho jayega — har group ke andar sirf woh branches chalengi jahan previous equal copy already used hai, jo ek alag (aur is case mein bhi valid-count dene wala, lekin conceptually different) canonical form enforce karta hai. Asli risk yeh hai ki condition ko bina proof ke copy kiya jaaye: rule yeh hai ki equal values ke group ko hamesha **left se right** consume karo, aur jo bhi form us canonical order ko enforce kare wahi correct hai. Bina sort kiye toh koi bhi version kaam nahi karega, kyunki equal values contiguous hi nahi hongi.

**Prompt:** Ek recursive `deepClone(obj)` likha jo nested objects handle karta hai. Kaunsa input use infinitely recurse karayega?

**Answer:** Circular reference — `const a = {}; a.self = a;`. Progress measure hi exist nahi karta kyunki structure finite depth ka nahi hai. Fix: already-visited objects ka `WeakMap` rakho jo original reference ko uske clone se map kare; dobara wahi object mile toh existing clone return karo. Yeh backtracking ke visited-marking se same idea hai, bas cycle detection ke liye.

**Prompt:** Tree depth nikalne ka recursive version kab iterative version se genuinely alag behave karega?

**Answer:** Jab tree skewed ho aur depth engine ki call-stack limit cross kare (Node mein typically kuch hazaar frames). Dono O(n) time aur O(h) space hain, lekin recursive version `RangeError` throw karta hai jabki explicit-stack version heap use karta hai aur chalta rehta hai. Complexity identical hone ke bawajood ek production mein fail karta hai — yeh "same big-O, different real behavior" ka clean example hai.

## Depth walkthrough — andar kya ho raha hai?

### Recursive call ka contract output se pehle bolo

Function subtree ka height return karti hai: empty subtree base height chosen convention se define karo, nonempty result 1+max(child heights). Child answer assume karke parent combine proof banta hai. Base case ke toward progress na ho toh call stack grow hoti rahegi.

Backtracking mein choose→explore→undo shared partial state ko next branch ke liye restore karta hai. Completed path result mein push karte waqt copy na lo toh later undo saved result mutate kar sakta hai. Visited set path-local hai ya globally processed, problem decide karti hai.

**Practice:** Two-letter permutations ka call tree draw karo. Har recursive edge par remaining choices decrease hon. Duplicate inputs ke liye deduplication same recursion depth par kaise apply hogi, explain karo. Memoization tab useful hai jab state future result fully describe kare; history-dependent missing state wrong reuse karegi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Ek mutable path use karke `[1,2]` ke subsets banao. Har result mein wahi path object store karne se output kyun bigadta hai?

> **Hint — chhota ishara:** Baad ke push/pop bhi usi object ko badalte hain jiska reference result mein rakha tha.

**Answer guide — pehle khud karo, phir compare karo:** Har completed choice par path ki copy store karo. Subsets `[]`, `[1]`, `[2]`, `[1,2]` milenge; order traversal par depend karega. Har branch ke baad path restore karo. Saare subsets copy karke materialize karne ka output time/space O(n·2^n) hai, sirf O(2^n) nahi.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check

[Princeton recursion chapter](https://introcs.cs.princeton.edu/java/23recursion/) recursive decomposition aur base cases explain karta hai. Stack-limit behavior ke liye [MDN recursion error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion) dekho.
