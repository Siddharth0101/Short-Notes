---
id: java-security-microservices
title: Spring Security and reliable service boundaries
track: spring-boot
order: 7
level: Advanced
minutes: 3
summary: Authentication — who the user is; authorization — what access is allowed.
tags: security, jwt, csrf, microservices
visual: request-flow
---

## Quick revision

> Revision target — After a valid identity, authorize the action and the object ownership separately.

- Authentication — who the user is; authorization — what access is allowed.
- Security filter chain — the request passes through the security filters before the controller.
- JWT — validate the signature, issuer, audience and expiry; the payload is not encrypted by default.
- Password — an adaptive password hash; no plaintext/reversible storage.
- CSRF — think about protection for requests with credentials the browser sends automatically.
- CORS — the browser's cross-origin policy; not a replacement for authorization.
- Microservice call — a timeout, bounded retries and identity propagation.
- Object access — check the user/tenant permission on every resource.
- 401/403 — the contract for missing/invalid authentication / insufficient permission.
- Method security — authorization at the service entry; the object ownership check is still explicit.
- Credential rotation — keep a rollout plan for old/new key overlap, expiry and revocation.

### Service communication

- Gateway/discovery — routing and service location; design the failure behaviour.
- Feign/client — a remote call still demands a timeout/retry/error boundary.

### Edge cases and reasoning

- Authorization layers — resource ownership along with the endpoint role check; an authenticated user is not automatically allowed access to an arbitrary ID.
- Token revocation — a stateless signed token can stay valid until expiry; logout/revocation requirements need an explicit strategy.
- Security context async — inspect principal context propagation at executor/task boundaries; do not let arbitrary background work blindly inherit the request's auth.

## Understand it with an example

- Scenario — User A requests `/orders/orderB` with a valid token; order B belongs to another tenant.
- Reasoning — Token validation tells you A's identity. Fetching/updating the order must not be allowed without a server-authenticated tenant/ownership scope.
- Catch — A hidden UI button, an unguessable ID or a CORS rule is not a substitute for object authorization; enforce the resource access rule on the server.

## Recall and practice

- Question — If CORS is restricted, will an unauthorized curl request be blocked automatically?
- Answer — No; CORS is a browser policy. The server must enforce authentication, authorization and resource ownership independently.
- Try it yourself — Write two-user API security cases; verify a missing token, an expired token, the wrong tenant, an insufficient role and valid access to an own resource.

## Practice questions

### Easy · 401 vs 403

<details>
<summary>Answer</summary>

- `401 Unauthorized` — not authenticated, or the token is invalid/expired ("who are you?").
- `403 Forbidden` — recognised, but no permission ("you cannot do this").
- Hiding — for another user's resource, teams sometimes return `404` so that its existence does not leak.

</details>

### Easy · How do you store a password?

<details>
<summary>Answer</summary>

- Hash — an adaptive, salted algorithm: BCrypt/Argon2/SCrypt via `PasswordEncoder`.
- Spring — `PasswordEncoderFactories.createDelegatingPasswordEncoder()` with the `{bcrypt}` prefix; a future algorithm upgrade is easy.
- Never — plain text, encryption (reversible), MD5/SHA-256 without a work factor.

</details>

### Medium · A logged-in user can see anyone's order

```java
@GetMapping("/orders/{id}")
OrderDto get(@PathVariable long id) { return service.get(id); }
```

The endpoint is authenticated. What is the problem?

<details>
<summary>Answer</summary>

- IDOR / broken object level authorization — there is authentication, but no object ownership check.
- Fix — the owner in the query: `orderRepo.findByIdAndOwnerId(id, currentUserId)` → `404` if not found.
- Or method security — `@PreAuthorize("@orderAccess.canRead(#id, authentication)")`.
- Rule — on every object access: "is this user the owner of / permitted on this object?"

</details>

### Medium · The difference between CORS and CSRF

<details>
<summary>Answer</summary>

- CORS — tells the browser whether JS from another origin may read the response; it does not protect the server (curl ignores CORS).
- CSRF — an attacker's site makes the user's browser send a state-changing request along with the cookies.
- Cookie sessions — need CSRF protection (a token + SameSite).
- Bearer token (Authorization header) — the browser does not send it automatically, so the CSRF risk is lower; disabling CSRF is common in that case.

</details>

### Hard · JWT revocation and rotation

The problem with a stateless JWT: the token stays valid even after logout or an account block. A production design?

<details>
<summary>Answer</summary>

- Short-lived access token — 5–15 min; the damage window is small.
- Refresh token — stored server-side (hashed), rotated on every use; if reuse is detected, revoke the whole family.
- Revocation — revoke refresh tokens on logout/block; in urgent cases a `jti` denylist or a user `tokenVersion` check.
- Validation — the signature, `exp`, `iss`, `aud`, the allowed algorithm; key rotation through `kid`.
- Storage — in the browser, the refresh token goes in an `HttpOnly` cookie.

</details>

## Sources — further reading

- [JWT resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [OAuth2 client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)
- [Spring Modulith](https://docs.spring.io/spring-modulith/reference/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/07-security-microservices.md)
