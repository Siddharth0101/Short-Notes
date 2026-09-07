/**
 * ========================================================================
 * 02e. CORE JAVA - ADVANCED OOPs CONCEPTS [⚡ VISUAL]
 * ========================================================================
 * 
 * ========================================================================
 * 1. ACCESS MODIFIERS (Visibility Control)
 * ========================================================================
 * - Access modifiers decide karte hain ki koi class/method/variable kaun-kaun access kar sakta hai.
 * 
 * ┌──────────────┬───────────┬─────────────┬──────────────┬──────────────┐
 * │   Modifier   │ Same Class│ Same Package│  Subclass    │  Everywhere  │
 * │              │           │             │ (other pkg)  │ (other pkg)  │
 * ├──────────────┼───────────┼─────────────┼──────────────┼──────────────┤
 * │ private      │    ✅     │     ❌      │      ❌      │      ❌      │
 * │ default      │    ✅     │     ✅      │      ❌      │      ❌      │
 * │ (no keyword) │           │             │              │              │
 * │ protected    │    ✅     │     ✅      │      ✅      │      ❌      │
 * │ public       │    ✅     │     ✅      │      ✅      │      ✅      │
 * └──────────────┴───────────┴─────────────┴──────────────┴──────────────┘
 * 
 * RULES:
 * - private: Sirf SAME CLASS me accessible. Best for data hiding (Encapsulation).
 * - default (package-private): Koi keyword nahi likhte. Same PACKAGE me accessible.
 * - protected: Same package + child classes (even in different packages).
 * - public: Har jagah accessible. APIs aur entry points ke liye.
 * 
 * ========================================================================
 * 2. ABSTRACT CLASSES
 * ========================================================================
 * - Abstract class = ek aisi class jiska object NAHI bana sakte.
 * - `abstract` keyword use hota hai.
 * - Isme abstract methods (without body) AUR concrete methods (with body) dono ho sakte hain.
 * - Abstract method ka body child class me COMPULSORILY dena padta hai (override).
 * - Agar ek bhi method abstract hai toh class ko bhi abstract banana padega.
 * - Constructor ho sakta hai (child class super() se call karti hai).
 * - Instance variables (state) rakh sakta hai.
 * 
 * WHEN TO USE?
 * - Jab related classes me kuch common code share karna ho (concrete methods)
 *   aur kuch child-specific implementation force karna ho (abstract methods).
 * 
 * ========================================================================
 * 3. INTERFACES
 * ========================================================================
 * - Interface = ek 100% abstract contract. Ye batata hai "KYA karna hai", "KAISE karna hai" nahi.
 * - `implements` keyword se class interface ko implement karti hai.
 * - Ek class MULTIPLE interfaces implement kar sakti hai (Multiple inheritance of type!).
 * - Interface ke variables by default: public + static + final (constants).
 * - Interface ke methods by default: public + abstract.
 * 
 * JAVA 8+ ADDITIONS:
 * - default methods: Interface me method body likh sakte ho. Implementing class ko override optional.
 *   Purpose: Purane interfaces me naye methods add karna bina existing code tode.
 * - static methods: Interface name se call hota hai. Object se nahi.
 * 
 * JAVA 9+ ADDITIONS:
 * - private methods: Interface me helper methods jo dusre default methods internally use karte hain.
 * 
 * FUNCTIONAL INTERFACE (Java 8):
 * - Jis interface me sirf EK abstract method ho = Functional Interface.
 * - @FunctionalInterface annotation lagana best practice hai.
 * - Lambda expressions ke sath use hota hai.
 * - Examples: Runnable, Comparator, Callable, Predicate, Function, Consumer, Supplier.
 * 
 * ========================================================================
 * 4. ABSTRACT CLASS vs INTERFACE (⭐ INTERVIEW FAVOURITE)
 * ========================================================================
 * ┌──────────────────────┬──────────────────────┬──────────────────────┐
 * │      Feature         │   Abstract Class     │      Interface       │
 * ├──────────────────────┼──────────────────────┼──────────────────────┤
 * │ Keyword              │ abstract class       │ interface            │
 * │ Object creation      │ ❌ Cannot            │ ❌ Cannot            │
 * │ Methods              │ Abstract + Concrete  │ Abstract + default   │
 * │ Variables            │ Any type             │ public static final  │
 * │ Constructor          │ ✅ Yes               │ ❌ No                │
 * │ Multiple Inheritance │ ❌ No (single only)  │ ✅ Yes (multiple)    │
 * │ extends/implements   │ extends              │ implements           │
 * │ Access Modifiers     │ All allowed          │ public only (methods)│
 * │ Use case             │ "IS-A" with shared   │ "CAN-DO" capability  │
 * │                      │ state/code           │ contract             │
 * └──────────────────────┴──────────────────────┴──────────────────────┘
 * 
 * SIMPLE RULE:
 * - Abstract class: Jab classes me COMMON CODE + STATE share karna ho.
 * - Interface: Jab sirf CONTRACT define karna ho (unrelated classes implement kar sakein).
 * 
 * ========================================================================
 * 5. UPCASTING & DOWNCASTING (Object Type Casting)
 * ========================================================================
 * 
 * UPCASTING (Child -> Parent reference):
 * - Implicit (automatic). Safe hai.
 * - Parent ref = new Child(); // Child object ko Parent type me refer karna.
 * - Sirf parent ke methods accessible hain (compile-time check).
 * - But child ke OVERRIDDEN methods ACTUALLY chalte hain (run-time polymorphism!).
 * 
 * DOWNCASTING (Parent reference -> Child type):
 * - Explicit (manual). RISKY hai — ClassCastException aa sakta hai!
 * - Child ref = (Child) parentRef; // Parent reference ko wapas Child me cast karna.
 * - Tab hi safe hai jab original object ACTUALLY child ka ho.
 * - Hamesha `instanceof` check karo pehle!
 * 
 * instanceof OPERATOR:
 * - Check karta hai ki koi object kisi class/interface ka instance hai ya nahi.
 * - Syntax: object instanceof ClassName -> boolean
 * - JAVA 16+ Pattern Matching: if (obj instanceof String s) { // use s directly }
 * 
 * ========================================================================
 * 6. ANONYMOUS INNER CLASSES & LAMBDA (Preview)
 * ========================================================================
 * - Anonymous class = bina naam ki class. Interface/abstract class ko on-the-spot implement karna.
 * - Lambda = anonymous class ka shortcut (sirf Functional Interfaces ke liye, Java 8+).
 * 
 * ========================================================================
 * 7. PACKAGES (Telusko)
 * ========================================================================
 * - Package = folder structure jo related classes ko GROUP karti hai.
 * - Purpose: Name conflicts avoid karna (two classes same name, different packages),
 *   access control, aur code organization.
 * 
 * CREATING A PACKAGE:
 * - Syntax: package com.telusko.app;  // FIRST statement of the file (before imports)
 * - Convention: Reversed domain name → com.telusko.app, com.telusko.service
 * - Directory structure MUST match package name:
 *   com/telusko/app/MyClass.java
 * 
 * IMPORTING:
 * - import com.telusko.app.MyClass;     // Import specific class
 * - import com.telusko.app.*;           // Import ALL classes from package (not sub-packages!)
 * - java.lang.* is AUTOMATICALLY imported (String, System, Math etc.)
 * 
 * ACCESS ACROSS PACKAGES:
 * ┌──────────────┬───────────────────────────────────────────────────────┐
 * │  Modifier    │ Accessible from other package?                        │
 * ├──────────────┼───────────────────────────────────────────────────────┤
 * │ public       │ ✅ Yes — fully accessible                            │
 * │ protected    │ ✅ Only in child class (via inheritance)              │
 * │ default      │ ❌ No — only within same package                     │
 * │ private      │ ❌ No — only within same class                       │
 * └──────────────┴───────────────────────────────────────────────────────┘
 * 
 * BUILT-IN PACKAGES:
 * - java.lang  → String, Math, System, Object, Thread (auto-imported)
 * - java.util  → Collections, ArrayList, HashMap, Scanner, Date
 * - java.io    → File, InputStream, OutputStream, Reader, Writer
 * - java.sql   → Connection, Statement, ResultSet (JDBC)
 * - java.time  → LocalDate, LocalTime, LocalDateTime (Java 8+)
 * 
 * ========================================================================
 * 8. INNER CLASSES (Detailed — Telusko)
 * ========================================================================
 * - Inner class = class ke andar class. Logical grouping ke liye.
 * - Outer class ke private members ko bhi access kar sakti hai.
 * 
 * 4 TYPES:
 * 
 * a) MEMBER INNER CLASS (Non-static nested class):
 *    - Outer class ke instance ke sath tied hai.
 *    - Create karne ke liye outer object chahiye: Outer.Inner obj = outer.new Inner();
 *    - Outer class ke ALL members (including private) access kar sakti hai.
 * 
 * b) STATIC INNER CLASS (Static nested class):
 *    - `static` keyword lagta hai. Outer class ka object NAHI chahiye.
 *    - Create: Outer.StaticInner obj = new Outer.StaticInner();
 *    - Sirf outer class ke STATIC members access kar sakti hai.
 * 
 * c) LOCAL INNER CLASS:
 *    - Method ke ANDAR defined hoti hai.
 *    - Sirf usi method ke scope me accessible hai (bahar se nahi).
 *    - Method ke local variables jo effectively final hain, unhe access kar sakti hai.
 * 
 * d) ANONYMOUS INNER CLASS:
 *    - Bina naam ki class. On-the-spot interface/abstract class implement karna.
 *    - Lambda expressions ka predecessor (Java 8 se pehle yahi use hota tha).
 *    - Syntax: new InterfaceName() { @Override ... };
 * 
 * ========================================================================
 * 9. RECORD CLASSES (Java 16+ — Telusko)
 * ========================================================================
 * - Record = immutable data carrier class ka SHORTCUT.
 * - Problem: Simple data hold karne ke liye class banao toh boilerplate bohot hota hai
 *   (constructor, getters, toString, equals, hashCode — sab manually likhna padta hai).
 * - Solution: `record` keyword se sab AUTOMATICALLY generate hota hai!
 * 
 * SYNTAX:
 *   record Point(int x, int y) {}
 *   // Ye AUTOMATICALLY generate karta hai:
 *   // - private final fields (x, y)
 *   // - Constructor: Point(int x, int y)
 *   // - Getters: x(), y() (NOT getX()!)
 *   // - toString(): Point[x=5, y=10]
 *   // - equals() and hashCode() based on all fields
 * 
 * RULES:
 * - Fields are FINAL (immutable — set once in constructor, no setters).
 * - Cannot extend another class (implicitly extends java.lang.Record).
 * - CAN implement interfaces.
 * - CAN have static fields/methods, instance methods, and custom constructors.
 * - CANNOT have instance fields beyond the record components.
 * 
 * ========================================================================
 * 10. SEALED CLASSES (Java 17+ — Telusko)
 * ========================================================================
 * - Sealed class = inheritance RESTRICT karti hai. Sirf SPECIFIED classes extend kar sakti hain.
 * - Problem: Abstract class / interface ko koi bhi extend/implement kar sakta hai.
 *   Kabhi kabhi control chahiye ki KON extend kare.
 * - Solution: `sealed` keyword + `permits` clause.
 * 
 * SYNTAX:
 *   sealed class Shape permits Circle, Rectangle, Triangle {}
 *   // Ab SIRF Circle, Rectangle, Triangle hi Shape extend kar sakti hain.
 *   // Koi bhi nayi class Shape extend nahi kar sakti!
 * 
 * PERMITTED SUBCLASS RULES:
 * - Subclass MUST be one of: final, sealed, or non-sealed.
 *   - final: Aur koi extend nahi kar sakta (chain ends).
 *   - sealed: Aur restrict karta hai (chain continues).
 *   - non-sealed: Koi bhi extend kar sakta hai (chain opens up).
 * - Permitted classes MUST be in the same package (or module).
 * 
 * USE CASE:
 * - Pattern matching (Java 17+): switch expressions me sealed hierarchy use karna
 *   taaki compiler guarantee de sake ki saare cases covered hain.
 */

// ========== ABSTRACT CLASS EXAMPLE ==========
abstract class Shape {
    String color;

    // Constructor (abstract class me constructor ho sakta hai)
    Shape(String color) {
        this.color = color;
    }

    // Abstract method — NO BODY (child me override karna must hai)
    abstract double area();

    // Concrete method — body hai (common code shared by all shapes)
    void displayInfo() {
        System.out.println(color + " shape with area = " + area());
    }
}

class Circle extends Shape {
    double radius;

    Circle(String color, double radius) {
        super(color); // Call abstract class constructor
        this.radius = radius;
    }

    @Override
    double area() { // Must override abstract method
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    double width, height;

    Rectangle(String color, double w, double h) {
        super(color);
        this.width = w;
        this.height = h;
    }

    @Override
    double area() {
        return width * height;
    }
}

// ========== INTERFACE EXAMPLES ==========
interface Drawable {
    void draw(); // public abstract by default

    // Default method (Java 8+) — has body, override optional
    default void render() {
        System.out.println("Rendering with default engine...");
    }

    // Static method (Java 8+) — called via interface name
    static String getVersion() {
        return "Drawable v2.0";
    }
}

interface Resizable {
    void resize(double factor);
}

// Multiple interfaces implemented
class Canvas implements Drawable, Resizable {
    String name;

    Canvas(String name) {
        this.name = name;
    }

    @Override
    public void draw() {
        System.out.println("Drawing canvas: " + name);
    }

    @Override
    public void resize(double factor) {
        System.out.println("Resizing " + name + " by factor " + factor);
    }

    @Override
    public void render() { // Override default method (optional)
        System.out.println("Rendering " + name + " with custom GPU engine! 🚀");
    }
}

// ========== FUNCTIONAL INTERFACE EXAMPLE ==========
@FunctionalInterface
interface MathOperation {
    int operate(int a, int b); // Single abstract method -> Functional Interface
}

// ========== UPCASTING/DOWNCASTING EXAMPLE ==========
class Animal {
    void eat() { System.out.println("Animal is eating"); }
}

class Dog extends Animal {
    void bark() { System.out.println("Dog is barking 🐕"); }

    @Override
    void eat() { System.out.println("Dog is eating bones 🦴"); }
}

class Cat extends Animal {
    void meow() { System.out.println("Cat is meowing 🐱"); }

    @Override
    void eat() { System.out.println("Cat is eating fish 🐟"); }
}

// ========== INNER CLASSES EXAMPLES ==========
class OuterClass {
    private String outerSecret = "Outer's private secret 🔐";
    static String outerStatic = "Outer's static data";

    // a) MEMBER INNER CLASS (Non-static) — needs outer object
    class MemberInner {
        void showSecret() {
            // Can access outer's PRIVATE members!
            System.out.println("Member Inner accessing: " + outerSecret);
        }
    }

    // b) STATIC INNER CLASS — no outer object needed
    static class StaticInner {
        void showStatic() {
            // Can only access outer's STATIC members
            System.out.println("Static Inner accessing: " + outerStatic);
            // System.out.println(outerSecret); // ❌ ERROR! Can't access non-static
        }
    }

    // c) LOCAL INNER CLASS — defined inside a method
    void methodWithLocalClass() {
        final String localVar = "I'm local"; // must be effectively final

        class LocalInner {
            void display() {
                System.out.println("Local Inner: " + localVar);
                System.out.println("Local Inner also sees: " + outerSecret);
            }
        }

        LocalInner local = new LocalInner();
        local.display();
        // LocalInner is NOT accessible outside this method
    }
}

// ========== RECORD CLASS EXAMPLE (Java 16+) ==========
// Instead of writing a full class with constructor, getters, toString, equals, hashCode:
record StudentRecord(String name, int age, String course) {
    // Custom compact constructor (validation)
    StudentRecord {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative: " + age);
        // No need to write this.name = name etc. — auto-assigned!
    }

    // Custom instance method (allowed)
    String greeting() {
        return "Hi, I'm " + name + " studying " + course + "!";
    }

    // Static method (allowed)
    static StudentRecord createDefault() {
        return new StudentRecord("Unknown", 0, "Undeclared");
    }
}

// ========== SEALED CLASS EXAMPLE (Java 17+) ==========
// Only Circle2D, Rectangle2D, Triangle2D can extend Shape2D. Nobody else!
sealed class Shape2D permits Circle2D, Rectangle2D, Triangle2D {
    String name;
    Shape2D(String name) { this.name = name; }
}

// final → cannot be extended further
final class Circle2D extends Shape2D {
    double radius;
    Circle2D(double radius) {
        super("Circle");
        this.radius = radius;
    }
    double area() { return Math.PI * radius * radius; }
}

// final → chain ends here
final class Rectangle2D extends Shape2D {
    double w, h;
    Rectangle2D(double w, double h) {
        super("Rectangle");
        this.w = w;
        this.h = h;
    }
    double area() { return w * h; }
}

// non-sealed → anyone can extend Triangle2D (opens up the chain)
non-sealed class Triangle2D extends Shape2D {
    double base, height;
    Triangle2D(double base, double height) {
        super("Triangle");
        this.base = base;
        this.height = height;
    }
    double area() { return 0.5 * base * height; }
}

// Since Triangle2D is non-sealed, this is ALLOWED:
class EquilateralTriangle extends Triangle2D {
    EquilateralTriangle(double side) {
        super(side, side * Math.sqrt(3) / 2);
    }
}

// class Hexagon extends Shape2D {} // ❌ COMPILE ERROR! Not in permits list.

// ========== MAIN CLASS ==========
public class Core_Java_OOPs_Advanced {
    public static void main(String[] args) {

        // ===== 1. ABSTRACT CLASS =====
        System.out.println("===== Abstract Class =====");

        // Shape shape = new Shape("Red"); // ERROR! Cannot instantiate abstract class!

        Circle c = new Circle("Red", 5.0);
        Rectangle r = new Rectangle("Blue", 4.0, 6.0);

        c.displayInfo(); // Uses concrete method from Shape + overridden area()
        r.displayInfo();

        // Polymorphism with abstract class reference
        Shape[] shapes = { c, r, new Circle("Green", 3.0) };
        System.out.println("\nAll shapes:");
        for (Shape s : shapes) {
            s.displayInfo(); // Correct area() called for each (runtime polymorphism)
        }

        // ===== 2. INTERFACES =====
        System.out.println("\n===== Interfaces =====");

        Canvas canvas = new Canvas("My Artwork");
        canvas.draw();    // From Drawable
        canvas.resize(2.0); // From Resizable
        canvas.render();  // Overridden default method

        // Static method via interface name
        System.out.println("Version: " + Drawable.getVersion());

        // Interface reference (polymorphism)
        Drawable d = canvas; // Upcasting to interface type
        d.draw(); // Only Drawable methods accessible via this reference

        // ===== 3. FUNCTIONAL INTERFACE & LAMBDA =====
        System.out.println("\n===== Functional Interface & Lambda =====");

        // --- Anonymous Inner Class (old way) ---
        MathOperation addOld = new MathOperation() {
            @Override
            public int operate(int a, int b) {
                return a + b;
            }
        };
        System.out.println("Anonymous class: 5 + 3 = " + addOld.operate(5, 3));

        // --- Lambda Expression (new way — Java 8+) ---
        MathOperation addLambda = (a, b) -> a + b;
        MathOperation subLambda = (a, b) -> a - b;
        MathOperation mulLambda = (a, b) -> a * b;

        System.out.println("Lambda add: 5 + 3 = " + addLambda.operate(5, 3));
        System.out.println("Lambda sub: 5 - 3 = " + subLambda.operate(5, 3));
        System.out.println("Lambda mul: 5 * 3 = " + mulLambda.operate(5, 3));

        // ===== 4. UPCASTING & DOWNCASTING =====
        System.out.println("\n===== Upcasting & Downcasting =====");

        // --- UPCASTING (Child -> Parent ref) — Implicit, Safe ---
        Animal myDog = new Dog(); // Dog object, Animal reference (upcasted)
        myDog.eat(); // "Dog is eating bones" (overridden method — runtime polymorphism!)
        // myDog.bark(); // ERROR! bark() is not in Animal class. Reference type matters at compile-time.

        // --- DOWNCASTING (Parent ref -> Child type) — Explicit, Risky ---
        // Need to cast back to access child-specific methods
        if (myDog instanceof Dog) { // ALWAYS check with instanceof first!
            Dog castedDog = (Dog) myDog; // Safe downcast
            castedDog.bark(); // Now bark() is accessible
        }

        // --- instanceof operator ---
        System.out.println("\n--- instanceof ---");
        Animal[] animals = { new Dog(), new Cat(), new Dog() };
        for (Animal animal : animals) {
            if (animal instanceof Dog) {
                ((Dog) animal).bark(); // Safe downcast after instanceof
            } else if (animal instanceof Cat) {
                ((Cat) animal).meow();
            }
        }

        // --- Java 16+ Pattern Matching instanceof ---
        System.out.println("\n--- Pattern Matching instanceof (Java 16+) ---");
        Animal someAnimal = new Cat();
        if (someAnimal instanceof Cat myCat) { // Cast + assign in one step!
            myCat.meow(); // Direct use, no explicit cast needed
        }

        // --- ClassCastException example (what NOT to do) ---
        System.out.println("\n--- ClassCastException Prevention ---");
        Animal anAnimal = new Cat();
        // Dog wrongCast = (Dog) anAnimal; // RUNTIME ERROR: ClassCastException!
        // Cat is NOT a Dog, even though both are Animals.
        if (anAnimal instanceof Dog) {
            System.out.println("It's a Dog!"); // This won't execute
        } else {
            System.out.println("Not a Dog! instanceof saved us from ClassCastException ✅");
        }

        // ===== 5. ACCESS MODIFIERS DEMO =====
        System.out.println("\n===== Access Modifiers =====");
        System.out.println("private   -> Same class only (strongest restriction)");
        System.out.println("default   -> Same package (no keyword needed)");
        System.out.println("protected -> Same package + child classes (any package)");
        System.out.println("public    -> Everywhere (no restriction)");
        System.out.println("Rule: Always use the MOST RESTRICTIVE modifier possible.");
        System.out.println("Encapsulation = fields private + public getters/setters.");

        // ===== 6. PACKAGES DEMO =====
        System.out.println("\n===== Packages =====");
        System.out.println("Package = folder structure to organize related classes.");
        System.out.println("Convention: reversed domain → com.telusko.app");
        System.out.println("");
        System.out.println("Creating: package com.telusko.service; (FIRST line of file)");
        System.out.println("Importing: import com.telusko.service.UserService;");
        System.out.println("Wildcard:  import com.telusko.service.*; (all classes, not sub-packages)");
        System.out.println("");
        System.out.println("Built-in packages:");
        System.out.println("  java.lang  → Auto-imported (String, Math, System, Object)");
        System.out.println("  java.util  → Collections, ArrayList, Scanner, HashMap");
        System.out.println("  java.io    → File, InputStream, BufferedReader");
        System.out.println("  java.sql   → Connection, PreparedStatement (JDBC)");
        System.out.println("  java.time  → LocalDate, LocalDateTime (Java 8+)");

        // ===== 7. INNER CLASSES =====
        System.out.println("\n===== Inner Classes =====");

        // a) MEMBER INNER CLASS — needs outer object
        System.out.println("--- Member Inner Class ---");
        OuterClass outer = new OuterClass();
        OuterClass.MemberInner memberInner = outer.new MemberInner(); // outer.new!
        memberInner.showSecret();

        // b) STATIC INNER CLASS — no outer object needed
        System.out.println("\n--- Static Inner Class ---");
        OuterClass.StaticInner staticInner = new OuterClass.StaticInner(); // no outer needed
        staticInner.showStatic();

        // c) LOCAL INNER CLASS — inside a method
        System.out.println("\n--- Local Inner Class ---");
        outer.methodWithLocalClass();

        // d) ANONYMOUS INNER CLASS — already shown in Lambda section above
        System.out.println("\n--- Anonymous Inner Class ---");
        Drawable anonymousDrawable = new Drawable() {
            @Override
            public void draw() {
                System.out.println("Anonymous class drawing! 🎨");
            }
        };
        anonymousDrawable.draw();
        anonymousDrawable.render(); // default method still works

        // ===== 8. RECORD CLASSES (Java 16+) =====
        System.out.println("\n===== Record Classes (Java 16+) =====");

        StudentRecord s1 = new StudentRecord("Navin", 35, "Java");
        StudentRecord s2 = new StudentRecord("Navin", 35, "Java");
        StudentRecord s3 = new StudentRecord("Siddharth", 22, "CS");

        // Auto-generated toString()
        System.out.println("s1: " + s1); // StudentRecord[name=Navin, age=35, course=Java]

        // Auto-generated getters (NOT getX(), just x()!)
        System.out.println("Name: " + s1.name() + ", Age: " + s1.age());

        // Auto-generated equals() — content-based
        System.out.println("s1.equals(s2): " + s1.equals(s2)); // true (same content)
        System.out.println("s1.equals(s3): " + s1.equals(s3)); // false

        // Auto-generated hashCode()
        System.out.println("s1.hashCode() == s2.hashCode(): " + (s1.hashCode() == s2.hashCode())); // true

        // Custom method
        System.out.println(s3.greeting());

        // Static factory method
        StudentRecord defaultStudent = StudentRecord.createDefault();
        System.out.println("Default: " + defaultStudent);

        // Immutable — NO setters!
        // s1.name = "Changed"; // ❌ COMPILE ERROR! Fields are final.

        // ===== 9. SEALED CLASSES (Java 17+) =====
        System.out.println("\n===== Sealed Classes (Java 17+) =====");

        Circle2D circle = new Circle2D(5);
        Rectangle2D rect = new Rectangle2D(4, 6);
        Triangle2D tri = new Triangle2D(10, 5);
        EquilateralTriangle eqTri = new EquilateralTriangle(6);

        System.out.println(circle.name + " area: " + circle.area());
        System.out.println(rect.name + " area: " + rect.area());
        System.out.println(tri.name + " area: " + tri.area());
        System.out.println("Equilateral " + eqTri.name + " area: " + eqTri.area());

        System.out.println("\nSealed hierarchy:");
        System.out.println("  sealed Shape2D permits Circle2D, Rectangle2D, Triangle2D");
        System.out.println("  → Circle2D is final (nobody can extend)");
        System.out.println("  → Rectangle2D is final (nobody can extend)");
        System.out.println("  → Triangle2D is non-sealed (EquilateralTriangle CAN extend)");
        System.out.println("  → Hexagon extends Shape2D? ❌ NOT allowed (not in permits)");

        // Pattern matching with sealed classes
        Shape2D shape = new Circle2D(7);
        // Compiler knows ALL possible subtypes — exhaustive switch possible!
        String desc = switch (shape) {
            case Circle2D ci    -> "Circle with radius " + ci.radius;
            case Rectangle2D re -> "Rectangle " + re.w + "x" + re.h;
            case Triangle2D tr  -> "Triangle base=" + tr.base + " height=" + tr.height;
        };
        System.out.println("Pattern match: " + desc);

        System.out.println("\n✅ All Advanced OOPs concepts covered!");
    }
}
