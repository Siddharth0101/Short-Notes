---
id: java-methods-arrays
title: Java methods arrays and strings
track: java
order: 3
level: Foundation
minutes: 3
summary: Method — takes typed parameters and returns a result of the declared type.
tags: fundamentals, java, methods, arrays
---

## Quick revision

> Revision target — Catch the difference between a value copy, shared object mutation and a returned result in a method call.

- Method — takes typed parameters and returns a result of the declared type.
- `void` — no return value; an early `return` is allowed.
- Overloading — the same name, a different parameter list; the return type alone is not enough.
- Pass-by-value — a copy of the reference is passed; the object can still be mutated.
- Array — a fixed length; indexes from `0` to `length - 1`.
- 2D array — an array of arrays; the rows can have different lengths.
- Varargs — multiple arguments arrive as an array; it is the last parameter.
- Array length — a fixed property; for a String, length() is a method.
- Bounds — ArrayIndexOutOfBoundsException on an invalid index; check the negative/empty cases.
- Return contract — every normally completing path of a non-void method needs a value.

### Method calls

- Varargs overload — avoid ambiguity; keep explicit method contracts.

### Edge cases and reasoning

- Array covariance — an Object[] can hold an actual String[] reference; an incompatible write can throw ArrayStoreException.
- Copy depth — Arrays.copyOf copies the outer array; object elements and the row references of a 2D array can stay shared.
- String transform — an operation on an immutable String can give a new result; the original does not change unless you assign the returned value.

## Understand it with an example

- Scenario — The caller has `int[] scores = {4, 8}`; the method does `scores[0] = 9` on the parameter and then assigns a new array to the parameter.
- Reasoning — The caller sees `[9, 8]`: the element mutation happened on the shared array, the parameter reassignment only on the local copy of the reference.
- Catch — The reference is passed by value; a visible mutation is not proof of pass-by-reference. If you want a replacement, return the new array and let the caller assign it.

## Recall and practice

- Question — Why is the caller's array unchanged after parameter = new int[0] in the method?
- Answer — The local copy of the reference value is reassigned; the caller's binding keeps pointing at the same array.
- Try it yourself — Write a ragged 2D array sum; verify empty rows, the null-row policy and that the original input is unchanged.

## Practice questions

### Easy · Java is always pass-by-value

```java
static void change(int x, int[] arr) {
    x = 10;
    arr[0] = 10;
    arr = new int[] {99};
}
int a = 1;
int[] nums = {1, 2};
change(a, nums);
System.out.println(a + " " + nums[0]);
```

<details>
<summary>Answer</summary>

- Output — `1 10`.
- Primitive — a value copy; `x = 10` does not affect the caller.
- Array — a copy of the reference; `arr[0]` changes the shared array, but `arr = new ...` only re-points the local copy.

</details>

### Easy · Why does printing an array look strange?

```java
int[] a = {1, 2, 3};
int[][] grid = {{1, 2}, {3, 4}};
System.out.println(a);
```

<details>
<summary>Answer</summary>

- Output — something like `[I@1b6d3586` (type + hash), not the contents.
- Fix — `Arrays.toString(a)` → `[1, 2, 3]`; `Arrays.deepToString(grid)` for 2D.
- Equality — `Arrays.equals` / `Arrays.deepEquals`; `==` compares references.

</details>

### Medium · Overload resolution

```java
static void print(long x) { System.out.println("long"); }
static void print(Integer x) { System.out.println("Integer"); }
static void print(int... x) { System.out.println("varargs"); }
print(5);
```

<details>
<summary>Answer</summary>

- Output — `long`.
- Order — exact match → widening (`int`→`long`) → boxing (`Integer`) → varargs.
- Interview line — the compiler chooses the overload at compile time; widening comes before boxing.

</details>

### Medium · A shallow copy of a 2D array

```java
int[][] grid = {{1, 2}, {3, 4}};
int[][] copy = grid.clone();
copy[0][0] = 9;
System.out.println(grid[0][0]);
```

<details>
<summary>Answer</summary>

- Output — `9`; `clone()` copies only the outer array, the rows are shared.
- Deep copy:

```java
int[][] deep = new int[grid.length][];
for (int i = 0; i < grid.length; i++) deep[i] = grid[i].clone();
```

- For a 1D primitive array `clone()`/`Arrays.copyOf` is fine.

</details>

### Hard · `reverseWords`

`reverseWords("  hello   world  java ")` → `"java world hello"`. Remove the extra spaces; why avoid `String +=` in a loop?

<details>
<summary>Answer</summary>

```java
static String reverseWords(String s) {
    String trimmed = s.trim();
    if (trimmed.isEmpty()) return "";
    String[] words = trimmed.split("\\s+");
    StringBuilder out = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        out.append(words[i]);
        if (i > 0) out.append(' ');
    }
    return out.toString();
}
```

- `trim` first — otherwise `split` gives a leading empty string.
- `+=` in loop — a new `String` copy every time → `O(n²)`; `StringBuilder` is amortized `O(n)`.
- One-liner — `String.join(" ", reversedList)` is fine too.

</details>

## Sources — further reading

- [Dev.java arrays](https://dev.java/learn/arrays/)
- [classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/03-java-methods-arrays.md)
