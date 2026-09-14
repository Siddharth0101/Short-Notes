---
id: javascript-async-patterns
title: Async patterns and bounded concurrency
track: javascript
order: 16
level: Advanced
minutes: 25
summary: Concurrency limit ek waqt active work bound karti hai; total jobs ki count nahi.
tags: promises, concurrency, cancellation, machine-coding
---

## Mental model — simple soch

Async ka matlab unlimited parallel work nahi hai. A promise represents an eventual outcome; it does not own cancellation, scheduling or resource limits. Before writing an async utility, define four contracts: result order, maximum in-flight work, failure policy and cancellation ownership. These decisions matter more than remembering a combinator name.

> **Core takeaway:** Concurrency limit ek waqt active work bound karti hai; total jobs ki count nahi.

## Worked implementation

Worker pool input order preserve aur active mapper calls cap karta hai. Index se repeated input values distinguish hoti hain. Contract har item settle karna hai, allSettled jaisa; first rejection par stop karna nahi.

```javascript
async function mapLimit(items, limit, mapper) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = {
          status: 'fulfilled',
          value: await mapper(items[index], index),
        };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}
```

A,B,C aur limit 2 mein A/B start. B pehle finish toh uski worker C start karegi. Output slots phir bhi A,B,C order mein hain. Single JS thread par cursor increment await se pehle synchronously hota hai, isliye same index do workers claim nahi karti. Actual threads ki shared memory par yeh proof directly apply nahi hota.

Scheduling overhead O(n), result memory O(n), active calls maximum min(n,limit) hain. Wall-clock time network duration par depend karta hai. Concurrency cap requests-per-second rate limit nahi hai.

## Failure and cancellation decisions

Promise.all first rejection par reject karta hai, baaki operations cancel nahi hoti. Timeout wali Promise.race bhi losing operation ko chalne deti hai. Fetch signal se abort karo; response.ok check karo kyunki HTTP 404 response hai, transport rejection nahi. Cancellation underlying operation ke cooperation par depend hai.

Sirf app-defined transient failures retry karo. Attempts aur total deadline bound rakho. Retried write same stable operation ID use kare; har attempt new ID deduplication todti hai. Cancellation ke baad server continue kare toh client “write nahi hui” infer nahi kar sakta.

## Practice

Manually controlled promises se maximum two active mappers verify karo. B ko A se pehle resolve karke output order dekho. C reject par uske slot mein rejected result ho. Empty input, zero limit, sync throw test karo. AbortSignal add karte waqt new jobs stop, active work signal aur unstarted slots ka contract define karo.

## Interview questions — bolkar practice karo

**forEach ke andar await whole loop ko wait kyun nahi karata?** forEach returned promises ignore karta hai. Sequential work ke liye for...of; concurrent results ke liye map plus promise combinator lo.

**Pool bhi API overload kyun kar sakta hai?** Fast responses par small concurrency ke saath bhi requests/second high ho sakti hain. Service contract require kare toh rate control bhi lagao.

## Research notes: Independent outcomes with allSettled

Independent dashboard panels partial results dikha sakte hain. allSettled completion order se independent input-order outcomes deta hai.

```js
const outcomes = await Promise.allSettled([
  Promise.resolve({ unread: 4 }),
  Promise.reject(new Error('Recommendations unavailable')),
]);
console.log(outcomes.map(item => item.status));
// ["fulfilled", "rejected"]
```

Har outcome inspect karo. Har error ko [] kar dene se empty data aur failed loading ka difference chupta hai. Outcomes collect karna started jobs ki count limit nahi karta.

**Interview check:** Ek promise kabhi settle na ho toh allSettled finish karega?

**Answer:** Nahi; har input settle hone ka wait karega. Deadline separately define karo. Timeout observe karna aur underlying work cancel karna alag actions hain.

**Practice:** Never-settling job add karo aur successful panels bachate hue deadline design karo.

[Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Jobs `[50,10,10,10,10]` ms leti hain. Do workers free hote hi next job uthati hain. Overhead ignore karke start/end times likho.

> **Hint:** Long job chalti reh sakti hai jab doosri worker multiple short jobs complete kare.

**Answer guide — compare after attempting:** Jobs 1 aur 2 time 0 par start. Second worker jobs 3,4,5 ko 10,20,30 par start karke 20,30,40 par finish karegi. Job 1 time 50 par complete. Maximum do active hain. Input order mein result chahiye toh original indices preserve karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) mein composition aur cancellation boundaries padho.
