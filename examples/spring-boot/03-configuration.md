# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Bind a small settings group

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import java.time.Duration;

@ConfigurationProperties(prefix = "study")
public record StudyProperties(int pageSize, Duration requestTimeout) {
    public StudyProperties {
        if (pageSize < 1 || pageSize > 100) {
            throw new IllegalArgumentException("pageSize must be 1..100");
        }
        if (requestTimeout == null || requestTimeout.isNegative()
                || requestTimeout.isZero()) {
            throw new IllegalArgumentException("requestTimeout must be positive");
        }
    }
}
```

```text
# src/main/resources/application.properties
study.page-size=20
study.request-timeout=2s
```
