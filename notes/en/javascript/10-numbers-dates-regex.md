---
id: js-numbers-dates-regex
title: Numbers dates strings and regular expressions
track: javascript
order: 10
level: Intermediate
minutes: 6
summary: Numbers — a JS `number` is floating point; `0.1 + 0.2` is not exactly `0.3`.
tags: numbers, dates, intl, regex, strings, timers
---

## Quick revision

> Revision target — Make numeric precision, the accepted text format and date interpretation separate validation decisions.

- Numbers — a JS `number` is floating point; `0.1 + 0.2` is not exactly `0.3`.
- Safe integer — check `Number.isSafeInteger` for the exact integer range.
- `BigInt` — large integers; it does not mix directly with `number` in arithmetic.
- `parseInt` — parses a prefix integer; not enough alone for full input validation.
- Rounding — for money, keep the smallest unit and a clear rounding rule.
- Date — a timestamp is one instant; the output can change with the display timezone.
- `Intl` — formats numbers/dates/currency according to the locale.
- Regex — matches a text pattern; untrusted patterns can cause expensive matching.
- Global regex — with `g`/`y`, `test()` changes `lastIndex`.
- Timer — the delay is a minimum wait; the exact execution time is not guaranteed.
- `Number.isFinite` — accepts only a finite number; it does not coerce a string.
- Date subtraction — subtract two Date objects to get the difference in milliseconds.
- Regex anchors — for full input validation, mind the start/end boundaries and newline behaviour.

### Regex syntax

- Literal — `/abc/` for a fixed pattern; `new RegExp(...)` for dynamic text.
- Escaping — in a constructor string the backslash may need extra escaping.
- `test`/`exec` — a boolean check / match details; on strings: match, search, replace, split.
- Flags — `i` case-insensitive, `g` all matches, `m` line anchors, `s` dot-newline, `u` Unicode mode.
### Regex pattern building

- Classes — `\d` digit, `\w` word-character class, `\s` whitespace; the uppercase variant is the negation.
- Quantifier — `*` zero+, `+` one+, `?` optional, `{m,n}` a repeat range.
- Anchors — `^` start, `$` end, `\b` word boundary; flags affect their meaning.
- Group — `(x)` capture, `(?:x)` non-capture, `x|y` alternatives.
### Regex captures and matching

- Backreference — `\1` matches the previously captured text again.
- Lookaround — checks a surrounding condition; it does not consume the matched text.
- Greedy/lazy — a quantifier matches as much as possible by default; a `?` suffix makes the search lazy.
- Replace — `$1` reuses a capture; a callback gives a dynamic replacement.
- Unicode — Unicode-aware matching for emoji/code points; a grapheme is a separate concept.
- ReDoS — untrusted/ambiguous patterns can cause expensive backtracking.
- Capture names — named groups can make a result more readable than numbered positions.
- Zero-length match — ensure progress in a manual global exec loop; an empty match can cause an infinite loop.
- Character set — [abc] is one of the listed characters; [^abc] is anything except them.
- Regex escaping — escape literal user text against regex metacharacters; do not treat raw input as a pattern.

### Numbers and timers

- Remainder — `%` gives the remainder; mind the sign with negative input.
- Separators — `1_000_000` is readable number syntax; the value is the same.
- Date constructor — the numeric month is zero-based; keep parsing/timezone explicit.
- Countdown — calculate from the deadline minus the current time; counting interval ticks drifts.
- Timer cleanup — clearTimeout/clearInterval with the owned ID; match it to the component/request lifecycle.

### Regex matching

- `matchAll` — an iterator over the matches of a global regex; captures are included.
- Lookahead — (?=x) positive, (?!x) negative; lookbehind — (?<=x)/(?<!x).

### Edge cases and reasoning

- Elapsed clock — performance.now for monotonic elapsed time; Date.now can change with wall-clock adjustments.
- Calendar versus instant — a local date and a UTC timestamp serve different purposes; around DST a calendar day is not always 24 hours.
- Tolerance — choose the tolerance of a floating-point comparison from the domain/scale; Number.EPSILON is not enough for every magnitude.

## Understand it with an example

```js
function readQuantity(raw) {
  if (!/^[0-9]+$/.test(raw)) return null;
  const quantity = Number(raw);
  return Number.isSafeInteger(quantity) ? quantity : null;
}
console.log(readQuantity("12"), readQuantity("12px")); // 12 null
```

- Contract — only digits are allowed in the input string; negative, decimal and whitespace are rejected intentionally.
- Catch — the regex checks the format; the safe-integer check verifies the numeric range. One check does not replace the other.
- Check — try `"0"`, `"01"`, `""` and an unsafe large integer; the rule for accepting leading zeros is explicit here.

## Recall and practice

- Question — Does a successful parseInt("12px", 10) prove that the full numeric input is valid?
- Answer — No; the prefix 12 is parsed. The whole accepted format and a finite result need separate validation.
- Try it yourself — Calculate a countdown from the deadline; verify the remaining time is correct after a delayed callback, and that the timer is cleaned up at zero.

## Practice questions

### Easy · Floating point comparison

```js
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(2));
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
```

<details>
<summary>Answer</summary>

- Output — `false`, `'0.30'` (a string), `true`.
- Why — `0.1` and `0.2` are not stored exactly in binary; the sum becomes `0.30000000000000004`.
- Money — keep an integer in paise/cents; format only for display.

</details>

### Easy · Edge cases of rounding

```js
console.log(Math.round(2.5), Math.round(-2.5), Math.trunc(-4.7), (1.005).toFixed(2));
```

<details>
<summary>Answer</summary>

- Output — `3 -2 -4 '1.00'`.
- `Math.round` — moves `.5` towards `+∞`, so `-2.5` → `-2`.
- `trunc` — cuts off the decimal part; `floor(-4.7)` would be `-5`.
- `1.005` — is actually stored as `1.00499...`, hence `'1.00'`.

</details>

### Medium · `lastIndex` of a global regex

```js
const re = /a/g;
console.log(re.test('a'), re.test('a'), re.test('a'));
```

<details>
<summary>Answer</summary>

- Output — `true false true`.
- Why — a regex with the `g`/`y` flag remembers `lastIndex`; the second call searches from index 1, fails, and `lastIndex` resets to 0.
- Fix — do not use `g` when you only need a check; to reuse it set `re.lastIndex = 0`; use `matchAll` for all matches.

</details>

### Medium · Date overflow

```js
const d = new Date(2026, 0, 31); // 31 Jan 2026, local time
d.setMonth(1);
console.log(d.getMonth(), d.getDate());
```

<details>
<summary>Answer</summary>

- Output — `2 3`; "31 February" overflowed into 3 March (2026 is not a leap year).
- Month index — `0` = January; `getMonth()` is 0-based too.
- Fix — set the date to `1` before changing the month, then clamp to the last day of the month.
- Parsing catch — `new Date('2026-03-01')` is UTC midnight, `new Date(2026, 2, 1)` is local midnight.

</details>

### Hard · Validate a real calendar date

Write `parseISODate('YYYY-MM-DD')`: capture the format with named groups and reject (`null`) an impossible date such as `2026-02-30`.

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

- Round-trip check — `Date` overflows (30 Feb → 2 Mar), so the parts are compared back.
- UTC — the date does not shift with the local timezone/DST.
- Regex safety — anchors and fixed-length groups; nested quantifiers like `/(a+)+$/` can cause ReDoS (catastrophic backtracking).

</details>

## Sources — further reading

- [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [MDN regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/10-numbers-dates-regex.md)
