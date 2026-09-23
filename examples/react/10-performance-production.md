# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Load an optional feature on demand

```jsx
import { lazy, Suspense, useState } from "react";

const ProgressChart = lazy(() => import("./ProgressChart.jsx"));

export default function StudyStats() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section>
      <button onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}>
        {expanded ? "Hide analytics" : "Show analytics"}
      </button>
      {expanded && (
        <Suspense fallback={<p role="status">Loading analytics…</p>}>
          <ProgressChart />
        </Suspense>
      )}
    </section>
  );
}
```

## Memoization and responsiveness

```jsx
const TopicRow = memo(function TopicRow({ topic, onSelect }) {
  return (
    <li>
      <span>{topic.title}</span>
      <button onClick={() => onSelect(topic.id)}>Open</button>
    </li>
  );
});

function TopicList({ topics }) {
  // Galat: har render par naya inline function banti hai, isliye har
  // TopicRow ko naya `onSelect` prop milta hai aur memo ka benefit defeat ho jaata hai
  return (
    <ul>
      {topics.map(topic => (
        <TopicRow key={topic.id} topic={topic} onSelect={id => console.log(id)} />
      ))}
    </ul>
  );
}

function TopicListFixed({ topics }) {
  // Sahi: stable identity, useCallback se
  const handleSelect = useCallback(id => console.log(id), []);
  return (
    <ul>
      {topics.map(topic => (
        <TopicRow key={topic.id} topic={topic} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

```jsx
function TopicBrowser({ topics, query }) {
  const filtered = useMemo(
    () => topics.filter(topic => topic.title.toLowerCase().includes(query.toLowerCase())),
    [topics, query]
  );
  return <TopicList topics={filtered} />;
}
```

## Production habits and gotchas

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("shows an error when title is left blank", async () => {
  render(<GoalForm onSave={() => Promise.resolve()} />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: /save goal/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(/title required/i);
});
```
