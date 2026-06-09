'use strict';

/**
 * ========================================================================
 * DSA INTERVIEW CHEAT SHEET
 * ========================================================================
 * NOTES:
 * - Ye quick revision file hai.
 * - Detailed explanations topic folders me hain.
 */


/**
 * ========================================================================
 * 1. BIG O QUICK ORDER
 * ========================================================================
 *
 * O(1)        Best - constant
 * O(log n)    Binary search style
 * O(n)        Single pass
 * O(n log n)  Efficient sorting
 * O(n^2)      Nested loops
 * O(2^n)      Brute force subsets/recursion
 * O(n!)       Permutations
 */


/**
 * ========================================================================
 * 2. DATA STRUCTURE CHOOSING GUIDE
 * ========================================================================
 *
 * Need ordered collection                -> Array
 * Need fast lookup by key                -> Map / Object
 * Need unique values                     -> Set
 * Need first-in-first-out                -> Queue
 * Need last-in-first-out                 -> Stack
 * Need frequent insert/delete nodes      -> Linked List
 * Need hierarchy                         -> Tree
 * Need fast min/max                      -> Heap
 * Need prefix search                     -> Trie
 * Need relationships/networks            -> Graph
 * Need connected components              -> Union Find
 * Need range queries                     -> Segment Tree / Fenwick Tree
 */


/**
 * ========================================================================
 * 3. PATTERN SIGNALS
 * ========================================================================
 *
 * "Count frequency", "same chars", "anagram"
 * -> Frequency counter / Map
 *
 * "Sorted array", "pair", "target sum"
 * -> Multiple pointers
 *
 * "Contiguous subarray/substring"
 * -> Sliding window
 *
 * "Sorted search"
 * -> Binary search
 *
 * "All combinations/permutations/subsets"
 * -> Backtracking
 *
 * "Shortest path unweighted"
 * -> BFS
 *
 * "Shortest path weighted non-negative"
 * -> Dijkstra
 *
 * "Dependencies order"
 * -> Topological sort
 *
 * "Repeated subproblems"
 * -> Dynamic programming
 */


/**
 * ========================================================================
 * 4. ARRAY AND OBJECT COMPLEXITIES
 * ========================================================================
 *
 * Array access by index       O(1)
 * Array push/pop              O(1)
 * Array shift/unshift         O(n)
 * Array search                O(n)
 * Array sort                  O(n log n)
 *
 * Object/Map get/set/delete   O(1) average
 * Object keys/values/entries  O(n)
 * Set has/add/delete          O(1) average
 */


/**
 * ========================================================================
 * 5. SORTING COMPLEXITIES
 * ========================================================================
 *
 * Bubble sort       O(n^2), best O(n) with noSwap
 * Selection sort    O(n^2)
 * Insertion sort    O(n^2), good for nearly sorted data
 * Merge sort        O(n log n), space O(n)
 * Quick sort        O(n log n) average, O(n^2) worst
 * Radix sort        O(n * k), integers/digits based
 */


/**
 * ========================================================================
 * 6. GRAPH COMPLEXITIES
 * ========================================================================
 *
 * BFS / DFS adjacency list    O(V + E)
 * BFS / DFS adjacency matrix  O(V^2)
 * Dijkstra with heap          O((V + E) log V)
 * Bellman-Ford                O(V * E)
 * Floyd-Warshall              O(V^3)
 * Topological sort            O(V + E)
 * Union Find operations       Almost O(1) with path compression + rank
 */


/**
 * ========================================================================
 * 7. TREE TRAVERSALS
 * ========================================================================
 *
 * BFS:
 * - Level order.
 * - Queue.
 *
 * DFS Preorder:
 * - Node, left, right.
 *
 * DFS Inorder:
 * - Left, node, right.
 * - BST me sorted result.
 *
 * DFS Postorder:
 * - Left, right, node.
 */


/**
 * ========================================================================
 * 8. BROADER DSA CONCEPT MAP
 * ========================================================================
 *
 * Foundations:
 * - Big O, time/space complexity, logarithms, recursion, bit manipulation.
 *
 * Linear structures:
 * - Array, string, linked list, stack, queue, deque.
 *
 * Hashing:
 * - Hash table, Map, Set, collision handling, frequency counter.
 *
 * Trees:
 * - Binary tree, BST, AVL, Red Black tree, heap, trie, segment tree, Fenwick tree.
 *
 * Graphs:
 * - BFS, DFS, shortest path, MST, topological sort, connected components.
 *
 * Algorithm patterns:
 * - Two pointers, sliding window, divide and conquer, greedy, backtracking, DP.
 *
 * Advanced:
 * - Union Find, KMP, rolling hash, bitmasking, interval problems, sweep line.
 */


/**
 * ========================================================================
 * 9. INTERVIEW ANSWER TEMPLATE
 * ========================================================================
 *
 * 1. Clarify input/output.
 * 2. Mention brute force first if useful.
 * 3. Explain optimized idea.
 * 4. Walk through example.
 * 5. Code cleanly.
 * 6. Test edge cases.
 * 7. State time and space complexity.
 */


/**
 * ========================================================================
 * 10. EDGE CASES TO REMEMBER
 * ========================================================================
 *
 * - Empty input
 * - One item
 * - Duplicates
 * - Negative numbers
 * - Zero
 * - Already sorted
 * - Reverse sorted
 * - Very large input
 * - Target not found
 * - Disconnected graph
 * - Cycle in graph/list
 * - Null root in tree
 */
