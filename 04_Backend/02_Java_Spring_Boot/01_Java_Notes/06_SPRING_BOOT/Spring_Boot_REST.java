/**
 * ========================================================================
 * 06. SPRING BOOT & REST APIs
 * ========================================================================
 * NOTES:
 * - Spring framework bohot powerful hai, par uski configuration (XML, server setup, dependencies matching) bohot heavy thi.
 * - Spring Boot = Spring + Auto-Configuration + Embedded Server.
 * 
 * 1. SPRING BOOT MAGIC:
 * - Opinionated Defaults: Ye khud assume karta hai aapko kya chahiye. Agar classpath me Tomcat hai, toh by default Tomcat server chala dega.
 * - Starter POMs: `spring-boot-starter-web` (Web + REST + Tomcat), `spring-boot-starter-data-jpa` (Hibernate + JPA). Aapko individual version match nahi karne padte.
 * - Embedded Server: Aapko alag se Tomcat install karke `.war` deploy karne ki zaroorat nahi. Aap simple `java -jar app.jar` run karte ho.
 * 
 * 2. @SpringBootApplication ANNOTATION:
 * Main class pe lagta hai. Ye teen (3) annotations ka combination hai:
 * a) @EnableAutoConfiguration: Classpath pe mili libraries ke basis pe beans auto-configure karna (e.g. DataSource setup agar DB driver mila).
 * b) @ComponentScan: Current package aur uske child packages me @Component, @Service, @Controller scan karna.
 * c) @Configuration: Is class ke andar @Bean define kar sakte ho.
 * 
 * 3. BUILDING REST APIs (Controller, Service, Repository Architecture):
 * - Controller Layer (@RestController): Sirf HTTP requests (GET, POST) handle karta hai, input validate karta hai. Logic nahi likhna yahan.
 * - Service Layer (@Service): Business logic (Tax calculation, API calling) yahan likha jata hai.
 * - Repository Layer (@Repository): Database se baat karne ka kaam (Data JPA).
 * 
 * 4. REST ANNOTATIONS:
 * - @RestController: `@Controller` + `@ResponseBody`. Return value direct JSON me convert ho ke HTTP Response me jati hai (bina UI render kiye).
 * - @RequestMapping("/api/v1/users"): Base URL for the controller.
 * - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: HTTP Methods mapping.
 * - @PathVariable: URL template se variable nikalna `/users/{id}`.
 * - @RequestParam: Query string se data nikalna `/users?id=123`.
 * - @RequestBody: Incoming JSON body ko Java Object me bind/map karna.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Arrays;

// --- MODEL (Data Transfer Object) ---
class User {
    public int id;
    public String name;
    
    public User(int id, String name) { this.id = id; this.name = name; }
}

// --- CONTROLLER ---
@RestController
@RequestMapping("/api/users")
class UserController {

    // Mock Database list
    private List<User> users = Arrays.asList(new User(1, "Siddharth"), new User(2, "Telusko"));

    @GetMapping
    public List<User> getAllUsers() {
        return users; // Automatically converted to JSON (e.g., [{"id":1,"name":"Siddharth"},...])
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        // Return user with matching ID
        return users.stream().filter(u -> u.id == id).findFirst().orElse(null);
    }

    @PostMapping
    public String createUser(@RequestBody User newUser) {
        // Here we would normally save to DB using a Service class
        return "User " + newUser.name + " created successfully!";
    }
}

// --- MAIN CLASS ---
@SpringBootApplication
public class Spring_Boot_REST {
    public static void main(String[] args) {
        // SpringApplication.run(Spring_Boot_REST.class, args);
        System.out.println("Spring Boot Application started on port 8080 (Embedded Tomcat)");
        System.out.println("Visit: http://localhost:8080/api/users");
    }
}
