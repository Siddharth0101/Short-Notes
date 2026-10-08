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

## Recall aur practice

- Sawal — A→B→C→A aur C→D graph ke SCC groups kya hain?
- Jawaab — {A,B,C} ek SCC, {D} doosra; reverse path D se cycle tak nahi.
- Khud try karo — BFS/Dijkstra/DSU choose karke justify karo; disconnected node, zero edge, negative edge, parallel edge aur reachable negative cycle outcomes verify karo.

## Sources — aur padhne ke liye

- [Princeton directed graph/SCC reference](https://algs4.cs.princeton.edu/42digraph/)
- [Princeton bridge implementation](https://algs4.cs.princeton.edu/41graph/Bridge.java.html)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf)
- [Princeton's graph chapter](https://algs4.cs.princeton.edu/41graph/)
- [shortest paths chapter](https://algs4.cs.princeton.edu/44sp/)
- [Union-Find chapter](https://algs4.cs.princeton.edu/15uf/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/11-graphs-and-shortest-paths.md)
