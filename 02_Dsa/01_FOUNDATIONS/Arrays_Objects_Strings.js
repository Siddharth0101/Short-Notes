'use strict';

/**
 * ========================================================================
 * ARRAYS, OBJECTS, STRINGS - DSA FOUNDATION
 * ========================================================================
 * NOTES:
 * - DSA me built-in structures ko samajhna bahut zaroori hai.
 * - JavaScript me arrays, objects, strings, Map, Set frequently use hote hain.
 * - Har operation ka Big O yaad rakhna problem solve karne me help karta hai.
 */


/**
 * ========================================================================
 * 1. OBJECTS
 * ========================================================================
 * NOTES:
 * - Object key-value pairs store karta hai.
 * - Jab order important nahi hai aur fast lookup chahiye, object useful hai.
 *
 * BIG O:
 * - Insert: O(1)
 * - Remove: O(1)
 * - Access: O(1)
 * - Search value: O(n)
 * - Object.keys / values / entries: O(n)
 */

const userScore = {
    sidd: 10,
    colt: 20,
    max: 30
};

console.log(userScore.sidd); // O(1)
userScore.raj = 40;          // O(1)
delete userScore.max;        // O(1)


/**
 * ========================================================================
 * 2. ARRAYS
 * ========================================================================
 * NOTES:
 * - Array ordered data store karta hai.
 * - Index access fast hota hai.
 * - Beginning me add/remove costly hota hai because re-indexing hoti hai.
 *
 * BIG O:
 * - Access by index: O(1)
 * - Search by value: O(n)
 * - push / pop: O(1)
 * - shift / unshift: O(n)
 * - splice: O(n)
 * - slice: O(n)
 * - concat: O(n + m)
 * - sort: O(n log n) usually
 * - forEach/map/filter/reduce: O(n)
 */

const nums = [10, 20, 30];

nums.push(40);     // fast
nums.pop();        // fast
nums.unshift(5);   // slow for large arrays
nums.shift();      // slow for large arrays


/**
 * ========================================================================
 * 3. STRINGS
 * ========================================================================
 * NOTES:
 * - Strings immutable hoti hain.
 * - Iska matlab original string change nahi hoti; new string banti hai.
 * - Character access O(1), but slicing/copying O(n) ho sakta hai.
 */

const word = 'algorithm';

console.log(word[0]);          // 'a'
console.log(word.slice(0, 4)); // 'algo' - new string

// Many string concatenations can become costly.
function buildString(arr) {
    const pieces = [];

    for (const item of arr) {
        pieces.push(item);
    }

    return pieces.join('');
}


/**
 * ========================================================================
 * 4. MAP
 * ========================================================================
 * NOTES:
 * - Map bhi key-value store hai, but keys kisi bhi type ki ho sakti hain.
 * - Object ki prototype keys wali tension nahi hoti.
 * - Frequency counter, graph adjacency list, cache ke liye useful.
 */

const freqMap = new Map();
freqMap.set('a', 1);
freqMap.set('b', 2);
console.log(freqMap.get('a')); // 1
console.log(freqMap.has('c')); // false


/**
 * ========================================================================
 * 5. SET
 * ========================================================================
 * NOTES:
 * - Set unique values store karta hai.
 * - Duplicate remove karne, visited track karne, membership check ke liye useful.
 */

const uniqueNums = new Set([1, 2, 2, 3, 3, 3]);
console.log([...uniqueNums]); // [1, 2, 3]

function hasDuplicate(arr) {
    return new Set(arr).size !== arr.length;
}


/**
 * ========================================================================
 * 6. MUTATION VS COPY
 * ========================================================================
 * NOTES:
 * - Mutation: original data change hota hai.
 * - Copy: new data structure banta hai.
 * - DSA me mutation memory bachata hai, copy safer hoti hai.
 */

const original = [1, 2, 3];
const copied = original.slice();

original.push(4);

console.log(original); // [1, 2, 3, 4]
console.log(copied);   // [1, 2, 3]


/**
 * ========================================================================
 * 7. WHEN TO USE WHAT?
 * ========================================================================
 *
 * Need ordered list                -> Array
 * Need fast key lookup             -> Object / Map
 * Need unique values               -> Set
 * Need count of values             -> Object / Map frequency counter
 * Need add/remove from both ends   -> Deque concept, linked list, or custom queue
 * Need repeated string building    -> Array push + join
 */
