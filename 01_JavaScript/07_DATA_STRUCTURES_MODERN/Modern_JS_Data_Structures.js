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
 * - Enhanced literal — property shorthand, method shorthand aur computed keys.
 * - String methods — includes/start/end checks, slice, split/join aur replace se text process karo.
 * - String length — UTF-16 code units count; visible characters ka exact count nahi.
 * - `flatMap` — transform ke baad result ek level flatten karta hai.
 * - Empty reduce — initial value bina empty array par reduce error deta hai.
 * - Mutation trap — map naya array banata hai, par callback shared nested object mutate kar sakta hai.
 */

'use strict';


const arr = [2, 3, 4];
const [x, y, z] = arr;
console.log(x, y, z); // 2 3 4

// Skip elements:
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// Default values:
const [p = 1, q = 1, r = 1] = [8, 9];
console.log(p, q, r); // 8 9 1

// Swap:
let [a, b] = [1, 2];
[a, b] = [b, a];
console.log(a, b); // 2 1

// Nested:
const nested = [2, 4, [5, 6]];
const [i, , [j, k]] = nested;
console.log(i, j, k); // 2 5 6


const restaurant = {
    name: 'Classico Italiano',
    location: 'Via Angelo Tavanti 23, Firenze, Italy',
    categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
    starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
    mainMenu: ['Pizza', 'Pasta', 'Risotto'],
    openingHours: {
        thu: { open: 12, close: 22 },
        fri: { open: 11, close: 23 },
        sat: { open: 0, close: 24 },
    },
};

// Basic:
const { name, openingHours, categories } = restaurant;
console.log(name); // 'Classico Italiano'

// Rename:
const { name: restaurantName, openingHours: hours } = restaurant;
console.log(restaurantName); // 'Classico Italiano'

// Default values:
const { menu = [], starterMenu: starters = [] } = restaurant;
console.log(menu);     // [] (property nahi thi, default liya)
console.log(starters); // ['Focaccia', ...]

// Nested:
const { fri: { open: fridayOpen, close: fridayClose } } = openingHours;
console.log(fridayOpen, fridayClose); // 11 23

// In function parameters:
function orderDelivery({ starterIndex = 0, mainIndex = 0, time = '20:00', address }) {
    console.log(`Order: ${time} to ${address}`);
}
orderDelivery({ time: '22:30', address: 'Via del Sole, 21' });


// Array spread:
const newArr = [1, 2, ...arr]; // [1, 2, 2, 3, 4]
console.log(...newArr);        // 1 2 2 3 4 (individual values)

// Copy array (shallow):
const mainMenuCopy = [...restaurant.mainMenu];

// Merge arrays:
const fullMenu = [...restaurant.starterMenu, ...restaurant.mainMenu];

// String spread:
const str = 'Jonas';
console.log(...str); // J o n a s

// Object spread (shallow copy + override):
const newRestaurant = { foundedIn: 1998, ...restaurant, founder: 'Guiseppe' };


// REST in destructuring:
const [first2, second2, ...others] = [1, 2, 3, 4, 5];
console.log(first2, second2); // 1 2
console.log(others);          // [3, 4, 5]

// REST in objects:
const { sat, ...weekdays } = restaurant.openingHours;
console.log(weekdays); // { thu: {...}, fri: {...} }

// REST in function parameters:
function addNums(...numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}
console.log(addNums(2, 3));          // 5
console.log(addNums(5, 3, 7, 2));    // 17
console.log(addNums(...[1, 2, 3]));  // 6 (spread + rest combo)


// || for default:
const guests1 = restaurant.numGuests || 10;
console.log(guests1); // 10 (numGuests undefined -> falsy)

// PROBLEM: agar numGuests = 0, toh || bhi 10 de dega (0 is falsy!)
// SOLUTION: Nullish Coalescing Operator (??)

// && for conditional execution:
restaurant.orderPizza && restaurant.orderPizza('mushrooms', 'spinach');
// orderPizza exists toh call, nahi toh short-circuit (no error)


restaurant.numGuests = 0;

// || WRONG:
const guests2 = restaurant.numGuests || 10;
console.log(guests2); // 10 ← WRONG! 0 valid tha

// ?? CORRECT:
const guests3 = restaurant.numGuests ?? 10;
console.log(guests3); // 0 ← CORRECT! 0 is not null/undefined


// Without optional chaining:
// if (restaurant.openingHours.mon) console.log(restaurant.openingHours.mon.open);

// With optional chaining:
console.log(restaurant.openingHours.mon?.open); // undefined (mon nahi hai)
console.log(restaurant.openingHours?.fri?.open); // 11

// Methods:
console.log(restaurant.order?.(0, 1) ?? 'Method does not exist');

// Arrays:
const users = [{ name: 'Jonas', email: 'hello@jonas.io' }];
console.log(users[0]?.name ?? 'User not found'); // 'Jonas'
console.log(users[5]?.name ?? 'User not found'); // 'User not found'


const menuAll = [...restaurant.starterMenu, ...restaurant.mainMenu];

for (const item of menuAll) console.log(item);

// With index:
for (const [idx, item] of menuAll.entries()) {
    console.log(`${idx + 1}: ${item}`);
}


const weekdayNames = ['mon', 'tue', 'wed', 'thu', 'fri'];

const enhancedObj = {
    // 1. Property shorthand:
    openingHours, // same as openingHours: openingHours

    // 2. Method shorthand:
    order(starterIndex, mainIndex) {
        return [restaurant.starterMenu[starterIndex], restaurant.mainMenu[mainIndex]];
    },

    // 3. Computed property names:
    [weekdayNames[3]]: 'Thursday is open', // thu: 'Thursday is open'
    [`day-${2 + 4}`]: 'Some day',          // 'day-6': 'Some day'
};


const ordersSet = new Set(['Pasta', 'Pizza', 'Pizza', 'Risotto', 'Pasta']);
console.log(ordersSet);      // Set {'Pasta', 'Pizza', 'Risotto'}
console.log(ordersSet.size); // 3

// Unique values from array:
const staff = ['Waiter', 'Chef', 'Waiter', 'Manager', 'Chef'];
const uniqueStaff = [...new Set(staff)];
console.log(uniqueStaff); // ['Waiter', 'Chef', 'Manager']

// Count unique:
console.log(new Set(staff).size); // 3

// String se unique letters:
console.log(new Set('javascript').size); // 9 (a repeats)


const restMap = new Map();
restMap.set('name', 'Classico Italiano');
restMap.set(1, 'Firenze, Italy');
restMap.set(2, 'Lisbon, Portugal');

// Chaining:
restMap
    .set('categories', ['Italian', 'Pizzeria'])
    .set('open', 11)
    .set('close', 23)
    .set(true, 'We are open')
    .set(false, 'We are closed');

console.log(restMap.get('name')); // 'Classico Italiano'
console.log(restMap.get(true));   // 'We are open'

// Boolean key trick:
const time = 21;
console.log(restMap.get(time > restMap.get('open') && time < restMap.get('close')));
// true -> 'We are open'

// Map from array of entries:
const questionMap = new Map([
    ['question', 'What is the best programming language?'],
    [1, 'C'],
    [2, 'Java'],
    [3, 'JavaScript'],
    ['correct', 3],
    [true, 'Correct! 🎉'],
    [false, 'Try again!'],
]);

// Object to Map:
const hoursMap = new Map(Object.entries(openingHours));

// Map to Array:
console.log([...questionMap]); // array of [key, value] pairs


const airline = 'TAP Air Portugal';
const plane = 'A320';

// Position:
console.log(airline.indexOf('r'));       // 6 (first occurrence)
console.log(airline.lastIndexOf('r'));    // 10
console.log(airline.indexOf('Portugal')); // 8
console.log(airline.indexOf('portugal')); // -1 (case-sensitive!)

// ------------------------------------------------------------------------
// EXTRACTION METHODS: slice() vs substring() vs substr()
// ------------------------------------------------------------------------
// 1. slice(startIndex, endIndex)
// - Extracts from start to end (end NOT included).
// - Supports negative indexes (counts from the end).
console.log(airline.slice(4));       // 'Air Portugal'
console.log(airline.slice(4, 7));    // 'Air' (end not included)
console.log(airline.slice(-2));      // 'al' (last 2)
console.log(airline.slice(1, -1));   // 'AP Air Portuga' (remove first and last)

// 2. substring(startIndex, endIndex)
// - Like slice, but treats negative indexes as 0.
// - If startIndex > endIndex, it swaps them! (slice returns empty string).
console.log(airline.substring(4, 7));  // 'Air'
console.log(airline.substring(7, 4));  // 'Air' (swaps to 4, 7)
console.log(airline.substring(-2, 4)); // 'TAP ' (-2 becomes 0, extracts 0 to 4)

// 3. substr(startIndex, length) [DEPRECATED - Avoid using in new code]
// - Extracts 'length' number of characters starting from startIndex.
console.log(airline.substr(4, 3));     // 'Air' (starts at 4, takes 3 chars)
console.log(airline.substr(-8, 3));    // 'Por' (starts 8 from end, takes 3 chars)

// Case:
console.log(airline.toLowerCase()); // 'tap air portugal'
console.log(airline.toUpperCase()); // 'TAP AIR PORTUGAL'

// Trim:
console.log('  Hello  '.trim());      // 'Hello'
console.log('  Hello  '.trimStart()); // 'Hello  '
console.log('  Hello  '.trimEnd());   // '  Hello'

// Replace:
console.log('door-door-door'.replace('door', 'gate'));    // 'gate-door-door' (first only)
console.log('door-door-door'.replaceAll('door', 'gate')); // 'gate-gate-gate'

// Includes, StartsWith, EndsWith:
console.log(airline.includes('Air'));      // true
console.log(airline.startsWith('TAP'));    // true
console.log(airline.endsWith('Portugal')); // true

// Split and Join:
console.log('a+very+nice+string'.split('+')); // ['a', 'very', 'nice', 'string']
console.log(['Mr.', 'Jonas', 'Schmedtmann'].join(' ')); // 'Mr. Jonas Schmedtmann'

// Padding:
console.log('Jonas'.padStart(10, '+'));  // '+++++Jonas'
console.log('Jonas'.padEnd(10, '+'));    // 'Jonas+++++'

// Repeat:
console.log('Bad weather... '.repeat(3));
