/**
 * ## Quick revision
 *
 * - JDK — Java develop karne ke tools; JVM — bytecode chalane ka runtime.
 * - Compile/run — `javac Main.java` → `java Main`.
 * - `main` — standard entry point `public static void main(String[] args)`.
 * - Class/file — public top-level class ka naam filename se match karo.
 * - Primitive — direct primitive value; reference — object ka reference ya null.
 * - Variable — declared type compatible value hi assign karo.
 * - `println` — output ke baad newline; `print` — same line.
 * - Primitive types — byte, short, int, long, float, double, char, boolean.
 * - Wrapper — primitive ka object type; unboxing null se `NullPointerException`.
 * - String — immutable; content compare ke liye `.equals()`.
 * - `==` — primitives ki value, objects ki reference identity compare.
 * - `StringBuilder` — repeated string building mein mutable buffer.
 * - Overflow — integer arithmetic wrap ho sakti hai; checked math/range validation use karo.
 * - Casting — narrowing mein data lose ho sakta hai; blindly cast mat karo.
 * - `final` — variable reassign nahi; object automatically immutable nahi.
 * - Bytecode — compiled class instructions; compatible JVM execute karti hai.
 * - Local variable — use se pehle assign karna zaroori; fields ko default values milti hain.
 * - Command-line args — main ka String array; numeric input explicitly parse/validate karo.
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
        System.out.println("===== Variables & Data Types =====");
        int maxSpeed = 120;
        boolean isRunning = true;
        long bigNumber = 100000L;          // L suffix for long
        float pi = 3.14f;                  // f suffix for float
        double precise = 3.14159265358979; // default decimal type
        char grade = 'A';                  // single quotes for char
        int million = 1_000_000;           // underscore for readability
        int binary = 0b1010;              // binary literal = 10
        int hex = 0xFF;                   // hex literal = 255
        
        System.out.println("Max Speed: " + maxSpeed);
        System.out.println("Binary 0b1010 = " + binary);
        System.out.println("Hex 0xFF = " + hex);
        System.out.println("1_000_000 = " + million);
        System.out.println("\n===== Type Conversion =====");
        
        // a) WIDENING (Implicit) — Chhota -> Bada (Automatic, Safe)
        int myInt = 100;
        double myDouble = myInt; // int -> double (auto widened)
        System.out.println("Widening: int " + myInt + " -> double " + myDouble);
        
        // b) NARROWING (Explicit Cast) — Bada -> Chhota (Manual, DATA LOSS possible!)
        double price = 99.99;
        int roundedPrice = (int) price; // double -> int (truncated, NOT rounded!)
        System.out.println("Narrowing: double " + price + " -> int " + roundedPrice); // 99
        
        int overflow = 257;
        byte truncated = (byte) overflow; // int -> byte (257 % 256 = 1)
        System.out.println("Overflow: int 257 -> byte " + truncated); // 1
        
        // c) TYPE PROMOTION in expressions
        byte a = 10;
        byte b = 30;
        // byte c = a * b; // ERROR! Result is int because byte gets promoted to int
        int result = a * b; // Correct
        byte forced = (byte)(a * b); // Or cast back explicitly
        System.out.println("Type Promotion: " + a + " * " + b + " = " + result);
        System.out.println("\n===== Operators =====");
        
        // Arithmetic
        System.out.println("7 / 2 = " + (7 / 2));     // 3 (integer division!)
        System.out.println("7.0 / 2 = " + (7.0 / 2)); // 3.5
        System.out.println("7 % 2 = " + (7 % 2));     // 1 (remainder)
        
        // Pre vs Post increment
        int x = 5;
        System.out.println("Post-increment x++ = " + (x++)); // prints 5, x becomes 6
        System.out.println("After post-increment x = " + x); // 6
        System.out.println("Pre-increment ++x = " + (++x));  // prints 7, x becomes 7
        
        // Ternary Operator
        int age = 20;
        String status = (age >= 18) ? "Adult" : "Minor";
        System.out.println("Age " + age + " -> " + status);
        
        // Logical Short-circuit
        int num = 0;
        // false && (anything) -> second part never evaluated!
        boolean check = (num != 0) && (10 / num > 2);
        System.out.println("Short-circuit saved division by zero: " + check);
        System.out.println("\n===== OOPs Demo =====");
        
        // Creating Objects (Heap Memory allocation using 'new')
        BankAccount acc1 = new BankAccount("Siddharth", 5000);
        acc1.deposit(1500);
        
        System.out.println("Current Balance: " + acc1.getBalance());
        
        // Inheritance and Polymorphism example
        SavingsAccount mySavings = new SavingsAccount("Telusko", 10000);
        mySavings.deposit(2000, "BR-101"); 
    }
}
