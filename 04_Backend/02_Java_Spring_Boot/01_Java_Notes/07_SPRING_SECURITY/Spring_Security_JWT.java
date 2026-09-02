/**
 * ========================================================================
 * 07. SPRING SECURITY & JWT (DETAILED)
 * ========================================================================
 * NOTES:
 * - Spring Security ek framework hai jo aapki application me Authentication aur Authorization add karta hai.
 * - Jaise hi aap `spring-boot-starter-security` POM me dalte ho, by default saari APIs secure ho jati hain (Basic Auth - 401 Unauthorized aayega bina login ke).
 * 
 * ========================================================================
 * 1. CORE CONCEPTS
 * ========================================================================
 * - Authentication: "Aap kaun ho?" (Login: Username & Password check karna).
 * - Authorization: "Aap kya kar sakte ho?" (Permissions/Roles: Admin can delete, User can only read).
 * - UserDetailsService: Ek interface jo database se user ka data (username, password, roles) laata hai.
 * - PasswordEncoder: Password plain text me save nahi karna chahiye. BCryptPasswordEncoder hashes ko match karta hai.
 * - SecurityFilterChain: Yahan rules define hote hain. (Konsi URL secure hai, konsi public).
 * 
 * ========================================================================
 * 2. JWT (JSON WEB TOKEN) STATELESS AUTHENTICATION
 * ========================================================================
 * - Traditional Session: User login karta hai, server ek 'session' memory me save karta hai aur browser ko 'cookie' deta hai. Microservices me ye bura hai kyunki agar server-A pe login kiya aur request server-B pe gayi toh wo usko nahi janta.
 * - Stateless (JWT): 
 *   a) User login (POST /login) -> Server DB verify karta hai -> JWT generate karke return karta hai.
 *   b) Server kuch yaad nahi rakhta.
 *   c) Next request me user JWT `Authorization: Bearer <token>` header me bhejta hai.
 *   d) Server apni secret key se token verify karta hai aur usme se user details nikal leta hai.
 * 
 * JWT STRUCTURE:
 * - Header: Algorithm details (HS256).
 * - Payload: Data / Claims (e.g., username, role, expiration time).
 * - Signature: (Header + Payload) hashed with a SECRET_KEY. Agar kisi ne payload change kiya toh signature match nahi karega!
 * 
 * IMPLEMENTATION FLOW (JWT in Spring):
 * - Step 1: Login API jo credentials le aur `AuthenticationManager` se verify kare.
 * - Step 2: `JwtService` class banaye jo token create/validate kare.
 * - Step 3: `JwtRequestFilter` banaye (extends OncePerRequestFilter) jo har request se pehle chale. Agar header me token hai toh validate karke `SecurityContextHolder` me user dal de.
 * 
 * ========================================================================
 * 3. CSRF (Cross-Site Request Forgery)
 * ========================================================================
 * - CSRF kya hai? Ek attacker aapki authenticated session (cookies) ka fayda uthake background me fake request bhejta hai (e.g., money transfer on evil-site.com).
 * - Spring Security by default POST/PUT/DELETE pe CSRF protection ON rakhta hai (CSRF token expected).
 * - Stateless APIs (JWT): Jab hum cookies use hi nahi kar rahe, toh CSRF attack possible nahi hai. Isliye REST APIs (JWT) ke liye hum `csrf.disable()` kar dete hain!
 * 
 * ========================================================================
 * 4. CORS (Cross-Origin Resource Sharing)
 * ========================================================================
 * - CORS kya hai? Browser ka security feature. Agar React frontend (localhost:3000) Spring Boot API (localhost:8080) ko call kare, toh browser block kar dega (CORS error).
 * - Fix: Spring me CORS configure karna padta hai:
 *   - @CrossOrigin(origins = "http://localhost:3000") -> Controller ya Method pe.
 *   - Global config SecurityFilterChain me: `.cors(Customizer.withDefaults())` + `CorsConfigurationSource` bean.
 * 
 * ========================================================================
 * 5. METHOD-LEVEL SECURITY
 * ========================================================================
 * - URLs (SecurityFilterChain) ke alawa directly Methods pe security lagana.
 * - @EnableMethodSecurity(prePostEnabled = true) lagana padta hai main/config class pe.
 * - @PreAuthorize: Method execute hone se pehle check.
 *   - @PreAuthorize("hasRole('ADMIN')")
 *   - @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
 *   - @PreAuthorize("#username == authentication.principal.username") -> Sirf khud ka data access.
 * - @Secured: Older alternative. @Secured("ROLE_ADMIN").
 * - @PostAuthorize: Method run hone ke baad check (e.g., returned object caller ko belong karta hai?).
 * 
 * ========================================================================
 * 6. OAUTH2 & SOCIAL LOGIN (SSO)
 * ========================================================================
 * - "Login with Google/GitHub" implement karna.
 * - Dependency: `spring-boot-starter-oauth2-client`
 * - application.properties:
 *   - spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
 *   - spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET
 * - Security Config:
 *   - `http.oauth2Login(Customizer.withDefaults())`
 * - Flow: Spring user ko Google pe bhejta hai -> User authorize karta hai -> Google redirect back with auth code -> Spring code exchange karke user info laata hai -> User logged in!
 */

/*
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize on controllers
public class SecurityConfig {

    // Defining the Security Filter Chain Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST APIs (since we use tokens, not cookies)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/login", "/register").permitAll() // Open endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Role based access (URL level)
                .anyRequest().authenticated() // Everything else requires token
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Tell Spring NOT to use sessions
            // .oauth2Login(oauth2 -> oauth2.loginPage("/login")) // Enable OAuth2 (Google/Github login)
            // .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add our JWT filter
            .build();
    }

    // CORS Global Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow React app
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
        return source;
    }
}
*/

/*
// ===== METHOD LEVEL SECURITY EXAMPLE =====
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class AdminController {

    @GetMapping("/api/reports")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can call this method
    public String getReports() {
        return "Secret Reports Data";
    }

    @GetMapping("/api/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')") // Any logged in user
    public String getProfile() {
        return "User Profile Data";
    }
}
*/

public class Spring_Security_JWT {
    public static void main(String[] args) {
        System.out.println("Security Rule #1: Never store plain text passwords! Use BCrypt.");
        System.out.println("Security Rule #2: Stateless Microservices use JWTs.");
        System.out.println("Security Rule #3: REST APIs disable CSRF because they don't use cookies.");
        System.out.println("Security Rule #4: Fix frontend blocking with correct CORS configuration.");
    }
}

