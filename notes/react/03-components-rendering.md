---
id: react-components-rendering
title: Components JSX and the render cycle
track: react
order: 3
level: Foundation
minutes: 24
summary: Component tree, props, events, keys aur render-commit distinction ko understand karo.
tags: components, jsx, props, rendering, keys
visual: react-render
---

## Mental model

React component current props, state aur context se UI description calculate karta hai. Render ka matlab function call karke next UI calculate karna hai; commit ka matlab actual DOM changes apply karna hai. Har render ka DOM mutation hona necessary nahi. Component pure rakho taaki React calculation repeat ya discard kare to hidden side effects na hon.

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

Props parent se child tak data flow hain. Child props mutate nahi karta; action callback invoke karke parent ko intent batata hai. Handler pass karo, render ke time call mat karo: `onClick={handleClick}` correct hai, `onClick={handleClick()}` tabhi correct ho sakta hai jab expression intentionally function return kar raha ho.

JSX JavaScript syntax extension hai. Curly braces expressions evaluate karti hain; arbitrary statements directly JSX ke andar nahi aate. Component names capital letter se start hote hain. Adjacent elements ke liye wrapper ya Fragment use karo. Text automatically escaped hota hai, lekin raw HTML APIs use karne par trust boundary tumhari responsibility hai.

## Conditional rendering patterns

UI mein loading, empty aur error jaise states baar-baar conditionally render karni padti hain. Simple boolean condition ke saath `&&` convenient hai, lekin falsy numeric value ka dhyan rakhna padta hai:

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

`count > 0` explicit comparison hai, isliye zero hone par literal `0` render nahi hota. `{count && <strong>...}` likhte to `count` zero hone par `0` accidentally screen par dikh jaata, kyunki `0` falsy hote hue bhi valid renderable React child hai. Yehi pattern empty array (`items.length && ...`) aur empty string ke saath bhi repeat hota hai — condition ko explicit boolean mein convert karke rakho.

Branches zyada ho ya nested ternary unreadable lagne lage, to component ke top par early return likhna clearer hota hai:

```jsx
function TopicStatus({ topic }) {
  if (topic.status === "loading") return <Spinner />;
  if (topic.status === "error") return <ErrorBanner message={topic.error} />;
  if (!topic.data) return <p>No data yet.</p>;
  return <TopicDetails data={topic.data} />;
}
```

Early return se main JSX flat rehta hai aur har state ka intent alag line par explicit dikhta hai, jabki deeply nested ternary mein condition track karna mushkil ho jaata hai.

## Identity and state preservation

React same position, component type aur key ke basis par state identity decide karta hai. Key siblings ke beech unique aur stable honi chahiye. Reorderable list mein array index key se local input state wrong item ke saath attach ho sakti hai. Random key har render par remount kara sakti hai. Key child ke normal props mein available nahi hoti; id separately pass karo.

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

Agar `EditableRow` apna local `useState` rakhta hai — jaise draft text ya expanded/collapsed flag — aur list filter ya reorder hoti hai, to index-key wale version mein React purane index par mile hue naye item ko purani local state assign kar dega. User ko lagega ki uska typed text ya toggle kisi aur row mein chala gaya, jabki actual bug sirf key choice ka hai.

Development Strict Mode extra checks ke liye render aur effect setup/cleanup repeat kar sakta hai. Console mein duplicate log dekhkar production mein double network charge conclude mat karo. Side effects render mein karna underlying bug hai. Event handlers user interaction ke liye aur effects external synchronization ke liye use karo.

## Gotchas

- `0 && <Badge />` zero render kar sakta hai; explicit boolean condition likho, jaise `count > 0 && <Badge />`.
- Component ke andar new component function define karne se identity resets ho sakte hain — har render par naya function reference banta hai, isliye React usse "naya component type" samajh kar poori subtree remount kar sakta hai. Component declarations ko module ke top level par rakho.
- Custom component ko CSS class dene par usse actual DOM tak forward karna component ki responsibility hai; `className` prop silently drop ho sakti hai agar component use `<div className={className}>` tak spread nahi karta.
- Conditional UI ke loading, empty aur error cases separately design karo — sabko ek generic "no data" message mein merge karna user ko confuse karta hai ki request abhi chal rahi hai ya fail ho chuki hai.
- Array ya object ko directly JSX children ki tarah render karna (bina `.map` ke) either nothing dikhayega ya runtime warning dega; JSX ko primitive values (string/number) ya elements expect hoti hain.

## Where this shows up in a real app

Ek study-tracker app mein topic list drag-and-drop se reorder hoti hai, favorite star click se toggle hoti hai aur search filter list ko narrow karta hai. In teeno operations ke beech agar keys stable na ho, to favorite toggle wrong card par flip ho sakta hai ya search ke baad focus kisi aur input par chala jaayega. Isi wajah se production apps mein list keys ko database ke `_id`/`id` field se derive karna standard practice hai, array index se nahi — index sirf tab safe hai jab list kabhi reorder, filter ya insert/delete na ho.

## Practice

Topic cards ko list aur grid views mein show karo. Local favorite toggle add karo, list reorder karo aur verify karo ki stable keys correct item identity preserve karti hain. Ek dusra variant banao jisme index ko key banao aur dikhaao ki reorder ke baad favorite state kaise wrong card par chali jaati hai — dono versions compare karne se identity rule concrete ban jaata hai. Keyboard se saare controls operate karo.

## Interview questions

**Q. Virtual DOM always faster hai?** Universal guarantee nahi. React declarative updates manage karta hai; actual performance workload aur implementation par depend karti hai.

**Q. Props aur state mein difference?** Props parent-controlled input hain; state component ki retained memory hai. Dono ko render ke dauraan immutable snapshots ki tarah treat karo.

## Sources

[React thinking in React](https://react.dev/learn/thinking-in-react) component decomposition explain karta hai. [React preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state) identity rules ka reference hai.
