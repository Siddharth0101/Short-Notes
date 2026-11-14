---
id: java-first-program
title: First Java program variables and primitive types
track: java
order: 1
level: Foundation
minutes: 3
summary: JDK — the tools for developing Java; JVM — the runtime that executes bytecode.
tags: fundamentals, java, first, program
---

## Quick revision

> Revision target — Be able to explain the compile/run flow from source file to output, and variable initialization.

- JDK — the tools for developing Java; JVM — the runtime that executes bytecode.
- Compile/run — `javac Main.java` → `java Main`.
- `main` — the standard entry point `public static void main(String[] args)`.
- Class/file — match the name of the public top-level class to the filename.
- Primitive — a direct primitive value; reference — a reference to an object, or null.
- Variable — assign only a value compatible with the declared type.
- `println` — a newline after the output; `print` — stays on the same line.
- Bytecode — compiled class instructions; a compatible JVM executes them.
- Local variable — must be assigned before use; fields get default values.
- Command-line args — the String array of main; parse/validate numeric input explicitly.

### Edge cases and reasoning

- Compile-time versus runtime — syntax/type errors appear at compilation; failures such as null access or a missing runtime dependency appear at execution.
- Classpath — the path the JVM uses to locate classes/dependencies; align the package name with the output-directory structure.
- Version compatibility — bytecode for a newer target can fail on an older JVM; keep the build release and the deployed runtime compatible.

## Understand it with an example

- Scenario — `int count; System.out.println(count);` has to compile; count is a local variable for now.
- Reasoning — The compiler demands an assigned value before use. After `int count = 0;` the program prints `0`.
- Catch — An instance field of the same name can get a default zero; do not apply a field's default to a local variable.

## Recall and practice

- Question — If javac succeeded, does that prove every input of the application is safe?
- Answer — No; the compiler checks types/syntax, while runtime input, resources and business rules need separate validation.
- Try it yourself — Compile/run a packaged Hello class; explain the outcome of a missing classpath, an invalid numeric argument and a normal argument.

## Practice questions

### Easy · File name and public class

The file `Main.java` contains this code:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hi");
    }
}
```

What will `javac Main.java` say?

<details>
<summary>Answer</summary>

- Result — a compile error: class `Hello` is public, should be declared in a file named `Hello.java`.
- Rule — at most one top-level `public` class per file, and the file is named after that class.
- Fix — rename the file to `Hello.java`, or make the class non-public.

</details>

### Easy · The compile and run commands

<details>
<summary>Answer</summary>

- Compile — `javac Hello.java` → `Hello.class` (bytecode).
- Run — `java Hello` (the class name, without the `.class` extension).
- Shortcut — on Java 11+ `java Hello.java` compiles + runs a single-file program (for scratch programs).

</details>

### Medium · Overflow and an uninitialized local

```java
int x = Integer.MAX_VALUE;
x++;
System.out.println(x);
int y;
System.out.println(y);
```

<details>
<summary>Answer</summary>

- Line 3 — `-2147483648`; `int` overflow wraps silently.
- Line 5 — a compile error: "variable y might not have been initialized"; local variables have no default (fields do: `0`, `false`, `null`).
- Safe math — `Math.addExact(x, 1)` throws `ArithmeticException` on overflow.

</details>

### Medium · Command-line arguments

You ran `java Greet Asha 25`. How do you read `args`, and what happens on `java Greet` (without args)?

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

- `args[0]` — `"Asha"`; they are all strings, so use `Integer.parseInt` for a number (`NumberFormatException` on invalid input).
- Without a check — `ArrayIndexOutOfBoundsException`.

</details>

### Hard · `UnsupportedClassVersionError`

Compiled with JDK 21, and the server has Java 17: `class file version 65.0 ... only recognizes class file versions up to 61.0`. The fix?

<details>
<summary>Answer</summary>

- Meaning — class file major version 65 = Java 21, 61 = Java 17; an older JVM cannot run newer bytecode.
- Fix 1 — a Java 21+ runtime on the server.
- Fix 2 — `javac --release 17` (Maven: `<maven.compiler.release>17</maven.compiler.release>`); it allows only the Java 17 API, which is safer than `-target` alone.
- Prevent — pin the build and runtime version in the CI/Docker image.

</details>

## Sources — further reading

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/01-java-first-program.md)
