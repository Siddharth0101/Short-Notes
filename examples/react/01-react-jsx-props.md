# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Compose a small screen

```jsx
function LessonCard({ title, minutes }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{minutes} minutes</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <h1>Today’s study</h1>
      <LessonCard title="Variables" minutes={15} />
      <LessonCard title="Functions" minutes={20} />
    </main>
  );
}
```

## Depth walkthrough — andar kya ho raha hai?

```jsx
function OpenLesson({ title, onOpen }) {
  return <button onClick={() => onOpen(title)}>Kholo: {title}</button>;
}
```
