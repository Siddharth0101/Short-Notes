---
id: js-numbers-dates-regex
title: Numbers dates strings and regular expressions
track: javascript
order: 10
level: Intermediate
minutes: 2
summary: Numbers — JS `number` floating point hai; `0.1 + 0.2` exactly `0.3` nahi.
tags: numbers, dates, intl, regex, strings, timers
---

## Quick revision

- Numbers — JS `number` floating point hai; `0.1 + 0.2` exactly `0.3` nahi.
- Safe integer — exact integer range ke liye `Number.isSafeInteger` check karo.
- `BigInt` — bade integers; `number` ke saath direct arithmetic mix nahi.
- `parseInt` — prefix integer parse; full input validation ke liye akela enough nahi.
- Rounding — money mein smallest unit aur clear rounding rule rakho.
- Date — timestamp ek instant; display timezone se output badal sakta hai.
- `Intl` — locale ke hisaab se number/date/currency format karta hai.
- Regex — text pattern match; untrusted patterns se expensive matching ho sakti hai.
- Global regex — `g`/`y` ke saath `test()` ka `lastIndex` badalta hai.
- Timer — delay minimum wait hai; exact execution time guarantee nahi.
- `Number.isFinite` — sirf finite number accept; string ko coerce nahi karta.
- Date subtraction — do Date objects subtract karo toh milliseconds ka difference.
- Regex anchors — full input validation mein start/end boundaries aur newline behavior dhyaan rakho.

## Sources — aur padhne ke liye

- [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [MDN regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/10-numbers-dates-regex.md)
