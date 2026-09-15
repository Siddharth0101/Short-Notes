---
id: react-jsx-props
title: First React component JSX and props
track: react
order: 1
level: Foundation
minutes: 15
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

## Depth walkthrough — andar kya ho raha hai?

### Component call se screen tak teen boundaries

Parent `<LessonCard title="Loops" minutes={20} />` return karta hai. Yeh element description hai; direct browser DOM node create karne ka imperative command nahi. React component evaluate karke desired tree nikalta hai, phir commit mein required DOM changes apply karta hai. Browser pixels draw karta hai. Component function run hona, DOM change hona aur browser paint hona related but different events hain.

Props parent-owned input hain. Child `title = 'Other'` assign kare toh local binding badalti hai; parent ka source data update nahi hota. Nested prop object mutate kare toh shared data silently change ho sakta hai, isliye render purity break hoti hai. User action parent ko callback se communicate karo; next render new props deta hai.

```jsx
function OpenLesson({ title, onOpen }) {
  return <button onClick={() => onOpen(title)}>Kholo: {title}</button>;
}
```

Yeh component excerpt parent se function expect karta hai. Arrow click hone par onOpen call karti hai. `onClick={onOpen(title)}` render ke waqt call karega. **Practice:** Two buttons ke titles alag rakho, click par correct title receive ho. Unrelated parent render se action execute nahi honi chahiye. JSX event prop ko function dena isi contract ka part hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** `LessonTitle` ko title aur minutes props do. Do instances different values se render karo. Title badalne par nayi value kahan se aani chahiye?

> **Hint — chhota ishara:** Props parent se aane wali read-only values samjho.

**Answer guide — pehle khud karo, phir compare karo:** React app mein `function LessonTitle({title, minutes}) { return <h2>{title} · {minutes} min</h2>; }` component excerpt use karo. Data badlega toh parent new props bhejega. Local prop assignment parent ka data model update nahi karti.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[First React component](https://react.dev/learn/your-first-component) aur [props](https://react.dev/learn/passing-props-to-a-component) se concepts aur padho.
