/**
 * ## Quick revision
 *
 * - `if/else` — condition ke hisaab se branch choose.
 * - `switch` — value ke cases; arrow cases fall-through nahi karte.
 * - `for` — counted repetition; `while` — condition-based repetition.
 * - Enhanced for — array/Iterable ki values traverse karo.
 * - `break` — loop/switch se exit; `continue` — next iteration.
 * - Integer division — `5 / 2` → `2`; decimal chahiye toh floating operand.
 * - Boundary — zero, exact limit aur limit ke aas-paas inputs check karo.
 * - Short-circuit — &&/|| right expression tabhi evaluate jab result decide karna baaki ho.
 * - Switch expression — value produce karti hai; block branch mein yield use hota hai.
 * - Loop mutation — enhanced-for ke andar collection structural change unsafe ho sakta hai; proper iterator/API choose.
 */

public class Core_Java_ControlFlow {
    public static void main(String[] args) {
        System.out.println("===== Conditional Statements =====");

        // --- if-else ---
        int marks = 75;
        if (marks >= 90) {
            System.out.println("Grade: A+");
        } else if (marks >= 80) {
            System.out.println("Grade: A");
        } else if (marks >= 70) {
            System.out.println("Grade: B");   // This runs (75 >= 70)
        } else if (marks >= 60) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F (Fail)");
        }

        // --- Nested if ---
        boolean isLoggedIn = true;
        String role = "admin";
        if (isLoggedIn) {
            if (role.equals("admin")) {
                System.out.println("Welcome, Admin! Full access granted.");
            } else {
                System.out.println("Welcome, User! Limited access.");
            }
        } else {
            System.out.println("Please login first.");
        }

        // --- switch-case (Traditional) ---
        System.out.println("\n--- Switch Case ---");
        String day = "Monday";
        switch (day) {
            case "Monday":
            case "Tuesday":
            case "Wednesday":
            case "Thursday":
            case "Friday":
                System.out.println(day + " -> Weekday (Work hard!)");
                break; // break bhool gaye toh FALL-THROUGH hoga!
            case "Saturday":
            case "Sunday":
                System.out.println(day + " -> Weekend (Relax!)");
                break;
            default:
                System.out.println("Invalid day!");
        }

        // --- Enhanced Switch (Java 14+) - Arrow syntax, no break needed ---
        String season = "Winter";
        String activity = switch (season) {
            case "Summer" -> "Go Swimming 🏊";
            case "Winter" -> "Drink Hot Chocolate ☕";  // This matches
            case "Monsoon" -> "Stay Inside 🏠";
            default -> "Enjoy the day!";
        };
        System.out.println(season + " -> " + activity);

        // --- Ternary Operator ---
        int age = 17;
        String canVote = (age >= 18) ? "Yes, can vote ✅" : "No, too young ❌";
        System.out.println("Age " + age + ": " + canVote);
        System.out.println("\n===== Loops =====");

        // --- while loop ---
        System.out.println("--- While Loop ---");
        int countdown = 5;
        while (countdown > 0) {
            System.out.print(countdown + " ");
            countdown--;
        }
        System.out.println("🚀 Launch!");

        // --- do-while loop (body runs AT LEAST ONCE) ---
        System.out.println("\n--- Do-While Loop ---");
        int attempt = 1;
        int maxAttempts = 3;
        do {
            System.out.println("Login attempt " + attempt + " of " + maxAttempts);
            attempt++;
        } while (attempt <= maxAttempts);

        // --- for loop ---
        System.out.println("\n--- For Loop ---");
        // Print multiplication table of 5
        int tableOf = 5;
        for (int i = 1; i <= 10; i++) {
            System.out.println(tableOf + " x " + i + " = " + (tableOf * i));
        }

        // --- Nested for loop (Pattern printing) ---
        System.out.println("\n--- Nested For Loop (Star Pattern) ---");
        int rows = 5;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
        // Output:
        // *
        // * *
        // * * *
        // * * * *
        // * * * * *

        // --- Enhanced for-each loop ---
        System.out.println("--- For-Each Loop ---");
        String[] languages = {"Java", "Python", "JavaScript", "Go"};
        for (String lang : languages) {
            System.out.println("Language: " + lang);
        }
        System.out.println("\n===== Loop Control =====");

        // --- break ---
        System.out.println("--- Break ---");
        for (int i = 1; i <= 10; i++) {
            if (i == 6) {
                System.out.println("Found 6! Breaking out of loop.");
                break; // Loop stops immediately
            }
            System.out.print(i + " ");
        }
        System.out.println();

        // --- continue ---
        System.out.println("--- Continue (Skip even numbers) ---");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) {
                continue; // Skip this iteration, go to next
            }
            System.out.print(i + " "); // Only odd numbers print
        }
        System.out.println();

        // --- Labeled break (Break out of outer loop from inside inner loop) ---
        System.out.println("--- Labeled Break ---");
        outerLoop:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    System.out.println("Breaking outer loop at i=" + i + ", j=" + j);
                    break outerLoop; // Breaks the OUTER loop, not just inner
                }
                System.out.println("i=" + i + ", j=" + j);
            }
        }
    }
}
