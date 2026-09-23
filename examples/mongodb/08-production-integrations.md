# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Server-rendered pages

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

## Deploy and operate

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
