# Java, Spring Boot, & Microservices Short Notes

Telusko Java, Spring Boot, Microservices bootcamp style notes.

These files follow the same style as the Node/Frontend notes in this repo:
short Hinglish explanations, important rules, and compact Java/Spring examples.

## Padhne ka suggested order

1. `01_COURSE_INTRODUCTION/Course_Overview.java`
2. `02_CORE_JAVA/Core_Java_Basics.java` — Variables, Data Types, Literals, Type Conversion, Casting, Operators, OOPs Basics, Keywords
3. `02_CORE_JAVA/Core_Java_ControlFlow.java` — Conditionals (if/switch/ternary), Loops (for/while/do-while/for-each), break/continue
4. `02_CORE_JAVA/Core_Java_Arrays_Strings.java` — 1D/2D/Jagged Arrays, Strings, String Pool, StringBuilder vs StringBuffer
5. `02_CORE_JAVA/Core_Java_Methods_Constructors.java` — Methods, Overloading, Varargs, Constructors, Wrapper Classes, Enums, OOPs (Classes & Objects, this, static, Encapsulation, Inheritance, Polymorphism, Dynamic Method Dispatch, final, toString/equals/hashCode, Composition)
6. `02_CORE_JAVA/Core_Java_OOPs_Advanced.java` — Access Modifiers, Abstract Classes, Interfaces, Upcasting/Downcasting, Lambda Preview, Packages, Inner Classes, Record Classes, Sealed Classes
7. `02_CORE_JAVA/Core_Java_Generics_IO.java` — Generics, Bounded Types, Wildcards, Date/Time API, Java I/O (File handling)
8. `03_ADVANCE_JAVA/Advance_Java_Concepts.java` — Exceptions, Threads, Collections, Lambdas, Streams, Optional
9. `03_ADVANCE_JAVA/Advance_Java_Servlets_JSP.java` — HTTP Basics, Servlets, JSP, JSTL, EL, MVC Pattern
10. `03_ADVANCE_JAVA/Advance_Java_JDBC.java` — JDBC, Connection, PreparedStatement, ResultSet, CRUD, SQL Injection Prevention, Transactions
11. `04_MAVEN/Maven_Build_Tool.java`
12. `05_SPRING_GETTING_STARTED/Spring_Core.java` — IoC, Dependency Injection, Beans, Scopes
13. `06_SPRING_BOOT/Spring_Boot_REST.java` — Auto-Config, application.properties, Profiles, REST, Exception Handling, Validation
14. `06_SPRING_BOOT/Spring_MVC_JPA.java` — DispatcherServlet, Thymeleaf, Spring Data JPA, Derived Queries, Entity Relationships
15. `06_SPRING_BOOT/Spring_AOP.java` — Aspect-Oriented Programming, Join Points, Advice, Pointcuts
16. `07_SPRING_SECURITY/Spring_Security_JWT.java` — Auth, JWT, CSRF, CORS, Method Security, OAuth2
17. `08_SPRING_AI/Spring_AI_Intro.java`
18. `09_DOCKER_MICROSERVICES/Docker_Microservices.java`

## Yahan kya cover hai

### Core Java
- JDK, JRE, JVM architecture
- Variables, Primitive Data Types (8 types), Literals (binary, hex, octal)
- Type Conversion: Widening (implicit), Narrowing (explicit casting), Type Promotion
- Operators: Arithmetic, Relational, Logical, Assignment, Unary, Bitwise, Ternary
- Conditional Statements: if, if-else, else-if ladder, switch-case, enhanced switch (Java 14+)
- Loops: for, while, do-while, enhanced for-each, break, continue, labeled break
- Arrays: 1D, 2D/Multidimensional, Jagged Arrays, Arrays utility class
- Strings: Immutability, String Pool, String methods, StringBuilder vs StringBuffer
- Methods: Defining, calling, overloading, varargs, return types
- Constructors: Default, parameterized, overloading, chaining (this/super)
- OOPs: Classes & Objects, this keyword, static keyword (variables/methods/blocks)
- OOPs: Encapsulation (getters/setters/validation), Inheritance (types, IS-A/HAS-A)
- OOPs: Polymorphism (compile-time/runtime), Dynamic Method Dispatch
- OOPs: Abstraction (abstract classes, interfaces)
- final keyword (variable/method/class), Object class (toString/equals/hashCode)
- Access Modifiers: public, private, protected, default
- Abstract Classes vs Interfaces (Java 8+ default/static methods)
- Packages (creating, importing, built-in packages)
- Inner Classes (Member, Static, Local, Anonymous)
- Wrapper Classes, Autoboxing/Unboxing
- Enums (simple & with fields/methods)
- Upcasting, Downcasting, instanceof operator
- Record Classes (Java 16+), Sealed Classes (Java 17+)
- Generics: Generic classes, methods, bounded types, wildcards (PECS)
- Date/Time API (Java 8+): LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Period, Duration, DateTimeFormatter
- Java I/O: FileReader/Writer, BufferedReader/Writer, File class, Scanner, try-with-resources
- Memory Management: Stack vs Heap, Garbage Collection

### Advanced Java & Legacy Web
- Exception Handling: Checked/Unchecked, try-with-resources, custom exceptions, chaining
- Multithreading: Runnable vs Thread, synchronization, states, sleep/join/yield
- Collections Framework: List, Set, Map, Queue, Iterator
- Sorting: Comparable vs Comparator
- Java 8+: Lambda Expressions, Functional Interfaces, Streams API, Optional, Method References
- JDBC: Connection, Statement, PreparedStatement, ResultSet, CRUD, SQL Injection Prevention, Transactions
- Servlets & JSP: Lifecycle, request/response, session/cookies, RequestDispatcher
- JSP: Scriptlets, JSTL, Expression Language (EL), MVC architecture

### Spring Framework & Spring Boot
- Spring Core: IoC, DI (Constructor/Setter/Field), Bean scopes
- Spring Boot Basics: Auto-configuration, Starter POMs, application.properties/yml, Profiles
- Spring REST: @RestController, ResponseEntity, Content Negotiation, Swagger/OpenAPI
- Error Handling: @ExceptionHandler, @ControllerAdvice
- Validation: Bean Validation (@Valid, @NotNull, @Size)
- Database: Spring Data JPA, JpaRepository, Derived Queries, @Query, Pagination, Entity Relationships (@OneToMany, etc.), Cascade & Fetch Types
- View Layer: Spring MVC Architecture, Thymeleaf templates, @ModelAttribute
- Spring AOP: Aspects, Advice (@Before, @After, @Around), Pointcuts, Join Points
- Extras: Actuator, DevTools, @Transactional

### Security & Microservices
- Spring Security: Authentication vs Authorization, PasswordEncoder
- JWT: Stateless auth, structure, flow, request filters
- Web Security: CSRF based on credential transport (retain for cookie authentication), CORS configuration
- Method Security: @PreAuthorize, @Secured
- OAuth2: Social Login (SSO) with Google/GitHub
- Spring AI: RAG, Prompts, LLM integration, ChatClient
- Microservices: Architecture, Eureka, API Gateway, Resilience4j (Circuit Breaker)
- Inter-Service Communication: FeignClient vs RestTemplate
- Distributed Tracing: Zipkin, Micrometer, Trace/Span IDs
- DevOps: Maven, Docker (Images, Containers, Dockerfile)
- Docker Advanced: Networking (bridge/host/overlay), Volumes (data persistence), docker-compose

