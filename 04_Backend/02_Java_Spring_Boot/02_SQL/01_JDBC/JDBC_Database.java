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
