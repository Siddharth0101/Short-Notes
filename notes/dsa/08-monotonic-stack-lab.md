---
id: dsa-monotonic-stack-lab
title: Monotonic stacks and amortized reasoning
track: dsa
order: 8
level: Advanced
minutes: 25
summary: Monotonic stack un candidates ko rakhta hai jinka answer aage aane wali value decide kar sakti hai.
tags: dsa, monotonic-stack, amortized, arrays
visual: monotonic-stack
---

## Mental model — simple soch

Monotonic stack unresolved candidates ko aise order mein rakhta hai ki future mein unhe efficiently resolve/remove kar sakein. Pehle while condition mat rato. Pucho: stored index ko abhi kis answer ka wait hai? Kaunsi nayi value aane par uska answer permanently decide ho jaega?

Daily temperatures mein har day ko pehla later strictly warmer day chahiye. Un days ke indices stack mein rakho jinka answer unknown hai. Bottom se top temperatures non-increasing rehti hain. Equal temperatures allowed hain, kyunki equal ka matlab warmer nahi.

> **Core takeaway:** Monotonic stack un candidates ko rakhta hai jinka answer aage aane wali value decide kar sakti hai.

## Worked solution

```javascript
function dailyTemperatures(temperatures) {
  const waits = Array(temperatures.length).fill(0);
  const stack = [];
  for (let today = 0; today < temperatures.length; today++) {
    while (stack.length &&
      temperatures[today] > temperatures[stack.at(-1)]) {
      const previous = stack.pop();
      waits[previous] = today - previous;
    }
    stack.push(today);
  }
  return waits;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
// [1, 1, 4, 2, 1, 1, 0, 0]
```

Index 5 par 72 aata hai toh index 4 ka 69 aur index 3 ka 71 resolve hote hain. Index 2 ka 75 resolve nahi hota, isliye stack mein rehta hai. Sirf temperatures nahi, indices store karo: distance calculate karna hai aur duplicate values ke days alag hain.

## Proof before complexity

Pop hua har index aaj se colder hai. Agar beech mein koi pehla warmer day aaya hota toh woh index tabhi pop ho chuka hota. Isliye aaj uska first warmer day hai. End mein bache indices ka koi later warmer day nahi; unka initial zero correct hai.

Nested while dekhkar seedha O(n²) mat bolo. Har index ek baar push aur maximum ek baar pop hota hai. Saare outer iterations mila kar maximum n pops hain. Total time O(n), auxiliary stack O(n), output O(n). Yeh aggregate amortized analysis hai; random input ka average-case assumption nahi.

## Variants and traps

Next greater-or-equal mein equality bhi resolve karegi, toh pop condition badlegi. Circular array mein second logical pass aur modular indexing carefully use karo; unresolved indices dobara push mat karo. Stock span mein consecutive smaller-or-equal prices combine hote hain. Answer ka meaning badla hai, toh temperature comparison blindly copy mat karo.

Histogram maximum rectangle mein increasing heights rakho. Chhota bar aane par candidate close hota hai aur available width calculate hoti hai. Equal heights aur sentinel boundaries examples se check karo. Sliding-window maximum mein usually deque chahiye: expired candidates front se, dominated candidates back se nikalte hain.

## Practice

`[]`, `[30]`, `[30,30]`, `[40,30,20]`, `[20,30,40]` trace karo. Har day se aage scan karne wala simple quadratic reference likho; small random arrays par stack answer se compare karo. Reference slow ho sakta hai kyunki small cases ki correctness check kar raha hai. Phir strict/non-strict comparison code dekhe bina explain karo.

## Interview questions — bolkar practice karo

**Indices kyun store karein?** Index item ki identity bachata hai; distance aur expiry calculate karne ke liye second lookup nahi chahiye.

**Monotonic stack kab unsuitable hai?** Arbitrary online updates ya range queries mein tree jaisa structure chahiye ho sakta hai. Updates allowed hon toh aaj eliminated candidate future mein relevant ho sakta hai.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `[2,2,3,1]` mein har item ke right ka next strictly greater value nikalo. Equal values pop condition ko kaise affect karti hain?

> **Hint:** Equal ka matlab strictly greater nahi hota.

**Answer guide — compare after attempting:** Answer `[3,3,-1,-1]` hai. Left-to-right unresolved-index stack mein tab pop karo jab nayi value stacked value se strictly badi ho. Har index maximum ek baar push aur ek baar pop hota hai; total O(n) time aur O(n) auxiliary space.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MIT algorithms materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/) se invariants aur complexity ki foundation padho. Yahan ka worked problem aur implementation is repo ke liye likha gaya hai.
