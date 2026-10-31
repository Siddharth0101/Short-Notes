---
id: js-modules-tooling-debugging
title: Modules web delivery and debugging
track: javascript
order: 17
level: Advanced
minutes: 3
summary: ES module — `import`/`export`; imports live bindings hote hain.
tags: modules, tooling, http, debugging, testing, npm
---

## Quick revision

> Revision target — Module boundary, deployed asset aur route fallback ko alag debug karo; import error ka layer identify karo.

- ES module — `import`/`export`; imports live bindings hote hain.
- Module scope — variables automatically global nahi bante.
- Dynamic import — `import()` Promise deta hai; zaroorat par code load karo.
- Bundler — modules/assets ko production bundles mein prepare karta hai.
- Tree shaking — unused exports hata sakta hai; side effects limit karte hain.
- Lockfile — dependency resolution pin; reproducible install ke liye commit karo.
- Source map — built code ko original source se map karta hai.
- Debugging — reproduce → breakpoint → state inspect → smallest fix.
- Environment — browser bundle mein bheja secret public samjho.
- Deployment — hashed assets long-cache; HTML update/revalidation sochkar karo.
- Circular import — initialization order matter; module load ke dauran uninitialized binding read fail kar sakti hai.
- Dependency audit — direct aur transitive packages alag; lockfile diff review karo.
- Polyfill/transpile — missing runtime API provide / syntax transform; dono same kaam nahi.

### Module loading

- Named/default — named export ka imported naam match; default ka local naam choose kar sakte ho.
- Top-level await — ES module mein allowed; dependent module execution wait kar sakti hai.

### Edge cases aur reasoning

- Browser module URL — server ko correct JavaScript MIME type serve karna chahiye; HTML fallback ko module response mat banao.
- Debug hypotheses — expected versus actual state record karo; breakpoint se ek hypothesis verify karke change karo.
- Package scripts — install/build/test commands aur runtime version document; lockfile alone OS/native dependency differences eliminate nahi karta.

## Research notes: Imports are live read-only bindings

- Imported binding exporter ke updates reflect karti hai; importer binding reassign nahi kar sakta.

## Example se samjho

```js
// counter.js
export let count = 0;
export function increment() { count += 1; }

// main.js (alag file)
import { count, increment } from "./counter.js";
increment();
console.log(count); // 1
```

- Trace — imported `count` live binding hai; exporter ka update reader ko dikhta hai.
- Catch — importer `count = 5` se exported binding reassign nahi kar sakta; change ke liye exported operation use karo.
- Check — browser mein module script aur served files use karo; missing JS URL ko HTML fallback milna valid module loading nahi.

## Recall aur practice

- Sawal — Production deep-link reload par app chale, lekin JS asset request ko HTML mile toh kya hoga?
- Jawaab — SPA fallback resource request par apply hua; module MIME/parse failure hoga. Asset serving aur route fallback distinguish karo.
- Khud try karo — Small module export/import banao; syntax error, wrong path aur circular initialization ko separate reproductions mein diagnose karo.

## Practice questions

### Easy · Named vs default import

```js
// math.js
export default function sum(a, b) { return a + b; }
// main.js
import { sum } from './math.js';
```

Kya hoga?

<details>
<summary>Answer</summary>

- Result — module link time par `SyntaxError: ... does not provide an export named 'sum'`; code chalne se pehle hi fail.
- Fix — `import sum from './math.js'` ya `export function sum` karke named import.
- Team rule — named exports refactor/auto-import mein consistent naam rakhte hain.

</details>

### Medium · Imports live aur read-only hain

```js
// counter.js
export let count = 0;
export function inc() { count++; }
// main.js
import { count, inc } from './counter.js';
inc();
console.log(count);
count = 5;
```

<details>
<summary>Answer</summary>

- Log — `1`; import ek live binding hai, copy nahi.
- `count = 5` — `TypeError: Assignment to constant variable`; importer binding change nahi kar sakta.
- CommonJS farq — `require` value ki copy (snapshot) deta hai primitives ke liye.

</details>

### Medium · Heavy library sirf zaroorat par load karo

Reports page par 400 KB chart library lagti hai. Baaki app mein nahi. Kaise load karoge aur loading/error kaise handle karoge?

<details>
<summary>Answer</summary>

```js
async function openReports() {
  showSpinner();
  try {
    const { renderChart } = await import('./charts.js');
    renderChart(data);
  } catch {
    showError('Chart load nahi hua, retry karo');
  } finally {
    hideSpinner();
  }
}
```

- Dynamic `import()` — bundler alag chunk banata hai; initial bundle chhota.
- Prefetch — user ke "Reports" hover par import trigger kar sakte ho.
- React mein — `lazy(() => import(...))` + `Suspense` + error boundary.

</details>

### Medium · Circular import ka TDZ crash

`a.js` `b.js` import karta hai aur `b.js` top-level par `a.js` ka `export const config` use karta hai. App start par `ReferenceError: Cannot access 'config' before initialization`. Kyun, aur fix?

<details>
<summary>Answer</summary>

- Kyun — `a.js` evaluate hone se pehle `b.js` evaluate hota hai; tab tak `config` binding TDZ mein hai.
- Fix 1 — shared `config` ko teesre module mein le jao jo kisi ko import na kare.
- Fix 2 — top-level par mat padho; function ke andar padho jo baad mein call ho.
- Detect — bundler/linter (`import/no-cycle`) cycle warnings.

</details>

### Hard · Sirf production mein crash

Local par sab theek, production build mein `TypeError: Cannot read properties of undefined (reading 'map')` minified file `index-a1b2.js:1:20431` par. Debug ka plan batao.

<details>
<summary>Answer</summary>

- Reproduce — locally `npm run build && npm run preview` se same production bundle chalao.
- Source map — DevTools mein mapped file/line dekho (maps private upload ho sakte hain, public serve karna zaroori nahi).
- Hypotheses — env variable missing (`VITE_API_URL`), API ka prod response shape alag, dependency version difference (`npm ci` + lockfile), tree-shaking/side-effect import hata.
- Narrow — failing data log karo, guard ke saath fix nahi balki root cause (contract) fix karo, phir regression test.

</details>

## Sources — aur padhne ke liye

- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/17-modules-tooling-debugging.md)
