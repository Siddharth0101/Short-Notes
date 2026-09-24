/**
 * ## Quick revision
 *
 * - Method — typed parameters lo, declared type ka result return karo.
 * - `void` — return value nahi; early `return` allowed.
 * - Overloading — same naam, different parameter list; return type alone enough nahi.
 * - Pass-by-value — reference ki copy pass hoti hai; object mutate ho sakta hai.
 * - Array — fixed length; index `0` se `length - 1`.
 * - 2D array — arrays ka array; rows ki lengths alag ho sakti hain.
 * - Varargs — multiple arguments array ki tarah milte hain; last parameter hota hai.
 * - Primitive types — byte, short, int, long, float, double, char, boolean.
 * - Wrapper — primitive ka object type; unboxing null se `NullPointerException`.
 * - String — immutable; content compare ke liye `.equals()`.
 * - `==` — primitives ki value, objects ki reference identity compare.
 * - `StringBuilder` — repeated string building mein mutable buffer.
 * - Overflow — integer arithmetic wrap ho sakti hai; checked math/range validation use karo.
 * - Casting — narrowing mein data lose ho sakta hai; blindly cast mat karo.
 * - `final` — variable reassign nahi; object automatically immutable nahi.
 * - String pool — literals reuse ho sakte hain; content equality ke liye `.equals()`.
 * - StringBuffer — synchronized mutable buffer; StringBuilder unsynchronized.
 * - Jagged array — har row ki length independent.
 * - Array length — fixed property; String length() method hai.
 * - Bounds — invalid index par ArrayIndexOutOfBoundsException; negative/empty cases check karo.
 * - Return contract — non-void method ke har normally completing path ko value chahiye.
 */

import java.util.Arrays;


public class Core_Java_Arrays_Strings {
    public static void main(String[] args) {
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
