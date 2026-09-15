---
id: java-object-model
title: Objects OOP records and equality
track: java
order: 7
level: Foundation
minutes: 22
summary: Identity puchti hai same object hai ya nahi; value equality puchti hai meaningful data same hai ya nahi. Hash collections mein equals/hashCode contract match hona chahiye.
tags: oop, records, equality, interfaces
---

## Mental model — simple soch

Object sirf fields plus getters nahi hai. Achha object apne valid states protect karta hai. Bank balance private rakh kar unrestricted setter dena encapsulation ka purpose miss karta hai. Public methods domain actions express karein: deposit, reserve, cancel. Constructor ke baad instance valid ho, aur har method validity preserve kare.

> **Core takeaway:** Identity puchti hai same object hai ya nahi; value equality puchti hai meaningful data same hai ya nahi. Hash collections mein equals/hashCode contract match hona chahiye.

## Composition and polymorphism

Interface behavior ka contract deta hai. Inheritance tab use karo jab subtype parent ki expectations preserve kare. Reuse ke liye composition usually flexible hai: order service ke paas pricing strategy ho sakti hai. Runtime dispatch overridden instance method select karta hai; overloaded method selection compile-time types se hoti hai. Static methods instance polymorphism participate nahi karte.

```java
interface Discount {
    long apply(long subtotalPaise);
}

record FixedDiscount(long paise) implements Discount {
    FixedDiscount {
        if (paise < 0) throw new IllegalArgumentException("negative discount");
    }
    public long apply(long subtotalPaise) {
        if (subtotalPaise < 0) throw new IllegalArgumentException("negative total");
        return Math.max(0, subtotalPaise - paise);
    }
}
```

Yahan discount amount validated hai aur strategy independent test ho sakti hai. Production currency model currency identity aur overflow policy bhi specify karega. Sample deliberately single-currency calculation illustrate karta hai.

## Equality and immutable values

`equals` equivalence relation hona chahiye: reflexive, symmetric, transitive, consistent, aur null ke against false. Equal objects ke equal hash codes required hain; different objects ka same hash code allowed hai. Hash-based collections mein mutable equality fields risky hain: insert ke baad hash change hua toh lookup expected bucket mein object nahi dhoondh sakta. [Object API contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)

Record concise data carrier hai, with component accessors and generated equality/hash behavior. Record shallowly immutable hota hai: component reference final hai, referenced collection potentially mutable hai. `List.copyOf` constructor mein snapshot de sakta hai, lekin mutable elements ko deeply copy nahi karta.

```java
record Cart(String owner, List<String> itemIds) {
    Cart {
        itemIds = List.copyOf(itemIds); // defensive snapshot, still immutable elements assumed
    }
}

List<String> mutable = new ArrayList<>(List.of("pen"));
Cart cart = new Cart("Asha", mutable);
mutable.add("book");
System.out.println(cart.itemIds()); // ["pen"] — the record kept its own snapshot
```

Compact constructor `itemIds` ko canonical constructor call hone se pehle intercept kar leta hai, isliye caller ki list badalne se record ka internal state affect nahi hota. Agar `itemIds` khud mutable objects (jaise custom `CartItem` with a setter) store karta, `List.copyOf` sirf list structure freeze karta, individual elements nahi.

## Overriding equals and hashCode by hand

Jab record fit nahi baithta (mutable entity, JPA-managed class), `equals`/`hashCode` khud likhna padta hai. Common mistake fields ka subset compare karna ya inheritance ke saath contract todna hai:

```java
class Money {
    private final String currency;
    private final long minorUnits;

    Money(String currency, long minorUnits) {
        this.currency = currency;
        this.minorUnits = minorUnits;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Money money)) return false;
        return minorUnits == money.minorUnits && currency.equals(money.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(currency, minorUnits);
    }
}
```

`instanceof` pattern check subclass instances ko bhi accept karta hai jo `getClass()` equality check reject kar deta — dono approaches valid hain, but symmetry maintain karna zaroori hai: agar `Money` ka subclass naya field add karke apna `equals` override kare without care, `a.equals(b)` aur `b.equals(a)` different answer de sakte hain. Isi wajah se value classes ko usually `final` rakha jata hai.

## Class design checklist

Package-private default rakho jab public API necessary na ho. `protected` inheritance surface badhata hai. Constructor se overridable method call karna avoid karo, kyunki subclass fields initialize hone se pehle override execute ho sakta hai. Enum finite named choices ke liye useful hai. Sealed hierarchy permitted subtypes restrict karti hai, useful jab expression shapes bounded hon.

```java
sealed interface PaymentResult permits Success, Declined, Error {}
record Success(String transactionId) implements PaymentResult {}
record Declined(String reason) implements PaymentResult {}
record Error(String message) implements PaymentResult {}

static String describe(PaymentResult result) {
    return switch (result) {
        case Success success -> "ok:" + success.transactionId();
        case Declined declined -> "declined:" + declined.reason();
        case Error error -> "error:" + error.message();
    };
}
```

Sealed interface ke saath `switch` expression compiler-verified exhaustive hota hai — agar kal koi chautha variant `Pending` add karo aur `permits` list update karo, yeh `switch` bina `default` branch ke compile error dega jab tak naya case handle na ho. Yeh open interface/abstract class se bada advantage hai, jahan naya subtype silently existing switch statements mein `default` branch mein gir jaata.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Constructor ke andar overridable method call karna safe hai kyunki `this` fully constructed object hai. **Why it breaks:** Java superclass constructor pehle chalata hai; agar wahan se overridden method call hota hai, subclass ke fields abhi initialize hi nahi hue hote — override un fields ko unexpected default value (0/null) ke saath dekh sakta hai. **Fix:** Constructor se sirf `private`/`final` methods call karo, ya initialization ko factory method mein move karo.
- **Wrong assumption:** `getClass()` aur `instanceof` equality check mein interchangeable hain. **Why it breaks:** `getClass()` exact-class match maangta hai, so ek valid subclass instance apne parent ke equal nahi maana jayega even with identical semantic value; `instanceof` yeh allow karta hai but symmetry todne ka risk laata hai agar subclass extra fields add kare. **Fix:** Value classes ko `final` rakho jab possible ho, taaki dono approaches equivalent ban jayein.
- **Wrong assumption:** Enum sirf named constants hain, behavior nahi rakh sakta. **Why it breaks:** Enum constants apna khud ka method body override kar sakte hain (constant-specific class body), jisse switch-heavy code ki jagah polymorphic dispatch mil jaata hai — is capability ko ignore karna verbose switch statements ki taraf le jaata hai.

## Interview questions — bolkar practice karo

**Abstract class versus interface?** Abstract class shared instance state aur constructor behavior model kar sakti hai; interface multiple implementation contracts allow karta hai. Default methods available hain, lekin unrelated behavior share karne ke liye giant interface banana poor design hai.

**Does a record make a List immutable?** Nahi. Defensive collection copy aur immutable element design separately decide karna padega. Accessor raw mutable list return kare toh caller state change kar sakta hai.

**Why prefer composition?** Dependency ko replace aur test karna easy hota hai, aur parent implementation changes se coupling kam hoti hai. Yeh universal ban on inheritance nahi hai.

**How does a sealed interface make a switch exhaustive?** Compiler ko `permits` list se saare possible subtypes pata hote hain, isliye har case cover hone par `default` branch ki zaroorat nahi. Naya permitted subtype add karne par un saare switch expressions mein compile error aata hai jahan handling missing hai — refactor safety net ban jaata hai.

## Practice

PaymentResult ko sealed success/failure variants se model karo. Ek mutable map key ka failing lookup demonstrate karo, phir immutable record key se correct karo. Test equality between independently constructed equal values. Phir ek `Money` class likho jisme `equals`/`hashCode` currency aur amount dono use karein, aur ek failing test likho jo sirf amount compare karne ki galti pakde.

## Depth walkthrough — andar kya ho raha hai?

### Equality contract collection behavior kyun badalta hai?

Hash-based collection pehle hash se candidate bucket locate karti hai, phir equality se match decide karti hai. Two equal objects unequal hash return karein toh lookup expected contract tod sakta hai. Same hash hona equality prove nahi; collision allowed hai.

Mutable key insert ke baad equality/hash fields change kare toh lookup different bucket search kar sakta hai. Object ab bhi stored ho sakta hai, phir bhi contains/remove expected match miss kare. Stable immutable identity choose karo; arbitrary mutable display name key identity na banao.

Inheritance mein subclass extra fields add kare toh equals symmetry/transitivity preserve karna tricky ho sakta hai. “Same ID means equal” aur “all fields equal” different domain definitions hain. **Practice:** Two independent instances same intended identity se Set mein add karo; count, contains aur removal verify karo. Phir field mutation counterexample dikhao aur immutable-key fix explain karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Do alag ID objects mein same text hai. Kab equal maane jayenge? equals badla lekin hashCode nahi badla toh kya ho sakta hai?

> **Hint — chhota ishara:** Equal objects ka hashCode equal hona zaroori hai; reverse guarantee nahi hai.

**Answer guide — pehle khud karo, phir compare karo:** Value ID ke liye text compare karo aur same stable fields se hashCode nikalo. HashSet mein ek logical ID rehni chahiye. Equal aur unequal dono cases test karo. Contract tootne par equals true hone ke baad bhi lookup/deduplication fail ho sakti hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Object API contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Records](https://dev.java/learn/records/)

## Is concept ko aur practice karo

- [Java type modeling — enums, sealed types aur annotations](17-type-metadata.md)

## Aage ki practice

[LLD mein apply karo](19-low-level-design.md): copy identity, atomic ownership aur testable clock ka complete example.
