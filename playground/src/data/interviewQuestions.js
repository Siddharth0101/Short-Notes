import { scenarioQuestions } from './scenarioQuestions.js';
import { advancedQuestions } from './advancedQuestions.js';

// Original practice questions. Explanations use Hinglish; technical terms remain English.
export const interviewQuestions = [
  {
    id: 'iq-js-01',
    track: 'javascript',
    level: 'Foundation',
    question: 'How do var, let, and const differ?',
    answer:
      'var function-scoped hota hai, jabki let aur const block-scoped hote hain. let/const declaration se initialization tak temporal dead zone mein rehte hain; const binding ko reassign nahi kar sakte, lekin bound object mutate ho sakta hai.',
    followUp: 'Why does a var loop capture the final index in delayed callbacks?',
    tags: ['scope', 'variables'],
  },
  {
    id: 'iq-js-02',
    track: 'javascript',
    level: 'Foundation',
    question: 'What is a closure and where is it useful?',
    answer:
      'Closure function ko uske lexical environment ke bindings access karne deta hai, even jab outer function return ho chuka ho. Private counters, callbacks aur function factories mein useful hai; captured bindings live hote hain, automatically frozen copies nahi.',
    followUp: 'How could a closure retain more memory than expected?',
    tags: ['closures', 'scope'],
  },
  {
    id: 'iq-js-03',
    track: 'javascript',
    level: 'Intermediate',
    question: 'How is this determined for regular and arrow functions?',
    answer:
      'Regular function ka this call-site se decide hota hai: object method call, explicit call/apply/bind, constructor call, ya plain call. Arrow function apna this create nahi karta; surrounding lexical scope ka this use karta hai, isliye bind se uska this replace nahi hota.',
    followUp: 'What happens when an object method is passed directly to setTimeout?',
    tags: ['this', 'functions'],
  },
  {
    id: 'iq-js-04',
    track: 'javascript',
    level: 'Intermediate',
    question: 'What is the order of synchronous code, promise callbacks, and timers?',
    answer:
      'Current synchronous execution pehle complete hota hai. Browser event loop phir microtask checkpoint par queued promise reactions drain karta hai; eligible timer callback aage kisi task mein run hota hai, aur zero delay exact execution time guarantee nahi karta.',
    followUp: 'Can repeatedly scheduling microtasks delay rendering?',
    tags: ['event-loop', 'promises'],
  },
  {
    id: 'iq-js-05',
    track: 'javascript',
    level: 'Foundation',
    question: 'How do ==, ===, and Object.is differ?',
    answer:
      '== comparison se pehle type coercion kar sakta hai, jabki === alag types ko unequal maanta hai. Object.is mostly strict equality jaisa hai, lekin NaN ko khud ke equal aur +0/-0 ko different maanta hai; objects ke liye ye bhi identity compare karta hai.',
    followUp: 'Why are two separately created empty objects not strictly equal?',
    tags: ['equality', 'coercion'],
  },
  {
    id: 'iq-js-06',
    track: 'javascript',
    level: 'Intermediate',
    question: 'What is the difference between a shallow and a deep copy?',
    answer:
      'Spread aur Object.assign top-level properties copy karte hain, nested object references shared rehte hain. structuredClone supported data types ko deeply clone kar sakta hai, including cycles, lekin functions jaise values unsupported hain aur custom prototype behavior preserve hone ka assumption nahi karna chahiye.',
    followUp: 'Why is JSON serialization an unreliable general deep-clone technique?',
    tags: ['objects', 'immutability'],
  },
  {
    id: 'iq-js-07',
    track: 'javascript',
    level: 'Intermediate',
    question: 'When would you use Promise.all versus Promise.allSettled?',
    answer:
      'Promise.all tab useful hai jab sab results successful chahiye; koi input reject hote hi combined promise reject hota hai. allSettled har input ka final outcome deta hai, aur dono mein remaining operations automatically cancel nahi hote.',
    followUp: 'How would you limit concurrency while processing 1,000 requests?',
    tags: ['promises', 'concurrency'],
  },
  {
    id: 'iq-js-08',
    track: 'javascript',
    level: 'Intermediate',
    question: 'How do debounce and throttle differ?',
    answer:
      'Debounce events ki burst ke baad quiet period wait karke work run karta hai, jaise search suggestions. Throttle work ko configured interval mein limit karta hai, jaise scroll processing; leading/trailing behavior explicitly define karna chahiye.',
    followUp: 'How do you cancel pending debounced work when a component unmounts?',
    tags: ['timers', 'performance'],
  },
  {
    id: 'iq-js-09',
    track: 'javascript',
    level: 'Foundation',
    question: 'How does prototype lookup work?',
    answer:
      'Property access pehle object ki own property dekhta hai, phir prototype chain follow karta hai jab tak match ya null na mile. Inherited methods share ho sakte hain; own property same naam se inherited property ko shadow karti hai.',
    followUp: 'How does Object.hasOwn differ from the in operator?',
    tags: ['prototypes', 'objects'],
  },
  {
    id: 'iq-js-10',
    track: 'javascript',
    level: 'Advanced',
    question: 'How would you prevent stale search responses from overwriting newer results?',
    answer:
      'Har request ke saath sequence ID ya cleanup-owned active flag rakho aur sirf latest request ka result apply karo. AbortController unnecessary fetch ko cancel karne mein help karta hai, lekin stale-result guard phir bhi useful hai jab cancellation late ho ya downstream work cancelable na ho.',
    followUp: 'How should loading and error state behave when a request is replaced?',
    tags: ['async', 'race-conditions'],
  },
  {
    id: 'iq-js-11',
    track: 'javascript',
    level: 'Intermediate',
    question: 'When should you choose Map over a plain object?',
    answer:
      'Arbitrary key types, insertion-order iteration, size aur frequent dynamic entries ke liye Map clear API deta hai. Object structured records ke liye natural hai; Map key equality object identity use karti hai, aur specification average sublinear access require karti hai, exact O(1) guarantee nahi.',
    followUp: 'When is a WeakMap more appropriate?',
    tags: ['map', 'collections'],
  },
  {
    id: 'iq-js-12',
    track: 'javascript',
    level: 'Advanced',
    question: 'Why does awaiting an async function not make CPU-heavy work nonblocking?',
    answer:
      'Async function ka synchronous CPU work calling thread par hi chalta hai jab tak control yield na ho. Promise wrapping computation ko worker thread par move nahi karta; large CPU tasks ko chunk karna ya Web Worker mein transfer karna pad sakta hai.',
    followUp: 'What data-transfer costs should you consider with workers?',
    tags: ['async', 'workers', 'performance'],
  },
  {
    id: 'iq-js-13',
    track: 'javascript',
    level: 'Intermediate',
    question: 'What is a generator function and when is it useful?',
    answer:
      'function* body ko pause/resume karne deta hai; yield par control caller ko return hota hai aur next() call par execution wahi se resume hota hai. Lazy sequences, custom iterables aur large/infinite data ko chunk-by-chunk produce karne ke liye useful hai, bina pura result upfront array mein banaye.',
    followUp: 'How does an async generator differ from a regular generator?',
    tags: ['generators', 'iterators'],
  },
  {
    id: 'iq-js-14',
    track: 'javascript',
    level: 'Foundation',
    question: 'How do optional chaining (?.) and nullish coalescing (??) differ from && and ||?',
    answer:
      '?. sirf null/undefined par short-circuit karta hai aur chain ke beech safely stop ho jaata hai; ?? bhi sirf null/undefined ke liye fallback deta hai. || har falsy value (0, "", NaN) par fallback trigger kar deta hai, jo aksar unintended hota hai jab 0 ya empty string ek valid value ho.',
    followUp: 'Why might a.b.c ?? default still throw if a itself is undefined?',
    tags: ['optional-chaining', 'operators'],
  },
  {
    id: 'iq-js-15',
    track: 'javascript',
    level: 'Intermediate',
    question: 'How does event delegation work and why use it?',
    answer:
      'Event bubbling ki wajah se parent ek listener attach karke child elements ke events bhi handle kar sakta hai; event.target actual clicked element batata hai. Dynamic ya large list mein har item par separate listener attach karne ke bajaye ek delegated listener memory aur setup cost dono kam karta hai.',
    followUp: 'How would you stop delegation from reacting to clicks inside a nested widget?',
    tags: ['dom', 'events', 'delegation'],
  },
  {
    id: 'iq-js-16',
    track: 'javascript',
    level: 'Advanced',
    question: 'What is currying and how would you implement it?',
    answer:
      'Currying ek multi-argument function ko chain of single-argument functions mein transform karta hai: add(a)(b)(c). Partial application se reusable specialized functions banti hain, jaise ek fixed discount rate wala pricing function. Closure har call ke previously supplied arguments retain karta hai jab tak final call na aaye.',
    followUp: 'How would you write a curry helper that also accepts multiple arguments at once?',
    tags: ['functions', 'closures', 'functional'],
  },
  {
    id: 'iq-js-17',
    track: 'javascript',
    level: 'Advanced',
    question: 'What role does Symbol.iterator play in JavaScript?',
    answer:
      'Symbol.iterator ek well-known symbol hai jo object ko iterable banata hai — for...of, spread, aur destructuring isi protocol par depend karte hain. Custom Symbol.iterator method define karke koi bhi object (jaise ek custom collection class) built-in iteration syntax ke saath compatible ban sakta hai.',
    followUp: 'Why does a plain object not work directly with for...of unless you add this?',
    tags: ['symbols', 'iterables'],
  },
  {
    id: 'iq-js-18',
    track: 'javascript',
    level: 'Advanced',
    question: 'How can a closure cause a memory leak in a long-running app?',
    answer:
      'Agar ek closure kisi large object ya DOM node ko reference karta hai aur woh closure (jaise ek event listener ya timer callback) kabhi remove nahi hota, toh referenced object garbage-collect eligible kabhi nahi banta. Long-lived listeners/subscriptions ke saath explicit cleanup (removeEventListener, clearInterval, unsubscribe) is isliye zaroori hai.',
    followUp: 'Why can a detached DOM node still stay in memory after removal from the page?',
    tags: ['closures', 'memory', 'performance'],
  },
  {
    id: 'iq-js-19',
    track: 'javascript',
    level: 'Intermediate',
    question: 'How does finally interact with a return inside try or catch?',
    answer:
      'finally block try/catch ke result ke independent hamesha run hota hai, chahe koi return ho ya exception. Agar finally khud explicitly return karta hai, woh try/catch ke return ko override kar deta hai — isliye finally mein return avoid karo jab tak cleanup-only intent na ho.',
    followUp: 'When would a custom Error subclass be more useful than throwing a plain string?',
    tags: ['errors', 'control-flow'],
  },
  {
    id: 'iq-js-20',
    track: 'javascript',
    level: 'Intermediate',
    question: 'How do CommonJS and ES Modules differ in loading behavior?',
    answer:
      'CommonJS (require) synchronous aur runtime-evaluated hai; exports ek mutable object hota hai. ES Modules (import/export) static structure hai — bindings compile time par resolve hote hain aur live bindings hoti hain (exporting module value update kare to importer bhi updated value dekhta hai), aur top-level await jaisi features sirf ESM mein available hain.',
    followUp: 'Why can mixing require and import in the same project cause interop issues?',
    tags: ['modules', 'tooling'],
  },
  {
    id: 'iq-react-01',
    track: 'react',
    level: 'Foundation',
    question: 'What does it mean that React state is a snapshot?',
    answer:
      'Har render ko us waqt ka state milta hai aur us render ke handlers wahi values capture karte hain. setState future render request karta hai; current handler ke local state variable ko turant replace nahi karta.',
    followUp: 'Why can three setCount(count + 1) calls increment only once?',
    tags: ['state', 'rendering'],
  },
  {
    id: 'iq-react-02',
    track: 'react',
    level: 'Foundation',
    question: 'Why are stable keys important in lists?',
    answer:
      'Keys React ko siblings ke beech identity track karne mein help karte hain, taaki reorder ke baad correct state preserve ho. Array index dynamic insert/delete/reorder mein wrong identity map kar sakta hai; render ke waqt random key banana har baar remount kara sakta hai.',
    followUp: 'When can changing a key intentionally reset a form?',
    tags: ['keys', 'reconciliation'],
  },
  {
    id: 'iq-react-03',
    track: 'react',
    level: 'Intermediate',
    question: 'When is useEffect appropriate?',
    answer:
      'Effect component ko external systems, jaise subscription, browser API ya network synchronization, se sync karta hai. Render se calculate hone wali value ko usually directly derive karo; effect dependencies mein reactive inputs include karo aur setup ka matching cleanup do.',
    followUp: 'How would you remove an effect that only copies props into state?',
    tags: ['effects', 'state'],
  },
  {
    id: 'iq-react-04',
    track: 'react',
    level: 'Intermediate',
    question: 'Why can an interval read stale state inside an effect?',
    answer:
      'Interval callback us render ki closure capture karta hai jahan effect create hua tha. Previous value se update ke liye functional updater useful hai; changing external inputs ke liye dependencies aur resubscription policy correct rakhni hogi.',
    followUp: 'Why is omitting a dependency not a reliable optimization?',
    tags: ['closures', 'effects'],
  },
  {
    id: 'iq-react-05',
    track: 'react',
    level: 'Foundation',
    question: 'How do controlled and uncontrolled inputs differ?',
    answer:
      'Controlled input ki value React state se aati hai aur onChange us state ko update karta hai. Uncontrolled input apni current value DOM mein rakhta hai aur defaultValue ya ref se access hota hai; ek input ko lifecycle ke beech modes switch karne se avoid karo.',
    followUp: 'Which approach would you choose for a large form and why?',
    tags: ['forms', 'state'],
  },
  {
    id: 'iq-react-06',
    track: 'react',
    level: 'Intermediate',
    question: 'When do memo, useMemo, and useCallback help?',
    answer:
      'memo unchanged props par component rendering skip karne ka optimization deta hai; useMemo calculation result aur useCallback function identity cache karta hai. Ye correctness tools nahi hain: actual rendering cost profile karo, aur unstable object props ya context updates se cache benefit disappear ho sakta hai.',
    followUp: 'What overhead or readability cost can excessive memoization introduce?',
    tags: ['memoization', 'performance'],
  },
  {
    id: 'iq-react-07',
    track: 'react',
    level: 'Intermediate',
    question: 'How should you choose between local state, Context, and a store?',
    answer:
      'State ko pehle closest owner ke paas rakho; shared consumers ke liye lift karo aur widely needed values ke liye Context consider karo. Frequent granular updates, selectors ya complex cross-feature workflows ke liye store useful ho sakta hai; server cache ko client-only UI state ke saath blindly mix mat karo.',
    followUp: 'Why can a changing provider value trigger many consumers?',
    tags: ['state-management', 'context'],
  },
  {
    id: 'iq-react-08',
    track: 'react',
    level: 'Intermediate',
    question: 'Why must render logic be pure?',
    answer:
      'React rendering work ko repeat, interrupt ya discard kar sakta hai, isliye render ke andar external mutations predictable nahi rehte. Same props/state se same UI description banao; user-triggered side effects handlers mein aur synchronization effects mein rakho.',
    followUp: 'Why is pushing into a prop array during render dangerous?',
    tags: ['purity', 'rendering'],
  },
  {
    id: 'iq-react-09',
    track: 'react',
    level: 'Advanced',
    question: 'How would you design optimistic updates safely?',
    answer:
      'Pehle pending local change show karo, request identity aur previous server state track karo, phir success par authoritative response reconcile karo. Failure par rollback ya explicit retry state do; overlapping mutations mein purani failure se newer success overwrite nahi honi chahiye.',
    followUp: 'How can server idempotency simplify optimistic retries?',
    tags: ['optimistic-ui', 'data-fetching'],
  },
  {
    id: 'iq-react-10',
    track: 'react',
    level: 'Advanced',
    question: 'How do SSR and hydration differ?',
    answer:
      'SSR server par initial HTML generate karta hai; hydration browser mein React behavior ko us HTML se attach karta hai. Server aur initial client output mismatch ho to correctness aur UX issues aa sakte hain, isliye random values, timestamps aur browser-only APIs ko carefully handle karo.',
    followUp: 'Which parts of an interactive dashboard actually benefit from SSR?',
    tags: ['ssr', 'hydration'],
  },
  {
    id: 'iq-react-11',
    track: 'react',
    level: 'Intermediate',
    question: 'What can an error boundary catch?',
    answer:
      'Error boundary apne descendant tree ke rendering-related errors ko fallback UI se contain karta hai. Ordinary event-handler exceptions aur arbitrary asynchronous callback errors automatically catch nahi hote; un flows mein explicit error handling chahiye.',
    followUp: 'Where would you place boundaries in a multi-panel dashboard?',
    tags: ['errors', 'resilience'],
  },
  {
    id: 'iq-react-12',
    track: 'react',
    level: 'Advanced',
    question: 'How would you make a 50,000-row table responsive?',
    answer:
      'Pehle measure karo ki bottleneck network, computation, DOM size ya rerenders hai. Server pagination/filtering, row virtualization, stable row identity aur expensive work ka caching/worker execution combine kar sakte ho; keyboard navigation, focus aur screen-reader behavior ko virtualized design mein verify karo.',
    followUp: 'How would variable row heights change virtualization?',
    tags: ['performance', 'accessibility'],
  },
  {
    id: 'iq-react-13',
    track: 'react',
    level: 'Intermediate',
    question: 'What makes a custom hook actually reusable?',
    answer:
      'Custom hook stateful logic ko component se extract karta hai, lekin har calling component apna independent state instance get karta hai — koi shared state automatically nahi banta. Reusable hook clear contract expose karta hai (kya input leta hai, kya return karta hai), aur internal dependencies/cleanup khud manage karta hai.',
    followUp: 'Why do two components using the same custom hook not share its state?',
    tags: ['custom-hooks', 'reuse'],
  },
  {
    id: 'iq-react-14',
    track: 'react',
    level: 'Intermediate',
    question: 'When would you use a portal, and what does not change when you do?',
    answer:
      'Portal DOM output ko parent hierarchy ke bahar (jaise document.body ke child) render karta hai — modals, tooltips, dropdowns jinhe overflow:hidden ya z-index issues se bachna hai unke liye useful hai. React tree ka logical parent-child relationship (context, event bubbling order) unchanged rehta hai; sirf actual DOM placement change hota hai.',
    followUp: 'Why does an event from inside a portal still bubble to a React parent listener?',
    tags: ['portals', 'dom'],
  },
  {
    id: 'iq-react-15',
    track: 'react',
    level: 'Intermediate',
    question: 'When does useReducer read better than several useState calls?',
    answer:
      'Jab next state previous state aur ek action dono par depend karta hai, ya multiple related fields ek saath consistently update hone chahiye, reducer ek single predictable transition function mein woh logic centralize karta hai. Independent, unrelated pieces of state ke liye separate useState usually simpler rehta hai.',
    followUp: 'How would you test a reducer function without rendering any component?',
    tags: ['reducer', 'state'],
  },
  {
    id: 'iq-react-16',
    track: 'react',
    level: 'Intermediate',
    question: 'How do refs differ from state, and when does forwardRef matter?',
    answer:
      'Ref mutation re-render trigger nahi karta aur value renders ke beech persist karta hai — DOM node access, timers ya "does this need to trigger a render" na hone wale mutable values ke liye use hota hai. forwardRef tab zaroori hai jab ek parent kisi custom component ke andar wale DOM node (jaise ek input) tak directly ref se pahunchna chahta ho.',
    followUp: 'Why does mutating a ref value not update what is shown on screen?',
    tags: ['refs', 'forwardRef'],
  },
  {
    id: 'iq-react-17',
    track: 'react',
    level: 'Advanced',
    question: 'What does Suspense actually wait for?',
    answer:
      'Suspense ek component tree ko wait karta hai jab tak uske andar koi lazy-loaded component ya Suspense-compatible data source "not ready yet" signal (a thrown promise) na de; tab tak fallback UI show hoti hai. Yeh generic loading-flag pattern replace nahi karta jab tak data-fetching library explicitly Suspense integration support kare.',
    followUp:
      'Why can wrapping every component individually in Suspense hurt the loading experience?',
    tags: ['suspense', 'lazy-loading'],
  },
  {
    id: 'iq-react-18',
    track: 'react',
    level: 'Advanced',
    question: 'When must you reach for useLayoutEffect instead of useEffect?',
    answer:
      'useLayoutEffect browser paint se pehle synchronously run hota hai, jabki useEffect paint ke baad run hota hai. Jab DOM measurement (jaise element ka size/position) lekar turant ek visual adjustment karna ho taaki user ko ek flash/jump na dikhe, tabhi useLayoutEffect chuno — baaki sab cases mein useEffect better hai kyunki woh paint block nahi karta.',
    followUp: 'Why can overusing useLayoutEffect hurt perceived performance?',
    tags: ['effects', 'rendering'],
  },
  {
    id: 'iq-react-19',
    track: 'react',
    level: 'Advanced',
    question: 'What problem do startTransition and useDeferredValue solve?',
    answer:
      'Dono urgent updates (jaise typing ka input echo) ko non-urgent updates (jaise ek heavy filtered list re-render) se separate karte hain, taaki UI responsive rahe jab tak expensive work background mein complete hota hai. Yeh work ko skip nahi karte, sirf priority aur interruptibility change karte hain.',
    followUp: 'Why might a transition-marked update never finish under continuous rapid input?',
    tags: ['concurrent-rendering', 'performance'],
  },
  {
    id: 'iq-react-20',
    track: 'react',
    level: 'Intermediate',
    question: 'What should a good component test assert, and what should it avoid asserting?',
    answer:
      'Test user-visible behavior assert kare — screen par kya text/role dikhta hai, click ke baad kya change hota hai — internal state variable names ya component implementation details par nahi. Testing Library queries (role/text-based) is discipline ko encourage karte hain; brittle snapshot-only tests refactors ko unnecessarily break kar dete hain.',
    followUp: 'Why can a passing snapshot test still hide a real accessibility regression?',
    tags: ['testing', 'accessibility'],
  },
  {
    id: 'iq-java-01',
    track: 'java',
    level: 'Foundation',
    question: 'Is Java pass-by-value or pass-by-reference?',
    answer:
      'Java always pass-by-value hai; object argument mein reference ka value copy hota hai. Method us referenced object ko mutate kar sakta hai, lekin parameter ko naya object assign karne se caller ki variable binding change nahi hoti.',
    followUp: 'Can a method swap two caller variables just by reassigning parameters?',
    tags: ['references', 'fundamentals'],
  },
  {
    id: 'iq-java-02',
    track: 'java',
    level: 'Foundation',
    question: 'How do ==, equals, and hashCode relate?',
    answer:
      'References ke liye == identity compare karta hai; equals logical equality define kar sakta hai. Equal objects ka hashCode same hona zaroori hai, lekin same hash code se equality prove nahi hoti; hash collections ke keys mein mutable equality fields avoid karo.',
    followUp: 'What fails if equals is overridden without a compatible hashCode?',
    tags: ['equality', 'collections'],
  },
  {
    id: 'iq-java-03',
    track: 'java',
    level: 'Foundation',
    question: 'When would you choose an interface over an abstract class?',
    answer:
      'Interface behavioral contract aur multiple type roles express karta hai; default/static methods bhi ho sakte hain. Abstract class shared instance state, constructors aur partial implementation de sakti hai, lekin class inheritance single-parent hai; reuse ke liye composition bhi compare karo.',
    followUp: 'How do you resolve conflicting interface default methods?',
    tags: ['oop', 'interfaces'],
  },
  {
    id: 'iq-java-04',
    track: 'java',
    level: 'Intermediate',
    question: 'How do ArrayList and LinkedList differ in practical performance?',
    answer:
      'ArrayList indexed access fast rakhta hai aur contiguous backing storage locality mein help kar sakti hai; middle insert/delete shifts demand karte hain. LinkedList mein node milne ke baad rewiring cheap hai, lekin index lookup traversal aur per-node allocation cost aati hai, isliye har insertion workload mein automatically faster nahi.',
    followUp: 'What would you use for a queue in Java?',
    tags: ['collections', 'complexity'],
  },
  {
    id: 'iq-java-05',
    track: 'java',
    level: 'Intermediate',
    question: 'Is HashMap thread-safe and what should replace it for concurrent updates?',
    answer:
      'HashMap concurrent unsynchronized mutation ke liye safe nahi hai. ConcurrentHashMap concurrent operations support karta hai, lekin multi-step check-then-act ko atomic banane ke liye compute, merge ya putIfAbsent jaise operations use karo; arbitrary multi-key invariants automatically atomic nahi hote.',
    followUp: 'Why is containsKey followed by put still a race?',
    tags: ['concurrency', 'maps'],
  },
  {
    id: 'iq-java-06',
    track: 'java',
    level: 'Intermediate',
    question: 'How do checked and unchecked exceptions differ?',
    answer:
      'Checked exceptions ko method catch kare ya declaration mein expose kare, ye compiler enforce karta hai. RuntimeException subclasses unchecked hote hain; exception choose karte waqt recovery contract, context aur boundary behavior dekho, sirf compiler silence karne ke liye catch-and-ignore mat karo.',
    followUp: 'How does try-with-resources preserve an exception thrown during close?',
    tags: ['exceptions', 'resources'],
  },
  {
    id: 'iq-java-07',
    track: 'java',
    level: 'Intermediate',
    question: 'What is the difference between volatile and synchronized?',
    answer:
      'volatile reads/writes visibility aur ordering guarantees dete hain, lekin count++ jaise read-modify-write ko atomic nahi banate. synchronized mutual exclusion aur happens-before relationship deta hai; atomic classes simple atomic updates ke liye alternative hain.',
    followUp: 'Why can a volatile counter still lose increments?',
    tags: ['threads', 'memory-model'],
  },
  {
    id: 'iq-java-08',
    track: 'java',
    level: 'Intermediate',
    question: 'Why are Stream operations lazy and when should parallel streams be avoided?',
    answer:
      'Intermediate operations pipeline describe karte hain aur terminal operation consumption trigger karta hai. Parallel streams har workload fast nahi banate: small inputs, blocking calls, shared mutation aur ordering constraints overhead ya contention create kar sakte hain; measure before choosing.',
    followUp: 'Why should a stream mapping function avoid modifying shared state?',
    tags: ['streams', 'functional-programming'],
  },
  {
    id: 'iq-java-09',
    track: 'java',
    level: 'Advanced',
    question: 'What does @Transactional guarantee and what are its common traps?',
    answer:
      'Spring transaction advice configured transaction manager ke through participating resource operations ko transaction boundary deta hai. Default proxy mode mein self-invocation advice bypass kar sakti hai, aur ordinary defaults RuntimeException/Error par rollback karte hain; external HTTP calls same database transaction ka atomic part nahi ban jaate.',
    followUp: 'How would you publish an event reliably after a database change?',
    tags: ['spring', 'transactions'],
  },
  {
    id: 'iq-java-10',
    track: 'java',
    level: 'Advanced',
    question: 'What problem do virtual threads solve?',
    answer:
      'Virtual threads many concurrent tasks jo mostly blocking I/O wait karte hain unko simpler thread-per-task style mein scale karne mein help karte hain. Ye CPU cores increase nahi karte aur downstream connection pools ki limits remove nahi karte; resource limits, runtime version behavior aur measurement important hain.',
    followUp: 'Why still use a semaphore around a rate-limited dependency?',
    tags: ['virtual-threads', 'concurrency'],
  },
  {
    id: 'iq-java-11',
    track: 'java',
    level: 'Intermediate',
    question: 'How can a garbage-collected application still leak memory?',
    answer:
      'GC unreachable objects reclaim karta hai; accidentally retained reachable objects ko business meaning se unused samajhkar delete nahi karta. Unbounded caches, static collections, listeners aur uncleared ThreadLocal values retention cause kar sakte hain; heap analysis se reference path verify karo.',
    followUp: 'Which evidence distinguishes a memory leak from a temporary allocation spike?',
    tags: ['jvm', 'memory'],
  },
  {
    id: 'iq-java-12',
    track: 'java',
    level: 'Advanced',
    question: 'How would you diagnose a slow Java API?',
    answer:
      'Latency distribution aur traces se pehle time ko database, external calls, pool wait, CPU aur GC buckets mein locate karo. Query plans, thread dumps, profiler data aur pool metrics ke basis par bottleneck fix karo; bina evidence thread count badhana dependency overload ko worsen kar sakta hai.',
    followUp: 'How can an N+1 query pattern appear even when individual queries are fast?',
    tags: ['performance', 'observability'],
  },
  {
    id: 'iq-java-13',
    track: 'java',
    level: 'Intermediate',
    question: 'What problem do records solve, and what do you give up?',
    answer:
      'record ek immutable data carrier ke liye constructor, accessors, equals/hashCode aur toString automatically generate karta hai, boilerplate hata kar. Trade-off yeh hai ki record implicitly final hota hai (extend nahi ho sakta) aur fields final hote hain — mutable state ya inheritance-based extension chahiye ho to plain class better fit hai.',
    followUp: 'Why might a record still need a compact constructor?',
    tags: ['records', 'language-features'],
  },
  {
    id: 'iq-java-14',
    track: 'java',
    level: 'Intermediate',
    question: 'How should Optional be used, and what is a common misuse?',
    answer:
      'Optional ek method ke return type mein "value ho bhi sakta hai, nahi bhi" clearly signal karta hai, caller ko null-check force karke. Common misuse: Optional ko field type, method parameter ya collection element ke roop mein use karna — yeh extra wrapping overhead deta hai bina real benefit ke; return-type use case ke bahar generally avoid karo.',
    followUp: 'Why is calling .get() without checking isPresent() almost as risky as a raw null?',
    tags: ['optional', 'null-safety'],
  },
  {
    id: 'iq-java-15',
    track: 'java',
    level: 'Advanced',
    question: 'What does PECS (Producer Extends, Consumer Super) mean for generics wildcards?',
    answer:
      'Agar ek structure sirf values produce karta hai (tumhe read karne deta hai) to `? extends T` use karo; agar sirf consume karta hai (tumhe write karne deta hai) to `? super T` use karo. Isse generic methods flexible bante hain bina type-safety compromise kiye — `List<? extends Number>` se read safe hai, lekin add karna compile error dega kyunki exact type unknown hai.',
    followUp: 'Why can you not add an Integer to a List<? extends Number>?',
    tags: ['generics', 'type-system'],
  },
  {
    id: 'iq-java-16',
    track: 'java',
    level: 'Advanced',
    question: 'How would you size a thread pool for a mixed CPU/IO workload?',
    answer:
      'Pure CPU-bound work ke liye pool size roughly available cores ke close rakho, kyunki zyada threads sirf context-switching overhead badhate hain. IO-bound/blocking work ke liye pool ko wait time ke proportion mein bada rakhna padta hai (jaise `threads = cores * (1 + waitTime/computeTime)`); mixed workload ko separate pools mein split karna aksar zyada predictable rehta hai.',
    followUp:
      'Why can an unbounded thread pool cause worse throughput than a bounded one under load?',
    tags: ['concurrency', 'executors'],
  },
  {
    id: 'iq-java-17',
    track: 'java',
    level: 'Intermediate',
    question: 'How do Spring bean scopes affect thread-safety assumptions?',
    answer:
      'Default `singleton` scope ka matlab hai ek hi bean instance saare concurrent requests ke beech share hoti hai — isliye mutable instance fields thread-safety issue create kar sakte hain. `prototype` scope har injection point par naya instance deta hai; request-specific mutable state ke liye `request` scope ya method-local variables prefer karo, singleton mein mutable fields avoid karo.',
    followUp:
      'Why is a singleton service with a mutable instance field a common production bug source?',
    tags: ['spring', 'concurrency'],
  },
  {
    id: 'iq-java-18',
    track: 'java',
    level: 'Advanced',
    question: 'How does a Spring Security filter chain authenticate a JWT request end-to-end?',
    answer:
      'Request pehle configured filter chain se guzarta hai; ek custom JWT filter Authorization header se token extract karke validate karta hai (signature, expiry) aur success par SecurityContext mein Authentication populate karta hai. Downstream controller ko simply `@PreAuthorize`/method security se authorization check milta hai — filter order galat ho to authentication authorization checks se pehle nahi chalega.',
    followUp:
      'Why must a stateless JWT setup still disable CSRF protection carefully rather than blindly?',
    tags: ['spring-security', 'jwt'],
  },
  {
    id: 'iq-java-19',
    track: 'java',
    level: 'Advanced',
    question: 'What four conditions lead to a deadlock, and how do you avoid it in practice?',
    answer:
      'Mutual exclusion, hold-and-wait, no preemption, aur circular wait — chaaron saath ho tab deadlock ban sakta hai. Practical prevention: locks ko hamesha ek consistent global order mein acquire karo (sab threads same order follow karein), lock-holding duration minimize karo, aur possible ho to tryLock with timeout use karo taaki thread indefinitely block na ho.',
    followUp:
      'Why does acquiring two locks in a different order across two threads risk a deadlock?',
    tags: ['concurrency', 'deadlock'],
  },
  {
    id: 'iq-java-20',
    track: 'java',
    level: 'Intermediate',
    question: 'What does a sealed class add over a plain interface hierarchy?',
    answer:
      'sealed class/interface explicitly declare karta hai ki kaunse classes usko implement/extend kar sakte hain (`permits` clause). Isse switch pattern matching exhaustive ho sakta hai bina default branch ke, kyunki compiler ko saare possible subtypes pata hote hain — ek open interface ke saath yeh guarantee nahi milta, kyunki koi bhi unrelated class future mein implement kar sakti hai.',
    followUp: 'Why can a sealed hierarchy make a switch expression safer during refactoring?',
    tags: ['sealed-classes', 'pattern-matching'],
  },
  {
    id: 'iq-mongo-01',
    track: 'mongodb',
    level: 'Foundation',
    question: 'When should MongoDB data be embedded rather than referenced?',
    answer:
      'Jo data saath read/update hota hai aur bounded size rakhta hai usko embed karna useful ho sakta hai. Independent lifecycle, shared entities ya unbounded growth ho to references better ho sakte hain; access patterns, document-size limits aur update frequency se decision justify karo.',
    followUp: 'Would you embed every order inside a customer document?',
    tags: ['schema-design', 'embedding'],
  },
  {
    id: 'iq-mongo-02',
    track: 'mongodb',
    level: 'Foundation',
    question: 'What does single-document atomicity mean?',
    answer:
      'Ek document ki write atomic hoti hai, even jab multiple fields update hon. Multiple documents ki independent writes poore group ko atomic nahi banati; cross-document invariant ke liye supported transaction ya different data model chahiye.',
    followUp: 'How can a conditional update prevent overselling a single inventory item?',
    tags: ['atomicity', 'updates'],
  },
  {
    id: 'iq-mongo-03',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'Why does field order matter in a compound index?',
    answer:
      'Compound index fields specified order mein sort hote hain, isliye leading prefixes aur sort/range needs query usefulness affect karte hain. Equality, sort, range guideline starting point hai; actual predicate selectivity aur explain plan se validate karo.',
    followUp:
      'Can an index on { team: 1, createdAt: -1 } efficiently serve team-specific newest-first queries?',
    tags: ['indexes', 'queries'],
  },
  {
    id: 'iq-mongo-04',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'Why should you not index every field?',
    answer:
      'Indexes reads ko improve kar sakte hain, lekin storage aur memory consume karte hain aur writes ko maintain karna padta hai. Real query shapes, selectivity aur production-like measurements se indexes choose karo; redundant ya unused indexes ka benefit assess karo.',
    followUp: 'How would you identify an index that adds write cost without helping reads?',
    tags: ['indexes', 'performance'],
  },
  {
    id: 'iq-mongo-05',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'What do you inspect in explain execution statistics?',
    answer:
      'Winning plan, keys/documents examined aur documents returned compare karo, saath mein sort aur scan stages dekho. Index scan hona alone success nahi: bahut keys scan karke tiny result milna still inefficient ho sakta hai, aur timings cache/data conditions se change hote hain.',
    followUp: 'What distinguishes a covered query from an index scan followed by document fetches?',
    tags: ['explain', 'performance'],
  },
  {
    id: 'iq-mongo-06',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'How does cursor pagination improve on large offsets?',
    answer:
      'Cursor pagination last seen sort values se next range query karta hai, jisse large skip traversal avoid ho sakta hai. Stable total order ke liye unique tie-breaker, jaise _id, include karo aur matching index do; concurrent inserts/deletes ki UX policy phir bhi define karni hoti hai.',
    followUp: 'How do you paginate descending createdAt values with duplicate timestamps?',
    tags: ['pagination', 'indexes'],
  },
  {
    id: 'iq-mongo-07',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'How should you order an aggregation pipeline?',
    answer:
      'Semantics allow kare to selective match aur useful indexed sort early rakhkar later stages ka input reduce karo. Group, unwind aur lookup intermediate volume badha sakte hain; optimizer kuch stages reorder kar sakta hai, isliye explain aur realistic cardinalities inspect karo.',
    followUp: 'When would moving a match before unwind change the result?',
    tags: ['aggregation', 'pipeline'],
  },
  {
    id: 'iq-mongo-08',
    track: 'mongodb',
    level: 'Advanced',
    question: 'How do read concern, write concern, and read preference differ?',
    answer:
      'Write concern acknowledgement aur requested durability conditions control karta hai; read concern read data ki consistency/isolation properties affect karta hai. Read preference decide karta hai reads kaunse replica-set members ko target karein; secondary routing automatically fresh reads guarantee nahi karta.',
    followUp: 'What would you change for a read-after-write user workflow?',
    tags: ['replication', 'consistency'],
  },
  {
    id: 'iq-mongo-09',
    track: 'mongodb',
    level: 'Advanced',
    question: 'How do you choose a shard key?',
    answer:
      'Cardinality, value distribution, write distribution aur common query routing ko saath evaluate karo. Poor choice hot shard ya scatter-gather queries create kar sakti hai; hashed distribution aur range locality ke tradeoffs workload ke against compare karo.',
    followUp: 'Why can a monotonically increasing range key create an insertion hotspot?',
    tags: ['sharding', 'scaling'],
  },
  {
    id: 'iq-mongo-10',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'How can unique indexes support correctness?',
    answer:
      'Unique index allowed indexed values par uniqueness database level par enforce karta hai, jo application check-then-insert race se stronger hai. Compound uniqueness business scope express kar sakti hai; missing/null, partial filters aur sharding restrictions ko schema ke hisaab se check karo.',
    followUp: 'How would you enforce a unique username within each organization?',
    tags: ['indexes', 'constraints'],
  },
  {
    id: 'iq-mongo-11',
    track: 'mongodb',
    level: 'Advanced',
    question: 'When would you use a transaction in MongoDB?',
    answer:
      'Jab invariant multiple documents ki changes ko all-or-nothing require karta ho tab transaction useful hai. Transaction cost, retry rules aur deployment support consider karo; driver transaction callback retry ho sakta hai, isliye usmein external side effects blindly execute mat karo.',
    followUp: 'How can embedding avoid a transaction for a bounded aggregate?',
    tags: ['transactions', 'modeling'],
  },
  {
    id: 'iq-mongo-12',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'Why is application-side validation not enough?',
    answer:
      'Application validation helpful error messages deti hai, lekin different writers ya bugs usko bypass kar sakte hain. Database schema validation accepted document shape restrict kar sakti hai aur indexes additional invariants enforce karte hain; migrations mein old documents aur validation mode plan karo.',
    followUp: 'How would you roll out a newly required field without breaking old writers?',
    tags: ['validation', 'migrations'],
  },
  {
    id: 'iq-mongo-13',
    track: 'mongodb',
    level: 'Advanced',
    question: 'What are change streams useful for?',
    answer:
      'Change streams ek collection/database par real-time insert/update/delete events ko tail karne deti hain, bina polling ke. Reactive cache invalidation, audit logging, ya downstream service notification ke liye useful hain; resume tokens se consumer restart ke baad missed events se continue kar sakta hai, lekin at-least-once delivery assume karo.',
    followUp:
      'How would a consumer avoid double-processing an event after a resumed change stream?',
    tags: ['change-streams', 'real-time'],
  },
  {
    id: 'iq-mongo-14',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'How would you auto-expire old session documents?',
    answer:
      'TTL index (`expireAfterSeconds`) ek date field par set karke MongoDB background process periodically expired documents delete kar deta hai. Yeh exact-second precision guarantee nahi karta (background sweep interval-based hai), isliye strict expiry-time enforcement application logic mein bhi verify karo, sirf TTL par depend mat karo.',
    followUp: 'Why might a document briefly remain readable a little past its TTL expiry time?',
    tags: ['indexes', 'ttl'],
  },
  {
    id: 'iq-mongo-15',
    track: 'mongodb',
    level: 'Advanced',
    question: 'How do you evolve a schema without downtime?',
    answer:
      'Naya field optional/nullable-friendly rakho taaki purane documents bina migration ke bhi valid rahein; application code dono shapes (old aur new) ko handle kare during transition. Bada backfill ek background job se batches mein karo, aur schema validation ko "warn" mode se shuru karke gradually "strict" tak tighten karo.',
    followUp: 'Why is a big-bang synchronous migration risky on a large production collection?',
    tags: ['schema-design', 'migrations'],
  },
  {
    id: 'iq-mongo-16',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'When does bulkWrite help over individual operations?',
    answer:
      'bulkWrite multiple insert/update/delete operations ko ek hi network round-trip mein batch karta hai, jisse many-small-writes workload mein latency significantly kam hoti hai. Ordered bulk operations first error par stop ho jaate hain; unordered mode independent operations continue karta hai — consistency requirement ke hisaab se mode choose karo.',
    followUp: 'Why might an unordered bulkWrite report partial success alongside some failures?',
    tags: ['bulk-operations', 'performance'],
  },
  {
    id: 'iq-mongo-17',
    track: 'mongodb',
    level: 'Advanced',
    question: 'When would you use GridFS instead of storing files directly in a document?',
    answer:
      'GridFS large binary files (16MB BSON document limit se bade) ko chunks mein split karke store karta hai, streaming read/write allow karta hai. Chhote files (images/thumbnails) ke liye aksar object storage (S3-jaisa) ya even a document field zyada simple/cheap option hota hai; GridFS specifically MongoDB ke andar hi large-file storage chahiye tab useful hai.',
    followUp: 'Why is GridFS not a good fit for files that need frequent partial updates?',
    tags: ['gridfs', 'storage'],
  },
  {
    id: 'iq-mongo-18',
    track: 'mongodb',
    level: 'Intermediate',
    question: 'How does a text index differ from a regex query for search?',
    answer:
      'Text index tokenized, stemmed words par inverted-index-style lookup karta hai aur relevance score de sakta hai — multi-word natural search ke liye efficient hai. Regex query (especially leading-wildcard) collection scan kar sakti hai kyunki woh index-friendly prefix match nahi hai; exact substring/pattern matching ke liye regex sahi hai, natural language search ke liye text index.',
    followUp:
      'Why does a regex like /foo/ (no anchor) usually fail to use a normal index efficiently?',
    tags: ['text-search', 'indexes'],
  },
  {
    id: 'iq-mongo-19',
    track: 'mongodb',
    level: 'Advanced',
    question: 'Why can a Node app exhaust MongoDB connections under load?',
    answer:
      'Driver ek connection pool maintain karta hai; agar concurrent operations pool size se zyada ho jaayein to requests wait karte hain ya timeout ho sakte hain. Multiple app instances/serverless cold-starts har ek apna pool banate hain, jo cumulatively database ki max-connections limit exceed kar sakta hai — pool size tuning aur connection reuse (especially serverless mein) zaroori hai.',
    followUp: 'Why can serverless functions be especially prone to connection pool exhaustion?',
    tags: ['connections', 'scaling'],
  },
  {
    id: 'iq-mongo-20',
    track: 'mongodb',
    level: 'Advanced',
    question: 'What are the performance risks of $lookup in an aggregation pipeline?',
    answer:
      '$lookup ek left-outer-join-jaisa operation hai jo dusri collection ko per-document query kar sakta hai — bina supporting index ke yeh expensive collection scans multiply kar deta hai. Joined collection ke lookup field par index rakho, aur $lookup se pehle $match se input documents jitna possible reduce karo taaki join sirf necessary rows par ho.',
    followUp: 'Why might repeated $lookup joins suggest a document-modeling change instead?',
    tags: ['aggregation', 'lookup'],
  },
  {
    id: 'iq-dsa-01',
    track: 'dsa',
    level: 'Foundation',
    question: 'What is the difference between worst-case and amortized complexity?',
    answer:
      'Worst-case bound ek operation ya input ke maximum cost ko describe karta hai. Amortized analysis operations ki sequence ka total cost distribute karta hai, jaise dynamic array mein occasional resize ke bawajood amortized O(1) append; ye random-input average nahi hai.',
    followUp: 'Can an amortized O(1) operation have O(n) latency for one call?',
    tags: ['complexity', 'amortized'],
  },
  {
    id: 'iq-dsa-02',
    track: 'dsa',
    level: 'Foundation',
    question: 'When can two pointers replace a quadratic pair search?',
    answer:
      'Sorted input mein sum too small ho to left pointer aur too large ho to right pointer move karke impossible candidates discard kar sakte hain. Correctness sorted order se aati hai; unsorted data ko pehle sort karne ka cost aur original-index handling analysis mein include karo.',
    followUp: 'What alternative preserves original indices without sorting?',
    tags: ['two-pointers', 'arrays'],
  },
  {
    id: 'iq-dsa-03',
    track: 'dsa',
    level: 'Intermediate',
    question: 'Why can a variable sliding window fail with negative numbers?',
    answer:
      'Common sum-window invariant assume karta hai ki right expand karne se sum increase aur left shrink karne se decrease hoga. Negative values is monotonicity ko break karte hain, isliye prefix-sum methods ya problem-specific deque solution chahiye ho sakta hai.',
    followUp: 'Does a fixed-size maximum-sum window have the same restriction?',
    tags: ['sliding-window', 'prefix-sum'],
  },
  {
    id: 'iq-dsa-04',
    track: 'dsa',
    level: 'Intermediate',
    question: 'How do you prove binary search terminates correctly?',
    answer:
      'Pehle invariant define karo, jaise answer current half-open interval mein hai aur outside boundaries resolved hain. Har update interval strictly shrink kare aur invariant preserve kare; termination par empty unknown interval desired boundary identify karta hai.',
    followUp: 'How would you return the first occurrence among duplicates?',
    tags: ['binary-search', 'invariants'],
  },
  {
    id: 'iq-dsa-05',
    track: 'dsa',
    level: 'Intermediate',
    question: 'Why is recursive Fibonacci exponential without memoization?',
    answer:
      'Same fib(k) states repeatedly recompute hote hain, jisse call tree exponentially grow karta hai. Memoization each distinct k ko once solve karta hai: O(n) arithmetic operations aur O(n) stored/stack state under constant-cost arithmetic; rolling iteration extra state O(1) kar sakti hai.',
    followUp: 'Why does BigInt arithmetic complicate a strict O(n) time claim?',
    tags: ['recursion', 'dynamic-programming'],
  },
  {
    id: 'iq-dsa-06',
    track: 'dsa',
    level: 'Intermediate',
    question: 'When does BFS find the shortest path?',
    answer:
      'Unweighted ya equal-weight graph mein BFS increasing edge-count layers explore karta hai, isliye first discovery minimum edges deta hai. Unequal nonnegative weights ke liye standard BFS minimum total weight guarantee nahi karta; Dijkstra appropriate ho sakta hai.',
    followUp: 'Why mark vertices visited when enqueued instead of when dequeued?',
    tags: ['graphs', 'bfs'],
  },
  {
    id: 'iq-dsa-07',
    track: 'dsa',
    level: 'Intermediate',
    question: 'How do a binary heap and a binary search tree differ?',
    answer:
      'Heap parent-child priority order enforce karta hai aur root minimum/maximum efficiently deta hai; arbitrary lookup generally O(n) hai. BST subtree ordering enforce karta hai aur search/range operations support karta hai, lekin unbalanced height O(n) ho sakti hai.',
    followUp: 'Why is a heap array not a fully sorted array?',
    tags: ['heap', 'bst'],
  },
  {
    id: 'iq-dsa-08',
    track: 'dsa',
    level: 'Foundation',
    question: 'How do you reverse a singly linked list in constant extra space?',
    answer:
      'previous, current aur saved next pointers maintain karo; next ko overwrite karne se pehle save karke current link reverse karo. Har node ek baar process hota hai, so O(n) time aur O(1) auxiliary space; list wrapper ka tail bhi update karna pad sakta hai.',
    followUp: 'What changes if the input may contain a cycle?',
    tags: ['linked-list', 'pointers'],
  },
  {
    id: 'iq-dsa-09',
    track: 'dsa',
    level: 'Intermediate',
    question: 'Why is quicksort not always O(n log n)?',
    answer:
      'Partition baar-baar extremely uneven ho to recurrence roughly T(n)=T(n-1)+O(n) ban jati hai, giving O(n²). Random pivots expected O(n log n) behavior dete hain, lekin worst case erase nahi karte; duplicates ke liye three-way partition helpful hai.',
    followUp: 'What are merge sort stability and memory tradeoffs?',
    tags: ['sorting', 'quicksort'],
  },
  {
    id: 'iq-dsa-10',
    track: 'dsa',
    level: 'Advanced',
    question: 'How would you find the top k items in a large stream?',
    answer:
      'Size k ka min-heap maintain karo jab largest k items chahiye: root current selected minimum hoga. Har incoming item O(log k) update demand kar sakta hai, giving O(n log k) time aur O(k) memory; output sorted chahiye to additional ordering cost include karo.',
    followUp: 'How would repeated values and stable tie-breaking affect the heap key?',
    tags: ['heap', 'streaming'],
  },
  {
    id: 'iq-dsa-11',
    track: 'dsa',
    level: 'Advanced',
    question: 'How do memoization and tabulation differ?',
    answer:
      'Memoization recursive demand ke basis par reachable states cache karta hai; tabulation dependency order mein states iteratively fill karta hai. Dono same recurrence solve kar sakte hain, lekin stack usage, unreachable-state work aur memory compression opportunities alag hoti hain.',
    followUp: 'How do you define the state and base cases for minimum coin change?',
    tags: ['dynamic-programming', 'memoization'],
  },
  {
    id: 'iq-dsa-12',
    track: 'dsa',
    level: 'Advanced',
    question: 'How can a nested monotonic-stack loop still be linear?',
    answer:
      'Ek element stack mein once push aur at most once pop hota hai. Inner while ke operations poore algorithm mein total O(n) hain, isliye har outer iteration ko n cost assign karna loose aur misleading hoga.',
    followUp:
      'How do equal values change the pop condition for next greater versus next greater or equal?',
    tags: ['stack', 'amortized'],
  },
  {
    id: 'iq-dsa-13',
    track: 'dsa',
    level: 'Advanced',
    question: 'Why does Floyd’s tortoise-and-hare cycle detection actually work?',
    answer:
      'Slow pointer ek step aur fast pointer do step move karta hai, so cycle ke andar unke beech ka gap har iteration exactly ek se badhta hai — modulo cycle length yeh gap eventually zero hota hai, isliye meeting guaranteed hai agar cycle exist kare. Cycle ka start find karne ke liye meeting point se ek pointer head par reset karo aur dono ko one-step speed par chalao; woh entry node par milte hain, kyunki head-to-entry distance aur meeting-point-to-entry distance modulo cycle length equal hoti hain. O(n) time, O(1) space — Set-based detection O(n) space leta hai.',
    followUp: 'Why is a Set-based detection sometimes still preferable in real code?',
    tags: ['linked-list', 'two-pointers', 'cycle-detection'],
  },
  {
    id: 'iq-dsa-14',
    track: 'dsa',
    level: 'Advanced',
    question: 'Hash map lookup “O(1)” hai — is claim ko kab challenge karoge?',
    answer:
      'Yeh average-case claim hai jo good hash distribution assume karta hai. Agar saari keys same bucket mein collide karein, chaining implementation mein lookup O(n) degrade ho jaata hai — aur adversary jo hash function jaanta hai woh deliberately colliding keys bhej kar hash-flooding DoS kar sakta hai. Isliye real runtimes randomized seeds use karte hain, aur untrusted user input ko directly hash key banate waqt worst case consider karna chahiye; tree-ified buckets (Java 8+ HashMap) worst case ko O(log n) tak improve karte hain.',
    followUp:
      'Why does an interview answer of “hashing is always O(1)” signal shallow understanding?',
    tags: ['hashing', 'complexity', 'security'],
  },
  {
    id: 'iq-dsa-15',
    track: 'dsa',
    level: 'Advanced',
    question: 'Kab ek O(n log n) solution practically ek O(n) solution se better hota hai?',
    answer:
      'Big-O constant factors aur memory access patterns hide karta hai. Ek O(n) algorithm jo random hash lookups karta hai woh cache misses ki wajah se slow ho sakta hai, jabki O(n log n) sort jo contiguous memory par sequential passes karta hai CPU cache aur prefetcher ko fully exploit karta hai. Choti n (jaise n < 10,000) par yeh constant-factor difference asymptotic advantage ko completely overwhelm kar sakta hai — isliye claim ko realistic data size par measure karo, sirf exponent compare mat karo.',
    followUp: 'How would you empirically find the n where the crossover happens?',
    tags: ['complexity', 'performance', 'cache'],
  },
  {
    id: 'iq-dsa-16',
    track: 'dsa',
    level: 'Advanced',
    question: 'Kth largest element ke liye Quickselect ya min-heap — kaunsa choose karoge?',
    answer:
      'Quickselect expected O(n) deta hai (worst case O(n²) bad pivots par) aur input array ko in-place partition karta hai, so k large hone par bhi iterative implementation ka auxiliary space O(1) ho sakta hai; recursive versions stack space bhi leti hain — lekin yeh input ko mutate karta hai aur poora dataset memory mein chahiye. Size-k min-heap O(n log k) time aur O(k) space leta hai, input mutate nahi karta, aur crucially streaming data par kaam karta hai jahan poora array kabhi memory mein aata hi nahi. Streaming ya k << n ho to heap; static in-memory array aur single query ho to Quickselect.',
    followUp: 'Why does median-of-medians pivot selection matter for a worst-case guarantee?',
    tags: ['quickselect', 'heap', 'selection'],
  },
  {
    id: 'iq-dsa-17',
    track: 'dsa',
    level: 'Advanced',
    question:
      'Topological sort cycle detect kaise karta hai, aur yeh real systems mein kahan dikhta hai?',
    answer:
      'Kahn’s algorithm har node ka in-degree count karke zero-in-degree nodes ko queue karta hai; jab queue khaali ho jaaye lekin processed node count total nodes se kam ho, toh remaining subgraph contains a cycle; some remaining nodes may only be downstream of that cycle. DFS-based variant recursion stack mein "currently visiting" node dobara mile to back edge detect karta hai. Yeh exact mechanism build systems (Maven/Gradle dependency graph), task schedulers, aur module bundlers mein circular-dependency errors raise karta hai.',
    followUp:
      'Why is a node marked "visited" different from marked "in the current recursion stack"?',
    tags: ['graphs', 'topological-sort', 'cycle-detection'],
  },
  {
    id: 'iq-dsa-18',
    track: 'dsa',
    level: 'Advanced',
    question: 'Union-Find ke path compression aur union by rank dono kyun chahiye?',
    answer:
      'Sirf union by rank tree height ko O(log n) tak bound karta hai; sirf path compression bhi amortized improve karta hai lekin alone weaker bound deta hai. Dono saath use karne par amortized cost inverse Ackermann function α(n) ho jaati hai — jo practically har realistic n ke liye 5 se kam hai, effectively constant. Yeh Kruskal’s MST, connected-components aur dynamic connectivity problems mein sabse common "almost O(1) per operation" structure hai.',
    followUp: 'Why can Union-Find not efficiently support deletion of an edge?',
    tags: ['union-find', 'amortized', 'graphs'],
  },
  {
    id: 'iq-dsa-19',
    track: 'dsa',
    level: 'Intermediate',
    question:
      'Tree traversal recursive likhna kab risky hai, aur iterative version kya badalta hai?',
    answer:
      'Recursion depth tree ki height ke barabar hoti hai — ek balanced tree mein 1M nodes par height ~20 hai (bilkul safe), lekin ek fully skewed tree (jaise sorted data se bana BST) mein height n ho sakti hai, jo bade inputs par stack overflow karega. Iterative traversal explicit stack use karke isse heap memory mein move kar deta hai, jahan limit engine ke stack se kaafi badi hoti hai. Interview mein input ke shape par assumption clarify karna hi high-signal answer hai.',
    followUp:
      'Why does Morris traversal achieve O(1) space and what does it temporarily sacrifice?',
    tags: ['trees', 'recursion', 'traversal'],
  },
  {
    id: 'iq-dsa-20',
    track: 'dsa',
    level: 'Advanced',
    question: 'DP mein galat state definition kaise pakadoge, code run kiye bina?',
    answer:
      'State ko ek English sentence mein exactly define karo ("dp[i][w] = max value using first i items with capacity exactly w"), phir check karo ki us sentence se recurrence ka har term derive ho sakta hai aur koi bhi future decision uss state ke bahar ki information par depend na kare. Agar transition ke liye tumhe koi extra fact chahiye jo state capture nahi karti (jaise "kitni baar consecutive skip hua"), toh state under-specified hai aur answer silently wrong hoga — yeh memoization add karne se theek nahi hota. Base cases ko manually smallest inputs par verify karo, aur ek chhote example par hand-trace karke expected value se match karo.',
    followUp:
      'Why can adding a dimension fix correctness but blow up memory, and how do you compress it?',
    tags: ['dynamic-programming', 'state-design', 'correctness'],
  },
  {
    id: 'iq-design-01',
    track: 'system-design',
    level: 'Foundation',
    question: 'How should you begin a system design interview?',
    answer:
      'Core user flows, scope, scale, latency/freshness targets aur failure expectations clarify karke measurable assumptions likho. Phir API/data model aur simple end-to-end path banao; components tab add karo jab specific requirement unko justify kare.',
    followUp: 'Which three questions would you ask before designing a notification service?',
    tags: ['requirements', 'tradeoffs'],
  },
  {
    id: 'iq-design-02',
    track: 'system-design',
    level: 'Intermediate',
    question: 'How do you separate server state from UI state in a React system?',
    answer:
      'Server state remote authority, caching, freshness aur retries ke saath aata hai; UI state selections, drafts aur open panels jaise local interactions represent karta hai. Query keys ko identity/filters/tenant se align karo aur mutation ke baad invalidation ya reconciliation policy define karo.',
    followUp: 'How would you prevent one user seeing another user’s cached data after logout?',
    tags: ['react', 'state', 'caching'],
  },
  {
    id: 'iq-design-03',
    track: 'system-design',
    level: 'Intermediate',
    question: 'How would you design an accessible autocomplete?',
    answer:
      'Input, suggestions aur active option ke semantics define karo, keyboard navigation aur focus behavior implement karo, aur loading/error/empty states expose karo. Debounce request volume reduce karega, cancellation plus stale-result guards races handle karenge, aur bounded results UI cost control karenge.',
    followUp: 'What should Escape, Enter, and ArrowDown do?',
    tags: ['frontend', 'accessibility'],
  },
  {
    id: 'iq-design-04',
    track: 'system-design',
    level: 'Advanced',
    question: 'How do you keep retries from duplicating a payment-like operation?',
    answer:
      'Client operation ke liye stable idempotency key bheje aur server key, request fingerprint aur result ko durable storage mein associate kare. Concurrent duplicate requests ko uniqueness/transactional coordination se handle karo; timeout ke baad unknown outcome ko blindly fresh operation mat samjho.',
    followUp: 'What should happen if the same key is reused with a different payload?',
    tags: ['idempotency', 'retries'],
  },
  {
    id: 'iq-design-05',
    track: 'system-design',
    level: 'Intermediate',
    question: 'What can go wrong with cache-aside?',
    answer:
      'Miss par concurrent requests backend ko stampede kar sakti hain; writes aur invalidations race karke stale cache leave kar sakte hain. TTL, bounded stale policy, request coalescing aur carefully ordered invalidation help karte hain, lekin consistency requirement explicitly choose karni hoti hai.',
    followUp: 'How would you invalidate tenant-specific product lists after an update?',
    tags: ['caching', 'consistency'],
  },
  {
    id: 'iq-design-06',
    track: 'system-design',
    level: 'Advanced',
    question: 'Why use a transactional outbox?',
    answer:
      'Database update aur message publish separate systems mein ho to ek succeed aur doosra fail ho sakta hai. Same database transaction mein business row aur outbox row likho, phir relay publish kare; duplicates possible rehte hain, isliye consumers idempotent banao.',
    followUp: 'How do you preserve per-entity event ordering?',
    tags: ['events', 'transactions'],
  },
  {
    id: 'iq-design-07',
    track: 'system-design',
    level: 'Intermediate',
    question: 'How do timeouts, retries, and circuit breakers work together?',
    answer:
      'Timeout caller ka waiting budget bound karta hai; retry transient failure se recover kar sakta hai; circuit breaker repeatedly failing dependency ko calls temporarily limit karta hai. Retry budget, jitter, backoff aur idempotency zaroori hain taaki outage mein amplified traffic na bane.',
    followUp: 'How should an end-to-end deadline be divided across downstream calls?',
    tags: ['resilience', 'timeouts'],
  },
  {
    id: 'iq-design-08',
    track: 'system-design',
    level: 'Intermediate',
    question: 'How would you rate-limit a multi-instance Java API?',
    answer:
      'Identity aur limit policy define karke shared atomic counter/token-bucket storage ya gateway-level enforcement choose karo. Local in-memory limit har instance ka separate budget banata hai; distributed accuracy, datastore cost, burst allowance aur dependency failure behavior tradeoffs explain karo.',
    followUp: 'How do you distinguish user limits from IP limits?',
    tags: ['rate-limiting', 'backend'],
  },
  {
    id: 'iq-design-09',
    track: 'system-design',
    level: 'Advanced',
    question: 'When would you choose WebSocket, SSE, or polling?',
    answer:
      'WebSocket bidirectional interaction ke liye useful hai; SSE server-to-client event stream deta hai; polling simple infrastructure ke saath periodic freshness deta hai. Connection count, reconnect/resume, authentication, proxy behavior aur message ordering requirements se choice justify karo.',
    followUp: 'How would a reconnecting client recover missed notifications?',
    tags: ['realtime', 'frontend'],
  },
  {
    id: 'iq-design-10',
    track: 'system-design',
    level: 'Intermediate',
    question: 'How would you plan capacity for an API?',
    answer:
      'Peak requests per second, payload sizes, read/write mix aur latency goals estimate karo, phir storage/network aur dependency demand calculate karo. Little’s Law se stable system mein average in-flight work approximately arrival rate times average latency hota hai; tail latency aur headroom separately consider karo.',
    followUp:
      'How does doubling downstream latency affect in-flight requests at the same arrival rate?',
    tags: ['capacity', 'scaling'],
  },
  {
    id: 'iq-design-11',
    track: 'system-design',
    level: 'Advanced',
    question: 'What does CAP say during a network partition?',
    answer:
      'Partition ke dauran affected distributed operations ke liye linearizable consistency aur every non-failing node se availability dono guarantee karna possible nahi hota. Ye everyday choose-any-two slogan nahi hai; specific operation, partition behavior aur acceptable stale/unavailable outcome discuss karo.',
    followUp: 'Would inventory reservation and a profile feed make the same tradeoff?',
    tags: ['distributed-systems', 'consistency'],
  },
  {
    id: 'iq-design-12',
    track: 'system-design',
    level: 'Advanced',
    question: 'How would you observe failures across React, Java, and MongoDB?',
    answer:
      'User-visible latency/error metrics ko frontend navigation/request timings, backend traces aur database operation evidence se connect karo. Correlation IDs, structured logs, dependency spans aur SLO-based alerts investigation speed improve karte hain; sensitive payloads log kiye bina useful context preserve karo.',
    followUp: 'Which signal would distinguish a frontend rendering delay from a slow API?',
    tags: ['observability', 'full-stack'],
  },
  {
    id: 'iq-design-13',
    track: 'system-design',
    level: 'Advanced',
    question: 'Kab ek queue ya microservice add NAHI karna chahiye?',
    answer:
      'Queue tab justify hoti hai jab producer aur consumer ki rates genuinely differ karti hon, ya kaam asynchronous ho sakta ho bina user ko block kiye. Agar caller ko result turant chahiye, queue sirf ek extra hop, ek extra failure mode aur debugging complexity add karti hai — synchronous call simpler aur observable rehta hai. Isi tarah microservice tab sensible hai jab ek boundary ka apna independent deployment cadence, scaling profile ya team ownership ho; sirf "clean architecture" ke naam par service split karna distributed transactions aur network failures ko free mein invite karta hai.',
    followUp:
      'What signal in production would tell you a synchronous call should become asynchronous?',
    tags: ['architecture', 'judgment', 'tradeoffs'],
  },
  {
    id: 'iq-design-14',
    track: 'system-design',
    level: 'Advanced',
    question: 'Feed design mein fan-out on write aur fan-out on read mein kaise choose karoge?',
    answer:
      'Fan-out on write mein har post publish hote hi saare followers ki timelines mein copy ho jaata hai — read fast (ek precomputed list), lekin ek celebrity ke 10M followers par ek single post 10M writes trigger karta hai. Fan-out on read mein timeline request par followed users ke posts merge kiye jaate hain — write sasta, lekin read expensive aur latency-sensitive. Production systems aksar hybrid use karte hain: normal users ke liye write-time fan-out, aur high-follower accounts ke liye read-time merge, taaki celebrity problem tail par contained rahe.',
    followUp: 'What threshold would you use to classify an account as needing the read-time path?',
    tags: ['feed', 'fan-out', 'scaling'],
  },
  {
    id: 'iq-design-15',
    track: 'system-design',
    level: 'Advanced',
    question: 'Read replicas use karte hue user ko apni hi write turant kaise dikhaoge?',
    answer:
      'Replication lag ki wajah se write primary par jaata hai lekin turant baad ka read replica se stale data de sakta hai — user ko lagta hai uska edit "save nahi hua". Read-your-own-writes ke liye teen common options hain: us user ke reads ko write ke baad ek short window tak primary par route karo, ya write ka returned version/timestamp client mein rakh kar replica se at-least-that-version read maango, ya UI mein successful mutation response se local cache ko optimistically update kar do. Poore system ko strongly consistent banane ki zaroorat nahi — sirf us ek user ke apne data ka read path guarantee chahiye.',
    followUp: 'Why is a global "always read from primary" fix usually the wrong response to this?',
    tags: ['consistency', 'replication', 'read-your-writes'],
  },
  {
    id: 'iq-design-16',
    track: 'system-design',
    level: 'Advanced',
    question:
      'Overload ke dauran graceful degradation design kaise karoge — pehle kya shed karoge?',
    answer:
      'Features ko criticality tiers mein rank karo aur load shedding ko us order mein apply karo: pehle non-essential enrichments band karo (recommendations, "people also viewed", analytics beacons), phir expensive personalization ko cached/generic version se replace karo, aur core transaction path (checkout, login) ko last tak protect karo. Implementation mein yeh per-endpoint concurrency limits, priority queues, aur feature flags se hota hai — taaki degradation ek deliberate product decision ho, na ki random timeouts ka side effect. Partial response tab useful hai jab it stays within the deadline and preserves critical correctness; otherwise fail clearly.',
    followUp:
      'How would you make sure the degraded path itself does not depend on the failing service?',
    tags: ['resilience', 'load-shedding', 'degradation'],
  },
  {
    id: 'iq-design-17',
    track: 'system-design',
    level: 'Advanced',
    question: 'Live production database par ek column rename zero downtime mein kaise karoge?',
    answer:
      'Direct rename purane code ko turant todh deta hai kyunki deploy atomic nahi hota — isliye expand-and-contract pattern use karo. Expand phase: naya column add karo aur application ko dono columns par write karne do (dual write), purane column se read jaari rakho. Migrate phase: existing rows ko background batches mein backfill karo aur verify karo ki dono columns consistent hain. Contract phase: read ko naye column par switch karo, ek deploy cycle observe karo, phir dual write hatao aur purana column drop karo. Early phases ko reversible rakho; destructive column removal requires a separate rollback or restore plan.',
    followUp: 'Why must the backfill run in batches rather than one large UPDATE statement?',
    tags: ['migrations', 'zero-downtime', 'databases'],
  },
  {
    id: 'iq-design-18',
    track: 'system-design',
    level: 'Advanced',
    question: 'Ek hot partition (celebrity problem) kaise detect aur fix karoge?',
    answer:
      'Hot partition tab banta hai jab shard key ki distribution skewed ho — ek popular product ya ek viral user ki saari traffic ek hi shard par land karti hai, jo horizontally scale karne ke bawajood bottleneck rehta hai. Detection per-shard QPS/latency metrics se hoti hai: aggregate healthy dikhta hai lekin ek shard saturated hota hai. Fixes: key ko salt/composite banao (jaise `userId#bucketNumber`) taaki ek entity multiple partitions par spread ho, ya us specific hot entity ke liye dedicated cache/read path banao, ya append-heavy monotonic keys (timestamps) ko hash-prefix karke insertion hotspot todo.',
    followUp: 'What new problem does salting a key introduce for range queries?',
    tags: ['sharding', 'hot-partition', 'scaling'],
  },
  {
    id: 'iq-design-19',
    track: 'system-design',
    level: 'Intermediate',
    question: 'Deep pagination (page 5000) kyun break hoti hai aur alternative kya hai?',
    answer:
      'OFFSET-based pagination mein database ko skip kiye gaye saare rows actually scan karke discard karne padte hain — `OFFSET 100000` par har request 100k rows traverse karti hai, isliye page number badhne ke saath latency linearly degrade hoti hai. Concurrent inserts/deletes se rows duplicate ya skip bhi ho sakte hain kyunki offset ek stable anchor nahi hai. Cursor (keyset) pagination last row ke sort values ko WHERE clause mein use karti hai (`WHERE (created_at, id) < (?, ?)`), jo indexed seek banti hai — work can depend mainly on page size rather than offset depth when the index and filters support the seek, aur shifting data ke against stable. Trade-off: arbitrary page numbers par jump nahi kar sakte, sirf next/previous.',
    followUp: 'How would you support a “jump to last page” UI on a cursor-paginated API?',
    tags: ['pagination', 'databases', 'performance'],
  },
  {
    id: 'iq-design-20',
    track: 'system-design',
    level: 'Advanced',
    question: 'Producer consumer se tez ho to backpressure kaise handle karoge?',
    answer:
      'Unbounded queue yahan sabse khatarnak default hai — woh problem ko visible failure ke bajaye ek dheere-dheere badhta memory/latency problem bana deta hai, jab tak system OOM ya multi-hour lag tak na pahunche. Bounded buffer use karo aur full hone par explicit policy choose karo: producer ko block karo (natural backpressure, upstream tak propagate hoti hai), naye items drop karo (metrics ke liye acceptable), ya purane items drop karo (real-time dashboards ke liye), ya caller ko 429 return karo. Critical part yeh hai ki policy deliberate ho aur queue depth/consumer lag par alerting ho, taaki saturation queue overflow hone se pehle dikhe.',
    followUp: 'Why is “just add more consumers” not always a valid answer to growing lag?',
    tags: ['backpressure', 'queues', 'resilience'],
  },
  ...advancedQuestions,
  ...scenarioQuestions,
];
