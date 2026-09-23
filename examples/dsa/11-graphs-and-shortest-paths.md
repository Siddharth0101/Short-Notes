# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## DFS, cycles, and topological order

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

## Union-Find for connectivity

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

## Choose the correct path algorithm

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
