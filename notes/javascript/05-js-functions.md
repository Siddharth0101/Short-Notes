---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 3
summary: Function — reusable kaam; inputs lo aur result return karo.
tags: fundamentals, js, functions
---

## Quick revision

- Function — reusable kaam; inputs lo aur result return karo.
- Parameter — definition ka naam; argument — call ki actual value.
- `return` — result deta hai aur function se turant bahar nikalta hai.
- No return — normal function ka result `undefined` hota hai.
- `console.log` — screen par dikhata hai; caller ko result return nahi karta.
- Default parameter — argument missing/undefined ho tab default lagta hai.
- Function declaration — apne scope mein declaration se pehle call ho sakti hai.
- Arrow — concise function; apna `this` nahi hota.
- Pure function — same input par same output; outside state change nahi karti.
- Rest parameter — `(...args)` extra arguments ko array mein collect karta hai.
- Higher-order function — function ko input le ya function return kare.
- Early return — `return` ke baad same function ka remaining code skip hota hai.

### Function style

- Declarative — desired transformation bolo; unnecessary mutation se bacho.
- Function expression — initialization se pehle call nahi; const/let TDZ aur var undefined ka behavior alag.
- IIFE — function define karke turant call; isolated setup/scope ke liye.
- Currying — f(a, b) ko f(a)(b) jaise staged calls mein badlo.
- Callback — function ko baad mein invoke karne ke liye pass karo; fn aur fn() alag.

### Edge cases aur reasoning

- Argument mutation — object property update caller ko dikhti hai; local parameter ko reassign karna caller binding nahi badalta.
- Arrow object return — () => ({id: 1}) object return karta hai; braces bina parentheses function body samjhi jaati hain.
- Default with null — f(x = 5) mein f(undefined) default leta hai; f(null) null rakhta hai.

## Recall aur practice

- Sawal — function reset(x) { x = []; } caller ki array ko empty kyun nahi karta?
- Jawaab — Parameter local binding hai; reassign se caller reference nahi badalta. Mutation ya returned replacement ka explicit contract do.
- Khud try karo — Pure calculateTotal(items, taxRate) likho; default tax, empty items, invalid price aur inputs unchanged check karo.

## Sources — aur padhne ke liye

- [MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/05-js-functions.md)
