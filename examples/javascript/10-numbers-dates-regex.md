# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Currency and time display

```js
const amountInPaise = 129900;
const money = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR"
});
console.log(money.format(amountInPaise / 100));

const instant = new Date("2026-01-15T10:00:00Z");
const display = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata"
});
console.log(display.format(instant));
```

## Safer rounding and relative time

```js
function roundToCents(amount) {
  return Math.round(amount * 100) / 100;
}
console.log(roundToCents(19.999)); // 20
console.log((0.1 + 0.2).toFixed(2)); // "0.30" -- a string, not a number

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
console.log(rtf.format(-3, "day")); // "3 days ago"
console.log(rtf.format(1, "hour")); // "in 1 hour"
```

## Regular expressions and strings

```js
const topicSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
console.log(topicSlug.test("react-state")); // true
console.log(topicSlug.test("React State")); // false
const words = "  Learn   JavaScript  ".trim().split(/\s+/);
console.log(words); // ["Learn", "JavaScript"]
```

```js
const isoDate = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;
const match = "2026-09-11".match(isoDate);
console.log(match.groups.year, match.groups.month); // 2026 09
```
