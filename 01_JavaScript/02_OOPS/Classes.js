'use strict';

/**
 * ========================================================================
 * 1. CONSTRUCTOR FUNCTIONS (The "Under the Hood" Way)
 * ========================================================================
 * NOTES:
 * - Ye ek normal function hota hai jo 'new' keyword ke saath use hota hai.
 * - 'new' keyword 4 bade kaam karta hai:
 * 1. {} (Empty object banata hai).
 * 2. 'this' keyword ko naye object se link karta hai.
 * 3. Object ko prototype se connect karta hai.
 * 4. Object ko automatically return kar deta hai.
 */
const Car = function (make, speed) {
    // Instance properties: Har object ki apni alag copy hogi.
    this.make = make; 
    this.speed = speed;
};

// --- A. PROTOTYPE METHODS ---
// Memory bachane ke liye functions yahan rakhte hain.
// Saare objects (instances) isi EK copy ko share karte hain.
Car.prototype.acc = function () {
    this.speed += 10;
    console.log(`${this.make} is moving at ${this.speed} km/h`);
};

// --- B. STATIC METHOD (Way 2: Outside / Direct Assignment) ---
// Ye method sirf 'Car' constructor par directly call hota hai.
// Ye instances (like bmw) ko nahi milta.
Car.hey = function() {
    console.log("Main Constructor ka static method hoon! (Usage: Car.hey())");
};

// Usage check:
Car.hey(); // ✅ Works!

// --- C. INSTANCES CREATION (Examples) ---
// Ye objects Constructor function ka use karke banaye gaye hain.
const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

// Prototype method call karte hain
bmw.acc(); // Output: BMW is moving at 130 km/h
mercedes.acc(); // Output: Mercedes is moving at 105 km/h

// --- D. INHERITANCE IN CONSTRUCTOR FUNCTIONS ---
// 1. Child Class Constructor
const EV_Constructor = function(make, speed, battery) {
    Car.call(this, make, speed); // Parent properties inherit karo
    this.battery = battery;
};

// 2. Prototype Link (Inheriting Parent's methods)
EV_Constructor.prototype = Object.create(Car.prototype);

// 3. Prototype override hone se pointer kharab hota hai, use theek karo
EV_Constructor.prototype.constructor = EV_Constructor;

// Child ka apna method
EV_Constructor.prototype.charge = function() {
    console.log(`${this.make} battery charging... ${this.battery}%`);
};

const nixon = new EV_Constructor('Tata Nexon EV', 100, 80);
nixon.acc();     // Parent ka method (Inherited)
nixon.charge();  // Child ka method

/**
 * ========================================================================
 * 2. Object.create() (The Direct Link Way)
 * ========================================================================
 * NOTES:
 * - Isme koi constructor function nahi chahiye hota.
 * - Ye sabse manual aur "pure" tareeka hai inheritance ka.
 * - Hum manually ek object (CarProto) ko dusre object (maruti) ka prototype banate hain.
 */
const CarProto = {
    init(make, speed) {
        this.make = make;
        this.speed = speed;
    },
    greet() {
        console.log(`Hello! This is a ${this.make}.`);
    }
};

const maruti = Object.create(CarProto); // maruti ka prototype 'CarProto' ban gaya
maruti.init('Maruti', 80);
maruti.greet(); // Output: Hello! This is a Maruti.

// --- INSTANCE CREATION (Examples) ---
const honda = Object.create(CarProto);
honda.init('Honda', 100);
honda.greet(); // Output: Hello! This is a Honda.

// --- INHERITANCE IN Object.create() ---
// 1. Child Prototype create karte hain aur ParentProto se link karte hain
const EVProto = Object.create(CarProto);

// 2. Child ka apna init function (Jo parent ko invoke karega)
EVProto.initEV = function(make, speed, battery) {
    this.init(make, speed); // Calling Parent's init method
    this.battery = battery;
};

// Child ka apna method
EVProto.charge = function() {
    console.log(`${this.make} battery at ${this.battery}%`);
};

// 3. Child ka instance banate hain
const mgZSEV = Object.create(EVProto);
mgZSEV.initEV('MG ZS EV', 110, 90);
mgZSEV.greet();  // Using inherited method (From CarProto)
mgZSEV.charge(); // Using its own method (From EVProto)

/**
 * ========================================================================
 * 3. ES6 CLASSES (Modern Syntax / Syntactic Sugar)
 * ========================================================================
 * NOTES:
 * - Ye backend mein prototypes hi use karti hain, bas likhne ka style naya hai.
 * * RULES:
 * 1. NOT HOISTED: Classes ko pehle define karo, phir 'new' call karo.
 * 2. FIRST-CLASS CITIZENS: Variables mein store ya function mein pass kar sakte ho.
 * 3. STRICT MODE: Class ke andar code hamesha strict mode mein rehta hai.
 */
class CarClass {
    // A. PRIVATE FIELDS (#): Ye data encapsulation hai. 
    // Is property ko class ke bahar se koi change nahi kar sakta.
    #speed; 

    constructor(make, speed) {
        this.make = make;
        // 🚨 TRIGGER: Ye niche wale SETTER ko call karega.
        this.speed = speed; 
    }

    /**
     * C. GETTERS & SETTERS (Property Logic Control)
     * --------------------------------------------
     * USAGE RULES:
     * 1. CALLING: Inhe use karte waqt brackets () nahi lagate.
     * 2. ASSIGNMENT: Setter ko '=' operator se use karte hain (obj.speed = 100).
     * 3. INFINITE LOOP: Setter ke andar property ka naam '_' ya '#' se start karein, 
     * warna wo khud ko call karke Stack Overflow kar dega.
     * 4. NO RETURN NEEDED: Setter ke andar 'return' keyword ki zaroorat nahi hoti (wo ignore ho jata hai).
     */
    
    // SETTER: Value set karte waqt logic (Usage: car.speed = 100)
    set speed(value) {
        console.log(`Setting speed to: ${value}`);
        if (value >= 0) this.#speed = value; 
        else console.log("Speed positive honi chahiye!");
        // 🚨 Setter me return use nahi karna chahiye, ye bas value set karne ke lie hota hai.
    }

    // GETTER: Value read karne ke liye (Usage: console.log(car.speed))
    get speed() {
        console.log("Reading speed...");
        return `${this.#speed} km/h`;
    }

    acc() {
        this.#speed += 10;
        console.log(`${this.make} speed is now ${this.#speed}`);
    }

    /**
     * D. STATIC METHODS: Sirf Class par call hote hain, instances par nahi.
     */
    // Way 1: Inside Class
    static internalStatic() {
        console.log("Main class ke andar wala static method hoon!");
    }
}

// --- ES6 CLASS INSTANCE CREATION (Example) ---
const marutiSuzuki = new CarClass('Maruti Suzuki', 100);
marutiSuzuki.acc(); // Calling instance method
console.log(marutiSuzuki.speed); // Using Getter: "100 km/h"
marutiSuzuki.speed = 120; // Using Setter to update value

/**
 * ========================================================================
 * 4. INHERITANCE (Extends & Super)
 * ========================================================================
 * NOTES:
 * - 'extends' link banata hai (EV is a child of CarClass).
 * - 'super()' parent class ke constructor ko trigger karta hai.
 * - RULE: 'this' use karne se PEHLE hamesha 'super()' call karna hota hai.
 */
class EV extends CarClass {
    #battery;
    constructor(make, speed, battery) {
        super(make, speed); // Parent (CarClass) ko setup kiya
        this.#battery = battery;
    }

    charge() {
        console.log(`${this.make} is charging... Battery: ${this.#battery}%`);
    }
}

/**
 * ========================================================================
 * 5. PROTOTYPE VS __PROTO__ (The Big Difference)
 * ========================================================================
 * - .prototype: Ye sirf Constructor Functions/Classes ke paas hota hai (Blueprint).
 * - __proto__: Ye har instance/object ke paas hota hai (Actual link to prototype).
 * - LINK: bmw.__proto__ === CarClass.prototype (True).
 */

const tesla = new EV('Tesla', 150, 95);

// 🛑 SETTER Usage (Using '=' for assignment):
// Backend mein 'set speed(200)' run ho raha hai.
tesla.speed = 200; 

// 🛑 GETTER Usage (Read like a variable):
// Backend mein 'get speed()' run ho raha hai.
console.log(tesla.speed); 

// 🛑 Instance Methods Usage:
tesla.charge(); // Calling child method (EV)
tesla.acc(); // Calling inherited method (from CarClass)

// 🛑 STATIC Usage (Call on Class Name):
CarClass.internalStatic(); 

// --- CarClass INSTANCES (Examples) ---
const ford = new CarClass('Ford', 120);
ford.acc(); // Calling instance method
console.log(ford.speed); // Getting speed 

/**
 * ========================================================================
 * 6. POLYMORPHISM (Method Overriding)
 * ========================================================================
 * NOTES:
 * - Jab Child class ke paas same naam ka method ho jo Parent ke paas bhi ho, 
 *   toh Child ka method "override" kar deta hai Parent ke method ko.
 * 
 * REASON & HOW IT WORKS (Under the Hood):
 * - JavaScript 'Prototype Chain' par kaam karta hai. Jab aap child object par method call 
 *   karte ho (jaise nexonEV.acc()), JS engine sabse pehle wahi method child class me dhundta hai.
 * - Agar child me mil gaya, toh usko chala deta hai aur Parent wale ko ignore kar deta hai (Isko "Method Shadowing" bhi kehte hain).
 * - OVERRIDE KYUN KARTE HAIN?: Hum Method Overriding tab use karte hain jab Child class ko Parent 
 *   ka fundamental feature toh chahiye, lekin ek "specialized" ya alag tareeke se (For example, 
 *   normal Car fuel se aawaz karke bhagti hai, par ElectricCar battery se silently bhagti hai).
 */
class ElectricCar extends CarClass {
    constructor(make, speed) {
        super(make, speed);
    }
    
    // Parent (CarClass) me bhi acc() hai, par hum yahan usko OVERRIDE kar rahe hain.
    // Kyunki ElectricCar ki acceleration ka logic/implementation alag hota hai.
    acc() {
        console.log(`${this.make} accelerates completely silently (Overridden Method)!`);
        return this; // Calling object wapis return kiya METHOD CHAINING ke liye
    }

    brake() {
        console.log(`${this.make} applied brakes.`);
        return this; // Isme bhi 'this' return ho raha hai
    }
}

const nexonEV = new ElectricCar('Tata Nexon EV', 120);
const regularTaxi = new CarClass('Swift Dzire', 80);

// --- OVERRIDING EXAMPLE IN ACTION ---
console.log("\n--- Method Overriding Demo ---");
regularTaxi.acc(); // Calls PARENT method: "Swift Dzire speed is now 90" (Uses original acc logic)
nexonEV.acc();     // Calls CHILD overridden method: "Tata Nexon EV accelerates completely silently..."
console.log("------------------------------\n");

/**
 * ========================================================================
 * 7. ENCAPSULATION (Data Hiding)
 * ========================================================================
 * NOTES:
 * - Encapsulation ka matlab hai data (properties) aur methods ko ek unit (class) me enclose karna, 
 *   aur sensible (important) data ko bahar ki duniya se chupana (Data Hiding).
 * - Isse data randomly ya accidentally class ke bahar se change hone se bachta hai aur bugs kam aate hain.
 * 
 * JAVASCRIPT MEIN KAISE HOTA HAI?:
 * - ES6 se pehle developers '_' (underscore) use karte the. Example: _balance. Ye sirf ek "Convention" 
 *   tha developers ke beech me dikhane ke liye ki ye private hai, par asal me wo change ho sakti thi.
 * - Ab Modern JS me Private Class Fields (#) usko truly private/encapsulated banate hain.
 * - Koi class instance class ke bahar se '#property' ko direct access nahi kar sakta. Unhe access/modify 
 *   karne ke liye Getters, Setters, ya class ke diye gaye Public methods ("Public API") ka sahara lena padta hai.
 */
class BankAccount {
    // 1. Private Data (Encapsulated State)
    #balance;
    #pin;

    constructor(owner, initialBalance, pin) {
        this.owner = owner;             // Public Property
        this.#balance = initialBalance; // Private Property
        this.#pin = pin;                // Private Property
    }

    // 2. Public API/Interface (Methods safely interact with private data)
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            console.log(`${this.owner}'s A/c deposited: ₹${amount}. New Balance: ₹${this.#balance}`);
        } else {
            console.log("Deposit failed: Amount must be positive.");
        }
        return this; // For method chaining
    }

    withdraw(amount, pinEntered) {
        // Encapsulated logic: It validates PIN and checks balance safely beforehand
        if (this.#checkPin(pinEntered)) {
            if (this.#balance >= amount) {
                this.#balance -= amount;
                console.log(`${this.owner}'s A/c withdrew: ₹${amount}. New Balance: ₹${this.#balance}`);
            } else {
                console.log("Withdrawal failed: Insufficient funds.");
            }
        } else {
            console.log("Withdrawal failed: Incorrect PIN. Access Denied.");
        }
        return this; // For method chaining
    }

    // 3. Private Method (Only class methods can call this, keeps security logic hidden)
    #checkPin(pinEntered) {
        return this.#pin === pinEntered;
    }

    // Helper Getter: to safely expose data without allowing modification
    get getSecureBalance() {
        return `Safe Balance Output: ₹${this.#balance}`;
    }
}

// --- ENCAPSULATION EXAMPLE IN ACTION ---
console.log("\n--- Encapsulation Demo ---");
const siddAccount = new BankAccount('Siddharth', 5000, 1122);

// Direct access to private fields is completely blocked by JS:
// siddAccount.#balance = 100000; // 🛑 Error: Private field '#balance' must be declared in an enclosing class
// siddAccount.#checkPin(1122);   // 🛑 Error: Private method '#checkPin' is not accessible

// Everything MUST happen safely through our Public API:
siddAccount.deposit(1500);        // Valid transaction
siddAccount.withdraw(2000, 1122); // Correct PIN -> Success
siddAccount.withdraw(1000, 4444); // Incorrect PIN -> Blocked

console.log(siddAccount.getSecureBalance); // Read only using getter
console.log("--------------------------\n");

/**
 * ========================================================================
 * 8. METHOD CHAINING
 * ========================================================================
 * NOTES:
 * - Agar koi method 'this' return karta hai, to us par direct agla method lagaya ja sakta hai.
 */
// 🛑 Method Chaining Usage:
nexonEV.acc().brake().acc(); 
siddAccount.deposit(500).withdraw(200, 1122); // BankAccount object also supports chaining!

/**
 * ========================================================================
 * 9. THE 'instanceof' OPERATOR
 * ========================================================================
 * NOTES:
 * - Ye check karta hai ki ek object kisi class/constructor se bana hai ya kisi parent se.
 */
console.log(nexonEV instanceof ElectricCar); // true
console.log(nexonEV instanceof CarClass);    // true (kyunki inherit kiya hai)
console.log(nexonEV instanceof Object);      // true (JS me sab kuch Object hota hai)

/*
========================================================================
FINAL REVISION TABLE
========================================================================
| Concept          | Detail (Hinglish Summary)                          |
|------------------|----------------------------------------------------|
| Constructor      | Naye objects banane ka blueprint.                 |
| Delegation       | Method na milne par prototype chain mein dhundna.  |
| Object.create()  | Bina constructor ke seedha prototype link karna.   |
| Getter (get)     | Property ki tarah READ karna (No brackets).        |
| Setter (set)     | Property ki tarah '=' se WRITE/VALIDATE karna.     |
| Encapsulation    | Data/methods ko ek unit me band/hide karna.        |
| #PrivateField    | Data ko class ke bahar se hide karna (JS Syntax).  |
| super()          | Parent ke constructor ko call karne wala button.    |
| Static (Old)     | `Car.hey = ...` (Directly on Constructor).         |
| Static (New)     | `static sayHello()` (Inside Class).                |
| ES5 Inheritance  | `Child.prototype = Object.create(Parent.prototype)`|
| Polymorphism     | Parent ke method ko child mein override/change karna.|
| Method Chaining  | `return this;` likh kar lagatar methods call karna. |
| instanceof       | Check karna ki object kis class ya parent ka hai.  |
========================================================================
*/