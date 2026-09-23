# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trace references before locations

```java
final class Note {
    int revisions;
}
static void edit(Note localCopy) {
    localCopy.revisions++;
    localCopy = new Note();
    localCopy.revisions = 99;
}
// Note original = new Note(); edit(original);
// original.revisions is 1, not 99.
```

```text
caller frame                  heap
original -------------------> Note { revisions: 1 }

edit frame
localCopy -- after reassignment --> Note { revisions: 99 }
```

## Common leak patterns beyond unbounded caches

```java
class ReportBuilder {
    private static final List<ReportBuilder> ALL_INSTANCES = new ArrayList<>();
    ReportBuilder() { ALL_INSTANCES.add(this); } // never removed — classic leak
}
```

```java
class ReportService {
    private final byte[] largeBuffer = new byte[10_000_000];
    class Listener { /* implicitly holds ReportService.this */ }
    Listener createListener() { return new Listener(); }
}
```
