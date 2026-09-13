---
id: js-modules-tooling-debugging
title: Modules web delivery and debugging
track: javascript
order: 17
level: Advanced
minutes: 26
summary: Modules, HTTP delivery, build tools, debugging aur test boundaries ko connect karo.
tags: modules, tooling, http, debugging, testing, npm
---

## Mental model

Source code authoring format hai; browser tak delivered code build aur network pipeline se guzarta hai. Module dependency graph define karta hai ki kaunsa code kis par depend karta hai. Bundler files combine/split karta hai, transpiler syntax transform karta hai, aur polyfill missing runtime behavior provide karta hai. In teen responsibilities ko interchangeable mat samjho.

> **Core takeaway:** Module boundaries make dependencies explicit; delivery failures still need a reproducible diagnosis.

## Small module boundary

```js
// pricing.js
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

```js
// app.js — loaded with <script type="module" src="app.js"></script>
import { subtotal } from "./pricing.js";
console.log(subtotal([{ price: 150, quantity: 2 }])); // 300

async function openChart() {
  const { renderChart } = await import("./chart.js");
  renderChart();
}
```

ES modules strict mode mein run hote hain aur exports live bindings hote hain. Static imports dependency graph ko build tools ke liye analyzable banate hain. Dynamic import promise return karta hai aur optional feature ko later load karne ka boundary deta hai. CommonJS mein require/module.exports pattern hai; Node mein package type aur extensions interpretation affect karte hain. Different module systems ko blindly mix karne se default/named export interop surprises aa sakte hain.

## How a page arrives

URL se browser host identify karta hai, DNS resolution karta hai, connection establish karta hai aur HTTP request bhejta hai. HTTPS transport encryption aur server authentication add karta hai. Cache aur reused connections kuch steps avoid kar sakte hain; har request fresh DNS/TLS handshake nahi karti. HTTP/1.1 aur HTTP/2 typically TCP use karte hain; HTTP/3 QUIC use karta hai. Response status, headers aur body ke roles alag hain.

Browser HTML parse karke DOM, CSS se styles, aur layout/paint se pixels banata hai. Render-blocking assets aur JavaScript long tasks perceived speed affect karte hain. Source maps transformed code ko original source se map karke debugging help karte hain. Public source maps mein sensitive source exposure ki policy separately decide karo; secrets frontend bundle mein kabhi safe nahi hote.

## Environment config and code-splitting

```js
// build-tool style env access (e.g. Vite)
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// route-based split
const routes = [
  { path: "/reports", component: () => import("./pages/Reports.js") }
];
```

Build tool environment variables ko compile time par bundle mein inject karta hai; sirf public config (base URL jaisa) client env mein rakho, kyunki client-exposed prefix wali variable final bundle mein plaintext readable ho jaati hai. Route-based dynamic import se initial bundle chhota rehta hai; user jab specific page visit kare tabhi uska code network se load ho.

## Debug systematically

Reproduction ko minimum steps tak reduce karo. Expected versus actual value identify karo. Breakpoint lagao, call stack inspect karo, scope variables dekho, phir first incorrect state transition locate karo. Network tab se status, payload aur timing check karo. Console logs helpful hain, lekin random logs add karte rehna hypothesis ka replacement nahi hai.

```js
function processOrders(orders) {
  for (const order of orders) {
    // conditional breakpoint here: order.total < 0
    applyDiscount(order);
  }
}
```

Conditional breakpoint sirf tab pause karta hai jab expression true ho — hundred iterations manually step-through karne se better hai jab bug ek specific record par hi hoti ho. `debugger;` statement code mein temporarily insert karke bhi similar effect milta hai, lekin commit se pehle usko remove karna mat bhoolo.

## Gotchas

Lockfile commit karne se dependency resolution reproducible hota hai; runtime version bhi document karo. Minification size reduce karti hai, code correctness prove nahi karti. Tree shaking side effects aur static analysis par depend karti hai; unused export hona zero bytes ki universal guarantee nahi hai. Linting suspicious patterns identify karti hai; integration behavior ke liye meaningful tests chahiye.

## Common mistakes

- **Wrong assumption:** `.env` file mein secret key daalne se woh client-side bundle mein safe rehti hai. **Why it breaks:** Build tool jo bhi variable prefix-match karke inject karta hai (jaise `VITE_` ya `NEXT_PUBLIC_`) woh final JS bundle mein plaintext embed ho jaata hai, browser DevTools se directly readable. **Fix:** Secrets sirf server-side environment mein rakho; client ko sirf public config (jaise base URL) bhejo.
- **Wrong assumption:** Dynamic `import()` se split kiya gaya code automatically preloaded rehta hai jab tak user use na kare. **Why it breaks:** Browser sirf tab visit karne par network request trigger karta hai; slow network par first time us feature ko open karna visible delay dikha sakta hai. **Fix:** Predictable next-step routes ko hover/idle time par explicitly prefetch karo.
- **Wrong assumption:** Minified production build mein error stack trace directly readable hoga. **Why it breaks:** Minifier variable names aur line numbers change kar deta hai, isliye raw stack trace almost meaningless ho jaata hai. **Fix:** Source maps generate karke error-tracking tool ya DevTools ko do taaki original source line dikhe.

Real app mein yeh exactly wahi decisions hain jo production React/Node app deploy karte waqt lagte hain — public vs secret env vars, route-level code splitting aur error-monitoring setup, sab isi foundation par based hain.

## Practice

Pricing logic ko pure module mein extract karo. Empty cart aur zero quantity test karo. Chart ko dynamic import se load karo aur network panel mein initial versus on-demand requests compare karo. Deliberately wrong import path add karke console aur network error relate karo.

## Interview questions

**Q. Babel Promise API add kar deta hai?** Syntax transformation aur runtime API support alag hain; target environment aur polyfill strategy verify karo.

**Q. Unit test aur integration test ka difference?** Unit isolated rule verify karta hai; integration connected boundaries, jaise route plus database, ka actual behavior verify karta hai.

## Capstone: resilient search client

Build a browser search module with a pure result formatter, a request adapter, and a DOM controller. Keep cancellation and rendering ownership in the controller. Use a fake adapter whose response order you control before connecting a real API.

### Acceptance criteria

- Typing `a`, then `ab`, with responses arriving in reverse order renders only `ab`.
- An empty query clears results and cancels pending work. A network failure has a retry action; cancellation does not display an error.
- Mounting and disposing the widget twenty times leaves no extra listeners or active timers.
- Render untrusted result titles as text. Include loading, empty, and error states.
- Demonstrate a CPU-heavy transformation and measure the effect of moving it to a worker or yielding in bounded chunks.

### Interview defense

Explain the lifetime of every closure and resource, draw the request timeline, and distinguish debouncing from cancellation and concurrency control. A strong submission includes a deterministic race reproduction and a module boundary that allows the network to be replaced in tests. Stretch task: add a bounded cache and specify invalidation instead of caching indefinitely.

## Research notes: Imports are live read-only bindings

An imported binding reflects exporter updates. Importers cannot assign a replacement to that binding. Cycles are not automatically invalid, but reading an uninitialized binding can fail.

```js
// score.mjs
export let score = 0;
export function award() { score += 2; }

// main.mjs
import { score, award } from './score.mjs';
const before = score;
award();
console.log(before, score); // 0, 2
```

Draw evaluation dependencies when debugging a cycle. Move shared pure logic to a lower-level module if it removes the cycle.

**Interview check:** Why does before remain zero when score changes?

**Answer:** Assigning the current numeric value to a local constant creates a snapshot. It does not create another live import binding.

**Practice:** Call award twice and trace the exporter and importer values.

[Read the source — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A lazy-loaded screen fails only after deployment while existing screens work. Write the first three checks and a user recovery path.

> **Hint:** Inspect the failing chunk request before changing component logic.

**Answer guide — compare after attempting:** Check the chunk URL/status, whether deployed HTML references available assets, and caching behavior across releases. Retain compatible assets or coordinate cache invalidation. Offer a deliberate reload/retry path with draft preservation where relevant; do not create an infinite automatic reload loop.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources
[MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module semantics explain karta hai. [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) web delivery ka reference hai.
