---
id: js-dom-events-browser
title: DOM events and browser interaction
track: javascript
order: 12
level: Foundation
minutes: 4
summary: DOM — browser ka document tree; selector se node pakdo.
tags: dom, events, delegation, browser, accessibility
---

## Quick revision

> Revision target — Event ka actual target, delegation boundary aur listener cleanup ko ek interaction mein trace karo.

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

### DOM aur native events

- Attributes — element ki extra settings; DOM properties live state represent kar sakti hain.
- Events — addEventListener; target clicked node, currentTarget current listener ka node.
- Drag/drop — drag data transfer; keyboard/touch alternative bhi do.
- data-* — custom attributes; dataset se string values access.

### DOM updates

- `querySelector` — first match ya null; querySelectorAll static NodeList deta hai.
- Node update — createElement/append/remove se tree badlo; text ke liye textContent use karo.
- `dataset` — data-* values strings hoti hain; numeric/boolean conversion validate karo.
- `DOMContentLoaded`/`load` — DOM parsing/deferred scripts ready / dependent load resources complete.

### Edge cases aur reasoning

- Delegation containment — closest match milne ke baad intended parent ke andar hona check; nested widgets ke actions mix mat karo.
- Passive listener — passive:true ke saath preventDefault effective nahi; cancelable interaction ka listener contract choose karo.
- Stop immediate — stopImmediatePropagation current target ke remaining listeners bhi rokta hai; stopPropagation unhe necessarily nahi rokta.

## Research notes: Own a listener lifecycle

- Related listeners same abort signal share karke together dispose ho sakte hain.

## Example se samjho

```js
const list = document.querySelector("#tasks");
function onClick(event) {
  const button = event.target.closest("button[data-id]");
  if (!button || !list.contains(button)) return;
  console.log(button.dataset.id);
}
list.addEventListener("click", onClick);
// List owner dispose ho toh:
// list.removeEventListener("click", onClick);
```

- Setup — snippet existing `#tasks` element aur element-originated click assume karta hai; missing container ko app initialization mein handle karo.
- Trace — button ke nested icon par click bhi `closest` se intended action tak pahunchta hai.
- Catch — cleanup ko wahi callback reference chahiye; har setup mein naya anonymous function laga kar purana remove nahi hoga.

## Recall aur practice

- Sawal — Parent listener mein clicked button ke andar icon ho toh event.target kya ho sakta hai?
- Jawaab — Icon node; target.closest("button") se button resolve karo aur delegation boundary verify karo.
- Khud try karo — Dynamic todo list ka single parent listener banao; icon click, new item, outside target aur dispose ke baad no action verify karo.

## Practice questions

### Easy · `innerHTML` vs `textContent`

```js
const name = '<img src=x onerror="alert(1)">';
greeting.innerHTML = `Hi ${name}`;
```

Problem kya hai?

<details>
<summary>Answer</summary>

- XSS — `innerHTML` string ko HTML parse karta hai; `onerror` handler user ka code chala deta hai.
- Fix — `greeting.textContent = \`Hi ${name}\``; text hamesha text rehta hai.
- HTML zaroori ho — trusted template ya sanitizer (jaise DOMPurify) use karo.

</details>

### Easy · `target` vs `currentTarget`

`<ul id="list">` par click listener hai. User `<li><button><span>Delete</span></button></li>` ke `span` par click karta hai. `event.target` aur `event.currentTarget` kya honge?

<details>
<summary>Answer</summary>

- `target` — `span` (jahan click hua).
- `currentTarget` — `ul` (jis par listener laga hai).
- Delegation — `const button = event.target.closest('button'); if (!button || !list.contains(button)) return;`.

</details>

### Medium · Capture aur bubble ka order

```js
parent.addEventListener('click', () => log('parent capture'), true);
parent.addEventListener('click', () => log('parent bubble'));
child.addEventListener('click', (event) => {
  log('child');
  event.stopPropagation();
});
```

Child par click karne par kya log hoga?

<details>
<summary>Answer</summary>

- Output — `parent capture`, `child`.
- Flow — capture phase (window → target), target, phir bubble (target → window).
- `stopPropagation` — aage ka bubble rokta hai; capture already chal chuka tha. Same element ke baaki listeners rokne ke liye `stopImmediatePropagation`.

</details>

### Medium · `debounce` likho

Search input ke liye `debounce(fn, wait)` banao: last input ke `wait` ms baad hi call ho, latest arguments ke saath; `cancel()` bhi do.

<details>
<summary>Answer</summary>

```js
function debounce(fn, wait) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
```

- Trailing — har keystroke purana timer cancel karta hai; sirf aakhri bachta hai.
- Cleanup — component/page unmount par `cancel()` call karo, warna stale call chal sakti hai.
- Debounce vs throttle — debounce "ruk jaane ke baad", throttle "har X ms mein max ek baar".

</details>

### Hard · Layout thrashing fix karo

```js
for (const box of boxes) {
  const height = box.offsetHeight;      // read
  box.style.height = `${height * 2}px`; // write
}
```

1000 boxes par yeh slow kyun hai? Fix likho.

<details>
<summary>Answer</summary>

- Cause — har write layout ko dirty karta hai; agla `offsetHeight` read forced synchronous layout karata hai → 1000 baar reflow.
- Fix — pehle saare reads, phir saare writes:

```js
const heights = boxes.map((box) => box.offsetHeight);
requestAnimationFrame(() => {
  boxes.forEach((box, i) => { box.style.height = `${heights[i] * 2}px`; });
});
```

- Verify — DevTools Performance mein "Forced reflow" warnings aur Layout events count kam hone chahiye.
- Related — scroll/touch listeners ko `{ passive: true }` do agar `preventDefault` nahi karna.

</details>

## Sources — aur padhne ke liye

- [MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/12-dom-events-browser.md)
