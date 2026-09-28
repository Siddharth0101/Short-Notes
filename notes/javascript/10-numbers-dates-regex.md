---
id: js-numbers-dates-regex
title: Numbers dates strings and regular expressions
track: javascript
order: 10
level: Intermediate
minutes: 3
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

### Regex syntax

- Literal — fixed pattern ke liye `/abc/`; dynamic text ke liye `new RegExp(...)`.
- Escaping — constructor string mein backslash ko extra escape karna pad sakta hai.
- `test`/`exec` — boolean check / match details; strings par match, search, replace, split.
- Flags — `i` case-insensitive, `g` all matches, `m` line anchors, `s` dot-newline, `u` Unicode mode.
### Regex pattern building

- Classes — `\d` digit, `\w` word-character class, `\s` whitespace; uppercase variant negation.
- Quantifier — `*` zero+, `+` one+, `?` optional, `{m,n}` repeat range.
- Anchors — `^` start, `$` end, `\b` word boundary; flags meaning affect karte hain.
- Group — `(x)` capture, `(?:x)` non-capture, `x|y` alternatives.
### Regex captures aur matching

- Backreference — `\1` pehle captured text ko dobara match karta hai.
- Lookaround — aas-paas ki condition check; matched text consume nahi karta.
- Greedy/lazy — quantifier default zyada match; `?` suffix se lazy search.
- Replace — `$1` capture reuse; callback se dynamic replacement.
- Unicode — emoji/code points ke liye Unicode-aware matching; grapheme alag concept hai.
- ReDoS — untrusted/ambiguous patterns se expensive backtracking ho sakti hai.
- Capture names — named groups result ko numbered positions se zyada readable bana sakte hain.
- Zero-length match — manual global exec loop mein progress ensure; empty match infinite loop kara sakta hai.
- Character set — [abc] ek listed character; [^abc] unke alawa.
- Regex escaping — literal user text ko matching regex metacharacters se escape karo; raw input ko pattern mat samjho.

### Numbers aur timers

- Remainder — `%` remainder deta hai; negative input ka sign dhyaan rakho.
- Separators — `1_000_000` readable number syntax; value same.
- Date constructor — numeric month zero-based; parsing/timezone explicit rakho.
- Countdown — deadline minus current time se calculate; interval ticks count karna drift karta hai.
- Timer cleanup — owned ID se clearTimeout/clearInterval; component/request lifecycle se match karo.

### Regex matching

- `matchAll` — global regex ke matches ka iterator; captures bhi milte hain.
- Lookahead — (?=x) positive, (?!x) negative; lookbehind — (?<=x)/(?<!x).

## Sources — aur padhne ke liye

- [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [MDN regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/10-numbers-dates-regex.md)
