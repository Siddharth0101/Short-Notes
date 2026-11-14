---
id: react-jsx-props
title: First React component JSX and props
track: react
order: 1
level: Foundation
minutes: 3
summary: Component — a function that returns UI from props.
tags: fundamentals, react, jsx, props
---

## Quick revision

> Revision target — Derive UI from props; explain the component contract, the event handler and render purity.

- Component — a function that returns UI from props.
- JSX — UI syntax inside JS; expressions go inside `{}`.
- Props — input from the parent; the child does not mutate them.
- Children — pass nested content for composition.
- Render — a pure calculation; do not run network/DOM side effects in render.
- Capital name — a custom component is `<Card />`; a lowercase tag is a native element.
- Fragment — group elements without an extra DOM wrapper.
- Key — a stable identity among siblings; avoid the array position when the list changes.
- Event prop — pass the handler: `onClick={save}`; `save()` is called at render time.
- JSX attributes — use className and htmlFor; an inline style is a JS object.
- Key prop — for React's identity; give the child a separate prop if it needs the ID.

### Edge cases and reasoning

- Renderable children — strings/numbers/elements/arrays can render; making a plain object a child directly is an error, so render its fields explicitly.
- Prop default — a destructured default applies to undefined/missing, not to null; define a separate contract for nullable input.
- Expression boundary — JSX braces take an expression; compute statements before the render or extract them into a component.

## Understand it with an example

```jsx
function Greeting({ name = "Learner", children }) {
  return <section><h2>Hello, {name}</h2>{children}</section>;
}
// <Greeting name="Asha"><button>Start</button></Greeting>
```

- Trace — the parent provides `name` and the nested content; the child reads the props and returns UI.
- Catch — the default applies only to a missing/undefined `name`; it does not automatically turn `null` into `"Learner"`.
- Check — give two instances different names; rendering one instance must not mutate the other's input.

## Recall and practice

- Question — In Greeting({name}), does destructuring the props mutate the parent's object?
- Answer — No; it reads into a local binding. Mutating a nested object can change shared data, which should be avoided.
- Try it yourself — Build a ProductCard; verify a required title, an optional description, a children action and the output of two independent instances.

## Practice questions

### Easy · Why did the lowercase component not render?

```jsx
function card() {
  return <div className="card">Hello</div>;
}
export default function App() {
  return <card />;
}
```

<details>
<summary>Answer</summary>

- Result — React creates an unknown HTML tag named `<card>`; the `card` function is never called.
- Rule — a lowercase JSX tag = a DOM element, Capitalized = a component.
- Fix — `function Card()` and `<Card />`.

</details>

### Easy · Why is `0` showing on screen?

```jsx
function Inbox({ count }) {
  return <div>{count && <Badge value={count} />}</div>;
}
// <Inbox count={0} />
```

<details>
<summary>Answer</summary>

- Output — `0` on the screen.
- Why — `0 && ...` returns `0`, and React renders numbers (only `false`, `null`, `undefined` and `true` render nothing).
- Fix — `{count > 0 && <Badge value={count} />}` or a ternary.

</details>

### Medium · The child mutated its props

```jsx
function AddItem({ items }) {
  return <button onClick={() => items.push('new')}>Add</button>;
}
```

Why does the UI not update on click, and what is the right pattern?

<details>
<summary>Answer</summary>

- Problem — props are a read-only contract; `push` mutates the parent's array but React receives no state update, so there is no re-render.
- Fix — the parent owns the state and passes a callback:

```jsx
function Parent() {
  const [items, setItems] = useState([]);
  return <AddItem onAdd={(item) => setItems((prev) => [...prev, item])} />;
}
```

- Rule — data goes down through props, events go up through callbacks.

</details>

### Medium · "Objects are not valid as a React child"

```jsx
const user = { name: 'Asha', age: 24 };
return <p>{user}</p>;
```

Why did this error appear? Which values can be rendered?

<details>
<summary>Answer</summary>

- Why — a plain object has no standard rendered form.
- Fix — `<p>{user.name}</p>`, or `JSON.stringify(user)` for debugging.
- Renderable — strings, numbers, elements, arrays of these; `null`/`undefined`/booleans show nothing.

</details>

### Hard · Reusable `Card` with children and rest props

Build a `Card`: `title` is required, `footer` optional, `children` is the content, `variant` defaults to `'plain'`, and the remaining props (`id`, `aria-*`, `className`) reach the root element without breaking the default class.

<details>
<summary>Answer</summary>

```jsx
function Card({ title, footer, variant = 'plain', className = '', children, ...rest }) {
  return (
    <section {...rest} className={`card card--${variant} ${className}`.trim()}>
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
```

- Order — `{...rest}` first, `className` after, so the caller's `className` is merged, not replaced.
- Default — a destructuring default applies only to `undefined`.
- Children — composition: the caller can put anything inside, and `Card` does not need to know the content.

</details>

## Sources — further reading

- [First React component](https://react.dev/learn/your-first-component)
- [props](https://react.dev/learn/passing-props-to-a-component)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/01-react-jsx-props.md)
