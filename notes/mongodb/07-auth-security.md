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

> Revision target — Untrusted input ko allowed fields aur authenticated resource scope tak limit karo.

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

## Example se samjho

- Scenario — Profile update body `{name:"A", role:"admin", ownerId:"other"}` aati hai; route normal user ke liye hai.
- Reasoning — Allowed name field select karo; role/owner write privileged separate operation ho. Ownership query ka scope server-authenticated principal se derive karo.
- Catch — Request body ko direct update object banana mass assignment hai; successful login arbitrary field/resource modification authorize nahi karta.

## Recall aur practice

- Sawal — User body mein ownerId bheje toh server usko ownership proof maan sakta hai?
- Jawaab — Nahi; principal/tenant server-authenticated context se derive. Allowed input fields mein ownership change explicit authorized action ho.
- Khud try karo — Own/other-tenant read-update-delete, injected operator, forged owner aur consumed reset token retry ke rejection cases verify karo.

## Practice questions

### Easy · NoSQL injection

```js
const user = await User.findOne({ email: req.body.email, password: req.body.password });
```

Body `{ "email": "a@b.com", "password": { "$ne": null } }` par kya hoga?

<details>
<summary>Answer</summary>

- Attack — `$ne: null` operator ban jaata hai → password check bypass, login ho jaata hai.
- Fix — input types validate (`typeof password === 'string'`, schema validation); Mongoose `sanitizeFilter`.
- Bada bug — DB mein plain password compare; hash (bcrypt/argon2) store karke `compare` karo.

</details>

### Easy · Mass assignment

```js
const user = await User.create(req.body);
```

<details>
<summary>Answer</summary>

- Attack — body mein `"role": "admin"` ya `"isVerified": true` bhej kar privilege.
- Fix — allowlist: `const { name, email, password } = req.body; User.create({ name, email, password })`.
- Validation schema (zod/joi) se unknown fields reject karo.

</details>

### Medium · Password reset token design

<details>
<summary>Answer</summary>

- Token — `crypto.randomBytes(32)`; DB mein sirf hash store, plain token sirf email link mein.
- Expiry — 15–30 min, single use (use ke baad delete).
- Response — email exist kare ya nahi, same message ("agar account hai toh mail gaya") — user enumeration nahi.
- Reset ke baad — purani sessions/refresh tokens revoke.

</details>

### Medium · Login brute force

<details>
<summary>Answer</summary>

- Rate limit — per IP aur per account (e.g. 5 attempts / 15 min), progressive delay.
- Lockout risk — hard lockout attacker ko kisi ka account band karne deta hai; temporary + CAPTCHA/2FA behtar.
- Shared store — multiple instances mein Redis jaisa store, warna har instance alag count.
- Response — generic "invalid credentials".

</details>

### Hard · SSRF in "import image from URL"

Feature user ka diya URL server se fetch karta hai. Attacker `http://169.254.169.254/latest/meta-data/` deta hai. Defence?

<details>
<summary>Answer</summary>

- Risk — server internal network/cloud metadata (credentials) tak pahunch jaata hai.
- Allowlist — sirf `https` aur known domains, agar possible.
- Resolve and block — DNS resolve karke private/loopback/link-local ranges (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, IPv6 equivalents) reject; resolved IP par hi connect (DNS rebinding se bachne ke liye).
- Redirects — har redirect par same check, ya redirects disable.
- Network — egress firewall; metadata service ke liye IMDSv2/hop limit. Response size/time limits bhi.

</details>

## Sources — aur padhne ke liye

- [OWASP — SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

- [Source yahan padho — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Express production security](https://expressjs.com/en/advanced/best-practice-security/)
- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/07-auth-security.md)
