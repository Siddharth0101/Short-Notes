---
id: design-commerce-case-study
title: Case study React storefront and Java checkout
track: system-design
order: 11
level: Advanced
minutes: 34
summary: Checkout workflow mein DB order state aur external payment state temporarily disagree kar sakti hain.
tags: case-study, ecommerce, react, java, payments
visual: request-flow
---

## Mental model — simple soch

Storefront mostly read-heavy discovery hai; checkout correctness-sensitive workflow hai. Same caching and failure policy dono par apply nahi karni chahiye. User ko fast browsing chahiye, but stale price ya duplicate payment unacceptable ho sakti hai. Design requirements separate karke connect karo.

> **Core takeaway:** Checkout workflow mein DB order state aur external payment state temporarily disagree kar sakti hain.

## Scope and assumed workload

Assume 1 million daily visitors, each 10 catalog reads and 1% conversion. Average catalog throughput roughly 116 reads/s; chosen 20x peak factor gives about 2,320 reads/s. Orders roughly 10,000/day, averaging 0.12/s, but sale bursts much higher ho sakte hain. These synthetic inputs interview reasoning demonstrate karte hain, vendor capacity claims nahi.

```text
React storefront -> CDN -> catalog reads -> cache -> product DB
        |
        +-> Java checkout -> order DB + outbox
                  |               |
              inventory       event broker
                  |
              payment provider
```

Public catalog pre-render/cache ho sakta hai. Cart browser UI mein immediate quantity changes dikhaye, but server checkout prices and availability recompute kare. Search index eventual consistency tolerate kar sakta hai; checkout authoritative store consult kare.

Flash sale scenario baseline se poori tarah alag hai aur usse alag design karna padta hai. Ek limited 500-unit drop:

```text
30,000 users ek product page par, sale 12:00:00 par start
12:00:00-12:00:10 window mein sab "Buy" dabate hain

checkout attempts ≈ 30,000 in 10 s = 3,000 rps
   (normal peak 2,320 reads/s tha, aur writes 0.12/s)
inventory row par load: 3,000 attempts/s; concurrent attempts latency par depend hain
successful orders: maximum 500 — baaki 29,500 ko fail karna hai, fast
```

Same inventory row par conflicting writes serialize ho sakti hain. Koi universal 500-2,000 updates/s limit nahi: transaction duration, hardware, indexes aur lock/pool waits measure karo. 3,000 requests/s ka matlab 3,000 concurrent requests nahi; stable load mein average in-flight ≈ arrival rate × average duration hai. Bounded admission ya waiting room se database tak measured safe rate bhejo. Gate capacity exhaust hone par “busy / retry later” ya waitlist do; non-authoritative cache rejection se “sold out” prove nahi hota. Final inventory invariant database ke atomic conditional update/constraint mein preserve karo. Database transaction valid design reh sakti hai; overload ko unlimited contenders bhejna problem hai.

Normal operation aur flash sale ke liye alag code path rakhna legitimate design choice hai — ek generic path jo dono handle kare, usually dono ke liye suboptimal hota hai.

## API contracts

Contract likhna design ka sabse honest hissa hai, kyunki ambiguity yahin expose hoti hai:

```http
POST /api/checkout/intents
Idempotency-Key: 018f2c1a-7b3e-7c9d-9f21-3a4b5c6d7e8f
Content-Type: application/json

{ "cartId": "cart_9x2", "addressId": "addr_44", "shippingMethod": "standard" }

201 Created
{
  "intentId": "int_7Kq",
  "status": "requires_payment",
  "lineItems": [{ "sku": "SKU-1", "qty": 2, "unitPriceMinor": 49900 }],
  "totals": { "subtotalMinor": 99800, "shippingMinor": 4900, "taxMinor": 8700,
              "grandTotalMinor": 113400, "currency": "INR" },
  "priceQuoteExpiresAt": "2026-09-11T12:14:00Z",
  "reservationExpiresAt": "2026-09-11T12:14:00Z",
  "paymentClientSecret": "pi_..._secret_..."
}

409 Conflict   -> same Idempotency-Key, different payload fingerprint
422 Unprocessable -> item unavailable, price changed beyond tolerance
```

Notice karo ki amounts minor units (paise) mein integers hain, floats nahi — floating-point money arithmetic rounding errors deti hai jo reconciliation ke time discover hoti hain. Currency har amount ke saath explicit hai. `priceQuoteExpiresAt` client ko batata hai ki quote kab tak valid hai, jisse UI countdown dikha sakta hai aur expiry par re-quote kar sakta hai — bina iske user 20 minute purana total dekh kar confirm karta hai aur server usse reject karta hai, jo confusing hai.

```http
GET /api/checkout/intents/int_7Kq
200 OK
{ "intentId": "int_7Kq", "status": "processing", "orderId": null,
  "pollAfterMs": 1000 }

# status: requires_payment | processing | requires_action | confirmed | failed | expired
```

Yeh status endpoint optional nahi hai — yehi wo path hai jisse client refresh, network drop ya tab close ke baad recover karta hai. Uske bina "maine pay kiya, order kahan hai?" ka koi answer nahi hota.

```http
POST /api/webhooks/payments
Stripe-Signature: t=...,v1=...

# Server: signature verify -> event_id se dedupe -> allowed transition apply
# 200 turant return karo, heavy processing async karo (provider timeout hota hai)
```

## Data model sketch

```sql
CREATE TABLE checkout_intent (
  id                text PRIMARY KEY,
  user_id           bigint NOT NULL,
  idempotency_key   text   NOT NULL,
  request_hash      text   NOT NULL,
  status            text   NOT NULL,        -- state machine ke values
  quote_json        jsonb  NOT NULL,        -- frozen prices at quote time
  quote_expires_at  timestamptz NOT NULL,
  order_id          bigint REFERENCES orders(id),
  UNIQUE (user_id, idempotency_key)
);

CREATE TABLE inventory (
  sku        text PRIMARY KEY,
  on_hand    int  NOT NULL CHECK (on_hand >= 0),
  reserved   int  NOT NULL CHECK (reserved >= 0)
  -- available = on_hand - reserved (derived, store mat karo)
);

CREATE TABLE reservation (
  id          bigserial PRIMARY KEY,
  intent_id   text NOT NULL REFERENCES checkout_intent(id),
  sku         text NOT NULL,
  qty         int  NOT NULL CHECK (qty > 0),
  state       text NOT NULL,   -- held | committed | released
  expires_at  timestamptz NOT NULL,
  UNIQUE (intent_id, sku)
);

CREATE TABLE payment_attempt (
  id                bigserial PRIMARY KEY,
  intent_id         text NOT NULL REFERENCES checkout_intent(id),
  provider_ref      text UNIQUE,            -- provider ka payment intent id
  provider_idem_key text NOT NULL,
  status            text NOT NULL,          -- initiated | succeeded | failed | unknown
  amount_minor      bigint NOT NULL,
  UNIQUE (intent_id, provider_idem_key)
);

CREATE TABLE processed_webhook (
  event_id    text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now()
);
```

Teen decisions jo yahan deliberate hain. Pehla, `available` ko stored column banane ke bajaye `on_hand - reserved` se derive karna — do counters ko sync mein rakhna ek classic bug source hai. Doosra, `quote_json` mein prices freeze karna taaki payment ke waqt wahi amount charge ho jo user ne dekha tha, chahe catalog price beech mein badal jaaye. Teesra, `payment_attempt` ko `checkout_intent` se alag rakhna kyunki ek intent par multiple attempts ho sakte hain (card declined, user ne dobara try kiya) aur har attempt ka apna provider reference aur outcome hota hai.

## Order workflow

1. Client stable checkout intent ID generate kare and submission ke retries mein reuse kare.
2. Server authenticated user, current prices, quantity limits and address validate kare.
3. Order pending state create karo and inventory reservation atomically enforce karo.
4. Payment request provider idempotency key ke saath execute karo.
5. Verified payment result order state advance kare; uncertain timeout pending reconciliation mein jaye.
6. Outbox order event downstream shipment/notification work trigger kare.

Provider idempotency contract retention and key reuse rules specify karta hai. Same key with changed parameters conflict ho sakta hai. Application-side durable intent record still useful hai for end-to-end state. [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)

## Concurrency and inventory

```sql
UPDATE inventory
SET available = available - :quantity
WHERE product_id = :id AND available >= :quantity;
```

Affected row count success determine kare; quantity must be positive and bounded. Multi-product reservation complete transaction or coordinated workflow demand karti hai. Reservation expiry and payment confirmation race handle karo: expiry task paid order ka stock release na kare. Inventory sharding per SKU hot product bottleneck remove automatically nahi karta.

Multi-SKU reservation mein deadlock ka ek concrete risk hai jo aksar miss hota hai. Order A mein SKU-1 aur SKU-2 hain, Order B mein SKU-2 aur SKU-1 — agar dono transactions rows ko cart order mein lock karein toh circular wait ban sakta hai. Fix wahi hai jo concurrency mein hota hai: SKUs ko hamesha ek deterministic order mein process karo (jaise SKU string se sorted), taaki dono transactions same sequence mein locks lein.

```java
// Deterministic ordering se circular wait structurally impossible ho jaata hai
List<CartLine> lines = cart.lines().stream()
    .sorted(Comparator.comparing(CartLine::sku))
    .toList();
for (CartLine line : lines) {
    int updated = inventory.tryReserve(line.sku(), line.qty()); // atomic conditional update
    if (updated == 0) throw new OutOfStockException(line.sku()); // poori transaction rollback
}
```

## The hardest correctness problem: payment confirmed, reservation already expired

Is design ka sabse mushkil correctness issue overselling nahi hai — wo ek atomic UPDATE se handle ho jaata hai. Asli problem yeh hai ki **payment authority provider ke paas hai, inventory authority tumhare database ke paas hai, aur dono ke beech koi shared transaction nahi hai.** Un dono ke clocks aur timeouts independent hain.

Failure ko is concrete timeline se samjho:

```text
12:00:00  reservation banti hai, expires_at = 12:15:00
12:00:05  payment provider par charge initiate hota hai
12:00:06  user ko 3D Secure/bank OTP screen milti hai
12:14:50  user abhi bhi OTP page par hai (bank slow tha)
12:15:00  expiry job chalti hai -> reservation released -> stock wapas available
12:15:30  koi aur buyer wahi last unit khareed leta hai
12:16:10  bank confirm karta hai -> provider webhook: payment succeeded

ab: paisa liya ja chuka hai, lekin stock available nahi hai
```

Yeh race un designs mein *guaranteed* hoti hai jinme payment external aur asynchronous hai. Isse "expiry ko lamba kar do" se solve karna sirf probability kam karta hai, problem nahi hataata — aur lamba hold inventory ko unnecessarily block karta hai.

Real solution teen parts mein hai.

**Part 1 — expiry ko payment state se coordinate karo, blindly mat chalao.** Expiry job ko us reservation ko touch nahi karna chahiye jiska payment in-flight hai. Reservation state machine mein ek `payment_pending` state add karo: jaise hi provider par charge initiate hota hai, reservation `held` se `payment_pending` ho jaati hai aur expiry job us state ko skip karti hai (ya uska window bahut lamba kar deti hai, jaise 2 hours, aur uske baad bhi expire karne se pehle provider se status query karti hai).

```sql
-- Expiry job sirf un reservations ko release kare jinka payment shuru hi nahi hua,
-- aur release ko conditional rakho taaki concurrent transition na haare
UPDATE reservation
SET state = 'released'
WHERE state = 'held'                  -- payment_pending ko kabhi nahi chhuta
  AND expires_at < now()
RETURNING id, sku, qty;
```

Aur payment initiate karne wala step bhi conditional hona chahiye — `UPDATE reservation SET state='payment_pending' WHERE id=? AND state='held'` — agar wo 0 rows affect kare toh matlab expiry job jeet gayi, aur us case mein payment initiate hi mat karo. Dono sides conditional hone se exactly ek jeetta hai.

**Part 2 — provider ko authoritative maano, apni timeout ko nahi.** Timeout ka matlab "failed" nahi hai, uska matlab "unknown" hai. Isliye `payment_attempt.status` mein `unknown` ek first-class value hai. Ek reconciliation job har `initiated`/`unknown` attempt ko provider se query karta hai (same idempotency key se) aur outcome resolve karta hai. Bina iske do tarah ke silent bugs aate hain: charged-but-no-order (user ka paisa gaya, order nahi bana) aur order-but-not-charged.

**Part 3 — jab race haar jao, toh business-level compensation define karo, na ki exception.** Agar payment succeed hua aur stock genuinely available nahi hai, system ko crash nahi karna chahiye; usse ek defined outcome chahiye:

| Situation | Outcome | User communication |
| --- | --- | --- |
| Payment success, stock available | Order confirmed | Confirmation email |
| Payment success, stock gaya, restock imminent | Backorder with ETA | "Shipping delayed, ETA X" + cancel option |
| Payment success, stock gaya, no restock | Automatic full refund | Apology + refund reference + timeline |
| Payment unknown at reconciliation | Order `pending_review`, operator queue | "We're confirming your payment" |

Sabse important design statement yeh hai: **payment aur inventory ke beech distributed atomicity possible nahi hai, isliye correctness ka matlab hai har inconsistent state ka ek defined, detectable aur recoverable outcome hona.** Interview mein yeh answer "hum 2PC use karenge" se kahin strong hai — 2PC external payment provider ke saath available hi nahi hai, aur available hota toh bhi coordinator failure ke saath locks hold karta.

Detection ko automate karo: ek daily reconciliation report jo provider ke settled charges ko apne confirmed orders se match kare. Mismatch count ek business metric hona chahiye jispe alert ho — kyunki silent money bugs sabse mehenge hote hain aur customer complaint se pata chalna sabse mehenga tarika hai.

## React experience under uncertainty

Button disable duplicate clicks reduce karta hai, server idempotency replace nahi. Show submitting, payment-action-required, pending, confirmed and failed states. Refresh ke baad durable order status retrieve karo. Optimistic cart update rollback possible hai; confirmed purchase only authoritative confirmation ke baad show karo. Accessibility ke liye validation summary, field associations and focus placement define karo.

## Failure scenarios

Payment successful lekin response lost ho: same intent se provider retry/query karo; blindly new charge create mat karo. Webhook duplicate or out of order arrives: event ID dedupe, signature verification and allowed state transitions apply karo. Shipping unavailable: paid order queued state mein remain kare and operational alert trigger ho. Refund compensation instantaneous reversal assume mat karo.

Webhook out-of-order ka concrete case: `payment_failed` (first attempt declined) aur `payment_succeeded` (retry) dono webhooks network ke through aate hain, aur `failed` baad mein deliver ho sakta hai. Agar handler blindly status set kare toh confirmed order failed mark ho jaayega. Isliye transitions ko explicitly guard karo — ek allowed-transition table, aur provider ka event timestamp/sequence bhi check karo:

```text
requires_payment -> processing        allowed
processing       -> confirmed         allowed
processing       -> failed            allowed
confirmed        -> failed            REJECTED (log karo, alert karo)
confirmed        -> confirmed         no-op (duplicate webhook)
failed           -> confirmed         allowed only via reconciliation, with audit
```

`confirmed -> failed` ko reject karke silently drop mat karo — usse log aur alert karo, kyunki wo ya toh out-of-order delivery hai (benign) ya ek genuine dispute/chargeback event hai (bilkul benign nahi) aur dono ko distinguish karna padta hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Cart ke total ko client par calculate karke checkout request mein bhejna theek hai, kyunki wo wahi prices use kar raha hai jo server ne diye the. **Why it breaks:** Client-supplied amount attacker-controlled input hai — koi bhi `grandTotalMinor: 1` bhej sakta hai. Aur honest clients ke liye bhi wo stale ho sakta hai agar price ya tax rule beech mein badla ho. **Fix:** Server har checkout par total apne data se recompute kare; client ka amount sirf display confirmation ke liye compare karo aur mismatch par user ko naya total dikhakar re-confirm karao.
- **Wrong assumption:** Button disable karne se duplicate order nahi banega. **Why it breaks:** Duplicate submission ke teen aur rastey hain jo UI se nahi rukte — user ka browser refresh, network retry (client library ya proxy ka), aur mobile app ka background retry. Aur double-click ke case mein bhi do requests network par already ja chuki ho sakti hain. **Fix:** Server-side idempotency key hi single source of truth hai; UI disable sirf ek UX improvement hai, correctness mechanism nahi.
- **Wrong assumption:** Inventory count ko cache karke read karna safe hai kyunki final check database par hoga. **Why it breaks:** Stale cached count se product page "In stock" dikhata hai, user poora checkout flow bharta hai, aur last step par fail hota hai — conversion loss aur trust loss dono. Aur flash sale mein hazaaron users ko yeh experience ek saath milta hai. **Fix:** Cached availability ko precise number ke bajaye coarse signal ke roop mein dikhao ("In stock" / "Only a few left" / "Sold out") short TTL ke saath, aur cart add karte waqt ek fresh check karo — checkout se pehle, checkout par nahi.
- **Wrong assumption:** Order state ko ek boolean `is_paid` flag se manage kiya ja sakta hai. **Why it breaks:** Real payment flows mein kam se kam chaar intermediate states hote hain — initiated, requires_action (3DS/OTP), unknown (timeout), succeeded — aur inhe boolean mein squeeze karne ka matlab hai `unknown` ko `false` maan lena, jo timeout ke baad duplicate charge ka direct raasta hai. **Fix:** Explicit state machine banao with allowed transitions, aur `unknown` ko first-class state banao jo reconciliation ko trigger kare.
- **Wrong assumption:** Webhook handler mein poora business processing karna theek hai. **Why it breaks:** Payment providers ke webhook timeouts chhote hote hain (aksar 5-10 s) aur timeout par wo retry karte hain. Agar handler 8 s ka kaam karta hai (order create, email, shipment API) toh provider timeout dekh kar dobara bhejta hai, aur ab do handlers concurrently same event process kar rahe hain. **Fix:** Webhook handler sirf signature verify kare, event ko durably record kare, aur turant 200 return kare; actual processing async worker kare jo idempotent ho.
- **Wrong assumption:** Refund issue karke compensation complete ho gaya. **Why it breaks:** Refund provider par days le sakta hai, kuch payment methods par partial ya impossible hota hai, aur user ke liye "paisa wapas aayega" aur "paisa aa gaya" mein bada difference hai. Saath hi loyalty points, coupons aur inventory bhi reverse karne padte hain, aur unka apna failure mode hota hai. **Fix:** Compensation ko bhi ek tracked workflow banao apne states ke saath (`refund_requested` → `refund_confirmed`), user ko expected timeline batao, aur stuck refunds par alert rakho.

## Interview questions — bolkar practice karo

**Why not cache checkout price for hours?** Display price stale tolerate kar sakta hai under explicit policy; payable amount business authority se recompute/validate hona chahiye. User ko changed total confirmation chahiye.

**Available stock se zyada sale kaise rokoge?** Atomic availability check/update or suitable reservation locking, transaction boundary and durable reservation lifecycle enforce karunga. App-side pre-check alone race karta hai.

**Payment succeed ho gaya lekin aapka database write fail ho gaya — user ko kya dikhaoge?** User ko "processing" dikhaunga, failure nahi — kyunki paisa ja chuka hai aur "failed" dikhana galat information hai jo support ticket aur chargeback dono generate karti hai. Backend side par payment attempt `succeeded` record ho chuka hoga (ya reconciliation se ho jaayega), aur ek retry/recovery job order creation ko complete karega. Agar wo bhi repeatedly fail kare toh order `pending_review` mein jaakar operator queue mein aata hai, aur user ko ek clear status page plus support reference milta hai. Sabse important yeh hai ki system ke paas ek record ho ki paisa liya gaya hai — us record ke bina yeh situation detectable hi nahi hoti.

**Flash sale ke liye kya alag karoge?** Load test se safe admission rate nikalunga, bounded queue/waiting room aur retry jitter use karunga. Admission cache database ko protect karega; final stock truth aur atomic reservation database own karega. Gate full ka response busy/waitlist hoga, sold-out sirf authoritative inventory result par. Expired reservations, idempotent checkout aur payment reconciliation define karunga. Product pages CDN se serve aur email/analytics async karunga.

**Currency aur money ko kaise represent karoge?** Integer minor units (paise/cents) mein, har amount ke saath uski currency code. Floating point kabhi nahi — `0.1 + 0.2` wali classic precision problem reconciliation ke waqt paise ke differences ke roop mein dikhti hai, aur unhe debug karna bahut mehenga hai. Rounding rules ko explicitly define karta hoon (tax calculation kis level par round hoga — line item ya order total) kyunki do valid approaches alag totals dete hain aur dono jagah same rule hona chahiye — display aur charge dono mein.

**Cart ko kahan store karoge?** Guest cart client-side (localStorage) mein theek hai kyunki wo low-value aur high-volume hai, aur usse server par rakhna ek bada write load add karta hai jiska business value kam hai. Logged-in cart server par hona chahiye taaki cross-device kaam kare. Dono cases mein cart ko *quote* nahi maana jaata — prices aur availability checkout intent banate waqt server par freshly compute hote hain, kyunki cart hafton purana ho sakta hai.

## Practice

State diagram draw karo with payment-timeout branch. Same checkout request five times replay karo. Last item ke liye two buyers race karao and verify accepted reservations never exceed available stock.

Phir upar wali expiry race deliberately reproduce karo: reservation expiry ko 5 seconds set karo, payment confirmation ko 10 seconds delay karo, aur dekho ki kya hota hai. Phir `payment_pending` state aur conditional updates add karke verify karo ki expiry job us reservation ko chhodti hai. Uske baad webhook out-of-order test karo — `succeeded` pehle aur `failed` baad mein bhejo — aur confirm karo ki order confirmed rehta hai aur rejected transition log/alert hoti hai. Last mein ek reconciliation query likho jo provider ke charges list ko apne confirmed orders se compare kare aur dono directions ke mismatches report kare.

## Depth walkthrough — andar kya ho raha hai?

### Order, reservation aur payment ki identities separate rakho

One logical checkout ke retries same operation identity carry karein. Order ID business record hai, reservation ID stock hold lifecycle, payment intent provider-side attempt/workflow identify kar sakti hai. IDs interchangeable bana doge toh duplicate detection ya reconciliation ambiguous ho sakti hai.

Reservation expire, payment later confirm: local state aur provider state conflict handle karne ka product rule chahiye. Stock re-acquire possible ho toh fulfill, warna refund/manual resolution; callback arrival ko unconditional order success mat banao. Authoritative amounts server recompute/validate kare.

**Practice:** Timeline mein every durable transition mark karo. Browser success screen refresh, duplicate webhook aur worker crash ke baad same order status recover ho. “Checkout failed” show karne se pehle unknown payment outcome distinguish karo. Analytics/email failure payment state revert karne ki automatic reason nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Payment successful hui lekin order response milne se pehle client timeout ho gaya. Retry kya kare aur UI kya bole?

> **Hint — chhota ishara:** Missing response payment failure ka proof nahi hai.

**Answer guide — pehle khud karo, phir compare karo:** Stable operation ID se retry/status query karo, taaki same purchase recover ho aur double charge na ho. Server confirm hone tak pending/verification state dikhao. Idempotency result persist karo aur uncertain provider result durable order state se reconcile karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Stripe webhook handling](https://docs.stripe.com/webhooks)
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)
