---
id: design-commerce-case-study
title: Case study React storefront and Java checkout
track: system-design
order: 11
level: Advanced
minutes: 3
summary: Catalog — cache-friendly reads; checkout fresh authoritative validation maangta hai.
tags: case-study, ecommerce, react, java, payments
visual: request-flow
---

## Quick revision

> Revision target — Catalog intent se authoritative checkout aur uncertain payment recovery tak full flow trace karo.

- Catalog — cache-friendly reads; checkout fresh authoritative validation maangta hai.
- Cart — user intent; price/stock guarantee nahi.
- Order identity — order, reservation, payment aur webhook IDs alag rakho.
- Reserve — atomic stock claim with expiry.
- Pay — provider idempotency key; unknown outcome par status reconcile.
- Webhook — signature + durable dedupe + state transition.
- Late payment — expired reservation par refund/re-reserve policy explicit rakho.
- Outbox — order change aur notification/event durable saath record.
- UI — pending/confirmed/failed state; browser redirect ko payment proof mat maano.
- Price snapshot — order mein accepted price/currency/version record; later catalog change old order na badle.
- Refund workflow — duplicate refund request ki identity aur reconciliation.
- Inventory release — failed/expired order ka stock once release; retry double increment na kare.

### Product-page flow

- Faceted filters — URL mein filter/sort state; AND/OR semantics aur counts ka API contract clear.
- Product variant — color/size ko stable SKU se map; image, price aur availability selected variant se.
- Commerce SEO — crawlable product content, canonical URLs aur valid structured data; private cart data public cache nahi.
- Cart sync — anonymous/login carts ka merge rule; server price/stock final authority.

### Edge cases aur reasoning

- Final price authority — server accepted SKU/quantity/price snapshot validate; client totals display hain, trusted charge amount nahi.
- Payment state machine — authorized/captured/refunded/failed distinct meanings; provider events aur business fulfillment transition policy align karo.
- Reconciliation ledger — durable provider IDs/amount/currency record; missing webhook aur unknown charge ko scheduled comparison se resolve karo.

## Example se samjho

- Scenario — Browser payment success page par redirect ho gaya, lekin server ke order record mein provider outcome abhi pending hai.
- Reasoning — UI pending status dikhaye aur authoritative server result follow kare. Verified provider event/status reconciliation ke baad allowed order transition aur fulfillment start ho.
- Catch — Redirect URL ya client-sent success flag payment evidence nahi; duplicate events aur delayed confirmation ko same order/payment identity se reconcile karo.

## Recall aur practice

- Sawal — Client ne cart total100 bheja toh provider ko100 charge karna safe hai?
- Jawaab — Server product/variant price, quantity, discounts aur currency validate karke accepted order total compute/snapshot kare.
- Khud try karo — Checkout end-to-end trace karo; changed price, insufficient stock, duplicate charge request, missing webhook aur late refund ka outcome verify karo.

## Practice questions

### Easy · Price kaun decide karta hai?

Checkout request mein client `price: 499` bhejta hai.

<details>
<summary>Answer</summary>

- Server authority — client price ignore; server catalog, coupons aur taxes se recompute.
- Snapshot — order par final price/discount/tax save; baad mein catalog badle toh order same.
- Mismatch — UI mein dikhaya price aur server price alag ho toh user ko confirm karao.

</details>

### Medium · Payment state machine

<details>
<summary>Answer</summary>

- States — `pending → authorized → captured`, aur `failed`, `refunded` (partial bhi).
- Transitions — webhook/provider events se conditional updates; invalid transitions reject.
- Late events — order cancel ho chuka aur payment capture aaya → refund workflow.
- Audit — har transition ka event log (who/when/why).

</details>

### Medium · Faceted product search

Brand, price range, size filters ke saath fast search chahiye; DB PostgreSQL hai.

<details>
<summary>Answer</summary>

- Search index — OpenSearch/Elasticsearch jaisa engine facets/aggregations ke liye; OLTP DB par heavy facet queries avoid.
- Sync — outbox/CDC se index update; eventual consistency (seconds).
- Variants — size/color variants searchable, stock badge index mein ya live check on PDP.
- Freshness — price/stock final check checkout par DB se.

</details>

### Medium · Guest cart → login merge

<details>
<summary>Answer</summary>

- Rules — same SKU ho toh quantity add ya max? stock/limits apply; removed products drop with message.
- Idempotent merge — merge operation id; retry par double add nahi.
- Source — logged-in cart server par; guest cart local + server session.
- UX — merge ke baad summary dikhao.

</details>

### Hard · Payments ka reconciliation

Finance ko daily guarantee chahiye ki har captured payment ka order hai aur ulta. Design?

<details>
<summary>Answer</summary>

- Ledger — double-entry ledger table (debit/credit entries), immutable; balance derived.
- Daily job — provider settlement report vs internal ledger/orders compare; mismatches exceptions queue mein.
- Causes — missed webhooks, partial refunds, currency rounding, duplicate charges.
- Actions — auto-fix idempotent cases (missed webhook replay), baaki human review; alerting.

</details>

## Sources — aur padhne ke liye

- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Stripe webhook handling](https://docs.stripe.com/webhooks)
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/11-commerce-case-study.md)
