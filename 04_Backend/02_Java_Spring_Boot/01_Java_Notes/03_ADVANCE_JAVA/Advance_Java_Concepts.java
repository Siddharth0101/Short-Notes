/**
 * ## Quick revision
 *
 * - Checked exception — catch ya declare; unchecked — runtime contract failure ho sakti hai.
 * - `throw` — exception bhejo; `throws` — method contract mein declare karo.
 * - Try-with-resources — AutoCloseable resources reliably close karo.
 * - `finally` — cleanup; return/throw se original result mask mat karo.
 * - I/O — bytes ke liye streams; text ke liye charset-aware reader/writer.
 * - Path/Files — filesystem operations; missing file aur permission errors handle karo.
 * - `Instant` — timestamp; `LocalDate` — date; `ZonedDateTime` — timezone ke saath date/time.
 * - Exception handling — useful context do, secrets log mat karo, failure silently swallow mat karo.
 * - Lambda — functional interface ki implementation.
 * - Functional interface — ek abstract method wala contract.
 * - Stream — lazy data pipeline; terminal operation se execute hoti hai.
 * - `map` — transform; `filter` — select; `flatMap` — nested results flatten.
 * - `reduce` — associative accumulation; valid identity choose karo.
 * - `collect` — results ko collection/grouping mein jama karo.
 * - Stream reuse — terminal operation ke baad same stream reuse nahi.
 * - Side effects — pipeline mein shared mutable state avoid karo.
 * - Parallel stream — workload, thread pool aur merge cost dekho; always faster nahi.
 * - Optional — missing result model karo; unchecked `get()` se bacho.
 * - JVM stack — per-thread frames/local state; heap — objects ka managed area.
 * - Reachability — unreachable objects GC ke liye eligible; immediate collection guaranteed nahi.
 * - Memory leak — unused objects ab bhi reachable reh jaate hain.
 * - GC roots — thread stacks/static references jaise roots se reachability trace hoti hai.
 * - Heap dump — retained objects dekho; thread dump — blocked/waiting execution dekho.
 * - `OutOfMemoryError` — heap ke alawa native/metaspace limits bhi check karo.
 * - GC tuning — allocation, pause aur live-set evidence se start karo.
 * - Thread — concurrent execution; shared mutable state par coordination chahiye.
 * - Race condition — result scheduling par depend karta hai.
 * - `synchronized` — same monitor par mutual exclusion + visibility.
 * - `volatile` — visibility/order guarantee; `count++` atomic nahi.
 * - AtomicInteger — single-variable atomic updates; multi-field rule alag handle karo.
 * - Happens-before — writes ki visibility/order ka formal relation.
 * - Deadlock — locks cyclic order mein wait; consistent lock order rakho.
 * - Executor — tasks submit karo; lifecycle aur shutdown manage karo.
 * - Interrupt — cooperative cancellation signal; catch karke blindly swallow mat karo.
 * - Enum — fixed named values aur associated behavior.
 * - Annotation — metadata; behavior framework/tool interpret karta hai.
 * - Retention — SOURCE, CLASS, RUNTIME se metadata availability decide hoti hai.
 * - Reflection — runtime types/members inspect; access aur maintenance cost socho.
 * - Type erasure — most generic type arguments runtime objects par directly available nahi.
 * - Sealed type — permitted subtypes restrict karta hai.
 * - Pattern matching — type test aur extraction ko readable banata hai.
 * - Suppressed exception — try-with-resources cleanup failure main exception ke saath attach ho sakti hai.
 * - Charset — byte/text conversion mein explicit encoding; platform default par blind depend mat karo.
 * - Duration/Period — elapsed time-based amount / calendar date-based amount.
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
