'use strict';

/**
 * ========================================================================
 * NODE.JS, NPM, CORE MODULES - COMPLETE SHORT NOTES
 * ========================================================================
 * NOTES:
 * - Node.js browser ke bahar JavaScript run karne ka runtime hai.
 * - Node V8 engine use karta hai, plus extra APIs deta hai: fs, http, path, url.
 * - Backend me Node ka biggest strength: non-blocking I/O.
 */


/**
 * ========================================================================
 * 1. WHAT IS NODE.JS?
 * ========================================================================
 * NOTES:
 * - Node.js = JavaScript runtime built on V8 engine.
 * - Browser me DOM APIs hote hain; Node me server APIs hote hain.
 * - Node ka use: API, web server, CLI tools, scripts, real-time apps.
 *
 * WHY NODE?
 * - Same language frontend + backend.
 * - Fast I/O heavy apps.
 * - Huge NPM ecosystem.
 * - Great for REST APIs, streaming, chat, dashboards.
 *
 * NOT BEST FOR:
 * - Heavy CPU computation directly on main thread.
 * - Video encoding, huge image processing, ML training without worker setup.
 */


/**
 * ========================================================================
 * 2. RUNNING JS OUTSIDE BROWSER
 * ========================================================================
 * NOTES:
 * - node file.js -> JS file run.
 * - node         -> REPL start.
 * - .exit        -> REPL exit.
 * - node -v      -> version check.
 *
 * GLOBALS:
 * - __dirname    -> current folder path.
 * - __filename   -> current file path.
 * - process      -> running Node process info.
 * - global       -> Node global object.
 *
 * BROWSER ONLY:
 * - window, document, localStorage, alert.
 */


/**
 * ========================================================================
 * 3. CORE MODULES
 * ========================================================================
 * NOTES:
 * - Core modules Node ke saath built-in aate hain.
 * - Install karne ki zaroorat nahi.
 *
 * IMPORTANT CORE MODULES:
 * - fs     -> files read/write.
 * - http   -> web server create.
 * - url    -> URL parse.
 * - path   -> safe file paths.
 * - events -> event emitter.
 * - crypto -> hashing, encryption utilities.
 */

// CommonJS import style used in Jonas course:
const fs = require('fs');
const http = require('http');
const path = require('path');

console.log(path.join(__dirname, 'data', 'input.txt'));


/**
 * ========================================================================
 * 4. READING AND WRITING FILES
 * ========================================================================
 * NOTES:
 * - Synchronous methods block karte hain.
 * - Asynchronous methods callback ke through result dete hain.
 * - Server code me async I/O prefer karo.
 */

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


/**
 * ========================================================================
 * 5. BLOCKING VS NON-BLOCKING
 * ========================================================================
 * NOTES:
 * - Blocking = current thread stuck, next code wait karega.
 * - Non-blocking = task background me, Node next request handle kar sakta hai.
 * - Node single thread pe user code chalata hai, isliye blocking avoid karo.
 *
 * BAD IN SERVER:
 * - fs.readFileSync inside route.
 * - huge loop.
 * - sync crypto repeatedly.
 *
 * GOOD:
 * - fs.readFile / promises.
 * - async DB queries.
 * - streams for big files.
 */


/**
 * ========================================================================
 * 6. SIMPLE WEB SERVER WITH HTTP MODULE
 * ========================================================================
 * NOTES:
 * - http.createServer callback har request pe run hota hai.
 * - req = incoming request.
 * - res = outgoing response.
 */

// const server = http.createServer((req, res) => {
//     res.end('Hello from Node server');
// });
//
// server.listen(8000, '127.0.0.1', () => {
//     console.log('Listening on port 8000');
// });


/**
 * ========================================================================
 * 7. BASIC ROUTING WITHOUT EXPRESS
 * ========================================================================
 * NOTES:
 * - req.url se path milta hai.
 * - Real apps me manual routing messy ho jata hai; Express use hota hai.
 */

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


/**
 * ========================================================================
 * 8. SIMPLE API USING JSON FILE
 * ========================================================================
 * NOTES:
 * - JSON API me response content-type application/json hota hai.
 * - Data ko once top-level pe read kar sakte ho if file small/static hai.
 */

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// const products = JSON.parse(data);
//
// if (req.url === '/api') {
//     res.writeHead(200, { 'Content-type': 'application/json' });
//     res.end(JSON.stringify(products));
// }


/**
 * ========================================================================
 * 9. HTML TEMPLATING BASICS
 * ========================================================================
 * NOTES:
 * - Template = HTML with placeholders.
 * - Server data fill karke final HTML send karta hai.
 * - Express + Pug later is the professional version.
 */

function replaceTemplate(template, product) {
    return template
        .replace(/{%PRODUCTNAME%}/g, product.productName)
        .replace(/{%PRICE%}/g, product.price)
        .replace(/{%FROM%}/g, product.from);
}

console.log(replaceTemplate('Name: {%PRODUCTNAME%}', { productName: 'Avocado', price: 10, from: 'Spain' }));


/**
 * ========================================================================
 * 10. URL VARIABLES / QUERY STRINGS
 * ========================================================================
 * NOTES:
 * - /product?id=2 -> pathname = /product, query.id = 2
 * - Modern Node me URL class use kar sakte ho.
 */

// const myUrl = new URL(req.url, `http://${req.headers.host}`);
// const pathname = myUrl.pathname;
// const id = myUrl.searchParams.get('id');


/**
 * ========================================================================
 * 11. OUR OWN MODULES
 * ========================================================================
 * NOTES:
 * - Har file Node me module hoti hai.
 * - module.exports se value export hoti hai.
 * - require() se import hota hai.
 */

// module file:
// module.exports = function add(a, b) {
//     return a + b;
// };
//
// main file:
// const add = require('./add');
// console.log(add(2, 3));


/**
 * ========================================================================
 * 12. NPM AND PACKAGE.JSON
 * ========================================================================
 * NOTES:
 * - npm init -> package.json create.
 * - npm install slugify -> dependency install.
 * - npm install nodemon --save-dev -> dev dependency.
 * - npm scripts repeat commands easy bana dete hain.
 *
 * package.json:
 * - dependencies: production packages.
 * - devDependencies: development tools.
 * - scripts: commands like start, dev, lint.
 */

// Example scripts:
// {
//   "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   }
// }


/**
 * ========================================================================
 * 13. LOCAL VS GLOBAL PACKAGES
 * ========================================================================
 * NOTES:
 * - Local install project ke node_modules me hota hai.
 * - Global install system-wide CLI command ke liye hota hai.
 * - Most project packages local rakho.
 *
 * COMMANDS:
 * - npm i package
 * - npm i package@version
 * - npm i package --save-dev
 * - npm uninstall package
 * - npm outdated
 * - npm update package
 */


/**
 * ========================================================================
 * 14. SEMANTIC VERSIONING
 * ========================================================================
 * NOTES:
 * - Version format: MAJOR.MINOR.PATCH
 * - PATCH: bug fix, safe.
 * - MINOR: new features, usually backward compatible.
 * - MAJOR: breaking changes.
 *
 * PREFIX:
 * - ^1.2.3 -> allow minor/patch updates, not major.
 * - ~1.2.3 -> allow patch updates only.
 * - 1.2.3  -> exact version.
 */


/**
 * ========================================================================
 * 15. PRETTIER / FORMATTING
 * ========================================================================
 * NOTES:
 * - Formatting ka decision tool ko do.
 * - Team me consistent code style important hai.
 * - Backend code me readable indentation, semicolons style, quote style consistent rakho.
 */
