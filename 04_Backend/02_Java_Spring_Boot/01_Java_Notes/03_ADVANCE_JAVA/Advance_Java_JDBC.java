/**
 * ## Quick revision
 *
 * - JDBC — Java se database connection, statement aur result handling.
 * - PreparedStatement — values bind karo; SQL string concatenation se injection risk.
 * - Connection pool — connections reuse; pool size database capacity se align karo.
 * - Transaction — related writes atomic commit/rollback unit mein rakho.
 * - Auto-commit — har statement separately commit ho sakta hai.
 * - JOIN — related rows jodo; one-to-many se result rows multiply ho sakti hain.
 * - Index — reads fast kar sakta hai; writes/storage ka cost badhta hai.
 * - Resources — connection, statement aur result set close karo.
 * - Batch update — repeated statements group; batch size aur partial failure handle karo.
 * - Generated keys — inserted ID driver/database supported API se lo; SELECT MAX(id) concurrency-safe nahi.
 * - Connection lifetime — transaction ke statements same connection par; finally mein pool ko release.
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Advance_Java_JDBC {
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
