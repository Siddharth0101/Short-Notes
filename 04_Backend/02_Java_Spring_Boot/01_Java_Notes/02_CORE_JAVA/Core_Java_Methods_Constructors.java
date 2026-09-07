/**
 * ========================================================================
 * 02d. CORE JAVA - METHODS, CONSTRUCTORS, OOPs & MORE [⚡ VISUAL]
 * ========================================================================
 * Source: Telusko — Master Java, Spring and Spring Boot, Spring Security,
 *         Spring AI, Docker and Microservices
 * 
 * ========================================================================
 * 1. METHODS (Functions)
 * ========================================================================
 * - Method = ek block of code jo specific task perform karta hai. Reusability ka base.
 * - DRY Principle: Don't Repeat Yourself. Same code baar baar likhne ki jagah method bana lo.
 * 
 * SYNTAX:
 *   accessModifier returnType methodName(parameters) {
 *       // method body
 *       return value; // (if returnType is not void)
 *   }
 * 
 * TYPES OF METHODS:
 * a) Instance Method: Object ke through call hota hai. Object-level data access karta hai.
 * b) Static Method: Class ke through call hota hai (ClassName.method()). No object needed.
 *    - Static method sirf static variables access kar sakta hai (non-static nahi).
 * c) Void Method: Kuch return nahi karta.
 * d) Return Method: Ek value return karta hai (int, String, etc.).
 * 
 * METHOD OVERLOADING (Compile-time Polymorphism):
 * - Same class me SAME NAME ke multiple methods with DIFFERENT parameters.
 * - Different kya ho sakta hai: Number of params, type of params, order of params.
 * - Return type se overloading nahi hoti (sirf parameters matter karte hain).
 * 
 * VARIABLE ARGUMENTS (Varargs) - Java 5+:
 * - Jab pata nahi kitne arguments aayenge: method(int... nums)
 * - Internally array ki tarah kaam karta hai.
 * - Rule: Varargs LAST parameter hona chahiye, aur sirf EK varargs per method.
 * 
 * ========================================================================
 * 2. CONSTRUCTORS
 * ========================================================================
 * - Constructor = special method jo object create hote waqt AUTOMATICALLY call hota hai.
 * - Purpose: Object ki initial state set karna (instance variables ko values dena).
 * 
 * RULES:
 * - Constructor ka naam CLASS ke naam ke EXACTLY SAME hona chahiye.
 * - Koi return type nahi hota (void bhi nahi!).
 * - Agar koi constructor nahi likho toh Java ek DEFAULT constructor deta hai (no-arg, empty body).
 *   BUT agar ek bhi constructor likh diya, toh default constructor AUTOMATICALLY nahi milta!
 * 
 * TYPES:
 * a) Default Constructor: No parameters. Java auto-generate karta hai agar koi nahi likha.
 * b) Parameterized Constructor: Parameters lete hai for initialization.
 * c) Constructor Overloading: Ek class me multiple constructors with different parameters.
 * 
 * CONSTRUCTOR CHAINING:
 * - this(): Same class ka dusra constructor call karta hai. MUST be the FIRST statement.
 * - super(): Parent class ka constructor call karta hai. MUST be the FIRST statement.
 * - Java by default super() call karta hai agar tum explicitly na likho.
 * 
 * ========================================================================
 * 3. WRAPPER CLASSES & AUTOBOXING
 * ========================================================================
 * - Primitive types ko Object ki tarah treat karne ke liye Wrapper classes hain.
 * - Collections (ArrayList, HashMap etc.) sirf OBJECTS store kar sakti hain, primitives nahi.
 *   Isliye Wrapper classes zaroori hain.
 * 
 * PRIMITIVE -> WRAPPER MAPPING:
 * ┌───────────┬──────────────┐
 * │ Primitive │   Wrapper    │
 * ├───────────┼──────────────┤
 * │ byte      │ Byte         │
 * │ short     │ Short        │
 * │ int       │ Integer      │
 * │ long      │ Long         │
 * │ float     │ Float        │
 * │ double    │ Double       │
 * │ char      │ Character    │
 * │ boolean   │ Boolean      │
 * └───────────┴──────────────┘
 * 
 * AUTOBOXING: Primitive -> Wrapper AUTOMATICALLY (Java 5+)
 *   int x = 5; Integer obj = x;  // auto-boxed
 * 
 * UNBOXING: Wrapper -> Primitive AUTOMATICALLY
 *   Integer obj = 10; int x = obj;  // auto-unboxed
 * 
 * USEFUL WRAPPER METHODS:
 * - Integer.parseInt("123")    -> String to int
 * - Integer.valueOf("123")     -> String to Integer object
 * - Integer.toString(123)      -> int to String
 * - Integer.MAX_VALUE          -> Max value of int
 * - Integer.MIN_VALUE          -> Min value of int
 * - Double.parseDouble("3.14") -> String to double
 * 
 * ========================================================================
 * 4. ENUMS
 * ========================================================================
 * - Enum = ek special class jo FIXED SET of CONSTANTS define karti hai.
 * - Use case: Jab values predefined aur limited ho (e.g., days, directions, status codes).
 * - Enums type-safe hain (String ya int se better, galat value pass nahi ho sakti).
 * - Enums me constructors, fields, aur methods bhi ho sakte hain!
 * - Internally final aur static hote hain.
 * - values() method se saare constants ka array milta hai.
 * - valueOf("NAME") se String to enum conversion hoti hai.
 * 
 * ========================================================================
 * 5. OOPs — CLASSES & OBJECTS (Detailed — Telusko)
 * ========================================================================
 * - Java ek Object-Oriented Language hai. Har cheez class aur object ke around revolve karti hai.
 * - CLASS = Blueprint / Template. Ye define karta hai ki object ka structure kya hoga
 *   (kya variables honge, kya methods honge).
 * - OBJECT = Class ka real instance. Memory me actual entity jo Stack (reference) 
 *   aur Heap (data) me banti hai using `new` keyword.
 * 
 * NAMING CONVENTION (Industry Standard — Telusko emphasizes):
 * ┌──────────────┬──────────────────────────────────────────────────────┐
 * │  Element     │  Convention                                         │
 * ├──────────────┼──────────────────────────────────────────────────────┤
 * │ Class        │ PascalCase   (e.g., StudentRecord, PaymentService)  │
 * │ Method       │ camelCase    (e.g., calculateTotal, getBalance)     │
 * │ Variable     │ camelCase    (e.g., studentName, maxSpeed)          │
 * │ Constant     │ ALL_CAPS     (e.g., MAX_VALUE, PI)                 │
 * │ Package      │ lowercase    (e.g., com.telusko.app)               │
 * └──────────────┴──────────────────────────────────────────────────────┘
 * 
 * ANONYMOUS OBJECT:
 * - Object bina reference variable ke create hota hai.
 * - One-time use ke liye. Reuse nahi kar sakte.
 * - Syntax: new ClassName().methodName();
 * - Example: new Calculator().add(5, 3);  // No variable, used once and garbage collected.
 * 
 * ========================================================================
 * 6. `this` KEYWORD (Detailed — Telusko)
 * ========================================================================
 * - `this` = current object ka reference. Jis object pe method call ho raha hai, usko point karta hai.
 * 
 * USE CASES:
 * a) Distinguish instance variable from parameter (jab naam same ho):
 *    this.name = name;  // this.name = instance var, name = param
 * 
 * b) Call another constructor from same class (Constructor Chaining):
 *    this();           // calls no-arg constructor
 *    this(value);      // calls parameterized constructor
 *    Rule: MUST be the FIRST statement in constructor.
 * 
 * c) Pass current object as argument to another method:
 *    someMethod(this);
 * 
 * d) Return current object from a method (for method chaining / fluent API):
 *    return this;
 * 
 * ========================================================================
 * 7. `static` KEYWORD (Detailed — Telusko)
 * ========================================================================
 * - `static` = class-level. Object nahi, CLASS se belong karta hai.
 * - Ek hi copy sabke liye shared hoti hai (har object ke liye alag nahi banti).
 * - Memory: Static members Method Area / MetaSpace me store hote hain (JDK 8+).
 * 
 * STATIC VARIABLE:
 * - Sab objects ke liye COMMON value. Ek baar change ki toh sabke liye change.
 * - Example: Student.schoolName = "Telusko Academy"; // shared across all Student objects.
 * - Access: ClassName.variableName (object se bhi ho sakta hai but not recommended).
 * 
 * STATIC METHOD:
 * - Bina object banaye call hota hai: ClassName.methodName()
 * - CANNOT access instance variables directly (kyunki kisi specific object ka reference nahi hai).
 * - CANNOT use `this` or `super` inside static method.
 * - CAN access other static members.
 * - Example: Math.sqrt(25), Integer.parseInt("123") — ye sab static methods hain.
 * 
 * STATIC BLOCK:
 * - Class load hone pe AUTOMATICALLY execute hota hai (sirf EK baar, objects banne se PEHLE).
 * - Complex initialization of static variables ke liye use hota hai.
 * - Multiple static blocks ho sakte hain — order me execute hote hain.
 * - Syntax: static { // initialization code }
 * 
 * ========================================================================
 * 8. ENCAPSULATION (Detailed — Telusko)
 * ========================================================================
 * - OOPs ka 1st pillar. DATA HIDING ka concept.
 * - Variables ko `private` rakho → direct access band.
 * - Public getters/setters methods se CONTROLLED access do.
 * - WHY? Taaki koi invalid data set na kar sake.
 *   Example: age = -5 nahi hona chahiye → setter me validation lagao.
 * 
 * REAL-WORLD ANALOGY (Telusko style):
 * - Bank account ka balance PRIVATE hai. Aap directly balance change nahi kar sakte.
 * - Deposit/withdraw methods (public) ke through hi kaam hota hai, with validation.
 * 
 * BENEFITS:
 * - Data security (invalid values se protect)
 * - Loose coupling (internal implementation change karo, external code nahi toota)
 * - Maintainability (ek jagah validation, har jagah apply)
 * 
 * ========================================================================
 * 9. INHERITANCE (Detailed — Telusko)
 * ========================================================================
 * - OOPs ka 2nd pillar. Code REUSABILITY ka concept.
 * - Child class (subclass) Parent class (superclass) ki properties aur methods inherit karti hai.
 * - `extends` keyword se implement hota hai.
 * - Java me SINGLE inheritance (class level pe) — ek class sirf EK class extend kar sakti hai.
 * - Multiple inheritance INTERFACES se achieve hoti hai (Diamond Problem avoid karne ke liye).
 * 
 * TYPES OF INHERITANCE (Telusko covers):
 * ┌────────────────────┬───────────────────────────────────────────────┐
 * │ Type               │ Description                                   │
 * ├────────────────────┼───────────────────────────────────────────────┤
 * │ Single             │ A → B (one parent, one child)                 │
 * │ Multilevel         │ A → B → C (chain of inheritance)              │
 * │ Hierarchical       │ A → B, A → C (one parent, multiple children)  │
 * │ Multiple (❌ class)│ NOT allowed with classes (Diamond Problem)     │
 * │ Multiple (✅ intf) │ Allowed with interfaces                        │
 * └────────────────────┴───────────────────────────────────────────────┘
 * 
 * IS-A vs HAS-A RELATIONSHIP:
 * - IS-A → Inheritance: Dog IS-A Animal (Dog extends Animal)
 * - HAS-A → Composition: Car HAS-A Engine (Car contains Engine object as field)
 * - Telusko tip: Prefer composition over inheritance when possible (more flexible).
 * 
 * `super` KEYWORD:
 * - Parent class ko refer karta hai. 
 * - super.variableName → parent ki variable access karo (jab child me same naam ho).
 * - super.methodName() → parent ka method call karo (overridden method ke case me).
 * - super() → parent ka constructor call karo. MUST be FIRST statement.
 * - Java by default super() add karta hai har constructor me (agar explicitly nahi likha).
 * 
 * METHOD OVERRIDING:
 * - Child class me parent ke method ko REDEFINE karna (same signature: name + params).
 * - @Override annotation lagana best practice hai (compile-time check).
 * - Return type same ya COVARIANT (child type) hona chahiye.
 * - Access modifier same ya WIDER hona chahiye (private → protected OK, protected → private ❌).
 * - static, final, private methods OVERRIDE nahi ho sakte.
 * 
 * ========================================================================
 * 10. POLYMORPHISM (Detailed — Telusko)
 * ========================================================================
 * - OOPs ka 3rd pillar. "MANY FORMS" — same cheez alag alag form me behave kare.
 * 
 * TWO TYPES:
 * 
 * a) COMPILE-TIME POLYMORPHISM (Static Binding / Early Binding):
 *    = METHOD OVERLOADING
 *    - Same class, same method name, DIFFERENT parameters.
 *    - Compiler decide karta hai kaunsa method call hoga (at compile time).
 *    - Example: add(int, int), add(double, double), add(int, int, int)
 * 
 * b) RUN-TIME POLYMORPHISM (Dynamic Binding / Late Binding):
 *    = METHOD OVERRIDING + UPCASTING
 *    - Parent reference, child object → JVM decide karta hai kaunsa method chalega (at runtime).
 *    - This is called DYNAMIC METHOD DISPATCH.
 *    - Example: Animal a = new Dog(); a.sound(); 
 *      → Dog ka sound() chalega, Animal ka nahi! Kyunki actual object Dog hai.
 *    - ⭐ This is the HEART of polymorphism in Java.
 * 
 * DYNAMIC METHOD DISPATCH (⭐ INTERVIEW IMPORTANT):
 * - Jab parent type ki reference variable child object ko hold karti hai.
 * - Method call hone pe JVM runtime pe dekhta hai ki actual object kaunsa hai.
 * - Overridden method hi call hota hai (child ka), parent ka nahi.
 * - Ye flexibility deta hai — same code different behaviors show karta hai.
 * 
 * ========================================================================
 * 11. `final` KEYWORD (Detailed — Telusko)
 * ========================================================================
 * - `final` = RESTRICT karta hai. Modification band.
 * 
 * USAGE:
 * a) final VARIABLE → Constant ban jata hai. Value ek baar set, phir change nahi hogi.
 *    final int MAX = 100; MAX = 200; // ❌ COMPILE ERROR
 *    Convention: final variables ALL_CAPS me likhte hain.
 * 
 * b) final METHOD → OVERRIDE nahi ho sakta child class me.
 *    Parent me: final void show() {...}
 *    Child me: void show() {...} // ❌ COMPILE ERROR
 * 
 * c) final CLASS → INHERIT nahi ho sakti. Koi class extend nahi kar sakti.
 *    final class Utility {...}
 *    class SubUtility extends Utility {...} // ❌ COMPILE ERROR
 *    Example: String class Java me final hai — koi extend nahi kar sakta.
 * 
 * ========================================================================
 * 12. Object CLASS METHODS — toString(), equals(), hashCode() (Telusko)
 * ========================================================================
 * - Har class Java me secretly `Object` class ko extend karti hai (root of all classes).
 * - Object class me kuch important methods hain jo override karna best practice hai:
 * 
 * a) toString():
 *    - Default: ClassName@HexHashCode (e.g., Student@1b6d3586) — useless output!
 *    - Override karke meaningful info return karo (e.g., "Student{name='Navin', age=35}").
 *    - System.out.println(obj) internally obj.toString() call karta hai.
 * 
 * b) equals():
 *    - Default: Reference comparison (== same hai). Checks ki SAME OBJECT hai ya nahi.
 *    - Override karke CONTENT comparison karo (e.g., do students same hain agar naam aur age same ho).
 *    - String class me already overridden hai — isliye "abc".equals("abc") = true.
 * 
 * c) hashCode():
 *    - Returns integer representing object's identity. Used in HashMap, HashSet etc.
 *    - CONTRACT: Agar equals() override karo toh hashCode() BHI override karo.
 *    - Rule: Equal objects MUST have equal hashCodes.
 *    - Unequal objects CAN have same hashCode (collision), but shouldn't ideally.
 */

// ========== ENUM EXAMPLES ==========
// Simple Enum
enum Direction {
    NORTH, SOUTH, EAST, WEST
}

// Enum with fields and methods
enum HttpStatus {
    OK(200, "Success"),
    NOT_FOUND(404, "Not Found"),
    SERVER_ERROR(500, "Internal Server Error");

    private final int code;
    private final String message;

    // Enum constructor (always private implicitly)
    HttpStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}

// ========== CONSTRUCTOR EXAMPLES ==========
class Student {
    String name;
    int age;
    String course;

    // Default Constructor
    Student() {
        this("Unknown", 0, "Undeclared"); // Constructor chaining with this()
        System.out.println("[Default Constructor called]");
    }

    // Parameterized Constructor (2 params)
    Student(String name, int age) {
        this(name, age, "General"); // Chain to 3-param constructor
        System.out.println("[2-param Constructor called]");
    }

    // Parameterized Constructor (3 params) - FULL
    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
        System.out.println("[3-param Constructor called]");
    }

    void display() {
        System.out.println(name + " | Age: " + age + " | Course: " + course);
    }
}

// ========== OOPs: CLASS & OBJECT + `this` KEYWORD ==========
class Laptop {
    private String brand;
    private int price;

    // `this` keyword — distinguishes instance var from param
    Laptop(String brand, int price) {
        this.brand = brand;   // this.brand = instance variable, brand = parameter
        this.price = price;
    }

    void showInfo() {
        System.out.println("Laptop: " + brand + " | Price: ₹" + price);
    }

    // Returning `this` for method chaining (Fluent API pattern)
    Laptop applyDiscount(int percent) {
        this.price -= this.price * percent / 100;
        System.out.println("Discount " + percent + "% applied. New price: ₹" + price);
        return this; // return current object for chaining
    }
}

// ========== OOPs: STATIC KEYWORD (Variable, Method, Block) ==========
class Counter {
    // Static variable — shared across ALL objects
    static int totalCount = 0;

    // Instance variable — unique per object
    String instanceId;

    // Static Block — runs ONCE when class is loaded (before any object is created)
    static {
        System.out.println("[Static Block] Counter class loaded! totalCount initialized to " + totalCount);
    }

    Counter(String id) {
        this.instanceId = id;
        totalCount++; // increment shared counter
    }

    // Instance method — needs object
    void showId() {
        System.out.println("Instance: " + instanceId + " | Total so far: " + totalCount);
    }

    // Static method — no object needed
    static void showTotal() {
        System.out.println("Total objects created: " + totalCount);
        // System.out.println(instanceId); // ❌ ERROR! Static method can't access instance var
    }
}

// ========== OOPs: ENCAPSULATION (Data Hiding with Getters/Setters) ==========
class Employee {
    // Private fields — HIDDEN from outside (data hiding)
    private String name;
    private int age;
    private double salary;

    // Constructor
    Employee(String name, int age, double salary) {
        this.name = name;
        setAge(age);       // Use setter for validation even in constructor
        setSalary(salary);
    }

    // --- GETTERS (read access) ---
    public String getName() { return name; }
    public int getAge() { return age; }
    public double getSalary() { return salary; }

    // --- SETTERS (write access with VALIDATION) ---
    public void setName(String name) { this.name = name; }

    public void setAge(int age) {
        if (age > 0 && age < 120) {
            this.age = age;
        } else {
            System.out.println("❌ Invalid age: " + age + ". Must be 1-119.");
            this.age = 0; // default safe value
        }
    }

    public void setSalary(double salary) {
        if (salary >= 0) {
            this.salary = salary;
        } else {
            System.out.println("❌ Invalid salary: " + salary + ". Cannot be negative.");
            this.salary = 0;
        }
    }

    @Override
    public String toString() {
        return "Employee{name='" + name + "', age=" + age + ", salary=₹" + salary + "}";
    }
}

// ========== OOPs: INHERITANCE + super + METHOD OVERRIDING ==========

// Parent (Superclass)
class Vehicle {
    String brand;
    int speed;

    Vehicle(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
        System.out.println("[Vehicle Constructor] " + brand);
    }

    void drive() {
        System.out.println(brand + " is driving at " + speed + " km/h");
    }

    void honk() {
        System.out.println("Vehicle honking: BEEP BEEP! 🚗");
    }
}

// Child (Subclass) — Single Inheritance
class Car extends Vehicle {
    int numDoors;

    Car(String brand, int speed, int numDoors) {
        super(brand, speed);  // super() — calls parent constructor. MUST be FIRST.
        this.numDoors = numDoors;
        System.out.println("[Car Constructor] Doors: " + numDoors);
    }

    // METHOD OVERRIDING — redefining parent's method in child
    @Override
    void honk() {
        System.out.println(brand + " car honking: HONK HONK! 🏎️");
    }

    void showDoors() {
        System.out.println(brand + " has " + numDoors + " doors");
    }

    // Accessing parent's overridden method using super
    void honkBoth() {
        super.honk(); // Parent's honk
        this.honk();  // Child's honk (overridden)
    }
}

// Multilevel Inheritance: Vehicle → Car → ElectricCar
class ElectricCar extends Car {
    int batteryCapacity;

    ElectricCar(String brand, int speed, int doors, int battery) {
        super(brand, speed, doors); // calls Car's constructor → which calls Vehicle's
        this.batteryCapacity = battery;
    }

    @Override
    void drive() {
        System.out.println(brand + " silently driving at " + speed + " km/h ⚡ (Battery: " + batteryCapacity + " kWh)");
    }
}

// Hierarchical Inheritance: Vehicle → Car, Vehicle → Bike
class Bike extends Vehicle {
    boolean hasGear;

    Bike(String brand, int speed, boolean hasGear) {
        super(brand, speed);
        this.hasGear = hasGear;
    }

    @Override
    void honk() {
        System.out.println(brand + " bike: RING RING! 🏍️");
    }
}

// ========== OOPs: POLYMORPHISM + DYNAMIC METHOD DISPATCH ==========

// Base class for polymorphism demo
class Instrument {
    void play() {
        System.out.println("Playing some instrument... 🎵");
    }
}

class Guitar extends Instrument {
    @Override
    void play() {
        System.out.println("Strumming the Guitar! 🎸");
    }
}

class Piano extends Instrument {
    @Override
    void play() {
        System.out.println("Playing the Piano! 🎹");
    }
}

class Drums extends Instrument {
    @Override
    void play() {
        System.out.println("Beating the Drums! 🥁");
    }
}

// ========== OOPs: `final` KEYWORD EXAMPLES ==========
// final class — cannot be inherited
final class MathUtils {
    static final double PI = 3.14159265358979; // final variable — constant

    // final method (in a non-final class context, this prevents overriding)
    static double circleArea(double radius) {
        return PI * radius * radius;
    }
}

// class ExtendedMath extends MathUtils {} // ❌ COMPILE ERROR! MathUtils is final.

// ========== OOPs: Object Class Methods — toString, equals, hashCode ==========
class Book {
    String title;
    String author;
    int pages;

    Book(String title, String author, int pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    // Override toString() — meaningful string representation
    @Override
    public String toString() {
        return "Book{title='" + title + "', author='" + author + "', pages=" + pages + "}";
    }

    // Override equals() — content-based comparison instead of reference
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                  // Same reference
        if (obj == null || getClass() != obj.getClass()) return false; // Null or different class
        Book other = (Book) obj;
        return this.pages == other.pages &&
               this.title.equals(other.title) &&
               this.author.equals(other.author);
    }

    // Override hashCode() — MUST override when equals() is overridden
    @Override
    public int hashCode() {
        int result = title.hashCode();
        result = 31 * result + author.hashCode();
        result = 31 * result + pages;
        return result;
    }
}

// ========== HAS-A Relationship (Composition) ==========
class Engine {
    String type;
    int horsepower;

    Engine(String type, int hp) {
        this.type = type;
        this.horsepower = hp;
    }

    void start() {
        System.out.println(type + " engine (" + horsepower + " HP) started! 🔥");
    }
}

class SportsCar {
    String name;
    Engine engine; // HAS-A relationship — SportsCar HAS-A Engine

    SportsCar(String name, Engine engine) {
        this.name = name;
        this.engine = engine;
    }

    void startCar() {
        System.out.println(name + " is starting...");
        engine.start(); // Delegating to composed object
    }
}

// ========== METHOD EXAMPLES ==========
public class Core_Java_Methods_Constructors {

    // --- Instance Method ---
    String greet(String name) {
        return "Hello, " + name + "! Welcome to Telusko.";
    }

    // --- Static Method ---
    static int add(int a, int b) {
        return a + b;
    }

    // --- Method Overloading (Same name, different params) ---
    static int multiply(int a, int b) {
        return a * b;
    }

    static double multiply(double a, double b) { // Different type
        return a * b;
    }

    static int multiply(int a, int b, int c) { // Different number of params
        return a * b * c;
    }

    // --- Varargs (Variable Arguments) ---
    static int sumAll(int... numbers) { // Accepts 0 or more ints
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }

    // --- Method with array return ---
    static int[] getMinMax(int[] arr) {
        int min = arr[0], max = arr[0];
        for (int val : arr) {
            if (val < min) min = val;
            if (val > max) max = val;
        }
        return new int[]{min, max};
    }

    public static void main(String[] args) {

        // ===== 1. METHODS =====
        System.out.println("===== 1. Methods =====");

        // Static method — no object needed
        System.out.println("add(5, 3) = " + add(5, 3));

        // Instance method — needs object
        Core_Java_Methods_Constructors obj = new Core_Java_Methods_Constructors();
        System.out.println(obj.greet("Siddharth"));

        // Method Overloading
        System.out.println("\n--- Method Overloading ---");
        System.out.println("multiply(4, 5) = " + multiply(4, 5));           // int version
        System.out.println("multiply(2.5, 3.0) = " + multiply(2.5, 3.0));   // double version
        System.out.println("multiply(2, 3, 4) = " + multiply(2, 3, 4));     // 3-param version

        // Varargs
        System.out.println("\n--- Varargs ---");
        System.out.println("sumAll() = " + sumAll());             // 0 args
        System.out.println("sumAll(5) = " + sumAll(5));           // 1 arg
        System.out.println("sumAll(1,2,3,4,5) = " + sumAll(1, 2, 3, 4, 5)); // 5 args

        // Return array from method
        int[] data = {34, 12, 78, 5, 91};
        int[] minMax = getMinMax(data);
        System.out.println("\nMin: " + minMax[0] + ", Max: " + minMax[1]);

        // ===== 2. CONSTRUCTORS =====
        System.out.println("\n===== 2. Constructors =====");

        System.out.println("--- Default Constructor ---");
        Student s1 = new Student();
        s1.display();

        System.out.println("\n--- 2-Param Constructor ---");
        Student s2 = new Student("Navin", 35);
        s2.display();

        System.out.println("\n--- 3-Param Constructor ---");
        Student s3 = new Student("Siddharth", 22, "Computer Science");
        s3.display();

        // ===== 3. WRAPPER CLASSES & AUTOBOXING =====
        System.out.println("\n===== 3. Wrapper Classes =====");

        // Autoboxing: primitive -> Wrapper (automatic)
        int primitiveNum = 42;
        Integer wrappedNum = primitiveNum; // Auto-boxed!
        System.out.println("Autoboxed: int " + primitiveNum + " -> Integer " + wrappedNum);

        // Unboxing: Wrapper -> primitive (automatic)
        Integer boxed = 100;
        int unboxed = boxed; // Auto-unboxed!
        System.out.println("Unboxed: Integer " + boxed + " -> int " + unboxed);

        // Useful parsing methods
        String numStr = "256";
        int parsed = Integer.parseInt(numStr);       // String -> int
        double parsedD = Double.parseDouble("3.14"); // String -> double
        System.out.println("\nParsed '" + numStr + "' to int: " + parsed);
        System.out.println("Parsed '3.14' to double: " + parsedD);

        // Integer limits
        System.out.println("\nInteger.MAX_VALUE = " + Integer.MAX_VALUE);
        System.out.println("Integer.MIN_VALUE = " + Integer.MIN_VALUE);

        // Wrapper comparison GOTCHA
        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;
        System.out.println("\n127 == 127 (cached): " + (a == b));   // true (Integer cache: -128 to 127)
        System.out.println("128 == 128 (NOT cached): " + (c == d)); // false (different objects!)
        System.out.println("128.equals(128): " + c.equals(d));      // true (content comparison)
        System.out.println("⚠ LESSON: Always use .equals() for Wrapper comparison!");

        // ===== 4. ENUMS =====
        System.out.println("\n===== 4. Enums =====");

        // Simple enum usage
        Direction dir = Direction.NORTH;
        System.out.println("Current Direction: " + dir);

        // switch with enum
        switch (dir) {
            case NORTH -> System.out.println("Heading North ⬆");
            case SOUTH -> System.out.println("Heading South ⬇");
            case EAST  -> System.out.println("Heading East ➡");
            case WEST  -> System.out.println("Heading West ⬅");
        }

        // Iterating over all enum values
        System.out.println("\nAll Directions:");
        for (Direction d1 : Direction.values()) {
            System.out.println("  " + d1 + " (ordinal: " + d1.ordinal() + ")");
        }

        // Enum with fields and methods
        System.out.println("\n--- Enum with Fields ---");
        HttpStatus status = HttpStatus.NOT_FOUND;
        System.out.println("Status: " + status);
        System.out.println("Code: " + status.getCode());
        System.out.println("Message: " + status.getMessage());

        // String to Enum
        HttpStatus fromString = HttpStatus.valueOf("OK");
        System.out.println("\nvalueOf(\"OK\"): " + fromString + " -> " + fromString.getCode());

        // Print all HTTP statuses
        System.out.println("\nAll HTTP Statuses:");
        for (HttpStatus s : HttpStatus.values()) {
            System.out.println("  " + s.getCode() + " - " + s.getMessage());
        }

        // ===== 5. CLASSES & OBJECTS + `this` KEYWORD =====
        System.out.println("\n===== 5. Classes, Objects & `this` Keyword =====");

        // Normal object creation
        Laptop myLaptop = new Laptop("Dell", 75000);
        myLaptop.showInfo();

        // Method Chaining using `this` return
        System.out.println("\n--- Method Chaining (Fluent API with `this`) ---");
        new Laptop("MacBook", 150000)
            .applyDiscount(10)    // returns this
            .applyDiscount(5)     // chains on returned this
            .showInfo();          // final state

        // Anonymous Object — one-time use, no variable
        System.out.println("\n--- Anonymous Object ---");
        new Laptop("HP", 55000).showInfo(); // Created, used, garbage collected. No reference.

        // ===== 6. STATIC KEYWORD =====
        System.out.println("\n===== 6. Static Keyword =====");

        // Static block already executed when Counter class was loaded (see output above)
        Counter c1 = new Counter("A");
        Counter c2 = new Counter("B");
        Counter c3 = new Counter("C");

        c1.showId();
        c2.showId();
        c3.showId();

        // Static method — called without object
        Counter.showTotal(); // 3

        // Static variable — shared. Change once, reflects everywhere.
        System.out.println("\nBefore reset: " + Counter.totalCount);
        Counter.totalCount = 0; // Reset shared counter
        System.out.println("After reset: " + Counter.totalCount);

        // ===== 7. ENCAPSULATION =====
        System.out.println("\n===== 7. Encapsulation =====");

        Employee emp = new Employee("Navin Reddy", 35, 120000);
        System.out.println(emp); // toString() called automatically

        // Try setting invalid values → setter BLOCKS them
        System.out.println("\n--- Validation in Setters ---");
        emp.setAge(-5);    // ❌ Invalid age
        emp.setSalary(-100); // ❌ Invalid salary

        // Valid update
        emp.setAge(36);
        emp.setSalary(150000);
        System.out.println("Updated: " + emp);

        // Direct access blocked:
        // emp.salary = 999999; // ❌ COMPILE ERROR! salary is private

        // ===== 8. INHERITANCE + super + OVERRIDING =====
        System.out.println("\n===== 8. Inheritance =====");

        // Single Inheritance
        System.out.println("--- Single Inheritance (Vehicle → Car) ---");
        Car myCar = new Car("Toyota", 180, 4);
        myCar.drive();        // Inherited from Vehicle
        myCar.honk();         // Overridden in Car
        myCar.showDoors();    // Car's own method

        System.out.println("\n--- super keyword: Access parent's overridden method ---");
        myCar.honkBoth(); // Calls both parent and child honk

        // Multilevel Inheritance (Vehicle → Car → ElectricCar)
        System.out.println("\n--- Multilevel Inheritance (Vehicle → Car → ElectricCar) ---");
        ElectricCar tesla = new ElectricCar("Tesla", 250, 4, 100);
        tesla.drive();       // ElectricCar's overridden drive
        tesla.honk();        // Car's overridden honk
        tesla.showDoors();   // Car's method (inherited by ElectricCar too)

        // Hierarchical Inheritance (Vehicle → Car, Vehicle → Bike)
        System.out.println("\n--- Hierarchical Inheritance ---");
        Bike myBike = new Bike("Royal Enfield", 120, true);
        myBike.drive();   // Vehicle's method
        myBike.honk();    // Bike's overridden honk

        // ===== 9. POLYMORPHISM + DYNAMIC METHOD DISPATCH =====
        System.out.println("\n===== 9. Polymorphism =====");

        // --- Compile-Time Polymorphism (Method Overloading) ---
        System.out.println("--- Compile-Time (Overloading) ---");
        System.out.println("multiply(4, 5) = " + multiply(4, 5));         // int version
        System.out.println("multiply(2.5, 3.0) = " + multiply(2.5, 3.0)); // double version
        System.out.println("multiply(2, 3, 4) = " + multiply(2, 3, 4));   // 3-param version

        // --- Runtime Polymorphism (Method Overriding + Dynamic Method Dispatch) ---
        System.out.println("\n--- Runtime (Dynamic Method Dispatch) ---");
        // Parent reference, Child object → JVM decides at RUNTIME which method to call
        Instrument i1 = new Guitar();   // Upcasted
        Instrument i2 = new Piano();    // Upcasted
        Instrument i3 = new Drums();    // Upcasted
        Instrument i4 = new Instrument(); // Base class

        i1.play(); // "Strumming the Guitar!" → Guitar's overridden play()
        i2.play(); // "Playing the Piano!"   → Piano's overridden play()
        i3.play(); // "Beating the Drums!"   → Drums' overridden play()
        i4.play(); // "Playing some instrument..." → base class play()

        // Array of parent type holding different child objects → POWER of polymorphism
        System.out.println("\n--- Polymorphic Array (Same type, different behavior) ---");
        Instrument[] band = { new Guitar(), new Piano(), new Drums(), new Guitar() };
        for (Instrument instrument : band) {
            instrument.play(); // Each plays differently! JVM resolves at runtime.
        }

        // --- Dynamic Method Dispatch with Vehicle hierarchy ---
        System.out.println("\n--- Dynamic Dispatch with Vehicles ---");
        Vehicle v1 = new Car("BMW", 200, 4);       // Vehicle ref, Car object
        Vehicle v2 = new ElectricCar("Tesla", 250, 4, 100); // Vehicle ref, ElectricCar object
        Vehicle v3 = new Bike("Ducati", 180, true); // Vehicle ref, Bike object

        System.out.println();
        v1.honk(); // Car's honk
        v2.honk(); // Car's honk (ElectricCar inherits from Car, didn't override)
        v3.honk(); // Bike's honk
        v1.drive(); // Vehicle's drive (Car didn't override)
        v2.drive(); // ElectricCar's drive (overridden)

        // ===== 10. `final` KEYWORD =====
        System.out.println("\n===== 10. final Keyword =====");

        // final variable (constant)
        final int MAX_STUDENTS = 50;
        System.out.println("MAX_STUDENTS = " + MAX_STUDENTS);
        // MAX_STUDENTS = 60; // ❌ COMPILE ERROR: cannot assign a value to final variable

        // final class method usage
        System.out.println("Circle area (r=5): " + MathUtils.circleArea(5));
        System.out.println("PI = " + MathUtils.PI);
        // MathUtils.PI = 3.0; // ❌ COMPILE ERROR: PI is final

        // ===== 11. Object CLASS METHODS =====
        System.out.println("\n===== 11. Object Class Methods (toString, equals, hashCode) =====");

        Book book1 = new Book("Java Complete Reference", "Herbert Schildt", 1200);
        Book book2 = new Book("Java Complete Reference", "Herbert Schildt", 1200);
        Book book3 = new Book("Head First Java", "Kathy Sierra", 700);

        // toString() — automatically called in println
        System.out.println("book1: " + book1); // Uses overridden toString()
        System.out.println("book3: " + book3);

        // equals() — content comparison (not reference)
        System.out.println("\n--- equals() ---");
        System.out.println("book1 == book2 (reference): " + (book1 == book2));   // false (different objects in heap)
        System.out.println("book1.equals(book2) (content): " + book1.equals(book2)); // true (same content)
        System.out.println("book1.equals(book3) (content): " + book1.equals(book3)); // false (different content)

        // hashCode() — equal objects must have equal hashCodes
        System.out.println("\n--- hashCode() ---");
        System.out.println("book1.hashCode(): " + book1.hashCode());
        System.out.println("book2.hashCode(): " + book2.hashCode()); // same as book1 (equal objects)
        System.out.println("book3.hashCode(): " + book3.hashCode()); // different
        System.out.println("book1 & book2 hash equal? " + (book1.hashCode() == book2.hashCode())); // true

        // ===== 12. HAS-A RELATIONSHIP (Composition) =====
        System.out.println("\n===== 12. HAS-A Relationship (Composition) =====");

        Engine v8 = new Engine("V8 Twin-Turbo", 650);
        SportsCar lambo = new SportsCar("Lamborghini Huracán", v8);
        lambo.startCar();

        // Different engine, same car structure
        Engine electric = new Engine("Electric Motor", 450);
        SportsCar teslaS = new SportsCar("Tesla Model S", electric);
        teslaS.startCar();

        System.out.println("\n✅ All Telusko OOPs concepts covered with examples!");
    }
}
