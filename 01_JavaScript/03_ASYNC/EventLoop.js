/**
 * ## Quick revision
 *
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
 * - Node phases — timers, poll, check jaise phases; timer/immediate order context-dependent hai.
 * - `nextTick` — Node ki separate queue; ESM/CJS scheduling ko ek universal order mat samjho.
 * - Worker — heavy CPU work main thread se alag; data transfer ka cost bhi hota hai.
 * - Animation — `requestAnimationFrame` repaint se pehle work schedule karta hai.
 * - Promise executor — `new Promise` ka executor synchronously run hota hai.
 * - Rejected chain — catch se normal value return karo toh chain fulfilled ho sakti hai.
 * - Finally — cleanup ke liye; throw/rejected Promise original outcome replace kar sakti hai.
 */

'use strict';


// SYNC vs ASYNC — basic demo
console.log("1. Sync Start");                                              // Sync

setTimeout(() => console.log("2. Async (Macrotask - setTimeout)"), 0);     // Async

Promise.resolve().then(() => console.log("3. Async (Microtask - Promise)")); // Async

console.log("4. Sync End");                                               // Sync

// OUTPUT: 1, 4, 3, 2
// WHY? Aage detail me samjhenge!


// EXAMPLE:
function multiply(a, b) {
    return a * b;       // Step 3: multiply() run hua, result return, POP
}

function square(n) {
    return multiply(n, n); // Step 2: square() ne multiply() call kiya, PUSH
}

function printSquare(n) {
    const result = square(n); // Step 1: printSquare() ne square() call kiya, PUSH
    console.log(result);       // Step 4: console.log PUSH, print, POP
}                              // Step 5: printSquare POP

printSquare(4); // 16

// CALL STACK VISUALIZATION:
// ┌──────────────┐
// │ multiply(4,4)│  ← Step 3 (TOP — pehle ye chalega)
// │ square(4)    │  ← Step 2
// │ printSquare(4)│ ← Step 1
// │ main()       │  ← Global execution context
// └──────────────┘

// STACK OVERFLOW:
// Agar function khud ko INFINITELY call kare → Stack full ho jayega → CRASH!
// function infinite() { infinite(); } // RangeError: Maximum call stack size exceeded


// Node.js Example (Uncomment in Node.js to test):


// EXAMPLE:
console.log("Start");

async function asyncDemo() {
    console.log("Inside Async: Before await (SYNC)");
    await Promise.resolve();  // Function yahan PAUSE hota hai
    console.log("Inside Async: After await (MICROTASK)");
}

asyncDemo();
console.log("End");

// OUTPUT: Start → Inside Async: Before await (SYNC) → End → Inside Async: After await (MICROTASK)
// WHY:
// 1. "Start" — sync
// 2. asyncDemo() call → "Before await" — sync (await se pehle sync hota hai!)
// 3. await mila → function PAUSE, baaki code microtask queue me gaya
// 4. "End" — sync (main thread aage gaya)
// 5. Stack empty → Microtask queue se → "After await"


// EXAMPLE — Starvation demo (safe version with limit):
function starvationDemo() {
    let count = 0;
    const loop = () => {
        if (count === 5) return;   // Safety limit
        count++;
        console.log("Microtask:", count);
        Promise.resolve().then(loop); // Naya microtask bana diya!
    };
    
    setTimeout(() => console.log("Macrotask: Main ye tab tak NAHI chalega jab tak microtasks khatam nahi!"), 0);
    loop();
}
// starvationDemo(); // Uncomment to test


// ---- EXERCISE 1: Basic Priority ----
console.log("\n--- EXERCISE 1 ---");
console.log("A");                                                // Sync
setTimeout(() => console.log("B"), 0);                           // Macrotask
Promise.resolve().then(() => console.log("C"));                  // Microtask
console.log("D");                                                // Sync

// ANSWER: A, D, C, B
// WHY: Sync pehle (A, D) → Microtask (C) → Macrotask (B)


// ---- EXERCISE 2: Nested Promises & Timers ----
console.log("\n--- EXERCISE 2 ---");

setTimeout(() => {
    console.log("1 (Macrotask)");
    Promise.resolve().then(() => {
        console.log("2 (Microtask inside Macrotask)");
    });
}, 0);

Promise.resolve().then(() => {
    console.log("3 (Microtask)");
    setTimeout(() => {
        console.log("4 (Macrotask inside Microtask)");
    }, 0);
});

// ANSWER: 3, 1, 2, 4
// WHY:
// Sync done → Microtask: 3 (aur naya setTimeout(4) macrotask me gaya)
// → Macrotask se 1 liya → uske andar naya microtask(2) bana
// → Macrotask ke baad microtask check: 2
// → Next macrotask: 4


// ---- EXERCISE 3: Promise Executor is SYNC! ----
console.log("\n--- EXERCISE 3 ---");

console.log("Start");

const myPromise = new Promise((resolve) => {
    console.log("Inside Promise Executor");  // Ye SYNC hai!
    resolve("Data");
});

myPromise.then((res) => console.log("Then:", res));  // Microtask

console.log("End");

// ANSWER: Start, Inside Promise Executor, End, Then: Data
// WHY:
// - new Promise() ka executor function SYNCHRONOUSLY chalta hai!
// - resolve() call → .then() ko Microtask queue me bhej diya
// - "End" sync hai, pehle chala
// - Stack empty → Microtask → "Then: Data"


// ---- EXERCISE 4: async/await + setTimeout Mix ----
console.log("\n--- EXERCISE 4 ---");

async function asyncExample() {
    console.log("Async: 1");
    await Promise.resolve();
    console.log("Async: 2");
}

console.log("Main: A");
setTimeout(() => console.log("Timeout: B"), 0);
asyncExample();
console.log("Main: C");

// ANSWER: Main: A, Async: 1, Main: C, Async: 2, Timeout: B
// WHY:
// "Main: A" — sync
// asyncExample() call → "Async: 1" — sync (await se pehle)
// await → function pause, "Async: 2" microtask queue me
// "Main: C" — sync
// Stack empty → Microtask: "Async: 2"
// → Macrotask: "Timeout: B"


// ---- EXERCISE 5: Multiple Microtasks inside Macrotask ----
console.log("\n--- EXERCISE 5 ---");

setTimeout(() => {
    console.log("T1");
    Promise.resolve().then(() => console.log("P1"));
    Promise.resolve().then(() => console.log("P2"));
}, 0);

setTimeout(() => {
    console.log("T2");
    Promise.resolve().then(() => console.log("P3"));
}, 0);

// ANSWER: T1, P1, P2, T2, P3
// WHY:
// Macrotask 1 (T1) chala → 2 microtasks bane (P1, P2)
// Macrotask ke baad microtask drain: P1, P2
// Macrotask 2 (T2) chala → 1 microtask bana (P3)
// Macrotask ke baad microtask drain: P3
