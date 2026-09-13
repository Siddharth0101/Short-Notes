---
id: react-jsx-props
title: First React component JSX and props
track: react
order: 1
level: Foundation
minutes: 12
summary: Start React after JavaScript functions arrays objects and browser basics.
tags: fundamentals, react, jsx, props
---

## Mental model

A React component describes UI from inputs. A function component receives props and returns elements expressed with JSX. JSX looks like HTML but is syntax used by the build tool to produce JavaScript element descriptions. Start in the existing React app: you do not need routing, Redux, effects or server-state caching for this lesson.

> **Core takeaway:** Props describe a component's input; rendering should not mutate that input.

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

LessonCard is capitalized so JSX treats it as a component rather than a browser tag. Curly braces evaluate JavaScript expressions. A text prop can be quoted; a numeric value uses braces. The same component definition receives different inputs for the two cards. It should not mutate those props while rendering.

## Read JSX as a tree

The outer main contains a heading and two component instances. A component returns one root element, or a fragment grouping several siblings without an extra DOM wrapper. Use className for CSS classes and close tags, including self-closing image or input elements. An event prop such as onClick receives a function, not the result of calling it during rendering.

Conditional expressions and mapping arrays are useful, but first make the static tree work. You have already studied JavaScript functions, objects and arrays in the prerequisite course. If destructuring in the parameter list is unfamiliar, revisit those notes before adding React-specific behavior. Component composition builds on ordinary function inputs rather than replacing JavaScript fundamentals.

## Practice

Add a third card without duplicating the article markup. Add a description prop and render it below the title. Then intentionally pass minutes as text and explain why the display may look the same while a later arithmetic operation behaves differently. Keep the example static; interactive retained state is the next lesson.

## Check before moving on

You should explain which component owns each prop and what the browser eventually renders. Next, use useState and event handlers to change what the component displays over time.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Create a `LessonTitle` component receiving `title` and `minutes`. Render two instances with different values. Where should a changed title come from?

> **Hint:** Treat props as read-only values supplied by the parent.

**Answer guide — compare after attempting:** `function LessonTitle({title, minutes}) { return <h2>{title} · {minutes} min</h2>; }` is a component excerpt for a React app. The parent passes new props when data changes. Assigning to a prop locally does not update the parent's data model.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[React your first component](https://react.dev/learn/your-first-component) and [passing props](https://react.dev/learn/passing-props-to-a-component) introduce these concepts.
