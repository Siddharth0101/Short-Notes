# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Research notes: Return the promise that owns the request

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
