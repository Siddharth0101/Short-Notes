'use strict';

/**
 * ========================================================================
 * MODULES, TOOLING & MODERN JS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka last theory section: ES6 modules, bundling, transpiling.
 *
 * MODERN BUILD PIPELINE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Development          │  Build Process (Bundler)           │
 * │  ───────────          │  ───────────────────────           │
 * │  Modules (import/exp) ├──→ Bundling (Merge files)          │
 * │  Uncompiled ES6+      ├──→ Transpiling (Babel -> ES5)       │
 * │  Assets               ├──→ Polyfilling (Core-js)           │
 * │                       └──→ Minification (Remove whitespace)│
 * │                                     │                      │
 * │                                     ▼                      │
 * │                              Production Bundle (dist/bundle.js)│
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. MODULES OVERVIEW
 * ========================================================================
 * NOTES:
 * - Module = reusable piece of code that encapsulates implementation details.
 * - Module usually ek standalone file hota hai.
 *
 * WHY MODULES?
 * - Abstraction: internal detail hide, public API expose.
 * - Organization: code split into logical files.
 * - Encapsulation: variables private by default.
 * - Reusability: import same module in multiple files.
 *
 * JS MODULE SYSTEMS:
 * - ES6 Modules (ESM):  import/export. Browser + Node. STANDARD.
 * - CommonJS (CJS):     require/module.exports. Node.js traditional.
 * - AMD:                define/require. Older, browser. Mostly dead.
 */


/**
 * ========================================================================
 * 2. ES6 MODULES (ESM) — import / export
 * ========================================================================
 * NOTES:
 * - File me `type="module"` HTML script tag me likhna padta hai.
 * - Strict mode by default (no need for 'use strict').
 * - Top-level `this` = undefined (not window).
 * - Imports hoisted hote hain (top pe move hote hain).
 * - LIVE CONNECTION: import ki value export me change ho toh import bhi update.
 *
 * EXECUTION ORDER:
 * - Importing module PEHLE execute hota hai.
 * - Ek module sirf EK BAAR execute hota hai (cached after first import).
 */

// ──── shoppingCart.js (exporting module) ────
// NAMED EXPORTS:
// export const addToCart = function (product, quantity) {
//     cart.push({ product, quantity });
//     console.log(`${quantity} ${product} added to cart`);
// };
//
// export const totalPrice = 237;
// export const totalQuantity = 23;
//
// DEFAULT EXPORT (one per module):
// export default function (product, quantity) {
//     cart.push({ product, quantity });
// };

// ──── script.js (importing module) ────

// Named imports (must match export names):
// import { addToCart, totalPrice as price, totalQuantity } from './shoppingCart.js';
// addToCart('bread', 5);
// console.log(price); // 237

// Import everything as namespace:
// import * as ShoppingCart from './shoppingCart.js';
// ShoppingCart.addToCart('bread', 5);
// console.log(ShoppingCart.totalPrice);

// Default import (any name you want):
// import add from './shoppingCart.js';
// add('pizza', 2);

// MIXING (possible but AVOID):
// import add, { addToCart, totalPrice } from './shoppingCart.js';


/**
 * ========================================================================
 * 3. NAMED VS DEFAULT EXPORTS
 * ========================================================================
 * NOTES:
 * - Named exports: multiple per module. Import with exact name (or rename with `as`).
 * - Default export: ek per module. Import with any name.
 *
 * CONVENTION:
 * - Ek file se sirf ek cheez export karna hai -> default export.
 * - Multiple cheezein export karna hai -> named exports.
 * - MIXING avoid karo (confusion hota hai).
 */


/**
 * ========================================================================
 * 4. TOP-LEVEL AWAIT (ES2022)
 * ========================================================================
 * NOTES:
 * - Modules me await top level pe use kar sakte ho (function ke bahar).
 * - But ye MODULE KA EXECUTION BLOCK karta hai.
 * - Importing module bhi WAIT karega jab tak top-level await resolve na ho.
 * - Sirf necessary jagah use karo; zyada use se loading slow hoti hai.
 */

// const res = await fetch('https://jsonplaceholder.typicode.com/posts');
// const data = await res.json();
// console.log(data);

// BLOCKING EXAMPLE:
// const getLastPost = async function () {
//     const res = await fetch('https://jsonplaceholder.typicode.com/posts');
//     const data = await res.json();
//     return { title: data.at(-1).title, text: data.at(-1).body };
// };
//
// // Top-level await:
// const lastPost = await getLastPost();
// console.log(lastPost);


/**
 * ========================================================================
 * 5. THE MODULE PATTERN (Pre-ES6)
 * ========================================================================
 * NOTES:
 * - ES6 modules se pehle IIFE + closures se modules banate the.
 * - IIFE run hota hai, returned object = public API.
 * - Closure variables ko private rakhti hai.
 * - Purane codebases me dikhega. New code me ES6 modules use karo.
 */

const ShoppingCart2 = (function () {
    const cart = [];
    const shippingCost = 10;
    const totalPrice = 237;
    const totalQuantity = 23;

    function addToCart(product, quantity) {
        cart.push({ product, quantity });
        console.log(`${quantity} ${product} added to cart (shipping: ${shippingCost})`);
    }

    function orderStock(product, quantity) {
        console.log(`${quantity} ${product} ordered from supplier`);
    }

    // Public API:
    return { addToCart, cart, totalPrice, totalQuantity };
})();

ShoppingCart2.addToCart('apple', 4);   // 4 apple added to cart (shipping: 10)
ShoppingCart2.addToCart('pizza', 2);
console.log(ShoppingCart2.cart);        // [{...}, {...}]
// console.log(ShoppingCart2.shippingCost); // undefined (private!)


/**
 * ========================================================================
 * 6. COMMONJS MODULES
 * ========================================================================
 * NOTES:
 * - Node.js ka traditional module system.
 * - module.exports = value;  -> export.
 * - const mod = require('./module');  -> import.
 * - Browser me directly nahi chalte (bundler chahiye).
 * - Node me default hai (unless "type": "module" in package.json).
 */

// EXPORT (in Node):
// module.exports.addToCart = function (product, quantity) {
//     cart.push({ product, quantity });
// };

// IMPORT (in Node):
// const { addToCart } = require('./shoppingCart');


/**
 * ========================================================================
 * 7. BUNDLING — WHY AND WHAT
 * ========================================================================
 * NOTES:
 * - Problem: 100 small JS files -> 100 HTTP requests -> slow load.
 * - Solution: BUNDLER sab files ko EK (ya few) bundles me merge karta hai.
 *
 * BUNDLERS:
 * - Webpack: powerful, widely used, complex config.
 * - Parcel: zero-config, beginner friendly, fast.
 * - Vite: modern, super fast dev server, Rollup-based production build.
 * - esbuild: blazing fast (Go-based).
 *
 * WHAT BUNDLER DOES:
 * 1. Sab modules ek file me join.
 * 2. Dead code eliminate (tree shaking).
 * 3. Code minify (whitespace, variable names shrink).
 * 4. Old browser support ke liye transpile (Babel).
 * 5. Assets optimize (images, CSS, etc.).
 */


/**
 * ========================================================================
 * 8. PARCEL BASICS (Jonas course me use hota hai)
 * ========================================================================
 * NOTES:
 * - npx parcel index.html        -> dev server start.
 * - npx parcel build index.html   -> production build.
 * - Hot Module Replacement (HMR): code change hone par page full reload nahi,
 *   sirf changed module replace. State preserved!
 *
 * PARCEL FEATURES:
 * - Zero config: no webpack.config.js needed.
 * - Automatic code splitting.
 * - Automatic polyfills.
 * - Built-in support for SASS, TypeScript, React, etc.
 */

// Hot Module Replacement (Parcel specific):
// if (module.hot) {
//     module.hot.accept();
// }

// NPM scripts:
// {
//   "scripts": {
//     "start": "parcel index.html",
//     "build": "parcel build index.html"
//   }
// }


/**
 * ========================================================================
 * 9. TRANSPILING AND POLYFILLING
 * ========================================================================
 * NOTES:
 * - Transpiling: naye syntax ko purane me convert karna.
 *   Arrow function -> regular function. const -> var. Optional chaining -> if checks.
 *   Tool: Babel (most bundlers me built-in).
 *
 * - Polyfilling: naye FEATURES/METHODS jo purane JS me exist nahi karte,
 *   unko manually add karna.
 *   Promise, Array.from, Array.flat, etc.
 *   Tool: core-js, regenerator-runtime.
 *
 * DIFFERENCE:
 * - Transpile = SYNTAX change (bundler handles).
 * - Polyfill = NEW FUNCTIONALITY add (library import karo).
 */

// Polyfill imports:
// import 'core-js/stable';              // all polyfills
// import 'regenerator-runtime/runtime';  // async/await polyfill

// Selective polyfills (better for bundle size):
// import 'core-js/stable/array/find';
// import 'core-js/stable/promise';


/**
 * ========================================================================
 * 10. DECLARATIVE AND FUNCTIONAL JS (Modern Trend)
 * ========================================================================
 * NOTES:
 * - Imperative: HOW karna hai step by step. (for loops, manual state).
 * - Declarative: WHAT chahiye. (map, filter, reduce, ternary).
 *
 * FUNCTIONAL PROGRAMMING PRINCIPLES:
 * - Pure functions: same input -> same output. No side effects.
 * - Immutability: data mutate mat karo, naya data create karo.
 * - First-class functions: functions as values.
 * - Avoid: var, for loops, direct DOM mutation, mutable state.
 * - Prefer: const, array methods, spread/rest, Object.freeze.
 *
 * JONAS KI RECOMMENDATION:
 * - Pure functional JS achievable nahi hai (side effects zaroori hain).
 * - But functional TECHNIQUES use karo jahan possible:
 *   map/filter/reduce instead of for loops.
 *   Spread instead of push/mutation.
 *   Immutable objects where feasible.
 */

// Imperative:
const doubled1 = [];
for (let i = 0; i < [1, 2, 3].length; i++) {
    doubled1.push([1, 2, 3][i] * 2);
}

// Declarative:
const doubled2 = [1, 2, 3].map(n => n * 2);

console.log(doubled1); // [2, 4, 6]
console.log(doubled2); // [2, 4, 6]

// Object.freeze (shallow freeze):
const budget = Object.freeze({
    food: 300,
    misc: 100,
});
// budget.food = 500;     // ❌ silently fails (strict mode: error)
// budget.clothing = 200; // ❌ can't add new properties

// NOTE: freeze sirf shallow hai. Nested objects mutable rehte hain.
