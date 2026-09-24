/**
 * ## Quick revision
 *
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
 * - SessionFactory — heavyweight thread-safe factory; Session shared concurrent object nahi.
 * - Session — persistence context aur unit-of-work operations.
 * - Entity state — transient, managed, detached, removed.
 * - First-level cache — session context; second-level cache optional shared layer.
 * - HQL — entity-oriented query; SQL table query se distinction.
 * - Flush/commit — flush SQL synchronize karta hai; transaction durability commit par decide hoti hai.
 * - Read-only hint — optimization hint hai; write prevention ka universal guarantee nahi.
 * - Propagation — caller ki transaction join ya separate boundary; chosen mode ka resource/rollback effect samjho.
 */

public class Hibernate_ORM {
    public static void main(String[] args) {
        System.out.println("Hibernate magically translates your Java Objects into SQL Queries!");
    }
}
