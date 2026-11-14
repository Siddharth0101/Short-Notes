---
id: java-decisions-loops
title: Java operators decisions and loops
track: java
order: 2
level: Foundation
minutes: 2
summary: `if/else` — chooses a branch according to a condition.
tags: fundamentals, java, decisions, loops
---

## Quick revision

> Revision target — Reason about a branch, a loop boundary and a numeric conversion down to the exact output.

- `if/else` — chooses a branch according to a condition.
- `switch` — cases on a value; arrow cases do not fall through.
- `for` — counted repetition; `while` — condition-based repetition.
- Enhanced for — traverses the values of an array/Iterable.
- `break` — exits the loop/switch; `continue` — the next iteration.
- Integer division — `5 / 2` → `2`; use a floating operand if you want a decimal.
- Boundary — check zero, the exact limit and the inputs around the limit.
- Short-circuit — &&/|| evaluate the right expression only when the result is still undecided.
- Switch expression — produces a value; a block branch uses yield.
- Loop mutation — a structural change to a collection inside an enhanced-for can be unsafe; choose the proper iterator/API.

### Edge cases and reasoning

- Boolean condition — a Java if needs a boolean; numeric/string truthiness as in JavaScript does not apply automatically.
- Promote before divide — (double)(5/2) converts an already truncated 2; 5/2.0 gives 2.5 directly.
- Null-safe guard — value != null && value.isEmpty() skips the right access; the reversed order fails on null.

## Understand it with an example

- Scenario — In `for (int i = 0; i < 3; i++)`, continue runs on `i == 1`, and i is printed in the other iterations.
- Reasoning — The output is `0`, then `2`; continue skips the rest of the current body, and the for-loop's update still happens.
- Catch — With the condition `i <= 3` an extra `3` is printed; in array traversal the same off-by-one can produce an invalid index.

## Recall and practice

- Question — The result of (double)(7 / 2) versus 7 / 2.0?
- Answer — 3.0 versus 3.5; in the first expression the integer division is already complete before the cast.
- Try it yourself — Write a grade classifier; verify that out-of-range is rejected and the boundary outcomes for 0, 59, 60, 100.

## Practice questions

### Easy · Integer division

```java
int total = 7, count = 2;
double avg = total / count;
System.out.println(avg);
```

<details>
<summary>Answer</summary>

- Output — `3.0`; `7 / 2` was `int` division (`3`) first and became a `double` afterwards.
- Fix — `(double) total / count` → `3.5`.
- Zero — with `count == 0`, int division throws `ArithmeticException`, double division gives `Infinity`/`NaN`.

</details>

### Easy · Write a switch expression

Map a day (`"SAT"`, `"SUN"`, the rest) to `"Weekend"`/`"Weekday"`, without a fall-through bug.

<details>
<summary>Answer</summary>

```java
String type = switch (day) {
    case "SAT", "SUN" -> "Weekend";
    default -> "Weekday";
};
```

- Arrow cases — no fall-through, no need for `break`.
- Expression — returns a value; a block uses `yield`.
- `null` — if `day` is null, a `NullPointerException` (unless you handle `case null`, Java 21+).

</details>

### Medium · `&&` vs `&`

```java
String name = null;
if (name != null & name.length() > 0) System.out.println("ok");
```

<details>
<summary>Answer</summary>

- Result — `NullPointerException`; `&` evaluates both sides.
- Fix — `&&` short-circuits: if the left is false the right is not evaluated.
- Use `&` — only when you need both side effects (rare) or for bitwise operations.

</details>

### Medium · Removing from a list inside a loop

```java
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));
for (Integer n : nums) {
    if (n % 2 == 0) nums.remove(n);
}
```

<details>
<summary>Answer</summary>

- Result — `ConcurrentModificationException` (the list changed structurally behind the enhanced for's iterator).
- Fix — `nums.removeIf(n -> n % 2 == 0);` or an explicit `Iterator` and `it.remove()`.
- Note — `remove(n)` here takes an `Integer` object, so the value is removed; with an `int` it would be the index.

</details>

### Hard · Efficient `isPrime`

Write `isPrime(int n)`: false for `n < 2`, check up to `sqrt(n)`, and no overflow for a large `n`.

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

- `i <= n / i` — `i * i <= n` can overflow to a negative value for a large `n`.
- Complexity — `O(√n)`; half the work by skipping even numbers.
- Tests — `-7, 0, 1, 2, 3, 4, 9, 25, 97, Integer.MAX_VALUE` (it is prime).

</details>

## Sources — further reading

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/02-java-decisions-loops.md)
