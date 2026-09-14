---
id: mongo-production-integrations
title: SSR uploads payments email and deployment
track: mongodb
order: 8
level: Advanced
minutes: 36
summary: External callbacks repeat ho sakte hain; durable state se repeated delivery ko safe banao.
tags: production, pug, stripe, uploads, email, deployment, observability
visual: request-flow
---

## Mental model — simple soch

Production app database request ke baad finish nahi hoti. Email provider timeout kar sakta hai, payment webhook duplicate aa sakta hai, upload invalid ho sakta hai aur process mid-request restart ho sakta hai. Har integration ke liye success evidence, retry policy, idempotency aur recovery path define karo. Network response lost hone ka matlab operation definitely fail hona nahi hai.

> **Core takeaway:** External callbacks repeat ho sakte hain; durable state se repeated delivery ko safe banao.

## Server-rendered pages

Pug template server data se HTML generate karta hai. Express mein view engine configure karke controller `res.render("topic", { topic })` call kar sakta hai. Layout inheritance common shell share karti hai, includes smaller pieces reuse karte hain aur escaped interpolation untrusted text output ke liye important hai. Raw/unescaped interpolation sirf deliberately trusted HTML ke liye use karo. SSR initial content server se bhejta hai; every page automatically interactive React app nahi ban jaati.

```pug
//- views/topic.pug
doctype html
html(lang="en")
  head
    meta(charset="utf-8")
    title= topic.title
  body
    main
      h1= topic.title
      p= topic.summary
      a(href="/topics") Back to topics
```

## Payment webhook boundary

```js
// Express + Stripe excerpt. Register BEFORE the global JSON parser.
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send("Invalid webhook signature");
  }
  await inbox.storeOnce(event.id, event.type, event.data.object);
  res.sendStatus(200);
});
app.use(express.json({ limit: "32kb" }));
```

`inbox.storeOnce` application-defined durable insert hai with unique event id; duplicate event success/no-op hona chahiye. Storage fail ho to success acknowledge mat karo. Express 5 async rejection centralized error handler ko forward karega. Worker later verified event process kare aur business-level idempotency enforce kare. Signature verification raw bytes require karti hai. Checkout redirect ko payment proof mat samjho; trusted provider event/state se order reconcile karo. Webhook ordering guaranteed assume mat karo.

## Upload and email workflow

Uploads ke size, count aur allowed type limits enforce karo. Filename/MIME alone trustworthy nahi; actual file signature/decode validate karo. Random server-generated object keys use karo, executable content ko web root mein na rakho aur object storage access policy define karo. Image resize processing bounded resources par run karo; original and derivative retention policy document karo.

Email provider credentials server-side rakho. User-facing request se slow delivery decouple karne ke liye durable job queue/outbox use karo. Retry transient errors with bounded backoff; permanently invalid destination ko infinitely retry mat karo. Job idempotency duplicate messages reduce karti hai. Templates mein escaped user content aur correct links use karo.

## Deploy and operate

Startup par required config validate karo aur database connect hone ke baad readiness signal do. Liveness process health aur readiness traffic accept karne ki ability ke different checks hain. Graceful shutdown new requests stop kare, in-flight work ko bounded time de aur database connections close kare. Fatal unexpected process state mein supervisor restart useful hai; error swallow karke indefinitely continue karna recovery plan nahi.

```js
// Separate liveness (is the process alive) from readiness (can it serve traffic).
let isReady = false;

app.get("/healthz", (req, res) => res.sendStatus(200)); // liveness — process is up
app.get("/readyz", (req, res) => {
  res.sendStatus(isReady && mongoose.connection.readyState === 1 ? 200 : 503);
});

await mongoose.connect(process.env.MONGO_URI);
isReady = true;

const server = app.listen(process.env.PORT);

// Graceful shutdown: stop accepting new connections, finish in-flight work, close DB.
async function shutdown(signal) {
  console.log(`Received ${signal}, starting graceful shutdown`);
  isReady = false; // load balancer stops routing new traffic here
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref(); // force-exit if shutdown hangs
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
```

Container orchestrators (jaise Kubernetes) `SIGTERM` bhejte hain aur ek bounded grace period dete hain before force-kill (`SIGKILL`). `isReady = false` set karna readiness probe ko turant fail karwa deta hai, taaki load balancer naya traffic bhejna band kar de, jabki `server.close()` existing in-flight requests ko complete hone deta hai (naye connections accept kiye bina). Timeout fallback zaroori hai — agar koi request/connection kabhi complete na ho, process ko forcibly exit hona chahiye instead of hanging indefinitely aur orchestrator ko `SIGKILL` ka wait karwana.

Structured logs with request ids, latency/error metrics aur trace context debugging support karte hain. Secrets redact karo. CI install/build/check steps reproducible rakho, database indexes/migrations planned rakho aur backup restoration actually test karo. Stateless app instances local uploaded files par depend na karein. Deployment provider-specific UI steps change hote hain; environment, health, storage aur rollback requirements stable checklist hain.

```js
// Minimal structured logging middleware — attach request id and log latency.
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(JSON.stringify({
      requestId: req.id, method: req.method, path: req.path,
      status: res.statusCode, durationMs
    }));
  });
  next();
});
```

Structured (JSON) log lines free-text messages se better hain kyunki log aggregation tools (jaise CloudWatch, Datadog) unhe field-by-field query/filter/alert kar sakte hain — jaise "sab 500 responses jo 2 second se zyada le rahe hain, sirf `/api/payments` route par." `req.id` ko error handler ke response mein bhi include karna user-reported issue ko exact log lines se correlate karna easy banata hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `SIGKILL`/abrupt process crash aur graceful `SIGTERM` shutdown same tarah handle ho jaate hain automatically. **Why it breaks:** `SIGKILL` ko koi bhi handler intercept nahi kar sakta — in-flight requests turant drop ho jaati hain aur database connections uncleanly close hoti hain, jisse partial writes ya orphaned connections ban sakte hain. **Fix:** Deployment ko `SIGTERM` bhejne aur reasonable grace period dene ke liye configure karo (orchestrator settings mein), aur `SIGKILL` sirf true last-resort ho, normal deploy path na ho.
- **Wrong assumption:** Health check endpoint sirf `res.sendStatus(200)` return kare bina kuch check kiye, kyunki "server toh chal hi raha hai." **Why it breaks:** Process alive hone ka matlab yeh nahi ki woh actually traffic serve kar sakta hai — database disconnected ho sakta hai, downstream dependency down ho sakti hai. Load balancer aise "always-200" health check par bharosa karke broken instance ko bhi traffic bhejta rahega. **Fix:** Readiness check mein actual dependency state verify karo (jaise `mongoose.connection.readyState`), aur liveness/readiness ko alag endpoints ke roop mein treat karo.
- **Wrong assumption:** Uploaded files ko application server ki local disk par save karna production mein bhi fine hai jaise development mein tha. **Why it breaks:** Stateless multi-instance deployment mein har request kisi bhi instance par land ho sakti hai; ek instance par saved file doosri instance se accessible nahi hogi, aur instance restart/redeploy hone par local disk data lost ho sakta hai. **Fix:** Object storage (jaise S3-compatible service) use karo jo sab instances se equally accessible ho aur redeploys survive kare.

## Practice

Same webhook twice deliver karo aur verify karo ki one business action hoti hai. Database outage before acknowledgment simulate karo. Invalid image aur oversized upload reject karo. Process shutdown during slow request test karo aur deployment rollback steps document karo.

## Interview questions — bolkar practice karo

**Q. Webhook response quickly kyun dena hai?** Durable acceptance ke baad heavy work background mein karne se timeout/retry pressure reduce hota hai. Durability ke pehle acknowledgment event lose kar sakta hai.

**Q. Exactly-once email guaranteed hai?** External side effects mein failures ambiguous ho sakte hain. Idempotency, durable state aur reconciliation se duplicates/loss manage karo; blanket guarantee mat do.

## Capstone: durable order and webhook workflow

Authenticated order-create endpoint aur MongoDB-backed webhook handler banao. Fake payment provider se events replay/delay/reorder/duplicate karo, taaki real payments ki need na ho.

### Acceptance criteria

- Har order read owner/explicit role se authorize karo; changed ID wali direct request bhi test karo.
- Provider ke documented payload rules se webhook authenticity verify karo. Browser redirect payment confirmation nahi.
- Same event ki concurrent deliveries ek durable business transition karein; restart dedup reset na kare.
- Commit ke baad ack se pehle crash par replay duplicate effect na de.
- Realistic tenant-feed plan index ke pehle/baad compare karo: scanned documents, returned rows aur write cost note karo.
- Input size, page size aur async work bound rakho. Useful error do bina internal stack leak kiye.

### Interview defense

Unique constraints, single-document atomicity aur multi-document transactions ka difference samjhao. Transaction supported deployment par test karo. Dedup-record retention aur payment/order mismatch reconciliation define karo. Replay script aur concurrent reproduction deliver karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Provider same payment-success event do baar bhejta hai. Order do baar fulfill na ho, aisa processing/storage sketch do.

> **Hint:** Event ID persist karke business transition ke saath coordinate karo.

**Answer guide — compare after attempting:** Unique provider event ID record karo aur chosen storage design mein order transition atomic rakho. Repeat no-op bane. External fulfillment ke liye durable outbox task aur idempotent downstream operation use karo. Local flag unrelated network call ko atomically cover nahi karta.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye
[Stripe webhooks](https://docs.stripe.com/webhooks) signatures aur delivery handling explain karta hai. [Express production performance](https://expressjs.com/en/advanced/best-practice-performance.html) operational patterns aur [Pug interpolation](https://pugjs.org/language/interpolation.html) template escaping ka reference hain.
