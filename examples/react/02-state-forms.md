# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A controlled reading filter

```jsx
import { useState } from "react";

export default function ReadingFilter({ topics }) {
  const [query, setQuery] = useState("");
  const [onlyShort, setOnlyShort] = useState(false);
  const visible = topics.filter(topic =>
    topic.title.toLowerCase().includes(query.toLowerCase()) &&
    (!onlyShort || topic.minutes <= 15)
  );

  return (
    <>
      <label>
        Search
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={onlyShort}
          onChange={event => setOnlyShort(event.target.checked)} />
        Under 15 minutes
      </label>
      <p>{visible.length} topics</p>
    </>
  );
}
```

```jsx
// Galat: JSON.parse har render par chalta hai, chahe result use ho ya na ho
const [drafts, setDrafts] = useState(JSON.parse(localStorage.getItem("drafts")) ?? []);

// Sahi: initializer function sirf first render par call hoti hai
const [drafts, setDrafts] = useState(() => JSON.parse(localStorage.getItem("drafts")) ?? []);
```

## Updates that depend on previous state

```jsx
function QuantityStepper({ initial = 1 }) {
  const [quantity, setQuantity] = useState(initial);

  function handleFastDoubleClick() {
    // Rapid double-click par dono calls same stale `quantity` closure use kar sakte hain
    setQuantity(quantity + 1);
    setQuantity(quantity + 1); // Galat: net effect sirf +1 hoga, +2 nahi
  }

  function handleFastDoubleClickFixed() {
    setQuantity(previous => previous + 1);
    setQuantity(previous => previous + 1); // Sahi: har call queued previous value par chain hoti hai
  }

  return <button onClick={handleFastDoubleClickFixed}>Add two</button>;
}
```

```jsx
// Galat: push previous array ko mutate karta hai, React ko naya reference nahi milta
function addBookmarkBroken(topicId) {
  setBookmarks(previous => {
    previous.push(topicId);
    return previous; // same reference — React re-render skip kar sakta hai
  });
}

// Sahi: spread se naya array banta hai, previous state untouched rehti hai
function addBookmark(topicId) {
  setBookmarks(previous => [...previous, topicId]);
}
```

## Forms and state structure

```jsx
function GoalForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Title required hai");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    try {
      await onSave({ title });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={event => setTitle(event.target.value)}
          aria-describedby={errorMessage ? "title-error" : undefined} />
      </label>
      {errorMessage && <p id="title-error" role="alert">{errorMessage}</p>}
      <button disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save goal"}
      </button>
    </form>
  );
}
```

## Research notes: Represent coherent request states

```jsx
const [request, setRequest] = useState({ status: 'idle' });
const busy = request.status === 'loading';
// setRequest({ status: 'success', data });
// setRequest({ status: 'error', message });
```
