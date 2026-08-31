/**
 * ========================================================================
 * 04. MAVEN BUILD TOOL
 * ========================================================================
 * NOTES:
 * - Maven ek "Project Management and Comprehension Tool" hai.
 * - Bina Maven, humein 3rd party libraries (like MySQL driver, Spring Framework) manually internet se download (JAR files) karke IDE me add karni padti thi.
 * - Agar koi library khud dusri library pe depend karti hai (Transitive Dependency), toh aur bhi zyada headache.
 * 
 * WHAT MAVEN SOLVES:
 * 1. Dependency Management: Maven automatically saari dependencies (aur unki sub-dependencies) Maven Central Repository se download karta hai.
 * 2. Standardized Directory Structure:
 *    - src/main/java (Actual code)
 *    - src/main/resources (Config files like application.properties)
 *    - src/test/java (Unit tests)
 * 3. Build Lifecycle: Compile, test, pack (JAR/WAR) karne ka standardized process.
 * 
 * POM.XML (Project Object Model):
 * - Project ke root pe hoti hai. Ye Maven ka dil (heart) hai.
 * - Isme project ki meta-info (groupId, artifactId, version) hoti hai.
 * - Isme <dependencies> tag ke andar saari external libraries mention ki jati hain.
 * 
 * MAVEN REPOSITORIES:
 * 1. Local Repository: Aapke PC pe `~/.m2` folder. Maven hamesha pehle yahan check karta hai ki library hai ya nahi.
 * 2. Central Repository: Internet (mvnrepository.com) pe hoti hai. Agar local pe nahi hai, toh yahan se download karke local me save karta hai.
 * 
 * MAVEN LIFECYCLE (PHASES):
 * - mvn clean : Target folder (purani compiled .class files) ko delete karta hai.
 * - mvn compile : Java files ko compile karke .class (bytecode) banata hai.
 * - mvn test : Junit test cases run karta hai.
 * - mvn package : Code aur resources ko milakar ek JAR (Java ARchive) ya WAR (Web ARchive) file banata hai.
 * - mvn install : Uss JAR file ko aapki Local Repository (`~/.m2`) me daal deta hai taaki dusre local projects use kar sakein.
 * 
 * MAVEN IN SPRING BOOT:
 * - Spring Boot apps me `spring-boot-starter-parent` POM inherit hoti hai, jisse saari libraries ke versions aapas me compatible rehte hain (BOM - Bill of Materials).
 */

public class Maven_Build_Tool {
    public static void main(String[] args) {
        System.out.println("Maven handles your dependencies, so you can focus on coding!");
        
        /* 
        Sample pom.xml snippet:
        
        <dependencies>
            <!-- Spring Web dependency -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>3.1.2</version>
            </dependency>
            
            <!-- MySQL Driver -->
            <dependency>
                <groupId>com.mysql</groupId>
                <artifactId>mysql-connector-j</artifactId>
                <scope>runtime</scope>
            </dependency>
        </dependencies>
        */
    }
}
