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
 * - Promise executor — `new Promise` ka executor synchronously run hota hai.
 * - Rejected chain — catch se normal value return karo toh chain fulfilled ho sakti hai.
 * - Finally — cleanup ke liye; throw/rejected Promise original outcome replace kar sakti hai.
 */

'use strict';


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


// const fs = require('fs');
// const { promisify } = require('util');
//
// const readFilePromise = promisify(fs.readFile);
// const writeFilePromise = promisify(fs.writeFile);
//
// readFilePromise('./file.txt', 'utf-8')
//     .then(data => writeFilePromise('./copy.txt', data))
//     .catch(err => console.log(err));


async function runTask() {
    try {
        await wait(0.1);
        return 'Task done';
    } catch (err) {
        throw err;
    }
}

runTask().then(result => console.log(result));


async function getNumber() {
    return 42;
}

getNumber().then(num => console.log(num));


// (async () => {
//     try {
//         const data = await readFilePromise('./file.txt', 'utf-8');
//         console.log(data);
//     } catch (err) {
//         console.log(err.message);
//     }
// })();


async function loadThreeThings() {
    const [a, b, c] = await Promise.all([
        Promise.resolve('A'),
        Promise.resolve('B'),
        Promise.resolve('C')
    ]);

    return `${a}-${b}-${c}`;
}

loadThreeThings().then(console.log);


const catchAsyncExample = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

console.log(typeof catchAsyncExample);
