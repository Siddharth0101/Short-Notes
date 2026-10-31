---
id: java-methods-arrays
title: Java methods arrays and strings
track: java
order: 3
level: Foundation
minutes: 3
summary: Method — typed parameters lo, declared type ka result return karo.
tags: fundamentals, java, methods, arrays
---

## Quick revision

> Revision target — Method call mein value copy, shared object mutation aur returned result ka difference pakdo.

- Method — typed parameters lo, declared type ka result return karo.
- `void` — return value nahi; early `return` allowed.
- Overloading — same naam, different parameter list; return type alone enough nahi.
- Pass-by-value — reference ki copy pass hoti hai; object mutate ho sakta hai.
- Array — fixed length; index `0` se `length - 1`.
- 2D array — arrays ka array; rows ki lengths alag ho sakti hain.
- Varargs — multiple arguments array ki tarah milte hain; last parameter hota hai.
- Array length — fixed property; String length() method hai.
- Bounds — invalid index par ArrayIndexOutOfBoundsException; negative/empty cases check karo.
- Return contract — non-void method ke har normally completing path ko value chahiye.

### Method calls

- Varargs overload — ambiguity avoid; explicit method contracts rakho.

### Edge cases aur reasoning

- Array covariance — Object[] mein actual String[] reference possible; incompatible write ArrayStoreException de sakti hai.
- Copy depth — Arrays.copyOf outer array copy karta hai; object elements aur 2D rows ke references shared ho sakte hain.
- String transform — immutable String operation naya result de sakti hai; returned value assign kiye bina original nahi badlega.

## Example se samjho

- Scenario — Caller ka `int[] scores = {4, 8}` hai; method parameter par `scores[0] = 9` karke phir parameter ko new array assign karta hai.
- Reasoning — Caller ko `[9, 8]` dikhega: element mutation shared array par hui, parameter reassignment sirf local reference copy par.
- Catch — Reference pass-by-value hai; mutation dikhna pass-by-reference ka proof nahi. Replacement chahiye toh new array return karke caller assign kare.

## Recall aur practice

- Sawal — Method mein parameter = new int[0] karne se caller array kyun unchanged?
- Jawaab — Reference value ki local copy reassign hoti hai; caller binding same array ko point karti rehti hai.
- Khud try karo — Ragged 2D array sum likho; empty rows, null-row policy aur original input unchanged verify karo.

## Practice questions

### Easy · Java hamesha pass-by-value

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
- Primitive — value copy; `x = 10` caller ko affect nahi karta.
- Array — reference ki copy; `arr[0]` shared array badalta hai, par `arr = new ...` sirf local copy re-point karta hai.

</details>

### Easy · Array print kyun ajeeb dikhta hai?

```java
int[] a = {1, 2, 3};
int[][] grid = {{1, 2}, {3, 4}};
System.out.println(a);
```

<details>
<summary>Answer</summary>

- Output — kuch `[I@1b6d3586` jaisa (type + hash), contents nahi.
- Fix — `Arrays.toString(a)` → `[1, 2, 3]`; 2D ke liye `Arrays.deepToString(grid)`.
- Equality — `Arrays.equals` / `Arrays.deepEquals`; `==` reference compare karta hai.

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
- Interview line — compiler compile time par overload choose karta hai; widening boxing se pehle aata hai.

</details>

### Medium · 2D array ka shallow copy

```java
int[][] grid = {{1, 2}, {3, 4}};
int[][] copy = grid.clone();
copy[0][0] = 9;
System.out.println(grid[0][0]);
```

<details>
<summary>Answer</summary>

- Output — `9`; `clone()` sirf outer array copy karta hai, rows shared hain.
- Deep copy:

```java
int[][] deep = new int[grid.length][];
for (int i = 0; i < grid.length; i++) deep[i] = grid[i].clone();
```

- 1D primitive array ke liye `clone()`/`Arrays.copyOf` theek hai.

</details>

### Hard · `reverseWords`

`reverseWords("  hello   world  java ")` → `"java world hello"`. Extra spaces hatao; loop mein `String +=` kyun avoid karna?

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

- `trim` pehle — warna `split` leading empty string deta hai.
- `+=` in loop — har baar naya `String` copy → `O(n²)`; `StringBuilder` amortized `O(n)`.
- One-liner — `String.join(" ", reversedList)` bhi theek.

</details>

## Sources — aur padhne ke liye

- [Dev.java arrays](https://dev.java/learn/arrays/)
- [classes and objects](https://dev.java/learn/classes-objects/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/03-java-methods-arrays.md)
