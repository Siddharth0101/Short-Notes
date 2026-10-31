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

> Revision target — Sync work, queued microtasks aur timer tasks ka order predict karo; fetching failure ko separately handle karo.

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

## Example se samjho

```js
console.log("A");
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("B");
// Is simple browser example mein: A B C D
```

- Trace — current script finish hoti hai, queued promise callback chalti hai, phir timer task ka turn aata hai.
- Catch — zero delay exact execution time nahi; busy stack aur scheduling timer ko delay kar sakte hain.
- Check — promise callback ke andar heavy loop daalo toh timer late hoga; async label CPU work ko parallel nahi banata.

## Recall aur practice

- Sawal — Sync log, Promise.then aur setTimeout(...,0) ka simple browser snippet order kya hoga?
- Jawaab — Current synchronous code pehle, queued promise microtask phir, timer task baad; unrelated task sources ka universal order assume mat karo.
- Khud try karo — A/B/C log trace banao; fetch helper mein non-2xx, malformed JSON aur abort ko distinct failures ke roop mein verify karo.

## Practice questions

### Easy · Event loop order

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

<details>
<summary>Answer</summary>

- Output — `A D C B`.
- Sync code pehle — `A`, `D`.
- Microtasks (promise callbacks) har task ke baad poore drain hote hain → `C`.
- Timer callback agla task hai → `B`.

</details>

### Medium · `await` ke baad kya hota hai?

```js
async function f() {
  console.log(1);
  await null;
  console.log(2);
}
console.log(3);
f();
console.log(4);
```

<details>
<summary>Answer</summary>

- Output — `3 1 4 2`.
- `async` function — pehle `await` tak synchronous chalta hai.
- `await` — baaki body microtask mein schedule hoti hai; caller ka `console.log(4)` pehle chalta hai.

</details>

### Medium · Promise executor ka behaviour

```js
const p = new Promise((resolve) => {
  console.log('executor');
  resolve(1);
  resolve(2);
  console.log('after resolve');
});
p.then((v) => console.log('then', v));
console.log('sync end');
```

<details>
<summary>Answer</summary>

- Output — `executor`, `after resolve`, `sync end`, `then 1`.
- Executor — turant synchronously chalta hai.
- Settle once — pehla `resolve(1)` jeetta hai; baad wale ignore. `resolve` function ko exit nahi karta.

</details>

### Medium · `fetch` ka error handling

```js
try {
  const res = await fetch('/api/user');
  const user = await res.json();
  render(user);
} catch {
  showError();
}
```

404 ya 500 par kya hoga? Sahi version likho.

<details>
<summary>Answer</summary>

- Problem — `fetch` sirf network failure/abort par reject karta hai; 404/500 bhi resolve hote hain. Error page HTML ho toh `res.json()` parse error deta hai, warna error body `render` ho jaati hai.
- Fix:

```js
const res = await fetch('/api/user');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const user = await res.json();
```

- UX — status ke hisaab se message (401 → login, 404 → not found, 5xx → retry).

</details>

### Hard · Timeout ke saath abortable `fetchJSON`

`fetchJSON(url, { timeoutMs, signal })` likho: timeout par request abort ho, caller ka signal bhi respect ho, aur HTTP errors alag dikhein.

<details>
<summary>Answer</summary>

```js
async function fetchJSON(url, { timeoutMs = 8000, signal } = {}) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const res = await fetch(url, { signal: combined });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

- Abort — real request cancel hoti hai, sirf promise race nahi.
- Errors — timeout par `TimeoutError`, caller abort par `AbortError` (DOMException `name`); UI dono ko alag treat kar sakti hai.
- Older runtime — `AbortController` + `setTimeout` + `finally { clearTimeout }` se same pattern.

</details>

## Sources — aur padhne ke liye

- [MDN using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/15-async-event-loop.md)
