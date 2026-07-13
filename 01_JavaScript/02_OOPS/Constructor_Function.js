'use strict';

/**
 * 1. CONSTRUCTOR FUNCTION (The Blueprint) [⚡ VISUAL]
 * Ye ek blueprint hai jo unique objects banata hai.
 * Kaam: Har instance ke liye data (properties) alag-alag store karna.
 */
const car = function (make, speed) {
    this.make = make;  // Property: Har car ka apna 'make'
    this.speed = speed; // Property: Har car ki apni 'speed'
};

/**
 * 2. PROTOTYPAL DELEGATION (Memory Saver)
 * Methods ko humesha '.prototype' par rakhte hain taaki har object ko 
 * apni alag copy na banani pade. Sab ek hi copy share karte hain.
 */
car.prototype.acc = function () {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
};

car.prototype.dec = function () {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed} km/h`);
};

/**
 * 3. THE 'new' KEYWORD (How it works behind the scenes)
 * Jab hum 'new car()' likhte hain, 4 steps hote hain:
 * 1. {} -> Ek khali object banta hai.
 * 2. this -> Function ke andar 'this' us naye object ko point karta hai.
 * 3. Link -> Naya object prototype se connect (link) hota hai.
 * 4. Return -> Object automatically return ho jata hai.
 */
const bmw = new car('BMW', 120);

/**
 * 4. DELEGATION & LOOKUP (The Search)
 * Jab 'bmw.acc()' call hota hai, JS pehle 'bmw' ke andar 'acc' dhundta hai.
 * Agar wahan nahi milta, toh wo upar 'car.prototype' par jaata hai.
 * Isey hi "Delegation" kehte hain.
 */
bmw.acc(); 

/**
 * 5. ADVANCED CHECKS (Utility Tools)
 */
// A. hasOwnProperty: Check karna ki property object ki apni hai ya prototype ki.
console.log(bmw.hasOwnProperty('make')); // true (Constructor mein set hui thi)
console.log(bmw.hasOwnProperty('acc'));  // false (Ye prototype se aa rahi hai)

// B. __proto__ vs .prototype: 
// 'bmw.__proto__' vo link hai jo 'car.prototype' ko point karta hai.
console.log(bmw.__proto__ === car.prototype); // true

// C. instanceof: Check karna ki object kis blueprint se bana hai.
console.log(bmw instanceof car); // true

/**
 * 6. THE PROTOTYPE CHAIN (The Hierarchy)
 * Agar koi cheez car.prototype par bhi nahi milti, toh JS 
 * 'Object.prototype' (top floor) par jata hai.
 * Chain: bmw -> car.prototype -> Object.prototype -> null
 */

/*
========================================================================
QUICK SUMMARY TABLE
========================================================================
| Concept          | Hinglish Definition                               |
|------------------|---------------------------------------------------|
| Constructor      | Unique properties set karne ke liye.              |
| Prototype        | Shared methods (functions) store karne ke liye.    |
| 'new' keyword    | Object banana aur prototype se link karna.        |
| Delegation       | Jab object apna kaam prototype se karwaye.        |
| hasOwnProperty   | Check karna: "Property meri hai ya prototype ki?" |
| __proto__        | Object ka actual physical link to prototype.      |
========================================================================
*/

/**
 * 7. OBJECT.DEFINEPROPERTY (Property Descriptors)
 * Object.defineProperty() se hum kisi object par directly property define ya modify kar sakte hain.
 * Ye properties ki characteristics (like readability, mutability, loop visibility) control karne me help karta hai.
 *
 * Syntax:
 * Object.defineProperty(obj, prop, descriptor)
 *
 * Descriptor Properties:
 * - value: Property ki data value (any type).
 * - writable: true/false (kya hum key ki value modify kar sakte hain?). Default: false.
 * - enumerable: true/false (kya ye key loops like 'for...in' ya 'Object.keys()' me dikhegi?). Default: false.
 * - configurable: true/false (kya property ko delete ya modify kiya ja sakta hai?). Default: false.
 *
 * USE CASE (EXPRESS 5 GOTCHA):
 * Express 5 me `req.query` read-only getter hota hai.
 * Isliye `req.query.limit = '5'` run nahi karta (silently ignore hota hai).
 * `Object.defineProperty` ko use karke hum application router custom middleware me property value inject kar sakte hain:
 * 
 * Object.defineProperty(req, 'query', {
 *   value: { ...req.query, limit: '5' },
 *   writable: true
 * });
 */