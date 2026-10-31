---
id: js-numbers-dates-regex
title: Numbers dates strings and regular expressions
track: javascript
order: 10
level: Intermediate
minutes: 6
summary: Numbers — JS `number` floating point hai; `0.1 + 0.2` exactly `0.3` nahi.
tags: numbers, dates, intl, regex, strings, timers
---

## Quick revision

> Revision target — Numeric precision, accepted text format aur date interpretation ko separate validation decisions banao.

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

### Edge cases aur reasoning

- Elapsed clock — performance.now monotonic elapsed time ke liye; Date.now wall-clock adjustments se badal sakta hai.
- Calendar versus instant — local date aur UTC timestamp ka purpose alag; DST ke around ek calendar day hamesha 24 hours nahi.
- Tolerance — floating-point comparison ka tolerance domain/scale se choose; Number.EPSILON har magnitude ke liye enough nahi.

## Example se samjho

```js
function readQuantity(raw) {
  if (!/^[0-9]+$/.test(raw)) return null;
  const quantity = Number(raw);
  return Number.isSafeInteger(quantity) ? quantity : null;
}
console.log(readQuantity("12"), readQuantity("12px")); // 12 null
```

- Contract — input string mein digits only allowed; negative, decimal aur whitespace intentionally reject hote hain.
- Catch — regex format check karta hai; safe-integer check numeric range verify karta hai. Ek check doosre ka replacement nahi.
- Check — `"0"`, `"01"`, `""` aur unsafe large integer try karo; leading zeros accept karne ka rule yahan explicit hai.

## Recall aur practice

- Sawal — parseInt("12px", 10) successful hone se full numeric input valid prove hota hai?
- Jawaab — Nahi; prefix 12 parse hota hai. Poore accepted format aur finite result ki separate validation chahiye.
- Khud try karo — Countdown ko deadline se calculate karo; delayed callback ke baad remaining time correct aur zero par timer cleanup verify karo.

## Practice questions

### Easy · Floating point comparison

```js
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(2));
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
```

<details>
<summary>Answer</summary>

- Output — `false`, `'0.30'` (string), `true`.
- Kyun — `0.1` aur `0.2` binary mein exact store nahi hote; sum `0.30000000000000004` banta hai.
- Money — paise/cents mein integer rakho; display par hi format karo.

</details>

### Easy · Rounding ke edge cases

```js
console.log(Math.round(2.5), Math.round(-2.5), Math.trunc(-4.7), (1.005).toFixed(2));
```

<details>
<summary>Answer</summary>

- Output — `3 -2 -4 '1.00'`.
- `Math.round` — `.5` ko `+∞` ki taraf le jaata hai, isliye `-2.5` → `-2`.
- `trunc` — decimal part kaat deta hai; `floor(-4.7)` hota toh `-5`.
- `1.005` — actually `1.00499...` store hota hai, isliye `'1.00'`.

</details>

### Medium · Global regex ka `lastIndex`

```js
const re = /a/g;
console.log(re.test('a'), re.test('a'), re.test('a'));
```

<details>
<summary>Answer</summary>

- Output — `true false true`.
- Kyun — `g`/`y` flag wala regex `lastIndex` yaad rakhta hai; doosri call index 1 se search karti hai, fail hokar `lastIndex` 0 reset hota hai.
- Fix — sirf check karna ho toh `g` mat lagao; reuse karna ho toh `re.lastIndex = 0`; saare matches ke liye `matchAll`.

</details>

### Medium · Date overflow

```js
const d = new Date(2026, 0, 31); // 31 Jan 2026, local time
d.setMonth(1);
console.log(d.getMonth(), d.getDate());
```

<details>
<summary>Answer</summary>

- Output — `2 3`; "31 February" overflow hokar 3 March ban gaya (2026 leap year nahi).
- Month index — `0` = January; `getMonth()` bhi 0-based hai.
- Fix — month badalne se pehle date ko `1` par set karo, phir month ke last day se clamp karo.
- Parsing catch — `new Date('2026-03-01')` UTC midnight hai, `new Date(2026, 2, 1)` local midnight.

</details>

### Hard · Real calendar date validate karo

`parseISODate('YYYY-MM-DD')` likho: format named groups se pakdo aur `2026-02-30` jaisi impossible date reject karo (`null`).

<details>
<summary>Answer</summary>

```js
function parseISODate(text) {
  const match = /^(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})$/.exec(text);
  if (!match) return null;
  const y = Number(match.groups.y);
  const m = Number(match.groups.m);
  const d = Number(match.groups.d);
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  return valid ? date : null;
}
```

- Round-trip check — `Date` overflow karta hai (30 Feb → 2 Mar), isliye parts wapas compare kiye.
- UTC — local timezone/DST se date shift nahi hoti.
- Regex safety — anchors aur fixed-length groups; `/(a+)+$/` jaise nested quantifiers ReDoS (catastrophic backtracking) de sakte hain.

</details>

## Sources — aur padhne ke liye

- [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [MDN regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/10-numbers-dates-regex.md)
