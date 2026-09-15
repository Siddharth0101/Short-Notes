---
id: js-loops
title: Loops counters and accumulators
track: javascript
order: 4
level: Foundation
minutes: 15
summary: Loop ko starting state, continue karne ka rule aur stop ki taraf progress chahiye.
tags: fundamentals, js, loops
---

## Mental model — simple soch

Loop condition allow karne tak statements repeat karta hai. Har iteration par pucho: kya process ho chuka, kya baaki hai? Counter position/repetitions ginta hai; accumulator results jodta hai. Jaise din counter hai aur total study minutes accumulator. Dono numeric ho sakte hain lekin unki responsibility alag hai.

> **Core takeaway:** Loop ko starting state, continue karne ka rule aur stop ki taraf progress chahiye.

## Trace a for loop

```javascript
let total = 0;
for (let day = 1; day <= 3; day = day + 1) {
  total = total + day;
  console.log(day, total);
}
// 1 1
// 2 3
// 3 6
```

Initializer ek baar chalta hai. Har iteration se pehle condition check; true ho toh body, phir update. day=4 par condition fail. Har iteration ke start par total earlier days ka sum hai. Yeh simple invariant correctness reason karne mein help karta hai.

## Other loop shapes

while mein initialization/update header se alag hote hain; changing condition par repetition ho toh useful hai. Stop ka reason identify karo. do...while kam-se-kam ek baar body chalata hai. break nearest loop exit; continue current iteration ka rest skip karta hai. while mein continue only terminating update skip na kare.

for header ka let variable loop scope mein hota hai; independent next loop mein same naam reuse kar sakte ho. Arrays aane par for...of values visit karega; position ki need na ho toh manual index zaroori nahi.

## Practice

1–5 integers ka sum nikalo bina answer directly likhe. Counter, total-before aur total-after ki table banao. Phir range 0–4 karke boundaries samjhao. Finally remainder operator/condition se 1–10 ke even numbers print karo.

## Aage badhne se pehle check karo

Off-by-one error aur missing update pehchano. Total loop ke bahar initialize kyun karna hai, batao. Next repeatable task ko function mein pack karke different inputs par use karenge.

## Depth walkthrough — andar kya ho raha hai?

### Loop ki teen responsibilities: start, continue, progress

Array ke n items process karne ka indexed loop `i=0`, condition `i<n`, progress `i++` rakhta hai. `i<=n` ek extra invalid index visit karega. Empty array mein n=0 hai, isliye pehla condition check false aur body zero times chalti hai; yeh special hack nahi, correct boundary hai.

Sum banate waqt invariant bolo: iteration i ke start par total pehle i elements ka sum hai. Initially zero elements ka sum 0. Body element i add karti hai, isliye next iteration ke liye statement phir true. Exit par i=n, toh saare n elements included. Yeh reasoning later DSA proofs ki foundation hai.

`break` poora current loop chhodta hai; `continue` current iteration ka remaining work skip karta hai. `while` mein progress statement continue ke baad ho toh accidentally skip hokar infinite loop ban sakta hai. `for` loop ka update clause continue ke baad bhi execute hota hai.

**Trace task:** Values `[2,-1,3]` mein negative skip karke sum 5 banao. Phir “first negative milte hi stop” rule do: sum 2 hoga. Same input par `continue` aur `break` ka contract alag answer deta hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Loop se `[3,-2,0,5]` ki sirf positive values add karo. Empty array kya return kare? Accumulator 1 se start kiya toh kya badlega?

> **Hint — chhota ishara:** Koi item process hone se pehle sum kya hai, usse initial accumulator decide karo.

**Answer guide — pehle khud karo, phir compare karo:** Total 0 se start karo; value>0 ho tab add karo. Results 8 aur empty input ke liye 0 hain. 1 se start karne par har result mein extra 1 aaega. Har item ek baar visit karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration) mein loop forms/control statements padho.
