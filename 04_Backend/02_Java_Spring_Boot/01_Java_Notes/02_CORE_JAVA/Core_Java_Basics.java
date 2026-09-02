/**
 * ========================================================================
 * 02. CORE JAVA BASICS & OOPs [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Java ek Object-Oriented, strongly-typed programming language hai.
 * - Execution Flow: Source Code (.java) -> Compiler (javac) -> Bytecode (.class) -> JVM -> Machine Code.
 * - "Write Once, Run Anywhere" (WORA): Kyunki JVM har OS ke liye alag hota hai, but bytecode same rehta hai.
 * - JDK (Java Development Kit) = JRE + Dev Tools (compiler javac, debugger).
 * - JRE (Java Runtime Environment) = JVM + Libraries. Sirf run karne ke liye.
 * - JVM (Java Virtual Machine) = Bytecode ko Machine Code me convert karta hai (platform-specific).
 * 
 * ========================================================================
 * 1. VARIABLES & DATA TYPES (DETAILED)
 * ========================================================================
 * - Variable = ek named container jo data store karta hai memory me.
 * - Naming convention: camelCase (e.g., maxSpeed, isRunning). Keywords reserved hain (int, class, etc.).
 * 
 * PRIMITIVE TYPES (8 total — stored in Stack):
 * ┌─────────┬──────────┬───────────────────────────────────┬─────────────────────┐
 * │  Type   │  Size    │  Range                            │  Default Value      │
 * ├─────────┼──────────┼───────────────────────────────────┼─────────────────────┤
 * │ byte    │ 1 byte   │ -128 to 127                       │ 0                   │
 * │ short   │ 2 bytes  │ -32,768 to 32,767                 │ 0                   │
 * │ int     │ 4 bytes  │ -2^31 to 2^31-1 (~2 billion)      │ 0                   │
 * │ long    │ 8 bytes  │ -2^63 to 2^63-1                   │ 0L                  │
 * │ float   │ 4 bytes  │ ~7 decimal digits precision        │ 0.0f                │
 * │ double  │ 8 bytes  │ ~15 decimal digits precision       │ 0.0d                │
 * │ char    │ 2 bytes  │ 0 to 65,535 (Unicode)             │ '\u0000'            │
 * │ boolean │ 1 bit    │ true / false                       │ false               │
 * └─────────┴──────────┴───────────────────────────────────┴─────────────────────┘
 * 
 * LITERALS:
 * - int x = 0b1010;    // Binary literal (prefix 0b) = 10
 * - int y = 012;       // Octal literal (prefix 0) = 10
 * - int z = 0xA;       // Hex literal (prefix 0x) = 10
 * - long l = 100L;     // Long literal (suffix L)
 * - float f = 3.14f;   // Float literal (suffix f, otherwise Java treats decimals as double by default)
 * - double d = 3.14;   // Double literal (default decimal type)
 * - int big = 1_000_000; // Underscore for readability (Java 7+) = 1000000
 * 
 * Strongly-typed ka matlab: Ek baar variable ka type int ban gaya, toh string store nahi kar sakte.
 * 
 * ========================================================================
 * 2. TYPE CONVERSION & CASTING (⭐ IMPORTANT)
 * ========================================================================
 * Java me ek data type ko dusre me convert karna = Type Conversion.
 * 
 * a) WIDENING (Implicit / Automatic Conversion):
 *    - Chhota type -> Bada type. Java AUTOMATICALLY karta hai. NO data loss.
 *    - byte -> short -> int -> long -> float -> double
 *    - Example: int x = 5; double y = x;  // y = 5.0 (auto-widened)
 * 
 * b) NARROWING (Explicit Casting / Truncation):
 *    - Bada type -> Chhota type. Programmer ko MANUALLY karna padta hai. DATA LOSS ho sakta hai!
 *    - Syntax: (targetType) value;
 *    - Example: double x = 5.99; int y = (int) x;  // y = 5 (decimal TRUNCATED, not rounded!)
 *    - Example: int x = 257; byte y = (byte) x;     // y = 1 (overflow! 257 % 256 = 1)
 * 
 * c) TYPE PROMOTION IN EXPRESSIONS:
 *    - Jab ek expression me alag-alag types milte hain, Java sabko sabse bade type me promote karta hai.
 *    - byte, short, char -> automatically int me promote ho jaate hain expressions me.
 *    - Example: byte a = 10; byte b = 20; int result = a * b; // result int hai, byte me store karne pe error!
 *    - Example: byte a = 10; byte b = 20; byte c = (byte)(a * b); // Explicit cast zaroori hai.
 *    - Agar ek bhi operand long hai toh result long, ek bhi float hai toh float, ek bhi double hai toh double.
 * 
 * ========================================================================
 * 3. OPERATORS (ALL TYPES)
 * ========================================================================
 * 
 * a) ARITHMETIC OPERATORS: +, -, *, /, % (modulus = remainder)
 *    - Integer division: 7 / 2 = 3 (decimal lost!)
 *    - Double division: 7.0 / 2 = 3.5
 *    - Modulus: 7 % 2 = 1 (remainder)
 * 
 * b) RELATIONAL (Comparison) OPERATORS: ==, !=, >, <, >=, <= (Result: boolean true/false)
 *    - 5 == 5 -> true,  5 != 3 -> true,  5 > 3 -> true
 * 
 * c) LOGICAL OPERATORS: && (AND), || (OR), ! (NOT)
 *    - Short-circuit: && me pehla false hai toh dusra check nahi hota. || me pehla true hai toh dusra check nahi hota.
 *    - true && false -> false,  true || false -> true,  !true -> false
 * 
 * d) ASSIGNMENT OPERATORS: =, +=, -=, *=, /=, %=
 *    - x += 5 is shorthand for x = x + 5
 * 
 * e) UNARY OPERATORS: ++, --, +, -, ~ (bitwise complement), ! (logical NOT)
 *    - Pre-increment: ++x (pehle badhao, phir use karo)
 *    - Post-increment: x++ (pehle use karo, phir badhao)
 *    - Example: int x = 5; System.out.println(x++); // Prints 5, x is now 6
 *    - Example: int x = 5; System.out.println(++x); // Prints 6, x is now 6
 * 
 * f) BITWISE OPERATORS: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift)
 *    - Binary level pe kaam karte hain.
 *    - 5 & 3 = 1 (0101 & 0011 = 0001)
 *    - 5 << 1 = 10 (shift left = multiply by 2)
 * 
 * g) TERNARY OPERATOR: condition ? value_if_true : value_if_false
 *    - Ek line me if-else likh sakte ho.
 *    - int max = (a > b) ? a : b;
 * 
 * ========================================================================
 * 4. MEMORY MANAGEMENT
 * ========================================================================
 * - Stack Memory: Method calls, local variables aur references store hote hain (Fast, LIFO).
 * - Heap Memory: Objects aur unke instance variables store hote hain. Garbage Collector (GC) heap me un-referenced objects ko delete karta hai.
 * 
 * ========================================================================
 * 5. OOPS (OBJECT-ORIENTED PROGRAMMING)
 * ========================================================================
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
 * ========================================================================
 * 6. IMPORTANT KEYWORDS
 * ========================================================================
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
        
        // ===== 1. VARIABLES & DATA TYPES =====
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
        
        // ===== 2. TYPE CONVERSION & CASTING =====
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
        
        // ===== 3. OPERATORS =====
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
        
        // ===== 4. OOPs DEMO =====
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
