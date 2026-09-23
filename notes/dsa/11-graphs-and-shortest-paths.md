---
id: dsa-graphs
title: Graph traversal and shortest paths
track: dsa
order: 11
level: Advanced
minutes: 1
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

## Research notes: Negative edges in a DAG

- DAG mein negative edges ho sakti hain, negative cycles nahi.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf)
- [Princeton's graph chapter](https://algs4.cs.princeton.edu/41graph/)
- [shortest paths chapter](https://algs4.cs.princeton.edu/44sp/)
- [Union-Find chapter](https://algs4.cs.princeton.edu/15uf/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/11-graphs-and-shortest-paths.md)
