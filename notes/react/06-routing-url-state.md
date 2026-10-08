---
id: react-routing-url-state
title: Routing nested layouts and URL state
track: react
order: 6
level: Intermediate
minutes: 3
summary: Router — URL ko screen/layout se map karta hai.
tags: router, url, loaders, navigation, routing
---

## Quick revision

- Router — URL ko screen/layout se map karta hai.
- Path param — resource identity; query param — filters, sort aur page.
- Nested route — shared layout ke andar child route render.
- URL state — shareable/bookmarkable state URL mein rakho.
- Navigation — link use karo; button action ke liye.
- Loader — route data fetch; error/pending handling define karo.
- Protected route — UI guard hai; backend authorization phir bhi chahiye.
- Back/forward — URL se state derive karo, duplicate local copy drift na kare.
- Replace navigation — current history entry replace; push nayi entry banata hai.
- 404 handling — unknown route aur resource-not-found ko useful fallback do.
- URL encoding — user values encode karo; raw text ko path/query mein concatenate mat karo.

### Deep-link modal

- Modal identity — query mein ticket ID; page reload par selected entity server se resolve karo.
- Deleted ticket — deep link valid syntax ho sakta hai but resource missing; useful error/close action.
- Close history — push/replace/back choice define; unrelated query filters preserve karo.

### Edge cases aur reasoning

- Query normalization — invalid page/filter ko validate aur default karo; URL string directly trusted application state nahi.
- Navigation cancellation — route data request obsolete ho toh cancel/ignore; purani screen ka error current route par mat dikhao.
- Unsaved navigation — draft recovery/blocking contract define; browser reload aur internal navigation ke constraints alag test karo.

## Recall aur practice

- Sawal — Page=99 aur only two pages ho toh URL-driven table ka kya behavior hona chahiye?
- Jawaab — Defined policy se clamp/redirect ya valid empty response; controls aur URL contradictory state mein nahi hone chahiye.
- Khud try karo — Filter/page URL state implement karo; direct reload, encoded text, invalid page aur back/forward par same visible results verify karo.

## Sources — aur padhne ke liye

- [React Router Data Mode routing](https://reactrouter.com/start/data/routing)
- [React Router framework routing](https://reactrouter.com/start/framework/routing)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/06-routing-url-state.md)
