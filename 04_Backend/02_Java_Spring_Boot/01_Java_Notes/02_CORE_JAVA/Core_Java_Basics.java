/**
 * ========================================================================
 * 02. CORE JAVA BASICS & OOPs [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Java ek Object-Oriented, strongly-typed programming language hai.
 * - Execution Flow: Source Code (.java) -> Compiler (javac) -> Bytecode (.class) -> JVM -> Machine Code.
 * - "Write Once, Run Anywhere" (WORA): Kyunki JVM har OS ke liye alag hota hai, but bytecode same rehta hai.
 * 
 * 1. VARIABLES & DATA TYPES:
 * - Primitive Types: byte(1), short(2), int(4), long(8), float(4), double(8), char(2), boolean(1).
 * - Strongly-typed ka matlab: Ek baar variable ka type int ban gaya, toh string store nahi kar sakte.
 * 
 * 2. MEMORY MANAGEMENT:
 * - Stack Memory: Method calls, local variables aur references store hote hain (Fast, LIFO).
 * - Heap Memory: Objects aur unke instance variables store hote hain. Garbage Collector (GC) heap me un-referenced objects ko delete karta hai.
 * 
 * 3. OOPS (OBJECT-ORIENTED PROGRAMMING):
 * - Class: Ek blueprint ya template (jaise car ka design).
 * - Object: Class ka real instance (jaise actual chalne wali car).
 * 
 * PILLARS OF OOPs:
 * a) Encapsulation: Data hiding. Variables ko `private` rakho aur getters/setters (methods) ko `public`. Taaki koi direct data corrupt na kar sake.
 * b) Inheritance: `extends` keyword se dusri class ki properties (methods/variables) use karna. Reusability. Java multiple inheritance classes se support nahi karta (Diamond problem).
 * c) Polymorphism: "Many forms". 
 *    - Compile-time (Method Overloading): Same method name, different parameters.
 *    - Run-time (Method Overriding): Parent ka method child class me re-define karna.
 * d) Abstraction: Complexity hide karna. `abstract` classes aur `interface` ka use karke sirf "kya karna hai" batana, "kaise karna hai" child classes pe chhod dena.
 * 
 * 4. IMPORTANT KEYWORDS:
 * - static: Class-level (sab objects ke liye common). Bina object banaye access ho jata hai.
 * - final: Value fix ho jati hai (constant). Class pe lagaya toh inherit nahi ho sakti, method pe lagaya toh override nahi ho sakta.
 * - this: Current object ko refer karta hai.
 * - super: Parent class ke objects/methods/constructors ko refer karta hai.
 */

class BankAccount {
    // ENCAPSULATION: Data hiding
    private double balance; 
    private String ownerName;

    // Constructor
    public BankAccount(String name, double initialBalance) {
        this.ownerName = name;
        this.balance = initialBalance;
    }

    // Getters and Setters for controlled access
    public double getBalance() {
        return this.balance; // 'this' refers to current object
    }

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println(amount + " deposited.");
        }
    }
}

// INHERITANCE: SavingsAccount extends BankAccount
class SavingsAccount extends BankAccount {
    private double interestRate = 0.04;

    public SavingsAccount(String name, double initialBalance) {
        super(name, initialBalance); // 'super' calls parent constructor
    }

    // POLYMORPHISM (Overloading)
    public void deposit(double amount, String branchCode) {
        super.deposit(amount);
        System.out.println("Deposited at branch: " + branchCode);
    }
}

public class Core_Java_Basics {
    public static void main(String[] args) {
        // Primitive Data Types
        int maxSpeed = 120;
        boolean isRunning = true;
        
        // Creating Objects (Heap Memory allocation using 'new')
        BankAccount acc1 = new BankAccount("Siddharth", 5000);
        acc1.deposit(1500);
        
        System.out.println("Current Balance: " + acc1.getBalance());
        
        // Inheritance and Polymorphism example
        SavingsAccount mySavings = new SavingsAccount("Telusko", 10000);
        mySavings.deposit(2000, "BR-101"); 
    }
}
