---
id: java-language-foundations
title: Java foundations review and conversion edge cases
track: java
order: 5
level: Foundation
minutes: 16
summary: Types, conversions, control flow aur strings ko predictable rules se samjho.
tags: types, casting, strings, arrays
visual: java-memory
---

## Mental model

Java program ko compiler pehle bytecode mein translate karta hai, phir JVM execute karti hai. JDK development tools aur runtime capabilities provide karta hai. Java ki strength compile-time contracts hain: variable ka declared type decide karta hai ki kaunse operations legal hain. `var` local type inference hai; variable dynamically typed nahi ho jata. Examples Java 21-compatible syntax use karte hain unless otherwise stated.

> **Core takeaway:** Widening the destination does not widen arithmetic already performed.

## Types and conversions

Eight primitives hain: byte, short, int, long, float, double, char, boolean. `char` ek UTF-16 code unit hai; har Unicode character ek char mein fit nahi hota. Boolean ke logical values true/false hain, language universal one-bit storage promise nahi karti. Fields aur array elements default values lete hain; local variable ko read karne se pehle definitely assign karna zaroori hai.

Widening automatic ho sakti hai, lekin int-to-float aur long-to-float/double precision lose kar sakte hain. Narrowing cast rounding nahi karta. Conversion rules ko size mnemonic se aage samjho. [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)

```java
int exact = 16_777_217;
float rounded = exact;
System.out.println((int) rounded); // 16777216
System.out.println(7 / 2);         // 3
System.out.println(7 / 2.0);       // 3.5
byte small = 127;
small += 1;                       // implicit narrowing, now -128
```

Business money ke liye explicit minor units ya decimal arithmetic choose karo; floating-point approximation ko silently invoice mein mat use karo. Input range validate karo aur overflow-sensitive integer work mein `Math.addExact` consider karo.

## Control flow, arrays and text

`if` conditions boolean hoti hain. `&&` aur `||` short circuit karte hain, isliye `value != null && value.isBlank()` safe order hai. Loop mein invariant likho: iteration start pe kya already processed hai? Arrays fixed length aur zero-indexed hain. Two-dimensional Java array actually arrays ka array hota hai, so rows different lengths rakh sakti hain.

Strings immutable hain. `==` reference identity compare karta hai; `.equals` textual content. Repeated incremental text construction mein `StringBuilder` useful hai. User text ki length decide karte waqt code units, code points aur visible graphemes alag concepts hain.

## Switch expressions, text blocks and pattern matching

Modern Java ka `switch` statement se expression bhi ban sakta hai — arrow syntax fallthrough hata deta hai aur value directly return kar sakta hai:

```java
static String tierLabel(int score) {
    return switch (score / 10) {
        case 10, 9 -> "top";
        case 8, 7 -> "strong";
        case 6 -> "borderline";
        default -> "needs review";
    };
}
```

Arrow branch mein fallthrough nahi hota, isliye purane `switch` ka missing-`break` bug yahan structurally impossible hai. Multi-line SQL ya JSON snippets ke liye text block (`"""`) escaping ka noise hata deta hai:

```java
String query = """
    SELECT id, title
    FROM notes
    WHERE owner_id = ?
    """;
```

Pattern matching for `instanceof` cast aur check ek statement mein combine karta hai:

```java
Object payload = fetchPayload();
if (payload instanceof String text && !text.isBlank()) {
    System.out.println(text.strip());
}
```

Cast ab explicit nahi likhna padta; `text` variable sirf tab scope mein hota hai jab pattern match ho. Record patterns (Java 21) nested data ko destructure karte hain — `case Point(int x, int y) when x == y -> ...` jaisा syntax record ke components ko directly bind kar deta hai, manual accessor calls ki jagah.

## Common traps

- `Integer missing = null; int x = missing;` unboxing par NullPointerException deta hai.
- `final List<String>` reference reassignment rokta hai, list mutation nahi.
- String literal pooling ko business equality ka basis mat banao.
- `int result = a * b` assignment se pehle overflow kar sakta hai; `(long) a * b` promotion pehle karta hai.
- **Wrong assumption:** `var` variable ko dynamically typed bana deta hai, so ek `var list` mein baad mein koi bhi type daal sakte hain. **Why it breaks:** Compiler `var` ki declared type ko initializer se infer karke lock kar deta hai; `var list = new ArrayList<String>();` ke baad `list.add(42)` compile hi nahi hoga. **Fix:** `var` ko sirf readability shortcut samjho, type safety same hi rehti hai — hover/IDE se actual inferred type confirm karo jab unclear ho.
- **Wrong assumption:** Old-style `switch` statement mein ek `case` block likhne ke baad agla case automatically evaluate nahi hoga. **Why it breaks:** Classic colon-style `switch` mein missing `break` se control agle case mein fall through karta hai, aur yeh silently multiple branches execute kar deta hai. **Fix:** Naya arrow-style `switch` expression use karo jahan fallthrough hota hi nahi, ya legacy code mein har case ke end pe explicit `break`/`return` verify karo.
- **Wrong assumption:** Text block (`"""`) mein trailing whitespace aur indentation cosmetic hote hain, output par asar nahi karte. **Why it breaks:** Text block ki closing `"""` ki indentation common leading whitespace strip karne ke liye reference point hoti hai; closing delimiter galat jagah rakhne se generated string mein unexpected extra spaces aa jaate hain, jo JSON/SQL parsing break kar sakte hain.

## In a real backend service

Request validation code mein yeh foundations directly dikhte hain: incoming JSON field ka type check karna (`instanceof` pattern matching se safe cast), status codes ko `switch` expression se map karna, aur SQL templates ko text block mein readable rakhna. Ek chhota casting bug — jaise discount percentage ko `int` mein truncate kar dena — production mein silently wrong invoice amount generate kar sakta hai, isliye yeh "basic" rules hi first line of defense hain.

## Interview questions

**Is Java pass by reference?** Nahi. Java always pass by value hai. Object argument mein reference value ki copy pass hoti hai. Method shared object mutate kar sakta hai, caller ki reference variable reassign nahi kar sakta.

**Why does a cast not make bad data safe?** Cast representation change karta hai; domain validation nahi. Negative age ko int mein cast karne se valid age nahi milti.

**How does an arrow-style switch expression avoid the classic fallthrough bug?** Har `case` branch apna khud ka value produce karta hai aur automatically break kar deta hai; control agle case mein leak nahi karta. Traditional colon-style `switch` mein yeh discipline manually `break` likh kar maintain karni padti thi.

## Practice

Temperature converter likho jisme integer-division bug intentionally introduce karke fix karo. Ek array ka min/max find karo, empty input ka behavior document karo. Phir reference reassignment aur object mutation ke outputs execution se pehle predict karo. Last mein ek status-code mapper ko purane colon-style `switch` se likho, ek fallthrough bug intentionally introduce karo, phir arrow-style expression se rewrite karke bug class ko eliminate karo.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Why can `long total = 100000 * 100000;` be wrong? Repair it and state the expected result.

> **Hint:** At least one operand must already be long.

**Answer guide — compare after attempting:** Both original operands are int, so their multiplication overflows before assignment. `long total = 100000L * 100000;` yields 10000000000. Consider the maximum intermediate value, not just the final variable type.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

- [Java language basics](https://dev.java/learn/language-basics/)
- [Java conversion specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
