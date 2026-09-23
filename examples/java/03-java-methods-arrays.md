# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A complete calculation

```java
public class Main {
    static int totalMinutes(int[] sessions) {
        int total = 0;
        for (int minutes : sessions) {
            total += minutes;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] sessions = {15, 20, 10};
        int total = totalMinutes(sessions);
        System.out.println(total); // 45
        System.out.println(sessions.length); // 3
    }
}
```

## Depth walkthrough — andar kya ho raha hai?

```java
public class ReferenceTrace {
    static void change(int[] values) {
        values[0] = 9;
        values = new int[]{7};
        values[0] = 8;
    }
    public static void main(String[] args) {
        int[] original = {1, 2};
        change(original);
        System.out.println(java.util.Arrays.toString(original)); // [9, 2]
    }
}
```
