/**
 * ## Quick revision
 *
 * - Sequential await — next kaam previous result par depend kare tab.
 * - `Promise.all` — sab successful chahiye; ek reject toh reject, baaki auto-cancel nahi.
 * - `allSettled` — har operation ka success/failure collect karo.
 * - `race` — pehla settled result; `any` — pehla fulfilled result.
 * - Timeout — race timeout underlying request cancel nahi karta; abort alag karo.
 * - Concurrency limit — ek saath bounded requests; server ko flood mat karo.
 * - Retry — transient failures par backoff + jitter; total attempts/deadline bounded rakho.
 * - Idempotency — retry se duplicate side effect na bane.
 * - Stale response — old request ko latest state overwrite na karne do.
 * - Async iteration — `for...of` + await sequential; async `forEach` completion wait nahi karta.
 * - Async generator — `async function*` values ko gradually yield; `for await...of` se consume.
 * - Error ownership — fire-and-forget task ki rejection explicitly handle karo.
 * - Request dedupe — same in-flight read share karo; different auth/query keys ko mix mat karo.
 */

'use strict';


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


// Error propagation + recovery:
Promise.resolve("Start")
    .then(() => { throw new Error("Toot gaya!"); })
    .then(() => console.log("Ye SKIP hoga"))
    .catch((err) => {
        console.error("Caught:", err.message);
        return "Recovered!";
    })
    .then((val) => console.log(val));  // "Recovered!" — chain resume!


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


const fast   = new Promise((res) => setTimeout(() => res("Fast 1s"), 1000));
const medium = new Promise((res) => setTimeout(() => res("Medium 2s"), 2000));
const slow   = new Promise((res) => setTimeout(() => res("Slow 3s"), 3000));
const failed = new Promise((_, rej) => setTimeout(() => rej("Failed 1.5s"), 1500));

Promise.all([fast, medium, slow])
    .then((res) => console.log("all:", res))   // ["Fast 1s", "Medium 2s", "Slow 3s"]
    .catch((err) => console.log("all fail:", err));

Promise.allSettled([fast, failed, slow])
    .then((res) => console.log("allSettled:", res.map(r => r.status)));

Promise.race([fast, failed])
    .then((res) => console.log("race:", res))     // fast(1s) jeetega
    .catch((err) => console.log("race fail:", err));

Promise.any([failed, fast, slow])
    .then((res) => console.log("any:", res))    // fast(1s) — pehla success
    .catch((err) => console.log("any fail:", err));


// setTimeout ko Promisify:
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Usage: await wait(2000);  → 2 second wait

// Instant Promise shortcuts:
const quickPass = Promise.resolve("Instant Success");
const quickFail = Promise.reject(new Error("Instant Fail"));


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
