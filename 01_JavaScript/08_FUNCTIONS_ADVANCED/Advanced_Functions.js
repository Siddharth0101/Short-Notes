/**
 * ## Quick revision
 *
 * - Function — reusable kaam; inputs lo aur result return karo.
 * - Parameter — definition ka naam; argument — call ki actual value.
 * - `return` — result deta hai aur function se turant bahar nikalta hai.
 * - No return — normal function ka result `undefined` hota hai.
 * - `console.log` — screen par dikhata hai; caller ko result return nahi karta.
 * - Default parameter — argument missing/undefined ho tab default lagta hai.
 * - Function declaration — apne scope mein declaration se pehle call ho sakti hai.
 * - Arrow — concise function; apna `this` nahi hota.
 * - Pure function — same input par same output; outside state change nahi karti.
 * - Scope — variable kahan accessible hai; lexical scope code ki location se decide hota hai.
 * - Block scope — `let`/`const` `{}` tak; `var` nearest function tak.
 * - Scope chain — naam local se outer scopes mein search hota hai.
 * - Closure — function outer bindings yaad rakhta hai, outer call khatam hone ke baad bhi.
 * - Live binding — closure latest binding padhta hai; automatic snapshot nahi.
 * - Loop trap — `var` callbacks same binding share; `let` har iteration ki binding deta hai.
 * - Hoisting — declarations pehle register; initialization ka timing alag hai.
 * - TDZ — lexical binding initialize hone tak access error deta hai.
 * - Memory — reachable closure captured objects ko alive rakh sakta hai.
 * - Use — private counters, callbacks aur function factories.
 * - Rest parameter — `(...args)` extra arguments ko array mein collect karta hai.
 * - Higher-order function — function ko input le ya function return kare.
 * - Early return — `return` ke baad same function ka remaining code skip hota hai.
 */

'use strict';


const bookings = [];

function createBooking(flightNum, numPassengers = 1, price = 199 * numPassengers) {
    const booking = { flightNum, numPassengers, price };
    bookings.push(booking);
    console.log(booking);
}

createBooking('LH123');                // { flightNum: 'LH123', numPassengers: 1, price: 199 }
createBooking('LH123', 2);            // { flightNum: 'LH123', numPassengers: 2, price: 398 }
createBooking('LH123', undefined, 500); // skip numPassengers -> default 1, price = 500


const flight = 'LH234';
const jonas = { name: 'Jonas Schmedtmann', passport: 24739479284 };

function checkIn(flightNum, passenger) {
    flightNum = 'LH999';       // local copy change — original flight unchanged
    passenger.name = 'Mr. ' + passenger.name; // MUTATES original object!
}

checkIn(flight, jonas);
console.log(flight);     // 'LH234' — unchanged (primitive)
console.log(jonas.name); // 'Mr. Jonas Schmedtmann' — CHANGED! (object reference)


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
