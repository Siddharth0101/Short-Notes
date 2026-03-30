'use strict';

/**
 * ========================================================================
 * 1. INTRODUCTION: WHAT IS A PROMISE? (Real Life Analogy)
 * ========================================================================
 * NOTES:
 * - REAL LIFE EXAMPLE: Aap ek restaurant me jate ho aur "Burger" order karte ho.
 *   - Cashier aapko paise lene ke baad ek "Receipt/Token" deta hai. 
 *   - Ye Token ek "PROMISE" hai ki thodi der me aapko burger mil jayega.
 *   - Ab aap Token le kar apna dusra kaam kar sakte ho (Async/Non-blocking).
 *   - Burger ban gaya -> Token gives you Burger (Promise Fulfilled).
 *   - Burger bun khatam ho gaya -> Bhaisaab paise wapis lelo (Promise Rejected).
 * 
 * - JAVASCRIPT MEIN: Promise ek object hai jo kisi future value (data ya error) 
 *   ko represent karta hai jab koi asynchronous kaam (jaise fetching data) hota hai.
 */


/**
 * ========================================================================
 * 2. THE 3 LIFECYCLE STATES OF A PROMISE 🚦
 * ========================================================================
 * Ek promise humesha sirf in 3 me se kisi ek hi state mein hota hai:
 * 
 * 1. PENDING: Jab aapne request bhej di hai par abhi tak result nahi aaya. (Intezaar mein).
 * 2. FULFILLED (Resolved): Jab request successfully puri ho gayi aur aapko data mil gaya.
 * 3. REJECTED: Jab request fail ho gayi (E.g. Network error, Server crash).
 * 
 * * RULE: Ek baar promise settle ho gaya (fulfilled ya rejected par aagya), toh uski state 
 * hamesha ke liye lock ho jati hai. (Aap resolved promise ko dobara reject nahi kar sakte).
 */


/**
 * ========================================================================
 * 3. CREATING A NEW PROMISE (Under the Hood)
 * ========================================================================
 * NOTES:
 * - "new Promise" ek executor function leta hai jiske andar 2 "Callbacks" hote hain: 
 *   (resolve, reject).
 */

console.log("--- 3. CREATING A PROMISE (Burger Order) ---");
const myBurgerPromise = new Promise((resolve, reject) => {
    // 🚨 INTERVIEW TRICK: Ye executor function ka code SYNCHRONOUSLY chalta hai seedha Call Stack me!
    let isBurgerReady = true;

    // Asynchronous kaam simulate kar rahe hain (1 seccode baad reply aayega)
    setTimeout(() => {
        if (isBurgerReady) {
            resolve("🍔 Burger Mil Gaya Bhai!"); // State -> Fulfilled
        } else {
            reject(new Error("⚠️ Sorry buns khatam ho gaye.")); // State -> Rejected
        }
    }, 1000);
});


/**
 * ========================================================================
 * 4. CONSUMING A PROMISE (.then(), .catch(), .finally())
 * ========================================================================
 * Jab hume kisi Promise ka result (ya error) nikalkar process karna hota hai, toh hum consumers use karte hain.
 */

// console.log("\n--- 4. CONSUMING A PROMISE ---"); // Uncomment karke outputs explore kariye
myBurgerPromise
    .then((result) => {
        // Ye tab chalta hai jab Promise 'Resolved/Fulfilled' hota hai.
        // console.log("SUCCESS:", result);
    })
    .catch((error) => {
        // Ye tab chalta hai jab Promise 'Rejected' hota hai.
        // console.error("FAIL:", error.message);
    })
    .finally(() => {
        // Ye humesha chalta hai, chahe request pass ho ya fail! 
        // (Sirf Cleanup ke liye best hai, jaise loading spinner (loader) ko hide karna).
        // console.log("INFO: Order slip discard kar do, kaam pura ho gaya.");
    });


/**
 * ========================================================================
 * 5. PROMISE CHAINING & THE "RETURN" RULE ⛓️
 * ========================================================================
 * INTERVIEW RULE: Har baar jab aap '.then()' chalate ho, toh wo BY DEFAULT backend me ek NAYA 
 * Promise return karta hai. Agar aap kuch Custom Data waps return karoge, toh wo string/object agle '.then()' ko argument banke milega.
 */

/* 
fetch('https://jsonplaceholder.typicode.com/users/1') // Returns Promise<Response>
    .then((response) => {
        // response.json() bhi ek async operation hai toh ye bhi naya Promise return karta hai.
        return response.json(); 
    })
    .then((data) => {
        // Yahan 'data' purane .then() k resolved nikal ke aaya hai.
        console.log(`User ka naam: ${data.name}`);
        return "Custom String Return"; // Hum direct text/object return karskte hain Next chain line k liye!
    })
    .then((str) => {
        console.log(`Last then got: ${str}`);
    })
    .catch((err) => {
        // Chain mein KAHIN BHI error aaye (fetch me ya even beech ke kisi .then me code phatay), 
        // yeh single catch saara handle kar lega!
        console.error("Fetch Data Failed:", err.message);
    });
*/


/**
 * ========================================================================
 * 6. MODERN SYNTAX: ASYNC / AWAIT (The Beautiful Way) ✨
 * ========================================================================
 * - Normal Promises me lambi lambi ".then .then" aake "Callback Hell" wale din waps yaad dila sakti hain.
 * - ES8 (2017) mein 'async / await' aaya, jo exactly promises hi backend me use karta hai, bas likhne aur
 *   padhne me ye Synchronous (Seedha) lagte hain. Isko syntactic sugar kehte hain.
 * 
 * * RULES FOR ASYNC/AWAIT:
 * 1. 'await' keyword hamesha sirf ek function jiske peeche 'async' laga ho, wahi use ho sakta hai.
 * 2. 'async' keyword wale functions by-default apni return-value ko automatically ek Promise me wrap kardete hain.
 * 3. 'await' Event Loop ko ye signal deta hai: "Yahan function ko thodi der Pause (yield) kar do jab tak ye API se response result leke/fail hoke nahi aata. 
 *    Par dhayan rahein 'Main Thread (Call Stack)' ko block mat karna". Wo baaki code handle kar leta hai!
 */

// console.log("\n--- 6. ASYNC / AWAIT SYNTAX ---");
const fetchUserData = async () => {
    try {
        // console.log("1. Fetching user info...");
        
        // Code yahan pause ho jayega (function execution yields), Event loop apna baaki website ka UI ka kaam karega
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1'); 
        
        if (!response.ok) throw new Error("HTTP Status issue tha API down thi!");
        
        const data = await response.json(); 
        // console.log("2. Todo title received:", data.title);
        
        return data; // Ye secretly -> resolve(data) me automatically convert ho jayega!
    } catch (err) {
        // Error handling in Async/Await: Hum hamesha standard TRY/CATCH blocks ko use karte hain Promise ki tarah .catch() nahi lagate hain!
        console.error("3. Something went wrong:", err.message);
    }
};

// fetchUserData();


/**
 * ========================================================================
 * 7. THE INTERVIEW FAVORITE: PROMISE COMBINATORS (Parallel Async Execution) 🚀
 * ========================================================================
 * Kya ho jab aapko apne home page pe 5 alag alag API (Jaise User Info + Sidebar feed + Weather vagera) 
 * ek hi sath parallel chalani hon warna page slow hojayega? Aap Combinators use karte ho (Concurrency).
 */

console.log("\n--- 7. PROMISE COMBINATORS IN ACTION ---");

// Teen Timeout based synthetic (dummy) promises banate hain samajhne k liye:
const p1 = new Promise((resolve) => setTimeout(() => resolve("P1_Pass"), 2000));
const p2 = new Promise((resolve, reject) => setTimeout(() => reject("P2_Fail"), 1500));
const p3 = new Promise((resolve) => setTimeout(() => resolve("P3_Pass"), 3000));

/**
 * A. Promise.all([p1, p2, ...]) => "ALL OR NOTHING"
 * - Saare promises ke successfully complete hone ka wait karega.
 * - Output: Ek Array jisme sequence mein sabka results [result1, result2] ho.
 * - ☠️ KILLED BY REJECTION: Agar ek array me se koi 1 BHI FAIL ho gaya toh poora "Promise.all" process fail mardeta hai furti main aur baki walo ka intezar bhi nai krta. (Short-circuit principle).
 */
Promise.all([p1, p3]) // Sirf Pass hone waalay list diye hain (2sec + 3sec)
    .then(res => console.log("Promise.all [p1,p3] Result:", res)) // -> Arrays: ["P1_Pass", "P3_Pass"] (3 Seconds me total complete hojaega)
    .catch(err => console.log("Promise.all Error:", err));

// Fail wala scenario -> Test krne k lye uncomment karo
// Promise.all([p1, p2, p3])
//     .catch(err => console.log("Promise.all FAILED because:", err)); // Ye turant 1.5 seconds me phat kar 'P2_Fail' output dedega.


/**
 * B. Promise.allSettled([p1, p2, ...]) => "THE FORGIVING FRIEND" (Modern - ES2020)
 * - Isse matter nai karta kon pas hua kon fail, ye saare promises ka END tak wait karega status check krne k lie.
 * - Result me ye ek special Object array me return karta hai (Ex: {status: 'fulfilled', value:..}). Best fit jab ap chahte hain User feed pass ho par Weather panel error de uske kharab API k chalte UI hang na ho.
 */
Promise.allSettled([p1, p2, p3]).then(res => {
    // console.log("\nPromise.allSettled Output Array:", res); 
    // Isme hume error control flow '.catch' krne zaroorat bht kam padti h kyu k error fail list me milta hai res data ki jaga
});


/**
 * C. Promise.race([p1, p2, ...]) => "FIRST ONE WINS (Resolve ho ya Reject farq nahi padta)"
 * - Jo sabse PEHLE time constraint khatam hoga array ki list me se, wahi final result banega!!
 * - Agar pehla wala FAIL hogya fast load ho kr toooverall result REJECTED nikalle ga.
 * - Use case: Request Timeouts! (E.g. "Main TimeoutTimeout(5sec)" vs Actual "Fetch API". Jo pehle hit hua result uska!)
 */
Promise.race([p1, p2, p3])
    // P1=(2s) | P2=(1.5s) | P3=(3s). 
    .then(res => console.log("Promise.race Result:", res))
    .catch(err => console.log("Promise.race ERROR kyunki P2 First place per speed mai aaya:", err)); // Output: P2_Fail


/**
 * D. Promise.any([p1, p2, ...]) => "FIRST SUCCESSFUL WINS API" (ES2021)
 * - 'race' ki tarah pehle wale ko chun-ta hai LAKIN isey sirf "FULFILLED (Pass)" data se matlab hai fail list wale se nahi.
 * - Yahan hamara "p2(fail- 1.5sec)" fail hoga par Any aage badhega speed se pass result "p1_pass (2sec)" talash ke display krega.
 * - Agar saare hi promises fail ho jaate hain to ye ek list fekta hai jise 'AggregateError: All promises rejected' kehte hai.
 */
Promise.any([p1, p2, p3])
    .then(res => console.log("Promise.any Result (P1 jeeta passing line mai):", res)) // Output: P1_Pass 
    .catch(err => console.log("Promise.any ERROR:", err));


/**
 * ========================================================================
 * 8. ADVANCED JS CONCEPTS: PROMISIFICATION & SHORTCUTS 🛠️
 * ========================================================================
 * 
 * A) PROMISIFICATION (Callbacks ko Promise me badalna)
 * - Pehle ke zamaane ke JS functions (jaise setTimeout, fs.readFile) Promises use nahi karte the, 
 *   wo Callbacks use karte the (Callback Hell ban jate the).
 * - Hum unhe manually ek `new Promise` constructor me wrap karke modern Promise/Async-Await 
 *   me convert kar sakte hain! Isey "Promisification" kehte hain.
 */

// Example: setTimeout ko Promisify karna
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ab hum setTimeout ko magically `await` ke saath use kar sakte hain!
// await wait(2000); -> (Sirf async func k andar chalega)


/**
 * B) PROMISE.RESOLVE() & PROMISE.REJECT() SHORTCUTS
 * - Agar aapko bina constructor logic ke fatak se ek resolve/reject hua promise chahiye 
 *   toh aap ine direct methods ka use karte ho. Zyadatar Testing (mocks) ya specific if-else me use hote hain.
 */
// const quickPass = Promise.resolve("Instant Success Value");
// quickPass.then(val => console.log(val));

// const quickFail = Promise.reject(new Error("Instant Crash"));
// quickFail.catch(err => console.log(err.message));


/**
 * C) THE UNHANDLED REJECTION ERROR ⚠️
 * - Kya ho agar aapne api block ka `.catch()` lagana hi bhool gaya? 
 * - Output: Aapko console pe ek lal error milega: "Uncaught (in promise) Error". 
 * - IMPORTANT: Node.js me agar aesa hua, toh aage chalkar poora application Crash ho sakta hai! 
 * - Isliye `.catch()` lagana ya try-catch block lagana bhalaai ka kaam hota hai.
 */


/**
 * ========================================================================
 * 9. COMMON INTERVIEW PUZZLE (Promises vs Call Stack Sync)
 * ========================================================================
 * Interviewer apka logic test krte hue output guess karwane k lie logic deta hai. (Mixes of Event Loop priority concepts).
 */

/*
console.log("Start");

const myPromise = new Promise((resolve) => {
    // NOTE: Log body wala part normal func ki trah synchronously call stack me push hota hai
    console.log("Inside Promise Executor"); 
    resolve("Data"); // Data Micro task queue ki list me bhej dia gaya execute hote huye!
});

// Fir normal queue stack free check kiya gya MicroTask se bhi upr
myPromise.then((res) => console.log(`Inside then (Microtask receive: ${res})`)); 

console.log("End");

// ANSWER: 
// OUPUT: 
// 1. "Start"
// 2. "Inside Promise Executor"
// 3. "End"
// 4. "Inside then (Microtask receive: Data)"
*/


/**
 * ========================================================================
 * FINAL REVISION TABLE 📝 (PROMISES CHEATSHEET)
 * ========================================================================
 * | Concept          | Short Description                                    |
 * |------------------|------------------------------------------------------|
 * | Basic Definition | Ek Future value laakar daine wala javascript Object wada. |
 * | the 3 States     | Pending (Intezaar), Fulfilled (Pass), Rejected (Fail).|
 * | .then()          | Data successful hoke aane tk handle kre. (Returns NEW promise)|
 * | .catch()         | Chain me upr kahin per bhi Error aa gaya to handle kre. |
 * | .finally()       | Done loading. (Pass ho yea Fail - Ye method function hamesha End pe chalta).|
 * | async / await    | Syntactic sugar. async return=promise | await = pauses scope body.|
 * | Promise.all()    | Wait ALL completion. Aggr eik fail = Pure process REJECTED.|
 * | Promise.allSettled()| Wait ALL limitlessly! Output = Har api promise status+value List. |
 * | Promise.race()   | The Sprint run! First finish fast Result, wo chae REJECT yea PASS.|
 * | Promise.any()    | First SUCCESS! Failures ignoring. Failures at end "AggregateError". |
 * ========================================================================
 */
