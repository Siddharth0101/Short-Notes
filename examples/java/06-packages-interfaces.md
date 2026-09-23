# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Build a package from two files

```java
// src/study/notify/Notifier.java
package study.notify;
public interface Notifier {
    void send(String message);
}
```

```java
// src/study/app/Main.java
package study.app;
import study.notify.Notifier;

public class Main {
    static class StudyService {
        private final Notifier notifier;
        StudyService(Notifier notifier) { this.notifier = notifier; }
        void complete(String lesson) { notifier.send("Completed: " + lesson); }
    }
    public static void main(String[] args) {
        Notifier console = message -> System.out.println(message);
        new StudyService(console).complete("Packages");
    }
}
```

```text
javac -d out src/study/notify/Notifier.java src/study/app/Main.java
java -cp out study.app.Main
Completed: Packages
```
