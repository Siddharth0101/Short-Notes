// Everyday ("desi") analogies for the concepts learners most often mix up.
// Each one names where the comparison breaks, so the memory hook does not become a wrong rule.
// `id` is the chapter the analogy belongs to; text is kept in both notebook languages.
export const ANALOGIES = [
  // ——— JavaScript ———
  {
    id: 'js-variables',
    hinglish: {
      title: '`const` = locker par naam ki chit',
      text: 'Locker par tumhare naam ki chit lag gayi — ab woh chit kisi aur locker par nahi lagegi. Lekin locker ke andar ka saamaan tum badal sakte ho.',
      catch:
        '`const` sirf reassignment rokta hai, object ko immutable nahi banata. `Object.freeze` bhi sirf pehli level freeze karta hai.',
    },
    en: {
      title: '`const` is a name tag on a locker',
      text: 'The tag with your name is stuck to one locker and cannot be moved to another. What you keep inside the locker can still change.',
      catch:
        '`const` only blocks reassignment; it does not make an object immutable. Even `Object.freeze` freezes only the first level.',
    },
  },
  {
    id: 'js-scope-closures',
    hinglish: {
      title: 'Closure = ghar se mila tiffin',
      text: 'Function ghar (outer function) se nikal gaya, par maa ka diya tiffin (outer variables) saath le gaya. Jab bhi bhookh lage, wahi tiffin khulta hai.',
      catch:
        'Tiffin photocopy nahi hai — closure variable ki live binding rakhta hai. Outer value badli toh closure ko nayi value dikhegi.',
    },
    en: {
      title: 'A closure is a lunchbox from home',
      text: 'The function has left home (the outer function), but it carries the lunchbox it was given there (the outer variables). Whenever it runs, it opens that same lunchbox.',
      catch:
        'The lunchbox is not a photocopy — a closure keeps a live binding. If the outer value changes, the closure sees the new value.',
    },
  },
  {
    id: 'js-async-event-loop',
    hinglish: {
      title: 'Event loop = ek hi chulhe wala chaiwala',
      text: 'Ek waqt mein ek hi chai banti hai (call stack). Promise wale regular customers (microtasks) ki poori line pehle nipatti hai, phir `setTimeout` wale token (task) ka number aata hai.',
      catch:
        '`setTimeout(fn, 0)` ka matlab turant nahi — bas "jaldi se jaldi, apni baari par". Alag task sources ka aapas ka order har jagah same nahi hota.',
    },
    en: {
      title: 'The event loop is a tea seller with one stove',
      text: 'Only one cup is made at a time (the call stack). The whole line of promise regulars (microtasks) is served first; only then does a `setTimeout` token (a task) get its turn.',
      catch:
        '`setTimeout(fn, 0)` does not mean immediately — only "as soon as its turn comes". The relative order of different task sources is not universal.',
    },
  },
  {
    id: 'js-this-prototypes-classes',
    hinglish: {
      title: '`this` = "bhaiya" bolne jaisa',
      text: '"Bhaiya" kaun hai, yeh is par depend karta hai ki bula kaun raha hai — shabd kahan likha tha, us par nahi. Regular function ka `this` call-site se decide hota hai; arrow function apna `this` wahin se uthata hai jahan woh bana tha.',
      catch:
        'Method ko variable mein nikaal kar plain call karoge toh receiver kho jaata hai (strict mode mein `undefined`). `bind` receiver ko pakka kar deta hai.',
    },
    en: {
      title: '`this` works like the word "you"',
      text: 'Who "you" means depends on who is being spoken to right now, not on where the sentence was written. A regular function gets `this` from its call site; an arrow function takes `this` from where it was created.',
      catch:
        'Pull a method into a variable and call it plainly, and the receiver is lost (`undefined` in strict mode). `bind` fixes the receiver for good.',
    },
  },
  {
    id: 'javascript-async-patterns',
    hinglish: {
      title: '`Promise.all` = group ka ek hi bill',
      text: 'Poori table ka order ek saath aata hai. Ek dish bhi fail hui toh poora order "failed" maana jaata hai. `Promise.allSettled` har dish ka alag status batata hai.',
      catch:
        '`Promise.all` reject hone par baaki requests cancel nahi karta — woh chalti rehti hain. Cancel karna ho toh `AbortController` lagao.',
    },
    en: {
      title: '`Promise.all` is one bill for the whole table',
      text: 'The table’s order arrives together. If even one dish fails, the whole order counts as failed. `Promise.allSettled` reports a separate status for every dish.',
      catch:
        'When `Promise.all` rejects it does not cancel the other requests — they keep running. Use an `AbortController` if you need cancellation.',
    },
  },
  {
    id: 'js-dom-events-browser',
    hinglish: {
      title: 'Event delegation = society ka ek watchman',
      text: 'Har flat ke bahar guard bithane ke bajay gate par ek watchman (parent listener) rakho. Woh `event.target` dekhkar pehchaan leta hai ki visitor kis flat ka hai.',
      catch:
        'Har event bubble nahi karta (`focus`/`blur` ke liye `focusin`/`focusout` use karo), aur beech mein `stopPropagation` ho toh watchman tak khabar nahi pahunchti.',
    },
    en: {
      title: 'Event delegation is one guard at the gate',
      text: 'Instead of posting a guard outside every flat, keep one at the gate (a listener on the parent). It reads `event.target` to know which flat the visitor wants.',
      catch:
        'Not every event bubbles (use `focusin`/`focusout` instead of `focus`/`blur`), and a `stopPropagation` in between means the guard never hears about it.',
    },
  },
  // ——— React ———
  {
    id: 'react-state-forms',
    hinglish: {
      title: 'State = us render ki photo',
      text: 'Har render ke paas state ki ek khinchi hui photo hoti hai. `setCount` nayi photo ka order deta hai; haath wali photo usi waqt nahi badalti.',
      catch:
        'Ek hi handler mein kai baar update karna ho toh updater function `setCount(c => c + 1)` use karo — woh queue ki latest value par chalta hai.',
    },
    en: {
      title: 'State is a photo of that render',
      text: 'Every render holds one snapshot of state. `setCount` orders a new photo; the one in your hand does not change right away.',
      catch:
        'To update several times in one handler, use the updater form `setCount(c => c + 1)` — it runs on the latest queued value.',
    },
  },
  {
    id: 'react-machine-coding',
    hinglish: {
      title: 'Key = roll number, seat number nahi',
      text: 'Teacher bachche ko roll number se pehchaanti hai. Seat number (index) se pehchaanogi toh ek bachcha hat-te hi sabki copy (state) galat bachche ke paas chali jaayegi.',
      catch:
        'Index key tabhi theek hai jab list kabhi reorder, insert ya delete na ho aur rows ki apni local state na ho.',
    },
    en: {
      title: 'A key is a roll number, not a seat number',
      text: 'A teacher knows each student by roll number. Identify them by seat (index) instead and, the moment one student leaves, everyone’s notebook (state) ends up with the wrong student.',
      catch:
        'Index keys are fine only when the list never reorders, inserts or deletes, and the rows hold no local state.',
    },
  },
  {
    id: 'react-effects-custom-hooks',
    hinglish: {
      title: 'Effect = kiraye ka kamra',
      text: 'Setup mein chaabi lete ho (subscribe/connect). Kamra badalne (dependency change) ya jaane (unmount) se pehle cleanup mein chaabi wapas karni padti hai.',
      catch:
        'Effect bahar ke system se sync karne ke liye hai, state derive karne ke liye nahi. Development Strict Mode ek extra setup → cleanup chalata hai taaki bhooli hui cleanup pakdi jaaye.',
    },
    en: {
      title: 'An effect is a rented room',
      text: 'In setup you take the keys (subscribe, connect). Before you switch rooms (a dependency changes) or leave (unmount), cleanup has to hand the keys back.',
      catch:
        'Effects are for syncing with an outside system, not for deriving state. In development, Strict Mode runs one extra setup → cleanup to expose a missing cleanup.',
    },
  },
  {
    id: 'react-context-reducer-redux',
    hinglish: {
      title: 'Context = society ka notice board',
      text: 'Notice ek jagah lagta hai aur jo bhi padhna chahe (consumer) seedha padh leta hai — ghar-ghar jaakar parchi pahunchane (prop drilling) ki zaroorat nahi.',
      catch:
        'Value badalte hi us context ke saare consumers re-render hote hain. Context khud state manager nahi hai; baar-baar badalne wali values alag context mein rakho.',
    },
    en: {
      title: 'Context is the building’s notice board',
      text: 'The notice goes up in one place and anyone who wants it (a consumer) reads it directly — no passing a slip from door to door (prop drilling).',
      catch:
        'When the value changes, every consumer of that context re-renders. Context is not a state manager by itself; keep fast-changing values in a separate context.',
    },
  },
  {
    id: 'react-performance-production',
    hinglish: {
      title: '`memo` = "original same hai toh photocopy mat karo"',
      text: '`React.memo` props ko shallow compare karta hai. Kuch nahi badla toh woh component ka render skip kar deta hai.',
      catch:
        'Har render par naya object ya function banaoge toh props "badle hue" lagenge aur memo bekaar. Memoization ka apna kharcha hai — pehle measure karo.',
    },
    en: {
      title: '`memo` says "same original, skip the photocopy"',
      text: '`React.memo` compares props shallowly. If nothing changed, it skips rendering that component.',
      catch:
        'Create a fresh object or function on every render and the props look "changed", so memo does nothing. Memoization has its own cost — measure first.',
    },
  },
  // ——— React Native ———
  {
    id: 'rn-foundations-expo',
    hinglish: {
      title: 'Expo Go = sample flat, development build = apna flat',
      text: 'Sample flat mein jo fittings lagi hain wahi milengi. Apni custom fitting (native module) chahiye toh apna flat — yaani development build — banana padega.',
      catch:
        'React Native WebView nahi hai: tumhara JS asli native views ko control karta hai. Isliye platform ke hisaab se behavior alag ho sakta hai.',
    },
    en: {
      title: 'Expo Go is a show flat; a development build is your own',
      text: 'The show flat gives you only the fittings it already has. If you need a custom fitting (a native module), you have to build your own flat — a development build.',
      catch:
        'React Native is not a WebView: your JS drives real native views, so behaviour can differ by platform.',
    },
  },
  {
    id: 'rn-lists-images',
    hinglish: {
      title: '`FlatList` = train ki khidki',
      text: 'Khidki se utna hi nazaara dikhta hai jitna saamne hai. `FlatList` bhi sirf screen ke aas-paas ki rows render karta hai, poori list nahi.',
      catch:
        'Tez scroll par khaali jagah dikh sakti hai. Stable `keyExtractor` do aur rows ki height fixed ho toh `getItemLayout` se measurement ka kaam bachao.',
    },
    en: {
      title: '`FlatList` is a train window',
      text: 'Through the window you see only the stretch in front of you. `FlatList` likewise renders just the rows near the screen, not the whole list.',
      catch:
        'Fast scrolling can show blank space. Give it a stable `keyExtractor`, and if rows have a fixed height use `getItemLayout` to skip measurement work.',
    },
  },
  {
    id: 'rn-device-permissions',
    hinglish: {
      title: 'Permission = padosi se chaabi maangna',
      text: 'Chaabi tab maango jab sach mein zaroorat ho, aur wajah batao. Padosi ne "dobara mat poochhna" bol diya toh ab Settings ka raasta hi dikhana padega.',
      catch:
        'Denied, limited aur blocked — teeno states ka UI rakho. Bina permission ke bhi app ka baaki hissa chalna chahiye.',
    },
    en: {
      title: 'A permission is borrowing a neighbour’s key',
      text: 'Ask for the key only when you really need it, and say why. If the neighbour says "don’t ask again", all you can do is point the way to Settings.',
      catch:
        'Design for denied, limited and blocked states. The rest of the app should keep working without the permission.',
    },
  },
  {
    id: 'rn-performance-native',
    hinglish: {
      title: 'JS thread = akela cashier',
      text: 'Cashier (JS thread) lambe hisaab mein phansa toh line ruk jaati hai. UI thread par chalne wali animation alag display board jaisi hai — cashier busy ho tab bhi chalti rehti hai.',
      catch:
        '`Animated` ka native driver sirf `transform` aur `opacity` jaisi non-layout properties ke liye hai. Heavy kaam ko chhote tukdon mein baanto ya native side par le jao.',
    },
    en: {
      title: 'The JS thread is a single cashier',
      text: 'When the cashier (the JS thread) is stuck on a long calculation, the line stops. An animation running on the UI thread is like a separate display board — it keeps moving even while the cashier is busy.',
      catch:
        'The `Animated` native driver only covers non-layout properties such as `transform` and `opacity`. Split heavy work into chunks or move it to the native side.',
    },
  },
  // ——— Java ———
  {
    id: 'java-language-foundations',
    hinglish: {
      title: 'Reference = TV ka remote',
      text: 'Variable ke paas TV nahi, remote hota hai. Remote copy karoge toh do remote ek hi TV chalayenge. `null` remote kisi TV se juda nahi.',
      catch:
        'Java hamesha pass-by-value hai: method ko remote ki copy milti hai. Method ke andar parameter ko naya TV assign karne se caller ka remote nahi badalta.',
    },
    en: {
      title: 'A reference is a TV remote',
      text: 'A variable holds the remote, not the TV. Copy the remote and two remotes control the same TV. A `null` remote is paired with no TV at all.',
      catch:
        'Java is always pass-by-value: a method receives a copy of the remote. Pointing the parameter at a new TV inside the method does not change the caller’s remote.',
    },
  },
  {
    id: 'java-object-model',
    hinglish: {
      title: '`equals`/`hashCode` = naam aur dabba number',
      text: '`hashCode` batata hai kis dabbe mein dhundna hai, `equals` batata hai dabbe ke andar sahi cheez kaunsi hai. Barabar objects ka dabba number same hona hi chahiye.',
      catch:
        'Same `hashCode` ka matlab equal nahi (collision normal hai). Jo field `hashCode` mein hai use map mein daalne ke baad badloge toh object "kho" jaayega.',
    },
    en: {
      title: '`equals`/`hashCode` are a name and a box number',
      text: '`hashCode` says which box to look in; `equals` says which item inside the box is the right one. Equal objects must share the same box number.',
      catch:
        'The same `hashCode` does not mean equal (collisions are normal). Mutate a field used in `hashCode` after putting the object in a map and it gets "lost".',
    },
  },
  {
    id: 'java-collections-generics',
    hinglish: {
      title: '`ArrayList` = numbered seats, `LinkedList` = haath pakdi line',
      text: 'Seat number se kisi tak seedha pahunch jaate ho (index access O(1)). Haath pakdi line mein beech wale tak pahunchne ke liye ek-ek karke chalna padta hai.',
      catch:
        'Real code mein `LinkedList` kam hi jeet-ta hai — memory bikhri hoti hai. Queue ya stack ke liye aksar `ArrayDeque` behtar hai.',
    },
    en: {
      title: '`ArrayList` is numbered seats; `LinkedList` is a line holding hands',
      text: 'A seat number takes you straight to a person (index access is O(1)). In a hand-holding line you must walk person by person to reach the middle.',
      catch:
        '`LinkedList` rarely wins in real code — its memory is scattered. For a queue or stack, `ArrayDeque` is usually the better choice.',
    },
  },
  {
    id: 'java-concurrency',
    hinglish: {
      title: '`synchronized` = ek chaabi wala washroom',
      text: 'Chaabi (monitor lock) jiske paas hai wahi andar jaata hai; baaki bahar wait karte hain. Isi se `count++` jaisa read-modify-write beech mein nahi toot-ta.',
      catch:
        'Saare threads ko same lock object use karna hoga. Do chaabiyan ulte order mein loge toh deadlock ho sakta hai.',
    },
    en: {
      title: '`synchronized` is a washroom with one key',
      text: 'Whoever holds the key (the monitor lock) goes in; everyone else waits outside. That is what keeps a read-modify-write like `count++` from being torn apart.',
      catch:
        'Every thread must use the same lock object. Take two keys in opposite orders and you can deadlock.',
    },
  },
  {
    id: 'java-jvm-memory',
    hinglish: {
      title: 'GC = society ka safai wala',
      text: 'Woh sirf wahi uthata hai jis tak koi raasta nahi bacha (GC roots se unreachable). Kab aayega, yeh tum decide nahi karte — `System.gc()` sirf request hai.',
      catch:
        'Memory leak phir bhi hota hai: static collection ya bhoola hua listener object ko reachable rakhta hai, toh GC use chhu nahi sakta.',
    },
    en: {
      title: 'The GC is the building’s cleaner',
      text: 'It only collects what no path leads to any more (unreachable from the GC roots). You do not decide when it comes — `System.gc()` is just a request.',
      catch:
        'Memory still leaks: a static collection or a forgotten listener keeps an object reachable, so the GC cannot touch it.',
    },
  },
  {
    id: 'java-exceptions-io-time',
    hinglish: {
      title: 'try-with-resources = auto-off gas',
      text: 'Kitchen se nikalte hi gas apne-aap band — chahe aaram se niklo ya aag (exception) lagne par bhaago. Resource hamesha close hota hai.',
      catch:
        'Resources ulte order mein close hote hain, aur close ka exception "suppressed" ban kar main exception ke saath juda rehta hai.',
    },
    en: {
      title: 'try-with-resources is a stove that switches itself off',
      text: 'The gas turns off the moment you leave the kitchen — whether you stroll out or run because of a fire (an exception). The resource is always closed.',
      catch:
        'Resources close in reverse order, and an exception from `close` is attached to the main one as a suppressed exception.',
    },
  },
  // ——— Spring Boot ———
  {
    id: 'spring-beans-di',
    hinglish: {
      title: 'Dependency injection = tiffin service',
      text: 'Class khud khana (`new`) nahi banati; container bana-banaya dependency de jaata hai. Constructor injection ka matlab: zaroori saamaan ke bina object ban hi nahi sakta.',
      catch:
        'Bean by default singleton hota hai, isliye usme request-specific mutable state mat rakho. Constructor injection mein circular dependency startup par hi fail hoti hai.',
    },
    en: {
      title: 'Dependency injection is a meal-delivery service',
      text: 'The class does not cook (`new`) for itself; the container delivers ready-made dependencies. Constructor injection means the object cannot even be built without what it needs.',
      catch:
        'A bean is a singleton by default, so never keep request-specific mutable state in it. With constructor injection, a circular dependency fails right at startup.',
    },
  },
  {
    id: 'java-jpa-transactions',
    hinglish: {
      title: '`@Transactional` = reception desk',
      text: 'Bahar se aane wali call reception (proxy) se guzarti hai, wahin transaction shuru hota hai. Andar se apna hi method call karoge toh reception beech mein aata hi nahi.',
      catch:
        'Default rollback sirf unchecked exceptions par hota hai. Checked exception par rollback chahiye toh `rollbackFor` batana padega.',
    },
    en: {
      title: '`@Transactional` is a reception desk',
      text: 'A call coming from outside passes through reception (the proxy), and that is where the transaction starts. Call your own method from inside and reception is never involved.',
      catch:
        'By default only unchecked exceptions trigger a rollback. For a checked exception you must say so with `rollbackFor`.',
    },
  },
  {
    id: 'spring-configuration',
    hinglish: {
      title: 'Profiles = mauke ke hisaab se kapde',
      text: 'Insaan (app) wahi hai; office (prod) aur ghar (dev) ke liye bas kapde (config) alag hain. Code badle bina environment badal jaata hai.',
      catch:
        'Secrets repo mein mat rakho. Property precedence yaad rakho: environment variable aksar `application.yml` ki value override kar deta hai.',
    },
    en: {
      title: 'Profiles are clothes for the occasion',
      text: 'The person (the app) is the same; only the outfit (the config) differs between the office (prod) and home (dev). The environment changes without changing code.',
      catch:
        'Keep secrets out of the repo. Remember property precedence: an environment variable usually overrides the value in `application.yml`.',
    },
  },
  {
    id: 'java-security-microservices',
    hinglish: {
      title: 'Security filter chain = airport ki checking',
      text: 'Gate (controller) tak pahunchne se pehle kai counters hain. ID check batata hai tum kaun ho (authentication); boarding pass batata hai kis flight mein baith sakte ho (authorization).',
      catch:
        'Login ho jaana kaafi nahi — har action par object-level permission bhi check karo. Filters ka order behavior badal deta hai.',
    },
    en: {
      title: 'The security filter chain is airport screening',
      text: 'There are several counters before you reach the gate (the controller). The ID check says who you are (authentication); the boarding pass says which flight you may board (authorization).',
      catch:
        'Being logged in is not enough — check object-level permission on every action. The order of the filters changes behaviour.',
    },
  },
  // ——— Node & MongoDB ———
  {
    id: 'mongo-node-runtime-http',
    hinglish: {
      title: 'Node = ek waiter, peeche poori kitchen',
      text: 'Waiter order lekar kitchen (OS/libuv) ko de deta hai aur agli table par chala jaata hai. Khana ready hote hi callback ke saath wapas aata hai.',
      catch:
        'Waiter khud khana banane lage (CPU-heavy loop) toh saari tables wait karti hain. Aisa kaam worker thread ya alag service ko do.',
    },
    en: {
      title: 'Node is one waiter with a whole kitchen behind',
      text: 'The waiter takes an order, hands it to the kitchen (the OS and libuv) and moves to the next table. When the food is ready, the callback brings the waiter back.',
      catch:
        'If the waiter starts cooking (a CPU-heavy loop), every table waits. Give that work to a worker thread or a separate service.',
    },
  },
  {
    id: 'mongo-express-rest-errors',
    hinglish: {
      title: 'Middleware = factory ki assembly line',
      text: 'Har station ek kaam karke `next()` se aage bhejta hai. Gadbad hui toh `next(err)` seedha complaint desk (error middleware) tak pahunchata hai.',
      catch:
        'Order hi behavior hai — auth pehle, route baad mein. `next()` ya response bhoole toh request latki rahegi.',
    },
    en: {
      title: 'Middleware is a factory assembly line',
      text: 'Each station does one job and passes the request on with `next()`. If something goes wrong, `next(err)` sends it straight to the complaints desk (the error middleware).',
      catch:
        'Order is behaviour — auth first, the route after. Forget both `next()` and the response and the request simply hangs.',
    },
  },
  {
    id: 'mongo-documents-crud-modeling',
    hinglish: {
      title: 'Embed vs reference = ek tiffin ya alag dabbe',
      text: 'Jo cheezein hamesha saath khayi jaati hain (saath read hoti hain) unhe ek hi tiffin mein rakho. Jo badi, shared ya badhti rehne wali hain unhe alag dabbe mein rakho aur pata likh do.',
      catch:
        'Document ki 16 MB limit hai aur bina limit badhne wala array dheere-dheere sab slow kar deta hai. Duplicate data ko update karne ka plan rakho.',
    },
    en: {
      title: 'Embed vs reference: one lunchbox or separate boxes',
      text: 'Keep things that are always eaten together (read together) in one lunchbox. Put what is large, shared or ever-growing in a separate box and write down its address.',
      catch:
        'A document is capped at 16 MB, and an array that grows without bound slowly makes everything slower. Have a plan for updating duplicated data.',
    },
  },
  {
    id: 'mongo-indexes-aggregation-transactions',
    hinglish: {
      title: 'Index = kitaab ke peeche wala index',
      text: 'Poori kitaab padhne (collection scan) ke bajay index se seedha page number mil jaata hai. Compound index phone directory jaisa hai: pehle surname, phir naam.',
      catch:
        'Sirf naam se dhundoge toh directory kaam nahi aayegi (prefix rule). Har index write ko thoda mehenga karta hai — `explain` se confirm karo.',
    },
    en: {
      title: 'An index is the index at the back of a book',
      text: 'Instead of reading the whole book (a collection scan), the index gives you the page number directly. A compound index is like a phone directory: surname first, then first name.',
      catch:
        'Search by first name alone and the directory does not help (the prefix rule). Every index makes writes a little costlier — confirm with `explain`.',
    },
  },
  // ——— DSA ———
  {
    id: 'dsa-complexity',
    hinglish: {
      title: 'Big-O = bheed badhne par line kitni lambi hoti hai',
      text: 'O(1): ATM mein PIN daalna. O(log n): dictionary mein shabd dhundna. O(n): poori class ki attendance. O(n²): class ka har bachcha har bachche se haath milaye.',
      catch:
        'Big-O growth batata hai, exact time nahi. Chhote input par constants aur memory access ka pattern zyada farq daal sakte hain.',
    },
    en: {
      title: 'Big-O is how the queue grows as the crowd grows',
      text: 'O(1): typing your PIN at an ATM. O(log n): finding a word in a dictionary. O(n): taking attendance for a class. O(n²): everyone in class shaking hands with everyone else.',
      catch:
        'Big-O describes growth, not exact time. On small inputs, constants and memory-access patterns can matter more.',
    },
  },
  {
    id: 'dsa-linear-structures',
    hinglish: {
      title: 'Stack = plates ka dher, queue = ticket ki line',
      text: 'Plate upar rakhte ho aur upar se hi uthate ho (LIFO). Ticket line mein jo pehle aaya woh pehle nikalta hai (FIFO).',
      catch:
        'JavaScript array ka `shift()` O(n) hai. Badi queue ke liye head index, linked list ya deque use karo.',
    },
    en: {
      title: 'A stack is a pile of plates; a queue is a ticket line',
      text: 'You put a plate on top and take from the top (LIFO). In a ticket line, whoever came first leaves first (FIFO).',
      catch:
        'A JavaScript array’s `shift()` is O(n). For a large queue use a head index, a linked list or a deque.',
    },
  },
  {
    id: 'dsa-hashing',
    hinglish: {
      title: 'Hash table = numbered khaanon wali almari',
      text: 'Hash function chitthi dekhkar batata hai kis khaane mein rakhni hai. Do chitthiyan ek hi khaane mein aa gayi (collision) toh us khaane mein chhoti list ban jaati hai.',
      catch:
        'Lookup average O(1) hai, guaranteed nahi — kharab hash ya bahut collisions par O(n) tak ja sakta hai. Almari bharne par resize ka kharcha aata hai.',
    },
    en: {
      title: 'A hash table is a cabinet of numbered pigeonholes',
      text: 'The hash function looks at a letter and names its pigeonhole. If two letters land in the same hole (a collision), that hole keeps a short list.',
      catch:
        'Lookup is O(1) on average, not guaranteed — a bad hash or many collisions can push it to O(n). When the cabinet fills up, you pay for a resize.',
    },
  },
  {
    id: 'dsa-searching',
    hinglish: {
      title: 'Binary search = "bada ya chhota?" wala game',
      text: 'Har guess ke baad aadhe numbers baahar. 1 se 100 tak ka number zyada se zyada 7 sawaalon mein mil jaata hai.',
      catch:
        'Data sorted hona chahiye aur index se seedha access milna chahiye. Sabse zyada galti boundaries mein hoti hai: `left <= right`, `mid + 1`, `mid - 1`.',
    },
    en: {
      title: 'Binary search is the "higher or lower?" game',
      text: 'Every guess throws out half the numbers. A number from 1 to 100 is found in at most 7 questions.',
      catch:
        'The data must be sorted and reachable by index. Most bugs live in the boundaries: `left <= right`, `mid + 1`, `mid - 1`.',
    },
  },
  {
    id: 'dsa-recursion',
    hinglish: {
      title: 'Recursion = gudiya ke andar gudiya',
      text: 'Har gudiya ke andar usi shape ki chhoti gudiya hai. Sabse chhoti gudiya (base case) par khulna rukta hai, phir sab wapas band hoti jaati hain.',
      catch:
        'Har call stack par jagah leti hai — base case galat hua toh stack overflow. Wahi subproblem baar-baar aaye toh memoization lagao.',
    },
    en: {
      title: 'Recursion is a doll inside a doll',
      text: 'Each doll holds a smaller doll of the same shape. The smallest doll (the base case) stops the opening, and then they all close back up.',
      catch:
        'Every call takes space on the stack — a wrong base case means a stack overflow. If the same subproblem keeps returning, add memoization.',
    },
  },
  {
    id: 'dsa-graphs',
    hinglish: {
      title: 'BFS = colony mein phailti khabar',
      text: 'Pehle padosi sunte hain, phir padosiyon ke padosi — ek-ek level. Isiliye unweighted graph mein BFS sabse kam hops wala raasta deta hai. DFS ek gali ko end tak jaakar wapas aata hai.',
      catch:
        'Edges ke weight alag-alag hon toh BFS ka shortest path galat ho sakta hai. Non-negative weights ke liye Dijkstra dekho.',
    },
    en: {
      title: 'BFS is news spreading through a neighbourhood',
      text: 'First the neighbours hear it, then the neighbours’ neighbours — level by level. That is why BFS finds the fewest-hops path in an unweighted graph. DFS walks one lane to its end and then comes back.',
      catch:
        'If edges have different weights, the BFS path may not be the shortest. For non-negative weights, look at Dijkstra.',
    },
  },
  {
    id: 'dsa-dynamic-programming',
    hinglish: {
      title: 'DP = "ek baar nikala, likh ke rakh liya"',
      text: 'Wahi sawaal dobara aaye toh phir se calculate mat karo — table mein likha jawab utha lo. Bade jawab chhote jawabon se bante hain.',
      catch:
        'DP tabhi chalta hai jab subproblems overlap karein aur optimal substructure ho. Asli mehnat sahi state define karne mein hai.',
    },
    en: {
      title: 'DP means "solve it once, write it down"',
      text: 'When the same question comes back, do not recompute — read the answer from the table. Bigger answers are built from smaller ones.',
      catch:
        'DP only works when subproblems overlap and the problem has optimal substructure. The real work is defining the right state.',
    },
  },
  // ——— System design ———
  {
    id: 'design-requirements-capacity',
    hinglish: {
      title: 'Capacity estimate = shaadi ke khaane ka hisaab',
      text: 'Mehmaan × plate per mehmaan × thoda buffer. Aur dhyaan rahe: sab log ek saath dinner ke time aate hain — peak average se kai guna hota hai.',
      catch:
        'Yeh order-of-magnitude ka andaza hai, exact number nahi. Assumptions bolkar likho taaki interviewer unhe sudhaar sake.',
    },
    en: {
      title: 'A capacity estimate is catering for a wedding',
      text: 'Guests × plates per guest × a little buffer. And remember: everyone shows up at dinner time together — the peak is several times the average.',
      catch:
        'It is an order-of-magnitude guess, not an exact figure. Say your assumptions out loud so the interviewer can correct them.',
    },
  },
  {
    id: 'design-scaling-caching',
    hinglish: {
      title: 'Cache = ghar ka fridge',
      text: 'Roz ki cheezein fridge mein hon toh baar-baar market (database) nahi jaana padta. Par doodh purana ho sakta hai — isliye expiry (TTL) aur invalidation chahiye.',
      catch:
        'Fridge khaali hote hi poora ghar ek saath market bhaage toh stampede. Stale data kitni der chalega, yeh pehle tay karo.',
    },
    en: {
      title: 'A cache is the fridge at home',
      text: 'With everyday items in the fridge, you skip repeated trips to the market (the database). But milk goes off — hence expiry (TTL) and invalidation.',
      catch:
        'If the fridge empties and the whole house runs to the market at once, that is a stampede. Decide up front how stale the data is allowed to be.',
    },
  },
  {
    id: 'design-messaging-reliability',
    hinglish: {
      title: 'Message queue = letter box',
      text: 'Bhejne wala chitthi daalkar apne kaam par lag jaata hai (decoupling). Dakiya kabhi-kabhi ek hi chitthi do baar pahuncha deta hai (at-least-once).',
      catch:
        'Isliye receiver ko idempotent banao — wahi message dobara aaye toh asar ek hi baar ho. Baar-baar fail hone wale message ke liye dead-letter queue rakho.',
    },
    en: {
      title: 'A message queue is a letter box',
      text: 'The sender drops the letter and gets on with their work (decoupling). Now and then the postman delivers the same letter twice (at-least-once).',
      catch:
        'So make the receiver idempotent — a repeated message must take effect only once. Keep a dead-letter queue for messages that keep failing.',
    },
  },
  {
    id: 'system-design-consistency-limits',
    hinglish: {
      title: 'Token bucket = balti mein tapakte tokens',
      text: 'Balti mein tokens fixed rate se girte hain. Har request ek token leti hai; balti bhari ho toh thoda burst chal jaata hai, khaali ho toh `429`.',
      catch:
        'Kai servers hon toh counter shared aur atomic hona chahiye, warna har server apni alag limit de dega. Client ko `Retry-After` batao.',
    },
    en: {
      title: 'A token bucket is a bucket with tokens dripping in',
      text: 'Tokens drip into the bucket at a fixed rate. Each request takes one; a full bucket allows a short burst, an empty one returns `429`.',
      catch:
        'With several servers the counter must be shared and atomic, or each server hands out its own separate limit. Tell the client `Retry-After`.',
    },
  },
  {
    id: 'system-design-api-contracts',
    hinglish: {
      title: 'REST = thali, GraphQL = à la carte, gRPC = kitchen ka intercom',
      text: 'REST mein resource ki tay thali milti hai. GraphQL mein client wahi maangta hai jo chahiye. gRPC services ke beech fast, typed baat-cheet ke liye hai.',
      catch:
        'GraphQL mein N+1 queries aur query cost limit ka dhyaan rakho. Browser se seedha gRPC ke liye gRPC-Web jaisa proxy chahiye.',
    },
    en: {
      title: 'REST is a set meal, GraphQL is à la carte, gRPC is the kitchen intercom',
      text: 'REST serves a fixed plate per resource. With GraphQL the client asks for exactly what it needs. gRPC is for fast, typed calls between services.',
      catch:
        'With GraphQL, watch for N+1 queries and enforce query-cost limits. Calling gRPC straight from a browser needs a proxy such as gRPC-Web.',
    },
  },
  {
    id: 'design-security-operations',
    hinglish: {
      title: 'Defense in depth = ghar ke teen taale',
      text: 'Main gate, darwaza aur almari — teeno par alag taala. Ek toot bhi jaaye toh baaki do bachate hain.',
      catch:
        'Sirf bahar ka gate (network/perimeter) kaafi nahi. Har service least privilege se chale aur logs mein secrets kabhi na jaayein.',
    },
    en: {
      title: 'Defense in depth is three locks on a house',
      text: 'The main gate, the front door and the cupboard each have their own lock. Break one and the other two still protect you.',
      catch:
        'The outer gate (the network perimeter) alone is not enough. Run every service with least privilege and never let secrets reach the logs.',
    },
  },
  // ——— Interview ———
  {
    id: 'interview-dsa',
    hinglish: {
      title: 'Think aloud = cricket commentary',
      text: 'Commentary ke bina match samajh nahi aata. Approach, complexity aur edge cases bolte chalo — interviewer ko tumhari soch ka score dikhna chahiye.',
      catch:
        'Lagataar bolte rehna bhi shor hai. Pehle plan batao, phir code likho, phir ek example par dry run karo.',
    },
    en: {
      title: 'Thinking aloud is cricket commentary',
      text: 'Without commentary the match is hard to follow. Say your approach, the complexity and the edge cases as you go — the interviewer should see how your thinking scores.',
      catch:
        'Talking non-stop is just noise. State the plan first, then write the code, then dry-run one example.',
    },
  },
];

const byChapter = Object.fromEntries(ANALOGIES.map((item) => [item.id, item]));

export function analogyFor(noteId, lang) {
  const item = byChapter[noteId];
  return item ? item[lang] || item.hinglish : null;
}
