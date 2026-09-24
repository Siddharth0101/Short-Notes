/**
 * ## Quick revision
 *
 * - Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
 * - O(1) — constant; O(log n) — range shrink; O(n) — single scan.
 * - O(n log n) — efficient comparison sorts; O(n²) — many pairwise scans.
 * - Space — auxiliary memory aur recursion stack count karo.
 * - Worst/average/amortized — alag guarantees; interchangeable nahi.
 * - Amortized — operations ki sequence ka total cost average karo.
 * - Recursion — calls × per-call work; stack depth bhi count karo.
 * - Solve — constraints → brute force → bottleneck → invariant → optimize.
 * - JS trap — `shift`, `slice`, spread aur string copies ka cost mat bhoolo.
 * - Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
 * - Two pointers — ordered/partitioned structure par boundaries move karo.
 * - Sliding window — contiguous range ko incremental add/remove se maintain karo.
 * - Variable window — shrink condition valid honi chahiye; negative sums monotonicity tod sakte hain.
 * - Prefix sum — range sum `prefix[r + 1] - prefix[l]`.
 * - Prefix map — previous sums count karke target-sum subarrays nikalo.
 * - Invariant — pointer/window move ke baad jo rule true rehta hai.
 * - Dry run — duplicates, empty input aur exact boundary check karo.
 * - Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
 * - Selection sort — minimum select; O(n²), generally unstable.
 * - Insertion sort — sorted prefix mein insert; O(n²), nearly sorted input par useful.
 * - Merge sort — split + merge; O(n log n), array version extra O(n) space.
 * - Quicksort — partition + recurse; average O(n log n), worst O(n²).
 * - Three-way partition — less/equal/greater regions; duplicates ke liye useful.
 * - Heap sort — O(n log n), typical array version O(1) extra space.
 * - Radix/counting — key range/digits ki assumptions par depend karte hain.
 * - Quickselect — kth item; expected O(n), worst O(n²).
 * - Stability — equal-key items ka original order bachta hai.
 * - Comparator — consistent ordering; JS numeric sort mein `(a, b) => a - b`.
 * - Inversions — merge ke waqt cross inversions count; O(n log n).
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
 * - Independent inputs — two lists sizes n,m hon toh O(n+m); blindly O(n) mat bolo.
 * - Log base — constant bases Big-O mein equivalent; repeated halving logarithmic growth deta hai.
 * - Output space — result materialize karna required ho toh minimum output-size cost bhi batao.
 */

'use strict';


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


const students = [
    { name: 'Alice', score: 2 },
    { name: 'Bob', score: 1 },
    { name: 'Charlie', score: 1 }
];
// Sample Input:  sort by score ascending
// Expected Output: Bob (1), Charlie (1), Alice (2)  - original order of equal scores preserved
console.log(students.sort((x, y) => x.score - y.score).map(s => s.name)); // ['Bob', 'Charlie', 'Alice']


// Inorder traversal of a sorted BST gives sorted array:
// Input BST: insert 5, 3, 7, 1, 4
// InOrder -> [1, 3, 4, 5, 7]  <- sorted!
console.log('BST InOrder gives sorted array: [1, 3, 4, 5, 7]');


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
