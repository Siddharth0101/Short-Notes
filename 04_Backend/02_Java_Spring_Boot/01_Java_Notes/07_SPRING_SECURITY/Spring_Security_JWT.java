/**
 * ========================================================================
 * 07. SPRING SECURITY & JWT
 * ========================================================================
 * NOTES:
 * - Spring Security ek framework hai jo aapki application me Authentication aur Authorization add karta hai.
 * - Jaise hi aap `spring-boot-starter-security` POM me dalte ho, by default saari APIs secure ho jati hain (Basic Auth - 401 Unauthorized aayega bina login ke).
 * 
 * 1. CORE CONCEPTS:
 * - Authentication: "Aap kaun ho?" (Login: Username & Password check karna).
 * - Authorization: "Aap kya kar sakte ho?" (Permissions/Roles: Admin can delete, User can only read).
 * - UserDetailsService: Ek interface jo database se user ka data (username, password, roles) laata hai.
 * - PasswordEncoder: Password plain text me save nahi karna chahiye. BCryptPasswordEncoder hashes ko match karta hai.
 * - SecurityFilterChain: Yahan rules define hote hain. (Konsi URL secure hai, konsi public).
 * 
 * 2. JWT (JSON WEB TOKEN) STATELESS AUTHENTICATION:
 * - Traditional Session: User login karta hai, server ek 'session' memory me save karta hai aur browser ko 'cookie' deta hai. Microservices me ye bura hai kyunki agar server-A pe login kiya aur request server-B pe gayi toh wo usko nahi janta.
 * - Stateless (JWT): 
 *   a) User login (POST /login) -> Server DB verify karta hai -> JWT generate karke return karta hai.
 *   b) Server kuch yaad nahi rakhta.
 *   c) Next request me user JWT `Authorization: Bearer <token>` header me bhejta hai.
 *   d) Server apni secret key se token verify karta hai aur usme se user details nikal leta hai.
 * 
 * 3. JWT STRUCTURE:
 * - Header: Algorithm details (HS256).
 * - Payload: Data / Claims (e.g., username, role, expiration time).
 * - Signature: (Header + Payload) hashed with a SECRET_KEY. Agar kisi ne payload change kiya toh signature match nahi karega!
 * 
 * 4. IMPLEMENTATION FLOW (JWT in Spring):
 * - Step 1: Login API jo credentials le aur `AuthenticationManager` se verify kare.
 * - Step 2: `JwtService` class banaye jo token create/validate kare.
 * - Step 3: `JwtRequestFilter` banaye jo har request se pehle chale (OncePerRequestFilter). Agar header me token hai toh validate karke `SecurityContextHolder` me user dal de.
 */

/*
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Defining the Security Filter Chain Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST APIs (since we use tokens, not cookies)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/login", "/register").permitAll() // Open endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Role based access
                .anyRequest().authenticated() // Everything else requires token
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Tell Spring NOT to use sessions
            // .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add our JWT filter
            .build();
    }
}
*/

public class Spring_Security_JWT {
    public static void main(String[] args) {
        System.out.println("Security Rule #1: Never store plain text passwords! Use BCrypt.");
        System.out.println("Security Rule #2: Stateless Microservices use JWTs.");
    }
}
