---
id: js-async-event-loop
title: Event loop promises and resilient fetching
track: javascript
order: 15
level: Advanced
minutes: 1
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

## Sources — aur padhne ke liye

- [MDN using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/15-async-event-loop.md)
