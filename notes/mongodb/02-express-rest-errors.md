---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 33
summary: Middleware order decide karta hai ki handler ko kaunsa parsed data aur kaunse checks milenge.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Mental model — simple soch

Express request middleware chain se travel karti hai. Har middleware response complete karta hai, next middleware ko control deta hai, ya error forward karta hai. Registration order behavior define karta hai. Route transport concerns handle kare, service business use case handle kare aur repository database access handle kare. Small app mein layers lightweight rakho; unnecessary wrappers architecture nahi banate.

> **Core takeaway:** Middleware order decide karta hai ki handler ko kaunsa parsed data aur kaunse checks milenge.

## Express 5 route with bounded input

```js
import express from "express";
import { Topic } from "./models/topic.js";

export const app = express();
app.use(express.json({ limit: "32kb" }));

app.get("/api/topics", async (req, res) => {
  const rawLimit = req.query.limit;
  const limit = rawLimit === undefined ? 20 : Number(rawLimit);
  if ((rawLimit !== undefined && typeof rawLimit !== "string") ||
      !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "limit must be an integer from 1 to 100" });
  }
  const topics = await Topic.find({ published: true })
    .sort({ createdAt: -1, _id: -1 }).limit(limit).lean();
  res.json({ data: topics });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error(error); // Replace with structured logs and secret redaction.
  const invalidJson = error.type === "entity.parse.failed";
  res.status(invalidJson ? 400 : 500).json({
    error: invalidJson ? "Invalid JSON body" : "Unexpected server error"
  });
});
```

Example mein Topic model application module hai. Real API expected domain/validation/conflict errors ko explicit mappings se 4xx responses de; internal stack trace public response mein expose mat karo. Error middleware ke four arguments Express signature ka part hain. Express 5 returned async handler rejection automatically forward karta hai. Express 4 mein explicit wrapper/catch(next) chahiye; callback ya detached background promise errors Express 5 mein bhi automatically magically catch nahi hote.

## Design the contract

POST create par 201, successful read par 200 aur successful no-body deletion par 204 useful conventions hain. PATCH selected changes apply karta hai. 400 malformed input, 401 missing/invalid authentication, 403 forbidden aur 404 absent resource communicate karte hain. 409 duplicate/concurrent conflict ke liye useful hai. Exact error shape consistent rakho with stable code, readable message aur request id.

Filtering, sorting aur projection ke allowed fields whitelist karo. Entire req.query ko database filter ke roop mein forward mat karo. Pagination limit cap karo. Offset pagination simple hai; very deep pages expensive ho sakte hain aur concurrent inserts page boundaries shift kar sakte hain. Cursor pagination stable sort keys plus unique tie-breaker use kare; id/date cursor ko validate karo.

## Middleware ordering in depth

```js
const app = express();

app.use(requestId());           // 1. tag every request first, for correlated logs
app.use(express.json({ limit: "32kb" }));  // 2. parse body before routes read it
app.use(rateLimiter());         // 3. cheap rejection before expensive work
app.use("/api", requireApiKeyOrSession); // 4. authenticate before business logic
app.use("/api/topics", topicsRouter);    // 5. feature routes
app.use((req, res) => res.status(404).json({ error: "Route not found" })); // 6. catch-all
app.use(errorHandler);          // 7. always last: four-argument signature
```

Order registration order hai, execution order nahi kuch alag chalti — jo pehle `app.use` hua woh pehle chalega jab tak koi middleware `next()` call na kare ya response khud complete kar de. Body parser route se pehle chahiye warna `req.body` `undefined` milega. Authentication rate limiter ke baad rakhna reasonable hai taaki abusive unauthenticated traffic bhi cheaply reject ho jaaye. 404 handler ko sabhi real routes ke baad, error handler se pehle rakho — warna woh valid routes ko bhi intercept kar dega. Ek route-specific middleware array bhi likha ja sakta hai (`app.get("/x", auth, validate, handler)`); vahan bhi array ka order hi execution order hai.

## Centralized error handling with typed errors

```js
// errors.js — small hierarchy so the handler can branch on `instanceof`.
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // expected/handled error, not a bug
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") { super(message, 404); }
}
export class ValidationError extends AppError {
  constructor(message = "Invalid input") { super(message, 400); }
}

// controller
app.get("/api/topics/:id", async (req, res, next) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) return next(new NotFoundError("Topic not found"));
  res.json({ data: topic });
});

// centralized handler
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const known = error instanceof AppError;
  if (!known) console.error(error); // unexpected — log full detail server-side
  res.status(known ? error.statusCode : 500).json({
    error: known ? error.message : "Unexpected server error",
    requestId: req.id
  });
});
```

`isOperational` flag differentiate karta hai expected domain errors (missing resource, bad input) ko unexpected bugs se (null-pointer, driver crash). Operational error ka message client ko safely dikha sakte ho; non-operational error ka raw message/stack kabhi client response mein mat bhejo, sirf server logs mein. Yeh pattern controllers ko `try/catch` boilerplate se free karta hai — sirf `next(error)` call karo, shape decide karna handler ka kaam hai.

## Gotchas

Response send karne ke baad execution automatically return nahi hota; unintended second response avoid karo — `return next(...)` ya `return res.json(...)` likhne ki habit banao. Middleware mein na response na next hua to request hang hogi (client timeout tak wait karega). JSON parser order important hai, especially raw signed webhook body ke saath — raw body parser signed-webhook route par global JSON parser se pehle registered hona chahiye. Static files, health checks aur authenticated API routes ke boundaries clear rakho. Error logs mein tokens, passwords aur unnecessary personal data mat include karo. Async handler ke andar thrown error automatically next request ko block nahi karti (each request apna own call stack rakhta hai), lekin unhandled promise rejection process-level listener trigger kar sakti hai — isliye har async path se error ko explicitly propagate/handle karna zaroori hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Express 4 ki tarah, ek async route handler mein thrown error automatically 500 response bana degi. **Why it breaks:** Express 4 mein async function ke andar throw hua error `next()` ko automatically forward nahi hota; request silently hang ho jaati hai ya client ko timeout milta hai. **Fix:** Express 4 projects mein async handler ko `try/catch` se wrap karo aur `catch` block se `next(error)` explicitly call karo, ya ek reusable `catchAsync` wrapper use karo. Express 5 yeh automatically karta hai, lekin version confirm kiye bina assume mat karo.
- **Wrong assumption:** 404 handler har jagah kaam kar jaayega chahe usse register kahin bhi karo. **Why it breaks:** Agar 404 handler real feature routes se pehle register hua, toh woh un routes tak request pahunchne hi nahi dega — sab kuch "not found" ban jaayega. **Fix:** Route registration order maintain karo: specific routes pehle, catch-all 404 sabse last (error handler se pehle).
- **Wrong assumption:** `req.query`/`req.body` ke fields ko directly database filter/update object mein spread kar dena convenient shortcut hai. **Why it breaks:** Client attacker-controlled operators (jaise `$gt`, `$ne`) ya unintended fields (jaise `role`, `isAdmin`) inject kar sakta hai jo query semantics badal dete hain ya privileged fields overwrite kar dete hain. **Fix:** Allowed fields ki explicit whitelist banao aur sirf unhi ko destructure karke query/update object mein daalo.

## Practice

Topics CRUD API ka request/response contract likho. Malformed JSON, unknown route, invalid limit, missing topic aur database failure simulate karo. Verify karo ki server useful error deta hai aur next request handle kar sakta hai.

## Interview questions — bolkar practice karo

**Q. Controller aur service separate kyun?** HTTP parsing aur business rules independently understandable/testable hote hain; same use case job ya CLI se reuse ho sakta hai.

**Q. Global error handler har failure catch karega?** Sirf Express ko forwarded errors. Detached async work aur process failures ke liye separate lifecycle handling required hai.

## Research notes: Return the promise that owns the request

Express 5 returned handler promise ki rejection forward karta hai. Detached async work ka explicit error owner phir bhi chahiye.

```js
// Express 5; loadOrder is an injected async repository.
app.get('/orders/:id', async (req, res) => {
  const order = await loadOrder(req.params.id);
  res.json(order);
});
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Unable to load order' });
});
```

Routes ke baad error middleware register karo. Response finish hone ke baad background failure usi response mein report nahi ho sakti.

**Interview check:** Later setTimeout ki exception returned promise rejection se alag kyun hai?

**Answer:** Timer callback returned promise chain ke bahar hai. Failure catch karke appropriate owner tak route karo, ya work include karne wali abstraction await karke phir response complete karo.

**Practice:** Repository rejection inject karke exactly one controlled response verify karo.

[Source yahan padho — Express](https://expressjs.com/en/guide/error-handling/). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Middleware chain ko control-flow program ki tarah trace karo

Parser request body prepare karta hai, auth identity establish karti hai, route validation/use case chalati hai, error handler recognized failures map karta hai. Handler response send karke bhi next work continue kare toh duplicate response/header errors aa sakte hain. Return/next ka ownership explicit rakho.

Async helper call karke uski promise return/await nahi ki toh framework request lifecycle se rejection disconnect ho sakti hai. Route succeed dikhne ke baad background failure hidden reh sakti hai. Deliberate background work ko separate observable job contract chahiye.

**Practice:** Malformed JSON, missing auth, unknown route aur service rejection trace karo. Har path par exactly one response aur expected cleanup ho. Validation input shape check kare; arbitrary client-supplied ownerId ko authenticated identity mat banao. Error payload safe aur stable ho, stack trace internal diagnostics mein rahe.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** JSON endpoint ko req.body undefined milta hai. Ordering cause batao; malformed JSON par controlled response kaise doge?

> **Hint — chhota ishara:** Handler body padhe usse pehle parser chalna chahiye.

**Answer guide — pehle khud karo, phir compare karo:** Relevant routes se pehle JSON parser install karo aur correct content type bhejo. Parsing failure error path se documented client-error response de. Fake empty body bana kar business logic continue mat karo; internal stack trace expose mat karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Express error handling](https://expressjs.com/en/guide/error-handling/) async propagation explain karta hai. [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html) chain behavior ka reference hai.
