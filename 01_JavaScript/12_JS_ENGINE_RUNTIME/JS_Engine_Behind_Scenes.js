'use strict';

/**
 * ========================================================================
 * JS ENGINE & BEHIND THE SCENES - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "Behind the Scenes" section JS ka engine, execution context,
 *   scope chain, hoisting, TDZ explain karta hai.
 * - Ye advanced concepts hain but interview aur debugging ke liye crucial.
 */


/**
 * ========================================================================
 * 1. JAVASCRIPT ENGINE
 * ========================================================================
 * NOTES:
 * - JS Engine = program jo JavaScript code execute karta hai.
 * - Har browser ka apna engine hai:
 *   V8        -> Chrome, Node.js
 *   SpiderMonkey -> Firefox
 *   JavaScriptCore -> Safari
 *
 * ENGINE ARCHITECTURE:
 * ┌──────────────────────────────────────────────────────┐
 * │              JS ENGINE (V8)                          │
 * │  ┌─────────────────────┐   ┌──────────────────────┐ │
 * │  │    CALL STACK        │   │    HEAP (Memory)       │ │
 * │  │                     │   │                        │ │
 * │  │  Code execute hota   │   │  Objects store hote    │ │
 * │  │  hai yahan.          │   │  hain yahan.           │ │
 * │  │  (Execution contexts │   │  (Unstructured memory  │ │
 * │  │   stack hote hain)   │   │   pool)                │ │
 * │  └─────────────────────┘   └──────────────────────┘ │
 * └──────────────────────────────────────────────────────┘
 *
 * JIT COMPILATION FLOW:
 * Source Code → Parsing (AST) → Compilation → Execution → Optimization
 *                                   │             ↑
 *                                   └─────────────┘
 *                            (optimize + re-compile in background)
 *
 * COMPILATION VS INTERPRETATION:
 * - Compiled (C++): pura code machine code me convert hota hai, phir run.
 * - Interpreted (old JS): line by line translate + execute. Slow.
 * - JIT Compilation (modern JS): pura code compile hota hai, IMMEDIATELY execute.
 *   No intermediate file. Super fast.
 */


/**
 * ========================================================================
 * 2. EXECUTION CONTEXT
 * ========================================================================
 * NOTES:
 * - Execution Context = environment jisme code execute hota hai.
 *
 * ┌──────────────────────────────────────────────────────┐
 * │         EXECUTION CONTEXT COMPONENTS                  │
 * ├──────────────────┬─────────────────┬─────────────────┤
 * │  1. Variable       │ 2. Scope Chain  │ 3. `this`        │
 * │     Environment    │                 │    keyword       │
 * │  ───────────────  │  ─────────────  │  ─────────────  │
 * │  let, const, var   │ Outer variables │ Depends on      │
 * │  functions         │ access chain    │ how function    │
 * │  arguments object  │                 │ is called       │
 * └──────────────────┴─────────────────┴─────────────────┘
 *
 * TYPES:
 * - Global Execution Context: file load hone par banta hai. Sirf 1 hota hai.
 * - Function Execution Context: har function call pe naya banta hai.
 *
 * ARROW FUNCTIONS:
 * - Arrow functions ko apna arguments object NAHI milta.
 * - Arrow functions ko apna `this` NAHI milta (parent se inherit karta hai).
 */


/**
 * ========================================================================
 * 3. CALL STACK
 * ========================================================================
 * NOTES:
 * - Call Stack = stack of execution contexts. LIFO (Last In First Out).
 * - Jab function call hota hai -> naya context stack pe push.
 * - Jab function return karta hai -> context stack se pop.
 * - Stack overflow: bohot zyada recursive calls -> stack full -> crash.
 */

function first() {
    console.log('first');
    second();
    console.log('end of first');
}

function second() {
    console.log('second');
    third();
    console.log('end of second');
}

function third() {
    console.log('third');
}

// first();
// Call Stack order:
// 1. Global context (bottom)
// 2. first() pushed
// 3. second() pushed
// 4. third() pushed
// 5. third() finishes -> popped
// 6. second() finishes -> popped
// 7. first() finishes -> popped


/**
 * ========================================================================
 * 4. SCOPE AND SCOPE CHAIN
 * ========================================================================
 * NOTES:
 * - Scope = where variables are accessible.
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │                    SCOPE TYPES                              │
 * ├────────────────────┬───────────────────┬───────────────────┤
 * │ 1. Global Scope    │ 2. Function Scope │ 3. Block Scope   │
 * │ ────────────────  │ ─────────────── │ ─────────────── │
 * │ File level         │ Inside function  │ Inside { }      │
 * │ Har jagah access   │ Sirf function me │ let/const only  │
 * │                    │                  │ var LEAKS! ⚠️    │
 * └────────────────────┴───────────────────┴───────────────────┘
 *
 * SCOPE CHAIN (ONE WAY → outward):
 * ┌────────────────────────────────────────────────────────────┐
 * │  GLOBAL SCOPE                                              │
 * │  const globalVar = 'global';                                │
 * │  ┌────────────────────────────────────────────────────┐   │
 * │  │  OUTER FUNCTION SCOPE                                │   │
 * │  │  const outerVar = 'outer';                            │   │
 * │  │  ┌────────────────────────────────────────────┐   │   │
 * │  │  │  INNER FUNCTION SCOPE                          │   │   │
 * │  │  │  const innerVar = 'inner';                      │   │   │
 * │  │  │  Can access: innerVar ✅ outerVar ✅ globalVar ✅ │   │   │
 * │  │  └────────────────────────────────────────────┘   │   │
 * │  │  Can access: outerVar ✅ globalVar ✅ innerVar ❌       │   │
 * │  └────────────────────────────────────────────────────┘   │
 * └────────────────────────────────────────────────────────────┘
 *
 * SCOPE ≠ EXECUTION CONTEXT:
 * - Scope chain variable ka SOURCE decide karta hai.
 * - Call stack function ka ORDER decide karta hai.
 * - Scope chain NESTING pe depend karta hai, CALL order pe nahi.
 */

const globalVar = 'global';

function outer() {
    const outerVar = 'outer';

    function inner() {
        const innerVar = 'inner';
        console.log(globalVar); // ✅ global scope se access
        console.log(outerVar);  // ✅ parent scope se access
        console.log(innerVar);  // ✅ apna scope
    }

    inner();
    // console.log(innerVar); // ❌ ReferenceError: child scope accessible nahi
}

// Block scope demo:
if (true) {
    const blockConst = 'visible only here';
    let blockLet = 'also only here';
    var blockVar = 'I LEAK to function/global scope!';
}
// console.log(blockConst); // ❌ ReferenceError
// console.log(blockLet);   // ❌ ReferenceError
console.log(blockVar);      // ✅ 'I LEAK...' — var is NOT block-scoped!


/**
 * ========================================================================
 * 5. HOISTING
 * ========================================================================
 * NOTES:
 * - Hoisting = kuch declarations code execute hone se PEHLE available ho jaati hain.
 * - Behind the scenes: creation phase me declarations scan hoti hain.
 *
 * WHAT GETS HOISTED:
 * ┌──────────────────────┬──────────┬───────────────────┬──────────┐
 * │ Declaration          │ Hoisted? │ Initial Value     │ Scope    │
 * ├──────────────────────┼──────────┼───────────────────┼──────────┤
 * │ function declaration │ ✅ Yes   │ actual function   │ Block*   │
 * │ var                  │ ✅ Yes   │ undefined         │ Function │
 * │ let / const          │ ❌ No** │ <uninitialized>   │ Block    │
 * │ function expression  │ depends │ depends on var/let│          │
 * │ arrow function       │ depends │ depends on var/let│          │
 * └──────────────────────┴──────────┴───────────────────┴──────────┘
 *
 * ** Technically let/const bhi hoist hote hain, but TDZ me rehte hain.
 */

// Function declaration: hoisted, call before define works.
console.log(addDecl(2, 3)); // 5
function addDecl(a, b) {
    return a + b;
}

// var: hoisted as undefined.
console.log(myVar); // undefined (not error!)
var myVar = 23;

// let/const: TDZ error.
// console.log(myLet); // ❌ ReferenceError: Cannot access before initialization
// let myLet = 23;


/**
 * ========================================================================
 * 6. TEMPORAL DEAD ZONE (TDZ)
 * ========================================================================
 * NOTES:
 * - TDZ = scope ki start se lekar variable ki declaration line tak ka area.
 * - TDZ me variable access karne par ReferenceError aata hai.
 * - TDZ sirf let aur const ke liye hai, var ke liye nahi.
 *
 * WHY TDZ?
 * - Bugs catch karne ke liye: variable use before define = almost always a bug.
 * - const ko meaningful value assign karna zaroori hai; TDZ ensures that.
 */

// const myName = 'Jonas';
//
// if (true) {
//     // --- TDZ for `job` starts here ---
//     console.log(myName); // ✅ 'Jonas' (ye TDZ me nahi hai)
//     // console.log(job);  // ❌ ReferenceError (TDZ me hai)
//     const job = 'teacher'; // TDZ ends here
//     console.log(job);    // ✅ 'teacher'
// }


/**
 * ========================================================================
 * 7. THE `this` KEYWORD (OVERVIEW)
 * ========================================================================
 * NOTES:
 * - this = special variable, har execution context me automatically create hota hai.
 * - this ki value CALL TIME pe decide hoti hai, DEFINE time pe nahi.
 *
 * RULES:
 * ┌─────────────────────────┬─────────────────────────────────┐
 * │ Context                 │ `this` value                    │
 * ├─────────────────────────┼─────────────────────────────────┤
 * │ Global (non-strict)     │ window / global                 │
 * │ Global (strict mode)    │ undefined                       │
 * │ Method call (obj.fn())  │ calling object (obj)            │
 * │ Regular function call   │ undefined (strict) / window     │
 * │ Arrow function          │ parent scope's this (lexical)   │
 * │ Event listener          │ DOM element attached to         │
 * │ new keyword             │ new empty object                │
 * │ call/apply/bind         │ manually set                    │
 * └─────────────────────────┴─────────────────────────────────┘
 *
 * DETAILED notes already in: 02_OOPS/This_Keyword.js
 */

const person = {
    name: 'Jonas',
    greet: function () {
        console.log(`Hi, I'm ${this.name}`);
    },
    greetArrow: () => {
        // Arrow function: `this` = parent scope's this (global/undefined)
        console.log(`Hi, I'm ${this.name}`); // undefined in strict mode
    },
};

person.greet();      // 'Hi, I'm Jonas' — this = person
// person.greetArrow(); // 'Hi, I'm undefined' — arrow has no own this


/**
 * ========================================================================
 * 8. PRIMITIVES VS OBJECTS (REFERENCE TYPES)
 * ========================================================================
 * NOTES:
 *
 * MEMORY MODEL:
 * ┌────────────────────────────────────────────────────────────┐
 * │  STACK (Primitives)      │  HEAP (Objects)                  │
 * │  ─────────────────────  │  ─────────────────────────────  │
 * │  age = 30                │  D30F → { name: 'Jonas' }       │
 * │  oldAge = 30 (copy)      │                                  │
 * │  me = D30F (address)    ────┾  Points to SAME object      │
 * │  friend = D30F (copy!)  ────┾  in heap                    │
 * └─────────────────────────┴──────────────────────────────────┘
 *
 * - Primitives: number, string, boolean, undefined, null, symbol, bigint.
 *   -> Stack me store hote hain.
 *   -> Copy karne par new independent value banti hai.
 *
 * - Objects (Reference Types): object, array, function.
 *   -> Heap me store hote hain.
 *   -> Variable sirf REFERENCE (address) hold karta hai.
 *   -> Copy karne par reference copy hota hai, object nahi!
 *
 * DANGER:
 * - Object copy = same memory. Ek me change karo, dono me dikhega.
 * - Shallow copy: Object.assign({}, obj) ya {...obj}.
 * - Deep copy: structuredClone(obj) ya JSON.parse(JSON.stringify(obj)).
 */

// PRIMITIVES: independent copies.
let agePrim = 30;
let oldAge = agePrim;
agePrim = 31;
console.log(agePrim); // 31
console.log(oldAge);  // 30 (unchanged — separate copy)

// OBJECTS: shared reference!
const me = { name: 'Jonas', age: 30 };
const friend = me; // friend points to SAME object in heap
friend.age = 27;
console.log(me.age);     // 27 ← me bhi change ho gaya!
console.log(friend.age); // 27

// Shallow copy to avoid this:
const meCopy = { ...me };
meCopy.age = 50;
console.log(me.age);     // 27 (safe — different object now)
console.log(meCopy.age); // 50
