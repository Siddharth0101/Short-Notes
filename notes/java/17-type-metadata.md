---
id: java-type-metadata
title: Java type modeling — enums, sealed types aur annotations
track: java
order: 17
level: Intermediate
minutes: 33
summary: Allowed states ko type model se express karo; annotation metadata hai, behavior usse process karne wala tool deta hai.
tags: enums, sealed, records, annotations, reflection
---

## Mental model — simple soch

String `"PAID"` likhne par compiler ko allowed values ka set nahi pata. Enum use karoge toh typo compile time par pakad sakte ho. Lekin sab variants ka same data shape ho yeh zaroori nahi: paid result ka receipt hai, rejected result ka reason. Sealed hierarchy allowed variants ko model karne ka option deti hai.

> **Core takeaway:** Data ki valid shape pehle define karo; reflection aur annotations ko us model ke upar deliberate infrastructure samjho.

OOP, records, interfaces aur collections ke baad yeh chapter padho. Neeche standalone Java 21+ example hai, preview features ki zaroorat nahi. `PaymentDemo.java` mein save karke `javac PaymentDemo.java` aur `java PaymentDemo` chalao.

## Impossible combinations kam karo

```java
import java.util.List;

public class PaymentDemo {
    enum Channel { CARD, UPI }
    sealed interface Result permits Paid, Rejected {}
    record Paid(String receipt, List<String> notices) implements Result {
        Paid {
            if (receipt == null || receipt.isBlank()) {
                throw new IllegalArgumentException("receipt required");
            }
            notices = List.copyOf(notices);
        }
    }
    record Rejected(String reason) implements Result {}
    static String describe(Result result) {
        return switch (result) {
            case Paid p -> "Receipt: " + p.receipt();
            case Rejected r -> "Rejected: " + r.reason();
        };
    }
    public static void main(String[] args) {
        var messages = new java.util.ArrayList<>(List.of("Email pending"));
        var result = new Paid("r-42", messages);
        messages.clear();
        System.out.println(result.notices().size()); // 1
        System.out.println(describe(result)); // Receipt: r-42
    }
}
```

`paid=true`, `failed=true`, `receipt=null` wale conflicting flags ki jagah exactly one result variant hai. Sealed set mein new permitted type add karne par exhaustive switch update karna padega. Null ko public boundary par separately reject/handle karo; sealed interface apne-aap null eliminate nahi karti.

Record ke fields final hone se nested object deep immutable nahi ban jaata. Yahan `List.copyOf` list membership ka snapshot banata hai aur Strings immutable hain. Agar list ke elements mutable `Address` objects hote, unhe copy/freeze karne ka decision alag hota. Generated equality components ke contracts follow karti hai; array component deep-content equality apne-aap nahi deta.

## Enum, nested class aur sealed type ka choice

Enum closed named choices ke liye hai: channel/status. Har instance ka different receipt ho toh enum mein global mutable receipt mat rakho. Sealed interface finite alternatives ke different payloads ke liye useful hai. Open interface tab chuno jab external implementations expected hon.

Static nested class ko implicit enclosing instance nahi chahiye. Non-static inner class enclosing object se associated hoti hai. Long-lived callback inner instance retain kare toh enclosing object ki lifetime bhi badh sakti hai. Anonymous class ek implementation object banati hai; lambda functional interface ke behavior ko express karti hai. Inhe syntax shortcuts samajhne ke saath ownership bhi trace karo.

## Annotation magic nahi hai

`@Override` compiler ko intent check karne deta hai. Apna `@Audited` naam likh dene se logs create nahi honge. Koi compiler processor, framework ya runtime code metadata read karke action karega. Retention decide karti hai metadata source, class file ya runtime reflection tak available hai. Target decide karta hai annotation method/type/field jaise kis element par allowed hai.

Runtime inspection ke liye `RetentionPolicy.RUNTIME` chahiye. Reflection se class/method metadata inspect kar sakte ho, lekin access rules aur module boundaries apply hoti hain. `setAccessible` ko universal bypass mat samjho. Reflective method invocation mein actual exception wrapper ke andar mil sakti hai; original cause preserve karke diagnose karo.

Framework startup annotation scan karke proxy bana sakta hai. Usse har direct self-call intercepted hoga yeh follow nahi karta. Spring transaction/AOP chapter se proxy boundary connect karo. Hand-written reflection ko normal business dispatch ka default mat banao jab typed interface enough ho.

## Practice — model aur metadata ka farq

Order result mein Pending, Confirmed(receipt) aur Rejected(reason) model karo. Ab pending ko user message map karo. Annotation se audit tag add karna separate infrastructure concern rakho. Contract tests invalid receipt reject karein, original list mutation se snapshot na badle aur all result variants handle hon.

## Depth walkthrough — andar kya ho raha hai?

### Sealed hierarchy ko impossible state kam karne ke liye use karo

PaymentResult success mein receipt chahiye, failure mein error reason. One class mein success boolean, optional receipt aur optional error se contradictory states ban sakti hain. Finite variants constructor contracts ke saath valid combinations express kar sakti hain.

Record shallow immutable carrier hai: final component reference ke andar mutable list ho sakti hai. Defensive copy ya immutable element policy chahiye toh deliberately implement karo. Generated equals/hashCode component semantics use karte hain; domain identity automatically design nahi hoti.

Annotation metadata store karti hai. Runtime retention ke bina reflection us annotation ko runtime par necessarily nahi dekhegi; compile-time processor alag mechanism hai. **Practice:** Custom annotation add karke behavior magically change expect mat karo. Kaunsa processor/framework reader use karega aur missing metadata par kya hoga, identify karo. Type model aur runtime enforcement separate responsibilities hain.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Record ki shallow immutability aur deep immutability mein farq kya hai?

**Apply — khud try karo:** Paid mein List<MutableNotice> rakhne par caller notice.text badalta hai. Defensive list copy ke baad bhi kya badlega?

> **Hint — chhota ishara:** Collection ki structure aur element objects alag layers hain.

**Answer guide — pehle khud karo, phir compare karo:** List membership protected hai, lekin mutable element shared hai; uski text change dikhegi. Immutable notice record with immutable fields lo ya elements ki defensive copies banao. Sirf unmodifiable wrapper enough nahi.

**Exit check — aage badhne se pehle:** Annotation add karne ke baad actual behavior kaun execute karega aur kaunsi retention chahiye, explain karo.

## Sources — aur padhne ke liye

[Records](https://dev.java/learn/records/), [annotations](https://dev.java/learn/annotations/) aur [sealed classes](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html) official references hain.
