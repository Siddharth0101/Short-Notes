'use strict';

/**
 * ========================================================================
 * 1. WHAT IS THE 'this' KEYWORD? (Who is executing the code?)
 * ========================================================================
 * NOTES:
 * - 'this' ek special variable hai jo har JS execution context me (har naye 
 *   function/scope mein) automatically banta hai.
 * - Ye us object ko point (refer) karta hai jo us specific time pe us 
 *   function ko CALL kar raha hai.
 * - RULE OF THUMB: 'this' property par depend nahi karta ki function kahan 
 *   define hua (pidaidaish), par humesha ispe depend karta hai ki usko
 *   KAISE call kiya gaya! (Note: Arrow functions ka alag scene hota hai).
 */

/**
 * ========================================================================
 * 2. GLOBAL SCOPE (Bahari Duniya)
 * ========================================================================
 * NOTES:
 * - Global scope (kisi browser par function ke bahar) mein 'this' directly 
 *   Global Object yaani ki Window Object ko point karta hai.
 * - Node.js environment mein ye 'global' object hota hai.
 */
console.log(this); // Browser me: Window object print hoga

/**
 * ========================================================================
 * 3. REGULAR FUNCTION (Normal kaam)
 * ========================================================================
 * NOTES:
 * - Jab function normal (like `calcAge(1991)`) call hota hai (kisi object ke as 
 *   method nahi), toh usko khud apna 'this' dena JS ka duty hota hai.
 * - STRICT MODE ('use strict'): Ye `undefined` hota hai! (Safer).
 * - NON-STRICT MODE: JavaScript automatically isey Global (Window) par set 
 *   kar deta hai jo kaafi bugs paida kar sakta hai.
 */
const calcAge = function (birthYear) {
    console.log(2037 - birthYear);
    console.log(this); // Strict Mode hai toh => undefined
};
calcAge(1991);

/**
 * ========================================================================
 * 4. METHOD CALL (Object ke andar ka Function)
 * ========================================================================
 * NOTES:
 * - Jab ek function kisi object ke andar ek property (method) ki tarah hota
 *   hai and `obj.methodName()` bolke call hota hai, to 'this' bilkul direct 
 *   us Object ko point karta hai jiske sahayate se wo call hua ho (dot ke piche wala).
 */
const jonas = {
    name: "Jonas",
    year: 1991,
    calcAge: function () {
        // Yahan 'this' print karne se jonas object ka output aayega
        console.log(this); 
        console.log(2037 - this.year); 
    }
};
jonas.calcAge(); // Kisne call kiya? 'jonas' ne! Toh this = jonas.

/**
 * ========================================================================
 * 5. ARROW FUNCTIONS (Lexical 'this' - The Udhaar System)
 * ========================================================================
 * NOTES:
 * - IMPORTANT: Arrow functions ka apna khud ka 'this' keyword hota hi NAHI hai!
 * - Ye apna 'this' apne parent scope (Lexical baap) se udhaar leta hai. 
 * - Isi wajah se Objects ke direct andar Arrow Functions methods use karna
 *   is purely a BAD IDEA.
 */

const calcAgeArrow = birthYear => {
    // Parent object is global window. So ye global window ho jaayega.
    console.log(this); 
};
calcAgeArrow(1980);

const matilda = {
    firstName: 'Matilda',
    year: 2017,
    
    // Normal Method Function 
    calcAge: function () {
        console.log(`Calc Age this object:`, this); 
        
        // Agar main object ke ekdum andar ke method k ander se bhi ek ALAG  
        // regular function chala dunga toh uska 'this' rule ke hisaab se undefined ho jata.
        /*
        const isMillenial = function() {
            console.log(this.year >= 1981 && this.year <= 1996); // ❌ ERROR! 'this' is undefined
        }
        isMillenial();
        */

        // PERFECT SOLUTION: Arrow Function ka Lexical 'this' (Best approach)
        const isMillenialMatch = () => {
            // Arrow ne apne parent (yaani calcAge() ka 'this' (matilda object)) 'udhaar' le liya.
            console.log(this.year >= 1981 && this.year <= 1996); // ✅ Ye chalega!
        };
        isMillenialMatch();
    },

    // 🛑 ARROW FUNCTION AS A DIRECT METHOD (BIG MISTAKE)
    greet: () => {
        // Objects ka apna koi "execution block scope" nahi hota if statement aur function 
        // ki tarah, wo sirf ek variable assignment ki bracket {} hai! 
        // So global scope se hi is arrow function ne this ki madad maangi thi: Window object.
        console.log(`Hey ${this.firstName}`); // 👎 Hey undefined! 
    }
};
matilda.calcAge(); // Expected result
matilda.greet();   // Mistake alert! (Use normal function as method)

/**
 * ========================================================================
 * 6. DOM EVENT LISTENERS (HTML Elements)
 * ========================================================================
 * NOTES:
 * - Event listener wala function jab chalta hai, to JavaScript uska 'this' us
 *   HTML DOM element par pointer ke jaise set kar deta hai jisko event listen karna the.
 */
// document.querySelector('.btn').addEventListener('click', function() {
//      // Agar browser par chalega toh output me '<button class="btn">Click me!</button>' dkhiga
//      console.log(this); 
// });

/*
========================================================================
QUICK SUMMARY TABLE
========================================================================
| Call Syntax / Context       | 'this' Kisey Point Karega?                             |
|-----------------------------|--------------------------------------------------------|
| Global Scope                | `Window` Object (Dhyan rakhna HTML Browser Environment)|
| Normal Function Call        | `undefined` ('use strict') ya Window (non-strict)      |
| Object Method (obj.func())  | Wo Object jisne method ko dot laga ke call kiya hai    |
| Arrow Function (() => {})   | Apna kuch nai, parent (lexical scope) se udhaar        |
| Event Listeners (.click)    | Wo HTML Element jis par event handler laga hua hai     |
| call, apply, bind           | Wo particular Object jo hum manually pass/set karte h  |
| new Keyword (Constructor)   | Ek bilkul naya blank `{}` Object jo automatically banta h|
========================================================================
*/
