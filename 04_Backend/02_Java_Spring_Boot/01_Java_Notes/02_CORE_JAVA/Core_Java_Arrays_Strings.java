import java.util.Arrays;

/**
 * ========================================================================
 * 02c. CORE JAVA - ARRAYS & STRINGS [⚡ VISUAL]
 * ========================================================================
 * 
 * ========================================================================
 * 1. ARRAYS
 * ========================================================================
 * - Array = FIXED SIZE container jo SAME TYPE ke multiple values store karta hai.
 * - Array ek OBJECT hai -> Heap Memory me store hota hai.
 * - Index 0 se start hota hai. arr[0] = first element, arr[length-1] = last element.
 * - Size ek baar define karne ke baad CHANGE nahi ho sakta (Fixed size! Dynamic chahiye toh ArrayList use karo).
 * 
 * DECLARATION & INITIALIZATION:
 * - int[] nums = new int[5];             // Default values: [0, 0, 0, 0, 0]
 * - int[] nums = {10, 20, 30, 40, 50};   // Direct initialization
 * - String[] names = new String[3];       // Default: [null, null, null]
 * 
 * IMPORTANT PROPERTIES:
 * - arr.length -> Array ki size (Note: ye method nahi hai, field hai. No parentheses!)
 * - ArrayIndexOutOfBoundsException -> Agar galat index access karo toh ye error aata hai.
 * 
 * 2D ARRAY (Multidimensional):
 * - Array ke andar arrays. Like rows and columns (matrix).
 * - int[][] matrix = new int[3][4];  // 3 rows, 4 columns
 * - int[][] matrix = { {1,2,3}, {4,5,6}, {7,8,9} };
 * 
 * JAGGED ARRAY:
 * - 2D array jisme har row ki DIFFERENT length ho sakti hai.
 * - int[][] jagged = new int[3][];  // 3 rows, columns abhi define nahi
 * - jagged[0] = new int[2];  // Row 0 has 2 columns
 * - jagged[1] = new int[4];  // Row 1 has 4 columns
 * - jagged[2] = new int[1];  // Row 2 has 1 column
 * 
 * ARRAYS UTILITY CLASS (java.util.Arrays):
 * - Arrays.sort(arr)       -> Sort karta hai (ascending)
 * - Arrays.toString(arr)   -> Array ko readable String me convert karta hai "[1, 2, 3]"
 * - Arrays.fill(arr, val)  -> Sabko same value de deta hai
 * - Arrays.copyOf(arr, n)  -> New array banata hai first n elements ke sath
 * 
 * ========================================================================
 * 2. STRINGS
 * ========================================================================
 * - String = sequence of characters. Java me String ek CLASS hai (primitive nahi!).
 * - String IMMUTABLE hai: Ek baar create hone ke baad value CHANGE NAHI hoti.
 *   Jab bhi modify karte ho, naya String object banta hai heap me.
 * 
 * STRING POOL (Intern Pool):
 * - Java ek special memory area maintain karta hai called "String Pool" (heap ke andar).
 * - Jab tum String literal create karte ho: String s = "Hello";
 *   Java pehle pool me check karta hai ki "Hello" already hai ya nahi.
 *   Agar hai -> same reference return karta hai (memory save!).
 *   Agar nahi -> pool me naya object banata hai.
 * - new String("Hello") -> Ye HAMESHA heap me naya object banata hai, pool bypass karta hai.
 * 
 * STRING vs == vs .equals():
 * - == : REFERENCE compare karta hai (kya dono same memory location point kar rahe hain?)
 * - .equals() : CONTENT compare karta hai (kya dono ki value same hai?)
 * - RULE: Strings compare karne ke liye HAMESHA .equals() use karo!
 * 
 * COMMON STRING METHODS:
 * - s.length()             -> Length (ye method hai, array me field tha!)
 * - s.charAt(index)        -> Character at given index
 * - s.substring(start, end) -> Sub-string from start to end-1
 * - s.indexOf("text")      -> First occurrence ka index (-1 if not found)
 * - s.toLowerCase()        -> Lowercase me convert
 * - s.toUpperCase()        -> Uppercase me convert
 * - s.trim()               -> Leading/trailing whitespace remove
 * - s.contains("text")     -> true/false if substring exists
 * - s.replace("old","new") -> Replace occurrences
 * - s.split("delimiter")   -> String ko array me split karta hai
 * - s.toCharArray()        -> String to char array
 * - s.equals(other)        -> Content equality check
 * - s.equalsIgnoreCase(other) -> Case-insensitive equality
 * - s.compareTo(other)     -> Lexicographic comparison (0=equal, +ve=greater, -ve=lesser)
 * - String.valueOf(123)    -> int/other types to String
 * 
 * ========================================================================
 * 3. STRINGBUILDER vs STRINGBUFFER
 * ========================================================================
 * - Problem: String immutable hai. Agar baar baar modify karo (loop me concatenation),
 *   toh har baar naya object banta hai -> SLOW + MEMORY WASTE.
 * 
 * - Solution: StringBuilder aur StringBuffer -> MUTABLE strings.
 *   Ye same object ko modify karte hain, naya object nahi banate.
 * 
 * StringBuilder:
 * - FAST (no synchronization overhead).
 * - NOT thread-safe (single-threaded environment me use karo).
 * - Java 5 me aaya.
 * 
 * StringBuffer:
 * - SLOW compared to StringBuilder (synchronization overhead).
 * - THREAD-SAFE (multithreaded environment me safe hai).
 * - Legacy class (Java 1.0 se hai).
 * 
 * ┌──────────────────┬────────────────┬─────────────────┬─────────────────┐
 * │    Feature       │   String       │ StringBuilder   │  StringBuffer   │
 * ├──────────────────┼────────────────┼─────────────────┼─────────────────┤
 * │ Mutability       │ Immutable      │ Mutable         │ Mutable         │
 * │ Thread Safety    │ Yes (immutable)│ No              │ Yes (synced)    │
 * │ Performance      │ Slow (concat)  │ Fastest         │ Slower          │
 * │ Use Case         │ Few changes    │ Single thread   │ Multi thread    │
 * └──────────────────┴────────────────┴─────────────────┴─────────────────┘
 * 
 * COMMON METHODS (both StringBuilder & StringBuffer):
 * - sb.append("text")         -> End me add karta hai
 * - sb.insert(index, "text")  -> Given position pe insert
 * - sb.delete(start, end)     -> Range delete karta hai
 * - sb.deleteCharAt(index)    -> Single character delete
 * - sb.reverse()              -> String ko ulta kar deta hai
 * - sb.replace(start,end,str) -> Range ko replace karta hai
 * - sb.length()               -> Current length
 * - sb.capacity()             -> Internal buffer size (default 16 + initial string length)
 * - sb.toString()             -> StringBuilder/Buffer ko String me convert
 */

public class Core_Java_Arrays_Strings {
    public static void main(String[] args) {

        // ===== 1. ARRAYS =====
        System.out.println("===== Arrays =====");

        // --- 1D Array ---
        int[] marks = {85, 92, 78, 95, 88};
        System.out.println("Marks Array: " + Arrays.toString(marks));
        System.out.println("First: " + marks[0] + ", Last: " + marks[marks.length - 1]);
        System.out.println("Array Length: " + marks.length);

        // Iterating with for-each
        int sum = 0;
        for (int m : marks) {
            sum += m;
        }
        System.out.println("Total Marks: " + sum + ", Average: " + (sum / marks.length));

        // --- Array with default values ---
        int[] empty = new int[5]; // All zeros
        System.out.println("Default int array: " + Arrays.toString(empty));

        // --- Arrays utility methods ---
        int[] unsorted = {42, 15, 8, 99, 23};
        System.out.println("\nBefore sort: " + Arrays.toString(unsorted));
        Arrays.sort(unsorted);
        System.out.println("After sort:  " + Arrays.toString(unsorted));

        int[] filled = new int[5];
        Arrays.fill(filled, 7);
        System.out.println("Filled with 7: " + Arrays.toString(filled));

        // --- 2D Array (Matrix) ---
        System.out.println("\n--- 2D Array (Matrix) ---");
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        // Print matrix
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.print(matrix[i][j] + "\t");
            }
            System.out.println();
        }

        // Enhanced for-each on 2D array
        System.out.println("2D for-each traversal:");
        for (int[] row : matrix) {
            for (int val : row) {
                System.out.print(val + " ");
            }
            System.out.println();
        }

        // --- Jagged Array (Different column sizes per row) ---
        System.out.println("\n--- Jagged Array ---");
        int[][] jagged = new int[3][];
        jagged[0] = new int[]{1, 2};           // 2 columns
        jagged[1] = new int[]{3, 4, 5, 6};     // 4 columns
        jagged[2] = new int[]{7};               // 1 column

        for (int i = 0; i < jagged.length; i++) {
            System.out.println("Row " + i + " (length=" + jagged[i].length + "): " + Arrays.toString(jagged[i]));
        }

        // ===== 2. STRINGS =====
        System.out.println("\n===== Strings =====");

        // --- String Pool & Immutability ---
        String s1 = "Hello";       // Goes to String Pool
        String s2 = "Hello";       // Same reference from Pool
        String s3 = new String("Hello"); // New object in Heap (NOT from pool)

        System.out.println("s1 == s2 (same pool ref): " + (s1 == s2));       // true
        System.out.println("s1 == s3 (diff objects):  " + (s1 == s3));       // false
        System.out.println("s1.equals(s3) (same content): " + s1.equals(s3)); // true

        // --- Immutability demonstration ---
        String original = "Java";
        String modified = original.concat(" Programming"); // New object created!
        System.out.println("\nOriginal unchanged: " + original);   // "Java"
        System.out.println("New string created: " + modified);      // "Java Programming"

        // --- Common String Methods ---
        System.out.println("\n--- String Methods ---");
        String text = "  Master Java with Telusko  ";
        System.out.println("Length: " + text.length());
        System.out.println("Trimmed: '" + text.trim() + "'");
        System.out.println("Uppercase: " + text.trim().toUpperCase());
        System.out.println("charAt(10): " + text.trim().charAt(10));
        System.out.println("Substring(7,11): " + text.trim().substring(7, 11));
        System.out.println("Contains 'Telusko': " + text.contains("Telusko"));
        System.out.println("IndexOf 'Java': " + text.trim().indexOf("Java"));
        System.out.println("Replace: " + text.trim().replace("Telusko", "Navin"));

        // --- String.split() ---
        String csv = "Java,Python,JavaScript,Go,Rust";
        String[] langs = csv.split(",");
        System.out.println("\nSplit CSV:");
        for (String lang : langs) {
            System.out.println("  - " + lang);
        }

        // --- compareTo ---
        String a = "Apple";
        String b = "Banana";
        System.out.println("\n\"Apple\".compareTo(\"Banana\"): " + a.compareTo(b)); // negative (A < B)

        // ===== 3. STRINGBUILDER =====
        System.out.println("\n===== StringBuilder =====");

        // Why StringBuilder? String concatenation in loop is BAD:
        // String s = ""; for(...) { s += "x"; } // Creates new object each time! Slow.

        StringBuilder sb = new StringBuilder("Hello");
        System.out.println("Initial: " + sb);
        System.out.println("Capacity: " + sb.capacity()); // Default: 16 + initial length

        sb.append(" World");
        System.out.println("After append: " + sb);

        sb.insert(5, ",");
        System.out.println("After insert: " + sb); // "Hello, World"

        sb.replace(7, 12, "Java");
        System.out.println("After replace: " + sb); // "Hello, Java"

        sb.delete(5, 6);
        System.out.println("After delete: " + sb); // "Hello Java"

        sb.reverse();
        System.out.println("Reversed: " + sb);

        // Convert back to String
        String finalStr = sb.toString();
        System.out.println("As String: " + finalStr);

        // --- Performance comparison intuition ---
        System.out.println("\n--- Performance: String vs StringBuilder ---");
        
        // StringBuilder (FAST - modifies same object)
        long start = System.currentTimeMillis();
        StringBuilder fast = new StringBuilder();
        for (int i = 0; i < 100000; i++) {
            fast.append("x");
        }
        long sbTime = System.currentTimeMillis() - start;
        System.out.println("StringBuilder: " + sbTime + "ms for 100k appends");

        // String concat (SLOW - creates new object each time)
        start = System.currentTimeMillis();
        String slow = "";
        for (int i = 0; i < 100000; i++) {
            slow += "x"; // DON'T DO THIS! Very slow.
        }
        long strTime = System.currentTimeMillis() - start;
        System.out.println("String concat: " + strTime + "ms for 100k concats");
        System.out.println("StringBuilder is ~" + (strTime / Math.max(sbTime, 1)) + "x faster!");
    }
}
