---
id: java-methods-arrays
title: Java methods arrays and strings
track: java
order: 3
level: Foundation
minutes: 12
summary: Pass inputs return results and process a fixed-size collection.
tags: fundamentals, java, methods, arrays
---

## Mental model

A method describes an operation with named parameters and a declared return type. An array stores a fixed number of values of a specified element type. These let you replace repeated statements with a reusable calculation. Start with static methods in the Main class so instance creation can be learned separately in the next lesson.

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

The parameter sessions names the received array reference. The caller supplies the argument. return gives the calculated int back to the caller; printing alone would not return that value. A method declared void does not return a result value. Keep the sum within int range for this introductory exercise; overflow handling belongs in the foundations review.

## Arrays and text

Array indexes start at zero and end at length minus one. Access outside that range throws an exception, rather than silently creating another element. A freshly allocated int array contains zeroes. The enhanced for loop visits each value; use an indexed loop when position matters. An array cannot grow in place; resizable collections come later.

Strings are immutable text values. Use equals for content comparison rather than ==, which compares reference identity for objects. Calling a method on null fails, so make absence handling part of the input contract. For a known literal, "done".equals(status) safely returns false if status is null.

## Practice

Write a method that counts sessions lasting at least 20 minutes. Test an empty array, a single matching session and mixed values. Then create a method that returns a greeting instead of printing it. Call that method from main and print its returned value. Explain why the calculation is easier to reuse when it does not own console output.

## Check before moving on

Distinguish parameter from argument and return value from side effect. Next, group state and behavior into an instance with a constructor.

## Sources

[Dev.java arrays](https://dev.java/learn/arrays/) and [classes and objects](https://dev.java/learn/classes-objects/) provide language reference material.
