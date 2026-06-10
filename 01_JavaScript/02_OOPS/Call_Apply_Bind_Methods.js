'use strict';

/**
 * ========================================================================
 * 1. THE PROBLEM: 'this' Keyword ki confusion
 * ========================================================================
 * NOTES:
 * - Normal methods alag-alag objects par call ho sakte hain.
 * - Lekin agar humein kisi ek object ka method kisi *dusre* object pe use karna 
 *   ho, bina wahan code copy kiye, tab problem aati hai.
 * - call(), apply(), aur bind() functions JS mein 'this' keyword ko 
 *   manually control (set) karne ke kaam aate hain.
 */

const lufthansa = {
    airline: 'Lufthansa',
    iataCode: 'LH',
    bookings: [],
    // Method jo hume kisi aur object par bhi reuse karna hai
    book(flightNum, name) {
        console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`);
        this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
    }
};

lufthansa.book(239, 'Siddharth');
lufthansa.book(635, 'John Smith');

const eurowings = {
    airline: 'Eurowings',
    iataCode: 'EW',
    bookings: [],
};

// function ko object se bahar nikala (Naye variable mein store kiya)
const book = lufthansa.book;

// ❌ ERROR TENSION:
// Ab agar hum normally 'book(23, "Sarah")' chalayenge toh error aayega!
// Kyunki normal function call mein 'this' keyword window (ya strict mode 
// mein undefined) ko point karta hai. Use airline aur iataCode nahi milega.

/**
 * ========================================================================
 * 2. call() METHOD (Command on the spot)
 * ========================================================================
 * Kaam: Function ko turant execute karta hai aur uska 'this' keyword 
 * manually ek specific object par set (bind) kar deta hai.
 * Syntax: function.call(thisToPoint, arg1, arg2...)
 */

// 'book' function ko run karo, aur is time uska 'this' eurowings set kar do.
book.call(eurowings, 23, 'Sarah Williams'); 
book.call(lufthansa, 239, 'Mary Cooper'); // Wapas lufthansa par bhi chala sakte hain

console.log(eurowings);

/**
 * ========================================================================
 * 3. apply() METHOD (Array wala bhai)
 * ========================================================================
 * Kaam: Ye bilkul call() jaisa hi kaam karta hai. Executes immediately.
 * Fark: Baki bache arguments ko humein alag-alag commas se dene ki jagah, 
 * ek Array [] mein bhejna padta hai.
 * Syntax: function.apply(thisToPoint, [arg1, arg2...])
 */

const flightData = [583, 'George Cooper'];
book.apply(eurowings, flightData); // Array use kiya passing parameters ke liye

// Modern JS Tip: apply() ab kam use hota hai bcoz ab spread operator hai.
// Dono ka result bilkul same hota hai:
book.call(eurowings, ...flightData);

/**
 * ========================================================================
 * 4. bind() METHOD (Future Action / Naya function banana)
 * ========================================================================
 * Kaam: Ye function ko turant call NAHI karta. 
 * Ye return karta hai ek NAYA FUNCTION, jisme 'this' keyword hamesha ke 
 * liye fix (bind) ho chuka hota hai.
 * Syntax: const newFunc = function.bind(thisToPoint)
 */

// ek naya function '(bookEW)' return hua, jiska 'this' eurowings ban chuka hai.
const bookEW = book.bind(eurowings);
bookEW(23, 'Steven Williams'); // Ab baar baar this batane ki zarurat nahi 

/**
 * ========================================================================
 * 5. PARTIAL APPLICATION (bind() se arguments pehle hi set karna)
 * ========================================================================
 * bind() sirf 'this' fix nahi karta, hum iske zarite kuch parameters ko
 * bhi hamesha ke liye pre-set (fix) kar sakte hain. Ise Partial App kehte hain.
 */

// Example: Eurowings ki sirf *Flight 23* ke liye naya (dedicated) booking function!
const bookEW23 = book.bind(eurowings, 23); 
bookEW23('Martha Cooper'); // Flight number already 23 set tha. Bus naam dala.
bookEW23('Paul Smith');    

/**
 * ========================================================================
 * 6. bind() WITH EVENT LISTENERS ('this' confusion in DOM)
 * ========================================================================
 * Event Listeners me element ke andar ka 'this' hamesha element khud 
 * ban jata hai (e.g. Button), na ki wo Parent Class/Object.
 * Wahan par bind() bohat zyada darkari hota hai.
 */

lufthansa.planes = 300;
lufthansa.buyPlane = function () {
    console.log(this); // Agar normal chala to HTML button show hoga browser me
    this.planes++;
    console.log(`Lufthansa bought a new plane! Total: ${this.planes}`);
};

// DOM Button simulation (Manually jab browser me button dalo)
// document.querySelector('.buy').addEventListener('click', lufthansa.buyPlane.bind(lufthansa));
// Humne explicitly bind() kar diya taaki 'this' humesha 'lufthansa' ko point kare.

/*
========================================================================
QUICK SUMMARY TABLE
========================================================================
| Concept          | Hinglish Definition                               |
|------------------|---------------------------------------------------|
| Problem          | Function extract karne pe 'this' lose ho jata hai.|
| call()           | Turant execute karna + 'this' ko explicitly batana. |
| apply()          | Turant execute + 'this' set karna + arguments in Array. |
| bind()           | NAYA function return karna jiska 'this' FIXED ho. |
| Partial App.     | bind() use karke default arguments pehle se set karna.|
| DOM Events       | EventListener mein object ka 'this' fix rakhne ke liye bind use hota hai. |
========================================================================
*/
