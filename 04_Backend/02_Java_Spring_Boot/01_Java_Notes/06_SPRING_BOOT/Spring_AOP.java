/**
 * ## Quick revision
 *
 * - AOP — logging/transactions jaise cross-cutting work business method se separate.
 * - Aspect — related advice + pointcuts ka group.
 * - Join point — interception location; Spring AOP mein method execution.
 * - Pointcut — kin methods par advice lagegi.
 * - Advice — before, after, after-returning, after-throwing ya around.
 * - Around — proceed call aur result/error handling consciously karo.
 * - Proxy — caller proxy se guzre tab advice; self-invocation bypass kar sakti hai.
 * - Limits — proxy type/final/private method restrictions samjho.
 * - Ordering — multiple aspects ka order explicit; transaction/security behavior affect ho sakta hai.
 * - Exception advice — logging ke baad original exception preserve; swallow karna caller/transaction behavior badalta hai.
 * - Proxy identity — injected bean proxy ho sakta hai; implementation-class assumptions avoid.
 * - Aspect test — external bean call aur internal self-call ka interception difference verify karo.
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
