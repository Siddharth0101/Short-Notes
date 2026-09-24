/**
 * ## Quick revision
 *
 * - Expression — value banata hai; statement — instruction chalata hai.
 * - Strict mode — silent mistakes ke kuch cases errors ban jaate hain.
 * - Primitive — immutable value; variable ko nayi value assign ho sakti hai.
 * - Object — properties mutate ho sakti hain; assignment reference value copy karta hai.
 * - Pass-by-value — JS arguments values hain; object argument ki value reference hoti hai.
 * - Coercion — implicit type conversion; boundary par explicit conversion clearer hai.
 * - Short-circuit — `&&`, `||`, `??` zaroorat padne par hi right side evaluate karte hain.
 * - Destructuring default — sirf `undefined` par lagta hai, `null` par nahi.
 * - Equality — `Object.is(NaN, NaN)` true; `Object.is(0, -0)` false.
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
 * - Call stack — synchronous functions yahin execute hote hain.
 * - Event loop — stack khali hone par queued work ko chance deta hai.
 * - Microtasks — Promise callbacks/`queueMicrotask`; checkpoint par queue drain hoti hai.
 * - Timers — timer task se pehle queued microtasks chal sakti hain.
 * - Promise — pending se fulfilled ya rejected; settle hone ke baad state fixed.
 * - `.then` — nayi Promise deta hai; callback ka return chain ko feed karta hai.
 * - `async` — hamesha Promise return; `await` sirf current async flow suspend karta hai.
 * - `fetch` — HTTP 404/500 par usually resolve; `response.ok` check karo.
 * - Abort — `AbortController` se supported operation cancel; late result bhi guard karo.
 * - Starvation — endless microtasks rendering aur tasks delay kar sakti hain.
 * - `in` operator — own aur inherited properties dono check karta hai.
 * - Automatic semicolon — `return` ke turant baad newline unexpected undefined de sakti hai.
 * - `delete` — object property hataata hai; array slot delete karne se length shrink nahi hoti.
 */

'use strict';


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


// const myName = 'Jonas';
//
// if (true) {
//     // --- TDZ for `job` starts here ---
//     console.log(myName); // ✅ 'Jonas' (ye TDZ me nahi hai)
//     // console.log(job);  // ❌ ReferenceError (TDZ me hai)
//     const job = 'teacher'; // TDZ ends here
//     console.log(job);    // ✅ 'teacher'
// }


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
