---
id: js-dom-events-browser
title: DOM events and browser interaction
track: javascript
order: 12
level: Foundation
minutes: 1
summary: DOM — browser ka document tree; selector se node pakdo.
tags: dom, events, delegation, browser, accessibility
---

## Quick revision

- DOM — browser ka document tree; selector se node pakdo.
- `textContent` — plain text set karo; untrusted HTML inject mat karo.
- Event flow — capture → target → bubble.
- Delegation — parent par listener; child ko `closest()` se identify karo.
- `preventDefault` — default action rokta hai; bubbling nahi.
- `stopPropagation` — event propagation rokta hai; default action nahi.
- Cleanup — listener hatane mein same callback aur matching capture option chahiye.
- Debounce — rukne ke baad run; throttle — frequency limit karo.
- Layout thrashing — repeated write/read se forced layout; reads aur writes batch karo.
- Observer — visibility ke liye IntersectionObserver, size ke liye ResizeObserver.
- `target`/`currentTarget` — event ka original target / current listener wala element.
- `classList` — add/remove/toggle se classes manage; poora className overwrite zaroori nahi.
- `once` listener — pehli invocation ke baad automatically remove ho jaata hai.

## Research notes: Own a listener lifecycle

- Related listeners same abort signal share karke together dispose ho sakte hain.

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/12-dom-events-browser.md)
