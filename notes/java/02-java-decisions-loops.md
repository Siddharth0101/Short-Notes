---
id: java-decisions-loops
title: Java operators decisions and loops
track: java
order: 2
level: Foundation
minutes: 2
summary: `if/else` — condition ke hisaab se branch choose.
tags: fundamentals, java, decisions, loops
---

## Quick revision

> Revision target — Branch, loop boundary aur numeric conversion ko exact output ke saath reason karo.

- `if/else` — condition ke hisaab se branch choose.
- `switch` — value ke cases; arrow cases fall-through nahi karte.
- `for` — counted repetition; `while` — condition-based repetition.
- Enhanced for — array/Iterable ki values traverse karo.
- `break` — loop/switch se exit; `continue` — next iteration.
- Integer division — `5 / 2` → `2`; decimal chahiye toh floating operand.
- Boundary — zero, exact limit aur limit ke aas-paas inputs check karo.
- Short-circuit — &&/|| right expression tabhi evaluate jab result decide karna baaki ho.
- Switch expression — value produce karti hai; block branch mein yield use hota hai.
- Loop mutation — enhanced-for ke andar collection structural change unsafe ho sakta hai; proper iterator/API choose.

### Edge cases aur reasoning

- Boolean condition — Java if ko boolean chahiye; JavaScript jaise numeric/string truthiness automatically apply nahi hoti.
- Promote before divide — (double)(5/2) already truncated 2 ko convert; 5/2.0 directly 2.5 deta hai.
- Null-safe guard — value != null && value.isEmpty() right access skip karta; reversed order null par fail karega.

## Example se samjho

- Scenario — `for (int i = 0; i < 3; i++)` mein `i == 1` par continue, baaki iterations mein i print hota hai.
- Reasoning — Output `0`, phir `2`; continue current body ka rest skip karta hai, for-loop ka update phir bhi hota hai.
- Catch — Condition `i <= 3` karoge toh extra `3` print hoga; array traversal mein isi off-by-one se invalid index aa sakta hai.

## Recall aur practice

- Sawal — (double)(7 / 2) versus 7 / 2.0 ka result?
- Jawaab — 3.0 versus 3.5; first expression mein integer division cast se pehle complete ho chuki hai.
- Khud try karo — Grade classifier likho; out-of-range reject aur 0, 59, 60, 100 ke boundary outcomes verify karo.

## Practice questions

### Easy · Integer division

```java
int total = 7, count = 2;
double avg = total / count;
System.out.println(avg);
```

<details>
<summary>Answer</summary>

- Output — `3.0`; `7 / 2` pehle `int` division (`3`) hua, phir `double` bana.
- Fix — `(double) total / count` → `3.5`.
- Zero — `count == 0` par int division `ArithmeticException`, double division `Infinity`/`NaN`.

</details>

### Easy · Switch expression likho

Day (`"SAT"`, `"SUN"`, baaki) ko `"Weekend"`/`"Weekday"` mein map karo, bina fall-through bug ke.

<details>
<summary>Answer</summary>

```java
String type = switch (day) {
    case "SAT", "SUN" -> "Weekend";
    default -> "Weekday";
};
```

- Arrow cases — fall-through nahi hota, `break` ki zaroorat nahi.
- Expression — value return karta hai; block mein `yield` use hota hai.
- `null` — `day` null ho toh `NullPointerException` (jab tak `case null` handle na karo, Java 21+).

</details>

### Medium · `&&` vs `&`

```java
String name = null;
if (name != null & name.length() > 0) System.out.println("ok");
```

<details>
<summary>Answer</summary>

- Result — `NullPointerException`; `&` dono sides evaluate karta hai.
- Fix — `&&` short-circuit: left false ho toh right evaluate nahi hota.
- Use `&` — sirf jab dono side effects chahiye (rare) ya bitwise operations.

</details>

### Medium · Loop mein list se remove

```java
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));
for (Integer n : nums) {
    if (n % 2 == 0) nums.remove(n);
}
```

<details>
<summary>Answer</summary>

- Result — `ConcurrentModificationException` (enhanced for iterator ke peeche list structurally badli).
- Fix — `nums.removeIf(n -> n % 2 == 0);` ya explicit `Iterator` aur `it.remove()`.
- Note — `remove(n)` yahan `Integer` object hai, isliye value remove hoti; `int` hota toh index.

</details>

### Hard · Efficient `isPrime`

`isPrime(int n)` likho: `n < 2` false, `sqrt(n)` tak check, aur bade `n` par overflow na ho.

<details>
<summary>Answer</summary>

```java
static boolean isPrime(int n) {
    if (n < 2) return false;
    if (n % 2 == 0) return n == 2;
    for (int i = 3; i <= n / i; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}
```

- `i <= n / i` — `i * i <= n` bade `n` par overflow karke negative ho sakta hai.
- Complexity — `O(√n)`; even numbers skip karke aadha kaam.
- Tests — `-7, 0, 1, 2, 3, 4, 9, 25, 97, Integer.MAX_VALUE` (prime hai).

</details>

## Sources — aur padhne ke liye

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/02-java-decisions-loops.md)
