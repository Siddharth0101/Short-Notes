---
id: java-first-program
title: First Java program variables and primitive types
track: java
order: 1
level: Foundation
minutes: 12
summary: Java variables ka declared type hota hai; arithmetic ka result operands ke types se decide hota hai.
tags: fundamentals, java, first, program
---

## Mental model — simple soch

Java source pehle bytecode mein compile hota hai, phir JVM use execute karti hai. JDK mein javac jaise development tools milte hain. Pehle ek program run karo aur ek value change karo. Is first example ke liye Spring, Maven ya collections ki need nahi. Course mein Java 21-compatible syntax use hui hai, jab tak chapter alag version na bataye.

> **Core takeaway:** Java variables ka declared type hota hai; arithmetic ka result operands ke types se decide hota hai.

## Compile and run

Isse Main.java mein save karo. Public class ka naam aur filename same rakho.

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

Is example ka entry point main hai. Andar statements top-to-bottom padho. String text, int whole numbers aur boolean true/false rakhta hai. Declared type decide karta hai kaunsi assignments/operations valid hain. completed ko text doge toh compile error aaegi; variable ka declared type nahi badlega.

## Assignment and naming

Declaration naam aur type introduce karti hai; initialization first value deti hai; reassignment baad mein value badalti hai. Meaningful names rakho; Java case-sensitive hai. Local variable read karne se pehle assign honi chahiye. final reassignment rokta hai; reference ke through reachable poora object graph freeze nahi karta.

Java ke eight primitives byte, short, int, long, float, double, char aur boolean hain. String primitive nahi hai. Pehle int, double, boolean se practice karo; ranges/conversions later foundations review mein aayengi. Useful calculation likhne se pehle entire JVM ratna zaroori nahi.

## Practice

Learner name badlo aur completed=3 rakho. Do add karke output predict karo. hoursStudied naam ka double print karo. completed ko string assign karke compiler error padho, phir correct type restore karo. Initial value hata kar dekho ki unassigned local read kyun reject hoti hai.

## Aage badhne se pehle check karo

Compilation error aur running program ke wrong numeric result ka difference samjhao. Next lesson mein operators aur conditions se calculations aur branches choose karenge.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `7 / 2`, `7 / 2.0` aur `double x = 7 / 2;` predict karo. Last assignment surprising kyun hai?

> **Hint:** Division pehle hoti hai, destination variable mein assignment baad mein.

**Answer guide — compare after attempting:** Answers 3, 3.5 aur 3.0 hain. Integer operands integer division karte hain, fractional part truncate hota hai. Baad mein double mein store karne se lost fraction wapas nahi aata. Fraction chahiye toh kam-se-kam ek operand floating-point rakho.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Dev.java language basics](https://dev.java/learn/language-basics/) mein Java declarations aur syntax aur padho.
