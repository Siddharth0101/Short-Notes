---
id: js-modules-tooling-debugging
title: Modules web delivery and debugging
track: javascript
order: 17
level: Advanced
minutes: 1
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

## Research notes: Imports are live read-only bindings

- Imported binding exporter ke updates reflect karti hai; importer binding reassign nahi kar sakta.

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/17-modules-tooling-debugging.md)
