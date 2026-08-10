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
 * ------------------------------------------------------------------------
 * 3.1 MUTABILITY vs IMMUTABILITY (Primitive vs Non-Primitive)
 * ------------------------------------------------------------------------
 * NOTES:
 *
 * GOLDEN RULE:
 * - Saare PRIMITIVE types → IMMUTABLE hain  (change nahi ho sakte)
 * - Saare NON-PRIMITIVE (Reference) types → MUTABLE hain  (change ho sakte hain)
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PRIMITIVE TYPES (IMMUTABLE) — Total 7                             │
 * ├──────────────┬──────────────────────────────────────────────────────┤
 * │  1. String   │  'hello', "world", `template`                      │
 * │  2. Number   │  42, 3.14, -7, Infinity, NaN                       │
 * │  3. Boolean  │  true, false                                       │
 * │  4. undefined│  variable declare ki but value nahi di              │
 * │  5. null     │  intentionally "koi value nahi hai"                 │
 * │  6. Symbol   │  Symbol('id') — unique identifier (ES6)            │
 * │  7. BigInt   │  123n — bohot bade numbers ke liye (ES2020)         │
 * ├──────────────┴──────────────────────────────────────────────────────┤
 * │  Ye sab STACK memory me store hote hain.                          │
 * │  Inhe directly modify nahi kar sakte — nayi value banti hai.      │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  NON-PRIMITIVE TYPES (MUTABLE) — Reference types                   │
 * ├──────────────┬──────────────────────────────────────────────────────┤
 * │  1. Object   │  { name: 'sidd', age: 22 }                         │
 * │  2. Array    │  [1, 2, 3]  (internally object hai)                 │
 * │  3. Function │  function() {} (ye bhi object hai)                  │
 * │  4. Map      │  new Map()                                          │
 * │  5. Set      │  new Set()                                          │
 * │  6. Date     │  new Date()                                         │
 * │  7. RegExp   │  /pattern/g                                         │
 * ├──────────────┴──────────────────────────────────────────────────────┤
 * │  Ye sab HEAP memory me store hote hain.                           │
 * │  Inhe directly modify kar sakte hain — original change hota hai.  │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * KYUN IMPORTANT HAI DSA ME?
 * - Agar loop me baar-baar string concatenation karte ho
 *   toh har baar nayi string banti hai → O(n) copy har baar → total O(n²).
 * - Isliye array push + join pattern use karte hain (upar buildString dekho).
 * - Arrays/Objects mutable hain toh in-place modify kar sakte ho → memory efficient.
 */


// -------- EXAMPLE 1: Direct character assignment kaam NAHI karta --------
const greeting = 'hello';
greeting[0] = 'H';           // ❌ Koi error nahi, but change bhi nahi hoga
console.log(greeting);        // 'hello'  (purani string jaise ki thi)


// -------- EXAMPLE 2: Methods bhi nayi string return karte hain ----------
const city = 'delhi';
const upperCity = city.toUpperCase();

console.log(city);            // 'delhi'    ← original UNCHANGED
console.log(upperCity);       // 'DELHI'    ← ye nayi string hai


// -------- EXAMPLE 3: Concatenation se bhi nayi string banti hai ---------
const first = 'java';
const second = first + 'Script';

console.log(first);           // 'java'        ← original UNCHANGED
console.log(second);          // 'javaScript'   ← nayi string


// -------- EXAMPLE 4: replace() bhi original ko touch nahi karta ---------
const msg = 'I love cats';
const newMsg = msg.replace('cats', 'dogs');

console.log(msg);             // 'I love cats'  ← original UNCHANGED
console.log(newMsg);          // 'I love dogs'  ← nayi string


// -------- EXAMPLE 5: Array MUTABLE hai — compare karo --------------------
const arr = ['h', 'e', 'l', 'l', 'o'];
arr[0] = 'H';                // ✅ Direct change ho gaya
console.log(arr);             // ['H', 'e', 'l', 'l', 'o']  ← CHANGED!

const str = 'hello';
str[0] = 'H';                // ❌ Kuch nahi hoga
console.log(str);             // 'hello'  ← UNCHANGED!


// -------- EXAMPLE 6: String "modify" kaise karein? -----------------------
// Split → Array me convert → Change → Join se wapas string banao
const name = 'sidd';
const chars = name.split('');  // ['s', 'i', 'd', 'd']
chars[0] = 'S';                // Array mutable hai, toh change hoga
const newName = chars.join('');
console.log(newName);          // 'Sidd'

// Ya phir slice use karo
const fixed = 'S' + name.slice(1);
console.log(fixed);            // 'Sidd'


// -------- EXAMPLE 7: Number bhi IMMUTABLE hai ----------------------------
let score = 10;
let doubled = score * 2;

console.log(score);            // 10   ← original UNCHANGED
console.log(doubled);          // 20   ← nayi value hai

// score pe koi bhi operation karo, score ki value 10 hi rahegi
// jab tak tum score = newValue nahi karte (reassignment ≠ mutation)


// -------- EXAMPLE 8: Boolean bhi IMMUTABLE hai ---------------------------
let isActive = true;
let flipped = !isActive;

console.log(isActive);         // true   ← original UNCHANGED
console.log(flipped);          // false  ← nayi value


// -------- EXAMPLE 9: Reassignment ≠ Mutation (IMPORTANT!) ----------------
// Reassignment: variable ko nayi value dena (ye ALLOWED hai)
// Mutation: value ke andar ka data change karna

let num = 5;
num = 10;  // ✅ Ye REASSIGNMENT hai — purani value 5 discard hui, nayi 10 aayi
           //    Primitive 5 ko modify nahi kiya, replace kiya

const obj = { x: 1 };
obj.x = 99; // ✅ Ye MUTATION hai — same object ke andar data change hua
             //    Object reference same hai, andar ka content badal gaya


// -------- EXAMPLE 10: Object MUTABLE hai — directly change hota hai ------
const user = { name: 'sidd', age: 22 };
user.age = 23;                 // ✅ Direct change
user.city = 'delhi';           // ✅ New property add
console.log(user);             // { name: 'sidd', age: 23, city: 'delhi' }


// -------- EXAMPLE 11: Map bhi MUTABLE hai --------------------------------
const myMap = new Map();
myMap.set('a', 1);
myMap.set('a', 100);           // ✅ Same key ki value overwrite
console.log(myMap.get('a'));   // 100  ← directly change ho gaya


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
