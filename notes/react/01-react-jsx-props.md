---
id: react-jsx-props
title: First React component JSX and props
track: react
order: 1
level: Foundation
minutes: 12
summary: Props component ka input hain; rendering mein input mutate nahi karna chahiye.
tags: fundamentals, react, jsx, props
---

## Mental model — simple soch

React component inputs se UI describe karta hai. Function component props leta hai aur JSX mein elements return karta hai. JSX HTML jaisa dikhta hai, lekin build tool usse JavaScript element descriptions mein badalta hai. Existing React app se start karo; abhi routing, Redux, effects/cache ki need nahi.

> **Core takeaway:** Props component ka input hain; rendering mein input mutate nahi karna chahiye.

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

LessonCard capitalized hai taaki JSX use component samjhe, browser tag nahi. Braces JavaScript expressions evaluate karti hain; text quote, numeric value braces mein do. Same component different inputs se two cards banata hai. Render ke dauran props mutate mat karo.

## Read JSX as a tree

Outer main heading aur two instances contain karta hai. Component one root ya fragment return karta hai; fragment extra DOM wrapper ke bina siblings group karta hai. CSS ke liye className, tags properly close karo. onClick ko function do, render ke waqt us function ka called result nahi.

Pehle static tree sahi banao, phir conditions/array mapping add karo. Prerequisite JS mein functions/objects/arrays padhe hain. Parameter destructuring unclear ho toh revise karo. Composition ordinary inputs par build karti hai, JS fundamentals replace nahi karti.

## Practice

Article markup duplicate kiye bina third card add karo. Description prop title ke neeche render karo. Minutes text ke roop mein pass karke batao display same dikhkar bhi later arithmetic alag kyun hogi. Retained interactive state next lesson mein hai.

## Aage badhne se pehle check karo

Har prop ka owner aur final browser output explain karo. Next useState/event handlers se display time ke saath badlenge.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `LessonTitle` ko title aur minutes props do. Do instances different values se render karo. Title badalne par nayi value kahan se aani chahiye?

> **Hint:** Props parent se aane wali read-only values samjho.

**Answer guide — compare after attempting:** React app mein `function LessonTitle({title, minutes}) { return <h2>{title} · {minutes} min</h2>; }` component excerpt use karo. Data badlega toh parent new props bhejega. Local prop assignment parent ka data model update nahi karti.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[First React component](https://react.dev/learn/your-first-component) aur [props](https://react.dev/learn/passing-props-to-a-component) se concepts aur padho.
