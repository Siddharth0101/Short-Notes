'use strict';

/**
 * ========================================================================
 * ADVANCED DSA CONCEPTS - SHORT MAP [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Ye file un concepts ka quick intro hai jo core Colt-style DSA path ke baad
 *   interviews/competitive programming me dikhte hain.
 * - Sabko ek din me master karna zaroori nahi, but names aur use cases yaad rakho.
 */


/**
 * ========================================================================
 * 1. GREEDY ALGORITHMS
 * ========================================================================
 * NOTES:
 * - Greedy har step par locally best choice leta hai.
 * - Greedy tabhi correct hota hai jab local best choices global best answer banati hain.
 *
 * EXAMPLES:
 * - Activity selection
 * - Minimum platforms
 * - Huffman coding
 * - Prim/Kruskal MST
 * - Jump game style problems
 *
 * EXAMPLE - activitySelection:
 * Input:  intervals = [[1,3], [0,2], [3,4], [2,4], [1,2]]
 * Output: [[0,2], [2,4]]  or [[1,2], [3,4]]  - max non-overlapping activities
 *
 * Sorted by end time: [[0,2], [1,2], [1,3], [2,4], [3,4]]
 * Pick [0,2], skip [1,2] (overlaps), skip [1,3] (overlaps), pick [2,4] (2>=2), done
 * Output: [[0,2], [2,4]]
 */

function activitySelection(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);

    const selected = [];
    let lastEnd = -Infinity;

    for (const interval of intervals) {
        const [start, end] = interval;

        if (start >= lastEnd) {
            selected.push(interval);
            lastEnd = end;
        }
    }

    return selected;
}

// Sample Input:  [[1,4], [3,5], [0,6], [5,7], [3,9], [5,9], [6,10], [8,11], [8,12], [2,14], [12,16]]
// Expected Output: [[1,4], [5,7], [8,11], [12,16]]  (max 4 non-overlapping)
console.log(activitySelection([[1,4], [3,5], [0,6], [5,7], [3,9], [5,9], [6,10], [8,11], [8,12], [2,14], [12,16]]));
// [[1,4], [5,7], [8,11], [12,16]]

// Sample Input:  [[1,3], [2,4], [3,5]]
// Expected Output: [[1,3], [3,5]]  (pick [1,3] then [3,5], skip [2,4])
console.log(activitySelection([[1,3], [2,4], [3,5]])); // [[1,3], [3,5]]


/**
 * ========================================================================
 * 2. INTERVAL PROBLEMS
 * ========================================================================
 * NOTES:
 * - Intervals me mostly sorting by start/end important hota hai.
 * - Merge, overlap, meeting rooms, insert interval common problems hain.
 *
 * EXAMPLE - mergeIntervals:
 * Input:  [[1,3], [2,6], [8,10], [15,18]]
 * Output: [[1,6], [8,10], [15,18]]
 *   - [1,3] and [2,6] overlap -> merged to [1,6]
 *   - [8,10] separate
 *   - [15,18] separate
 *
 * Input:  [[1,4], [4,5]]
 * Output: [[1,5]]  (touching intervals merge)
 */

function mergeIntervals(intervals) {
    if (intervals.length === 0) return [];

    intervals.sort((a, b) => a[0] - b[0]);

    const merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = intervals[i];

        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }

    return merged;
}

// Sample Input:  [[1,3], [2,6], [8,10], [15,18]]
// Expected Output: [[1,6], [8,10], [15,18]]
console.log(mergeIntervals([[1,3], [2,6], [8,10], [15,18]])); // [[1,6], [8,10], [15,18]]

// Sample Input:  [[1,4], [4,5]]
// Expected Output: [[1,5]]
console.log(mergeIntervals([[1,4], [4,5]])); // [[1,5]]

// Sample Input:  [[1,4], [2,3]]  (one fully inside other)
// Expected Output: [[1,4]]
console.log(mergeIntervals([[1,4], [2,3]])); // [[1,4]]

// Sample Input:  []
// Expected Output: []
console.log(mergeIntervals([])); // []


/**
 * ========================================================================
 * 3. SWEEP LINE
 * ========================================================================
 * NOTES:
 * - Events ko sorted order me process karo.
 * - Start event count badhata hai, end event count kam karta hai.
 * - Maximum overlap, calendar booking, meeting rooms me useful.
 *
 * EXAMPLE - minMeetingRooms:
 * Input:  [[0,30], [5,10], [15,20]]
 * Output: 2
 *   - At time 0: +1 (meeting 1 starts) -> rooms = 1
 *   - At time 5: +1 (meeting 2 starts) -> rooms = 2  <- peak
 *   - At time 10: -1 (meeting 2 ends) -> rooms = 1
 *   - At time 15: +1 (meeting 3 starts) -> rooms = 2
 *   - At time 20: -1 (meeting 3 ends) -> rooms = 1
 *   - At time 30: -1 (meeting 1 ends) -> rooms = 0
 *
 * Input:  [[7,10], [2,4]]
 * Output: 1  (no overlap)
 */

function minMeetingRooms(intervals) {
    const events = [];

    for (const [start, end] of intervals) {
        events.push([start, 1]);
        events.push([end, -1]);
    }

    events.sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1];
        return a[0] - b[0];
    });

    let current = 0;
    let maxRooms = 0;

    for (const event of events) {
        current += event[1];
        maxRooms = Math.max(maxRooms, current);
    }

    return maxRooms;
}

// Sample Input:  [[0,30], [5,10], [15,20]]
// Expected Output: 2
console.log(minMeetingRooms([[0,30], [5,10], [15,20]])); // 2

// Sample Input:  [[7,10], [2,4]]
// Expected Output: 1  (meetings don't overlap)
console.log(minMeetingRooms([[7,10], [2,4]])); // 1

// Sample Input:  [[1,5], [2,4], [3,6]]
// Expected Output: 3  (all 3 overlap at some point)
console.log(minMeetingRooms([[1,5], [2,4], [3,6]])); // 3


/**
 * ========================================================================
 * 4. BIT MANIPULATION
 * ========================================================================
 * NOTES:
 * - Numbers binary bits me operate hote hain.
 * - Very fast and useful for sets, parity, masks, XOR tricks.
 *
 * COMMON OPERATORS:
 * - &  AND
 * - |  OR
 * - ^  XOR
 * - ~  NOT
 * - << left shift
 * - >> right shift
 *
 * EXAMPLE - isOdd:
 * Input:  7  -> Output: true   (7 in binary = 111, last bit = 1 = odd)
 * Input:  8  -> Output: false  (8 in binary = 1000, last bit = 0 = even)
 *
 * EXAMPLE - singleNumber:
 * Input:  [4, 1, 2, 1, 2]
 * Output: 4  (all others appear twice, XOR of pairs cancel out)
 *
 * EXAMPLE - countSetBits:
 * Input:  13  (binary: 1101, three 1s)
 * Output: 3
 */

function isOdd(num) {
    return (num & 1) === 1;
}

// Sample Input:  7
// Expected Output: true  (7 is odd)
console.log(isOdd(7));  // true

// Sample Input:  8
// Expected Output: false  (8 is even)
console.log(isOdd(8));  // false

// Sample Input:  0
// Expected Output: false
console.log(isOdd(0));  // false

function singleNumber(nums) {
    let result = 0;

    for (const num of nums) {
        result ^= num;
    }

    return result;
}

// Sample Input:  [4, 1, 2, 1, 2]
// Expected Output: 4  (1 XOR 1=0, 2 XOR 2=0, only 4 remains)
console.log(singleNumber([4, 1, 2, 1, 2])); // 4

// Sample Input:  [2, 2, 1]
// Expected Output: 1
console.log(singleNumber([2, 2, 1])); // 1

// Sample Input:  [1]
// Expected Output: 1
console.log(singleNumber([1])); // 1

function countSetBits(num) {
    let count = 0;

    while (num > 0) {
        num = num & (num - 1);
        count++;
    }

    return count;
}

// Sample Input:  13  (binary: 1101, three 1-bits)
// Expected Output: 3
console.log(countSetBits(13)); // 3

// Sample Input:  7  (binary: 111, three 1-bits)
// Expected Output: 3
console.log(countSetBits(7));  // 3

// Sample Input:  8  (binary: 1000, one 1-bit)
// Expected Output: 1
console.log(countSetBits(8));  // 1

// Sample Input:  0
// Expected Output: 0
console.log(countSetBits(0));  // 0


/**
 * ========================================================================
 * 5. BITMASKING
 * ========================================================================
 * NOTES:
 * - Bitmask ek integer hota hai jisme bits choices represent karte hain.
 * - Subsets, visited states, DP over subsets me useful.
 *
 * EXAMPLE - subsetsWithBitmask:
 * Input:  [1, 2, 3]
 * Output: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]  (8 = 2^3 subsets)
 *
 * Each mask (0 to 7) represents which elements to include:
 * mask=0 (000) -> []
 * mask=1 (001) -> [1]  (bit 0 set)
 * mask=2 (010) -> [2]  (bit 1 set)
 * mask=3 (011) -> [1,2]
 * mask=4 (100) -> [3]  (bit 2 set)
 * mask=5 (101) -> [1,3]
 * mask=6 (110) -> [2,3]
 * mask=7 (111) -> [1,2,3]
 */

function subsetsWithBitmask(nums) {
    const result = [];
    const totalMasks = 1 << nums.length;

    for (let mask = 0; mask < totalMasks; mask++) {
        const subset = [];

        for (let i = 0; i < nums.length; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }

        result.push(subset);
    }

    return result;
}

// Sample Input:  [1, 2, 3]
// Expected Output: 8 subsets (2^3)
console.log(subsetsWithBitmask([1, 2, 3]));
// [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

// Sample Input:  [5, 6]
// Expected Output: 4 subsets
console.log(subsetsWithBitmask([5, 6])); // [[], [5], [6], [5,6]]

// Sample Input:  []
// Expected Output: [[]]  (only empty subset)
console.log(subsetsWithBitmask([])); // [[]]


/**
 * ========================================================================
 * 6. PREFIX SUM
 * ========================================================================
 * NOTES:
 * - Prefix sum range sum queries fast banata hai.
 * - Repeated subarray sum problems me common.
 *
 * EXAMPLE - buildPrefixSum + rangeSum:
 * Input:  nums = [1, 2, 3, 4, 5]
 * Prefix: [0, 1, 3, 6, 10, 15]
 *
 * rangeSum(prefix, 1, 3) -> prefix[4] - prefix[1] = 10 - 1 = 9  (sum of 2+3+4)
 * rangeSum(prefix, 0, 4) -> prefix[5] - prefix[0] = 15 - 0 = 15 (sum of all)
 */

function buildPrefixSum(nums) {
    const prefix = new Array(nums.length + 1).fill(0);

    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    return prefix;
}

function rangeSum(prefix, left, right) {
    return prefix[right + 1] - prefix[left];
}

// Sample Input:  nums = [1, 2, 3, 4, 5]
// Expected prefix: [0, 1, 3, 6, 10, 15]
const prefix = buildPrefixSum([1, 2, 3, 4, 5]);
console.log(prefix); // [0, 1, 3, 6, 10, 15]

// Sample Input:  rangeSum(prefix, 1, 3)  -> sum of indices 1,2,3 = 2+3+4
// Expected Output: 9
console.log(rangeSum(prefix, 1, 3)); // 9

// Sample Input:  rangeSum(prefix, 0, 4)  -> sum of all = 1+2+3+4+5
// Expected Output: 15
console.log(rangeSum(prefix, 0, 4)); // 15

// Sample Input:  rangeSum(prefix, 2, 2)  -> single element = 3
// Expected Output: 3
console.log(rangeSum(prefix, 2, 2)); // 3


/**
 * ========================================================================
 * 7. FENWICK TREE / BINARY INDEXED TREE
 * ========================================================================
 * NOTES:
 * - Prefix sums with updates.
 * - Point update: O(log n)
 * - Prefix query: O(log n)
 *
 * EXAMPLE:
 * Array: [1, 2, 3, 4, 5]  (indices 0-4)
 * query(2)  -> prefix sum indices 0..2 = 1+2+3 = 6
 * update(1, +3)  -> add 3 to index 1 (value 2 becomes 5)
 * query(2)  -> now 1+5+3 = 9
 * rangeQuery(1, 3) -> sum of indices 1..3 = 5+3+4 = 12
 */

class FenwickTree {
    constructor(size) {
        this.tree = new Array(size + 1).fill(0);
    }

    update(index, delta) {
        index++;

        while (index < this.tree.length) {
            this.tree[index] += delta;
            index += index & -index;
        }
    }

    query(index) {
        index++;
        let sum = 0;

        while (index > 0) {
            sum += this.tree[index];
            index -= index & -index;
        }

        return sum;
    }

    rangeQuery(left, right) {
        return this.query(right) - this.query(left - 1);
    }
}

// Sample usage: FenwickTree with [1, 2, 3, 4, 5]
const ft = new FenwickTree(5);
[1, 2, 3, 4, 5].forEach((val, idx) => ft.update(idx, val));

// Sample Input:  query(2)  -> prefix sum 0..2 = 1+2+3
// Expected Output: 6
console.log(ft.query(2)); // 6

// Sample Input:  query(4)  -> all elements = 1+2+3+4+5
// Expected Output: 15
console.log(ft.query(4)); // 15

// Sample Input:  update(1, 3)  -> add 3 to index 1 (2 becomes 5)
ft.update(1, 3);

// Sample Input:  query(2)  -> now 1+5+3 = 9
// Expected Output: 9
console.log(ft.query(2)); // 9

// Sample Input:  rangeQuery(1, 3)  -> sum of indices 1..3 = 5+3+4
// Expected Output: 12
console.log(ft.rangeQuery(1, 3)); // 12


/**
 * ========================================================================
 * 8. SEGMENT TREE
 * ========================================================================
 * NOTES:
 * - Range queries and updates.
 * - Range sum/min/max query me useful.
 * - Query/update: O(log n)
 * - Build: O(n)
 *
 * EXAMPLE:
 * Input:  nums = [1, 3, 5, 7, 9, 11]
 * query(1, 3)  -> sum of indices 1..3 = 3+5+7 = 15
 * query(0, 5)  -> sum of all = 1+3+5+7+9+11 = 36
 */

class SegmentTree {
    constructor(nums) {
        this.n = nums.length;
        this.tree = new Array(this.n * 4).fill(0);
        this.build(nums, 0, 0, this.n - 1);
    }

    build(nums, node, start, end) {
        if (start === end) {
            this.tree[node] = nums[start];
            return;
        }

        const mid = Math.floor((start + end) / 2);

        this.build(nums, node * 2 + 1, start, mid);
        this.build(nums, node * 2 + 2, mid + 1, end);

        this.tree[node] = this.tree[node * 2 + 1] + this.tree[node * 2 + 2];
    }

    query(left, right, node = 0, start = 0, end = this.n - 1) {
        if (right < start || end < left) return 0;
        if (left <= start && end <= right) return this.tree[node];

        const mid = Math.floor((start + end) / 2);
        const leftSum = this.query(left, right, node * 2 + 1, start, mid);
        const rightSum = this.query(left, right, node * 2 + 2, mid + 1, end);

        return leftSum + rightSum;
    }
}

// Sample Input:  nums = [1, 3, 5, 7, 9, 11]
const st = new SegmentTree([1, 3, 5, 7, 9, 11]);

// Sample Input:  query(1, 3)  -> sum of indices 1..3 = 3+5+7
// Expected Output: 15
console.log(st.query(1, 3)); // 15

// Sample Input:  query(0, 5)  -> sum of all
// Expected Output: 36
console.log(st.query(0, 5)); // 36

// Sample Input:  query(0, 0)  -> single element = 1
// Expected Output: 1
console.log(st.query(0, 0)); // 1

// Sample Input:  query(3, 5)  -> 7+9+11
// Expected Output: 27
console.log(st.query(3, 5)); // 27


/**
 * ========================================================================
 * 9. ROLLING HASH
 * ========================================================================
 * NOTES:
 * - String/window ka hash maintain karo.
 * - Rabin-Karp string search me useful.
 * - Collision possible hoti hai, so exact compare sometimes needed.
 */


/**
 * ========================================================================
 * 10. ADVANCED NAME MAP
 * ========================================================================
 *
 * Greedy:
 * - Locally best choices. Must prove correctness.
 *
 * Backtracking:
 * - Try, explore, undo.
 *
 * Dynamic programming:
 * - Cache repeated subproblems.
 *
 * Divide and conquer:
 * - Split problem, solve parts, combine.
 *
 * Bitmask DP:
 * - State includes subset mask.
 *
 * Segment tree/Fenwick:
 * - Fast range queries.
 *
 * Rolling hash/KMP:
 * - Efficient string matching.
 *
 * Union Find:
 * - Connected components and cycle detection.
 */
