---
id: java-decisions-loops
title: Java operators decisions and loops
track: java
order: 2
level: Foundation
minutes: 12
summary: Calculate values choose branches and repeat work using boolean conditions.
tags: fundamentals, java, decisions, loops
---

## Mental model

Control flow determines which statement executes next. Java if and loop conditions require booleans; an integer is not accepted as a truthy substitute. Work inside the main method from the previous lesson. This lets you focus on decisions and repetition without adding methods or classes of your own yet.

> **Core takeaway:** Control flow implements a rule; test each boundary and the zero-iteration case.

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

At the beginning of each iteration, total is the sum of the earlier day values. The loop initializes day once, checks the condition before each body execution and increments afterward. When day becomes 5, the body stops. Changing <= to < changes which values are included; that is a boundary decision, not a formatting preference.

## Operators and branch order

Arithmetic includes +, -, *, / and %. Integer division such as 7 / 2 produces 3; 7 / 2.0 uses floating-point arithmetic and produces 3.5. Assignment = stores a value; equality == compares primitive values. && and || combine booleans and short circuit. ! negates a boolean. Parentheses help make grouped conditions clear.

An else-if chain runs the first matching branch. Write more specific conditions before broad ones when they overlap. A while loop checks its condition before each iteration, while do...while executes once before checking. break exits a loop and continue proceeds to the next iteration. Identify the update that eventually makes the condition false, especially in while loops.

## Practice

Sum the even integers from 1 through 10 using a loop and a condition. Predict the result before running. Then classify a score into three bands with boundaries at 50 and 80. Test 49, 50, 79 and 80 so every transition is exercised. Finally deliberately remove a loop update, explain the infinite-loop risk and restore it before running again.

## Check before moving on

You should be able to trace the counter and accumulator separately and explain short-circuit logic. Next, extract repeated calculations into methods and pass values explicitly.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Write a loop that counts even integers from 1 through n inclusive. What are the results for n = 0, 1, 2, and 5?

> **Hint:** Use an inclusive upper bound and test divisibility by 2.

**Answer guide — compare after attempting:** The counts are 0, 0, 1, and 2. Start count at zero and loop from 1 while the index is at most n, incrementing only for even values. State whether negative n is rejected or treated as an empty range.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[Dev.java language basics](https://dev.java/learn/language-basics/) documents operators and control flow.
