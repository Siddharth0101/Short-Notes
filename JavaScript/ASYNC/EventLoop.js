'use strict';

/**
 * ========================================================================
 * 1. SYNCHRONOUS VS ASYNCHRONOUS (Basic Introduction)
 * ========================================================================
 * NOTES:
 * - JavaScript ek "Single-Threaded" language hai. Iska matlab ye ek waqt pe sirf ek hi kaam kar sakti hai.
 * - Iske paas apna sirf ek "Call Stack" hota hai (Main thread).
 * 
 * - SYNCHRONOUS: Code line-by-line execute hota hai. Jab tak ek kaam pura nahi hota, agla start nahi hota (Blocking).
 * - ASYNCHRONOUS: Code rukta nahi hai, background mein chala jata hai aur aage ka code chalta rehta hai (Non-Blocking).
 */

console.log("1. Sync execution starts"); // Sync
setTimeout(() => console.log("2. Async execution completed (Macrotask)"), 0); // Async
Promise.resolve().then(() => console.log("3. Async execution completed (Microtask)")); // Async
console.log("4. Sync execution ends"); // Sync

// OUTPUT: 1, 4, 3, 2 (Reason aage samjhenge)


/**
 * ========================================================================
 * 2. THE EVENT LOOP & JS ARCHITECTURE 
 * ========================================================================
 * INTERVIEW QUESTION: "How does JS handle Async tasks if it's Single Threaded?"
 * ANSWER: JS does it with the help of the "Browser" (or Node.js Runtime) environment!
 * 
 * 1. Call Stack: Yahan actual JS code run hota hai (LIFO - Last In First Out).
 * 2. Web APIs (or Node C++ APIs): setTimeout, DOM API, fetch, geolocation - JS inko browser/Node se udhaar (borrow) leta hai. Inka timer/kaam Call Stack ke bahar background me chalta hai.
 * 3. Task Queues: Jab Web APIs apna kaam poora kar leti hain, toh wo apna callback functions ek Queue me bhej deti hain.
 * 4. EVENT LOOP: Iska ek hi kaam hai - Constantly monitor Call Stack & Task Queues.
 *    - Agar Call Stack EMPTY hai, toh wo Queue me se naya task Call Stack me bhej deta hai.
 */


/**
 * ========================================================================
 * 3. MACROTASK QUEUE vs MICROTASK QUEUE (The Priority Game)
 * ========================================================================
 * NOTES:
 * Do tarah ki queues hoti hain. Microtask ki priority jyada hoti hai.
 * 
 * A. MICROTASK QUEUE (High Priority VIP Queue) ⭐
 * - Yahan VIP kaam aate hain. 
 * - Examples: 
 *   1. Promises (.then / .catch / .finally)
 *   2. queueMicrotask()
 *   3. MutationObserver
 *   4. process.nextTick (Node.js - Iski sabse highest priority hoti hai Microtask me bhi!)
 * 
 * B. MACROTASK QUEUE (Also called Callback/Task Queue - Low Priority)
 * - Yahan normal async kaam aate hain.
 * - Examples:
 *   1. setTimeout()
 *   2. setInterval()
 *   3. setImmediate() (Node.js)
 *   4. DOM Events (click, load)
 * 
 * RULE OF EVENT LOOP: 
 * 1. Pura Sync code chalao.
 * 2. Microtask Queue check karo -> Saare microtasks khatam karo.
 * 3. Macrotask Queue me se bas 1 macrotask uthao aur chalao.
 * 4. Phir wapas Microtask queue check karo! 
 * (Yani 1 macrotask chalne ke baad dobara microtasks check hote hain).
 */


/**
 * ========================================================================
 * 4. NODE.JS SPECIFICS (process.nextTick vs setImmediate)
 * ========================================================================
 * NOTES:
 * - Browser mein 'process.nextTick' nahi milta, ye Node.js backend ka feature hai.
 * 
 * 1. process.nextTick(): 
 *    - Iski priority sabse highest hai.
 *    - Event Loop ke kisi agle phase me jane se pehle, ye sabse pehle run hoga.
 *    - Promieses se bhi pehle chalta hai ye! (Microtask queue ke andar bhi VIP hai).
 * 
 * 2. setImmediate():
 *    - Ye Macrotask hota hai, par ye Node.js ke EVENT LOOP PHASES se juda hai.
 * 
 *    🧠 NODE.JS EVENT LOOP PHASES (Simpified):
 *    Node.js ka Event Loop in phases me ghoomta hai (Top to Bottom):
 *      a) Timers Phase: yahan setTimeout aur setInterval ke callbacks chalte hain.
 *      b) Poll Phase (I/O): yahan socket network requests, file reading (fs.readFile) jaisi I/O operations ke callbacks chalte hain.
 *      c) Check Phase: YAHAN 'setImmediate' WALAY CALLBACKS chalte hain.
 *      d) Close Callbacks: jaise socket.on('close').
 * 
 *    ❓ setTimeout(..., 0) vs setImmediate() ki Race Condition:
 *    - Agar aap in dono ko basic top-level code (global scope) me chalaoge, toh output
 *      UNPREDICTABLE hota hai (koi bhi pehle chal sakta hai). Kyun? Kyunki Machine 
 *      ki performance aur Timer ki minimal delay (Node me ~1ms) pe depend karta hai.
 *      Agar Timer set ho gaya Call Stack khali hone se pehle, to Timers Phase pehle chalega.
 *      Nahi hua toh sidha agla Event Loop ka phase (Check Phase) chal padega isliye setImmediate jeet jayega.
 * 
 *    ✅ LIKEN I/O CYCLES MEIN: (Example: fs.readFile me)
 *    - Jab aap 'fs.readFile' jaise I/O operation ke andar hote ho, tab File Read hoke aapke liye Poll phase me uska callback run ho raha hota hai.
 *    - Poll phase ke directly BAAD hamesha "Check Phase" aata hai!
 *    - Isliye I/O operation ke andar 'setImmediate' ka Check Phase turant mil jata hai, aur 'setTimeout' wale Time Phase ke liye usko ghoom  ke doosra aana padta hai. So yaha I/O me hamesha setImmediate jeetega.
 */


/**
 * ========================================================================
 * 5. BROWSER SPECIFICS & ADVANCED CONCEPTS
 * ========================================================================
 * NOTES:
 * 1. requestAnimationFrame (rAF): (Browser Only)
 *    - Ye browser ko batata hai ki aap ek animation karna chahte ho.
 *    - Browser agli screen repaint/reflow karne se THEEK PEHLE is function ko chalata hai.
 *    - Priority: Saare Microtasks khatam hone ke TEHK BAAD, par Screen Paint karne se pehle ye chalta hai. 
 * 
 * 2. queueMicrotask(fn):
 *    - Agar aapko koi function explicitly Microtask me daalna hai, toh Promise.resolve().then() ke
 *      bajaye aap `queueMicrotask(() => {})` use kar sakte ho. Ye standard aur clean approach hai.
 * 
 * 3. async / await (Under the hood):
 *    - 'await' ke pehle tak ka code SYNCHRONOUSLY chalta hai.
 *    - Jaise hi JS engine 'await' dekhta hai, wo function udhar hi pause kar deta hai, aur function ka bacha 
 *      hua agla hissa ek ".then()" (Microtask Queue) ke roop me enqueue kar deta hai.
 *    - Call Stack block nahi hota, Event Loop aage ke kaam nikalne lagta hai.
 * 
 * 4. Web Workers / Worker Threads:
 *    - JS single-threaded hai, magar agar aapko bahut bhari computation karni ho toh aap background
 *      me naya thread (Web Worker / worker_thread) bana sakte ho.
 *    - In naye threads ka APNA khud ka bilkul alag Event Loop aur Call Stack hota hai! Main thread pr inka ko load nhi aata.
 * 
 * 5. requestIdleCallback() (Browser Only)
 *    - Ye macrotask se bhi LOW priority ka kaam karta hai.
 *    - Browser kehta hai "Jab main poora free huanga, Call Stack aur saari Queues khali hongi, tab aap jo 
 *      background analytic logs (low priority tasks) nikalna chahte ho wo chalaoonga".
 * 
 * 6. UI FREEZE KYUN HOTA HAI? (Important Interview Question!)
 *    - Agar aapka ek while(true) loop Call Stack me fans gaya (koi lamba Sync task), toh Event Loop wahan atak jata hai.
 *    - JS Event loop block hone ke kaaran Browser ka Rendering engine "Paint" phase me nahi ja pata (kyunki ek hi thread handle karta hai).
 *    - Nateeja (Result): Website bilkul freeze/hang ho jati hai, button click kaam kyu nahi karta? Kyunki DOM events naye Macrotasks banake Queue me jama karte rehte hain, magar Event Loop atka hua wait kar raha hota hai un tasks ko stack me uthane ke liye.
 * 
 * 7. MessageChannel Hack (React Fiber/Scheduler uses this!):
 *    - Browser me agar aap multiple baar andar-andar 'setTimeout(..., 0)' call karwaye, toh HTML5 spec ke tahat 
 *      browser automatically usko ~4ms ka minimum lag dedeta hai battery/CPU bachane ke liye.
 *    - React jaise libraries ko exactly "0ms delay" wala Macrotask start karna tha taaki screen yield ho sake fast-rendering ke liye bina lag ke.
 *    - Toh unhone hack nikaala: 'MessageChannel' (postMessage API)! Ye ek true '0 delayed' Macrotask queue banati hai browser environment me!
 */


/**
 * ========================================================================
 * 6. EXECUTION ORDER/PRIORITY (Ratta Maar Lo 🧠)
 * ========================================================================
 * Sabse pehle kya chalega uski list:
 * 
 * 1. Synchronous Code (Call Stack)
 * 2. process.nextTick (Node.js only - Super VIP Microtask)
 * 3. Promises & queueMicrotask (Normal Microtasks)
 * 4. requestAnimationFrame (Browser only - Paint se pehle)
 * 5. setTimeout, setInterval (Macrotasks/Timers)
 * 6. setImmediate (Node.js Check phase)
 * 7. requestIdleCallback (Browser only - Lowest Priority when Idle)
 */


/**
 * ========================================================================
 * 7. EXAMPLES FOR PRACTICE (Interview Puzzles)
 * ========================================================================
 * In examples ko console me run karne se pehle khud guess karo!
 */

// ---------------------------------------------------------
// EXERCISE 1: Sync, Microtask, Macrotask (Basic)
// ---------------------------------------------------------
console.log("\n--- EXERCISE 1 ---");
console.log("A");

setTimeout(() => {
    console.log("B"); // Macrotask
}, 0);

Promise.resolve().then(() => {
    console.log("C"); // Microtask
});

console.log("D");

// GUESS EX1: A, D, C, B
// WHY: 
// 1. Sync: A
// 2. setTimeout goes to Web API.
// 3. Promise goes to Microtask.
// 4. Sync: D
// 5. Stack Empty -> Event Loop checks Microtask -> C
// 6. Microtask Empty -> Event Loop takes from Macrotask -> B


// ---------------------------------------------------------
// EXERCISE 2: Nested Promises & Timers 
// ---------------------------------------------------------
console.log("\n--- EXERCISE 2 ---");

setTimeout(() => {
    console.log("1 (Macrotask)");
    Promise.resolve().then(() => {
        console.log("2 (Microtask created inside Macrotask)");
    });
}, 0);

Promise.resolve().then(() => {
    console.log("3 (Microtask)");
    setTimeout(() => {
        console.log("4 (Macrotask created inside Microtask)");
    }, 0);
});

// GUESS EX2: 3, 1, 2, 4
// WHY:
// - Round 1: Sync empty. 3 goes to Micro, 1 goes to Macro.
// - Event Loop runs Microtask queue -> prints 3. Abhi ek naya setTimeout(4) call hua jo Macro queue k end me lag gaya.
// - Queue status: Macro=[1, 4], Micro=[]
// - Event Loop picks 1 Macrotask -> prints 1. Isne ek naya Promise banaya jo Micro me gaya.
// - RULE: Macrotask k baad Microtask check karo.
// - Queue status: Macro=[4], Micro=[2] -> runs 2. prints 2.
// - Micro empty, Macro se nikalta hai 4 -> prints 4.


// ---------------------------------------------------------
// EXERCISE 3: process.nextTick vs Promise (Node JS Interview Favorite)
// Note: Agar aap isko browser me chalaoge toh process.nextTick pe error aayega. 
// Ye mainly Node JS environments ke liye hai.
// ---------------------------------------------------------
console.log("\n--- EXERCISE 3 (Node.js Environment) ---");
/* Uncomment and run in Node.js to see:
Promise.resolve().then(() => console.log("Promise 1"));
process.nextTick(() => console.log("nextTick 1"));
setTimeout(() => console.log("setTimeout 1"), 0);
process.nextTick(() => console.log("nextTick 2"));
Promise.resolve().then(() => console.log("Promise 2"));

// GUESS EX3: nextTick 1, nextTick 2, Promise 1, Promise 2, setTimeout 1
// WHY: nextTick VIP hai! Uski queue Promises ki microtask queue se bhi upar hoti hai Node me.
*/
console.log("Check Source Code for Code Example of process.nextTick");


// ---------------------------------------------------------
// EXERCISE 4: Infinite Microtask loop (Starving Macrotasks)
// ---------------------------------------------------------
console.log("\n--- EXERCISE 4 (Starvation Concept) ---");
// DHYAN DEIN: Agar microtasks ek dusre ko continuously banate rahein, 
// toh Event Loop wahi fasa rahega aur Macrotask (setTimeout) kabhi nahi chalega!
// Isko "Event Loop Starvation" kehte hain.

function runInfiniteMicrotasks() {
    let count = 0;
    const loop = () => {
        if(count === 10) return; // Safey ke liye 10 pe rok diya, varna infinite ho jayega
        // console.log("Microtask Executed:", count);
        count++;
        Promise.resolve().then(loop); 
    }
    loop();
}

/** 
setTimeout(() => console.log("Main Timeout - Intezaar kar raha hoon!"), 0);
runInfiniteMicrotasks(); 
// Ye setTimeout tab tak nahi chalega jab tak saare microtasks (10 baar) khatam nahi ho jate.
*/
console.log("Starvation example logic is in code comments.");


// ---------------------------------------------------------
// EXERCISE 5: setTimeout vs setImmediate race in I/O (Node.js) 🤯
// ---------------------------------------------------------
console.log("\n--- EXERCISE 5 (Node Event Loop Phases) ---");
/* Uncomment and run in Node.js to see:
const fs = require('fs');

// Scenario 1: Top Level (UNPREDICTABLE / RACE)
// Yaha koi bhi jeet sakta hai
setTimeout(() => console.log("Top Level: setTimeout"));
setImmediate(() => console.log("Top Level: setImmediate"));

// Scenario 2: Inside I/O Cycle (ALWAYS PREDICTABLE)
fs.readFile(__filename, () => {
    // Ye code Poll phase me chal raha hai.
    setTimeout(() => console.log("Inside I/O: setTimeout"));
    setImmediate(() => console.log("Inside I/O: setImmediate"));
});

// EXPLANATION:
// readFile callback Node.js Event Loop ke "Poll Phase" me execute hota hai.
// Poll Phase khatam hone ke theek baad hamesha "Check Phase" aata hai jismein setImmediate chalta hai.
// Aur "Timers Phase" ko chalne ke liye loop ko pura circle kaat kar vapas top par jana hoga.
// Isliye "Inside I/O: setImmediate" hamesha pehle aata hai!
*/
console.log("Check Source Code for setTimeout vs setImmediate in I/O phase concept");


// ---------------------------------------------------------
// EXERCISE 6: Async/Await Under the hood (Microtask Queue)
// ---------------------------------------------------------
console.log("\n--- EXERCISE 6 (Async/Await) ---");
console.log("Start");

async function asyncFunc() {
    console.log("Inside Async: Aadhi line (Sync)");
    // Yahan function PAUSE hoga, aur agla part Microtask me jayega
    await Promise.resolve(); 
    console.log("Inside Async: 'await' ke baad (Microtask)");
}

asyncFunc();
console.log("End");

// GUESS EX6: Start, Inside Async: Aadhi line (Sync), End, Inside Async: 'await' ke baad (Microtask)
// WHY: 
// 1. "Start" print hua.
// 2. asyncFunc() call hua. Iske andar ka pehla print Synchronous hota hai, so "Aadhi line (Sync)" print hua.
// 3. Jaise hi `await` mila, function yield (pause) hua aur bacha hua code Microtask queue me gaya.
// 4. Thread bahar aagaya aur "End" print hua.
// 5. Call stack empty -> Event Loop goes to Microtask Queue -> prints "await ke baad".


/**
 * ========================================================================
 * FINAL REVISION TABLE 📝
 * ========================================================================
 * | Queue/Task       | Examples                                  | Priority (1 = Highest) |
 * |------------------|-------------------------------------------|-------------------------|
 * | Sync Call Stack  | normal code (console.log, loops)          | 1 (Blocks everything)   |
 * | nextTick Queue   | process.nextTick() (Node.js only)         | 2 (VIP Microtask)       |
 * | Microtask Queue  | Promises (.then/.catch), queueMicrotask   | 3 (Normal Microtask)    |
 * | Animation Frame  | requestAnimationFrame (Browser)           | 4 (Before Repaint)      |
 * | Macrotask Queue  | setTimeout, setInterval, DOM Events       | 5 (Callback Queue)      |
 * | Check Phase      | setImmediate (Node.js only)               | 6 (Runs after polling)  |
 * | Idle Callback    | requestIdleCallback (Browser)             | 7 (Lowest priority)     |
 * ========================================================================
 */

// Ek final mast trick yaad rakhne ke liye:
// Sync >>> nextTick >>> Promise >>> rAF (Browser) >>> setTimeout/setInterval/setImmediate >>> rIC (Idle)
