---
id: mongo-production-integrations
title: SSR uploads payments email and deployment
track: mongodb
order: 8
level: Advanced
minutes: 3
summary: SSR/Pug — server HTML banata hai; untrusted output escape karo.
tags: production, pug, stripe, uploads, email, deployment, observability
visual: request-flow
---

## Quick revision

> Revision target — External effects ko durable receipt, state transition aur retry identity se control karo.

- SSR/Pug — server HTML banata hai; untrusted output escape karo.
- Upload — size/type validate; safe generated filename aur isolated storage.
- Payment webhook — raw-body signature verify, then durable idempotent processing.
- Duplicate event — unique event ID aur transaction se repeat effect roko.
- Email — queue/retry; API response ko slow provider par depend mat karao.
- Order state — payment/refund transitions explicit rakho.
- Deployment — secrets, health checks, logs aur graceful shutdown.
- Recovery — partial failure par retry/reconciliation; browser success screen final proof nahi.
- File path — user filename ko filesystem path authority mat do; generated safe key use.
- Provider timeout — external effect ho chuka ho sakta hai; retry se pehle idempotency/reconciliation.
- Outbox job — business write aur pending notification same durable boundary mein record.

### Pug templates

- Pug — indentation-based server template syntax.
- Extends/block — shared layout; include/mixin — reusable template parts.

### Upload aur webhook

- Signed upload — allowed size/type/object key control; uploaded file scan/validate.
- Webhook ack — durable receipt/process contract; retries aur duplicates expected.

### Edge cases aur reasoning

- Webhook event order — distinct valid events out-of-order aa sakte; state transition/version guard se paid order ko stale pending mat banao.
- Upload content — client MIME/extension authority nahi; actual content/size inspect aur executable serving avoid karo.
- Durable acknowledgement — receipt/job commit se pehle webhook success bhejne par crash event lose kar sakta; documented processing boundary rakho.

## Example se samjho

- Scenario — Payment provider same signed event E twice bhejta hai; first receipt+order update durable commit ho chuki hai.
- Reasoning — Second E stored identity se duplicate recognize ho aur original processing result reuse/skip kare. Notification outbox bhi same business effect ko repeat na kare.
- Catch — Different event IDs bhi same payment lifecycle represent kar sakte hain; event dedupe ke saath state transition/version guard aur reconciliation chahiye.

## Recall aur practice

- Sawal — Webhook signature valid ho toh event naya aur business transition allowed automatically hai?
- Jawaab — Nahi; authenticity alag, duplicate/order/state validity alag. Durable receipt aur transition guard chahiye.
- Khud try karo — Payment flow trace karo; duplicate event, reversed status order, crash before ack aur provider timeout ke recovery outcomes verify karo.

## Practice questions

### Easy · Payment webhook verify karo

<details>
<summary>Answer</summary>

- Signature — provider ke secret se raw request body par HMAC verify; parsed JSON par nahi (bytes badal sakte hain).
- Express — us route par `express.raw({ type: 'application/json' })`.
- Ack — event durable store karke jaldi `2xx`; heavy kaam background mein.

</details>

### Medium · Duplicate aur out-of-order webhooks

Provider same `payment.succeeded` event do baar bhejta hai, aur kabhi `refunded` se pehle `succeeded` late aata hai.

<details>
<summary>Answer</summary>

- Dedupe — `event.id` par unique index (`processed_events`); duplicate par `200` return karke skip.
- Order — event ko blindly apply mat karo; state machine allowed transitions check kare (refunded → succeeded invalid).
- Source of truth — doubt mein provider API se latest object fetch.

</details>

### Medium · Safe file upload

<details>
<summary>Answer</summary>

- Limits — max size, max files; stream karo, poora memory mein nahi.
- Type — extension/`Content-Type` trust mat karo; magic bytes check, image re-encode.
- Storage — random filename, web root ke bahar ya object storage; user path kabhi file path na bane.
- Direct upload — signed URL (short expiry, size/type constraints) se browser seedha storage par.
- Serve — `Content-Disposition` aur sahi `Content-Type`; scanning agar risky files.

</details>

### Medium · Signup mein email bhejna slow

Signup request email provider ke 10s timeout tak atki rehti hai.

<details>
<summary>Answer</summary>

- Fix — signup transaction mein outbox/job record; response turant.
- Worker — job queue se email bheje, retries with backoff, idempotency (same job do baar mail na kare).
- Timeouts — provider calls par short timeout; failure par user ko "resend" option.

</details>

### Hard · Payment success, app crash

Customer ka payment ho gaya, par order update se pehle app crash ho gayi. Order "pending" atka hai. System design?

<details>
<summary>Answer</summary>

- Webhook — provider retry karta hai; idempotent handler order ko `paid` karega.
- Reconciliation job — periodically pending orders ke payments provider se check karke fix.
- Order state machine — `pending → paid → fulfilled`; transitions conditional updates se.
- Outbox — order update + "fulfillment" event same transaction mein; worker deliver kare.
- Lesson — external side effect aur DB ek atomic transaction nahi; eventual consistency + retries + idempotency.

</details>

## Sources — aur padhne ke liye

- [Stripe webhooks](https://docs.stripe.com/webhooks)
- [Express production performance](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Pug interpolation](https://pugjs.org/language/interpolation.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/08-production-integrations.md)
