/**
 * ## Quick revision
 *
 * - Greedy — har step local choice; global correctness ka proof chahiye.
 * - Exchange argument — optimal solution ki choice ko greedy se replace karke quality na gire.
 * - Interval scheduling — maximum non-overlap count ke liye earliest finish useful.
 * - Merge intervals — start sort karo; overlap par end extend.
 * - Boundary — touching intervals overlap hain ya nahi, contract clear karo.
 * - Meeting rooms — active end-times ka min-heap ya sweep line.
 * - Weighted intervals — earliest finish alone enough nahi; DP use hota hai.
 * - Verification — small cases ke brute-force optimum se compare karo.
 * - Trie — characters/prefixes ka tree; lookup O(word length).
 * - Bitmask — small set ko bits mein represent karo.
 * - Bit operations — set `mask | bit`, test `mask & bit`, clear `mask & ~bit`.
 * - JS bits — number bitwise operators 32-bit integers use karte hain; large masks carefully handle karo.
 * - Fenwick tree — point update/prefix sum O(log n).
 * - Lowbit — `i & -i`; update mein add, prefix query mein subtract.
 * - Range sum — prefix(r) minus prefix(l - 1).
 * - Segment tree — flexible range queries/updates; merge rule define karo.
 * - Lazy propagation — range updates ko defer karke pending tags propagate karo.
 * - Sweep line — sorted event boundaries process; same-coordinate tie policy define karo.
 * - Rolling hash — sliding substring fingerprint; collision possible, zaroorat par equality verify.
 * - Greedy failure — coin denominations arbitrary hon toh largest coin first minimum coins guarantee nahi.
 * - Sweep tie — same coordinate par starts/ends ka order overlap definition se match.
 * - Proof habit — chhota counterexample search karo; sample pass hona correctness proof nahi.
 */

'use strict';


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
