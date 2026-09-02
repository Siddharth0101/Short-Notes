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
    }
}
