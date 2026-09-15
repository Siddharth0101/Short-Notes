---
id: spring-boot-first-application
title: Spring Boot first application and project structure
track: spring-boot
order: 1
level: Intermediate
minutes: 19
summary: Boot application context aur server tayyar karta hai; registered components actual requests handle karte hain.
tags: spring, boot, startup
---

## Mental model — simple soch

Spring dependencies aur application objects manage karta hai. Spring Boot common setup ko simplify karta hai through starters, auto-configuration and executable packaging. Boot business logic nahi likhta: tumhara controller ab bhi HTTP contract define karta hai. Pehle ek request successfully trace karo, phir database aur security add karo.

> **Core takeaway:** Boot application context aur server tayyar karta hai; registered components actual requests handle karte hain.

## Create the project deliberately

Spring Initializr https://start.spring.io par Maven, Java, Java 21 aur compatible supported stable Boot release choose karo; Spring Web add karo. Generated wrapper/build/dependencies together rakho. Examples servlet MVC aur Jakarta-era APIs use karte hain. Boot 3/4 starter/test layouts different hain; selected version ki generated dependencies retain karo, unrelated tutorial ki versions mix mat karo.

Application `com.example.study` mein, controller same ya child package mein rakho. Maven project mein Java `src/main/java`, properties `src/main/resources`, tests `src/test/java` mein hoti hain.

## A complete application pair

Generated project mein `src/main/java/com/example/study` ke andar inhe separate files mein save karo.

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

Project directory se `./mvnw spring-boot:run` chalao; Windows par mvnw.cmd. `http://localhost:8080/api/greeting` request par HTTP 200 aur message field wala JSON expect karo. Framework dependencies generated build deta hai; plain javac alone se yeh files compile nahi hongi.

## Trace startup and the request

main Boot start karta hai. Component scan application package ke neeche controller discover karti hai. Auto-configuration classpath/registered beans dekhkar MVC aur embedded server setup karti hai. Request servlet infrastructure tak aati hai, routing handler choose karti hai, converter returned record ko JSON banata hai.

404 aksar wrong route ya missing component scan ka sign hai. Port-in-use startup failure mein server successfully serve hi nahi hua. Random annotations se pehle first meaningful exception/cause padho. Compile hone se out-of-scan controller automatically register nahi hota.

## Practice

GET `/api/course` add karo jo name Java aur lessons 1 ka record return kare. JSON mein lessons number hona chahiye. Nonexistent route ka status valid route se compare karo.

## Depth walkthrough — andar kya ho raha hai?

### Startup failure aur request failure ki boundary

main se Spring application start hoti hai, configuration/component definitions process hoti hain, dependencies create hoti hain aur web server requests accept kar sakta hai. Required dependency missing ho toh startup fail ho sakta hai; route method tak request pahunchi hi nahi. Application started ho aur wrong URL se 404 aaye toh routing contract inspect karo.

Controller return value response conversion ke through JSON ban sakti hai. Java object create karna aur HTTP response serialize karna different steps hain. Serialization failure valid service computation ke baad bhi ho sakti hai; supported response DTO use karo.

Package location component discovery affect karti hai. Application class common root package mein rakhna conventional simple setup hai. Arbitrary folder placement ko “Spring automatically sab scan karega” assume mat karo.

**Practice:** Healthy app start karo, documented endpoint call karo, wrong path call karo, phir required dependency intentionally absent karke startup diagnostic compare karo. Request status, safe application log aur process health alag evidence hain. Browser page load alone all endpoints correct hone ka proof nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Boot aur controller kaun-kaunsi responsibilities own karte hain?

**Apply — khud try karo:** GreetingController ko scan configuration badle bina `com.other` mein move karo. Request result predict karo; phir matching package ke saath `com.example.study.web` mein restore karo.

> **Hint — chhota ishara:** Default scanning application class ke package se neeche shuru hoti hai.

**Answer guide — pehle khud karo, phir compare karo:** Default scan out-of-tree controller register nahi karegi; mapping absent hogi aur request normally 404 degi. Application package ke neeche restore karne se discovery possible hoti hai. Sirf URL badalne se missing bean register nahi hota.

**Exit check — aage badhne se pehle:** main se JSON response tak flow samjhao; startup failure aur routing failure alag pehchano.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://spring.io/guides/gs/spring-boot/).
