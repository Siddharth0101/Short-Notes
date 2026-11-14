---
id: react-components-rendering
title: Components JSX and the render cycle
track: react
order: 3
level: Foundation
minutes: 4
summary: Render — calculate the next UI; commit — apply the DOM updates.
tags: components, jsx, props, rendering, keys
visual: react-render
---

## Quick revision

> Revision target — Understand render, commit and component identity separately; in a list reorder, track which item the state belongs to.

- Render — calculate the next UI; commit — apply the DOM updates.
- Reconciliation — identity is matched by type, position and key.
- Stable key — use the item's ID; a random key can remount on every render.
- State reset — changing the component type/key can reset local state.
- Conditional UI — `0 && <Item />` can show a zero.
- Strict Mode — extra checks in development; keep render/effects safe.
- Class lifecycle — mount/update/unmount; with Hooks, think in terms of responsibilities.
- Error boundary — a fallback for render errors in descendants; it does not catch every async/event error.
- Nested component definition — defining a component type inside the parent's render can reset state.
- Same-value update — React can skip a redundant state update through an Object.is comparison.
- Portal — the DOM location changes; context and React event propagation follow the parent tree.

### Class lifecycle

- Mount — constructor → render → componentDidMount; children commit before the parent's didMount.
- Update — componentDidUpdate after render; avoid a loop from repeated state updates.
- Unmount — clean up owned listeners/timers in componentWillUnmount.
- `super(props)` — pass props up to the parent in the constructor.
- Update guard — setState in componentDidUpdate without a condition can cause an infinite update loop.
- Derived data — if it can be calculated from props, avoid extra duplicated class state.
- Snapshot lifecycle — be clear who owns the measurement before a DOM mutation and the adjustment after the update.

### Edge cases and reasoning

- Render restart — React can repeat/discard render work; do not make network writes or global mutations in render.
- Key scope — a key is unique within its sibling list; the same ID can be valid in unrelated lists.
- Hydration contract — keep the server/client initial markup compatible; avoid mismatches from random/time/browser-only state.

## Understand it with an example

```jsx
function TodoList({ todos }) {
  return todos.map((todo) => <TodoRow key={todo.id} todo={todo} />);
}
```

- Setup — every todo has a stable `id` unique among its siblings; `TodoRow` can keep its own editable draft.
- Trace — reorder rows A/B to B/A; stable keys give React the signal to match item identities.
- Catch — an index key identifies positions; with reordered data a row-local draft can appear on the wrong item.
- Check — a deliberate key change can reset state; do not generate a random key on every render.

## Recall and practice

- Question — In editable rows, why can an index key plus a reorder put the input on the wrong item?
- Answer — React reuses the position's identity; the data item moved, but the local component state can stay at the old position.
- Try it yourself — Edit/reorder rows with stable IDs; verify the draft stays with the correct item and that an intentional key change resets state.

## Practice questions

### Easy · The index-key bug

Every row of a list has an `<input>` and is given `key={index}`. After deleting the first item, the typed values of the inputs show up in the wrong rows. Why?

<details>
<summary>Answer</summary>

- Why — after the delete the indexes shift; React now reuses the component with key `0` (and its DOM input state) for a different item.
- Fix — a stable unique id: `key={item.id}`.
- An index is fine when — the list never reorders/inserts/deletes and the rows hold no local state.

</details>

### Easy · Setting the same value

`count` is already `5` and `setCount(5)` is called. Will child components and effects run again?

<details>
<summary>Answer</summary>

- Result — React sees `Object.is(5, 5)` and bails out of the update; children do not re-render and effects do not run.
- Note — sometimes the component function may be called once without a commit; so keep render pure.
- Objects — pass a new object (same content) and the update happens, because the reference differs.

</details>

### Medium · Defining a component inside a component

```jsx
function Form() {
  const [text, setText] = useState('');
  function Field() {
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <Field />;
}
```

Why does the input lose focus on every keystroke?

<details>
<summary>Answer</summary>

- Why — on every render `Field` is a new function (a new component type); React unmounts the old subtree and mounts a new one → focus and DOM state are gone.
- Fix — define `Field` outside at the top level and pass props: `<Field value={text} onChange={setText} />`.

</details>

### Medium · Resetting state with `key`

In `<Profile userId={id} />`, selecting a new user still shows the previous user's form draft. How do you reset it without an effect?

<details>
<summary>Answer</summary>

- Fix — `<Profile key={id} userId={id} />`.
- Why — when the key changes React treats it as a different component instance: the old one unmounts and the new one mounts with fresh state.
- Resetting through an effect (`useEffect(() => setDraft(''), [id])`) shows the old data for one render and causes an extra render.

</details>

### Hard · Build an error boundary

What does an error boundary catch, and what does it not? Write a boundary that can be reset with "Retry".

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

- It catches — errors from the render, lifecycle and constructors of its children.
- It does not catch — event handlers, `setTimeout`/async code, server rendering, or errors in the boundary itself. Handle those with `try/catch` or state.
- Reset — through `setState` or by changing a `key` from the parent; if the underlying data is not fixed, the error returns.

</details>

## Sources — further reading

- [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

- [React thinking in React](https://react.dev/learn/thinking-in-react)
- [React preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/03-components-rendering.md)
