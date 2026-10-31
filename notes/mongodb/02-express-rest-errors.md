---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 4
summary: Express — routing aur middleware ka HTTP framework.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Quick revision

> Revision target — Middleware ke control flow aur each failure ke response owner ko trace karo.

- Express — routing aur middleware ka HTTP framework.
- Middleware — order matters; response bhejo ya `next()` se control do.
- Route — method + path + handler; input ki type/range validate karo.
- Express 5 — returned rejected Promise error flow mein jaati hai; detached async work alag handle karo.
- Error handler — `(err, req, res, next)`; routes ke baad register karo.
- Double response — send ke baad execution/control flow rokna ya return karna socho.
- REST — resource URL, consistent methods/status aur bounded pagination.
- Error response — safe message/code; stack trace client ko nahi.
- 404 handler — unmatched route response; thrown exception se alag flow.
- Body limit — parser/upload payload bound karo; unlimited request memory risk.
- Middleware continuation — next() ke baad current JS execution automatically return nahi hoti.

### Data-access boundary

- Repository — SQL/data access encapsulate; controller HTTP contract own kare.
- Error mapping — unique conflict/missing row ko stable HTTP response mein map.
- Test — real database constraints aur rollback behavior verify.
- Affected rows — update count zero ho toh missing/stale version distinguish karne ka contract.
- Error after commit — response fail hone par write already durable; retry identity same rakho.
- Pool timeout — connection wait ko request deadline ke andar bound karo.

### PostgreSQL integration

- pg pool — bounded PostgreSQL connections reuse; acquired client finally mein release.
- pg values — $1/$2 placeholders values bind karte; dynamic identifiers allowlist karo.
- pg transaction — BEGIN, queries, COMMIT same checked-out client par; error par ROLLBACK.
- Tenant pagination — bounded limit, stable order aur server-verified tenant predicate saath rakho.

### Edge cases aur reasoning

- Headers-sent error — response start ho chuka ho toh error middleware next(err) se delegate; second JSON response mat bhejo.
- Proxy trust — trust proxy ko actual trusted hops/config se match; forged forwarding headers client identity/rate limit bypass kara sakte hain.
- Body parser order — signed webhook ke raw bytes normal JSON parser se pehle preserve; parsed/reserialized payload equivalent signature input nahi.

## Research notes: Return the promise that owns the request

- Express 5 returned handler promise ki rejection forward karta hai.

## Example se samjho

- Scenario — Auth middleware unauthorized response send karta hai, lekin uske baad route continuation bhi chal jaati hai.
- Reasoning — Response path ko return/branch se terminate karo; authorized path hi next() kare. Route ke returned async operation ka failure central handler tak pahunchao.
- Catch — next() current JavaScript function ko return nahi karta; response send hone ke baad second send headers error de sakta hai.

## Recall aur practice

- Sawal — Returned async route aur detached setTimeout callback error Express 5 mein same way handle honge?
- Jawaab — Nahi; returned handler Promise reject forward hota, detached callback ko explicit error ownership/forwarding chahiye.
- Khud try karo — API pipeline test karo; invalid body, rejected route Promise, unknown route aur headers-sent failure par one response/cleanup verify karo.

## Practice questions

### Easy · `req.body` undefined

```js
app.post('/users', createUser);
app.use(express.json());
```

<details>
<summary>Answer</summary>

- Kyun — middleware order mein chalta hai; route body parser se pehle register hua, isliye body parse hi nahi hui.
- Fix — `app.use(express.json({ limit: '100kb' }))` routes se pehle.
- Limit — body size limit DoS se bachata hai.

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

- Kyun — 404 bhejne ke baad function chalta raha aur doosra response bhejne ki koshish ki.
- Fix — `if (!user) return res.status(404).json(...)`.
- Rule — har response ke baad `return`; ek request, ek response.

</details>

### Medium · Async errors aur Express

Express 4 aur Express 5 mein async handler ka rejected promise kaise handle hota hai? Central error handler likho.

<details>
<summary>Answer</summary>

```js
app.get('/orders/:id', async (req, res) => {
  const order = await orders.get(req.params.id); // reject ho sakta hai
  res.json(order);
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) req.log?.error(err);
  res.status(status).json({ error: status >= 500 ? 'Internal error' : err.message });
});
```

- Express 4 — rejected promise error handler tak nahi jaata (request hang/unhandled rejection); `try/catch` + `next(err)` ya wrapper chahiye.
- Express 5 — handler/middleware ka rejected promise automatically `next(err)` ko jaata hai.
- Error handler — 4 arguments zaroori; routes ke baad register.

</details>

### Medium · 404 aur error mapping

Unknown route, validation error, aur DB duplicate key — teeno consistent JSON mein kaise?

<details>
<summary>Answer</summary>

- 404 — saare routes ke baad: `app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND' }))`.
- App errors — `class AppError extends Error { constructor(status, code, message) {...} }`; validation → `400 VALIDATION_FAILED`.
- DB mapping — Mongo `E11000` / Postgres `23505` → `409 CONFLICT`, error handler mein ek jagah.
- Unknown — `500` generic message; details logs mein request id ke saath.

</details>

### Hard · `pg` pool ke saath transaction

```js
await pool.query('BEGIN');
await pool.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amt, from]);
await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amt, to]);
await pool.query('COMMIT');
```

Bug kya hai? Sahi version likho.

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

- Bug — `pool.query` har call par alag connection le sakta hai; `BEGIN` ek connection par, updates doosre par → transaction hi nahi bana.
- `release` finally mein — warna pool leak aur timeouts.
- Parameters `$1` — SQL injection safe.

</details>

## Sources — aur padhne ke liye

- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/02-express-rest-errors.md)
