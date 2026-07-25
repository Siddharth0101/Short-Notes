'use strict';

/**
 * ========================================================================
 * ADVANCED FUNCTIONS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "A Closer Look at Functions" section.
 * - Covers: default params, higher-order functions, closures, IIFE.
 *
 * CLOSURE VISUAL MODEL (Backpack Analogy):
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Outer Function returns Inner Function                      │
 * │                                                             │
 * │  ┌───────────────────────────────────────────────────────┐ │
 * │  │ Inner Function                                         │ │
 * │  │  - Code                                              │ │
 * │  │  - [[Scopes]]: BACKPACK 🎒 (Closed over variables)    │ │
 * │  │    (Contains outer function's variable environment!) │ │
 * │  └───────────────────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. DEFAULT PARAMETERS
 * ========================================================================
 * NOTES:
 * - ES6 me function parameters ko default values de sakte ho.
 * - Default expressions me pehle defined parameters use kar sakte ho.
 * - Skip karne ke liye undefined pass karo (not null, not 0).
 */

const bookings = [];

function createBooking(flightNum, numPassengers = 1, price = 199 * numPassengers) {
    const booking = { flightNum, numPassengers, price };
    bookings.push(booking);
    console.log(booking);
}

createBooking('LH123');                // { flightNum: 'LH123', numPassengers: 1, price: 199 }
createBooking('LH123', 2);            // { flightNum: 'LH123', numPassengers: 2, price: 398 }
createBooking('LH123', undefined, 500); // skip numPassengers -> default 1, price = 500


/**
 * ========================================================================
 * 2. PASSING ARGUMENTS: VALUE VS REFERENCE
 * ========================================================================
 * NOTES:
 * - Primitives: function ko COPY milti hai. Original change nahi hota.
 * - Objects: function ko REFERENCE ki copy milti hai. Original CHANGE ho sakta hai!
 *
 * IMPORTANT:
 * - JS me technically sirf "pass by value" hota hai.
 * - Objects ke liye value = reference address ki copy.
 * - C++ me "pass by reference" hota hai (actual reference). JS me nahi.
 *
 * DANGER:
 * - Multiple functions same object modify kar sakti hain -> bugs!
 * - Solution: object clone karo function ke andar.
 */

const flight = 'LH234';
const jonas = { name: 'Jonas Schmedtmann', passport: 24739479284 };

function checkIn(flightNum, passenger) {
    flightNum = 'LH999';       // local copy change — original flight unchanged
    passenger.name = 'Mr. ' + passenger.name; // MUTATES original object!
}

checkIn(flight, jonas);
console.log(flight);     // 'LH234' — unchanged (primitive)
console.log(jonas.name); // 'Mr. Jonas Schmedtmann' — CHANGED! (object reference)


/**
 * ========================================================================
 * 3. FIRST-CLASS VS HIGHER-ORDER FUNCTIONS
 * ========================================================================
 * NOTES:
 * - First-Class Functions = concept/feature. JS me functions values hain.
 *   -> Variables me store, arrays me store, return, pass as argument.
 *
 * - Higher-Order Functions = practice. Wo functions jo:
 *   a) Doosre function ko argument ke roop me accept karte hain (callback pattern).
 *   b) Ya naya function RETURN karte hain.
 *
 * - Har JS developer ko ye samajhna zaroori hai.
 */

// Functions as values:
const greet = () => console.log('Hey Jonas');
const btnClose = { addEventListener: (event, fn) => fn() }; // mock

// Higher-order function (receives callback):
btnClose.addEventListener('click', greet);

// Higher-order function (returns function):
function multiplier(factor) {
    return function (num) {
        return num * factor;
    };
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15


/**
 * ========================================================================
 * 4. CALLBACK FUNCTIONS (Pattern)
 * ========================================================================
 * NOTES:
 * - Callback = function jo doosre function ko pass karte ho, baad me call hoti hai.
 * - JS me EVERYWHERE use hota hai: events, array methods, async, timers.
 *
 * BENEFITS:
 * - Abstraction: logic split karo.
 * - Reusability: same higher-order function, different callbacks.
 */

function oneWord(str) {
    return str.replace(/ /g, '').toLowerCase();
}

function upperFirstWord(str) {
    const [first, ...others] = str.split(' ');
    return [first.toUpperCase(), ...others].join(' ');
}

// Higher-order function:
function transformer(str, fn) {
    console.log(`Original: ${str}`);
    console.log(`Transformed: ${fn(str)}`);
    console.log(`Transformed by: ${fn.name}`); // function ka naam
}

transformer('JavaScript is the best!', upperFirstWord);
// Transformed: JAVASCRIPT is the best!

transformer('JavaScript is the best!', oneWord);
// Transformed: javascriptisthebest!


/**
 * ========================================================================
 * 5. FUNCTIONS RETURNING FUNCTIONS
 * ========================================================================
 * NOTES:
 * - Function return karna = closure create karna.
 * - Functional programming me common pattern.
 * - Currying se related hai.
 */

function greetFn(greeting) {
    return function (name) {
        console.log(`${greeting} ${name}`);
    };
}

const greeterHey = greetFn('Hey');
greeterHey('Jonas');   // 'Hey Jonas'
greeterHey('Steven');  // 'Hey Steven'

// Direct call:
greetFn('Hello')('Jonas'); // 'Hello Jonas'

// Arrow version:
const greetArrow = greeting => name => console.log(`${greeting} ${name}`);
greetArrow('Hi')('Jonas'); // 'Hi Jonas'


/**
 * ========================================================================
 * 6. CLOSURES
 * ========================================================================
 * NOTES:
 * - Closure = function apne parent scope ki variables yaad rakhta hai,
 *   EVEN AFTER parent function return ho chuki hai.
 * - Closure automatically hota hai — explicitly create nahi karna padta.
 * - Closure scope chain se zyada priority rakhta hai.
 *
 * ANALOGY:
 * - Function ek backpack leke paida hota hai.
 * - Backpack me parent scope ki saari variables hoti hain.
 * - Parent function khatam hone ke baad bhi backpack saath rehta hai.
 *
 * WHERE CLOSURES HAPPEN:
 * - Functions returning functions.
 * - Callbacks (setTimeout, event listeners).
 * - IIFE.
 * - Any function that references outer variables.
 */

function secureBooking() {
    let passengerCount = 0; // local variable

    return function () {
        passengerCount++; // closure: passengerCount yaad hai
        console.log(`${passengerCount} passengers`);
    };
}

const booker = secureBooking();
booker(); // 1 passengers
booker(); // 2 passengers
booker(); // 3 passengers

// secureBooking already returned, but booker still has access to passengerCount!
// That's the closure.

// Inspect closure:
console.dir(booker); // [[Scopes]] me closure dikhega

// MORE CLOSURE EXAMPLES:

// Example 1: setTimeout
function boardPassengers(n, wait) {
    const perGroup = n / 3;

    setTimeout(function () {
        console.log(`We are now boarding all ${n} passengers`);
        console.log(`There are 3 groups, each with ${perGroup} passengers`);
    }, wait * 1000);

    console.log(`Will start boarding in ${wait} seconds`);
}

// boardPassengers(180, 3);
// "Will start boarding in 3 seconds" (immediately)
// After 3 seconds: "We are now boarding all 180 passengers"
// The callback CLOSED OVER n and perGroup

// Example 2: Event listener
// function addClickHandler() {
//     let count = 0;
//     document.querySelector('button').addEventListener('click', function () {
//         count++;
//         console.log(`Clicked ${count} times`);
//     });
// }
// addClickHandler();
// count lives in closure — every click increments the SAME count


/**
 * ========================================================================
 * 7. IMMEDIATELY INVOKED FUNCTION EXPRESSIONS (IIFE)
 * ========================================================================
 * NOTES:
 * - IIFE = function define karo aur TURANT execute karo. Dobara call nahi kar sakte.
 * - Purpose: private scope create karna (data encapsulation).
 * - ES6 me block scope (let/const in {}) ne IIFE ki zaroorat kam kar di.
 * - But module pattern aur legacy code me abhi bhi dikhta hai.
 */

// IIFE — function expression:
(function () {
    console.log('This will never run again');
    const isPrivate = 23; // accessible only inside
})();

// IIFE — arrow:
(() => console.log('Arrow IIFE'))();

// ES6 block scope alternative:
{
    const isPrivate = 23;    // block-scoped, private
    var notPrivate = 46;     // var leaks! not truly private
}
// console.log(isPrivate);  // ❌ Error
console.log(notPrivate);    // 46 — var leaked


/**
 * ========================================================================
 * 8. CALL, APPLY, BIND (OVERVIEW)
 * ========================================================================
 * NOTES:
 * - Ye methods `this` keyword manually set karne ke liye hain.
 *
 * COMPARISON:
 * ┌──────────────┬────────────────────────────┬─────────────────────────────┐
 * │ Method       │ Invocation                 │ Arguments                   │
 * ├──────────────┼────────────────────────────┼─────────────────────────────┤
 * │ call()       │ Invokes function immediately│ Passed individually (a, b) │
 * │ apply()      │ Invokes function immediately│ Passed as Array [a, b]      │
 * │ bind()       │ Returns NEW function       │ Bound for future invocation │
 * └──────────────┴────────────────────────────┴─────────────────────────────┘
 */

const lufthansa = {
    airline: 'Lufthansa',
    iataCode: 'LH',
    bookings: [],
    book(flightNum, name) {
        console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`);
        this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
    },
};

lufthansa.book(239, 'Jonas'); // Jonas booked a seat on Lufthansa flight LH239

const eurowings = { airline: 'Eurowings', iataCode: 'EW', bookings: [] };

// call: borrow method with different this
const book = lufthansa.book;
book.call(eurowings, 23, 'Sarah'); // Sarah booked a seat on Eurowings flight EW23

// bind: create reusable function
const bookEW = book.bind(eurowings);
bookEW(635, 'Steven'); // Steven booked a seat on Eurowings flight EW635

// Partial application with bind:
const bookEW23 = book.bind(eurowings, 23);
bookEW23('Martha'); // Martha booked a seat on Eurowings flight EW23
