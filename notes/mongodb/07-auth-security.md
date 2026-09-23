---
id: mongo-auth-security
title: Authentication authorization and secure boundaries
track: mongodb
order: 7
level: Advanced
minutes: 1
summary: Authentication — identity verify; authorization — action/resource access verify.
tags: authentication, authorization, jwt, sessions, security, passwords
visual: request-flow
---

## Quick revision

- Authentication — identity verify; authorization — action/resource access verify.
- Password — adaptive hash; raw password store/log nahi.
- Session/token — expiry, revocation aur secure transport plan karo.
- JWT — signature + claims validate; decoded payload trusted nahi hota.
- Ownership — requested document user/tenant ka hai ya nahi, server par check.
- Injection — fields/operators allowlist karo; input se raw query mat banao.
- Rate limit — login/reset jaise sensitive endpoints protect karo.
- Browser security — XSS, CSRF aur cookie flags ko credential flow se match karo.

## Research notes: Authorize both the action and its object

- Authentication caller identify karti hai.

## Sources — aur padhne ke liye

- [Source yahan padho — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Express production security](https://expressjs.com/en/advanced/best-practice-security/)
- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/07-auth-security.md)
