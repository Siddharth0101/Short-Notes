/**
 * ========================================================================
 * 01. JDBC (JAVA DATABASE CONNECTIVITY)
 * ========================================================================
 * NOTES:
 * - JDBC ek Java API hai jo Java application ko directly relational database (MySQL, PostgreSQL, Oracle) se connect karti hai.
 * - Ye low-level API hai, matlab aapko Connection open karna, raw SQL likhna, aur result ko manually objects me map karna padta hai.
 * - Aaj kal production me directly JDBC kam use hota hai (Spring Data JPA / Hibernate zyada use hota hai), par internal working samajhne ke liye JDBC aana zaroori hai.
 * 
 * JDBC ARCHITECTURE (7 STEPS):
 * 1. Import Packages: `import java.sql.*`
 * 2. Load & Register Driver: Pehle `Class.forName()` use hota tha, naye JDBC me auto-load hota hai agar dependency pom.xml me ho.
 * 3. Establish Connection: `DriverManager.getConnection(url, username, password)` call karna.
 * 4. Create Statement: 
 *    - `Statement`: Static SQL queries ke liye. (Not secure against SQL Injection)
 *    - `PreparedStatement`: Dynamic/Parameterized queries ke liye (Use this! It's pre-compiled and safe from SQL Injection).
 * 5. Execute Query:
 *    - `executeQuery()`: `SELECT` ke liye (Returns ResultSet).
 *    - `executeUpdate()`: `INSERT`, `UPDATE`, `DELETE` ke liye (Returns integer rows affected).
 * 6. Process Result: `ResultSet` pointer ko loop lagakar data nikalna (`rs.next()`, `rs.getString(1)`).
 * 7. Close Connection: Resources free karne ke liye hamesha connection close karo (in `finally` block or use Try-With-Resources).
 * 
 * WHY PREPARED STATEMENT?
 * - SQL Injection Attack: Agar login form me user `admin' OR '1'='1` likhe, toh simple `Statement` poori DB delete ya hack kar sakta hai.
 * - `PreparedStatement` user input ko query ka hissa banne se pehle as "literal value" treat karta hai, query structure change nahi hone deta.
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JDBC_Database {
    public static void main(String[] args) {
        
        String url = "jdbc:mysql://localhost:3306/telusko_db";
        String user = "root";
        String pass = "rootpassword";

        // Connection string
        String selectQuery = "SELECT id, name, age FROM student WHERE age > ?";

        // Try-With-Resources (Auto-closes Connection and PreparedStatement)
        try (Connection con = DriverManager.getConnection(url, user, pass);
             PreparedStatement pst = con.prepareStatement(selectQuery)) {

            // Set the dynamic parameter (index starts at 1)
            pst.setInt(1, 18); 

            // Execute Select Query
            ResultSet rs = pst.executeQuery();

            // Loop through the ResultSet
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                int age = rs.getInt("age");
                
                System.out.println("ID: " + id + ", Name: " + name + ", Age: " + age);
            }

        } catch (SQLException e) {
            System.out.println("Database Error! Is your MySQL running on port 3306?");
            // e.printStackTrace();
        }
    }
}
