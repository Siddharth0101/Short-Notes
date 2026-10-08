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

## Recall aur practice

- Sawal — Greeting({name}) mein props destructuring parent object mutate karti hai?
- Jawaab — Nahi; local binding padhti hai. Nested object mutate karo toh shared data badal sakta hai, jo avoid karna chahiye.
- Khud try karo — ProductCard banao; required title, optional description, children action aur two independent instances ka output verify karo.

## Sources — aur padhne ke liye

- [First React component](https://react.dev/learn/your-first-component)
- [props](https://react.dev/learn/passing-props-to-a-component)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/01-react-jsx-props.md)
