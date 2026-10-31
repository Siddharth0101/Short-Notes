---
id: react-jsx-props
title: First React component JSX and props
track: react
order: 1
level: Foundation
minutes: 3
summary: Component — props se UI return karne wala function.
tags: fundamentals, react, jsx, props
---

## Quick revision

> Revision target — Props se UI derive karo; component contract, event handler aur render purity explain karo.

- Component — props se UI return karne wala function.
- JSX — JS mein UI syntax; expressions `{}` ke andar.
- Props — parent se input; child mutate nahi karta.
- Children — nested content ko composition ke liye pass karo.
- Render — pure calculation; network/DOM side effects render mein mat chalao.
- Capital name — custom component `<Card />`; lowercase tag native element.
- Fragment — extra DOM wrapper bina elements group karo.
- Key — siblings ki stable identity; array position se bachna jab list badalti ho.
- Event prop — handler pass karo: `onClick={save}`; `save()` render ke time call hota hai.
- JSX attributes — className aur htmlFor use; inline style JS object hota hai.
- Key prop — React identity ke liye; child ko ID chahiye toh separate prop do.

### Edge cases aur reasoning

- Renderable children — strings/numbers/elements/arrays render ho sakte; plain object ko directly child banana error, fields explicitly render karo.
- Prop default — destructured default undefined/missing par lagta, null par nahi; nullable input ka separate contract define karo.
- Expression boundary — JSX braces expression leti hain; statements ko render se pehle calculate ya component mein extract karo.

## Example se samjho

```jsx
function Greeting({ name = "Learner", children }) {
  return <section><h2>Hello, {name}</h2>{children}</section>;
}
// <Greeting name="Asha"><button>Start</button></Greeting>
```

- Trace — parent `name` aur nested content deta hai; child props ko read karke UI return karta hai.
- Catch — default sirf missing/undefined `name` par lagta hai; `null` ko automatically `"Learner"` nahi banata.
- Check — do instances ko alag names do; ek instance ka render doosre ke input ko mutate nahi kare.

## Recall aur practice

- Sawal — Greeting({name}) mein props destructuring parent object mutate karti hai?
- Jawaab — Nahi; local binding padhti hai. Nested object mutate karo toh shared data badal sakta hai, jo avoid karna chahiye.
- Khud try karo — ProductCard banao; required title, optional description, children action aur two independent instances ka output verify karo.

## Practice questions

### Easy · Lowercase component kyun render nahi hua?

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

- Result — React `<card>` naam ka unknown HTML tag banata hai; `card` function call hi nahi hota.
- Rule — lowercase JSX tag = DOM element, Capitalized = component.
- Fix — `function Card()` aur `<Card />`.

</details>

### Easy · `0` screen par kyun dikh raha hai?

```jsx
function Inbox({ count }) {
  return <div>{count && <Badge value={count} />}</div>;
}
// <Inbox count={0} />
```

<details>
<summary>Answer</summary>

- Output — screen par `0`.
- Kyun — `0 && ...` `0` return karta hai, aur React number render karta hai (sirf `false`, `null`, `undefined`, `true` kuch render nahi karte).
- Fix — `{count > 0 && <Badge value={count} />}` ya ternary.

</details>

### Medium · Child ne props mutate kiye

```jsx
function AddItem({ items }) {
  return <button onClick={() => items.push('new')}>Add</button>;
}
```

Click par UI update kyun nahi hota, aur sahi pattern kya hai?

<details>
<summary>Answer</summary>

- Problem — props read-only contract hain; `push` parent ka array mutate karta hai par React ko koi state update nahi milta, isliye re-render nahi.
- Fix — parent state own kare aur callback de:

```jsx
function Parent() {
  const [items, setItems] = useState([]);
  return <AddItem onAdd={(item) => setItems((prev) => [...prev, item])} />;
}
```

- Rule — data neeche props se, events upar callbacks se.

</details>

### Medium · "Objects are not valid as a React child"

```jsx
const user = { name: 'Asha', age: 24 };
return <p>{user}</p>;
```

Error kyun aaya? Kaunsi values render ho sakti hain?

<details>
<summary>Answer</summary>

- Kyun — plain object ka koi standard render form nahi hota.
- Fix — `<p>{user.name}</p>` ya `JSON.stringify(user)` debug ke liye.
- Renderable — strings, numbers, elements, arrays of these; `null`/`undefined`/booleans kuch nahi dikhate.

</details>

### Hard · Reusable `Card` with children aur rest props

`Card` banao: `title` required, `footer` optional, `children` content, `variant` default `'plain'`, aur baaki props (`id`, `aria-*`, `className`) root element tak jaayein bina default class tode.

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

- Order — `{...rest}` pehle, `className` baad mein, taaki caller ka `className` merge ho, replace na kare.
- Default — destructuring default sirf `undefined` par lagta hai.
- Children — composition: caller kuch bhi andar rakh sakta hai, `Card` ko content pata hone ki zaroorat nahi.

</details>

## Sources — aur padhne ke liye

- [First React component](https://react.dev/learn/your-first-component)
- [props](https://react.dev/learn/passing-props-to-a-component)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/01-react-jsx-props.md)
