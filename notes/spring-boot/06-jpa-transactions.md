---
id: java-jpa-transactions
title: JPA Hibernate and Spring transactions
track: spring-boot
order: 6
level: Advanced
minutes: 26
summary: Transaction ka behavior actual invocation boundary aur uske andar ki operations se decide hota hai.
tags: jpa, hibernate, transactions, n-plus-one
---

## Mental model — simple soch

JPA specification hai; Hibernate uska popular implementation hai; Spring Data JPA repository boilerplate reduce karta hai. Entity ordinary response DTO nahi. Persistence context managed entities track karta hai and changes SQL synchronization mein convert kar sakta hai. Database constraints still final correctness boundary hain.

> **Core takeaway:** Transaction ka behavior actual invocation boundary aur uske andar ki operations se decide hota hai.

## Entity lifecycle and mapping

New entity transient hoti hai. Persistence context se associated entity managed hoti hai. Context close/detach ke baad detached object changes automatically persist nahi hote. `flush` pending changes database tak synchronize karta hai, `commit` transaction complete karta hai; flush alone durability guarantee nahi.

```java
@Entity
class StudyNote {
    @Id @GeneratedValue
    private Long id;
    @Version
    private long version;
    @Column(nullable = false, length = 120)
    private String title;

    protected StudyNote() {}
    StudyNote(String title) { rename(title); }
    void rename(String next) {
        if (next == null || next.isBlank() || next.length() > 120) {
            throw new IllegalArgumentException("invalid title");
        }
        title = next;
    }
}
```

Optimistic version column conflicting updates detect karne mein help karti hai. Failure par user ko conflict resolve/reload option do; blind retry newer user edits overwrite karne ki intent issue solve nahi karta.

## Transaction boundary

```java
@Transactional
public void rename(long id, String title) {
    StudyNote note = repository.findById(id)
        .orElseThrow(NoteNotFound::new);
    note.rename(title);
}
```

Illustrative service method managed entity dirty checking use karta hai. In default proxy mode external proxy calls intercepted hote hain; same object ke internal method call par new transactional advice apply nahi hota. Existing outer transaction ho toh inner code usi context mein chal sakta hai. Default rollback RuntimeException/Error par hota hai, checked exceptions par nahi unless configured. [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

## Propagation and readOnly

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAudit(String event) {
    auditRepository.save(new AuditEntry(event, Instant.now()));
}

@Transactional(readOnly = true)
public List<NoteView> listNotes(long ownerId) {
    return repository.findByOwnerId(ownerId).stream().map(NoteView::from).toList();
}
```

Default propagation `REQUIRED` hai: existing transaction ho toh usi mein participate karta hai, warna naya banata hai. `REQUIRES_NEW` deliberately independent transaction suspend-and-start karta hai — audit logging ke liye useful hai jab outer business transaction rollback ho jaaye tab bhi audit record persist rehna chahiye. `readOnly = true` Hibernate ko dirty-checking snapshot skip karne ka hint deta hai, jo read-heavy queries ko thoda faster bana sakta hai — lekin yeh database-level enforcement nahi hai, sirf optimization hint hai; agar us method ke andar galti se koi write ho jaaye, database driver ke behavior par depend karega ki woh silently fail ho ya exception de.

## Fetch strategy and N plus one

List load ke baad har entity ka relation access karne se one list query plus N relation queries issue ho sakte hain. Fix based on exact screen needs: DTO projection, fetch join, entity graph or batching. Everything EAGER karna predictable optimization nahi; over-fetching and additional queries ho sakti hain. Collection fetch join plus pagination behavior carefully verify karo against generated SQL and provider limitations.

JPA specification ke default fetch types relation type ke hisaab se different hain, aur yeh defaults khud ek common confusion source hain:

| Relation | Default fetch | Note |
| --- | --- | --- |
| `@ManyToOne` | EAGER | Aksar developers assume karte hain lazy hai, but spec default eager hai |
| `@OneToOne` | EAGER | Same trap; explicit `fetch = LAZY` proxy support ke bina fully lazy nahi hota |
| `@OneToMany` | LAZY | Usually desired default |
| `@ManyToMany` | LAZY | Usually desired default |

`@ManyToOne`/`@OneToOne` ko explicitly `fetch = FetchType.LAZY` na kiya jaaye toh har parent entity load karte waqt uska related entity bhi automatically load ho jaata hai, chahe caller ko us relation ki zaroorat ho ya na ho — yeh silent over-fetching hai jo query count/payload dono badhata hai without any error signal.

```java
@Entity
class Order {
    @Id @GeneratedValue Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    Customer customer; // must opt in to LAZY explicitly

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderLine> lines = new ArrayList<>();
}
```

Relationships mein owning side foreign-key changes drive karta hai. Cascade persist/remove and orphan removal distinct decisions hain. `CascadeType.ALL` convenient lagta hai but iska matlab hai parent delete hone par saare child rows bhi delete honge — shared reference entity (jaise ek `Tag` jo multiple `Order`s se linked ho) par accidentally cascade remove laga dena unrelated data delete kar sakta hai. `orphanRemoval = true` alag guarantee deta hai: parent ke collection se element remove karte hi (cascade ke bina bhi) wo child row database se delete ho jaata hai — yeh useful hai jab child ka independent existence hi na ho (jaise `OrderLine` bina `Order` ke meaningless hai), lekin agar `OrderLine` kisi aur entity se bhi reference ho sakta ho, yeh unexpectedly delete kar dega. Bidirectional relationship maintain karte waqt both in-memory sides consistent rakho — sirf `order.getLines().add(line)` karna aur `line.setOrder(order)` bhool jaana, dono directions inconsistent rakh sakta hai jab tak flush/reload na ho.

## Common traps

Entity JSON serialization lazy loading trigger kar sakti hai or cycles expose kar sakti hai; explicit response DTOs use karo. Open session across view code unexpected database queries hide kar sakta hai. Transaction ke andar remote API call connection and locks longer hold karta hai. Database migration versioned rakho; automatic schema mutation ko production deployment plan ka substitute mat banao.

- **Wrong assumption:** `@ManyToOne` relation automatically lazy hai jaise `@OneToMany` hota hai. **Why it breaks:** JPA spec ka default `@ManyToOne`/`@OneToOne` ke liye EAGER hai — bina explicit `fetch = LAZY` ke, related entity har baar automatically load hoti hai, jisse list endpoints par unexpected extra joins/queries aa jaate hain. **Fix:** Har `@ManyToOne`/`@OneToOne` par explicitly `fetch = FetchType.LAZY` likhne ki habit banao, phir jahan genuinely eager chahiye wahan fetch join/entity graph se opt-in karo.
- **Wrong assumption:** `CascadeType.ALL` "convenient defaults" hai jo har relation par laga dena safe hai. **Why it breaks:** Parent entity delete hone par cascade saare child rows bhi delete kar deta hai — agar child entity kisi aur parent se bhi shared/referenced ho sakta hai, unintended data loss ho sakta hai jo sirf production mein "kisi aur ka data gayab ho gaya" jaisa bug banta hai. **Fix:** Cascade ko sirf genuine ownership relationships par lagao (child ka independent existence na ho), aur shared/reference-style entities par cascade avoid karo.
- **Wrong assumption:** Fetch join se collection fetch karte waqt pagination (`LIMIT`/`OFFSET`) bhi expected tarike se kaam karega. **Why it breaks:** Collection fetch join SQL level par ek row-per-child-element result deta hai (Cartesian-product-like expansion); Hibernate application-memory mein pagination apply karta hai jo bade parent-with-many-children datasets par saari rows database se laa sakta hai before slicing — silently memory/performance problem. **Fix:** Pagination ke saath collection fetch join avoid karo; entity graph, batch fetching, ya do-step query (IDs paginate karo, phir details fetch join se load karo) use karo.

## In a real backend service

N+1 queries production mein aksar tab discover hote hain jab list endpoint suddenly slow ho jaata hai load ke saath — ek local test mein 3 rows ke saath difference invisible hota hai, but 10,000 rows ke saath 10,001 queries clearly dikhti hain. `orphanRemoval` aur `CascadeType.REMOVE` ka galat combination ek classic "customer delete karne se unrelated orders bhi gayab ho gaye" incident ka source hota hai — schema design review mein cascade rules explicitly document karna is class ke bugs ko production tak pahunchne se rokta hai.

## Interview questions — bolkar practice karo

**Save versus dirty checking?** Managed entity changes persistence context track kar sakta hai and flush par write karta hai. Detached state and new entity persistence need different handling; repository save behavior entity state par depend karta hai.

**Optimistic versus pessimistic locking?** Optimistic locking conflicts at write detect karta hai and low-contention workflows mein useful hai. Pessimistic locking access serialize kar sakta hai but waits and deadlocks introduce karta hai.

**Why is @ManyToOne eager by default, and why does that matter?** JPA spec `@ManyToOne`/`@OneToOne` ke liye EAGER default rakhta hai, jabki `@OneToMany`/`@ManyToMany` LAZY hote hain. Isse developers jo assume karte hain "sab kuch lazy hai by default" unhe unexpected extra joins milte hain list-heavy endpoints par — explicit `fetch = LAZY` iska standard fix hai.

**What's the difference between cascade REMOVE and orphanRemoval?** `CascadeType.REMOVE` parent explicitly delete hone par child ko bhi delete karta hai. `orphanRemoval = true` isse independent hai — parent ke collection se sirf reference hataने par bhi (parent delete kiye bina) child row delete ho jaata hai, jo tabhi appropriate hai jab child ka existence parent ke bina meaningless ho.

## Practice

List endpoint ke SQL statement count measure karo. Same version se two updates execute karke conflict verify karo. Checked-exception rollback policy ka integration test likho and explicit transaction boundary diagram banao. Phir ek `@ManyToOne` relation ko default EAGER fetch ke saath chhodo, list endpoint ka query count measure karo, phir `LAZY` karke difference dikhao. Last mein `orphanRemoval` ko ek shared-reference relation par galti se laga kar unintended delete reproduce karo.

## Research notes: Trace the actual transaction entry point

Default proxy transaction advice proxy-crossing calls intercept karti hai. Object ka apne annotated method ko direct call inner metadata apply nahi karta.

Trace: controller `CheckoutService.checkout()` call karta hai; woh `this.reserve()` call karta hai. Sirf reserve annotated ho toh new transaction assume mat karo. Intended boundary external service method ya appropriate separate bean par rakho.

checkout already transactional ho toh internal call us transaction mein chal sakti hai; inner annotation phir bhi intercept nahi hui.

**Interview check:** Self-invoked REQUIRES_NEW independent transaction kyun start nahi kar sakta?

**Answer:** Call proxy bypass karti hai; propagation metadata apply nahi hota. Annotation placement par rely karne se pehle actual call path verify karo.

**Practice:** Integration test mein inner failure force karke durable rows inspect karo.

[Source yahan padho — Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Usual Spring proxy-based setup mein method `this` par doosra annotated method call karta hai. Intended transaction kyun start nahi ho sakti?

> **Hint:** Internal call external proxy se hokar nahi jaati.

**Answer guide — compare after attempting:** Self-invocation transactional interceptor bypass karti hai. Transaction externally invoked service boundary par rakho ya suitable separate managed collaborator call karo. Integration test se rollback verify karo; annotation dikhna interception ka proof nahi.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate user guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)
