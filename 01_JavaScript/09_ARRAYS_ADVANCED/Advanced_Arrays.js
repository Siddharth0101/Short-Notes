'use strict';

/**
 * ========================================================================
 * ADVANCED ARRAYS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "Working with Arrays" section — map, filter, reduce.
 *
 * MAP, FILTER, REDUCE PIPELINE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ MAP    │ [1, 2, 3] ──(x2)──→ [2, 4, 6]      (Transform arr) │
 * │ FILTER │ [1, 2, 3] ──(>1)──→ [2, 3]         (Select subset) │
 * │ REDUCE │ [1, 2, 3] ──(sum)──→ 6            (Boil to single)│
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. SIMPLE ARRAY METHODS RECAP
 * ========================================================================
 * NOTES:
 * - slice(start, end)   -> returns new array. Original SAFE.
 * - splice(start, deleteCount) -> MUTATES original. Removed items return.
 * - reverse()            -> MUTATES original.
 * - concat(arr2)         -> merge. Returns new array. Same as [...a, ...b].
 * - join(separator)      -> array to string.
 * - at(index)            -> ES2022. Negative indexing support.
 */

let testArr = ['a', 'b', 'c', 'd', 'e'];

// slice (does NOT mutate):
console.log(testArr.slice(2));      // ['c', 'd', 'e']
console.log(testArr.slice(2, 4));   // ['c', 'd']
console.log(testArr.slice(-2));     // ['d', 'e']
console.log(testArr.slice(1, -2));  // ['b', 'c']
console.log(testArr.slice());       // shallow copy

// splice (MUTATES):
// testArr.splice(-1);    // removes last element
// testArr.splice(1, 2);  // removes 2 elements starting from index 1

// at (ES2022):
console.log(testArr.at(0));  // 'a'
console.log(testArr.at(-1)); // 'e' — last element (cleaner than arr[arr.length-1])


/**
 * ========================================================================
 * 2. forEach
 * ========================================================================
 * NOTES:
 * - forEach har element pe callback chalata hai.
 * - callback ke args: (currentElement, index, entireArray).
 * - forEach me break/continue NAHI kaam karta (for-of me kaam karta hai).
 * - Side effects ke liye: logging, DOM update, push to another array.
 *
 * forEach on Maps and Sets:
 * - Map: forEach((value, key, map) => { ... })
 * - Set: forEach((value, _, set) => { ... })  // key = value (set me keys nahi)
 */

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

movements.forEach(function (mov, i, arr) {
    if (mov > 0) {
        console.log(`Movement ${i + 1}: Deposited ${mov}`);
    } else {
        console.log(`Movement ${i + 1}: Withdrew ${Math.abs(mov)}`);
    }
});

// forEach on Map:
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
    console.log(`${key}: ${value}`);
});


/**
 * ========================================================================
 * 3. MAP METHOD
 * ========================================================================
 * NOTES:
 * - map() = har element pe function chalao, NAYA ARRAY return karo.
 * - Original array change NAHI hota.
 * - forEach se difference: map RETURNS new array, forEach sirf loop karta hai.
 *
 * WHEN TO USE:
 * - Jab har element ko transform karna ho aur result array chahiye.
 */

const eurToUsd = 1.1;

// Movements EUR -> USD:
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movementsUSD); // [220, 495, -440, 3300, ...]

// With more logic:
const movDescriptions = movements.map(
    (mov, i) => `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);
console.log(movDescriptions);


/**
 * ========================================================================
 * 4. FILTER METHOD
 * ========================================================================
 * NOTES:
 * - filter() = condition se match hone wale elements ka NAYA ARRAY.
 * - Callback must return true/false.
 * - Original array change nahi hota.
 */

const deposits = movements.filter(mov => mov > 0);
console.log(deposits); // [200, 450, 3000, 70, 1300]

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals); // [-400, -650, -130]


/**
 * ========================================================================
 * 5. REDUCE METHOD
 * ========================================================================
 * NOTES:
 * - reduce() = array ko EK SINGLE VALUE me "boil down" karta hai.
 * - callback args: (accumulator, currentElement, index, array).
 * - Second argument = accumulator ki initial value. HAMESHA do.
 *
 * USE CASES:
 * - Sum, max, min, average, counting, grouping, flattening.
 * - reduce sab kuch kar sakta hai — ye sabse powerful method hai.
 */

// Sum:
const balance = movements.reduce((acc, mov) => acc + mov, 0);
console.log(balance); // 3840

// Maximum value:
const maxMov = movements.reduce((acc, mov) => (acc > mov ? acc : mov), movements[0]);
console.log(maxMov); // 3000

// Count occurrences:
const depositCount = movements.reduce((count, mov) => (mov > 0 ? count + 1 : count), 0);
console.log(depositCount); // 5


/**
 * ========================================================================
 * 6. METHOD CHAINING
 * ========================================================================
 * NOTES:
 * - Methods ko ek ke baad ek chain kar sakte ho (pipeline).
 * - Jab tak method array return karta hai, chain continue rakh sakte ho.
 * - Debugging: chain ke beech me log karne ke liye arr parameter use karo.
 *
 * RULES:
 * - Mutating methods (splice, reverse) chain me AVOID karo.
 * - Zyada lambi chain readability kharab karti hai — todne me hesitate mat karo.
 */

// Pipeline: deposits filter -> convert EUR to USD -> sum
const totalDepositsUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD); // 5522.000000000001

// Debug in chain:
// .map((mov, i, arr) => {
//     console.log(arr); // inspect intermediate array
//     return mov * eurToUsd;
// })


/**
 * ========================================================================
 * 7. FIND METHOD
 * ========================================================================
 * NOTES:
 * - find() = pehla element return karta hai jo condition match kare.
 * - filter se difference: find sirf EK element return karta hai, array nahi.
 * - Agar koi match nahi -> undefined.
 */

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal); // -400

// Finding in array of objects:
const accounts = [
    { owner: 'Jonas', movements: [200, 450] },
    { owner: 'Jessica', movements: [5000, 3400] },
];

const jessicaAccount = accounts.find(acc => acc.owner === 'Jessica');
console.log(jessicaAccount); // { owner: 'Jessica', movements: [5000, 3400] }


/**
 * ========================================================================
 * 8. findIndex, some, every
 * ========================================================================
 * NOTES:
 * - findIndex(fn)  -> pehle match ka INDEX return (-1 if not found).
 *   indexOf se difference: findIndex me condition function de sakte ho.
 *
 * - some(fn)       -> koi EK bhi element condition match kare toh TRUE.
 *   includes se difference: includes equality check, some condition check.
 *
 * - every(fn)      -> SAARE elements condition match karein toh TRUE.
 */

// findIndex:
const closeIndex = movements.findIndex(mov => mov === -400);
console.log(closeIndex); // 2

// some:
console.log(movements.some(mov => mov > 0));     // true (koi positive hai)
console.log(movements.some(mov => mov > 5000));  // false

// every:
console.log(movements.every(mov => mov > 0)); // false (sab positive nahi hain)
console.log([430, 1000, 700].every(mov => mov > 0)); // true


/**
 * ========================================================================
 * 9. FLAT AND FLATMAP
 * ========================================================================
 * NOTES:
 * - flat(depth) -> nested arrays ko flatten karta hai.
 *   Default depth = 1.
 * - flatMap(fn) -> map() + flat(1) combined. Sirf 1 level deep.
 *   Performance better hai map().flat() se.
 */

// flat:
const arrNested = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrNested.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7];
console.log(arrDeep.flat(1)); // [[1,2], 3, 4, [5,6], 7]
console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7]

// flatMap:
const allMovements = accounts.flatMap(acc => acc.movements);
console.log(allMovements); // [200, 450, 5000, 3400]


/**
 * ========================================================================
 * 10. SORT METHOD
 * ========================================================================
 * NOTES:
 * - sort() MUTATES original array.
 * - Default sort: STRINGS ki tarah sort karta hai (even numbers!).
 * - Numbers ke liye compare function dena ZAROORI hai.
 *
 * COMPARE FUNCTION:
 * - return < 0 -> a pehle (a, b keep order).
 * - return > 0 -> b pehle (swap).
 * - return 0   -> no change.
 *
 * SHORTCUT:
 * - Ascending: (a, b) => a - b
 * - Descending: (a, b) => b - a
 */

// Default (string sort — WRONG for numbers!):
// [3, 1, 11, 2].sort() -> [1, 11, 2, 3] ← WRONG!

// Correct number sort:
const sorted = [...movements].sort((a, b) => a - b); // ascending
console.log(sorted); // [-650, -400, -130, 70, 200, 450, 1300, 3000]

const sortedDesc = [...movements].sort((a, b) => b - a); // descending
console.log(sortedDesc); // [3000, 1300, 450, 200, 70, -130, -400, -650]


/**
 * ========================================================================
 * 11. Array.from AND CREATING ARRAYS
 * ========================================================================
 * NOTES:
 * - Array.from({length}, mapFn) -> array create with map function.
 * - Array.from(nodeList)        -> NodeList ko real array me convert.
 * - new Array(7)                -> 7 empty slots. Sirf .fill() kaam karta hai.
 * - Array.from() > Array constructor for most use cases.
 */

// Create array with values:
const ones = Array.from({ length: 7 }, () => 1);
console.log(ones); // [1, 1, 1, 1, 1, 1, 1]

const zeroToSix = Array.from({ length: 7 }, (_, i) => i);
console.log(zeroToSix); // [0, 1, 2, 3, 4, 5, 6]

// 100 random dice rolls:
const diceRolls = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);

// NodeList to Array (in browser):
// const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
// );

// fill method:
const emptyArr = new Array(7);
emptyArr.fill(1, 3, 5); // fill 1 from index 3 to 5
console.log(emptyArr);  // [empty × 3, 1, 1, empty × 2]


/**
 * ========================================================================
 * 12. WHICH ARRAY METHOD TO USE? (CHEAT SHEET)
 * ========================================================================
 *
 * WHAT DO YOU WANT?                METHOD
 * ──────────────────────────────────────────────────
 * Mutate original:                 push, pop, shift, unshift, splice,
 *                                  reverse, sort, fill
 *
 * New array:                       map, filter, slice, concat, flat,
 *                                  flatMap, Array.from, [...spread]
 *
 * Index:                           indexOf, findIndex
 *
 * Element:                         find
 *
 * Know if includes:                includes, some, every
 *
 * String:                          join
 *
 * Single value (boil down):        reduce
 *
 * Loop (side effects):             forEach
 */
