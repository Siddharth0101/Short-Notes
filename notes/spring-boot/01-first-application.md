---
id: spring-boot-first-application
title: Spring Boot first application and project structure
track: spring-boot
order: 1
level: Intermediate
minutes: 16
summary: Understand Spring versus Boot and trace a small HTTP application.
tags: spring, boot, startup
---

## Mental model

Spring dependencies aur application objects manage karta hai. Spring Boot common setup ko simplify karta hai through starters, auto-configuration and executable packaging. Boot business logic nahi likhta: tumhara controller ab bhi HTTP contract define karta hai. Pehle ek request successfully trace karo, phir database aur security add karo.

> **Core takeaway:** Boot prepares an application context and server; your registered components handle the request.

## Create the project deliberately

Use Spring Initializr at https://start.spring.io with Maven, Java, Java 21, and a compatible supported stable Boot release. Add Spring Web. Keep the generated wrapper, build file and dependency versions together. These examples use the servlet MVC model and Jakarta-era Boot APIs; Boot 3 and Boot 4 have different starter/test module layouts, so retain the dependencies generated for your selected version instead of copying a version from an unrelated tutorial.

Put the application in `com.example.study` and controller in the same package or a child package. In a generated Maven project, Java files live under `src/main/java` and properties under `src/main/resources`. Tests belong under `src/test/java`.

## A complete application pair

Save these as separate files under `src/main/java/com/example/study` in that generated project.

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

Run `./mvnw spring-boot:run` from the project directory. On Windows use `mvnw.cmd`. Request `http://localhost:8080/api/greeting`; expect HTTP 200 and JSON with a message field. The generated build supplies framework dependencies; these files cannot compile with plain javac alone.

## Trace startup and the request

The main method starts Boot. Component scanning discovers the controller below the application package. Auto-configuration considers the classpath and registered beans to configure MVC and the embedded server. A request reaches the servlet infrastructure, routing selects the handler, and message conversion serializes the returned record.

A 404 often means the route or component scan is wrong. A port-in-use startup failure means the process never began serving successfully. Read the first meaningful exception and its cause before randomly adding annotations. A controller outside the scan package is not automatically discovered just because it compiles.

## Practice

Add GET `/api/course` returning a record with name Java and lessons 1. Verify the JSON types: lessons should be numeric. Request a nonexistent route and compare its status to the valid route.

## Revision and practice lab

**Recall:** Which responsibilities belong to Boot and which belong to the controller?

**Apply:** Move GreetingController into `com.other` without changing scan configuration. Predict the request result, then restore it under `com.example.study.web` with the matching package declaration.

> **Hint:** Default scanning begins at the application class package.

**Answer guide — compare after attempting:** The out-of-tree controller is not registered by the default scan, so its route is absent and the request normally returns 404. Restoring it beneath the application package makes discovery possible again. Changing only the URL cannot register a missing bean.

**Exit check:** Explain the full path from main to the JSON response and distinguish startup failure from routing failure.

## Sources

[Official reference](https://spring.io/guides/gs/spring-boot/).
