---
id: react-components-rendering
title: Components JSX and the render cycle
track: react
order: 3
level: Foundation
minutes: 4
summary: Render — next UI calculate; commit — DOM updates apply.
tags: components, jsx, props, rendering, keys
visual: react-render
---

## Quick revision

> Revision target — Render, commit aur component identity ko separate samjho; list reorder mein state kis item ki hai track karo.

- Render — next UI calculate; commit — DOM updates apply.
- Reconciliation — type, position aur key se identity match hoti hai.
- Stable key — item ID use karo; random key har render remount kar sakti hai.
- State reset — component type/key badalne se local state reset ho sakti hai.
- Conditional UI — `0 && <Item />` zero dikha sakta hai.
- Strict Mode — development mein extra checks; render/effect ko safe rakho.
- Class lifecycle — mount/update/unmount; Hooks mein responsibilities ke hisaab se socho.
- Error boundary — descendant render errors ke fallback; har async/event error nahi pakadti.
- Nested component definition — parent render ke andar component type define karna state reset kara sakta hai.
- Same-value update — React Object.is comparison se redundant state update skip kar sakta hai.
- Portal — DOM location badalti hai; context aur React event propagation parent tree follow karte hain.

### Class lifecycle

- Mount — constructor → render → componentDidMount; children commit before parent didMount.
- Update — render ke baad componentDidUpdate; repeated state update se loop avoid.
- Unmount — componentWillUnmount mein owned listeners/timers cleanup.
- `super(props)` — constructor mein props ko parent tak pass karo.
- Update guard — componentDidUpdate mein setState condition ke bina infinite update loop ho sakta hai.
- Derived data — props se calculate ho toh extra duplicated class state avoid.
- Snapshot lifecycle — DOM mutation se pehle measurement aur after-update adjustment ka ownership clear.

### Edge cases aur reasoning

- Render restart — React render work repeat/discard kar sakta hai; render mein network writes ya global mutation mat karo.
- Key scope — key sibling list ke andar unique; same ID unrelated lists mein valid ho sakta hai.
- Hydration contract — server/client initial markup compatible rakho; random/time/browser-only state se mismatch avoid karo.

## Example se samjho

```jsx
function TodoList({ todos }) {
  return todos.map((todo) => <TodoRow key={todo.id} todo={todo} />);
}
```

- Setup — har todo ka stable unique sibling `id` ho; `TodoRow` apna editable draft rakh sakta hai.
- Trace — A/B rows ko B/A reorder karo; stable keys se React ko item identities match karne ka signal milta hai.
- Catch — index key positions ko identify karti hai; reordered data ke saath row-local draft wrong item par dikh sakta hai.
- Check — deliberate key change state reset kar sakta hai; random key har render generate mat karo.

## Recall aur practice

- Sawal — Editable rows mein index key aur reorder se input galat item par kyun ja sakta hai?
- Jawaab — React position identity reuse karta hai; data item move hua, local component state purani position par reh sakti hai.
- Khud try karo — Stable-ID rows edit/reorder karo; draft correct item par rahe aur intentional key change se state reset verify karo.

## Practice questions

### Easy · Index key ka bug

List ke har row mein `<input>` hai aur `key={index}` diya hai. Pehla item delete karne par inputs ki typed values galat rows mein dikhti hain. Kyun?

<details>
<summary>Answer</summary>

- Kyun — delete ke baad indexes shift hote hain; React key `0` wale component (aur uski DOM input state) ko ab doosre item ke saath reuse karta hai.
- Fix — stable unique id: `key={item.id}`.
- Index tab theek — list kabhi reorder/insert/delete nahi hoti aur rows mein local state nahi.

</details>

### Easy · Same value set karna

`count` already `5` hai aur `setCount(5)` call hua. Kya child components aur effects dobara chalenge?

<details>
<summary>Answer</summary>

- Result — React `Object.is(5, 5)` dekhkar update bail out karta hai; children re-render aur effects nahi chalte.
- Note — kabhi-kabhi component function ek baar call ho sakta hai bina commit ke; isliye render pure rakho.
- Objects — naya object (same content) diya toh update hoga, kyunki reference alag hai.

</details>

### Medium · Component ke andar component define karna

```jsx
function Form() {
  const [text, setText] = useState('');
  function Field() {
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <Field />;
}
```

Har keystroke par input focus kyun kho deta hai?

<details>
<summary>Answer</summary>

- Kyun — har render par `Field` naya function (naya component type) hai; React purana subtree unmount karke naya mount karta hai → focus aur DOM state gayab.
- Fix — `Field` ko bahar top-level par define karo aur props pass karo: `<Field value={text} onChange={setText} />`.

</details>

### Medium · `key` se state reset

`<Profile userId={id} />` mein naya user select karne par purane user ka form draft dikh raha hai. Effect ke bina reset kaise karoge?

<details>
<summary>Answer</summary>

- Fix — `<Profile key={id} userId={id} />`.
- Kyun — key badalne par React use alag component instance maanta hai: purana unmount, naya fresh state ke saath mount.
- Effect se reset (`useEffect(() => setDraft(''), [id])`) ek render purana data dikhata hai aur extra render karata hai.

</details>

### Hard · Error boundary banao

Error boundary kya pakadti hai, kya nahi? Ek boundary likho jo "Retry" se reset ho sake.

<details>
<summary>Answer</summary>

```jsx
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    reportError(error, info.componentStack);
  }
  render() {
    if (this.state.error)
      return (
        <div role="alert">
          <p>Kuch galat hua.</p>
          <button onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      );
    return this.props.children;
  }
}
```

- Pakadti hai — children ke render, lifecycle aur constructors ke errors.
- Nahi pakadti — event handlers, `setTimeout`/async code, server rendering, aur khud boundary ke errors. Unhe `try/catch` ya state se handle karo.
- Reset — `setState` ya parent se `key` badalkar; underlying data fix na ho toh error dobara aayega.

</details>

## Sources — aur padhne ke liye

- [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

- [React thinking in React](https://react.dev/learn/thinking-in-react)
- [React preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/03-components-rendering.md)
