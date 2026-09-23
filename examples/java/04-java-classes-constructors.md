# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Create two independent objects

```java
class Learner {
    private final String name;
    private int completed;

    Learner(String name) {
        this.name = name;
    }

    void completeLesson() {
        completed++;
    }

    String summary() {
        return name + ": " + completed;
    }
}
```

```java
Learner first = new Learner("Asha");
Learner second = new Learner("Ravi");
first.completeLesson();
System.out.println(first.summary()); // Asha: 1
System.out.println(second.summary()); // Ravi: 0
```
