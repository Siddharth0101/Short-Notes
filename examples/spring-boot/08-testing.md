# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Start without Spring

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PagePolicyTest {
    static int boundedSize(int requested) {
        if (requested < 1) throw new IllegalArgumentException("positive size required");
        return Math.min(requested, 100);
    }
    @Test void capsLargePages() { assertEquals(100, boundedSize(500)); }
    @Test void preservesSmallPages() { assertEquals(20, boundedSize(20)); }
    @Test void rejectsZero() {
        assertThrows(IllegalArgumentException.class, () -> boundedSize(0));
    }
}
```
