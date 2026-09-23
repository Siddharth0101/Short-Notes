# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Bound admission independently

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

final class PartnerGateway {
    private final Semaphore permits = new Semaphore(20);

    String load() throws InterruptedException {
        if (!permits.tryAcquire(100, TimeUnit.MILLISECONDS)) {
            throw new IllegalStateException("Partner capacity exhausted");
        }
        try {
            return callPartnerWithTimeout();
        } finally {
            permits.release();
        }
    }

    private String callPartnerWithTimeout() {
        // Teaching stub: real client must configure connection and request deadlines.
        return "response";
    }
}
```
