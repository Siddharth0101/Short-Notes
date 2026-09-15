---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 15
summary: Array ordered items rakhta hai; alag variable names bhi same object reference share kar sakte hain.
tags: fundamentals, js, arrays, objects
---

## Mental model — simple soch

Array ordered collection hai; object named properties ka record hai. Lesson titles ki list aur ek learner profile alag data shapes hain. Variables/loops/functions ab multiple values process kar sakte hain; shape purpose ke hisaab se choose karo.

> **Core takeaway:** Array ordered items rakhta hai; alag variable names bhi same object reference share kar sakte hain.

## Read and update collections

```javascript
const titles = ['Variables', 'Decisions'];
titles.push('Loops');
console.log(titles[0]); // Variables
console.log(titles.length); // 3
for (const title of titles) {
  console.log(title);
}

const learner = { name: 'Asha', completed: 2 };
learner.completed = learner.completed + 1;
console.log(learner.name, learner.completed); // Asha 3
```

Array index zero se start. length count hai, last valid index nahi. Nonexistent ordinary array element/object property read par undefined milta hai. Dot fixed property name use karta hai; brackets computed key use kar sakte hain, jaise learner[fieldName].

## Identity and copying

const binding reassign hone se rokta hai; referenced array/object freeze nahi karta. `const other = learner` se dono same object refer karte hain. Ek se property badlo toh doosre se visible hai. Same fields ke two object literals bhi different identities hain. React state mein yeh difference important hoga.

Pehle shallow records aur explicit loops samjho. Phir collections chapter map/filter/reduce, destructuring aur spread introduce karega. Loop se transformation explain kar sako, tab shorthand syntax meaningful lagegi.

## Practice

Array mein title/minutes wale three lessons banao. for...of se minutes total karke function mein rakho. Fourth lesson add karo; function change nahi honi chahiye. Empty list ka total zero kyun, samjhao.

## Aage badhne se pehle check karo

List position/object field aur mutation/reassignment alag samjhao. Next modern collection transformations padho; uske baad foundations checkpoint mein validated calculation banao, phir scope ko deeper samjho.

## Depth walkthrough — andar kya ho raha hai?

### Shallow copy mein exactly kya share hota hai?

```js
const first = { name: 'Asha', progress: { done: 2 } };
const alias = first;
const copied = { ...first };
copied.name = 'Kabir';
copied.progress.done = 3;
console.log(first.name, first.progress.done, alias === first);
// Asha, 3, true
```

Alias same outer object hai. Spread naya outer object banata hai, isliye copied.name change original name ko nahi chhoota. Lekin nested progress value ek object reference hai; woh copy hone par bhi same nested object point karti hai. Isi liye first.progress.done 3 ho gaya.

Nested progress independent chahiye toh changed path copy karo: `{ ...first, progress: { ...first.progress, done: 4 } }`. Har problem mein whole graph clone karna zaroori nahi. Functions, dates, circular references aur shared identity ke cases mein JSON round-trip ko universal clone mat bolo.

Array ordered list hai; object named fields ka model. Array index ko permanent entity ID samjhoge toh deletion/sorting ke baad identity shift hogi. Later React keys isi issue ko expose karti hain. **Practice:** Two learners same progress object share kar rahe hon toh ek edit doosre ko kyun badalta hai? Reference arrows draw karke explain karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** `const a = {done:false}; const b = a; b.done = true;` ke baad a.done batao. Phir is flat object ki independent copy banao.

> **Hint — chhota ishara:** Object reference assign karna object clone karna nahi hai.

**Answer guide — pehle khud karo, phir compare karo:** `a.done` true ho jaega kyunki a aur b same object ko refer karte hain. `const b = {...a}` alag top-level object banata hai; boolean independently change ho sakta hai. Nested objects shallow copy ke baad bhi shared ho sakte hain.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) aur [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) mein structures padho.
