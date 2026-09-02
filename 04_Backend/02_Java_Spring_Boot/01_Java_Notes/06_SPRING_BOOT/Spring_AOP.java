/**
 * ========================================================================
 * 06c. SPRING AOP (ASPECT-ORIENTED PROGRAMMING) [⚡ VISUAL]
 * ========================================================================
 * 
 * ========================================================================
 * 1. WHAT IS AOP & WHY?
 * ========================================================================
 * - Problem: Kuch concerns har jagah repeat hote hain (logging, security check, transaction management,
 *   performance monitoring). Ye "Cross-Cutting Concerns" hain.
 * - Agar har method me manually logging likho toh bohot repetitive code hoga (violates DRY).
 * 
 * - AOP = ek programming paradigm jo in cross-cutting concerns ko SEPARATE module (Aspect) me daal deta hai.
 * - Result: Business logic clean rehta hai. Logging/security alag file me define hota hai, Spring AUTOMATICALLY inject karta hai.
 * 
 * ========================================================================
 * 2. AOP TERMINOLOGY (⭐ IMPORTANT)
 * ========================================================================
 * 
 * ┌─────────────┐    "When"     ┌─────────────┐    "Where"    ┌─────────────┐
 * │   ASPECT    │ ────────────> │   ADVICE     │ ────────────> │  POINTCUT   │
 * │ (The Module)│               │ (The Action) │               │(The Target) │
 * └─────────────┘               └─────────────┘               └──────┬──────┘
 *                                                                     │
 *                                                              ┌──────▼──────┐
 *                                                              │ JOIN POINT  │
 *                                                              │(Exact Spot) │
 *                                                              └─────────────┘
 * 
 * - Aspect (@Aspect): Woh class jisme cross-cutting logic define hota hai (e.g., LoggingAspect).
 * - Join Point: Woh point jahan aspect apply ho SAKTA hai. Spring AOP me = method execution.
 * - Pointcut: Expression jo define karta hai ki "KAUNSE methods pe aspect lagana hai" (filter for join points).
 * - Advice: Actual code jo execute hoga. "KYA karna hai" aur "KAB karna hai" (before, after, around).
 * - Weaving: Spring runtime pe advice ko target method ke sath merge karta hai (proxy pattern use karke).
 * 
 * ========================================================================
 * 3. ADVICE TYPES
 * ========================================================================
 * 
 * @Before: Target method ke PEHLE execute hota hai.
 * - Use: Logging, security checks, validation.
 * - Method execute hoga chahe advice me error aaye ya na aaye.
 * 
 * @After: Target method ke BAAD execute hota hai (chahe exception aaye ya na aaye — like finally).
 * - Use: Cleanup, closing resources.
 * 
 * @AfterReturning: Target method SUCCESSFULLY return kare tab execute hota hai.
 * - Use: Logging return values, post-processing.
 * - Return value access kar sakte ho: @AfterReturning(returning = "result")
 * 
 * @AfterThrowing: Target method EXCEPTION throw kare tab execute hota hai.
 * - Use: Error logging, sending alerts.
 * - Exception access: @AfterThrowing(throwing = "ex")
 * 
 * @Around: Target method ke PEHLE AUR BAAD dono me execute hota hai (sabse powerful).
 * - Use: Performance monitoring (time before - time after), caching, transaction management.
 * - ProceedingJoinPoint.proceed() call karna MUST hai warna original method execute nahi hoga!
 * 
 * ========================================================================
 * 4. POINTCUT EXPRESSIONS
 * ========================================================================
 * - Pointcut = pattern jo define karta hai ki advice KAHAN lagana hai.
 * 
 * SYNTAX: execution(modifiers? return-type declaring-type? method-name(params) throws?)
 * 
 * EXAMPLES:
 * - execution(* com.example.service.*.*(..))
 *   = ANY return type, com.example.service package ki ANY class ke ANY method with ANY params.
 * 
 * - execution(public String com.example.service.UserService.getUser(Long))
 *   = Specific: public String getUser(Long) method of UserService.
 * 
 * - execution(* com.example..*.*(..))
 *   = com.example package aur uske SUB-PACKAGES ki saari classes ke saare methods.
 * 
 * - @annotation(org.springframework.transaction.annotation.Transactional)
 *   = Saare methods jinpe @Transactional annotation laga hai.
 * 
 * - within(com.example.service.*)
 *   = service package ki saari classes ke saare methods.
 * 
 * COMBINING:
 * - @Pointcut("execution(* com.example.service.*.*(..))") -> Reusable pointcut define karo
 * - private void serviceMethods() {} // Empty method as pointcut reference
 * - Then use: @Before("serviceMethods()") -> Clean code!
 * 
 * ========================================================================
 * 5. COMMON USE CASES
 * ========================================================================
 * a) Logging: Har method call pe log karo (method name, args, return value).
 * b) Performance Monitoring: @Around se method execution time measure karo.
 * c) Security: @Before me check karo ki user authorized hai ya nahi.
 * d) Transaction Management: @Transactional internally AOP use karta hai!
 * e) Caching: @Cacheable bhi AOP-based hai.
 * f) Exception Handling: @AfterThrowing se centralized error logging.
 */

/*
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    // ===== @Before Advice =====
    // Runs BEFORE any method in the service package
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("[LOG] Calling: " + methodName + " with args: " + java.util.Arrays.toString(args));
    }

    // ===== @AfterReturning Advice =====
    // Runs AFTER method returns successfully
    @AfterReturning(
        pointcut = "execution(* com.example.service.*.*(..))",
        returning = "result"
    )
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("[LOG] " + joinPoint.getSignature().getName() + " returned: " + result);
    }

    // ===== @AfterThrowing Advice =====
    // Runs when method throws exception
    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "ex"
    )
    public void logException(JoinPoint joinPoint, Exception ex) {
        System.out.println("[ERROR] " + joinPoint.getSignature().getName() + " threw: " + ex.getMessage());
    }

    // ===== @Around Advice (Most Powerful) =====
    // Runs BEFORE and AFTER — great for performance monitoring
    @Around("execution(* com.example.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        Object result = joinPoint.proceed(); // MUST call this! Executes the actual method.
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        System.out.println("[PERF] " + joinPoint.getSignature().getName() + " took " + duration + "ms");
        return result; // Return the original result
    }

    // ===== Reusable Pointcut =====
    @Pointcut("execution(* com.example.controller.*.*(..))")
    private void controllerMethods() {} // Empty — just a reference

    @Before("controllerMethods()")
    public void logControllerCall(JoinPoint joinPoint) {
        System.out.println("[CONTROLLER] " + joinPoint.getSignature().toShortString() + " called");
    }
}
*/

/*
=============================
How AOP Works Internally
=============================
1. Spring creates a PROXY object for your bean (using JDK Dynamic Proxy or CGLIB).
2. When someone calls your method, the call goes to the PROXY first.
3. Proxy executes @Before advice -> calls your ACTUAL method -> executes @After advice.
4. Client never knows about the proxy — transparent!

     Client
       │
       ▼
   ┌───────┐   @Before    ┌──────────┐
   │ Proxy │ ──────────> │  Advice  │
   │       │              │ (Logging)│
   │       │ <────────── └──────────┘
   │       │
   │       │   proceed()  ┌──────────┐
   │       │ ──────────> │  Actual  │
   │       │              │  Method  │
   │       │ <────────── └──────────┘
   │       │
   │       │   @After      ┌──────────┐
   │       │ ──────────> │  Advice  │
   └───────┘              │ (Cleanup)│
       │                  └──────────┘
       ▼
    Response
*/

public class Spring_AOP {
    public static void main(String[] args) {
        System.out.println("===== Spring AOP =====");
        System.out.println("AOP = Separate cross-cutting concerns (logging, security) from business logic.");
        System.out.println("@Before  -> Runs before method");
        System.out.println("@After   -> Runs after method (always)");
        System.out.println("@Around  -> Wraps method (before + after, most powerful)");
        System.out.println("Fun fact: @Transactional and @Cacheable are AOP-based internally!");
    }
}
