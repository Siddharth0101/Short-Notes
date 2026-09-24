---
id: java-security-microservices
title: Spring Security and reliable service boundaries
track: spring-boot
order: 7
level: Advanced
minutes: 1
summary: Authentication — user kaun; authorization — kya access allowed.
tags: security, jwt, csrf, microservices
visual: request-flow
---

## Quick revision

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

## Sources — aur padhne ke liye

- [JWT resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [OAuth2 client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)
- [Spring Modulith](https://docs.spring.io/spring-modulith/reference/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/07-security-microservices.md)
