/**
 * ========================================================================
 * 09. DOCKER & MICROSERVICES (DETAILED)
 * ========================================================================
 * NOTES:
 * 
 * ========================================================================
 * 1. MONOLITH VS MICROSERVICES
 * ========================================================================
 * - Monolithic: Poori application (UI, Business, DB connection, Payment, Cart) ek hi codebase aur ek hi server pe deploy hoti hai. (Easy initially, par badi apps me hard to scale/maintain).
 * - Microservices: Application ko chote chote independent services me divide karna.
 *   - Cart Service, Payment Service, Notification Service.
 *   - Har service alag language (Java, Node) me ho sakti hai.
 *   - Har service ka apna database (DB per service pattern) hona best practice hai.
 *   - Scalability aasan hoti hai (Agar Black Friday pe Payment pe load zyada hai, toh sirf Payment Service ke naye instances bana lo).
 * 
 * ========================================================================
 * 2. SPRING CLOUD ECOSYSTEM
 * ========================================================================
 * - Service Registry (Netflix Eureka): Saari services yahan register hoti hain. Service A ko Service B ka IP pata nahi hota, wo Eureka se puchti hai.
 * - API Gateway (Spring Cloud Gateway): Single entry point for frontend. Ye request ko correct microservice pe route karta hai. Rate limiting, authentication bhi yahan handle hota hai.
 * - Resilience4j (Circuit Breaker): Agar koi microservice down ho jaye, toh poori app hang na ho, balki fallback (default response) jaldi return ho jaye.
 *   - States: CLOSED (normal) -> OPEN (failure threshold crossed, instant fallback) -> HALF_OPEN (kuch requests test ke liye bhejta hai).
 * - Config Server: Centralized configuration management (saari services ki properties ek jagah).
 * - Load Balancer: Multiple instances me requests distribute karna (Spring Cloud LoadBalancer).
 * 
 * ========================================================================
 * 3. FEIGN CLIENT (Inter-Service Communication) ⭐
 * ========================================================================
 * - Problem: Ek microservice ko doosri microservice ki API call karni hai. RestTemplate se manually URL build karna padta hai.
 * - FeignClient = Declarative HTTP Client. Sirf ek interface define karo aur Spring khud REST call handle karega!
 * - Dependency: spring-cloud-starter-openfeign
 * - @EnableFeignClients main class pe lagao.
 * 
 * HOW IT WORKS:
 * - Interface likho with annotations (bilkul controller jaisa dikhta hai):
 *   @FeignClient(name = "PAYMENT-SERVICE") // Eureka registered service name
 *   public interface PaymentClient {
 *       @GetMapping("/api/payments/{orderId}")
 *       PaymentResponse getPayment(@PathVariable Long orderId);
 *   }
 * - Inject karo apni service me: @Autowired PaymentClient paymentClient;
 * - Call karo: PaymentResponse response = paymentClient.getPayment(orderId);
 * - Feign internally Eureka se PAYMENT-SERVICE ka IP dhundta hai aur HTTP call karta hai!
 * 
 * FEIGN vs RESTTEMPLATE:
 * ┌──────────────────┬──────────────────────┬────────────────────────┐
 * │    Feature       │    RestTemplate      │     FeignClient        │
 * ├──────────────────┼──────────────────────┼────────────────────────┤
 * │ Style            │ Imperative (manual)  │ Declarative (interface)│
 * │ Code             │ Verbose (URL build)  │ Clean (annotations)    │
 * │ Load Balancing   │ Manual setup         │ Built-in with Eureka   │
 * │ Error Handling   │ Manual               │ FallbackFactory        │
 * │ Recommendation   │ Legacy / simple      │ ✅ Preferred for MS    │
 * └──────────────────┴──────────────────────┴────────────────────────┘
 * 
 * ========================================================================
 * 4. DISTRIBUTED TRACING (Zipkin / Micrometer) ⭐
 * ========================================================================
 * - Problem: User ne ek order place kiya. Request Order Service -> Payment Service -> Notification Service gayi. Agar failure aaye toh KAHAN aaya? Kaunsi service slow hai?
 * - Solution: Har request ko ek unique TRACE ID milta hai jo SAARI services me carry hota hai. Ek dashboard pe pura flow dikh jata hai.
 * 
 * CONCEPTS:
 * - Trace: Ek complete request journey (across all microservices).
 * - Span: Ek individual service ka kaam (e.g., "Payment processing took 200ms").
 * - Trace ID: Unique ID jo puri journey track karta hai (same across all services).
 * - Span ID: Individual service ka unique ID.
 * 
 * TOOLS:
 * - Spring Cloud Sleuth (Older, Spring Boot 2.x): Automatically Trace/Span IDs logs me add karta tha.
 * - Micrometer Tracing (Spring Boot 3.x): Sleuth ka successor. Same kaam karta hai naye Spring Boot versions me.
 * - Zipkin: UI dashboard jahan traces visualize hote hain. Docker se chala sakte ho:
 *   docker run -d -p 9411:9411 openzipkin/zipkin
 *   Visit: http://localhost:9411 -> Saari traces dikhti hain!
 * 
 * SETUP (Spring Boot 3.x):
 * - Dependencies: micrometer-tracing-bridge-brave + zipkin-reporter-brave
 * - application.properties:
 *   management.tracing.sampling.probability=1.0  (1.0 = 100% requests trace)
 *   management.zipkin.tracing.endpoint=http://localhost:9411/api/v2/spans
 * - Logs me automatically aayega: [ORDER-SERVICE, traceId=abc123, spanId=def456]
 * 
 * ========================================================================
 * 5. DOCKER (CONTAINERIZATION)
 * ========================================================================
 * - Problem: "Mere PC pe toh chal raha tha, server pe kyu error aara?" (OS versions, missing environment variables, wrong Java version).
 * - Solution: Docker ek "Image" (blueprint) banata hai jisme aapki App + Java JRE + OS (Linux) dependencies packed hoti hain.
 * - Container: Us Image ka running copy. Ek bar Image ban gayi, toh Docker jahan bhi install hoga (Linux, Mac, Windows, AWS), wo exactly same run karega.
 * 
 * DOCKER CONCEPTS:
 * - Dockerfile: Text file jisme instructions hoti hain ki Image kaise build karni hai.
 * - Image: Read-only blueprint (like a Java class).
 * - Container: Running instance of an Image (like a Java object).
 * - Docker Hub: Public registry jahan images stored hoti hain (hub.docker.com).
 * 
 * ========================================================================
 * 6. DOCKER NETWORKING ⭐
 * ========================================================================
 * - Containers by default isolated hote hain. Networking se containers aapas me communicate karte hain.
 * 
 * NETWORK TYPES:
 * - bridge (Default): Same host pe containers ko connect karta hai. Container name se communicate kar sakte ho.
 *   docker network create my-network
 *   docker run --network my-network --name db mysql
 *   docker run --network my-network --name app my-spring-app
 *   -> app container me DB URL: jdbc:mysql://db:3306/mydb (container name = hostname!)
 * 
 * - host: Container directly host machine ka network use karta hai (no isolation). Fast but less secure.
 * - overlay: Multiple Docker hosts (machines) ke containers ko connect karta hai (Docker Swarm/Kubernetes me use hota hai).
 * - none: No networking. Completely isolated container.
 * 
 * ========================================================================
 * 7. DOCKER VOLUMES (Data Persistence) ⭐
 * ========================================================================
 * - Problem: Container delete hone pe uska saara data bhi ud jata hai (stateless by design). Database container me data permanently store kaise karein?
 * - Solution: Volumes = Host machine ka folder container ke andar mount karna. Container delete ho bhi jaye, data safe rahega.
 * 
 * TYPES:
 * - Named Volume (Recommended): Docker manage karta hai location.
 *   docker volume create my-data
 *   docker run -v my-data:/var/lib/mysql mysql
 * 
 * - Bind Mount: Specific host folder mount karna.
 *   docker run -v /home/user/data:/var/lib/mysql mysql
 * 
 * - tmpfs Mount: Memory me store hota hai (temporary, fast).
 * 
 * ========================================================================
 * 8. DOCKER COMPOSE (Multi-Container Apps)
 * ========================================================================
 * - docker-compose.yml: Agar aapko apni Spring Boot app ke sath MySQL aur Redis dono chalane hain, toh docker-compose se ek single command me teeno container start ho jate hain.
 * - Networking automatic hoti hai (saare services same network pe).
 */

/*
=============================
Sample Dockerfile
=============================
# Use official Java runtime base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the packaged jar file from your PC to the container
# Note: You must run `mvn clean package` before running docker build
COPY target/my-spring-app-0.0.1.jar app.jar

# Expose port (Documentation purpose)
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

=============================
Sample docker-compose.yml
=============================
version: '3.8'
services:
  # Spring Boot Application
  app:
    build: .                          # Build from Dockerfile in current dir
    ports:
      - "8080:8080"                   # Map host:container port
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb  # 'db' = service name below
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
    depends_on:
      - db                            # Start db before app
    networks:
      - app-network

  # MySQL Database
  db:
    image: mysql:8.0                  # Pull from Docker Hub
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
    volumes:
      - db-data:/var/lib/mysql        # Persist data even if container is deleted!
    ports:
      - "3306:3306"
    networks:
      - app-network

volumes:
  db-data:                            # Named volume declaration

networks:
  app-network:                        # Custom bridge network
    driver: bridge

=============================
FeignClient Example
=============================
// In Order Service — calling Payment Service
@FeignClient(name = "PAYMENT-SERVICE")  // Name registered in Eureka
public interface PaymentClient {
    @GetMapping("/api/payments/{orderId}")
    PaymentResponse getPaymentByOrderId(@PathVariable Long orderId);
}

// Usage in OrderService
@Service
class OrderService {
    @Autowired
    private PaymentClient paymentClient;

    public OrderDetails getOrderWithPayment(Long orderId) {
        PaymentResponse payment = paymentClient.getPaymentByOrderId(orderId);
        // Feign handles: Eureka lookup -> HTTP GET -> JSON deserialization
        return new OrderDetails(orderId, payment);
    }
}

=============================
Useful Docker Commands
=============================
# Build image
docker build -t my-app-name .

# Run container (-p maps PC port to Container port, -d detached mode)
docker run -d -p 8080:8080 --name my-container my-app-name

# Show running containers
docker ps

# Show ALL containers (including stopped)
docker ps -a

# Stop a container
docker stop my-container

# Remove a container
docker rm my-container

# View container logs
docker logs my-container
docker logs -f my-container   # Follow (live tail)

# Execute command inside running container
docker exec -it my-container /bin/sh

# List images
docker images

# Remove image
docker rmi my-app-name

# Docker Compose commands
docker-compose up -d          # Start all services (detached)
docker-compose down           # Stop and remove all containers
docker-compose logs -f        # Follow logs of all services
docker-compose ps             # List compose services

# Volume commands
docker volume ls              # List all volumes
docker volume inspect my-data # Show volume details
docker volume rm my-data      # Delete volume

# Network commands
docker network ls             # List networks
docker network inspect bridge # Inspect a network

# Run Zipkin for distributed tracing
docker run -d -p 9411:9411 openzipkin/zipkin
*/

public class Docker_Microservices {
    public static void main(String[] args) {
        System.out.println("===== Docker & Microservices =====");
        System.out.println("Docker: 'It works on my machine' works EVERYWHERE!");
        System.out.println("FeignClient: Declarative inter-service REST calls.");
        System.out.println("Zipkin: See the full request journey across all microservices.");
        System.out.println("Volumes: Container data survives restarts and deletions.");
    }
}

