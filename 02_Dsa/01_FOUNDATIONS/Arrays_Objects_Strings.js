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
 *
 * EXAMPLE:
 * Input:  userScore = { sidd: 10, colt: 20, max: 30 }
 * Output: userScore.sidd => 10, userScore.raj => 40 after insert
 */

const userScore = {
    sidd: 10,
    colt: 20,
    max: 30
};

console.log(userScore.sidd); // 10  (O(1) access)
userScore.raj = 40;          // O(1) insert
delete userScore.max;        // O(1) delete
console.log(Object.keys(userScore));   // [ 'sidd', 'colt', 'raj' ]
console.log(Object.values(userScore)); // [ 10, 20, 40 ]


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
 *
 * EXAMPLE:
 * Input:  [10, 20, 30]
 * Output: after push(40) => [10, 20, 30, 40]
 *         after pop()    => [10, 20, 30]
 *         after unshift(5) => [5, 10, 20, 30]
 */

const nums = [10, 20, 30];

nums.push(40);
console.log(nums); // [ 10, 20, 30, 40 ]

nums.pop();
console.log(nums); // [ 10, 20, 30 ]

nums.unshift(5);
console.log(nums); // [ 5, 10, 20, 30 ]

nums.shift();
console.log(nums); // [ 10, 20, 30 ]


/**
 * ========================================================================
 * 3. STRINGS
 * ========================================================================
 * NOTES:
 * - Strings immutable hoti hain.
 * - Iska matlab original string change nahi hoti; new string banti hai.
 * - Character access O(1), but slicing/copying O(n) ho sakta hai.
 *
 * EXAMPLE:
 * Input:  'algorithm'
 * Output: word[0] => 'a', word.slice(0, 4) => 'algo'
 */

const word = 'algorithm';

console.log(word[0]);          // 'a'
console.log(word.slice(0, 4)); // 'algo'

// Efficient string building using array + join
function buildString(arr) {
    const pieces = [];

    for (const item of arr) {
        pieces.push(item);
    }

    return pieces.join('');
}

// Sample Input:  ['h', 'e', 'l', 'l', 'o']
// Expected Output: 'hello'
console.log(buildString(['h', 'e', 'l', 'l', 'o'])); // 'hello'


/**
 * ========================================================================
 * 4. MAP
 * ========================================================================
 * NOTES:
 * - Map bhi key-value store hai, but keys kisi bhi type ki ho sakti hain.
 * - Object ki prototype keys wali tension nahi hoti.
 * - Frequency counter, graph adjacency list, cache ke liye useful.
 *
 * EXAMPLE:
 * Input:  set('a', 1), set('b', 2)
 * Output: get('a') => 1, has('c') => false
 */

const freqMap = new Map();
freqMap.set('a', 1);
freqMap.set('b', 2);
console.log(freqMap.get('a')); // 1
console.log(freqMap.has('c')); // false
console.log(freqMap.size);     // 2


/**
 * ========================================================================
 * 5. SET
 * ========================================================================
 * NOTES:
 * - Set unique values store karta hai.
 * - Duplicate remove karne, visited track karne, membership check ke liye useful.
 *
 * EXAMPLE:
 * Input:  [1, 2, 2, 3, 3, 3]
 * Output: [1, 2, 3]
 */

const uniqueNums = new Set([1, 2, 2, 3, 3, 3]);
console.log([...uniqueNums]); // [1, 2, 3]

function hasDuplicate(arr) {
    return new Set(arr).size !== arr.length;
}

// Sample Input:  [1, 2, 3, 2]
// Expected Output: true
console.log(hasDuplicate([1, 2, 3, 2])); // true

// Sample Input:  [1, 2, 3, 4]
// Expected Output: false
console.log(hasDuplicate([1, 2, 3, 4])); // false


/**
 * ========================================================================
 * 6. MUTATION VS COPY
 * ========================================================================
 * NOTES:
 * - Mutation: original data change hota hai.
 * - Copy: new data structure banta hai.
 * - DSA me mutation memory bachata hai, copy safer hoti hai.
 *
 * EXAMPLE:
 * Input:  original = [1, 2, 3], copied = original.slice()
 * Output: original.push(4) => original=[1,2,3,4], copied=[1,2,3]
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
