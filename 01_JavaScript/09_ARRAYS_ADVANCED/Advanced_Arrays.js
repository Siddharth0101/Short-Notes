/**
 * ## Quick revision
 *
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
 * - `slice` — copy; `splice` — original mein insert/delete.
 * - `forEach` — side-effect iteration; result array nahi aur async completion wait nahi.
 * - `flat` — nested arrays flatten; `flatMap` — map + one-level flatten.
 * - `findIndex` — first matching index; missing par -1.
 * - `Array.from` — iterable/array-like ko array mein convert.
 * - Immutable methods — `toSorted`, `toReversed`, `toSpliced`, `with` naya array dete hain.
 * - `flatMap` — transform ke baad result ek level flatten karta hai.
 * - Empty reduce — initial value bina empty array par reduce error deta hai.
 * - Mutation trap — map naya array banata hai, par callback shared nested object mutate kar sakta hai.
 */

'use strict';


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


const eurToUsd = 1.1;

// Movements EUR -> USD:
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movementsUSD); // [220, 495, -440, 3300, ...]

// With more logic:
const movDescriptions = movements.map(
    (mov, i) => `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);
console.log(movDescriptions);


const deposits = movements.filter(mov => mov > 0);
console.log(deposits); // [200, 450, 3000, 70, 1300]

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals); // [-400, -650, -130]


// Sum:
const balance = movements.reduce((acc, mov) => acc + mov, 0);
console.log(balance); // 3840

// Maximum value:
const maxMov = movements.reduce((acc, mov) => (acc > mov ? acc : mov), movements[0]);
console.log(maxMov); // 3000

// Count occurrences:
const depositCount = movements.reduce((count, mov) => (mov > 0 ? count + 1 : count), 0);
console.log(depositCount); // 5


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


const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal); // -400

// Finding in array of objects:
const accounts = [
    { owner: 'Jonas', movements: [200, 450] },
    { owner: 'Jessica', movements: [5000, 3400] },
];

const jessicaAccount = accounts.find(acc => acc.owner === 'Jessica');
console.log(jessicaAccount); // { owner: 'Jessica', movements: [5000, 3400] }


// findIndex:
const closeIndex = movements.findIndex(mov => mov === -400);
console.log(closeIndex); // 2

// some:
console.log(movements.some(mov => mov > 0));     // true (koi positive hai)
console.log(movements.some(mov => mov > 5000));  // false

// every:
console.log(movements.every(mov => mov > 0)); // false (sab positive nahi hain)
console.log([430, 1000, 700].every(mov => mov > 0)); // true


// flat:
const arrNested = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrNested.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7];
console.log(arrDeep.flat(1)); // [[1,2], 3, 4, [5,6], 7]
console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7]

// flatMap:
const allMovements = accounts.flatMap(acc => acc.movements);
console.log(allMovements); // [200, 450, 5000, 3400]


// Default (string sort — WRONG for numbers!):
// [3, 1, 11, 2].sort() -> [1, 11, 2, 3] ← WRONG!

// Correct number sort:
const sorted = [...movements].sort((a, b) => a - b); // ascending
console.log(sorted); // [-650, -400, -130, 70, 200, 450, 1300, 3000]

const sortedDesc = [...movements].sort((a, b) => b - a); // descending
console.log(sortedDesc); // [3000, 1300, 450, 200, 70, -130, -400, -650]


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
