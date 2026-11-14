---
id: js-dom-events-browser
title: DOM events and browser interaction
track: javascript
order: 12
level: Foundation
minutes: 4
summary: DOM — the browser's document tree; grab a node with a selector.
tags: dom, events, delegation, browser, accessibility
visual: debounce-throttle
---

## Quick revision

> Revision target — Trace an event's actual target, the delegation boundary and listener cleanup through one interaction.

- DOM — the browser's document tree; grab a node with a selector.
- `textContent` — set plain text; do not inject untrusted HTML.
- Event flow — capture → target → bubble.
- Delegation — a listener on the parent; identify the child with `closest()`.
- `preventDefault` — stops the default action; not the bubbling.
- `stopPropagation` — stops event propagation; not the default action.
- Cleanup — removing a listener needs the same callback and a matching capture option.
- Debounce — run after things go quiet; throttle — limit the frequency.
- Layout thrashing — repeated write/read forces layout; batch the reads and the writes.
- Observer — IntersectionObserver for visibility, ResizeObserver for size.
- `target`/`currentTarget` — the event's original target / the element that owns the current listener.
- `classList` — manage classes with add/remove/toggle; there is no need to overwrite the whole className.
- `once` listener — is removed automatically after its first invocation.

### DOM and native events

- Attributes — extra settings of an element; DOM properties can represent live state.
- Events — addEventListener; target is the clicked node, currentTarget the node of the current listener.
- Drag/drop — drag data transfer; provide a keyboard/touch alternative too.
- data-* — custom attributes; access the string values through dataset.

### DOM updates

- `querySelector` — the first match or null; querySelectorAll returns a static NodeList.
- Node update — change the tree with createElement/append/remove; use textContent for text.
- `dataset` — data-* values are strings; validate numeric/boolean conversion.
- `DOMContentLoaded`/`load` — DOM parsing/deferred scripts ready / dependent load resources complete.

### Edge cases and reasoning

- Delegation containment — after closest finds a match, check that it is inside the intended parent; do not mix the actions of nested widgets.
- Passive listener — with passive:true, preventDefault has no effect; choose the listener contract for a cancelable interaction.
- Stop immediate — stopImmediatePropagation also stops the remaining listeners on the current target; stopPropagation does not necessarily stop them.

## Research notes: Own a listener lifecycle

- Related listeners can share one abort signal and be disposed together.

## Understand it with an example

```js
const list = document.querySelector("#tasks");
function onClick(event) {
  const button = event.target.closest("button[data-id]");
  if (!button || !list.contains(button)) return;
  console.log(button.dataset.id);
}
list.addEventListener("click", onClick);
// When the list owner is disposed:
// list.removeEventListener("click", onClick);
```

- Setup — the snippet assumes an existing `#tasks` element and a click that originates from an element; handle a missing container in app initialization.
- Trace — a click on the icon nested in the button still reaches the intended action through `closest`.
- Catch — cleanup needs the same callback reference; adding a new anonymous function in every setup will not remove the old one.

## Recall and practice

- Question — In a parent listener, if the clicked button contains an icon, what can event.target be?
- Answer — The icon node; resolve the button with target.closest("button") and verify the delegation boundary.
- Try it yourself — Build a single parent listener for a dynamic todo list; verify an icon click, a new item, an outside target and no action after dispose.

## Practice questions

### Easy · `innerHTML` vs `textContent`

```js
const name = '<img src=x onerror="alert(1)">';
greeting.innerHTML = `Hi ${name}`;
```

What is the problem?

<details>
<summary>Answer</summary>

- XSS — `innerHTML` parses the string as HTML; the `onerror` handler runs the user's code.
- Fix — `greeting.textContent = \`Hi ${name}\``; text always stays text.
- If HTML is required — use a trusted template or a sanitizer (such as DOMPurify).

</details>

### Easy · `target` vs `currentTarget`

There is a click listener on `<ul id="list">`. The user clicks the `span` of `<li><button><span>Delete</span></button></li>`. What are `event.target` and `event.currentTarget`?

<details>
<summary>Answer</summary>

- `target` — the `span` (where the click happened).
- `currentTarget` — the `ul` (where the listener is attached).
- Delegation — `const button = event.target.closest('button'); if (!button || !list.contains(button)) return;`.

</details>

### Medium · The order of capture and bubble

```js
parent.addEventListener('click', () => log('parent capture'), true);
parent.addEventListener('click', () => log('parent bubble'));
child.addEventListener('click', (event) => {
  log('child');
  event.stopPropagation();
});
```

What is logged when the child is clicked?

<details>
<summary>Answer</summary>

- Output — `parent capture`, `child`.
- Flow — capture phase (window → target), target, then bubble (target → window).
- `stopPropagation` — stops the bubble that follows; capture had already run. Use `stopImmediatePropagation` to stop the other listeners on the same element.

</details>

### Medium · Write `debounce`

Build `debounce(fn, wait)` for a search input: it is called only `wait` ms after the last input, with the latest arguments; provide `cancel()` too.

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

- Trailing — every keystroke cancels the old timer; only the last one survives.
- Cleanup — call `cancel()` when the component/page unmounts, or a stale call can run.
- Debounce vs throttle — debounce is "after it stops", throttle is "at most once every X ms".

</details>

### Hard · Fix layout thrashing

```js
for (const box of boxes) {
  const height = box.offsetHeight;      // read
  box.style.height = `${height * 2}px`; // write
}
```

Why is this slow for 1000 boxes? Write the fix.

<details>
<summary>Answer</summary>

- Cause — every write dirties the layout; the next `offsetHeight` read forces a synchronous layout → 1000 reflows.
- Fix — all reads first, then all writes:

```js
const heights = boxes.map((box) => box.offsetHeight);
requestAnimationFrame(() => {
  boxes.forEach((box, i) => { box.style.height = `${heights[i] * 2}px`; });
});
```

- Verify — in DevTools Performance, the "Forced reflow" warnings and the count of Layout events should drop.
- Related — give scroll/touch listeners `{ passive: true }` if they do not call `preventDefault`.

</details>

## Sources — further reading

- [MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/12-dom-events-browser.md)
