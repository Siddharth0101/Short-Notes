---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 16
summary: Understand bean creation scopes qualifiers and dependency ownership.
tags: spring, beans, dependency-injection
---

## Mental model

ApplicationContext ek managed object graph banata hai. Bean simply woh object hai jiska creation aur lifecycle container manage karta hai. Dependencies constructor mein declare karne se object ki requirements visible rehti hain. Injected reference magic nahi hai: method invocation still ordinary Java hai unless an explicit proxy adds behavior.

> **Core takeaway:** Constructor injection makes dependencies explicit; singleton scope does not make mutable state thread-safe.

## Wire a feature

Application excerpts for the generated Spring Web project. Put each class in its own file beneath the application package; imports are shown for Spring annotations.

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

For a single constructor, Spring can use it without an Autowired annotation. The formatter is created and supplied before the service can be used. In a plain unit test, `new LessonService(new LessonFormatter())` exercises the same logic without starting Boot. Null input is outside this small formatter's contract; validation is introduced in the HTTP lessons.

## Registration and ambiguity

Component stereotypes register scanned application classes. A Configuration class with a Bean method is useful when creating a library object you cannot annotate. Both approaches register objects in the same container; avoid registering the same implementation twice accidentally.

If two beans implement the same interface, the injection point needs a deliberate selection. Qualifier identifies the intended candidate and Primary establishes a default among candidates. Qualifier values and bean names must match your actual registrations. Do not fix ambiguity by deleting a necessary implementation or arbitrarily choosing one without understanding its use.

## Scope and lifecycle

The default singleton is per bean definition per container, not one universal object for the entire JVM. Multiple HTTP requests can use the same service concurrently. Keep request-specific values in method parameters and local variables. A `currentUser` field in a singleton service can leak one request's state into another.

Use lifecycle callbacks for owned resources when necessary. A prototype bean requested once by a singleton does not become a fresh object on every method call. If you need repeated lookup or a request-scoped dependency, choose that mechanism explicitly and understand the proxy or provider involved.

Circular constructor dependencies cannot be created normally because each object requires the other first. Extract shared responsibility or reconsider the dependency direction rather than hiding the cycle with field injection.

## Practice

Add a second formatter implementation behind an interface. Explain the ambiguity before selecting one explicitly. Construct the service manually to prove the formatting logic has no requirement for a running HTTP server.

## Revision and practice lab

**Recall:** Does singleton scope serialize calls to a bean?

**Apply:** A singleton service stores the last request's title in a field before formatting it. Request A stores Java, B stores Spring, then A formats the field. Trace the observed value and fix the design.

> **Hint:** One shared instance means one shared field.

**Answer guide — compare after attempting:** A can format Spring because B overwrote the field. Pass the title directly to the formatter and retain no per-request mutable field. Constructor injection and final dependency references do not protect unrelated mutable fields from races.

**Exit check:** Explain why the corrected service can handle independent requests without a lock around the entire method.

## Sources

[Official reference](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html).
