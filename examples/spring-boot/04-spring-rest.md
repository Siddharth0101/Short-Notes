# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Request flow

```text
HTTP request
  -> servlet filters and Spring Security
  -> DispatcherServlet
  -> controller + validation
  -> application service
  -> repository
  -> response serialization
```

## Compact controller example

```java
record CreateNote(@NotBlank @Size(max = 120) String title) {}
record NoteView(long id, String title) {}

@RestController
@RequestMapping("/api/notes")
class NoteController {
    private final NoteService service;
    NoteController(NoteService service) { this.service = service; }

    @PostMapping
    ResponseEntity<NoteView> create(@Valid @RequestBody CreateNote input) {
        NoteView created = service.create(input.title());
        return ResponseEntity
            .created(URI.create("/api/notes/" + created.id()))
            .body(created);
    }
}
```

## Bean scopes and circular dependencies

```java
@RestController
class BadCounter {
    private int requestCount; // shared mutable state across all requests — dangerous

    @GetMapping("/count")
    int increment() { return ++requestCount; }
}
```

```java
@Service
class OrderService {
    private final NotificationService notifications;
    OrderService(NotificationService notifications) { this.notifications = notifications; }
}

@Service
class NotificationService {
    private final OrderService orders; // circular — Spring cannot construct either first
    NotificationService(OrderService orders) { this.orders = orders; }
}
```

## HTTP contract decisions

```java
@RestControllerAdvice
class ApiExceptionHandler {
    @ExceptionHandler(NoteNotFoundException.class)
    ResponseEntity<ErrorBody> notFound(NoteNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorBody("NOTE_NOT_FOUND", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorBody> invalid(MethodArgumentNotValidException e) {
        String detail = e.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ErrorBody("VALIDATION_FAILED", detail));
    }
}
```
