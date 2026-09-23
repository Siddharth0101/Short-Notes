---
id: react-machine-coding
title: React machine coding and identity bugs
track: react
order: 11
level: Advanced
minutes: 1
summary: Machine coding — requirements → state → components → edge cases → verification.
tags: machine-coding, identity, keys, requests, accessibility
visual: react-identity
---

## Quick revision

- Machine coding — requirements → state → components → edge cases → verification.
- List identity — stable IDs; reorder par wrong input state move na ho.
- Search — debounce request, stale results ignore, empty/error states dikhao.
- Pagination — filters badlein toh page reset/clamp karo.
- Modal — focus trap, Escape close aur trigger par focus restore.
- OTP — paste, deletion, arrow keys aur labels handle karo.
- Tree UI — node IDs, recursive rendering aur expansion state separate rakho.
- Acceptance — happy path ke saath keyboard, slow request aur failure check karo.

## Sources — aur padhne ke liye

- [React identity and state](https://react.dev/learn/preserving-and-resetting-state)
- [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/11-machine-coding.md)
