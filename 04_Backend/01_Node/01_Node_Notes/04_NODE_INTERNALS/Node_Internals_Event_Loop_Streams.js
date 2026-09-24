/**
 * ## Quick revision
 *
 * - Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
 * - Event loop — callbacks schedule; worker pool aur OS kuch async work handle karte hain.
 * - HTTP — method, URL, headers aur body se request; status/headers/body se response.
 * - Module — ESM `import/export`; CommonJS `require/module.exports`.
 * - Stream — chunks mein data; poori file memory mein lena zaroori nahi.
 * - Backpressure — slow consumer ho toh producer ko slow/pause karo.
 * - Buffer — binary bytes; text decode karte waqt encoding sahi rakho.
 * - Environment — config validate karo; secrets client/logs mein leak mat karo.
 * - libuv — event loop aur worker pool support; har async I/O pool par nahi hoti.
 * - Worker threads — CPU-heavy JS parallel; message transfer/shared-memory rules chahiye.
 * - Stream types — readable, writable, duplex, transform.
 * - Pipeline — backpressure, errors aur cleanup coordinate karo.
 * - Node scheduling — nextTick, Promise aur timer order execution context se affect hota hai.
 * - EventEmitter — listeners synchronous call ho sakte hain; emit ko automatic async mat samjho.
 * - Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
 * - CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.
 */

'use strict';


setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

// Usually sync first, then nextTick, then Promise, then timers/immediate order depends on context.
console.log('sync');


// fs.readFile('./file.txt', () => {
//     setTimeout(() => console.log('Timer inside I/O'), 0);
//     setImmediate(() => console.log('Immediate inside I/O'));
//     process.nextTick(() => console.log('nextTick inside I/O'));
// });


const EventEmitter = require('events');

const sales = new EventEmitter();

sales.on('newSale', () => {
    console.log('New sale happened');
});

sales.on('newSale', stock => {
    console.log(`${stock} items left`);
});

sales.emit('newSale', 9);


// const server = http.createServer();
//
// server.on('request', (req, res) => {
//     res.end('Request received');
// });


// const server = http.createServer((req, res) => {
//     const readable = fs.createReadStream('./big-file.txt');
//
//     readable.on('data', chunk => {
//         res.write(chunk);
//     });
//
//     readable.on('end', () => {
//         res.end();
//     });
//
//     readable.on('error', err => {
//         res.statusCode = 500;
//         res.end('File not found');
//     });
// });


// const readable = fs.createReadStream('./big-file.txt');
// readable.pipe(res);


// Single export:
// module.exports = Calculator;
//
// Named exports:
// exports.add = (a, b) => a + b;
// exports.multiply = (a, b) => a * b;
