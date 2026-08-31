/**
 * ========================================================================
 * 03. ADVANCE JAVA (EXCEPTIONS, COLLECTIONS, THREADS)
 * ========================================================================
 * NOTES:
 * - Ye topics har enterprise application ka backbone hain. Inke bina proper app nahi banti.
 * 
 * 1. EXCEPTION HANDLING:
 * - Errors jo program crash kar sakte hain unko gracefully handle karna.
 * - Hierarchy: Throwable -> Error (Out of memory, stack overflow - we don't handle) & Exception (We handle).
 * - Checked Exceptions: Compile-time pe pata chal jata hai (e.g., IOException, SQLException). Inko handle karna must hai (try-catch ya throws).
 * - Unchecked Exceptions: Run-time pe aate hain (e.g., NullPointerException, ArithmeticException). Inko explicitly handle karna zaroori nahi hota, par best practice hai code safe likho.
 * - Blocks: try (risky code), catch (handle error), finally (hamesha execute hoga, resource closing ke liye).
 * 
 * 2. MULTITHREADING:
 * - Process: Ek program jo run ho raha hai.
 * - Thread: Process ke andar ek chota execution unit. Multithreading matlab multiple threads parallel (concurrently) kaam kar rahe hain.
 * - Thread create karne ke 2 ways:
 *   a) Extend `Thread` class.
 *   b) Implement `Runnable` interface (Best practice kyunki Java me multiple inheritance nahi hoti, so aap dusri class ko extend karne ke liye free rehte ho).
 * - Synchronization: Jab do threads same resource (e.g., ek variable) ko ek sath access karein toh data corrupt (Race Condition) ho sakta hai. `synchronized` keyword ek baar me ek hi thread ko allow karta hai.
 * 
 * 3. COLLECTIONS FRAMEWORK:
 * - Arrays fix size ke hote hain. Collections dynamic size aur readymade data structures provide karte hain.
 * - Iterable -> Collection
 * 
 * a) List Interface (Ordered, allows duplicates):
 *    - ArrayList: Fast for searching/reading. Shift elements slowly (insertion/deletion middle me). Dynamic array under the hood.
 *    - LinkedList: Fast for insertion/deletion. Slow for searching. Doubly linked list under the hood.
 * 
 * b) Set Interface (Unordered, NO duplicates):
 *    - HashSet: Sabse fast, order maintain nahi karta (uses HashMap internally).
 *    - TreeSet: Sorted (ascending order) rakhta hai.
 * 
 * c) Map Interface (Key-Value pairs. Keys must be unique):
 *    - HashMap: Fast key lookup, unordered.
 *    - TreeMap: Keys sorted order me rehti hain.
 * 
 * 4. STREAMS API (Java 8+):
 * - Collections par declarative operations (filter, map, reduce) run karne ke liye. SQL jaisi queries lists pe lagane ke liye.
 * - Lambdas `(a, b) -> a + b` ke sath use hota hai.
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        System.out.println(Thread.currentThread().getName() + " is running async task.");
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
        
        // 1. EXCEPTION HANDLING
        System.out.println("--- Exceptions ---");
        try {
            validateAge(16);
        } catch (InvalidAgeException e) {
            System.out.println("Caught Error: " + e.getMessage());
        } finally {
            System.out.println("Cleanup actions done here.");
        }

        // 2. THREADS
        System.out.println("\n--- Threads ---");
        Thread t1 = new Thread(new MyTask(), "Worker-Thread-1");
        t1.start(); // This calls run() in background

        // 3. COLLECTIONS
        System.out.println("\n--- Collections ---");
        List<String> frameworks = new ArrayList<>();
        frameworks.add("Spring");
        frameworks.add("Hibernate");
        frameworks.add("Struts");

        Map<String, String> languages = new HashMap<>();
        languages.put("JS", "JavaScript");
        languages.put("PY", "Python");

        // 4. STREAMS API & LAMBDAS (Java 8)
        System.out.println("\n--- Streams ---");
        List<String> filtered = frameworks.stream()
            .filter(f -> f.startsWith("S"))
            .map(String::toUpperCase)
            .collect(Collectors.toList());
            
        System.out.println("Frameworks starting with S: " + filtered);
    }
}
