---
id: javascript-browser-foundations
title: HTML CSS and browser rendering essentials
track: javascript
order: 11
level: Foundation
minutes: 5
summary: HTML — structure; CSS — styling/layout; JS — behavior.
tags: html, css, accessibility, browser, layout
---

## Quick revision

> Revision target — Semantic HTML se interaction ka base banao; layout, accessible name aur keyboard behavior saath check karo.

- HTML — structure; CSS — styling/layout; JS — behavior.
- Semantic HTML — action ke liye `button`, navigation ke liye `a` use karo.
- Rendering — DOM + styles → layout → paint → composite.
- Box model — content + padding + border; margin bahar ka gap.
- `border-box` — width mein padding aur border included.
- Flexbox — ek direction ka layout; Grid — rows aur columns ka layout.
- Cascade — origin/layer/importance ke baad specificity aur source order matter karte hain.
- `relative` — normal position se offset; `absolute` — containing block ke respect mein position.
- Responsive — flexible sizes, media queries aur usable small-screen layout.
- Accessibility — labels, keyboard access aur visible focus zaroori hain.
- `defer` — classic external script parsing ke baad document order mein execute hota hai.
- `async` script — ready hote hi execute; sibling scripts ka order guaranteed nahi.
- Form labels — label ko input ID se jodo; placeholder label ka replacement nahi.

### HTML essentials

- Tag/element — tag markup boundary; element content/attributes wala parsed node.
- Void element — img/input jaise elements ke child content aur closing tag nahi.
- Lists — ul unordered, ol ordered, dl term/description pairs.
- Class/id — class reuse hoti hai; id document mein unique rakho.
- strong/em — importance/emphasis; b/i ka semantic purpose alag, sirf visual equivalent mat samjho.
- head/body — metadata/resources head mein; page content body mein.
- iframe — doosra document embed; sandbox, permissions aur framing policy check.
- Target — _self current, _blank new context; rel=noopener opener relationship control karta hai.
- link/a — link external resource relationship; a user navigation hyperlink.
- Scripts — classic defer parse ke baad ordered; async ready hote hi; modules default deferred.
- Audio/video — native controls, formats, captions aur autoplay restrictions handle.
- Semantics — nav/main/article/section ka meaningful use; styling ke liye random semantic tag nahi.
- header/h1 — header container hai; heading rank document hierarchy se choose.
- Disabled field — normal form submission mein value include nahi hoti; readonly control ka behavior alag.
- Button default — form ke andar button ka default submit ho sakta hai; non-submit action par type=button.
- Native form — name wale enabled controls submit; label aur correct button type rakho.
- Flex axes — justify-content main axis; align-items cross axis; direction badle toh axes bhi badalti hain.

### Edge cases aur reasoning

- Viewport metadata — mobile layout ke liye width=device-width use; user zoom ko disable karke accessibility mat todo.
- Image dimensions — width/height ya aspect-ratio se space reserve; image load ke baad layout shift kam hota hai.
- Constraint validation — required/type/min helpful browser checks; untrusted input server par dobara validate karo.

## Research notes: Semantic HTML before custom interaction

- Navigation ke liye anchor, action ke liye button lo.

## Example se samjho

```html
<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Continue</button>
</form>
```

- Trace — label input se linked hai; native input aur button keyboard interaction ka usable base dete hain.
- Catch — browser validation user ko help karti hai; backend ko received input dobara validate karna hoga.
- Check — Tab se input/button reach karo, label click par focus dekho, aur narrow screen par horizontal overflow check karo.

## Recall aur practice

- Sawal — Placeholder ke saath input par label kyun chahiye?
- Jawaab — Typing se placeholder gayab; persistent visible label aur accessible name control ka purpose clear rakhte hain.
- Khud try karo — Semantic signup form banao; Tab order, Enter submit, explicit labels, invalid email aur 320px layout verify karo.

## Practice questions

### Easy · Box model width

```css
.card { width: 200px; padding: 20px; border: 5px solid; }
```

Default `box-sizing` mein card kitna wide dikhega? `border-box` par?

<details>
<summary>Answer</summary>

- `content-box` (default) — `200 + 2×20 + 2×5 = 250px`.
- `border-box` — poora box `200px`; content area `150px` bachta hai.
- Practice — `*, *::before, *::after { box-sizing: border-box; }` layouts predictable banata hai.

</details>

### Easy · Form ka "Cancel" button submit kyun kar raha hai?

```html
<form action="/save">
  <input name="title" />
  <button>Save</button>
  <button onclick="closeDialog()">Cancel</button>
</form>
```

<details>
<summary>Answer</summary>

- Kyun — form ke andar `<button>` ka default `type` `submit` hota hai.
- Fix — `<button type="button">Cancel</button>`; Save ko explicitly `type="submit"` likho.
- Bonus — Enter key bhi form submit karti hai; isliye submit logic `form` ke `submit` event par rakho, button click par nahi.

</details>

### Medium · CSS specificity kaun jeetega?

```html
<p id="intro" class="lead note">Hello</p>
```

```css
p.lead.note { color: green; }
#intro { color: blue; }
:where(#intro) { color: red; }
```

<details>
<summary>Answer</summary>

- Result — blue.
- Score — `#intro` = (1,0,0); `p.lead.note` = (0,2,1); `:where(...)` hamesha (0,0,0).
- Order — specificity barabar ho tabhi later rule jeetta hai; inline `style` aur `!important` isse upar hain.

</details>

### Medium · `defer` vs `async` vs normal script

```html
<script src="analytics.js" async></script>
<script src="vendor.js" defer></script>
<script src="app.js" defer></script>
```

Execution order aur DOM availability kya hogi? `app.js` vendor par depend karta hai.

<details>
<summary>Answer</summary>

- `defer` — download parallel, run HTML parse ke baad, document order mein (`vendor` → `app`), `DOMContentLoaded` se pehle.
- `async` — download hote hi run; order guaranteed nahi; independent scripts (analytics) ke liye theek.
- Normal script — parsing rokta hai jab tak download + run na ho.
- Modules — `type="module"` default deferred behave karta hai.

</details>

### Medium · Accessible form control

```html
<input placeholder="Email" />
<div class="btn" onclick="send()">Send</div>
```

Kya problems hain aur fix kya hai?

<details>
<summary>Answer</summary>

- Label — placeholder label nahi; typing par gayab hota hai aur screen readers reliable naam nahi paate. `<label for="email">Email</label><input id="email" type="email">`.
- Div button — keyboard focus, Enter/Space, role kuch nahi. Native `<button type="submit">` use karo.
- Validation — `type="email"` aur `required` se native constraint validation free milti hai.

</details>

### Hard · Flex item overflow kyun karta hai?

```css
.row { display: flex; }
.title { flex: 1; }
```

`.title` mein lamba URL hai aur container ke bahar nikal jaata hai, jabki `flex: 1` diya hai. Kyun, aur fix?

<details>
<summary>Answer</summary>

- Cause — flex items ka default `min-width: auto` hai; item apne content ke minimum size se chhota shrink nahi hota, aur unbroken URL ka minimum bahut bada hai.
- Fix — `.title { min-width: 0; }` aur text ke liye `overflow-wrap: anywhere` (ya `text-overflow: ellipsis` + `overflow: hidden` + `white-space: nowrap`).
- Same bug — grid mein `minmax(0, 1fr)` isi wajah se use hota hai.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/11-browser-foundations.md)
