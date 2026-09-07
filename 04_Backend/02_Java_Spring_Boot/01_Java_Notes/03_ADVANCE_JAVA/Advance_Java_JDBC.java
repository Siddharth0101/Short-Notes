/**
 * ========================================================================
 * 03c. ADVANCE JAVA - JDBC (Java Database Connectivity) [⚡ VISUAL]
 * ========================================================================
 * Source: Telusko — Master Java, Spring and Spring Boot, Spring Security,
 *         Spring AI, Docker and Microservices
 * 
 * ========================================================================
 * 1. WHAT IS JDBC?
 * ========================================================================
 * - JDBC = Java Database Connectivity. Java se database (MySQL, PostgreSQL, Oracle etc.)
 *   se connect karke CRUD operations perform karna.
 * - JDBC ek API hai (set of interfaces in java.sql package).
 * - Database vendor apna DRIVER (implementation) provide karta hai.
 * 
 * ARCHITECTURE:
 * ┌──────────────┐    ┌────────────────┐    ┌──────────────┐    ┌──────────┐
 * │  Java App    │ -> │  JDBC API      │ -> │ JDBC Driver  │ -> │ Database │
 * │ (your code)  │    │ (java.sql.*)   │    │ (vendor jar) │    │ (MySQL)  │
 * └──────────────┘    └────────────────┘    └──────────────┘    └──────────┘
 * 
 * JDBC WORKFLOW (7 Steps):
 * 1. Import java.sql package
 * 2. Load/Register the JDBC Driver (optional in modern Java — auto-loaded)
 * 3. Establish Connection using DriverManager.getConnection(url, user, password)
 * 4. Create Statement (Statement, PreparedStatement, or CallableStatement)
 * 5. Execute Query (executeQuery for SELECT, executeUpdate for INSERT/UPDATE/DELETE)
 * 6. Process ResultSet (iterate over results)
 * 7. Close resources (Connection, Statement, ResultSet)
 * 
 * ========================================================================
 * 2. KEY JDBC CLASSES/INTERFACES (java.sql package)
 * ========================================================================
 * 
 * ┌───────────────────┬────────────────────────────────────────────────────┐
 * │ Interface/Class   │ Purpose                                            │
 * ├───────────────────┼────────────────────────────────────────────────────┤
 * │ DriverManager     │ Manages JDBC drivers. Creates Connection objects.  │
 * │ Connection        │ Represents a session with the database.            │
 * │ Statement         │ Executes static SQL queries (no parameters).       │
 * │ PreparedStatement │ Executes parameterized SQL queries (⭐ preferred). │
 * │ CallableStatement │ Calls stored procedures in the database.           │
 * │ ResultSet         │ Holds the result of a SELECT query (table of rows).│
 * └───────────────────┴────────────────────────────────────────────────────┘
 * 
 * ========================================================================
 * 3. CONNECTION URL FORMAT
 * ========================================================================
 * - MySQL:      jdbc:mysql://localhost:3306/database_name
 * - PostgreSQL: jdbc:postgresql://localhost:5432/database_name
 * - H2:        jdbc:h2:mem:testdb (in-memory) or jdbc:h2:file:./data/testdb
 * - Oracle:    jdbc:oracle:thin:@localhost:1521:xe
 * 
 * FORMAT: jdbc:<subprotocol>://<host>:<port>/<database>
 * 
 * ========================================================================
 * 4. Statement vs PreparedStatement (⭐ IMPORTANT)
 * ========================================================================
 * 
 * Statement:
 * - SQL query as plain String. No parameter binding.
 * - VULNERABLE to SQL Injection! ❌
 * - Query compiled EVERY TIME it runs (slower for repeated queries).
 * - Example: stmt.executeQuery("SELECT * FROM users WHERE id = " + id);
 *   → Agar id = "1 OR 1=1" toh sab data leak ho jayega! (SQL Injection)
 * 
 * PreparedStatement (⭐ ALWAYS USE THIS):
 * - Parameterized queries with ? placeholders.
 * - SAFE from SQL Injection! ✅ (parameters are escaped automatically)
 * - Query pre-compiled once, then reused (faster for repeated queries).
 * - Example: pstmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
 *            pstmt.setInt(1, id); // index starts from 1, not 0!
 * 
 * ┌──────────────────┬────────────────────┬─────────────────────────┐
 * │ Feature          │ Statement          │ PreparedStatement       │
 * ├──────────────────┼────────────────────┼─────────────────────────┤
 * │ SQL Injection    │ ❌ Vulnerable      │ ✅ Safe                 │
 * │ Parameters       │ String concat      │ ? placeholders          │
 * │ Pre-compilation  │ ❌ No              │ ✅ Yes (faster)         │
 * │ Readability      │ Messy with concat  │ Clean                   │
 * │ Use case         │ One-off static SQL │ ⭐ Always preferred    │
 * └──────────────────┴────────────────────┴─────────────────────────┘
 * 
 * ========================================================================
 * 5. ResultSet
 * ========================================================================
 * - SELECT query ke result ko hold karta hai (rows ka table).
 * - Cursor initially BEFORE first row hota hai → rs.next() se aage badhao.
 * - rs.next() returns true agar next row hai, false agar khatam.
 * 
 * METHODS:
 * - rs.getInt("column_name")    → int value
 * - rs.getString("column_name") → String value
 * - rs.getDouble("column_name") → double value
 * - rs.getInt(1)                → value by column index (1-based!)
 * - rs.next()                   → move to next row
 * - rs.close()                  → release resources
 * 
 * ========================================================================
 * 6. TRANSACTION MANAGEMENT
 * ========================================================================
 * - By default, JDBC is in AUTO-COMMIT mode (har statement ke baad commit).
 * - Manual transaction ke liye:
 *   conn.setAutoCommit(false);  → auto-commit OFF
 *   conn.commit();              → saare changes SAVE karo
 *   conn.rollback();            → saare changes UNDO karo (error hone pe)
 * - Use case: Banking — debit aur credit DONO successful hone chahiye, warna rollback.
 * 
 * ========================================================================
 * 7. CRUD OPERATIONS SUMMARY
 * ========================================================================
 * 
 * CREATE (INSERT):
 *   PreparedStatement ps = conn.prepareStatement("INSERT INTO students (name, age) VALUES (?, ?)");
 *   ps.setString(1, "Navin");
 *   ps.setInt(2, 35);
 *   int rows = ps.executeUpdate(); // returns number of rows affected
 * 
 * READ (SELECT):
 *   PreparedStatement ps = conn.prepareStatement("SELECT * FROM students WHERE age > ?");
 *   ps.setInt(1, 18);
 *   ResultSet rs = ps.executeQuery(); // returns ResultSet
 *   while (rs.next()) { String name = rs.getString("name"); }
 * 
 * UPDATE:
 *   PreparedStatement ps = conn.prepareStatement("UPDATE students SET age = ? WHERE name = ?");
 *   ps.setInt(1, 36);
 *   ps.setString(2, "Navin");
 *   int rows = ps.executeUpdate();
 * 
 * DELETE:
 *   PreparedStatement ps = conn.prepareStatement("DELETE FROM students WHERE id = ?");
 *   ps.setInt(1, 101);
 *   int rows = ps.executeUpdate();
 * 
 * NOTE: executeQuery() → for SELECT (returns ResultSet)
 *       executeUpdate() → for INSERT/UPDATE/DELETE (returns int — rows affected)
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Advance_Java_JDBC {

    // ===== Database Configuration =====
    // Change these values to match YOUR database setup
    static final String DB_URL = "jdbc:mysql://localhost:3306/telusko_db";
    static final String DB_USER = "root";
    static final String DB_PASSWORD = "password";

    public static void main(String[] args) {

        System.out.println("===== JDBC — Java Database Connectivity =====");
        System.out.println("NOTE: This file demonstrates JDBC code structure.");
        System.out.println("To RUN these examples, you need:");
        System.out.println("  1. MySQL installed and running");
        System.out.println("  2. A database named 'telusko_db' created");
        System.out.println("  3. MySQL Connector/J JAR in classpath");
        System.out.println("  4. Update DB_URL, DB_USER, DB_PASSWORD above");
        System.out.println();

        // ===== EXAMPLE CODE (Commented out — uncomment when DB is ready) =====

        /*
        // ========== 1. ESTABLISH CONNECTION ==========
        System.out.println("--- 1. Connecting to Database ---");
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            System.out.println("✅ Connected to database!");
            System.out.println("DB Product: " + conn.getMetaData().getDatabaseProductName());

            // ========== 2. CREATE TABLE ==========
            System.out.println("\n--- 2. Create Table ---");
            try (Statement stmt = conn.createStatement()) {
                String createSQL = "CREATE TABLE IF NOT EXISTS students ("
                    + "id INT AUTO_INCREMENT PRIMARY KEY, "
                    + "name VARCHAR(100) NOT NULL, "
                    + "age INT, "
                    + "course VARCHAR(100)"
                    + ")";
                stmt.executeUpdate(createSQL);
                System.out.println("✅ Table 'students' created/verified.");
            }

            // ========== 3. INSERT (CREATE) using PreparedStatement ==========
            System.out.println("\n--- 3. INSERT (PreparedStatement) ---");
            String insertSQL = "INSERT INTO students (name, age, course) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertSQL)) {
                // Insert first student
                pstmt.setString(1, "Navin Reddy");   // ? index starts from 1
                pstmt.setInt(2, 35);
                pstmt.setString(3, "Java");
                pstmt.executeUpdate();
                System.out.println("✅ Inserted: Navin Reddy");

                // Insert second student (reuse same PreparedStatement!)
                pstmt.setString(1, "Siddharth");
                pstmt.setInt(2, 22);
                pstmt.setString(3, "Computer Science");
                pstmt.executeUpdate();
                System.out.println("✅ Inserted: Siddharth");
            }

            // ========== 4. SELECT (READ) ==========
            System.out.println("\n--- 4. SELECT (Read all students) ---");
            String selectSQL = "SELECT * FROM students";
            try (PreparedStatement pstmt = conn.prepareStatement(selectSQL);
                 ResultSet rs = pstmt.executeQuery()) {

                System.out.println("ID | Name              | Age | Course");
                System.out.println("---|-------------------|-----|------------------");
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");
                    int age = rs.getInt("age");
                    String course = rs.getString("course");
                    System.out.printf("%-3d| %-18s| %-4d| %s%n", id, name, age, course);
                }
            }

            // ========== 5. SELECT with WHERE (Parameterized) ==========
            System.out.println("\n--- 5. SELECT with WHERE ---");
            String selectWhere = "SELECT * FROM students WHERE age > ?";
            try (PreparedStatement pstmt = conn.prepareStatement(selectWhere)) {
                pstmt.setInt(1, 25); // age > 25
                try (ResultSet rs = pstmt.executeQuery()) {
                    System.out.println("Students older than 25:");
                    while (rs.next()) {
                        System.out.println("  " + rs.getString("name") + " (age " + rs.getInt("age") + ")");
                    }
                }
            }

            // ========== 6. UPDATE ==========
            System.out.println("\n--- 6. UPDATE ---");
            String updateSQL = "UPDATE students SET age = ? WHERE name = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(updateSQL)) {
                pstmt.setInt(1, 36);
                pstmt.setString(2, "Navin Reddy");
                int rowsUpdated = pstmt.executeUpdate();
                System.out.println("✅ Updated " + rowsUpdated + " row(s).");
            }

            // ========== 7. DELETE ==========
            System.out.println("\n--- 7. DELETE ---");
            String deleteSQL = "DELETE FROM students WHERE name = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(deleteSQL)) {
                pstmt.setString(1, "Siddharth");
                int rowsDeleted = pstmt.executeUpdate();
                System.out.println("✅ Deleted " + rowsDeleted + " row(s).");
            }

            // ========== 8. TRANSACTION MANAGEMENT ==========
            System.out.println("\n--- 8. Transaction Management ---");
            conn.setAutoCommit(false); // Turn off auto-commit

            try {
                String debitSQL = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
                String creditSQL = "UPDATE accounts SET balance = balance + ? WHERE id = ?";

                try (PreparedStatement debit = conn.prepareStatement(debitSQL);
                     PreparedStatement credit = conn.prepareStatement(creditSQL)) {

                    // Debit from Account 1
                    debit.setDouble(1, 500.00);
                    debit.setInt(2, 1);
                    debit.executeUpdate();

                    // Credit to Account 2
                    credit.setDouble(1, 500.00);
                    credit.setInt(2, 2);
                    credit.executeUpdate();

                    conn.commit(); // ✅ Both succeeded → SAVE changes
                    System.out.println("✅ Transaction committed successfully!");
                }
            } catch (SQLException e) {
                conn.rollback(); // ❌ Something failed → UNDO everything
                System.out.println("❌ Transaction rolled back: " + e.getMessage());
            } finally {
                conn.setAutoCommit(true); // Reset to default
            }

            // ========== 9. CLEANUP ==========
            System.out.println("\n--- 9. Cleanup ---");
            try (Statement stmt = conn.createStatement()) {
                stmt.executeUpdate("DROP TABLE IF EXISTS students");
                System.out.println("🗑️ Table 'students' dropped.");
            }

        } catch (SQLException e) {
            System.out.println("❌ Database error: " + e.getMessage());
            e.printStackTrace();
        }
        */

        // ===== REFERENCE: SQL Injection Example =====
        System.out.println("===== SQL Injection Prevention =====");
        System.out.println("");
        System.out.println("❌ WRONG (Statement — vulnerable to SQL Injection):");
        System.out.println("   String id = \"1 OR 1=1\";  // user input (malicious!)");
        System.out.println("   stmt.executeQuery(\"SELECT * FROM users WHERE id = \" + id);");
        System.out.println("   → Becomes: SELECT * FROM users WHERE id = 1 OR 1=1");
        System.out.println("   → Returns ALL users! Data breach! 💀");
        System.out.println("");
        System.out.println("✅ CORRECT (PreparedStatement — SQL Injection safe):");
        System.out.println("   pstmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\");");
        System.out.println("   pstmt.setString(1, id);  // id treated as DATA, not SQL code");
        System.out.println("   → \"1 OR 1=1\" is treated as a literal string, not SQL logic.");
        System.out.println("   → No data breach! ✅");
        System.out.println("");

        // ===== REFERENCE: Quick JDBC Cheatsheet =====
        System.out.println("===== JDBC Quick Cheatsheet =====");
        System.out.println("");
        System.out.println("1. Add JDBC Driver JAR to classpath (e.g., mysql-connector-j.jar)");
        System.out.println("2. Connection conn = DriverManager.getConnection(url, user, pass);");
        System.out.println("3. PreparedStatement ps = conn.prepareStatement(\"SQL with ?\");");
        System.out.println("4. ps.setString(1, value); ps.setInt(2, value); // 1-indexed!");
        System.out.println("5. ResultSet rs = ps.executeQuery(); // for SELECT");
        System.out.println("   int rows = ps.executeUpdate();    // for INSERT/UPDATE/DELETE");
        System.out.println("6. while (rs.next()) { rs.getString(\"col\"); }");
        System.out.println("7. Use try-with-resources for auto-closing!");
        System.out.println("");
        System.out.println("⭐ ALWAYS use PreparedStatement, NEVER Statement for user input!");
        System.out.println("⭐ ALWAYS use try-with-resources for Connection, Statement, ResultSet!");
    }
}
