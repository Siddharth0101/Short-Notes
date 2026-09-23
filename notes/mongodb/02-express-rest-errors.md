---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 1
summary: Express — routing aur middleware ka HTTP framework.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Quick revision

- Express — routing aur middleware ka HTTP framework.
- Middleware — order matters; response bhejo ya `next()` se control do.
- Route — method + path + handler; input ki type/range validate karo.
- Express 5 — returned rejected Promise error flow mein jaati hai; detached async work alag handle karo.
- Error handler — `(err, req, res, next)`; routes ke baad register karo.
- Double response — send ke baad execution/control flow rokna ya return karna socho.
- REST — resource URL, consistent methods/status aur bounded pagination.
- Error response — safe message/code; stack trace client ko nahi.

## Research notes: Return the promise that owns the request

- Express 5 returned handler promise ki rejection forward karta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — Express](https://expressjs.com/en/guide/error-handling/)
- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/02-express-rest-errors.md)
