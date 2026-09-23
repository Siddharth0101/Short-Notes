# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Entity lifecycle and mapping

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

## Transaction boundary

```java
@Transactional
public void rename(long id, String title) {
    StudyNote note = repository.findById(id)
        .orElseThrow(NoteNotFound::new);
    note.rename(title);
}
```

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

## Fetch strategy and N plus one

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
