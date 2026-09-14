---
id: spring-testing
title: Spring Boot unit slice and integration testing
track: spring-boot
order: 8
level: Intermediate
minutes: 16
summary: Har important boundary ka test utne chhote setup mein karo jo uski real failure pakad sake.
tags: spring, testing, integration
---

## Mental model — simple soch

Test ka scope us failure ke according choose karo jo detect karna hai. Pure Java unit test business decisions check karta hai. MVC slice request binding aur HTTP responses check karti hai. Integration test wiring aur real infrastructure behavior check karta hai. Har test mein full application load karna coverage ka proof nahi hai.

> **Core takeaway:** Har important boundary ka test utne chhote setup mein karo jo uski real failure pakad sake.

## Start without Spring

JUnit Jupiter example ko Maven/JUnit-supported project, jaise generated Boot setup, ke src/test/java mein rakho. Small complete example ko app context/DB nahi chahiye.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PagePolicyTest {
    static int boundedSize(int requested) {
        if (requested < 1) throw new IllegalArgumentException("positive size required");
        return Math.min(requested, 100);
    }
    @Test void capsLargePages() { assertEquals(100, boundedSize(500)); }
    @Test void preservesSmallPages() { assertEquals(20, boundedSize(20)); }
    @Test void rejectsZero() {
        assertThrows(IllegalArgumentException.class, () -> boundedSize(0));
    }
}
```

`./mvnw test` run karo. Assertions three decisions prove karti hain, controller policy call karta hai yeh nahi. Real app mein policy production code mein rakho aur actual implementation test karo; test mein duplicate mat likho.

## Verify the web boundary

WebMvcTest plus MockMvc se controller-focused test aur controlled service collaborators do. Malformed input, validation, JSON/error advice check karo. Security ho toh test identity/rejection configure karo. Unexpected 401 controller se pehle aa sakta hai; status-only assertion wrong layer test kar sakti hai.

Boot 4 ne focused testing modules/packages reorganize kiye hain. Selected version ke imports/dependencies lo; Boot 3 WebMvcTest paths Boot 4 mein mix mat karo. Official test reference ka layout follow karo; conceptually slice relevant web infrastructure hi load kare.

## Test persistence and full requests

Repository slice mapping/query behavior verify karti hai. PostgreSQL-specific SQL/locks/constraints ke liye PostgreSQL test instance, jaise Testcontainers, use karo. In-memory substitute identical behave karega assume mat karo.

Random-port SpringBootTest real HTTP, serialization aur wiring check kar sakta hai. Server request separate thread par hoti hai; test-method transaction usse automatically rollback nahi karti. Explicit cleanup, isolated DB ya unique fixtures lo; execution-order-dependent assertions avoid karo.

## Practice

Lesson-create test plan do: domain rule, invalid-request slice, unique-constraint DB aur HTTP success test. Har test ka caught bug batao. Every internal call verify karne ke bajay observable outcomes dekho.

## Revision and practice lab — khud karke samjho

**Recall:** Can a mocked repository prove a SQL unique constraint exists?

**Apply:** Random-port HTTP test par Transactional lagane ke baad bhi rows bachti hain. Mechanism samjhao aur repeated runs independent banao.

> **Hint:** Test thread aur server request thread compare karo.

**Answer guide — compare after attempting:** HTTP handler alag thread par apni transaction commit karta hai. Isolated DB ya explicit cleanup plus unique fixture IDs use karo. Doosra run karke isolation verify karo. Leftover state ke saath passing assertion reliable suite nahi banati.

**Exit check:** Choose the minimum valid test scope for malformed JSON, a business calculation and a row-lock race.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html).
