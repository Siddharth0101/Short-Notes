/**
 * ========================================================================
 * 02d. CORE JAVA - METHODS, CONSTRUCTORS, WRAPPERS & ENUMS [⚡ VISUAL]
 * ========================================================================
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
        System.out.println("===== Methods =====");

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
        System.out.println("\n===== Constructors =====");

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
        System.out.println("\n===== Wrapper Classes =====");

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
        System.out.println("\n===== Enums =====");

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
    }
}
