# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Original worked implementation

```java
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class LoanDemo {
    record Loan(UUID id, String copyId, String memberId, Instant borrowedAt) {}
    interface LoanStore {
        boolean claim(Loan loan);
        boolean release(Loan expected);
    }
    static final class MemoryStore implements LoanStore {
        private final ConcurrentHashMap<String, Loan> active = new ConcurrentHashMap<>();
        public boolean claim(Loan loan) {
            return active.putIfAbsent(loan.copyId(), loan) == null;
        }
        public boolean release(Loan expected) {
            return active.remove(expected.copyId(), expected);
        }
    }
    static final class LoanService {
        private final LoanStore store;
        private final Clock clock;
        LoanService(LoanStore store, Clock clock) {
            this.store = java.util.Objects.requireNonNull(store);
            this.clock = java.util.Objects.requireNonNull(clock);
        }
        Optional<Loan> borrow(String copyId, String memberId) {
            if (copyId == null || copyId.isBlank() || memberId == null || memberId.isBlank()) {
                throw new IllegalArgumentException("IDs required");
            }
            var loan = new Loan(UUID.randomUUID(), copyId, memberId, clock.instant());
            return store.claim(loan) ? Optional.of(loan) : Optional.empty();
        }
        boolean returnLoan(Loan loan) { return store.release(loan); }
    }
    public static void main(String[] args) {
        var clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), java.time.ZoneOffset.UTC);
        var service = new LoanService(new MemoryStore(), clock);
        var first = service.borrow("copy-1", "member-A").orElseThrow();
        System.out.println(service.borrow("copy-1", "member-B").isEmpty()); // true
        System.out.println(service.returnLoan(first)); // true
        var second = service.borrow("copy-1", "member-B").orElseThrow();
        System.out.println(service.returnLoan(first)); // false: old return
        System.out.println(service.returnLoan(second)); // true
    }
}
```
