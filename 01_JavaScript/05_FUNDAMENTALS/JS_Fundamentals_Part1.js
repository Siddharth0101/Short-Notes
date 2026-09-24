/**
 * ## Quick revision
 *
 * - Variable — value ko diya hua naam.
 * - `var` — function-scoped; dobara declare aur assign kar sakte ho.
 * - `let` — block-scoped; value dobara assign kar sakte ho.
 * - `const` — block-scoped; binding reassign nahi hoti, object ki properties badal sakti hain.
 * - TDZ — `let`/`const` ko declaration se pehle padho toh `ReferenceError`.
 * - Hoisting — `var` declaration se pehle `undefined` milta hai; assigned value nahi.
 * - `=` — right side calculate karo, phir left variable mein rakho.
 * - Primitive copy — `let b = a` ke baad `a` badalne se `b` nahi badalta.
 * - Naming — `score` aur `Score` alag; naam digit se start nahi hota.
 * - Default — pehle `const`; reassignment chahiye toh `let`.
 * - Primitive types — string, number, boolean, undefined, null, bigint aur symbol.
 * - Object — properties wala reference value; arrays aur functions bhi objects hain.
 * - `undefined` — value assign nahi hui; `null` — jaan-boojhkar empty value.
 * - `typeof null` — `"object"` aata hai; yeh purana language quirk hai.
 * - `===` — type conversion bina equality; `==` conversion kar sakta hai.
 * - `+` — string operand ho toh concatenation ho sakti hai: `"5" + 2` → `"52"`.
 * - Conversion — `Number("5")` → `5`; `Number("abc")` → `NaN`.
 * - Falsy — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`; `[]` aur `{}` truthy.
 * - `??` — sirf null/undefined par fallback; `||` har falsy value par fallback.
 * - `NaN` — `Number.isNaN(value)` se check karo; `NaN === NaN` false hai.
 * - `if` — condition truthy ho toh block chalta hai.
 * - `else if` — pehli matching branch chalti hai; baaki skip.
 * - `else` — koi condition match na ho toh fallback.
 * - `&&` — pehla falsy ya last operand return; `||` — pehla truthy ya last operand.
 * - `!` — truthiness ko ulta boolean banata hai.
 * - Ternary — `condition ? yes : no`; chhoti value selection ke liye.
 * - `switch` — cases strict equality se match; fall-through rokne ko `break`.
 * - Boundary — `age >= 18` mein 18 included hai; 17, 18, 19 se check karo.
 * - Shadowing — inner scope ka same naam outer variable ko hide karta hai.
 * - Redeclaration — same scope mein `let`/`const` dobara declare karna error hai.
 * - Initialization — `let x;` ke baad undefined; `const` ko declaration par value chahiye.
 */

'use strict';


let firstName = 'Jonas';
let myAge = 30;
const PI = 3.14159;

console.log(firstName); // 'Jonas'
console.log(myAge);     // 30


const birthYear = 1995;
let job = 'teacher';
job = 'programmer'; // ✅ let allows reassignment.

// const birthYear = 2000; // ❌ ERROR: Assignment to constant variable.

// var ka problem: ye function-scoped hai, block-scoped nahi.
// if (true) {
//     var leaked = 'I leak outside!';
// }
// console.log(leaked); // 'I leak outside!' — var ne block se bahar leak kiya.


let js = 'amazing';
console.log(typeof js);        // 'string'
console.log(typeof 23);        // 'number'
console.log(typeof true);      // 'boolean'
console.log(typeof undefined); // 'undefined'

// typeof null BUG:
console.log(typeof null);      // 'object' — ye JS ka legacy bug hai, actual me null hai.


// Manual conversion:
const inputYear = '1991';
console.log(Number(inputYear) + 18); // 2009 (number math)
console.log(String(23));             // '23'

// Automatic coercion:
console.log('I am ' + 23 + ' years old');  // 'I am 23 years old' (+ -> string)
console.log('23' - '10' - 3);              // 10  (- triggers number coercion)
console.log('23' * '2');                    // 46  (* triggers number coercion)
console.log('23' / '2');                    // 11.5


console.log(Boolean(0));         // false
console.log(Boolean(''));        // false
console.log(Boolean(undefined)); // false
console.log(Boolean(null));      // false
console.log(Boolean(NaN));       // false

console.log(Boolean('Jonas'));   // true
console.log(Boolean({}));        // true — empty object bhi truthy hai!
console.log(Boolean([]));        // true — empty array bhi truthy hai!


console.log(18 === 18);   // true  (same type, same value)
console.log('18' === 18); // false (different type)
console.log('18' == 18);  // true  (== ne '18' ko 18 me convert kiya — DANGER!)

// Real example:
// const age = prompt('Your age?'); // prompt returns STRING
// if (age === 18) console.log('Adult (strict)');   // won't match '18'
// if (age == 18)  console.log('Adult (loose)');     // will match '18' ← risky


const hasDriversLicense = true;
const hasGoodVision = true;

console.log(hasDriversLicense && hasGoodVision); // true
console.log(hasDriversLicense || false);          // true
console.log(!hasDriversLicense);                  // false

// Short-circuit:
console.log('Jonas' || 'default'); // 'Jonas' (pehla truthy mila, return)
console.log('' || 'default');      // 'default' ('' falsy, next check)
console.log(0 && 'Jonas');         // 0  (pehla falsy mila, return)
console.log(7 && 'Jonas');         // 'Jonas' (7 truthy, aage gaya)


const day = 'monday';

switch (day) {
    case 'monday':
        console.log('Plan course structure');
        break;
    case 'tuesday':
        console.log('Prepare theory videos');
        break;
    case 'wednesday':
    case 'thursday': // fall-through: dono ke liye same action
        console.log('Write code examples');
        break;
    case 'friday':
        console.log('Record videos');
        break;
    default:
        console.log('Weekend!');
}


const age = 23;
const drink = age >= 18 ? 'wine 🍷' : 'water 💧';
console.log(drink); // 'wine 🍷'

// Template literal me:
console.log(`I like to drink ${age >= 18 ? 'wine' : 'water'}`);

// IMPORTANT:
// Ternary ko if-else ke replacement ki tarah mat socho.
// Complex logic ke liye if-else better hai. Ternary sirf simple choice ke liye.


// Expression:
console.log(`I am ${2037 - 1991} years old`);  // ✅ expression inside template

// Statement (can't go in template literal):
// console.log(`${if (true) { 'yes' }}`);       // ❌ SyntaxError
