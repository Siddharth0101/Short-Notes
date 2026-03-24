'use strict';

/**
 * ES6 CLASSES - FULL NOTES (Syntactic Sugar)
 * -----------------------------------------
 * Backend mein ye aaj bhi Prototypal Inheritance hi use karti hain.
 */
class Car {
    constructor(make, speed) {
        this.make = make;
        this.speed = speed;
    }

    // 1. INSTANCE METHODS (Added to Car.prototype)
    // Saare objects (bmw, audi) inhe share karenge.
    acc() {
        this.speed += 10;
        console.log(`${this.make} is going at ${this.speed} km/h`);
    }

    // 2. STATIC METHOD (Way 1: Inside the Class)
    // 'static' keyword use karke. Ye sirf 'Car' class ka apna method hai.
    static sayHello() {
        console.log("Hello! Main Class ke andar wala static method hoon.");
    }
}

/**
 * 3. STATIC METHOD (Way 2: Outside the Class)
 * Jaise hum normal functions mein properties add karte hain.
 * Dono ka kaam bilkul same hai.
 */
Car.hey = function() {
    console.log('Hey there! Main Class ke bahar assign kiya gaya static method hoon.');
};

// --- Testing Static Methods ---
Car.sayHello(); // ✅ Works!
Car.hey();      // ✅ Works!

const bmw = new Car('BMW', 120);
// bmw.hey();   // ❌ Error! (Instance ke paas static methods nahi hote)

/**
 * 4. IMPORTANT CLASS RULES
 * ------------------------
 * 1. NOT HOISTED: Classes ko use karne se pehle define karna MUST hai.
 * 2. FIRST-CLASS CITIZENS: Inhe variables mein store kar sakte hain aur functions 
 * mein pass/return kar sakte hain.
 * 3. STRICT MODE: Class ki poori body hamesha 'Strict Mode' mein chalti hai.
 */

/**
 * 5. INHERITANCE (Extends & Super)
 */
class EV extends Car {
    constructor(make, speed, battery) {
        // 'super' parent (Car) ke constructor ko call karta hai.
        // Rule: this keyword se pehle super() call hona chahiye.
        super(make, speed);
        this.battery = battery;
    }

    charge() {
        console.log(`${this.make} charging... Battery: ${this.battery}%`);
    }
}

const tesla = new EV('Tesla', 150, 95);
tesla.acc();    // Inherited from Car
tesla.charge(); // Own method

/*
========================================================================
FINAL REVISION TABLE
========================================================================
| Concept              | Detail (Hinglish)                              |
|----------------------|------------------------------------------------|
| Static (Way 1)       | Inside class using 'static' keyword.           |
| Static (Way 2)       | Outside class: ClassName.methodName = function |
| Hoisting             | Classes mein nahi hoti (Functions mein hoti hai).|
| 1st Class Citizens   | Functions ki tarah treat hoti hain.            |
| super()              | Parent constructor ko trigger karne ke liye.   |
| this                 | Static methods mein 'this' Class ko point karta hai.|
========================================================================
*/