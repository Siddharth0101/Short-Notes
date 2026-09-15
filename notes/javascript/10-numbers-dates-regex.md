---
id: js-numbers-dates-regex
title: Numbers dates strings and regular expressions
track: javascript
order: 10
level: Intermediate
minutes: 26
summary: Number/date ko dikhane ka format aur storage mein uska meaning alag decisions hain.
tags: numbers, dates, intl, regex, strings, timers
---

## Mental model — simple soch

Data storage aur human display alag responsibilities hain. Amount ko formatted currency string ki form mein calculate mat karo. Timestamp ko user-friendly date ki form mein compare mat karo. Pehle machine representation par logic lagao, phir locale aur timezone ke hisaab se display banao. Date-only values, instants aur recurring local times ko ek hi concept mat samjho.

> **Core takeaway:** Number/date ko dikhane ka format aur storage mein uska meaning alag decisions hain.

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

JavaScript Number binary floating point hai. `0.1 + 0.2` exactly 0.3 nahi hota. Integer smallest units useful hain, lekin tax percentages aur exchange rates ke rounding rules explicitly define karo. Large integers safe integer range se bahar precision lose karte hain; BigInt integer arithmetic deta hai, Number ke saath arithmetic directly mix nahi hota. `parseInt("12px", 10)` 12 deta hai; strict numeric input validate karne ke liye yeh behavior misleading ho sakta hai.

Date timestamp milliseconds since epoch represent karta hai. Locale-specific date strings parse karna unreliable ho sakta hai; well-defined ISO input use karo. Date-only ISO string ko timestamp samajh kar local format karoge to kuch zones mein previous calendar day dikh sakta hai. Birthday ko year-month-day domain value treat karo. Performance durations ke liye monotonic `performance.now()` useful hai; wall clock adjust ho sakta hai.

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

`toFixed` string return karta hai; arithmetic mein dobara use karne se pehle `Number()` se convert karo, warna `+` concatenation ban jaayega, addition nahi. `Intl.RelativeTimeFormat` "3 days ago" jaisa human-friendly text locale ke hisaab se banata hai bina manual string templating ke — feed/comment timestamps mein directly useful hai.

## Regular expressions and strings

```js
const topicSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
console.log(topicSlug.test("react-state")); // true
console.log(topicSlug.test("React State")); // false
const words = "  Learn   JavaScript  ".trim().split(/\s+/);
console.log(words); // ["Learn", "JavaScript"]
```

Anchors entire input boundaries define karte hain; character classes allowed characters define karti hain; quantifiers repetition define karte hain. Capturing groups extraction ke liye use hote hain, non-capturing groups structure ke liye. Global/sticky regex par repeated `test()` calls lastIndex mutate kar sakti hain. User-controlled patterns aur nested ambiguous repetition excessive processing create kar sakte hain; input length bound karo. Email validity ko giant regex se fully prove karna practical nahi; verification flow alag concern hai.

Named capture groups positional index (`match[1]`) ki jagah readable extraction dete hain:

```js
const isoDate = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;
const match = "2026-09-11".match(isoDate);
console.log(match.groups.year, match.groups.month); // 2026 09
```

`.groups` object se named fields directly access hote hain; regex bade ho ya multiple groups ho to yeh index-based access se kaafi zyada maintainable hai.

## Timers and gotchas

Interval drift aur background-tab throttling ki wajah se tick count ko elapsed time mat samjho. Countdown mein deadline store karke each tick par remaining duration calculate karo. Strings immutable hain; replace new string return karta hai. String length UTF-16 code units count karta hai, necessarily visible characters nahi.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `toFixed(2)` return value ek number hai. **Why it breaks:** `toFixed` string deta hai; `total.toFixed(2) + 1` string concatenation karega, addition nahi, aur UI mein galat total dikh sakta hai. **Fix:** Display ke liye `toFixed` sirf last step par use karo, calculation ke liye plain number arithmetic rakho.
- **Wrong assumption:** `new Date("2026-01-15")` aur `new Date("2026-01-15T00:00:00")` same instant represent karte hain. **Why it breaks:** Date-only ISO string UTC midnight assume hoti hai, time-included string local timezone assume karti hai — display alag timezone mein different calendar day dikha sakta hai. **Fix:** Date-only values ko explicitly UTC treat karo ya Temporal jaisa explicit-timezone API use karo jab available ho.
- **Wrong assumption:** Ek regex ek baar likhne ke baad hamesha same performance degi, chahe input kitna bhi bada ho. **Why it breaks:** Nested quantifiers (jaise `(a+)+`) catastrophic backtracking create kar sakte hain user-controlled input par, jo request ko effectively hang kar deta hai. **Fix:** Pattern simplify karo, input length cap lagao, ya regex ko dedicated linting/testing tool se verify karo.

Real app mein invoice/order total display, "posted 3 days ago" style UI timestamps, aur signup form ka date-of-birth field — teeno isi chapter ke concepts par depend karte hain, aur yehi teen mistakes production mein galat total ya off-by-one-day bugs banate hain.

## Practice

Study-session timer banao jo pause/resume kare aur reload ke baad saved deadline se recover ho. Amount formatter aur slug validator ke invalid cases add karo. Timezone change karke display verify karo.

## Interview questions — bolkar practice karo

**Q. Intl timezone store karta hai?** Formatter display rules apply karta hai; underlying Date ka instant change nahi karta.

**Q. `setInterval(fn, 1000)` accurate clock hai?** Nahi. Scheduling delays possible hain; elapsed time actual timestamps se derive karo.

## Depth walkthrough — andar kya ho raha hai?

### Representation choose kiye bina formatting mat start karo

Price 0.1 aur 0.2 binary floating-point mein exactly represent nahi hote; sum ko plain decimal expectation se compare karna surprise de sakta hai. UI formatting display round karti hai, stored arithmetic automatically exact nahi banati. Fixed two-decimal currency teaching model mein integer minor units, jaise 10+20=30 paise, useful hain; currency scale, rounding aur maximum safe integer ka contract phir bhi define karo.

Date-only birthday aur exact event instant different data hain. Birthday ko arbitrary midnight UTC bana kar local display karoge toh date shift ho sakti hai. Meeting instant timezone ke saath display honi chahiye; recurring “har Monday 9 AM” ke liye local zone aur daylight-saving policy bhi chahiye. Format string ko storage model ka substitute mat banao.

Regex ka `g` flag repeated `test` calls mein lastIndex state maintain kar sakta hai. Same string par stateful matcher ko reuse karte waqt reset/contract samjho. Input length bound karo; arbitrary user-supplied pattern run karna separate resource-risk problem hai.

**Practice:** “₹1.00 ka 10% discount” ke liye arithmetic unit, rounding moment aur display step teen alag lines mein likho.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Integer paise mein 1999 aur 2501 add karo; rupees do decimal places mein dikhao. Display string ko parse karke storage banana weak contract kyun hai?

> **Hint — chhota ishara:** Calculation given minor unit, yani paise, mein karo.

**Answer guide — pehle khud karo, phir compare karo:** Total 4500 paise hai, display `45.00` hoga before currency symbol. Storage mein integer 4500 rakho. Locale separators/symbols add kar sakta hai; formatted text canonical number nahi hai. External decimal price convert karte waqt rounding rule alag define karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) locale APIs ka reference hai. [MDN regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) pattern syntax explain karta hai.
