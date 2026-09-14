---
id: js-dom-events-browser
title: DOM events and browser interaction
track: javascript
order: 12
level: Foundation
minutes: 23
summary: Event delegation stable ancestor par events handle karta hai; actual target button ke andar ka icon bhi ho sakta hai.
tags: dom, events, delegation, browser, accessibility
---

## Mental model — simple soch

HTML document browser mein object tree ban jaata hai jise DOM kehte hain. JavaScript tree ko query aur update kar sakta hai. Event ek interaction ka record hai jo capture, target aur bubble phases se travel kar sakta hai. DOM structure aur event path ko alag socho: clicked icon event target ho sakta hai, lekin action button ka hai.

> **Core takeaway:** Event delegation stable ancestor par events handle karta hai; actual target button ke andar ka icon bhi ho sakta hai.

## Delegate list actions

```html
<ul id="topics">
  <li><button data-topic="closures">Read closures</button></li>
  <li><button data-topic="promises">Read promises</button></li>
</ul>
<p id="selection" role="status"></p>
```

```js
const list = document.querySelector("#topics");
const output = document.querySelector("#selection");
const controller = new AbortController();

list.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-topic]");
  if (!button || !list.contains(button)) return;
  output.textContent = `Selected ${button.dataset.topic}`;
}, { signal: controller.signal });

// Call when this view is removed:
// controller.abort();
```

Single parent listener later inserted buttons ke liye bhi kaam karega. `target` interaction origin hai; `currentTarget` current listener wala node hai. `closest` nested icon/span click ko correct button tak resolve karta hai. Containment check accidentally outside matched ancestor use hone se bachata hai.

## DOM operations and layout

`querySelector` first match ya null deta hai; `querySelectorAll` static NodeList deta hai. Kuch APIs live collections deti hain, isliye mutate karte waqt iteration behavior check karo. `textContent` plain text ke liye use karo. Untrusted text ko innerHTML mein daalne se injection ho sakta hai; HTML genuinely chahiye to trusted rendering/sanitization boundary define karo.

Classes toggle karke styling express karo. Layout measure karna, style write karna, phir repeatedly measure karna forced layout work create kar sakta hai. Reads ko batch karo, writes ko batch karo. Animation scheduling ke liye requestAnimationFrame browser rendering cadence follow karta hai; timer exact frame scheduler nahi hai.

IntersectionObserver element ki viewport/root intersection asynchronously observe karta hai. Lazy loading, reveal effects aur active-section tracking ke liye useful hai. ResizeObserver element size changes observe karta hai. Dono ko unused view remove hone par disconnect karo.

## Custom events for decoupled components

```js
const cartUpdated = new CustomEvent("cart:updated", {
  detail: { itemCount: 3 },
  bubbles: true
});
document.querySelector("#cart-icon").dispatchEvent(cartUpdated);

document.addEventListener("cart:updated", event => {
  console.log(`Cart now has ${event.detail.itemCount} items`);
});
```

Custom event ek component ko doosre se directly coupled kiye bina communicate karne deta hai — jaise "add to cart" button dusre header badge ko update trigger kare bina uska reference rakhe. `detail` property arbitrary payload carry karta hai; `bubbles: true` na do to koi delegated ancestor listener us event ko catch nahi karega.

Accessible form validation isi propagation model par build hoti hai:

```html
<form id="signup" novalidate>
  <input name="email" type="email" required />
  <p id="email-error" role="alert"></p>
</form>
```

```js
const form = document.querySelector("#signup");
form.addEventListener("submit", event => {
  event.preventDefault();
  const email = form.email.value.trim();
  const error = document.querySelector("#email-error");
  if (!email.includes("@")) {
    error.textContent = "Enter a valid email";
    form.email.focus();
    return;
  }
  error.textContent = "";
  // submit via fetch here
});
```

`role="alert"` screen reader ko error text immediately announce karwata hai. `novalidate` browser ka native bubble UI disable karta hai taaki custom error styling consistent rahe — iska matlab yeh nahi ki server-side validation skip ho jaaye.

## Gotchas

`preventDefault()` browser default action cancel karta hai; propagation automatically stop nahi karta. `stopPropagation()` event travel stop karta hai; default action automatically cancel nahi karta. Har event bubble nahi karta. Clickable div banane se keyboard activation aur native semantics free mein nahi milti; actual button/link prefer karo. Reduced-motion preference respect karke decorative animations skip karo.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Delegated listener ke andar `event.target` hamesha wahi element hai jispar listener lagaya gaya. **Why it breaks:** `target` click ka actual origin hota hai (jaise button ke andar ka icon), `currentTarget` listener wala parent element hota hai — inhe same maan lena galat handler logic likhwa deta hai. **Fix:** `closest()` se intended interactive ancestor dhoondo, phir explicit containment check karo.
- **Wrong assumption:** `removeEventListener` bina exact same function reference ke bhi kaam karega. **Why it breaks:** Anonymous arrow function har baar naya reference hota hai; `removeEventListener` reference match par depend karta hai, isliye listener kabhi remove nahi hota aur duplicate ho sakta hai. **Fix:** Named function reference store karo, ya cleanup ek jagah rakhne ke liye `AbortController` signal use karo.
- **Wrong assumption:** `CustomEvent` automatically sab ancestors tak bubble karega. **Why it breaks:** Default `bubbles` option `false` hai; explicitly na diya jaaye to delegated parent listener kabhi trigger nahi hoga. **Fix:** `{ bubbles: true }` explicitly set karo aur dispatch karne wala element sahi choose karo.

Real app mein yeh pattern shopping cart badge update, toast notifications aur multi-step form validation mein daily use hota hai — components ek dusre ko directly import kiye bina events se coordinate karte hain, aur inhi mistakes se badge stale reh jaata hai ya listener leak hota hai.

## Practice

Dynamic task list banao with add/remove buttons, keyboard support aur empty-state message. Parent delegation use karo. Ten times mount/unmount karke check karo ki duplicate listeners aur duplicate actions nahi aa rahe.

## Interview questions — bolkar practice karo

**Q. Delegation kab useful hai?** Dynamic repeated children par shared action handling ke liye. Event bubbling aur correct target resolution required hai.

**Q. DOM update immediately screen par dikhta hai?** JavaScript DOM update kar sakta hai, lekin visible paint browser rendering schedule par hota hai. Long synchronous work paint delay kar sakta hai.

## Research notes: Own a listener lifecycle

Related listeners same abort signal share karke together dispose ho sakte hain. Har independent widget ka fresh controller banao.

```js
function mountCounter(button, output) {
  const lifetime = new AbortController();
  let count = 0;
  button.addEventListener('click', () => {
    output.textContent = String(++count);
  }, { signal: lifetime.signal });
  return () => lifetime.abort();
}
```

Global controller widget lifetimes jod dega: ek dispose karoge toh doosre ke listeners bhi remove ho sakte hain.

**Interview check:** Kya once:true lifecycle cleanup replace karta hai?

**Answer:** Listener first invocation ke baad remove hota hai. Long-lived target par event kabhi hua hi nahi toh explicit disposal phir bhi chahiye. One-event behavior aur resource ownership alag requirements hain.

**Practice:** Do counters mount karo, ek dispose karo; sirf doosra respond kare, verify karo.

[Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Delete button ke andar icon hai. Sirf `event.target.matches('button')` kyun miss karega? Dynamically added rows bhi handle karo.

> **Hint:** Nearest matching action dhundo aur check karo ki woh intended list ke andar hai.

**Answer guide — compare after attempting:** Target Element ho toh `event.target.closest('button[data-id]')` use karo; button ki list membership verify karo. Stable item ID se item remove karo. Ek ancestor listener future mein add hui rows ko bhi handle karega.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) listener options explain karta hai. [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) asynchronous observation ka reference hai.
