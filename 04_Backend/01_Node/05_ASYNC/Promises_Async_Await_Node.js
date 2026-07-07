'use strict';

/**
 * ========================================================================
 * ASYNCHRONOUS JAVASCRIPT IN NODE - PROMISES AND ASYNC/AWAIT [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Node callbacks se start hua, modern Node promises/async-await prefer karta hai.
 * - Async flow clean rakho warna callback hell ban jata hai.
 */


/**
 * ========================================================================
 * 1. CALLBACK HELL
 * ========================================================================
 * NOTES:
 * - Jab callback ke andar callback ke andar callback ho.
 * - Error handling repeat hoti hai.
 * - Code read and maintain karna tough hota hai.
 */

// fs.readFile('./dog.txt', 'utf-8', (err, data) => {
//     if (err) return console.log(err);
//     request(`https://dog.ceo/api/breed/${data}/images/random`, (err2, res, body) => {
//         if (err2) return console.log(err2);
//         fs.writeFile('./dog-img.txt', body, err3 => {
//             if (err3) return console.log(err3);
//             console.log('Random dog image saved');
//         });
//     });
// });


/**
 * ========================================================================
 * 2. PROMISE BASICS
 * ========================================================================
 * NOTES:
 * - Promise future value represent karta hai.
 * - States: pending, fulfilled, rejected.
 * - .then success, .catch error, .finally always.
 */

const wait = seconds => new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
});

wait(1)
    .then(() => {
        console.log('Waited 1 second');
        return wait(1);
    })
    .then(() => console.log('Waited 2 seconds total'))
    .catch(err => console.log(err.message));


/**
 * ========================================================================
 * 3. PROMISIFYING NODE CALLBACKS
 * ========================================================================
 * NOTES:
 * - Old Node APIs callback based hain.
 * - util.promisify callback API ko promise API bana sakta hai.
 * - fs.promises directly available hai.
 */

// const fs = require('fs');
// const { promisify } = require('util');
//
// const readFilePromise = promisify(fs.readFile);
// const writeFilePromise = promisify(fs.writeFile);
//
// readFilePromise('./file.txt', 'utf-8')
//     .then(data => writeFilePromise('./copy.txt', data))
//     .catch(err => console.log(err));


/**
 * ========================================================================
 * 4. ASYNC / AWAIT
 * ========================================================================
 * NOTES:
 * - async function always promise return karta hai.
 * - await promise settle hone tak function ko pause karta hai.
 * - Call stack block nahi hota.
 * - Error handling ke liye try/catch use karo.
 */

async function runTask() {
    try {
        await wait(0.1);
        return 'Task done';
    } catch (err) {
        throw err;
    }
}

runTask().then(result => console.log(result));


/**
 * ========================================================================
 * 5. RETURNING VALUES FROM ASYNC FUNCTIONS
 * ========================================================================
 * NOTES:
 * - async function ka return value promise me wrapped hota hai.
 * - Caller ko await ya .then use karna padega.
 */

async function getNumber() {
    return 42;
}

getNumber().then(num => console.log(num));


/**
 * ========================================================================
 * 6. TOP-LEVEL ASYNC WITH IIFE
 * ========================================================================
 * NOTES:
 * - CommonJS me old style top-level await nahi hota tha.
 * - Async IIFE use karke immediate async code run karte hain.
 */

// (async () => {
//     try {
//         const data = await readFilePromise('./file.txt', 'utf-8');
//         console.log(data);
//     } catch (err) {
//         console.log(err.message);
//     }
// })();


/**
 * ========================================================================
 * 7. PROMISE.ALL
 * ========================================================================
 * NOTES:
 * - Independent async tasks parallel run karne ke liye Promise.all.
 * - Agar ek promise reject hua, Promise.all reject ho jata hai.
 * - Sequential await slow ho sakta hai if tasks independent hain.
 */

async function loadThreeThings() {
    const [a, b, c] = await Promise.all([
        Promise.resolve('A'),
        Promise.resolve('B'),
        Promise.resolve('C')
    ]);

    return `${a}-${b}-${c}`;
}

loadThreeThings().then(console.log);


/**
 * ========================================================================
 * 8. PROMISE COMBINATORS
 * ========================================================================
 * Promise.all        -> all fulfill, one reject fails all.
 * Promise.allSettled -> all complete, success/failure both collect.
 * Promise.race       -> first settled result.
 * Promise.any        -> first fulfilled result, ignores rejects until all reject.
 */


/**
 * ========================================================================
 * 9. ASYNC ERROR RULES
 * ========================================================================
 * NOTES:
 * - Await ke errors try/catch me catch hote hain.
 * - Express async controllers me try/catch repeat avoid karne ke liye catchAsync.
 * - Unhandled promise rejection process crash kar sakta hai in production.
 */

const catchAsyncExample = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

console.log(typeof catchAsyncExample);


/**
 * ========================================================================
 * 10. WHEN TO USE WHAT
 * ========================================================================
 * Callback       -> event listeners, legacy APIs.
 * Promise chain  -> simple pipeline, library returns promises.
 * async/await    -> most controller/business logic.
 * Promise.all    -> independent tasks in parallel.
 * Streams        -> large continuous data.
 */
