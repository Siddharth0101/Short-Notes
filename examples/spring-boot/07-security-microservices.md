# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Filter chain and method-level security

```java
@Configuration
@EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
```

```java
@PreAuthorize("#ownerId == authentication.principal.userId")
@GetMapping("/api/notes/{ownerId}/list")
List<NoteView> listNotes(@PathVariable long ownerId) { ... }
```

## OAuth2 and refresh-token rotation

```text
Client -> Authorization server: refresh token
Authorization server -> Client: new access token + new refresh token (rotated)
Authorization server: marks old refresh token as used/invalid
```

## Service reliability

```text
React client -> gateway -> order service -> order database
                                |
                         transactional outbox
                                |
                              broker -> notification worker
```
