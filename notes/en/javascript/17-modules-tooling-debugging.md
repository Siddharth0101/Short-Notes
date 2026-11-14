---
id: js-modules-tooling-debugging
title: Modules web delivery and debugging
track: javascript
order: 17
level: Advanced
minutes: 3
summary: ES module — `import`/`export`; imports are live bindings.
tags: modules, tooling, http, debugging, testing, npm
---

## Quick revision

> Revision target — Debug the module boundary, the deployed asset and the route fallback separately; identify the layer of an import error.

- ES module — `import`/`export`; imports are live bindings.
- Module scope — variables do not automatically become global.
- Dynamic import — `import()` returns a Promise; load code when it is needed.
- Bundler — prepares modules/assets into production bundles.
- Tree shaking — can remove unused exports; side effects limit it.
- Lockfile — pins dependency resolution; commit it for reproducible installs.
- Source map — maps built code back to the original source.
- Debugging — reproduce → breakpoint → inspect state → smallest fix.
- Environment — treat any secret sent in the browser bundle as public.
- Deployment — hashed assets get a long cache; plan how the HTML is updated/revalidated.
- Circular import — initialization order matters; reading an uninitialized binding during module load can fail.
- Dependency audit — direct and transitive packages are different; review the lockfile diff.
- Polyfill/transpile — provide a missing runtime API / transform syntax; the two do not do the same job.

### Module loading

- Named/default — a named export must match the imported name; you choose the local name for a default.
- Top-level await — allowed in an ES module; the execution of dependent modules may wait.

### Edge cases and reasoning

- Browser module URL — the server must serve the correct JavaScript MIME type; do not let the HTML fallback become a module response.
- Debug hypotheses — record expected versus actual state; verify one hypothesis with a breakpoint, then make the change.
- Package scripts — document the install/build/test commands and the runtime version; a lockfile alone does not eliminate OS/native dependency differences.

## Research notes: Imports are live read-only bindings

- An imported binding reflects the exporter's updates; the importer cannot reassign the binding.

## Understand it with an example

```js
// counter.js
export let count = 0;
export function increment() { count += 1; }

// main.js (alag file)
import { count, increment } from "./counter.js";
increment();
console.log(count); // 1
```

- Trace — the imported `count` is a live binding; the exporter's update is visible to the reader.
- Catch — the importer cannot reassign the exported binding with `count = 5`; use an exported operation to change it.
- Check — use a module script and served files in the browser; a missing JS URL receiving the HTML fallback is not valid module loading.

## Recall and practice

- Question — A production deep-link reload works, but what happens if a JS asset request receives HTML?
- Answer — The SPA fallback was applied to a resource request; the module fails on MIME type/parse. Distinguish asset serving from the route fallback.
- Try it yourself — Build a small module export/import; diagnose a syntax error, a wrong path and circular initialization in separate reproductions.

## Practice questions

### Easy · Named vs default import

```js
// math.js
export default function sum(a, b) { return a + b; }
// main.js
import { sum } from './math.js';
```

What happens?

<details>
<summary>Answer</summary>

- Result — at module link time, `SyntaxError: ... does not provide an export named 'sum'`; it fails before any code runs.
- Fix — `import sum from './math.js'`, or write `export function sum` and use a named import.
- Team rule — named exports keep names consistent for refactoring/auto-import.

</details>

### Medium · Imports are live and read-only

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

- Log — `1`; an import is a live binding, not a copy.
- `count = 5` — `TypeError: Assignment to constant variable`; the importer cannot change the binding.
- CommonJS difference — `require` gives a copy (snapshot) of the value for primitives.

</details>

### Medium · Load a heavy library only when needed

The Reports page needs a 400 KB chart library. The rest of the app does not. How do you load it, and how do you handle loading/errors?

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

- Dynamic `import()` — the bundler creates a separate chunk; the initial bundle is smaller.
- Prefetch — you can trigger the import when the user hovers "Reports".
- In React — `lazy(() => import(...))` + `Suspense` + an error boundary.

</details>

### Medium · A TDZ crash from a circular import

`a.js` imports `b.js`, and `b.js` uses the `export const config` of `a.js` at the top level. On app start: `ReferenceError: Cannot access 'config' before initialization`. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Why — `b.js` is evaluated before `a.js` is; until then the `config` binding is in the TDZ.
- Fix 1 — move the shared `config` into a third module that imports nothing.
- Fix 2 — do not read it at the top level; read it inside a function that is called later.
- Detect — cycle warnings from the bundler/linter (`import/no-cycle`).

</details>

### Hard · A crash only in production

Everything works locally, but the production build throws `TypeError: Cannot read properties of undefined (reading 'map')` at the minified file `index-a1b2.js:1:20431`. Describe the debugging plan.

<details>
<summary>Answer</summary>

- Reproduce — run the same production bundle locally with `npm run build && npm run preview`.
- Source map — look at the mapped file/line in DevTools (maps can be uploaded privately; they need not be served publicly).
- Hypotheses — a missing env variable (`VITE_API_URL`), a different API response shape in prod, a dependency version difference (`npm ci` + lockfile), tree-shaking removing a side-effect import.
- Narrow — log the failing data, fix the root cause (the contract) rather than patching with a guard, then add a regression test.

</details>

## Sources — further reading

- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/17-modules-tooling-debugging.md)
