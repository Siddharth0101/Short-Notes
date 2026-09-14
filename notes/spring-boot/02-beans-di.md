---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 16
summary: Constructor injection dependencies clear banata hai; singleton scope mutable state ko thread-safe nahi banata.
tags: spring, beans, dependency-injection
---

## Mental model — simple soch

ApplicationContext ek managed object graph banata hai. Bean simply woh object hai jiska creation aur lifecycle container manage karta hai. Dependencies constructor mein declare karne se object ki requirements visible rehti hain. Injected reference magic nahi hai: method invocation still ordinary Java hai unless an explicit proxy adds behavior.

> **Core takeaway:** Constructor injection dependencies clear banata hai; singleton scope mutable state ko thread-safe nahi banata.

## Wire a feature

Yeh generated Spring Web app ke excerpts hain. Har class application package ke neeche separate file mein rakho; Spring annotation imports shown hain.

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

Single constructor ko Spring Autowired ke bina use kar sakta hai. Service use hone se pehle formatter create/inject hota hai. Plain test mein `new LessonService(new LessonFormatter())` same logic Boot ke bina chalata hai. Null input is small formatter ke contract ke bahar hai; HTTP lessons mein validation aayegi.

## Registration and ambiguity

Component stereotypes scanned classes register karte hain. Library class annotate nahi kar sakte toh Configuration class ka Bean method useful hai. Dono same container mein objects register karte hain; implementation accidentally twice register mat karo.

Same interface ki two beans hon toh intentional selection chahiye. Qualifier candidate identify, Primary default establish karta hai. Names/qualifiers actual registration se match hon. Ambiguity fix karne ke liye required implementation delete ya randomly select mat karo.

## Scope and lifecycle

Default singleton per-bean-definition per-container hai, entire JVM ka universal object nahi. Multiple HTTP requests same service concurrently use karti hain. Request data parameters/locals mein rakho. Singleton currentUser field ek request ka data doosri mein leak kar sakti hai.

Owned resources ke liye required lifecycle callbacks use karo. Singleton ko once mila prototype har method call par new object nahi ban jaata. Repeated lookup/request scope chahiye toh provider/proxy mechanism deliberately choose aur samjho.

Circular constructor dependencies normally create nahi ho sakti: har object pehle doosra maangta hai. Shared responsibility extract ya dependency direction rethink karo; field injection se cycle hide mat karo.

## Practice

Interface ke peeche second formatter add karo. Explicit selection se pehle ambiguity explain karo. Service manually construct karke prove karo formatting ko running HTTP server nahi chahiye.

## Revision and practice lab — khud karke samjho

**Recall:** Does singleton scope serialize calls to a bean?

**Apply:** Singleton service last request title field mein rakhti hai. A Java store karta hai, B Spring store karta hai, phir A field format karta hai. Result trace karke fix karo.

> **Hint:** Ek shared instance ka matlab ek shared field hai.

**Answer guide — compare after attempting:** A ko Spring mil sakta hai kyunki B ne field overwrite ki. Title formatter ko directly pass karo; per-request mutable field mat rakho. Constructor injection aur final dependency references unrelated mutable fields ki race nahi rokte.

**Exit check:** Explain why the corrected service can handle independent requests without a lock around the entire method.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html).
