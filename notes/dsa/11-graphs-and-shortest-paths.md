---
id: dsa-graphs
title: Graph traversal and shortest paths
track: dsa
order: 11
level: Advanced
minutes: 5
summary: Graph — vertices + edges; direction/weights clarify karo.
tags: graph, bfs, dfs, dijkstra, topological-sort
visual: bfs
---

## Quick revision

> Revision target — Edge weights aur required answer se traversal/shortest-path algorithm choose karo.

- Graph — vertices + edges; direction/weights clarify karo.
- Adjacency list — sparse graphs mein O(V + E) storage.
- BFS — unweighted shortest path; enqueue karte hi visited mark.
- DFS — reachability, cycles aur structural traversal.
- Topological sort — DAG dependency order; cycle ho toh complete order nahi.
- Dijkstra — non-negative weights; negative edge par use mat karo.
- Bellman-Ford — negative edges handle; reachable negative cycle detect kar sakta hai.
- DAG shortest path — topological relaxation; negative edges allowed.
- 0–1 BFS — weights 0/1; deque front/back se O(V + E).
- Union-Find — connectivity; path compression + rank/size useful.
- Path reconstruction — parent pointers se target se source wapas chalo.
- Connected components — har unvisited vertex se traversal start; single BFS disconnected nodes miss karega.
- Kahn algorithm — indegree-zero queue; processed count < V ho toh directed cycle hai.
- MST — all vertices minimum total edge cost se connect; source shortest paths se different problem.

### Graph representation

- Directed/undirected — edge one-way/two-way; weighted edge ka cost hota hai.
- Adjacency matrix — O(V²) space; edge existence O(1).
- Prim/Kruskal — minimum spanning tree; shortest-path problem se alag.

### Traversal checks

- Visited timing — BFS enqueue par mark; same node repeated queue mein bharne se bacho.
- Directed cycle — recursion-path/three-color state use; visited alone cycle ka proof nahi.
- Undirected cycle — DFS mein parent edge skip; doosra visited neighbor cycle signal de sakta hai.
- Bipartite — BFS/DFS se two-color; same-color edge conflict ho toh possible nahi.
- Shortest-path cost — BFS O(V+E); binary-heap Dijkstra typically O((V+E) log V), nonnegative weights ke liye.

### Edge cases aur reasoning

- SCC — directed graph mein mutual reachability groups; Kosaraju/Tarjan adjacency-list algorithms O(V+E), condensation graph DAG hota hai.
- Bridge low-link — undirected DFS edge (u,v) bridge when low[v]>tin[u]; multigraph parallel edges ke liye parent edge ID track karo.
- Union-Find bound — path compression+rank/size amortized O(alpha(n)) per operation; arbitrary edge deletion ordinary DSU efficiently support nahi.
- Negative-cycle scope — source-reachable negative cycle se reachable targets ka finite shortest distance undefined; unrelated components ko blindly invalid mat bolo.
- Lazy Dijkstra heap — old distance entries skip; queue O(E) grow ho sakti, multigraph mein log E cost qualifier track karo.
- MST connectivity — disconnected undirected graph par spanning forest milega; n-1 chosen edges ka connected-tree contract verify karo.

## Research notes: Negative edges in a DAG

- DAG mein negative edges ho sakti hain, negative cycles nahi.

## Example se samjho

- Scenario — A→B cost1, B→C cost1, A→C cost10; A se C minimum total cost chahiye.
- Reasoning — Fewest-edge BFS direct A→C choose kar sakta hai, cost10. Nonnegative weighted shortest-path reasoning A→B→C cost2 choose karti hai.
- Catch — Fewest hops aur minimum weight different objectives hain; Dijkstra ko negative edges par unchanged apply mat karo, disconnected targets ka result define karo.

## Recall aur practice

- Sawal — A→B→C→A aur C→D graph ke SCC groups kya hain?
- Jawaab — {A,B,C} ek SCC, {D} doosra; reverse path D se cycle tak nahi.
- Khud try karo — BFS/Dijkstra/DSU choose karke justify karo; disconnected node, zero edge, negative edge, parallel edge aur reachable negative cycle outcomes verify karo.

## Practice questions

### Easy · Unweighted shortest path (BFS)

Visited ko enqueue ke time mark karna chahiye ya dequeue ke time? Kyun?

<details>
<summary>Answer</summary>

```js
function shortestPath(graph, start, goal) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node === goal) return dist.get(node);
    for (const next of graph[node] ?? []) {
      if (dist.has(next)) continue;
      dist.set(next, dist.get(node) + 1); // enqueue par mark
      queue.push(next);
    }
  }
  return -1;
}
```

- Enqueue par mark — warna same node kai baar queue mein aata hai (memory/time waste).
- BFS — unweighted graph mein pehli baar pahunchna = shortest.

</details>

### Medium · Number of islands

Grid `'1'` land, `'0'` water. 4-directional connected islands gino.

<details>
<summary>Answer</summary>

```js
function numIslands(grid) {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '1') continue;
      count++;
      const stack = [[r, c]];
      grid[r][c] = '0';
      while (stack.length) {
        const [y, x] = stack.pop();
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && nx >= 0 && ny < rows && nx < cols && grid[ny][nx] === '1') {
            grid[ny][nx] = '0';
            stack.push([ny, nx]);
          }
        }
      }
    }
  }
  return count;
}
```

- Iterative DFS — bade grids par recursion overflow nahi.
- Input mutate hota hai; zaroorat ho toh `visited` set.
- `O(R · C)`.

</details>

### Medium · Course schedule (cycle detect)

`n` courses, prerequisites `[a, b]` = "a ke liye b pehle". Saare complete ho sakte hain?

<details>
<summary>Answer</summary>

```js
function canFinish(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []);
  const indegree = Array(n).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }
  const queue = [];
  indegree.forEach((d, i) => d === 0 && queue.push(i));
  let done = 0;
  for (let head = 0; head < queue.length; head++) {
    done++;
    for (const next of graph[queue[head]]) if (--indegree[next] === 0) queue.push(next);
  }
  return done === n;
}
```

- Kahn's algorithm — zero indegree nodes process; cycle wale nodes kabhi zero nahi hote.
- `queue` order — ek valid topological order bhi.
- `O(V + E)`.

</details>

### Medium · Dijkstra aur negative edges

Dijkstra non-negative weights kyun maangta hai? Implementation outline?

<details>
<summary>Answer</summary>

```js
function dijkstra(graph, source) {
  const dist = new Map([[source, 0]]);
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, source]);
  while (heap.size) {
    const [d, node] = heap.pop();
    if (d > dist.get(node)) continue; // stale entry
    for (const [next, w] of graph[node] ?? []) {
      const nd = d + w;
      if (nd < (dist.get(next) ?? Infinity)) {
        dist.set(next, nd);
        heap.push([nd, next]);
      }
    }
  }
  return dist;
}
```

- Greedy assumption — heap se nikla node final hai, kyunki aage ke paths sirf mehenge ho sakte hain; negative edge yeh tod deta hai.
- Negative edges — Bellman-Ford (`O(VE)`), negative cycles detect bhi karta hai.
- Lazy deletion — stale heap entries skip; `O((V + E) log V)`.

</details>

### Hard · Union-Find se redundant edge

Tree mein ek extra edge add hua (undirected). Woh edge dhundo jo cycle banata hai.

<details>
<summary>Answer</summary>

```js
function findRedundant(edges) {
  const parent = new Map();
  const rank = new Map();
  const find = (x) => {
    if (!parent.has(x)) { parent.set(x, x); rank.set(x, 0); }
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x))); // path compression
    return parent.get(x);
  };
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return [a, b];
    if (rank.get(ra) < rank.get(rb)) parent.set(ra, rb);
    else if (rank.get(ra) > rank.get(rb)) parent.set(rb, ra);
    else { parent.set(rb, ra); rank.set(ra, rank.get(ra) + 1); }
  }
  return null;
}
```

- Same root — dono ends pehle se connected; yeh edge cycle banata hai.
- Path compression + union by rank — almost constant (`α(n)`) per operation.
- Directed graph ke liye yeh approach nahi; wahan cycle detection DFS/Kahn se.

</details>

## Sources — aur padhne ke liye

- [Princeton directed graph/SCC reference](https://algs4.cs.princeton.edu/42digraph/)
- [Princeton bridge implementation](https://algs4.cs.princeton.edu/41graph/Bridge.java.html)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf)
- [Princeton's graph chapter](https://algs4.cs.princeton.edu/41graph/)
- [shortest paths chapter](https://algs4.cs.princeton.edu/44sp/)
- [Union-Find chapter](https://algs4.cs.princeton.edu/15uf/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/11-graphs-and-shortest-paths.md)
