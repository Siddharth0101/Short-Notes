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


/**
 * ========================================================================
 * 5. SET PATTERN
 * ========================================================================
 * NOTES:
 * - Set membership check average O(1).
 * - Duplicate, visited, intersection problems me useful.
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
