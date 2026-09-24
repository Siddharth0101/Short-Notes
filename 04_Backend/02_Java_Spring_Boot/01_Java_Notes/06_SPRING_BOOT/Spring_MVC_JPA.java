/**
 * ## Quick revision
 *
 * - `@RestController` — HTTP response body return karne wala controller.
 * - Mapping — path + HTTP method se handler choose.
 * - DTO — external request/response shape; persistence entity directly expose mat karo.
 * - Controller — parse/validate/response; service — business rules; repository — persistence.
 * - Status — create 201, missing 404, invalid input 400 jaise contract clear rakho.
 * - Idempotency — repeated request ka side effect contract define karo.
 * - Pagination — bounded size aur stable ordering do.
 * - JPA — persistence specification; Hibernate — implementation.
 * - Entity — persistence identity/state; DTO se alag responsibility.
 * - Persistence context — managed entities aur dirty checking track karta hai.
 * - `@Transactional` — transaction boundary; default proxy mode mein self-call intercept nahi hoti.
 * - Rollback — default unchecked exceptions/Error par; checked exception rules configure karo.
 * - Lazy loading — transaction/session ke bahar relation access fail kar sakta hai.
 * - N+1 — har row par extra query; fetch plan/projection/batch se control karo.
 * - Optimistic lock — `@Version` se stale update detect; conflict handling chahiye.
 * - Pessimistic lock — rows lock; contention/deadlock ka cost samjho.
 * - Constraint — uniqueness/invariant database mein bhi enforce karo.
 * - Servlet — HTTP request/response handling ka runtime contract.
 * - Concurrency — same servlet instance multiple requests handle kar sakta hai.
 * - Request state — local variables/request scope; shared instance field mein mat rakho.
 * - Filter — request chain ke around cross-cutting behavior.
 * - DispatcherServlet — Spring MVC request ko handler tak route karta hai.
 * - Forward — server-side dispatch; redirect — client ki nayi request.
 * - JSP — server-side view rendering; output escape karo.
 * - MVC — controller input, model data, view presentation.
 * - Content negotiation — Accept expected response type; Content-Type sent body ka type.
 * - Path/query/body — resource identity / filters / structured payload ko suitable binding se lo.
 * - Entity exposure — internal fields, lazy relations aur schema changes API contract leak kar sakte hain.
 */

public class Spring_MVC_JPA {
    public static void main(String[] args) {
        System.out.println("===== Spring MVC & Data JPA =====");
        System.out.println("@Controller  -> Returns VIEW (HTML via Thymeleaf)");
        System.out.println("@RestController -> Returns DATA (JSON)");
        System.out.println("JpaRepository -> FREE CRUD! No SQL needed.");
        System.out.println("Derived Queries: findByNameAndAge() -> Spring writes SQL for you!");
    }
}
