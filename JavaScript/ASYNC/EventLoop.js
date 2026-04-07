'use strict';

/**
 * ========================================================================
 * EVENT LOOP IN JAVASCRIPT — COMPLETE GUIDE
 * ========================================================================
 * NOTES:
 * - JavaScript ek "SINGLE-THREADED" language hai — matlab ek waqt me sirf EK 
 *   hi kaam kar sakti hai. Iske paas sirf EK Call Stack hai.
 * - Par humein asynchronous kaam bhi karna padta hai (API calls, timers, file read).
 * - To question ye hai: "Agar JS single-threaded hai to async kaam kaise handle hota hai?"
 * - ANSWER: EVENT LOOP + Browser/Node.js Runtime ki madad se!
 * 
 * REAL LIFE ANALOGY:
 * - Sochlo ek restaurant me SIRF EK chef hai (JS = single thread).
 * - Chef ek ek order banata hai (Call Stack me code execute hota hai).
 * - Par kuch orders me "oven me 10 min rakhna hai" (setTimeout = async kaam).
 * - Chef oven me daal ke NEXT order shuru kar deta hai (non-blocking).
 * - Jab oven ki timer bajti hai (callback ready), ek assistant (Event Loop) check 
 *   karta hai ki chef free hai kya. Agar free hai to oven wala order chef ko de deta hai.
 * - Chef = Call Stack, Oven = Web API, Assistant = Event Loop, Order slip queue = Task Queue.
 */


/**
 * ========================================================================
 * 1. SYNCHRONOUS vs ASYNCHRONOUS (Basic Difference)
 * ========================================================================
 * NOTES:
 * 
 * SYNCHRONOUS (Blocking):
 * - Code LINE BY LINE chalta hai. Jab tak ek kaam pura nahi hota, agla START nahi hota.
 * - Agar ek kaam me 10 seconds lage → poora program 10 seconds RUKA rahega.
 * - Problem: UI freeze ho jayega, user kuch kar hi nahi payega.
 * 
 * ASYNCHRONOUS (Non-Blocking):
 * - Kaam BACKGROUND me chala jata hai. Baaki code aage badhta rehta hai.
 * - Jab background wala kaam complete hota hai, to result wapas aata hai.
 * - User ko koi freeze nahi lagta!
 * 
 * EXAMPLES JO ASYNC HAIN:
 * - setTimeout / setInterval (Timers)
 * - fetch() / XMLHttpRequest (API calls)
 * - DOM Events (click, scroll, keypress)
 * - File reading (fs.readFile in Node.js)
 * - Promises, async/await
 */

// SYNC vs ASYNC — basic demo
console.log("1. Sync Start");                                              // Sync

setTimeout(() => console.log("2. Async (Macrotask - setTimeout)"), 0);     // Async

Promise.resolve().then(() => console.log("3. Async (Microtask - Promise)")); // Async

console.log("4. Sync End");                                               // Sync

// OUTPUT: 1, 4, 3, 2
// WHY? Aage detail me samjhenge!


/**
 * ========================================================================
 * 2. JS ARCHITECTURE — Event Loop kaise kaam karta hai?
 * ========================================================================
 * NOTES:
 * - JS akela async handle nahi karta! Browser (ya Node.js) ka ENVIRONMENT help karta hai.
 * - 4 major components milke kaam karte hain:
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    JS RUNTIME ENVIRONMENT                       │
 * │                                                                 │
 * │  ┌──────────────┐    ┌──────────────────────────────────────┐  │
 * │  │  CALL STACK   │    │          WEB APIs (Browser)          │  │
 * │  │              │    │  setTimeout, fetch, DOM Events,      │  │
 * │  │  main()      │───>│  geolocation, etc.                   │  │
 * │  │  fn1()       │    │  (Ye sab JS ke BAHAR chalte hain)    │  │
 * │  │  fn2()       │    └──────────┬───────────────────────────┘  │
 * │  └──────────────┘               │                              │
 * │         ^                       │ (Callback ready hone pe)     │
 * │         │                       ▼                              │
 * │  ┌──────┴──────────────────────────────────────────────┐      │
 * │  │              TASK QUEUES                             │      │
 * │  │  ┌────────────────────┐  ┌────────────────────────┐ │      │
 * │  │  │ MICROTASK QUEUE    │  │ MACROTASK QUEUE        │ │      │
 * │  │  │ (Promises, nextTick)│  │ (setTimeout, Events)  │ │      │
 * │  │  │ HIGH PRIORITY      │  │ LOW PRIORITY           │ │      │
 * │  │  └────────────────────┘  └────────────────────────┘ │      │
 * │  └─────────────────────────────────────────────────────┘      │
 * │                       ^                                        │
 * │                       │                                        │
 * │              ┌────────┴────────┐                               │
 * │              │   EVENT LOOP    │  (Constantly monitors)        │
 * │              │  "Stack empty?  │                               │
 * │              │   Queue me hai? │                               │
 * │              │   → Stack pe do"│                               │
 * │              └─────────────────┘                               │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * COMPONENT-WISE EXPLANATION:
 * 
 * 1) CALL STACK (Execution Stack):
 *    - Yahan actual JS code execute hota hai.
 *    - LIFO (Last In, First Out) — jo function baad me aaya wo pehle hatega.
 *    - Ek time pe sirf EK function run hota hai (single-threaded).
 *    - Jab function call hota hai → stack me PUSH. Jab return hota hai → POP.
 * 
 * 2) WEB APIs (Browser) / C++ APIs (Node.js):
 *    - setTimeout, fetch, DOM events — ye JS ENGINE ke part NAHI hain!
 *    - Browser inhe provide karta hai — ye BACKGROUND me chalte hain.
 *    - Timer khatam / data aa gaya → callback ko QUEUE me bhej dete hain.
 * 
 * 3) TASK QUEUES (Microtask + Macrotask):
 *    - Ready callbacks yahan WAIT karte hain ki Call Stack khali ho.
 *    - 2 types ki queues hain (aage detail me).
 * 
 * 4) EVENT LOOP:
 *    - Ye ek INFINITE LOOP hai jo constantly check karta hai:
 *      "Kya Call Stack EMPTY hai? Agar haan, to Queue se next task utha ke Stack pe daal do."
 *    - Ye BRIDGE hai Queue aur Call Stack ke beech.
 */


/**
 * ========================================================================
 * 3. CALL STACK — Step by Step Execution Samjho
 * ========================================================================
 * NOTES:
 * - Call Stack ko samjhna bahut zaroori hai! Ye JS ka 'brain' hai.
 * - Jab bhi koi function CALL hota hai → Stack pe PUSH hota hai.
 * - Jab function RETURN karta hai → Stack se POP ho jaata hai.
 * - Stack LIFO (Last In First Out) hai — jo upar hai wo pehle nikalega.
 */

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


/**
 * ========================================================================
 * 4. MICROTASK QUEUE vs MACROTASK QUEUE (Priority Game!)
 * ========================================================================
 * NOTES:
 * - 2 tarah ki queues hain. Microtask ki priority ZYADA hoti hai.
 * 
 * A) MICROTASK QUEUE (VIP Queue — HIGH Priority):
 *    - Yahan VIP kaam aate hain. Ye PEHLE execute hote hain.
 *    - Kya aata hai yahan:
 *      1. Promise callbacks (.then / .catch / .finally)
 *      2. queueMicrotask()
 *      3. MutationObserver (DOM changes observe)
 *      4. process.nextTick() (Node.js only — sabse highest priority!)
 * 
 * B) MACROTASK QUEUE (Normal Queue — LOW Priority):
 *    - Yahan normal async kaam aate hain.
 *    - Kya aata hai yahan:
 *      1. setTimeout()
 *      2. setInterval()
 *      3. setImmediate() (Node.js only)
 *      4. DOM Events (click, scroll, keypress, load)
 *      5. I/O operations (file read in Node.js)
 *      6. MessageChannel
 * 
 * EVENT LOOP KA RULE (Bahut Important — YAAD KARO!):
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  1. Pehle: Saara SYNC code chala lo (Call Stack empty karo).   │
 * │  2. Phir:  SAARE Microtasks khatam karo (puri queue khali karo)│
 * │  3. Phir:  SIRF 1 Macrotask uthao aur chalao.                 │
 * │  4. Phir:  WAPAS Step 2 pe jao (Microtask check karo!)        │
 * │  5. Repeat forever...                                          │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * IMPORTANT POINT:
 * - Har 1 Macrotask ke BAAD, puri Microtask queue DRAIN hoti hai.
 * - Agar Microtask ke andar naya Microtask bane → wo BHI abhi chalega!
 * - Agar Microtask ke andar naya Macrotask bane → wo NEXT round me chalega.
 */


/**
 * ========================================================================
 * 5. EXECUTION ORDER / PRIORITY (Ratta Maar Lo!)
 * ========================================================================
 * NOTES:
 * - Sabse pehle kya chalega, ye yaad rakhna bahut zaroori hai:
 * 
 * | Priority | Kya hai?                  | Examples                           |
 * |----------|---------------------------|------------------------------------|
 * | 1 (Max)  | Synchronous Code          | console.log, loops, calculations   |
 * | 2        | process.nextTick          | Node.js only (Super VIP Microtask) |
 * | 3        | Microtask Queue           | Promises (.then), queueMicrotask() |
 * | 4        | requestAnimationFrame     | Browser only (paint se pehle)      |
 * | 5        | Macrotask Queue           | setTimeout, setInterval, DOM Events|
 * | 6        | setImmediate              | Node.js only (Check phase)         |
 * | 7 (Min)  | requestIdleCallback       | Browser only (jab free ho)         |
 * 
 * SHORTCUT YAAD KARNE KA:
 * Sync >>> nextTick >>> Promise >>> rAF >>> setTimeout >>> setImmediate >>> rIC
 */


/**
 * ========================================================================
 * 6. NODE.JS EVENT LOOP PHASES (Backend Specific)
 * ========================================================================
 * NOTES:
 * - Browser aur Node.js ka Event Loop structure ALAG hai.
 * - Node.js ka Event Loop PHASES me ghoomta hai (top to bottom, circular):
 * 
 * ┌───────────────────────────┐
 * │    TIMERS PHASE           │  → setTimeout, setInterval callbacks
 * ├───────────────────────────┤
 * │    PENDING CALLBACKS      │  → System-level callbacks (TCP errors etc.)
 * ├───────────────────────────┤
 * │    IDLE, PREPARE          │  → Internal use only
 * ├───────────────────────────┤
 * │    POLL PHASE (I/O)       │  → fs.readFile, network requests, etc.
 * ├───────────────────────────┤
 * │    CHECK PHASE            │  → setImmediate() callbacks
 * ├───────────────────────────┤
 * │    CLOSE CALLBACKS        │  → socket.on('close') etc.
 * └───────────────────────────┘
 *         ↑___________________↓  (Loop ghoomta rehta hai)
 * 
 * IMPORTANT: Har phase ke BEECH me Microtask queue drain hoti hai!
 * 
 * A) process.nextTick():
 *    - Sabse HIGHEST priority (Microtask me bhi VIP).
 *    - Kisi bhi Event Loop phase ke AGLE phase me jaane se pehle ye run hota hai.
 *    - Promise se bhi pehle!
 * 
 * B) setTimeout(..., 0) vs setImmediate() — THE RACE:
 *    - Top-level code me: OUTPUT UNPREDICTABLE hai! (Machine speed pe depend)
 *    - I/O cycle (fs.readFile) ke ANDAR: setImmediate HAMESHA JEETEGA!
 *      Kyunki: Poll Phase → seedha Check Phase (setImmediate) → phir pura loop 
 *      ghoom ke Timers Phase (setTimeout). Isliye I/O me setImmediate pehle aata hai.
 */

// Node.js Example (Uncomment in Node.js to test):
/*
const fs = require('fs');

// TOP-LEVEL: Unpredictable (koi bhi jeet sakta hai)
setTimeout(() => console.log("Top: setTimeout"), 0);
setImmediate(() => console.log("Top: setImmediate"));

// I/O CYCLE: setImmediate ALWAYS wins
fs.readFile(__filename, () => {
    setTimeout(() => console.log("I/O: setTimeout"));
    setImmediate(() => console.log("I/O: setImmediate")); // Ye PEHLE aayega!
});

// process.nextTick — Sabse pehle
process.nextTick(() => console.log("nextTick — VIP!"));
Promise.resolve().then(() => console.log("Promise — Normal Microtask"));
*/


/**
 * ========================================================================
 * 7. BROWSER-SPECIFIC CONCEPTS
 * ========================================================================
 * NOTES:
 * 
 * A) requestAnimationFrame (rAF):
 *    - Browser ko bolta hai: "Main animation update karna chahta hu."
 *    - Browser NEXT SCREEN REPAINT se THODA PEHLE is callback ko chalata hai.
 *    - Priority: Microtasks ke BAAD, par Paint se PEHLE.
 *    - ~60fps = har ~16.67ms me ek baar call hoga.
 *    - Smooth animations ke liye setTimeout NAHI, rAF use karo!
 * 
 * B) queueMicrotask(fn):
 *    - Explicitly koi function Microtask queue me daalna ho to ye use karo.
 *    - Promise.resolve().then() se zyada CLEAN approach hai.
 * 
 * C) requestIdleCallback (rIC):
 *    - SABSE LOW priority ka kaam.
 *    - Browser kehta hai: "Jab main BILKUL free ho jaunga (koi task nahi), 
 *      tab ye chalega."
 *    - Use: Analytics logs, lazy loading, non-critical background tasks.
 * 
 * D) MessageChannel (React Scheduler uses this!):
 *    - setTimeout(..., 0) me browser 4ms minimum delay lagata hai (HTML5 spec).
 *    - React ko 0ms delay ka macrotask chahiye tha fast rendering ke liye.
 *    - Isliye React ne MessageChannel postMessage API use kiya — TRUE 0ms macrotask!
 */


/**
 * ========================================================================
 * 8. async/await — EVENT LOOP KE CONTEXT ME
 * ========================================================================
 * NOTES:
 * - async/await Promises ka hi "syntactic sugar" hai.
 * - Event Loop ke context me samjho:
 * 
 *   1. 'await' se PEHLE ka code: SYNCHRONOUS chalta hai (Call Stack me).
 *   2. 'await' ke baad ka code: MICROTASK QUEUE me chala jaata hai.
 *   3. Function PAUSE ho jaata hai (yield), but Call Stack BLOCK nahi hota!
 *   4. Event Loop baaki kaam karta hai, jab await ka result aa jaye → resume.
 * 
 * UNDER THE HOOD 'await' kya karta hai:
 *   async function foo() {
 *     console.log("A");      // Sync
 *     await somePromise;     // Yahan function pause
 *     console.log("B");      // Ye secretly .then() ban jaata hai (Microtask)
 *   }
 *   
 *   Ye internally aisa hai:
 *   function foo() {
 *     console.log("A");
 *     somePromise.then(() => {
 *       console.log("B");    // Microtask queue me
 *     });
 *   }
 */

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


/**
 * ========================================================================
 * 9. UI FREEZE KYUN HOTA HAI? (Important Interview Question!)
 * ========================================================================
 * NOTES:
 * - Agar koi LAMBA synchronous kaam Call Stack me fans jaaye (jaise while(true) 
 *   loop ya heavy computation), to:
 * 
 *   1. Event Loop BLOCK ho jaata hai (Stack empty nahi ho raha!).
 *   2. Queue me pending tasks WAIT karte rehte hain.
 *   3. Browser ka rendering engine PAINT nahi kar paata.
 *   4. DOM Events (click, scroll) handle nahi hote — QUEUE me pada rehta hai.
 *   5. Result: Website FREEZE ho jaati hai!
 * 
 * SOLUTION:
 * - Heavy kaam ko chhote chunks me todo (setTimeout ya requestIdleCallback se).
 * - Web Workers use karo (alag thread me heavy computation chalao).
 * - React me: React Fiber / Concurrent Mode isi problem ko solve karta hai 
 *   (rendering ko chunks me todta hai).
 */


/**
 * ========================================================================
 * 10. WEB WORKERS (Multi-Threading in JS!)
 * ========================================================================
 * NOTES:
 * - JS single-threaded hai, par agar bahut HEAVY computation karni ho to?
 * - WEB WORKERS: Ek naya background thread bana sakte ho!
 * - Is thread ka APNA alag Call Stack aur Event Loop hota hai.
 * - Main thread pe koi load nahi aata — UI smooth chalti hai!
 * 
 * RULES:
 * - Worker DOM access NAHI kar sakta (no document, no window).
 * - Main thread aur worker postMessage() se baat karte hain.
 * - Data COPY hoke jaata hai (by value, not reference).
 * 
 * Node.js me: worker_threads module use hota hai (same concept).
 */


/**
 * ========================================================================
 * 11. EVENT LOOP STARVATION (Microtask Trap!)
 * ========================================================================
 * NOTES:
 * - Agar Microtask ke andar naya Microtask banta rahe → Event Loop WAHI FASA RAHEGA!
 * - Macrotasks (setTimeout) KABHI nahi chalenge kyunki Microtask queue kabhi 
 *   EMPTY hi nahi hogi!
 * - Isko "Event Loop Starvation" kehte hain.
 * - Ye ek DANGEROUS pattern hai — avoid karo!
 */

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


/**
 * ========================================================================
 * 12. INTERVIEW EXERCISES — Output Guess Karo!
 * ========================================================================
 * NOTES:
 * - Ye exercises run karne se PEHLE khud guess karo. 
 * - Phir check karo. Galat ho to dobara section 4 padho.
 */

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


/**
 * ========================================================================
 * 13. QUEUE NAMES — INTERVIEW TERMINOLOGY
 * ========================================================================
 * NOTES:
 * - Interviewers ALAG-ALAG naamon se puchte hain. Ye sab SAME cheez hain:
 * 
 * MACROTASK QUEUE ke doosre naam:
 * - Callback Queue
 * - Task Queue
 * - Message Queue
 * - Event Queue
 * 
 * MICROTASK QUEUE ke doosre naam:
 * - Job Queue (ECMAScript spec me ye naam use hota hai)
 * - Promise Job Queue
 * 
 * (Dono Event Loop ka hi hissa hain — bas PRIORITY ka farak hai.
 *  Microtask/Job Queue HAMESHA Macrotask/Callback Queue se pehle chalti hai.)
 */


/*
========================================================================
FINAL REVISION TABLE — EVENT LOOP CHEAT SHEET
========================================================================

| Component         | Kya hai?                                               |
|-------------------|--------------------------------------------------------|
| Call Stack        | Jahan JS code execute hota hai (LIFO, single thread)   |
| Web APIs          | setTimeout, fetch, DOM events (browser provide karta)  |
| Microtask Queue   | Promises, queueMicrotask, nextTick (HIGH priority)     |
| Macrotask Queue   | setTimeout, setInterval, DOM events (LOW priority)     |
| Event Loop        | Bridge — Queue se Stack pe tasks bhejta hai jab empty  |

| Rule              | Detail                                                 |
|-------------------|--------------------------------------------------------|
| Step 1            | Saara SYNC code pehle chalao                           |
| Step 2            | PURI Microtask Queue drain karo                        |
| Step 3            | SIRF 1 Macrotask uthao                                 |
| Step 4            | Wapas Step 2 (Microtask check repeat)                  |

| Priority          | Kya?                           | Type                |
|-------------------|--------------------------------|---------------------|
| 1 (Highest)       | Sync Code                      | Call Stack          |
| 2                 | process.nextTick (Node.js)     | Super VIP Microtask |
| 3                 | Promise .then / queueMicrotask | Microtask           |
| 4                 | requestAnimationFrame          | Before Paint        |
| 5                 | setTimeout / setInterval       | Macrotask           |
| 6                 | setImmediate (Node.js)         | Check Phase         |
| 7 (Lowest)        | requestIdleCallback            | Idle time           |

========================================================================
SHORTCUT:
Sync >>> nextTick >>> Promise >>> rAF >>> setTimeout >>> setImmediate >>> rIC
========================================================================
*/
