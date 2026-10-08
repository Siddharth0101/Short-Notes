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

## Recall aur practice

- Sawal — Production deep-link reload par app chale, lekin JS asset request ko HTML mile toh kya hoga?
- Jawaab — SPA fallback resource request par apply hua; module MIME/parse failure hoga. Asset serving aur route fallback distinguish karo.
- Khud try karo — Small module export/import banao; syntax error, wrong path aur circular initialization ko separate reproductions mein diagnose karo.

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/17-modules-tooling-debugging.md)
