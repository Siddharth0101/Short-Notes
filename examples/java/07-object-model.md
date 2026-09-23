# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Composition and polymorphism

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

## Equality and immutable values

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

## Overriding equals and hashCode by hand

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

## Class design checklist

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
