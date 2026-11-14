---
id: mongo-production-integrations
title: SSR uploads payments email and deployment
track: mongodb
order: 8
level: Advanced
minutes: 3
summary: SSR/Pug — the server builds the HTML; escape untrusted output.
tags: production, pug, stripe, uploads, email, deployment, observability
visual: request-flow
---

## Quick revision

> Revision target — Control external effects with a durable receipt, a state transition and a retry identity.

- SSR/Pug — the server builds the HTML; escape untrusted output.
- Upload — validate size/type; a safe generated filename and isolated storage.
- Payment webhook — verify the signature on the raw body, then durable idempotent processing.
- Duplicate event — prevent a repeated effect with a unique event ID and a transaction.
- Email — queue/retry; do not make the API response depend on a slow provider.
- Order state — keep the payment/refund transitions explicit.
- Deployment — secrets, health checks, logs and graceful shutdown.
- Recovery — retry/reconciliation on a partial failure; the browser's success screen is not final proof.
- File path — do not give a user filename authority over a filesystem path; use a generated safe key.
- Provider timeout — the external effect may already have happened; idempotency/reconciliation before a retry.
- Outbox job — record the business write and the pending notification in the same durable boundary.

### Pug templates

- Pug — an indentation-based server template syntax.
- Extends/block — a shared layout; include/mixin — reusable template parts.

### Upload and webhook

- Signed upload — control the allowed size/type/object key; scan/validate the uploaded file.
- Webhook ack — a durable receipt/process contract; retries and duplicates are expected.

### Edge cases and reasoning

- Webhook event order — distinct valid events can arrive out of order; with a state transition/version guard, do not turn a paid order back into a stale pending.
- Upload content — the client's MIME/extension is not an authority; inspect the actual content/size and avoid serving executables.
- Durable acknowledgement — sending webhook success before the receipt/job commit can lose the event in a crash; keep a documented processing boundary.

## Understand it with an example

- Scenario — The payment provider sends the same signed event E twice; the first receipt+order update is already durably committed.
- Reasoning — The second E is recognized as a duplicate from its stored identity and reuses/skips the original processing result. The notification outbox must not repeat the same business effect either.
- Catch — Different event IDs can also represent the same payment lifecycle; along with event dedupe you need a state transition/version guard and reconciliation.

## Recall and practice

- Question — If a webhook's signature is valid, is the event automatically new and the business transition allowed?
- Answer — No; authenticity is one thing, duplicate/order/state validity another. A durable receipt and a transition guard are needed.
- Try it yourself — Trace a payment flow; verify the recovery outcomes for a duplicate event, a reversed status order, a crash before the ack and a provider timeout.

## Practice questions

### Easy · Verify a payment webhook

<details>
<summary>Answer</summary>

- Signature — verify the HMAC with the provider's secret on the raw request body; not on parsed JSON (the bytes can change).
- Express — `express.raw({ type: 'application/json' })` on that route.
- Ack — store the event durably and return `2xx` quickly; heavy work goes to the background.

</details>

### Medium · Duplicate and out-of-order webhooks

The provider sends the same `payment.succeeded` event twice, and sometimes `succeeded` arrives late, after `refunded`.

<details>
<summary>Answer</summary>

- Dedupe — a unique index on `event.id` (`processed_events`); on a duplicate return `200` and skip.
- Order — do not apply an event blindly; the state machine checks the allowed transitions (refunded → succeeded is invalid).
- Source of truth — when in doubt, fetch the latest object from the provider's API.

</details>

### Medium · Safe file upload

<details>
<summary>Answer</summary>

- Limits — max size, max files; stream it, not the whole thing in memory.
- Type — do not trust the extension/`Content-Type`; check the magic bytes, re-encode images.
- Storage — a random filename, outside the web root or in object storage; a user path must never become a file path.
- Direct upload — the browser uploads straight to storage with a signed URL (short expiry, size/type constraints).
- Serve — `Content-Disposition` and the correct `Content-Type`; scanning for risky files.

</details>

### Medium · Sending email slows down signup

The signup request stays stuck until the email provider's 10s timeout.

<details>
<summary>Answer</summary>

- Fix — an outbox/job record in the signup transaction; the response is immediate.
- Worker — sends the email from the job queue, retries with backoff, idempotency (the same job must not mail twice).
- Timeouts — a short timeout on provider calls; on failure give the user a "resend" option.

</details>

### Hard · Payment succeeded, app crashed

The customer's payment went through, but the app crashed before the order update. The order is stuck at "pending". The system design?

<details>
<summary>Answer</summary>

- Webhook — the provider retries; an idempotent handler sets the order to `paid`.
- Reconciliation job — periodically checks the payments of pending orders with the provider and fixes them.
- Order state machine — `pending → paid → fulfilled`; transitions through conditional updates.
- Outbox — the order update + a "fulfillment" event in the same transaction; a worker delivers it.
- Lesson — an external side effect and the DB are not one atomic transaction; eventual consistency + retries + idempotency.

</details>

## Sources — further reading

- [Stripe webhooks](https://docs.stripe.com/webhooks)
- [Express production performance](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Pug interpolation](https://pugjs.org/language/interpolation.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/08-production-integrations.md)
