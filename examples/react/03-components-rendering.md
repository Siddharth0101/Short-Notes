# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Build from a component tree

```jsx
function TopicCard({ topic, onSelect }) {
  return (
    <article>
      <h2>{topic.title}</h2>
      <p>{topic.minutes} min</p>
      <button onClick={() => onSelect(topic.id)}>Start reading</button>
    </article>
  );
}

export default function TopicList({ topics, onSelect }) {
  if (topics.length === 0) return <p>No topics found.</p>;
  return (
    <section aria-label="Study topics">
      {topics.map(topic => (
        <TopicCard key={topic.id} topic={topic} onSelect={onSelect} />
      ))}
    </section>
  );
}
```

## Conditional rendering patterns

```jsx
function CartBadge({ count }) {
  return (
    <span>
      Cart
      {count > 0 && <strong> ({count})</strong>}
    </span>
  );
}
```

```jsx
function TopicStatus({ topic }) {
  if (topic.status === "loading") return <Spinner />;
  if (topic.status === "error") return <ErrorBanner message={topic.error} />;
  if (!topic.data) return <p>No data yet.</p>;
  return <TopicDetails data={topic.data} />;
}
```

## Identity and state preservation

```jsx
// Galat: index key list reorder hone par local state ko wrong row se attach kar sakti hai
{items.map((item, index) => (
  <EditableRow key={index} item={item} />
))}

// Sahi: stable id row ki identity ko uski position se independent rakhta hai
{items.map(item => (
  <EditableRow key={item.id} item={item} />
))}
```
