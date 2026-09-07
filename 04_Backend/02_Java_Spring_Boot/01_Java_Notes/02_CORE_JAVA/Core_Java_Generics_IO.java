import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * ========================================================================
 * 02f. CORE JAVA - GENERICS, DATE/TIME API & JAVA I/O [⚡ VISUAL]
 * ========================================================================
 * Source: Telusko — Master Java, Spring and Spring Boot, Spring Security,
 *         Spring AI, Docker and Microservices
 * 
 * ========================================================================
 * 1. GENERICS (Java 5+)
 * ========================================================================
 * - Generics = TYPE SAFETY at compile time. Collections ko type-specific bana deta hai.
 * - Without Generics: List list = new ArrayList(); → list me kuch bhi daal sakte ho (String, int, Object)
 *   → Runtime pe ClassCastException aa sakta hai!
 * - With Generics: List<String> list = new ArrayList<>(); → sirf String allowed.
 *   → Compile-time pe hi error aa jayega agar galat type daala.
 * 
 * GENERIC CLASS:
 * - Syntax: class Box<T> { T value; }  → T = Type Parameter (placeholder)
 * - T ko kuch bhi naam de sakte ho, but conventions:
 *   T = Type, E = Element, K = Key, V = Value, N = Number
 * - Usage: Box<String> box = new Box<>(); → T ko String se replace kar diya
 * 
 * GENERIC METHOD:
 * - Method level pe generic define karna (class generic na bhi ho tab bhi):
 *   public <T> void printArray(T[] arr) { ... }
 * - Type inference: Compiler automatically detect karta hai T kya hai
 * 
 * BOUNDED TYPE PARAMETERS:
 * - <T extends Number>    → T sirf Number ya uske subclass ho sakta hai (upper bound)
 * - <T extends Comparable<T>> → T comparable hona chahiye
 * - Multiple bounds: <T extends Number & Comparable<T>>
 * 
 * WILDCARDS (?):
 * - Jab exact type pata nahi ho ya flexibility chahiye:
 * 
 * a) UNBOUNDED WILDCARD: List<?>
 *    - Kisi bhi type ki list accept karta hai.
 *    - Read-only (add nahi kar sakte, except null).
 * 
 * b) UPPER BOUNDED WILDCARD: List<? extends Number>
 *    - Number ya uske subclass (Integer, Double, etc.) ki list accept karta hai.
 *    - Read-only (producer — sirf data nikaal sakte ho, daal nahi sakte).
 *    - PECS: Producer Extends
 * 
 * c) LOWER BOUNDED WILDCARD: List<? super Integer>
 *    - Integer ya uske superclass (Number, Object) ki list accept karta hai.
 *    - Write-friendly (consumer — data daal sakte ho).
 *    - PECS: Consumer Super
 * 
 * TYPE ERASURE:
 * - Compile hone ke baad generic type info HAT jati hai (backward compatibility ke liye).
 * - Runtime pe List<String> aur List<Integer> dono bas List hain.
 * - Isliye: new T() ya new T[] nahi kar sakte. instanceof T bhi nahi.
 * 
 * ========================================================================
 * 2. DATE/TIME API (Java 8+ — java.time package)
 * ========================================================================
 * - Purane Date aur Calendar classes PROBLEMATIC thi (mutable, confusing API, thread-unsafe).
 * - Java 8 ne naya java.time package diya — IMMUTABLE, THREAD-SAFE, aur CLEAN.
 * 
 * MAIN CLASSES:
 * ┌──────────────────────┬──────────────────────────────────────────┐
 * │ Class                │ What it represents                        │
 * ├──────────────────────┼──────────────────────────────────────────┤
 * │ LocalDate            │ Date only (2024-12-25) — no time, no zone│
 * │ LocalTime            │ Time only (14:30:00) — no date, no zone  │
 * │ LocalDateTime        │ Date + Time (2024-12-25T14:30:00)        │
 * │ ZonedDateTime        │ Date + Time + Timezone                    │
 * │ Instant              │ Machine timestamp (epoch seconds)         │
 * │ Period               │ Date-based amount (years, months, days)   │
 * │ Duration             │ Time-based amount (hours, minutes, seconds)│
 * │ DateTimeFormatter    │ Formatting/parsing dates to/from strings  │
 * └──────────────────────┴──────────────────────────────────────────┘
 * 
 * KEY POINTS:
 * - All classes are IMMUTABLE. Methods return NEW objects (original unchanged).
 * - Factory methods: LocalDate.now(), LocalDate.of(2024, 12, 25)
 * - Chaining: date.plusDays(5).minusMonths(1)
 * - Thread-safe (no synchronization needed).
 * 
 * FORMATTING:
 * - DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")
 * - date.format(formatter) → String
 * - LocalDate.parse("25-12-2024", formatter) → LocalDate
 * 
 * PERIOD vs DURATION:
 * - Period: Between two DATES (years, months, days).
 *   Period p = Period.between(date1, date2);
 * - Duration: Between two TIMES (hours, minutes, seconds, nanos).
 *   Duration d = Duration.between(time1, time2);
 * 
 * ========================================================================
 * 3. JAVA I/O (Input/Output — java.io package)
 * ========================================================================
 * - Java I/O = Reading from and Writing to files, console, streams.
 * - Two main hierarchies:
 *   a) BYTE STREAMS: InputStream / OutputStream (raw bytes — images, binary files)
 *   b) CHARACTER STREAMS: Reader / Writer (text files — char by char)
 * 
 * COMMON CLASSES:
 * ┌──────────────────────┬────────────────────────────────────────────┐
 * │ Class                │ Purpose                                     │
 * ├──────────────────────┼────────────────────────────────────────────┤
 * │ FileReader           │ Read text files (char by char)              │
 * │ FileWriter           │ Write text files                            │
 * │ BufferedReader       │ Efficient text reading (line by line)       │
 * │ BufferedWriter       │ Efficient text writing (buffered)           │
 * │ Scanner              │ Read user input / parse files               │
 * │ PrintWriter          │ Write formatted text to file                │
 * │ File                 │ Represent file/directory path (not content) │
 * │ FileInputStream      │ Read binary files (byte by byte)            │
 * │ FileOutputStream     │ Write binary files                          │
 * └──────────────────────┴────────────────────────────────────────────┘
 * 
 * BUFFERED vs UNBUFFERED:
 * - FileReader/FileWriter → read/write one char at a time (slow for large files)
 * - BufferedReader/BufferedWriter → read/write in CHUNKS (buffer) → MUCH FASTER
 * - Always prefer Buffered versions for performance.
 * 
 * try-with-resources (Java 7+):
 * - I/O resources (streams, readers) MUST be closed after use → otherwise RESOURCE LEAK!
 * - Old way: try { ... } finally { reader.close(); } → ugly and error-prone
 * - New way: try (BufferedReader br = new BufferedReader(...)) { ... }
 *   → Java AUTOMATICALLY closes the resource (must implement AutoCloseable).
 * 
 * File CLASS:
 * - File f = new File("path/to/file.txt");
 * - f.exists()       → true/false
 * - f.getName()      → filename
 * - f.length()       → file size in bytes
 * - f.isDirectory()  → is it a directory?
 * - f.createNewFile() → create new file
 * - f.delete()       → delete file
 * - f.listFiles()    → list all files in directory
 */

// ========== GENERIC CLASS EXAMPLES ==========

// Simple Generic Class — type-safe container
class Box<T> {
    private T value;

    Box(T value) {
        this.value = value;
    }

    T getValue() { return value; }
    void setValue(T value) { this.value = value; }

    @Override
    public String toString() {
        return "Box[" + value + "]";
    }
}

// Generic Class with multiple type parameters
class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    K getKey() { return key; }
    V getValue() { return value; }

    @Override
    public String toString() {
        return key + " = " + value;
    }
}

// Bounded Type Parameter — T must be a Number (or subclass)
class MathBox<T extends Number> {
    private T num;

    MathBox(T num) {
        this.num = num;
    }

    double getDoubleValue() {
        return num.doubleValue(); // Number's method — guaranteed because of bound
    }

    boolean isGreaterThan(MathBox<? extends Number> other) {
        return this.getDoubleValue() > other.getDoubleValue();
    }
}

// ========== MAIN CLASS ==========
public class Core_Java_Generics_IO {

    // --- Generic Method (works with any type) ---
    static <T> void printArray(T[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }

    // --- Bounded Generic Method ---
    static <T extends Comparable<T>> T findMax(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    // --- Wildcard Examples ---

    // Upper bounded: accepts List of Number or its subtypes (Integer, Double...)
    // Can READ from the list, but NOT add to it (except null)
    static double sumOfList(List<? extends Number> list) {
        double sum = 0;
        for (Number n : list) {
            sum += n.doubleValue();
        }
        return sum;
    }

    // Lower bounded: accepts List of Integer or its supertypes (Number, Object)
    // Can WRITE Integer values into it
    static void addNumbers(List<? super Integer> list) {
        list.add(10);
        list.add(20);
        list.add(30);
    }

    public static void main(String[] args) {

        // ===== 1. GENERICS =====
        System.out.println("===== 1. Generics =====");

        // --- Generic Class ---
        System.out.println("--- Generic Class ---");
        Box<String> stringBox = new Box<>("Hello Telusko");
        Box<Integer> intBox = new Box<>(42);
        Box<Double> doubleBox = new Box<>(3.14);

        System.out.println("String Box: " + stringBox);
        System.out.println("Integer Box: " + intBox);
        System.out.println("Double Box: " + doubleBox);

        // Type safety — this would be COMPILE ERROR:
        // stringBox.setValue(123); // ❌ Can't put Integer in Box<String>

        // --- Pair (Multiple Type Parameters) ---
        System.out.println("\n--- Pair<K, V> ---");
        Pair<String, Integer> studentAge = new Pair<>("Navin", 35);
        Pair<Integer, String> rollName = new Pair<>(101, "Siddharth");
        System.out.println("Student: " + studentAge);
        System.out.println("Roll: " + rollName);

        // --- Generic Method ---
        System.out.println("\n--- Generic Method ---");
        Integer[] intArr = {1, 2, 3, 4, 5};
        String[] strArr = {"Java", "Python", "Go"};
        Double[] dblArr = {1.1, 2.2, 3.3};

        System.out.print("Integer array: "); printArray(intArr);
        System.out.print("String array:  "); printArray(strArr);
        System.out.print("Double array:  "); printArray(dblArr);

        // --- Bounded Type Parameter ---
        System.out.println("\n--- Bounded Generics ---");
        MathBox<Integer> mb1 = new MathBox<>(42);
        MathBox<Double> mb2 = new MathBox<>(38.5);
        System.out.println("42 as double: " + mb1.getDoubleValue());
        System.out.println("42 > 38.5? " + mb1.isGreaterThan(mb2));

        // MathBox<String> mbStr = new MathBox<>("hello"); // ❌ COMPILE ERROR! String is not Number

        // --- Bounded Generic Method ---
        System.out.println("\nMax of 10, 20: " + findMax(10, 20));
        System.out.println("Max of \"Apple\", \"Banana\": " + findMax("Apple", "Banana"));

        // --- Wildcards ---
        System.out.println("\n--- Wildcards ---");

        // Upper bounded (? extends Number) — PRODUCER: can read
        List<Integer> intList = List.of(1, 2, 3, 4, 5);
        List<Double> dblList = List.of(1.5, 2.5, 3.5);
        System.out.println("Sum of integers: " + sumOfList(intList)); // 15.0
        System.out.println("Sum of doubles: " + sumOfList(dblList));  // 7.5

        // Lower bounded (? super Integer) — CONSUMER: can write
        List<Number> numberList = new ArrayList<>();
        addNumbers(numberList); // Adds 10, 20, 30 to the list
        System.out.println("After addNumbers: " + numberList);

        // PECS: Producer Extends, Consumer Super
        System.out.println("\n⭐ PECS Rule: Producer Extends, Consumer Super");
        System.out.println("  ? extends T → READ from it (producer)");
        System.out.println("  ? super T   → WRITE to it (consumer)");

        // ===== 2. DATE/TIME API =====
        System.out.println("\n===== 2. Date/Time API (Java 8+) =====");

        // --- LocalDate (Date only — no time) ---
        System.out.println("--- LocalDate ---");
        LocalDate today = LocalDate.now();
        LocalDate birthday = LocalDate.of(2003, 7, 15);
        LocalDate parsed = LocalDate.parse("2024-12-25");

        System.out.println("Today: " + today);
        System.out.println("Birthday: " + birthday);
        System.out.println("Parsed: " + parsed);
        System.out.println("Year: " + today.getYear() + ", Month: " + today.getMonthValue() + ", Day: " + today.getDayOfMonth());
        System.out.println("Day of week: " + today.getDayOfWeek());
        System.out.println("Is leap year? " + today.isLeapYear());

        // Immutable — returns NEW object
        LocalDate nextWeek = today.plusDays(7);
        LocalDate lastMonth = today.minusMonths(1);
        System.out.println("Next week: " + nextWeek);
        System.out.println("Last month: " + lastMonth);
        System.out.println("today unchanged: " + today); // Original NOT modified!

        // Comparison
        System.out.println("Is birthday before today? " + birthday.isBefore(today));

        // --- LocalTime (Time only — no date) ---
        System.out.println("\n--- LocalTime ---");
        LocalTime now = LocalTime.now();
        LocalTime meetingTime = LocalTime.of(14, 30, 0);

        System.out.println("Current time: " + now);
        System.out.println("Meeting at: " + meetingTime);
        System.out.println("Hour: " + now.getHour() + ", Minute: " + now.getMinute());

        LocalTime later = meetingTime.plusHours(2).plusMinutes(15);
        System.out.println("Meeting + 2h15m: " + later);

        // --- LocalDateTime (Date + Time) ---
        System.out.println("\n--- LocalDateTime ---");
        LocalDateTime dateTime = LocalDateTime.now();
        LocalDateTime event = LocalDateTime.of(2024, 12, 31, 23, 59, 59);

        System.out.println("Now: " + dateTime);
        System.out.println("New Year's Eve: " + event);

        // Extract date and time parts
        System.out.println("Date part: " + dateTime.toLocalDate());
        System.out.println("Time part: " + dateTime.toLocalTime());

        // --- ZonedDateTime (Date + Time + Timezone) ---
        System.out.println("\n--- ZonedDateTime ---");
        ZonedDateTime zdt = ZonedDateTime.now();
        ZonedDateTime tokyoTime = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        ZonedDateTime nyTime = ZonedDateTime.now(ZoneId.of("America/New_York"));

        System.out.println("Local: " + zdt);
        System.out.println("Tokyo: " + tokyoTime);
        System.out.println("New York: " + nyTime);

        // --- DateTimeFormatter (Formatting & Parsing) ---
        System.out.println("\n--- DateTimeFormatter ---");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formatted = dateTime.format(formatter);
        System.out.println("Formatted: " + formatted);

        // Custom pattern
        DateTimeFormatter dateOnly = DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE");
        System.out.println("Pretty date: " + today.format(dateOnly));

        // Parsing string to LocalDateTime
        LocalDateTime parsedDT = LocalDateTime.parse("25-12-2024 23:59:59", formatter);
        System.out.println("Parsed DateTime: " + parsedDT);

        // --- Period (Date-based difference) ---
        System.out.println("\n--- Period ---");
        Period age = Period.between(birthday, today);
        System.out.println("Age: " + age.getYears() + " years, " + age.getMonths() + " months, " + age.getDays() + " days");
        System.out.println("Period object: " + age); // e.g., P21Y1M23D

        // --- Duration (Time-based difference) ---
        System.out.println("\n--- Duration ---");
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 30);
        Duration workHours = Duration.between(start, end);
        System.out.println("Work hours: " + workHours.toHours() + "h " + (workHours.toMinutes() % 60) + "m");
        System.out.println("In seconds: " + workHours.getSeconds());

        // ===== 3. JAVA I/O =====
        System.out.println("\n===== 3. Java I/O =====");

        String filePath = "telusko_test.txt";

        // --- Writing to a file (BufferedWriter + try-with-resources) ---
        System.out.println("--- Writing to File ---");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("Line 1: Hello from Telusko!");
            writer.newLine();
            writer.write("Line 2: Java I/O is easy with BufferedWriter.");
            writer.newLine();
            writer.write("Line 3: Always use try-with-resources!");
            System.out.println("✅ Written to " + filePath);
        } catch (IOException e) {
            System.out.println("❌ Write error: " + e.getMessage());
        }

        // --- Reading from a file (BufferedReader + try-with-resources) ---
        System.out.println("\n--- Reading from File ---");
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            int lineNum = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println("  " + lineNum + ": " + line);
                lineNum++;
            }
        } catch (IOException e) {
            System.out.println("❌ Read error: " + e.getMessage());
        }

        // --- File class (metadata, not content) ---
        System.out.println("\n--- File Class ---");
        File file = new File(filePath);
        if (file.exists()) {
            System.out.println("File name: " + file.getName());
            System.out.println("Absolute path: " + file.getAbsolutePath());
            System.out.println("Size: " + file.length() + " bytes");
            System.out.println("Is file? " + file.isFile());
            System.out.println("Is directory? " + file.isDirectory());
            System.out.println("Can read? " + file.canRead());
            System.out.println("Can write? " + file.canWrite());
        }

        // --- Scanner for reading (alternative to BufferedReader) ---
        System.out.println("\n--- Scanner (File reading) ---");
        try (Scanner scanner = new Scanner(new File(filePath))) {
            while (scanner.hasNextLine()) {
                System.out.println("  Scanner: " + scanner.nextLine());
            }
        } catch (Exception e) {
            System.out.println("❌ Scanner error: " + e.getMessage());
        }

        // --- Cleanup: delete test file ---
        if (file.delete()) {
            System.out.println("\n🗑️ Test file deleted: " + filePath);
        }

        // --- Listing files in current directory ---
        System.out.println("\n--- Listing Files in Current Directory ---");
        File currentDir = new File(".");
        File[] files = currentDir.listFiles();
        if (files != null) {
            int count = 0;
            for (File f : files) {
                if (count >= 5) { System.out.println("  ... and more"); break; }
                System.out.println("  " + (f.isDirectory() ? "[DIR] " : "[FILE] ") + f.getName());
                count++;
            }
        }

        System.out.println("\n✅ Generics, Date/Time API, and Java I/O covered!");
    }
}
