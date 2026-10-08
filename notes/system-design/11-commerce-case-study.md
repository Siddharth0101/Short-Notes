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

## Recall aur practice

- Sawal — Client ne cart total100 bheja toh provider ko100 charge karna safe hai?
- Jawaab — Server product/variant price, quantity, discounts aur currency validate karke accepted order total compute/snapshot kare.
- Khud try karo — Checkout end-to-end trace karo; changed price, insufficient stock, duplicate charge request, missing webhook aur late refund ka outcome verify karo.

## Sources — aur padhne ke liye

- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Stripe webhook handling](https://docs.stripe.com/webhooks)
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/11-commerce-case-study.md)
