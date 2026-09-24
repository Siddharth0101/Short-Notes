/**
 * ## Quick revision
 *
 * - Numbers — JS `number` floating point hai; `0.1 + 0.2` exactly `0.3` nahi.
 * - Safe integer — exact integer range ke liye `Number.isSafeInteger` check karo.
 * - `BigInt` — bade integers; `number` ke saath direct arithmetic mix nahi.
 * - `parseInt` — prefix integer parse; full input validation ke liye akela enough nahi.
 * - Rounding — money mein smallest unit aur clear rounding rule rakho.
 * - Date — timestamp ek instant; display timezone se output badal sakta hai.
 * - `Intl` — locale ke hisaab se number/date/currency format karta hai.
 * - Regex — text pattern match; untrusted patterns se expensive matching ho sakti hai.
 * - Global regex — `g`/`y` ke saath `test()` ka `lastIndex` badalta hai.
 * - Timer — delay minimum wait hai; exact execution time guarantee nahi.
 * - Remainder — `%` remainder deta hai; negative input ka sign dhyaan rakho.
 * - Separators — `1_000_000` readable number syntax; value same.
 * - Date constructor — numeric month zero-based; parsing/timezone explicit rakho.
 * - Countdown — deadline minus current time se calculate; interval ticks count karna drift karta hai.
 * - Cleanup — timer ID se clearTimeout/clearInterval karo.
 * - `Number.isFinite` — sirf finite number accept; string ko coerce nahi karta.
 * - Date subtraction — do Date objects subtract karo toh milliseconds ka difference.
 * - Regex anchors — full input validation mein start/end boundaries aur newline behavior dhyaan rakho.
 */

'use strict';


console.log(23 === 23.0);       // true
console.log(0.1 + 0.2);         // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false ← TRAP!


console.log(Number.parseInt('30px', 10));    // 30
console.log(Number.parseInt('e23', 10));     // NaN (must start with number)
console.log(Number.parseFloat('2.5rem'));     // 2.5
console.log(Number.parseInt('2.5rem', 10));  // 2 (ignores decimal)

// Best number check:
console.log(Number.isFinite(20));       // true
console.log(Number.isFinite('20'));     // false
console.log(Number.isFinite(20 / 0));  // false (Infinity)
console.log(Number.isFinite(+'20X'));   // false (NaN)

console.log(Number.isInteger(23));     // true
console.log(Number.isInteger(23.0));   // true
console.log(Number.isInteger(23.5));   // false


// Random integer between min and max (inclusive):
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomInt(10, 20)); // random number 10-20

console.log(Math.trunc(23.9)); // 23
console.log(Math.round(23.5)); // 24
console.log(Math.ceil(23.1));  // 24
console.log(Math.floor(23.9)); // 23

console.log((2.7).toFixed(0));   // '3'
console.log((2.345).toFixed(2)); // '2.35'
console.log(+(2.345).toFixed(2)); // 2.35 (number)


console.log(5 % 2); // 1
console.log(8 % 3); // 2

const isEven = n => n % 2 === 0;
console.log(isEven(8));  // true
console.log(isEven(23)); // false

// Every 3rd row color karo:
// [...document.querySelectorAll('.row')].forEach((row, i) => {
//     if (i % 3 === 0) row.style.backgroundColor = 'orangered';
// });


const diameter = 287_460_000_000;
console.log(diameter); // 287460000000

const transferFee = 15_00; // 1500 cents
const PI = 3.14_15;

// ❌ Don't use with strings:
console.log(Number('230_000')); // NaN — underscore string me work nahi karta


console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(2 ** 53 - 1);             // same

const huge = 123456789012345678901234567890n;
console.log(huge + 10n); // works!
// console.log(huge + 10); // ❌ TypeError: Cannot mix BigInt and other types

console.log(20n === 20); // false (different types)
console.log(20n == 20);  // true (loose comparison)
console.log(typeof 20n); // 'bigint'


const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));
console.log(new Date(2037, 10, 19, 15, 23, 5)); // Nov 19, 2037 (month 10 = November!)
console.log(new Date(0));                         // Jan 01 1970
console.log(new Date(3 * 24 * 60 * 60 * 1000));  // Jan 04 1970 (3 days later)


const future = new Date(2037, 10, 19, 15, 23);

console.log(future.getFullYear());  // 2037
console.log(future.getMonth());     // 10 (November)
console.log(future.getDate());      // 19
console.log(future.getDay());       // 4 (Thursday)
console.log(future.toISOString());  // '2037-11-19T...'
console.log(future.getTime());      // timestamp in ms

// Set:
future.setFullYear(2040);
console.log(future); // 2040


function calcDaysPassed(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

const days = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days); // 10


// DATE FORMATTING:
const nowDate = new Date();

// US format:
console.log(new Intl.DateTimeFormat('en-US').format(nowDate)); // 7/25/2026

// With options:
const dateOptions = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',       // 'numeric', '2-digit', 'long', 'short', 'narrow'
    year: 'numeric',
    weekday: 'long',
};
console.log(new Intl.DateTimeFormat('en-US', dateOptions).format(nowDate));
// 'Friday, July 25, 2026 at 6:44 PM'

// NUMBER FORMATTING:
const num = 3884764.23;

console.log(new Intl.NumberFormat('en-US').format(num));       // 3,884,764.23
console.log(new Intl.NumberFormat('de-DE').format(num));       // 3.884.764,23
console.log(new Intl.NumberFormat('hi-IN').format(num));       // 38,84,764.23

// Currency:
const currencyOptions = { style: 'currency', currency: 'INR' };
console.log(new Intl.NumberFormat('hi-IN', currencyOptions).format(num));
// ₹38,84,764.23


// setTimeout:
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
    (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
    3000,
    ...ingredients
);

console.log('Waiting...'); // ye PEHLE print hoga

// Cancel if needed:
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval (clock example):
// const clockInterval = setInterval(function () {
//     const now = new Date();
//     console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
// }, 1000);
//
// // Stop after 10 seconds:
// setTimeout(() => clearInterval(clockInterval), 10000);


function startLogOutTimer() {
    let time = 120; // 2 minutes in seconds

    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, '0');
        const sec = String(time % 60).padStart(2, '0');
        console.log(`${min}:${sec}`);

        if (time === 0) {
            clearInterval(timer);
            console.log('Logged out!');
        }

        time--;
    };

    tick(); // call immediately (no 1-sec delay)
    const timer = setInterval(tick, 1000);

    return timer;
}

// const logoutTimer = startLogOutTimer();
// clearInterval(logoutTimer); // cancel if needed
