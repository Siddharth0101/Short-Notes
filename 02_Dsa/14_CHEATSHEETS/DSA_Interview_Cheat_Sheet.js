'use strict';

/**
 * ========================================================================
 * DSA INTERVIEW CHEAT SHEET [⚡ VISUAL]
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
 *
 * EXAMPLE - comparing time for same input n=1000:
 * O(1)       -> 1 operation
 * O(log n)   -> ~10 operations
 * O(n)       -> 1000 operations
 * O(n log n) -> ~10000 operations
 * O(n^2)     -> 1,000,000 operations  <- DANGER ZONE for large inputs
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
 *
 * EXAMPLE - quick demonstration:
 */

// Array - ordered
// Input:  [3, 1, 2], index=1
// Output: 1  (O(1) access)
const arr = [3, 1, 2];
console.log(arr[1]); // 1

// Map - fast lookup
// Input:  set('name', 'sidd'), get('name')
// Output: 'sidd'
const map = new Map();
map.set('name', 'sidd');
console.log(map.get('name')); // 'sidd'

// Set - unique values
// Input:  [1, 2, 2, 3, 3, 3]
// Output: [1, 2, 3]
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3]


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
 *
 * EXAMPLE - pattern matching:
 */

// FREQUENCY COUNTER pattern
// Input:  str1='listen', str2='silent'
// Output: true  (anagram)
function isAnagram(s1, s2) {
    if (s1.length !== s2.length) return false;
    const freq = {};
    for (const c of s1) freq[c] = (freq[c] || 0) + 1;
    for (const c of s2) {
        if (!freq[c]) return false;
        freq[c]--;
    }
    return true;
}

// Sample Input:  'listen', 'silent'
// Expected Output: true
console.log(isAnagram('listen', 'silent')); // true

// Sample Input:  'hello', 'world'
// Expected Output: false
console.log(isAnagram('hello', 'world')); // false

// BINARY SEARCH pattern
// Input:  sorted=[1,3,5,7,9,11], target=7
// Output: 3  (index of 7)
function binarySearch(sorted, target) {
    let l = 0, r = sorted.length - 1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (sorted[mid] === target) return mid;
        if (sorted[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

// Sample Input:  [1,3,5,7,9,11], target=7
// Expected Output: 3
console.log(binarySearch([1,3,5,7,9,11], 7)); // 3

// SLIDING WINDOW pattern
// Input:  [2, 6, 9, 2, 1, 8, 5, 6, 3], k=3
// Output: 19  (max sum subarray of size 3: [8,5,6])
function maxSumWindow(nums, k) {
    let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);
    let max = sum;
    for (let i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];
        max = Math.max(max, sum);
    }
    return max;
}

// Sample Input:  [2, 6, 9, 2, 1, 8, 5, 6, 3], k=3
// Expected Output: 19
console.log(maxSumWindow([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)); // 19


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
 *
 * EXAMPLE:
 */

const a = [1, 2, 3, 4, 5];

// O(1) access
console.log(a[2]); // 3

// O(1) push
a.push(6);
console.log(a); // [1, 2, 3, 4, 5, 6]

// O(1) pop
console.log(a.pop()); // 6

// O(n) sort
console.log([...a].sort((x, y) => y - x)); // [5, 4, 3, 2, 1] (descending)


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
 *
 * EXAMPLE - demonstrate stable vs unstable sort behavior:
 * Input:  [{name:'A', score:1}, {name:'B', score:1}, {name:'C', score:2}]
 * Stable sort by score: A and B keep relative order
 * JavaScript Array.sort() is stable in modern engines.
 */

const students = [
    { name: 'Alice', score: 2 },
    { name: 'Bob', score: 1 },
    { name: 'Charlie', score: 1 }
];
// Sample Input:  sort by score ascending
// Expected Output: Bob (1), Charlie (1), Alice (2)  - original order of equal scores preserved
console.log(students.sort((x, y) => x.score - y.score).map(s => s.name)); // ['Bob', 'Charlie', 'Alice']


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
 *
 * EXAMPLE - simple traversal on array-represented tree:
 *
 * Tree:     1
 *          / \
 *         2   3
 *        / \
 *       4   5
 *
 * BFS order:      [1, 2, 3, 4, 5]
 * PreOrder:       [1, 2, 4, 5, 3]
 * InOrder:        [4, 2, 5, 1, 3]
 * PostOrder:      [4, 5, 2, 3, 1]
 */

// Inorder traversal of a sorted BST gives sorted array:
// Input BST: insert 5, 3, 7, 1, 4
// InOrder -> [1, 3, 4, 5, 7]  <- sorted!
console.log('BST InOrder gives sorted array: [1, 3, 4, 5, 7]');


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
 *
 * EXAMPLE walkthrough for Two Sum:
 * Problem: Find indices of two numbers that add to target.
 * Input:   [2, 7, 11, 15], target=9
 * Brute:   O(n^2) - check all pairs
 * Optimal: O(n) - use Map to store seen numbers
 * Answer:  [0, 1]  (2+7=9)
 */

// Quick Two Sum demo:
function twoSumCheat(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
    }
    return [];
}

// Sample Input:  [2, 7, 11, 15], target = 9
// Expected Output: [0, 1]
console.log(twoSumCheat([2, 7, 11, 15], 9)); // [0, 1]

// Sample Input:  [1, 5, 3, 7], target = 8
// Expected Output: [1, 2]  (5+3=8)
console.log(twoSumCheat([1, 5, 3, 7], 8)); // [1, 2]


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
 *
 * EXAMPLE - edge cases for binary search:
 */

function binarySearchEdge(sorted, target) {
    let l = 0, r = sorted.length - 1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (sorted[mid] === target) return mid;
        if (sorted[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

// Empty array edge case:
// Sample Input:  [], target=5
// Expected Output: -1
console.log(binarySearchEdge([], 5)); // -1

// Single element - found:
// Sample Input:  [7], target=7
// Expected Output: 0
console.log(binarySearchEdge([7], 7)); // 0

// Single element - not found:
// Sample Input:  [7], target=5
// Expected Output: -1
console.log(binarySearchEdge([7], 5)); // -1

// Target not in array:
// Sample Input:  [1,3,5,7], target=4
// Expected Output: -1
console.log(binarySearchEdge([1,3,5,7], 4)); // -1
