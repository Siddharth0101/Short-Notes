---
id: react-composition-styling
title: Composition reusable patterns and styling
track: react
order: 4
level: Intermediate
minutes: 6
summary: Composition — small components ko `children`/props se jodo.
tags: composition, patterns, css, accessibility, components
---

## Quick revision

> Revision target — Reusable component ka behavior contract chhota rakho; semantics aur responsive layout ko styling ke saath preserve karo.

- Composition — small components ko `children`/props se jodo.
- Container — data/control sambhalo; presentational component UI dikhaye.
- Compound components — related parts shared contract/state ke saath kaam karein.
- Controlled API — parent state own kare; uncontrolled API — component own kare.
- CSS Modules — class names scoped; global styles ka accidental clash kam.
- Tailwind — utility classes se style; repeated pattern ko readable rakho.
- Styled components — component ke saath styles; runtime/build tradeoff dekho.
- Accessibility — reusable component mein label, keyboard aur focus contract rakho.
- Render prop — function prop se caller ko rendering customize karne do.
- Prop spreading — internal/private props blindly DOM par forward mat karo.
- Component boundary — reusable API small rakho; har styling detail ko configuration prop mat banao.

### CSS layout aur cascade

- Display — block naya block box, inline text flow, inline-block inline placement + box sizing.
- Position — static normal; relative offset; absolute out-of-flow; fixed viewport/containing block; sticky scroll threshold.
- Hide — display:none layout se hataata; visibility:hidden space rakhta, normally interaction/focus nahi.
- CSS placement — inline, style block ya linked stylesheet; cascade phir bhi apply hoti hai.
- Specificity — cascade origin/layer/importance ke baad selector weight, phir source order.
- Centering — flex/grid alignment; block width ho toh auto margins; desired axis clear karo.
- Shadow DOM — DOM/style encapsulation; security boundary nahi.
### CSS selectors aur layers

- CSS triangle — zero-size box ki transparent borders + ek colored border.
- Pseudo-element — ::before/::after generated boxes; content/accessibility impact socho.
- z-index — local stacking context ke andar order; high value parent context se escape nahi karta.
- Combinators — space descendant, > child, + adjacent sibling, ~ following sibling.
- CSS custom property — var() fallback missing/invalid variable cases handle; property ki final validity phir bhi matter.

### CSS sizing

- `px` — CSS pixel; physical device pixel ke equal hona zaroori nahi.
- `rem` — root font-size ke relative; consistent scalable sizing.
- `em` — font-size mein parent, other lengths mein element font-size ke relative.
- `vw`/`vh` — viewport width/height ka 1%.
- `svh`/`lvh`/`dvh` — small/large/dynamic viewport height ke 1%.
- `ch` — zero glyph ki advance width; text measure ka rough unit.
- `vmin`/`vmax` — viewport ki smaller/larger dimension ke relative.
- Line-height — unitless multiplier children ke font-size ke saath scale hota hai.
- `clamp(min, preferred, max)` — responsive size ko lower/upper limit mein rakho.
- Percent height — containing block ki definite height na ho toh expected percentage sizing nahi mil sakti.
- Flex overflow — child ka automatic minimum size shrink rok sakta hai; needed case mein min-width:0.
- Zoom check — browser text zoom aur narrow viewport par clipping/overflow verify karo.

### Theme aur generated styles

- Theme token — colors/spacing semantic names se; every component mein magic values repeat mat karo.
- Dynamic classes — build-time class discovery ke saath runtime-generated names ka compatibility verify.

### CSS units

- Percentage unit — reference property par depend; percentage hamesha parent width nahi hota.

### Container-based responsiveness

- Container query — component styling ancestor container ke size par; viewport media query se alag.
- `container-type: inline-size` — ancestor ko inline-size query container banao; `@container` se descendants style karo.
- Named container — `container-name` se correct ancestor target karo, jab nested containers hon.

### Edge cases aur reasoning

- Interaction semantics — clickable div par role alone keyboard behavior nahi deta; native button ka built-in contract prefer karo.
- Disabled contract — disabled, busy aur read-only alag behaviors; reusable API mein focus/submit effect clearly define karo.
- Reduced motion — prefers-reduced-motion par nonessential motion reduce; meaning sirf animation/color par depend na kare.

## Example se samjho

```jsx
function ActionButton({ children, type = "button", ...props }) {
  return <button type={type} {...props}>{children}</button>;
}
// <ActionButton onClick={openHelp}>Help</ActionButton>
// <ActionButton type="submit">Save</ActionButton>
```

- Trace — default helper action form submit nahi karti; caller submit intent explicitly choose karta hai.
- Catch — reusable wrapper ko native `disabled`, accessible name aur focus behavior preserve karna chahiye.
- Check — keyboard activation, long label, dark theme aur narrow container mein same component verify karo.

## Recall aur practice

- Sawal — Reusable button form ke andar unwanted submit kaise rokega?
- Jawaab — Action button ka explicit type="button"; actual submit button type="submit" rakho aur caller contract document karo.
- Khud try karo — Button aur dialog compose karo; disabled action, keyboard open/close, focus restoration, reduced motion aur light/dark contrast verify karo.

## Practice questions

### Easy · `em` compounding

```css
html { font-size: 16px; }
.box { font-size: 1.25em; }
```

Teen nested `.box` ke andar text ka size kya hoga? `rem` hota toh?

<details>
<summary>Answer</summary>

- `em` — har level parent par multiply: `16 × 1.25³ = 31.25px`.
- `rem` — hamesha root se: `1.25rem = 20px` har level par.
- Use — typography/spacing ke liye `rem`; component-relative padding (e.g. button) ke liye `em`.

</details>

### Easy · Div ko dono axis mein center karo

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
- Catch — vertical centering ke liye parent ki height honi chahiye.

</details>

### Medium · `z-index: 9999` kaam kyun nahi kar raha?

Dropdown ko `z-index: 9999` diya, phir bhi woh neeche wale card ke peeche chhupta hai. Do common causes?

<details>
<summary>Answer</summary>

- Stacking context — kisi ancestor par `transform`, `opacity < 1`, `filter`, ya `position` + `z-index` hai; dropdown usi context ke andar compare hota hai, bahar ke card se nahi.
- Not positioned — normal block par `z-index` effect nahi karta (positioned, flex ya grid item chahiye).
- Fix — portal se dropdown ko `body` level par render karo, ya ancestor ka stacking context hatao.

</details>

### Medium · Mobile par `100vh` overflow

Full-screen section `height: 100vh` hai, mobile par neeche cut ho jaata hai. Kyun aur fix?

<details>
<summary>Answer</summary>

- Kyun — mobile browsers `vh` ko address bar chhupne wali (largest) viewport height se calculate karte hain.
- Fix — `min-height: 100dvh` (dynamic) ya stable layout ke liye `100svh` (smallest).
- Fallback — `min-height: 100vh; min-height: 100dvh;` purane browsers ke liye.

</details>

### Medium · Compound `Tabs` component

`<Tabs><Tabs.List /><Tabs.Panel /></Tabs>` jaisa API banao jahan children shared active tab jaanein bina prop drilling ke.

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

- Compound pattern — parent state own karta hai, children context se padhte hain.
- Controlled API — `value` + `onValueChange` props bhi accept karo taaki parent URL ya form se control kar sake.
- A11y — real tabs ke liye `role="tablist"`, arrow-key navigation aur `aria-controls` bhi chahiye.

</details>

### Hard · Accessible `Button` wrapper

`Button` likho jo default `type="button"` de, `variant` class lagaye, caller ka `className` merge kare, baaki props forward kare, aur `loading` ke dauran double submit roke.

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

- `type="button"` — form ke andar accidental submit nahi.
- Merge order — `rest` pehle, controlled props baad mein; caller `onClick`, `aria-label` waise hi pass hote hain.
- Disabled vs `aria-disabled` — `disabled` focus aur click dono hata deta hai; tooltip/explanation dikhana ho toh `aria-disabled="true"` + handler mein guard.

</details>

## Sources — aur padhne ke liye

- [MDN — container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)

- [React passing JSX as children](https://react.dev/learn/passing-props-to-a-component)
- [React custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/04-composition-styling.md)
