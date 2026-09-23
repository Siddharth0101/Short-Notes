# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Contract and component boundary

```text
CatalogRoute
  SearchForm       → query draft, submit, keyboard behavior
  FilterPanel      → URL filter updates
  ResultsRegion    → pending / error / empty / success
    TopicCard      → stable topic identity
    Pagination     → cursor tied to query and sort

GET /topics?q=...&category=...&cursor=...
→ { items, nextCursor, version }
```
