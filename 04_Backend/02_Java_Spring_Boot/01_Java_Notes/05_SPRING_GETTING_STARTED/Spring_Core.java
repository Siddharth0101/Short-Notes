/**
 * ========================================================================
 * 05. SPRING CORE (IoC & DI)
 * ========================================================================
 * NOTES:
 * - Spring ek comprehensive enterprise Java framework hai. Core concept Inversion of Control (IoC) hai.
 * 
 * THE PROBLEM SPRING SOLVES (Tightly Coupled Code):
 * - Agar aap ek class me dusri class ka object banate ho (e.g. `Engine e = new Engine()`), toh dono classes tightly coupled ho jati hain. Agar Engine ka constructor change hua, toh saari classes ko change karna padega.
 * 
 * 1. INVERSION OF CONTROL (IoC):
 * - Object creation aur lifecycle management ka control ab developer ke paas nahi, balki Spring Container (ApplicationContext) ke paas hai.
 * - Hum Spring ko batate hain (via Annotations ya Config) ki kaunse objects (Beans) banane hain.
 * 
 * 2. DEPENDENCY INJECTION (DI):
 * - IoC implement karne ka tarika.
 * - Jab ek class dusri class (dependency) pe depend karti hai, toh Spring Container automatically woh class "inject" (pass) kar deta hai.
 * - Types of Injection:
 *   a) Constructor Injection (Best Practice): Dependencies via constructor milti hain.
 *   b) Setter Injection: Dependencies via setter method.
 *   c) Field Injection (`@Autowired` directly on variable): Not recommended due to testing difficulty.
 * 
 * 3. SPRING BEAN LIFECYCLE:
 * - Bean = Woh Java Object jo Spring IoC container manage karta hai.
 * - Scopes:
 *   - Singleton (Default): Ek hi object banta hai aur poori app me share hota hai. (Stateless classes ke liye).
 *   - Prototype: Har baar naya object banta hai jab aap maangte ho.
 * 
 * 4. KEY ANNOTATIONS:
 * - @Component: Class ke upar lagao, Spring uska object (Bean) khud banayega.
 * - @Autowired: Dependency inject karne ke liye use hota hai.
 * - @Configuration: Woh class jo beans define karne ke liye use hoti hai (Java-based configuration).
 * - @Bean: @Configuration class ke andar ek method pe lagta hai, method jo object return karta hai, wo Spring Bean ban jata hai.
 * - @Primary: Agar interface ke 2 implementations (@Component) hain, toh ambiguity dur karne ke liye kisko priority deni hai.
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
