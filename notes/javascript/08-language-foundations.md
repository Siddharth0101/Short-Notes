---
id: js-language-foundations
title: Foundations checkpoint and reliable input handling
track: javascript
order: 8
level: Foundation
minutes: 25
summary: Validation mein missing input, malformed input aur valid zero ko alag samjho.
tags: variables, types, coercion, functions, fundamentals
---

## Mental model — simple soch

JavaScript mein variable ek binding hai jo kisi value ko refer karti hai. Value ka type hota hai; variable ko permanently ek type assign nahi hota. Pehle input ko normalize karo, phir business rule lagao, aur last mein output format karo. Yeh teen steps mix karne se coercion bugs silently aa jaate hain. `const` binding ko reassign karne se rokta hai; object ke andar ki properties automatically immutable nahi banti. Naya code likhne se pehle "yeh value kis type ki honi chahiye" explicitly sochna, baad mein debug karne se zyada bugs abhi hi rok deta hai.

> **Core takeaway:** Validation mein missing input, malformed input aur valid zero ko alag samjho.

## Values and decisions

Primitive values hain string, number, bigint, boolean, undefined, symbol aur null. Objects, arrays aur functions reference identity rakhte hain. Do separately created objects same fields ke baad bhi `===` se equal nahi hote. `typeof null` ka result historical reason se `"object"` hai; null check explicitly karo.

`===` ko normal comparison default rakho. `==` conversion karta hai, isliye jab tak conversion intentionally explain nahi kar sakte, avoid karo. `||` har falsy value par fallback lagata hai; `??` sirf null aur undefined par. Empty string aur zero meaningful input ho sakte hain. Condition mein `[]` aur `{}` truthy hain, empty hone se false nahi banenge.

```js
"use strict";

function calculateTotal(rawPrice, rawQuantity = 1) {
  const price = Number(rawPrice);
  const quantity = Number(rawQuantity);
  if (!Number.isFinite(price) || price < 0) {
    throw new TypeError("Price must be a non-negative number");
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new TypeError("Quantity must be a non-negative integer");
  }
  return price * quantity;
}

console.log(calculateTotal("120", 0)); // 0
console.log(0 || 1); // 1
console.log(0 ?? 1); // 0
```

Number conversion se pehle form ki empty string policy decide karo: `Number("")` zero banata hai. Code example empty price ko accept karega; required form mein pehle `rawPrice.trim() === ""` reject karo. Validation ko conversion samajhne ki galti mat karo.

Common falsy primitive values hain: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` aur `NaN`. Nonempty strings and ordinary objects truthy hain, chahe woh empty array ho ya string `"0"`. Object ko primitive context mein use karoge (jaise template literal ya `+`) to JavaScript `toString`/`valueOf` call karta hai:

```js
const cart = { items: 3, toString() { return `Cart(${this.items})`; } };
console.log(`Summary: ${cart}`); // Summary: Cart(3)
console.log([1, 2, 3] + ""); // "1,2,3"
console.log({} + ""); // "[object Object]"
```

Implicit string conversion debugging mein confusing output de sakta hai, especially jab array ya object accidentally template literal mein chala jaaye. Explicit `String(value)` ya dedicated formatting function likhna implicit coercion se zyada readable hota hai.

## Functions and control flow

Function declaration reusable named operation ke liye useful hai. Function expression aur arrow function values ki tarah pass ho sakti hain. Arrow ka own `this` nahi hota; ordinary function se interchangeable maan kar object methods mat replace karo. Early returns invalid branches ko jaldi exit karte hain. `for...of` iterable values ke liye, `for...in` enumerable property names ke liye hota hai. Arrays par indexes chahiye to `entries()` useful hai.

```js
function summarizeOrder({ id, total, discount = 0 }, ...notes) {
  const finalTotal = total - discount;
  return { id, finalTotal, noteCount: notes.length };
}

console.log(summarizeOrder({ id: "o1", total: 500, discount: 50 }, "gift wrap", "urgent"));
// { id: "o1", finalTotal: 450, noteCount: 2 }
```

Destructured parameter object se sirf named fields extract karta hai; extra fields silently ignore hote hain, missing fields undefined ban jaate hain (default value diya ho to woh use hota hai). Rest parameter (`...notes`) sirf function signature ke last position par valid hai aur ek real array deta hai — `arguments` object ki tarah array-like nahi.

## Gotchas

- Default parameter sirf undefined par apply hota hai; null par nahi.
- `NaN === NaN` false hota hai; `Number.isNaN(value)` use karo.
- Floating point decimal arithmetic exact currency arithmetic nahi hai. Paise/cents jaise integer units aur explicit rounding policy choose karo.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `Number(rawQuantity)` already ensures a whole number. **Why it breaks:** `Number("2.5")` valid `2.5` deta hai; agar sirf `Number.isFinite` check kiya jaaye to fractional quantity silently accept ho sakti hai. **Fix:** Conversion ke turant baad `Number.isInteger` explicitly check karo, sirf finite hone par mat ruko.
- **Wrong assumption:** `==` aur `===` sirf style preference hai, behavior same hai. **Why it breaks:** `"" == 0` aur `null == undefined` dono `true` hain, lekin `"" === 0` `false` hai. Form input string type mein aata hai, isliye loose comparison unexpected branch le sakta hai. **Fix:** Strict equality default rakho; conversion chahiye to explicit `Number()`/`String()` call karo.
- **Wrong assumption:** Default parameter empty string ya `null` ko bhi replace kar dega. **Why it breaks:** Default sirf `undefined` argument par trigger hota hai. `calculateTotal(rawPrice, null)` mein `quantity` `Number(null)` yaani `0` ban jaata hai, `1` nahi. **Fix:** `null`/`undefined` dono ko explicitly normalize karo before relying on default parameter.

Real app mein yeh checkout form, signup form ya admin dashboard ke input fields mein directly dikhta hai: raw string input, optional fields aur zero/empty edge cases ek saath handle karne padte hain, aur inhi mistakes se production bugs aate hain jab quantity ya discount negative ya fractional slip ho jaaye.

## Practice

Discount calculator likho jo blank input, negative quantity, zero quantity aur invalid numeric text ko separately handle kare. Table mein input, expected result aur reason likho; phir implementation run karo. Validation ke baad calculation function ko pure rakho.

## Interview questions — bolkar practice karo

**Q. `const` object mutate kaise ho sakta hai?** Binding constant hai, referenced object nahi. Nested immutability ke liye deliberate update discipline chahiye.

**Q. `null` aur `undefined` mein difference?** Undefined usually missing/uninitialized value ko represent karta hai; null explicitly absent value communicate karta hai. API contract define karta hai ki kaunsa use hoga.

## Depth walkthrough — andar kya ho raha hai?

### Expression ka result aur side effect alag trace karo

`let score=2; const before=score++;` ke baad before=2 aur score=3. Postfix expression old value return karti hai aur binding increment bhi karti hai. `const after=++score;` ab score=4 aur after=4 deta hai. Readability ke liye business calculation mein increments separate statements rakhna often clearer hai.

`null` aur `undefined` ko accidental interchangeable mat banao. Patch API mein missing field ka matlab “unchanged” aur explicit null ka matlab “clear” ho sakta hai. Agar destructuring/default logic dono ko collapse kar de toh user ki intent kho sakti hai. Default parameter undefined par apply hota hai, null par nahi.

Optional chaining sirf missing intermediate access ko guard karti hai. `user?.profile?.name` undefined de sakta hai; valid nonblank name ka proof nahi. `?.` har malformed type ko valid nahi banata aur programmer errors chupane ke liye blanket chain add karna debugging weak karta hai.

**Mini drill:** `0 || 10`, `0 ?? 10`, `null ?? 10` ke outputs 10,0,10 explain karo. Operator ka naam bolne se pehle application rule bolo: missing data replace karni hai ya saari falsy values?

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Text field se nonnegative whole-number lesson count validate karo. `''`, `'  '`, `'0'`, `'3.5'`, `'four'` classify karo.

> **Hint — chhota ishara:** Pehle trimmed blank check, phir numeric conversion, integer aur range check karo.

**Answer guide — pehle khud karo, phir compare karo:** Blank inputs missing hain; `'0'` valid hai; `'3.5'` aur `'four'` invalid hain. Blanks reject karke Number, Number.isInteger aur >=0 check use karo. App ko maximum chahiye toh woh bhi define karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) language topics ka reference hai. [MDN equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) comparison edge cases explain karta hai.
