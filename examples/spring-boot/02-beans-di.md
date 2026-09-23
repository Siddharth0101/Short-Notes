# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Wire a feature

```java
import org.springframework.stereotype.Service;

@Service
class LessonFormatter {
    String format(String title) { return "Lesson: " + title.strip(); }
}
```

```java
import org.springframework.stereotype.Service;

@Service
class LessonService {
    private final LessonFormatter formatter;
    LessonService(LessonFormatter formatter) { this.formatter = formatter; }
    String preview(String title) { return formatter.format(title); }
}
```
