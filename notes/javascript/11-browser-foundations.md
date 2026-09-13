---
id: javascript-browser-foundations
title: HTML CSS and browser rendering essentials
track: javascript
order: 11
level: Foundation
minutes: 25
summary: Connect semantic markup, layout and browser work to real interface failures.
tags: html, css, accessibility, browser, layout
---

## Mental model

Browser UI teen connected contracts hai: HTML describes meaning, CSS describes presentation, and JavaScript adds behavior. Framework components eventually produce these same browser primitives. A button-looking div does not acquire native keyboard behavior, and a React render does not necessarily cause a browser paint.

> **Core takeaway:** Semantic HTML supplies interaction behavior; CSS determines layout without changing meaning.

## The rendering path

Parse HTML into DOM and CSS into style rules; resolve computed styles; lay out geometry; paint visual content; composite layers when appropriate. Changes can invalidate different amounts of work. Updating width may trigger layout, while transform often avoids layout, but compositor behavior depends on browser and element details. Measure the actual trace instead of assuming every animation is cheap.

Reading geometry after changing styles can force synchronous layout. Batch reads before writes when practical. An animation that moves a thousand elements may remain expensive even if individual transforms are composited; layer memory and rasterization still cost resources.

## A resilient card layout

```html
<main>
  <h1>Study library</h1>
  <form role="search">
    <label for="search">Search chapters</label>
    <input id="search" name="q" type="search">
    <button type="submit">Search</button>
  </form>
  <ul class="cards">
    <li><article><h2>Closures</h2><p>Scope in practice.</p></article></li>
    <li><article><h2>Promises</h2><p>Async outcomes.</p></article></li>
  </ul>
</main>
```

```css
* { box-sizing: border-box; }
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  padding: 0;
  list-style: none;
}
.cards > li { min-width: 0; overflow-wrap: anywhere; }
button:focus-visible, input:focus-visible {
  outline: 3px solid #365b9b;
  outline-offset: 3px;
}
```

The inner min prevents a minimum column width from overflowing a narrow container. min-width: 0 allows a grid or flex child to shrink below its content's automatic minimum where needed. Test long unbroken titles; ordinary short demo text hides overflow bugs.

## Cascade and positioning traps

Specificity matters after origin, importance and cascade-layer ordering. Adding more selectors can mask a flawed styling boundary. Prefer scoped component styles and a documented token layer. Flexbox distributes along one main axis; grid handles two-dimensional placement. Neither tool replaces semantic DOM order.

position: absolute uses its containing block, not always the viewport. A transformed ancestor can change containing-block behavior for positioned descendants. z-index operates inside stacking contexts: a child cannot escape its parent's context just by using a huge number. Debug ancestor contexts before increasing numbers.

## Practice

Build the layout above with one 200-character title. Check 320px width and 200% zoom. Navigate without a mouse, submit using Enter, and verify the input has a visible label. Add a modal and explain focus entry, Escape, background interaction and focus restoration before choosing an implementation. Keep native elements where their behavior matches your requirement.

## Interview questions

**Why can min-width: 0 fix an overflowing flex item?** It permits shrinking below the automatic content minimum; it does not arbitrarily hide content.

**Does display: none preserve accessibility exposure?** The hidden subtree is generally removed from layout and the accessibility tree. Choose hiding behavior according to the interaction, not appearance alone.

## Research notes: Semantic HTML before custom interaction

Use an anchor for navigation and a button for an action. A clickable `div` requires extra keyboard, focus and accessibility behavior.

```html
<label for="course-search">Find a course</label>
<input id="course-search" name="query" type="search">
<button type="button">Clear search</button>
<a href="/library">Browse all courses</a>
```

Placeholder text is not a persistent visible label. Start with native behavior, then add styling.

**Interview check:** What can be missing from a control that only handles click on a div?

**Answer:** Keyboard activation, focusability, and an accessible role or name may be absent. Prefer the correct native element and preserve its behavior while styling it.

**Practice:** Navigate and activate the example using only a keyboard.

[Read the source — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Sketch a lesson card with a heading, description, and an action that expands details. How will it work with keyboard input and at a narrow width?

> **Hint:** An action is a button; navigation is a link.

**Answer guide — compare after attempting:** Use a real button with an accessible name and an expanded-state indicator tied to the controlled content. Keep visible focus and a flexible card width. Verify activation with Enter and Space and check that long text wraps without hiding the action.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN CSS guide](https://developer.mozilla.org/en-US/docs/Web/CSS) and [HTML reference](https://developer.mozilla.org/en-US/docs/Web/HTML) provide the browser primitives behind these examples.
