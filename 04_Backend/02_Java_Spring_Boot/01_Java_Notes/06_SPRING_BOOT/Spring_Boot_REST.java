/**
 * ## Quick revision
 *
 * - `@RestController` — HTTP response body return karne wala controller.
 * - Mapping — path + HTTP method se handler choose.
 * - DTO — external request/response shape; persistence entity directly expose mat karo.
 * - Controller — parse/validate/response; service — business rules; repository — persistence.
 * - Status — create 201, missing 404, invalid input 400 jaise contract clear rakho.
 * - Idempotency — repeated request ka side effect contract define karo.
 * - Pagination — bounded size aur stable ordering do.
 * - Content negotiation — Accept expected response type; Content-Type sent body ka type.
 * - Path/query/body — resource identity / filters / structured payload ko suitable binding se lo.
 * - Entity exposure — internal fields, lazy relations aur schema changes API contract leak kar sakte hain.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

// --- MODEL (Data Transfer Object) ---
class User {
    public int id;
    public String name;
    // In real app: @NotBlank(message = "Name is required")
    // @Size(min = 2, max = 50, message = "Name must be 2-50 chars")
    
    public User(int id, String name) { this.id = id; this.name = name; }
}

// --- CUSTOM EXCEPTION ---
class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(int id) {
        super("User not found with id: " + id);
    }
}

// --- GLOBAL EXCEPTION HANDLER ---
@RestControllerAdvice
class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
    
    // Handle validation errors
    // @ExceptionHandler(MethodArgumentNotValidException.class)
    // public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
    //     Map<String, String> errors = new HashMap<>();
    //     ex.getBindingResult().getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
    //     return ResponseEntity.badRequest().body(errors);
    // }
}

// --- CONTROLLER (with ResponseEntity) ---
@RestController
@RequestMapping("/api/users")
class UserController {

    // Mock Database list
    private List<User> users = new ArrayList<>(List.of(
        new User(1, "Siddharth"), 
        new User(2, "Telusko")
    ));

    // GET all users -> 200 OK
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(users); // 200 with body
    }

    // GET user by ID -> 200 OK or 404 Not Found
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = users.stream().filter(u -> u.id == id).findFirst();
        return user.map(ResponseEntity::ok)                      // 200 if found
                   .orElseThrow(() -> new UserNotFoundException(id)); // 404 via @ControllerAdvice
    }

    // POST create user -> 201 Created
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        // In real app: public ResponseEntity<User> createUser(@Valid @RequestBody User newUser)
        users.add(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser); // 201
    }

    // DELETE user -> 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        users.removeIf(u -> u.id == id);
        return ResponseEntity.noContent().build(); // 204
    }
}

// --- MAIN CLASS ---
@SpringBootApplication
public class Spring_Boot_REST {
    public static void main(String[] args) {
        // SpringApplication.run(Spring_Boot_REST.class, args);
        System.out.println("Spring Boot Application started on port 8080 (Embedded Tomcat)");
        System.out.println("Visit: http://localhost:8080/api/users");
        System.out.println("Swagger: http://localhost:8080/swagger-ui.html");
        System.out.println("Actuator: http://localhost:8080/actuator/health");
    }
}
