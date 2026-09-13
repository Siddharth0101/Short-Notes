---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 12
summary: Create independent instances before studying inheritance and polymorphism.
tags: fundamentals, java, classes, constructors
---

## Mental model

A class defines the state and behavior of a kind of object. An instance is one concrete object created from that definition. Two learners can use the same class and still have different names and progress. Pehle independent instances samjho; inheritance and interfaces make more sense after this foundation.

> **Core takeaway:** Constructors establish valid instances; methods should preserve their invariants.

## Create two independent objects

```java
class Learner {
    private final String name;
    private int completed;

    Learner(String name) {
        this.name = name;
    }

    void completeLesson() {
        completed++;
    }

    String summary() {
        return name + ": " + completed;
    }
}
```

Inside the main method of your Main class, use:

```java
Learner first = new Learner("Asha");
Learner second = new Learner("Ravi");
first.completeLesson();
System.out.println(first.summary()); // Asha: 1
System.out.println(second.summary()); // Ravi: 0
```

Place both classes in Main.java with only Main declared public for this exercise. The constructor has the class name and no return type. It initializes the object; it is not an ordinary method that returns the new instance. this.name refers to the field of the current instance, distinguishing it from the parameter name.

## Ownership and access

private keeps fields behind the class's methods. Encapsulation means the object can control valid updates rather than allowing callers to write arbitrary state. A getter and setter for every field is not automatically good encapsulation. Expose operations that match the domain, such as completeLesson, and later add validation when the domain requires it.

An instance field belongs to an object. A static field belongs to the class rather than one learner; making completed static would accidentally share the counter. Assigning first to another reference does not clone it. Java passes argument values, including reference values, by value; a called method may still mutate the same referenced object.

## Practice

Create two learners and complete different numbers of lessons. Verify their counters stay independent. Add a rename operation only after deciding whether names should be changeable; final currently prevents reassignment. Then explain what changes when two variables refer to the same learner instead of two separately constructed learners.

## Check before moving on

Explain class, instance, constructor, field and method without using them interchangeably. Next, review language edge cases and then learn interfaces, composition, equality and polymorphism.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Design a learner with a name and completed count. Reject a negative starting count, then create two learners and increment only one.

> **Hint:** Keep instance fields separate and validate before assignment.

**Answer guide — compare after attempting:** Use private instance fields, validate the constructor count, and expose a completion method rather than arbitrary unchecked writes. The second learner's count stays unchanged. A static count would incorrectly share the total across all learners unless that was explicitly intended.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[Dev.java classes and objects](https://dev.java/learn/classes-objects/) explains instance construction and member access.
