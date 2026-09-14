---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 12
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

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `const a = {done:false}; const b = a; b.done = true;` ke baad a.done batao. Phir is flat object ki independent copy banao.

> **Hint:** Object reference assign karna object clone karna nahi hai.

**Answer guide — compare after attempting:** `a.done` true ho jaega kyunki a aur b same object ko refer karte hain. `const b = {...a}` alag top-level object banata hai; boolean independently change ho sakta hai. Nested objects shallow copy ke baad bhi shared ho sakte hain.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) aur [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) mein structures padho.
