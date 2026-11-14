---
id: design-commerce-case-study
title: Case study React storefront and Java checkout
track: system-design
order: 11
level: Advanced
minutes: 3
summary: Catalog — cache-friendly reads; checkout demands fresh authoritative validation.
tags: case-study, ecommerce, react, java, payments
visual: request-flow
---

## Quick revision

> Revision target — Trace the full flow from catalog intent to an authoritative checkout and recovery from an uncertain payment.

- Catalog — cache-friendly reads; checkout demands fresh authoritative validation.
- Cart — user intent; not a price/stock guarantee.
- Order identity — keep the order, reservation, payment and webhook IDs separate.
- Reserve — an atomic stock claim with an expiry.
- Pay — a provider idempotency key; reconcile the status on an unknown outcome.
- Webhook — signature + durable dedupe + a state transition.
- Late payment — keep the refund/re-reserve policy for an expired reservation explicit.
- Outbox — record the order change and the notification/event durably together.
- UI — a pending/confirmed/failed state; do not take a browser redirect as proof of payment.
- Price snapshot — record the accepted price/currency/version in the order; a later catalog change must not alter an old order.
- Refund workflow — the identity and reconciliation of a duplicate refund request.
- Inventory release — release the stock of a failed/expired order once; a retry must not double-increment.

### Product-page flow

- Faceted filters — filter/sort state in the URL; a clear API contract for AND/OR semantics and counts.
- Product variant — map colour/size to a stable SKU; the image, price and availability come from the selected variant.
- Commerce SEO — crawlable product content, canonical URLs and valid structured data; private cart data is not for a public cache.
- Cart sync — a merge rule for anonymous/login carts; the server's price/stock is the final authority.

### Edge cases and reasoning

- Final price authority — the server validates the accepted SKU/quantity/price snapshot; client totals are display, not a trusted charge amount.
- Payment state machine — authorized/captured/refunded/failed have distinct meanings; align provider events with the business fulfillment transition policy.
- Reconciliation ledger — a durable record of provider IDs/amount/currency; resolve a missing webhook and an unknown charge with a scheduled comparison.

## Understand it with an example

- Scenario — The browser has been redirected to the payment success page, but the provider outcome in the server's order record is still pending.
- Reasoning — The UI should show a pending status and follow the authoritative server result. The allowed order transition and fulfillment start only after a verified provider event/status reconciliation.
- Catch — A redirect URL or a client-sent success flag is not payment evidence; reconcile duplicate events and a delayed confirmation against the same order/payment identity.

## Recall and practice

- Question — If the client sent a cart total100, is it safe to charge the provider100?
- Answer — The server should validate the product/variant price, quantity, discounts and currency, and compute/snapshot the accepted order total.
- Try it yourself — Trace a checkout end to end; verify the outcome of a changed price, insufficient stock, a duplicate charge request, a missing webhook and a late refund.

## Practice questions

### Easy · Who decides the price?

The client sends `price: 499` in the checkout request.

<details>
<summary>Answer</summary>

- Server authority — ignore the client price; the server recomputes from the catalog, coupons and taxes.
- Snapshot — save the final price/discount/tax on the order; if the catalog changes later, the order stays the same.
- Mismatch — if the price shown in the UI and the server price differ, make the user confirm.

</details>

### Medium · Payment state machine

<details>
<summary>Answer</summary>

- States — `pending → authorized → captured`, plus `failed` and `refunded` (partial too).
- Transitions — conditional updates from webhook/provider events; reject invalid transitions.
- Late events — the order was already cancelled and a payment capture arrives → the refund workflow.
- Audit — an event log of every transition (who/when/why).

</details>

### Medium · Faceted product search

You need fast search with brand, price range and size filters; the DB is PostgreSQL.

<details>
<summary>Answer</summary>

- Search index — an engine such as OpenSearch/Elasticsearch for facets/aggregations; avoid heavy facet queries on the OLTP DB.
- Sync — update the index through an outbox/CDC; eventual consistency (seconds).
- Variants — size/colour variants are searchable; the stock badge in the index or a live check on the PDP.
- Freshness — the final price/stock check comes from the DB at checkout.

</details>

### Medium · Guest cart → login merge

<details>
<summary>Answer</summary>

- Rules — for the same SKU, add the quantities or take the max? apply stock/limits; drop removed products with a message.
- Idempotent merge — a merge operation id; no double add on a retry.
- Source — the logged-in cart on the server; the guest cart local + a server session.
- UX — show a summary after the merge.

</details>

### Hard · Reconciling payments

Finance needs a daily guarantee that every captured payment has an order, and the reverse. The design?

<details>
<summary>Answer</summary>

- Ledger — a double-entry ledger table (debit/credit entries), immutable; the balance is derived.
- Daily job — compare the provider settlement report against the internal ledger/orders; mismatches go to an exceptions queue.
- Causes — missed webhooks, partial refunds, currency rounding, duplicate charges.
- Actions — auto-fix the idempotent cases (a missed webhook replay), human review for the rest; alerting.

</details>

## Sources — further reading

- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Stripe webhook handling](https://docs.stripe.com/webhooks)
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/11-commerce-case-study.md)
