/**
 * ## Quick revision
 *
 * - Spring — objects aur dependencies manage karta hai; Boot setup/configuration simplify karta hai.
 * - Starter — related dependencies ka convenient bundle.
 * - `@SpringBootApplication` — configuration, auto-configuration aur component scan combine.
 * - Component scan — main class ke package/subpackages mein default scan.
 * - Auto-configuration — classpath/properties/beans ke hisaab se conditional setup.
 * - Startup failure — root cause padho: missing bean, port conflict ya invalid config.
 * - Bean — Spring container ka managed object.
 * - DI — dependencies bahar se milti hain; khud har jagah `new` nahi karte.
 * - Constructor injection — required dependencies explicit aur testable.
 * - Singleton scope — container mein ek instance; automatically thread-safe nahi.
 * - `@Qualifier`/`@Primary` — multiple matching beans mein selection clear karo.
 * - Lifecycle — initialization aur destruction callbacks resource ownership se match karo.
 * - Circular dependency — responsibilities/design split karo.
 * - Configuration — values code se alag properties/environment mein rakho.
 * - `@ConfigurationProperties` — related settings typed object mein bind karo.
 * - Validation — invalid required setting par startup fail karao.
 * - Profile — environment-specific configuration group; secret storage nahi.
 * - Precedence — same key multiple sources mein ho toh winning source inspect karo.
 * - Secrets — source control/logs se door, approved secret store/environment se lo.
 * - Application context — bean definitions, creation aur dependency wiring ka container.
 * - Embedded server — Boot web app apne process mein HTTP server run kar sakti hai.
 * - Condition report — auto-configuration kyun match/back off hui, startup diagnosis mein dekho.
 */

// WITHOUT SPRING (Tightly Coupled)
// class Car {
//     Engine eng = new Engine(); // Car is tightly coupled to Engine
// }

// WITH SPRING (Loosely Coupled via DI)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

interface Engine {
    void start();
}

@Component
class V8Engine implements Engine {
    public void start() {
        System.out.println("V8 Engine starting... Vroom!");
    }
}

@Component
class Car {
    private final Engine engine;

    // Constructor Dependency Injection (Best Practice)
    @Autowired
    public Car(Engine engine) {
        this.engine = engine;
    }

    public void drive() {
        engine.start();
        System.out.println("Car is driving.");
    }
}

// Configuration Class
@Configuration
@ComponentScan(basePackages = "com.example") // Scans for @Component
class AppConfig {
    // You can define @Bean here if not using @Component on classes
}

public class Spring_Core {
    public static void main(String[] args) {
        System.out.println("--- Spring IoC in Action ---");
        
        // 1. Start Spring Container (ApplicationContext)
        // ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        
        // 2. Ask container for the Car Bean
        // Car myCar = context.getBean(Car.class);
        
        // 3. Drive the car (Engine is already injected!)
        // myCar.drive();
    }
}
