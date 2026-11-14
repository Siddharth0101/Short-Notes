---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 4
summary: Express — an HTTP framework of routing and middleware.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Quick revision

> Revision target — Trace the control flow of the middleware and who owns the response for each failure.

- Express — an HTTP framework of routing and middleware.
- Middleware — order matters; send a response or hand over control with `next()`.
- Route — method + path + handler; validate the type/range of the input.
- Express 5 — a returned rejected Promise enters the error flow; handle detached async work separately.
- Error handler — `(err, req, res, next)`; register it after the routes.
- Double response — after a send, think about stopping the execution/control flow or returning.
- REST — resource URLs, consistent methods/status codes and bounded pagination.
- Error response — a safe message/code; no stack trace to the client.
- 404 handler — the response for an unmatched route; a different flow from a thrown exception.
- Body limit — bound the parser/upload payload; an unlimited request is a memory risk.
- Middleware continuation — after next(), the current JS execution does not return automatically.

### Data-access boundary

- Repository — encapsulates SQL/data access; the controller owns the HTTP contract.
- Error mapping — map a unique conflict/missing row to a stable HTTP response.
- Test — verify real database constraints and rollback behaviour.
- Affected rows — when the update count is zero, a contract to distinguish missing from a stale version.
- Error after commit — if the response fails, the write is already durable; keep the same retry identity.
- Pool timeout — bound the connection wait within the request deadline.

### PostgreSQL integration

- pg pool — reuses bounded PostgreSQL connections; release an acquired client in finally.
- pg values — the $1/$2 placeholders bind values; allowlist dynamic identifiers.
- pg transaction — BEGIN, the queries and COMMIT on the same checked-out client; ROLLBACK on error.
- Tenant pagination — keep a bounded limit, a stable order and a server-verified tenant predicate together.

### Edge cases and reasoning

- Headers-sent error — if the response has already started, delegate from the error middleware with next(err); do not send a second JSON response.
- Proxy trust — match trust proxy to the actual trusted hops/config; forged forwarding headers can bypass client identity/rate limits.
- Body parser order — preserve the raw bytes of a signed webhook before the normal JSON parser; a parsed/reserialized payload is not an equivalent signature input.

## Research notes: Return the promise that owns the request

- Express 5 forwards the rejection of a returned handler promise.

## Understand it with an example

- Scenario — The auth middleware sends an unauthorized response, but the route continuation runs after it anyway.
- Reasoning — Terminate the response path with a return/branch; only the authorized path calls next(). Deliver the failure of the route's returned async operation to the central handler.
- Catch — next() does not return from the current JavaScript function; a second send after the response is sent can raise a headers error.

## Recall and practice

- Question — Are a returned async route and an error in a detached setTimeout callback handled the same way in Express 5?
- Answer — No; the rejection of a returned handler Promise is forwarded, while a detached callback needs explicit error ownership/forwarding.
- Try it yourself — Test an API pipeline; verify one response/cleanup for an invalid body, a rejected route Promise, an unknown route and a headers-sent failure.

## Practice questions

### Easy · `req.body` is undefined

```js
app.post('/users', createUser);
app.use(express.json());
```

<details>
<summary>Answer</summary>

- Why — middleware runs in order; the route was registered before the body parser, so the body was never parsed.
- Fix — `app.use(express.json({ limit: '100kb' }))` before the routes.
- Limit — a body size limit protects against DoS.

</details>

### Easy · "Cannot set headers after they are sent"

```js
app.get('/users/:id', async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) res.status(404).json({ error: 'not found' });
  res.json(user);
});
```

<details>
<summary>Answer</summary>

- Why — after sending the 404 the function kept running and tried to send a second response.
- Fix — `if (!user) return res.status(404).json(...)`.
- Rule — `return` after every response; one request, one response.

</details>

### Medium · Async errors and Express

How is the rejected promise of an async handler handled in Express 4 and in Express 5? Write a central error handler.

<details>
<summary>Answer</summary>

```js
app.get('/orders/:id', async (req, res) => {
  const order = await orders.get(req.params.id); // may reject
  res.json(order);
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) req.log?.error(err);
  res.status(status).json({ error: status >= 500 ? 'Internal error' : err.message });
});
```

- Express 4 — a rejected promise does not reach the error handler (the request hangs/an unhandled rejection); you need `try/catch` + `next(err)` or a wrapper.
- Express 5 — the rejected promise of a handler/middleware goes to `next(err)` automatically.
- Error handler — the 4 arguments are required; register it after the routes.

</details>

### Medium · 404 and error mapping

An unknown route, a validation error and a DB duplicate key — how do all three get consistent JSON?

<details>
<summary>Answer</summary>

- 404 — after all the routes: `app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND' }))`.
- App errors — `class AppError extends Error { constructor(status, code, message) {...} }`; validation → `400 VALIDATION_FAILED`.
- DB mapping — Mongo `E11000` / Postgres `23505` → `409 CONFLICT`, in one place in the error handler.
- Unknown — a generic `500` message; the details go to the logs with the request id.

</details>

### Hard · A transaction with the `pg` pool

```js
await pool.query('BEGIN');
await pool.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amt, from]);
await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amt, to]);
await pool.query('COMMIT');
```

What is the bug? Write the correct version.

<details>
<summary>Answer</summary>

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amt, from]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amt, to]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

- Bug — `pool.query` can take a different connection on each call; `BEGIN` on one connection and the updates on another → there is no transaction at all.
- `release` in finally — otherwise the pool leaks and times out.
- Parameters `$1` — safe from SQL injection.

</details>

## Sources — further reading

- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/02-express-rest-errors.md)
