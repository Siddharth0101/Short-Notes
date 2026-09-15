---
id: java-security-microservices
title: Spring Security and reliable service boundaries
track: spring-boot
order: 7
level: Advanced
minutes: 29
summary: Authentication caller ko identify karti hai; authorization requested resource ki permission check karti hai.
tags: security, jwt, csrf, microservices
visual: request-flow
---

## Mental model — simple soch

Authentication identity establish karta hai; authorization decide karta hai ki identity specific resource par action kar sakti hai. Login success se har note read permission nahi milti. Security har server-side operation ka contract hai. Microservice boundary network failures, independent deployments and ownership decisions introduce karti hai; architecture ko automatically simpler nahi banati.

> **Core takeaway:** Authentication caller ko identify karti hai; authorization requested resource ki permission check karti hai.

## Browser and API authentication

Session cookie browser app ke liye valid choice hai. Shared session store multiple app instances support kar sakta hai. JWT signed claims carry karta hai; signature payload encrypt nahi karti. Receiver allowed algorithm, trusted key, issuer, audience and expiry validate kare. Expired/revoked authorization and key rotation ka plan separately chahiye.

Spring Security resource server support trusted issuer se token validation configure kar sakta hai; custom handwritten JWT filter often avoidable hai. Roles coarse access gate dete hain. Resource-level authorization owner/tenant ID enforce kare, aur request body ke owner ID par trust mat karo. [JWT resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)

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

Request har registered filter se sequence mein guzarti hai — authentication filter pehle identity establish karta hai, phir authorization filter URL-pattern rules check karta hai. `requestMatchers` rule order matters: pehla matching rule apply hota hai, isliye specific paths (`/api/admin/**`) ko generic paths (`anyRequest()`) se pehle likhna zaroori hai. URL-level rules coarse hote hain; method-level security fine-grained ownership checks allow karta hai:

```java
@PreAuthorize("#ownerId == authentication.principal.userId")
@GetMapping("/api/notes/{ownerId}/list")
List<NoteView> listNotes(@PathVariable long ownerId) { ... }
```

`@PreAuthorize` method call se pehle expression evaluate karta hai — yeh URL matcher se zyada precise hai kyunki actual path variable ko authenticated principal se compare kar sakta hai, jabki `hasRole("USER")` sirf yeh confirm karta hai ki user logged in hai, na ki wo specifically apna hi data access kar raha hai.

## CSRF CORS and credential transport

CSRF risk automatically attached credentials se related hai. Cookie mein JWT store karne se CSRF magically disappear nahi hota. Explicit bearer-header-only API, without ambient authentication, ka threat model different hai. CSRF disable karne ka reason credential behavior ho, sirf REST label nahi. CORS browser response-sharing policy hai; authentication/authorization ka replacement nahi. [Spring CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)

Passwords adaptive password hashing se store karo and framework encoder use karo. Login attempts rate-limit karo, generic failure messages consider karo and secrets logs mein redact karo. Secure, HttpOnly and appropriate SameSite cookies useful controls hain, but complete threat model ki jagah nahi.

## OAuth2 and refresh-token rotation

Access token short-lived hota hai (typically minutes), refresh token longer-lived hota hai use karke naye access token issue karne ke liye:

```text
Client -> Authorization server: refresh token
Authorization server -> Client: new access token + new refresh token (rotated)
Authorization server: marks old refresh token as used/invalid
```

Refresh-token rotation ka matlab hai har refresh request ek naya refresh token bhi issue karti hai aur purana invalidate ho jaata hai. Yeh ek important detection mechanism deta hai: agar koi attacker stolen refresh token use kare pehle legitimate client ke, dono ka next refresh attempt fail hoga (kyunki token already "used" mark ho chuka), jo token-theft ka signal ban sakta hai — authorization server pura token family revoke kar sakta hai us signal par. Bina rotation ke, ek leaked long-lived refresh token indefinitely valid rehta hai jab tak explicitly revoke na ho.

Access token ka short lifetime aur refresh token ka rotation dono milke stateless-verification ka benefit (fast, no DB lookup per request) aur revocation ki zaroorat (compromised session ko turant invalidate karna) balance karte hain. [OAuth2 client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)

## Service reliability

```text
React client -> gateway -> order service -> order database
                                |
                         transactional outbox
                                |
                              broker -> notification worker
```

Example mein order and event record same database transaction mein commit hote hain. Relay later event publish karta hai. Duplicate delivery possible hai, so consumer event ID deduplicate kare and business action idempotent banaye. Order success notification service downtime par fail nahi hona chahiye if product permits asynchronous notification.

Every network call timeout define kare. Retry only transient, safe/idempotent work with bounded attempts, exponential backoff and jitter. Circuit breaker repeatedly failing dependency par requests temporarily stop kar sakta hai; bulkhead one dependency ka resource exhaustion contain karta hai. Docker container packaging consistency deta hai, distributed transactions solve nahi karta.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `hasRole("USER")` check karna kaafi hai yeh ensure karne ke liye ki user sirf apna khud ka data access kar raha hai. **Why it breaks:** Role check sirf yeh confirm karta hai ki user authenticated hai aur uske paas ek generic permission level hai — yeh path variable/request body mein diye gaye specific resource ID ka owner check nahi karta. User A login karke URL mein user B ka ID daal sakta hai (IDOR — insecure direct object reference), aur agar sirf role check ho, request pass ho jayegi. **Fix:** Resource-level authorization explicitly enforce karo — `@PreAuthorize` se path variable ko authenticated principal se compare karo, ya service layer mein query khud hi current user ke ID se scope karo.
- **Wrong assumption:** `requestMatchers` rules ka order security config mein matter nahi karta, Spring sabse specific match dhoondh lega. **Why it breaks:** Spring Security rules ko declaration order mein evaluate karta hai, first-match-wins — agar generic `anyRequest().authenticated()` specific `/api/admin/**` rule se pehle likh diya jaaye, admin path bhi generic rule se hi match ho jayega aur intended stricter check kabhi apply nahi hogi. **Fix:** Specific path patterns ko hamesha generic patterns se pehle declare karo, aur security config ka ek integration test likho jo actual applied rule verify kare.
- **Wrong assumption:** JWT ko decode karke uske claims (roles, user ID) par trust kar sakte hain bina signature verify kiye, kyunki "JWT toh encoded hi hota hai". **Why it breaks:** JWT sirf base64-encoded hota hai, encrypted nahi — koi bhi client-side tool se payload read aur even modify kar sakta hai. Signature verify kiye bina accept karna attacker ko apne khud ke fabricated claims (jaise `role: ADMIN`) ke saath token forge karne deta hai. **Fix:** Hamesha configured trusted issuer/public key se signature verify karo (Spring Security resource server yeh automatically karta hai jab correctly configured ho); kabhi bhi manually claims parse karke signature check skip mat karo.

## In a real backend service

IDOR (insecure direct object reference) bugs — jahan URL/body mein resource ID change karke doosre user ka data access ho jaata hai — real-world APIs mein sabse common security vulnerability class hai, aur yeh exactly authorization ke role-check-vs-ownership-check confusion se aati hai. Refresh-token rotation aur circuit breakers dono production incident response mein directly kaam aate hain: compromised session detect hone par pura token family revoke karna, aur ek downstream dependency ke fail hone par circuit breaker se cascading failure rokna, dono common on-call scenarios hain.

## Interview questions — bolkar practice karo

**Are JWTs stateless?** Local access-token verification session lookup avoid kar sakti hai. Refresh-token rotation, revocation and account permissions often state require karte hain; whole system necessarily stateless nahi.

**Why choose a modular monolith first?** One deployment and local transactions operations simplify karte hain. Clear modules future extraction allow karte hain. Split tab justify karo jab independent ownership, scaling or release needs complexity se outweigh karein.

**Can retries cause duplicate payments?** Haan. Timeout ka matlab operation failed hona guaranteed nahi. Stable idempotency key and durable outcome tracking duplicate business execution prevent karne ke essential tools hain.

**Why does refresh-token rotation help detect token theft?** Har refresh call naya refresh token issue karta hai aur purana invalidate kar deta hai. Agar stolen token attacker use kar le, legitimate client ka next refresh attempt fail hoga (already-used token) — yeh mismatch authorization server ko batata hai ki token compromise hua hai, jisse poori token family revoke ki ja sakti hai.

**What's the difference between a URL-based rule and @PreAuthorize?** URL-based rules (`requestMatchers`) coarse-grained hain — path pattern ke against role/authentication check karte hain. `@PreAuthorize` method-level fine-grained check allow karta hai jisme actual method arguments (jaise path variable) ko authenticated principal se compare kiya ja sakta hai, jo ownership-based authorization ke liye zaroori hai.

## Practice

Notes API mein user A ko user B ka note ID guess karwa kar authorization test karo. Then notification consumer ko same event twice deliver karo and verify exactly one logical notification record. Dependency timeout ke time API ka user-visible behavior document karo. Phir ek IDOR vulnerability intentionally reproduce karo (sirf `hasRole` check ke saath endpoint banao jisme dusre user ka ID access ho jaaye), phir `@PreAuthorize` ownership check se fix karo.

## Depth walkthrough — andar kya ho raha hai?

### Authentication ke baad authorization har resource par baaki hai

Valid token identity establish kar sakta hai; user A ko user B ka order read permission automatically nahi milti. Query authenticated principal/tenant scope enforce kare, route parameter ko trusted identity mat banao. Token signature ke saath issuer, audience, expiry aur allowed algorithm policy check hoti hai.

CORS browser response-sharing policy hai; non-browser attacker ko API call se stop nahi karti. CSRF credential transport context se derive hota hai, sirf “REST API” label se disappear nahi hota. Secret browser bundle mein ship karna environment-variable syntax se safe nahi hota.

**Practice:** Owner, unrelated user, expired token aur revoked permission ka matrix banao. Downstream service timeout mein retry safe/idempotent work aur bounded budget tak rakho. Gateway auth ke baad internal service ka trust contract document karo; arbitrary forwarded user header trusted nahi hona chahiye.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Logged-in user A guessed ID se user B ka private order maangta hai. Access check kahan lagega aur test kya prove karega?

> **Hint — chhota ishara:** Login success ownership establish nahi karta.

**Answer guide — pehle khud karo, phir compare karo:** Order return/change se pehle backend par ownership/role rule enforce karo. Cross-user read/write attempts mein private data aur mutation leak na ho. API contract ke hisaab se consistent forbidden/not-found behavior choose karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [JWT resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [OAuth2 client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)
- [Spring Modulith](https://docs.spring.io/spring-modulith/reference/)

## Related extension — aur samjho

- [Spring AI aur RAG — retrieval, permissions aur answer evaluation](13-ai-retrieval.md)
