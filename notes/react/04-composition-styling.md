---
id: react-composition-styling
title: Composition reusable patterns and styling
track: react
order: 4
level: Intermediate
minutes: 28
summary: Composition reusable outer structure ko uske andar ke content se separate rakhti hai.
tags: composition, patterns, css, accessibility, components
---

## Mental model — simple soch

Reusable component ek stable contract expose karta hai: inputs, actions, slots aur accessibility behavior. Har visual variation ko boolean prop bana doge to combinations unmanageable ho sakte hain. Composition caller ko meaningful pieces arrange karne deti hai, jabki component shared behavior own karta hai. Reuse ka goal similar pixels copy karna nahi, same responsibility centralize karna hai.

> **Core takeaway:** Composition reusable outer structure ko uske andar ke content se separate rakhti hai.

## Start with simple slots

```jsx
function StudyPanel({ title, actions, children }) {
  return (
    <section className="study-panel">
      <header className="study-panel__header">
        <h2>{title}</h2>
        <div>{actions}</div>
      </header>
      <div className="study-panel__body">{children}</div>
    </section>
  );
}

export default function Example() {
  return (
    <StudyPanel title="React revision"
      actions={<a href="#practice">Practice questions</a>}>
      <p>Start with state ownership, then effects.</p>
    </StudyPanel>
  );
}
```

`children` content slot hai; `actions` named slot hai. Panel ko inside content ka business logic nahi pata. Caller composition decide karta hai. Prop drilling painful lage to pehle component composition try karo; har intermediate component ko unnecessary data forward karna avoid ho sakta hai.

## Advanced patterns

Compound components, jaise Tabs, TabList aur TabPanel, shared context se selection coordinate kar sakte hain. API flexible hoti hai lekin keyboard navigation, focus management, ids aur invalid nesting handle karni padti hai. Tabs ka visual switch banana full accessible tabs implementation ke equal nahi hai.

```jsx
const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button role="tab" aria-selected={active === value}
      tabIndex={active === value ? 0 : -1}
      onClick={() => setActive(value)}>
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { active } = useContext(TabsContext);
  return active === value ? <div role="tabpanel">{children}</div> : null;
}
```

Consumer ab flexible order/nesting mein pieces arrange kar sakta hai: `<Tabs><TabList><Tab value="a">A</Tab></TabList><TabPanel value="a">...</TabPanel></Tabs>`. Lekin `Tab`/`TabPanel` ko `Tabs` provider ke bahar use karoge to `useContext(TabsContext)` `null` return karega — production code mein isliye context missing hone par clear error throw karne wala custom hook likhna better hai, jaise `useTabsContext()` jo `null` par `throw new Error(...)` kare.

Render prop function caller ko data ke basis par rendering customize karne deta hai, jaise `renderItem(item)`:

```jsx
function DataList({ items, renderItem, renderEmpty }) {
  if (items.length === 0) return renderEmpty ? renderEmpty() : <p>No items.</p>;
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

// Usage
<DataList
  items={topics}
  renderItem={topic => <span>{topic.title} · {topic.minutes} min</span>}
  renderEmpty={() => <p>No topics match this filter.</p>}
/>
```

`DataList` ko individual topic ki display concerns ka pata nahi hai — woh sirf iteration aur empty-state contract own karta hai; caller decide karta hai ki har item kaisa dikhega. Higher-order component isi tarah component ko wrap karke behavior add karta hai, jaise `withLoadingBoundary(Component)`, lekin naming collisions aur wrapped-component ref forwarding jaise gotchas laata hai. Custom hooks reusable stateful logic ke liye often direct alternative hain, lekin hooks JSX layout share nahi karte. Hook calls separate state instances create karte hain; shared store/context ke bina state automatically shared nahi hoti.

## Forwarding refs and DOM props

Reusable input/button jaise components ko parent kabhi focus karna chahta hai ya measurement lena chahta hai. Custom component par directly `ref` prop pass karna DOM node nahi deta jab tak component `forwardRef` (ya React 19+ mein function component ka second `ref` parameter) explicitly implement na kare:

```jsx
const TextField = forwardRef(function TextField({ label, ...inputProps }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} {...inputProps} />
    </label>
  );
});

// Parent
const inputRef = useRef(null);
<TextField label="Search" ref={inputRef} />;
// inputRef.current.focus() ab actual <input> DOM node par kaam karega
```

Common mistake yeh hai ki wrapper `{...inputProps}` spread nahi karta aur sirf named props (jaise `value`, `onChange`) manually forward karta hai — naya consumer `placeholder` ya `maxLength` pass kare to woh silently drop ho jaata hai. Doosri taraf, custom props (jaise internal `isCompact`) ko bina filter kiye DOM element tak spread karna React ko unknown-attribute warning deta hai; sirf recognized HTML attributes ko forward karo.

## Styling choices

CSS Modules class names scope karte hain aur normal CSS features preserve karte hain. Tailwind utility classes composition ko markup ke paas rakhti hain; repeated design patterns ke liye components aur tokens phir bhi chahiye. Styled Components styling ko component boundary se connect karta hai; generated styles, runtime/build setup aur server rendering behavior version ke hisaab se evaluate karo. Ek app mein consistent strategy maintain karna har available styling tool mix karne se easier hota hai.

Design tokens color, spacing, typography aur radius ko consistent banate hain. Theme values CSS custom properties mein rakhna straightforward hai. Focus-visible states, contrast, reduced motion aur zoom support ko design ka part rakho. Error ko sirf red color se communicate mat karo; text bhi do.

## Gotchas

- Abstraction bahut jaldi banane se `isCompact`, `isSpecial`, `isLegacy` jaise unclear boolean props accumulate hote hain; combinations ka matrix jald hi untestable ho jaata hai. Ek `variant` string prop (jaise `"default" | "compact" | "danger"`) often clearer hota hai.
- DOM props spread karte waqt unsupported internal props filter karo — nahi to React console mein "unknown prop" warning dega aur wahi attribute HTML mein literally chala jaayega.
- Modal ko sirf fixed-position div banana enough nahi: focus entry (open hote hi modal ke andar focus jaana), focus trap (Tab se bahar na nikal paana), Escape se close aur focus restoration (close hone par trigger button par wapas focus) define karo.
- `className` merge karte waqt caller ka class internal default class ko overwrite kar sakti hai agar order galat ho; consistent merge order (defaults pehle, caller override baad mein) rakho.
- Compound component ka context provider missing hone par child silently `null`/crash de sakta hai; clear runtime error dena debugging fast karta hai.

## Where this shows up in a real app

Design system ka `Button` component often sabse zyada reused piece hota hai — primary CTA, destructive delete action, disabled loading state, icon-only variant, sab isi ek component se aate hain. Team `variant`, `size` aur `isLoading` jaise limited, well-documented props rakhti hai aur baaki customization ko `children`/slots par chhodti hai. Isi component ko har naye feature ke liye ek naya boolean prop de dena (`isCheckoutButton`, `isProfileSaveButton`) component ko unmaintainable bana deta hai — yehi wajah hai ki composition (children, slots, variant prop) ko flags accumulate karne se better maana jaata hai.

## Practice

Card ke three real uses compare karo aur common shell extract karo. Ek use mein actions absent rakho. Keyboard aur 200% zoom par layout verify karo. Explain karo ki kaunsi customization slot honi chahiye aur kaunsi explicit variant. Compound Tabs component ko accessible banao: arrow keys se tabs ke beech move karo, `aria-selected` sync rakho aur panel ko sahi `Tab` se `aria-controls`/`id` se associate karo.

## Interview questions — bolkar practice karo

**Q. Composition inheritance se React mein useful kyun hai?** UI pieces ko props/children se combine karna explicit data flow deta hai aur rigid component inheritance hierarchy avoid karta hai.

**Q. Custom hook component state share karta hai?** Logic share karta hai; individual calls ki state separate hoti hai jab tak shared external source use na ho.

## Depth walkthrough — andar kya ho raha hai?

### Component API ko actual variation se derive karo

Card ko title/body/footer slots chahiye toh children/props se compose karo. Har visual combination ke liye isBlue/isCompact/isSpecial jaise flags add karte jaoge toh contradictory combinations multiply hongi. Finite variant prop aur clear slots often easier contract hain.

Wrapper button disabled, type, accessible name, onClick aur ref support kare toh forwarding deliberate ho. `type` omit karne par form ke andar button submit ho sakta hai. Custom styling component native semantics retain kare; div ko clickable banakar keyboard behavior dobara implement karna extra responsibility hai.

Prop spread order matters: `<button {...props} type="button" />` caller ka type override karta hai; reverse order caller ko override karne deta hai. Kaunsa field component guarantee karega aur kaunsa caller customize karega, document karo. Arbitrary internal configuration DOM par forward mat karo.

**Practice:** Dialog footer ke Cancel/Save actions compose karo. Cancel form submit na kare, Save pending mein disable ho aur focus indicator visible rahe. Appearance change se action contract break na ho. CSS choice ka success sirf screenshot nahi; responsive layout, focus aur disabled behavior bhi verify karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Profile aur lesson list ke liye ek Panel design karo bina isProfile/isLessons switches ke. Public inputs kya honge?

> **Hint — chhota ishara:** Har domain ka logic Panel mein bharne ke bajay caller ko content dene do.

**Answer guide — pehle khud karo, phir compare karo:** Title, children aur optional actions slots shared shell cover karte hain. Profile/lesson components apna content den. Domain fetching aur validation shell ke bahar rakho. Specialized prop tab add karo jab multiple uses mein real shared behavior dikhe.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React passing JSX as children](https://react.dev/learn/passing-props-to-a-component) composition explain karta hai. [React custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) logic sharing ka reference hai.
