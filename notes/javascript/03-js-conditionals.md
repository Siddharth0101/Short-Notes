---
id: js-conditionals
title: Decisions with if else and boolean logic
track: javascript
order: 3
level: Foundation
minutes: 12
summary: Condition rule ko code mein likhti hai; boundary values batati hain ki rule sahi implement hua ya nahi.
tags: fundamentals, js, conditionals
---

## Mental model — simple soch

Condition ek sawal hai jiska answer code ka path choose karta hai. Pehle plain words mein likho: learner start karne ke liye eligible hai? Phir comparisons banao. if condition truthy ho toh branch chalegi; warna else. Else-if chain first matching branch choose karti hai. Jaise marks se grade decide karte waqt exact threshold aur checking order matter karte hain.

> **Core takeaway:** Condition rule ko code mein likhti hai; boundary values batati hain ki rule sahi implement hua ya nahi.

## Trace one decision

```javascript
const score = 72;
const submitted = true;
if (!submitted) {
  console.log('Submit your work first');
} else if (score >= 80) {
  console.log('Ready for advanced practice');
} else if (score >= 50) {
  console.log('Revise and try again');
} else {
  console.log('Repeat the fundamentals');
}
```

Output `Revise and try again` hai. Branch match hone ke baad later branches skip hoti hain. score>=50 pehle likhoge toh 80 se upar scores bhi usi mein aa jayenge. Short examples mein bhi braces rakho, taaki added statement accidentally branch ke bahar na ho.

## Combine conditions

&& ko dono conditions true chahiye; || ko koi ek; ! boolean reverse karta hai. Short-circuit ke kaaran later operand evaluate na ho sakta hai. `age>=18 && hasTicket` jaise explicit comparisons se start karo. Empty string aur zero falsy hain; nonempty 'false' string truthy hai. submitted ka intended contract boolean hai toh real boolean store karo.

Ternary value choose karta hai: `const label = passed ? 'Pass' : 'Retry'`. Long branching readable statements mein rakho. switch ek expression multiple cases se match karta hai; if/else seekhne ke baad padho, mandatory replacement mat samjho.

## Practice

Delivery rule likho: total>=500 par free, otherwise 40. Business rule se pehle negative-total invalid branch add karo. -1,0,499,500 test aur explain karo. Phir premiumMember=true par bhi free delivery add karo.

## Aage badhne se pehle check karo

Exact boundary par kaunsi branch chalegi, explain karo. Next loops se statements repeat karenge.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Pass hone ke liye score kam-se-kam 60 aur attendance kam-se-kam 75 chahiye. `(60,75)`, `(59,100)`, `(90,74)` classify karo.

> **Hint:** Dono requirements true honi chahiye; equality bhi accepted hai.

**Answer guide — compare after attempting:** `score >= 60 && attendance >= 75` use karo. Sirf first pair pass hai. Har threshold ke neeche, barabar aur upar test karo. OR lagane se ek requirement poori karne wala bhi galti se pass ho jaega.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) se conditional execution padho.
