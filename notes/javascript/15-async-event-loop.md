---
id: js-async-event-loop
title: Event loop promises and resilient fetching
track: javascript
order: 15
level: Advanced
minutes: 3
summary: Call stack — synchronous functions yahin execute hote hain.
tags: async, promises, event-loop, fetch, cancellation
visual: event-loop
---

## Quick revision

- Call stack — synchronous functions yahin execute hote hain.
- Event loop — stack khali hone par queued work ko chance deta hai.
- Microtasks — Promise callbacks/`queueMicrotask`; checkpoint par queue drain hoti hai.
- Timers — timer task se pehle queued microtasks chal sakti hain.
- Promise — pending se fulfilled ya rejected; settle hone ke baad state fixed.
- `.then` — nayi Promise deta hai; callback ka return chain ko feed karta hai.
- `async` — hamesha Promise return; `await` sirf current async flow suspend karta hai.
- `fetch` — HTTP 404/500 par usually resolve; `response.ok` check karo.
- Abort — `AbortController` se supported operation cancel; late result bhi guard karo.
- Starvation — endless microtasks rendering aur tasks delay kar sakti hain.
- Promise executor — `new Promise` ka executor synchronously run hota hai.
- Rejected chain — catch se normal value return karo toh chain fulfilled ho sakti hai.
- Finally — cleanup ke liye; throw/rejected Promise original outcome replace kar sakti hai.

### Browser scheduling

- Animation — `requestAnimationFrame` repaint se pehle work schedule karta hai.

### Edge cases aur reasoning

- Await continuation — already fulfilled Promise await karne par bhi following async code later microtask mein resume hota hai.
- Response body — response.json async aur fail ho sakta hai; HTTP success se valid application schema prove nahi hota.
- Request outcome — client abort se server-side write rollback guaranteed nahi; uncertain write ko idempotency/reconciliation se handle karo.

## Recall aur practice

- Sawal — Sync log, Promise.then aur setTimeout(...,0) ka simple browser snippet order kya hoga?
- Jawaab — Current synchronous code pehle, queued promise microtask phir, timer task baad; unrelated task sources ka universal order assume mat karo.
- Khud try karo — A/B/C log trace banao; fetch helper mein non-2xx, malformed JSON aur abort ko distinct failures ke roop mein verify karo.

## Sources — aur padhne ke liye

- [MDN using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/15-async-event-loop.md)
