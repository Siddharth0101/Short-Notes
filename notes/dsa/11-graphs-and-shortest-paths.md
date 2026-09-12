---
id: dsa-graphs
title: Graph traversal and shortest paths
track: dsa
order: 11
level: Advanced
minutes: 40
summary: BFS, DFS, cycle detection, topological order, and weighted path choices ko connect karo.
tags: graph, bfs, dfs, dijkstra, topological-sort
visual: bfs
---

## Mental model

Graph relationships model karta hai: vertices entities hain aur edges connections. Directed edge one-way relation hai; undirected edge dono directions permit karta hai. Edge weights distance, cost ya time ho sakte hain. Self-loops, duplicate edges aur disconnected vertices valid hain ya nahi, problem contract mein decide karo.

Adjacency list sparse graph ke liye O(V + E) storage deti hai; undirected edge usually twice store hota hai. Adjacency matrix O(V²) storage leti hai, lekin direct edge check O(1) hota hai. Traversal complexity representation ke saath state karo.

## BFS with path reconstruction

```js
function shortestPath(graph, start, goal) {
  if (!graph.has(start) || !graph.has(goal)) return null;
  const queue = [start];
  const parent = new Map([[start, null]]);
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    if (node === goal) {
      const path = [];
      for (let cur = goal; cur !== null; cur = parent.get(cur)) {
        path.push(cur);
      }
      return path.reverse();
    }
    for (const next of graph.get(node) ?? []) {
      if (!parent.has(next)) {
        parent.set(next, node); // visited at enqueue time
        queue.push(next);
      }
    }
  }
  return null;
}
```

Example string vertex labels aur consistent adjacency list assume karta hai; null reserved sentinel hai. BFS first edge-distance layer, phir next layer explore karta hai. Isliye unweighted graph mein first discovery minimum edges deti hai. O(V + E) time with typical Map costs, O(V) extra storage including parent and queue. Graph disconnected ho to sirf reachable part process hota hai.

Visited enqueue ke waqt mark karo; dequeue tak delay karne par same vertex many times queue mein aa sakta hai. `shift()` ki jagah head index use karne se repeated front-removal cost avoid hota hai.

Enqueue-time versus dequeue-time marking ka farak quantify karo, kyunki yeh interview mein sabse common graph bug hai. Maan lo ek vertex `v` ke `d` neighbors hain jo sab `v` ko point karte hain. Dequeue par mark karoge toh `v` `d` baar queue mein jaayega (har neighbor usse dekhega jab tak `v` process na ho). Dense graphs par yeh queue size ko O(E) tak le jaata hai aur total work E se kai guna badha deta hai. Enqueue par marking guarantee karti hai ki har vertex **exactly ek baar** queue mein aata hai — isiliye O(V + E) bound hold karta hai.

Ek aur nuance: BFS ka "first discovery = shortest" property bhi enqueue-time marking par depend karti hai. Dequeue par marking se ek vertex ke multiple parent entries bann sakti hain aur `parent` map baad mein overwrite ho sakta hai, jis se reconstructed path longer nikal sakta hai. Correctness aur complexity, dono ek hi line par tik rahe hain.

### Multi-source BFS

Ek chhota generalization jo surprisingly often useful hai: queue ko **ek** source ke bajay saare sources se initialize karo.

```js
// Grid mein har cell ki distance to the nearest "source" cell.
function distanceToNearestSource(grid, isSource) {
  const rows = grid.length, cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue = [];
  let head = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isSource(grid[r][c])) { dist[r][c] = 0; queue.push([r, c]); }
    }
  }

  const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of moves) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (dist[nr][nc] !== -1) continue;         // already visited
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
  return dist;
}
```

Yeh conceptually ek virtual super-source add karne jaisa hai jo saare real sources se zero-cost edges rakhta hai. Har source se alag BFS chalane ka cost O(S · (V + E)) hota; multi-source version ek hi pass mein O(V + E) deta hai. "Rotting oranges", "nearest exit", "walls and gates" — sab isi shape ki problems hain.

Grid ko graph ki tarah treat karna ek reusable translation hai: cell = vertex, adjacent cell = edge, so V = rows × cols aur E ≈ 4V. Complexity O(rows × cols) ban jaati hai.

## DFS, cycles, and topological order

DFS stack ya recursion se one path deepen karta hai. Reachability, connected components aur backtracking mein useful hai. Disconnected graph ke all components cover karne ke liye each unvisited vertex se traversal start karo.

Undirected cycle detection mein visited neighbor ko cycle bolne se pehle parent edge exclude karo. Directed graph mein current recursion path ke nodes, often gray color, track karo: gray node ko edge directed cycle indicate karta hai. Globally visited black node ko edge alone cycle prove nahi karta.

```js
// Directed cycle detection with three colors.
// 0 = unvisited (white), 1 = in current recursion path (gray), 2 = fully done (black)
function hasDirectedCycle(graph) {
  const color = new Map();
  for (const v of graph.keys()) color.set(v, 0);

  function dfs(v) {
    color.set(v, 1);                       // gray: current path par hai
    for (const next of graph.get(v) ?? []) {
      if (color.get(next) === 1) return true;   // back edge -> cycle
      if (color.get(next) === 0 && dfs(next)) return true;
      // color 2 (black) par kuch nahi: woh path already khatam ho chuka hai
    }
    color.set(v, 2);                       // black: is vertex ka kaam poora
    return false;
  }

  for (const v of graph.keys()) if (color.get(v) === 0 && dfs(v)) return true;
  return false;
}
```

Do-color (visited/unvisited) version yahan **galat** hai, aur yeh ek genuinely subtle point hai. Directed graph `A→B`, `A→C`, `B→C` mein: `A` se `B` gaye, `B` se `C` gaye, wapas `A` par aakar `C` ko dekha — `C` "visited" hai, lekin yeh cycle nahi hai, yeh sirf ek alternate path hai. Sirf **gray** (abhi current recursion path par active) node par pahunchna cycle prove karta hai, kyunki iska matlab hai ki us node se wapas usi node tak ka rasta hai.

Undirected graph mein rule ulta hai: wahan parent edge exclude karna padta hai, kyunki `A—B` ko `B` se wapas `A` dekhna trivially hota hai aur woh cycle nahi hai.

Topological order sirf DAG ke liye exists. Kahn's algorithm zero-indegree nodes ko queue mein rakhta hai, remove karte waqt outgoing neighbor indegrees decrement karta hai. Processed count V se kam ho to cycle hai. O(V + E) time, O(V) additional state.

```js
function topologicalOrder(graph) {
  const indegree = new Map();
  for (const v of graph.keys()) indegree.set(v, 0);
  for (const v of graph.keys()) {
    for (const next of graph.get(v) ?? []) {
      indegree.set(next, (indegree.get(next) ?? 0) + 1);
    }
  }

  const queue = [];
  let head = 0;
  for (const [v, d] of indegree) if (d === 0) queue.push(v);

  const order = [];
  while (head < queue.length) {
    const v = queue[head++];
    order.push(v);
    for (const next of graph.get(v) ?? []) {
      const d = indegree.get(next) - 1;
      indegree.set(next, d);
      if (d === 0) queue.push(next);       // saari dependencies satisfy ho gayin
    }
  }

  // Cycle detection is free: agar sab vertices process nahi hue toh cycle hai.
  return order.length === indegree.size ? order : null;
}
```

Invariant jo Kahn's algorithm ko correct banati hai: queue mein hamesha wahi vertices hain jinki **saari incoming dependencies already output ho chuki hain**. Isliye unhe kisi bhi order mein emit karna valid topological order deta hai. Indegree zero hone ka matlab hi "ab is task ko run karna safe hai".

Cycle detection yahan bonus nahi, structural hai: agar koi cycle hai toh us cycle ke har vertex ka indegree kabhi zero nahi hoga (har ek ka ek predecessor cycle mein hi hai jo kabhi process nahi hoga), so woh sab queue mein aa hi nahi paayenge. `order.length < V` hi cycle ka proof hai.

Note karo ki topological order **unique nahi** hota jab multiple vertices ka indegree ek saath zero ho. Deterministic output chahiye (jaise reproducible builds) toh queue ki jagah min-heap use karo aur lexicographically smallest order nikalo — cost O(V log V + E) ho jaata hai.

## Union-Find for connectivity

Undirected connectivity ke liye DFS/BFS O(V + E) dete hain, lekin agar edges **incrementally** add ho rahi hain aur beech-beech mein "kya yeh do nodes connected hain" poochha ja raha hai, toh har query par traversal chalana O(Q · (V + E)) ban jaata hai. Union-Find (disjoint set union) isse near-constant kar deta hai.

```js
class UnionFind {
  #parent;
  #rank;
  #count;   // number of disjoint components

  constructor(n) {
    this.#parent = Array.from({ length: n }, (_, i) => i);
    this.#rank = new Array(n).fill(0);
    this.#count = n;
  }

  find(x) {
    // Path compression: har visited node ko seedha root se jodo.
    while (this.#parent[x] !== x) {
      this.#parent[x] = this.#parent[this.#parent[x]];  // path halving
      x = this.#parent[x];
    }
    return x;
  }

  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;        // already same component
    // Union by rank: chhote tree ko bade ke neeche jodo, height control mein rahe.
    if (this.#rank[ra] < this.#rank[rb]) this.#parent[ra] = rb;
    else if (this.#rank[ra] > this.#rank[rb]) this.#parent[rb] = ra;
    else { this.#parent[rb] = ra; this.#rank[ra]++; }
    this.#count--;
    return true;
  }

  get components() { return this.#count; }
}
```

Dono optimizations zaroori hain. Sirf naive parent pointers ke saath tree ek chain ban sakta hai aur `find` O(n) ho jaata hai. **Union by rank** height ko O(log n) mein rakhta hai; **path compression** future finds ko flatten kar deta hai. Dono saath mein amortized cost `O(α(n))` deta hai, jahan α inverse Ackermann function hai — jo kisi bhi practical n (atoms in the universe tak) ke liye 5 se kam hai, effectively constant.

Union-Find versus BFS/DFS ka decision rule saaf hai: **static graph par ek baar components chahiye** → DFS/BFS (simple, O(V + E)). **Edges incrementally aa rahi hain aur beech mein queries hain** → Union-Find. Kruskal's minimum spanning tree algorithm bhi isi par chalta hai (edges ko weight se sort karo, aur har edge ko tab add karo jab woh do alag components ko jode — `union` ka `false` return cycle detect kar deta hai).

Ek important limitation: Union-Find **deletion support nahi karta**. Edge hatane ki requirement ho toh poora structure rebuild karna padta hai, ya offline/rollback techniques chahiye. Interview mein yeh bolna structure ki honest understanding dikhata hai.

## Choose the correct path algorithm

| Graph constraint | Appropriate starting point |
| --- | --- |
| Unweighted or equal positive edge weights | BFS |
| Weights only 0 and 1 | 0–1 BFS with deque |
| Nonnegative weights | Dijkstra with priority queue |
| DAG, even with negative edges | Topological-order relaxation |
| Negative edges in general graph | Bellman–Ford; detect reachable negative cycles |

Dijkstra settles lowest tentative distance; negative weights break its standard greedy proof. Binary-heap Dijkstra with decrease-key has O((V + E) log V) bound. Lazy duplicate entries can use O(E) heap space and O((V + E) log E) time; skip stale entries when popped. Simple sparse-graph presentations often simplify this to O((V + E) log V), but say what implementation you mean.

```js
// Lazy-deletion Dijkstra. `heap` ek min-heap hai jo { node, dist } ko dist se order karta hai.
function dijkstra(graph, source) {
  const dist = new Map([[source, 0]]);
  const heap = new MinHeap((a, b) => a.dist - b.dist);
  heap.push({ node: source, dist: 0 });

  while (heap.size > 0) {
    const { node, dist: d } = heap.pop();
    // Stale entry: is node ka behtar distance already settle ho chuka hai.
    if (d > (dist.get(node) ?? Infinity)) continue;
    for (const [next, weight] of graph.get(node) ?? []) {
      const candidate = d + weight;
      if (candidate < (dist.get(next) ?? Infinity)) {
        dist.set(next, candidate);           // relaxation
        heap.push({ node: next, dist: candidate }); // purani entry stale ho gayi
      }
    }
  }
  return dist;
}
```

**Greedy proof, aur woh kahan tootta hai.** Dijkstra ka core claim yeh hai: jab hum heap se sabse chhoti tentative distance wala node pop karte hain, woh distance **final** hai. Reasoning: us node tak koi aur path kisi abhi-unsettled node se hoke jayega, jiski tentative distance already isse badi ya barabar hai — aur weights nonnegative hone ki wajah se aage jaakar distance ghat nahi sakti. Isliye koi shorter path exist nahi kar sakta.

Ye argument **exactly** negative weights par tootta hai. Ek edge `−10` ka ho toh ek badi tentative distance wala node baad mein ek chhota total de sakta hai, aur already-settled node ka answer galat reh jaata hai. Yeh silent wrong answer hai, crash nahi — isiliye "graph mein negative weights ho sakte hain?" ek clarifying question hai jo poochhna chahiye. Negative edges ho toh Bellman–Ford (O(VE), aur reachable negative cycles bhi detect kar leta hai) ya DAG par topological relaxation (O(V + E)) use karo.

Stale-entry skip line optional optimization nahi hai — uske bina algorithm same node ko baar-baar relax karega aur complexity degrade hogi (correctness bachi rahegi, performance nahi).

### 0–1 BFS: when a deque replaces the heap

Agar saare edge weights sirf 0 ya 1 hain, toh heap ka `log` factor bilkul zaroori nahi:

```js
function zeroOneBFS(graph, source, size) {
  const dist = new Array(size).fill(Infinity);
  dist[source] = 0;
  const deque = [source];
  while (deque.length > 0) {
    const node = deque.shift();
    for (const [next, weight] of graph[node]) {
      if (dist[node] + weight < dist[next]) {
        dist[next] = dist[node] + weight;
        // weight 0 -> same "layer", front par daalo; weight 1 -> next layer, back par.
        if (weight === 0) deque.unshift(next);
        else deque.push(next);
      }
    }
  }
  return dist;
}
```

Idea yeh hai ki deque hamesha at most do distinct distance values hold karta hai (`d` aur `d + 1`), so front se pop karna hamesha minimum deta hai — bilkul heap ki tarah, lekin O(1) mein. Total O(V + E) time, heap ke O(E log V) ke muqable. (Production mein `shift`/`unshift` ki jagah proper ring-buffer deque use karo, warna woh O(n) operations poora fayda kha jaayenge.)

Yeh general lesson deta hai: **structure ki extra information se algorithm sasta ho jaata hai.** Unweighted → plain BFS. Weights sirf {0,1} → deque BFS. Nonnegative weights → Dijkstra. DAG → topological relaxation (negative weights bhi chalte hain). General negative weights → Bellman–Ford. Har step par ek assumption dhili hoti hai aur cost badhta hai.

## Common mistakes

- **Wrong assumption:** BFS mein visited dequeue ke waqt mark karna aur enqueue ke waqt karna equivalent hai, bas thoda extra kaam hai. **Why it breaks:** Dequeue par marking se ek vertex apne saare `d` in-neighbors dwara alag-alag enqueue ho sakta hai, isse pehle ki woh process ho. Queue size O(E) tak badh jaata hai, duplicate processing hoti hai, aur `parent` map overwrite hone se reconstructed path bhi galat (longer) ho sakta hai — yaani performance aur correctness dono. **Fix:** Vertex ko `parent`/`visited` mein tabhi likho jab usse queue mein push karo, aur us check ke bina kabhi push mat karo.
- **Wrong assumption:** Directed cycle detect karne ke liye "visited node par pahunch gaye" kaafi hai. **Why it breaks:** `A→B`, `A→C`, `B→C` mein `C` do raston se reachable hai lekin koi cycle nahi hai — two-color logic ise cycle bata dega. Cycle sirf tab hai jab tum **current recursion path par abhi active** (gray) node par pahuncho. **Fix:** Teen states rakho — unvisited, in-progress (gray), finished (black). Gray par pahunchna hi back edge aur cycle hai; black par pahunchna sirf ek alternate path hai. Undirected graph mein rule alag hai: wahan parent edge explicitly exclude karo.
- **Wrong assumption:** Dijkstra kisi bhi weighted graph par shortest path deta hai. **Why it breaks:** Uska greedy settle step nonnegative weights par depend karta hai. Ek negative edge already-settled node ka answer improve kar sakta hai, lekin Dijkstra usse dobara nahi dekhta — result silently galat aata hai, error nahi. **Fix:** Weights ke baare mein clarify karo. Negative edges par Bellman–Ford (O(VE), negative cycle detection ke saath) use karo, ya DAG ho toh topological-order relaxation (O(V + E), negative weights handle karta hai).
- **Wrong assumption:** BFS ka first-found path weighted graph mein bhi cheapest hai. **Why it breaks:** BFS **edge count** minimize karta hai, total weight nahi. `A→B` cost 10 aur `A→C→B` cost 2 mein BFS ek-edge wala 10-cost path chun lega. **Fix:** Objective explicitly likho — "minimum number of edges" BFS hai, "minimum total weight" Dijkstra/Bellman–Ford. Agar saare weights equal hain (aur positive) tab dono objectives coincide karte hain.
- **Wrong assumption:** Recursive DFS production graphs par safe hai. **Why it breaks:** Depth vertices ki count tak ja sakti hai (long chain ya path-shaped graph), aur JavaScript ka call stack kuch hazaar frames par `RangeError` deta hai. Ek 10⁵-vertex graph par yeh reliably crash karta hai. **Fix:** Explicit stack wala iterative DFS likho, ya BFS use karo jahan order matter na kare. Complexity ke saath O(V) stack space bhi mention karo.
- **Wrong assumption:** Disconnected graph mein ek traversal saare vertices cover kar lega. **Why it breaks:** Ek source se traversal sirf uske connected component tak pahunchti hai. "Count connected components", "detect any cycle in the whole graph", "topologically order all tasks" jaise questions tab silently adhoore answer dete hain. **Fix:** Har unvisited vertex par outer loop lagao aur wahan se naya traversal shuru karo. Kahn's algorithm mein yeh automatically handle hota hai kyunki saare zero-indegree vertices initially queue mein jaate hain.

## Where this shows up in real systems

Topological sort build systems ka literal core hai: Make, Bazel, Gradle, webpack aur npm sab dependency DAG banate hain aur usse execution order derive karte hain. Cycle detection wahan user-facing error ban jaati hai ("circular dependency detected") — aur woh error exactly `order.length < V` wala check hai. Database migrations, Airflow/Dagster jaise DAG schedulers, aur spreadsheet formula recalculation bhi yehi algorithm chalate hain. Parallel builds ek step aage jaate hain: har "indegree zero" batch ko ek saath run kiya ja sakta hai, kyunki unke beech koi dependency nahi hai.

Dijkstra network routing (OSPF link-state routing), maps/navigation, aur game pathfinding (A*, jo Dijkstra + admissible heuristic hai) mein production code hai. Bellman–Ford distance-vector routing protocols mein use hota hai, aur uska negative-cycle detection currency arbitrage detection ka classic application hai (exchange rates ka log lekar multiplication ko addition mein convert karo — profitable arbitrage ek negative cycle ban jaata hai).

BFS social graphs mein "degrees of separation" aur friend-of-friend recommendations deta hai, aur web crawlers ki frontier bhi BFS-ordered hoti hai. Union-Find network connectivity monitoring, image segmentation, aur Kruskal's MST (network design, clustering) mein aata hai. Graph traversal static analysis mein bhi hai: dead-code elimination reachability hai, aur garbage collection ka mark phase literally roots se ek graph traversal hai jahan unreachable objects collect ho jaate hain.

## Practice and answer

**Prompt:** Edges A→B cost 10, A→C cost 1, C→B cost 1. Is one-edge BFS path A→B cheapest?

**Answer:** Nahi. Minimum edges aur minimum weight different goals hain; A→C→B costs 2. Nonnegative weighted shortest path ke liye Dijkstra use kar sakte ho.

**Prompt:** Dependency graph mein no zero-indegree vertex bacha but tasks remain. Meaning?

**Answer:** Remaining directed graph contains a cycle, so all dependencies satisfy karne wala topological order possible nahi.

**Prompt:** Interviewer kehta hai "visited ko dequeue par mark karo, kya farak padta hai?" Kya jawab hai?

**Answer:** Do farak hain. Performance: ek vertex apne saare in-neighbors dwara enqueue ho sakta hai isse pehle ki woh process ho, so queue O(E) tak badhti hai aur duplicate processing hoti hai — O(V + E) bound toot jaata hai. Correctness: `parent` entry multiple baar likhi ja sakti hai, aur baad wali (longer) path se reconstruction ho sakta hai. Isliye enqueue-time marking sirf optimization nahi hai, BFS ki shortest-path guarantee ka hissa hai.

**Prompt:** 10⁵ vertices ka graph hai aur recursive DFS `RangeError` de raha hai. Complexity toh O(V + E) hi hai — problem kya hai?

**Answer:** Complexity theek hai, **space ka type** problem hai. Recursion depth O(V) tak ja sakti hai aur woh runtime call stack par hai, jiski limit kuch hazaar frames hai. Fix explicit stack wala iterative DFS hai (heap memory use karta hai, jo bahut badi hai) ya BFS agar traversal order matter na kare. Yeh "same big-O, different real behavior" ka example hai — asymptotic analysis memory ke source ko distinguish nahi karti.

**Prompt:** Ek build system ko parallel banana hai. Topological sort se kaunsi extra information nikaloge?

**Answer:** Sirf ek linear order nahi, **levels** nikalo. Kahn's algorithm ke har round mein jitne vertices ka indegree ek saath zero hai, unke beech koi dependency nahi hai — woh poora batch parallel run ho sakta hai. Ek round process karke naye zero-indegree vertices ka agla batch banao. Total levels ki count hi minimum possible build depth hai (critical path length), aur yeh batata hai ki infinite parallelism ke saath bhi build kitni der lega.

**Prompt:** Edges incrementally add ho rahi hain aur beech-beech mein "kya A aur B connected hain" poochha ja raha hai. BFS ya Union-Find?

**Answer:** Union-Find. Har query par BFS chalana O(Q · (V + E)) hai; Union-Find har union aur find ko amortized O(α(n)) — practically constant — mein karta hai, so total roughly O((V + E + Q) α(n)). Caveat batao: Union-Find edge **deletion** support nahi karta aur actual path bhi nahi deta, sirf "same component hai ya nahi". Path chahiye ya edges hat sakti hain toh traversal-based approach par wapas jaana padega.

**Prompt:** Ek graph mein saare edge weights exactly 7 hain. Dijkstra chalao ya BFS?

**Answer:** BFS, aur answer ko 7 se multiply kar do. Jab saare weights equal hain toh minimum-edge-count path hi minimum-weight path hai, so BFS ka O(V + E) Dijkstra ke O(E log V) se strictly better hai. Yeh general principle dikhata hai: graph ki extra structure (equal weights, {0,1} weights, DAG) hamesha ek sasta algorithm unlock karti hai — pehle structure identify karo, phir algorithm choose karo.

## Source check

[Princeton's graph chapter](https://algs4.cs.princeton.edu/41graph/) traversal properties aur [shortest paths chapter](https://algs4.cs.princeton.edu/44sp/) relaxation and weight constraints validate karte hain. [Union-Find chapter](https://algs4.cs.princeton.edu/15uf/) path compression aur union-by-rank ke amortized analysis ka reference hai. Upar ke multi-source BFS, 0–1 BFS aur Kahn's-with-levels examples original worked derivations hain.
