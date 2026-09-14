---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 12
summary: Binding value ka naam hoti hai; assignment pehle right side calculate karke left side ki binding update karta hai.
tags: fundamentals, js, variables
---

## Mental model — simple soch

Variable ek naam hai jisse program value ko refer karta hai. Jaise notebook par subject ka label hota hai, binding se value ko naam milta hai; yeh analogy object cloning imply nahi karti. Pehle ek value samjho, phir functions/objects par jao. Statements order mein chalti hain. Browser developer console ya Node ki JavaScript file mein ek small example run karo. Har line se pehle output predict karo.

> **Core takeaway:** Binding value ka naam hoti hai; assignment pehle right side calculate karke left side ki binding update karta hai.

## Declare before reading

```javascript
const learner = 'Asha';
let completed = 0;
console.log(learner); // Asha
console.log(completed); // 0
completed = completed + 1;
console.log(completed); // 1
```

const aisi binding declare karta hai jise reassign nahi karoge; let changing value ke liye hai. `=` assignment hai, equality question nahi. `completed = completed + 1` mein pehle right ka old completed padho, 1 add karo, phir result left mein rakho. console.log se value dekhkar har step inspect kar sakte ho.

## Naming and initialization

Meaningful names rakho: completedLessons, x se clearer hai. Names case-sensitive hain; score aur Score alag hain. Naam digit se start ya reserved keyword nahi ho sakta. Possible ho toh declare karte waqt initialize karo. `let x;` declaration ke baad x undefined hai; declaration se pehle x padhna alag case hai aur error deta hai.

Reassignment required na ho toh const prefer karo. Old code mein var pehchano; uska function-scoped behavior later scope lesson mein padhenge. First examples likhne ke liye abhi hoisting terminology ratna zaroori nahi.

## Practice

Fixed courseName aur changing lessonsRead banao. Count do baar badhao; har statement ka output predict karo. courseName reassign karke error padho. Phir decide karo name actually changeable chahiye ya fixed. Sirf error chupane ke liye const ko let mat karo.

## Aage badhne se pehle check karo

Declaration, initialization aur reassignment separately samjhao. Three statements se score 4 ko 7 banao bina directly 7 assign kiye. Next values ke types padhenge.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `let minutes = 10` se shuru karo. Pehle 5 add karo, phir double karo. Dono outputs predict karo. Fixed course name ke liye kaunsi declaration use hogi?

> **Hint:** Ek waqt ek assignment trace karo; har line ke baad current value likho.

**Answer guide — compare after attempting:** Pehle 15, phir 30 milega. Name ke liye `const courseName = 'JavaScript'` rakho. Changing count ko let chahiye. Declaration naam banati hai; reassignment existing binding ki value badalti hai.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types) mein declarations aur values padho.
