# Interview workbook — Hinglish mein practice aur answers

App mein 283 questions hain. Yeh workbook supplied checklist aur extra backend, DSA, design topics ko canonical questions se jodta hai. 104 questions add hue; 21 existing questions reuse hue. Repeat topic ke liye duplicate card nahi banaya.

App ka **Interview topic** filter subject-specific practice ke liye use karo. HTML/CSS JavaScript ke browser-foundation chapter se linked hain. App mein answers reveal karne par dikhte hain; yeh Markdown workbook offline reference hai. Pehle khud attempt karo, phir answer padho. Code original hai; framework excerpts ki setup assumptions saath padho.

## Corrections aur coverage ki limits

- Console, SetTimeout, SetImmidiate, async fun aur mismatched brackets jaise syntax/casing errors intended trace exercises mein correct kiye hain. Original code intended output se pehle fail ho sakta tha.
- Node timer ordering ka runtime context padho. Timer handle par await lagana completion promise nahi banata. ES modules top-level await allow karte hain.
- HTML AppCache obsolete hai; web app manifest apne-aap offline caching nahi karta. Heading ranks ko explicit rakha hai.
- Position/display CSS properties hain. React mein function components aur hooks main focus hain; boundaries aur connect ke integration concepts bhi cover hain.
- Answers repo ke liye likhe hain, supplied sites/videos se copy nahi kiye. Linked videos ko watched/transcribed nahi bataya hai. Primary links se aage study karo; employer-frequency ka claim nahi hai.

### Supplied image exercises

Dono public Drive image previews inspect kiye gaye the. Pehla flex-direction aur doosra wrapped lines ke align-content par hai. Neeche dedicated questions aur original solutions hain. Extra responsive-header/card exercise alag original practice hai.

- [Flexbox image 1](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view) — iq-added-flex-image-one mein solution.
- [Flexbox image 2](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view) — iq-added-flex-image-two mein solution.

## Reused questions — ek topic, ek canonical entry

| Topic — repeats merge kiye hain | Question link |
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

## HTML — questions ki list

- [HTML tag/element same hain? Attributes ka role kya hai?](#iq-added-html-elements)
- [Void elements kya hain; closing tags hote hain?](#iq-added-html-void)
- [Ordered, unordered aur description lists ka difference?](#iq-added-html-lists)
- [class aur id ka difference kya hai?](#iq-added-html-id-class)
- [strong/b aur em/i ka difference kya hai?](#iq-added-html-emphasis)
- [head/body mein kya aata hai; header/nav/main/aside/footer ka role?](#iq-added-html-document)
- [Ek webpage doosri mein embed kaise karoge?](#iq-added-html-iframe)
- [href/target kaise work karte hain aur link versus a kya hai?](#iq-added-html-links)
- [Scripts head/body mein kab; defer/async/modules loading kaise badalte hain?](#iq-added-html-scripts)
- [HTML forms aur important defaults kaise work karte hain?](#iq-added-html-forms)
- [HTML interaction JavaScript se kaise handle karoge?](#iq-added-html-events)
- [HTML5 ke major goals/improvements kya the?](#iq-added-html-evolution)
- [audio/video kaise work karte hain; source/track kya add karte hain?](#iq-added-html-media)
- [header/h1 ka relation kya hai; har header mein h1 required hai?](#iq-added-html-headings)
- [Native drag-drop kya deta hai; image draggable kaise?](#iq-added-html-drag)
- [CSS sizing, srcset/sizes/picture responsive images kaise banate hain?](#iq-added-html-responsive-images)
- [Web app manifest aur old AppCache ka difference kya hai?](#iq-added-html-manifest)
- [Data attributes kya hain aur access kaise karte hain?](#iq-added-html-data)
- [Shadow DOM kya hai? Example aur limits samjhao.](#iq-added-html-shadow-dom)

## CSS — questions ki list

- [Dropdown ka z-index 999999 hai phir bhi peeche hai. Debug kaise?](#iq-lab-03)
- [inline, block, inline-block, flex aur grid ka difference?](#iq-added-css-display)
- [static, relative, absolute, fixed, sticky ka difference?](#iq-added-css-position)
- [display:none, visibility:hidden, opacity:0 ka difference?](#iq-added-css-hidden)
- [Stylesheet kya hai aur HTML mein CSS apply karne ke three ways?](#iq-added-css-stylesheets)
- [Specificity kya hai aur !important cascade mein kahan fit hota hai?](#iq-added-css-specificity)
- [Box model aur box-sizing width ko kaise affect karte hain?](#iq-added-css-box)
- [Element ko parent/viewport mein center kaise karoge?](#iq-added-css-center)
- [Borders se CSS triangle kaise banta hai?](#iq-added-css-triangle)
- [Pseudo-element aur pseudo-class ka difference?](#iq-added-css-pseudo)
- [Flex container/item ki main properties kya hain?](#iq-added-css-flex)
- [Flexbox se responsive header aur equal-width cards banao.](#iq-added-css-flex-lab)
- [vh/vw kya hain; dynamic viewport units kab useful hain?](#iq-added-css-viewport)
- [Font face kaunsi property choose karti hai; float kab use karein?](#iq-added-css-fonts-float)
- [div, p; div p; div ~ p; div + p; div > p kya select karte hain?](#iq-added-css-selectors)
- [CSS2/CSS3 ka difference; kya CSS3 single current version hai?](#iq-added-css-evolution)
- [UX preserve karke asset loading optimize kaise karoge?](#iq-added-css-assets)
- [First supplied image ke four flex-direction layouts recreate karo.](#iq-added-flex-image-one)
- [Second supplied image ke five wrapped align-content layouts recreate karo.](#iq-added-flex-image-two)

## JavaScript — questions ki list

- [var, let aur const mein kya difference hai?](#iq-js-01)
- [Closure kya hai aur kahan useful hai?](#iq-js-02)
- [Regular aur arrow function ka this kaise decide hota hai?](#iq-js-03)
- [==, === aur Object.is mein kya difference hai?](#iq-js-05)
- [Generator function kya hai aur kab useful hai?](#iq-js-13)
- [Event delegation kaise aur kyun use hoti hai?](#iq-js-15)
- [Currying kya hai; implement kaise karoge?](#iq-js-16)
- [Six delayed callbacks wala let loop kya print karega? sample call na ho toh?](#iq-added-js-loop-output)
- [Timer a ko 2s baad, sync code b log karta hai. Extra timer bina a pehle kaise?](#iq-added-js-timer-order)
- [Promises kya hain, three states aur callbacks se comparison kya hai?](#iq-added-js-promise-basics)
- [Promise msg-object se reject ho toh kya print hoga?](#iq-added-js-rejection-output)
- [await delay(6000) ke baad ten-second timer aur second log: timeline kya hai?](#iq-added-js-delay-output)
- [await setTimeout callback wait kyun nahi karta; a/b/c/d/e repair kaise?](#iq-added-js-await-timers)
- [Callback hell kya hai; async/await design kab improve karte hain?](#iq-added-js-callback-hell)
- [forEach/map/filter/reduce ka difference kya hai?](#iq-added-js-array-methods)
- [Object properties count aur values-only print kaise?](#iq-added-js-object-enumeration)
- [Array ka typeof kya hai; reliable detection kaise?](#iq-added-js-array-check)
- [Ten ES2015 features examples se samjhao; later features mix mat karo.](#iq-added-js-es6)
- [Function definition, declaration, expression, anonymous aur higher-order ka difference?](#iq-added-js-function-forms)
- [IIFE kya hai aur ab bhi kab useful hai?](#iq-added-js-iife)
- [Memoization implement karo aur invalid cache cases samjhao.](#iq-added-js-memoization)
- [call/apply/bind kab use karoge?](#iq-added-js-call-apply-bind)
- [Objects create karne ke three ways aur prototype methods ka role?](#iq-added-js-create-objects)
- [Method chaining versus prototype chain kya hai?](#iq-added-js-method-chaining)
- [JS object passing mein mutation/reassignment ka difference dikhao.](#iq-added-js-pass-values)
- [null, undefined, NaN aur value types ka difference?](#iq-added-js-null-types)
- [Escape sequences kya hain aur kyun use hoti hain?](#iq-added-js-escape)
- [break aur continue ka difference?](#iq-added-js-break-continue)
- [Capture, bubble, preventDefault, stopPropagation ka difference?](#iq-added-js-event-phases)
- [localStorage/sessionStorage/IndexedDB/cookies/memory kab choose karoge?](#iq-added-js-browser-storage)
- [Web Workers kya hain aur page se kaise communicate karte hain?](#iq-added-js-workers)
- [Axios, fetch ya Node HTTP client kab choose karoge?](#iq-added-js-axios)

## React — questions ki list

- [React state snapshot hai, iska kya meaning hai?](#iq-react-01)
- [List mein stable keys kyun important hain?](#iq-react-02)
- [useEffect kab appropriate hai?](#iq-react-03)
- [Controlled aur uncontrolled inputs ka difference kya hai?](#iq-react-05)
- [memo, useMemo aur useCallback kab help karte hain?](#iq-react-06)
- [Local state, Context aur store kaise choose karoge?](#iq-react-07)
- [Render logic pure kyun honi chahiye?](#iq-react-08)
- [Error boundary kya catch kar sakti hai?](#iq-react-11)
- [50,000-row table responsive kaise banaoge?](#iq-react-12)
- [Custom hook ko actually reusable kya banata hai?](#iq-react-13)
- [Multiple useState ke bajay useReducer kab clearer hai?](#iq-react-15)
- [React kya hai; library/framework difference aur vanilla JS ke upar benefit kab?](#iq-added-react-library)
- [JSX kaise run hota hai, className kyun, Babel ka role kya?](#iq-added-react-jsx-babel)
- [Props/state ka difference aur children kya hai?](#iq-added-react-props-children)
- [Fragments kya hain aur kaunsa DOM element add karte hain?](#iq-added-react-fragments)
- [useState kya accept/return karta hai; normal variable ke bajay state kab?](#iq-added-react-usestate)
- [Parent-child aur sibling communication kaise hoti hai?](#iq-added-react-communication)
- [DOM, virtual DOM, reconciliation, render/commit kya; return kab evaluate hota hai?](#iq-added-react-render-lifecycle)
- [Function component rerender kab; mount/update/unmount kya?](#iq-added-react-rerender-triggers)
- [Hooks kya hain, ordinary functions se difference aur rules kya?](#iq-added-react-hook-rules)
- [useEffect ke two arguments, return aur cleanup timing kya?](#iq-added-react-effect-contract)
- [React styling ke common ways aur tradeoffs kya hain?](#iq-added-react-styling)
- [HOC kya hai aur custom hook se kaise compare karoge?](#iq-added-react-hoc)
- [React Router kya deta hai; sibling routes data kaise share karein?](#iq-added-react-router)

## Redux — questions ki list

- [Redux/Flux kya hain; Redux always better ya React-only hai?](#iq-added-redux-purpose)
- [Redux action/reducer kya; initial state aur transition dikhao.](#iq-added-redux-actions-reducers)
- [React/Redux data flow aur side effects ka owner kya hai?](#iq-added-redux-flow)
- [Redux store methods aur unke uses kya hain?](#iq-added-redux-store-api)
- [React Redux connect versus modern hooks kaise compare karoge?](#iq-added-redux-connect)
- [Component ke bahar Redux state safely kaise access karoge?](#iq-added-redux-outside)
- [Redux middleware example do; reducer mein async work mat rakho.](#iq-added-redux-middleware)

## Node.js — questions ki list

- [Large Mongo result Node se whole-buffer bina export kaise karoge?](#iq-lab-14)
- [process.nextTick aur setImmediate ka difference?](#iq-added-node-nexttick)
- [Node mein setImmediate, setTimeout(0), sync log ka order?](#iq-added-node-immediate-output)

## Java — questions ki list

- [Comparable/Comparator difference aur deterministic ordering kaise?](#iq-added-java-comparable)
- [String immutable kyun; StringBuilder kab use karein?](#iq-added-java-string-immutability)

## Spring Boot — questions ki list

- [Constructor DI, component scan aur Bean definition ka difference?](#iq-added-spring-di)
- [Boot auto-configuration kya karti hai; unexpected bean debug kaise?](#iq-added-spring-autoconfig)
- [Spring REST input validate aur consistent errors kaise doge?](#iq-added-spring-validation)
- [JPA N+1 kya hai; pagination tode bina fix kaise?](#iq-added-spring-nplusone)
- [Competing updates mein optimistic/pessimistic locks ka difference?](#iq-added-spring-locking)
- [Unit, MVC slice, repository ya full integration test kab?](#iq-added-spring-test-scope)

## MongoDB — questions ki list

- [Old session documents auto-expire kaise karoge?](#iq-mongo-14)

## DSA — questions ki list

- [Overlapping intervals merge kaise; boundary contract kya hai?](#iq-added-dsa-intervals)
- [Prefix frequencies negative values ke target-sum subarrays kaise count karti hain?](#iq-added-dsa-prefix-count)
- [Prefix search mein hash set ke bajay trie kab?](#iq-added-dsa-trie)
- [Expected O(1) LRU get/put design karo; invariants kya?](#iq-added-dsa-lru)
- [Dijkstra heap stale entries kyun rakhta hai; handle kaise?](#iq-added-dsa-dijkstra-heap)
- [DP optimal value ke saath chosen solution kaise return kare?](#iq-added-dsa-dp-reconstruction)

## System design — questions ki list

- [Collisions aur abuse controls ke saath URL shortener design karo.](#iq-added-design-url-shortener)
- [Large resumable upload design karo bina every byte app server se bheje.](#iq-added-design-upload)
- [Preferences/retries/dedup wali email/push service design karo.](#iq-added-design-notifications)
- [RPO/RTO backup/disaster recovery ko kaise shape karte hain?](#iq-added-design-disaster-recovery)
- [Invalidation ke baad delayed cache fill stale data wapas kaise la sakti hai?](#iq-added-design-cache-version)
- [DB/cache/queue/observability mein tenants isolate kaise karoge?](#iq-added-design-multitenancy)

## Answers aur follow-ups

Pehle question khud attempt karo. Answer se mechanism aur edge cases compare karo; sirf final words yaad mat karo.

## iq-js-01

**var, let aur const mein kya difference hai?**

Foundation · JavaScript

**Answer — reasoning samjho**

var function-scoped hota hai, jabki let aur const block-scoped hote hain. let/const declaration se initialization tak temporal dead zone mein rehte hain; const binding ko reassign nahi kar sakte, lekin bound object mutate ho sakta hai.

Hoisting declarations ke observable behavior ka naam hai; source code physically upar nahi jaata. var binding declaration execute hone se pehle undefined se initialize hoti hai. let/const initialization tak uninitialized rehte hain; us waqt read karoge toh ReferenceError aayega. Function declaration aur function expression ka behavior bhi alag hai.

```js
console.log(score); // undefined
var score = 2;
{ const lesson = {done:false}; lesson.done = true; }
// Reading a let/const binding before its initialization throws ReferenceError.
```

**Follow-up — aur socho:** var loop ke delayed callbacks final index kyun dekhte hain?

## iq-js-02

**Closure kya hai aur kahan useful hai?**

Foundation · JavaScript

**Answer — reasoning samjho**

Closure function ko uske lexical environment ke bindings access karne deta hai, even jab outer function return ho chuka ho. Private counters, callbacks aur function factories mein useful hai; captured bindings live hote hain, automatically frozen copies nahi.

Har factory call ki apni binding hai. Pehla closure updated total yaad rakhta hai; zero ki frozen copy nahi. Isliye a ki do calls ek total badhati hain, jabki b ka counter alag shuru hota hai.

```js
function makeTracker() {
  let minutes = 0;
  return amount => (minutes += amount);
}
const a = makeTracker(), b = makeTracker();
console.log(a(5), a(3), b(2)); // 5, 8, 2
```

**Follow-up — aur socho:** Closure expected se zyada memory kaise retain kar sakta hai?

## iq-js-03

**Regular aur arrow function ka this kaise decide hota hai?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Regular function ka this call-site se decide hota hai: object method call, explicit call/apply/bind, constructor call, ya plain call. Arrow function apna this create nahi karta; surrounding lexical scope ka this use karta hai, isliye bind se uska this replace nahi hota.

Arrow ka apna arguments binding nahi hota aur use new ke saath call nahi kar sakte. Jab this invocation ke receiver se aana chahiye, regular function use karo. Example mein call normal ka this badalta hai, arrow ka lexical this nahi.

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

**Follow-up — aur socho:** Object method directly setTimeout ko doge toh kya hoga?

## iq-js-05

**==, === aur Object.is mein kya difference hai?**

Foundation · JavaScript

**Answer — reasoning samjho**

== comparison se pehle type coercion kar sakta hai, jabki === alag types ko unequal maanta hai. Object.is mostly strict equality jaisa hai, lekin NaN ko khud ke equal aur +0/-0 ko different maanta hai; objects ke liye ye bhi identity compare karta hai.

**Follow-up — aur socho:** Do separately created empty objects strictly equal kyun nahi?

## iq-js-13

**Generator function kya hai aur kab useful hai?**

Intermediate · JavaScript

**Answer — reasoning samjho**

function* body ko pause/resume karne deta hai; yield par control caller ko return hota hai aur next() call par execution wahi se resume hota hai. Lazy sequences, custom iterables aur large/infinite data ko chunk-by-chunk produce karne ke liye useful hai, bina pura result upfront array mein banaye.

Generator call se iterator banta hai; body turant nahi chalti. next() usse agle yield ya return tak resume karta hai. for...of yielded values leta hai, final return value nahi. Generator apne-aap parallel ya asynchronous execution nahi banata.

```js
function* lessonIds() { yield 10; yield 20; return 30; }
const ids = lessonIds();
console.log(ids.next()); // {value:10, done:false}
console.log(ids.next()); // {value:20, done:false}
console.log(ids.next()); // {value:30, done:true}
```

**Follow-up — aur socho:** Async aur regular generator mein kya difference hai?

## iq-js-15

**Event delegation kaise aur kyun use hoti hai?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Event bubbling ki wajah se parent ek listener attach karke child elements ke events bhi handle kar sakta hai; event.target actual clicked element batata hai. Dynamic ya large list mein har item par separate listener attach karne ke bajaye ek delegated listener memory aur setup cost dono kam karta hai.

**Follow-up — aur socho:** Nested widget ke clicks ko outer delegation se kaise alag rakhoge?

## iq-js-16

**Currying kya hai; implement kaise karoge?**

Advanced · JavaScript

**Answer — reasoning samjho**

Currying ek multi-argument function ko chain of single-argument functions mein transform karta hai: add(a)(b)(c). Partial application se reusable specialized functions banti hain, jaise ek fixed discount rate wala pricing function. Closure har call ke previously supplied arguments retain karta hai jab tak final call na aaye.

Pehli call base capture karti hai; doosri extra deti hai. Currying multiple arguments ko single-argument steps mein arrange karti hai. Partial application kuch arguments pehle fix karti hai; dono terms ko har situation mein same mat bolo.

```js
const addMinutes = base => extra => base + extra;
const afterMorning = addMinutes(25);
console.log(afterMorning(10)); // 35
```

**Follow-up — aur socho:** Curry helper ko ek call mein multiple arguments support kaise doge?

## iq-lab-03

**Dropdown ka z-index 999999 hai phir bhi peeche hai. Debug kaise?**

Advanced · CSS

**Answer — reasoning samjho**

Pehle ancestor stacking contexts dekho. Dropdown apne context ke andar compete karta hai; sibling ancestor poore subtree se upar ho sakta hai. Positioned z-index, transform, opacity inspect karo. Overlay ko deliberate top-level layer ya suitable platform primitive mein rakho. Sirf number badhane ke bajay clipping, focus aur positioning bhi verify karo.

z-index apne stacking context ke andar stack level control karta hai: menus, overlays aur sticky headers mein kaam aata hai. Positioned element ka non-auto z-index, opacity below 1 ya transform naya context bana sakta hai. Flex/grid items bina position ke bhi z-index use kar sakte hain. Neeche panel ka context neighbor se neeche hai, isliye andar menu ka 100 neighbor ke 2 ko globally beat nahi karta. Ancestors inspect karo, consistent layer scale rakho aur zaroorat par suitable portal ya top-layer primitive chuno.

```css
.panel { position: relative; z-index: 1; }
.menu { position: absolute; z-index: 100; }
.neighbor { position: relative; z-index: 2; }
```

**Follow-up — aur socho:** Stack order change ke baad bhi overflow clipping kyun reh sakti hai?

## iq-react-01

**React state snapshot hai, iska kya meaning hai?**

Foundation · React

**Answer — reasoning samjho**

Har render ko us waqt ka state milta hai aur us render ke handlers wahi values capture karte hain. setState future render request karta hai; current handler ke local state variable ko turant replace nahi karta.

**Follow-up — aur socho:** Three setCount(count+1) calls sirf once increment kyun kar sakti hain?

## iq-react-02

**List mein stable keys kyun important hain?**

Foundation · React

**Answer — reasoning samjho**

Keys React ko siblings ke beech identity track karne mein help karte hain, taaki reorder ke baad correct state preserve ho. Array index dynamic insert/delete/reorder mein wrong identity map kar sakta hai; render ke waqt random key banana har baar remount kara sakta hai.

**Follow-up — aur socho:** Key intentionally badalkar form reset kab karoge?

## iq-react-03

**useEffect kab appropriate hai?**

Intermediate · React

**Answer — reasoning samjho**

Effect component ko external systems, jaise subscription, browser API ya network synchronization, se sync karta hai. Render se calculate hone wali value ko usually directly derive karo; effect dependencies mein reactive inputs include karo aur setup ka matching cleanup do.

**Follow-up — aur socho:** Sirf props state mein copy karne wali effect kaise hataoge?

## iq-react-05

**Controlled aur uncontrolled inputs ka difference kya hai?**

Foundation · React

**Answer — reasoning samjho**

Controlled input ki value React state se aati hai aur onChange us state ko update karta hai. Uncontrolled input apni current value DOM mein rakhta hai aur defaultValue ya ref se access hota hai; ek input ko lifecycle ke beech modes switch karne se avoid karo.

Controlled input ki value aur change handler consistent rakho. Uncontrolled input mein defaultValue sirf initial value deta hai; baad ki typing DOM manage karta hai. Ek hi input ko uncontrolled se controlled ya ulta switch mat karo. Example mein pehla state se read hota hai, doosra submit par ref se.

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

**Follow-up — aur socho:** Large form ke liye kya choose karoge aur kyun?

## iq-react-06

**memo, useMemo aur useCallback kab help karte hain?**

Intermediate · React

**Answer — reasoning samjho**

memo unchanged props par component rendering skip karne ka optimization deta hai; useMemo calculation result aur useCallback function identity cache karta hai. Ye correctness tools nahi hain: actual rendering cost profile karo, aur unstable object props ya context updates se cache benefit disappear ho sakta hai.

useMemo calculated result cache karta hai; useCallback function identity cache karta hai; memo equal props par parent ki wajah se hone wala render skip kar sakta hai. Stable identity correctness ka substitute nahi. Relevant workload measure karo: state/context updates aur unstable inputs ab bhi kaam karwa sakte hain. Compiler-enabled build mein manual memoization ki zaroorat kam ho sakti hai.

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

**Follow-up — aur socho:** Excess memoization ki overhead/readability cost kya hai?

## iq-react-07

**Local state, Context aur store kaise choose karoge?**

Intermediate · React

**Answer — reasoning samjho**

State ko pehle closest owner ke paas rakho; shared consumers ke liye lift karo aur widely needed values ke liye Context consider karo. Frequent granular updates, selectors ya complex cross-feature workflows ke liye store useful ho sakta hai; server cache ko client-only UI state ke saath blindly mix mat karo.

Consumer nearest matching provider ki value padhta hai. Context value distribute karta hai aur change par consumers update karta hai; reducer, middleware ya server-cache policy define nahi karta. Shared-state mechanism add karne se pehle dekho composition se prop drilling kam ho sakti hai kya.

```jsx
import {createContext, useContext, useState} from 'react';
const ThemeContext = createContext('light');
function Label() { return <p>{useContext(ThemeContext)}</p>; }
function App() {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}><button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle</button><Label/></ThemeContext.Provider>;
}
```

**Follow-up — aur socho:** Provider value change many consumers ko kyun trigger karta hai?

## iq-react-08

**Render logic pure kyun honi chahiye?**

Intermediate · React

**Answer — reasoning samjho**

React rendering work ko repeat, interrupt ya discard kar sakta hai, isliye render ke andar external mutations predictable nahi rehte. Same props/state se same UI description banao; user-triggered side effects handlers mein aur synchronization effects mein rakho.

**Follow-up — aur socho:** Render mein prop array push karna risky kyun hai?

## iq-react-11

**Error boundary kya catch kar sakti hai?**

Intermediate · React

**Answer — reasoning samjho**

Error boundary apne descendant tree ke rendering-related errors ko fallback UI se contain karta hai. Ordinary event-handler exceptions aur arbitrary asynchronous callback errors automatically catch nahi hote; un flows mein explicit error handling chahiye.

Recoverable UI region ke around error boundary rakho, taaki render fail ho toh fallback dikhe. Function-component app mein maintained boundary wrapper ya framework ka route-error feature use kar sakte ho. Ordinary event-handler errors aur unrelated async callbacks ke liye alag handling chahiye; boundary har promise rejection nahi pakadti. Reset/retry behavior define karo aur private data expose kiye bina useful diagnostics log karo.

**Follow-up — aur socho:** Multi-panel dashboard mein boundaries kahan rakhoge?

## iq-react-12

**50,000-row table responsive kaise banaoge?**

Advanced · React

**Answer — reasoning samjho**

Pehle measure karo ki bottleneck network, computation, DOM size ya rerenders hai. Server pagination/filtering, row virtualization, stable row identity aur expensive work ka caching/worker execution combine kar sakte ho; keyboard navigation, focus aur screen-reader behavior ko virtualized design mein verify karo.

**Follow-up — aur socho:** Variable row heights virtualization ko kaise badalti hain?

## iq-react-13

**Custom hook ko actually reusable kya banata hai?**

Intermediate · React

**Answer — reasoning samjho**

Custom hook stateful logic ko component se extract karta hai, lekin har calling component apna independent state instance get karta hai — koi shared state automatically nahi banta. Reusable hook clear contract expose karta hai (kya input leta hai, kya return karta hai), aur internal dependencies/cleanup khud manage karta hai.

Yeh client hook behavior share karta hai, ek global state cell nahi. Har useOnline call ki apni state/effect hoti hai. navigator.onLine sirf connectivity hint hai, API reachable hone ka proof nahi. Server rendering mein initial snapshot aur hydration ko deliberately consistent rakhna padta hai.

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

**Follow-up — aur socho:** Same hook use karne wale two components state share kyun nahi karte?

## iq-react-15

**Multiple useState ke bajay useReducer kab clearer hai?**

Intermediate · React

**Answer — reasoning samjho**

Jab next state previous state aur ek action dono par depend karta hai, ya multiple related fields ek saath consistently update hone chahiye, reducer ek single predictable transition function mein woh logic centralize karta hai. Independent, unrelated pieces of state ke liye separate useState usually simpler rehta hai.

**Follow-up — aur socho:** Component render bina reducer test kaise karoge?

## iq-mongo-14

**Old session documents auto-expire kaise karoge?**

Intermediate · MongoDB

**Answer — reasoning samjho**

TTL index (`expireAfterSeconds`) ek date field par set karke MongoDB background process periodically expired documents delete kar deta hai. Yeh exact-second precision guarantee nahi karta (background sweep interval-based hai), isliye strict expiry-time enforcement application logic mein bhi verify karo, sirf TTL par depend mat karo.

Failure check: TTL deletion asynchronous hai; logical expiry ke baad bhi document kuch time present ho sakta hai. Expired session ko turant reject karne ke liye authorization/query contract mein expiry timestamp check karo. TTL cleanup ke liye hai. Expired document delete hone se pehle boundary test karo; clock aur renewal rules define karo. Storage cleanup aur authentication validity ko alag responsibilities samjho.

**Follow-up — aur socho:** TTL expiry ke baad bhi document briefly present kyun ho sakta hai?

## iq-lab-14

**Large Mongo result Node se whole-buffer bina export kaise karoge?**

Advanced · Node.js

**Answer — reasoning samjho**

DB cursor gradually read karke backpressure-aware pipeline mein write karo. Pehle toArray ya whole CSV string mat banao. Error/disconnect par cursor/streams close, auth/export limits enforce aur partial-download policy define karo. Streaming cooperating stages ki buffering bound karti hai; simultaneous exports ka admission limit alag chahiye. Slow consumer par memory aur cleanup observe karo.

Failure check: streaming tabhi buffering limit karti hai jab producer backpressure maane. Pipeline transfer, errors aur cleanup coordinate karti hai. Client disconnect ho toh owned database cursor aur downstream work stop karo. Headers send hone ke baad normal JSON error bhejne se download format corrupt ho sakta hai. Partial download aur retry behavior define karo; slow/disconnected client ke saath memory, cursor lifetime aur cancellation observe karo.

**Follow-up — aur socho:** Slow client par memory bounded hai, kaise verify karoge?

## iq-added-html-elements

**HTML tag/element same hain? Attributes ka role kya hai?**

Foundation · HTML

**Answer — reasoning samjho**

Tag markup syntax hai, jaise `<p>`/`</p>`; element us markup se represented structure hai including content/attributes. Attributes start tag par configuration/metadata dete hain. Neeche p element type aur class/lang attributes hain. DOM properties runtime interface hain; har property markup attribute ka exact mirror nahi. Input typing se current value change hoti hai, original value attribute necessarily nahi.

```html
<p class="summary" lang="en">Study one concept.</p>
```

**Follow-up — aur socho:** Typing ke baad input value attribute/current property ka difference kya hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-void

**Void elements kya hain; closing tags hote hain?**

Foundation · HTML

**Answer — reasoning samjho**

Void elements child content/end tag nahi rakhte. img,input,br,hr,meta,link,source,track,area,base,col,embed,wbr examples hain. `<img />` ka slash HTML mein general self-closing mechanism nahi banata. Non-void `<div />` parsed closed div nahi hai. Isliye script jaisa non-void tag proper closing tag maangta hai; warna baaki markup wrong parse ho sakta hai.

```html
<img src="lesson.webp" alt="A learner drawing a graph">
<input name="email" type="email">
```

**Follow-up — aur socho:** `<script />` rest HTML document kyun tod sakta hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-lists

**Ordered, unordered aur description lists ka difference?**

Foundation · HTML

**Answer — reasoning samjho**

Sequence/rank important ho toh ol; order meaning na ho toh ul; term-description/name-value group ke liye dl. ol/ul ke andar li, dl mein dt/dd use karo. Bullets CSS se hide karne par semantics nahi hatati. Meaningful group mein multiple terms/descriptions ho sakte hain. Menu visually row mein hone se ordered-list semantics automatically required nahi hoti.

```html
<ol><li>Read</li><li>Practice</li></ol>
<ul><li>Java</li><li>React</li></ul>
<dl><dt>Closure</dt><dd>A function with access to lexical bindings.</dd></dl>
```

**Follow-up — aur socho:** Menu links row mein hain, isliye ol required hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-id-class

**class aur id ka difference kya hai?**

Foundation · HTML

**Answer — reasoning samjho**

class reusable space-separated tokens hain; element multiple classes rakh sakta hai. id document mein unique element identity hai; fragment navigation aur label association mein use hoti hai. CSS .field class, #course-search ID select karta hai. Har styling ID se karne par specificity/reuse cost badhti hai. Duplicate label-target IDs accessibility association ambiguous bana sakte hain.

```html
<label for="course-search">Find a course</label>
<input id="course-search" class="field field-wide">
```

**Follow-up — aur socho:** Label referenced ID two inputs share karein toh kya tootega?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-emphasis

**strong/b aur em/i ka difference kya hai?**

Foundation · HTML

**Answer — reasoning samjho**

strong importance/seriousness/urgency dikhata hai; b extra importance bina attention deta hai. em stress emphasis, i alternate voice/convention jaise technical term mark karta hai. Default bold/italic style definition nahi. Sirf visual style chahiye toh CSS lo. em kis word par hai usse spoken stress aur intended meaning badal sakta hai, words same rehkar bhi.

```html
<p><strong>Save your draft before resetting.</strong></p>
<p>I asked for <em>one</em> example.</p>
<p>The term <i>lexical scope</i> describes lookup by source nesting.</p>
```

**Follow-up — aur socho:** Same words mein em position change meaning kaise badal sakti hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-document

**head/body mein kya aata hai; header/nav/main/aside/footer ka role?**

Foundation · HTML

**Answer — reasoning samjho**

head metadata: title, charset, CSS links, suitable scripts. body actual page content. header introduction, nav major navigation, main dominant content, aside related-tangential content, footer closing info. article independently meaningful unit; section thematic grouping usually heading ke saath. Article apna header/footer rakh sakta hai. Yeh semantic roles pixel position prescribe nahi karte; layout CSS decide karti hai.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Notes</title></head>
<body><header><h1>Study notes</h1></header><nav aria-label="Main"><a href="/">Home</a></nav><main><article><h2>Closures</h2><p>One concept...</p></article></main><footer>About this collection</footer></body></html>
```

**Follow-up — aur socho:** Article ka apna header/footer kab ho sakta hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-iframe

**Ek webpage doosri mein embed kaise karoge?**

Intermediate · HTML

**Answer — reasoning samjho**

iframe separate browsing context embed karta hai. Descriptive title aur deliberate limited sandbox/permissions do. Embedded server security headers se framing refuse kar sakta hai; cross-origin rules arbitrary DOM access rokti hain. Cooperation postMessage contract se karo: expected origin/source aur payload validate karo. Iframe ordinary component se heavier hai; isolation bypass karne ki approach mat lo.

```html
<iframe src="/demo.html" title="Binary search demonstration" loading="lazy"></iframe>
```

**Follow-up — aur socho:** Message receiver origin/payload ke kaunse checks kare?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-links

**href/target kaise work karte hain aur link versus a kya hai?**

Foundation · HTML

**Answer — reasoning samjho**

Anchor href navigation banata hai. _self current, _blank new, _parent parent, _top top-level context; named target existing named context reuse kar sakta hai. link element stylesheet jaisi resource relationship batata hai, usually head mein hota hai. Navigation bina action ke liye button lo. New tab user ke liye useful hai ya nahi, deliberately decide karo.

```html
<link rel="stylesheet" href="/styles.css">
<a href="/notes" target="_blank" rel="noopener">Open notes</a>
<a href="#practice">Jump to practice</a>
```

**Follow-up — aur socho:** Action ke liye href="#" weak substitute kyun hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-scripts

**Scripts head/body mein kab; defer/async/modules loading kaise badalte hain?**

Intermediate · HTML

**Answer — reasoning samjho**

Classic external script without async/defer encountered position par parsing block karta hai. Body-end se earlier DOM pehle parse hota hai. Head+defer parallel download, parse ke baad document-order execution, DOMContentLoaded se pehle. async ready hote hi execute, order guarantee nahi. Modules default deferred hain unless async scheduling badle. Independent work ke liye async; same app dono example ways se load mat karo.

```html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
```

**Follow-up — aur socho:** Async script later DOM element query karke fail kyun ho sakti hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-forms

**HTML forms aur important defaults kaise work karte hain?**

Foundation · HTML

**Answer — reasoning samjho**

Form successful named controls action URL ko submit karta hai. Default method GET; omitted action current document. Form button default submit, unless type specify karo. Disabled controls submit nahi hote; browser validation submission rok sakti hai. Enter implicit submit controls par depend hai. Client preventDefault alternative flow de sakta hai, lekin server validation phir bhi required hai.

```html
<form action="/search" method="get">
  <label for="q">Search</label><input id="q" name="q" required>
  <button type="submit">Find</button>
  <button type="button">Show help</button>
</form>
```

**Follow-up — aur socho:** Input ka name hatane par submitted query kyun disappear hogi?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-events

**HTML interaction JavaScript se kaise handle karoge?**

Foundation · HTML

**Answer — reasoning samjho**

Inline event attributes possible hain; addEventListener behavior separate, multiple listeners aur cleanup support karta hai. Semantic control use karo aur element exist hone ke baad listener register karo. Event object se action inspect karo. Remove ke liye same callback identity chahiye; fresh arrow same body hone par bhi different function hai. Owner destroy par cleanup karo.

```html
<button id="practice" type="button">Practice</button>
<script>
const button = document.querySelector('#practice');
const start = () => console.log('Starting a round');
button.addEventListener('click', start);
// On teardown: button.removeEventListener('click', start);
</script>
```

**Follow-up — aur socho:** Fresh arrow se listener removal kyun nahi hoga?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-evolution

**HTML5 ke major goals/improvements kya the?**

Foundation · HTML

**Answer — reasoning samjho**

HTML5 effort ne compatible parsing aur web-app features standardize kiye: semantic landmarks, native audio/video, richer forms, canvas. Existing content compatibility important thi. Modern HTML Living Standard hai, frozen new-tags list nahi. Storage/workers broader web platform hain, HTML tags nahi. Features accessibility/behavior se choose aur audience support verify karo. HTML5 JavaScript replace nahi karta; structure aur behavior complementary hain.

**Follow-up — aur socho:** HTML5 ne JavaScript replace kiya, yeh claim wrong kyun?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-media

**audio/video kaise work karte hain; source/track kya add karte hain?**

Foundation · HTML

**Answer — reasoning samjho**

audio/video native playback, source candidate formats, track WebVTT captions jaise timed text deta hai. controls playback UI expose karta hai. Autoplay browser policy se restricted hai; page understanding us par depend na ho. Meaningful captions/transcripts aur network cost consider karo. Video fallback text unsupported player ke liye hai; supported playback mein speech captions ki need phir bhi hai.

```html
<video controls preload="metadata" poster="preview.webp">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson-en.vtt" srclang="en" label="English" default>
  <a href="lesson.mp4">Download the lesson</a>
</video>
```

**Follow-up — aur socho:** Fallback paragraph captions replace kyun nahi karta?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-headings

**header/h1 ka relation kya hai; har header mein h1 required hai?**

Foundation · HTML

**Answer — reasoning samjho**

header introductory content group karta hai; h1 heading rank hai. Header logo/nav/heading rakh sakta hai; h1 ko header parent required nahi. Old proposed automatic outline algorithm par multiple h1 reinterpret karne ke liye rely mat karo. Clear page heading aur explicit h2/h3 hierarchy lo. Heading navigation meaning se test karo, font sizes se nahi.

```html
<header><h1>Java revision</h1><p>Practice by topic</p></header>
<main><section><h2>Collections</h2><h3>Hash maps</h3></section></main>
```

**Follow-up — aur socho:** Font size dekhe bina heading navigation kaise verify karoge?

[Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)

## iq-added-html-drag

**Native drag-drop kya deta hai; image draggable kaise?**

Intermediate · HTML

**Answer — reasoning samjho**

Drag events/DataTransfer data transfer dete hain. Images generally default draggable hain; contract mein explicit draggable rakho. Drop accept karne ke liye normally dragover default cancel karo. Dropped HTML/URL validate karo; event se aane par trusted nahi bante. Keyboard/touch alternative, jaise Move up/down, do. Dragging enhancement ho, action ka only accessible route nahi.

```html
<img id="tile" src="tile.webp" alt="Graph lesson" draggable="true">
<script>
document.querySelector('#tile').addEventListener('dragstart', event => {
  event.dataTransfer.setData('text/plain', 'lesson-graph');
});
</script>
```

**Follow-up — aur socho:** Drag event ka HTML/URL automatically trusted kyun nahi?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-responsive-images

**CSS sizing, srcset/sizes/picture responsive images kaise banate hain?**

Intermediate · HTML

**Answer — reasoning samjho**

CSS layout size, srcset/sizes suitable width-density source selection, picture alternate crop/format choose karne mein help karte hain. Width/height se aspect-ratio space reserve karke shifts roko. sizes actual rendered layout reflect kare. Phone ka crop alag chahiye toh picture media lo; sirf fewer bytes nahi. width:100% alone downloaded source size optimize nahi karta.

```html
<img src="notes-800.webp" srcset="notes-400.webp 400w, notes-800.webp 800w" sizes="(max-width: 600px) 100vw, 600px" width="800" height="450" alt="Notes arranged by topic" style="max-width:100%;height:auto">
```

**Follow-up — aur socho:** width:100% par bhi huge image download kyun ho sakti hai?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-manifest

**Web app manifest aur old AppCache ka difference kya hai?**

Intermediate · HTML

**Answer — reasoning samjho**

Old html manifest attribute Application Cache configure karta tha; AppCache obsolete hai. Modern web app manifest JSON mein app identity/icons/start URL/display preferences deta hai aur head se link hota hai. Woh requests cache nahi karta. Offline caching ke liye service-worker strategy, update behavior aur offline limits alag define karo. Install metadata aur offline guarantee same nahi.

```html
<link rel="manifest" href="/app.webmanifest">
```

**Follow-up — aur socho:** Sirf manifest add karke offline mein kya fail rahega?

[Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

## iq-added-html-data

**Data attributes kya hain aur access kaise karte hain?**

Foundation · HTML

**Answer — reasoning samjho**

data-* small app-specific string values valid custom attributes mein rakhta hai. dataset camelCase naam deta hai: data-max-count→dataset.maxCount. Scripts/users inhe read kar sakte hain, secrets store mat karo. Required values validate/convert karo; blank aur malformed number alag handle karo. Data attribute accessible label ka substitute nahi hai; UI semantics separately rakho.

```html
<button data-lesson-id="42">Open lesson</button>
<script>
const button = document.querySelector('[data-lesson-id]');
console.log(button.dataset.lessonId); // '42', a string
</script>
```

**Follow-up — aur socho:** data-max-count ka dataset naam aur numeric validation kya hogi?

[HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)

## iq-added-html-shadow-dom

**Shadow DOM kya hai? Example aur limits samjhao.**

Intermediate · HTML

**Answer — reasoning samjho**

Shadow DOM host se attached encapsulated subtree hai, often web components mein. Style scope internals isolate karta hai; slots light-DOM content project karte hain. React render representation se alag aur security boundary nahi. Composed events/inherited CSS boundaries cross kar sakte hain. Example fixed trusted markup use karta hai; untrusted string innerHTML mein interpolate mat karo.

```js
const host = document.createElement('div');
const shadow = host.attachShadow({mode: 'open'});
shadow.innerHTML = '<style>p { color: teal; }</style><p>Local styling</p>';
document.body.append(host);
```

**Follow-up — aur socho:** Composed events/inherited properties complete isolation claim ko kaise limit karte hain?

[Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

## iq-added-css-display

**inline, block, inline-block, flex aur grid ka difference?**

Foundation · CSS

**Answer — reasoning samjho**

display box generation/layout participation decide karta hai. Normal block new line, inline line flow, inline-block inline participation plus box sizing deta hai. Flex/grid direct children layout banate hain; outer display normally block, inline variants possible. display:none no box. Yeh permanent HTML categories nahi, CSS behavior hai. Modes ki fixed count ratne se better exact layout contract samjho.

```css
.badge { display: inline-block; padding: .25rem .5rem; }
.cards { display: grid; grid-template-columns: repeat(2, 1fr); }
```

**Follow-up — aur socho:** Normal inline span par width block jaisa kyun behave nahi karti?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-position

**static, relative, absolute, fixed, sticky ka difference?**

Intermediate · CSS

**Answer — reasoning samjho**

position CSS property hai. static normal flow; relative original space preserve karke visually offset. absolute flow se bahar aur containing block, often positioned ancestor, use karta hai. fixed commonly viewport, lekin transformed ancestor containing block ban sakta hai. sticky flow mein rehta aur scroll constraints/inset par stick karta hai. Absolute badge original space reserve nahi karta.

```css
.card { position: relative; }
.badge { position: absolute; top: .5rem; right: .5rem; }
.toolbar { position: sticky; top: 0; }
```

**Follow-up — aur socho:** Ancestor mein movement room na ho toh sticky kyun fail dikhega?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-hidden

**display:none, visibility:hidden, opacity:0 ka difference?**

Foundation · CSS

**Answer — reasoning samjho**

display:none generated box/layout space hataata hai. visibility:hidden generally space rakhta par visibility/normal interaction/focus hataata hai. opacity:0 transparent box rakhta jo separately disabled na ho toh pointer/focus receive kar sakta hai. First two generally accessibility tree se bhi hide hote hain. Choice mein layout, interaction aur accessibility teeno dekho; transparent overlay clicks block kar sakti hai.

```css
.removed { display: none; }
.reserved { visibility: hidden; }
.transparent { opacity: 0; }
```

**Follow-up — aur socho:** Invisible opacity-zero overlay visible buttons block kyun kar sakti hai?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-stylesheets

**Stylesheet kya hai aur HTML mein CSS apply karne ke three ways?**

Foundation · CSS

**Answer — reasoning samjho**

Stylesheet CSS rules ka collection hai. External link reusable/cacheable file; internal style page-specific; inline style element-local but scale par harder maintain. CSS imports/programmatic APIs bhi hain; “three ways” common organization model hai, exhaustive mechanism count nahi. Later external CSS normal inline declaration automatically override nahi karti; full cascade precedence apply hoti hai.

```html
<link rel="stylesheet" href="/site.css">
<style>.note { padding: 1rem; }</style>
<p class="note" style="color:teal">Practice daily</p>
```

**Follow-up — aur socho:** Later external stylesheet har inline declaration override kyun nahi karti?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-specificity

**Specificity kya hai aur !important cascade mein kahan fit hota hai?**

Intermediate · CSS

**Answer — reasoning samjho**

Specificity se pehle origin, importance aur layer order decide hota hai. Phir IDs, class/attribute/pseudo-class, element/pseudo-element weights lexicographically compare karo. Same context/equal weight mein later wins. Inline normal stylesheet se special precedence rakhta hai; !important flag hai, extra specificity digit nahi. :where zero; :is arguments ki specificity leta hai. Simple selectors/layers prefer karo.

```css
p.note { color: teal; } /* 0 IDs, 1 class, 1 type */
#intro { color: purple; } /* 1 ID wins in the same normal layer */
```

**Follow-up — aur socho:** More-specific selector higher-priority layer se kyun haar sakta hai?

[CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)

## iq-added-css-box

**Box model aur box-sizing width ko kaise affect karte hain?**

Foundation · CSS

**Answer — reasoning samjho**

Andar se content→padding→border→margin. content-box width sirf content, padding/border extra. border-box width content+padding+border include, margin outside. Example default card border-box width 244px; border-box mode mein total 200px aur content 156px. Margins declared width ke andar nahi aati. Vertical height mein margin collapse/inline behavior simple addition ko affect kar sakte hain.

```css
.card { width: 200px; padding: 20px; border: 2px solid; margin: 10px; }
.compact { box-sizing: border-box; }
```

**Follow-up — aur socho:** Margin collapsing/inline layout simple total-height arithmetic kyun todte hain?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-center

**Element ko parent/viewport mein center kaise karoge?**

Foundation · CSS

**Answer — reasoning samjho**

Two-axis centering ke liye flex parent mein justify-content aur align-items center karo. Vertical centering dikhne ke liye available height/min-height chahiye. Sirf horizontal narrower block ko margin-inline:auto de sakte ho. Growing content clip na ho isliye min-height useful hai. flex-direction axes swap karega; dono axes center hain toh center result preserve rahega.

```html
<main class="screen"><div class="card">Revision</div></main>
<style>
body { margin: 0; }
.screen { min-height: 100vh; min-height: 100dvh; display: flex; justify-content: center; align-items: center; }
.card { width: min(90%, 24rem); padding: 1rem; box-sizing: border-box; }
</style>
```

**Follow-up — aur socho:** flex-direction column par axes kya badlenge; example phir bhi center kyun hai?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-triangle

**Borders se CSS triangle kaise banta hai?**

Intermediate · CSS

**Answer — reasoning samjho**

Zero-size box ke thick borders triangular regions banate hain. Three borders transparent, remaining colored rakho. Colored bottom border upward triangle deta hai; right-pointing ke liye left border color karo aur others adjust karo. Decoration ke liye suitable; meaningful icon ka accessible name/text bhi chahiye. Complex scalable shape mein SVG/clip-path clearer ho sakta hai.

```html
<span class="triangle" aria-hidden="true"></span>
<style>
.triangle { display: inline-block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 14px solid teal; }
</style>
```

**Follow-up — aur socho:** Whole layout rotate kiye bina triangle right-pointing kaise banega?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-pseudo

**Pseudo-element aur pseudo-class ka difference?**

Foundation · CSS

**Answer — reasoning samjho**

Pseudo-elements element part/generated box select karte hain: ::first-letter, ::before, ::after, ::selection. Pseudo-classes state/relationship select karti hain, jaise :hover/:focus-visible. Essential information sirf generated content mein mat rakho. Required form field real label aur form semantics se express karo. Void input ke before/after par dependable essential text attach karna reliable approach nahi.

```css
.required::after { content: ' *'; color: darkred; }
button:focus-visible { outline: 3px solid teal; }
```

**Follow-up — aur socho:** Void input par essential text ke liye ::before reliable kyun nahi?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-flex

**Flex container/item ki main properties kya hain?**

Intermediate · CSS

**Answer — reasoning samjho**

Container: display:flex layout; direction main axis; wrap multiple lines; flow shorthand; justify main-axis space; align-items cross-axis items; align-content multiple lines; gap gutters. Item: order visual order; grow positive space; shrink basis-weighted shrinkage; basis starting main size; flex shorthand; align-self individual alignment. Visual reorder reading/keyboard order automatically nahi badalta. Long child ko min-width:0 chahiye ho sakta hai.

```css
.row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.main { flex: 1 1 16rem; min-width: 0; }
.tools { flex: 0 0 auto; }
```

**Follow-up — aur socho:** flex-shrink ke baad bhi long child ko min-width:0 kyun chahiye ho sakta hai?

[Flexbox basic concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)

## iq-added-css-flex-lab

**Flexbox se responsive header aur equal-width cards banao.**

Intermediate · CSS

**Answer — reasoning samjho**

Yeh supplied images se alag original layout exercise hai. Header mein brand left, wrapping actions right; cards available space share aur narrow screen par wrap karein. Neeche basis/grow se layout banti hai; browser width fixed assumptions mat rakho. 320px, long link labels, zoom aur keyboard order test karo. Last card stretch rule ko deliberate item styling se choose karo.

```html
<header class="bar"><strong>Shortnotes</strong><nav class="actions" aria-label="Main"><a href="/">Read</a><a href="/practice">Practice</a></nav></header>
<section class="cards" aria-label="Courses"><article>JavaScript</article><article>React</article><article>Java</article></section>
<style>
.bar,.actions,.cards { display:flex; gap:1rem; flex-wrap:wrap; }
.bar { justify-content:space-between; align-items:center; }
.cards > article { flex:1 1 14rem; min-width:0; padding:1rem; border:1px solid; }
</style>
```

**Follow-up — aur socho:** Viewport hard-code bina sirf last card ka stretching kaise rokoge?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-viewport

**vh/vw kya hain; dynamic viewport units kab useful hain?**

Foundation · CSS

**Answer — reasoning samjho**

1vw viewport width ka 1%; 1vh height reference ka 1%. Mobile controls visible space badalti hain; svh/lvh/dvh small/large/dynamic viewport heights distinguish karte hain. Growing screens par flexible min-height prefer karo. Ordinary block ka 100vw scrollbar space include karke horizontal overflow la sakta hai; width:100% parent fit karta hai. Font scaling sensible min/max se bound karo.

```css
.page { min-height: 100vh; min-height: 100dvh; }
.title { font-size: clamp(1.5rem, 4vw, 3rem); }
```

**Follow-up — aur socho:** Viewport font size mein sensible min/max kyun chahiye?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-fonts-float

**Font face kaunsi property choose karti hai; float kab use karein?**

Foundation · CSS

**Answer — reasoning samjho**

font-family ordered typeface list plus generic fallback choose karta hai. @font-face downloadable resource define; weight/style variants choose karte hain. Text ko image ke around wrap karna ho toh float useful; full app layout mein flex/grid often clearer. flow-root float contain karne ka formatting context deta hai. Custom named font tab milega jab uski definition/resource load ho.

```css
body { font-family: 'Study Sans', system-ui, sans-serif; }
.article { display: flow-root; }
.article img { float: inline-start; width: 8rem; margin-inline-end: 1rem; }
```

**Follow-up — aur socho:** Float layout ko flex se different clearing/containment kyun chahiye?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-selectors

**div, p; div p; div ~ p; div + p; div > p kya select karte hain?**

Foundation · CSS

**Answer — reasoning samjho**

`div, p` dono types; `div p` any-depth p descendants; `div ~ p` same-parent later p siblings; `div + p` immediately-next p sibling; `div > p` direct p children select karta hai. Example descendants A/B, direct A, adjacent C, later C/D; comma div plus all four p leta hai. D ko nested section mein move karoge toh same-parent sibling relation tootegi.

```html
<div><p>A</p><section><p>B</p></section></div>
<p>C</p><p>D</p>
```

**Follow-up — aur socho:** D ko section mein move karne par div ~ p match rahega?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-evolution

**CSS2/CSS3 ka difference; kya CSS3 single current version hai?**

Foundation · CSS

**Answer — reasoning samjho**

CSS2 largely single spec thi, CSS2.1 ne behavior clarify kiya. Later CSS modular hai: selectors/color/layout/background independent levels par evolve karte hain. Media queries, rounded borders, transitions often CSS3 bucket mein bolte hain; flex/grid ki own specs hain. Module name/support check meaningful hai. Unsupported enhancement se basic use block na ho, progressive enhancement rakho.

**Follow-up — aur socho:** Selectors Level 4 ka matlab every module Level 4 kyun nahi?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-css-assets

**UX preserve karke asset loading optimize kaise karoge?**

Intermediate · CSS

**Answer — reasoning samjho**

Pehle critical rendering path measure karo. Suitable sized/compressed images, useful font subsets, compressed/cacheable versioned assets aur optional code splitting use karo. Below-fold image lazy, likely LCP image priority. Appropriate defer/modules; proven-critical resources hi preload. Example noncritical image ka hai. Excess preload bandwidth compete karta hai; small transfer size alone responsive interaction prove nahi karti.

```html
<img src="chart.webp" width="640" height="360" loading="lazy" alt="Topic completion chart">
```

**Follow-up — aur socho:** JS download fast lekin page unresponsive: kya inspect karoge?

[CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

## iq-added-js-loop-output

**Six delayed callbacks wala let loop kya print karega? sample call na ho toh?**

Foundation · JavaScript

```js
function sample() {
  for (let i = 0; i <= 5; i++) {
    setTimeout(() => console.log(i), 1000);
  }
}
sample();
```

**Answer — reasoning samjho**

console.log casing repair karke function call karo; definition alone nothing print karti hai. Ordinary run mein requested delay ke baad 0–5 eligible logs hain. Har let iteration ki binding alag. var karne par shared function-scoped i ki final value 6 sab callbacks dekhengi. Delay earliest scheduling threshold hai, exact appointment time nahi; i<5 se count/final value badalti hai.

```js
function sample() {
  for (let i = 0; i <= 5; i++) setTimeout(() => console.log(i), 1000);
}
sample();
```

**Follow-up — aur socho:** i<5 se callback count/final var value dono kyun badlenge?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-timer-order

**Timer a ko 2s baad, sync code b log karta hai. Extra timer bina a pehle kaise?**

Foundation · JavaScript

```js
setTimeout(() => console.log('a'), 2000);
console.log('b');
```

**Answer — reasoning samjho**

Original mein b then a, kyunki script timer se pehle finish hoti hai. Existing callback mein ordered operations rakho ya us timer ki completion promise await karo. Neeche dono delay ke baad a,b order mein hain. b elsewhere chahiye toh completion promise expose karo; thread block mat karo. Correct names setTimeout/console lowercase hain; exact 2000ms guarantee nahi.

```js
setTimeout(() => {
  console.log('a');
  console.log('b');
}, 2000);
```

**Follow-up — aur socho:** Busy event loop par exact 2000ms guarantee kar sakte ho?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-promise-basics

**Promises kya hain, three states aur callbacks se comparison kya hai?**

Foundation · JavaScript

**Answer — reasoning samjho**

Callback invoke karne ke liye supplied function hai; sync/async ya events mein repeatedly call ho sakti hai. Promise one eventual outcome hai: pending/fulfilled/rejected; then/catch/finally composable channel dete hain. Executor sync, reactions async. Resolved fourth state nahi: pending promise adopt ho sakti hai. Promises automatic cancellation/ongoing subscriptions replace nahi karti; inner promise return karo taaki chain complete work observe kare.

```js
const result = new Promise(resolve => resolve(21));
result.then(value => value * 2).then(console.log); // 42
```

**Follow-up — aur socho:** Inner promise return bhoolne se sequencing/errors kyun tootenge?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-rejection-output

**Promise msg-object se reject ho toh kya print hoga?**

Foundation · JavaScript

```js
const task = new Promise((resolve, reject) => {
  reject({msg: 'Something went wrong'});
});
task.then(value => console.log(value))
  .catch(error => console.log(error.msg));
```

**Answer — reasoning samjho**

Syntax repair ke baad rejection fulfillment handler skip karke catch tak jaati hai. Output `Something went wrong` hai. Catch callback undefined return karta hai, toh catch-produced promise undefined se fulfill hoti hai unless new error throw ho. Error object better stack context deta hai. Original brackets/casing galat hon toh intended trace se pehle syntax/identifier error aa sakti hai.

```js
const task = new Promise((resolve, reject) => {
  reject({msg: 'Something went wrong'});
});
task.then(value => console.log(value)).catch(error => console.log(error.msg));
```

**Follow-up — aur socho:** Catch log ke baad new Error throw kare toh kya badlega?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-delay-output

**await delay(6000) ke baad ten-second timer aur second log: timeline kya hai?**

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

**Answer — reasoning samjho**

Assume delay timer-settled promise hai aur async function/ES module mein run hai. Around 6s par second log aur ten-second timer schedule; first original start se around 16s eligible hai, 10s nahi. Load par later run ho sakta hai. Helper undefined ya await invalid context ho toh timing puzzle ke bajay error hai. Timer pehle schedule hota toh windows overlap karti.

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function run() {
  await delay(6000);
  setTimeout(() => console.log('first'), 10000);
  console.log('second');
}
run();
```

**Follow-up — aur socho:** Ten-second timer six-second await se pehle schedule ho toh?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-await-timers

**await setTimeout callback wait kyun nahi karta; a/b/c/d/e repair kaise?**

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

**Answer — reasoning samjho**

Ordinary browser setTimeout handle deta hai, completion promise nahi. Await handle ko wrap karke microtask se resume karta hai; callback ka wait nahi. Corrected original normally a,b,e,d,c deta hai for 1000/0 delays. Repaired promise-based version a,b,c,d,e hai. Await is async function pause karta hai, whole thread nahi. ES module top-level await valid context hai.

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

**Follow-up — aur socho:** ES module mein top-level await valid, normal function mein kyun nahi?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-callback-hell

**Callback hell kya hai; async/await design kab improve karte hain?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Nested dependent callbacks success/error/control-flow mix kar deti hain. Promises returnable operations, async/await try/catch ke saath dependent sequence readable banate hain. Independent operations suitable ho toh concurrent rakho. Callback API ko pehle correctly adapt karo; await arbitrary registration ko completion wait nahi banata. Repeated events ke liye callbacks appropriate hain; every callback promise mein replace karna goal nahi.

```js
// Application excerpt: these three helpers return promises.
async function enroll(userId) {
  const user = await loadUser(userId);
  const course = await chooseCourse(user);
  return saveEnrollment(user.id, course.id);
}
```

**Follow-up — aur socho:** Course selection user load se independent ho toh kya parallel chalega?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-node-nexttick

**process.nextTick aur setImmediate ka difference?**

Intermediate · Node.js

**Answer — reasoning samjho**

Dono Node-specific scheduling APIs hain. nextTick current JS operation ke baad checkpoint mein ordinary event-loop phases se pehle queued work chalata hai. setImmediate check phase mein loop progress allow karta hai. Recursive nextTick I/O starve kar sakta hai. Promise order ki blanket guarantee mat banao: ES-module evaluation aur already-running microtasks context badalte hain. Browser standard APIs nahi hain.

```js
// Run as a CommonJS .cjs file.
process.nextTick(() => console.log('tick'));
setImmediate(() => console.log('immediate'));
console.log('sync');
// sync, tick, immediate
```

**Follow-up — aur socho:** Long CPU task responsive chunks ke liye nextTick weak kyun hai?

[Node nextTick scheduling](https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick)

## iq-added-node-immediate-output

**Node mein setImmediate, setTimeout(0), sync log ka order?**

Intermediate · Node.js

```js
// Run in Node, not a browser.
setImmediate(() => console.log('first'));
setTimeout(() => console.log('second'), 0);
console.log('third');
```

**Answer — reasoning samjho**

Names setImmediate,setTimeout,console.log correct karo. Third sync log pehle. Top-level immediate versus zero-timer order portable guarantee nahi; timing/context par depend hai. Ordinary I/O callback ke andar dono schedule hon toh immediate newly-scheduled timer se pehle expected hai. Ek observed run memorize mat karo. Browser mein standard setImmediate/process.nextTick available nahi.

```js
// Node script
setImmediate(() => console.log('first'));
setTimeout(() => console.log('second'), 0);
console.log('third');
```

**Follow-up — aur socho:** Top-level deterministic claim bina I/O-callback experiment kaise banaoge?

[Node setImmediate scheduling](https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate)

## iq-added-js-array-methods

**forEach/map/filter/reduce ka difference kya hai?**

Foundation · JavaScript

**Answer — reasoning samjho**

forEach visited items par callback chala kar undefined; map transformed array; filter matching items; reduce accumulated result deta hai. Examples input array mutate nahi karte, lekin callback referenced objects mutate kar sakta hai. Explicit initial accumulator se empty reduce defined rahega. Async forEach callback promises ignore hoti hain; sequence ke liye for...of, concurrent wait ke liye map/combinator lo.

```js
const minutes = [5, 10, 15];
console.log(minutes.map(n => n * 2)); // [10,20,30]
console.log(minutes.filter(n => n >= 10)); // [10,15]
console.log(minutes.reduce((sum, n) => sum + n, 0)); // 30
console.log(minutes.forEach(n => n + 1)); // undefined
```

**Follow-up — aur socho:** Async forEach all-callback completion promise kyun nahi return karta?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-object-enumeration

**Object properties count aur values-only print kaise?**

Foundation · JavaScript

**Answer — reasoning samjho**

Ordinary object ki universal length nahi. Object.keys own enumerable string keys; values unki values; entries pairs deta hai. Inherited/symbol properties exclude hoti hain. Reflect.ownKeys all own strings/symbols, non-enumerable bhi include karta hai. Pehle property category define karo. for...in inherited enumerable strings visit kar sakta hai, isliye Object.values se result different ho sakta hai.

```js
const progress = {java: 3, react: 5};
console.log(Object.keys(progress).length); // 2
for (const value of Object.values(progress)) console.log(value); // 3, 5
```

**Follow-up — aur socho:** for...in Object.values se extra values kyun de sakta hai?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-array-check

**Array ka typeof kya hai; reliable detection kaise?**

Foundation · JavaScript

**Answer — reasoning samjho**

Array object hai, isliye typeof []='object'. Array.isArray actual array detect aur cross-realm iframe arrays bhi support karta hai; instanceof Array particular realm constructor se tied hai. Array-like aur typed arrays separate categories hain. Indexed properties/length enough proof nahi. Array.from iterable/array-like ko actual array convert karne mein useful hai jab isArray false ho.

```js
console.log(typeof []); // 'object'
console.log(Array.isArray([])); // true
console.log(Array.isArray({0: 'a', length: 1})); // false
console.log(Array.isArray(new Uint8Array(2))); // false
```

**Follow-up — aur socho:** Array.isArray false ho tab Array.from kab useful hai?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-es6

**Ten ES2015 features examples se samjhao; later features mix mat karo.**

Intermediate · JavaScript

**Answer — reasoning samjho**

ES6=ES2015. Ten features: block bindings, arrows, templates, destructuring, defaults, rest parameters, iterable spread, classes, modules, promises. Neeche code dry-run karo. Module feature ke liye separate files mein `export const goal=3` aur `import {goal} from './goal.js'` lo. Async/await aur object spread later additions hain.

1. let reassign ho sakta, const nahi; dono block scope/TDZ follow karte hain.
2. Arrow lexical this rakhti hai, constructor nahi banti.
3. Template expressions/newlines allow karti hai, HTML sanitize nahi.
4. Destructuring named/positional values nikalti hai; missing ke defaults explicit hon.
5. Parameter default omitted/undefined par, null par nahi.
6. Rest remaining arguments ka actual array banata hai.
7. Iterable spread calls/arrays expand; nested references shared rehti hain.
8. Class constructor/prototype methods organize karti hai; method bodies strict hain.
9. Modules scope/dependencies aur live exported bindings dete hain.
10. Promise one outcome compose karti hai; CPU ko another thread nahi bhejti.

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

**Follow-up — aur socho:** Three features ki ek-ek limitation/surprise batao.

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-function-forms

**Function definition, declaration, expression, anonymous aur higher-order ka difference?**

Foundation · JavaScript

**Answer — reasoning samjho**

Definition parameters/behavior likhti hai; call arguments ke saath execute karti hai. Declaration named binding banati hai; expression function value produce karti hai, named ya anonymous. Higher-order function functions accept/return karti hai. square pass karna function deta hai; square(4) pass karna result deta hai. Callback role hai, separate syntax nahi. Named expression inner name se recursion/debugging help karti hai.

```js
function square(n) { return n * n; } // declaration
const triple = function (n) { return n * 3; }; // anonymous expression
function transform(value, operation) { return operation(value); }
console.log(transform(4, square)); // 16
console.log(transform(4, triple)); // 12
```

**Follow-up — aur socho:** Named expression recursion/debugging help karke inner name local kaise rakhti hai?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-iife

**IIFE kya hai aur ab bhi kab useful hai?**

Intermediate · JavaScript

**Answer — reasoning samjho**

IIFE function expression ko turant call karti hai. Temporary bindings isolate ya top-level await unavailable context mein async entry bana sakti hai. Modules/block scope many old global-variable problems solve karte hain. Example minutes local hai. Async IIFE promise return karti hai; rejection handle karna zaroori hai. Previous expression ke saath accidentally join na ho, semicolon boundary rakho.

```js
const initialTotal = (() => {
  const minutes = [5, 10];
  return minutes.reduce((sum, n) => sum + n, 0);
})();
console.log(initialTotal); // 15
```

**Follow-up — aur socho:** Previous expression ke baad IIFE ko semicolon boundary kyun chahiye ho sakti hai?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-memoization

**Memoization implement karo aur invalid cache cases samjhao.**

Intermediate · JavaScript

**Answer — reasoning samjho**

Memoization same input ka previous result reuse karti hai. Key mein all result-affecting inputs aur freshness policy honi chahiye. Example single-number function ka hai, universal memoizer nahi. Map.has cached zero/undefined distinguish karta hai. Unbounded inputs memory retain; mutable external dependency stale result la sakti hai. User-specific async work mein identity, rejected-result policy aur eviction explicitly design karo.

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

**Follow-up — aur socho:** User-specific async query ke keys/eviction kaise design karoge?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-call-apply-bind

**call/apply/bind kab use karoge?**

Intermediate · JavaScript

**Answer — reasoning samjho**

call regular function ko explicit this/separate args se invoke karta hai. apply same receiver plus array-like args leta hai. bind new function with fixed receiver/optional leading args return karta hai; immediately invoke nahi karta. Arrow ka lexical this inse replace nahi hota. Removal ke liye bound callback store karo; two bind calls two different identities banati hain.

```js
function total(extra) { return this.minutes + extra; }
const learner = {minutes: 20};
console.log(total.call(learner, 5)); // 25
console.log(total.apply(learner, [7])); // 27
const later = total.bind(learner, 10);
console.log(later()); // 30
```

**Follow-up — aur socho:** Two independent bind calls ke callbacks strictly equal kyun nahi?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-create-objects

**Objects create karne ke three ways aur prototype methods ka role?**

Foundation · JavaScript

**Answer — reasoning samjho**

Object literal direct record; Object.create chosen prototype; constructor/class shared prototype behavior ke instances banate hain. Yeh three teaching groups hain, all APIs ki fixed count nahi. Object.prototype ka toString/isPrototypeOf inherited behavior; Object.keys/create/hasOwn static methods hain. Null-prototype object inherited methods nahi rakhta. Isliye obj.hasOwnProperty callable assume karne ke bajay Object.hasOwn safer hai.

```js
const literal = {title: 'Arrays'};
const behavior = {label() { return this.title; }};
const inherited = Object.create(behavior); inherited.title = 'Trees';
class Lesson { constructor(title) { this.title = title; } label() { return this.title; } }
console.log(inherited.label(), new Lesson('Graphs').label()); // Trees Graphs
```

**Follow-up — aur socho:** obj.hasOwnProperty callable assume karne se Object.hasOwn safer kyun hai?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-method-chaining

**Method chaining versus prototype chain kya hai?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Method chaining previous method ke result par next method call karti hai. Mutable fluent API often this return, immutable version new value return karti hai. Prototype chain inherited property lookup ka mechanism hai, chaining se alag. Example intentionally mutable hai; validation/mutation contract document karo. Fresh-return version aliases ka existing object mutate nahi karega, caller ko result retain karna hoga.

```js
const progress = {
  minutes: 0,
  add(n) { this.minutes += n; return this; },
  reset() { this.minutes = 0; return this; }
};
console.log(progress.add(5).add(10).minutes); // 15
```

**Follow-up — aur socho:** add fresh value return kare toh aliasing kya badlegi?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-pass-values

**JS object passing mein mutation/reassignment ka difference dikhao.**

Foundation · JavaScript

**Answer — reasoning samjho**

JavaScript values pass karta hai. Object value object ko refer karti hai, toh caller/callee same mutable object access kar sakte hain. Parameter reassign caller variable reassign nahi karta. Is difference bina pass-by-reference bolna misleading hai. Replacement chahiye toh new object return aur call site par assign karo. Primitive number reassign sirf local parameter badlega.

```js
function revise(note) {
  note.done = true;
  note = {done: false};
}
const original = {done: false};
revise(original);
console.log(original.done); // true
```

**Follow-up — aur socho:** Object ki jagah number pass karke parameter reassign ho toh?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-null-types

**null, undefined, NaN aur value types ka difference?**

Foundation · JavaScript

**Answer — reasoning samjho**

Types values ke hain; variable later different type hold kar sakta hai. Primitives undefined,null,boolean,number,bigint,string,symbol; objects doosri main category. undefined often missing/unassigned-to-value; null explicit absence convention. NaN invalid numeric result ka number value hai, own type nahi. Number.isNaN noncoercing check deta hai. null==undefined special comparison unki identical identity/type prove nahi karti.

```js
console.log(null === undefined); // false
console.log(null == undefined); // true
console.log(typeof null); // 'object', historical behavior
console.log(typeof NaN); // 'number'
console.log(Number.isNaN(Number('notes'))); // true
```

**Follow-up — aur socho:** NaN===NaN false lekin Object.is(NaN,NaN) true kyun?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-escape

**Escape sequences kya hain aur kyun use hoti hain?**

Foundation · JavaScript

**Answer — reasoning samjho**

Escapes quotes,newline,tab,backslash jaise characters source mein represent karte hain. Source representation aur actual characters alag layers hain. Normal string mein backslash+n newline, escaped backslash+n literal slash-n deta hai. Template actual line breaks allow karti hai. JSON ke andar JS ya regex embed ho toh har layer ka escaping separately samjho; printed output se verify karo.

```js
const quoted = 'It\'s time to study';
const folder = 'C:\\notes';
console.log(quoted); // It's time to study
console.log(folder); // C:\notes
```

**Follow-up — aur socho:** JSON, JS source aur regex ke escaping layers alag kyun samajhne hain?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-break-continue

**break aur continue ka difference?**

Foundation · JavaScript

**Answer — reasoning samjho**

break nearest applicable loop/switch exit; continue current iteration ka rest skip karke next iteration step par jaata hai. Dono containing function return nahi karte. Nested loops ka unlabeled break sirf nearest loop exit karta hai. while mein continue terminating update skip kare toh infinite loop ho sakta hai. Entire function processing stop karni ho toh return use karo.

```js
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 2) continue;
  if (n === 4) break;
  console.log(n);
}
// 1, 3
```

**Follow-up — aur socho:** Function return karke whole processing kaise stop karoge?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-event-phases

**Capture, bubble, preventDefault, stopPropagation ka difference?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Capture ancestors se target ki taraf; bubbling target se ancestors ki taraf for bubbling events. stopPropagation next propagation rokti hai, default navigation nahi. preventDefault cancelable browser action rokti hai, propagation nahi; passive listener cancel nahi kar sakta. stopImmediatePropagation same target ke later listeners bhi rokta hai. Example ancestor capture listener bubble se pehle chalega.

```js
// Browser excerpt: list is an existing element containing buttons.
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (button && list.contains(button)) console.log(button.dataset.id);
});
list.addEventListener('click', () => console.log('capture'), {capture: true});
```

**Follow-up — aur socho:** Link propagation stop karne se navigation necessarily kyun nahi rukti?

[JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## iq-added-js-browser-storage

**localStorage/sessionStorage/IndexedDB/cookies/memory kab choose karoge?**

Intermediate · JavaScript

**Answer — reasoning samjho**

localStorage synchronous origin-scoped strings, generally sessions ke across; sessionStorage origin+tab page-session scoped, reload survive. IndexedDB async structured/large data; memory temporary state. Cookies matching HTTP requests ke saath ja sakti hain, server sessions mein useful. Storage/quota failure handle karo. Session cookie ke HttpOnly/Secure/SameSite/expiry/CSRF rules define karo. JS-readable storage injected scripts se exposed; persistence deletion/eviction guarantee nahi.

```js
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('draftTitle', 'Closures');
```

**Follow-up — aur socho:** Session ID ko convenience ke liye localStorage mein kyun na rakho?

[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

## iq-added-js-workers

**Web Workers kya hain aur page se kaise communicate karte hain?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Worker another execution context mein scripts chalata hai, CPU-heavy work main thread monopolize nahi karta. Direct page DOM access nahi; structured-cloned/transferable messages use karo. Example result 8 hai. Startup/transfer cost, errors, stale results aur termination account karo. Tiny task worker mein automatically faster nahi. ArrayBuffer transfer ownership deta hai; sender ka usable buffer state badal sakta hai.

```js
// main.js, served over HTTP(S)
const worker = new Worker('./worker.js');
worker.onmessage = event => console.log(event.data);
worker.postMessage([3, 5]);
// worker.js, a separate file
self.onmessage = event => self.postMessage(event.data.reduce((a, b) => a + b, 0));
```

**Follow-up — aur socho:** Large ArrayBuffer clone ke bajay transfer kab better hai?

[Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## iq-added-js-axios

**Axios, fetch ya Node HTTP client kab choose karoge?**

Intermediate · JavaScript

**Answer — reasoning samjho**

Axios interceptors/configured instances/transforms aur default status-based rejection deta hai. Fetch browsers/modern Node ka standard API; HTTP error par normally fulfill hota hai, response.ok check karo. Node http/https lower-level streams; Got jaisi clients apni Node features deti hain. Runtime, cancellation, retry, bundle/team need se choose karo. Popularity universal best proof nahi; auth/idempotency tumhe design karni hai.

```js
async function loadNotes() {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

**Follow-up — aur socho:** Auth/error policy centralize karke unsafe blind retries kaise avoid karoge?

[Axios introduction](https://axios-http.com/docs/intro)

## iq-added-react-library

**React kya hai; library/framework difference aur vanilla JS ke upar benefit kab?**

Foundation · React

**Answer — reasoning samjho**

React UI library hai: props/state se components output describe karte hain, React updates coordinate karta hai. Framework broader routing/data-loading/delivery conventions de sakta hai; React uske andar use ho sakta hai. Complex changing UI mein component model helpful, small static page ko little/no React chahiye ho sakta hai. Example component excerpt hai; React har manual DOM implementation se inherently faster nahi.

```jsx
function Progress({done, total}) {
  return <p>{done} of {total} lessons</p>;
}
```

**Follow-up — aur socho:** Production app ke liye UI library ke alawa kaunse decisions chahiye?

[React learning guide](https://react.dev/learn)

## iq-added-react-jsx-babel

**JSX kaise run hota hai, className kyun, Babel ka role kya?**

Foundation · React

**Answer — reasoning samjho**

JSX element-tree syntax hai; build transform React-runtime-compatible JS calls banata hai. Browser raw JSX generally execute nahi karta. Babel possible transformer hai, React itself nahi; other compilers bhi JSX transform karte hain. Transpilation missing runtime APIs ka universal polyfill nahi. className React DOM ka conventional CSS-class prop hai. Braces expressions; normal strings escape hoti hain, dangerouslySetInnerHTML separate trust boundary hai.

```jsx
const title = 'Closures';
const heading = <h2 className="lesson-title">{title}</h2>;
```

**Follow-up — aur socho:** Syntax transformation aur missing runtime API provide karna kaise alag hain?

[React learning guide](https://react.dev/learn)

## iq-added-react-props-children

**Props/state ka difference aur children kya hai?**

Foundation · React

**Answer — reasoning samjho**

Props parent inputs; state component-owned changing data hai jiske updates render schedule kar sakte hain. Child received object mutate karke parent update na kare. children nested content prop hai, reusable shells ke liye useful. Panel outer structure own karta, caller content supply. Children one element ya array tak limited nahi, various React nodes ho sakte hain. Distinct actions slot clearer contract de sakta hai.

```jsx
function Panel({title, children}) {
  return <section><h2>{title}</h2>{children}</section>;
}
function App() {
  return <Panel title="Practice"><p>Explain one closure.</p></Panel>;
}
```

**Follow-up — aur socho:** Saara content children ke bajay named actions slot kab clearer hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-fragments

**Fragments kya hain aur kaunsa DOM element add karte hain?**

Foundation · React

**Answer — reasoning samjho**

Fragment siblings group karta hai bina extra DOM wrapper. Extra div flex/grid layout ya table/list structure badal sakta hai. Short fragment syntax key nahi leti; keyed groups ke liye explicit Fragment use karo. Example DOM dl/dt/dd hai, fragment node nahi. Layout box, semantics ya event/attribute target required ho toh actual element appropriate hai.

```jsx
import {Fragment} from 'react';
function Glossary({items}) {
  return <dl>{items.map(item => <Fragment key={item.id}><dt>{item.term}</dt><dd>{item.meaning}</dd></Fragment>)}</dl>;
}
```

**Follow-up — aur socho:** div→fragment se text same rehkar flex layout kyun badal sakti hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-usestate

**useState kya accept/return karta hai; normal variable ke bajay state kab?**

Foundation · React

**Answer — reasoning samjho**

useState initial value/initializer leta hai aur current-render state plus setter ki two-item array deta hai. Normal locals render par recreate aur mutation se render request nahi hoti. Output-affecting changing data state mein rakho; cheap derived values duplicate store mat karo. Initializer/updater pure hon. Persistent mutable non-render-trigger data ke liye ref; changed initial argument existing state reset nahi karta.

```jsx
import {useState} from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2;
  return <button onClick={() => setCount(n => n + 1)}>{count} / {doubled}</button>;
}
```

**Follow-up — aur socho:** First render ke baad initial argument badalna existing state reset kyun nahi karta?

[React learning guide](https://react.dev/learn)

## iq-added-react-communication

**Parent-child aur sibling communication kaise hoti hai?**

Intermediate · React

**Answer — reasoning samjho**

Parent props down bhejta hai; child prop-callback se intent report, parent owned state update karta hai. Siblings closest suitable common ancestor ki lifted state share kar sakte hain. Har sibling ko needed data/actions hi do. Prop drilling unused intermediate layers se passing hai; composition/context reduce kar sakte hain. Short path direct props clear hain; temporary input unnecessarily global mat karo.

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

**Follow-up — aur socho:** Temporary input ko unnecessarily global store mein lift karne se kaise bachoge?

[React learning guide](https://react.dev/learn)

## iq-added-react-render-lifecycle

**DOM, virtual DOM, reconciliation, render/commit kya; return kab evaluate hota hai?**

Intermediate · React

**Answer — reasoning samjho**

DOM live browser document hai. React element descriptions ko virtual DOM bolte hain; reconciliation type/position/keys se work decide karti hai. Render mein functions/returns evaluate; commit mein selected host-DOM changes apply. Component call DOM mutation ya commit guarantee nahi. Example count1→2 par label Started same. Render repeat/interrupt/abandon ho sakta hai, isliye network writes/purity matters.

```jsx
function Status({count}) {
  const label = count > 0 ? 'Started' : 'New';
  return <p>{label}</p>;
}
```

**Follow-up — aur socho:** Sirf one commit dikhe tab bhi component-body network write unsafe kyun hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-rerender-triggers

**Function component rerender kab; mount/update/unmount kya?**

Intermediate · React

**Answer — reasoning samjho**

Own state, normally parent render, consumed context aur subscribed external store work trigger kar sakte hain. Props parent's new render se aati hain, independently child mutate nahi karti. Equal-state bailout/memoization skip possible. Mount identity create, update preserve/replace, unmount remove/cleanup karta hai. Example old committed id cleanup then new setup; historical every class lifecycle ka exact replacement nahi.

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

**Follow-up — aur socho:** Dev Strict Mode extra setup/cleanup bina visible unmount kyun dikha sakta hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-hook-rules

**Hooks kya hain, ordinary functions se difference aur rules kya?**

Intermediate · React

**Answer — reasoning samjho**

Hooks React components/custom hooks ko state/effects features dete hain. Ordinary useState/useEffect top-level call karo, loops/branches/handlers/utilities mein nahi. Stable call order React ko state slots associate karne deta hai. Conditional return se pehle hook call ho. Newer use API documented conditional/loop exceptions rakhti hai; useState/useEffect par woh exception apply nahi. Naam alone hook rules safe nahi banata.

```jsx
function Summary({visible}) {
  const [count, setCount] = useState(0); // useState imported from React
  if (!visible) return null;
  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;
}
```

**Follow-up — aur socho:** Utility ka naam useSomething rakhna conditional hook calls safe kyun nahi banata?

[Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

## iq-added-react-effect-contract

**useEffect ke two arguments, return aur cleanup timing kya?**

Intermediate · React

**Answer — reasoning samjho**

First argument synchronization setup hai, optional cleanup return kar sakta hai. Second reactive dependency list: omit toh relevant commits ke baad; [] no reactive deps; listed values Object.is compare. Changed deps par old cleanup/new setup, unmount par cleanup. Effects client par; ordinary derived data ke liye nahi. Callback async mat banao: promise cleanup nahi. Inner async work ka cancellation/error contract define karo; paint timing unconditional nahi.

```jsx
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []); // useEffect imported; inside a component/custom hook
```

**Follow-up — aur socho:** roomId-dependent subscription dependency-free listener se kaise alag hogi?

[useEffect contract](https://react.dev/reference/react/useEffect)

## iq-added-react-styling

**React styling ke common ways aur tradeoffs kya hain?**

Foundation · React

**Answer — reasoning samjho**

Options plain CSS/className, scoped CSS Modules, inline dynamic styles, utility classes, CSS-in-JS hain. Scoping/runtime/extraction/framework costs vary; React ek compulsory method nahi deta. Example ko application meter stylesheet chahiye. Inline keys camelCase; :hover/media selectors directly express nahi hote. Dynamic values validate karo; many dynamic declarations ke liye CSS custom properties simpler ho sakti hain.

```jsx
function Meter({percent}) {
  const bounded = Math.max(0, Math.min(100, percent));
  return <div className="meter"><span style={{display: 'block', width: `${bounded}%`}}>Progress</span></div>;
}
```

**Follow-up — aur socho:** Many inline declarations regenerate karne se CSS custom property kab cleaner hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-hoc

**HOC kya hai aur custom hook se kaise compare karoge?**

Intermediate · React

**Answer — reasoning samjho**

HOC component accept karke wrapper component return karta hai, rendering wrap/props inject kar sakta hai. Custom hook wrapper bina stateful logic share karta hai. Dono ka public contract clear ho. Wrapper other component ke render ke bahar create karo taaki identity stable rahe. Example every ref/static property automatically forward promise nahi karta. Simple structure reuse mein children composition enough ho sakti hai.

```jsx
function withLoading(View) {
  return function LoadingView({loading, ...props}) {
    return loading ? <p role="status">Loading…</p> : <View {...props}/>;
  };
}
function Lessons({items}) { return <ul>{items.map(x => <li key={x.id}>{x.title}</li>)}</ul>; }
const LoadableLessons = withLoading(Lessons);
```

**Follow-up — aur socho:** Is HOC ke bajay children composition kab simpler hai?

[React learning guide](https://react.dev/learn)

## iq-added-react-router

**React Router kya deta hai; sibling routes data kaise share karein?**

Intermediate · React

**Answer — reasoning samjho**

Router URLs ko UI se map aur navigation coordinate karta hai: addresses, nested layouts, params/history. General shared-state replacement nahi. Shareable filters URL, shared client state layout/context, remote data server cache mein. Already wrapped app ke andar another BrowserRouter mat add karo. Navigation state contextual data de sakti hai; direct link par essential data independently load hona chahiye.

```jsx
// Declarative React Router app excerpt
import {BrowserRouter, Routes, Route, Link, useParams} from 'react-router-dom';
function Lesson() { const {id} = useParams(); return <p>Lesson {id}</p>; }
function App() { return <BrowserRouter><Link to="/lessons/42">Open</Link><Routes><Route path="/lessons/:id" element={<Lesson/>}/></Routes></BrowserRouter>; }
```

**Follow-up — aur socho:** Back par URL filter aur unsaved draft ka behavior kaise alag hai?

[React Router declarative routing](https://reactrouter.com/start/declarative/routing)

## iq-added-redux-purpose

**Redux/Flux kya hain; Redux always better ya React-only hai?**

Intermediate · Redux

**Answer — reasoning samjho**

Flux unidirectional data flow hai. Redux store/action/reducer se next state compute karta hai; React ke bina bhi use ho sakta hai. Context value distribute; Redux update model, subscriptions/selectors, middleware/tooling add karta hai. Neither universally better. Temporary state local; coordination/tooling justify kare tab shared store. Server cache related but separate problem solve karti hai. New Redux code ka normal starting point Toolkit hai.

**Follow-up — aur socho:** Context/server-cache wali app mein Redux ko kaunsi concrete need justify karegi?

[Redux fundamentals](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)

## iq-added-redux-actions-reducers

**Redux action/reducer kya; initial state aur transition dikhao.**

Intermediate · Redux

**Answer — reasoning samjho**

Action type aur usually payload se event describe karta hai. Reducer previous state/action lekar next state return karta hai. Initialization ke undefined input par initial state use hoti hai; unknown action existing state return kare. Plain reducer immutable copying dikhata hai. Toolkit createSlice Immer draft mutation syntax allow karta hai; ordinary Redux object mutate karna same cheez nahi.

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

**Follow-up — aur socho:** Unknown action existing state return kyun kare, undefined kyun nahi?

[Writing Redux logic](https://redux.js.org/usage/structuring-reducers/initializing-state)

## iq-added-redux-flow

**React/Redux data flow aur side effects ka owner kya hai?**

Intermediate · Redux

**Answer — reasoning samjho**

Interaction→dispatch→middleware→reducer→store subscribers→selectors→React UI flow hai. Reducers fetch/timers/external mutation/random IDs/timestamps generate na karein. Event logic/thunks/listener middleware effects own karke results action mein bhejein. Replay deterministic chahiye toh timestamp dispatch se pehle action payload mein ho. State/actions default serializable rakho. Toolkit drafts bhi pure reducer rule follow karte hain; middleware dispatch wrap karta hai.

**Follow-up — aur socho:** Replay ke liye timestamp dispatch se pehle action mein kyun hona chahiye?

[Redux side effects approaches](https://redux.js.org/usage/side-effects-approaches)

## iq-added-redux-store-api

**Redux store methods aur unke uses kya hain?**

Intermediate · Redux

**Answer — reasoning samjho**

getState current tree read; dispatch action pipeline mein bhejta; subscribe listener register karke unsubscribe return karta hai. Listener ke andar getState se latest state lo; callback diff payload nahi deta. replaceReducer root swap dynamic features/dev tooling mein useful. Observable interop also exists, normal UI mein rarely chahiye. Returned state mutate mat karo; integration destroy par unsubscribe karo.

```js
// Application excerpt: store was created with configureStore.
const unsubscribe = store.subscribe(() => console.log(store.getState()));
store.dispatch({type: 'study/added', payload: 5});
unsubscribe();
// store.replaceReducer(nextRootReducer) when deliberately changing reducer composition
```

**Follow-up — aur socho:** Integration destroy par subscription remove kyun karein?

[Redux store API](https://redux.js.org/api/store)

## iq-added-redux-connect

**React Redux connect versus modern hooks kaise compare karoge?**

Intermediate · Redux

**Answer — reasoning samjho**

connect HOC wrapper ko store subscribe karke selected state/dispatch props map karta hai. Function components ke saath bhi valid. New code useSelector/useDispatch prefer kar sakta hai; old connect automatically wrong nahi. Example ko compatible store wala Provider ancestor chahiye. Needed data select karo; every selector new object return kare toh comparison/render frequency affect hogi.

```jsx
import {connect} from 'react-redux';
function Total({minutes, add}) { return <button onClick={add}>{minutes}</button>; }
const ConnectedTotal = connect(
  state => ({minutes: state.minutes}),
  dispatch => ({add: () => dispatch({type:'study/added', payload:5})})
)(Total);
```

**Follow-up — aur socho:** Har selector call fresh object return kare toh rendering kya hogi?

[React Redux connect](https://react-redux.js.org/api/connect)

## iq-added-redux-outside

**Component ke bahar Redux state safely kaise access karoge?**

Intermediate · Redux

**Answer — reasoning samjho**

Utility/integration ko store explicitly inject karke getState/dispatch use karao; React hooks arbitrary functions mein call nahi ho sakte. Dependency visible/testable rehti hai. SSR mein global imported singleton store requests ka user state leak kar sakta hai. Once-read value snapshot hai; continuous observation chahiye tab subscribe aur cleanup own karo. Request-specific ownership preserve karo.

```js
function makeStudyService(store) {
  return {
    snapshot: () => store.getState().minutes,
    add: minutes => store.dispatch({type:'study/added', payload:minutes})
  };
}
```

**Follow-up — aur socho:** SSR mein module singleton store users ka data leak kyun kar sakta hai?

[Redux FAQ on store access](https://redux.js.org/faq/code-structure)

## iq-added-redux-middleware

**Redux middleware example do; reducer mein async work mat rakho.**

Intermediate · Redux

**Answer — reasoning samjho**

Middleware dispatch ke around compose hokar log/transform/delay/handle karti hai. next next middleware/base dispatch, store.dispatch pipeline dobara enter karta hai. Same action unconditional redispatch recursion bana sakta hai. Example minutes reducer assume karta hai. Dispatch return preserve, secrets log mat karo. Thunk async function actions handle kar sakta hai; reducers sync/pure rehte hain.

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

**Follow-up — aur socho:** Same action middleware mein unconditional dispatch se infinite recursion kyun?

[Redux middleware](https://redux.js.org/understanding/history-and-design/middleware)

## iq-added-spring-di

**Constructor DI, component scan aur Bean definition ka difference?**

Intermediate · Spring Boot

**Answer — reasoning samjho**

DI collaborator supply karti hai, hidden construction nahi. Component scan configured stereotype classes discover; Bean method explicit config se object banata hai. Constructor required deps visible aur final fields possible banata hai. Same dependency ki multiple beans hon toh qualifier/primary deliberately choose. Singleton shared hai; injection unrelated mutable fields thread-safe nahi banati. Manual constructor se service unit-test ho sakti hai.

```java
// Spring application excerpt; interfaces/configuration supplied by the app.
@Service
class LessonService {
  private final LessonRepository repository;
  LessonService(LessonRepository repository) { this.repository = repository; }
}
```

**Follow-up — aur socho:** Whole Spring context bina LessonService test kaise karoge?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-autoconfig

**Boot auto-configuration kya karti hai; unexpected bean debug kaise?**

Intermediate · Spring Boot

**Answer — reasoning samjho**

Boot classpath, properties aur existing beans ki conditions se defaults contribute karta hai; entire business design infer nahi karta. Unexpected bean mein condition report, profiles, property sources, definitions inspect karo. Custom bean specified conditions par auto-config backoff kara sakti hai. Small reproduction aur actual effective config dekho; every starter always same objects install karta hai assume mat karo.

**Follow-up — aur socho:** Test profile production config issue hide kaise kar sakti hai?

[Boot auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)

## iq-added-spring-validation

**Spring REST input validate aur consistent errors kaise doge?**

Intermediate · Spring Boot

**Answer — reasoning samjho**

Boundary DTO validate, service business invariant aur DB concurrent constraints enforce kare. Valid request body par Jakarta validation trigger kar sakta hai; advice stable safe errors map kare. Negative/zero input, malformed JSON aur business conflict separately test karo. Status/field-error contract define; HTTP200 error-string client reasoning mushkil banata hai. DTO validation uniqueness/authorization ka replacement nahi.

```java
// Spring MVC excerpt with validation dependency and imports.
record AddMinutes(@jakarta.validation.constraints.Positive int minutes) {}
@PostMapping("/minutes")
void add(@jakarta.validation.Valid @RequestBody AddMinutes request) {
  service.add(request.minutes());
}
```

**Follow-up — aur socho:** DTO validation pass ke baad bhi DB mein kaunse checks chahiye?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-nplusone

**JPA N+1 kya hai; pagination tode bina fix kaise?**

Advanced · Spring Boot

**Answer — reasoning samjho**

N parents load karke lazy relations touch karne par 1+N queries aa sakti hain. Actual SQL/count inspect karo. Access pattern se projection, entity graph, fetch join ya batching choose karo. To-many fetch join rows multiply karke pagination complicate karti hai; IDs page then controlled fetch useful ho sakta hai. Every relation eager blanket fix overfetch/inefficient plans la sakta hai.

**Follow-up — aur socho:** Correct page size aur bounded query count ka test kya hoga?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-locking

**Competing updates mein optimistic/pessimistic locks ka difference?**

Advanced · Spring Boot

**Answer — reasoning samjho**

Optimistic version check stale write ko conflict deta hai, silent lost update nahi. Pessimistic DB locks earlier serialize karte hain, wait/deadlock cost ke saath. Contention/invariant se choose karo. Conflict retry safe ho tab fresh read/business reevaluation ke baad karo. Version field external payment effects ya every DB constraint protect nahi karta. Payment method blind retry duplicate charge la sakti hai.

```java
// JPA entity field excerpt
@jakarta.persistence.Version
private long version;
```

**Follow-up — aur socho:** Optimistic conflict par payment method blindly retry risky kyun?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-test-scope

**Unit, MVC slice, repository ya full integration test kab?**

Intermediate · Spring Boot

**Answer — reasoning samjho**

Unit ordinary domain logic isolate; MVC slice mapping/validation/serialization/controller; repository persistence contracts; full integration combined wiring/boundaries at more cost check karta hai. SQL dialect/locks ke liye representative DB lo. Scope risk se choose karo, sabko largest context mat banao. Rollback/concurrent inventory real transactions aur concurrent callers se test karo, always-success mocks se nahi.

**Follow-up — aur socho:** In-memory DB production SQL/isolation bug kaise miss karegi?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-java-comparable

**Comparable/Comparator difference aur deterministic ordering kaise?**

Intermediate · Java

**Answer — reasoning samjho**

Comparable compareTo se natural order; Comparator external alternate orders deta hai. Deterministic order ke liye tie-breaker add karo. java.util.Comparator import karo. Minutes subtract compare overflow kar sakta hai; comparison helpers lo. Sorted Set/Map ordering-equality se keys identify karte hain; same minutes IDs ignore karein toh distinct lessons collapse ho sakte hain. Equals consistency deliberate rakho.

```java
// Java 17+ excerpt
record Lesson(String id, int minutes) {}
Comparator<Lesson> order = Comparator.comparingInt(Lesson::minutes)
    .thenComparing(Lesson::id);
```

**Follow-up — aur socho:** Same minutes par IDs ignore karne wala TreeSet comparator kya karega?

[Learn Java](https://dev.java/learn/)

## iq-added-java-string-immutability

**String immutable kyun; StringBuilder kab use karein?**

Foundation · Java

**Answer — reasoning samjho**

String operations original String mutate nahi karti; safe sharing/stable value keys useful hain. Reference variable reassign ho sakti hai. Repeated text assembly one thread mein mutable StringBuilder useful hai. equals content compare karta hai. Har concatenation slow blanket claim mat karo; compiler/runtime simple cases optimize karte hain. Shared unsynchronized builder concurrent request text mix/corrupt kar sakta hai.

```java
String name = "Java";
String upper = name.toUpperCase(java.util.Locale.ROOT);
StringBuilder summary = new StringBuilder();
for (int i = 1; i <= 3; i++) summary.append(i).append(' ');
System.out.println(name); // Java
```

**Follow-up — aur socho:** Shared StringBuilder concurrent requests mein unsynchronized kyun unsafe?

[Learn Java](https://dev.java/learn/)

## iq-added-dsa-intervals

**Overlapping intervals merge kaise; boundary contract kya hai?**

Intermediate · DSA

**Answer — reasoning samjho**

Start se intervals sort; last merged interval maintain karo. Chosen endpoint rule ke hisaab se overlap ho toh end extend, otherwise append. Closed [1,3]/[3,5] overlap; half-open touching policy deliberately define karo. Finite start<=end assume. Example input mutate nahi karta; O(n log n) time/O(n) storage. Empty, nested, touching aur disjoint cases test karo.

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

**Follow-up — aur socho:** Half-open touching ranges separate hon toh kya badlega?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-prefix-count

**Prefix frequencies negative values ke target-sum subarrays kaise count karti hain?**

Intermediate · DSA

**Answer — reasoning samjho**

Current prefix s aur earlier prefix s-target ka difference target subarray deta hai. Same prefix multiple baar ho sakta hai, frequencies rakho. Initial zero frequency one empty-prefix start represent karti hai. Matches current prefix insert se pehle count karo, warna zero-target empty subarray count ho sakta hai. Normal hashing par expected O(n) time/space; Number exact-range limits respect karo.

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

**Follow-up — aur socho:** Initial prefix zero ki count one kyun?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-trie

**Prefix search mein hash set ke bajay trie kab?**

Intermediate · DSA

**Answer — reasoning samjho**

Trie common-prefix paths share karta hai; characters walk karke prefix locate, phir descendants enumerate. Hash set exact membership mein good, prefix organization direct nahi deta. Length L par O(L) character steps, lekin node/map memory overhead large ho sakta hai. Unicode normalization/case/bounded suggestions define karo. Tiny static set mein sorted array+binary search simpler/compact ho sakta hai.

**Follow-up — aur socho:** Har descendant traverse bina top five completions kaise?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-lru

**Expected O(1) LRU get/put design karo; invariants kya?**

Advanced · DSA

**Answer — reasoning samjho**

Map key→node aur doubly linked list MRU→LRU order combine karo. Get hit front move; put existing update/move ya new insert; overflow tail dono structures se remove. Every map entry exactly one live node, map/list sizes equal. Sentinels empty/single cases simplify. O(capacity) space; zero capacity, update-without-growth, repeated hit aur read-after-eviction order test karo.

**Follow-up — aur socho:** Singly linked list mein arbitrary hit promote karna harder kyun?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-dijkstra-heap

**Dijkstra heap stale entries kyun rakhta hai; handle kaise?**

Advanced · DSA

**Answer — reasoning samjho**

Lazy Dijkstra improve par new distance entry push karta hai, old heap key decrease nahi. Pop distance current best se different ho toh stale skip. Nonnegative weights mein appropriate minimal current entry finalize karo. A→B10, A→C1, C→B1 par B10 stale, best2. Duplicate entries time/memory mein count karo; heap mein max one per vertex claim mat karo.

**Follow-up — aur socho:** Parallel edges/zero weights test aur negatives ka separate algorithm kyun?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-dp-reconstruction

**DP optimal value ke saath chosen solution kaise return kare?**

Advanced · DSA

**Answer — reasoning samjho**

Predecessor/choice ya enough full-table history rakho. 0/1 knapsack backward trace mein skip compare; take par capacity ghatao aur previous item row par jao. Compressed array optimum value bachakar simple reconstruction history lose kar sakti hai. Multiple optima ka tie-break define karo. Chosen items once-only, capacity valid aur summed value reported optimum ke equal verify karo.

**Follow-up — aur socho:** Recompute/divide-and-conquer reconstruction time-memory tradeoff kab useful hai?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-design-url-shortener

**Collisions aur abuse controls ke saath URL shortener design karo.**

Intermediate · System design

**Answer — reasoning samjho**

Creation/read rates, alias length/custom aliases/expiry/ownership clarify karo. Unique alias→validated destination store karo. Generated collision atomic uniqueness plus bounded retry; custom conflict clear response de. Popular redirects ka cache expiry/invalidation define. Destination change/caching ke hisaab se redirect semantics choose karo. Schemes/abuse limits validate; sharding se pehle storage/hot-key traffic estimate karo.

**Follow-up — aur socho:** Cached destination change permanent redirects ko kaise affect karega?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-upload

**Large resumable upload design karo bina every byte app server se bheje.**

Advanced · System design

**Answer — reasoning samjho**

Authenticated upload session size/type limits ke saath banao. Suitable object-storage multipart upload, short-lived scoped authorization lo. Part/session IDs persist taaki retries/reconnect resume karein. Publish se pehle completion/integrity verify; incomplete private, abandoned expire. Untrusted content product policy se scan/process karo. Signed URLs capabilities hain; expiry/access constrain karo. Lost completion response par stable session se status recover karo.

**Follow-up — aur socho:** Storage complete, API response lost ho toh recovery kaise?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-notifications

**Preferences/retries/dedup wali email/push service design karo.**

Advanced · System design

**Answer — reasoning samjho**

Business event aur channel delivery separate karo. Durable event/outbox, current recipient/channel preferences, bounded queue aur attempt identities/outcomes rakho. Provider limits aur transient retry budgets/backoff respect. Replay dedup distinct legitimate notifications block na kare. Provider acceptance human-read proof nahi. Sensitive body logs avoid; unsubscribe policy channel-specific ho. Queued work ke waqt preferences revoke ho toh policy recheck karo.

**Follow-up — aur socho:** Queued notification ke dauran user opt-out kare toh?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-disaster-recovery

**RPO/RTO backup/disaster recovery ko kaise shape karte hain?**

Advanced · System design

**Answer — reasoning samjho**

RPO tolerable data loss time mein, RTO service restore target duration hai. Backup frequency/replication/isolation/procedure failure scenarios ke according choose. Replica backup substitute nahi: corruption/delete replicate ho sakta hai. Restore drills, data/app compatibility aur actual recovery time measure karo; successful backup log enough nahi. Credentials, dependencies, DNS/client reconnect include karo. Partition tradeoff target ke saath explicit ho.

**Follow-up — aur socho:** Partition mein continuing writes aur zero-data-loss goal conflict kyun kar sakte hain?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-cache-version

**Invalidation ke baad delayed cache fill stale data wapas kaise la sakti hai?**

Advanced · System design

**Answer — reasoning samjho**

Reader cache miss par v1 read karta hai. Writer v2 commit/invalidate; old reader baad mein v1 cache fill karke stale data resurrect karta hai. TTL tab enough jab freshness bound acceptable ho. Versioned keys, generation check ya coordinated protocol stronger ho sakte hain; each race analyze karo. Interleaving draw karke proof do, sirf delete-all-races fix claim nahi.

**Follow-up — aur socho:** Global lock bina older version ko newer replace karne se kaise rokoge?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-design-multitenancy

**DB/cache/queue/observability mein tenants isolate kaise karoge?**

Advanced · System design

**Answer — reasoning samjho**

Trusted auth se tenant identity derive; queries, authorization, cache aur jobs tak carry karo. DB constraints/access policies defense-in-depth de sakti hain; client tenantId authority nahi. Noisy-neighbor budgets partition aur telemetry data isolated rakho. Cross-tenant reads/writes/cache/export/replayed-job cases test karo. Strong physical isolation operational/cost tradeoff hai; requirement se choose karo, URL mein field alone enough nahi.

**Follow-up — aur socho:** Har URL ka tenantId isolation establish kyun nahi karta?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-added-flex-image-one

**First supplied image ke four flex-direction layouts recreate karo.**

Intermediate · CSS

**Answer — reasoning samjho**

Supplied image mein normal LTR assume: top-left column, top-right column-reverse, middle-left row, bottom-left row-reverse. DOM1,2,3,4 same; sirf flex-direction badlo. Reverse visual progression badalta hai, reading/tab order nahi. Example div duplicate karke direction classes replace karo. Reverse-row 4,3,2,1 right ki taraf; content-sized reverse-column mein top4/bottom1. RTL/writing-mode physical directions change kar sakte hain.

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

**Follow-up — aur socho:** RTL/vertical writing modes row/column ki physical direction kaise badalte hain?

[Supplied layout reference](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view)

[Flexbox alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container)

## iq-added-flex-image-two

**Second supplied image ke five wrapped align-content layouts recreate karo.**

Intermediate · CSS

**Answer — reasoning samjho**

Top row LTR: flex-start,center,flex-end. Bottom-left space-around; bottom-middle space-between. align-content multiple flex lines ko cross axis par distribute karta hai; wrap aur extra space chahiye. Single line ke items ka alignment alag concern. Example first line6, next2 items; each alignment duplicate karo. Space-between outer lines edges; space-around outer distributed space inner ka half, fixed gap separately. Dimensions original implementation choices hain, measured image pixels nahi.

```html
<div class="demo"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
<style>
.demo { display:flex; flex-wrap:wrap; align-content:flex-start; gap:6px; box-sizing:border-box; width:220px; height:140px; padding:4px; background:#12bdc1; }
.demo span { flex:0 0 28px; height:28px; display:grid; place-items:center; background:#eee; }
</style>
```

**Follow-up — aur socho:** Single unwrapped row/content-height container mein align-content no-op kyun lagta hai?

[Supplied layout reference](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view)

[Flexbox alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container)
