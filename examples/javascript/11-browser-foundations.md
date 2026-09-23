# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A resilient card layout

```html
<main>
  <h1>Study library</h1>
  <form role="search">
    <label for="search">Search chapters</label>
    <input id="search" name="q" type="search">
    <button type="submit">Search</button>
  </form>
  <ul class="cards">
    <li><article><h2>Closures</h2><p>Scope in practice.</p></article></li>
    <li><article><h2>Promises</h2><p>Async outcomes.</p></article></li>
  </ul>
</main>
```

```css
* { box-sizing: border-box; }
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  padding: 0;
  list-style: none;
}
.cards > li { min-width: 0; overflow-wrap: anywhere; }
button:focus-visible, input:focus-visible {
  outline: 3px solid #365b9b;
  outline-offset: 3px;
}
```

## Research notes: Semantic HTML before custom interaction

```html
<label for="course-search">Find a course</label>
<input id="course-search" name="query" type="search">
<button type="button">Clear search</button>
<a href="/library">Browse all courses</a>
```
