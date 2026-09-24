/**
 * ## Quick revision
 *
 * - `call` — `fn.call(obj, a, b)` se turant chosen receiver ke saath call.
 * - `apply` — `fn.apply(obj, [a, b])` mein arguments array-like se do.
 * - `bind` — `fn.bind(obj, a)` future call ke liye bound function deta hai.
 * - Partial application — kuch arguments pehle bind, baaki call par do.
 * - Arrow — lexical `this`; `call/apply/bind` se receiver replace nahi hota.
 * - Listener cleanup — bound function store karo; har `bind()` naya function banata hai.
 * - Borrowed method — chosen receiver ko method ke expected fields/contract satisfy karne chahiye.
 * - Bound identity — original function aur bound wrapper alag references; listener remove mein saved wrapper use.
 * - Explicit argument — dependency ko parameter banana hidden receiver coupling kam kar sakta hai.
 */

'use strict';


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


// 'book' function ko run karo, aur is time uska 'this' eurowings set kar do.
book.call(eurowings, 23, 'Sarah Williams'); 
book.call(lufthansa, 239, 'Mary Cooper'); // Wapas lufthansa par bhi chala sakte hain

console.log(eurowings);


const flightData = [583, 'George Cooper'];
book.apply(eurowings, flightData); // Array use kiya passing parameters ke liye

// Modern JS Tip: apply() ab kam use hota hai bcoz ab spread operator hai.
// Dono ka result bilkul same hota hai:
book.call(eurowings, ...flightData);


// ek naya function '(bookEW)' return hua, jiska 'this' eurowings ban chuka hai.
const bookEW = book.bind(eurowings);
bookEW(23, 'Steven Williams'); // Ab baar baar this batane ki zarurat nahi 


// Example: Eurowings ki sirf *Flight 23* ke liye naya (dedicated) booking function!
const bookEW23 = book.bind(eurowings, 23); 
bookEW23('Martha Cooper'); // Flight number already 23 set tha. Bus naam dala.
bookEW23('Paul Smith');    


lufthansa.planes = 300;
lufthansa.buyPlane = function () {
    console.log(this); // Agar normal chala to HTML button show hoga browser me
    this.planes++;
    console.log(`Lufthansa bought a new plane! Total: ${this.planes}`);
};

// DOM Button simulation (Manually jab browser me button dalo)
// document.querySelector('.buy').addEventListener('click', lufthansa.buyPlane.bind(lufthansa));
// Humne explicitly bind() kar diya taaki 'this' humesha 'lufthansa' ko point kare.
