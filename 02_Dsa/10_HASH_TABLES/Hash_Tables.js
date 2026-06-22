'use strict';

/**
 * ========================================================================
 * HASH TABLES
 * ========================================================================
 * NOTES:
 * - Hash table key-value pairs store karta hai.
 * - Key ko hash function se array index me convert kiya jaata hai.
 * - JavaScript Object and Map internally hash-table-like behavior dete hain.
 *
 * WHY IMPORTANT?
 * - Fast lookup, insert, delete.
 * - Frequency counter, caching, graph adjacency lists, two-sum style problems.
 */


/**
 * ========================================================================
 * 1. HASH FUNCTION
 * ========================================================================
 * GOOD HASH FUNCTION:
 * - Fast ho.
 * - Deterministic ho: same input -> same output.
 * - Values evenly distribute kare.
 *
 * BAD HASH:
 * - Sab keys same index par bhej de -> collisions high.
 *
 * EXAMPLE - simpleHash:
 * Input:  key = 'pink', arrayLength = 10
 * Output: some fixed index between 0-9 (always same for 'pink')
 */

function simpleHash(key, arrayLength) {
    let total = 0;
    const prime = 31;

    for (let i = 0; i < Math.min(key.length, 100); i++) {
        const char = key[i];
        const value = char.charCodeAt(0) - 96;
        total = (total * prime + value) % arrayLength;
    }

    return total;
}

// Sample Input:  'pink', 10
// Expected Output: some integer 0-9 (deterministic)
console.log(simpleHash('pink', 10));   // e.g. 0
console.log(simpleHash('orange', 10)); // e.g. 4
console.log(simpleHash('cyan', 10));   // e.g. 3

// Same input always gives same output:
console.log(simpleHash('pink', 10) === simpleHash('pink', 10)); // true


/**
 * ========================================================================
 * 2. COLLISIONS
 * ========================================================================
 * NOTES:
 * - Collision = two keys same index par aa gayi.
 *
 * COMMON SOLUTIONS:
 * 1. Separate chaining:
 *    - Har index par array/list store karo.
 *
 * 2. Linear probing:
 *    - Agar index occupied hai, next empty slot dhoondo.
 */


/**
 * ========================================================================
 * 3. HASH TABLE IMPLEMENTATION - SEPARATE CHAINING
 * ========================================================================
 * AVERAGE BIG O:
 * - set: O(1)
 * - get: O(1)
 * - delete: O(1)
 *
 * WORST CASE:
 * - O(n), if many collisions.
 *
 * EXAMPLE:
 * set('white', '#fff') -> set('black', '#000') -> set('red', '#f00')
 * get('black') -> '#000'
 * get('purple') -> undefined
 * keys() -> ['white', 'black', 'red']  (order may vary)
 * values() -> ['#fff', '#000', '#f00']  (order may vary)
 */

class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
        let total = 0;
        const prime = 31;

        for (let i = 0; i < Math.min(key.length, 100); i++) {
            const char = key[i];
            const value = char.charCodeAt(0) - 96;
            total = (total * prime + value) % this.keyMap.length;
        }

        return total;
    }

    set(key, value) {
        const index = this._hash(key);

        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }

        for (const pair of this.keyMap[index]) {
            if (pair[0] === key) {
                pair[1] = value;
                return;
            }
        }

        this.keyMap[index].push([key, value]);
    }

    get(key) {
        const index = this._hash(key);
        const bucket = this.keyMap[index];

        if (!bucket) return undefined;

        for (const pair of bucket) {
            if (pair[0] === key) return pair[1];
        }

        return undefined;
    }

    keys() {
        const keysArr = [];

        for (const bucket of this.keyMap) {
            if (!bucket) continue;

            for (const pair of bucket) {
                if (!keysArr.includes(pair[0])) keysArr.push(pair[0]);
            }
        }

        return keysArr;
    }

    values() {
        const valuesArr = [];

        for (const bucket of this.keyMap) {
            if (!bucket) continue;

            for (const pair of bucket) {
                if (!valuesArr.includes(pair[1])) valuesArr.push(pair[1]);
            }
        }

        return valuesArr;
    }
}

// Sample usage: HashTable operations
const ht = new HashTable();

// Sample Input:  set color names
ht.set('white', '#fff');
ht.set('black', '#000');
ht.set('red', '#f00');
ht.set('blue', '#00f');

// Sample Input:  get('black')
// Expected Output: '#000'
console.log(ht.get('black'));  // '#000'

// Sample Input:  get('white')
// Expected Output: '#fff'
console.log(ht.get('white'));  // '#fff'

// Sample Input:  get('purple')
// Expected Output: undefined  (not set)
console.log(ht.get('purple')); // undefined

// Sample Input:  keys()
// Expected Output: ['white', 'black', 'red', 'blue'] (order may vary)
console.log(ht.keys());   // e.g. ['white', 'black', 'red', 'blue']

// Sample Input:  values()
// Expected Output: ['#fff', '#000', '#f00', '#00f'] (order may vary)
console.log(ht.values()); // e.g. ['#fff', '#000', '#f00', '#00f']

// Update existing key test:
// Sample Input:  set('white', '#ffffff')
// Expected: get('white') now returns '#ffffff'
ht.set('white', '#ffffff');
console.log(ht.get('white')); // '#ffffff'


/**
 * ========================================================================
 * 4. MAP VS OBJECT
 * ========================================================================
 *
 * Object:
 * - Keys usually string/symbol.
 * - Simple and common.
 * - Good for plain frequency counters.
 *
 * Map:
 * - Keys any type: object, array, number, string.
 * - Has size property.
 * - Better for frequent add/delete and arbitrary keys.
 *
 * EXAMPLE - twoSum:
 * Input:  nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1]  (nums[0] + nums[1] = 2 + 7 = 9)
 *
 * Input:  nums = [3, 2, 4], target = 6
 * Output: [1, 2]  (nums[1] + nums[2] = 2 + 4 = 6)
 */

function twoSum(nums, target) {
    const seen = new Map();

    for (let i = 0; i < nums.length; i++) {
        const needed = target - nums[i];

        if (seen.has(needed)) {
            return [seen.get(needed), i];
        }

        seen.set(nums[i], i);
    }

    return [];
}

// Sample Input:  [2, 7, 11, 15], target = 9
// Expected Output: [0, 1]
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]

// Sample Input:  [3, 2, 4], target = 6
// Expected Output: [1, 2]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]

// Sample Input:  [3, 3], target = 6
// Expected Output: [0, 1]
console.log(twoSum([3, 3], 6)); // [0, 1]

// Sample Input:  [1, 2, 3], target = 100
// Expected Output: []  (no valid pair)
console.log(twoSum([1, 2, 3], 100)); // []


/**
 * ========================================================================
 * 5. SET PATTERN
 * ========================================================================
 * NOTES:
 * - Set membership check average O(1).
 * - Duplicate, visited, intersection problems me useful.
 *
 * EXAMPLE - intersection:
 * Input:  arr1 = [1, 2, 3, 4], arr2 = [3, 4, 5, 6]
 * Output: [3, 4]  (common elements)
 *
 * Input:  arr1 = [1, 2], arr2 = [3, 4]
 * Output: []  (no common elements)
 */

function intersection(arr1, arr2) {
    const set1 = new Set(arr1);
    const result = [];

    for (const value of arr2) {
        if (set1.has(value)) {
            result.push(value);
            set1.delete(value);
        }
    }

    return result;
}

// Sample Input:  [1, 2, 3, 4], [3, 4, 5, 6]
// Expected Output: [3, 4]
console.log(intersection([1, 2, 3, 4], [3, 4, 5, 6])); // [3, 4]

// Sample Input:  [1, 2, 3], [4, 5, 6]
// Expected Output: []
console.log(intersection([1, 2, 3], [4, 5, 6])); // []

// Sample Input:  [1, 1, 2, 3], [1, 2]  (duplicates in arr1)
// Expected Output: [1, 2]  (each intersection element once)
console.log(intersection([1, 1, 2, 3], [1, 2])); // [1, 2]


/**
 * ========================================================================
 * 6. HASH TABLE USE CASES
 * ========================================================================
 *
 * - Frequency counters
 * - Caching / memoization
 * - De-duplication
 * - Fast lookup by ID
 * - Grouping data
 * - Graph adjacency list
 * - Detect cycles/visited states
 */
