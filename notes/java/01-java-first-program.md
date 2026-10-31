---
id: java-first-program
title: First Java program variables and primitive types
track: java
order: 1
level: Foundation
minutes: 3
summary: JDK — Java develop karne ke tools; JVM — bytecode chalane ka runtime.
tags: fundamentals, java, first, program
---

## Quick revision

> Revision target — Source file se output tak compile/run ka flow aur variable initialization explain kar pao.

- JDK — Java develop karne ke tools; JVM — bytecode chalane ka runtime.
- Compile/run — `javac Main.java` → `java Main`.
- `main` — standard entry point `public static void main(String[] args)`.
- Class/file — public top-level class ka naam filename se match karo.
- Primitive — direct primitive value; reference — object ka reference ya null.
- Variable — declared type compatible value hi assign karo.
- `println` — output ke baad newline; `print` — same line.
- Bytecode — compiled class instructions; compatible JVM execute karti hai.
- Local variable — use se pehle assign karna zaroori; fields ko default values milti hain.
- Command-line args — main ka String array; numeric input explicitly parse/validate karo.

### Edge cases aur reasoning

- Compile-time versus runtime — syntax/type errors compilation mein; null access, missing runtime dependency jaise failures execution mein aate hain.
- Classpath — JVM ko classes/dependencies locate karne ka path; package name aur output-directory structure align karo.
- Version compatibility — newer target bytecode purane JVM par fail ho sakta hai; build release aur deployed runtime compatible rakho.

## Example se samjho

- Scenario — `int count; System.out.println(count);` ko compile karna hai; count abhi local variable hai.
- Reasoning — Compiler use se pehle assigned value maangta hai. `int count = 0;` ke baad program `0` print karega.
- Catch — Isi naam ka instance field default zero paa sakta hai; field ka default local variable par apply mat karo.

## Recall aur practice

- Sawal — javac successful ho gaya toh application ka har input safe prove hota hai?
- Jawaab — Nahi; compiler type/syntax check karta hai, runtime input, resources aur business rules ki separate validation chahiye.
- Khud try karo — Packaged Hello class compile/run karo; missing classpath, invalid numeric argument aur normal argument ka outcome explain karo.

## Practice questions

### Easy · File name aur public class

`Main.java` file mein yeh code hai:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hi");
    }
}
```

`javac Main.java` kya bolega?

<details>
<summary>Answer</summary>

- Result — compile error: class `Hello` is public, should be declared in a file named `Hello.java`.
- Rule — ek file mein max ek top-level `public` class, aur file ka naam usi class jaisa.
- Fix — file rename `Hello.java`, ya class ko non-public karo.

</details>

### Easy · Compile aur run ke commands

<details>
<summary>Answer</summary>

- Compile — `javac Hello.java` → `Hello.class` (bytecode).
- Run — `java Hello` (class name, `.class` extension nahi).
- Shortcut — Java 11+ par `java Hello.java` single-file program ko compile + run kar deta hai (scratch programs ke liye).

</details>

### Medium · Overflow aur uninitialized local

```java
int x = Integer.MAX_VALUE;
x++;
System.out.println(x);
int y;
System.out.println(y);
```

<details>
<summary>Answer</summary>

- Line 3 — `-2147483648`; `int` overflow silently wrap karta hai.
- Line 5 — compile error: "variable y might not have been initialized"; local variables ka default nahi hota (fields ka hota hai: `0`, `false`, `null`).
- Safe math — `Math.addExact(x, 1)` overflow par `ArithmeticException` deta hai.

</details>

### Medium · Command-line arguments

`java Greet Asha 25` chalaya. `args` kaise padhoge, aur `java Greet` (bina args) par kya hoga?

<details>
<summary>Answer</summary>

```java
public static void main(String[] args) {
    if (args.length < 2) {
        System.err.println("Usage: java Greet <name> <age>");
        System.exit(1);
    }
    String name = args[0];
    int age = Integer.parseInt(args[1]);
    System.out.println(name + " is " + age);
}
```

- `args[0]` — `"Asha"`; sab strings hain, number ke liye `Integer.parseInt` (invalid par `NumberFormatException`).
- Bina check — `ArrayIndexOutOfBoundsException`.

</details>

### Hard · `UnsupportedClassVersionError`

JDK 21 se compile kiya, server par Java 17 hai: `class file version 65.0 ... only recognizes class file versions up to 61.0`. Fix?

<details>
<summary>Answer</summary>

- Matlab — class file major version 65 = Java 21, 61 = Java 17; purana JVM naya bytecode nahi chala sakta.
- Fix 1 — server par Java 21+ runtime.
- Fix 2 — `javac --release 17` (Maven: `<maven.compiler.release>17</maven.compiler.release>`); yeh Java 17 API tak hi allow karta hai, sirf `-target` se zyada safe.
- Prevent — build aur runtime version CI/Docker image mein pin karo.

</details>

## Sources — aur padhne ke liye

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/01-java-first-program.md)
