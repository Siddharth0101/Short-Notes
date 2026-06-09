'use strict';

/**
 * ========================================================================
 * GRAPHS, TRAVERSALS, AND SHORTEST PATH
 * ========================================================================
 * NOTES:
 * - Graph nodes/vertices aur connections/edges ka collection hai.
 * - Trees graphs ka special case hain, but graphs me cycles ho sakte hain.
 *
 * REAL EXAMPLES:
 * - Social network
 * - Google Maps
 * - Recommendation systems
 * - Network routing
 * - Dependency graph
 */


/**
 * ========================================================================
 * 1. GRAPH TYPES
 * ========================================================================
 *
 * Directed graph:
 * - Edge ka direction hota hai. A -> B.
 *
 * Undirected graph:
 * - Edge two-way hota hai. A - B.
 *
 * Weighted graph:
 * - Edge par cost/distance/time hota hai.
 *
 * Unweighted graph:
 * - Edge same cost maana jaata hai.
 *
 * Cyclic:
 * - Cycle present hai.
 *
 * Acyclic:
 * - Cycle nahi hai.
 */


/**
 * ========================================================================
 * 2. GRAPH REPRESENTATION
 * ========================================================================
 *
 * Adjacency matrix:
 * - 2D matrix.
 * - Check edge: O(1)
 * - Space: O(V^2)
 *
 * Adjacency list:
 * - Har vertex ke neighbours ki list.
 * - Space: O(V + E)
 * - Sparse graphs ke liye best.
 */

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


/**
 * ========================================================================
 * 3. DFS VS BFS
 * ========================================================================
 *
 * DFS:
 * - Deep jaata hai pehle.
 * - Stack/recursion use hota hai.
 * - Connected components, cycle detection, topological sort.
 *
 * BFS:
 * - Level by level.
 * - Queue use hoti hai.
 * - Unweighted shortest path.
 */


/**
 * ========================================================================
 * 4. WEIGHTED GRAPH AND DIJKSTRA
 * ========================================================================
 * NOTES:
 * - Dijkstra non-negative weights wale graph me shortest path find karta hai.
 * - Priority queue se closest unvisited node pehle process hota hai.
 *
 * TIME:
 * - With binary heap: O((V + E) log V)
 */

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


/**
 * ========================================================================
 * 5. OTHER GRAPH ALGORITHMS - SHORT MAP
 * ========================================================================
 *
 * Topological sort:
 * - Directed acyclic graph dependencies order karna.
 * - Example: course prerequisites, build steps.
 *
 * Bellman-Ford:
 * - Negative weights handle kar sakta hai.
 * - Negative cycle detect kar sakta hai.
 *
 * Floyd-Warshall:
 * - All pairs shortest path.
 * - Time O(V^3).
 *
 * Minimum Spanning Tree:
 * - Connect all vertices with minimum total edge weight.
 * - Algorithms: Kruskal, Prim.
 *
 * Union Find / Disjoint Set:
 * - Components merge/find karne ke liye.
 * - Kruskal and cycle detection me useful.
 */

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
