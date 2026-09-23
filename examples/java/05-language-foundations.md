# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Types and conversions

```java
int exact = 16_777_217;
float rounded = exact;
System.out.println((int) rounded); // 16777216
System.out.println(7 / 2);         // 3
System.out.println(7 / 2.0);       // 3.5
byte small = 127;
small += 1;                       // implicit narrowing, now -128
```

## Switch expressions, text blocks and pattern matching

```java
static String tierLabel(int score) {
    return switch (score / 10) {
        case 10, 9 -> "top";
        case 8, 7 -> "strong";
        case 6 -> "borderline";
        default -> "needs review";
    };
}
```

```java
String query = """
    SELECT id, title
    FROM notes
    WHERE owner_id = ?
    """;
```

```java
Object payload = fetchPayload();
if (payload instanceof String text && !text.isBlank()) {
    System.out.println(text.strip());
}
```
