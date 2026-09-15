# Spring Boot — step-by-step course

[Saare courses](../README.md)

Shuru karne se pehle: [Maven builds and useful Java tests](../java/12-maven-testing.md) · [JDBC SQL and transaction boundaries](../java/13-jdbc-sql.md) · [Java concurrency under real resource limits](../java/16-concurrency-production.md).

Har chapter mein main concept, practice challenge, hint, reasoned answer aur self-check hai. Session plan aur revision ke liye [study guide](../STUDY_GUIDE.md) padho.

## Stage 1: Application start aur configure karo

Boot startup, bean wiring aur typed config samjho.

1. [Spring Boot first application and project structure](01-first-application.md)
2. [Beans constructor injection and lifecycle](02-beans-di.md)
3. [Configuration properties profiles and startup failures](03-configuration.md)

**Stage checkpoint — khud karke dikhao:** App start karke missing bean/invalid setting diagnose karo.

## Stage 2: Clear HTTP boundary banao

DTOs, validation aur controlled errors ke saath REST endpoints banao.

4. [Spring dependency injection and REST APIs](04-spring-rest.md)
5. [Request DTOs validation and consistent API errors](05-validation-errors.md)

**Stage checkpoint — khud karke dikhao:** Successful creation aur rejected input ke documented responses dikhao.

## Stage 3: Business operations save aur secure karo

Transactions, persistence aur authorization boundaries apply karo.

6. [JPA Hibernate and Spring transactions](06-jpa-transactions.md)
7. [Spring Security and reliable service boundaries](07-security-microservices.md)

**Stage checkpoint — khud karke dikhao:** Concurrent requests mein invariant bache aur unauthorized access reject ho, prove karo.

## Stage 4: Service verify aur operate karo

Boundaries test, telemetry inspect aur deployment capstone complete karo.

8. [Spring Boot unit slice and integration testing](08-testing.md)
9. [Observability with Actuator, metrics and tracing](09-observability-actuator.md)
10. [Package deploy and defend a Spring Boot capstone](10-deployment-capstone.md)

**Stage checkpoint — khud karke dikhao:** API acceptance cases run karke failed-deployment recovery defend karo.

## Stage 5: Background work aur cache operate karo

Proxy boundaries, scheduled jobs aur cache identity ko failure scenarios se connect karo.

11. [Spring background jobs aur caching — lifecycle aur ownership samjho](11-spring-background-cache.md)

**Stage checkpoint — khud karke dikhao:** Duplicate job aur stale cache recovery ka measurable contract do.

## Stage 6: Web runtime ko neeche tak trace karo

Servlet concurrency, forwarding aur view rendering ko Spring MVC se connect karo.

12. [Servlets, JSP aur Spring MVC — request ka underlying runtime](12-servlet-mvc.md)

**Stage checkpoint — khud karke dikhao:** Shared request-field race aur redirect attribute loss diagnose karo.

## Stage 7: Optional AI retrieval extension

Authorized retrieval, evidence quality aur model integration ki limits samjho.

13. [Spring AI aur RAG — retrieval, permissions aur answer evaluation](13-ai-retrieval.md)

**Stage checkpoint — khud karke dikhao:** Known, unsupported aur unauthorized questions ka evaluation contract do.
