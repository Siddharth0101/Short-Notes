---
id: mongo-auth-security
title: Authentication authorization and secure boundaries
track: mongodb
order: 7
level: Advanced
minutes: 35
summary: Login, sessions, JWT, reset tokens aur resource-level authorization ko secure application flow mein model karo.
tags: authentication, authorization, jwt, sessions, security, passwords
visual: request-flow
---

## Mental model

Authentication identity establish karti hai; authorization decide karti hai ki identified user specific resource par action kar sakta hai. Login successful hona har record access ka permission nahi hai. Browser UI, API input aur stored data sab trust boundaries hain. Security ek middleware package install karne se complete nahi hoti; har boundary par explicit policy chahiye.

> **Core takeaway:** Private-resource access must be scoped by authenticated ownership on the server.

## Authorize the resource in the query

```js
// Express 5 excerpt. requireUser verifies a session/token and supplies req.user.
// Topic is a Mongoose model; ObjectId validation happens before querying.
app.patch("/api/topics/:id", requireUser, async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: "Invalid topic id" });
  }
  if (typeof req.body.title !== "string" || !req.body.title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const topic = await Topic.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    { $set: { title: req.body.title.trim() } },
    { new: true, runValidators: true }
  );
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json({ data: topic });
});
```

Query ownership enforce karti hai. Example unauthorized aur absent record dono ko 404 dekar resource existence disclose nahi karta; application policy ke hisaab se 403 bhi appropriate ho sakta hai. Whitelist update fields: `req.body` ko blindly model update mein pass karoge to role, author ya privileged fields change ho sakti hain. Authentication middleware ko client-supplied user id par trust nahi karna chahiye.

## Password and reset lifecycle

Passwords plaintext ya reversible encryption mein store mat karo. Modern password hashing library with adaptive cost, per-password salt aur measured settings use karo. OWASP currently Argon2id ko primary option discuss karta hai; bcrypt-based existing applications ko library limits aur migration strategy samajhni chahiye. Login errors generic rakho aur brute-force controls account/IP behavior ke context mein design karo.

Password reset ke liye cryptographically random token generate karo, database mein token hash plus expiry store karo aur raw token sirf delivery link mein bhejo. Reset consume atomic/single-use ho, expiry enforce ho aur new password same normal password policy follow kare. Reset email response se account existence unnecessarily reveal mat karo. Password reset ke baad sessions invalidate/rotate karne ki explicit policy rakho.

## Session versus JWT

Opaque session id server-side session record point karta hai; revocation straightforward hoti hai. Signed JWT claims verification allow karta hai, lekin payload normally encrypted nahi hota. Signature, algorithm allowlist, expiry, issuer aur audience validate karo. Short token lifetime aur refresh/revocation behavior design karo; stateless token ka meaning logout/revocation requirement disappear hona nahi hai.

HttpOnly cookie JavaScript reads prevent karti hai, lekin automatically every XSS impact ya CSRF stop nahi karti. Secure HTTPS transport ke liye, SameSite appropriate request context ke liye use karo. Cookie-authenticated mutations ke liye CSRF defense aur origin checks evaluate karo. CORS browser cross-origin access policy hai; authentication firewall nahi hai.

## Attack scenarios worth walking through

**Stolen refresh token replay.** Attacker kisi tarah ek user ka refresh token copy kar leta hai (XSS, leaked log, compromised device) aur baad mein usi token se naya access token maangta hai. Simple long-lived refresh token isse pura protect nahi karta. **Refresh token rotation** har refresh request par purane token ko invalidate karke naya issue karta hai; agar purana (already-rotated) token dobara use hone ki koshish ho, yeh "reuse detected" signal hai — us poori token family ko revoke karke user ko re-login force karo. Bina rotation ke, ek leaked refresh token indefinitely valid raha sakta hai.

**CSRF on a cookie-authenticated mutation.** Victim browser mein authenticated session cookie already set hai. Attacker apni malicious site par ek form/`fetch` banata hai jo victim ke browser se automatically credentialed request bhejwa deta hai bank-jaisi API ko (browser cookie automatically attach kar deta hai). **Double-submit cookie** ya **synchronizer token pattern** isse rokta hai: server ek unpredictable CSRF token cookie mein aur response body/header dono mein bhejta hai; genuine client-side JS us token ko explicit request header mein wapas bhejta hai, jo cross-origin attacker page nahi read/replicate kar sakta (Same-Origin Policy ke wajah se). `SameSite=Lax`/`Strict` cookies bhi cross-site automatic-submission ko largely mitigate karti hain, lekin legacy browsers/subdomain edge cases ke against defense-in-depth ke roop mein explicit CSRF token still valuable hai.

**XSS stealing a JWT from localStorage.** Agar JWT ko `localStorage` mein store kiya jaaye (HttpOnly cookie ke bajaye) taaki client-side JS usse read/attach kar sake, to koi bhi injected malicious script (stored/reflected XSS) directly `localStorage.getItem("token")` karke token exfiltrate kar sakta hai — cookie ka `HttpOnly` flag yeh access hi prevent kar deta. **Fix:** Access token ko HttpOnly, Secure cookie mein rakho jab possible ho; agar client-side JS ko token access genuinely chahiye (jaise mobile app / third-party API), toh XSS defense (output encoding, CSP headers, dependency hygiene) ko primary layer maano, na ki storage location ko.

**Algorithm confusion / `alg: none`.** Kuch purani JWT library misconfigurations attacker ko token header mein `alg: none` ya asymmetric-to-symmetric algorithm switch specify karne dete hain, jisse signature verification bypass ho sakta hai. **Fix:** Verification code mein expected algorithm explicitly allowlist karo (jaise sirf `RS256` accept karo), library ko header se algorithm khud-ba-khud infer mat karne do.

## Gotchas

NoSQL injection avoid karne ke liye strict typed inputs aur explicit query construction use karo. Security headers, payload limits, dependency maintenance aur rate limiting defense layers hain. Proxy trust configuration blindly enable karne se client IP/secure-cookie assumptions wrong ho sakti hain. Secrets aur access tokens log na karo.

## Common mistakes

- **Wrong assumption:** Login response time constant rakhna unnecessary hai — sirf password check "wrong" bolna kaafi hai. **Why it breaks:** Agar "user not found" aur "wrong password" alag response times/messages dete hain, attacker timing/response difference se valid usernames enumerate kar sakta hai, phir sirf un par targeted brute-force chala sakta hai. **Fix:** Generic error message aur roughly-constant response time rakho dono cases mein (jaise non-existent user ke liye bhi ek dummy hash-compare operation run karo).
- **Wrong assumption:** HttpOnly cookie set kar dene se CSRF automatically solved ho jaata hai. **Why it breaks:** HttpOnly sirf JavaScript ko cookie read karne se rokta hai; browser phir bhi cross-site request ke saath cookie automatically attach karega, jo CSRF ka actual mechanism hai. **Fix:** SameSite attribute aur/ya explicit CSRF token defense alag se implement karo — HttpOnly aur CSRF protection do independent concerns hain.
- **Wrong assumption:** JWT expiry short rakhne se revocation/logout ki zaroorat khatam ho jaati hai. **Why it breaks:** Short-lived access token bhi apni expiry tak valid rehta hai; agar user explicitly logout kare ya account compromise ho, us window mein token still usable rahega jab tak koi explicit revocation mechanism (denylist, refresh-token invalidation) na ho. **Fix:** Refresh token ko server-side track karo taaki woh revoke ho sake; access token expiry short rakhna ek layer hai, replacement nahi poore revocation design ka.

## Practice

Two-user test likho: user A user B ka topic read/update na kar sake. Expired session, modified token, duplicate reset attempt aur forbidden role change test karo. Har endpoint ke liye identity, permission aur ownership rule note karo.

## Interview questions

**Q. JWT encrypted hota hai?** Common signed JWT readable claims rakhta hai; signing tampering detect karti hai. Confidential claims ke liye separate encryption mechanism chahiye.

**Q. Role check enough hai?** Often nahi. Same role ke users alag tenants/resources own karte hain; object-level authorization required hai.

## Research notes: Authorize both the action and its object

Authentication identifies the caller. Authorization decides whether that caller can perform this action on this object, including tenant and ownership constraints. Check each request and deny when no rule permits access.

Original matrix: an owner edits a draft, a reviewer approves it, and an unrelated user does neither. A single logged-in check cannot describe this policy. Test each allowed and denied cell, including changing the object ID with a valid token.

**Interview check:** Why is hiding an Approve button insufficient?

**Answer:** A caller can submit HTTP directly. The server must enforce the action and resource policy independently of UI rendering.

**Practice:** Revoke reviewer membership and retry with the existing session.

[Read the source — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A notes update endpoint accepts noteId and ownerId from the body. Explain the attack and rewrite the ownership rule.

> **Hint:** The caller can alter both submitted fields.

**Answer guide — compare after attempting:** Derive user identity from the verified session, and filter the update by note ID plus that identity. Allowlist editable fields so ownerId cannot be reassigned. Test user A attempting to edit user B's note and confirm no write occurs.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[Express production security](https://expressjs.com/en/advanced/best-practice-security/) application hardening discuss karta hai. [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) aur [password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) auth lifecycle ka reference hain.
