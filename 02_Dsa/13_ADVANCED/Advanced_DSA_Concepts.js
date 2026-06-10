'use strict';

/**
 * ========================================================================
 * ADVANCED DSA CONCEPTS - SHORT MAP
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


/**
 * ========================================================================
 * 2. INTERVAL PROBLEMS
 * ========================================================================
 * NOTES:
 * - Intervals me mostly sorting by start/end important hota hai.
 * - Merge, overlap, meeting rooms, insert interval common problems hain.
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


/**
 * ========================================================================
 * 3. SWEEP LINE
 * ========================================================================
 * NOTES:
 * - Events ko sorted order me process karo.
 * - Start event count badhata hai, end event count kam karta hai.
 * - Maximum overlap, calendar booking, meeting rooms me useful.
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
 */

function isOdd(num) {
    return (num & 1) === 1;
}

function singleNumber(nums) {
    let result = 0;

    for (const num of nums) {
        result ^= num;
    }

    return result;
}

function countSetBits(num) {
    let count = 0;

    while (num > 0) {
        num = num & (num - 1);
        count++;
    }

    return count;
}


/**
 * ========================================================================
 * 5. BITMASKING
 * ========================================================================
 * NOTES:
 * - Bitmask ek integer hota hai jisme bits choices represent karte hain.
 * - Subsets, visited states, DP over subsets me useful.
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


/**
 * ========================================================================
 * 6. PREFIX SUM
 * ========================================================================
 * NOTES:
 * - Prefix sum range sum queries fast banata hai.
 * - Repeated subarray sum problems me common.
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


/**
 * ========================================================================
 * 7. FENWICK TREE / BINARY INDEXED TREE
 * ========================================================================
 * NOTES:
 * - Prefix sums with updates.
 * - Point update: O(log n)
 * - Prefix query: O(log n)
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


/**
 * ========================================================================
 * 8. SEGMENT TREE
 * ========================================================================
 * NOTES:
 * - Range queries and updates.
 * - Range sum/min/max query me useful.
 * - Query/update: O(log n)
 * - Build: O(n)
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
