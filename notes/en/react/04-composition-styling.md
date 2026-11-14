---
id: react-composition-styling
title: Composition reusable patterns and styling
track: react
order: 4
level: Intermediate
minutes: 6
summary: Composition — connect small components through `children` and props.
tags: composition, patterns, css, accessibility, components
---

## Quick revision

> Revision target — Keep the behaviour contract of a reusable component small; preserve semantics and responsive layout along with the styling.

- Composition — connect small components through `children`/props.
- Container — handles data/control; a presentational component shows the UI.
- Compound components — related parts work together with a shared contract/state.
- Controlled API — the parent owns the state; uncontrolled API — the component owns it.
- CSS Modules — class names are scoped; fewer accidental clashes with global styles.
- Tailwind — style with utility classes; keep a repeated pattern readable.
- Styled components — styles live with the component; weigh the runtime/build tradeoff.
- Accessibility — keep the label, keyboard and focus contract in a reusable component.
- Render prop — let the caller customize rendering through a function prop.
- Prop spreading — do not blindly forward internal/private props onto the DOM.
- Component boundary — keep a reusable API small; do not turn every styling detail into a configuration prop.

### CSS layout and the cascade

- Display — block is a new block box, inline is text flow, inline-block is inline placement + box sizing.
- Position — static is normal; relative is an offset; absolute is out of flow; fixed is relative to the viewport/containing block; sticky has a scroll threshold.
- Hide — display:none removes it from layout; visibility:hidden keeps the space, normally with no interaction/focus.
- CSS placement — inline, a style block or a linked stylesheet; the cascade still applies.
- Specificity — after cascade origin/layer/importance comes selector weight, then source order.
- Centering — flex/grid alignment; auto margins when a block has a width; be clear about the desired axis.
- Shadow DOM — DOM/style encapsulation; not a security boundary.
### CSS selectors and layers

- CSS triangle — a zero-size box with transparent borders + one coloured border.
- Pseudo-element — ::before/::after are generated boxes; think about the content/accessibility impact.
- z-index — ordering within the local stacking context; a high value does not escape the parent's context.
- Combinators — space is descendant, > child, + adjacent sibling, ~ following sibling.
- CSS custom property — the var() fallback handles missing/invalid variable cases; the final validity of the property still matters.

### CSS sizing

- `px` — a CSS pixel; it need not equal a physical device pixel.
- `rem` — relative to the root font-size; consistent, scalable sizing.
- `em` — relative to the parent for font-size, and to the element's own font-size for other lengths.
- `vw`/`vh` — 1% of the viewport width/height.
- `svh`/`lvh`/`dvh` — 1% of the small/large/dynamic viewport height.
- `ch` — the advance width of the zero glyph; a rough unit for text measure.
- `vmin`/`vmax` — relative to the smaller/larger dimension of the viewport.
- Line-height — a unitless multiplier scales with the font-size of children.
- `clamp(min, preferred, max)` — keeps a responsive size within a lower/upper limit.
- Percent height — without a definite height on the containing block you may not get the expected percentage sizing.
- Flex overflow — a child's automatic minimum size can prevent shrinking; use min-width:0 where needed.
- Zoom check — verify clipping/overflow with browser text zoom and a narrow viewport.

### Theme and generated styles

- Theme token — colours/spacing through semantic names; do not repeat magic values in every component.
- Dynamic classes — verify that runtime-generated names are compatible with build-time class discovery.

### CSS units

- Percentage unit — depends on the reference property; a percentage is not always of the parent width.

### Container-based responsiveness

- Container query — component styling based on the size of an ancestor container; different from a viewport media query.
- `container-type: inline-size` — makes the ancestor an inline-size query container; style descendants with `@container`.
- Named container — target the correct ancestor with `container-name` when containers are nested.

### Edge cases and reasoning

- Interaction semantics — a role alone does not give a clickable div keyboard behaviour; prefer the built-in contract of a native button.
- Disabled contract — disabled, busy and read-only are different behaviours; define the focus/submit effect clearly in a reusable API.
- Reduced motion — reduce nonessential motion under prefers-reduced-motion; meaning must not depend on animation/colour alone.

## Understand it with an example

```jsx
function ActionButton({ children, type = "button", ...props }) {
  return <button type={type} {...props}>{children}</button>;
}
// <ActionButton onClick={openHelp}>Help</ActionButton>
// <ActionButton type="submit">Save</ActionButton>
```

- Trace — the default helper action does not submit the form; the caller chooses submit intent explicitly.
- Catch — a reusable wrapper must preserve native `disabled`, the accessible name and focus behaviour.
- Check — verify the same component with keyboard activation, a long label, the dark theme and a narrow container.

## Recall and practice

- Question — How does a reusable button prevent an unwanted submit inside a form?
- Answer — An explicit type="button" on the action button; keep type="submit" on the actual submit button and document the caller contract.
- Try it yourself — Compose a button and a dialog; verify a disabled action, keyboard open/close, focus restoration, reduced motion and light/dark contrast.

## Practice questions

### Easy · `em` compounding

```css
html { font-size: 16px; }
.box { font-size: 1.25em; }
```

What is the text size inside three nested `.box` elements? What if it were `rem`?

<details>
<summary>Answer</summary>

- `em` — multiplies by the parent at every level: `16 × 1.25³ = 31.25px`.
- `rem` — always from the root: `1.25rem = 20px` at every level.
- Use — `rem` for typography/spacing; `em` for component-relative padding (e.g. a button).

</details>

### Easy · Centre a div on both axes

<details>
<summary>Answer</summary>

```css
.parent {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}
```

- Flex alternative — `display: flex; justify-content: center; align-items: center;`.
- Catch — vertical centring needs the parent to have a height.

</details>

### Medium · Why is `z-index: 9999` not working?

The dropdown has `z-index: 9999`, yet it hides behind the card below it. Two common causes?

<details>
<summary>Answer</summary>

- Stacking context — some ancestor has `transform`, `opacity < 1`, `filter`, or `position` + `z-index`; the dropdown is compared inside that context, not against the card outside.
- Not positioned — `z-index` has no effect on a normal block (it needs a positioned, flex or grid item).
- Fix — render the dropdown at the `body` level with a portal, or remove the ancestor's stacking context.

</details>

### Medium · `100vh` overflow on mobile

A full-screen section has `height: 100vh` and is cut off at the bottom on mobile. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Why — mobile browsers calculate `vh` from the (largest) viewport height, the one with the address bar hidden.
- Fix — `min-height: 100dvh` (dynamic), or `100svh` (smallest) for a stable layout.
- Fallback — `min-height: 100vh; min-height: 100dvh;` for older browsers.

</details>

### Medium · A compound `Tabs` component

Build an API like `<Tabs><Tabs.List /><Tabs.Panel /></Tabs>` where the children know the shared active tab without prop drilling.

<details>
<summary>Answer</summary>

```jsx
const TabsContext = createContext(null);
function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
}
function Tab({ value, children }) {
  const tabs = useContext(TabsContext);
  return (
    <button role="tab" aria-selected={tabs.value === value} onClick={() => tabs.setValue(value)}>
      {children}
    </button>
  );
}
function Panel({ value, children }) {
  const tabs = useContext(TabsContext);
  return tabs.value === value ? <div role="tabpanel">{children}</div> : null;
}
Tabs.Tab = Tab;
Tabs.Panel = Panel;
```

- Compound pattern — the parent owns the state and the children read it from context.
- Controlled API — also accept `value` + `onValueChange` props so the parent can control it from the URL or a form.
- A11y — real tabs also need `role="tablist"`, arrow-key navigation and `aria-controls`.

</details>

### Hard · An accessible `Button` wrapper

Write a `Button` that defaults to `type="button"`, applies a `variant` class, merges the caller's `className`, forwards the remaining props, and prevents a double submit while `loading`.

<details>
<summary>Answer</summary>

```jsx
function Button({ variant = 'primary', loading = false, className = '', type = 'button', disabled, children, ...rest }) {
  return (
    <button
      {...rest}
      type={type}
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? 'Saving…' : children}
    </button>
  );
}
```

- `type="button"` — no accidental submit inside a form.
- Merge order — `rest` first, controlled props after; the caller's `onClick` and `aria-label` pass through as they are.
- Disabled vs `aria-disabled` — `disabled` removes both focus and click; to show a tooltip/explanation use `aria-disabled="true"` + a guard in the handler.

</details>

## Sources — further reading

- [MDN — container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)

- [React passing JSX as children](https://react.dev/learn/passing-props-to-a-component)
- [React custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/04-composition-styling.md)
