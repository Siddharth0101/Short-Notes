---
id: java-decisions-loops
title: Java operators decisions and loops
track: java
order: 2
level: Foundation
minutes: 15
summary: Control flow business rule ko code banata hai; har boundary aur zero-iteration case check karo.
tags: fundamentals, java, decisions, loops
---

## Mental model — simple soch

Control flow decide karta hai next kaunsi statement chalegi. Java ke if/loop ko boolean condition chahiye; integer ko truthy substitute nahi maan sakte. Previous lesson ke main ke andar practice karo, taaki abhi focus decision/repetition par rahe.

> **Core takeaway:** Control flow business rule ko code banata hai; har boundary aur zero-iteration case check karo.

## Trace a small program

```java
int target = 4;
int total = 0;
for (int day = 1; day <= target; day++) {
    total += day;
}
if (total >= 10) {
    System.out.println("Target reached");
} else {
    System.out.println("Keep studying");
}
System.out.println(total); // 10
```

Har iteration ke start par total earlier day values ka sum hai. Loop day ek baar initialize karta hai, body se pehle condition check aur baad mein increment karta hai. day=5 par body stop. <= ko < karne se included values badalti hain; yeh boundary decision hai.

## Operators and branch order

Arithmetic mein +,-,*,/,% use hote hain. `7/2` integer division se 3; `7/2.0` floating-point se 3.5 deta hai. `=` assignment, `==` primitive equality hai. `&&`/`||` booleans combine aur short-circuit karte hain; `!` boolean reverse karta hai. Grouped conditions mein parentheses use karo.

Else-if chain first matching branch chalati hai. Overlapping rules mein specific condition pehle rakho. while condition pehle check karta hai; do...while ek baar body chala kar check karta hai. break loop se nikalta hai; continue next iteration par jaata hai. Especially while mein woh update identify karo jo condition false karega.

## Practice

1–10 ke even integers ka sum loop/condition se nikalo; run se pehle predict karo. Score bands ki boundaries 50 aur 80 rakho; 49,50,79,80 test karo. Loop update temporarily remove karke infinite-loop risk samjho; dobara run se pehle restore karo.

## Aage badhne se pehle check karo

Counter aur accumulator alag trace karo; short-circuit logic explain karo. Next repeated calculation ko method mein nikaal kar values explicitly pass karenge.

## Depth walkthrough — andar kya ho raha hai?

### Integer arithmetic ka type intermediate result decide karta hai

`5 / 2` int operands se 2 deta hai. `double result = 5 / 2` bhi 2.0 store karega: division pehle integer arithmetic mein ho chuki. `5 / 2.0` floating-point division se 2.5 deta hai. Final variable double hone se already truncated result recover nahi hota.

Loop invariant sum ke liye useful hai: iteration start par accumulator processed values ka total hai. Empty input par zero processed values ka sum 0, isliye loop zero times run karke meaningful result de sakta hai. `i <= array.length` invalid final index visit karega.

Overflow ko normal bigger number mat samjho. int range exceed hone par ordinary integer arithmetic wrap kar sakti hai. Large total ke liye long choose karna range badhata hai, unlimited nahi. Exact overflow failure chahiye toh suitable checked arithmetic choose karo.

**Practice:** Average nikalte waqt empty collection, int division aur overflow teen separate cases likho. `[1,2]` ka average 1.5 hona chahiye; total/count ko correct operand type mein calculate karo. “Program compile ho gaya” numeric contract prove nahi karta.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** 1 se n inclusive tak even integers count karne ka loop likho. n=0, 1, 2, 5 ke outputs batao.

> **Hint — chhota ishara:** Upper bound inclusive rakho aur `% 2 == 0` se divisibility check karo.

**Answer guide — pehle khud karo, phir compare karo:** Counts 0, 0, 1, 2 hain. Count zero se start karo; index 1 se n tak chalao aur even value par increment karo. Negative n reject karoge ya empty range maanoge, contract mein clear karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Dev.java language basics](https://dev.java/learn/language-basics/) mein operators aur control flow ka reference hai.
