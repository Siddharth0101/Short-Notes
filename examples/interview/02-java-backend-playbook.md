# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Coding drill

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

class Metrics {
    private final ConcurrentHashMap<String, LongAdder> counts =
        new ConcurrentHashMap<>();

    void record(String name) {
        counts.computeIfAbsent(name, ignored -> new LongAdder()).increment();
    }

    long count(String name) {
        LongAdder value = counts.get(name);
        return value == null ? 0 : value.sum();
    }
}
```
