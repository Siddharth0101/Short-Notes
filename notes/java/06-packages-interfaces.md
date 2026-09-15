---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 19
summary: Chhote public contract ke peeche implementation rakho; constructor se required dependencies do.
tags: packages, interfaces, encapsulation
---

## Mental model — simple soch

Package related types ka namespace hai. Interface behavior ka contract hai; implementation us behavior ko perform karti hai. Dono alag problems solve karte hain: package names collisions aur visibility organize karte hain, interface caller ko concrete implementation se separate karta hai. Framework introduce karne se pehle small notification feature se concept samjho.

> **Core takeaway:** Chhote public contract ke peeche implementation rakho; constructor se required dependencies do.

## Build a package from two files

Yeh Java 17+ example hai. Har public type named file mein save karo; package aur directories match honi chahiye.

```java
// src/study/notify/Notifier.java
package study.notify;
public interface Notifier {
    void send(String message);
}
```

```java
// src/study/app/Main.java
package study.app;
import study.notify.Notifier;

public class Main {
    static class StudyService {
        private final Notifier notifier;
        StudyService(Notifier notifier) { this.notifier = notifier; }
        void complete(String lesson) { notifier.send("Completed: " + lesson); }
    }
    public static void main(String[] args) {
        Notifier console = message -> System.out.println(message);
        new StudyService(console).complete("Packages");
    }
}
```

Project directory se compile karo, phir fully qualified class name se run karo:

```text
javac -d out src/study/notify/Notifier.java src/study/app/Main.java
java -cp out study.app.Main
Completed: Packages
```

Lambda interface ka single abstract method implement karti hai. StudyService implementation receive karti hai; console/file/network delivery khud choose nahi karti. Constructor injection ordinary Java hai; Spring ke bina bhi hoti hai. Exercise ko two-file rakhne ke liye service yahan nested hai.

## Visibility is a design choice

Public type package ke bahar accessible ho sakta hai jab module bhi access allow kare. Top-level type par public na ho toh package access hota hai. Private members declaring class ke hain. protected subclass access bhi deta hai, lekin other-package access par extra restrictions hain. Ise kisi bhi object's field ki universal permission mat samjho.

Import simple type name use karne deta hai; instances load ya subpackages include nahi karta. `import java.util.*` se `java.util.concurrent.*` import nahi hota. Same simple name wale types mein kam-se-kam ek ko fully qualify karo. Public API mein caller ko required types hi expose karo.

## Contract versus inheritance

Interface caller ka contract batata hai. Inheritance implementation share karke subclass ko superclass behavior se couple bhi karti hai. Sirf collaborator replace karna ho toh composition consider karo. Har class ka interface blindly mat banao; meaningful boundary, multiple implementations ya testing seam ho tab justify karo.

## Practice

Console notifier ko List mein messages add karne wale notifier se replace karo. Do lessons complete karke values dekho; StudyService ke andar change nahi chahiye. Nested StudyService ko other package se import karke visibility restriction explain karo.

## Depth walkthrough — andar kya ho raha hai?

### Caller ko implementation se kitna pata hona chahiye?

StudyService ko notification bhejni hai. Agar constructor concrete EmailNotifier maange toh test aur SMS variation concrete dependency se tied hain. Notifier interface ka send contract maange toh service operation par depend karegi, transport par nahi. Lekin interface useful tab hai jab implementations same promised behavior preserve karein.

Package-private type same package ke implementation detail tak visibility restrict kar sakta hai. Public type external callers ka supported contract ban sakta hai. Har class public karna reuse ka free benefit nahi; later change karne ka compatibility surface badhta hai.

Import source name resolution simplify karta hai, runtime dependency download nahi karta. Package declaration directory/build configuration se align honi chahiye. Different packages mein same simple class name ho toh ambiguity resolve karo; framework problem assume karne se pehle Java compile error padho.

**Practice:** Fake notifier messages list mein collect kare. Service ko fake inject karke assert correct message send hui. Email server ki need nahi. Phir failure contract decide karo: send exception propagate kare, retry queue own kare ya outcome return kare? Interface signature ke peeche failure semantics bhi contract hain.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Type package-private ki jagah public ho toh kaun access kar sakta hai?

**Apply — khud try karo:** StudyService se print kiye bina Packages aur Interfaces ki notifications order mein record karo.

> **Hint — chhota ishara:** Constructor ko behavior chahiye, koi ek fixed delivery mechanism nahi.

**Answer guide — pehle khud karo, phir compare karo:** `List<String> messages = new ArrayList<>();` banao; Notifier ke liye `messages::add` pass karo aur complete do baar call karo. Expected strings `Completed: Packages`, `Completed: Interfaces` hain. Is void contract mein method-reference ka boolean result discard ho sakta hai. Main mein List aur ArrayList import karo.

**Exit check — aage badhne se pehle:** StudyService change kiye bina third implementation add karo; har caller kis type par depend karta hai, samjhao.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://dev.java/learn/packages/).
