---
id: java-first-program
title: First Java program variables and primitive types
track: java
order: 1
level: Foundation
minutes: 12
summary: Start with main compile a program and declare typed values.
tags: fundamentals, java, first, program
---

## Mental model

Java source is compiled into bytecode and executed by the JVM. The JDK supplies development tools including javac. Start by running one program and changing one value. You do not need Spring, Maven, collections or object-oriented terminology to understand this first example. The examples in this course use Java 21-compatible syntax unless a later chapter states otherwise.

## Compile and run

Save this as Main.java. The public class name and file name match.

```java
public class Main {
    public static void main(String[] args) {
        String learner = "Asha";
        int completed = 0;
        boolean enrolled = true;
        completed = completed + 1;
        System.out.println(learner);
        System.out.println(completed);
        System.out.println(enrolled);
    }
}
```

```text
javac Main.java
java Main
```

main is the entry point in this example. Read the statements inside it from top to bottom. String represents text; int stores whole numbers; boolean stores true or false. The declared type determines which assignments and operations are legal. Replacing completed with a text value produces a compilation error rather than changing its declared type.

## Assignment and naming

Declaration introduces a name and type. Initialization supplies its first value. Reassignment changes the stored value later. Use descriptive names and remember that Java is case-sensitive. A local variable must be assigned before it is read. final prevents reassignment after initialization; it does not mean every object reachable through a reference is frozen.

Java has eight primitive types: byte, short, int, long, float, double, char and boolean. String is not a primitive. Begin with int, double and boolean; ranges and conversion edge cases are covered in the later foundations review. Do not try to memorize the entire JVM before writing a useful calculation.

## Practice

Change the learner name and initialize completed to 3. Add two to it and predict the output. Introduce a double named hoursStudied and print it. Deliberately assign a string to completed, read the compiler error and restore the correct type. Finally remove the initial value from completed and observe why reading it is rejected.

## Check before moving on

Explain the difference between a compilation error and a wrong numeric result in a running program. Next, use operators and conditions to compute values and choose branches.

## Sources

[Dev.java language basics](https://dev.java/learn/language-basics/) introduces Java declarations and syntax.
