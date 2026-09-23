# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Cache ke key mein poori identity rakho

```java
// Excerpt: @EnableCaching, configured CacheManager, repository bean required.
@Service
class CourseLookup {
    private final CourseRepository repository;
    CourseLookup(CourseRepository repository) { this.repository = repository; }

    @Cacheable(cacheNames = "courseTitles", key = "#p0 + ':' + #p1")
    public String title(long tenantId, long courseId) {
        return repository.findTitle(tenantId, courseId);
    }
}
```
