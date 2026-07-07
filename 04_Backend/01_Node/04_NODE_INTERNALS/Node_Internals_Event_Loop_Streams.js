'use strict';

/**
 * ========================================================================
 * NODE INTERNALS - EVENT LOOP, STREAMS, MODULES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Ye section interview aur real performance dono ke liye important hai.
 * - Node fast isliye feel hota hai because I/O kaam non-blocking style me karta hai.
 */


/**
 * ========================================================================
 * 1. NODE ARCHITECTURE
 * ========================================================================
 * NOTES:
 * - V8: JavaScript execute karta hai.
 * - libuv: event loop, thread pool, async I/O handle karta hai.
 * - C++ bindings: JS code ko low-level system APIs se connect karte hain.
 *
 * SIMPLE FLOW:
 * JS code -> Node APIs -> C++ bindings/libuv -> OS
 */


/**
 * ========================================================================
 * 2. PROCESS, THREADS, THREAD POOL
 * ========================================================================
 * NOTES:
 * - Node process me main thread hota hai jahan JS execute hota hai.
 * - libuv thread pool heavy async tasks handle kar sakta hai.
 * - Default thread pool size: 4.
 *
 * THREAD POOL TASKS:
 * - fs operations.
 * - crypto operations.
 * - compression.
 * - DNS lookup.
 *
 * TIP:
 * - Thread pool size UV_THREADPOOL_SIZE env var se badal sakte ho, but blindly nahi.
 */


/**
 * ========================================================================
 * 3. EVENT LOOP OVERVIEW
 * ========================================================================
 * NOTES:
 * - Event loop callbacks ko schedule and execute karta hai.
 * - Heavy code se event loop block hoga to server slow ho jayega.
 *
 * PHASES SIMPLIFIED:
 * - Timers: setTimeout, setInterval callbacks.
 * - I/O callbacks: completed I/O callbacks.
 * - Poll: new I/O events retrieve.
 * - Check: setImmediate callbacks.
 * - Close callbacks: socket close events.
 *
 * MICROTASKS:
 * - process.nextTick queue.
 * - Promise microtask queue.
 * - These usually run before next event loop phase continues.
 */

setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

// Usually sync first, then nextTick, then Promise, then timers/immediate order depends on context.
console.log('sync');


/**
 * ========================================================================
 * 4. EVENT LOOP IN PRACTICE
 * ========================================================================
 * NOTES:
 * - Top-level setTimeout vs setImmediate order can vary.
 * - Inside I/O callback, setImmediate usually runs before setTimeout(0).
 * - process.nextTick has very high priority; overuse can starve event loop.
 */

// fs.readFile('./file.txt', () => {
//     setTimeout(() => console.log('Timer inside I/O'), 0);
//     setImmediate(() => console.log('Immediate inside I/O'));
//     process.nextTick(() => console.log('nextTick inside I/O'));
// });


/**
 * ========================================================================
 * 5. EVENT-DRIVEN ARCHITECTURE
 * ========================================================================
 * NOTES:
 * - Node me many things events emit karte hain.
 * - EventEmitter observer pattern follow karta hai.
 * - Emitter event announce karta hai, listeners react karte hain.
 */

const EventEmitter = require('events');

const sales = new EventEmitter();

sales.on('newSale', () => {
    console.log('New sale happened');
});

sales.on('newSale', stock => {
    console.log(`${stock} items left`);
});

sales.emit('newSale', 9);


/**
 * ========================================================================
 * 6. SERVER IS ALSO EVENT EMITTER
 * ========================================================================
 * NOTES:
 * - http server request event emit karta hai.
 * - createServer callback actually request listener hai.
 */

// const server = http.createServer();
//
// server.on('request', (req, res) => {
//     res.end('Request received');
// });


/**
 * ========================================================================
 * 7. STREAMS
 * ========================================================================
 * NOTES:
 * - Streams data ko chunks me process karte hain.
 * - Large files ke liye memory efficient.
 * - Buffer poora data memory me load karta hai; stream thoda-thoda.
 *
 * TYPES:
 * - Readable  -> read data.
 * - Writable  -> write data.
 * - Duplex    -> read + write.
 * - Transform -> read + transform + write.
 */


/**
 * ========================================================================
 * 8. READING FILE WITH STREAM
 * ========================================================================
 * NOTES:
 * - read stream data events emit karta hai.
 * - Better: pipe use karo to backpressure handle ho.
 */

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


/**
 * ========================================================================
 * 9. PIPE AND BACKPRESSURE
 * ========================================================================
 * NOTES:
 * - readable.pipe(writable) clean and efficient.
 * - Backpressure: writable slow ho to readable speed control hoti hai.
 */

// const readable = fs.createReadStream('./big-file.txt');
// readable.pipe(res);


/**
 * ========================================================================
 * 10. HOW REQUIRE WORKS
 * ========================================================================
 * NOTES:
 * - require() module load karta hai.
 * - Steps:
 *   1. Resolve path.
 *   2. Load file.
 *   3. Wrap in function.
 *   4. Execute.
 *   5. Return module.exports.
 *   6. Cache module.
 *
 * WRAPPER:
 * (function(exports, require, module, __filename, __dirname) { code })
 */


/**
 * ========================================================================
 * 11. EXPORT PATTERNS
 * ========================================================================
 * NOTES:
 * - module.exports = single value/function/class.
 * - exports.name = named exports.
 * - Do not assign exports = something directly; module.exports use karo.
 */

// Single export:
// module.exports = Calculator;
//
// Named exports:
// exports.add = (a, b) => a + b;
// exports.multiply = (a, b) => a * b;


/**
 * ========================================================================
 * 12. MODULE CACHING
 * ========================================================================
 * NOTES:
 * - Same module ko baar-baar require karne par code usually once execute hota hai.
 * - Exports cached value se milte hain.
 * - Useful for singleton-like shared modules.
 */
