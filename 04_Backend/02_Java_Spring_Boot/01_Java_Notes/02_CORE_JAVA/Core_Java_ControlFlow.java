/**
 * ========================================================================
 * 02b. CORE JAVA - CONTROL FLOW (CONDITIONALS & LOOPS) [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Control flow = program me decision making aur repetition.
 * - Ye batata hai ki kaunsa code kab execute hoga.
 * 
 * ========================================================================
 * 1. CONDITIONAL STATEMENTS (Decision Making)
 * ========================================================================
 * 
 * a) if STATEMENT:
 *    - Agar condition true hai toh block execute hoga.
 *    - Syntax: if (condition) { // code }
 * 
 * b) if-else STATEMENT:
 *    - True hoga toh if block, false hoga toh else block.
 *    - Syntax: if (condition) { // if-code } else { // else-code }
 * 
 * c) else-if LADDER:
 *    - Jab multiple conditions check karni ho.
 *    - Syntax: if (c1) { } else if (c2) { } else if (c3) { } else { }
 *    - Pehli true condition ka block run hota hai, baaki skip.
 * 
 * d) NESTED if:
 *    - if ke andar if. Tab use karo jab ek condition dusri pe depend kare.
 * 
 * e) switch-case STATEMENT:
 *    - Jab ek variable ke multiple possible values pe different actions lene ho.
 *    - if-else ladder ka clean alternative jab equality check karna ho.
 *    - RULE: break dalna zaroori hai, warna FALL-THROUGH hoga (neeche ke saare cases execute honge).
 *    - default: Jab koi case match na kare (optional but recommended).
 *    - Supported types: byte, short, int, char, String (Java 7+), enum.
 * 
 * f) ENHANCED SWITCH (Java 14+):
 *    - Arrow syntax (->) use karta hai, break ki zaroorat nahi.
 *    - Expression ke roop me use ho sakta hai (value return karta hai).
 * 
 * g) TERNARY OPERATOR:
 *    - One-line if-else. Syntax: result = (condition) ? trueValue : falseValue;
 * 
 * ========================================================================
 * 2. LOOPS (Repetition / Iteration)
 * ========================================================================
 * 
 * a) while LOOP:
 *    - Jab tak condition true hai, tab tak execute karo.
 *    - PEHLE condition check karta hai, PHIR body run karta hai.
 *    - Use case: Jab pata nahi kitni baar loop chalega (unknown iterations).
 *    - Syntax: while (condition) { // code }
 *    - WARNING: Infinite loop ban sakta hai agar condition kabhi false na ho!
 * 
 * b) do-while LOOP:
 *    - PEHLE body execute karta hai, PHIR condition check karta hai.
 *    - Guarantee: Body kam se kam EK BAAR zaroor chalega (even if condition false ho tab bhi).
 *    - Use case: Menu-driven programs, input validation.
 *    - Syntax: do { // code } while (condition);
 * 
 * c) for LOOP:
 *    - Jab pata ho ki kitni baar loop chalana hai (known iterations).
 *    - Syntax: for (initialization; condition; update) { // code }
 *    - Execution order: init -> check -> body -> update -> check -> body -> update -> ...
 * 
 * d) ENHANCED for-each LOOP (Java 5+):
 *    - Arrays aur Collections ke elements pe iterate karne ka sabse clean tarika.
 *    - Syntax: for (type element : collection) { // use element }
 *    - LIMITATION: Index available nahi hota. Modify nahi kar sakte original collection.
 * 
 * ========================================================================
 * 3. LOOP CONTROL STATEMENTS
 * ========================================================================
 * 
 * a) break: Loop ko IMMEDIATELY tood deta hai. Baaki iterations skip.
 * b) continue: Current iteration ko SKIP karta hai, next iteration pe jump.
 * c) LABELED break/continue: Nested loops me outer loop ko break/continue karne ke liye.
 *    - Syntax: outerLabel: for (...) { for (...) { break outerLabel; } }
 */

public class Core_Java_ControlFlow {
    public static void main(String[] args) {

        // ===== 1. CONDITIONAL STATEMENTS =====
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

        // ===== 2. LOOPS =====
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

        // ===== 3. LOOP CONTROL =====
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
