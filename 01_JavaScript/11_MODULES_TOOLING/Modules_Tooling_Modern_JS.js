/**
 * ## Quick revision
 *
 * - ES module — `import`/`export`; imports live bindings hote hain.
 * - Module scope — variables automatically global nahi bante.
 * - Dynamic import — `import()` Promise deta hai; zaroorat par code load karo.
 * - Bundler — modules/assets ko production bundles mein prepare karta hai.
 * - Tree shaking — unused exports hata sakta hai; side effects limit karte hain.
 * - Lockfile — dependency resolution pin; reproducible install ke liye commit karo.
 * - Source map — built code ko original source se map karta hai.
 * - Debugging — reproduce → breakpoint → state inspect → smallest fix.
 * - Environment — browser bundle mein bheja secret public samjho.
 * - Deployment — hashed assets long-cache; HTML update/revalidation sochkar karo.
 * - Named/default — named export ka imported naam match; default ka local naam choose kar sakte ho.
 * - Top-level await — ES module mein allowed; dependent module execution wait kar sakti hai.
 * - Transpile — syntax transform; polyfill — missing runtime API provide.
 * - Declarative — desired transformation bolo; unnecessary mutation se bacho.
 * - Circular import — initialization order matter; module load ke dauran uninitialized binding read fail kar sakti hai.
 * - Dependency audit — direct aur transitive packages alag; lockfile diff review karo.
 * - Polyfill/transpile — missing runtime API provide / syntax transform; dono same kaam nahi.
 */

'use strict';
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


// EXPORT (in Node):
// module.exports.addToCart = function (product, quantity) {
//     cart.push({ product, quantity });
// };

// IMPORT (in Node):
// const { addToCart } = require('./shoppingCart');


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


// Polyfill imports:
// import 'core-js/stable';              // all polyfills
// import 'regenerator-runtime/runtime';  // async/await polyfill

// Selective polyfills (better for bundle size):
// import 'core-js/stable/array/find';
// import 'core-js/stable/promise';


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
