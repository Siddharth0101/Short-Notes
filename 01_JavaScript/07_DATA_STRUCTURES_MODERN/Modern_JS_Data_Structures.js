'use strict';

/**
 * ========================================================================
 * MODERN JS DATA STRUCTURES - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka ES6+ section: destructuring, spread/rest, short-circuiting,
 *   optional chaining, Sets, Maps, enhanced object literals, strings.
 *
 * SPREAD vs REST OPERATOR (...):
 * ┌─────────────────────────────────────────────────────────────┐
 * │  SPREAD OPERATOR              │  REST PATTERN               │
 * │  Unpacks elements             │  Packs elements             │
 * │  Right side of =              │  Left side of =             │
 * │                               │                             │
 * │  const arr = [1, 2, ...[3,4]] │  const [a, b, ...others] =  │
 * │  Result: [1, 2, 3, 4]         │         [1, 2, 3, 4, 5]     │
 * └───────────────────────────────┴─────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. DESTRUCTURING ARRAYS
 * ========================================================================
 * NOTES:
 * - Destructuring = array/object se values nikal ke alag variables me daalna.
 * - Original array change NAHI hota.
 * - Skip elements: comma se gap chhodo.
 * - Default values: agar element undefined ho toh default use hoga.
 * - Swap variables without temp variable.
 * - Nested destructuring bhi possible hai.
 */

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


/**
 * ========================================================================
 * 2. DESTRUCTURING OBJECTS
 * ========================================================================
 * NOTES:
 * - Object me property NAME se match hota hai (order nahi matter karta).
 * - Rename: { oldName: newName }.
 * - Default values: { prop = defaultVal }.
 * - Mutating variables: parentheses me wrap karo.
 * - Nested objects destructure ho sakte hain.
 * - Function parameters me directly destructure karo.
 */

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


/**
 * ========================================================================
 * 3. SPREAD OPERATOR (...)
 * ========================================================================
 * NOTES:
 * - Spread = unpack elements. Right side of = (ya function argument).
 * - Works on all iterables: arrays, strings, maps, sets.
 * - ES2018: objects pe bhi kaam karta hai.
 *
 * USE CASES:
 * - Array copy: [...arr]
 * - Array merge: [...arr1, ...arr2]
 * - Object copy: {...obj}
 * - Function args: fn(...arr)
 */

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


/**
 * ========================================================================
 * 4. REST PATTERN (...)
 * ========================================================================
 * NOTES:
 * - Rest = pack elements. Left side of = (ya function parameter).
 * - Spread unpacks, Rest packs. Same syntax (...), opposite side.
 * - Rest MUST be last element. Sirf ek rest ho sakta hai.
 */

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


/**
 * ========================================================================
 * 5. SHORT-CIRCUITING (&& and ||)
 * ========================================================================
 * NOTES:
 * - || returns pehla TRUTHY value (ya last value agar sab falsy).
 * - && returns pehla FALSY value (ya last value agar sab truthy).
 * - Ye non-boolean values ke saath bhi kaam karta hai.
 *
 * USE:
 * - || -> default values set karna.
 * - && -> conditionally execute karna.
 */

// || for default:
const guests1 = restaurant.numGuests || 10;
console.log(guests1); // 10 (numGuests undefined -> falsy)

// PROBLEM: agar numGuests = 0, toh || bhi 10 de dega (0 is falsy!)
// SOLUTION: Nullish Coalescing Operator (??)

// && for conditional execution:
restaurant.orderPizza && restaurant.orderPizza('mushrooms', 'spinach');
// orderPizza exists toh call, nahi toh short-circuit (no error)


/**
 * ========================================================================
 * 6. NULLISH COALESCING OPERATOR (??)
 * ========================================================================
 * NOTES:
 * - ?? sirf NULL aur UNDEFINED ko falsy treat karta hai.
 * - 0, '' ko truthy maanta hai (|| se different).
 * - Use this instead of || when 0 or '' could be valid values.
 */

restaurant.numGuests = 0;

// || WRONG:
const guests2 = restaurant.numGuests || 10;
console.log(guests2); // 10 ← WRONG! 0 valid tha

// ?? CORRECT:
const guests3 = restaurant.numGuests ?? 10;
console.log(guests3); // 0 ← CORRECT! 0 is not null/undefined


/**
 * ========================================================================
 * 7. OPTIONAL CHAINING (?.)
 * ========================================================================
 * NOTES:
 * - ?. checks: agar left side null/undefined hai toh IMMEDIATELY undefined return,
 *   aage check nahi karega (no error).
 * - Works on: properties, methods, arrays.
 * - Usually ?. ke saath ?? combine karte hain.
 */

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


/**
 * ========================================================================
 * 8. FOR-OF LOOP
 * ========================================================================
 * NOTES:
 * - for (const item of iterable) { ... }
 * - Clean syntax, no index management.
 * - entries() se index + value dono mil sakte hain.
 */

const menuAll = [...restaurant.starterMenu, ...restaurant.mainMenu];

for (const item of menuAll) console.log(item);

// With index:
for (const [idx, item] of menuAll.entries()) {
    console.log(`${idx + 1}: ${item}`);
}


/**
 * ========================================================================
 * 9. ENHANCED OBJECT LITERALS (ES6)
 * ========================================================================
 * NOTES:
 * - 3 enhancements:
 *   1. Property shorthand: { hours } instead of { hours: hours }.
 *   2. Method shorthand: greet() { } instead of greet: function() { }.
 *   3. Computed property names: { [expression]: value }.
 */

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


/**
 * ========================================================================
 * 10. SETS
 * ========================================================================
 * NOTES:
 * - Set = collection of UNIQUE values. Duplicates automatically remove.
 * - Order maintained hai but index se access nahi kar sakte.
 * - Main use: duplicates remove karna.
 *
 * METHODS:
 * - set.size         -> number of elements (length nahi, size).
 * - set.has(val)     -> true/false.
 * - set.add(val)     -> add.
 * - set.delete(val)  -> remove.
 * - set.clear()      -> remove all.
 */

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


/**
 * ========================================================================
 * 11. MAPS
 * ========================================================================
 * NOTES:
 * - Map = key-value pairs jahan KEY kuch bhi ho sakti hai (object, array, number, boolean).
 *
 * OBJECT vs MAP COMPARISON:
 * ┌───────────────────────────┬─────────────────────────────────┐
 * │  OBJECT                   │  MAP                            │
 * ├───────────────────────────┼─────────────────────────────────┤
 * │  Keys: Strings/Symbols    │  Keys: ANY data type (Obj, Array│
 * │  Not directly iterable    │  Directly iterable              │
 * │  No size property         │  .size property                 │
 * │  Has prototype defaults   │  Pure key-value store           │
 * └───────────────────────────┴─────────────────────────────────┘
 */

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


/**
 * ========================================================================
 * 12. STRINGS - IMPORTANT METHODS
 * ========================================================================
 * NOTES:
 * - Strings primitive hain but JS temporarily object me wrap karta hai (boxing).
 * - String methods NAYA string return karte hain (original change nahi hota).
 */

const airline = 'TAP Air Portugal';
const plane = 'A320';

// Position:
console.log(airline.indexOf('r'));       // 6 (first occurrence)
console.log(airline.lastIndexOf('r'));    // 10
console.log(airline.indexOf('Portugal')); // 8
console.log(airline.indexOf('portugal')); // -1 (case-sensitive!)

// Slice (does NOT mutate):
console.log(airline.slice(4));       // 'Air Portugal'
console.log(airline.slice(4, 7));    // 'Air' (end not included)
console.log(airline.slice(-2));      // 'al' (last 2)
console.log(airline.slice(1, -1));   // 'AP Air Portuga' (remove first and last)

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
