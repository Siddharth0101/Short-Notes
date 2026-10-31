---
id: java-security-microservices
title: Spring Security and reliable service boundaries
track: spring-boot
order: 7
level: Advanced
minutes: 3
summary: Authentication — user kaun; authorization — kya access allowed.
tags: security, jwt, csrf, microservices
visual: request-flow
---

## Quick revision

> Revision target — Valid identity ke baad action aur object ownership ko separately authorize karo.

- Authentication — user kaun; authorization — kya access allowed.
- Security filter chain — request controller se pehle security filters se guzarti hai.
- JWT — signature, issuer, audience aur expiry validate; payload default encrypted nahi.
- Password — adaptive password hash; plaintext/reversible storage nahi.
- CSRF — browser auto-sent credentials wale requests par protection socho.
- CORS — browser cross-origin policy; authorization ka replacement nahi.
- Microservice call — timeout, bounded retry aur identity propagation.
- Object access — har resource par user/tenant permission check karo.
- 401/403 — missing/invalid authentication / insufficient permission ka contract.
- Method security — service entry par authorization; object ownership check phir bhi explicit.
- Credential rotation — old/new key overlap, expiry aur revocation ka rollout plan rakho.

### Service communication

- Gateway/discovery — routing aur service location; failure behavior design karo.
- Feign/client — remote call phir bhi timeout/retry/error boundary maangti hai.

### Edge cases aur reasoning

- Authorization layers — endpoint role check ke saath resource ownership; authenticated user ko arbitrary ID access automatically allowed nahi.
- Token revocation — stateless signed token expiry tak valid reh sakta; logout/revocation requirements ke liye explicit strategy chahiye.
- Security context async — executor/task boundaries par principal context propagation inspect; arbitrary background work ko request auth blindly inherit na karao.

## Example se samjho

- Scenario — User A valid token ke saath `/orders/orderB` request karta hai; order B doosre tenant ka hai.
- Reasoning — Token validation A ki identity batati hai. Server-authenticated tenant/ownership scope ke bina order fetch/update allow nahi hona chahiye.
- Catch — Hidden UI button, unguessable ID ya CORS rule object authorization ka substitute nahi; resource access rule server par enforce karo.

## Recall aur practice

- Sawal — CORS restricted ho toh unauthorized curl request automatically blocked hogi?
- Jawaab — Nahi; CORS browser policy hai. Server authentication, authorization aur resource ownership independently enforce kare.
- Khud try karo — Two-user API security cases likho; missing token, expired token, wrong tenant, insufficient role aur valid own-resource access verify karo.

## Practice questions

### Easy · 401 vs 403

<details>
<summary>Answer</summary>

- `401 Unauthorized` — authentication nahi hua ya token invalid/expired ("tum kaun ho?").
- `403 Forbidden` — pehchana gaya, par permission nahi ("tum yeh nahi kar sakte").
- Hiding — doosre user ka resource ho toh kabhi `404` return karte hain taaki existence leak na ho.

</details>

### Easy · Password kaise store karoge?

<details>
<summary>Answer</summary>

- Hash — adaptive, salted algorithm: BCrypt/Argon2/SCrypt via `PasswordEncoder`.
- Spring — `PasswordEncoderFactories.createDelegatingPasswordEncoder()` `{bcrypt}` prefix ke saath; future algorithm upgrade easy.
- Never — plain text, encryption (reversible), MD5/SHA-256 without work factor.

</details>

### Medium · Logged-in user kisi ka bhi order dekh sakta hai

```java
@GetMapping("/orders/{id}")
OrderDto get(@PathVariable long id) { return service.get(id); }
```

Endpoint authenticated hai. Problem kya hai?

<details>
<summary>Answer</summary>

- IDOR / broken object level authorization — authentication hai, par object ownership check nahi.
- Fix — query mein owner: `orderRepo.findByIdAndOwnerId(id, currentUserId)` → na mile toh `404`.
- Ya method security — `@PreAuthorize("@orderAccess.canRead(#id, authentication)")`.
- Rule — har object access par "kya yeh user is object ka owner/permitted hai?"

</details>

### Medium · CORS aur CSRF ka farq

<details>
<summary>Answer</summary>

- CORS — browser ko batata hai ki doosre origin ka JS response padh sakta hai ya nahi; server ko protect nahi karta (curl CORS ignore karta hai).
- CSRF — attacker site user ke browser se cookies ke saath state-changing request bhejwati hai.
- Cookie sessions — CSRF protection (token + SameSite) chahiye.
- Bearer token (Authorization header) — browser automatically nahi bhejta, isliye CSRF risk kam; tab CSRF disable karna common hai.

</details>

### Hard · JWT revocation aur rotation

Stateless JWT ka problem: logout ya account block ke baad bhi token valid rehta hai. Production design?

<details>
<summary>Answer</summary>

- Short-lived access token — 5–15 min; damage window chhota.
- Refresh token — server-side store (hashed), rotate on every use; reuse detect ho toh poori family revoke.
- Revocation — logout/block par refresh tokens revoke; urgent cases mein `jti` denylist ya user `tokenVersion` check.
- Validation — signature, `exp`, `iss`, `aud`, allowed algorithm; `kid` se key rotation.
- Storage — browser mein refresh token `HttpOnly` cookie mein.

</details>

## Sources — aur padhne ke liye

- [JWT resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [OAuth2 client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)
- [Spring Modulith](https://docs.spring.io/spring-modulith/reference/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/07-security-microservices.md)
