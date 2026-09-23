import { machineCodingQuestions } from './machineCodingQuestions.js';
import { finalInterviewQuestions } from './finalInterviewQuestions.js';
import { extensionQuestions } from './extensionQuestions.js';
import { coverageQuestions } from './coverageQuestions.js';
import { courseQuestions } from './courseQuestions.js';
import { questionTopic } from './interviewTopics.js';
import { requestedQuestions, answerAdditions } from './requestedQuestions.js';
import { scenarioQuestions } from './scenarioQuestions.js';
import { advancedQuestions } from './advancedQuestions.js';

// Original practice questions. Explanations use Hinglish; technical terms remain English.
export const interviewQuestions = [
  {
    id: 'iq-js-01',
    track: 'javascript',
    level: 'Foundation',
    question: "var, let aur const mein kya difference hai?",
    answer:
      "- var function-scoped hota hai, jabki let aur const block-scoped hote hain.\n- let/const declaration se initialization tak temporal dead zone mein rehte hain\n- const binding ko reassign nahi kar sakte, lekin bound object mutate ho sakta hai.",
    followUp: "var loop ke delayed callbacks final index kyun dekhte hain?",
    tags: ['scope', 'variables'],
  },
  {
    id: 'iq-js-02',
    track: 'javascript',
    level: 'Foundation',
    question: "Closure kya hai aur kahan useful hai?",
    answer:
      "- Closure function ko uske lexical environment ke bindings access karne deta hai, even jab outer function return ho chuka ho.\n- Private counters, callbacks aur function factories mein useful hai\n- captured bindings live hote hain, automatically frozen copies nahi.",
    followUp: "Closure expected se zyada memory kaise retain kar sakta hai?",
    tags: ['closures', 'scope'],
  },
  {
    id: 'iq-js-03',
    track: 'javascript',
    level: 'Intermediate',
    question: "Regular aur arrow function ka this kaise decide hota hai?",
    answer:
      "- Regular function ka this call-site se decide hota hai: object method call, explicit call/apply/bind, constructor call, ya plain call.\n- Arrow function apna this create nahi karta\n- surrounding lexical scope ka this use karta hai, isliye bind se uska this replace nahi hota.",
    followUp: "Object method directly setTimeout ko doge toh kya hoga?",
    tags: ['this', 'functions'],
  },
  {
    id: 'iq-js-04',
    track: 'javascript',
    level: 'Intermediate',
    question: "Sync code, promise callbacks aur timers kis order mein chalte hain?",
    answer:
      "- Current synchronous execution pehle complete hota hai.\n- Browser event loop phir microtask checkpoint par queued promise reactions drain karta hai\n- eligible timer callback aage kisi task mein run hota hai, aur zero delay exact execution time guarantee nahi karta.",
    followUp: "Repeated microtasks rendering delay kar sakti hain?",
    tags: ['event-loop', 'promises'],
  },
  {
    id: 'iq-js-05',
    track: 'javascript',
    level: 'Foundation',
    question: "==, === aur Object.is mein kya difference hai?",
    answer:
      "- == comparison se pehle type coercion kar sakta hai, jabki === alag types ko unequal maanta hai.\n- Object.is mostly strict equality jaisa hai, lekin NaN ko khud ke equal aur +0/-0 ko different maanta hai\n- objects ke liye ye bhi identity compare karta hai.",
    followUp: "Do separately created empty objects strictly equal kyun nahi?",
    tags: ['equality', 'coercion'],
  },
  {
    id: 'iq-js-06',
    track: 'javascript',
    level: 'Intermediate',
    question: "Shallow aur deep copy mein kya difference hai?",
    answer:
      "- Spread aur Object.assign top-level properties copy karte hain, nested object references shared rehte hain.\n- structuredClone supported data types ko deeply clone kar sakta hai, including cycles, lekin functions jaise values unsupported hain aur custom prototype behavior preserve hone ka assumption nahi karna chahiye.",
    followUp: "JSON serialization general deep-clone ke liye unreliable kyun hai?",
    tags: ['objects', 'immutability'],
  },
  {
    id: 'iq-js-07',
    track: 'javascript',
    level: 'Intermediate',
    question: "Promise.all aur allSettled kab choose karoge?",
    answer:
      "- Promise.all tab useful hai jab sab results successful chahiye\n- koi input reject hote hi combined promise reject hota hai.\n- allSettled har input ka final outcome deta hai, aur dono mein remaining operations automatically cancel nahi hote.",
    followUp: "1000 requests process karte waqt concurrency limit kaise rakhoge?",
    tags: ['promises', 'concurrency'],
  },
  {
    id: 'iq-js-08',
    track: 'javascript',
    level: 'Intermediate',
    question: "Debounce aur throttle ka difference kya hai?",
    answer:
      "- Debounce events ki burst ke baad quiet period wait karke work run karta hai, jaise search suggestions.\n- Throttle work ko configured interval mein limit karta hai, jaise scroll processing\n- leading/trailing behavior explicitly define karna chahiye.",
    followUp: "Unmount par pending debounced work kaise cancel karoge?",
    tags: ['timers', 'performance'],
  },
  {
    id: 'iq-js-09',
    track: 'javascript',
    level: 'Foundation',
    question: "Prototype lookup kaise hota hai?",
    answer:
      "- Property access pehle object ki own property dekhta hai, phir prototype chain follow karta hai jab tak match ya null na mile.\n- Inherited methods share ho sakte hain\n- own property same naam se inherited property ko shadow karti hai.",
    followUp: "Object.hasOwn aur in operator mein kya difference hai?",
    tags: ['prototypes', 'objects'],
  },
  {
    id: 'iq-js-10',
    track: 'javascript',
    level: 'Advanced',
    question: "Old search response ko new result overwrite karne se kaise rokoge?",
    answer:
      "- Har request ke saath sequence ID ya cleanup-owned active flag rakho aur sirf latest request ka result apply karo.\n- AbortController unnecessary fetch ko cancel karne mein help karta hai, lekin stale-result guard phir bhi useful hai jab cancellation late ho ya downstream work cancelable na ho.",
    followUp: "Request replace ho toh loading/error state kya kare?",
    tags: ['async', 'race-conditions'],
  },
  {
    id: 'iq-js-11',
    track: 'javascript',
    level: 'Intermediate',
    question: "Plain object ke bajay Map kab loge?",
    answer:
      "- Arbitrary key types, insertion-order iteration, size aur frequent dynamic entries ke liye Map clear API deta hai.\n- Object structured records ke liye natural hai\n- Map key equality object identity use karti hai, aur specification average sublinear access require karti hai, exact O(1) guarantee nahi.",
    followUp: "WeakMap kab better choice hai?",
    tags: ['map', 'collections'],
  },
  {
    id: 'iq-js-12',
    track: 'javascript',
    level: 'Advanced',
    question: "Async function await karne se CPU-heavy work nonblocking kyun nahi hota?",
    answer:
      "- Async function ka synchronous CPU work calling thread par hi chalta hai jab tak control yield na ho.\n- Promise wrapping computation ko worker thread par move nahi karta\n- large CPU tasks ko chunk karna ya Web Worker mein transfer karna pad sakta hai.",
    followUp: "Workers mein data-transfer ki kaunsi costs dekhoge?",
    tags: ['async', 'workers', 'performance'],
  },
  {
    id: 'iq-js-13',
    track: 'javascript',
    level: 'Intermediate',
    question: "Generator function kya hai aur kab useful hai?",
    answer:
      "- function* body ko pause/resume karne deta hai\n- yield par control caller ko return hota hai aur next() call par execution wahi se resume hota hai.\n- Lazy sequences, custom iterables aur large/infinite data ko chunk-by-chunk produce karne ke liye useful hai, bina pura result upfront array mein banaye.",
    followUp: "Async aur regular generator mein kya difference hai?",
    tags: ['generators', 'iterators'],
  },
  {
    id: 'iq-js-14',
    track: 'javascript',
    level: 'Foundation',
    question: "Optional chaining/nullish coalescing, && aur || se kaise alag hain?",
    answer:
      "- ?.\n- sirf null/undefined par short-circuit karta hai aur chain ke beech safely stop ho jaata hai\n- ??\n- bhi sirf null/undefined ke liye fallback deta hai. || har falsy value (0, \"\", NaN) par fallback trigger kar deta hai, jo aksar unintended hota hai jab 0 ya empty string ek valid value ho.",
    followUp: "a undefined ho toh a.b.c ?? default phir bhi throw kyun karega?",
    tags: ['optional-chaining', 'operators'],
  },
  {
    id: 'iq-js-15',
    track: 'javascript',
    level: 'Intermediate',
    question: "Event delegation kaise aur kyun use hoti hai?",
    answer:
      "- Event bubbling ki wajah se parent ek listener attach karke child elements ke events bhi handle kar sakta hai\n- event.target actual clicked element batata hai.\n- Dynamic ya large list mein har item par separate listener attach karne ke bajaye ek delegated listener memory aur setup cost dono kam karta hai.",
    followUp: "Nested widget ke clicks ko outer delegation se kaise alag rakhoge?",
    tags: ['dom', 'events', 'delegation'],
  },
  {
    id: 'iq-js-16',
    track: 'javascript',
    level: 'Advanced',
    question: "Currying kya hai; implement kaise karoge?",
    answer:
      "- Currying ek multi-argument function ko chain of single-argument functions mein transform karta hai: add(a)(b)(c).\n- Partial application se reusable specialized functions banti hain, jaise ek fixed discount rate wala pricing function.\n- Closure har call ke previously supplied arguments retain karta hai jab tak final call na aaye.",
    followUp: "Curry helper ko ek call mein multiple arguments support kaise doge?",
    tags: ['functions', 'closures', 'functional'],
  },
  {
    id: 'iq-js-17',
    track: 'javascript',
    level: 'Advanced',
    question: "Symbol.iterator ka role kya hai?",
    answer:
      "- Symbol.iterator ek well-known symbol hai jo object ko iterable banata hai — for...of, spread, aur destructuring isi protocol par depend karte hain.\n- Custom Symbol.iterator method define karke koi bhi object (jaise ek custom collection class) built-in iteration syntax ke saath compatible ban sakta hai.",
    followUp: "Plain object directly for...of mein kyun nahi chalta?",
    tags: ['symbols', 'iterables'],
  },
  {
    id: 'iq-js-18',
    track: 'javascript',
    level: 'Advanced',
    question: "Closure long-running app mein memory leak kaise cause kar sakta hai?",
    answer:
      "- Agar ek closure kisi large object ya DOM node ko reference karta hai aur woh closure (jaise ek event listener ya timer callback) kabhi remove nahi hota, toh referenced object garbage-collect eligible kabhi nahi banta.\n- Long-lived listeners/subscriptions ke saath explicit cleanup (removeEventListener, clearInterval, unsubscribe) is isliye zaroori hai.",
    followUp: "Removed DOM node memory mein phir bhi kyun reh sakta hai?",
    tags: ['closures', 'memory', 'performance'],
  },
  {
    id: 'iq-js-19',
    track: 'javascript',
    level: 'Intermediate',
    question: "try/catch ke return ke saath finally ka behavior kya hai?",
    answer:
      "- finally block try/catch ke result ke independent hamesha run hota hai, chahe koi return ho ya exception.\n- Agar finally khud explicitly return karta hai, woh try/catch ke return ko override kar deta hai — isliye finally mein return avoid karo jab tak cleanup-only intent na ho.",
    followUp: "Plain string throw karne ke bajay custom Error kab useful hai?",
    tags: ['errors', 'control-flow'],
  },
  {
    id: 'iq-js-20',
    track: 'javascript',
    level: 'Intermediate',
    question: "CommonJS aur ES Modules loading mein kaise alag hain?",
    answer:
      "- CommonJS (require) synchronous aur runtime-evaluated hai\n- exports ek mutable object hota hai.\n- ES Modules (import/export) static structure hai — bindings compile time par resolve hote hain aur live bindings hoti hain (exporting module value update kare to importer bhi updated value dekhta hai), aur top-level await jaisi features sirf ESM mein available hain.",
    followUp: "require/import mix karne par interop issues kyun aa sakte hain?",
    tags: ['modules', 'tooling'],
  },
  {
    id: 'iq-react-01',
    track: 'react',
    level: 'Foundation',
    question: "React state snapshot hai, iska kya meaning hai?",
    answer:
      "- Har render ko us waqt ka state milta hai aur us render ke handlers wahi values capture karte hain.\n- setState future render request karta hai\n- current handler ke local state variable ko turant replace nahi karta.",
    followUp: "Three setCount(count+1) calls sirf once increment kyun kar sakti hain?",
    tags: ['state', 'rendering'],
  },
  {
    id: 'iq-react-02',
    track: 'react',
    level: 'Foundation',
    question: "List mein stable keys kyun important hain?",
    answer:
      "- Keys React ko siblings ke beech identity track karne mein help karte hain, taaki reorder ke baad correct state preserve ho.\n- Array index dynamic insert/delete/reorder mein wrong identity map kar sakta hai\n- render ke waqt random key banana har baar remount kara sakta hai.",
    followUp: "Key intentionally badalkar form reset kab karoge?",
    tags: ['keys', 'reconciliation'],
  },
  {
    id: 'iq-react-03',
    track: 'react',
    level: 'Intermediate',
    question: "useEffect kab appropriate hai?",
    answer:
      "- Effect component ko external systems, jaise subscription, browser API ya network synchronization, se sync karta hai.\n- Render se calculate hone wali value ko usually directly derive karo\n- effect dependencies mein reactive inputs include karo aur setup ka matching cleanup do.",
    followUp: "Sirf props state mein copy karne wali effect kaise hataoge?",
    tags: ['effects', 'state'],
  },
  {
    id: 'iq-react-04',
    track: 'react',
    level: 'Intermediate',
    question: "Effect ke interval mein stale state kyun mil sakti hai?",
    answer:
      "- Interval callback us render ki closure capture karta hai jahan effect create hua tha.\n- Previous value se update ke liye functional updater useful hai\n- changing external inputs ke liye dependencies aur resubscription policy correct rakhni hogi.",
    followUp: "Dependency omit karna reliable optimization kyun nahi?",
    tags: ['closures', 'effects'],
  },
  {
    id: 'iq-react-05',
    track: 'react',
    level: 'Foundation',
    question: "Controlled aur uncontrolled inputs ka difference kya hai?",
    answer:
      "- Controlled input ki value React state se aati hai aur onChange us state ko update karta hai.\n- Uncontrolled input apni current value DOM mein rakhta hai aur defaultValue ya ref se access hota hai\n- ek input ko lifecycle ke beech modes switch karne se avoid karo.",
    followUp: "Large form ke liye kya choose karoge aur kyun?",
    tags: ['forms', 'state'],
  },
  {
    id: 'iq-react-06',
    track: 'react',
    level: 'Intermediate',
    question: "memo, useMemo aur useCallback kab help karte hain?",
    answer:
      "- memo unchanged props par component rendering skip karne ka optimization deta hai\n- useMemo calculation result aur useCallback function identity cache karta hai.\n- Ye correctness tools nahi hain: actual rendering cost profile karo, aur unstable object props ya context updates se cache benefit disappear ho sakta hai.",
    followUp: "Excess memoization ki overhead/readability cost kya hai?",
    tags: ['memoization', 'performance'],
  },
  {
    id: 'iq-react-07',
    track: 'react',
    level: 'Intermediate',
    question: "Local state, Context aur store kaise choose karoge?",
    answer:
      "- State ko pehle closest owner ke paas rakho\n- shared consumers ke liye lift karo aur widely needed values ke liye Context consider karo.\n- Frequent granular updates, selectors ya complex cross-feature workflows ke liye store useful ho sakta hai\n- server cache ko client-only UI state ke saath blindly mix mat karo.",
    followUp: "Provider value change many consumers ko kyun trigger karta hai?",
    tags: ['state-management', 'context'],
  },
  {
    id: 'iq-react-08',
    track: 'react',
    level: 'Intermediate',
    question: "Render logic pure kyun honi chahiye?",
    answer:
      "- React rendering work ko repeat, interrupt ya discard kar sakta hai, isliye render ke andar external mutations predictable nahi rehte.\n- Same props/state se same UI description banao\n- user-triggered side effects handlers mein aur synchronization effects mein rakho.",
    followUp: "Render mein prop array push karna risky kyun hai?",
    tags: ['purity', 'rendering'],
  },
  {
    id: 'iq-react-09',
    track: 'react',
    level: 'Advanced',
    question: "Safe optimistic updates kaise design karoge?",
    answer:
      "- Pehle pending local change show karo, request identity aur previous server state track karo, phir success par authoritative response reconcile karo.\n- Failure par rollback ya explicit retry state do\n- overlapping mutations mein purani failure se newer success overwrite nahi honi chahiye.",
    followUp: "Server idempotency optimistic retries easy kaise karti hai?",
    tags: ['optimistic-ui', 'data-fetching'],
  },
  {
    id: 'iq-react-10',
    track: 'react',
    level: 'Advanced',
    question: "SSR aur hydration ka difference kya hai?",
    answer:
      "- SSR server par initial HTML generate karta hai\n- hydration browser mein React behavior ko us HTML se attach karta hai.\n- Server aur initial client output mismatch ho to correctness aur UX issues aa sakte hain, isliye random values, timestamps aur browser-only APIs ko carefully handle karo.",
    followUp: "Interactive dashboard ke kaunse parts SSR se benefit lete hain?",
    tags: ['ssr', 'hydration'],
  },
  {
    id: 'iq-react-11',
    track: 'react',
    level: 'Intermediate',
    question: "Error boundary kya catch kar sakti hai?",
    answer:
      "- Error boundary apne descendant tree ke rendering-related errors ko fallback UI se contain karta hai.\n- Ordinary event-handler exceptions aur arbitrary asynchronous callback errors automatically catch nahi hote\n- un flows mein explicit error handling chahiye.",
    followUp: "Multi-panel dashboard mein boundaries kahan rakhoge?",
    tags: ['errors', 'resilience'],
  },
  {
    id: 'iq-react-12',
    track: 'react',
    level: 'Advanced',
    question: "50,000-row table responsive kaise banaoge?",
    answer:
      "- Pehle measure karo ki bottleneck network, computation, DOM size ya rerenders hai.\n- Server pagination/filtering, row virtualization, stable row identity aur expensive work ka caching/worker execution combine kar sakte ho\n- keyboard navigation, focus aur screen-reader behavior ko virtualized design mein verify karo.",
    followUp: "Variable row heights virtualization ko kaise badalti hain?",
    tags: ['performance', 'accessibility'],
  },
  {
    id: 'iq-react-13',
    track: 'react',
    level: 'Intermediate',
    question: "Custom hook ko actually reusable kya banata hai?",
    answer:
      "- Custom hook stateful logic ko component se extract karta hai, lekin har calling component apna independent state instance get karta hai — koi shared state automatically nahi banta.\n- Reusable hook clear contract expose karta hai (kya input leta hai, kya return karta hai), aur internal dependencies/cleanup khud manage karta hai.",
    followUp: "Same hook use karne wale two components state share kyun nahi karte?",
    tags: ['custom-hooks', 'reuse'],
  },
  {
    id: 'iq-react-14',
    track: 'react',
    level: 'Intermediate',
    question: "Portal kab use karoge aur kya same rehta hai?",
    answer:
      "- Portal DOM output ko parent hierarchy ke bahar (jaise document.body ke child) render karta hai — modals, tooltips, dropdowns jinhe overflow:hidden ya z-index issues se bachna hai unke liye useful hai.\n- React tree ka logical parent-child relationship (context, event bubbling order) unchanged rehta hai\n- sirf actual DOM placement change hota hai.",
    followUp: "Portal ka event React parent listener tak bubble kyun hota hai?",
    tags: ['portals', 'dom'],
  },
  {
    id: 'iq-react-15',
    track: 'react',
    level: 'Intermediate',
    question: "Multiple useState ke bajay useReducer kab clearer hai?",
    answer:
      "- Jab next state previous state aur ek action dono par depend karta hai, ya multiple related fields ek saath consistently update hone chahiye, reducer ek single predictable transition function mein woh logic centralize karta hai.\n- Independent, unrelated pieces of state ke liye separate useState usually simpler rehta hai.",
    followUp: "Component render bina reducer test kaise karoge?",
    tags: ['reducer', 'state'],
  },
  {
    id: 'iq-react-16',
    track: 'react',
    level: 'Intermediate',
    question: "Refs/state ka difference aur forwardRef ka role kya hai?",
    answer:
      "- Ref mutation re-render trigger nahi karta aur value renders ke beech persist karta hai — DOM node access, timers ya \"does this need to trigger a render\" na hone wale mutable values ke liye use hota hai.\n- forwardRef tab zaroori hai jab ek parent kisi custom component ke andar wale DOM node (jaise ek input) tak directly ref se pahunchna chahta ho.",
    followUp: "Ref mutate karne se screen update kyun nahi hoti?",
    tags: ['refs', 'forwardRef'],
  },
  {
    id: 'iq-react-17',
    track: 'react',
    level: 'Advanced',
    question: "Suspense actually kis cheez ka wait karta hai?",
    answer:
      "- Suspense ek component tree ko wait karta hai jab tak uske andar koi lazy-loaded component ya Suspense-compatible data source \"not ready yet\" signal (a thrown promise) na de\n- tab tak fallback UI show hoti hai.\n- Yeh generic loading-flag pattern replace nahi karta jab tak data-fetching library explicitly Suspense integration support kare.",
    followUp: "Har component ki separate Suspense boundary loading UX hurt kyun kar sakti hai?",
    tags: ['suspense', 'lazy-loading'],
  },
  {
    id: 'iq-react-18',
    track: 'react',
    level: 'Advanced',
    question: "useEffect ke bajay useLayoutEffect kab chahiye?",
    answer:
      "- useLayoutEffect browser paint se pehle synchronously run hota hai, jabki useEffect paint ke baad run hota hai.\n- Jab DOM measurement (jaise element ka size/position) lekar turant ek visual adjustment karna ho taaki user ko ek flash/jump na dikhe, tabhi useLayoutEffect chuno — baaki sab cases mein useEffect better hai kyunki woh paint block nahi karta.",
    followUp: "useLayoutEffect overuse perceived performance hurt kyun karta hai?",
    tags: ['effects', 'rendering'],
  },
  {
    id: 'iq-react-19',
    track: 'react',
    level: 'Advanced',
    question: "startTransition/useDeferredValue kaunsi problem solve karte hain?",
    answer:
      "- Dono urgent updates (jaise typing ka input echo) ko non-urgent updates (jaise ek heavy filtered list re-render) se separate karte hain, taaki UI responsive rahe jab tak expensive work background mein complete hota hai.\n- Yeh work ko skip nahi karte, sirf priority aur interruptibility change karte hain.",
    followUp: "Continuous rapid input mein transition update delay kyun hoti reh sakti hai?",
    tags: ['concurrent-rendering', 'performance'],
  },
  {
    id: 'iq-react-20',
    track: 'react',
    level: 'Intermediate',
    question: "Good component test kya assert kare aur kya avoid kare?",
    answer:
      "- Test user-visible behavior assert kare — screen par kya text/role dikhta hai, click ke baad kya change hota hai — internal state variable names ya component implementation details par nahi.\n- Testing Library queries (role/text-based) is discipline ko encourage karte hain\n- brittle snapshot-only tests refactors ko unnecessarily break kar dete hain.",
    followUp: "Passing snapshot test accessibility regression kaise miss kar sakta hai?",
    tags: ['testing', 'accessibility'],
  },
  {
    id: 'iq-java-01',
    track: 'java',
    level: 'Foundation',
    question: "Java pass-by-value hai ya pass-by-reference?",
    answer:
      "- Java always pass-by-value hai\n- object argument mein reference ka value copy hota hai.\n- Method us referenced object ko mutate kar sakta hai, lekin parameter ko naya object assign karne se caller ki variable binding change nahi hoti.",
    followUp: "Sirf parameters reassign karke caller ke two variables swap kar sakte ho?",
    tags: ['references', 'fundamentals'],
  },
  {
    id: 'iq-java-02',
    track: 'java',
    level: 'Foundation',
    question: "==, equals aur hashCode ka relation kya hai?",
    answer:
      "- References ke liye == identity compare karta hai\n- equals logical equality define kar sakta hai.\n- Equal objects ka hashCode same hona zaroori hai, lekin same hash code se equality prove nahi hoti\n- hash collections ke keys mein mutable equality fields avoid karo.",
    followUp: "Compatible hashCode bina equals override karne se kya tootega?",
    tags: ['equality', 'collections'],
  },
  {
    id: 'iq-java-03',
    track: 'java',
    level: 'Foundation',
    question: "Abstract class ke bajay interface kab choose karoge?",
    answer:
      "- Interface behavioral contract aur multiple type roles express karta hai\n- default/static methods bhi ho sakte hain.\n- Abstract class shared instance state, constructors aur partial implementation de sakti hai, lekin class inheritance single-parent hai\n- reuse ke liye composition bhi compare karo.",
    followUp: "Conflicting interface default methods kaise resolve karoge?",
    tags: ['oop', 'interfaces'],
  },
  {
    id: 'iq-java-04',
    track: 'java',
    level: 'Intermediate',
    question: "ArrayList/LinkedList ki practical performance kaise different hai?",
    answer:
      "- ArrayList indexed access fast rakhta hai aur contiguous backing storage locality mein help kar sakti hai\n- middle insert/delete shifts demand karte hain.\n- LinkedList mein node milne ke baad rewiring cheap hai, lekin index lookup traversal aur per-node allocation cost aati hai, isliye har insertion workload mein automatically faster nahi.",
    followUp: "Java queue ke liye kya choose karoge?",
    tags: ['collections', 'complexity'],
  },
  {
    id: 'iq-java-05',
    track: 'java',
    level: 'Intermediate',
    question: "HashMap thread-safe hai? Concurrent updates ke liye kya loge?",
    answer:
      "- HashMap concurrent unsynchronized mutation ke liye safe nahi hai.\n- ConcurrentHashMap concurrent operations support karta hai, lekin multi-step check-then-act ko atomic banane ke liye compute, merge ya putIfAbsent jaise operations use karo\n- arbitrary multi-key invariants automatically atomic nahi hote.",
    followUp: "containsKey phir put ab bhi race kyun hai?",
    tags: ['concurrency', 'maps'],
  },
  {
    id: 'iq-java-06',
    track: 'java',
    level: 'Intermediate',
    question: "Checked/unchecked exceptions ka difference kya hai?",
    answer:
      "- Checked exceptions ko method catch kare ya declaration mein expose kare, ye compiler enforce karta hai.\n- RuntimeException subclasses unchecked hote hain\n- exception choose karte waqt recovery contract, context aur boundary behavior dekho, sirf compiler silence karne ke liye catch-and-ignore mat karo.",
    followUp: "try-with-resources close ki exception kaise preserve karta hai?",
    tags: ['exceptions', 'resources'],
  },
  {
    id: 'iq-java-07',
    track: 'java',
    level: 'Intermediate',
    question: "volatile aur synchronized mein difference kya hai?",
    answer:
      "- volatile reads/writes visibility aur ordering guarantees dete hain, lekin count++ jaise read-modify-write ko atomic nahi banate.\n- synchronized mutual exclusion aur happens-before relationship deta hai\n- atomic classes simple atomic updates ke liye alternative hain.",
    followUp: "Volatile counter increments lose kyun kar sakta hai?",
    tags: ['threads', 'memory-model'],
  },
  {
    id: 'iq-java-08',
    track: 'java',
    level: 'Intermediate',
    question: "Streams lazy kyun hain aur parallel streams kab avoid karoge?",
    answer:
      "- Intermediate operations pipeline describe karte hain aur terminal operation consumption trigger karta hai.\n- Parallel streams har workload fast nahi banate: small inputs, blocking calls, shared mutation aur ordering constraints overhead ya contention create kar sakte hain\n- measure before choosing.",
    followUp: "Mapping function shared state mutate kyun na kare?",
    tags: ['streams', 'functional-programming'],
  },
  {
    id: 'iq-java-09',
    track: 'java',
    level: 'Advanced',
    question: "Transactional ki guarantee aur common traps kya hain?",
    answer:
      "- Spring transaction advice configured transaction manager ke through participating resource operations ko transaction boundary deta hai.\n- Default proxy mode mein self-invocation advice bypass kar sakti hai, aur ordinary defaults RuntimeException/Error par rollback karte hain\n- external HTTP calls same database transaction ka atomic part nahi ban jaate.",
    followUp: "DB change ke baad event reliably kaise publish karoge?",
    tags: ['spring', 'transactions'],
  },
  {
    id: 'iq-java-10',
    track: 'java',
    level: 'Advanced',
    question: "Virtual threads kaunsi problem solve karti hain?",
    answer:
      "- Virtual threads many concurrent tasks jo mostly blocking I/O wait karte hain unko simpler thread-per-task style mein scale karne mein help karte hain.\n- Ye CPU cores increase nahi karte aur downstream connection pools ki limits remove nahi karte\n- resource limits, runtime version behavior aur measurement important hain.",
    followUp: "Limited dependency ke around semaphore phir bhi kyun chahiye?",
    tags: ['virtual-threads', 'concurrency'],
  },
  {
    id: 'iq-java-11',
    track: 'java',
    level: 'Intermediate',
    question: "GC wali app bhi memory leak kaise kar sakti hai?",
    answer:
      "- GC unreachable objects reclaim karta hai\n- accidentally retained reachable objects ko business meaning se unused samajhkar delete nahi karta.\n- Unbounded caches, static collections, listeners aur uncleared ThreadLocal values retention cause kar sakte hain\n- heap analysis se reference path verify karo.",
    followUp: "Leak versus temporary allocation spike ka evidence kya hai?",
    tags: ['jvm', 'memory'],
  },
  {
    id: 'iq-java-12',
    track: 'java',
    level: 'Advanced',
    question: "Slow Java API diagnose kaise karoge?",
    answer:
      "- Latency distribution aur traces se pehle time ko database, external calls, pool wait, CPU aur GC buckets mein locate karo.\n- Query plans, thread dumps, profiler data aur pool metrics ke basis par bottleneck fix karo\n- bina evidence thread count badhana dependency overload ko worsen kar sakta hai.",
    followUp: "Individual queries fast hote hue N+1 slow kyun ho sakta hai?",
    tags: ['performance', 'observability'],
  },
  {
    id: 'iq-java-13',
    track: 'java',
    level: 'Intermediate',
    question: "Records kya solve karte hain aur kaunsi limits hain?",
    answer:
      "- record ek immutable data carrier ke liye constructor, accessors, equals/hashCode aur toString automatically generate karta hai, boilerplate hata kar.\n- Trade-off yeh hai ki record implicitly final hota hai (extend nahi ho sakta) aur fields final hote hain — mutable state ya inheritance-based extension chahiye ho to plain class better fit hai.",
    followUp: "Record ko compact constructor phir bhi kyun chahiye ho sakta hai?",
    tags: ['records', 'language-features'],
  },
  {
    id: 'iq-java-14',
    track: 'java',
    level: 'Intermediate',
    question: "Optional ka right use aur common misuse kya hai?",
    answer:
      "- Optional ek method ke return type mein \"value ho bhi sakta hai, nahi bhi\" clearly signal karta hai, caller ko null-check force karke.\n- Common misuse: Optional ko field type, method parameter ya collection element ke roop mein use karna — yeh extra wrapping overhead deta hai bina real benefit ke\n- return-type use case ke bahar generally avoid karo.",
    followUp: "Presence guarantee ke bina get() risky kyun hai?",
    tags: ['optional', 'null-safety'],
  },
  {
    id: 'iq-java-15',
    track: 'java',
    level: 'Advanced',
    question: "Generics mein PECS ka kya meaning hai?",
    answer:
      "- Agar ek structure sirf values produce karta hai (tumhe read karne deta hai) to `? extends T` use karo\n- agar sirf consume karta hai (tumhe write karne deta hai) to `? super T` use karo.\n- Isse generic methods flexible bante hain bina type-safety compromise kiye — `List<? extends Number>` se read safe hai, lekin add karna compile error dega kyunki exact type unknown hai.",
    followUp: "List<? extends Number> mein Integer add kyun nahi kar sakte?",
    tags: ['generics', 'type-system'],
  },
  {
    id: 'iq-java-16',
    track: 'java',
    level: 'Advanced',
    question: "Mixed CPU/I/O workload ka thread pool size kaise choose karoge?",
    answer:
      "- Pure CPU-bound work ke liye pool size roughly available cores ke close rakho, kyunki zyada threads sirf context-switching overhead badhate hain.\n- IO-bound/blocking work ke liye pool ko wait time ke proportion mein bada rakhna padta hai (jaise `threads = cores * (1 + waitTime/computeTime)`)\n- mixed workload ko separate pools mein split karna aksar zyada predictable rehta hai.",
    followUp: "Unbounded pool bounded pool se worse throughput kyun de sakta hai?",
    tags: ['concurrency', 'executors'],
  },
  {
    id: 'iq-java-17',
    track: 'java',
    level: 'Intermediate',
    question: "Spring bean scope thread-safety assumptions ko kaise affect karta hai?",
    answer:
      "- Default `singleton` scope ka matlab hai ek hi bean instance saare concurrent requests ke beech share hoti hai — isliye mutable instance fields thread-safety issue create kar sakte hain.\n- `prototype` scope har injection point par naya instance deta hai\n- request-specific mutable state ke liye `request` scope ya method-local variables prefer karo, singleton mein mutable fields avoid karo.",
    followUp: "Mutable singleton service field production bug kyun ban sakti hai?",
    tags: ['spring', 'concurrency'],
  },
  {
    id: 'iq-java-18',
    track: 'java',
    level: 'Advanced',
    question: "Spring Security JWT request ko end-to-end authenticate kaise karti hai?",
    answer:
      "- Request pehle configured filter chain se guzarta hai\n- ek custom JWT filter Authorization header se token extract karke validate karta hai (signature, expiry) aur success par SecurityContext mein Authentication populate karta hai.\n- Downstream controller ko simply `@PreAuthorize`/method security se authorization check milta hai — filter order galat ho to authentication authorization checks se pehle nahi chalega.",
    followUp: "Stateless JWT mein CSRF blindly disable kyun nahi karna chahiye?",
    tags: ['spring-security', 'jwt'],
  },
  {
    id: 'iq-java-19',
    track: 'java',
    level: 'Advanced',
    question: "Deadlock ki four conditions aur prevention kya hain?",
    answer:
      "- Mutual exclusion, hold-and-wait, no preemption, aur circular wait — chaaron saath ho tab deadlock ban sakta hai.\n- Practical prevention: locks ko hamesha ek consistent global order mein acquire karo (sab threads same order follow karein), lock-holding duration minimize karo, aur possible ho to tryLock with timeout use karo taaki thread indefinitely block na ho.",
    followUp: "Two threads opposite lock order use karein toh deadlock risk kyun hai?",
    tags: ['concurrency', 'deadlock'],
  },
  {
    id: 'iq-java-20',
    track: 'java',
    level: 'Intermediate',
    question: "Sealed class plain interface hierarchy se extra kya deti hai?",
    answer:
      "- sealed class/interface explicitly declare karta hai ki kaunse classes usko implement/extend kar sakte hain (`permits` clause).\n- Isse switch pattern matching exhaustive ho sakta hai bina default branch ke, kyunki compiler ko saare possible subtypes pata hote hain — ek open interface ke saath yeh guarantee nahi milta, kyunki koi bhi unrelated class future mein implement kar sakti hai.",
    followUp: "Sealed hierarchy refactor ke waqt switch safer kaise banati hai?",
    tags: ['sealed-classes', 'pattern-matching'],
  },
  {
    id: 'iq-mongo-01',
    track: 'mongodb',
    level: 'Foundation',
    question: "MongoDB mein reference ke bajay embed kab karoge?",
    answer:
      "- Jo data saath read/update hota hai aur bounded size rakhta hai usko embed karna useful ho sakta hai.\n- Independent lifecycle, shared entities ya unbounded growth ho to references better ho sakte hain\n- access patterns, document-size limits aur update frequency se decision justify karo.",
    followUp: "Customer mein har order embed karoge?",
    tags: ['schema-design', 'embedding'],
  },
  {
    id: 'iq-mongo-02',
    track: 'mongodb',
    level: 'Foundation',
    question: "Single-document atomicity ka meaning kya hai?",
    answer:
      "- Ek document ki write atomic hoti hai, even jab multiple fields update hon.\n- Multiple documents ki independent writes poore group ko atomic nahi banati\n- cross-document invariant ke liye supported transaction ya different data model chahiye.",
    followUp: "Conditional update single inventory item ka overselling kaise rokta hai?",
    tags: ['atomicity', 'updates'],
  },
  {
    id: 'iq-mongo-03',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Compound index mein field order kyun matter karta hai?",
    answer:
      "- Compound index fields specified order mein sort hote hain, isliye leading prefixes aur sort/range needs query usefulness affect karte hain.\n- Equality, sort, range guideline starting point hai\n- actual predicate selectivity aur explain plan se validate karo.",
    followUp: "{team:1,createdAt:-1} team-specific newest-first queries support karega?",
    tags: ['indexes', 'queries'],
  },
  {
    id: 'iq-mongo-04',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Har field index kyun nahi karni chahiye?",
    answer:
      "- Indexes reads ko improve kar sakte hain, lekin storage aur memory consume karte hain aur writes ko maintain karna padta hai.\n- Real query shapes, selectivity aur production-like measurements se indexes choose karo\n- redundant ya unused indexes ka benefit assess karo.",
    followUp: "Read benefit bina write cost add karne wala index kaise identify karoge?",
    tags: ['indexes', 'performance'],
  },
  {
    id: 'iq-mongo-05',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Explain execution stats mein kya dekhoge?",
    answer:
      "- Winning plan, keys/documents examined aur documents returned compare karo, saath mein sort aur scan stages dekho.\n- Index scan hona alone success nahi: bahut keys scan karke tiny result milna still inefficient ho sakta hai, aur timings cache/data conditions se change hote hain.",
    followUp: "Covered query aur index-scan-plus-fetch ka difference kya hai?",
    tags: ['explain', 'performance'],
  },
  {
    id: 'iq-mongo-06',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Large OFFSET ke bajay cursor pagination better kaise hai?",
    answer:
      "- Cursor pagination last seen sort values se next range query karta hai, jisse large skip traversal avoid ho sakta hai.\n- Stable total order ke liye unique tie-breaker, jaise _id, include karo aur matching index do\n- concurrent inserts/deletes ki UX policy phir bhi define karni hoti hai.",
    followUp: "Duplicate timestamps ke saath descending createdAt paginate kaise karoge?",
    tags: ['pagination', 'indexes'],
  },
  {
    id: 'iq-mongo-07',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Aggregation pipeline ka order kaise choose karoge?",
    answer:
      "- Semantics allow kare to selective match aur useful indexed sort early rakhkar later stages ka input reduce karo.\n- Group, unwind aur lookup intermediate volume badha sakte hain\n- optimizer kuch stages reorder kar sakta hai, isliye explain aur realistic cardinalities inspect karo.",
    followUp: "match ko unwind se pehle move karne se result kab badlega?",
    tags: ['aggregation', 'pipeline'],
  },
  {
    id: 'iq-mongo-08',
    track: 'mongodb',
    level: 'Advanced',
    question: "Read concern, write concern aur read preference ka difference kya hai?",
    answer:
      "- Write concern acknowledgement aur requested durability conditions control karta hai\n- read concern read data ki consistency/isolation properties affect karta hai.\n- Read preference decide karta hai reads kaunse replica-set members ko target karein\n- secondary routing automatically fresh reads guarantee nahi karta.",
    followUp: "Read-after-write workflow mein kya change karoge?",
    tags: ['replication', 'consistency'],
  },
  {
    id: 'iq-mongo-09',
    track: 'mongodb',
    level: 'Advanced',
    question: "Shard key kaise choose karoge?",
    answer:
      "- Cardinality, value distribution, write distribution aur common query routing ko saath evaluate karo.\n- Poor choice hot shard ya scatter-gather queries create kar sakti hai\n- hashed distribution aur range locality ke tradeoffs workload ke against compare karo.",
    followUp: "Increasing range key insertion hotspot kyun bana sakti hai?",
    tags: ['sharding', 'scaling'],
  },
  {
    id: 'iq-mongo-10',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Unique index correctness kaise protect karta hai?",
    answer:
      "- Unique index allowed indexed values par uniqueness database level par enforce karta hai, jo application check-then-insert race se stronger hai.\n- Compound uniqueness business scope express kar sakti hai\n- missing/null, partial filters aur sharding restrictions ko schema ke hisaab se check karo.",
    followUp: "Har organization ke andar unique username kaise enforce karoge?",
    tags: ['indexes', 'constraints'],
  },
  {
    id: 'iq-mongo-11',
    track: 'mongodb',
    level: 'Advanced',
    question: "MongoDB transaction kab chahiye?",
    answer:
      "- Jab invariant multiple documents ki changes ko all-or-nothing require karta ho tab transaction useful hai.\n- Transaction cost, retry rules aur deployment support consider karo\n- driver transaction callback retry ho sakta hai, isliye usmein external side effects blindly execute mat karo.",
    followUp: "Bounded aggregate embed karne se transaction kaise avoid ho sakti hai?",
    tags: ['transactions', 'modeling'],
  },
  {
    id: 'iq-mongo-12',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Application validation alone enough kyun nahi?",
    answer:
      "- Application validation helpful error messages deti hai, lekin different writers ya bugs usko bypass kar sakte hain.\n- Database schema validation accepted document shape restrict kar sakti hai aur indexes additional invariants enforce karte hain\n- migrations mein old documents aur validation mode plan karo.",
    followUp: "New required field old writers tode bina kaise rollout karoge?",
    tags: ['validation', 'migrations'],
  },
  {
    id: 'iq-mongo-13',
    track: 'mongodb',
    level: 'Advanced',
    question: "Change streams kis kaam aati hain?",
    answer:
      "- Change streams ek collection/database par real-time insert/update/delete events ko tail karne deti hain, bina polling ke.\n- Reactive cache invalidation, audit logging, ya downstream service notification ke liye useful hain\n- resume tokens se consumer restart ke baad missed events se continue kar sakta hai, lekin at-least-once delivery assume karo.",
    followUp: "Resume ke baad event double-process kaise rokoge?",
    tags: ['change-streams', 'real-time'],
  },
  {
    id: 'iq-mongo-14',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Old session documents auto-expire kaise karoge?",
    answer:
      "- TTL index (`expireAfterSeconds`) ek date field par set karke MongoDB background process periodically expired documents delete kar deta hai.\n- Yeh exact-second precision guarantee nahi karta (background sweep interval-based hai), isliye strict expiry-time enforcement application logic mein bhi verify karo, sirf TTL par depend mat karo.",
    followUp: "TTL expiry ke baad bhi document briefly present kyun ho sakta hai?",
    tags: ['indexes', 'ttl'],
  },
  {
    id: 'iq-mongo-15',
    track: 'mongodb',
    level: 'Advanced',
    question: "Schema downtime bina evolve kaise karoge?",
    answer:
      "- Naya field optional/nullable-friendly rakho taaki purane documents bina migration ke bhi valid rahein\n- application code dono shapes (old aur new) ko handle kare during transition.\n- Bada backfill ek background job se batches mein karo, aur schema validation ko \"warn\" mode se shuru karke gradually \"strict\" tak tighten karo.",
    followUp: "Large collection par one-shot synchronous migration risky kyun hai?",
    tags: ['schema-design', 'migrations'],
  },
  {
    id: 'iq-mongo-16',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Individual operations ke bajay bulkWrite kab helpful hai?",
    answer:
      "- bulkWrite multiple insert/update/delete operations ko ek hi network round-trip mein batch karta hai, jisse many-small-writes workload mein latency significantly kam hoti hai.\n- Ordered bulk operations first error par stop ho jaate hain\n- unordered mode independent operations continue karta hai — consistency requirement ke hisaab se mode choose karo.",
    followUp: "Unordered bulkWrite partial success/failure dono kyun de sakta hai?",
    tags: ['bulk-operations', 'performance'],
  },
  {
    id: 'iq-mongo-17',
    track: 'mongodb',
    level: 'Advanced',
    question: "Direct document ke bajay GridFS kab loge?",
    answer:
      "- GridFS large binary files (16MB BSON document limit se bade) ko chunks mein split karke store karta hai, streaming read/write allow karta hai.\n- Chhote files (images/thumbnails) ke liye aksar object storage (S3-jaisa) ya even a document field zyada simple/cheap option hota hai\n- GridFS specifically MongoDB ke andar hi large-file storage chahiye tab useful hai.",
    followUp: "Frequent partial file updates ke liye GridFS weak fit kyun hai?",
    tags: ['gridfs', 'storage'],
  },
  {
    id: 'iq-mongo-18',
    track: 'mongodb',
    level: 'Intermediate',
    question: "Text index aur regex search ka difference kya hai?",
    answer:
      "- Text index tokenized, stemmed words par inverted-index-style lookup karta hai aur relevance score de sakta hai — multi-word natural search ke liye efficient hai.\n- Regex query (especially leading-wildcard) collection scan kar sakti hai kyunki woh index-friendly prefix match nahi hai\n- exact substring/pattern matching ke liye regex sahi hai, natural language search ke liye text index.",
    followUp: "Unanchored /foo/ normal index efficiently kyun nahi use karta?",
    tags: ['text-search', 'indexes'],
  },
  {
    id: 'iq-mongo-19',
    track: 'mongodb',
    level: 'Advanced',
    question: "Load par Node app Mongo connections exhaust kyun kar sakti hai?",
    answer:
      "- Driver ek connection pool maintain karta hai\n- agar concurrent operations pool size se zyada ho jaayein to requests wait karte hain ya timeout ho sakte hain.\n- Multiple app instances/serverless cold-starts har ek apna pool banate hain, jo cumulatively database ki max-connections limit exceed kar sakta hai — pool size tuning aur connection reuse (especially serverless mein) zaroori hai.",
    followUp: "Serverless mein pool exhaustion ka risk zyada kyun ho sakta hai?",
    tags: ['connections', 'scaling'],
  },
  {
    id: 'iq-mongo-20',
    track: 'mongodb',
    level: 'Advanced',
    question: "Aggregation $lookup ki performance risks kya hain?",
    answer:
      "- $lookup ek left-outer-join-jaisa operation hai jo dusri collection ko per-document query kar sakta hai — bina supporting index ke yeh expensive collection scans multiply kar deta hai.\n- Joined collection ke lookup field par index rakho, aur $lookup se pehle $match se input documents jitna possible reduce karo taaki join sirf necessary rows par ho.",
    followUp: "Repeated lookups document model rethink ka signal kyun hain?",
    tags: ['aggregation', 'lookup'],
  },
  {
    id: 'iq-dsa-01',
    track: 'dsa',
    level: 'Foundation',
    question: "Worst-case aur amortized complexity mein difference kya hai?",
    answer:
      "- Worst-case bound ek operation ya input ke maximum cost ko describe karta hai.\n- Amortized analysis operations ki sequence ka total cost distribute karta hai, jaise dynamic array mein occasional resize ke bawajood amortized O(1) append\n- ye random-input average nahi hai.",
    followUp: "Amortized O(1) operation ki ek call O(n) le sakti hai?",
    tags: ['complexity', 'amortized'],
  },
  {
    id: 'iq-dsa-02',
    track: 'dsa',
    level: 'Foundation',
    question: "Two pointers quadratic pair search kab replace kar sakte hain?",
    answer:
      "- Sorted input mein sum too small ho to left pointer aur too large ho to right pointer move karke impossible candidates discard kar sakte hain.\n- Correctness sorted order se aati hai\n- unsorted data ko pehle sort karne ka cost aur original-index handling analysis mein include karo.",
    followUp: "Sorting bina original indices preserve karne ka alternative kya hai?",
    tags: ['two-pointers', 'arrays'],
  },
  {
    id: 'iq-dsa-03',
    track: 'dsa',
    level: 'Intermediate',
    question: "Negative numbers variable sliding window kyun tod sakte hain?",
    answer:
      "- Common sum-window invariant assume karta hai ki right expand karne se sum increase aur left shrink karne se decrease hoga.\n- Negative values is monotonicity ko break karte hain, isliye prefix-sum methods ya problem-specific deque solution chahiye ho sakta hai.",
    followUp: "Fixed-size max-sum window ki bhi yahi restriction hai?",
    tags: ['sliding-window', 'prefix-sum'],
  },
  {
    id: 'iq-dsa-04',
    track: 'dsa',
    level: 'Intermediate',
    question: "Binary search correct terminate hoti hai, prove kaise karoge?",
    answer:
      "- Pehle invariant define karo, jaise answer current half-open interval mein hai aur outside boundaries resolved hain.\n- Har update interval strictly shrink kare aur invariant preserve kare\n- termination par empty unknown interval desired boundary identify karta hai.",
    followUp: "Duplicates ka first occurrence return kaise karoge?",
    tags: ['binary-search', 'invariants'],
  },
  {
    id: 'iq-dsa-05',
    track: 'dsa',
    level: 'Intermediate',
    question: "Memoization bina recursive Fibonacci exponential kyun hai?",
    answer:
      "- Same fib(k) states repeatedly recompute hote hain, jisse call tree exponentially grow karta hai.\n- Memoization each distinct k ko once solve karta hai: O(n) arithmetic operations aur O(n) stored/stack state under constant-cost arithmetic\n- rolling iteration extra state O(1) kar sakti hai.",
    followUp: "BigInt strict O(n) time claim ko complicate kyun karta hai?",
    tags: ['recursion', 'dynamic-programming'],
  },
  {
    id: 'iq-dsa-06',
    track: 'dsa',
    level: 'Intermediate',
    question: "BFS shortest path kab deta hai?",
    answer:
      "- Unweighted ya equal-weight graph mein BFS increasing edge-count layers explore karta hai, isliye first discovery minimum edges deta hai.\n- Unequal nonnegative weights ke liye standard BFS minimum total weight guarantee nahi karta\n- Dijkstra appropriate ho sakta hai.",
    followUp: "Visited enqueue par kyun mark karein, dequeue par kyun nahi?",
    tags: ['graphs', 'bfs'],
  },
  {
    id: 'iq-dsa-07',
    track: 'dsa',
    level: 'Intermediate',
    question: "Binary heap aur BST ka difference kya hai?",
    answer:
      "- Heap parent-child priority order enforce karta hai aur root minimum/maximum efficiently deta hai\n- arbitrary lookup generally O(n) hai.\n- BST subtree ordering enforce karta hai aur search/range operations support karta hai, lekin unbalanced height O(n) ho sakti hai.",
    followUp: "Heap array fully sorted kyun nahi hota?",
    tags: ['heap', 'bst'],
  },
  {
    id: 'iq-dsa-08',
    track: 'dsa',
    level: 'Foundation',
    question: "Singly linked list constant extra space mein reverse kaise karoge?",
    answer:
      "- previous, current aur saved next pointers maintain karo\n- next ko overwrite karne se pehle save karke current link reverse karo.\n- Har node ek baar process hota hai, so O(n) time aur O(1) auxiliary space\n- list wrapper ka tail bhi update karna pad sakta hai.",
    followUp: "Input mein cycle possible ho toh kya badlega?",
    tags: ['linked-list', 'pointers'],
  },
  {
    id: 'iq-dsa-09',
    track: 'dsa',
    level: 'Intermediate',
    question: "Quicksort hamesha O(n log n) kyun nahi?",
    answer:
      "- Partition baar-baar extremely uneven ho to recurrence roughly T(n)=T(n-1)+O(n) ban jati hai, giving O(n²).\n- Random pivots expected O(n log n) behavior dete hain, lekin worst case erase nahi karte\n- duplicates ke liye three-way partition helpful hai.",
    followUp: "Merge sort ke stability/memory tradeoffs kya hain?",
    tags: ['sorting', 'quicksort'],
  },
  {
    id: 'iq-dsa-10',
    track: 'dsa',
    level: 'Advanced',
    question: "Large stream se top-k kaise nikaloge?",
    answer:
      "- Size k ka min-heap maintain karo jab largest k items chahiye: root current selected minimum hoga.\n- Har incoming item O(log k) update demand kar sakta hai, giving O(n log k) time aur O(k) memory\n- output sorted chahiye to additional ordering cost include karo.",
    followUp: "Duplicates/stable ties heap key ko kaise affect karte hain?",
    tags: ['heap', 'streaming'],
  },
  {
    id: 'iq-dsa-11',
    track: 'dsa',
    level: 'Advanced',
    question: "Memoization aur tabulation ka difference kya hai?",
    answer:
      "- Memoization recursive demand ke basis par reachable states cache karta hai\n- tabulation dependency order mein states iteratively fill karta hai.\n- Dono same recurrence solve kar sakte hain, lekin stack usage, unreachable-state work aur memory compression opportunities alag hoti hain.",
    followUp: "Minimum coin change ki state/base cases kaise define karoge?",
    tags: ['dynamic-programming', 'memoization'],
  },
  {
    id: 'iq-dsa-12',
    track: 'dsa',
    level: 'Advanced',
    question: "Nested monotonic-stack loop linear kaise ho sakta hai?",
    answer:
      "- Ek element stack mein once push aur at most once pop hota hai.\n- Inner while ke operations poore algorithm mein total O(n) hain, isliye har outer iteration ko n cost assign karna loose aur misleading hoga.",
    followUp: "Next greater versus greater-or-equal mein pop condition kya hogi?",
    tags: ['stack', 'amortized'],
  },
  {
    id: 'iq-dsa-13',
    track: 'dsa',
    level: 'Advanced',
    question: "Floyd tortoise-and-hare cycle detection work kyun karta hai?",
    answer:
      "- Slow pointer ek step aur fast pointer do step move karta hai, so cycle ke andar unke beech ka gap har iteration exactly ek se badhta hai — modulo cycle length yeh gap eventually zero hota hai, isliye meeting guaranteed hai agar cycle exist kare.\n- Cycle ka start find karne ke liye meeting point se ek pointer head par reset karo aur dono ko one-step speed par chalao\n- woh entry node par milte hain, kyunki head-to-entry distance aur meeting-point-to-entry distance modulo cycle length equal hoti hain.\n- O(n) time, O(1) space — Set-based detection O(n) space leta hai.",
    followUp: "Real code mein Set-based detection kab preferable hai?",
    tags: ['linked-list', 'two-pointers', 'cycle-detection'],
  },
  {
    id: 'iq-dsa-14',
    track: 'dsa',
    level: 'Advanced',
    question: "Hash lookup O(1) claim ko kab challenge karoge?",
    answer:
      "- Yeh average-case claim hai jo good hash distribution assume karta hai.\n- Agar saari keys same bucket mein collide karein, chaining implementation mein lookup O(n) degrade ho jaata hai — aur adversary jo hash function jaanta hai woh deliberately colliding keys bhej kar hash-flooding DoS kar sakta hai.\n- Isliye real runtimes randomized seeds use karte hain, aur untrusted user input ko directly hash key banate waqt worst case consider karna chahiye\n- tree-ified buckets (Java 8+ HashMap) worst case ko O(log n) tak improve karte hain.",
    followUp: "“Hashing always O(1)” mein kaunsi assumptions missing hain?",
    tags: ['hashing', 'complexity', 'security'],
  },
  {
    id: 'iq-dsa-15',
    track: 'dsa',
    level: 'Advanced',
    question: "O(n log n) practically O(n) se better kab ho sakta hai?",
    answer:
      "- Big-O constant factors aur memory access patterns hide karta hai.\n- Ek O(n) algorithm jo random hash lookups karta hai woh cache misses ki wajah se slow ho sakta hai, jabki O(n log n) sort jo contiguous memory par sequential passes karta hai CPU cache aur prefetcher ko fully exploit karta hai.\n- Choti n (jaise n < 10,000) par yeh constant-factor difference asymptotic advantage ko completely overwhelm kar sakta hai — isliye claim ko realistic data size par measure karo, sirf exponent compare mat karo.",
    followUp: "Crossover input size experiment se kaise dhundoge?",
    tags: ['complexity', 'performance', 'cache'],
  },
  {
    id: 'iq-dsa-16',
    track: 'dsa',
    level: 'Advanced',
    question: "Kth-largest ke liye Quickselect ya min-heap kab choose karoge?",
    answer:
      "- Quickselect expected O(n) deta hai (worst case O(n²) bad pivots par) aur input array ko in-place partition karta hai, so k large hone par bhi iterative implementation ka auxiliary space O(1) ho sakta hai\n- recursive versions stack space bhi leti hain — lekin yeh input ko mutate karta hai aur poora dataset memory mein chahiye.\n- Size-k min-heap O(n log k) time aur O(k) space leta hai, input mutate nahi karta, aur crucially streaming data par kaam karta hai jahan poora array kabhi memory mein aata hi nahi.\n- Streaming ya k << n ho to heap\n- static in-memory array aur single query ho to Quickselect.",
    followUp: "Worst-case guarantee mein median-of-medians kyun matter karta hai?",
    tags: ['quickselect', 'heap', 'selection'],
  },
  {
    id: 'iq-dsa-17',
    track: 'dsa',
    level: 'Advanced',
    question: "Topological sort cycle kaise detect karta hai aur kahan useful hai?",
    answer:
      "- Kahn’s algorithm har node ka in-degree count karke zero-in-degree nodes ko queue karta hai\n- jab queue khaali ho jaaye lekin processed node count total nodes se kam ho, toh remaining subgraph contains a cycle\n- some remaining nodes may only be downstream of that cycle.\n- DFS-based variant recursion stack mein \"currently visiting\" node dobara mile to back edge detect karta hai.\n- Yeh exact mechanism build systems (Maven/Gradle dependency graph), task schedulers, aur module bundlers mein circular-dependency errors raise karta hai.",
    followUp: "Visited aur current recursion stack mein hone ka difference kya hai?",
    tags: ['graphs', 'topological-sort', 'cycle-detection'],
  },
  {
    id: 'iq-dsa-18',
    track: 'dsa',
    level: 'Advanced',
    question: "Path compression aur union by rank dono kyun chahiye?",
    answer:
      "- Sirf union by rank tree height ko O(log n) tak bound karta hai\n- sirf path compression bhi amortized improve karta hai lekin alone weaker bound deta hai.\n- Dono saath use karne par amortized cost inverse Ackermann function α(n) ho jaati hai — jo practically har realistic n ke liye 5 se kam hai, effectively constant.\n- Yeh Kruskal’s MST, connected-components aur dynamic connectivity problems mein sabse common \"almost O(1) per operation\" structure hai.",
    followUp: "Union-Find edge deletion efficiently kyun support nahi karta?",
    tags: ['union-find', 'amortized', 'graphs'],
  },
  {
    id: 'iq-dsa-19',
    track: 'dsa',
    level: 'Intermediate',
    question: "Recursive tree traversal risky kab hai; iterative kya badalta hai?",
    answer:
      "- Recursion depth tree ki height ke barabar hoti hai — ek balanced tree mein 1M nodes par height ~20 hai (bilkul safe), lekin ek fully skewed tree (jaise sorted data se bana BST) mein height n ho sakti hai, jo bade inputs par stack overflow karega.\n- Iterative traversal explicit stack use karke isse heap memory mein move kar deta hai, jahan limit engine ke stack se kaafi badi hoti hai.\n- Interview mein input ke shape par assumption clarify karna hi high-signal answer hai.",
    followUp: "Morris O(1) space ke badle temporarily kya modify karta hai?",
    tags: ['trees', 'recursion', 'traversal'],
  },
  {
    id: 'iq-dsa-20',
    track: 'dsa',
    level: 'Advanced',
    question: "Code run bina wrong DP state kaise pakadoge?",
    answer:
      "- State ko ek English sentence mein exactly define karo (\"dp[i][w] = max value using first i items with capacity exactly w\"), phir check karo ki us sentence se recurrence ka har term derive ho sakta hai aur koi bhi future decision uss state ke bahar ki information par depend na kare.\n- Agar transition ke liye tumhe koi extra fact chahiye jo state capture nahi karti (jaise \"kitni baar consecutive skip hua\"), toh state under-specified hai aur answer silently wrong hoga — yeh memoization add karne se theek nahi hota.\n- Base cases ko manually smallest inputs par verify karo, aur ek chhote example par hand-trace karke expected value se match karo.",
    followUp: "Dimension correctness fix karke memory kyun badhata hai; compress kaise karoge?",
    tags: ['dynamic-programming', 'state-design', 'correctness'],
  },
  {
    id: 'iq-design-01',
    track: 'system-design',
    level: 'Foundation',
    question: "System design interview start kaise karoge?",
    answer:
      "- Core user flows, scope, scale, latency/freshness targets aur failure expectations clarify karke measurable assumptions likho.\n- Phir API/data model aur simple end-to-end path banao\n- components tab add karo jab specific requirement unko justify kare.",
    followUp: "Notification service se pehle kaunse three questions puchoge?",
    tags: ['requirements', 'tradeoffs'],
  },
  {
    id: 'iq-design-02',
    track: 'system-design',
    level: 'Intermediate',
    question: "React mein server/UI state separate kaise karoge?",
    answer:
      "- Server state remote authority, caching, freshness aur retries ke saath aata hai\n- UI state selections, drafts aur open panels jaise local interactions represent karta hai.\n- Query keys ko identity/filters/tenant se align karo aur mutation ke baad invalidation ya reconciliation policy define karo.",
    followUp: "Logout ke baad next user ko previous cache dikhne se kaise rokoge?",
    tags: ['react', 'state', 'caching'],
  },
  {
    id: 'iq-design-03',
    track: 'system-design',
    level: 'Intermediate',
    question: "Accessible autocomplete kaise design karoge?",
    answer:
      "- Input, suggestions aur active option ke semantics define karo, keyboard navigation aur focus behavior implement karo, aur loading/error/empty states expose karo.\n- Debounce request volume reduce karega, cancellation plus stale-result guards races handle karenge, aur bounded results UI cost control karenge.",
    followUp: "Escape, Enter aur ArrowDown kya karein?",
    tags: ['frontend', 'accessibility'],
  },
  {
    id: 'iq-design-04',
    track: 'system-design',
    level: 'Advanced',
    question: "Retries payment-like operation duplicate na karein, kaise?",
    answer:
      "- Client operation ke liye stable idempotency key bheje aur server key, request fingerprint aur result ko durable storage mein associate kare.\n- Concurrent duplicate requests ko uniqueness/transactional coordination se handle karo\n- timeout ke baad unknown outcome ko blindly fresh operation mat samjho.",
    followUp: "Same key different payload se reuse ho toh kya hoga?",
    tags: ['idempotency', 'retries'],
  },
  {
    id: 'iq-design-05',
    track: 'system-design',
    level: 'Intermediate',
    question: "Cache-aside mein kya galat ho sakta hai?",
    answer:
      "- Miss par concurrent requests backend ko stampede kar sakti hain\n- writes aur invalidations race karke stale cache leave kar sakte hain.\n- TTL, bounded stale policy, request coalescing aur carefully ordered invalidation help karte hain, lekin consistency requirement explicitly choose karni hoti hai.",
    followUp: "Update ke baad tenant product lists invalidate kaise karoge?",
    tags: ['caching', 'consistency'],
  },
  {
    id: 'iq-design-06',
    track: 'system-design',
    level: 'Advanced',
    question: "Transactional outbox kyun use karte hain?",
    answer:
      "- Database update aur message publish separate systems mein ho to ek succeed aur doosra fail ho sakta hai.\n- Same database transaction mein business row aur outbox row likho, phir relay publish kare\n- duplicates possible rehte hain, isliye consumers idempotent banao.",
    followUp: "Per-entity event order preserve kaise karoge?",
    tags: ['events', 'transactions'],
  },
  {
    id: 'iq-design-07',
    track: 'system-design',
    level: 'Intermediate',
    question: "Timeout, retry aur circuit breaker saath kaise work karte hain?",
    answer:
      "- Timeout caller ka waiting budget bound karta hai\n- retry transient failure se recover kar sakta hai\n- circuit breaker repeatedly failing dependency ko calls temporarily limit karta hai.\n- Retry budget, jitter, backoff aur idempotency zaroori hain taaki outage mein amplified traffic na bane.",
    followUp: "End-to-end deadline downstream calls mein kaise baantoge?",
    tags: ['resilience', 'timeouts'],
  },
  {
    id: 'iq-design-08',
    track: 'system-design',
    level: 'Intermediate',
    question: "Multi-instance Java API rate-limit kaise karoge?",
    answer:
      "- Identity aur limit policy define karke shared atomic counter/token-bucket storage ya gateway-level enforcement choose karo.\n- Local in-memory limit har instance ka separate budget banata hai\n- distributed accuracy, datastore cost, burst allowance aur dependency failure behavior tradeoffs explain karo.",
    followUp: "User aur IP limits ko kaise alag rakhoge?",
    tags: ['rate-limiting', 'backend'],
  },
  {
    id: 'iq-design-09',
    track: 'system-design',
    level: 'Advanced',
    question: "WebSocket, SSE ya polling kab choose karoge?",
    answer:
      "- WebSocket bidirectional interaction ke liye useful hai\n- SSE server-to-client event stream deta hai\n- polling simple infrastructure ke saath periodic freshness deta hai.\n- Connection count, reconnect/resume, authentication, proxy behavior aur message ordering requirements se choice justify karo.",
    followUp: "Reconnect par missed notifications kaise recover karoge?",
    tags: ['realtime', 'frontend'],
  },
  {
    id: 'iq-design-10',
    track: 'system-design',
    level: 'Intermediate',
    question: "API capacity plan kaise karoge?",
    answer:
      "- Peak requests per second, payload sizes, read/write mix aur latency goals estimate karo, phir storage/network aur dependency demand calculate karo.\n- Little’s Law se stable system mein average in-flight work approximately arrival rate times average latency hota hai\n- tail latency aur headroom separately consider karo.",
    followUp: "Same arrival rate par downstream latency double ho toh in-flight count kya hoga?",
    tags: ['capacity', 'scaling'],
  },
  {
    id: 'iq-design-11',
    track: 'system-design',
    level: 'Advanced',
    question: "Network partition ke dauran CAP kya kehta hai?",
    answer:
      "- Partition ke dauran affected distributed operations ke liye linearizable consistency aur every non-failing node se availability dono guarantee karna possible nahi hota.\n- Ye everyday choose-any-two slogan nahi hai\n- specific operation, partition behavior aur acceptable stale/unavailable outcome discuss karo.",
    followUp: "Inventory reservation aur profile feed same tradeoff choose karenge?",
    tags: ['distributed-systems', 'consistency'],
  },
  {
    id: 'iq-design-12',
    track: 'system-design',
    level: 'Advanced',
    question: "React, Java aur Mongo failures connect karke kaise observe karoge?",
    answer:
      "- User-visible latency/error metrics ko frontend navigation/request timings, backend traces aur database operation evidence se connect karo.\n- Correlation IDs, structured logs, dependency spans aur SLO-based alerts investigation speed improve karte hain\n- sensitive payloads log kiye bina useful context preserve karo.",
    followUp: "Frontend render delay versus slow API ka signal kya hoga?",
    tags: ['observability', 'full-stack'],
  },
  {
    id: 'iq-design-13',
    track: 'system-design',
    level: 'Advanced',
    question: "Queue/microservice kab add nahi karni chahiye?",
    answer:
      "- Queue tab justify hoti hai jab producer aur consumer ki rates genuinely differ karti hon, ya kaam asynchronous ho sakta ho bina user ko block kiye.\n- Agar caller ko result turant chahiye, queue sirf ek extra hop, ek extra failure mode aur debugging complexity add karti hai — synchronous call simpler aur observable rehta hai.\n- Isi tarah microservice tab sensible hai jab ek boundary ka apna independent deployment cadence, scaling profile ya team ownership ho\n- sirf \"clean architecture\" ke naam par service split karna distributed transactions aur network failures ko free mein invite karta hai.",
    followUp: "Sync call ko async karne ki need ka production signal kya hai?",
    tags: ['architecture', 'judgment', 'tradeoffs'],
  },
  {
    id: 'iq-design-14',
    track: 'system-design',
    level: 'Advanced',
    question: "Feed mein fan-out-on-write versus read kaise choose karoge?",
    answer:
      "- Fan-out on write mein har post publish hote hi saare followers ki timelines mein copy ho jaata hai — read fast (ek precomputed list), lekin ek celebrity ke 10M followers par ek single post 10M writes trigger karta hai.\n- Fan-out on read mein timeline request par followed users ke posts merge kiye jaate hain — write sasta, lekin read expensive aur latency-sensitive.\n- Production systems aksar hybrid use karte hain: normal users ke liye write-time fan-out, aur high-follower accounts ke liye read-time merge, taaki celebrity problem tail par contained rahe.",
    followUp: "Read-time path ke liye account classify karne ka measured threshold kya hoga?",
    tags: ['feed', 'fan-out', 'scaling'],
  },
  {
    id: 'iq-design-15',
    track: 'system-design',
    level: 'Advanced',
    question: "Replica ke saath user ko own-write turant kaise dikhaoge?",
    answer:
      "- Replication lag ki wajah se write primary par jaata hai lekin turant baad ka read replica se stale data de sakta hai — user ko lagta hai uska edit \"save nahi hua\".\n- Read-your-own-writes ke liye teen common options hain: us user ke reads ko write ke baad ek short window tak primary par route karo, ya write ka returned version/timestamp client mein rakh kar replica se at-least-that-version read maango, ya UI mein successful mutation response se local cache ko optimistically update kar do.\n- Poore system ko strongly consistent banane ki zaroorat nahi — sirf us ek user ke apne data ka read path guarantee chahiye.",
    followUp: "Globally always-primary reads blanket fix kyun nahi honi chahiye?",
    tags: ['consistency', 'replication', 'read-your-writes'],
  },
  {
    id: 'iq-design-16',
    track: 'system-design',
    level: 'Advanced',
    question: "Overload mein pehle kya degrade karoge aur kyun?",
    answer:
      "- Features ko criticality tiers mein rank karo aur load shedding ko us order mein apply karo: pehle non-essential enrichments band karo (recommendations, \"people also viewed\", analytics beacons), phir expensive personalization ko cached/generic version se replace karo, aur core transaction path (checkout, login) ko last tak protect karo.\n- Implementation mein yeh per-endpoint concurrency limits, priority queues, aur feature flags se hota hai — taaki degradation ek deliberate product decision ho, na ki random timeouts ka side effect.\n- Partial response tab useful hai jab it stays within the deadline and preserves critical correctness\n- otherwise fail clearly.",
    followUp: "Degraded path failing dependency se independent hai, kaise verify karoge?",
    tags: ['resilience', 'load-shedding', 'degradation'],
  },
  {
    id: 'iq-design-17',
    track: 'system-design',
    level: 'Advanced',
    question: "Live DB column zero downtime rename kaise karoge?",
    answer:
      "- Direct rename purane code ko turant todh deta hai kyunki deploy atomic nahi hota — isliye expand-and-contract pattern use karo.\n- Expand phase: naya column add karo aur application ko dono columns par write karne do (dual write), purane column se read jaari rakho.\n- Migrate phase: existing rows ko background batches mein backfill karo aur verify karo ki dono columns consistent hain.\n- Contract phase: read ko naye column par switch karo, ek deploy cycle observe karo, phir dual write hatao aur purana column drop karo.\n- Early phases ko reversible rakho\n- destructive column removal requires a separate rollback or restore plan.",
    followUp: "Backfill one large UPDATE ke bajay batches mein kyun?",
    tags: ['migrations', 'zero-downtime', 'databases'],
  },
  {
    id: 'iq-design-18',
    track: 'system-design',
    level: 'Advanced',
    question: "Hot partition detect/fix kaise karoge?",
    answer:
      "- Hot partition tab banta hai jab shard key ki distribution skewed ho — ek popular product ya ek viral user ki saari traffic ek hi shard par land karti hai, jo horizontally scale karne ke bawajood bottleneck rehta hai.\n- Detection per-shard QPS/latency metrics se hoti hai: aggregate healthy dikhta hai lekin ek shard saturated hota hai.\n- Fixes: key ko salt/composite banao (jaise `userId#bucketNumber`) taaki ek entity multiple partitions par spread ho, ya us specific hot entity ke liye dedicated cache/read path banao, ya append-heavy monotonic keys (timestamps) ko hash-prefix karke insertion hotspot todo.",
    followUp: "Key salting range queries ke liye kya new cost laati hai?",
    tags: ['sharding', 'hot-partition', 'scaling'],
  },
  {
    id: 'iq-design-19',
    track: 'system-design',
    level: 'Intermediate',
    question: "Deep pagination slow kyun aur alternative kya hai?",
    answer:
      "- OFFSET-based pagination mein database ko skip kiye gaye saare rows actually scan karke discard karne padte hain — `OFFSET 100000` par har request 100k rows traverse karti hai, isliye page number badhne ke saath latency linearly degrade hoti hai.\n- Concurrent inserts/deletes se rows duplicate ya skip bhi ho sakte hain kyunki offset ek stable anchor nahi hai.\n- Cursor (keyset) pagination last row ke sort values ko WHERE clause mein use karti hai (`WHERE (created_at, id) < (?, ?)`), jo indexed seek banti hai — work can depend mainly on page size rather than offset depth when the index and filters support the seek, aur shifting data ke against stable.\n- Trade-off: arbitrary page numbers par jump nahi kar sakte, sirf next/previous.",
    followUp: "Cursor API par jump-to-last-page kaise doge?",
    tags: ['pagination', 'databases', 'performance'],
  },
  {
    id: 'iq-design-20',
    track: 'system-design',
    level: 'Advanced',
    question: "Producer fast, consumer slow ho toh backpressure kaise?",
    answer:
      "- Unbounded queue yahan sabse khatarnak default hai — woh problem ko visible failure ke bajaye ek dheere-dheere badhta memory/latency problem bana deta hai, jab tak system OOM ya multi-hour lag tak na pahunche.\n- Bounded buffer use karo aur full hone par explicit policy choose karo: producer ko block karo (natural backpressure, upstream tak propagate hoti hai), naye items drop karo (metrics ke liye acceptable), ya purane items drop karo (real-time dashboards ke liye), ya caller ko 429 return karo.\n- policy deliberate ho aur queue depth/consumer lag par alerting ho, taaki saturation queue overflow hone se pehle dikhe.",
    followUp: "More consumers add karna har growing-lag problem ka answer kyun nahi?",
    tags: ['backpressure', 'queues', 'resilience'],
  },
  ...finalInterviewQuestions,
  ...extensionQuestions,
  ...coverageQuestions,
  ...courseQuestions,
  ...advancedQuestions,
  ...scenarioQuestions,
  ...requestedQuestions,
  ...machineCodingQuestions,
]
  .map((item) =>
    item.track === 'java' &&
    ((!item.noteId && questionTopic(item) === 'spring') ||
      [
        'java-spring-rest',
        'java-jpa-transactions',
        'java-security-microservices',
        'java-observability-actuator',
      ].includes(item.noteId))
      ? { ...item, track: 'spring-boot', topic: 'spring' }
      : item,
  )
  .map((item) =>
    answerAdditions[item.id] ? { ...item, answer: item.answer + answerAdditions[item.id] } : item,
  );
