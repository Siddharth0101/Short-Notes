---
id: javascript-browser-foundations
title: HTML CSS and browser rendering essentials
track: javascript
order: 11
level: Foundation
minutes: 5
summary: HTML — structure; CSS — styling and layout; JS — behaviour.
tags: html, css, accessibility, browser, layout
---

## Quick revision

> Revision target — Build the base of an interaction from semantic HTML; check layout, the accessible name and keyboard behaviour together.

- HTML — structure; CSS — styling/layout; JS — behaviour.
- Semantic HTML — use `button` for an action and `a` for navigation.
- Rendering — DOM + styles → layout → paint → composite.
- Box model — content + padding + border; margin is the gap outside.
- `border-box` — the width includes padding and border.
- Flexbox — layout in one direction; Grid — layout in rows and columns.
- Cascade — after origin/layer/importance, specificity and source order matter.
- `relative` — offset from the normal position; `absolute` — positioned with respect to the containing block.
- Responsive — flexible sizes, media queries and a usable small-screen layout.
- Accessibility — labels, keyboard access and visible focus are required.
- `defer` — a classic external script executes in document order after parsing.
- `async` script — executes as soon as it is ready; the order of sibling scripts is not guaranteed.
- Form labels — connect the label to the input's ID; a placeholder is not a replacement for a label.

### HTML essentials

- Tag/element — a tag is the markup boundary; an element is the parsed node with content/attributes.
- Void element — elements like img/input have no child content and no closing tag.
- Lists — ul unordered, ol ordered, dl term/description pairs.
- Class/id — a class is reused; keep an id unique in the document.
- strong/em — importance/emphasis; b/i have a different semantic purpose, so do not treat them as merely the visual equivalent.
- head/body — metadata/resources go in head; page content goes in body.
- iframe — embeds another document; check sandbox, permissions and the framing policy.
- Target — _self is the current context, _blank a new one; rel=noopener controls the opener relationship.
- link/a — link is a relationship to an external resource; a is a hyperlink for user navigation.
- Scripts — classic defer runs in order after parsing; async as soon as ready; modules are deferred by default.
- Audio/video — handle native controls, formats, captions and autoplay restrictions.
- Semantics — use nav/main/article/section meaningfully; not a random semantic tag just for styling.
- header/h1 — header is a container; choose the heading rank from the document hierarchy.
- Disabled field — its value is not included in a normal form submission; a readonly control behaves differently.
- Button default — a button inside a form can default to submit; use type=button for a non-submit action.
- Native form — enabled controls with a name are submitted; keep a label and the correct button type.
- Flex axes — justify-content is the main axis; align-items the cross axis; when the direction changes, so do the axes.

### Edge cases and reasoning

- Viewport metadata — use width=device-width for mobile layout; do not break accessibility by disabling user zoom.
- Image dimensions — reserve space with width/height or aspect-ratio; layout shift after the image loads is reduced.
- Constraint validation — required/type/min are helpful browser checks; validate untrusted input again on the server.

## Research notes: Semantic HTML before custom interaction

- Use an anchor for navigation and a button for an action.

## Understand it with an example

```html
<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Continue</button>
</form>
```

- Trace — the label is linked to the input; a native input and button give a usable base for keyboard interaction.
- Catch — browser validation helps the user; the backend must validate the received input again.
- Check — reach the input/button with Tab, watch focus on a label click, and check for horizontal overflow on a narrow screen.

## Recall and practice

- Question — Why does an input with a placeholder still need a label?
- Answer — The placeholder disappears on typing; a persistent visible label and an accessible name keep the purpose of the control clear.
- Try it yourself — Build a semantic signup form; verify the Tab order, Enter to submit, explicit labels, an invalid email and a 320px layout.

## Practice questions

### Easy · Box model width

```css
.card { width: 200px; padding: 20px; border: 5px solid; }
```

How wide does the card appear with the default `box-sizing`? And with `border-box`?

<details>
<summary>Answer</summary>

- `content-box` (default) — `200 + 2×20 + 2×5 = 250px`.
- `border-box` — the whole box is `200px`; the content area is left with `150px`.
- Practice — `*, *::before, *::after { box-sizing: border-box; }` makes layouts predictable.

</details>

### Easy · Why does the form's "Cancel" button submit?

```html
<form action="/save">
  <input name="title" />
  <button>Save</button>
  <button onclick="closeDialog()">Cancel</button>
</form>
```

<details>
<summary>Answer</summary>

- Why — a `<button>` inside a form has the default `type` of `submit`.
- Fix — `<button type="button">Cancel</button>`; write `type="submit"` explicitly on Save.
- Bonus — the Enter key also submits the form; so keep the submit logic on the `submit` event of the `form`, not on a button click.

</details>

### Medium · Which CSS specificity wins?

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
- Score — `#intro` = (1,0,0); `p.lead.note` = (0,2,1); `:where(...)` is always (0,0,0).
- Order — a later rule wins only when specificity is equal; inline `style` and `!important` sit above this.

</details>

### Medium · `defer` vs `async` vs normal script

```html
<script src="analytics.js" async></script>
<script src="vendor.js" defer></script>
<script src="app.js" defer></script>
```

What will the execution order and DOM availability be? `app.js` depends on the vendor script.

<details>
<summary>Answer</summary>

- `defer` — downloads in parallel, runs after the HTML is parsed, in document order (`vendor` → `app`), before `DOMContentLoaded`.
- `async` — runs as soon as it downloads; order is not guaranteed; fine for independent scripts (analytics).
- Normal script — blocks parsing until it is downloaded and run.
- Modules — `type="module"` behaves as deferred by default.

</details>

### Medium · Accessible form control

```html
<input placeholder="Email" />
<div class="btn" onclick="send()">Send</div>
```

What are the problems, and what is the fix?

<details>
<summary>Answer</summary>

- Label — a placeholder is not a label; it disappears on typing and screen readers do not get a reliable name. `<label for="email">Email</label><input id="email" type="email">`.
- Div button — no keyboard focus, no Enter/Space, no role. Use a native `<button type="submit">`.
- Validation — `type="email"` and `required` give native constraint validation for free.

</details>

### Hard · Why does the flex item overflow?

```css
.row { display: flex; }
.title { flex: 1; }
```

`.title` holds a long URL and spills out of the container even though `flex: 1` is set. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Cause — flex items default to `min-width: auto`; an item does not shrink below the minimum size of its content, and the minimum of an unbroken URL is very large.
- Fix — `.title { min-width: 0; }` and `overflow-wrap: anywhere` for the text (or `text-overflow: ellipsis` + `overflow: hidden` + `white-space: nowrap`).
- Same bug — this is why `minmax(0, 1fr)` is used in grid.

</details>

## Sources — further reading

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/11-browser-foundations.md)
