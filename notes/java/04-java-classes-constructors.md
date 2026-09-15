---
id: java-classes-constructors
title: Classes objects constructors and encapsulation
track: java
order: 4
level: Foundation
minutes: 15
summary: Constructor valid object banata hai; methods ko uske invariants, yani valid state ke rules, bachane chahiye.
tags: fundamentals, java, classes, constructors
---

## Mental model — simple soch

Class object ki structure aur behavior define karti hai. Instance us definition se bana actual object hai. Class ko admission-form format samjho aur instances ko Asha/Ravi ke filled forms: format same, data alag. Dono learners ka name/progress independent ho sakta hai. Pehle yeh independence samjho, phir inheritance/interfaces easy lagenge.

> **Core takeaway:** Constructor valid object banata hai; methods ko uske invariants, yani valid state ke rules, bachane chahiye.

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

Main class ke main method ke andar yeh use karo:

```java
Learner first = new Learner("Asha");
Learner second = new Learner("Ravi");
first.completeLesson();
System.out.println(first.summary()); // Asha: 1
System.out.println(second.summary()); // Ravi: 0
```

Dono classes Main.java mein rakho; is exercise mein sirf Main public ho. Constructor ka naam class jaisa hota hai aur return type nahi hota. Woh object initialize karta hai; normal method ki tarah new instance return nahi karta. this.name current instance ka field hai, parameter name se alag.

## Ownership and access

private fields ko class ke methods ke through control karne deta hai. Encapsulation ka matlab arbitrary updates rok kar valid changes allow karna hai. Har field ka getter/setter banana automatically good encapsulation nahi. completeLesson jaise domain operation expose karo; need ke hisaab se validation add karo.

Instance field particular object ki hoti hai. static field class ki shared field hoti hai; completed static karoge toh learners count share karenge. first ko doosre reference mein assign karna clone nahi banata. Java reference value bhi copy karke pass karta hai; method phir bhi same referenced object mutate kar sakta hai.

## Practice

Do learners banao aur alag numbers of lessons complete karo; counters independent check karo. Rename add karne se pehle decide karo name changeable hona chahiye ya nahi; abhi final reassignment rokta hai. Phir two objects aur same object ko refer karne wale two variables compare karo.

## Aage badhne se pehle check karo

Class, instance, constructor, field aur method ka meaning alag samjhao. Next language edge cases review karke interfaces, composition, equality aur polymorphism padho.

## Depth walkthrough — andar kya ho raha hai?

### Constructor valid object banane ka gate hai

CourseSession ke title aur minutes fields hain. Constructor blank title ya negative minutes allow kar de toh har later method ko invalid state defend karni padegi. Constructor invariant establish kare; mutation methods bhi preserve karein. Private field alone validation nahi karti.

Do objects same class se banne par own instance fields rakhte hain. Static field class-level shared state hai; per-student progress static bana diya toh students ek doosre ka count change karenge. Static useful shared constant ho sakti hai, automatically wrong nahi—ownership decide karo.

`this.minutes = minutes` mein left current object's field aur right constructor parameter hai. Parameter shadow hone se names same hain; this distinction explicit karti hai. Constructor return type nahi declare karta aur object initialization own karta hai.

**Practice:** Two sessions create karo; one duration update karo, doosri unchanged verify karo. Invalid duration reject karne par existing object half-updated na ho. Pehle validate, phir fields change. Immutable design chahiye toh mutation methods omit karke updated new value return karna consider karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Name aur completed count wala learner banao. Negative starting count reject karo. Do learners banao aur sirf ek ka count badhao.

> **Hint — chhota ishara:** Instance fields alag rakho; assignment se pehle validation karo.

**Answer guide — pehle khud karo, phir compare karo:** Private instance fields rakho, constructor count validate karo aur unchecked writes ke bajay completion method do. Doosre learner ka count same rahega. static count sab learners mein share hoga; yeh tabhi sahi hai jab shared total intentionally chahiye.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Dev.java classes and objects](https://dev.java/learn/classes-objects/) mein instance construction aur member access padho.
