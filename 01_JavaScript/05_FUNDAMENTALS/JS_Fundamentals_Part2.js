'use strict';

/**
 * ========================================================================
 * JAVASCRIPT FUNDAMENTALS PART 2 - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Part 2 me functions, arrays, objects, loops cover hote hain.
 * - Ye building blocks hain — har project me use honge.
 *
 * TOPICS MAP:
 * ┌─────────────────────────────────────────────────────────────┐
 * │           JS FUNDAMENTALS PART 2                           │
 * ├────────────────────┬────────────────────┬───────────────────┤
 * │ Strict Mode        │ Functions          │ Arrow Functions   │
 * │ (Always on!)       │ (3 types)          │ (no own this)     │
 * ├────────────────────┼────────────────────┼───────────────────┤
 * │ Arrays             │ Objects            │ Loops             │
 * │ (push/pop/etc.)    │ (dot vs bracket)   │ (for / while)     │
 * └────────────────────┴────────────────────┴───────────────────┘
 */


/**
 * ========================================================================
 * 1. STRICT MODE
 * ========================================================================
 * NOTES:
 * - 'use strict'; file ke top pe likho.
 * - Strict mode silent errors ko visible errors bana deta hai.
 * - Reserved words ko block karta hai (interface, private, etc.).
 * - Accidental global variables create nahi hone deta.
 *
 * ALWAYS USE STRICT MODE.
 */

// Without strict mode:
// hasDriversLicence = false; // typo -> silently creates global variable!

// With strict mode:
// hasDriversLicence = false; // ❌ ReferenceError: not defined


/**
 * ========================================================================
 * 2. FUNCTIONS
 * ========================================================================
 * NOTES:
 * - Function = reusable block of code.
 * - Parameters = placeholders (function define karte waqt).
 * - Arguments = actual values (function call karte waqt).
 * - return statement value wapas bhejta hai aur function rokta hai.
 * - Agar return nahi likha toh function undefined return karta hai.
 */

function fruitProcessor(apples, oranges) {
    const juice = `Juice with ${apples} apples and ${oranges} oranges.`;
    return juice;
}

const appleJuice = fruitProcessor(5, 0);
console.log(appleJuice); // 'Juice with 5 apples and 0 oranges.'

const appleOrangeJuice = fruitProcessor(2, 4);
console.log(appleOrangeJuice); // 'Juice with 2 apples and 4 oranges.'


/**
 * ========================================================================
 * 3. FUNCTION DECLARATIONS VS EXPRESSIONS
 * ========================================================================
 * NOTES:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Type         │  Hoisted?   │  Syntax                    │
 * ├───────────────┼────────────┼────────────────────────────┤
 * │  Declaration   │  ✅ Yes     │  function name() { }       │
 * │  Expression    │  ❌ No      │  const name = function() { } │
 * │  Arrow        │  ❌ No      │  const name = () => { }     │
 * └───────────────┴────────────┴────────────────────────────┘
 *
 * Jonas prefers expressions because:
 * - Forces you to define before use -> cleaner code flow.
 * - All functions become first-class values.
 */

// DECLARATION (hoisted — call before define works):
function calcAge1(birthYear) {
    return 2037 - birthYear;
}
console.log(calcAge1(1991)); // 46

// EXPRESSION (NOT hoisted):
const calcAge2 = function (birthYear) {
    return 2037 - birthYear;
};
console.log(calcAge2(1991)); // 46


/**
 * ========================================================================
 * 4. ARROW FUNCTIONS
 * ========================================================================
 * NOTES:
 * - ES6 shorthand for function expressions.
 * - One-liner: implicit return (no {}, no return keyword).
 * - Multi-line: need {} and explicit return.
 *
 * IMPORTANT DIFFERENCE:
 * - Arrow functions do NOT get their own `this` keyword.
 * - Ye OOPs section me detail me samjhenge.
 * - Event handlers aur object methods me arrow function se bachna.
 */

// One-liner (implicit return):
const calcAge3 = birthYear => 2037 - birthYear;
console.log(calcAge3(1991)); // 46

// Multiple params need parentheses:
const yearsUntilRetirement = (birthYear, firstName) => {
    const age = 2037 - birthYear;
    const retirement = 65 - age;
    return `${firstName} retires in ${retirement} years`;
};
console.log(yearsUntilRetirement(1991, 'Jonas')); // 'Jonas retires in 19 years'


/**
 * ========================================================================
 * 5. FUNCTIONS CALLING OTHER FUNCTIONS
 * ========================================================================
 * NOTES:
 * - Functions ke andar doosre functions call kar sakte hain.
 * - DRY principle: repeat mat karo, function bana do.
 */

function cutFruitPieces(fruit) {
    return fruit * 4;
}

function fruitProcessorV2(apples, oranges) {
    const applePieces = cutFruitPieces(apples);
    const orangePieces = cutFruitPieces(oranges);
    return `Juice with ${applePieces} apple pieces and ${orangePieces} orange pieces.`;
}

console.log(fruitProcessorV2(2, 3));
// 'Juice with 8 apple pieces and 12 orange pieces.'


/**
 * ========================================================================
 * 6. ARRAYS
 * ========================================================================
 * NOTES:
 * - Array = ordered list of values. Index 0 se start.
 * - const array me bhi push/pop kar sakte ho (reference nahi badalti, content badalta hai).
 * - Array me mixed types rakh sakte ho (not recommended though).
 *
 * BASIC ARRAY METHODS:
 * ┌────────────────┬─────────────────┬────────────────────────────┐
 * │ Method         │ Does What?        │ Returns                    │
 * ├────────────────┼─────────────────┼────────────────────────────┤
 * │ push(val)      │ End me add        │ New length                 │
 * │ unshift(val)   │ Start me add      │ New length                 │
 * │ pop()          │ End se remove     │ Removed element            │
 * │ shift()        │ Start se remove   │ Removed element            │
 * │ indexOf(val)   │ Position find     │ Index (-1 if not found)    │
 * │ includes(val)  │ Check exists?     │ true/false (uses ===)      │
 * └────────────────┴─────────────────┴────────────────────────────┘
 *
 * VISUAL:
 *   push → [ 'a', 'b', 'c', NEW ] ← unshift
 *    pop → [ 'a', 'b', 'c' ] X   ← shift removes from start
 */

const friends = ['Michael', 'Steven', 'Peter'];
console.log(friends[0]);        // 'Michael'
console.log(friends.length);    // 3
console.log(friends[friends.length - 1]); // 'Peter' (last element)

friends.push('Jay');
console.log(friends); // ['Michael', 'Steven', 'Peter', 'Jay']

friends.pop();
console.log(friends); // ['Michael', 'Steven', 'Peter']

console.log(friends.includes('Steven')); // true
console.log(friends.indexOf('Peter'));    // 2


/**
 * ========================================================================
 * 7. OBJECTS
 * ========================================================================
 * NOTES:
 * - Object = key-value pairs ka collection.
 * - Keys = properties.
 * - Object literal: {} me define karo.
 *
 * ACCESS PATTERNS:
 * ┌──────────────────────────────────────────────────────────┐
 * │  DOT NOTATION         │  BRACKET NOTATION               │
 * │  obj.key              │  obj['key']                     │
 * │  ──────────────────── │  ────────────────────────────── │
 * │  Simple, clean         │  Dynamic keys allowed          │
 * │  Static key only       │  Computed/variable keys        │
 * │  obj.firstName         │  obj['first' + 'Name']         │
 * └───────────────────────┴──────────────────────────────────┘
 */

const jonas = {
    firstName: 'Jonas',
    lastName: 'Schmedtmann',
    age: 46,
    job: 'teacher',
    friends: ['Michael', 'Peter', 'Steven'],
};

// Dot notation:
console.log(jonas.lastName); // 'Schmedtmann'

// Bracket notation (dynamic):
const nameKey = 'Name';
console.log(jonas['first' + nameKey]); // 'Jonas'
console.log(jonas['last' + nameKey]);  // 'Schmedtmann'

// Adding new property:
jonas.location = 'Portugal';
jonas['twitter'] = '@jonasschmedtman';


/**
 * ========================================================================
 * 8. OBJECT METHODS
 * ========================================================================
 * NOTES:
 * - Object ke andar function rakh sakte ho -> method.
 * - Method ke andar `this` keyword us object ko refer karta hai.
 * - this.property se object ke properties access kar sakte ho.
 */

const jonas2 = {
    firstName: 'Jonas',
    birthYear: 1991,
    hasDriversLicense: true,

    // Method (function as property):
    calcAge: function () {
        this.age = 2037 - this.birthYear; // result store for reuse
        return this.age;
    },

    getSummary: function () {
        return `${this.firstName} is a ${this.calcAge()}-year old teacher, and he has ${this.hasDriversLicense ? 'a' : 'no'} driver's license.`;
    },
};

console.log(jonas2.calcAge());    // 46
console.log(jonas2.age);          // 46 (stored by calcAge)
console.log(jonas2.getSummary()); // 'Jonas is a 46-year old teacher...'


/**
 * ========================================================================
 * 9. FOR LOOP
 * ========================================================================
 * NOTES:
 * - for (initializer; condition; update) { ... }
 * - Loop tab tak chalega jab tak condition true hai.
 * - break -> loop turant band.
 * - continue -> current iteration skip, next pe jump.
 */

// Basic for loop:
for (let rep = 1; rep <= 5; rep++) {
    console.log(`Lifting weights repetition ${rep} 🏋️`);
}

// Looping arrays:
const typesArr = ['Jonas', 'Schmedtmann', 2037 - 1991, 'teacher', true];
const typesOf = [];

for (let i = 0; i < typesArr.length; i++) {
    typesOf.push(typeof typesArr[i]);
}
console.log(typesOf); // ['string', 'string', 'number', 'string', 'boolean']

// continue and break:
for (let i = 0; i < typesArr.length; i++) {
    if (typeof typesArr[i] !== 'string') continue; // skip non-strings
    console.log(typesArr[i]); // only strings print
}


/**
 * ========================================================================
 * 10. WHILE LOOP
 * ========================================================================
 * NOTES:
 * - while (condition) { ... }
 * - Jab iterations ka count pata na ho tab while use karo.
 * - Example: dice roll karo jab tak 6 na aaye.
 */

// Random dice roll:
// let dice = Math.trunc(Math.random() * 6) + 1;
//
// while (dice !== 6) {
//     console.log(`You rolled a ${dice}`);
//     dice = Math.trunc(Math.random() * 6) + 1;
//     if (dice === 6) console.log('You rolled a 6! Loop ends.');
// }


/**
 * ========================================================================
 * 11. LOOPING BACKWARDS AND NESTED LOOPS
 * ========================================================================
 * NOTES:
 * - Backwards loop: start from length - 1, decrement.
 * - Nested loops: loop ke andar loop (like multiplication table).
 */

// Backward:
const arr = ['Jonas', 'teacher', 46];
for (let i = arr.length - 1; i >= 0; i--) {
    console.log(i, arr[i]);
}
// 2 46 | 1 teacher | 0 Jonas

// Nested:
for (let exercise = 1; exercise <= 3; exercise++) {
    console.log(`--- Starting Exercise ${exercise}`);
    for (let rep = 1; rep <= 3; rep++) {
        console.log(`  Rep ${rep} 🏋️`);
    }
}
