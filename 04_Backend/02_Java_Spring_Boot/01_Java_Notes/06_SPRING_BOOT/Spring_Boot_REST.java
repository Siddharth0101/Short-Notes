/**
 * ========================================================================
 * 06. SPRING BOOT & REST APIs (DETAILED)
 * ========================================================================
 * NOTES:
 * - Spring framework bohot powerful hai, par uski configuration (XML, server setup, dependencies matching) bohot heavy thi.
 * - Spring Boot = Spring + Auto-Configuration + Embedded Server.
 * 
 * ========================================================================
 * 1. SPRING BOOT MAGIC
 * ========================================================================
 * - Opinionated Defaults: Ye khud assume karta hai aapko kya chahiye. Agar classpath me Tomcat hai, toh by default Tomcat server chala dega.
 * - Starter POMs: `spring-boot-starter-web` (Web + REST + Tomcat), `spring-boot-starter-data-jpa` (Hibernate + JPA). Aapko individual version match nahi karne padte.
 * - Embedded Server: Aapko alag se Tomcat install karke `.war` deploy karne ki zaroorat nahi. Aap simple `java -jar app.jar` run karte ho.
 * 
 * ========================================================================
 * 2. @SpringBootApplication ANNOTATION
 * ========================================================================
 * Main class pe lagta hai. Ye teen (3) annotations ka combination hai:
 * a) @EnableAutoConfiguration: Classpath pe mili libraries ke basis pe beans auto-configure karna (e.g. DataSource setup agar DB driver mila).
 * b) @ComponentScan: Current package aur uske child packages me @Component, @Service, @Controller scan karna.
 * c) @Configuration: Is class ke andar @Bean define kar sakte ho.
 * 
 * ========================================================================
 * 3. APPLICATION.PROPERTIES / APPLICATION.YML
 * ========================================================================
 * - Spring Boot application ka configuration file. src/main/resources/ me hota hai.
 * - Dono format supported hain: .properties (key=value) aur .yml (YAML indented format).
 * 
 * COMMON PROPERTIES:
 * - server.port=9090                         -> Default port 8080 se 9090 change
 * - spring.datasource.url=jdbc:mysql://...   -> Database connection URL
 * - spring.datasource.username=root          -> DB username
 * - spring.datasource.password=root          -> DB password
 * - spring.jpa.hibernate.ddl-auto=update     -> Auto create/update tables (create, update, validate, none)
 * - spring.jpa.show-sql=true                 -> Console me SQL queries dikhao
 * - logging.level.org.springframework=DEBUG  -> Log level set karna
 * 
 * CUSTOM PROPERTIES:
 * - app.name=MyApp  -> @Value("${app.name}") se inject kar sakte ho kisi bhi class me.
 * 
 * ========================================================================
 * 4. SPRING PROFILES (Environment-specific Config)
 * ========================================================================
 * - Problem: Dev me H2 database chahiye, Prod me MySQL. Alag alag settings alag environments ke liye.
 * - Solution: application-dev.properties, application-prod.properties alag files banao.
 * - Active profile set karo: spring.profiles.active=dev (application.properties me ya command line pe).
 * - @Profile("dev") annotation se beans ko specific profile me hi load karo.
 * 
 * ========================================================================
 * 5. BUILDING REST APIs (Layered Architecture)
 * ========================================================================
 * 
 * REQUEST FLOW:
 * Client -> Controller -> Service -> Repository -> Database
 * Client <- Controller <- Service <- Repository <- Database
 * 
 * LAYERS:
 * - Controller Layer (@RestController): Sirf HTTP requests (GET, POST) handle karta hai, input validate karta hai. Logic nahi likhna yahan.
 * - Service Layer (@Service): Business logic (Tax calculation, API calling) yahan likha jata hai.
 * - Repository Layer (@Repository): Database se baat karne ka kaam (Data JPA).
 * - Model/Entity: Data classes (@Entity for DB, DTO for transfer).
 * 
 * ========================================================================
 * 6. REST ANNOTATIONS
 * ========================================================================
 * - @RestController: `@Controller` + `@ResponseBody`. Return value direct JSON me convert ho ke HTTP Response me jati hai (bina UI render kiye).
 * - @RequestMapping("/api/v1/users"): Base URL for the controller.
 * - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: HTTP Methods mapping.
 * - @PathVariable: URL template se variable nikalna `/users/{id}`.
 * - @RequestParam: Query string se data nikalna `/users?id=123`.
 * - @RequestBody: Incoming JSON body ko Java Object me bind/map karna.
 * 
 * ========================================================================
 * 7. RESPONSEENTITY (Proper HTTP Responses)
 * ========================================================================
 * - ResponseEntity = HTTP response ka complete control (body + status code + headers).
 * - Plain return "Hello" sirf 200 OK deta hai. ResponseEntity se 201, 404, 500 sab control ho sakte hain.
 * - Syntax: return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
 * - Shortcuts:
 *   - ResponseEntity.ok(body)                    -> 200 OK
 *   - ResponseEntity.status(201).body(obj)       -> 201 Created
 *   - ResponseEntity.notFound().build()          -> 404 Not Found (no body)
 *   - ResponseEntity.badRequest().body(error)    -> 400 Bad Request
 *   - ResponseEntity.noContent().build()         -> 204 No Content (after delete)
 * 
 * ========================================================================
 * 8. EXCEPTION HANDLING IN REST (⭐ IMPORTANT)
 * ========================================================================
 * - @ExceptionHandler: Controller ke andar specific exception handle karna.
 * - @ControllerAdvice / @RestControllerAdvice: GLOBAL exception handler (saari controllers ke liye ek jagah).
 * - Custom error response DTO banao (timestamp, message, status) taaki client ko clean errors jaayein.
 * 
 * ========================================================================
 * 9. BEAN VALIDATION (@Valid)
 * ========================================================================
 * - spring-boot-starter-validation dependency add karo.
 * - Model/DTO ke fields pe validation annotations lagao:
 *   - @NotNull: Null nahi hona chahiye
 *   - @NotBlank: Null nahi, empty string nahi, whitespace nahi
 *   - @Size(min=2, max=50): Length range
 *   - @Min(18), @Max(100): Numeric range
 *   - @Email: Valid email format
 *   - @Pattern(regexp="..."): Custom regex pattern
 * - Controller me parameter pe @Valid lagao: createUser(@Valid @RequestBody User user)
 * - Validation fail pe MethodArgumentNotValidException throw hota hai -> @ControllerAdvice me handle karo.
 * 
 * ========================================================================
 * 10. CONTENT NEGOTIATION
 * ========================================================================
 * - Client decide karta hai response kis format me chahiye (JSON ya XML).
 * - Accept header: Client request me `Accept: application/json` ya `Accept: application/xml` bhejta hai.
 * - Jackson (JSON) by default included hai. XML ke liye `jackson-dataformat-xml` dependency add karo.
 * - @GetMapping(produces = "application/json") se force bhi kar sakte ho.
 * 
 * ========================================================================
 * 11. SPRING BOOT EXTRAS
 * ========================================================================
 * 
 * @Transactional:
 * - Service layer pe lagao. Agar method ke beech me error aaye toh saare DB changes ROLLBACK ho jaayein.
 * - Example: Transfer money -> debit account A, credit account B. Agar credit fail ho toh debit bhi rollback.
 * 
 * Spring Boot DevTools:
 * - spring-boot-devtools dependency add karo.
 * - Automatic Restart: Code change pe server auto-restart ho jata hai (no manual stop/start).
 * - LiveReload: Browser bhi auto-refresh hota hai.
 * 
 * Spring Boot Actuator:
 * - spring-boot-starter-actuator dependency add karo.
 * - Production-ready endpoints milte hain:
 *   - /actuator/health -> Application health status (UP/DOWN)
 *   - /actuator/info -> Application info
 *   - /actuator/metrics -> Memory, CPU, request count
 *   - /actuator/env -> Environment properties
 * - management.endpoints.web.exposure.include=health,info,metrics
 * 
 * Swagger / OpenAPI:
 * - springdoc-openapi-starter-webmvc-ui dependency add karo.
 * - Automatically REST API documentation generate hoti hai.
 * - Visit: http://localhost:8080/swagger-ui.html -> Interactive API testing page!
 * - @Operation, @ApiResponse annotations se customize karo.
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
