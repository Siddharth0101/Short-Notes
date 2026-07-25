'use strict';

/**
 * ========================================================================
 * JAVASCRIPT FUNDAMENTALS PART 1 - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka course JavaScript zero se start karta hai.
 * - Ye notes cover karte hain: values, variables, types, operators, logic.
 * - Ye foundation hai — iske bina aage kuch samajh nahi aayega.
 *
 * TOPICS MAP:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  JS FUNDAMENTALS PART 1                                        │
 * ├────────────────┬────────────────┬────────────────┬──────────────┤
 * │ Values &       │ Data Types     │ Type Coercion  │ Truthy /     │
 * │ Variables      │ (7 primitives) │ & Conversion   │ Falsy        │
 * ├────────────────┼────────────────┼────────────────┼──────────────┤
 * │ let/const/var  │ == vs ===      │ Logical Ops    │ Switch /     │
 * │                │                │ && || !        │ Ternary      │
 * └────────────────┴────────────────┴────────────────┴──────────────┘
 */


/**
 * ========================================================================
 * 1. VALUES AND VARIABLES
 * ========================================================================
 * NOTES:
 * - Value = smallest unit of information in JS.
 * - Variable = box that holds a value.
 * - Variable name rules:
 *   - camelCase use karo: firstName, lastName.
 *   - $ aur _ se start kar sakte ho, number se nahi.
 *   - Reserved words nahi use kar sakte: function, new, class.
 *   - UPPERCASE_SNAKE for constants that never change: PI, MAX_SIZE.
 */

let firstName = 'Jonas';
let myAge = 30;
const PI = 3.14159;

console.log(firstName); // 'Jonas'
console.log(myAge);     // 30


/**
 * ========================================================================
 * 2. LET, CONST, VAR
 * ========================================================================
 * NOTES:
 * - let   -> reassign ho sakta hai. Block-scoped. Modern JS me use karo.
 * - const -> reassign NAHI ho sakta. Block-scoped. Default choice banao.
 * - var   -> purana (ES5). Function-scoped. Avoid karo — hoisting issues.
 *
 * COMPARISON TABLE:
 * ┌──────────┬────────────┬─────────────┬───────────┬─────────────────┐
 * │ Keyword  │ Reassign?  │ Scope       │ Hoisted?  │ Use When?       │
 * ├──────────┼────────────┼─────────────┼───────────┼─────────────────┤
 * │ const    │ ❌ No      │ Block { }   │ TDZ ❌    │ DEFAULT choice  │
 * │ let      │ ✅ Yes     │ Block { }   │ TDZ ❌    │ Need reassign   │
 * │ var      │ ✅ Yes     │ Function    │ ✅ undef  │ ❌ NEVER use    │
 * └──────────┴────────────┴─────────────┴───────────┴─────────────────┘
 *
 * GOLDEN RULE:
 * - Pehle const likho. Jab reassign chahiye tabhi let likho. var kabhi mat likho.
 */

const birthYear = 1995;
let job = 'teacher';
job = 'programmer'; // ✅ let allows reassignment.

// const birthYear = 2000; // ❌ ERROR: Assignment to constant variable.

// var ka problem: ye function-scoped hai, block-scoped nahi.
// if (true) {
//     var leaked = 'I leak outside!';
// }
// console.log(leaked); // 'I leak outside!' — var ne block se bahar leak kiya.


/**
 * ========================================================================
 * 3. DATA TYPES
 * ========================================================================
 * NOTES:
 * - JS me 7 primitive types hain:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │              7 PRIMITIVE DATA TYPES                         │
 * ├──────────────┬──────────────────────────────────────────────┤
 * │ 1. Number    │ integers + decimals: 23, 7.5                │
 * │ 2. String    │ text: 'hello', "world", `template`          │
 * │ 3. Boolean   │ true / false                                │
 * │ 4. Undefined │ declared but no value assigned              │
 * │ 5. Null      │ explicitly empty value                      │
 * │ 6. Symbol    │ unique identifier (ES6). Rare use           │
 * │ 7. BigInt    │ very large integers (ES2020)                │
 * └──────────────┴──────────────────────────────────────────────┘
 *
 * + OBJECTS (Reference Type): {}, [], function — NON-primitive.
 *
 * DYNAMIC TYPING:
 * - JS me variable ka type declare nahi karna padta.
 * - Value ka type hota hai, variable ka nahi.
 * - Ek variable me pehle number, phir string rakh sakte ho.
 *
 *   let x = 23;      // x is Number
 *   x = 'hello';     // x is now String — same variable, different type!
 */

let js = 'amazing';
console.log(typeof js);        // 'string'
console.log(typeof 23);        // 'number'
console.log(typeof true);      // 'boolean'
console.log(typeof undefined); // 'undefined'

// typeof null BUG:
console.log(typeof null);      // 'object' — ye JS ka legacy bug hai, actual me null hai.


/**
 * ========================================================================
 * 4. TYPE CONVERSION AND COERCION
 * ========================================================================
 * NOTES:
 * - Conversion = manual type change (hum khud karte hain).
 * - Coercion   = automatic type change (JS khud karta hai).
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │            CONVERSION (Manual)                              │
 * │  Number('23')    → 23                                      │
 * │  String(23)      → '23'                                    │
 * │  Boolean(1)      → true                                    │
 * │  Number('hello') → NaN                                     │
 * ├─────────────────────────────────────────────────────────────┤
 * │            COERCION (Automatic)                             │
 * │                                                             │
 * │  + with string:  '23' + 10  → '2310'   (string wins!)     │
 * │  - * / :          '23' - 10  → 13       (number wins!)     │
 * │                   '23' * 2   → 46                          │
 * │                   '23' / 2   → 11.5                        │
 * └─────────────────────────────────────────────────────────────┘
 */

// Manual conversion:
const inputYear = '1991';
console.log(Number(inputYear) + 18); // 2009 (number math)
console.log(String(23));             // '23'

// Automatic coercion:
console.log('I am ' + 23 + ' years old');  // 'I am 23 years old' (+ -> string)
console.log('23' - '10' - 3);              // 10  (- triggers number coercion)
console.log('23' * '2');                    // 46  (* triggers number coercion)
console.log('23' / '2');                    // 11.5


/**
 * ========================================================================
 * 5. TRUTHY AND FALSY VALUES
 * ========================================================================
 * NOTES:
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │        FALSY VALUES (sirf 5 + false)                        │
 * │                                                              │
 * │   0    ''    undefined    null    NaN    false               │
 * │   ↓    ↓        ↓         ↓       ↓       ↓                │
 * │  All convert to FALSE in boolean context                    │
 * ├──────────────────────────────────────────────────────────────┤
 * │        TRUTHY VALUES (BAAKI SAB KUCH!)                      │
 * │                                                              │
 * │   1, -1, 'hello', '0', 'false', [], {}, function(){}       │
 * │   ↓                                                          │
 * │  All convert to TRUE in boolean context                     │
 * └──────────────────────────────────────────────────────────────┘
 *
 * TRAP:
 * - 0 falsy hai. Agar user ne 0 enter kiya aur tumne if(value) check kiya,
 *   toh 0 ko bhi false treat karega — galat hoga. Nullish coalescing (??) use karo.
 */

console.log(Boolean(0));         // false
console.log(Boolean(''));        // false
console.log(Boolean(undefined)); // false
console.log(Boolean(null));      // false
console.log(Boolean(NaN));       // false

console.log(Boolean('Jonas'));   // true
console.log(Boolean({}));        // true — empty object bhi truthy hai!
console.log(Boolean([]));        // true — empty array bhi truthy hai!


/**
 * ========================================================================
 * 6. EQUALITY OPERATORS: == VS ===
 * ========================================================================
 * NOTES:
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │  === STRICT EQUALITY              == LOOSE EQUALITY           │
 * │  ─────────────────                ──────────────────          │
 * │  Type + Value DONO match          Type coercion PEHLE        │
 * │  No automatic conversion          phir compare               │
 * │                                                                │
 * │  '18' === 18  → false ✅          '18' == 18  → true ⚠️     │
 * │  23 === 23    → true  ✅          null == undefined → true   │
 * │  null === undefined → false       0 == false → true ⚠️      │
 * └────────────────────────────────────────────────────────────────┘
 *
 * GOLDEN RULE:
 * - HAMESHA === use karo. == se bugs aate hain.
 * - == sirf tab use karo jab tum jaante ho kya kar rahe ho (rare).
 */

console.log(18 === 18);   // true  (same type, same value)
console.log('18' === 18); // false (different type)
console.log('18' == 18);  // true  (== ne '18' ko 18 me convert kiya — DANGER!)

// Real example:
// const age = prompt('Your age?'); // prompt returns STRING
// if (age === 18) console.log('Adult (strict)');   // won't match '18'
// if (age == 18)  console.log('Adult (loose)');     // will match '18' ← risky


/**
 * ========================================================================
 * 7. LOGICAL OPERATORS
 * ========================================================================
 * NOTES:
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │  OPERATOR  │  LOGIC            │  SHORT-CIRCUIT RETURNS      │
 * ├────────────┼───────────────────┼─────────────────────────────┤
 * │  &&  AND   │  ALL true = true  │  First FALSY value          │
 * │  ||  OR    │  ANY true = true  │  First TRUTHY value         │
 * │  !   NOT   │  Flip the value   │  Opposite boolean           │
 * │  ??  NULL  │  null/undef check │  First NON-null/undefined   │
 * └────────────┴───────────────────┴─────────────────────────────┘
 *
 *  'Jonas' || 'default'  →  'Jonas'   (pehla truthy mila)
 *  '' || 'default'       →  'default' ('' falsy, aage gaya)
 *  0 && 'Jonas'          →  0         (pehla falsy mila)
 *  7 && 'Jonas'          →  'Jonas'   (sab truthy, last return)
 */

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


/**
 * ========================================================================
 * 8. SWITCH STATEMENT
 * ========================================================================
 * NOTES:
 * - Switch strict equality (===) use karta hai.
 * - Har case ke baad break lagao, nahi toh next case bhi execute hoga (fall-through).
 * - default = else jaisa hai.
 */

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


/**
 * ========================================================================
 * 9. TERNARY (CONDITIONAL) OPERATOR
 * ========================================================================
 * NOTES:
 * - condition ? valueIfTrue : valueIfFalse
 * - Ye expression hai, statement nahi — toh variable me store kar sakte ho,
 *   template literals me use kar sakte ho.
 * - Simple if-else ke liye shortcut.
 */

const age = 23;
const drink = age >= 18 ? 'wine 🍷' : 'water 💧';
console.log(drink); // 'wine 🍷'

// Template literal me:
console.log(`I like to drink ${age >= 18 ? 'wine' : 'water'}`);

// IMPORTANT:
// Ternary ko if-else ke replacement ki tarah mat socho.
// Complex logic ke liye if-else better hai. Ternary sirf simple choice ke liye.


/**
 * ========================================================================
 * 10. STATEMENTS VS EXPRESSIONS
 * ========================================================================
 * NOTES:
 * - Expression = code jo value produce karta hai.
 *   Examples: 3 + 4, true && 'hello', age >= 18 ? 'yes' : 'no'
 *
 * - Statement = code jo action perform karta hai but value produce nahi karta.
 *   Examples: if-else, for, switch, variable declaration (let x = 5).
 *
 * WHY MATTERS:
 * - Template literal `${}` me sirf expressions aa sakte hain.
 * - JSX (React) me bhi sirf expressions chalte hain, statements nahi.
 */

// Expression:
console.log(`I am ${2037 - 1991} years old`);  // ✅ expression inside template

// Statement (can't go in template literal):
// console.log(`${if (true) { 'yes' }}`);       // ❌ SyntaxError


/**
 * ========================================================================
 * 11. JAVASCRIPT RELEASES / ES6+
 * ========================================================================
 * NOTES:
 * - ES6 (ES2015) = biggest update: let/const, arrow functions, classes, promises,
 *   template literals, destructuring, modules, symbols, iterators, etc.
 * - Ab har saal minor updates aate hain: ES2016, ES2017, ... ES2024.
 * - Modern JS = ES6+ features use karna.
 *
 * BACKWARD COMPATIBILITY:
 * - JS backward compatible hai: purana code hamesha chalega.
 * - Forward compatible NAHI hai: naya code purane browser me break ho sakta hai.
 * - Solution: Babel/transpilers naya code ko purane JS me convert karte hain.
 *
 * LEARNING STRATEGY:
 * - ES5 basics samjho (legacy code padhne ke liye).
 * - ES6+ master karo (ye tumhara daily driver hoga).
 */
