/**
 * ## Quick revision
 *
 * - Regular `this` — function kaise call hua usse decide hota hai.
 * - Arrow `this` — surrounding scope se aata hai; `call`/`bind` se change nahi hota.
 * - Detached method — `const f = obj.method` receiver kho deta hai.
 * - `call` — args alag; `apply` — args array-like; `bind` — naya bound function.
 * - Prototype — missing property prototype chain mein search hoti hai.
 * - Class — prototype-based object creation ka syntax; methods prototype par hote hain.
 * - `new` — object banata, prototype jodta aur constructor call karta hai.
 * - `extends`/`super` — inheritance; derived constructor mein `this` se pehle `super()`.
 * - Own property — `Object.hasOwn()` inherited property ko include nahi karta.
 * - Private field — `#name` class ke bahar directly accessible nahi.
 * - `Object.create(proto)` — chosen prototype wala object; constructor run nahi hota.
 * - Descriptor — writable, enumerable aur configurable property behavior control karte hain.
 * - `Object.getPrototypeOf` — object's actual prototype; constructor `.prototype` alag property hai.
 * - Delegation — shared methods prototype par, per-object state instance par rakho.
 * - Prototype shadowing — instance ki own property same-name prototype property ko hide karti hai.
 * - Instance fields — har object ki own state; shared prototype par mutable array rakhna accidental sharing kara sakta hai.
 * - Object lookup — property milte hi search rukti hai; missing par chain ke end tak jaata hai.
 */

'use strict';

const car = function (make, speed) {
    this.make = make;  // Property: Har car ka apna 'make'
    this.speed = speed; // Property: Har car ki apni 'speed'
};

car.prototype.acc = function () {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
};

car.prototype.dec = function () {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed} km/h`);
};

const bmw = new car('BMW', 120);

bmw.acc(); 

// A. hasOwnProperty: Check karna ki property object ki apni hai ya prototype ki.
console.log(bmw.hasOwnProperty('make')); // true (Constructor mein set hui thi)
console.log(bmw.hasOwnProperty('acc'));  // false (Ye prototype se aa rahi hai)

// B. __proto__ vs .prototype: 
// 'bmw.__proto__' vo link hai jo 'car.prototype' ko point karta hai.
console.log(bmw.__proto__ === car.prototype); // true

// C. instanceof: Check karna ki object kis blueprint se bana hai.
console.log(bmw instanceof car); // true
