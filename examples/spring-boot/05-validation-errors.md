# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Validate a request DTO

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLessonRequest(
    @NotBlank @Size(max = 120) String title
) {}
```

```java
@PostMapping("/api/lessons")
ResponseEntity<LessonResponse> create(
        @Valid @RequestBody CreateLessonRequest request) {
    LessonResponse result = lessons.create(request.title());
    return ResponseEntity.created(URI.create("/api/lessons/" + result.id()))
            .body(result);
}
```
