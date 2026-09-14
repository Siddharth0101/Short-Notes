---
id: java-packages-interfaces
title: Packages access control and interface boundaries
track: java
order: 6
level: Intermediate
minutes: 16
summary: Organize Java code and replace dependencies through explicit contracts.
tags: packages, interfaces, encapsulation
---

## Mental model

Package related types ka namespace hai. Interface behavior ka contract hai; implementation us behavior ko perform karti hai. Dono alag problems solve karte hain: package names collisions aur visibility organize karte hain, interface caller ko concrete implementation se separate karta hai. Start with a small notification feature before introducing any framework.

> **Core takeaway:** Hide implementation details behind a small public contract and supply dependencies through constructors.

## Build a package from two files

Java 17+ example. Save each public type in the named file, keeping package names and directory names aligned.

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

Compile from the project directory, then run using the fully qualified class name:

```text
javac -d out src/study/notify/Notifier.java src/study/app/Main.java
java -cp out study.app.Main
Completed: Packages
```

The lambda implements the interface's single abstract method. StudyService receives an implementation; it never decides whether delivery uses a console, file or network. Constructor injection is ordinary Java, even without Spring. The nested service remains inside this example to keep the two-file exercise small.

## Visibility is a design choice

A public type can be used outside its package when the module also permits access. A top-level type without public has package access. Private members belong to their declaring class; protected also permits subclass access, with extra restrictions for access from other packages. Avoid treating protected as a universal permission to access another object's fields.

An import lets you use a simple type name; it does not load all instances or include subpackages. `import java.util.*` does not import `java.util.concurrent.*`. When two types share a simple name, qualify at least one explicitly. Public APIs should expose only the types callers actually need.

## Contract versus inheritance

An interface says what callers can request. Inheritance also shares an implementation and couples subclasses to superclass behavior. Prefer composition when you only need to replace a collaborator. Do not create an interface for every class automatically: use it where multiple implementations, testing seams or a meaningful boundary justify the extra concept.

## Practice

Replace the console notifier with one that adds messages to a List. Complete two lessons and inspect the collected values. No changes should be required inside StudyService. Then try importing the nested StudyService from another package and explain why its visibility blocks access.

## Revision and practice lab

**Recall:** What changes when a type is public instead of package-private?

**Apply:** Record notifications for Packages and Interfaces in order, without printing from StudyService.

> **Hint:** The constructor expects behavior, not a particular delivery mechanism.

**Answer guide — compare after attempting:** Create `List<String> messages = new ArrayList<>();`, pass `messages::add` as the Notifier, and call complete twice. Expected values are `Completed: Packages` and `Completed: Interfaces`. The method reference's returned boolean can be discarded for this void contract. Import List and ArrayList in Main.

**Exit check:** Add a third implementation without modifying StudyService and explain which type each caller depends on.

## Sources

[Official reference](https://dev.java/learn/packages/).
