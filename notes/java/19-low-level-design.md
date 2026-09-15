---
id: java-low-level-design
title: Low-level design — requirements se classes aur invariants tak
track: java
order: 19
level: Advanced
minutes: 35
summary: Class diagram se pehle valid state transitions aur ownership define karo; interfaces behavior ka contract preserve karein.
tags: lld, oop, design, concurrency, contracts
---

## Mental model — simple soch

Low-level design mein sawal “kitni classes?” se start nahi hota. Pehle operation ka contract samjho: kaun action kar sakta hai, valid state kya hai aur concurrent/failing actions mein kya preserve hona chahiye? Classes us rule ko readable implementation deti hain. Library loan example mein one physical copy ka maximum one active loan invariant hai.

> **Core takeaway:** Requirements → invariants → operations → ownership → interfaces → tests. Pattern names baad mein useful hote hain.

Java OOP, records, collections, concurrency aur database constraints prerequisites hain. Yeh single-process teaching design hai; authentication, persistence, catalog aur payment system complete implement nahi hain.

## Small requirement ko precise karo

Book title aur physical copy alag identities hain. “Java Basics” ki three copies simultaneously borrow ho sakti hain; same copy do members ko nahi. Return old loan identity se match ho, taaki delayed duplicate return kisi naye borrow ko clear na kare. Missing/invalid ID ko boundary par reject karo. Member identity trusted authentication layer se aani chahiye.

Domain values: copyId, memberId, loanId, borrowedAt. Service workflow coordinate kare; store atomic claim/release own kare. Clock dependency se tests real time/sleep par depend nahi karte. Repository interface sirf generic CRUD ho, aur caller `find` phir `save` kare, toh invariant beech mein toot sakta hai: atomic business operation contract expose karo.

## Original worked implementation

Java 21+ mein `LoanDemo.java` save karke `javac LoanDemo.java` aur `java LoanDemo` run karo. Saara example ek file hai.

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

`putIfAbsent` per-copy decision atomic banata hai. Conditional remove expected loan equality match karti hai; new UUID wali loan ko old return remove nahi karegi. UUID yahan operation identity distinguish karti hai, authorization token ka complete design nahi. API caller ko arbitrary Loan object trust karke return allow mat karo; server authenticated member aur stored record verify kare.

## SOLID ko concrete behavior se samjho

Single responsibility: catalog search aur loan ownership ek class mein mix na karo. Open/closed: overdue pricing change ho toh pricing strategy plug karo; har small rule ke liye unnecessary factory tree mat banao. Liskov substitution: new LoanStore implementation same atomic claim/release contract satisfy kare; ordinary non-atomic find/save substitute invalid hai.

Interface segregation: notification adapter ko catalog administration methods implement karne ki need nahi. Dependency inversion: service storage abstraction aur supplied clock par depend karti hai; concrete HTTP client/DB construction business method mein buried nahi. Strategy variable policy replace karti hai, adapter external API shape map karta hai, factory construction centralize karti hai. Pattern ka naam purpose ka substitute nahi.

## Failure aur distributed limit

MemoryStore process restart par empty hai; multiple instances independent state rakhti hain. Production shared database mein active copy uniqueness aur conditional release enforce karo. Fake repository test database constraint prove nahi karta. Borrow success ke baad notification fail ho toh loan undo karna always correct nahi; durable event/outbox aur retry consider karo.

## Practice — diagram se evidence tak

Two threads same copy borrow karein: exactly one success. Different copies independent succeed karein. Old return/new loan case above reproduce karo. Fixed clock se timestamp verify karo. Public API authorization aur database durability tests is in-memory example ke scope ke bahar explicitly list karo.

## Depth walkthrough — andar kya ho raha hai?

### Interface contract ko hostile timing se test karo

MemoryStore atomic claim promise karta hai. Two separate find-then-save calls wali database implementation same interface compile kar sakti hai, lekin behavioral contract fail karegi. Substitute implementation ko database constraint/atomic operation ke saath same invariant preserve karna hoga.

Loan A return, phir loan B same copy claim, phir delayed A return aati hai. Sirf copyId remove karoge toh B delete ho jaayegi. Expected loan identity compare karna stale operation ko no-op banata hai. Yeh ABA-like state reuse problem ko concrete object identity se distinguish karta hai.

**Practice:** Contract suite har store implementation par run karo: concurrent one-copy claim, independent copies, duplicate return, stale return aur invalid IDs. Notification failure borrowing state ko kaise affect kare, decide karo. Diagram mein ownership ke saath atomic boundary mark karo; “repository abstraction” label itself concurrency proof nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Class diagram se pehle copy aur title identity kyun clarify karte hain?

**Apply — khud try karo:** LoanStore ka DB implementation find-then-insert use karta hai. Interface same hone par bhi substitution correct hai?

> **Hint — chhota ishara:** Contract mein atomicity bhi behavior hai.

**Answer guide — pehle khud karo, phir compare karo:** Bina database constraint/atomic claim race possible hai. Same method signature enough nahi; exactly-one-active-loan invariant real concurrent writes par satisfy hona chahiye.

**Exit check — aage badhne se pehle:** Clock injection, delayed duplicate return aur process restart ke expected outcomes samjhao.

## Sources — aur padhne ke liye

[ConcurrentHashMap atomic operations](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html) aur [Clock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Clock.html) ke contracts padho. Example aur design reasoning original practice hain.
