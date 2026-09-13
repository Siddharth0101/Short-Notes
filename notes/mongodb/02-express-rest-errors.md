---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 30
summary: Request validation, routing, controllers, pagination aur centralized errors ko structured API mein jodo.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Mental model

Express request middleware chain se travel karti hai. Har middleware response complete karta hai, next middleware ko control deta hai, ya error forward karta hai. Registration order behavior define karta hai. Route transport concerns handle kare, service business use case handle kare aur repository database access handle kare. Small app mein layers lightweight rakho; unnecessary wrappers architecture nahi banate.

> **Core takeaway:** Middleware order determines what data and checks a handler receives.

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

## Common mistakes

- **Wrong assumption:** Express 4 ki tarah, ek async route handler mein thrown error automatically 500 response bana degi. **Why it breaks:** Express 4 mein async function ke andar throw hua error `next()` ko automatically forward nahi hota; request silently hang ho jaati hai ya client ko timeout milta hai. **Fix:** Express 4 projects mein async handler ko `try/catch` se wrap karo aur `catch` block se `next(error)` explicitly call karo, ya ek reusable `catchAsync` wrapper use karo. Express 5 yeh automatically karta hai, lekin version confirm kiye bina assume mat karo.
- **Wrong assumption:** 404 handler har jagah kaam kar jaayega chahe usse register kahin bhi karo. **Why it breaks:** Agar 404 handler real feature routes se pehle register hua, toh woh un routes tak request pahunchne hi nahi dega — sab kuch "not found" ban jaayega. **Fix:** Route registration order maintain karo: specific routes pehle, catch-all 404 sabse last (error handler se pehle).
- **Wrong assumption:** `req.query`/`req.body` ke fields ko directly database filter/update object mein spread kar dena convenient shortcut hai. **Why it breaks:** Client attacker-controlled operators (jaise `$gt`, `$ne`) ya unintended fields (jaise `role`, `isAdmin`) inject kar sakta hai jo query semantics badal dete hain ya privileged fields overwrite kar dete hain. **Fix:** Allowed fields ki explicit whitelist banao aur sirf unhi ko destructure karke query/update object mein daalo.

## Practice

Topics CRUD API ka request/response contract likho. Malformed JSON, unknown route, invalid limit, missing topic aur database failure simulate karo. Verify karo ki server useful error deta hai aur next request handle kar sakta hai.

## Interview questions

**Q. Controller aur service separate kyun?** HTTP parsing aur business rules independently understandable/testable hote hain; same use case job ya CLI se reuse ho sakta hai.

**Q. Global error handler har failure catch karega?** Sirf Express ko forwarded errors. Detached async work aur process failures ke liye separate lifecycle handling required hai.

## Research notes: Return the promise that owns the request

Express 5 forwards rejection from a returned handler promise. Detached asynchronous work still needs an explicit error owner.

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

Register error middleware after routes. Once a response finishes, a later background failure cannot be reported in that response.

**Interview check:** Why is an exception in a later setTimeout different from a rejected returned promise?

**Answer:** The timer callback is outside the returned promise chain. Catch and route its failure to the appropriate owner, or await an abstraction that includes the work before completing the response.

**Practice:** Inject a repository rejection and verify one controlled response.

[Read the source — Express](https://expressjs.com/en/guide/error-handling/). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A JSON endpoint sees an undefined request body. Identify an ordering cause, then specify how malformed JSON should reach a controlled response.

> **Hint:** Parsing must happen before the handler reads the body.

**Answer guide — compare after attempting:** Install the JSON parser before the relevant routes and send the appropriate content type. Handle parsing failures through the error path with a documented client-error response. Do not continue into business logic with a fabricated empty body or expose internal stack traces.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[Express error handling](https://expressjs.com/en/guide/error-handling/) async propagation explain karta hai. [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html) chain behavior ka reference hai.
