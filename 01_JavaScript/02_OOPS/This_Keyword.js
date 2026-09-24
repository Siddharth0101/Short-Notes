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
 * - Plain call — strict mode mein `this` undefined; non-strict behavior runtime par depend karta hai.
 * - Global `this` — browser classic script, ES module aur Node context same nahi.
 * - DOM listener — regular listener ka `this` currentTarget; arrow ka outer `this`.
 * - Callback — method pass karne se receiver preserve nahi hota; bind/wrapper use karo.
 * - Callback receiver — callback kis API se invoke hua, uska contract dekho; containing object automatically receiver nahi.
 * - Method wrapper — `() => obj.method()` call-time object lookup preserve karta hai.
 * - Nested regular call — outer method ka receiver inner regular function ko automatically inherit nahi hota.
 */

'use strict';


console.log(this); // Browser me: Window object print hoga

const calcAge = function (birthYear) {
    console.log(2037 - birthYear);
    console.log(this); // Strict Mode hai toh => undefined
};
calcAge(1991);

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

// document.querySelector('.btn').addEventListener('click', function() {
//      // Agar browser par chalega toh output me '<button class="btn">Click me!</button>' dkhiga
//      console.log(this); 
// });
