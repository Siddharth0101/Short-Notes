'use strict';

/**
 * ========================================================================
 * PROMISES IN JAVASCRIPT — COMPLETE GUIDE
 * ========================================================================
 * NOTES:
 * - Promise ek OBJECT hai jo kisi FUTURE VALUE ko represent karta hai.
 * - Jab koi async kaam hota hai (API call, file read, timer), to uska result 
 *   ABHI nahi milega — BAAD ME milega. Promise us future result ka "WADA" hai.
 * 
 * REAL LIFE ANALOGY:
 * - Aap restaurant me jaake "Burger" order karte ho.
 * - Cashier aapko paise lene ke baad ek TOKEN/RECEIPT deta hai.
 * - Ye Token ek PROMISE hai — "Thodi der me burger milega."
 * - Ab aap token le ke DOOSRA kaam kar sakte ho (non-blocking!).
 * - Burger ban gaya → Token redeem → Burger mil gaya! (FULFILLED)
 * - Bun khatam ho gaya → "Sorry bhai, refund lo!" (REJECTED)
 * - Jab tak burger ban raha hai → Aap intezaar me ho (PENDING)
 */


/**
 * ========================================================================
 * 1. THE 3 STATES OF A PROMISE
 * ========================================================================
 * NOTES:
 * - Ek Promise HAMESHA sirf IN 3 me se kisi EK state me hota hai:
 * 
 * 1. PENDING   → Intezaar me hai, result nahi aaya abhi.
 * 2. FULFILLED → Success! Data mil gaya (resolve se).
 * 3. REJECTED  → Fail! Error aa gaya (reject se).
 * 
 * RULES:
 * - Ek baar settle ho gaya (Fulfilled/Rejected) → state LOCK. Change nahi hogi.
 * - Resolved ko reject nahi, rejected ko resolve nahi kar sakte.
 */


/**
 * ========================================================================
 * 2. CREATING A PROMISE (new Promise)
 * ========================================================================
 * NOTES:
 * - new Promise() ek "executor" function leta hai.
 * - Executor ke andar 2 callbacks: resolve (success) aur reject (failure).
 * 
 * INTERVIEW TRICK:
 * - Executor function SYNCHRONOUSLY chalta hai! Seedha Call Stack me!
 * - Sirf .then/.catch ke callbacks MICROTASK queue me jaate hain.
 */

console.log("--- CREATING A PROMISE ---");

const burgerOrder = new Promise((resolve, reject) => {
    console.log("Order placed! Burger ban raha hai..."); // SYNC — turant chalega!
    
    let isBurgerReady = true;
    
    setTimeout(() => {
        if (isBurgerReady) {
            resolve("Burger mil gaya!");
        } else {
            reject(new Error("Sorry, buns khatam!"));
        }
    }, 1000);
});


/**
 * ========================================================================
 * 3. CONSUMING A PROMISE (.then, .catch, .finally)
 * ========================================================================
 * NOTES:
 * - .then(callback)    → Jab promise FULFILLED ho (success)
 * - .catch(callback)   → Jab promise REJECTED ho (error)
 * - .finally(callback) → HAMESHA chale, chahe success ho ya fail
 */

burgerOrder
    .then((result) => {
        console.log("SUCCESS:", result);
    })
    .catch((error) => {
        console.error("FAIL:", error.message);
    })
    .finally(() => {
        console.log("Order process complete (finally).");
    });


/**
 * ========================================================================
 * 4. PROMISE CHAINING (.then ke baad .then)
 * ========================================================================
 * NOTES:
 * - Har .then() ek NAYA Promise return karta hai.
 * - Agar .then() me kuch RETURN karo → next .then() ko milega.
 * - Agar return nahi kiya → next .then() ko undefined milega.
 * - .catch() chain me UPAR ki SAARI errors pakadta hai (error propagation).
 * 
 * CALLBACK HELL (Purana ugly tarika):
 *   getData(url, (data) => {
 *     getUser(data.id, (user) => {
 *       getPosts(user.id, (posts) => { });  // Pyramid of Doom!
 *     });
 *   });
 * 
 * PROMISE CHAIN (Modern clean tarika):
 *   getData(url)
 *     .then(data => getUser(data.id))
 *     .then(user => getPosts(user.id))
 *     .then(posts => console.log(posts))
 *     .catch(err => console.error(err));
 */

// EXAMPLE:
const fetchUser = new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, name: "Sidd" }), 500);
});

fetchUser
    .then((user) => {
        console.log("User:", user.name);
        return user.id;
    })
    .then((userId) => {
        console.log("User ID:", userId);
        return `Fetching posts for user ${userId}...`;
    })
    .then((message) => {
        console.log(message);
    })
    .catch((err) => {
        console.error("Error:", err.message);
    });


/**
 * ========================================================================
 * 5. ERROR HANDLING — Catch ka Behaviour
 * ========================================================================
 * NOTES:
 * - .catch() chain me upar ki SAARI errors handle karta hai (bubble up).
 * - .catch() ke BAAD bhi .then() laga sakte ho (recovery chain).
 * - HAMESHA .catch() lagao! Warna "Unhandled Promise Rejection" → Node.js CRASH!
 */

// Error propagation + recovery:
Promise.resolve("Start")
    .then(() => { throw new Error("Toot gaya!"); })
    .then(() => console.log("Ye SKIP hoga"))
    .catch((err) => {
        console.error("Caught:", err.message);
        return "Recovered!";
    })
    .then((val) => console.log(val));  // "Recovered!" — chain resume!


/**
 * ========================================================================
 * 6. ASYNC / AWAIT — The Modern Way
 * ========================================================================
 * NOTES:
 * - ES2017 me aaya. Promises ka SYNTACTIC SUGAR — internally same hai!
 * - Likhne me synchronous LAGTA hai par async kaam karta hai.
 * 
 * RULES:
 * 1. 'await' sirf 'async' function ke ANDAR use ho sakta hai.
 * 2. 'async' function HAMESHA Promise return karta hai.
 * 3. 'await' function PAUSE karta hai, par Call Stack BLOCK nahi hota!
 * 4. Error handling: try/catch use karo (.catch nahi).
 * 
 * UNDER THE HOOD:
 *   async function foo() {
 *     const x = await somePromise;  // function pause
 *     console.log(x);               // ye secretly .then() ban jaata hai
 *   }
 */

const fetchData = async () => {
    try {
        console.log("Fetching...");
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        if (!response.ok) throw new Error("API fail!");
        const data = await response.json();
        console.log("Data:", data.title);
        return data;  // Secretly → Promise.resolve(data)
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        console.log("Fetch attempt complete.");
    }
};
// fetchData();  // Uncomment to test


/**
 * ========================================================================
 * 7. PROMISE COMBINATORS — Parallel Execution
 * ========================================================================
 * NOTES:
 * - Multiple async kaam PARALLEL me chalane ke 4 tarike hain:
 */

const fast   = new Promise((res) => setTimeout(() => res("Fast 1s"), 1000));
const medium = new Promise((res) => setTimeout(() => res("Medium 2s"), 2000));
const slow   = new Promise((res) => setTimeout(() => res("Slow 3s"), 3000));
const failed = new Promise((_, rej) => setTimeout(() => rej("Failed 1.5s"), 1500));

/**
 * A) Promise.all() — "SAB PASS HO TAB HI RESULT, EK FAIL = SAB FAIL"
 *    - Saare pass → result array. Ek fail → turant REJECT (short circuit).
 *    USE: Jab SAARE data chahiye (user + posts + settings).
 */
Promise.all([fast, medium, slow])
    .then((res) => console.log("all:", res))   // ["Fast 1s", "Medium 2s", "Slow 3s"]
    .catch((err) => console.log("all fail:", err));

/**
 * B) Promise.allSettled() — "SABKA RESULT DO, PASS YA FAIL DONO" (ES2020)
 *    - SAARE settle hone ka wait. KABHI reject nahi hota.
 *    - Har element: {status:'fulfilled', value:..} ya {status:'rejected', reason:..}
 *    USE: Dashboard — 1 widget fail? Baaki 4 to dikhao!
 */
Promise.allSettled([fast, failed, slow])
    .then((res) => console.log("allSettled:", res.map(r => r.status)));

/**
 * C) Promise.race() — "JO PEHLE SETTLE HO (PASS/FAIL) WAHI RESULT"
 *    - Sabse fast wala jeetega. Agar pehla fail → result fail.
 *    USE: Request TIMEOUT! "5 sec me response nahi → timeout!"
 */
Promise.race([fast, failed])
    .then((res) => console.log("race:", res))     // fast(1s) jeetega
    .catch((err) => console.log("race fail:", err));

/**
 * D) Promise.any() — "PEHLA SUCCESS CHAHIYE, FAIL IGNORE" (ES2021)
 *    - Pehla PASS milte hi result. Failures skip.
 *    - SAB fail → AggregateError.
 *    USE: Multiple CDN se download — jo pehle de de!
 */
Promise.any([failed, fast, slow])
    .then((res) => console.log("any:", res))    // fast(1s) — pehla success
    .catch((err) => console.log("any fail:", err));


/*
========================================================================
COMBINATORS COMPARISON TABLE
========================================================================
| Combinator        | Complete kab?              | Reject kab?                  |
|-------------------|----------------------------|------------------------------|
| Promise.all()     | SAB success ho             | EK BHI fail ho (short circuit)|
| Promise.allSettled| SAB settle ho (pass+fail)  | KABHI nahi                   |
| Promise.race()    | PEHLA settle ho (koi bhi)  | Agar pehla fail ho           |
| Promise.any()     | PEHLA success ho           | SAB fail ho (AggregateError) |
========================================================================
*/


/**
 * ========================================================================
 * 8. PROMISIFICATION & SHORTCUTS
 * ========================================================================
 * NOTES:
 * - Purane callback-based functions ko Promise me wrap karna = PROMISIFICATION.
 */

// setTimeout ko Promisify:
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Usage: await wait(2000);  → 2 second wait

// Instant Promise shortcuts:
const quickPass = Promise.resolve("Instant Success");
const quickFail = Promise.reject(new Error("Instant Fail"));


/**
 * ========================================================================
 * 9. COMMON MISTAKES — YE MAT KARO!
 * ========================================================================
 * 
 * 1. .catch() BHOOLNA → Unhandled Rejection → Node.js CRASH!
 *    GOOD: .then().catch()  ya  try/catch with await
 * 
 * 2. .then() me RETURN bhoolna → next .then() ko undefined milega!
 *    BAD:  .then(res => { res.json(); })     // return BHOOL gaye!
 *    GOOD: .then(res => { return res.json(); })
 * 
 * 3. Unnecessary NESTING → Callback Hell wapas!
 *    BAD:  .then(a => { return getB(a).then(b => { ... }) })
 *    GOOD: .then(a => getB(a)).then(b => ...)
 * 
 * 4. async me .then() + await MIX karna
 *    BAD:  const data = await fetch('/api').then(res => res.json());
 *    GOOD: const res = await fetch('/api');
 *          const data = await res.json();
 */


/**
 * ========================================================================
 * 10. INTERVIEW PUZZLE — Output Guess Karo!
 * ========================================================================
 */

console.log("\n--- INTERVIEW PUZZLE ---");
console.log("Start");

const testPromise = new Promise((resolve) => {
    console.log("Inside Promise Executor");  // SYNC!
    resolve("Data");
});

testPromise.then((res) => console.log("Then:", res));  // Microtask
console.log("End");

// ANSWER: Start → Inside Promise Executor → End → Then: Data
// KEY: Executor SYNC hai! Sirf .then() microtask me jaata hai.


/*
========================================================================
FINAL REVISION TABLE — PROMISES CHEAT SHEET
========================================================================

| Concept              | Short Description                                     |
|----------------------|-------------------------------------------------------|
| Promise              | Future value ka WADA (async result represent karta)   |
| 3 States             | Pending → Fulfilled (pass) ya Rejected (fail)         |
| Executor             | SYNCHRONOUSLY chalta hai (Call Stack me turant)        |
| .then()              | Success handle, naya Promise return karta hai          |
| .catch()             | Error handle, chain me kahin bhi error pakadta hai     |
| .finally()           | Hamesha chale (cleanup)                                |
| Chaining             | .then().then() — flat chain, nest mat karo             |
| async/await          | Syntactic sugar. async = Promise return. await = pause |
| try/catch            | async/await me error handling                          |
| Promise.all()        | Sab pass → array. Ek fail → sab fail!                 |
| Promise.allSettled() | Sab settle ka wait. Kabhi reject nahi                  |
| Promise.race()       | Pehla settle (pass/fail) = result                     |
| Promise.any()        | Pehla SUCCESS = result. Fail ignore                    |
| Promisification      | Callback function ko Promise me wrap karna             |

========================================================================
*/
