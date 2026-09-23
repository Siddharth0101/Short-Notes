# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A complete application pair

```java
package com.example.study;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudyApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyApplication.class, args);
    }
}
```

```java
package com.example.study;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
    record Greeting(String message) {}
    @GetMapping("/api/greeting")
    public Greeting greeting() { return new Greeting("Start with one lesson"); }
}
```
