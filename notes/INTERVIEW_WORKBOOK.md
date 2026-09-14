# Interview checklist and answered workbook

283 questions are available in the app. This workbook maps the supplied HTML/CSS/JavaScript/React/Redux checklist to canonical questions and includes the additional backend, DSA, and design prompts. 104 questions were added; 21 existing questions are reused here, with expanded examples where needed. Repeated requests map to the same question instead of another card.

Use the app's **Interview topic** filter for HTML, CSS, JavaScript, React, Redux, Node.js, Java, Spring Boot, MongoDB, DSA, or system design. HTML/CSS stay attached to browser-foundation reading in the JavaScript course. Answers in the app remain hidden until revealed; this Markdown workbook is a readable offline reference. Code is original, and framework excerpts state their required context.

## Corrections and coverage limits

- Syntax/casing mistakes such as Console, SetTimeout, SetImmidiate, async fun, and mismatched promise brackets were repaired in the intended trace exercises; the answers explain that the original can fail before any intended output.
- Node timer ordering states its context; await does not turn a timer handle into a completion promise. ES modules permit top-level await.
- HTML AppCache is obsolete; a web app manifest does not implement offline caching. Heading ranks remain explicit.
- Position/display are CSS properties. React coverage focuses on function components and hooks; error boundaries and connect remain relevant integration concepts. No claim is made about what every employer asks.
- Answers and examples were written for this repository, not copied from the supplied interview sites/videos. The linked videos have not been represented as watched or transcribed. Primary links support further technical study.

### Supplied image exercises

Both public Drive image previews were inspected. The first exercises flex-direction; the second exercises align-content with wrapped lines. Both have dedicated questions and original code solutions below. The extra responsive-header/card exercise is independent of those images.

- [Requested flexbox image 1](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view) — covered by iq-added-flex-image-one.
- [Requested flexbox image 2](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view) — covered by iq-added-flex-image-two.

## Reused canonical questions

| Topic (repetitions merged) | Canonical question |
| --- | --- |
| let / var / const; hoisting (spelled hosting in the supplied list) | [iq-js-01](#iq-js-01) |
| closures with an original example | [iq-js-02](#iq-js-02) |
| arrow versus regular functions; this behavior | [iq-js-03](#iq-js-03) |
| loose and strict equality | [iq-js-05](#iq-js-05) |
| generator functions versus normal functions | [iq-js-13](#iq-js-13) |
| event delegation through bubbling | [iq-js-15](#iq-js-15) |
| function currying | [iq-js-16](#iq-js-16) |
| z-index purpose, stacking contexts, and best practices | [iq-lab-03](#iq-lab-03) |
| state snapshots | [iq-react-01](#iq-react-01) |
| stable keys and identity | [iq-react-02](#iq-react-02) |
| when effects are appropriate; side effects versus derived values | [iq-react-03](#iq-react-03) |
| controlled and uncontrolled components with code (repeated request) | [iq-react-05](#iq-react-05) |
| useCallback, useMemo, React.memo differences and performance example | [iq-react-06](#iq-react-06) |
| local state, Context, shared state, and context example | [iq-react-07](#iq-react-07) |
| pure functions and pure rendering | [iq-react-08](#iq-react-08) |
| error boundaries in a function-component application | [iq-react-11](#iq-react-11) |
| performance techniques for large tables | [iq-react-12](#iq-react-12) |
| custom hook with original implementation | [iq-react-13](#iq-react-13) |
| choosing reducer state versus separate local state | [iq-react-15](#iq-react-15) |
| MongoDB session expiry: reuse the existing TTL question | [iq-mongo-14](#iq-mongo-14) |
| Node export cancellation and partial-output behavior: reuse the existing streaming question | [iq-lab-14](#iq-lab-14) |

## HTML — question index

- [Are HTML tags and elements the same? How do attributes fit in?](#iq-added-html-elements)
- [What are void elements, and do they have closing tags?](#iq-added-html-void)
- [How do ordered, unordered, and description lists differ?](#iq-added-html-lists)
- [What is class, and how does it differ from id?](#iq-added-html-id-class)
- [How do strong and b differ, and how do em and i differ?](#iq-added-html-emphasis)
- [What belongs in head and body, and how do header, nav, main, aside, and footer shape a page?](#iq-added-html-document)
- [Can one web page be embedded in another?](#iq-added-html-iframe)
- [How does an anchor's href work, what do target values mean, and how is link different from a?](#iq-added-html-links)
- [When should scripts go in head or body, and how do defer, async, and modules change loading?](#iq-added-html-scripts)
- [How do HTML forms work, and which default behaviors matter?](#iq-added-html-forms)
- [How can HTML interactions be handled with JavaScript?](#iq-added-html-events)
- [What did HTML5 improve, and what were its major goals?](#iq-added-html-evolution)
- [How do audio and video work, and what do source and track add?](#iq-added-html-media)
- [What is the relationship between header and h1? Does HTML5 require an h1 inside every header?](#iq-added-html-headings)
- [What does native drag-and-drop provide, and how can an image be draggable?](#iq-added-html-drag)
- [How do CSS sizing, srcset/sizes, and picture make images responsive?](#iq-added-html-responsive-images)
- [What does an HTML5 manifest file mean today, and how is it different from AppCache?](#iq-added-html-manifest)
- [What are data attributes and how are they accessed?](#iq-added-html-data)
- [What is Shadow DOM? Give an original example and explain its limits.](#iq-added-html-shadow-dom)

## CSS — question index

- [A dropdown has z-index 999999 but remains behind another panel. How do you debug it?](#iq-lab-03)
- [How do inline, block, inline-block, flex, and grid display differ?](#iq-added-css-display)
- [How do static, relative, absolute, fixed, and sticky positioning differ?](#iq-added-css-position)
- [How do display:none, visibility:hidden, and opacity:0 differ?](#iq-added-css-hidden)
- [What is a stylesheet, and what are the three common ways to apply CSS in HTML?](#iq-added-css-stylesheets)
- [What is CSS specificity, and where does !important fit in the cascade?](#iq-added-css-specificity)
- [What is the CSS box model, and how does box-sizing change width?](#iq-added-css-box)
- [How do you center a block inside another element or in the viewport?](#iq-added-css-center)
- [How can borders create a CSS triangle?](#iq-added-css-triangle)
- [What are pseudo-elements, and how do they differ from pseudo-classes?](#iq-added-css-pseudo)
- [What are the main flexbox container and item properties?](#iq-added-css-flex)
- [Build a responsive header and an equal-width card row with flexbox.](#iq-added-css-flex-lab)
- [What are vh and vw, and when do dynamic viewport units help?](#iq-added-css-viewport)
- [Which property selects the font face, and when should float be used?](#iq-added-css-fonts-float)
- [What do div, p; div p; div ~ p; div + p; and div > p select?](#iq-added-css-selectors)
- [How do CSS2 and CSS3 differ? Is CSS3 one current version?](#iq-added-css-evolution)
- [How would you optimize website asset loading without breaking the experience?](#iq-added-css-assets)
- [Recreate the four flex-direction layouts in the first supplied image.](#iq-added-flex-image-one)
- [Recreate the five wrapped-row align-content layouts in the second supplied image.](#iq-added-flex-image-two)

## JavaScript — question index

- [How do var, let, and const differ?](#iq-js-01)
- [What is a closure and where is it useful?](#iq-js-02)
- [How is this determined for regular and arrow functions?](#iq-js-03)
- [How do ==, ===, and Object.is differ?](#iq-js-05)
- [What is a generator function and when is it useful?](#iq-js-13)
- [How does event delegation work and why use it?](#iq-js-15)
- [What is currying and how would you implement it?](#iq-js-16)
- [What does a let loop with six delayed callbacks print? What if sample is never called?](#iq-added-js-loop-output)
- [A timer logs a after two seconds and synchronous code logs b. How can a precede b without another timer?](#iq-added-js-timer-order)
- [What are promises, what are their three states, and how do they compare with callbacks?](#iq-added-js-promise-basics)
- [What is printed when a promise rejects with an object containing msg?](#iq-added-js-rejection-output)
- [After await delay(6000), a ten-second timer is scheduled and second is logged. What is the timeline?](#iq-added-js-delay-output)
- [Why does await setTimeout not wait for the callback, and how do you repair the a/b/c/d/e example?](#iq-added-js-await-timers)
- [What is callback hell, and when do async/await improve the design?](#iq-added-js-callback-hell)
- [How do forEach, map, filter, and reduce differ?](#iq-added-js-array-methods)
- [How can you count an object's properties and print values without keys?](#iq-added-js-object-enumeration)
- [What does typeof return for an array, and how do you reliably detect arrays?](#iq-added-js-array-check)
- [Explain ten ES2015 features with original examples, without mixing in later additions.](#iq-added-js-es6)
- [What is a function definition, and how do declarations, expressions, anonymous functions, and higher-order functions differ?](#iq-added-js-function-forms)
- [What is an IIFE, and when can one still be useful?](#iq-added-js-iife)
- [What is memoization? Implement it and explain when the cache is wrong.](#iq-added-js-memoization)
- [When should you use call, apply, or bind?](#iq-added-js-call-apply-bind)
- [What are three common ways to create objects, and what do prototype methods do?](#iq-added-js-create-objects)
- [What is method chaining, and how is it different from a prototype chain?](#iq-added-js-method-chaining)
- [Does JavaScript pass objects by reference? Show mutation versus reassignment.](#iq-added-js-pass-values)
- [How do null, undefined, NaN, and JavaScript value types differ?](#iq-added-js-null-types)
- [What are escape sequences, and why are they used?](#iq-added-js-escape)
- [How do break and continue differ?](#iq-added-js-break-continue)
- [How do capturing, bubbling, preventDefault, and stopPropagation differ?](#iq-added-js-event-phases)
- [When should you use localStorage, sessionStorage, IndexedDB, cookies, or an in-memory value?](#iq-added-js-browser-storage)
- [What are Web Workers, and how do they communicate with the page?](#iq-added-js-workers)
- [When would you choose Axios over fetch or Node HTTP clients?](#iq-added-js-axios)

## React — question index

- [What does it mean that React state is a snapshot?](#iq-react-01)
- [Why are stable keys important in lists?](#iq-react-02)
- [When is useEffect appropriate?](#iq-react-03)
- [How do controlled and uncontrolled inputs differ?](#iq-react-05)
- [When do memo, useMemo, and useCallback help?](#iq-react-06)
- [How should you choose between local state, Context, and a store?](#iq-react-07)
- [Why must render logic be pure?](#iq-react-08)
- [What can an error boundary catch?](#iq-react-11)
- [How would you make a 50,000-row table responsive?](#iq-react-12)
- [What makes a custom hook actually reusable?](#iq-react-13)
- [When does useReducer read better than several useState calls?](#iq-react-15)
- [What is React, how does a library differ from a framework, and when does React help over vanilla JavaScript?](#iq-added-react-library)
- [What is JSX, how does it run, why use className, and what does Babel do?](#iq-added-react-jsx-babel)
- [How do props differ from state, and what is the children prop?](#iq-added-react-props-children)
- [What are fragments, and what DOM element do they add?](#iq-added-react-fragments)
- [What does useState accept and return, and when should a value be state rather than a normal variable?](#iq-added-react-usestate)
- [How do parent-to-child, child-to-parent, and sibling communication work?](#iq-added-react-communication)
- [What are DOM, virtual DOM, reconciliation, render, and commit? When is a function component's return evaluated?](#iq-added-react-render-lifecycle)
- [When does a function component rerender, and what are its mount/update/unmount phases?](#iq-added-react-rerender-triggers)
- [What are Hooks, how do they differ from ordinary functions, and what are their rules?](#iq-added-react-hook-rules)
- [What are useEffect's two arguments, what can it return, and when does cleanup run?](#iq-added-react-effect-contract)
- [What are common ways to style React components, and what tradeoffs do they have?](#iq-added-react-styling)
- [What is a higher-order component, and how does it compare with a custom hook?](#iq-added-react-hoc)
- [What does React Router provide, and how should sibling routes share data?](#iq-added-react-router)

## Redux — question index

- [What are Redux and Flux, and is Redux always better than Context or limited to React?](#iq-added-redux-purpose)
- [What are Redux actions and reducers? Show initial state and a state transition.](#iq-added-redux-actions-reducers)
- [What is the typical React/Redux data flow, and where should side effects go?](#iq-added-redux-flow)
- [What methods does a Redux store expose, and when are they useful?](#iq-added-redux-store-api)
- [What does React Redux connect do, and how do modern hooks compare?](#iq-added-redux-connect)
- [How can code outside a React component access Redux state safely?](#iq-added-redux-outside)
- [What is Redux middleware? Show an example without putting asynchronous work in a reducer.](#iq-added-redux-middleware)

## Node.js — question index

- [How would you export a large MongoDB result through Node without buffering it all?](#iq-lab-14)
- [What is process.nextTick, and how does it differ from setImmediate?](#iq-added-node-nexttick)
- [What is the order of setImmediate, setTimeout(0), and synchronous logging in Node?](#iq-added-node-immediate-output)

## Java — question index

- [How do Comparable and Comparator differ, and how do you make ordering deterministic?](#iq-added-java-comparable)
- [Why are Strings immutable, and when should StringBuilder be used?](#iq-added-java-string-immutability)

## Spring Boot — question index

- [How do constructor injection, component scanning, and explicit Bean definitions differ?](#iq-added-spring-di)
- [What does Spring Boot auto-configuration do, and how do you debug an unexpected bean?](#iq-added-spring-autoconfig)
- [How would you validate a REST request and return consistent errors in Spring?](#iq-added-spring-validation)
- [What is JPA's N+1 query problem, and how do you fix it without breaking pagination?](#iq-added-spring-nplusone)
- [How do optimistic and pessimistic locking differ for competing updates?](#iq-added-spring-locking)
- [When should you use a unit test, MVC slice, repository test, or full Spring integration test?](#iq-added-spring-test-scope)

## MongoDB — question index

- [How would you auto-expire old session documents?](#iq-mongo-14)

## DSA — question index

- [How do you merge overlapping intervals, and what must the boundary contract specify?](#iq-added-dsa-intervals)
- [How do prefix frequencies count target-sum subarrays with negative numbers?](#iq-added-dsa-prefix-count)
- [When would you choose a trie for prefix search rather than a hash set?](#iq-added-dsa-trie)
- [Design an LRU cache with expected O(1) get and put. What invariants matter?](#iq-added-dsa-lru)
- [Why can Dijkstra's priority queue contain stale entries, and how should they be handled?](#iq-added-dsa-dijkstra-heap)
- [How can a DP return the chosen solution as well as its optimal value?](#iq-added-dsa-dp-reconstruction)

## System design — question index

- [Design a URL shortener with collision handling and abuse controls.](#iq-added-design-url-shortener)
- [Design resumable uploads for large files without routing every byte through the application server.](#iq-added-design-upload)
- [Design email/push notifications with preferences, retries, and deduplication.](#iq-added-design-notifications)
- [How do RPO and RTO shape backup and disaster recovery design?](#iq-added-design-disaster-recovery)
- [How can a delayed cache fill resurrect stale data after invalidation?](#iq-added-design-cache-version)
- [How do you isolate tenants across databases, caches, queues, and observability?](#iq-added-design-multitenancy)

## Answers and follow-ups

Attempt the prompt first. Compare the mechanism and edge cases, not only the final words.

## iq-js-01

**How do var, let, and const differ?**

Foundation · JavaScript

**Answer**

var function-scoped hota hai, jabki let aur const block-scoped hote hain. let/const declaration se initialization tak temporal dead zone mein rehte hain; const binding ko reassign nahi kar sakte, lekin bound object mutate ho sakta hai.

Hoisting describes observable declaration behavior, not physical movement of source code. A var binding is initialized to undefined before execution reaches its declaration; let/const remain uninitialized until evaluated. Function declarations and function expressions also differ.

```js
console.log(score); // undefined
var score = 2;
{ const lesson = {done:false}; lesson.done = true; }
// Reading a let/const binding before its initialization throws ReferenceError.
```

**Follow-up:** Why does a var loop capture the final index in delayed callbacks?

## iq-js-02

**What is a closure and where is it useful?**

Foundation · JavaScript

**Answer**

Closure function ko uske lexical environment ke bindings access karne deta hai, even jab outer function return ho chuka ho. Private counters, callbacks aur function factories mein useful hai; captured bindings live hote hain, automatically frozen copies nahi.

```js
function makeTracker() {
  let minutes = 0;
  return amount => (minutes += amount);
}
const a = makeTracker(), b = makeTracker();
console.log(a(5), a(3), b(2)); // 5, 8, 2
```

Each factory call owns a separate binding. The first closure remembers the updated total; it does not hold a frozen copy of zero.

**Follow-up:** How could a closure retain more memory than expected?

## iq-js-03

**How is this determined for regular and arrow functions?**

Intermediate · JavaScript

**Answer**

Regular function ka this call-site se decide hota hai: object method call, explicit call/apply/bind, constructor call, ya plain call. Arrow function apna this create nahi karta; surrounding lexical scope ka this use karta hai, isliye bind se uska this replace nahi hota.

```js
const lesson = {
  minutes: 12,
  callbacks() {
    return {normal: function () { return this.minutes; }, arrow: () => this.minutes};
  }
};
const callbacks = lesson.callbacks();
console.log(callbacks.normal.call({minutes:99})); // 99
console.log(callbacks.arrow.call({minutes:99})); // 12
```

Arrows also have no own arguments binding and cannot be called with new. Regular functions are appropriate when the receiver should come from the invocation.

**Follow-up:** What happens when an object method is passed directly to setTimeout?

## iq-js-05

**How do ==, ===, and Object.is differ?**

Foundation · JavaScript

**Answer**

== comparison se pehle type coercion kar sakta hai, jabki === alag types ko unequal maanta hai. Object.is mostly strict equality jaisa hai, lekin NaN ko khud ke equal aur +0/-0 ko different maanta hai; objects ke liye ye bhi identity compare karta hai.

**Follow-up:** Why are two separately created empty objects not strictly equal?

## iq-js-13

**What is a generator function and when is it useful?**

Intermediate · JavaScript

**Answer**

function* body ko pause/resume karne deta hai; yield par control caller ko return hota hai aur next() call par execution wahi se resume hota hai. Lazy sequences, custom iterables aur large/infinite data ko chunk-by-chunk produce karne ke liye useful hai, bina pura result upfront array mein banaye.

```js
function* lessonIds() { yield 10; yield 20; return 30; }
const ids = lessonIds();
console.log(ids.next()); // {value:10, done:false}
console.log(ids.next()); // {value:20, done:false}
console.log(ids.next()); // {value:30, done:true}
```

Calling the generator creates an iterator without running its body immediately. next resumes it up to yield/return. A for...of loop consumes yielded values but not the final return value. This is not automatically parallel or asynchronous execution.

**Follow-up:** How does an async generator differ from a regular generator?

## iq-js-15

**How does event delegation work and why use it?**

Intermediate · JavaScript

**Answer**

Event bubbling ki wajah se parent ek listener attach karke child elements ke events bhi handle kar sakta hai; event.target actual clicked element batata hai. Dynamic ya large list mein har item par separate listener attach karne ke bajaye ek delegated listener memory aur setup cost dono kam karta hai.

**Follow-up:** How would you stop delegation from reacting to clicks inside a nested widget?

## iq-js-16

**What is currying and how would you implement it?**

Advanced · JavaScript

**Answer**

Currying ek multi-argument function ko chain of single-argument functions mein transform karta hai: add(a)(b)(c). Partial application se reusable specialized functions banti hain, jaise ek fixed discount rate wala pricing function. Closure har call ke previously supplied arguments retain karta hai jab tak final call na aaye.

```js
const addMinutes = base => extra => base + extra;
const afterMorning = addMinutes(25);
console.log(afterMorning(10)); // 35
```

The two calls capture base and then supply extra. Currying organizes arguments into single-argument steps; partial application fixes some arguments, and is not necessarily the same transformation.

**Follow-up:** How would you write a curry helper that also accepts multiple arguments at once?

## iq-lab-03

**A dropdown has z-index 999999 but remains behind another panel. How do you debug it?**

Advanced · CSS

**Answer**

Inspect ancestor stacking contexts first. The dropdown can only compete inside its context, and a sibling ancestor context may sit above the entire subtree. Look for positioned z-index, transforms, opacity and other context creators. Move the overlay to a deliberate top-level layer or use an appropriate platform primitive; then verify clipping, focus and positioning rather than only increasing the number.

Z-index controls stack level within stacking contexts; it is useful for overlays, menus, sticky headers, and layered cards. It is not one global priority number. Positioned elements with non-auto z-index, opacity below 1, transforms, and other features can create contexts; flex/grid items can use z-index without being positioned.

```css
.panel { position: relative; z-index: 1; }
.menu { position: absolute; z-index: 100; }
.neighbor { position: relative; z-index: 2; }
```

A menu inside panel cannot simply outbid neighbor from its ancestor's lower context. Use a documented layer scale, inspect ancestors, and use an appropriate portal/top-layer primitive when warranted rather than escalating arbitrary numbers.

**Follow-up:** Why might overflow clipping remain even after changing stacking order?

## iq-react-01

**What does it mean that React state is a snapshot?**

Foundation · React

**Answer**

Har render ko us waqt ka state milta hai aur us render ke handlers wahi values capture karte hain. setState future render request karta hai; current handler ke local state variable ko turant replace nahi karta.

**Follow-up:** Why can three setCount(count + 1) calls increment only once?

## iq-react-02

**Why are stable keys important in lists?**

Foundation · React

**Answer**

Keys React ko siblings ke beech identity track karne mein help karte hain, taaki reorder ke baad correct state preserve ho. Array index dynamic insert/delete/reorder mein wrong identity map kar sakta hai; render ke waqt random key banana har baar remount kara sakta hai.

**Follow-up:** When can changing a key intentionally reset a form?

## iq-react-03

**When is useEffect appropriate?**

Intermediate · React

**Answer**

Effect component ko external systems, jaise subscription, browser API ya network synchronization, se sync karta hai. Render se calculate hone wali value ko usually directly derive karo; effect dependencies mein reactive inputs include karo aur setup ka matching cleanup do.

**Follow-up:** How would you remove an effect that only copies props into state?

## iq-react-05

**How do controlled and uncontrolled inputs differ?**

Foundation · React

**Answer**

Controlled input ki value React state se aati hai aur onChange us state ko update karta hai. Uncontrolled input apni current value DOM mein rakhta hai aur defaultValue ya ref se access hota hai; ek input ko lifecycle ke beech modes switch karne se avoid karo.

```jsx
import {useRef, useState} from 'react';
function Controlled() {
  const [name, setName] = useState('');
  return <input aria-label="Controlled name" value={name} onChange={e => setName(e.target.value)}/>;
}
function Uncontrolled() {
  const input = useRef(null);
  return <form onSubmit={e => {e.preventDefault(); console.log(input.current.value);}}>
    <input aria-label="Uncontrolled name" ref={input} defaultValue="Learner"/><button>Read</button>
  </form>;
}
```

A controlled value must be kept consistent with its change handler. defaultValue sets the initial uncontrolled value; subsequent typing belongs to the DOM. Avoid switching one input between modes.

**Follow-up:** Which approach would you choose for a large form and why?

## iq-react-06

**When do memo, useMemo, and useCallback help?**

Intermediate · React

**Answer**

memo unchanged props par component rendering skip karne ka optimization deta hai; useMemo calculation result aur useCallback function identity cache karta hai. Ye correctness tools nahi hain: actual rendering cost profile karo, aur unstable object props ya context updates se cache benefit disappear ho sakta hai.

```jsx
import {memo, useCallback, useMemo, useState} from 'react';
const Results = memo(function Results({items, onChoose}) {
  return <ul>{items.map(x => <li key={x.id}><button onClick={() => onChoose(x.id)}>{x.title}</button></li>)}</ul>;
});
function Search({items, query}) {
  const [selected, setSelected] = useState(null);
  const visible = useMemo(() => items.filter(x => x.title.includes(query)), [items, query]);
  const choose = useCallback(id => setSelected(id), []);
  return <><Results items={visible} onChoose={choose}/><p>{selected}</p></>;
}
```

UseMemo caches a calculated result; useCallback caches a function identity; memo can skip parent-driven component rendering when props compare equal. Stable identity alone is not correctness. Measure the relevant workload; state/context updates and unstable inputs can still cause work. Compiler-enabled builds may reduce the need for manual memoization.

**Follow-up:** What overhead or readability cost can excessive memoization introduce?

## iq-react-07

**How should you choose between local state, Context, and a store?**

Intermediate · React

**Answer**

State ko pehle closest owner ke paas rakho; shared consumers ke liye lift karo aur widely needed values ke liye Context consider karo. Frequent granular updates, selectors ya complex cross-feature workflows ke liye store useful ho sakta hai; server cache ko client-only UI state ke saath blindly mix mat karo.

```jsx
import {createContext, useContext, useState} from 'react';
const ThemeContext = createContext('light');
function Label() { return <p>{useContext(ThemeContext)}</p>; }
function App() {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}><button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle</button><Label/></ThemeContext.Provider>;
}
```

Consumers read the nearest provider. Context distributes the value and reacts when it changes; it does not prescribe reducers, middleware, or server-cache policy. Composition can often remove prop drilling before introducing another shared-state mechanism.

**Follow-up:** Why can a changing provider value trigger many consumers?

## iq-react-08

**Why must render logic be pure?**

Intermediate · React

**Answer**

React rendering work ko repeat, interrupt ya discard kar sakta hai, isliye render ke andar external mutations predictable nahi rehte. Same props/state se same UI description banao; user-triggered side effects handlers mein aur synchronization effects mein rakho.

**Follow-up:** Why is pushing into a prop array during render dangerous?

## iq-react-11

**What can an error boundary catch?**

Intermediate · React

**Answer**

Error boundary apne descendant tree ke rendering-related errors ko fallback UI se contain karta hai. Ordinary event-handler exceptions aur arbitrary asynchronous callback errors automatically catch nahi hote; un flows mein explicit error handling chahiye.

Use a boundary around a recoverable region so a failed render can show fallback UI. For function-component applications, a maintained boundary wrapper or the framework's route-error facility can avoid writing a class in feature code. Ordinary event-handler failures and unrelated async callbacks need their own handling; boundaries do not catch every promise rejection. Error-boundary behavior remains relevant even in a hooks-first codebase. Define reset/retry behavior and log useful diagnostic context without exposing private data.

**Follow-up:** Where would you place boundaries in a multi-panel dashboard?

## iq-react-12

**How would you make a 50,000-row table responsive?**

Advanced · React

**Answer**

Pehle measure karo ki bottleneck network, computation, DOM size ya rerenders hai. Server pagination/filtering, row virtualization, stable row identity aur expensive work ka caching/worker execution combine kar sakte ho; keyboard navigation, focus aur screen-reader behavior ko virtualized design mein verify karo.

**Follow-up:** How would variable row heights change virtualization?

## iq-react-13

**What makes a custom hook actually reusable?**

Intermediate · React

**Answer**

Custom hook stateful logic ko component se extract karta hai, lekin har calling component apna independent state instance get karta hai — koi shared state automatically nahi banta. Reusable hook clear contract expose karta hai (kya input leta hai, kya return karta hai), aur internal dependencies/cleanup khud manage karta hai.

```jsx
import {useEffect, useState} from 'react';
function useOnline() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener('online', sync); window.addEventListener('offline', sync);
    return () => {window.removeEventListener('online', sync); window.removeEventListener('offline', sync);};
  }, []);
  return online;
}
```

This client-oriented hook shares behavior, not one global state cell. navigator.onLine is only a connectivity hint, not proof that your API is reachable; server-rendered hydration needs a deliberately consistent initial snapshot.

**Follow-up:** Why do two components using the same custom hook not share its state?

## iq-react-15

**When does useReducer read better than several useState calls?**

Intermediate · React

**Answer**

Jab next state previous state aur ek action dono par depend karta hai, ya multiple related fields ek saath consistently update hone chahiye, reducer ek single predictable transition function mein woh logic centralize karta hai. Independent, unrelated pieces of state ke liye separate useState usually simpler rehta hai.

**Follow-up:** How would you test a reducer function without rendering any component?

## iq-mongo-14

**How would you auto-expire old session documents?**

Intermediate · MongoDB

**Answer**

TTL index (`expireAfterSeconds`) ek date field par set karke MongoDB background process periodically expired documents delete kar deta hai. Yeh exact-second precision guarantee nahi karta (background sweep interval-based hai), isliye strict expiry-time enforcement application logic mein bhi verify karo, sirf TTL par depend mat karo.

Additional failure check: TTL deletion is asynchronous, so an expired document can remain present after its logical expiry. Use the expiry timestamp in the authorization/query contract to reject expired sessions immediately; TTL is cleanup. Test the boundary while the expired document still exists. Define clock handling and renewal rules explicitly. Treat storage cleanup, authentication validity, and token expiry as related but separate concerns rather than making correctness depend on the background deletion schedule.

**Follow-up:** Why might a document briefly remain readable a little past its TTL expiry time?

## iq-lab-14

**How would you export a large MongoDB result through Node without buffering it all?**

Advanced · Node.js

**Answer**

Read incrementally from a database cursor and write through a backpressure-aware pipeline. Avoid toArray or building the entire CSV string first. Close the cursor and streams on errors and client disconnect, enforce authorization and export limits, and decide how partial output is handled. Streaming bounds buffering within cooperating stages; it does not remove the need for admission control.

Additional failure check: Streaming limits buffering, but only if producers respect backpressure. A pipeline coordinates transfer and error propagation/cleanup across streams. On client disconnect, stop the database cursor and owned downstream work instead of continuing a full export nobody can receive. If headers have already been sent, a later error cannot be converted into an ordinary JSON error response without corrupting the format. Define partial-download behavior and make retries explicit. Observe memory, cursor lifetime, and cancellation under slow or disconnected consumers.

**Follow-up:** How would you verify that a slow client does not cause unbounded memory growth?

## iq-added-html-elements

**Are HTML tags and elements the same? How do attributes fit in?**

Foundation · HTML

**Answer**

A tag is markup syntax such as `<p>` or `</p>`. An element is the document structure represented by that markup, including its content and attributes. Attributes configure an element or provide metadata; they are written on its start tag.

```html
<p class="summary" lang="en">Study one concept.</p>
```

Here `p` is the element type, the two tags delimit it, and class/lang are attributes. DOM properties are a related runtime interface, not always an exact reflection of markup attributes.

**Follow-up:** How do an input's value attribute and its current value property differ after typing?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-void

**What are void elements, and do they have closing tags?**

Foundation · HTML

**Answer**

Void HTML elements cannot contain child content and must not have end tags. Examples include `img`, `input`, `br`, `hr`, `meta`, `link`, `source`, `track`, `area`, `base`, `col`, `embed`, and `wbr`.

```html
<img src="lesson.webp" alt="A learner drawing a graph">
<input name="email" type="email">
```

The slash in `<img />` does not give HTML a general self-closing-element mechanism. A non-void `<div />` does not behave like a closed div in HTML parsing.

**Follow-up:** Why can using `<script />` break the rest of an HTML document?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-lists

**How do ordered, unordered, and description lists differ?**

Foundation · HTML

**Answer**

Use `ol` when sequence or ranking matters, `ul` when order is not the meaning, and `dl` for name/value or term/description groups. Styling bullets away does not remove list semantics.

```html
<ol><li>Read</li><li>Practice</li></ol>
<ul><li>Java</li><li>React</li></ul>
<dl><dt>Closure</dt><dd>A function with access to lexical bindings.</dd></dl>
```

Use li inside ol/ul; dl uses dt and dd. Multiple terms or descriptions can belong to a group where meaningful.

**Follow-up:** Would a navigation menu require an ordered list merely because its links appear in a row?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-id-class

**What is class, and how does it differ from id?**

Foundation · HTML

**Answer**

A class is a reusable space-separated token used for styling or selection; an element can have several. An id identifies one element within a document and should be unique there. IDs also support fragment navigation and label relationships.

```html
<label for="course-search">Find a course</label>
<input id="course-search" class="field field-wide">
```

CSS uses `.field` for class selection and `#course-search` for the ID. Avoid styling everything with IDs because that increases specificity and makes reuse harder.

**Follow-up:** What breaks if two inputs have the same ID referenced by a label?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-emphasis

**How do strong and b differ, and how do em and i differ?**

Foundation · HTML

**Answer**

`strong` marks importance, seriousness, or urgency; `b` draws attention without that extra importance. `em` expresses stress emphasis, while `i` marks text in an alternate voice or convention, such as a technical term. Browser bold/italic defaults are presentation, not their definitions.

```html
<p><strong>Save your draft before resetting.</strong></p>
<p>I asked for <em>one</em> example.</p>
<p>The term <i>lexical scope</i> describes lookup by source nesting.</p>
```

Use CSS when the requirement is purely visual.

**Follow-up:** How can moving em within a sentence change its meaning without changing any words?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-document

**What belongs in head and body, and how do header, nav, main, aside, and footer shape a page?**

Foundation · HTML

**Answer**

`head` contains document metadata such as title, charset, stylesheet links, and suitable scripts. `body` contains page content. A body-level header typically introduces the site/page; nav groups major navigation; main contains the dominant content; aside holds tangential content; footer contains closing information. Article is independently meaningful content; section is a thematic grouping, usually with a heading.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Notes</title></head>
<body><header><h1>Study notes</h1></header><nav aria-label="Main"><a href="/">Home</a></nav><main><article><h2>Closures</h2><p>One concept...</p></article></main><footer>About this collection</footer></body></html>
```

These elements do not prescribe pixel positions; CSS controls layout.

**Follow-up:** When could an article contain its own header and footer?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-iframe

**Can one web page be embedded in another?**

Intermediate · HTML

**Answer**

An iframe embeds another browsing context. Give it a descriptive title and a deliberately limited permission/sandbox policy. The embedded server can refuse framing through its security headers, and cross-origin rules normally prevent arbitrary access to its DOM.

```html
<iframe src="/demo.html" title="Binary search demonstration" loading="lazy"></iframe>
```

For cross-origin cooperation, use a carefully checked postMessage contract rather than trying to bypass isolation. An iframe is heavier than an ordinary component.

**Follow-up:** Which checks should a message receiver perform on origin and payload?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-links

**How does an anchor's href work, what do target values mean, and how is link different from a?**

Foundation · HTML

**Answer**

An anchor creates a navigable hyperlink through href. `_self` uses the current context, `_blank` opens a new context, `_parent` uses the parent, and `_top` uses the top-level context; a named target can reuse a named context. A `link` element describes a resource relationship, such as a stylesheet, and is usually placed in head.

```html
<link rel="stylesheet" href="/styles.css">
<a href="/notes" target="_blank" rel="noopener">Open notes</a>
<a href="#practice">Jump to practice</a>
```

Use a button for an action without navigation. Consider whether a new tab is actually helpful.

**Follow-up:** Why is href="#" a poor substitute for a real button action?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-scripts

**When should scripts go in head or body, and how do defer, async, and modules change loading?**

Intermediate · HTML

**Answer**

A classic external script without async/defer blocks parsing where encountered. Moving it near the end of body lets earlier markup parse first. Head plus defer downloads in parallel and executes deferred classic scripts after parsing in document order, before DOMContentLoaded. Async executes when ready, so dependencies cannot rely on document order. Module scripts are deferred by default unless async changes scheduling.

```html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
```

Use async for genuinely independent work; avoid loading the same application through both examples.

**Follow-up:** Why can an async script fail when it immediately queries an element later in the document?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-forms

**How do HTML forms work, and which default behaviors matter?**

Foundation · HTML

**Answer**

A form submits successful named controls to its action URL; method defaults to GET, and an omitted action targets the current document. A button inside a form defaults to submit unless its type says otherwise. Browser validation can stop invalid submission; disabled controls are not submitted. An Enter key can trigger implicit submission depending on the controls.

```html
<form action="/search" method="get">
  <label for="q">Search</label><input id="q" name="q" required>
  <button type="submit">Find</button>
  <button type="button">Show help</button>
</form>
```

A client submit handler can call preventDefault to implement an alternative flow; server validation remains necessary.

**Follow-up:** Why would removing name from the input make the submitted query disappear?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-events

**How can HTML interactions be handled with JavaScript?**

Foundation · HTML

**Answer**

Inline event attributes exist, but addEventListener usually separates behavior cleanly, allows multiple listeners, and supports explicit cleanup. Use the event object to inspect the action; prefer semantic controls.

```html
<button id="practice" type="button">Practice</button>
<script>
const button = document.querySelector('#practice');
const start = () => console.log('Starting a round');
button.addEventListener('click', start);
// On teardown: button.removeEventListener('click', start);
</script>
```

Register after the element exists. Use the same function identity when removing a listener.

**Follow-up:** Why does removeEventListener with a freshly created arrow function not remove this listener?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-evolution

**What did HTML5 improve, and what were its major goals?**

Foundation · HTML

**Answer**

The HTML5 effort standardized interoperable parsing and web-application features while keeping compatibility with existing web content. Semantic landmarks, native audio/video, richer form controls, and canvas reduced reliance on custom markup or plugins. Modern HTML continues as a Living Standard; it is not a frozen list of new tags. Browser capabilities such as storage and workers belong to the broader web platform and should not all be described as HTML tags. Choose features for accessibility and behavior, then verify support for your audience.

**Follow-up:** Why is saying that HTML5 replaced JavaScript an incorrect conclusion?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-media

**How do audio and video work, and what do source and track add?**

Foundation · HTML

**Answer**

Audio/video provide native playback; source offers candidate formats, and track supplies timed text such as captions through WebVTT. Controls expose playback UI. Autoplay is restricted by browser policy, so it is not a reliable prerequisite for understanding a page.

```html
<video controls preload="metadata" poster="preview.webp">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson-en.vtt" srclang="en" label="English" default>
  <a href="lesson.mp4">Download the lesson</a>
</video>
```

Provide meaningful captions/transcripts and consider network cost. Audio uses the same source-selection idea without visual frames.

**Follow-up:** Why does a fallback paragraph inside video not replace the need for captions?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-headings

**What is the relationship between header and h1? Does HTML5 require an h1 inside every header?**

Foundation · HTML

**Answer**

Header groups introductory content; h1 is a heading rank. They are independent concepts: a header may include a logo, navigation, or heading, and an h1 does not require a header parent. Do not rely on the old proposed automatic section-outline algorithm to reinterpret multiple h1 elements. Use a clear top-level page heading and explicit h2/h3 hierarchy for subsections.

```html
<header><h1>Java revision</h1><p>Practice by topic</p></header>
<main><section><h2>Collections</h2><h3>Hash maps</h3></section></main>
```

**Follow-up:** How would you verify that heading navigation makes sense without looking at font sizes?

[Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)

## iq-added-html-drag

**What does native drag-and-drop provide, and how can an image be draggable?**

Intermediate · HTML

**Answer**

Drag-and-drop supports data transfer through drag events and DataTransfer. Images are generally draggable by default; set draggable explicitly when it is part of your contract. A drop target normally cancels dragover's default behavior to accept a drop.

```html
<img id="tile" src="tile.webp" alt="Graph lesson" draggable="true">
<script>
document.querySelector('#tile').addEventListener('dragstart', event => {
  event.dataTransfer.setData('text/plain', 'lesson-graph');
});
</script>
```

Validate dropped data and offer a keyboard/touch-friendly alternative such as Move up/Move down buttons. Dragging is an enhancement, not the only route to an action.

**Follow-up:** Why should a drop handler not trust HTML or a URL merely because it came from a drag event?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-responsive-images

**How do CSS sizing, srcset/sizes, and picture make images responsive?**

Intermediate · HTML

**Answer**

CSS constrains layout; srcset plus sizes lets the browser choose a suitable source for the rendered width and pixel density; picture supports art direction or format alternatives. Include dimensions to reserve aspect ratio and avoid unexpected shifts.

```html
<img src="notes-800.webp" srcset="notes-400.webp 400w, notes-800.webp 800w" sizes="(max-width: 600px) 100vw, 600px" width="800" height="450" alt="Notes arranged by topic" style="max-width:100%;height:auto">
```

The sizes value should reflect the actual layout. Use a picture/source media condition when a phone needs a different crop, not merely fewer bytes.

**Follow-up:** Why can width:100% still download an unnecessarily huge source image?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-manifest

**What does an HTML5 manifest file mean today, and how is it different from AppCache?**

Intermediate · HTML

**Answer**

The historical html manifest attribute configured Application Cache, an obsolete mechanism that should not be used for new work. A modern web app manifest is JSON describing application identity, icons, start URL, and display preferences; link it from head. It does not cache requests by itself.

```html
<link rel="manifest" href="/app.webmanifest">
```

A service worker can implement an explicit offline caching strategy. Define update behavior and offline limits separately from install metadata.

**Follow-up:** What would still fail offline if you added only a web app manifest?

[Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

## iq-added-html-data

**What are data attributes and how are they accessed?**

Foundation · HTML

**Answer**

Custom data-* attributes attach small application-specific string values to elements without inventing invalid standard attributes. JavaScript exposes them through dataset with camel-cased names. They are visible to page scripts/users, so they are not a secret store.

```html
<button data-lesson-id="42">Open lesson</button>
<script>
const button = document.querySelector('[data-lesson-id]');
console.log(button.dataset.lessonId); // '42', a string
</script>
```

Validate and convert values when needed. Do not use data attributes as a substitute for accessible labels.

**Follow-up:** How would data-max-count map to a dataset property, and how would you validate it as a number?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-shadow-dom

**What is Shadow DOM? Give an original example and explain its limits.**

Intermediate · HTML

**Answer**

Shadow DOM creates an encapsulated DOM subtree attached to a host, often used in web components. Its style scope helps isolate internals from page styles, while slots can project light-DOM content. It is different from React's render representation and is not a security boundary.

```js
const host = document.createElement('div');
const shadow = host.attachShadow({mode: 'open'});
shadow.innerHTML = '<style>p { color: teal; }</style><p>Local styling</p>';
document.body.append(host);
```

This browser example inserts only fixed trusted markup. Do not interpolate untrusted strings into innerHTML.

**Follow-up:** How do composed events and inherited properties complicate the idea of complete isolation?

[Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

## iq-added-css-display

**How do inline, block, inline-block, flex, and grid display differ?**

Foundation · CSS

**Answer**

Display determines box generation and layout participation. In normal flow, block boxes generally start a new line, inline boxes participate in line layout, and inline-block participates inline while allowing box sizing. Flex and grid establish layouts for direct children, usually with block-level outer participation unless an inline variant is chosen. `display:none` generates no box. These are CSS behaviors, not permanent HTML-element categories; CSS can change the default. There is no useful fixed count of all display modes.

```css
.badge { display: inline-block; padding: .25rem .5rem; }
.cards { display: grid; grid-template-columns: repeat(2, 1fr); }
```

**Follow-up:** Why does assigning width to an ordinary non-replaced inline span not behave like assigning width to a block?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-position

**How do static, relative, absolute, fixed, and sticky positioning differ?**

Intermediate · CSS

**Answer**

`position` is a CSS property, not an HTML attribute. Static follows normal flow; relative keeps its original space while offsets move its painted box. Absolute leaves normal flow and uses its containing block, often the nearest positioned ancestor. Fixed commonly uses the viewport, but ancestors such as transformed elements can establish its containing block. Sticky remains in flow and sticks at an inset within its scrolling constraints.

```css
.card { position: relative; }
.badge { position: absolute; top: .5rem; right: .5rem; }
.toolbar { position: sticky; top: 0; }
```

Absolute positioning does not reserve the badge's original space.

**Follow-up:** Why might sticky fail when the relevant ancestor has no room for the element to move?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-hidden

**How do display:none, visibility:hidden, and opacity:0 differ?**

Foundation · CSS

**Answer**

Display:none removes the element's generated box, so its layout space disappears. Visibility:hidden normally retains layout space but hides the element and prevents normal interaction/focus. Opacity:0 keeps a transparent box that can still receive pointer events or focus unless you change those separately. Display:none and visibility:hidden also normally hide content from the accessibility tree.

```css
.removed { display: none; }
.reserved { visibility: hidden; }
.transparent { opacity: 0; }
```

Choose based on layout, interaction, and accessibility, not only appearance.

**Follow-up:** Why can an invisible opacity-zero overlay make visible buttons seem broken?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-stylesheets

**What is a stylesheet, and what are the three common ways to apply CSS in HTML?**

Foundation · CSS

**Answer**

A stylesheet is a collection of CSS rules. An external file is linked with link, an internal stylesheet lives in style, and inline declarations live in an element's style attribute. External CSS is reusable and cacheable; internal CSS can be page-specific; inline declarations are local but harder to manage at scale.

```html
<link rel="stylesheet" href="/site.css">
<style>.note { padding: 1rem; }</style>
<p class="note" style="color:teal">Practice daily</p>
```

CSS also offers imports and programmatic APIs; the three-way answer is a common organization model, not a complete count of mechanisms.

**Follow-up:** Why does loading an external stylesheet later not automatically override every inline declaration?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-specificity

**What is CSS specificity, and where does !important fit in the cascade?**

Intermediate · CSS

**Answer**

Specificity compares selector weights after relevant cascade decisions such as origin, importance, and layer order. Compare ID selectors, then classes/attributes/pseudo-classes, then element/pseudo-element selectors lexicographically. Equal weights in the same cascade context use order of appearance. Inline styles have special precedence over normal stylesheet declarations; !important is a declaration flag, not an extra specificity digit.

```css
p.note { color: teal; } /* 0 IDs, 1 class, 1 type */
#intro { color: purple; } /* 1 ID wins in the same normal layer */
```

`:where()` contributes zero specificity; selectors like :is() take argument specificity. Prefer simpler selectors and deliberate layers over escalating !important.

**Follow-up:** Why can a more specific selector still lose to a declaration in a higher-priority cascade layer?

[CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)

## iq-added-css-box

**What is the CSS box model, and how does box-sizing change width?**

Foundation · CSS

**Answer**

From inside outward, a box has content, padding, border, and margin. With content-box, width sizes the content; padding and border add to its border-box width. With border-box, declared width includes padding and border; margin remains outside.

```css
.card { width: 200px; padding: 20px; border: 2px solid; margin: 10px; }
.compact { box-sizing: border-box; }
```

The default card's border box is 244px wide. With border-box it is 200px and its content is 156px. Margins are not added inside the declared width.

**Follow-up:** How do vertical margin collapsing and inline layout make naive total-height arithmetic misleading?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-center

**How do you center a block inside another element or in the viewport?**

Foundation · CSS

**Answer**

For two-axis centering, make the parent flex and center on its main and cross axes. A definite available height or min-height is needed to see vertical centering. For horizontal centering alone, a narrower block can use auto inline margins.

```html
<main class="screen"><div class="card">Revision</div></main>
<style>
body { margin: 0; }
.screen { min-height: 100vh; min-height: 100dvh; display: flex; justify-content: center; align-items: center; }
.card { width: min(90%, 24rem); padding: 1rem; box-sizing: border-box; }
</style>
```

Use min-height rather than clipping growing content to a fixed height.

**Follow-up:** What changes when flex-direction becomes column, and why does this example still center both axes?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-triangle

**How can borders create a CSS triangle?**

Intermediate · CSS

**Answer**

A zero-size box with thick borders shows triangular border regions. Make three sides transparent and give the remaining border a color. This is appropriate for decoration; meaningful icons still need an accessible name or accompanying text.

```html
<span class="triangle" aria-hidden="true"></span>
<style>
.triangle { display: inline-block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 14px solid teal; }
</style>
```

The colored bottom border forms an upward-pointing triangle. SVG or clip-path may be easier for complex, scalable shapes.

**Follow-up:** How would you make the triangle point right without rotating the whole surrounding layout?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-pseudo

**What are pseudo-elements, and how do they differ from pseudo-classes?**

Foundation · CSS

**Answer**

Pseudo-elements select a part of an element or a generated box, such as ::first-letter, ::before, ::after, and ::selection. Pseudo-classes select an element based on a state or relationship, such as :hover or :focus-visible.

```css
.required::after { content: ' *'; color: darkred; }
button:focus-visible { outline: 3px solid teal; }
```

Generated content should not be the only way to communicate essential information. For a required field, also use real labeling and the appropriate form semantics.

**Follow-up:** Why is ::before not a dependable way to attach essential text to a void input element?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-flex

**What are the main flexbox container and item properties?**

Intermediate · CSS

**Answer**

On the container: display:flex establishes the layout; flex-direction sets the main axis; flex-wrap allows lines; flex-flow combines both; justify-content distributes main-axis space; align-items aligns items on the cross axis; align-content distributes multiple lines; gap sets gutters. On items: order changes visual order; flex-grow distributes positive free space; flex-shrink distributes shrinkage weighted by basis; flex-basis sets the starting main size; flex combines these; align-self overrides alignment.

```css
.row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.main { flex: 1 1 16rem; min-width: 0; }
.tools { flex: 0 0 auto; }
```

Visual reordering does not automatically change reading or keyboard order.

**Follow-up:** Why might a long unbreakable child require min-width:0 even when flex-shrink is enabled?

[Flexbox basic concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)

## iq-added-css-flex-lab

**Build a responsive header and an equal-width card row with flexbox.**

Intermediate · CSS

**Answer**

This additional original exercise practices application layout beyond the two supplied image exercises. The header needs a brand on the left and wrapping actions on the right; cards should share space and wrap on narrow screens.

```html
<header class="bar"><strong>Shortnotes</strong><nav class="actions" aria-label="Main"><a href="/">Read</a><a href="/practice">Practice</a></nav></header>
<section class="cards" aria-label="Courses"><article>JavaScript</article><article>React</article><article>Java</article></section>
<style>
.bar,.actions,.cards { display:flex; gap:1rem; flex-wrap:wrap; }
.bar { justify-content:space-between; align-items:center; }
.cards > article { flex:1 1 14rem; min-width:0; padding:1rem; border:1px solid; }
</style>
```

Check 320px width, long link labels, zoom, and keyboard order. Explain why the basis allows wrapping.

**Follow-up:** How would you keep only the final card from stretching without hard-coding viewport widths?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-viewport

**What are vh and vw, and when do dynamic viewport units help?**

Foundation · CSS

**Answer**

One vw is one percent of the viewport width; one vh is one percent of its height reference. Mobile browser controls make the visible space change, so svh, lvh, and dvh distinguish small, large, and dynamic viewport heights. Prefer flexible min-height for screens that can grow.

```css
.page { min-height: 100vh; min-height: 100dvh; }
.title { font-size: clamp(1.5rem, 4vw, 3rem); }
```

Using 100vw for an ordinary block can cause horizontal overflow where the width includes scrollbar space; width:100% often fits the parent better.

**Follow-up:** Why should viewport-based font sizing usually include sensible minimum and maximum values?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-fonts-float

**Which property selects the font face, and when should float be used?**

Foundation · CSS

**Answer**

Font-family selects an ordered list of typefaces with a generic fallback. @font-face defines a downloadable font resource; font-weight and font-style select variants. Float is useful when text should wrap around media; flex/grid are usually clearer for whole-page or application layouts.

```css
body { font-family: 'Study Sans', system-ui, sans-serif; }
.article { display: flow-root; }
.article img { float: inline-start; width: 8rem; margin-inline-end: 1rem; }
```

Flow-root establishes a formatting context that contains the float. The named custom font needs its own loaded definition if used.

**Follow-up:** Why does float-based page layout require different clearing/containment reasoning from a flex row?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-selectors

**What do div, p; div p; div ~ p; div + p; and div > p select?**

Foundation · CSS

**Answer**

`div, p` selects either type. `div p` selects p descendants at any depth. `div ~ p` selects p siblings after a div with the same parent. `div + p` selects a p immediately following a div sibling. `div > p` selects direct p children.

```html
<div><p>A</p><section><p>B</p></section></div>
<p>C</p><p>D</p>
```

For this fragment, descendants match A/B, direct children match A, adjacent siblings match C, and subsequent siblings match C/D. The comma list includes the div and all four paragraphs.

**Follow-up:** Would moving D into a section preserve its match for div ~ p?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-evolution

**How do CSS2 and CSS3 differ? Is CSS3 one current version?**

Foundation · CSS

**Answer**

CSS2 was largely a single specification, with CSS2.1 clarifying its behavior. Later CSS development became modular: selectors, backgrounds, color, layout, and other modules advance at independent levels. Features often grouped under CSS3 include media queries, rounded borders, transitions, and richer selectors. Flexbox and grid have their own specifications. Calling a feature CSS3 is less useful than naming the module and checking its actual browser support. Use progressive enhancement when unsupported features would otherwise block basic use.

**Follow-up:** Why does a selector at Level 4 not imply every other CSS module is also at Level 4?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-assets

**How would you optimize website asset loading without breaking the experience?**

Intermediate · CSS

**Answer**

Measure the critical rendering path first. Ship appropriately sized/compressed images, subset fonts where suitable, compress and cache versioned static assets, and split optional code. Lazy-load below-the-fold images but prioritize a likely largest-contentful image. Use defer/modules for appropriate scripts; preload only resources proven critical.

```html
<img src="chart.webp" width="640" height="360" loading="lazy" alt="Topic completion chart">
```

This example is for a noncritical image. Excessive preloads compete for bandwidth; smaller transfer size alone does not prove faster interaction.

**Follow-up:** What would you inspect if JavaScript downloaded quickly but the page still remained unresponsive?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-js-loop-output

**What does a let loop with six delayed callbacks print? What if sample is never called?**

Foundation · JavaScript

```js
function sample() {
  for (let i = 0; i <= 5; i++) {
    setTimeout(() => console.log(i), 1000);
  }
}
sample();
```

**Answer**

Correct the casing to console.log and call the function; a definition alone prints nothing. In an ordinary run, invoking this schedules logs 0 through 5 after at least the requested delay. Each let iteration has its own binding.

```js
function sample() {
  for (let i = 0; i <= 5; i++) setTimeout(() => console.log(i), 1000);
}
sample();
```

Changing let to var makes these callbacks share one function-scoped i, whose final value is 6. Delays are scheduling thresholds, not precise appointment times.

**Follow-up:** Why does using i < 5 change both the number of callbacks and the final var value?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-timer-order

**A timer logs a after two seconds and synchronous code logs b. How can a precede b without another timer?**

Foundation · JavaScript

```js
setTimeout(() => console.log('a'), 2000);
console.log('b');
```

**Answer**

Initially the output is b then a: the current script completes before the timer callback. Put both ordered operations in the existing callback, or await one promise that is resolved by that timer.

```js
setTimeout(() => {
  console.log('a');
  console.log('b');
}, 2000);
```

Both now occur after the delay, in a/b order. If b must execute elsewhere, expose a completion promise instead of attempting to block the thread. Correct identifiers are setTimeout and console, with lowercase initials.

**Follow-up:** Can this guarantee execution at exactly 2000 milliseconds under a busy event loop?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-promise-basics

**What are promises, what are their three states, and how do they compare with callbacks?**

Foundation · JavaScript

**Answer**

A callback is a function supplied for another operation to invoke; it can be synchronous or asynchronous and may be invoked many times by an event API. A promise represents one eventual settlement: pending, fulfilled, or rejected. It provides a composable result/error channel through then/catch/finally. Promise executors run synchronously; attached reactions run asynchronously.

```js
const result = new Promise(resolve => resolve(21));
result.then(value => value * 2).then(console.log); // 42
```

Resolved is not a fourth state: resolving with another pending promise can adopt its future outcome. Promises do not automatically cancel work or replace ongoing event subscriptions.

**Follow-up:** Why can forgetting to return an inner promise break both sequencing and error handling?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-rejection-output

**What is printed when a promise rejects with an object containing msg?**

Foundation · JavaScript

```js
const task = new Promise((resolve, reject) => {
  reject({msg: 'Something went wrong'});
});
task.then(value => console.log(value))
  .catch(error => console.log(error.msg));
```

**Answer**

After repairing the supplied syntax, rejection skips the fulfillment handler and reaches catch. The output is Something went wrong. The catch callback below returns undefined, so the promise produced by catch fulfills with undefined unless another error is thrown.

```js
const task = new Promise((resolve, reject) => {
  reject({msg: 'Something went wrong'});
});
task.then(value => console.log(value)).catch(error => console.log(error.msg));
```

An Error object usually gives better stack information than a plain object. The original mismatched brackets/casing would cause a syntax or identifier error rather than this intended trace.

**Follow-up:** What changes if the catch handler throws a new Error after logging?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-delay-output

**After await delay(6000), a ten-second timer is scheduled and second is logged. What is the timeline?**

Intermediate · JavaScript

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function run() {
  await delay(6000);
  setTimeout(() => console.log('first'), 10000);
  console.log('second');
}
run();
```

**Answer**

Assume delay returns a promise settled by its timer and the code runs inside an async function or an ES module. After roughly six seconds, second logs and the ten-second timer has just been scheduled; first is eligible around sixteen seconds from the original start, not ten.

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function run() {
  await delay(6000);
  setTimeout(() => console.log('first'), 10000);
  console.log('second');
}
run();
```

Actual execution can be later under load. An undefined delay helper or await in an unsupported syntactic context changes the problem into an error.

**Follow-up:** What timeline results if the ten-second timer is scheduled before awaiting the six-second delay?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-await-timers

**Why does await setTimeout not wait for the callback, and how do you repair the a/b/c/d/e example?**

Intermediate · JavaScript

```js
// Ordinary browser timers; predict before repairing.
async function fun1() {
  console.log('a');
  console.log('b');
  await setTimeout(() => console.log('c'), 1000);
  await setTimeout(() => console.log('d'), 0);
  console.log('e');
}
fun1();
```

**Answer**

Assume ordinary browser timer APIs. setTimeout returns a handle, not a promise for completion. Await wraps that value and resumes through a microtask; it does not wait for the timer's callback. Corrected original code normally logs a, b, e, d, c with delays 1000 and 0.

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function fun1() {
  console.log('a');
  console.log('b');
  await delay(1000); console.log('c');
  await delay(0); console.log('d');
  console.log('e');
}
fun1();
```

The repaired version logs a, b, c, d, e. Await pauses this async function, not the entire JavaScript thread.

**Follow-up:** Why is top-level await valid in ES modules even though ordinary non-async function bodies cannot use await?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-callback-hell

**What is callback hell, and when do async/await improve the design?**

Intermediate · JavaScript

**Answer**

Deeply nested dependent callbacks mix success paths, repeated error handling, and control flow. Promises expose returnable operations; async/await lets a function express a dependent sequence with ordinary try/catch. Use it when you want to consume promise-based results clearly, while keeping independent work concurrent when appropriate.

```js
// Application excerpt: these three helpers return promises.
async function enroll(userId) {
  const user = await loadUser(userId);
  const course = await chooseCourse(user);
  return saveEnrollment(user.id, course.id);
}
```

A callback API must be correctly adapted first. Await does not convert arbitrary callback registration into completion waiting, and callbacks remain appropriate for repeated events.

**Follow-up:** Which operations could run concurrently if choosing a course no longer depended on loading the user?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-node-nexttick

**What is process.nextTick, and how does it differ from setImmediate?**

Intermediate · Node.js

**Answer**

Both are Node-specific scheduling APIs. nextTick queues work for a next-tick checkpoint after the current JavaScript operation, before proceeding through ordinary event-loop phases. setImmediate runs in the check phase and permits the loop to progress. Recursive nextTick scheduling can starve I/O.

```js
// Run as a CommonJS .cjs file.
process.nextTick(() => console.log('tick'));
setImmediate(() => console.log('immediate'));
console.log('sync');
// sync, tick, immediate
```

Do not generalize this into an unconditional ordering against every promise callback: ES-module evaluation and work already executing inside microtasks affect that comparison.

**Follow-up:** Why is nextTick a poor mechanism for breaking a long CPU task into responsive chunks?

[Node nextTick scheduling](https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick)

## iq-added-node-immediate-output

**What is the order of setImmediate, setTimeout(0), and synchronous logging in Node?**

Intermediate · Node.js

```js
// Run in Node, not a browser.
setImmediate(() => console.log('first'));
setTimeout(() => console.log('second'), 0);
console.log('third');
```

**Answer**

Correct the names to setImmediate, setTimeout, and console.log. Third logs first. At top-level, the relative order of the immediate and zero-delay timer is not a portable guarantee; it depends on timing and event-loop context.

```js
// Node script
setImmediate(() => console.log('first'));
setTimeout(() => console.log('second'), 0);
console.log('third');
```

When both are scheduled inside an ordinary I/O callback, the immediate is expected before that newly scheduled timer. Specify the context instead of memorizing one output from one execution. Browser JavaScript does not provide standard setImmediate/process.nextTick APIs.

**Follow-up:** How would you rewrite this as an I/O-callback experiment without claiming the top-level result is deterministic?

[Node setImmediate scheduling](https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate)

## iq-added-js-array-methods

**How do forEach, map, filter, and reduce differ?**

Foundation · JavaScript

**Answer**

forEach performs a callback for each visited item and returns undefined; map builds transformed items; filter retains items passing a predicate; reduce carries an accumulator into the next step.

```js
const minutes = [5, 10, 15];
console.log(minutes.map(n => n * 2)); // [10,20,30]
console.log(minutes.filter(n => n >= 10)); // [10,15]
console.log(minutes.reduce((sum, n) => sum + n, 0)); // 30
console.log(minutes.forEach(n => n + 1)); // undefined
```

None of these examples mutate the array, but your callback can still mutate referenced objects. Use an explicit initial accumulator so an empty array has a defined reduction result.

**Follow-up:** Why does forEach with an async callback not return a promise that waits for every callback?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-object-enumeration

**How can you count an object's properties and print values without keys?**

Foundation · JavaScript

**Answer**

Ordinary objects have no general length property. Object.keys counts own enumerable string-keyed properties; Object.values returns their values; Object.entries returns key/value pairs. These do not include inherited or symbol-keyed properties. Reflect.ownKeys includes all own string and symbol keys, including non-enumerable ones.

```js
const progress = {java: 3, react: 5};
console.log(Object.keys(progress).length); // 2
for (const value of Object.values(progress)) console.log(value); // 3, 5
```

Define which kind of property you mean before claiming an object's length.

**Follow-up:** Why could for...in print values that Object.values omits?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-array-check

**What does typeof return for an array, and how do you reliably detect arrays?**

Foundation · JavaScript

**Answer**

An array is an object, so typeof [] is 'object'. Use Array.isArray to test array identity; it works across realms such as iframes, unlike an instanceof Array check tied to one realm's constructor. Array-like values and typed arrays are separate categories.

```js
console.log(typeof []); // 'object'
console.log(Array.isArray([])); // true
console.log(Array.isArray({0: 'a', length: 1})); // false
console.log(Array.isArray(new Uint8Array(2))); // false
```

Having indexed properties and length is not proof of being an Array.

**Follow-up:** When would Array.from be useful even when Array.isArray returns false?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-es6

**Explain ten ES2015 features with original examples, without mixing in later additions.**

Intermediate · JavaScript

**Answer**

ES6 means ES2015. Ten useful features are block-scoped bindings, arrows, template literals, destructuring, default parameters, rest parameters, iterable spread, classes, modules, and promises.

```js
let read = 0; const target = 3; // block-scoped bindings
const double = n => n * 2; // lexical-this arrow
const label = `Read ${read}/${target}`; // interpolation
const [first] = [8, 9]; // destructuring
const greet = (name = 'Learner') => name; // default
const count = (...items) => items.length; // rest
const copy = [...[1, 2]]; // iterable spread
class Lesson { constructor(id) { this.id = id; } }
const ready = Promise.resolve('ready');
```

For the tenth feature, one module can `export const goal = 3;` and another can `import {goal} from './goal.js';`. These are separate module files. Async/await and object spread arrived later; do not label them ES2015. Defaults apply to undefined, not null, and spread is shallow.

Explain each mechanism before presenting its syntax:

1. **Bindings:** let allows reassignment, const does not; both follow block scope and temporal-dead-zone rules.
2. **Arrows:** compact function expressions retain lexical this, useful for callbacks, but cannot serve as constructors.
3. **Template literals:** interpolate expressions and preserve literal line breaks; they do not automatically sanitize HTML.
4. **Destructuring:** extract named or positional values into bindings; missing fields may use explicit defaults.
5. **Default parameters:** supply a value for an omitted or undefined argument; passing null does not activate the default.
6. **Rest parameters:** collect remaining arguments into an actual array so normal array operations can be used.
7. **Iterable spread:** expand iterable values into calls or arrays; copying an array still shares nested object references.
8. **Classes:** organize constructor and prototype methods with class syntax; they still use the prototype model and class method bodies are strict.
9. **Modules:** make imports/exports explicit and provide module scope; consumers observe live exported bindings.
10. **Promises:** represent one eventual settlement and compose results/errors; constructing a promise does not make CPU work run in another thread.

**Follow-up:** Choose three features and explain one limitation or surprising behavior of each.

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-function-forms

**What is a function definition, and how do declarations, expressions, anonymous functions, and higher-order functions differ?**

Foundation · JavaScript

**Answer**

A definition supplies parameters and executable behavior; calling the function runs it with arguments. A declaration binds a name using declaration syntax; an expression produces a function value, which may be anonymous or named. A higher-order function accepts or returns functions.

```js
function square(n) { return n * n; } // declaration
const triple = function (n) { return n * 3; }; // anonymous expression
function transform(value, operation) { return operation(value); }
console.log(transform(4, square)); // 16
console.log(transform(4, triple)); // 12
```

Passing square is different from passing square(4), which would pass the result. Callback describes a role, not a separate syntax.

**Follow-up:** Why can a named function expression help with recursion and debugging while keeping its inner name local?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-iife

**What is an IIFE, and when can one still be useful?**

Intermediate · JavaScript

**Answer**

An immediately invoked function expression creates a function value and calls it at once. It can isolate temporary bindings or support an async entry point in a context without top-level await. Modules and block scope now solve many historical global-variable problems.

```js
const initialTotal = (() => {
  const minutes = [5, 10];
  return minutes.reduce((sum, n) => sum + n, 0);
})();
console.log(initialTotal); // 15
```

The temporary minutes binding is internal. An async IIFE returns a promise whose errors still need handling.

**Follow-up:** Why can starting an IIFE immediately after another expression require a semicolon boundary?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-memoization

**What is memoization? Implement it and explain when the cache is wrong.**

Intermediate · JavaScript

**Answer**

Memoization reuses a function result for an input already evaluated. It is valid only if the key captures everything affecting the result and the cached outcome remains appropriate. This single-number example is intentionally narrower than a universal memoizer.

```js
function memoizeNumber(fn) {
  const cache = new Map();
  return n => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
const square = memoizeNumber(n => n * n);
console.log(square(4), square(4)); // 16, 16
```

Map.has correctly handles cached zero/undefined values. Unbounded distinct inputs retain memory; mutable external dependencies make this cache stale.

**Follow-up:** What eviction and key strategy would you need for a user-specific, asynchronous query?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-call-apply-bind

**When should you use call, apply, or bind?**

Intermediate · JavaScript

**Answer**

Call invokes a regular function with an explicit this and separate arguments. Apply invokes it with an explicit this and an array-like argument list. Bind returns a new function with a bound receiver and optionally leading arguments; it does not invoke immediately.

```js
function total(extra) { return this.minutes + extra; }
const learner = {minutes: 20};
console.log(total.call(learner, 5)); // 25
console.log(total.apply(learner, [7])); // 27
const later = total.bind(learner, 10);
console.log(later()); // 30
```

These methods cannot replace an arrow's lexical this. Store a bound callback if you later need its identity for removal.

**Follow-up:** Why do two independent bind calls create callbacks that are not strictly equal?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-create-objects

**What are three common ways to create objects, and what do prototype methods do?**

Foundation · JavaScript

**Answer**

Object literals create a direct record; Object.create selects a prototype; constructor functions/classes create instances with shared prototype behavior. There are more than three possible APIs, so this is a teaching grouping.

```js
const literal = {title: 'Arrays'};
const behavior = {label() { return this.title; }};
const inherited = Object.create(behavior); inherited.title = 'Trees';
class Lesson { constructor(title) { this.title = title; } label() { return this.title; } }
console.log(inherited.label(), new Lesson('Graphs').label()); // Trees Graphs
```

Object.prototype methods such as toString/isPrototypeOf are inherited behavior. Object.keys/create/hasOwn are static Object methods, not methods stored on every object's prototype. Null-prototype objects inherit none of Object.prototype.

**Follow-up:** Why is Object.hasOwn(obj, key) safer than assuming obj.hasOwnProperty is callable?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-method-chaining

**What is method chaining, and how is it different from a prototype chain?**

Intermediate · JavaScript

**Answer**

Method chaining calls methods on the result of the previous method. A fluent mutable API often returns this; an immutable API may return a new value. A prototype chain instead governs inherited property lookup.

```js
const progress = {
  minutes: 0,
  add(n) { this.minutes += n; return this; },
  reset() { this.minutes = 0; return this; }
};
console.log(progress.add(5).add(10).minutes); // 15
```

This example is intentionally mutable. Document validation and mutation rather than assuming fluent syntax makes the API safe.

**Follow-up:** How would you rewrite add to return a fresh value, and how would that change aliasing behavior?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-pass-values

**Does JavaScript pass objects by reference? Show mutation versus reassignment.**

Foundation · JavaScript

**Answer**

JavaScript passes values. For objects, that value refers to an object, so caller and callee can reach the same mutable object. Reassigning the parameter does not reassign the caller's variable; calling this pass-by-reference without that distinction is misleading.

```js
function revise(note) {
  note.done = true;
  note = {done: false};
}
const original = {done: false};
revise(original);
console.log(original.done); // true
```

To deliver a replacement object, return it and explicitly assign the returned value at the call site.

**Follow-up:** What changes when you pass a number instead of an object to a function that reassigns its parameter?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-null-types

**How do null, undefined, NaN, and JavaScript value types differ?**

Foundation · JavaScript

**Answer**

Values have types; variables can later hold a value of another type. Primitive types are undefined, null, boolean, number, bigint, string, and symbol; objects form the other major category. Undefined often means absent/uninitialized-to-a-value; null is an explicit empty-value convention. NaN is a number value representing an invalid numeric result, not its own type.

```js
console.log(null === undefined); // false
console.log(null == undefined); // true
console.log(typeof null); // 'object', historical behavior
console.log(typeof NaN); // 'number'
console.log(Number.isNaN(Number('notes'))); // true
```

Prefer Number.isNaN for a noncoercing NaN check. The special null/undefined loose comparison does not mean they are identical.

**Follow-up:** Why does NaN === NaN return false, while Object.is(NaN, NaN) returns true?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-escape

**What are escape sequences, and why are they used?**

Foundation · JavaScript

**Answer**

Escape sequences represent characters that would otherwise end a string or are awkward to write literally, such as quotes, newlines, tabs, and backslashes. The source representation and resulting characters are different layers.

```js
const quoted = 'It\'s time to study';
const folder = 'C:\\notes';
console.log(quoted); // It's time to study
console.log(folder); // C:\notes
```

A backslash followed by n represents a newline in a normal string literal; a doubled backslash followed by n represents the visible characters backslash and n. Template literals can contain actual line breaks.

**Follow-up:** Why do JSON strings, JavaScript source strings, and regular expressions require attention to different escaping layers?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-break-continue

**How do break and continue differ?**

Foundation · JavaScript

**Answer**

Break exits the nearest applicable loop (or switch); continue skips the rest of the current loop iteration and proceeds to its next iteration step. They do not return from the containing function.

```js
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 2) continue;
  if (n === 4) break;
  console.log(n);
}
// 1, 3
```

In a while loop, skipping an update with continue can create an infinite loop. In nested loops, unlabeled break affects only the nearest loop.

**Follow-up:** How would you stop processing entirely by returning from a function instead?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-event-phases

**How do capturing, bubbling, preventDefault, and stopPropagation differ?**

Intermediate · JavaScript

**Answer**

Capture visits ancestors toward the target; bubbling visits ancestors away from it for events that bubble. StopPropagation stops further propagation but does not cancel the browser's default action. PreventDefault cancels a cancelable default action, but does not stop propagation; passive listeners cannot cancel it.

```js
// Browser excerpt: list is an existing element containing buttons.
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (button && list.contains(button)) console.log(button.dataset.id);
});
list.addEventListener('click', () => console.log('capture'), {capture: true});
```

For a button click, the ancestor capture listener runs before its bubble listener. stopImmediatePropagation additionally stops later listeners on the same target.

**Follow-up:** Why does stopPropagation on a link click not reliably prevent navigation?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-browser-storage

**When should you use localStorage, sessionStorage, IndexedDB, cookies, or an in-memory value?**

Intermediate · JavaScript

**Answer**

LocalStorage is synchronous string storage scoped to origin and typically survives sessions; sessionStorage is also synchronous/string-based but scoped to origin and a page session, surviving reloads in that tab. IndexedDB supports asynchronous structured data and larger offline datasets. Memory is useful for temporary state. Cookies can accompany matching HTTP requests, making them useful for server sessions; they have size and policy constraints.

```js
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('draftTitle', 'Closures');
```

Handle unavailable storage/quota errors. For session cookies consider HttpOnly, Secure, SameSite, expiry, and CSRF policy; JavaScript-readable storage is exposed to injected scripts. Persistence is not a guarantee against user deletion or browser eviction.

**Follow-up:** Why should a server session identifier not be chosen for localStorage just because it is convenient?

[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

## iq-added-js-workers

**What are Web Workers, and how do they communicate with the page?**

Intermediate · JavaScript

**Answer**

Workers run scripts in another execution context, useful for CPU-heavy tasks without monopolizing the page's main JavaScript thread. They cannot directly access the page DOM; messages exchange structured-cloned or transferable data.

```js
// main.js, served over HTTP(S)
const worker = new Worker('./worker.js');
worker.onmessage = event => console.log(event.data);
worker.postMessage([3, 5]);
// worker.js, a separate file
self.onmessage = event => self.postMessage(event.data.reduce((a, b) => a + b, 0));
```

The result is 8. Account for startup and transfer overhead, errors, stale requests, and termination; a worker is not automatically faster for tiny tasks.

**Follow-up:** When would transferring an ArrayBuffer be better than cloning a large payload?

[Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## iq-added-js-axios

**When would you choose Axios over fetch or Node HTTP clients?**

Intermediate · JavaScript

**Answer**

Axios provides conveniences such as interceptors, configured instances, response transformation, and status-based rejection by default. Fetch is a standard platform API available in browsers and modern Node; it normally fulfills on HTTP error status, so check response.ok. Node http/https are lower-level streaming primitives, while clients such as Got have their own Node-focused features. Popularity is not evidence that one is universally best.

```js
async function loadNotes() {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

Choose using runtime, cancellation, retry policy, bundle cost, and team needs. Neither library makes unsafe retries or authorization correct automatically.

**Follow-up:** How would you centralize authentication/error policy without retrying a non-idempotent request blindly?

[Axios introduction](https://axios-http.com/docs/intro)

## iq-added-react-library

**What is React, how does a library differ from a framework, and when does React help over vanilla JavaScript?**

Foundation · React

**Answer**

React is a UI library: components describe output from props/state and React coordinates updates. A framework typically supplies a broader application structure and conventions for routing, data loading, and delivery. React can be used inside such a framework. Its component model helps coordinate complex changing interfaces; a small static page may need little or no React.

```jsx
function Progress({done, total}) {
  return <p>{done} of {total} lessons</p>;
}
```

This is a React component excerpt. Changing its inputs updates its description; you do not manually locate and rewrite that paragraph. React is not inherently faster than every well-written DOM implementation.

**Follow-up:** What additional choices are still needed to turn this UI library into a production application?

[React learning guide](https://react.dev/learn)

## iq-added-react-jsx-babel

**What is JSX, how does it run, why use className, and what does Babel do?**

Foundation · React

**Answer**

JSX is syntax for describing element trees in JavaScript; a build transform converts it to JavaScript calls understood by React's runtime. Browsers do not generally execute raw JSX. Babel is one possible transformation tool, but other compilers can transform JSX too; Babel is not React itself and transpilation is not a universal runtime polyfill. React DOM uses className as its conventional prop for CSS classes.

```jsx
const title = 'Closures';
const heading = <h2 className="lesson-title">{title}</h2>;
```

Curly braces contain expressions. React escapes ordinary string content; dangerouslySetInnerHTML is a separate trust-sensitive API. Avoid reducing className's explanation to an absolute claim that modern JavaScript can never use class as a property name.

**Follow-up:** What is the difference between transforming new syntax and providing a missing runtime API?

[React learning guide](https://react.dev/learn)

## iq-added-react-props-children

**How do props differ from state, and what is the children prop?**

Foundation · React

**Answer**

Props are inputs from a parent; state is data owned by a component whose updates can trigger renders. A child should not mutate received objects to change the parent's state. Children is the prop containing nested content, useful for reusable wrappers that should not know every content type.

```jsx
function Panel({title, children}) {
  return <section><h2>{title}</h2>{children}</section>;
}
function App() {
  return <Panel title="Practice"><p>Explain one closure.</p></Panel>;
}
```

Panel owns the shell while its caller supplies content. Children can be various React nodes, not necessarily one element or always an array.

**Follow-up:** When would a named actions prop be clearer than putting all content into children?

[React learning guide](https://react.dev/learn)

## iq-added-react-fragments

**What are fragments, and what DOM element do they add?**

Foundation · React

**Answer**

A Fragment groups siblings in a React return value without adding a wrapper DOM element. It avoids extra boxes that might disturb flex/grid or invalidly wrap table/list structures. The short syntax cannot receive a key; use the explicit Fragment form for keyed groups.

```jsx
import {Fragment} from 'react';
function Glossary({items}) {
  return <dl>{items.map(item => <Fragment key={item.id}><dt>{item.term}</dt><dd>{item.meaning}</dd></Fragment>)}</dl>;
}
```

The DOM contains dl, dt, and dd, with no fragment node. A real div is still appropriate when you need a layout box, semantics, or an event/attribute target.

**Follow-up:** Why can replacing a div with a fragment alter a flex layout even when the visible text stays the same?

[React learning guide](https://react.dev/learn)

## iq-added-react-usestate

**What does useState accept and return, and when should a value be state rather than a normal variable?**

Foundation · React

**Answer**

UseState accepts an initial value or initializer function and returns a two-item array: the current render's state and a setter. Local variables are recreated during render and changing them does not request a new render. Use state for changing information that affects output; derive cheap values from existing inputs instead of storing redundant copies.

```jsx
import {useState} from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2;
  return <button onClick={() => setCount(n => n + 1)}>{count} / {doubled}</button>;
}
```

Initializers/updaters should be pure. Use a ref for persistent mutable data whose changes should not themselves request a render.

**Follow-up:** Why does changing the initial-value argument after the first render not automatically reset existing state?

[React learning guide](https://react.dev/learn)

## iq-added-react-communication

**How do parent-to-child, child-to-parent, and sibling communication work?**

Intermediate · React

**Answer**

Parents pass props down. Children report intent through callbacks passed as props; the parent updates owned state. Siblings can share state lifted to their closest appropriate common ancestor, which then passes each sibling the data/actions it needs.

```jsx
import {useState} from 'react';
function Editor({value, onChange}) {
  return <input aria-label="Topic" value={value} onChange={e => onChange(e.target.value)} />;
}
function Preview({value}) { return <p>{value}</p>; }
function Workspace() {
  const [topic, setTopic] = useState('Arrays');
  return <><Editor value={topic} onChange={setTopic}/><Preview value={topic}/></>;
}
```

Prop drilling means passing data through layers that do not use it. Composition or context can reduce this, but direct props are often clearest for short paths.

**Follow-up:** How would you avoid lifting a temporary input value to a global store unnecessarily?

[React learning guide](https://react.dev/learn)

## iq-added-react-render-lifecycle

**What are DOM, virtual DOM, reconciliation, render, and commit? When is a function component's return evaluated?**

Intermediate · React

**Answer**

The browser DOM is the live document. React's element descriptions are often called a virtual DOM; reconciliation compares descriptions using type, position, and keys to decide what work to perform. During render, React calls components and evaluates their return expressions. During commit, it applies the selected changes to the host DOM. Calling a component does not guarantee a DOM mutation or even that that render will commit.

```jsx
function Status({count}) {
  const label = count > 0 ? 'Started' : 'New';
  return <p>{label}</p>;
}
```

Changing count from 1 to 2 can rerender this component while its displayed label stays Started. Rendering may be repeated, interrupted, or abandoned, so keep it pure.

**Follow-up:** Why is a network write inside the component body unsafe even if a developer observes only one commit?

[React learning guide](https://react.dev/learn)

## iq-added-react-rerender-triggers

**When does a function component rerender, and what are its mount/update/unmount phases?**

Intermediate · React

**Answer**

State updates can schedule renders; parent rendering normally renders children too unless React can skip them; a consumed context change or subscribed external-store change can also trigger work. A prop does not independently mutate the child: it arrives through a parent's new render. Equal-state updates and memoization may allow bailouts. Mount introduces an identity, updates preserve or replace it, and unmount removes it and cleans up owned effects.

```jsx
import {useEffect} from 'react';
function Room({id}) {
  useEffect(() => {
    console.log('setup', id);
    return () => console.log('cleanup', id);
  }, [id]);
  return <p>Room {id}</p>;
}
```

This logs cleanup for the old committed id before the new setup, plus final cleanup on removal. It is a synchronization example, not an exact replacement for every historical class lifecycle method.

**Follow-up:** Why can development Strict Mode show an extra setup/cleanup sequence without a user-visible unmount?

[React learning guide](https://react.dev/learn)

## iq-added-react-hook-rules

**What are Hooks, how do they differ from ordinary functions, and what are their rules?**

Intermediate · React

**Answer**

Hooks let React components and custom hooks use React features such as state and effects. For ordinary hooks such as useState/useEffect, call them at the top level of function components or custom hooks, not in loops, branches, handlers, or ordinary utilities. Stable call order lets React associate hook state with the correct call across renders.

```jsx
function Summary({visible}) {
  const [count, setCount] = useState(0); // useState imported from React
  if (!visible) return null;
  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;
}
```

The hook must occur before the conditional return. The newer use API has documented exceptions permitting conditional/loop calls; do not apply that exception to useState/useEffect.

**Follow-up:** Why is naming an ordinary utility useSomething insufficient to make conditional hook calls inside it safe?

[Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

## iq-added-react-effect-contract

**What are useEffect's two arguments, what can it return, and when does cleanup run?**

Intermediate · React

**Answer**

The first argument is setup logic for synchronization; it may return a cleanup function. The optional second argument lists reactive dependencies. Omitted dependencies mean after each relevant commit; an empty array describes no reactive dependencies; listed values are compared with Object.is. Cleanup runs before setup for changed dependencies and on unmount. Effects run on the client and should not be used to derive ordinary render data.

```jsx
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []); // useEffect imported; inside a component/custom hook
```

Do not make the effect callback async: its promise is not cleanup. Start asynchronous work inside it with an explicit cancellation/error policy. Timing relative to paint depends on the trigger; avoid an unconditional after-paint rule.

**Follow-up:** How would a roomId-dependent subscription differ from this dependency-free browser listener?

[useEffect contract](https://react.dev/reference/react/useEffect)

## iq-added-react-styling

**What are common ways to style React components, and what tradeoffs do they have?**

Foundation · React

**Answer**

Options include ordinary stylesheets via className, CSS Modules for scoped class names, inline style objects for dynamic declarations, utility classes, and CSS-in-JS tools. Their runtime cost, scoping, extraction, and framework requirements vary. React itself does not require one of them.

```jsx
function Meter({percent}) {
  const bounded = Math.max(0, Math.min(100, percent));
  return <div className="meter"><span style={{display: 'block', width: `${bounded}%`}}>Progress</span></div>;
}
```

Supply the meter stylesheet in the application. Inline objects use camel-cased properties and cannot directly express stylesheet selectors such as :hover or media queries. Validate dynamic values at their boundary.

**Follow-up:** When would a CSS custom property be cleaner than regenerating many inline declarations?

[React learning guide](https://react.dev/learn)

## iq-added-react-hoc

**What is a higher-order component, and how does it compare with a custom hook?**

Intermediate · React

**Answer**

A higher-order component is a function that accepts a component and returns another component, usually wrapping rendering behavior or injecting props. A custom hook shares stateful logic without creating a wrapper component. Both should preserve a clear public contract.

```jsx
function withLoading(View) {
  return function LoadingView({loading, ...props}) {
    return loading ? <p role="status">Loading…</p> : <View {...props}/>;
  };
}
function Lessons({items}) { return <ul>{items.map(x => <li key={x.id}>{x.title}</li>)}</ul>; }
const LoadableLessons = withLoading(Lessons);
```

Create the wrapper outside another component's render so its identity stays stable. This simple wrapper does not promise to forward every ref or static property.

**Follow-up:** When would composition through children be simpler than introducing this HOC?

[React learning guide](https://react.dev/learn)

## iq-added-react-router

**What does React Router provide, and how should sibling routes share data?**

Intermediate · React

**Answer**

React Router maps URLs to UI and coordinates navigation. Use it when different screens need addresses, nested layouts, parameters, or browser history. A router is not a general replacement for shared state: URL parameters suit shareable filters, a layout/context suits shared client state, and a server cache suits remote data.

```jsx
// Declarative React Router app excerpt
import {BrowserRouter, Routes, Route, Link, useParams} from 'react-router-dom';
function Lesson() { const {id} = useParams(); return <p>Lesson {id}</p>; }
function App() { return <BrowserRouter><Link to="/lessons/42">Open</Link><Routes><Route path="/lessons/:id" element={<Lesson/>}/></Routes></BrowserRouter>; }
```

Do not add BrowserRouter inside an app already wrapped by one. Navigation state can carry contextual data, but direct visits/new links need an independent way to load essential data.

**Follow-up:** How would a filter encoded in the URL behave differently from an unsaved editor draft during Back navigation?

[React Router declarative routing](https://reactrouter.com/start/declarative/routing)

## iq-added-redux-purpose

**What are Redux and Flux, and is Redux always better than Context or limited to React?**

Intermediate · Redux

**Answer**

Flux describes a unidirectional data-flow architecture. Redux provides a store with dispatched actions and reducers computing next state; it can be used without React. Its core ideas are a central state tree per store, updates expressed as actions, and pure reducers. React Context distributes values; Redux adds a state-update model, subscriptions/selectors, middleware, and tooling. Neither is universally better. Keep transient local state local; use a shared store when coordination and tooling justify it. Server-state caches solve a related but different problem. Redux Toolkit is the normal starting point for new Redux code.

**Follow-up:** What concrete requirements would justify Redux for an app already using context and a server-data cache?

[Redux fundamentals](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)

## iq-added-redux-actions-reducers

**What are Redux actions and reducers? Show initial state and a state transition.**

Intermediate · Redux

**Answer**

An action describes an event with a type and usually a payload. A reducer receives previous state plus action and returns next state. Initial state handles the undefined input used during initialization. This plain reducer example makes immutable copying explicit.

```js
const initialState = {minutes: 0};
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'study/added': return {...state, minutes: state.minutes + action.payload};
    default: return state;
  }
}
console.log(reducer(undefined, {type: 'study/added', payload: 5})); // {minutes:5}
```

Redux Toolkit createSlice lets case reducers use draft-mutation syntax through Immer; that is different from mutating a plain Redux state object.

**Follow-up:** Why must an unknown action return the existing state rather than undefined?

[Writing Redux logic](https://redux.js.org/usage/structuring-reducers/initializing-state)

## iq-added-redux-flow

**What is the typical React/Redux data flow, and where should side effects go?**

Intermediate · Redux

**Answer**

An interaction dispatches an action; middleware may inspect/handle it; the reducer computes next state; the store notifies subscribers; selectors read the needed data and React updates relevant UI. Reducers must not fetch, schedule timers, mutate external data, or generate unpredictable values such as fresh timestamps/random IDs. Put these effects in event logic, thunks, listener middleware, or other appropriate effect handlers and carry results in actions. Keep state/actions serializable by default to support debugging and persistence. Draft updates in Toolkit remain subject to reducer purity. Middleware wraps dispatch, not the reducer body.

**Follow-up:** Why should a timestamp be created before dispatch and included in the action if replay must reproduce state?

[Redux side effects approaches](https://redux.js.org/usage/side-effects-approaches)

## iq-added-redux-store-api

**What methods does a Redux store expose, and when are they useful?**

Intermediate · Redux

**Answer**

getState reads the current tree. Dispatch submits an action through the installed dispatch pipeline. Subscribe registers a change listener and returns an unsubscribe function; read getState inside the listener. ReplaceReducer swaps the root reducer, useful for dynamic feature loading or development tooling. The observable interop API also exists; it is not normally needed in UI code.

```js
// Application excerpt: store was created with configureStore.
const unsubscribe = store.subscribe(() => console.log(store.getState()));
store.dispatch({type: 'study/added', payload: 5});
unsubscribe();
// store.replaceReducer(nextRootReducer) when deliberately changing reducer composition
```

Subscriptions report store updates, not a diff payload. Never mutate the object returned by getState.

**Follow-up:** Why must a subscription be removed when the owning integration is destroyed?

[Redux store API](https://redux.js.org/api/store)

## iq-added-redux-connect

**What does React Redux connect do, and how do modern hooks compare?**

Intermediate · Redux

**Answer**

Connect is a higher-order function that subscribes a wrapper to the store and maps selected state and dispatch operations into component props. It works with function components too. New code often uses useSelector/useDispatch for a direct hooks interface; existing connect code is not automatically incorrect.

```jsx
import {connect} from 'react-redux';
function Total({minutes, add}) { return <button onClick={add}>{minutes}</button>; }
const ConnectedTotal = connect(
  state => ({minutes: state.minutes}),
  dispatch => ({add: () => dispatch({type:'study/added', payload:5})})
)(Total);
```

This application excerpt needs a Provider supplying a compatible store above it. Select only the data this view needs.

**Follow-up:** How can returning a freshly allocated selector result on every call affect subscription-driven rendering?

[React Redux connect](https://react-redux.js.org/api/connect)

## iq-added-redux-outside

**How can code outside a React component access Redux state safely?**

Intermediate · Redux

**Answer**

Ordinary integration code can use an explicitly supplied store's getState/dispatch; React hooks cannot be called from arbitrary utilities. Dependency injection makes the dependency visible and easier to test.

```js
function makeStudyService(store) {
  return {
    snapshot: () => store.getState().minutes,
    add: minutes => store.dispatch({type:'study/added', payload:minutes})
  };
}
```

Avoid importing one global store into every module, particularly in server rendering where request-specific stores must not share user state. Values read once are snapshots; subscribe only when continuous observation is required and own its cleanup.

**Follow-up:** Why could a module-level singleton store leak one server-rendered user's data into another request?

[Redux FAQ on store access](https://redux.js.org/faq/code-structure)

## iq-added-redux-middleware

**What is Redux middleware? Show an example without putting asynchronous work in a reducer.**

Intermediate · Redux

**Answer**

Middleware composes around dispatch and can log, transform, delay, or handle actions according to its contract. Calling next passes the action to the next middleware/base dispatch; store.dispatch re-enters the pipeline.

```js
const audit = store => next => action => {
  const before = store.getState().minutes;
  const result = next(action);
  const after = store.getState().minutes;
  console.log({type: action.type, before, after});
  return result;
};
// configureStore({reducer, middleware: getDefault => getDefault().concat(audit)})
```

This excerpt assumes a minutes reducer. Preserve dispatch return values and do not log secrets. Thunk middleware handles function actions for asynchronous workflows while reducers remain synchronous and pure.

**Follow-up:** Why can dispatching the same action unconditionally inside middleware create infinite recursion?

[Redux middleware](https://redux.js.org/understanding/history-and-design/middleware)

## iq-added-spring-di

**How do constructor injection, component scanning, and explicit Bean definitions differ?**

Intermediate · Spring Boot

**Answer**

Dependency injection supplies collaborators instead of a class constructing them secretly. Component scanning discovers configured stereotype-annotated classes; explicit @Bean methods construct objects through configuration. Constructor injection makes required dependencies visible and supports immutable fields.

```java
// Spring application excerpt; interfaces/configuration supplied by the app.
@Service
class LessonService {
  private final LessonRepository repository;
  LessonService(LessonRepository repository) { this.repository = repository; }
}
```

If multiple beans implement the same dependency, select deliberately with a qualifier or primary designation. A singleton bean is shared; injection does not automatically make its mutable state thread-safe.

**Follow-up:** How would you test LessonService without starting an entire Spring context?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-autoconfig

**What does Spring Boot auto-configuration do, and how do you debug an unexpected bean?**

Intermediate · Spring Boot

**Answer**

Boot contributes configuration based on conditions such as classpath contents, properties, and existing beans. It supplies defaults rather than inferring your entire business design. Inspect the condition evaluation report, active profiles, property sources, and bean definitions before adding conflicting overrides. A custom bean can cause a matching auto-configuration path to back off where its conditions specify that behavior. Keep a small reproduction and inspect the actual active configuration rather than assuming every starter always installs the same objects.

**Follow-up:** How can a test profile accidentally hide a production configuration problem?

[Boot auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)

## iq-added-spring-validation

**How would you validate a REST request and return consistent errors in Spring?**

Intermediate · Spring Boot

**Answer**

Validate boundary DTOs, enforce business invariants in the service, and retain database constraints for concurrent correctness. @Valid can trigger Jakarta Bean Validation for a request body; controller advice can translate failures into a stable error contract without stack traces or secrets.

```java
// Spring MVC excerpt with validation dependency and imports.
record AddMinutes(@jakarta.validation.constraints.Positive int minutes) {}
@PostMapping("/minutes")
void add(@jakarta.validation.Valid @RequestBody AddMinutes request) {
  service.add(request.minutes());
}
```

Test negative/zero input, malformed JSON, and a business conflict separately. Decide documented status codes and field errors; returning HTTP 200 with an error string makes clients harder to reason about.

**Follow-up:** Which checks belong in the database even when this DTO validation passes?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-nplusone

**What is JPA's N+1 query problem, and how do you fix it without breaking pagination?**

Advanced · Spring Boot

**Answer**

Loading N parent rows and lazily touching each relation can issue one initial query plus N additional queries. Inspect actual SQL/query counts on representative requests. Depending on the access pattern, consider a projection, entity graph, fetch join, or batching. Fetch-joining a to-many collection can multiply result rows and complicate pagination; a two-step ID page followed by controlled fetching may fit better. Do not set every relation eager as a blanket fix: that can overfetch and still produce inefficient query plans.

**Follow-up:** What test would prove both correct page size and bounded query count?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-locking

**How do optimistic and pessimistic locking differ for competing updates?**

Advanced · Spring Boot

**Answer**

Optimistic locking checks a version when writing; an outdated version causes a conflict instead of silently losing the other update. Pessimistic locking obtains database locks during the transaction, trading earlier serialization for waiting/deadlock risk.

```java
// JPA entity field excerpt
@jakarta.persistence.Version
private long version;
```

Choose according to contention and the invariant. Retry a conflicting operation only when safe, after re-reading and re-evaluating the business rule. A version field does not protect unrelated external effects or replace every database constraint.

**Follow-up:** Why is automatically retrying a payment-related method after an optimistic conflict dangerous?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-test-scope

**When should you use a unit test, MVC slice, repository test, or full Spring integration test?**

Intermediate · Spring Boot

**Answer**

A unit test isolates ordinary business logic with supplied collaborators. An MVC slice checks mapping, validation, serialization, and controller behavior. A repository test checks persistence contracts; use a representative database when dialect/locking matters. A full-context integration test checks wiring and boundaries together at greater cost. Match scope to risk instead of replacing all tests with the largest context. For rollback and concurrent inventory behavior, use a real transaction/database boundary and concurrent callers, not mocks that always return success.

**Follow-up:** How could an in-memory test database miss a production SQL or isolation bug?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-java-comparable

**How do Comparable and Comparator differ, and how do you make ordering deterministic?**

Intermediate · Java

**Answer**

Comparable defines a type's natural order through compareTo; Comparator supplies an external ordering strategy, allowing multiple orders. Add a tie-breaker when deterministic results matter.

```java
// Java 17+ excerpt
record Lesson(String id, int minutes) {}
Comparator<Lesson> order = Comparator.comparingInt(Lesson::minutes)
    .thenComparing(Lesson::id);
```

Import java.util.Comparator. Avoid returning a.minutes - b.minutes because subtraction can overflow. Sorted sets/maps use ordering equality to identify keys, so inconsistency with equals requires careful documentation and can surprise callers.

**Follow-up:** What happens if a TreeSet comparator ignores IDs for two lessons with equal minutes?

[Learn Java](https://dev.java/learn/)

## iq-added-java-string-immutability

**Why are Strings immutable, and when should StringBuilder be used?**

Foundation · Java

**Answer**

String operations produce values without changing the original String object, allowing safe sharing and stable value-based use as keys. A variable referring to a String can still be reassigned. StringBuilder is mutable and useful when repeatedly assembling text within one thread.

```java
String name = "Java";
String upper = name.toUpperCase(java.util.Locale.ROOT);
StringBuilder summary = new StringBuilder();
for (int i = 1; i <= 3; i++) summary.append(i).append(' ');
System.out.println(name); // Java
```

Use equals for content comparison. Avoid claiming every concatenation is slow: compilers/runtime optimize many simple expressions.

**Follow-up:** Why is a shared mutable StringBuilder unsuitable for unsynchronized concurrent request processing?

[Learn Java](https://dev.java/learn/)

## iq-added-dsa-intervals

**How do you merge overlapping intervals, and what must the boundary contract specify?**

Intermediate · DSA

**Answer**

Sort intervals by start, then maintain the last merged interval. If the next interval overlaps under your chosen endpoint semantics, extend the end; otherwise append it. For closed intervals, [1,3] and [3,5] overlap; half-open intervals need a deliberate touching policy.

```js
function mergeClosed(intervals) {
  const sorted = intervals.map(x => [...x]).sort((a,b) => a[0]-b[0]);
  const result = [];
  for (const [start,end] of sorted) {
    const last = result.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start,end]);
  }
  return result;
}
```

Assume finite endpoints with start <= end. This avoids input mutation and takes O(n log n) time and O(n) storage. Test empty input, nesting, touching, and disjoint ranges.

**Follow-up:** What changes for half-open ranges where touching intervals should remain separate?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-prefix-count

**How do prefix frequencies count target-sum subarrays with negative numbers?**

Intermediate · DSA

**Answer**

Let prefix be the sum through the current position. An earlier prefix equal to prefix-target identifies a subarray with the target sum. Store frequencies because the same prefix can occur multiple times.

```js
function countTarget(nums, target) {
  const seen = new Map([[0,1]]);
  let prefix = 0, count = 0;
  for (const n of nums) {
    prefix += n;
    count += seen.get(prefix-target) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0)+1);
  }
  return count;
}
console.log(countTarget([1,-1,1], 1)); // 3
```

Expected O(n) time/O(n) space under normal hash assumptions; Number arithmetic must stay within the intended exact range. Count matches before adding the current prefix to avoid counting empty subarrays when target is zero.

**Follow-up:** Why is the initial frequency of prefix zero set to one?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-trie

**When would you choose a trie for prefix search rather than a hash set?**

Intermediate · DSA

**Answer**

A trie shares paths for common prefixes and can locate a prefix by walking its characters before enumerating descendants. A hash set is excellent for exact membership but does not directly organize keys by prefix. For keys of length L, trie insertion/lookup visits O(L) character steps, with potentially large node/map overhead. Define Unicode normalization, case handling, and whether enumeration is bounded. For a tiny static word set, a sorted array plus binary search may be simpler and more compact.

**Follow-up:** How would you return only the top five completions without traversing every descendant?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-lru

**Design an LRU cache with expected O(1) get and put. What invariants matter?**

Advanced · DSA

**Answer**

Combine a map from key to linked-list node with a doubly linked list ordered from most to least recently used. Get moves a hit to the front; put updates/moves an existing node or inserts a new one; overflow evicts the tail from both structures. Every map entry must reference exactly one live node and list size must equal map size. Sentinel nodes simplify empty/single-item cases. Space is O(capacity). Test capacity zero, replacement without growth, repeated hits, and eviction after a read.

**Follow-up:** Why does a singly linked list make arbitrary hit promotion harder without extra predecessor bookkeeping?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-dijkstra-heap

**Why can Dijkstra's priority queue contain stale entries, and how should they be handled?**

Advanced · DSA

**Answer**

A simpler implementation pushes a new distance entry whenever a path improves instead of decreasing an existing heap key. When popping, skip an entry whose distance differs from the current best distance. Finalize only an appropriate minimal-distance entry, under nonnegative edge weights. For A→B=10, A→C=1, C→B=1, B's entry 10 becomes stale after discovering distance 2. Account for duplicate heap entries in memory and runtime bounds; do not claim the heap always contains at most one entry per vertex.

**Follow-up:** How do parallel edges and zero weights affect your tests, and why are negative edges a separate algorithm choice?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-dp-reconstruction

**How can a DP return the chosen solution as well as its optimal value?**

Advanced · DSA

**Answer**

Keep predecessor/choice information or enough of the full table to trace decisions backward. For 0/1 knapsack, compare the chosen state with skipping the current item; when taking it, decrease capacity and move to the previous item row. A compressed array may retain the value while losing the history needed for straightforward reconstruction. Define tie-breaking if several solutions are optimal. Verify the reconstructed items obey the once-only rule and that their summed value equals the reported optimum.

**Follow-up:** When could recomputation or divide-and-conquer reconstruction trade extra time for less memory?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-design-url-shortener

**Design a URL shortener with collision handling and abuse controls.**

Intermediate · System design

**Answer**

Clarify creation/read rates, alias length, custom aliases, expiry, and ownership. Store a unique alias mapped to a validated destination. Generated collisions must be resolved using an atomic uniqueness check and a bounded retry strategy; custom-alias conflicts need a clear response. Cache popular redirects with an explicit expiry/invalidation policy. Choose redirect semantics according to whether destinations can change and should be cached. Limit creation abuse and validate schemes rather than blindly accepting arbitrary destinations. Estimate storage and hot-key traffic before proposing sharding.

**Follow-up:** How would changing a previously cached destination interact with permanent redirects?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-upload

**Design resumable uploads for large files without routing every byte through the application server.**

Advanced · System design

**Answer**

Authenticate the request and create an upload session with size/type limits. Use object-storage multipart upload with short-lived scoped authorization where appropriate. Persist part/session identity so retries and reconnects can resume; verify completion/integrity before publishing a file reference. Keep incomplete objects private and expire abandoned sessions. Scan or process untrusted content before making it available according to the product's requirements. Signed URLs are capabilities, so constrain expiry and access rather than assuming obscurity protects them.

**Follow-up:** How do you handle a successful storage completion when the API response to the client is lost?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-notifications

**Design email/push notifications with preferences, retries, and deduplication.**

Advanced · System design

**Answer**

Separate the business event from channel delivery. Persist an event or outbox record, resolve current recipient/channel preferences, enqueue bounded work, and track attempt identities/outcomes. Respect provider limits and retry transient failures with budgets/backoff. Deduplicate replayed events without preventing legitimately distinct notifications. Define user-visible status carefully: provider acceptance is not proof that a human read the message. Avoid logging sensitive message bodies and allow channel-specific unsubscribe rules.

**Follow-up:** What should happen when a user opts out while a notification is waiting in the queue?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-disaster-recovery

**How do RPO and RTO shape backup and disaster recovery design?**

Advanced · System design

**Answer**

Recovery Point Objective describes tolerable data loss measured in time; Recovery Time Objective describes the targeted time to restore service. Choose backup frequency, replication, storage isolation, and recovery procedures to meet those goals under specific failure scenarios. A replica is not a substitute for backups because corruption or deletion can replicate. Exercise restores, verify data/application compatibility, and measure actual recovery rather than relying on successful backup job logs. Include credentials, dependencies, and DNS/client reconnection in the drill.

**Follow-up:** Why can a zero-data-loss goal conflict with continuing writes during a network partition?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-cache-version

**How can a delayed cache fill resurrect stale data after invalidation?**

Advanced · System design

**Answer**

A reader misses the cache and reads version 1. A writer commits version 2 and invalidates the key. The old reader then fills the cache with version 1, resurrecting stale data. TTL bounds staleness only if that bound satisfies the product. Stronger approaches may use versioned keys, generation checks, or coordinated update/invalidation protocols; each requires careful race analysis. Draw the interleaving and define the freshness contract before claiming a deletion fixes all cache races.

**Follow-up:** How would you prevent an older version from replacing a newer value without introducing a global lock?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-multitenancy

**How do you isolate tenants across databases, caches, queues, and observability?**

Advanced · System design

**Answer**

Derive tenant identity from trusted authentication context and carry it through authorization, queries, cache identity, and background jobs. Use database constraints or access policies where feasible as defense in depth; client-provided tenant IDs are not authority. Partition resource budgets to contain noisy neighbors, and keep logs/traces from exposing another tenant's data. Test cross-tenant reads, writes, cache hits, exported files, and replayed jobs. Stronger physical isolation changes cost and operations, so choose according to requirements.

**Follow-up:** Why is adding tenantId to every URL insufficient to establish tenant isolation?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-flex-image-one

**Recreate the four flex-direction layouts in the first supplied image.**

Intermediate · CSS

**Answer**

In the supplied image, top-left is column; top-right is column-reverse; middle-left is row; bottom-left is row-reverse, assuming the ordinary left-to-right writing direction. Keep DOM order 1, 2, 3, 4 and change only flex-direction. Reverse values change visual progression, not DOM reading/tab order.

```html
<div class="demo column"><span>1</span><span>2</span><span>3</span><span>4</span></div>
<style>
.demo { display:flex; gap:6px; padding:4px; background:#12bdc1; width:280px; }
.demo span { display:grid; place-items:center; flex:0 0 36px; width:36px; height:36px; background:#eee; }
.column { flex-direction:column; }
.column-reverse { flex-direction:column-reverse; }
.row { flex-direction:row; }
.row-reverse { flex-direction:row-reverse; }
</style>
```

Duplicate the div and replace its direction class for each case. The reverse row packs 4,3,2,1 toward the right; the reversed column shows 4 at the top and 1 at the bottom with this content-sized container.

**Follow-up:** How do RTL text direction and vertical writing modes change the physical interpretation of row and column?

[Supplied layout reference](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view)

[Flexbox alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container)

## iq-added-flex-image-two

**Recreate the five wrapped-row align-content layouts in the second supplied image.**

Intermediate · CSS

**Answer**

Reading left-to-right across the top row, the values are flex-start, center, and flex-end. The bottom row shows space-around on the left and space-between in the middle. Align-content distributes multiple flex lines along the cross axis; it needs wrapping and extra cross-axis space. It is different from aligning items inside one line.

```html
<div class="demo"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
<style>
.demo { display:flex; flex-wrap:wrap; align-content:flex-start; gap:6px; box-sizing:border-box; width:220px; height:140px; padding:4px; background:#12bdc1; }
.demo span { flex:0 0 28px; height:28px; display:grid; place-items:center; background:#eee; }
</style>
```

Six items fit the first line and two wrap. Duplicate the container with each align-content value. Space-between puts the outer lines at opposite edges; space-around leaves half as much distributed space at each outer edge as between lines, before accounting for the fixed gap. The dimensions are original implementation choices matching the visual relationships, not measured source pixels.

**Follow-up:** Why would align-content appear to do nothing with a single unwrapped row or a content-sized container height?

[Supplied layout reference](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view)

[Flexbox alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container)
