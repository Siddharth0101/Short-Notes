/**
 * ========================================================================
 * 09. DOCKER & MICROSERVICES
 * ========================================================================
 * NOTES:
 * 
 * 1. MONOLITH VS MICROSERVICES:
 * - Monolithic: Poori application (UI, Business, DB connection, Payment, Cart) ek hi codebase aur ek hi server pe deploy hoti hai. (Easy initially, par badi apps me hard to scale/maintain).
 * - Microservices: Application ko chote chote independent services me divide karna.
 *   - Cart Service, Payment Service, Notification Service.
 *   - Har service alag language (Java, Node) me ho sakti hai.
 *   - Har service ka apna database (DB per service pattern) hona best practice hai.
 *   - Scalability aasan hoti hai (Agar Black Friday pe Payment pe load zyada hai, toh sirf Payment Service ke naye instances bana lo).
 * 
 * 2. SPRING CLOUD ECOSYSTEM:
 * - Service Registry (Netflix Eureka): Saari services yahan register hoti hain. Service A ko Service B ka IP pata nahi hota, wo Eureka se puchti hai.
 * - API Gateway (Spring Cloud Gateway): Single entry point for frontend. Ye request ko correct microservice pe route karta hai.
 * - Resilience4j (Circuit Breaker): Agar koi microservice down ho jaye, toh poori app hang na ho, balki fallback (default response) jaldi return ho jaye.
 * 
 * 3. DOCKER (CONTAINERIZATION):
 * - Problem: "Mere PC pe toh chal raha tha, server pe kyu error aara?" (OS versions, missing environment variables, wrong Java version).
 * - Solution: Docker ek "Image" (blueprint) banata hai jisme aapki App + Java JRE + OS (Linux) dependencies packed hoti hain.
 * - Container: Us Image ka running copy. Ek bar Image ban gayi, toh Docker jahan bhi install hoga (Linux, Mac, Windows, AWS), wo exactly same run karega.
 * 
 * 4. DOCKER CONCEPTS:
 * - Dockerfile: Text file jisme instructions hoti hain ki Image kaise build karni hai.
 * - docker-compose.yml: Agar aapko apni Spring Boot app ke sath MySQL aur Redis dono chalane hain, toh docker-compose se ek single command me teeno container start ho jate hain.
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
Useful Commands
=============================
# Build image
docker build -t my-app-name .

# Run container (-p maps PC port to Container port)
docker run -p 8080:8080 my-app-name

# Show running containers
docker ps
*/

public class Docker_Microservices {
    public static void main(String[] args) {
        System.out.println("Dockerizing applications ensures 'It works on my machine' works everywhere!");
    }
}
