# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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
