---
id: mongo-auth-security
title: Authentication authorization and secure boundaries
track: mongodb
order: 7
level: Advanced
minutes: 3
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
- Mass assignment — update fields allowlist; request body se role/owner blindly change mat karao.
- Session fixation — login/privilege change par suitable session identity rotation.
- Reset token — short-lived, single-use aur securely stored verification data.

### Server-side URL safety

- SSRF — user-controlled URL se server ko unintended internal/external destination par request karwa dena.
- Destination allowlist — expected hosts/protocols allow; resolved IPv4/IPv6 aur private/loopback/metadata targets validate karo.
- SSRF redirects — automatic redirect following disable karo, warna validated URL se blocked destination tak bypass ho sakta hai.
- Egress control — server ke outbound network access ko required destinations tak restrict; URL validation ke saath defense lagao.

### Edge cases aur reasoning

- Credentialed CORS — browser cross-origin cookies ke liye explicit trusted origin/credential policy; wildcard origin credential access allow nahi karta.
- Reset token secrecy — verification token logs/analytics/URLs se leak ho sakta; short expiry, single-use aur safe transport/storage contract rakho.
- Authorization predicate — {_id,tenantId,ownerId} server-verified scope ke saath read/write; ID lookup ke baad unchecked mutation avoid karo.

## Research notes: Authorize both the action and its object

- Authentication caller identify karti hai.

## Recall aur practice

- Sawal — User body mein ownerId bheje toh server usko ownership proof maan sakta hai?
- Jawaab — Nahi; principal/tenant server-authenticated context se derive. Allowed input fields mein ownership change explicit authorized action ho.
- Khud try karo — Own/other-tenant read-update-delete, injected operator, forged owner aur consumed reset token retry ke rejection cases verify karo.

## Sources — aur padhne ke liye

- [OWASP — SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

- [Source yahan padho — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Express production security](https://expressjs.com/en/advanced/best-practice-security/)
- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/07-auth-security.md)
