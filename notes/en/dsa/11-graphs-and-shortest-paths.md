---
id: dsa-graphs
title: Graph traversal and shortest paths
track: dsa
order: 11
level: Advanced
minutes: 5
summary: Graph — vertices + edges; clarify direction and weights.
tags: graph, bfs, dfs, dijkstra, topological-sort
visual: bfs
---

## Quick revision

> Revision target — Choose the traversal/shortest-path algorithm from the edge weights and the required answer.

- Graph — vertices + edges; clarify direction/weights.
- Adjacency list — O(V + E) storage for sparse graphs.
- BFS — the unweighted shortest path; mark visited as soon as you enqueue.
- DFS — reachability, cycles and structural traversal.
- Topological sort — a dependency order for a DAG; with a cycle there is no complete order.
- Dijkstra — non-negative weights; do not use it with a negative edge.
- Bellman-Ford — handles negative edges; can detect a reachable negative cycle.
- DAG shortest path — topological relaxation; negative edges are allowed.
- 0–1 BFS — weights 0/1; O(V + E) using the front/back of a deque.
- Union-Find — connectivity; path compression + rank/size are useful.
- Path reconstruction — walk back from the target to the source through parent pointers.
- Connected components — start a traversal from every unvisited vertex; a single BFS misses disconnected nodes.
- Kahn algorithm — a queue of indegree-zero nodes; if the processed count < V there is a directed cycle.
- MST — connects all vertices at the minimum total edge cost; a different problem from source shortest paths.

### Graph representation

- Directed/undirected — an edge is one-way/two-way; a weighted edge has a cost.
- Adjacency matrix — O(V²) space; edge existence in O(1).
- Prim/Kruskal — the minimum spanning tree; different from the shortest-path problem.

### Traversal checks

- Visited timing — in BFS mark on enqueue; avoid filling the queue with the same node repeatedly.
- Directed cycle — use a recursion-path/three-colour state; visited alone is not proof of a cycle.
- Undirected cycle — skip the parent edge in DFS; another visited neighbour can signal a cycle.
- Bipartite — two-colour with BFS/DFS; if an edge joins the same colour it is not possible.
- Shortest-path cost — BFS O(V+E); binary-heap Dijkstra typically O((V+E) log V), for nonnegative weights.

### Edge cases and reasoning

- SCC — groups of mutual reachability in a directed graph; the Kosaraju/Tarjan adjacency-list algorithms are O(V+E), and the condensation graph is a DAG.
- Bridge low-link — in an undirected DFS the edge (u,v) is a bridge when low[v]>tin[u]; track the parent edge ID for parallel edges in a multigraph.
- Union-Find bound — path compression+rank/size is amortized O(alpha(n)) per operation; an ordinary DSU does not efficiently support arbitrary edge deletion.
- Negative-cycle scope — targets reachable from a source-reachable negative cycle have no finite shortest distance; do not blindly call unrelated components invalid.
- Lazy Dijkstra heap — skip old distance entries; the queue can grow to O(E), and in a multigraph track the log E cost qualifier.
- MST connectivity — a disconnected undirected graph gives a spanning forest; verify the connected-tree contract of n-1 chosen edges.

## Research notes: Negative edges in a DAG

- A DAG can have negative edges, but not negative cycles.

## Understand it with an example

- Scenario — A→B costs 1, B→C costs 1, A→C costs 10; the minimum total cost from A to C is needed.
- Reasoning — A fewest-edge BFS can choose the direct A→C, cost 10. Nonnegative weighted shortest-path reasoning chooses A→B→C, cost 2.
- Catch — Fewest hops and minimum weight are different objectives; do not apply Dijkstra unchanged to negative edges, and define the result for disconnected targets.

## Recall and practice

- Question — What are the SCC groups of the graph A→B→C→A plus C→D?
- Answer — {A,B,C} is one SCC and {D} another; there is no reverse path from D to the cycle.
- Try it yourself — Choose between BFS/Dijkstra/DSU and justify it; verify the outcomes for a disconnected node, a zero edge, a negative edge, a parallel edge and a reachable negative cycle.

## Practice questions

### Easy · Unweighted shortest path (BFS)

Should visited be marked at enqueue time or at dequeue time? Why?

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
      dist.set(next, dist.get(node) + 1); // mark on enqueue
      queue.push(next);
    }
  }
  return -1;
}
```

- Mark on enqueue — otherwise the same node enters the queue several times (wasted memory/time).
- BFS — in an unweighted graph the first arrival = the shortest.

</details>

### Medium · Number of islands

In the grid `'1'` is land and `'0'` is water. Count the 4-directionally connected islands.

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

- Iterative DFS — no recursion overflow on large grids.
- The input is mutated; use a `visited` set if needed.
- `O(R · C)`.

</details>

### Medium · Course schedule (cycle detect)

`n` courses, prerequisites `[a, b]` = "b comes before a". Can all of them be completed?

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

- Kahn's algorithm — process the zero-indegree nodes; nodes on a cycle never reach zero.
- `queue` order — it is also one valid topological order.
- `O(V + E)`.

</details>

### Medium · Dijkstra and negative edges

Why does Dijkstra demand non-negative weights? An implementation outline?

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

- Greedy assumption — a node taken off the heap is final, because later paths can only be costlier; a negative edge breaks that.
- Negative edges — Bellman-Ford (`O(VE)`), which also detects negative cycles.
- Lazy deletion — skip stale heap entries; `O((V + E) log V)`.

</details>

### Hard · A redundant edge with Union-Find

One extra edge was added to a tree (undirected). Find the edge that creates the cycle.

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

- Same root — both ends are already connected; this edge creates the cycle.
- Path compression + union by rank — almost constant (`α(n)`) per operation.
- This approach is not for a directed graph; there, detect cycles with DFS/Kahn.

</details>

## Sources — further reading

- [Princeton directed graph/SCC reference](https://algs4.cs.princeton.edu/42digraph/)
- [Princeton bridge implementation](https://algs4.cs.princeton.edu/41graph/Bridge.java.html)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf)
- [Princeton's graph chapter](https://algs4.cs.princeton.edu/41graph/)
- [shortest paths chapter](https://algs4.cs.princeton.edu/44sp/)
- [Union-Find chapter](https://algs4.cs.princeton.edu/15uf/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/11-graphs-and-shortest-paths.md)
