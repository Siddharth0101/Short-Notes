/**
 * ## Quick revision
 *
 * - `for` — initialization → condition → body → update repeat hota hai.
 * - `while` — condition pehle check; body zero baar bhi chal sakti hai.
 * - `do...while` — body kam-se-kam ek baar chalti hai.
 * - `for...of` — iterable ki values; `for...in` — enumerable string keys.
 * - `break` — loop rokta hai; `continue` — current iteration skip.
 * - Index — array mein `0` se `length - 1` tak; condition `i < length`.
 * - Infinite loop — condition kabhi false na ho; counter/update check karo.
 * - Nested loop — cost iterations ke total se nikalo; hamesha O(n²) assume mat karo.
 * - Function — reusable kaam; inputs lo aur result return karo.
 * - Parameter — definition ka naam; argument — call ki actual value.
 * - `return` — result deta hai aur function se turant bahar nikalta hai.
 * - No return — normal function ka result `undefined` hota hai.
 * - `console.log` — screen par dikhata hai; caller ko result return nahi karta.
 * - Default parameter — argument missing/undefined ho tab default lagta hai.
 * - Function declaration — apne scope mein declaration se pehle call ho sakti hai.
 * - Arrow — concise function; apna `this` nahi hota.
 * - Pure function — same input par same output; outside state change nahi karti.
 * - Array — ordered values; index zero se start hota hai.
 * - Object — named properties; `user.name` ya `user[key]` se padho.
 * - `push`/`pop` — array ke end par add/remove karte hain.
 * - `const` object — properties badal sakti hain; reference reassign nahi hota.
 * - Reference copy — `b = a` se dono same object ko point karte hain.
 * - Shallow copy — `{...a}`/`[...a]` outer copy banate hain; nested objects shared rehte hain.
 * - Equality — do alag `{}` objects `===` se equal nahi hote.
 * - Missing property — value `undefined`; existence ke liye `Object.hasOwn(obj, key)`.
 * - Accumulator — total/count ko loop se pehle initialize, andar update karo.
 * - Reverse traversal — end se delete karne par remaining earlier indices shift nahi hote.
 * - Iterable — `for...of` plain object par direct nahi; `Object.entries(obj)` use kar sakte ho.
 */

'use strict';


// Without strict mode:
// hasDriversLicence = false; // typo -> silently creates global variable!

// With strict mode:
// hasDriversLicence = false; // ❌ ReferenceError: not defined


function fruitProcessor(apples, oranges) {
    const juice = `Juice with ${apples} apples and ${oranges} oranges.`;
    return juice;
}

const appleJuice = fruitProcessor(5, 0);
console.log(appleJuice); // 'Juice with 5 apples and 0 oranges.'

const appleOrangeJuice = fruitProcessor(2, 4);
console.log(appleOrangeJuice); // 'Juice with 2 apples and 4 oranges.'


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


// Random dice roll:
// let dice = Math.trunc(Math.random() * 6) + 1;
//
// while (dice !== 6) {
//     console.log(`You rolled a ${dice}`);
//     dice = Math.trunc(Math.random() * 6) + 1;
//     if (dice === 6) console.log('You rolled a 6! Loop ends.');
// }


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
