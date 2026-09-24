/**
 * ## Quick revision
 *
 * - Graph — vertices + edges; direction/weights clarify karo.
 * - Adjacency list — sparse graphs mein O(V + E) storage.
 * - BFS — unweighted shortest path; enqueue karte hi visited mark.
 * - DFS — reachability, cycles aur structural traversal.
 * - Topological sort — DAG dependency order; cycle ho toh complete order nahi.
 * - Dijkstra — non-negative weights; negative edge par use mat karo.
 * - Bellman-Ford — negative edges handle; reachable negative cycle detect kar sakta hai.
 * - DAG shortest path — topological relaxation; negative edges allowed.
 * - 0–1 BFS — weights 0/1; deque front/back se O(V + E).
 * - Union-Find — connectivity; path compression + rank/size useful.
 * - Path reconstruction — parent pointers se target se source wapas chalo.
 * - Directed/undirected — edge one-way/two-way; weighted edge ka cost hota hai.
 * - Adjacency matrix — O(V²) space; edge existence O(1).
 * - Prim/Kruskal — minimum spanning tree; shortest-path problem se alag.
 * - Connected components — har unvisited vertex se traversal start; single BFS disconnected nodes miss karega.
 * - Kahn algorithm — indegree-zero queue; processed count < V ho toh directed cycle hai.
 * - MST — all vertices minimum total edge cost se connect; source shortest paths se different problem.
 */

'use strict';


class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    removeEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
            value => value !== vertex2
        );

        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
            value => value !== vertex1
        );
    }

    removeVertex(vertex) {
        while (this.adjacencyList[vertex].length) {
            const adjacentVertex = this.adjacencyList[vertex].pop();
            this.removeEdge(vertex, adjacentVertex);
        }

        delete this.adjacencyList[vertex];
    }

    depthFirstRecursive(start) {
        const result = [];
        const visited = {};
        const list = this.adjacencyList;

        function dfs(vertex) {
            if (!vertex) return;

            visited[vertex] = true;
            result.push(vertex);

            for (const neighbor of list[vertex]) {
                if (!visited[neighbor]) dfs(neighbor);
            }
        }

        dfs(start);
        return result;
    }

    depthFirstIterative(start) {
        const stack = [start];
        const result = [];
        const visited = { [start]: true };

        while (stack.length) {
            const vertex = stack.pop();
            result.push(vertex);

            for (const neighbor of this.adjacencyList[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                }
            }
        }

        return result;
    }

    breadthFirst(start) {
        const queue = [start];
        const result = [];
        const visited = { [start]: true };

        while (queue.length) {
            const vertex = queue.shift();
            result.push(vertex);

            for (const neighbor of this.adjacencyList[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }
}

// Sample usage: Build Graph and test traversals
const g = new Graph();

// Sample Input:  Build graph A-B-C-D-E-F
//        A
//       / \
//      B   C
//      |   |
//      D   E
//       \ /
//        F
g.addEdge('A', 'B');
g.addEdge('A', 'C');
g.addEdge('B', 'D');
g.addEdge('C', 'E');
g.addEdge('D', 'F');
g.addEdge('E', 'F');

// Sample Input:  adjacencyList of 'A'
// Expected Output: ['B', 'C']
console.log(g.adjacencyList['A']); // ['B', 'C']

// Sample Input:  depthFirstRecursive('A')
// Expected Output: starts with A, visits all 6 vertices
console.log(g.depthFirstRecursive('A')); // e.g. ['A', 'B', 'D', 'F', 'E', 'C']

// Sample Input:  depthFirstIterative('A')
// Expected Output: starts with A, visits all 6 vertices (order may differ from recursive)
console.log(g.depthFirstIterative('A')); // e.g. ['A', 'C', 'E', 'F', 'D', 'B']

// Sample Input:  breadthFirst('A')
// Expected Output: ['A', 'B', 'C', 'D', 'E', 'F']  (level order)
console.log(g.breadthFirst('A')); // ['A', 'B', 'C', 'D', 'E', 'F']

// removeEdge test:
// Sample Input:  removeEdge('A', 'B')
// Expected: 'B' no longer in A's list, 'A' no longer in B's list
g.removeEdge('A', 'B');
console.log(g.adjacencyList['A']); // ['C']
console.log(g.adjacencyList['B']); // ['D']

// removeVertex test:
// Sample Input:  removeVertex('C')
// Expected: 'C' key removed, 'A' and 'E' no longer have 'C' in their list
g.removeVertex('C');
console.log(g.adjacencyList['C']); // undefined
console.log(g.adjacencyList['A']); // []  (A had only C left after B removed)


class SimplePriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(value, priority) {
        this.values.push({ value, priority });
        this.values.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.values.shift();
    }
}

class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(vertex1, vertex2, weight) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }

    dijkstra(start, finish) {
        const nodes = new SimplePriorityQueue();
        const distances = {};
        const previous = {};
        const path = [];
        let smallest;

        for (const vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }

            previous[vertex] = null;
        }

        while (nodes.values.length) {
            smallest = nodes.dequeue().value;

            if (smallest === finish) {
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if (smallest || distances[smallest] !== Infinity) {
                for (const neighbor of this.adjacencyList[smallest]) {
                    const candidate = distances[smallest] + neighbor.weight;
                    const nextNeighbor = neighbor.node;

                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate;
                        previous[nextNeighbor] = smallest;
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }

        return path.concat(smallest).reverse();
    }
}

// Sample usage: WeightedGraph with Dijkstra
const wg = new WeightedGraph();

// Build graph:
//  A ---4--- B
//  |         |
//  2         3
//  |         |
//  C ---1--- B  (C->B weight 1)
//  |
//  5
//  |
//  D ---1--- F
wg.addEdge('A', 'B', 4);
wg.addEdge('A', 'C', 2);
wg.addEdge('B', 'D', 3);
wg.addEdge('C', 'B', 1);
wg.addEdge('C', 'D', 5);
wg.addEdge('D', 'F', 1);

// Sample Input:  dijkstra('A', 'F')
// Expected Output: ['A', 'C', 'B', 'D', 'F']  (shortest: cost = 2+1+3+1 = 7)
console.log(wg.dijkstra('A', 'F')); // ['A', 'C', 'B', 'D', 'F']

// Sample Input:  dijkstra('A', 'D')
// Expected Output: ['A', 'C', 'B', 'D']  (cost = 2+1+3 = 6)
console.log(wg.dijkstra('A', 'D')); // ['A', 'C', 'B', 'D']


class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, index) => index);
        this.rank = new Array(size).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }

        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }

        return true;
    }
}

// Sample usage: UnionFind
const uf = new UnionFind(5);

// Sample Input:  union(0, 1), union(1, 2)
// Expected: 0, 1, 2 are in same component
uf.union(0, 1);
uf.union(1, 2);

// Sample Input:  find(0) === find(2)
// Expected Output: true  (same component)
console.log(uf.find(0) === uf.find(2)); // true

// Sample Input:  find(3) === find(0)
// Expected Output: false  (3 not connected to 0)
console.log(uf.find(3) === uf.find(0)); // false

// Sample Input:  union(3, 4), then find(3) === find(4)
uf.union(3, 4);
console.log(uf.find(3) === uf.find(4)); // true

// Sample Input:  union(2, 3) - merges {0,1,2} with {3,4}
const mergedNew = uf.union(2, 3);
// Expected Output: true (they were in different components)
console.log(mergedNew); // true

// Now all 5 nodes in same component:
console.log(uf.find(0) === uf.find(4)); // true

// union of already-connected nodes returns false:
console.log(uf.union(0, 4)); // false  (already connected)
