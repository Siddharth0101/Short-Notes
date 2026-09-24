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
 * - npm — packages/scripts; package.json dependencies aur commands define karta hai.
 * - Lockfile — resolved dependency versions pin karo.
 * - Core modules — fs files, path paths, http server aur events event handling.
 * - EventEmitter — emit listeners call karta hai; listener cleanup aur error events handle karo.
 * - Sync API — request path par expensive synchronous I/O event loop block kar sakti hai.
 * - Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
 * - CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.
 */

'use strict';


// CommonJS import style used in Jonas course:
const fs = require('fs');
const http = require('http');
const path = require('path');

console.log(path.join(__dirname, 'data', 'input.txt'));


// SYNC: code yahin rukega until file read complete.
// const input = fs.readFileSync('./txt/input.txt', 'utf-8');
// fs.writeFileSync('./txt/output.txt', `Data: ${input}`);

// ASYNC: file background me read hogi, callback baad me chalega.
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if (err) return console.log('File read error');
//     fs.writeFile('./txt/final.txt', data, 'utf-8', err2 => {
//         if (err2) return console.log('File write error');
//         console.log('File written');
//     });
// });


// const server = http.createServer((req, res) => {
//     res.end('Hello from Node server');
// });
//
// server.listen(8000, '127.0.0.1', () => {
//     console.log('Listening on port 8000');
// });


// const server = http.createServer((req, res) => {
//     const pathname = req.url;
//
//     if (pathname === '/' || pathname === '/overview') {
//         res.end('Overview page');
//     } else if (pathname === '/api') {
//         res.writeHead(200, { 'Content-type': 'application/json' });
//         res.end(JSON.stringify({ status: 'success' }));
//     } else {
//         res.writeHead(404, { 'Content-type': 'text/html' });
//         res.end('<h1>Page not found</h1>');
//     }
// });


// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// const products = JSON.parse(data);
//
// if (req.url === '/api') {
//     res.writeHead(200, { 'Content-type': 'application/json' });
//     res.end(JSON.stringify(products));
// }


function replaceTemplate(template, product) {
    return template
        .replace(/{%PRODUCTNAME%}/g, product.productName)
        .replace(/{%PRICE%}/g, product.price)
        .replace(/{%FROM%}/g, product.from);
}

console.log(replaceTemplate('Name: {%PRODUCTNAME%}', { productName: 'Avocado', price: 10, from: 'Spain' }));


// const myUrl = new URL(req.url, `http://${req.headers.host}`);
// const pathname = myUrl.pathname;
// const id = myUrl.searchParams.get('id');


// module file:
// module.exports = function add(a, b) {
//     return a + b;
// };
//
// main file:
// const add = require('./add');
// console.log(add(2, 3));


// Example scripts:
// {
//   "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   }
// }
