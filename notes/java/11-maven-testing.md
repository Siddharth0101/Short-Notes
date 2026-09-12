---
id: java-maven-testing
title: Maven builds and useful Java tests
track: java
order: 11
level: Intermediate
minutes: 18
summary: Repeatable builds aur behavior-focused tests ke saath reliable feedback lo.
tags: maven, junit, testing, build
---

## Mental model

Build tool source ko repeatable artifact mein convert karta hai. Test suite change ke impact par feedback deti hai. Dono tab useful hain jab developer machine aur CI same declared inputs use karein. Undocumented global dependencies ya only-IDE configuration reproducibility break karte hain.

## Maven lifecycle and dependencies

`pom.xml` coordinates, dependencies, plugins and build settings describe karta hai. Lifecycle phases ordered hain: validate, compile, test, package, verify, install and deploy. Later phase invoke karoge toh preceding phases execute hoti hain. `install` local repository mein artifact publish karta hai; `deploy` configured remote repository ko publish kar sakta hai, production application deployment ka synonym nahi. [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

```sh
./mvnw test
./mvnw verify
./mvnw dependency:tree
```

Wrapper commit karke selected Maven distribution make reproducible karo. Compiler release project baseline se align karo. Version management consistent rakho; random dependency version bump managed Spring dependency family ko incompatible bana sakta hai. Dependency scope classpath availability affect karta hai, and dependencyManagement version control karta hai without necessarily adding dependency itself.

## Dependency scopes

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <scope>provided</scope>
</dependency>
```

`test` scope sirf test compilation/execution classpath mein available hota hai — production JAR mein include nahi hota. `provided` scope compile-time available hai but runtime container (jaise application server) already provide karega, isliye packaged artifact mein bundle nahi hota. Galat scope choose karna do tarah ki problems deta hai: `test` dependency ko `compile` scope mein daal dena production JAR size aur attack surface unnecessarily badha deta hai; `provided` dependency ko `test` scope mein daalna runtime `NoClassDefFoundError` de sakta hai jab actual deployment environment mein wo class missing ho.

## Test behavior at the right level

Unit test pure business rule isolate karta hai. Integration test real boundaries verify karta hai, especially SQL constraints and ORM mappings. HTTP slice test routing, validation and serialization check karta hai. End-to-end test critical user journey exercise karta hai, lekin expensive and broader failure surface hota hai.

```java
@Test
void fixedDiscountNeverMakesTotalNegative() {
    Discount discount = new FixedDiscount(500);
    assertEquals(0, discount.apply(200));
}
```

Yeh focused assertion domain rule protect karti hai. Sirf getter ko setter ke value ke against test karna little confidence deta hai. Test name trigger and expected outcome explain kare. Given-when-then arrangement readability ke liye useful hai, ceremony ke liye nahi.

## Test design decisions

External time ko Clock inject karo. Randomness ke seed control karo. Concurrent tests mein synchronization primitives use karo. Production relational database behavior verify karne ke liye matching database integration environment use karo; in-memory substitute vendor-specific SQL and isolation differences miss kar sakta hai.

Mocks external side effects aur hard-to-control dependencies isolate karte hain. Every collaborator interaction assert karna implementation couple karta hai. Prefer observable output/state assertions, and only meaningful interaction checks like payment charged once. Failure cases cover karo: invalid input, duplicate request, unavailable dependency, permission denied and rollback.

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock PaymentGateway gateway;
    @InjectMocks OrderService service;

    @Test
    void chargesGatewayExactlyOnceOnSuccess() {
        when(gateway.charge(any())).thenReturn(PaymentResult.success("tx-1"));
        service.checkout(new Order("order-1", 500));
        verify(gateway, times(1)).charge(any()); // meaningful: side effect must happen once
    }
}
```

Isme `verify(gateway, times(1))` justified hai kyunki double-charging ek real business risk hai — yeh implementation detail nahi, observable side-effect contract hai. Har internal method call ko isi tarah verify karna (jaise `verify(service).calculateTax()`) fragile test bana deta hai jo refactor karte hi tootega bina actual behavior badle.

## Common traps

Test order dependence hidden shared state suggest karti hai. Transactional test automatic rollback can hide behavior occurring only after commit, such as async event processing. Coverage percentage executed lines batata hai; assertion quality or business correctness guarantee nahi. Skipped tests ko passing verification report mat bolo.

- **Wrong assumption:** Mock object ko strict interaction verification (`verify`) dena hamesha better testing practice hai. **Why it breaks:** Over-verification (har internal call check karna) test ko implementation detail se couple kar deta hai — method ka naam ya call order refactor karte hi test todh deta hai, chahe observable behavior same rahe. **Fix:** Sirf genuinely important side effects verify karo (payment charged, email sent); baaki behavior output/state assertions se check karo.
- **Wrong assumption:** `@Transactional` test method automatically production behavior replicate karta hai. **Why it breaks:** Test framework transaction ko test ke end mein rollback kar deta hai by default — agar production code commit ke baad trigger hone wale kisi async listener/event par depend karta hai, wo behavior test mein kabhi execute hi nahi hoga, aur bug sirf production mein dikhega. **Fix:** Commit-dependent behavior ke liye `@Commit` annotation ya separate non-transactional integration test use karo.
- **Wrong assumption:** `test` scope mein rakhi dependency (jaise Mockito) accidentally production code se reference ho jaaye toh compiler catch kar lega. **Why it breaks:** Agar `test` scope ki jagah galti se `compile`/default scope use ho jaaye, us dependency ka code production JAR mein bundle ho jaata hai — compiler koi warning nahi deta kyunki syntactically valid hai, sirf JAR size aur dependency-audit tools se pakड़ में aata hai. **Fix:** `dependency:tree` aur `dependency:analyze` regularly run karo taaki scope misconfigurations jaldi pakde jaayein.

## In a real backend service

CI pipeline mein `./mvnw verify` typically unit tests, integration tests aur static analysis sabko chalata hai before merge — matching production database ke against integration tests (Testcontainers jaisा tool) in-memory H2 substitute se zyada reliable signal dete hain kyunki vendor-specific SQL functions, constraint behavior aur isolation semantics H2 mein different ho sakte hain. Flaky tests (jo kabhi pass kabhi fail hoti hain bina code change ke) usually hidden shared state, unseeded randomness ya real system clock dependency se aati hain — inhe "just rerun karo" bolna root cause ko permanently hide kar deta hai.

## Interview questions

**Unit versus integration test?** Unit narrow behavior isolate karta hai; integration interacting components and infrastructure contract validate karta hai. Classification speed se alone nahi hoti.

**Why use dependency injection in tests?** Explicit dependencies replaceable collaborators and predictable setup dete hain. Production design ki constructor requirements tests mein bhi visible rehti hain.

**Why can a transactional test hide a real bug?** Test framework default rollback ke saath test ko isolate karta hai, lekin agar production behavior transaction commit hone ke baad trigger hota hai (jaise event listener, async job), wo path rollback-based test mein kabhi exercise nahi hota — bug tabhi surface hota hai jab actual production commit ho.

## Practice

Pricing rule ke boundary tests likho. One duplicate insert integration test add karo. Build ko clean checkout mein run karke missing assumptions identify karo. Report exact command and meaningful coverage, sirf "tested" nahi. Phir ek mock-heavy test likho jo internal method calls over-verify karta ho, refactor karke usse output-based assertion mein convert karo, aur dikhao ki test ab implementation-detail-independent hai.

## Sources

- [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [JUnit user guide](https://docs.junit.org/current/user-guide/)
