# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trace a small program

```java
int target = 4;
int total = 0;
for (int day = 1; day <= target; day++) {
    total += day;
}
if (total >= 10) {
    System.out.println("Target reached");
} else {
    System.out.println("Keep studying");
}
System.out.println(total); // 10
```
