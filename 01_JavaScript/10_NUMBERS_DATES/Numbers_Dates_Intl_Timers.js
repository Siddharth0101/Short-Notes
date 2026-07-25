'use strict';

/**
 * ========================================================================
 * NUMBERS, DATES, INTL & TIMERS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "Numbers, Dates, Intl and Timers" section.
 *
 * ROUNDING METHODS COMPARISON:
 * ┌──────────────┬────────┬────────┬────────┐
 * │ Value        │ 23.3   │ 23.9   │ -23.3  │
 * ├──────────────┼────────┼────────┼────────┤
 * │ Math.trunc   │ 23     │ 23     │ -23    │
 * │ Math.round   │ 23     │ 24     │ -23    │
 * │ Math.floor   │ 23     │ 23     │ -24 ⚠️ │
 * │ Math.ceil    │ 24     │ 24     │ -23    │
 * └──────────────┴────────┴────────┴────────┘
 */


/**
 * ========================================================================
 * 1. NUMBERS IN JAVASCRIPT
 * ========================================================================
 * NOTES:
 * - JS me SAARE numbers floating-point hain (64-bit, IEEE 754).
 * - Integer alag type NAHI hai: 23 === 23.0 -> true.
 * - Floating point precision issue: 0.1 + 0.2 !== 0.3.
 *   0.1 + 0.2 = 0.30000000000000004 — ye JS ki limitation nahi, binary floating-point ki hai.
 */

console.log(23 === 23.0);       // true
console.log(0.1 + 0.2);         // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false ← TRAP!


/**
 * ========================================================================
 * 2. PARSING AND CONVERSION
 * ========================================================================
 * NOTES:
 * - Number('23')        -> 23 (type conversion)
 * - +'23'               -> 23 (+ operator coercion, cleaner)
 * - Number.parseInt('30px', 10)  -> 30 (string se number extract)
 * - Number.parseFloat('2.5rem') -> 2.5 (decimals bhi)
 *
 * parseInt second arg = radix (base). ALWAYS pass 10.
 * - Number.isNaN(val)   -> true if val is NaN. But limited.
 * - Number.isFinite(val)-> BEST way to check if something is a real number.
 * - Number.isInteger(val)-> check integer.
 */

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


/**
 * ========================================================================
 * 3. MATH AND ROUNDING
 * ========================================================================
 * NOTES:
 * - Math.sqrt(25)      -> 5
 * - Math.max(5, 18, 3) -> 18 (does type coercion)
 * - Math.min(5, 18, 3) -> 3
 * - Math.PI             -> 3.14159...
 * - Math.random()       -> 0 to <1
 *
 * ROUNDING:
 * - Math.trunc(23.9)    -> 23 (remove decimal, NO rounding)
 * - Math.round(23.5)    -> 24 (standard rounding)
 * - Math.ceil(23.1)     -> 24 (always round UP)
 * - Math.floor(23.9)    -> 23 (always round DOWN)
 * - Math.floor works with negatives better than trunc:
 *   Math.trunc(-23.3) = -23, Math.floor(-23.3) = -24
 *
 * DECIMAL ROUNDING:
 * - (2.7).toFixed(0) -> '3' (returns STRING!)
 * - (2.345).toFixed(2) -> '2.35'
 * - +(2.345).toFixed(2) -> 2.35 (+ converts back to number)
 */

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


/**
 * ========================================================================
 * 4. REMAINDER OPERATOR
 * ========================================================================
 * NOTES:
 * - % remainder deta hai: 5 % 2 = 1.
 * - Even check: n % 2 === 0.
 * - Nth element styling: i % n === 0.
 */

console.log(5 % 2); // 1
console.log(8 % 3); // 2

const isEven = n => n % 2 === 0;
console.log(isEven(8));  // true
console.log(isEven(23)); // false

// Every 3rd row color karo:
// [...document.querySelectorAll('.row')].forEach((row, i) => {
//     if (i % 3 === 0) row.style.backgroundColor = 'orangered';
// });


/**
 * ========================================================================
 * 5. NUMERIC SEPARATORS (ES2021)
 * ========================================================================
 * NOTES:
 * - _ (underscore) numbers me readability ke liye use kar sakte ho.
 * - Engine ignore karta hai.
 * - String se number convert karte waqt _ nahi chahiye.
 */

const diameter = 287_460_000_000;
console.log(diameter); // 287460000000

const transferFee = 15_00; // 1500 cents
const PI = 3.14_15;

// ❌ Don't use with strings:
console.log(Number('230_000')); // NaN — underscore string me work nahi karta


/**
 * ========================================================================
 * 6. BIGINT (ES2020)
 * ========================================================================
 * NOTES:
 * - Regular numbers max safe integer: 2^53 - 1 = 9007199254740991.
 * - Usse bada number chahiye -> BigInt use karo.
 * - BigInt literal: 12345n (n suffix).
 * - BigInt aur regular number mix NAHI kar sakte math me.
 * - BigInt me Math methods kaam nahi karte.
 * - Comparison (>, <, ===) kaam karta hai (=== type check karega toh false).
 */

console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(2 ** 53 - 1);             // same

const huge = 123456789012345678901234567890n;
console.log(huge + 10n); // works!
// console.log(huge + 10); // ❌ TypeError: Cannot mix BigInt and other types

console.log(20n === 20); // false (different types)
console.log(20n == 20);  // true (loose comparison)
console.log(typeof 20n); // 'bigint'


/**
 * ========================================================================
 * 7. CREATING DATES
 * ========================================================================
 * NOTES:
 * - 4 ways to create dates:
 *   1. new Date()                  -> current date/time.
 *   2. new Date('Aug 02 2020')     -> parse string.
 *   3. new Date(year, month, day, hour, min, sec) -> month is 0-INDEXED!
 *   4. new Date(milliseconds)      -> ms since Jan 1, 1970 (Unix epoch).
 *
 * IMPORTANT:
 * - Month 0 = January, Month 11 = December.
 * - JS auto-corrects: new Date(2037, 10, 31) -> Dec 1, 2037 (Nov has 30 days).
 */

const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));
console.log(new Date(2037, 10, 19, 15, 23, 5)); // Nov 19, 2037 (month 10 = November!)
console.log(new Date(0));                         // Jan 01 1970
console.log(new Date(3 * 24 * 60 * 60 * 1000));  // Jan 04 1970 (3 days later)


/**
 * ========================================================================
 * 8. DATE METHODS
 * ========================================================================
 * NOTES:
 * - getFullYear()  -> 2037 (getYear() NAHI use karna — deprecated).
 * - getMonth()     -> 0-11 (0 = Jan).
 * - getDate()      -> day of month (1-31).
 * - getDay()       -> day of week (0 = Sunday, 6 = Saturday).
 * - getHours(), getMinutes(), getSeconds().
 * - getTime()      -> timestamp in ms.
 * - Date.now()     -> current timestamp.
 * - toISOString()  -> '2037-11-19T14:23:05.000Z'.
 *
 * SET methods: setFullYear(), setMonth(), etc. (mutate the date).
 */

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


/**
 * ========================================================================
 * 9. DATE OPERATIONS
 * ========================================================================
 * NOTES:
 * - Dates ko subtract kar sakte ho -> milliseconds milte hain.
 * - ms / (1000 * 60 * 60 * 24) = days.
 * - Precise date math ke liye libraries use karo: date-fns, dayjs, Luxon.
 */

function calcDaysPassed(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

const days = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days); // 10


/**
 * ========================================================================
 * 10. INTERNATIONALIZING (Intl API)
 * ========================================================================
 * NOTES:
 * - Intl.DateTimeFormat  -> dates format locale ke hisaab se.
 * - Intl.NumberFormat    -> numbers format (currency, percent, etc.).
 * - Locale = language-region: 'en-US', 'hi-IN', 'pt-PT', 'de-DE'.
 * - Browser se locale: navigator.language.
 */

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


/**
 * ========================================================================
 * 11. setTimeout AND setInterval
 * ========================================================================
 * NOTES:
 * - setTimeout(fn, ms, ...args) -> ek baar execute, ms ke baad.
 * - setInterval(fn, ms)         -> bar bar execute, har ms ke baad.
 * - clearTimeout(id)   -> scheduled timeout cancel.
 * - clearInterval(id)  -> interval stop.
 *
 * IMPORTANT:
 * - setTimeout ASYNCHRONOUS hai. Code nahi rukta; timer background me chalta hai.
 * - Callback args setTimeout ke 3rd, 4th... parameters se pass hote hain.
 */

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


/**
 * ========================================================================
 * 12. COUNTDOWN TIMER PATTERN
 * ========================================================================
 * NOTES:
 * - Common pattern: countdown timer for session expiry, OTP, etc.
 * - setInterval ke saath immediately first call bhi karna padta hai (1 sec delay avoid).
 */

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
