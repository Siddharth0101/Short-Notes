---
id: mongo-auth-security
title: Authentication authorization and secure boundaries
track: mongodb
order: 7
level: Advanced
minutes: 3
summary: Authentication — verify identity; authorization — verify access to an action or resource.
tags: authentication, authorization, jwt, sessions, security, passwords
visual: request-flow
---

## Quick revision

> Revision target — Limit untrusted input to the allowed fields and to the authenticated resource scope.

- Authentication — verify identity; authorization — verify access to an action/resource.
- Password — an adaptive hash; never store/log the raw password.
- Session/token — plan expiry, revocation and secure transport.
- JWT — validate the signature + the claims; a decoded payload is not trusted.
- Ownership — check on the server whether the requested document belongs to the user/tenant.
- Injection — allowlist fields/operators; do not build a raw query from input.
- Rate limit — protect sensitive endpoints such as login/reset.
- Browser security — match XSS, CSRF and cookie flags to the credential flow.
- Mass assignment — allowlist the update fields; do not let the request body blindly change role/owner.
- Session fixation — a suitable rotation of the session identity on login/privilege change.
- Reset token — short-lived, single-use and securely stored verification data.

### Server-side URL safety

- SSRF — making the server send a request to an unintended internal/external destination through a user-controlled URL.
- Destination allowlist — allow the expected hosts/protocols; validate the resolved IPv4/IPv6 and private/loopback/metadata targets.
- SSRF redirects — disable automatic redirect following, otherwise a validated URL can be a bypass to a blocked destination.
- Egress control — restrict the server's outbound network access to the required destinations; add this defence alongside URL validation.

### Edge cases and reasoning

- Credentialed CORS — an explicit trusted origin/credential policy for browser cross-origin cookies; a wildcard origin does not allow credentialed access.
- Reset token secrecy — a verification token can leak through logs/analytics/URLs; keep a short expiry, single use and a safe transport/storage contract.
- Authorization predicate — read/write with a server-verified scope of {_id,tenantId,ownerId}; avoid an unchecked mutation after an ID lookup.

## Research notes: Authorize both the action and its object

- Authentication identifies the caller.

## Understand it with an example

- Scenario — The profile update body `{name:"A", role:"admin", ownerId:"other"}` arrives; the route is for a normal user.
- Reasoning — Select the allowed name field; writing role/owner is a separate privileged operation. Derive the scope of the ownership query from the server-authenticated principal.
- Catch — Turning the request body directly into the update object is mass assignment; a successful login does not authorize modifying arbitrary fields/resources.

## Recall and practice

- Question — If the user sends ownerId in the body, can the server accept it as proof of ownership?
- Answer — No; derive the principal/tenant from the server-authenticated context. Among the allowed input fields, an ownership change is an explicit authorized action.
- Try it yourself — Verify the rejection cases for own/other-tenant read-update-delete, an injected operator, a forged owner and a retry with a consumed reset token.

## Practice questions

### Easy · NoSQL injection

```js
const user = await User.findOne({ email: req.body.email, password: req.body.password });
```

What happens with the body `{ "email": "a@b.com", "password": { "$ne": null } }`?

<details>
<summary>Answer</summary>

- Attack — `$ne: null` becomes an operator → the password check is bypassed and the login succeeds.
- Fix — validate the input types (`typeof password === 'string'`, schema validation); Mongoose `sanitizeFilter`.
- The bigger bug — comparing a plain password in the DB; store a hash (bcrypt/argon2) and use `compare`.

</details>

### Easy · Mass assignment

```js
const user = await User.create(req.body);
```

<details>
<summary>Answer</summary>

- Attack — gaining privilege by sending `"role": "admin"` or `"isVerified": true` in the body.
- Fix — an allowlist: `const { name, email, password } = req.body; User.create({ name, email, password })`.
- Reject unknown fields with a validation schema (zod/joi).

</details>

### Medium · Password reset token design

<details>
<summary>Answer</summary>

- Token — `crypto.randomBytes(32)`; store only the hash in the DB, and the plain token only in the email link.
- Expiry — 15–30 min, single use (delete after use).
- Response — the same message whether or not the email exists ("if there is an account, a mail was sent") — no user enumeration.
- After the reset — revoke the old sessions/refresh tokens.

</details>

### Medium · Login brute force

<details>
<summary>Answer</summary>

- Rate limit — per IP and per account (e.g. 5 attempts / 15 min), with a progressive delay.
- Lockout risk — a hard lockout lets an attacker lock anyone's account; temporary + CAPTCHA/2FA is better.
- Shared store — a store like Redis across multiple instances, otherwise each instance counts separately.
- Response — a generic "invalid credentials".

</details>

### Hard · SSRF in "import image from URL"

The feature fetches a user-supplied URL from the server. An attacker gives `http://169.254.169.254/latest/meta-data/`. The defence?

<details>
<summary>Answer</summary>

- Risk — the server reaches the internal network/cloud metadata (credentials).
- Allowlist — only `https` and known domains, if possible.
- Resolve and block — resolve DNS and reject private/loopback/link-local ranges (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, IPv6 equivalents); connect only to the resolved IP (to avoid DNS rebinding).
- Redirects — the same check on every redirect, or disable redirects.
- Network — an egress firewall; IMDSv2/a hop limit for the metadata service. Response size/time limits too.

</details>

## Sources — further reading

- [OWASP — SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

- [Source yahan padho — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Express production security](https://expressjs.com/en/advanced/best-practice-security/)
- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/07-auth-security.md)
