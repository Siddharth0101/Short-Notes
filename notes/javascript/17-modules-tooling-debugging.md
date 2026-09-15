---
id: js-modules-tooling-debugging
title: Modules web delivery and debugging
track: javascript
order: 17
level: Advanced
minutes: 29
summary: Modules dependencies clear banate hain; delivery fail ho toh reproducible diagnosis phir bhi chahiye.
tags: modules, tooling, http, debugging, testing, npm
---

## Mental model — simple soch

Source code authoring format hai; browser tak delivered code build aur network pipeline se guzarta hai. Module dependency graph define karta hai ki kaunsa code kis par depend karta hai. Bundler files combine/split karta hai, transpiler syntax transform karta hai, aur polyfill missing runtime behavior provide karta hai. In teen responsibilities ko interchangeable mat samjho.

> **Core takeaway:** Modules dependencies clear banate hain; delivery fail ho toh reproducible diagnosis phir bhi chahiye.

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

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `.env` file mein secret key daalne se woh client-side bundle mein safe rehti hai. **Why it breaks:** Build tool jo bhi variable prefix-match karke inject karta hai (jaise `VITE_` ya `NEXT_PUBLIC_`) woh final JS bundle mein plaintext embed ho jaata hai, browser DevTools se directly readable. **Fix:** Secrets sirf server-side environment mein rakho; client ko sirf public config (jaise base URL) bhejo.
- **Wrong assumption:** Dynamic `import()` se split kiya gaya code automatically preloaded rehta hai jab tak user use na kare. **Why it breaks:** Browser sirf tab visit karne par network request trigger karta hai; slow network par first time us feature ko open karna visible delay dikha sakta hai. **Fix:** Predictable next-step routes ko hover/idle time par explicitly prefetch karo.
- **Wrong assumption:** Minified production build mein error stack trace directly readable hoga. **Why it breaks:** Minifier variable names aur line numbers change kar deta hai, isliye raw stack trace almost meaningless ho jaata hai. **Fix:** Source maps generate karke error-tracking tool ya DevTools ko do taaki original source line dikhe.

Real app mein yeh exactly wahi decisions hain jo production React/Node app deploy karte waqt lagte hain — public vs secret env vars, route-level code splitting aur error-monitoring setup, sab isi foundation par based hain.

## Practice

Pricing logic ko pure module mein extract karo. Empty cart aur zero quantity test karo. Chart ko dynamic import se load karo aur network panel mein initial versus on-demand requests compare karo. Deliberately wrong import path add karke console aur network error relate karo.

## Interview questions — bolkar practice karo

**Q. Babel Promise API add kar deta hai?** Syntax transformation aur runtime API support alag hain; target environment aur polyfill strategy verify karo.

**Q. Unit test aur integration test ka difference?** Unit isolated rule verify karta hai; integration connected boundaries, jaise route plus database, ka actual behavior verify karta hai.

## Capstone: resilient search client

Browser search module banao: pure formatter, request adapter aur DOM controller. Cancellation/rendering controller own kare. Real API se pehle response order control karne wala fake adapter lo.

### Acceptance criteria

- `a` phir `ab` type karo; reverse responses par sirf ab render ho.
- Empty query results clear aur pending work cancel kare. Network error par retry mile; cancellation ko error mat dikhao.
- Widget twenty times mount/dispose karke extra listeners/timers na bachne do.
- Untrusted titles text ke roop mein render karo; loading/empty/error states do.
- CPU-heavy transformation measure karo; worker ya bounded chunks mein yield karne ke baad compare karo.

### Interview defense

Har closure/resource ki lifetime explain karo, request timeline draw karo, debounce/cancellation/concurrency ka difference batao. Deterministic race reproduction aur replaceable network boundary do. Stretch: bounded cache add karke invalidation define karo; indefinitely cache mat karo.

## Research notes: Imports are live read-only bindings

Imported binding exporter ke updates reflect karti hai; importer binding reassign nahi kar sakta. Cycles automatically invalid nahi, lekin uninitialized binding read fail ho sakti hai.

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

Cycle debug karte waqt evaluation dependencies draw karo. Shared pure logic lower-level module mein move karke cycle remove ho sakti hai.

**Interview check:** score badalne par bhi before zero kyun rehta hai?

**Answer:** Current numeric value local constant mein assign karne se snapshot banta hai; doosri live import binding nahi.

**Practice:** award do baar call karke exporter/importer values trace karo.

[Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Import graph ko startup aur ownership ke lens se dekho

A module B import karta hai, B C import karta hai: source files alag hone se runtime order random nahi hota. Top-level side effect import par execute ho sakta hai. Utility module import karte hi HTTP server start karna tests aur reuse ko difficult banata hai; configuration/create/start boundaries separate rakho.

ES module imported binding live hoti hai, importer usse reassign nahi kar sakta. Circular imports mein dependency abhi initialize na hui ho toh access fail ho sakta hai. Cycle ko “bundler fix kar dega” assume karne ke bajay shared contract extract karo ya initialization direction clear karo.

Dev server success production delivery prove nahi karta. Build output, base path, case-sensitive filenames aur dynamically loaded chunk URL deployment par differ kar sakte hain. Source map minified stack ko source location se map karne mein help karti hai; public map exposure project policy se decide karo.

**Debug workflow:** Reproduce → smallest failing input → expected/actual → responsible layer → one change → regression check. Console logs mein credentials mat dump karo; network status, safe IDs aur error category enough evidence de sakte hain. Clean-install/build check hidden local dependency pakad sakta hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Lazy-loaded screen sirf deployment ke baad fail hoti hai, baaki screens chalti hain. First teen checks aur user recovery path likho.

> **Hint — chhota ishara:** Component logic badalne se pehle failed chunk ki network request dekho.

**Answer guide — pehle khud karo, phir compare karo:** Chunk URL/status, HTML ke referenced assets ki availability aur releases ke across caching check karo. Compatible assets retain karo ya cache invalidation coordinate karo. Relevant drafts bachakar deliberate reload/retry do; infinite auto-reload loop mat banao.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye
[MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module semantics explain karta hai. [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) web delivery ka reference hai.

## Is concept ko aur practice karo

- [Testing aur debugging — bug ko repeatable proof banao](18-testing-workflow.md)

## Related extension — aur samjho

- [Git workflow — working tree se reviewed commit tak](20-git-workflow.md)
