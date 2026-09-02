/**
 * ========================================================================
 * 03. ADVANCE JAVA (EXCEPTIONS, COLLECTIONS, THREADS, LAMBDAS, STREAMS)
 * ========================================================================
 * NOTES:
 * - Ye topics har enterprise application ka backbone hain. Inke bina proper app nahi banti.
 * 
 * ========================================================================
 * 1. EXCEPTION HANDLING (DETAILED)
 * ========================================================================
 * - Errors jo program crash kar sakte hain unko gracefully handle karna.
 * - Hierarchy: Throwable -> Error (Out of memory, stack overflow - we don't handle) & Exception (We handle).
 * - Checked Exceptions: Compile-time pe pata chal jata hai (e.g., IOException, SQLException). Inko handle karna must hai (try-catch ya throws).
 * - Unchecked Exceptions: Run-time pe aate hain (e.g., NullPointerException, ArithmeticException). Inko explicitly handle karna zaroori nahi hota, par best practice hai code safe likho.
 * - Blocks: try (risky code), catch (handle error), finally (hamesha execute hoga, resource closing ke liye).
 * 
 * throw vs throws:
 * - throw: Manually ek exception OBJECT create karke fenkna. Method ke ANDAR use hota hai.
 *   Syntax: throw new ArithmeticException("Cannot divide by zero");
 * - throws: Method SIGNATURE me declare karna ki "ye method ye exception fenk SAKTA hai, caller handle kare."
 *   Syntax: public void readFile() throws IOException { ... }
 * 
 * try-with-resources (Java 7+):
 * - Problem: finally block me resources (file, connection) close karna bhool sakte ho -> Resource Leak!
 * - Solution: try(Resource r = new Resource()) { ... } -> Java AUTOMATICALLY close karega (finally ki zaroorat nahi).
 * - Rule: Resource must implement `AutoCloseable` interface.
 * - Example: try (BufferedReader br = new BufferedReader(new FileReader("test.txt"))) { ... }
 * 
 * Exception Chaining:
 * - Ek exception ko dusre exception me wrap karna taaki root cause bhi pata chale.
 * - Syntax: throw new ServiceException("DB failed", originalException);
 * - Original cause access: e.getCause()
 * 
 * ========================================================================
 * 2. MULTITHREADING (DETAILED)
 * ========================================================================
 * - Process: Ek program jo run ho raha hai.
 * - Thread: Process ke andar ek chota execution unit. Multithreading matlab multiple threads parallel (concurrently) kaam kar rahe hain.
 * - Thread create karne ke 2 ways:
 *   a) Extend `Thread` class.
 *   b) Implement `Runnable` interface (Best practice kyunki Java me multiple inheritance nahi hoti, so aap dusri class ko extend karne ke liye free rehte ho).
 * - Synchronization: Jab do threads same resource (e.g., ek variable) ko ek sath access karein toh data corrupt (Race Condition) ho sakta hai. `synchronized` keyword ek baar me ek hi thread ko allow karta hai.
 * 
 * THREAD LIFECYCLE (States):
 * ┌─────────┐    start()    ┌──────────┐   scheduler   ┌─────────┐
 * │   NEW   │ ────────────> │ RUNNABLE │ ────────────> │ RUNNING │
 * └─────────┘               └──────────┘               └────┬────┘
 *                                                           │
 *                  ┌────────────────────────────────────────┤
 *                  │              │              │          │
 *           sleep()/wait()   synchronized    I/O block   run() ends
 *                  │              │              │          │
 *           ┌──────▼───┐  ┌──────▼───┐  ┌──────▼───┐  ┌───▼────────┐
 *           │ WAITING/  │  │ BLOCKED  │  │ BLOCKED  │  │ TERMINATED │
 *           │ TIMED_WAIT│  │(for lock)│  │ (for I/O)│  │  (DEAD)    │
 *           └───────────┘  └──────────┘  └──────────┘  └────────────┘
 * 
 * IMPORTANT THREAD METHODS:
 * - Thread.sleep(ms): Current thread ko specified milliseconds ke liye pause (TIMED_WAITING state).
 * - t.join(): Current thread WAIT karega jab tak thread `t` complete na ho jaye. Sequential execution force karne ke liye.
 * - Thread.yield(): Current thread apna turn chhod deta hai (hint to scheduler). Guaranteed nahi hai ki switch hoga.
 * - t.setPriority(1-10): Thread priority set karna (MIN=1, NORM=5, MAX=10). OS scheduler decide karta hai.
 * - t.setDaemon(true): Background thread (like GC). Main thread khatam hote hi daemon bhi mar jata hai.
 * 
 * ========================================================================
 * 3. COLLECTIONS FRAMEWORK (DETAILED)
 * ========================================================================
 * - Arrays fix size ke hote hain. Collections dynamic size aur readymade data structures provide karte hain.
 * - Iterable -> Collection
 * 
 * a) List Interface (Ordered, allows duplicates):
 *    - ArrayList: Fast for searching/reading (O(1) get). Slow insertion/deletion middle me (O(n) shift). Dynamic array under the hood.
 *    - LinkedList: Fast for insertion/deletion (O(1)). Slow for searching (O(n)). Doubly linked list under the hood.
 *    - Vector: Like ArrayList but thread-safe (synchronized). Slow due to locking. Legacy class.
 * 
 * b) Set Interface (Unordered, NO duplicates):
 *    - HashSet: Sabse fast, order maintain nahi karta (uses HashMap internally).
 *    - LinkedHashSet: Insertion order maintain karta hai.
 *    - TreeSet: Sorted (ascending order) rakhta hai. Uses Red-Black tree.
 * 
 * c) Map Interface (Key-Value pairs. Keys must be unique):
 *    - HashMap: Fast key lookup (O(1) average), unordered.
 *    - LinkedHashMap: Insertion order maintain karta hai.
 *    - TreeMap: Keys sorted order me rehti hain.
 *    - Hashtable: Like HashMap but thread-safe. Legacy class.
 * 
 * d) Queue Interface (FIFO — First In, First Out):
 *    - PriorityQueue: Elements natural ordering ya Comparator ke hisaab se sorted rehte hain.
 *    - LinkedList (as Queue): Queue/Deque dono ki tarah kaam karta hai.
 * 
 * ITERATOR:
 * - Collections pe manually iterate karne ka tarika.
 * - Iterator<String> it = list.iterator();
 * - while(it.hasNext()) { String s = it.next(); }
 * - it.remove() -> Safe way to remove elements during iteration (for-each me ConcurrentModificationException aata hai).
 * 
 * COMPARABLE vs COMPARATOR (⭐ INTERVIEW FAVOURITE):
 * - Comparable (java.lang): Class KHUD define karti hai apni natural ordering.
 *   - Interface: implements Comparable<T>, method: compareTo(T o)
 *   - Ek hi tarike se sort ho sakti hai (e.g., Student by roll number).
 *   - Example: Collections.sort(list); // uses compareTo()
 * 
 * - Comparator (java.util): BAHAR se custom sorting logic dena.
 *   - Interface: implements Comparator<T>, method: compare(T o1, T o2)
 *   - Multiple sorting strategies (by name, by age, by marks).
 *   - Example: Collections.sort(list, new NameComparator());
 *   - Lambda: Collections.sort(list, (a, b) -> a.getName().compareTo(b.getName()));
 * 
 * ========================================================================
 * 4. LAMBDA EXPRESSIONS (Java 8+) — DETAILED
 * ========================================================================
 * - Lambda = Anonymous function. Functional Interface ka short implementation.
 * - Syntax: (parameters) -> expression   OR   (parameters) -> { statements; }
 * - No parameters: () -> System.out.println("Hello")
 * - One parameter: x -> x * x   (parentheses optional for single param)
 * - Multiple params: (a, b) -> a + b
 * - Multi-line: (a, b) -> { int sum = a + b; return sum; }
 * 
 * FUNCTIONAL INTERFACES (Java 8 — java.util.function):
 * ┌────────────────┬─────────────────┬─────────────────┬────────────────────────┐
 * │   Interface    │   Method        │  Input -> Output│  Use Case              │
 * ├────────────────┼─────────────────┼─────────────────┼────────────────────────┤
 * │ Predicate<T>   │ test(T t)       │ T -> boolean    │ Filtering, conditions  │
 * │ Function<T,R>  │ apply(T t)      │ T -> R          │ Transforming data      │
 * │ Consumer<T>    │ accept(T t)     │ T -> void       │ Performing actions     │
 * │ Supplier<T>    │ get()           │ () -> T         │ Providing/generating   │
 * │ BiFunction<T,U,R>│ apply(T,U)    │ (T,U) -> R      │ Two input transform    │
 * │ UnaryOperator<T>│ apply(T t)     │ T -> T          │ Same type transform    │
 * │ BinaryOperator<T>│ apply(T,T)    │ (T,T) -> T      │ Two same type -> one   │
 * └────────────────┴─────────────────┴─────────────────┴────────────────────────┘
 * 
 * METHOD REFERENCES (Java 8+):
 * - Lambda ka aur bhi chhota form jab sirf ek method call kar rahe ho.
 * - 4 Types:
 *   a) Static method: ClassName::staticMethod     (e.g., Math::max)
 *   b) Instance method (specific): obj::instanceMethod  (e.g., System.out::println)
 *   c) Instance method (arbitrary): ClassName::instanceMethod (e.g., String::toUpperCase)
 *   d) Constructor: ClassName::new                 (e.g., ArrayList::new)
 * 
 * ========================================================================
 * 5. STREAMS API (Java 8+) — DETAILED
 * ========================================================================
 * - Collections par declarative operations (filter, map, reduce) run karne ke liye. SQL jaisi queries lists pe lagane ke liye.
 * - Stream = data ka pipeline. Source -> Intermediate ops -> Terminal op.
 * - LAZY evaluation: Intermediate operations tab tak execute nahi hote jab tak terminal operation na aaye.
 * - Streams reusable NAHI hain. Ek baar terminal op ke baad naya stream banana padta hai.
 * 
 * INTERMEDIATE OPERATIONS (return Stream, lazy):
 * - filter(Predicate)  : Elements filter karna (jo condition pass kare wahi rakho)
 * - map(Function)      : Har element ko transform karna (e.g., string -> uppercase)
 * - flatMap(Function)  : Nested collections ko flat karna [[1,2],[3,4]] -> [1,2,3,4]
 * - sorted()           : Natural order ya custom Comparator se sort
 * - distinct()         : Duplicate remove karo
 * - limit(n)           : Pehle n elements lo
 * - skip(n)            : Pehle n elements skip karo
 * - peek(Consumer)     : Debugging ke liye — har element pe action karo but stream modify mat karo
 * 
 * TERMINAL OPERATIONS (trigger execution, return result):
 * - forEach(Consumer)  : Har element pe action (print etc.)
 * - collect(Collector) : Stream ko Collection me convert (toList, toSet, toMap, joining)
 * - count()            : Kitne elements hain
 * - reduce(identity, BinaryOperator): Sab elements ko ek value me fold karna (sum, max)
 * - findFirst()        : Pehla element (returns Optional)
 * - findAny()          : Koi bhi ek element (parallel streams me useful)
 * - anyMatch(Predicate): Koi bhi ek element condition match karta hai? (boolean)
 * - allMatch(Predicate): SAB elements condition match karte hain?
 * - noneMatch(Predicate): KONO BHI element match nahi karta?
 * - min(Comparator)    : Minimum element
 * - max(Comparator)    : Maximum element
 * - toArray()          : Stream to array
 * 
 * ========================================================================
 * 6. OPTIONAL CLASS (Java 8+)
 * ========================================================================
 * - Problem: NullPointerException Java ka sabse common error hai.
 * - Optional = ek container jo value hold KARTA HAI ya EMPTY hai. Null check ka elegant replacement.
 * - Factory methods:
 *   - Optional.of(value)        -> value null nahi honi chahiye (throws NPE if null)
 *   - Optional.ofNullable(value)-> null bhi ho sakti hai (safe)
 *   - Optional.empty()          -> Empty Optional
 * - Key methods:
 *   - isPresent()     -> true if value exists
 *   - isEmpty()       -> true if no value (Java 11+)
 *   - get()           -> value lo (throws NoSuchElementException if empty!)
 *   - orElse(default) -> value lo, nahi hai toh default value
 *   - orElseThrow()   -> value lo, nahi hai toh exception fenko
 *   - ifPresent(Consumer) -> agar value hai toh action karo
 *   - map(Function)   -> value transform karo (returns Optional)
 *   - filter(Predicate) -> condition check karo
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;

// Custom Exception Example
class InvalidAgeException extends Exception {
    public InvalidAgeException(String msg) {
        super(msg);
    }
}

// Runnable implementation for Threading
class MyTask implements Runnable {
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(Thread.currentThread().getName() + " -> iteration " + i);
            try {
                Thread.sleep(500); // Pause 500ms between iterations
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted!");
            }
        }
    }
}

// Comparable implementation (Natural ordering)
class StudentRecord implements Comparable<StudentRecord> {
    String name;
    int marks;

    StudentRecord(String name, int marks) {
        this.name = name;
        this.marks = marks;
    }

    // Natural ordering: by marks (ascending)
    @Override
    public int compareTo(StudentRecord other) {
        return this.marks - other.marks; // negative = this < other
    }

    @Override
    public String toString() {
        return name + "(" + marks + ")";
    }
}

public class Advance_Java_Concepts {
    
    // Method throws custom checked exception
    public static void validateAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Not eligible for voting!");
        }
        System.out.println("Eligible for voting.");
    }

    public static void main(String[] args) {
        
        // ===== 1. EXCEPTION HANDLING =====
        System.out.println("===== Exception Handling =====");
        
        // --- try-catch-finally ---
        try {
            validateAge(16);
        } catch (InvalidAgeException e) {
            System.out.println("Caught Error: " + e.getMessage());
        } finally {
            System.out.println("Cleanup actions done here (always runs).");
        }

        // --- throw vs throws demo ---
        // throw -> fenko exception INSIDE method
        // throws -> declare karo METHOD SIGNATURE me ki exception aa sakta hai
        try {
            throw new ArithmeticException("Manual throw demo!"); // throw keyword
        } catch (ArithmeticException e) {
            System.out.println("Caught thrown exception: " + e.getMessage());
        }

        // --- try-with-resources (Auto-close) ---
        System.out.println("\n--- Try-With-Resources ---");
        // try (BufferedReader br = new BufferedReader(new FileReader("test.txt"))) {
        //     String line = br.readLine(); // Resource auto-closed after this block!
        // } catch (IOException e) { ... }
        System.out.println("Resources implementing AutoCloseable are closed automatically.");

        // --- Exception Chaining ---
        try {
            try {
                int result = 10 / 0; // Original exception
            } catch (ArithmeticException e) {
                // Wrap original exception in a new one
                RuntimeException chained = new RuntimeException("Calculation failed");
                chained.initCause(e); // Chain the original cause
                throw chained;
            }
        } catch (RuntimeException e) {
            System.out.println("\nChained Exception: " + e.getMessage());
            System.out.println("Root Cause: " + e.getCause().getMessage());
        }

        // ===== 2. THREADS =====
        System.out.println("\n===== Threads =====");

        // --- Creating threads ---
        Thread t1 = new Thread(new MyTask(), "Worker-1");
        Thread t2 = new Thread(new MyTask(), "Worker-2");
        
        t1.start(); // Starts async execution

        // --- join(): Wait for t1 to finish before starting t2 ---
        try {
            t1.join(); // Main thread WAITS for t1 to complete
        } catch (InterruptedException e) {
            System.out.println("Join interrupted!");
        }
        System.out.println("Worker-1 finished. Starting Worker-2...");
        t2.start();

        try { t2.join(); } catch (InterruptedException e) {} // Wait for t2

        // --- Thread states ---
        System.out.println("\nThread States: NEW -> RUNNABLE -> RUNNING -> (BLOCKED/WAITING) -> TERMINATED");
        System.out.println("t1 state now: " + t1.getState()); // TERMINATED

        // ===== 3. COLLECTIONS =====
        System.out.println("\n===== Collections =====");

        // --- ArrayList ---
        List<String> frameworks = new ArrayList<>();
        frameworks.add("Spring");
        frameworks.add("Hibernate");
        frameworks.add("Struts");
        frameworks.add("Quarkus");
        System.out.println("Frameworks: " + frameworks);

        // --- Iterator (safe removal during iteration) ---
        System.out.println("\n--- Iterator ---");
        Iterator<String> it = frameworks.iterator();
        while (it.hasNext()) {
            String fw = it.next();
            if (fw.equals("Struts")) {
                it.remove(); // Safe removal (for-each me ConcurrentModificationException aata!)
                System.out.println("Removed: " + fw);
            }
        }
        System.out.println("After removal: " + frameworks);

        // --- Map ---
        Map<String, String> languages = new HashMap<>();
        languages.put("JS", "JavaScript");
        languages.put("PY", "Python");
        languages.put("JV", "Java");
        System.out.println("\nLanguages Map: " + languages);

        // Iterating a Map
        for (Map.Entry<String, String> entry : languages.entrySet()) {
            System.out.println("  " + entry.getKey() + " -> " + entry.getValue());
        }

        // --- Comparable vs Comparator ---
        System.out.println("\n--- Comparable vs Comparator ---");
        List<StudentRecord> students = new ArrayList<>();
        students.add(new StudentRecord("Navin", 88));
        students.add(new StudentRecord("Sidd", 95));
        students.add(new StudentRecord("Rahul", 72));

        // Comparable: Natural ordering (by marks)
        Collections.sort(students); // Uses compareTo()
        System.out.println("Sorted by marks (Comparable): " + students);

        // Comparator: Custom ordering (by name)
        students.sort(Comparator.comparing(s -> s.name)); // Lambda Comparator
        System.out.println("Sorted by name (Comparator):  " + students);

        // Reverse order
        students.sort(Comparator.comparingInt((StudentRecord s) -> s.marks).reversed());
        System.out.println("Sorted by marks DESC:         " + students);

        // ===== 4. LAMBDA EXPRESSIONS =====
        System.out.println("\n===== Lambda Expressions =====");

        // --- Predicate<T>: T -> boolean (test) ---
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println("Is 4 even? " + isEven.test(4)); // true
        System.out.println("Is 7 even? " + isEven.test(7)); // false

        // Predicate chaining
        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isPositiveEven = isEven.and(isPositive);
        System.out.println("Is 4 positive even? " + isPositiveEven.test(4)); // true

        // --- Function<T, R>: T -> R (apply) ---
        Function<String, Integer> strLength = String::length; // Method reference
        System.out.println("\nLength of 'Telusko': " + strLength.apply("Telusko")); // 7

        // Function chaining
        Function<Integer, Integer> doubleIt = x -> x * 2;
        Function<Integer, Integer> addTen = x -> x + 10;
        Function<Integer, Integer> doubleThenAddTen = doubleIt.andThen(addTen);
        System.out.println("doubleIt(5).andThen(addTen) = " + doubleThenAddTen.apply(5)); // 20

        // --- Consumer<T>: T -> void (accept) ---
        Consumer<String> printer = System.out::println; // Method reference
        printer.accept("\nConsumer says: Hello from Lambda!");

        // --- Supplier<T>: () -> T (get) ---
        Supplier<Double> randomNum = Math::random; // Method reference
        System.out.println("Random number: " + randomNum.get());

        // --- Method References ---
        System.out.println("\n--- Method References ---");
        List<String> names = Arrays.asList("navin", "sidd", "rahul");
        // Lambda:        names.forEach(name -> System.out.println(name));
        // Method ref:    names.forEach(System.out::println);
        names.stream()
             .map(String::toUpperCase)       // Instance method ref (arbitrary object)
             .forEach(System.out::println);   // Instance method ref (specific object)

        // ===== 5. STREAMS API =====
        System.out.println("\n===== Streams API =====");

        List<Integer> numbers = Arrays.asList(5, 12, 3, 8, 21, 14, 7, 19, 2, 16);
        System.out.println("Original: " + numbers);

        // --- filter + map + collect ---
        List<Integer> evenDoubled = numbers.stream()
            .filter(n -> n % 2 == 0)       // Keep even numbers
            .map(n -> n * 2)               // Double them
            .sorted()                       // Sort ascending
            .collect(Collectors.toList());  // Collect to List
        System.out.println("Even numbers doubled & sorted: " + evenDoubled);

        // --- reduce (fold all elements into one) ---
        int sum = numbers.stream()
            .reduce(0, Integer::sum); // 0 is identity, Integer::sum is accumulator
        System.out.println("Sum of all: " + sum);

        Optional<Integer> max = numbers.stream()
            .reduce(Integer::max);
        System.out.println("Max value: " + max.orElse(0));

        // --- count, min, max ---
        long count = numbers.stream().filter(n -> n > 10).count();
        System.out.println("Numbers > 10: " + count);

        // --- findFirst ---
        Optional<Integer> firstEven = numbers.stream()
            .filter(n -> n % 2 == 0)
            .findFirst();
        System.out.println("First even: " + firstEven.orElse(-1));

        // --- anyMatch, allMatch, noneMatch ---
        boolean hasNegative = numbers.stream().anyMatch(n -> n < 0);
        boolean allPositive = numbers.stream().allMatch(n -> n > 0);
        System.out.println("Has negative? " + hasNegative + " | All positive? " + allPositive);

        // --- Collectors: joining, groupingBy ---
        List<String> techs = Arrays.asList("Java", "Spring", "Docker", "Java", "Spring");
        String joined = techs.stream()
            .distinct()
            .collect(Collectors.joining(", ")); // "Java, Spring, Docker"
        System.out.println("Joined: " + joined);

        // Group by string length
        Map<Integer, List<String>> groupedByLength = techs.stream()
            .distinct()
            .collect(Collectors.groupingBy(String::length));
        System.out.println("Grouped by length: " + groupedByLength);

        // --- forEach (terminal) ---
        System.out.println("\nforEach:");
        numbers.stream()
            .limit(5)        // Take first 5
            .skip(1)          // Skip first 1
            .forEach(n -> System.out.print(n + " ")); // 12 3 8 21
        System.out.println();

        // ===== 6. OPTIONAL =====
        System.out.println("\n===== Optional =====");

        // --- Creating Optional ---
        Optional<String> optName = Optional.of("Navin");
        Optional<String> optEmpty = Optional.empty();
        Optional<String> optNullable = Optional.ofNullable(null); // Safe with null

        // --- Using Optional (avoid NullPointerException) ---
        System.out.println("optName present? " + optName.isPresent());   // true
        System.out.println("optEmpty present? " + optEmpty.isPresent()); // false

        // orElse: default value agar empty hai
        String name = optEmpty.orElse("Guest");
        System.out.println("Name (orElse): " + name); // "Guest"

        // ifPresent: agar value hai toh action karo
        optName.ifPresent(n -> System.out.println("Welcome, " + n + "!"));

        // map + orElse: transform and provide default
        String upperName = optName
            .map(String::toUpperCase)
            .orElse("UNKNOWN");
        System.out.println("Uppercase: " + upperName); // "NAVIN"

        // filter: condition check on Optional value
        Optional<String> longName = optName.filter(n -> n.length() > 3);
        System.out.println("Name longer than 3? " + longName.isPresent()); // true (Navin=5)

        // orElseThrow: agar value nahi hai toh exception
        // String required = optEmpty.orElseThrow(() -> new RuntimeException("Value required!"));

        System.out.println("\n✅ Advanced Java complete! Next: Maven -> Spring -> Spring Boot");
    }
}

