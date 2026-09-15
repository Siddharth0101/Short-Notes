---
id: java-methods-arrays
title: Java methods arrays and strings
track: java
order: 3
level: Foundation
minutes: 15
summary: Java argument ki value copy karta hai; copied reference bhi same mutable object ko point kar sakta hai.
tags: fundamentals, java, methods, arrays
---

## Mental model — simple soch

Method named parameters aur declared return type ke saath operation define karta hai. Array fixed count mein specified type ki values rakhta hai. Dono repeated statements ko reusable calculation banate hain. Abhi Main ke static methods use karo; next lesson mein instance creation seekhenge.

> **Core takeaway:** Java argument ki value copy karta hai; copied reference bhi same mutable object ko point kar sakta hai.

## A complete calculation

```java
public class Main {
    static int totalMinutes(int[] sessions) {
        int total = 0;
        for (int minutes : sessions) {
            total += minutes;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] sessions = {15, 20, 10};
        int total = totalMinutes(sessions);
        System.out.println(total); // 45
        System.out.println(sessions.length); // 3
    }
}
```

sessions parameter received array reference ka local naam hai; caller argument supply karta hai. return calculated int caller ko deta hai; print karne se result return nahi hota. void method result value return nahi karta. Is exercise mein sum int range ke andar assume karo; overflow later review mein hai.

## Arrays and text

Array indices 0 se length-1 tak hain. Bahar access exception deta hai, naya element silently create nahi karta. New int array initially zeroes se filled hota hai. Enhanced for har value visit karta hai; position chahiye toh indexed loop lo. Array in-place grow nahi hota; resizable collections later aayengi.

Strings immutable text hain. Content compare karne ke liye equals use karo; objects par == reference identity compare karta hai. null par method call fail hoti hai, isliye absence ka contract define karo. Known literal se `"done".equals(status)` status null ho tab safely false deta hai.

## Practice

Kam-se-kam 20-minute sessions count karne ka method likho. Empty, single matching aur mixed arrays test karo. Greeting print karne ke bajay return karne ka method banao; main se result print karo. Console output own na karne se calculation reuse kyun easy hai, samjhao.

## Aage badhne se pehle check karo

Parameter/argument aur return value/side effect alag samjhao. Next state aur behavior ko constructor se banne wale instance mein group karenge.

## Depth walkthrough — andar kya ho raha hai?

### Pass-by-value ko runnable trace se samjho

```java
public class ReferenceTrace {
    static void change(int[] values) {
        values[0] = 9;
        values = new int[]{7};
        values[0] = 8;
    }
    public static void main(String[] args) {
        int[] original = {1, 2};
        change(original);
        System.out.println(java.util.Arrays.toString(original)); // [9, 2]
    }
}
```

ReferenceTrace.java mein save karke compile/run karo. Call reference value copy karta hai; original aur parameter initially same array refer karte hain. First assignment shared array mutate karti hai. New array assignment sirf local parameter ko different object par point karati hai. Uske baad 8 new array mein jaata hai, caller ke original mein nahi.

String ke saath `text = text + "!"` parameter reassign karti hai; caller ki string mutate nahi hoti. Array clone outer array copy karega, nested object elements automatically deeply clone nahi honge.

**Practice:** change ko original modify kiye bina changed array return karne wali method banao. Caller returned reference store kare. Input/output ownership specify karne se accidental mutation aur unnecessary copying dono avoid ho sakte hain.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Method pehle `values[0] = 9` karta hai, phir `values = new int[]{7}`. Caller ka original array `{1,2}` ho toh use kya dikhega?

> **Hint — chhota ishara:** Shared array ko mutate karna aur local parameter ko reassign karna alag actions hain.

**Answer guide — pehle khud karo, phir compare karo:** Caller ko `{9,2}` dikhega. Element change shared array tak pahunchta hai; naya array assign karne se sirf local reference badalta hai. Java pass-by-value hi hai: yahan copied value ek reference hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Dev.java arrays](https://dev.java/learn/arrays/) aur [classes and objects](https://dev.java/learn/classes-objects/) se in concepts ka reference padho.
