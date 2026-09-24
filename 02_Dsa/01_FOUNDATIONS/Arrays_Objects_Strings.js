/**
 * ## Quick revision
 *
 * - Array — ordered values; index zero se start hota hai.
 * - Object — named properties; `user.name` ya `user[key]` se padho.
 * - `push`/`pop` — array ke end par add/remove karte hain.
 * - `const` object — properties badal sakti hain; reference reassign nahi hota.
 * - Reference copy — `b = a` se dono same object ko point karte hain.
 * - Shallow copy — `{...a}`/`[...a]` outer copy banate hain; nested objects shared rehte hain.
 * - Equality — do alag `{}` objects `===` se equal nahi hote.
 * - Missing property — value `undefined`; existence ke liye `Object.hasOwn(obj, key)`.
 * - `map` — har item transform karke naya array.
 * - `filter` — matching items ka naya array.
 * - `reduce` — items se ek accumulated result; initial value dena clear rehta hai.
 * - `find` — pehla matching item; na mile toh `undefined`.
 * - `some`/`every` — koi match / sab match; empty array par false / true.
 * - `Set` — unique values; object uniqueness reference se hoti hai.
 * - `Map` — kisi bhi type ki keys; insertion order preserve hota hai.
 * - Destructuring — array/object se values seedha variables mein nikalo.
 * - Spread — values expand; rest — bachi values collect.
 * - `?.` — null/undefined par access rokta hai; missing variable declaration nahi bachata.
 * - `sort` — original array badalta hai; numbers ke liye `(a, b) => a - b`.
 * - Grouping — key ke hisaab se buckets banao; accumulator har step return karo.
 * - `Array.isArray` — actual array check; `typeof []` object aata hai.
 * - `slice`/`splice` — slice copy; splice original array mein insert/delete karta hai.
 * - Dynamic key — bracket access mein expression evaluate hota hai: `obj[field]`.
 */

'use strict';


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


const nums = [10, 20, 30];

nums.push(40);
console.log(nums); // [ 10, 20, 30, 40 ]

nums.pop();
console.log(nums); // [ 10, 20, 30 ]

nums.unshift(5);
console.log(nums); // [ 5, 10, 20, 30 ]

nums.shift();
console.log(nums); // [ 10, 20, 30 ]


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


const freqMap = new Map();
freqMap.set('a', 1);
freqMap.set('b', 2);
console.log(freqMap.get('a')); // 1
console.log(freqMap.has('c')); // false
console.log(freqMap.size);     // 2


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


const original = [1, 2, 3];
const copied = original.slice();

original.push(4);

console.log(original); // [1, 2, 3, 4]
console.log(copied);   // [1, 2, 3]
