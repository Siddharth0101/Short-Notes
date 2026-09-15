---
id: js-types-operators
title: Value types operators and explicit conversion
track: javascript
order: 2
level: Foundation
minutes: 15
summary: Input conversion soch-samajhkar karo; truthy hona valid number hone ka proof nahi hai.
tags: fundamentals, js, types, operators
---

## Mental model — simple soch

Har value ka type hota hai; operator ka behavior usse affect hota hai. Variable naam hai, value actual data hai. let binding mein later different type aa sakta hai, lekin ek variable ka meaning consistent rakhna code easy banata hai. Abhi numbers, strings, booleans aur missing values par focus karo.

> **Core takeaway:** Input conversion soch-samajhkar karo; truthy hona valid number hone ka proof nahi hai.

## Calculate and compare

```javascript
const price = 20;
const quantity = 3;
const total = price * quantity;
const label = 'Total: ' + total;
const affordable = total <= 100;
console.log(total, label, affordable); // 60, Total: 60, true
console.log(7 % 2); // 1: remainder
console.log('20' + 3); // '203'
console.log(Number('20') + 3); // 23
console.log('20' === 20); // false
```

Arithmetic operators +,-,*,/,% hain; parentheses grouping clear karte hain. String text hai; + se text join karna concatenation hai. Booleans true/false hain. Strict equality pehle string ko number convert nahi karti. Text input se numeric calculation chahiye toh explicit conversion karo.

## Inspect input deliberately

Common types inspect karne ke liye typeof use karo. undefined usually missing/not-yet-assigned value; null often API-chosen explicit absence hai. bigint/symbol later useful examples mein aayenge. `Number('hello')` NaN deta hai; conversion valid input ka proof nahi. Number.isNaN specifically NaN check karta hai. Empty string zero banti hai, jo required-field rule tod sakti hai.

## Practice

`'5'+2`, `Number('5')+2`, `5>2`, `5==='5'` predict karke run karo. Numeric width/height se rectangle area nikalo. Width numeric string karo aur input boundary par convert karo. Blank/invalid width ka behavior bhi define karo.

## Aage badhne se pehle check karo

0 aur '0' alag kyun hain, samjhao. Boolean comparison aur assignment ka difference batao. Next in booleans se choose karenge ki kaunsi statements chalengi.

## Depth walkthrough — andar kya ho raha hai?

### Conversion aur validation do alag sawal hain

| Input | `Number(input)` | Application ka decision |
| --- | --- | --- |
| `'12'` | 12 | Range allowed ho toh accept |
| `''` ya `'   '` | 0 | Required field ho toh pehle reject |
| `'12px'` | NaN | Pure numeric field ke liye reject |
| `'Infinity'` | Infinity | Finite quantity ke liye reject |
| `'0'` | 0 | Zero allowed hai ya nahi, business rule decide kare |

Isliye form boundary ka order rakho: expected input type → blank check → conversion → finite check → range/integer rule. `if (value)` numeric validation nahi: valid zero falsy hai aur invalid text truthy ho sakta hai. `parseInt('12px',10)` prefix 12 padhta hai; strict whole-field validation ka replacement nahi.

`===` coercion avoid karta hai, lekin har equality problem solve nahi karta: `NaN === NaN` false hai, aur independently created objects equal-looking hoke bhi different identities hain. `Number.isNaN` aur later object identity ka concept isi wajah se useful hain.

**Explain karo:** Quantity 0 ko default 1 karne ke liye `quantity || 1` kab galat hoga? Jab zero valid choice hai. `??` sirf null/undefined par fallback deta hai; negative quantity validate phir bhi karni padegi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** `'8' + 2`, `Number('8') + 2`, `Number('')` predict karo. Empty form field ko automatically valid score kyun nahi maanna chahiye?

> **Hint — chhota ishara:** Empty string ka bhi numeric conversion hota hai.

**Answer guide — pehle khud karo, phir compare karo:** Results `'82'`, `10`, `0` hain. Conversion se pehle blank input reject karo; phir finite number aur allowed range check karo. Conversion succeed hone ka matlab user ne score diya, yeh nahi hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators) mein operations padho.
