// Original timeboxed implementation drills; priority means learning value, not employer frequency.
export const machineCodingQuestions = [
  {
    id: 'iq-machine-registration-form',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Accessible registration form banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nBrowser mein HTML aur vanilla JS use karo. Name, email, password aur consent wala form banao; password minimum 8 characters. Submit fake async adapter ko call kare. Invalid input par request na bhejo; pending submit dobara na chale.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Empty submit par first invalid field focus ho aur uska labeled error mile.\n- Valid submit ek request bheje; reject par filled values bachein aur retry chale.\n- Sirf keyboard se consent aur submit operate ho; success status readable ho.',
    answer:
      '**Hint — atakne par padho:** Field validity, request status aur focus destination ko alag socho.\n\n**Answer guide — attempt ke baad compare karo:** Native labels/input types se shuru karo; submit handler validity check karke invalid field par focus bheje. Error IDs ko field descriptions se connect karo. Idle/pending/success/error status rakho, pending guard aur disabled submit dono lagao. finally mein guard release karo. Password ko logs/storage mein mat rakho. Sirf red border error explain nahi karta; text aur accessible status bhi do.',
    followUp: 'Network timeout ke baad duplicate submission ko server par kaise pehchanoge?',
    tags: ['machine-coding', 'practice-first', 'html'],
  },
  {
    id: 'iq-machine-modal-dialog',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Accessible confirmation dialog banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nBrowser HTML/JS mein delete-confirmation dialog banao. Open, Cancel aur Confirm controls do; delete callback fake ho. Open trigger remember karo; background dialog khula hone tak interactive na ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Open par dialog ke andar focus aaye; Tab background tak na nikle.\n- Escape/Cancel delete callback na chalayein; Confirm exactly once chalaye.\n- Close par existing trigger ko focus mile; trigger delete ho gaya ho toh list heading ko mile.',
    answer:
      '**Hint — atakne par padho:** Native modal dialog aur explicit focus-return policy evaluate karo.\n\n**Answer guide — attempt ke baad compare karo:** Dialog ka accessible name do, modal opening use karo aur safe default Cancel par focus set karo. Confirm aur cancel paths separate rakho; close handler mein deletion mat rakho warna Escape bhi delete karega. Closing ke baad trigger connected hai toh restore karo, warna deliberate fallback choose karo. Tab, Shift+Tab aur Escape manually verify karo; visual overlay alone focus management nahi hai.',
    followUp:
      'Nested dialog request aaye toh scope simplify karoge ya focus stack kaise maintain karoge?',
    tags: ['machine-coding', 'practice-first', 'html'],
  },
  {
    id: 'iq-machine-nested-comments',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Semantic nested comments viewer banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/JS mein {id,parentId,text} records se threaded comments dikhao. Input ek acyclic forest hai; missing parent ko top level dikhao. Collapse/expand buttons, reply input aur submitted comment insertion do; backend nahi chahiye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Duplicate text wale comments independent IDs se collapse hon.\n- Reply sirf selected parent ke andar aaye; blank reply reject ho.\n- User text <img src=x> literal dikhe; keyboard toggle aur reply chale.',
    answer:
      '**Hint — atakne par padho:** Data identity aur safe text rendering pehle settle karo.\n\n**Answer guide — attempt ke baad compare karo:** ID map aur parent-to-children map ek pass mein banao, phir nested lists render karo. Text ko textContent se insert karo, HTML string interpolate mat karo. Collapse state IDs se key karo aur buttons par expanded state expose karo. Insertion par stable ID generate karke model update karo; full tree replace karke focused input lose mat karo. Rendering cost visible nodes ke saath discuss karo.',
    followUp: 'Deep tree aur malformed cyclic input ko support karna ho toh kya limits add karoge?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-responsive-dashboard',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Responsive dashboard layout banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nHTML/CSS mein header, sidebar aur 12 product cards banao. 320px par one column aur inline navigation, 768px par two columns, 1200px par sidebar plus three columns chahiye. Card titles variable length hain.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Teen viewport widths par page-level horizontal scroll na ho.\n- 200-character title wrap ho; images card bounds mein rahein.\n- Keyboard focus visible ho aur DOM reading order visual order se sensible rahe.',
    answer:
      '**Hint — atakne par padho:** Grid tracks ki minimum width aur content overflow inspect karo.\n\n**Answer guide — attempt ke baad compare karo:** Mobile-first one-column flow rakho; media queries se columns/sidebar add karo. Main content ko min-width:0 aur long strings ko wrapping rule do. Images ko constrained width aur consistent aspect ratio do. CSS order se reading order radically change mat karo. Fixed page widths ki jagah flexible tracks use karo; browser resize aur zoom par layout inspect karo.',
    followUp: 'Cards mein equal-height action footer kaise rakhoge bina text truncate kiye?',
    tags: ['machine-coding', 'practice-first', 'css'],
  },
  {
    id: 'iq-machine-sticky-table',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Scrollable table with sticky header banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nHTML/CSS mein 50-row, 8-column semantic table banao. Ek bounded scroll container mein header aur first column sticky hon; narrow screens par horizontal scroll isi container mein ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Vertical scroll par headings dikhein; horizontal scroll par first column dikhe.\n- Top-left cell overlap mein readable rahe; sticky backgrounds opaque hon.\n- Header-cell associations aur keyboard se scroll region access verify karo.',
    answer:
      '**Hint — atakne par padho:** Sticky offsets aur stacking order dono define karne padenge.\n\n**Answer guide — attempt ke baad compare karo:** Table structure preserve karo, overflow wrapper ko bounded height do. Header top:0 aur first-column left:0 rakho; intersection ka z-index dono se high ho. Opaque backgrounds aur borders inspect karo taaki underlying text bleed na kare. Wrapper ko accessible name aur keyboard access do jab zaroorat ho. Ancestor overflow sticky behavior badal sakta hai; actual container mein test karo.',
    followUp: 'Variable-width first column aur RTL layout ke liye offsets kaise adapt karoge?',
    tags: ['machine-coding', 'practice-first', 'css'],
  },
  {
    id: 'iq-machine-theme-components',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Themeable pricing cards banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nPlain HTML/CSS aur tiny JS toggle se three pricing cards banao. Light/dark theme tokens, highlighted plan, disabled CTA aur reduced-motion behavior chahiye. React optional hai.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Theme switch par text, border, focus aur disabled states dono themes mein readable hon.\n- 320px par cards stack hon; long price label overflow na kare.\n- Keyboard focus visible rahe aur reduced-motion setting par decorative animation band ho.',
    answer:
      '**Hint — atakne par padho:** Colors ko component selectors mein duplicate karne se pehle semantic tokens define karo.\n\n**Answer guide — attempt ke baad compare karo:** Background, foreground, border, accent aur focus ke CSS custom properties banao. Theme attribute par token values replace karo; component layout same rakho. Native disabled buttons aur visible focus outline use karo. Motion preference query se nonessential transition disable karo. Contrast ko actual foreground/background pairs par inspect karo; opacity alone disabled distinction ke liye weak ho sakti hai.',
    followUp: 'System theme aur explicit saved user preference ka precedence kaise define karoge?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-debounce',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-scope-closures',
    level: 'Intermediate',
    question: 'Machine coding: Debounce with cancel aur flush implement karo',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nPlain JS mein debounce(fn, wait) banao. Trailing-only execution, latest arguments/this, cancel() aur flush() support karo. wait non-negative finite number ho; invalid wait reject karo. flush pending call immediately execute kare, warna undefined return kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Fake clock par t=0 aur t=20 calls, wait=50: t=70 par sirf latest call chale.\n- cancel ke baad timer advance karne par call na ho.\n- flush ek baar chale aur original timer baad mein duplicate execution na kare.',
    answer:
      '**Hint — atakne par padho:** Timer handle ke saath latest arguments aur receiver retain karne padenge.\n\n**Answer guide — attempt ke baad compare karo:** Wrapper normal function ho taaki caller ka this capture ho. Har call par previous timer clear karke latest args/context store karo. Shared invoke helper pehle pending state clear kare, phir captured fn apply kare; reentrant invocation naya timer bana sake. cancel timer aur references clear kare. flush pending snapshot invoke karke uska result return kare. Real sleep ki jagah controlled timers se boundaries test karo.',
    followUp:
      'Leading plus trailing support mein single call ko double execute hone se kaise bachaoge?',
    tags: ['machine-coding', 'practice-first', 'javascript'],
  },
  {
    id: 'iq-machine-promise-pool',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'javascript-async-patterns',
    level: 'Intermediate',
    question: 'Machine coding: Concurrency-limited async task runner banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nrunPool(tasks, limit) likho; tasks zero-argument async functions hain. Positive integer limit enforce karo. Sab tasks settle hon aur input-order mein {status,value/reason} outcomes return hon; rejection queue ko stop na kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Delayed 5 tasks, limit=2 par active task count kabhi 2 cross na kare.\n- Out-of-order completion ke baad results input order mein hon.\n- Empty input [], sync throw aur rejected promise handle hon; limit=0 reject ho.',
    answer:
      '**Hint — atakne par padho:** Promise objects ki jagah task factories se work start time control karo.\n\n**Answer guide — attempt ke baad compare karo:** Shared next-index aur fixed worker count rakho. Har worker await se pehle unique index claim kare, task ko try/catch mein invoke kare aur outcome us index par store kare. Worker loop rejection ke baad bhi continue kare. Workers complete hone par results return karo. Sab tasks pehle call karke Promise.all lagana concurrency cap nahi hai; active-count probe se actual work measure karo.',
    followUp:
      'Abort signal aaye toh queued aur already-running tasks ka distinct contract kya hoga?',
    tags: ['machine-coding', 'practice-first', 'javascript'],
  },
  {
    id: 'iq-machine-event-emitter',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-this-prototypes-classes',
    level: 'Intermediate',
    question: 'Machine coding: Event emitter with once aur unsubscribe banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\non(event, listener), once(event, listener), off(event, listener), emit(event, payload) implement karo. Duplicate function registration ek subscription maano. Emit registration-order snapshot use kare; listener error caller tak propagate ho aur current emit stop ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Unsubscribe idempotent ho aur unknown event emit no-op ho.\n- Emit ke beech added listener next emit se chale; removed snapshot listener current emit mein chale.\n- once listener recursively emit kare toh same once registration dobara na chale.',
    answer:
      '**Hint — atakne par padho:** Snapshot iteration aur once registration ki consumed state alag concerns hain.\n\n**Answer guide — attempt ke baad compare karo:** Event se ordered registration records ka map rakho; duplicate function ko reuse/no-op karo. Emit records ka snapshot le. once record ko consumed mark aur live registry se remove callback se pehle karo; nested emit mein woh repeat nahi hoga. Snapshot record already consumed ho toh skip karo. Normal off live registry update kare lekin current snapshot policy preserve ho. Empty event buckets cleanup karo.',
    followUp:
      'Errors isolate karke sab listeners chalane hon toh result/error collection API kaise badlegi?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-autocomplete',
    track: 'react',
    topic: 'react',
    noteId: 'react-machine-coding',
    level: 'Intermediate',
    question: 'Machine coding: Async autocomplete component banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nReact mein local fake search adapter ke saath autocomplete banao. Query length >=2, 250ms debounce, loading/empty/error/retry states aur keyboard selection chahiye. Label duplicate ho sakta hai; item IDs unique hain.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A-query slow aur AB-query fast ho toh current query ka result hi dikhe.\n- Arrow keys, Enter, Escape aur pointer selection chale; input labeled ho.\n- Clear/unmount par late response results wapas na laaye; rejected search retry ho.',
    answer:
      '**Hint — atakne par padho:** Query, selected item aur response ownership ko separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Controlled input aur stable IDs rakho; effect cleanup request cancel kare aur sequence/query guard current response ko commit kare. Debounce request count reduce karta hai, races solve nahi. Active option index query/result change par reset karo. Complete combobox keyboard/ARIA behavior implement karo, composition ke beech Enter selection avoid karo. Loading/error sirf current request update kare.',
    followUp:
      'Query cache add karne par expired results aur background refresh ko user ko kaise dikhaoge?',
    tags: ['machine-coding', 'practice-first', 'react'],
  },
  {
    id: 'iq-machine-kanban',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Advanced',
    question: 'Machine coding: Kanban task board with undo banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nReact local-state board mein Todo/Doing/Done columns, add/edit/delete, move controls aur last delete ka undo banao. Stable task IDs aur local persistence do. Drag-and-drop stretch hai; keyboard move buttons required hain.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same-title tasks independent edit/move hon; blank title reject ho.\n- Delete then undo original task aur column restore kare.\n- Reload state restore kare; corrupt saved data par usable empty board aaye.',
    answer:
      '**Hint — atakne par padho:** Entity records aur column ordering ko explicit model karo.\n\n**Answer guide — attempt ke baad compare karo:** Tasks by ID aur ordered column IDs rakho; reducer operations se one-column-per-task invariant maintain karo. Undo snapshot mein deleted entity, column aur index store karo; restore par bounded insertion index use karo. Storage parsing ko try/catch aur shape validation do, failed write se in-memory board na todo. Accessible move buttons drag interaction ke equivalent route dein.',
    followUp: 'Undo ke pehle target column delete ho sakta ho toh restoration contract kya hoga?',
    tags: ['machine-coding', 'practice-first', 'react'],
  },
  {
    id: 'iq-machine-multi-step-form',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Intermediate',
    question: 'Machine coding: Multi-step checkout form banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nContact, Address aur Review steps wala React form banao. Each step validation, Back navigation aur fake submit do. Card/payment details scope mein nahi. Submit failure par draft rahe; pending duplicate submit block ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Invalid email par next step block ho; errors fields se associated hon.\n- Back/Next se draft preserve ho; review latest fields dikhaye.\n- Rejection ke baad retry chale; success confirmation ek baar dikhe.',
    answer:
      '**Hint — atakne par padho:** Form draft parent/reducer mein rakho, step components ko ownership clear do.\n\n**Answer guide — attempt ke baad compare karo:** Single draft plus current step aur submit state rakho. Validation pure functions hon, step transition se pehle current fields check karo aur final submit par poora draft check karo. Derived review ko duplicate state mat banao. First error ko focus do; successful step change par heading focus manage karo. Async submit finally pending guard release kare aur failure values preserve kare.',
    followUp: 'Server field errors ko hidden previous step par map karke navigation kaise karoge?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-shopping-cart',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'Machine coding: Redux shopping cart with stock limits banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nRedux/Redux Toolkit mein local catalog aur cart banao. Prices integer paise mein hain; add/remove/setQuantity aur subtotal selector do. Quantity integer 1..stock hai, remove separate operation. Invalid quantity state change na kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same product twice add par one line with quantity 2 ho.\n- Stock=2 par third add reject/no-op ho; invalid negative quantity unchanged rahe.\n- 1999 paise x2 + 500 paise x1 ka subtotal 4498 ho.',
    answer:
      '**Hint — atakne par padho:** Cart identity product ID se banao aur total derive karo.\n\n**Answer guide — attempt ke baad compare karo:** Product IDs se quantities map karo; reducer boundaries par stock/quantity rules enforce karo. Catalog lookup se selector total calculate kare, total field manually synchronize mat karo. UI rejected operation ka feedback de. Reducer tests mein old state unchanged verify karo; Toolkit draft syntax use karo toh plain reducer mutation se distinction samjho. Checkout par server price/stock final authority rahe.',
    followUp: 'Cart refresh par price badal jaaye toh user confirmation ka flow kya hoga?',
    tags: ['machine-coding', 'practice-first', 'redux'],
  },
  {
    id: 'iq-machine-optimistic-todos',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux optimistic todo updates with rollback banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nRedux app mein fake async adapter se todo status toggle karo. UI immediate update ho. Per todo at most one request allow karo; pending same-row control disable ho, different rows independent hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Success optimistic value confirm kare; failure sirf affected row rollback kare.\n- Row A fail aur row B succeed: B ka success preserve ho.\n- Pending A par second toggle request na bheje; error ke baad retry chale.',
    answer:
      '**Hint — atakne par padho:** Whole-list backup ki jagah per-entity mutation snapshot rakho.\n\n**Answer guide — attempt ke baad compare karo:** Each entity ke pending request ID, prior value aur error store karo. Start par snapshot aur optimistic update ek transition mein karo. Fulfilled/rejected response ko matching request ID se apply karo; row-level pending guard enforce karo. Failure par sirf matching row ki prior value restore karo. Full-state rollback unrelated successful changes erase karega. Server refresh overlapping ho toh ownership policy separately define karo.',
    followUp:
      'Same row ke rapid parallel edits allow karne par serialization ya versioning kaise add karoge?',
    tags: ['machine-coding', 'practice-first', 'redux'],
  },
  {
    id: 'iq-machine-normalized-issues',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'Machine coding: Redux normalized issue tracker selectors banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux mein users aur issues by ID store karo. Issue {id,assigneeId,status,title} hai. Assignee/status filters, reassignment aur visible-count selector do; missing user ko Unassigned dikhao.\n\n**Acceptance checks — demo mein dikhao:**\n\n- User rename ke baad sab related rows latest name dikhayein.\n- Reassignment ke baad filtered row correctly enter/exit ho.\n- Status filter change source entities mutate na kare; unknown assignee crash na kare.',
    answer:
      '**Hint — atakne par padho:** Joined display data selectors se derive karo, issue mein user name duplicate mat karo.\n\n**Answer guide — attempt ke baad compare karo:** Entities normalized rakho aur filters ko UI state mein store karo. Selector IDs filter kare aur user map join karke display banaye. Reference-stable inputs par memoization use karo jab repeated work measurable ho. Mutation/reducer immutable update kare taaki selectors invalidation samjhein. User delete par fallback policy explicit rakho; derived visible arrays ko independent persisted state banana sync bugs deta hai.',
    followUp:
      '10,000 issues ke saath selector recomputation aur render cost kaise separately measure karoge?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-task-api',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-express-rest-errors',
    level: 'Advanced',
    question: 'Machine coding: Express task REST API banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode/Express mein in-memory task API banao: POST /tasks, GET /tasks?limit&after, PATCH /tasks/:id, DELETE /tasks/:id. title nonblank, status todo/done, limit 1..50 default 10. IDs monotonic integers; sorting ascending ID.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Create 201; malformed title/status 400; unknown ID 404.\n- after cursor ke baad strict greater IDs aayein; invalid cursor 400.\n- Failed patch existing task ko partially mutate na kare; delete ke baad GET list se task hate.',
    answer:
      '**Hint — atakne par padho:** Validation aur mutation ke beech clear boundary rakho.\n\n**Answer guide — attempt ke baad compare karo:** Router parsing/validation kare, service task rules aur repository data access own kare. Patch ke supplied fields allowlist karke full proposed value validate karo, tab commit karo. Cursor ko numeric ID parse karke strict greater filter/sort/limit apply karo. Central error middleware se stable JSON shape do. In-memory IDs restart par reset honge; drill ko durable production API mat bolo.',
    followUp:
      'Multiple processes aur persistent database ke saath IDs/pagination contract kaise migrate karoge?',
    tags: ['machine-coding', 'practice-first', 'node'],
  },
  {
    id: 'iq-machine-stream-export',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongodb-query-production-lab',
    level: 'Advanced',
    question: 'Machine coding: Backpressure-aware CSV export banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode HTTP endpoint se async record generator ka CSV stream banao; external DB optional hai. Fields id,name hain. CSV comma/quote/newline escaping, client disconnect cleanup aur bounded buffering chahiye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- name mein comma, quote aur newline ka valid CSV bane.\n- Slow writable ke saath producer drain se pehle unbounded next records na pull kare.\n- Disconnect par generator cleanup ho; stream error response headers ke baad second JSON response na bheje.',
    answer:
      '**Hint — atakne par padho:** Writable capacity aur upstream iterator cleanup ko first-class banao.\n\n**Answer guide — attempt ke baad compare karo:** CSV encoder quote-containing/comma/newline fields ko quote kare aur embedded quotes double kare. Async iteration ko backpressure-respecting pipeline se jodo ya write false par drain/close/error wait karo. Abort par upstream iterator return/cleanup karo. Headers bhejne se pehle failure ko normal HTTP error banao; later failure stream terminate kare aur log ho. Saare records array mein materialize karna streaming defeat karega.',
    followUp:
      'Spreadsheet formula injection ke liye raw export aur spreadsheet-safe mode ka contract kya hoga?',
    tags: ['machine-coding', 'practice-first', 'node'],
  },
  {
    id: 'iq-machine-webhook-worker',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-production-integrations',
    level: 'Advanced',
    question: 'Machine coding: Idempotent webhook intake aur worker banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode API aur persistent store se fake payment event intake banao. eventId unique, orderId aur status=paid payload hai. Same ID/same payload replay accepted ho; same ID/different payload conflict ho. Real payments/signature setup scope ke bahar hai; adapter trusted fixture use kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same event parallel do baar aaye toh one durable event aur one paid transition ho.\n- Persist ke baad response se pehle crash simulate karke retry safe ho.\n- Worker failure pending event ko retryable rakhe; replay bad payload 409 de.',
    answer:
      '**Hint — atakne par padho:** HTTP receipt aur business processing ko durable event identity se connect karo.\n\n**Answer guide — attempt ke baad compare karo:** Unique event ID ke saath canonical payload/fingerprint persist karo aur durable receipt ke baad acknowledge karo. Worker pending event atomically claim kare. Order paid transition aur event processed marker same DB transaction mein commit karo; failure rollback/retry ho. Duplicate insert par stored payload compare karo. In-memory Set restart recovery nahi deta. External side effect ho toh downstream idempotency alag chahiye.',
    followUp:
      'Worker claim ke baad crash ho toh lease aur duplicate delivery handling kaise recover karegi?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-parking-lot',
    track: 'java',
    topic: 'java',
    noteId: 'java-low-level-design',
    level: 'Advanced',
    question: 'Machine coding: Parking lot low-level design implement karo',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJava console/library mein single-level parking lot banao: park(vehicleId,type), unpark(ticketId), available(type). Fixed car/bike spots hain; same-type allocation only, smallest free spot ID choose karo. Active vehicle dobara park na ho; duplicate unpark no-op ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Capacity 1 par second car reject ho; bike capacity independent rahe.\n- Unpark ke baad spot reuse ho; old ticket new occupant ko release na kare.\n- Two concurrent park calls last spot ke liye aayein toh sirf one succeeds.',
    answer:
      '**Hint — atakne par padho:** Spot identity, vehicle identity aur parking session identity alag hain.\n\n**Answer guide — attempt ke baad compare karo:** Immutable vehicle/ticket records aur spot occupancy map rakho; allocation service mein lock ke under availability check, ticket create aur occupancy update karo. Active vehicle index duplicate parking roke. Release exact active ticket match kare; stale ticket ko no-op rakho. Free spots sorted structure mein maintain kar sakte ho. God object se bachne ke liye allocation policy alag rakho, lekin atomic invariant multiple locks mein accidentally split mat karo.',
    followUp:
      'Multiple floors aur fee calculation add karne par kaunsi policies replaceable hongi?',
    tags: ['machine-coding', 'practice-first', 'java'],
  },
  {
    id: 'iq-machine-splitwise',
    track: 'java',
    topic: 'java',
    noteId: 'java-low-level-design',
    level: 'Advanced',
    question: 'Machine coding: Expense sharing ledger implement karo',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJava mein users, expenseId, payer aur participant shares se in-memory ledger banao. Amount integer paise; equal split aur explicit exact shares support karo. Equal split remainder sorted user IDs ko one paisa each mile. Same expense ID replay no-op, changed payload conflict.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A pays 100 for A/B/C: shares A=34,B=33,C=33; net A=66,B=-33,C=-33.\n- Exact shares ka sum amount se different ho toh no mutation ho.\n- Duplicate replay balances dobara change na kare; all net balances ka sum zero rahe.',
    answer:
      '**Hint — atakne par padho:** Expense validate karke hi ledger delta apply karo.\n\n**Answer guide — attempt ke baad compare karo:** Participants unique aur known hon; positive amount aur nonnegative shares validate karo. Canonical expense payload ID ke saath store karo. Payer net mein amount add aur participants se shares subtract karo; all deltas ek atomic operation mein apply karo. Equal split quotient/remainder se exact total preserve kare; floating money rounding avoid karo. Settlement suggestions net balances se derive ho sakti hain, historical debts replace karna alag policy hai.',
    followUp: 'Expense edit/delete aur concurrent duplicate requests ko atomic kaise banaoge?',
    tags: ['machine-coding', 'practice-first', 'java'],
  },
  {
    id: 'iq-machine-vending-machine',
    track: 'java',
    topic: 'java',
    noteId: 'java-object-model',
    level: 'Intermediate',
    question: 'Machine coding: Vending machine state machine banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava in-memory vending machine mein selectItem, insertCoin, cancel aur dispense operations do. Prices/coins integer units hain. Assume unlimited change supply with coin 1 available; real hardware scope mein nahi. One customer session at a time.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Insufficient credit par dispense reject ho, credit preserve rahe.\n- Success par stock one decrement aur exact change mile; session reset ho.\n- Cancel full credit refund kare; out-of-stock selection payment se pehle reject ho.',
    answer:
      '**Hint — atakne par padho:** Allowed transitions aur stock/credit invariant table se start karo.\n\n**Answer guide — attempt ke baad compare karo:** Idle/selected/funded states aur session credit model karo. Invalid transitions explicit errors dein. Dispense pehle stock aur funds recheck karke one atomic in-memory transition mein stock decrement, change compute aur session reset kare. Cancel reset ke saath current credit return kare. Pricing/change algorithm ko state transitions se separate rakho. Physical dispensing failure include karoge toh refund/compensation state chahiye.',
    followUp: 'Limited coin inventory aaye toh greedy change kab fail hoga aur algorithm kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-inventory-reservation',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Machine coding: Transactional inventory reservation API banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL database mein POST /reservations banao: productId, positive quantity, requestId. Product stock nonnegative rahe. Unique requestId/same payload same reservation return kare; changed payload 409. Real DB concurrency test required hai.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Stock 1, distinct request IDs se two parallel quantity=1 calls: exactly one succeeds.\n- Same request retry stock dobara decrement na kare.\n- Reservation insert fail par decrement rollback ho; invalid quantity 400 ho.',
    answer:
      '**Hint — atakne par padho:** Check-then-save ke bajay database-enforced atomic condition socho.\n\n**Answer guide — attempt ke baad compare karo:** Transaction mein request identity unique constraint aur conditional stock update quantity<=available use karo; affected row count se success decide karo. Reservation aur stock change ek transaction mein commit hon. Duplicate-key exception ke baad failed transaction mein query continue mat karo; rollback ke baad separate read se canonical reservation/payload compare karo. H2-only happy path ki jagah target DB parallel integration test se invariant prove karo.',
    followUp:
      'Expired reservation release ko duplicate scheduler runs ke against safe kaise banaoge?',
    tags: ['machine-coding', 'practice-first', 'spring'],
  },
  {
    id: 'iq-machine-booking-api',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Machine coding: Room booking with overlap protection banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nSpring Boot + PostgreSQL mein room booking API banao. roomId, start, end UTC instants hain; intervals [start,end) hain. Overlap reject ho; adjacent bookings allowed. Create aur cancel implement karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- [10:00,11:00) ke baad [11:00,12:00) allowed ho.\n- Same room ke overlapping parallel inserts mein one succeeds, one 409 ho.\n- end<=start invalid ho; cancel ke baad slot dobara book ho.',
    answer:
      '**Hint — atakne par padho:** Overlap condition aur per-room serialization transaction mein define karo.\n\n**Answer guide — attempt ke baad compare karo:** ExistingStart < newEnd aur newStart < existingEnd overlap rule hai. Room row lock transaction ke start mein lo, phir active overlap query aur insert karo; sab create/cancel paths same room-lock discipline follow karein. PostgreSQL exclusion constraint alternative database guarantee de sakta hai. Transaction ke bahar overlap check race allow karta hai. Lock wait/timeout ko controlled response do aur UTC parsing clear rakho.',
    followUp: 'Multi-room booking mein deadlock risk reduce karne ke liye lock order kya hoga?',
    tags: ['machine-coding', 'practice-first', 'spring'],
  },
  {
    id: 'iq-machine-sql-report',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-spring-rest',
    level: 'Advanced',
    question: 'Machine coding: Paginated sales report API aur SQL likho',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL mein customers(id,name), orders(id,customer_id,status,created_at), order_items(order_id,quantity,unit_price_paise) seed karo. GET /reports/customers from/to UTC half-open range mein paid-order totals return kare. Zero-sales customers include karo; total descending then ID ascending, page size <=50.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Customer A ke one paid order mein 2x100 aur 1x50: total 250, paidOrderCount 1 ho.\n- Cancelled order exclude ho; no-order customer total/count 0 ho.\n- Equal totals deterministic ID order mein aayein; invalid range reject ho.',
    answer:
      '**Hint — atakne par padho:** Item joins se order count multiply hone aur left join filter trap se bacho.\n\n**Answer guide — attempt ke baad compare karo:** Pehle filtered paid orders ke item totals aggregate karo, phir customer totals/order counts derive karke customers se left join karo. COALESCE zero use karo; right-side paid/date predicates outer WHERE mein rakhoge toh zero-order customer drop hoga. Integer money aggregation ke liye sufficiently wide numeric type lo. Repository projection ko DTO map karo. Static fixture par offset pagination enough hai; live report snapshot consistency alag contract hai.',
    followUp: 'Large data par query plan aur order-date/status indexes kaise evaluate karoge?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-product-search',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongodb-query-production-lab',
    level: 'Advanced',
    question: 'Machine coding: MongoDB product search with cursor pagination banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode + MongoDB collection products mein {tenantId,name,pricePaise,_id} use karo. Trusted test tenant context se category-free listing banao: optional min/max price, sort price ascending then _id, limit 1..50, opaque cursor. Cursor filters/tenant se bind ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same-price products page boundary par skip/repeat na hon in unchanged fixture.\n- Tenant A request kabhi tenant B record return na kare.\n- Malformed/mismatched cursor 400 ho; empty result next cursor na de.',
    answer:
      '**Hint — atakne par padho:** Compound ordering ke dono values cursor mein chahiye.\n\n**Answer guide — attempt ke baad compare karo:** Predicate tenant aur price range ke saath (price>lastPrice OR price=lastPrice AND _id>lastId) use kare. Cursor payload/schema validate karo aur trusted tenant/filter fingerprint match karo; client-provided tenant ko auth authority mat maano. Compound index tenantId,pricePaise,_id evaluate karo. limit+1 fetch se next-page existence derive karo. Live price changes repeat/skip kar sakte hain; snapshot guarantee claim mat karo.',
    followUp:
      'Pagination ke beech price mutation ho toh stronger consistency ka contract kya hoga?',
    tags: ['machine-coding', 'practice-first', 'mongodb'],
  },
  {
    id: 'iq-machine-atomic-stock',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-indexes-aggregation-transactions',
    level: 'Advanced',
    question: 'Machine coding: MongoDB atomic stock purchase implement karo',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode + MongoDB replica set par purchase(requestId,productId,qty) banao. Products aur purchases separate collections hain. Stock decrement aur purchase record ek transaction mein hon; requestId unique. Positive integer quantity enforce karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Stock=2 par three distinct concurrent qty=1 requests: two successful purchases, stock 0.\n- Same request replay extra stock consume na kare; changed qty conflict ho.\n- Forced purchase insert failure se stock decrement rollback ho.',
    answer:
      '**Hint — atakne par padho:** Atomic single-document update aur multi-document transaction ki roles separate hain.\n\n**Answer guide — attempt ke baad compare karo:** Transaction mein unique purchase identity aur stock>=qty conditional decrement combine karo; matched count zero ho toh insufficient stock outcome do. Purchase payload canonical store karo. Duplicate identity par transaction rollback ke baad existing record read/compare karo. Driver transaction retries ke andar external side effects mat karo. Replica set fixture aur synchronized starts se actual race verify karo; in-memory mutex DB guarantee replace nahi karta.',
    followUp:
      'Unknown commit outcome ke baad caller retry kare toh request identity recovery kaise help karegi?',
    tags: ['machine-coding', 'practice-first', 'mongodb'],
  },
  {
    id: 'iq-machine-aggregation-dashboard',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-indexes-aggregation-transactions',
    level: 'Intermediate',
    question: 'Machine coding: MongoDB sales aggregation dashboard query banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nOrders documents {tenantId,status,createdAt,items:[{sku,qty,pricePaise}]} se date-range paid revenue by SKU banao. Tenant trusted context se aaye. Output revenue descending then SKU; top 10. Half-open UTC date bounds use karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A ke items X:2x100,Y:1x50 aur second X:1x100 se X=300,Y=50 aaye.\n- Cancelled, other tenant aur exact end-time orders exclude hon.\n- Empty items/empty result crash na kare; bad dates 400 hon.',
    answer:
      '**Hint — atakne par padho:** Match/unwind/group ordering aur money representation settle karo.\n\n**Answer guide — attempt ke baad compare karo:** Tenant/status/date match early karo, items unwind karke qty*price revenue aur quantity SKU-wise group karo. Stable sort revenue descending, SKU ascending aur limit apply karo. Integer paise fields validation aur aggregate numeric range check karo. Match index query workload se choose karke explain inspect karo; aggregation result schema ko API DTO banate waqt validate karo. Missing malformed item fields ko silently zero maanna data issue hide karega.',
    followUp:
      'Refunds aur daily materialized totals add karoge toh replay/rebuild correctness kaise verify hogi?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-lru-cache',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-linear-structures',
    level: 'Intermediate',
    question: 'Machine coding: LRU cache data structure implement karo',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJS ya Java mein LRUCache(capacity), get(key), put(key,value) banao. Capacity positive integer; get missing par null. null values disallow karo. get aur existing-key put recency refresh kare; expected O(1) operations chahiye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Capacity 2: put A,put B,get A,put C => B missing, A/C present.\n- Existing key update size na badhaye aur most recent bane.\n- Capacity 1 aur invalid capacity test karo; head/tail pointers consistent hon.',
    answer:
      '**Hint — atakne par padho:** Fast lookup aur arbitrary node repositioning ke liye two structures combine karo.\n\n**Answer guide — attempt ke baad compare karo:** Hash map key->node aur doubly linked list with sentinels rakho. Hit/update node unlink karke most-recent end par insert karo. New insertion capacity exceed kare toh least-recent node list/map dono se remove karo. Size, map entries aur list membership same invariant follow karein. Complexity expected O(1) hash lookup assume karti hai; array scan/shift requirement violate karega.',
    followUp: 'TTL add karne par expiration check aur capacity eviction ka interaction kya hoga?',
    tags: ['machine-coding', 'practice-first', 'dsa'],
  },
  {
    id: 'iq-machine-trie-autocomplete',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-tries-range-bits',
    level: 'Intermediate',
    question: 'Machine coding: Trie prefix suggestion engine banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nLowercase a-z words ke liye insert, remove aur suggest(prefix,k) implement karo. Duplicate insert set-like ho; suggestions lexicographic order mein max k unique words hon. Empty prefix allowed, k=0 empty, negative/noninteger k reject.\n\n**Acceptance checks — demo mein dikhao:**\n\n- car,cat,cart insert ke baad suggest(ca,3) => car,cart,cat.\n- car remove karne par cart bache; unknown remove no-op ho.\n- Word prefix khud terminal ho toh descendants se pehle aaye.',
    answer:
      '**Hint — atakne par padho:** Terminal marker ko child existence se separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Character children aur terminal flag store karo. Prefix node locate karke lexical child order mein DFS karo, terminal word collect aur k par stop karo. Remove terminal unset kare; bottom-up sirf nonterminal childless nodes prune karo. Prefix traversal O(prefix length), enumeration visited nodes/output size par depend karegi; O(k) ka blanket claim wrong hai. Deep words par recursion depth discuss karo.',
    followUp: 'Popularity-ranked suggestions ke liye per-node top-k cache update cost kya hogi?',
    tags: ['machine-coding', 'practice-first', 'dsa'],
  },
  {
    id: 'iq-machine-dependency-runner',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Advanced',
    question: 'Machine coding: Dependency-aware task scheduler banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nUnique tasks {id,deps,run} ka DAG scheduler banao with concurrency limit. Unknown dependency/cycle execution shuru hone se pehle reject ho. Failed task ke descendants skipped hon; independent tasks continue karein. Har task once run ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A->B aur A->C: A complete hone se pehle B/C start na hon.\n- Independent jobs active limit respect karein.\n- Cycle par zero task side effects hon; A failure par B/C skipped hon.',
    answer:
      '**Hint — atakne par padho:** Validation pass aur execution pass ko separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Graph build karke unknown/duplicate IDs validate karo. Kahn pass copy of indegrees se cycle detect karo bina run call kiye. Execution mein ready queue aur active count rakho; successful prerequisite completion indegrees decrement kare. Failure descendants ko blocked/skipped mark kare, independent ready jobs run hon. Completion condition sab tasks terminal hain, sirf ready queue empty hona enough nahi. Complexity graph bookkeeping O(V+E), work durations separate hain.',
    followUp:
      'Cancelled prerequisite aur retryable failure ko state machine mein kaise represent karoge?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-rate-limiter',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'system-design-consistency-limits',
    level: 'Intermediate',
    question: 'Machine coding: Token bucket rate limiter prototype banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nIn-memory single-process allow(clientId,now) implement karo. Capacity 3, refill 1 token/sec, request cost 1. Injectable monotonic milliseconds clock; first request par full bucket. Return allowed aur retryAfterMs. Backward time ko zero elapsed maano, stored timestamp backward na karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- t=0 par first three calls allow, fourth reject retryAfterMs=1000.\n- t=500 par rejected request ko retryAfterMs=500; t=1000 par one allow.\n- Clients independent hon; long idle ke baad tokens capacity se zyada na hon.',
    answer:
      '**Hint — atakne par padho:** Elapsed time ko fractional tokens mein convert karo; refill par capacity clamp karo.\n\n**Answer guide — attempt ke baad compare karo:** Per client tokens aur last timestamp store karo. elapsed=max(0,now-last), tokens=min(capacity,tokens+elapsed*rate) calculate karo; timestamp max(last,now) rakho. Enough tokens par decrement, warna ceil((1-tokens)/rate) wait return karo. Concurrent implementation mein refill/check/decrement atomic rakho. Yeh process-local prototype hai; multiple instances combined limit enforce nahi karte.',
    followUp:
      'Bounded key memory aur distributed outage policy add karoge toh kya tradeoffs honge?',
    tags: ['machine-coding', 'practice-first', 'system-design'],
  },
  {
    id: 'iq-machine-url-shortener',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-java-api-data',
    level: 'Advanced',
    question: 'Machine coding: URL shortener vertical slice banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nApne backend stack + persistent store se POST /links aur GET /:code banao. Only http/https destinations allowed. Generated codes unique hon; fixed expiry optional field. Valid link 302 redirect, unknown 404, expired 410. Code factory aur clock injectable hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Forced first-code collision par retry se distinct code bane, existing target overwrite na ho.\n- javascript: URL reject ho; expiry boundary now>=expiresAt par 410 ho.\n- Process restart ke baad link resolve ho; cache expired link redirect na kare.',
    answer:
      '**Hint — atakne par padho:** Unique constraint correctness own kare, random generation sirf candidate provide kare.\n\n**Answer guide — attempt ke baad compare karo:** URL parser se scheme/shape validate karo aur persisted record code,target,expiresAt store karo. Unique-key conflict par bounded generation retry karo. Resolve par existence/expiry check karke redirect do; cache ho toh TTL remaining lifetime se bounded rakho aur expiry recheck karo. HTTP redirect target ko fetch karne ki zaroorat nahi. Metrics mein create/conflict/resolve/miss measure karo; one-node prototype ko global-scale solution mat bolo.',
    followUp: 'Abuse controls aur hot-link traffic ke liye kaunsi next boundary implement karoge?',
    tags: ['machine-coding', 'practice-first', 'system-design'],
  },
  {
    id: 'iq-machine-job-queue',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-messaging-reliability',
    level: 'Advanced',
    question: 'Machine coding: Durable job queue with retry aur lease banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nLocal persistent store aur two worker loops se queue prototype banao: enqueue(jobId,payload), claim(workerId), ack(jobId,leaseToken), retry. Max 3 attempts, deterministic backoff aur dead-letter state. Injectable clock use karo; external broker required nahi.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Parallel workers same current lease own na karein.\n- Worker crash ke baad lease expiry par job reclaim ho.\n- Stale worker ack new lease ko complete na kare; third failed attempt dead-letter ho.',
    answer:
      '**Hint — atakne par padho:** Lease identity job identity se alag rakho aur transition compare-and-set karo.\n\n**Answer guide — attempt ke baad compare karo:** Durable status, attempts, availableAt, lease expiry aur unique lease token rakho. Claim transaction/conditional update se eligible job transition kare aur attempts increment kare. Ack/fail current unexpired token match karke hi state change kare. Expired lease available ho lekin exhausted attempts dead-letter hon. Backoff next available time set kare. Lease processing duplicate ho sakti hai; side effect idempotency still needed hai, exactly-once execution claim mat karo.',
    followUp:
      'Worker effect commit ke baad ack se pehle crash ho toh downstream duplicate effect kaise rokoge?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-throttle',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-scope-closures',
    level: 'Intermediate',
    question: 'Machine coding: Throttle with leading aur trailing calls banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nPlain JS throttle(fn,wait) banao. wait positive finite milliseconds hai. First call immediate; window ke andar latest pending call boundary par chale. Trailing execution next window start kare. cancel pending work aur window reset kare. this/arguments preserve karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- wait=100: calls t=0,20,80 se executions t=0 aur 100, latest pending args ke saath hon.\n- Only t=0 call par t=100 mein extra execution na ho.\n- cancel at t=90 pending call roke; next call immediate chale.',
    answer:
      '**Hint — atakne par padho:** Last actual execution aur pending arguments ki ownership alag rakho.\n\n**Answer guide — attempt ke baad compare karo:** Injectable clock/timers se next eligible execution track karo. Window ke andar arguments overwrite karo lekin one timer rakho. Timer callback pending snapshot clear karke invoke kare aur execution timestamp update kare. cancel handle, args aur timestamp reset kare. Boundary timing test mein caller/timer ordering explicit rakho; real event loop ko exact wall-clock scheduler mat maano.',
    followUp:
      'Continuous calls mein debounce aur throttle ki output timelines kaise differ karengi?',
    tags: ['machine-coding', 'practice-first', 'javascript'],
  },
  {
    id: 'iq-machine-promise-combinators',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'javascript-async-patterns',
    level: 'Intermediate',
    question: 'Machine coding: Promise.all-style combinator implement karo',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nallValues(iterable) banao; Promise.all call karna allowed nahi. Native Promise aur Promise.resolve use kar sakte ho. Values/thenables accept karo, result input order mein, first rejection combined promise reject kare; remaining tasks automatically cancel nahi honge.\n\n**Acceptance checks — demo mein dikhao:**\n\n- [slowPromise,7,fastPromise] result input order mein de.\n- Empty iterable [] resolve ho; throwing iterator rejection de.\n- A rejecting thenable aur two resolving inputs se one final rejection mile.',
    answer:
      '**Hint — atakne par padho:** Remaining count aur per-position closure rakho.\n\n**Answer guide — attempt ke baad compare karo:** Promise executor ke andar iterable traverse karo aur each input ko Promise.resolve se assimilate karo. Per-index result aur remaining counter use karo; empty input separately settle karo ya initial sentinel count rakho. Synchronous iteration throw reject kare. Har input ko rejection handler attach karo; combined rejection already-started operations abort nahi karti. Thenable double resolution ko native assimilation handle kare.',
    followUp:
      'Isi contract ko allSettled aur any mein badalne ke liye completion state kaise badlegi?',
    tags: ['machine-coding', 'practice-first', 'javascript'],
  },
  {
    id: 'iq-machine-deep-clone',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Intermediate',
    question: 'Machine coding: Cycles preserve karne wala scoped deep clone banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nclone(value) ka supported domain primitives, plain objects, arrays aur Date hai. Objects ke own enumerable string keys copy karo; symbol keys, functions, accessors aur custom instances reject karo. Cycles, repeated references aur sparse arrays preserve karo; input mutate na ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- obj.self=obj ka clone.self clone khud ho.\n- {a:shared,b:shared} mein cloned a===b, lekin original shared se different ho.\n- Sparse array holes/length aur Date timestamp preserve hon; getter execute na ho.',
    answer:
      '**Hint — atakne par padho:** Recursion se pehle clone identity memoize karo.\n\n**Answer guide — attempt ke baad compare karo:** WeakMap original->clone rakho. Type/descriptor validation karke container allocate, memoize, phir data properties copy karo. Array length preserve karke sirf existing indices/keys define karo. Date timestamp se new instance banao; special types ko silently plain object mat banao. Object.defineProperty se own data keys copy karna __proto__ setter trap se bacha sakta hai. Scope explicitly limited hai, full structured cloning replacement nahi.',
    followUp: 'Map aur Set add karne par object keys aur shared identity kaise preserve hogi?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-async-memo',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'javascript-async-patterns',
    level: 'Intermediate',
    question: 'Machine coding: Async memoization with expiry aur in-flight dedupe banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nmemoAsync(load,ttl,clock) primitive string key accept kare. Same key ke pending calls one load share karein. TTL successful completion se start ho; reject cache se remove ho. invalidate(key) old pending result ko nayi entry overwrite na karne de.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Concurrent get(x) twice se load count 1 ho.\n- Rejection ke baad get(x) fresh attempt kare.\n- Invalidate, new load resolve, then old load resolve: cache mein new value hi rahe.',
    answer:
      '**Hint — atakne par padho:** Cached value ke saath entry identity rakho.\n\n**Answer guide — attempt ke baad compare karo:** Map mein pending promise/entry token store karo. Success par entry ab bhi same hai tab expiresAt set karo; failure sirf own current entry remove kare. Pending entry par value TTL apply mat karo. Invalidate entry remove kare; old callers apna result paa sakte hain par shared cache overwrite na ho. Unbounded keys memory retain karengi, is drill ke next step mein capacity policy discuss karo.',
    followUp: 'Per-user authorization-dependent response cache mein key design kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-retry-backoff',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'javascript-async-patterns',
    level: 'Intermediate',
    question: 'Machine coding: Abortable retry helper banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nretry(operation,{maxAttempts,baseDelay,signal}) likho. First attempt immediate; delays baseDelay*2^(attempt-1) hon. Sirf error.retryable=true retry ho. Injectable sleep adapter use karo; abort queued wait aur future attempts roke.\n\n**Acceptance checks — demo mein dikhao:**\n\n- maxAttempts=3, first two transient failures: delays base,2*base aur third success ho.\n- Permanent error par one call; maxAttempts=0 validation error ho.\n- Backoff mein abort par next attempt na chale; timer/listener cleanup ho.',
    answer:
      '**Hint — atakne par padho:** Attempt counter aur abort reason ko business failure se separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Loop mein operation ko signal pass karo, catch par abort/permanent/final-attempt branch pehle handle karo. Retry se pehle abort-aware sleep karo; settled wait listener cleanup kare. Max attempts total calls hain, extra retries nahi. Operation cancellation cooperate na kare toh in-flight effect stop hone ka claim mat karo; idempotent operation ya request key retry contract ka part honi chahiye.',
    followUp: 'Jitter aur Retry-After hint dono milen toh delay policy kaise define karoge?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-array-utils',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Intermediate',
    question: 'Machine coding: groupBy aur stable multi-key sorting utility banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\ngroupBy(items,keyFn) Map return kare. stableSortBy(items,comparators) first nonzero comparator use kare aur original array mutate na kare. Comparators synchronous total order dein; malformed comparator scope ke bahar hai.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Keys __proto__ aur constructor normal Map keys ki tarah group hon.\n- Same department/score wale items original order preserve karein.\n- Empty input aur object-identity keys work karein; original array unchanged rahe.',
    answer:
      '**Hint — atakne par padho:** Grouping key ko string coercion se bachao aur tie-break index retain karo.\n\n**Answer guide — attempt ke baad compare karo:** One pass Map buckets banao, original item references buckets mein rakho. Sort ke liye {value,index} decorate karo; comparators sequence mein evaluate aur complete tie par original index compare karo. Sorted values project karke return karo. Grouping O(n), comparison sort O(n log n) comparisons use karta hai; keyFn/comparator cost separately count karo.',
    followUp: 'Locale-aware strings aur missing numeric values ke ordering rules kaise add karoge?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-flatten-paths',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-arrays-objects',
    level: 'Intermediate',
    question: 'Machine coding: Flatten aur unflatten nested JSON paths banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nPlain JSON objects ke string/number/boolean/null leaves ko [pathSegments,value] pairs mein flatten karo. Arrays unsupported aur reject; empty objects explicit {} leaf marker hon. unflatten inverse ho; dangerous prototype segments reject karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- {"a.b":{"c":1}} key ko one segment maano, dot delimiter se split mat karo.\n- Empty object aur null round-trip hon.\n- Conflicting paths [a] aur [a,b], duplicate path aur __proto__ segment reject hon.',
    answer:
      '**Hint — atakne par padho:** Path string ki jagah segment array ambiguity remove karta hai.\n\n**Answer guide — attempt ke baad compare karo:** DFS own entries par path copy karke emit karo. Empty container marker leaf scalar se distinguish karo. Reconstruction null-prototype containers/own checks use kare aur conflicting assignments validate kare. Duplicate/prefix paths detect karke partial success expose mat karo. Cycles JSON domain mein nahi; runtime object cyclic ho toh explicit reject karo. Serialization labels ko executable property expressions mat banao.',
    followUp:
      'Arrays, escaped paths aur maximum nesting depth ko schema mein kaise include karoge?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-tiny-store',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-scope-closures',
    level: 'Intermediate',
    question: 'Machine coding: Observable state store with batched updates banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\ncreateStore(initial) se getState, setState(updater), subscribe(listener), batch(fn) do. State immutable snapshots maana jayega. Listener snapshot iteration ho; Object.is-equal state par notify nahi. Nested batches outer completion par one notification dein.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Two increments in one batch state +2 karein par listener once chale.\n- Unsubscribe twice safe ho; subscribe during notify current snapshot mein na chale.\n- Batch function throw kare toh already-applied state rahe aur outer cleanup ke baad notify ho.',
    answer:
      '**Hint — atakne par padho:** Batch depth aur dirty flag se notification lifecycle express karo.\n\n**Answer guide — attempt ke baad compare karo:** State reference, ordered listeners aur depth counter rakho. setState updater result compare karke dirty mark kare; depth zero par notify karo. batch try/finally depth decrement kare, outer exit dirty snapshot publish kare. Notification se pehle dirty clear karo taaki nested updates lost na hon; reentrant writes queue karke recursive stack overflow avoid karo. Listener-error policy document karo.',
    followUp:
      'Listener exception baaki subscribers ko starve na kare toh error reporting kaise change hogi?',
    tags: ['machine-coding', 'stretch-practice', 'javascript'],
  },
  {
    id: 'iq-machine-data-grid',
    track: 'react',
    topic: 'react',
    noteId: 'react-machine-coding',
    level: 'Advanced',
    question: 'Machine coding: Sortable paginated editable React data grid banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\n50 local records {id,name,score} se table banao. Case-insensitive name filter, score sort, page size 10 aur inline name editing do. Filter/sort change page 1 reset kare; edits ID se attach hon. Draft tab tak rahe jab tak Save/Cancel ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Row edit karke sort karne par draft same ID par rahe.\n- Filtered result shrink ho toh nonexistent page na dikhe.\n- Duplicate names, empty results aur invalid blank Save handle hon; keyboard edit chale.',
    answer:
      '**Hint — atakne par padho:** Source records, draft map aur derived visible IDs separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Canonical records immutable update karo; draft IDs se store karo aur rows ko ID key do. Pipeline filter->stable sort->paginate ho, original array sort mat karo. Save validate karke only target entity update kare; Cancel sirf us draft ko clear kare. Sort controls aria-sort aur labels expose karein. Page bounds derive/clamp karo; index keys wrong row editor reuse kar sakti hain.',
    followUp:
      'Server pagination add karne par unsaved off-page drafts aur stale responses kaise handle karoge?',
    tags: ['machine-coding', 'practice-first', 'react'],
  },
  {
    id: 'iq-machine-file-explorer',
    track: 'react',
    topic: 'react',
    noteId: 'react-components-rendering',
    level: 'Advanced',
    question: 'Machine coding: React file explorer with rename aur move banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nIn-memory tree nodes {id,parentId,name,type} se explorer banao. Expand/collapse, create folder, rename, delete subtree aur Move-to-folder select control do. Same parent mein duplicate names reject; folder ko own descendant mein move na karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Rename expanded folder se child state na lose ho.\n- Move into descendant reject aur original tree unchanged ho.\n- Delete subtree ke baad selection missing ID par na rahe; keyboard buttons work karein.',
    answer:
      '**Hint — atakne par padho:** Flat node map se ancestry check aur stable identity simplify karo.\n\n**Answer guide — attempt ke baad compare karo:** Nodes normalized rakho; expanded IDs aur selected ID UI state hon. Move se pehle proposed parent ancestors walk karke cycle check karo aur duplicate sibling name validate karo. Delete descendants collect karke one state transition mein remove karo. Selection fallback parent/root par set karo. Visual tree role tabhi use karo jab full tree keyboard behavior implement ho; simple nested lists/buttons acceptable hain.',
    followUp:
      'Lazy-loaded folders mein move validation server authority ke saath kaise coordinate hogi?',
    tags: ['machine-coding', 'practice-first', 'react'],
  },
  {
    id: 'iq-machine-infinite-feed',
    track: 'react',
    topic: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Advanced',
    question: 'Machine coding: Infinite feed with deduplication aur retry banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nFake cursor API se React feed banao. Load More required, intersection auto-load optional. Cursor page records overlap kar sakte hain; stable IDs dedupe karo. One in-flight request per feed generation; filter change resets generation.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Double Load More same cursor twice request na kare.\n- Failed page par existing items bachein aur retry same cursor use kare.\n- Filter switch ke baad old response ignore ho; end cursor null par loading stop ho.',
    answer:
      '**Hint — atakne par padho:** Pagination cursor ko last response ownership se bind karo.\n\n**Answer guide — attempt ke baad compare karo:** Current generation, next cursor aur pending state rakho; response matching generation par merge karo. Ordered IDs plus map duplicate records ko defined update policy se reconcile karein. Cursor success ke baad advance ho, failure par same cursor retry ho. Sentinel callback multiple fire ho sakti hai isliye UI disabled state alone enough nahi; request-level guard chahiye.',
    followUp: 'Feed ke top par new item insertion aaye toh scroll position kaise preserve karoge?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-toast-manager',
    track: 'react',
    topic: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Intermediate',
    question: 'Machine coding: React toast manager with pause aur queue banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nToast provider mein add/update/dismiss do; max 3 visible, FIFO waiting queue. Auto-dismiss duration visible hone par start ho. Hover ya keyboard focus par timer pause ho; manual close aur unmount cleanup chahiye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Fourth toast queued ho aur slot free hone par full duration mile.\n- Two-second toast 500ms baad pause/resume ho toh remaining 1500ms rahe.\n- Update/dismiss unknown ID no-op ho; close button labeled ho.',
    answer:
      '**Hint — atakne par padho:** Expiry deadline aur remaining duration ko elapsed time se derive karo.\n\n**Answer guide — attempt ke baad compare karo:** Stable IDs, visible queue aur waiting queue maintain karo. Per-toast active timer ownership track karo; hover/focus ka combined paused flag use karo taaki one leave event doosra pause cancel na kare. Pause deadline se remaining compute kare, resume fresh deadline banaye. Live announcements severity ke hisaab se bounded rakho; har rerender par announcement repeat mat karo.',
    followUp: 'Same operation ke repeated progress updates announcement noise kaise avoid karenge?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-date-picker',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Advanced',
    question: 'Machine coding: Single-month React date range picker banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nFixed supplied month/year ka calendar banao, start/end inclusive date selection do. Dates YYYY-MM-DD strings hain, times nahi. Disabled dates range ke beech bhi allowed nahi. Second earlier date new start banaye; Clear reset kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Month weekday offset aur leap-year February correctly render hon.\n- Disabled date ko include karta range reject ho aur prior valid selection preserve ho.\n- Keyboard date selection aur labeled day controls hon; Clear dono endpoints remove kare.',
    answer:
      '**Hint — atakne par padho:** Calendar arithmetic ko UI transition se separate pure functions banao.\n\n**Answer guide — attempt ke baad compare karo:** Year/month/day components se day cells generate karo; local/UTC conversions mix karke off-by-one mat lao. State empty/start-only/complete rakho. Candidate end par whole inclusive interval validate karo, phir commit karo. Day buttons full date names expose karein; selected/start/end state visible aur announced ho. Full date-picker pattern claim karne se pehle arrow/focus navigation test karo.',
    followUp:
      'Multiple months aur timezone-aware booking instants add hon toh date-only boundary kahan convert hogi?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-transfer-list',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Intermediate',
    question: 'Machine coding: Searchable transfer list with bulk selection banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nTwo lists of unique-ID users banao. Each side search, row selection aur Move selected controls de. Hidden selected rows preserved hon; Select all sirf currently filtered visible rows select kare. Each user exactly one side rahe.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same-name users independent select hon.\n- Search hide kare selected user ko, Move selected still us user ko move kare.\n- Repeated move duplicate user na banaye; selection moved IDs ke liye clear ho.',
    answer:
      '**Hint — atakne par padho:** Location aur selection ko labels ki jagah IDs se model karo.\n\n**Answer guide — attempt ke baad compare karo:** One entity map aur side membership sets rakho. Filter derived ho; selection sets source state hon. Bulk move selected membership intersection compute karke one transition mein source remove/destination add kare. Select-all tri-state visible subset se derive karo. Result count/status announce karo aur move ke baad focus usable control par rahe.',
    followUp: 'Server permission reject kare kuch users ko toh partial move result ka UI kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-virtual-list',
    track: 'react',
    topic: 'react',
    noteId: 'react-performance-production',
    level: 'Advanced',
    question: 'Machine coding: Fixed-height virtualized list banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nReact mein 10,000 rows, fixed height 32px, viewport 320px aur overscan 3 rows per side ke saath virtual list banao. Scroll-to-index button do. Row heights dynamic aur inline editing scope ke bahar hain.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Middle viewport mein at most 16 row nodes render hon.\n- Index 9999 par scroll last row visible kare aur blank gap na aaye.\n- Empty list aur data shrink par scroll/index clamp ho.',
    answer:
      '**Hint — atakne par padho:** Total spacer height aur visible slice offset separate hain.\n\n**Answer guide — attempt ke baad compare karo:** Start=floor(scrollTop/rowHeight), end viewport se derive karke overscan bounds clamp karo. Full-height spacer ke andar slice ko start*height offset do; stable IDs keys hon. Scroll-to-index ko valid range clamp karo. DOM count aur scroll position test karo; virtualization browser find/accessibility navigation ko affect karti hai, isliye row position metadata aur deliberate focus strategy do.',
    followUp: 'Dynamic heights mein measurement cache aur prefix sums kaise help karenge?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-tic-tac-toe',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Intermediate',
    question: 'Machine coding: React tic-tac-toe with move history banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\n3x3 game banao: alternating X/O, win/draw detection, restart aur jump-to-move history. Old move se new move karne par future branch discard ho. Occupied cell aur finished game par click no-op ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Top row X win par next click state na badle.\n- Nine-move draw announce ho; restart blank board kare.\n- Move 2 par jump then play se old future history remove ho.',
    answer:
      '**Hint — atakne par padho:** Board snapshot history rakho, derived winner ko separately synchronize mat karo.\n\n**Answer guide — attempt ke baad compare karo:** Immutable boards ka history array aur selected move index rakho. New move history.slice(0,index+1) se branch banaye. Turn move parity se derive karo; win lines pure helper check kare. Cell buttons coordinate aur current value accessible label dein. Winner/draw status live region mein ho. Mutating existing snapshot time travel ko corrupt karega.',
    followUp: 'N-by-N board aur K-in-a-row rule par winner detection complexity kaise badlegi?',
    tags: ['machine-coding', 'stretch-practice', 'react'],
  },
  {
    id: 'iq-machine-library-system',
    track: 'java',
    topic: 'java',
    noteId: 'java-low-level-design',
    level: 'Advanced',
    question: 'Machine coding: Library lending service implement karo',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJava in-memory service mein titles, physical copies aur members model karo. borrow(memberId,copyId), returnLoan(loanId), activeLoans(memberId) do. Member max 3 active loans; copy max 1. Parallel operations supported hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same title ki two copies different members borrow kar sakein.\n- Last allowed member slot ke liye concurrent calls limit exceed na karein.\n- Old returned loan dobara return karne se new loan release na ho.',
    answer:
      '**Hint — atakne par padho:** Copy constraint aur member constraint same atomic boundary mein enforce karo.\n\n**Answer guide — attempt ke baad compare karo:** Unique loan identity aur active-copy/member indexes rakho. One service lock simple correct starting point hai: validate both invariants, create loan aur indexes update under same lock. Return exact active loan check kare aur idempotent no-op ho. Fine-grained locks choose karo toh global ordering required hai. Book-title identity se lending track karoge toh multiple physical copies incorrectly conflict karengi.',
    followUp:
      'Database implementation mein copy/member constraints aur lost response retries kaise preserve karoge?',
    tags: ['machine-coding', 'practice-first', 'java'],
  },
  {
    id: 'iq-machine-bounded-blocking-queue',
    track: 'java',
    topic: 'java',
    noteId: 'java-concurrency',
    level: 'Advanced',
    question: 'Machine coding: Bounded blocking queue implement karo',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJava generic queue mein put,take,close do; capacity positive, null forbidden. Library BlockingQueue use mat karo; locks/conditions allowed. Full put wait, empty take wait. close blocked producers reject kare; consumers remaining values drain karke closed result dein.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Capacity 1 par second producer first take tak block ho.\n- Close wake kare waiting producers/consumers; queued item lost na ho.\n- Interrupted wait interrupt propagate kare aur queue invariant preserve rahe.',
    answer:
      '**Hint — atakne par padho:** Condition wakeup ko predicate true hone ki guarantee mat maano.\n\n**Answer guide — attempt ke baad compare karo:** Ring buffer, count aur closed flag lock ke under rakho. while loops mein full/empty predicate recheck karo; await lock release/reacquire kare. Insert/remove opposite condition signal karein. Close lock ke under flag set aur signalAll kare. take ka terminal result empty-closed ko null data se distinguish kare, isliye null forbidden hai. finally unlock aur interrupt contract explicit rakho.',
    followUp:
      'Fairness aur timed offer/poll add karne par remaining timeout kaise calculate karoge?',
    tags: ['machine-coding', 'practice-first', 'java'],
  },
  {
    id: 'iq-machine-log-aggregator',
    track: 'java',
    topic: 'java',
    noteId: 'java-exceptions-io-time',
    level: 'Intermediate',
    question: 'Machine coding: Streaming log analyzer with top errors banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava Reader se line-delimited timestamp|service|level|message parse karo. UTC instant timestamps hain; message mein | allowed hai. Counts by service/level aur top 5 error messages return karo, ties lexical. Malformed line count karo, processing continue ho; max line length 4096.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Three separators ke baad message ka remaining text preserve ho.\n- Malformed date/oversized line counted ho, next valid line process ho.\n- Empty input zero summary de; file ownership contract Reader caller close kare.',
    answer:
      '**Hint — atakne par padho:** Streaming lines aur bounded line parser alag resource concerns hain.\n\n**Answer guide — attempt ke baad compare karo:** Character buffer se length cap enforce karke oversized line discard-until-newline karo; ordinary readLine already huge string allocate kar sakta hai. Split limit 4 ya explicit separators se parse karo, timestamp validation catch karo. Counts map aur deterministic top-k sort/heap use karo. Distinct message count unbounded ho sakti hai; is exact drill mein fixture bound document karo.',
    followUp:
      'Unbounded distinct messages par exact top-k aur approximate heavy hitters ka tradeoff kya hai?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-delayed-scheduler',
    track: 'java',
    topic: 'java',
    noteId: 'java-concurrency-production',
    level: 'Advanced',
    question: 'Machine coding: Cancellable delayed task scheduler banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava single dispatcher scheduler mein schedule(task,deadlineNanos), cancel(id), shutdown do. Inject monotonic clock/wakeup abstraction for tests. Task execution separate bounded executor par ho; executor full ho toh task failed mark ho, silently drop nahi.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Earlier task insert hone par dispatcher old deadline tak sleep na kare.\n- Cancel before dispatch task execute na kare; duplicate cancel safe ho.\n- Shutdown pending tasks cancel kare aur waiting dispatcher wake ho.',
    answer:
      '**Hint — atakne par padho:** Deadline priority queue ko condition-wait loop se combine karo.\n\n**Answer guide — attempt ke baad compare karo:** Lock-protected min-heap aur ID->state map rakho. Wait loop nearest deadline aur shutdown recheck kare; new earliest insertion signal de. Due task ko atomic pending->dispatched transition ke baad executor handoff karo. Cancel sirf pending state se win kare; already-running interrupt guarantee mat do. Task exception catch/report karo taaki dispatcher alive rahe.',
    followUp:
      'Fixed-rate versus fixed-delay recurring jobs mein overrun behavior kaise define karoge?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-threadsafe-bank',
    track: 'java',
    topic: 'java',
    noteId: 'java-concurrency',
    level: 'Advanced',
    question: 'Machine coding: Atomic account transfer service banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava in-memory accounts mein integer paise balances rakho. transfer(from,to,amount) all-or-nothing ho, insufficient funds reject, negative/zero amounts invalid, same account no-op after validation. Parallel transfers supported hon; overflow reject karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Concurrent A->B aur B->A bounded timeout mein complete hon, deadlock nahi.\n- Failure par dono balances unchanged aur total sum conserved ho.\n- Near-maximum long balance transfer overflow kare toh mutation na ho.',
    answer:
      '**Hint — atakne par padho:** Locks stable account ID order mein acquire karo.\n\n**Answer guide — attempt ke baad compare karo:** Accounts validate karke lower ID lock phir higher ID lock lo. Under locks source funds aur destination exact-add overflow check karo, phir dono updates commit karo. Same-account branch before double lock handling explicit rakho. Reads consistent snapshot chahiye toh same locking discipline follow karein. Money floating point mein model mat karo; distinct invariant tests conservation aur nonnegative balance prove karein.',
    followUp:
      'Crash-safe durable transfer mein in-memory locks ko kis database transaction boundary se replace karoge?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-strategy-pricing',
    track: 'java',
    topic: 'java',
    noteId: 'java-packages-interfaces',
    level: 'Intermediate',
    question: 'Machine coding: Checkout pricing engine with coupons banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava pricing library mein item subtotal, one coupon aur tax calculate karo. Money integer paise; coupon fixed or percent basis points 0..10000, discount subtotal tak capped. Percent discount floor, tax discounted subtotal par floor. Input immutable ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Subtotal 10000, coupon 1000 basis points, tax 1800 basis points => discount 1000, tax 1620, total 10620.\n- Oversized fixed coupon total negative na kare.\n- Zero quantity/negative price reject; original cart unchanged rahe.',
    answer:
      '**Hint — atakne par padho:** Calculation order aur rounding contract strategy interface se pehle fix karo.\n\n**Answer guide — attempt ke baad compare karo:** Validated immutable cart lines se subtotal exact arithmetic mein derive karo. Coupon strategy discount de, central service cap apply kare; tax policy discounted base par chale. Wider/exact intermediate arithmetic use karo taaki multiply overflow na ho. Result breakdown subtotal/discount/tax/total expose kare. Strategy extension business order ko implicitly change na kare.',
    followUp:
      'Multiple stackable coupons aur line-level refunds mein rounding allocation kaise preserve hogi?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-snapshot-kv',
    track: 'java',
    topic: 'java',
    noteId: 'java-collections-generics',
    level: 'Advanced',
    question: 'Machine coding: Key-value store with snapshot transactions banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava single-process string KV store mein begin,get,put,delete,commit,rollback do. Transaction reads begin snapshot plus own writes. First version mein global-version optimistic conflict: any intervening successful write commit causes conflict. Failed commit no partial writes ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Transaction apni put/delete read kare; others uncommitted writes na dekhein.\n- Two writers same base version se commit: first success, second conflict.\n- Rollback unchanged global state de; closed transaction operations reject hon.',
    answer:
      '**Hint — atakne par padho:** Snapshot aur staged writes ko live map se detach karo.\n\n**Answer guide — attempt ke baad compare karo:** Begin lock ke under map snapshot/version capture kare. Transaction overlay mein tombstone delete ko missing key se distinguish kare. Commit same lock mein base version compare, complete overlay apply aur version increment kare; read-only commit ko defined no-write path do. Yeh coarse conflict policy independent writes bhi reject karegi, lekin correctness clear hai. Full snapshot copy memory cost explain karo.',
    followUp:
      'Per-key versions se unrelated writes allow karoge toh range-read phantom conflict kaise handle hoga?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-board-game-engine',
    track: 'java',
    topic: 'java',
    noteId: 'java-object-model',
    level: 'Intermediate',
    question: 'Machine coding: Snakes and ladders game engine banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJava console-independent engine mein 2–4 players, board 1..100, injected dice 1..6 aur start position 0 rakho. Overshoot par stay, exact 100 wins. Landing square ka at most one snake/ladder jump apply karo; mappings destination 1..100, source 1..99.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Position 98 plus 4 stay 98 kare aur turn advance ho.\n- Dice landing 5 with 5->20 jump player ko 20 le jaaye.\n- Winner ke baad roll reject; invalid board/dice input state mutate na kare.',
    answer:
      '**Hint — atakne par padho:** Randomness aur game rules ko presentation se separate karo.\n\n**Answer guide — attempt ke baad compare karo:** Game state positions/current player/status rakho, dice source dependency inject karo. Proposed move validate aur single configured jump apply karo, phir win check aur otherwise next turn. Mapping chain deliberately apply nahi hoti; board contract UI mein clear ho. Deterministic dice sequence se winner/overshoot/turn tests repeat karo. Domain class ko console scanner se couple mat karo.',
    followUp:
      'Chained jumps aur configurable win rules introduce karoge toh cycle validation kahan hogi?',
    tags: ['machine-coding', 'stretch-practice', 'java'],
  },
  {
    id: 'iq-machine-secured-notes',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-security-microservices',
    level: 'Advanced',
    question: 'Machine coding: Owner-scoped Spring Boot notes API banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL mein authenticated user-owned notes CRUD banao. Test authentication principal provided hai; login/password issuance scope ke bahar. User apni notes hi list/read/update/delete kar sake. Missing aur other-owner ID dono 404 dein; unauthenticated request 401.\n\n**Acceptance checks — demo mein dikhao:**\n\n- User A User B ka guessed ID read/update na kar sake.\n- Request body ownerId spoof field reject ya ignore ho, owner principal se aaye.\n- Blank title 400; successful update unrelated note na change kare.',
    answer:
      '**Hint — atakne par padho:** Repository query mein ownership predicate include karo.\n\n**Answer guide — attempt ke baad compare karo:** Controller validated DTO le, service trusted principal ID use kare. findByIdAndOwner style lookup ya conditional owner-scoped update/delete enforce karo; frontend hidden buttons authorization nahi hain. List query bhi same predicate use kare. Security integration tests two principals aur anonymous client ke saath chalao. Error response entity existence leak na kare aur internal exception stack hide kare.',
    followUp:
      'Admin sharing permission add karne par object-level authorization policy kaise evolve hogi?',
    tags: ['machine-coding', 'practice-first', 'spring'],
  },
  {
    id: 'iq-machine-optimistic-document-api',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Machine coding: Versioned document API with conflict response banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nSpring Boot/JPA + SQL mein GET document aur update(id,expectedVersion,text) banao. Response version include kare. Concurrent same-version updates mein one succeeds, one 409; lost update forbidden. Blank text reject karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Version 3 ke two clients update karein toh one version 4 result, one conflict ho.\n- Conflict response current text ko overwrite na kare.\n- Missing ID 404, malformed version 400; persistence integration test race reproduce kare.',
    answer:
      '**Hint — atakne par padho:** Client precondition aur database version check dono chahiye.\n\n**Answer guide — attempt ke baad compare karo:** Entity version field aur client expectedVersion compare karo; update transaction ke flush/commit par optimistic failure map karo. Comparison alone race-safe nahi, DB update version predicate required hai. Failure handler transaction ke bahar clean conflict DTO banaye. Client ko reload/merge option explain karo; automatic blind retry user ke newer text overwrite kar sakta hai.',
    followUp:
      'ETag/If-Match HTTP contract choose karoge toh 409 aur 412 mapping kaise settle karoge?',
    tags: ['machine-coding', 'practice-first', 'spring'],
  },
  {
    id: 'iq-machine-csv-import-job',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'spring-background-cache',
    level: 'Advanced',
    question: 'Machine coding: CSV import with row errors aur batch commits banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL mein job submit/status API se small CSV product import banao. Fixture local file/object adapter use kare; CSV parsing maintained parser adapter se ho. Rows sku,name,pricePaise; batch 50 valid rows commit hon, invalid rows count/detail report hon. Same job restart already-committed row numbers skip kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 120 valid rows mein third batch failure se first 100 durable rahein.\n- Invalid price row error report kare, valid rows continue hon.\n- Job replay same row product update dobara na apply kare; status totals consistent hon.',
    answer:
      '**Hint — atakne par padho:** Job checkpoint aur batch writes same transaction mein commit karo.\n\n**Answer guide — attempt ke baad compare karo:** Job/row outcome records durable rakho; unique(jobId,rowNumber) dedupe kare. Parse/validate bounded stream mein karo, errors capped detail table mein store karo. Each batch product writes aur checkpoint atomically commit kare. Async executor bounded ho; HTTP request thread poora import wait na kare. File adapter lifetime aur crash recovery explicit rakho; singleton boolean running restart safety nahi deta.',
    followUp: 'Two workers same job claim karein toh lease/fencing kaise add karoge?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-outbox-publisher',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'spring-background-cache',
    level: 'Advanced',
    question: 'Machine coding: Transactional outbox publisher implement karo',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL order create operation mein order aur outbox event atomically save karo. Scheduled worker fake message adapter ko publish kare aur sent mark kare. Duplicate publication allowed, event ID stable; consumer fixture dedupe kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Order transaction rollback par outbox row bhi absent ho.\n- Publish success then mark-sent failure simulate karne par retry same event ID bheje.\n- Consumer repeated event se business effect once apply kare.',
    answer:
      '**Hint — atakne par padho:** Database atomicity broker delivery ke saath same guarantee nahi hai.\n\n**Answer guide — attempt ke baad compare karo:** Order/outbox inserts same transaction mein rakho. Worker bounded eligible batch claim kare; publish receipt ke baad sent transition kare. Publish/mark gap duplicate allow karta hai, isliye stable event ID aur consumer inbox uniqueness required hai. Concurrent publishers ke liye row claim/lease policy do. Serialization payload version event creation time par persist karo, later entity mutations se event meaning change mat karo.',
    followUp: 'Per-order event ordering multiple workers ke saath kaise maintain karoge?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-cache-aside-api',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'spring-background-cache',
    level: 'Advanced',
    question: 'Machine coding: Cache-aside product read service banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot service mein get/update product, fake cache adapter aur SQL repository use karo. Cache TTL 30 seconds injected clock se ho. Update DB commit ke baad cache invalidate kare. Single-instance drill mein per-key read/write coordination stale refill roke.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Repeated read hit repository once kare, expiry par reload ho.\n- Delayed old read overlapping update cache ko old product se refill na kare.\n- Cache unavailable par DB fallback ho; DB failure fake success cache na kare.',
    answer:
      '**Hint — atakne par padho:** Commit ke baad eviction bhi already-running old read ko khud nahi rokta.\n\n**Answer guide — attempt ke baad compare karo:** Per-key lock ke andar DB load/cache populate aur update-commit/evict serialize karo; transaction commit lock release se pehle ho. Alternative generation token design bhi valid hai. Cache errors fallback/metrics se handle karo, failed reads store mat karo. Local lock multi-instance coherence guarantee nahi deta; explicit drill boundary rakho. Avoid cached mutable entity leaking modifications.',
    followUp:
      'Multi-instance deployment mein invalidation delivery aur bounded staleness ka contract kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-api-integration-tests',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'spring-testing',
    level: 'Advanced',
    question: 'Machine coding: Spring API integration test harness banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nExisting notes CRUD API ke liye real HTTP boundary aur target SQL DB par repeatable integration suite banao. Unique test users/data namespace, create-read-update-delete, validation aur unauthorized access cover karo. App fake repository use nahi kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Suite twice aur two parallel runs without shared-ID collisions pass hon.\n- Rollback-only test transaction se HTTP server writes magically rollback assume na ho.\n- A deliberately removed ownership predicate ko cross-user test catch kare.',
    answer:
      '**Hint — atakne par padho:** Test process transaction aur server request transaction separate hote hain.\n\n**Answer guide — attempt ke baad compare karo:** Isolated database/schema ya unique namespace setup karo; cleanup explicit tracked IDs se ho. HTTP client response status/body aur subsequent persisted read verify kare. Authentication fixtures deterministic hon. Assertions sirf mocks called nahi, observable outcomes test karein. Test timeouts bounded hon; race tests synchronized start use karein, arbitrary sleep se race proof mat banao.',
    followUp:
      'External email/payment adapter ko replace karte waqt kaunsi boundaries real rakhoge?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-soft-delete-api',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Machine coding: Soft delete with active-name uniqueness banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot + PostgreSQL categories API mein create,list,delete,restore do. Name trimmed lowercase canonical key se unique among active rows ho. Deleted name reuse allowed; restore conflict 409. deletedAt timestamp injected clock se aaye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Delete category then same canonical name create successful ho.\n- Old category restore while new active exists 409 de.\n- Concurrent creates of Foo/foo one success dein; active listing deleted rows exclude kare.',
    answer:
      '**Hint — atakne par padho:** Uniqueness rule active predicate ke saath DB mein enforce karo.\n\n**Answer guide — attempt ke baad compare karo:** Canonical name persist karo aur active rows ke liye partial unique index rakho. Delete/restore transaction state transition hon; restore unique violation controlled conflict bane. Query defaults active filter lagayein lekin admin lookup explicit ho. ORM global filter alone index constraint replace nahi karta. Restore fail par deletedAt unchanged rahe; actual PostgreSQL fixture index behavior test kare.',
    followUp: 'Foreign-key references to soft-deleted categories ka read/write contract kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-keyset-orders',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Machine coding: Keyset-paginated order history API banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nSpring Boot + SQL mein current-user orders createdAt DESC,id DESC order se list karo. limit 1..50, cursor last timestamp+ID aur filter fingerprint carry kare. createdAt immutable ho; filters status optional. Static fixture no-skip/no-duplicate guarantee do.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same timestamp ke 12 rows, page size 5 mein each ID exactly once aaye.\n- Other-user rows absent, changed filter with old cursor 400 ho.\n- Empty page next cursor null; invalid timestamp cursor reject ho.',
    answer:
      '**Hint — atakne par padho:** Composite sort ka lexicographic inverse predicate likho.\n\n**Answer guide — attempt ke baad compare karo:** Predicate createdAt<last OR (createdAt=last AND id<lastId) plus owner/status filters use karo. limit+1 fetch se hasNext decide karo, returned last visible row se cursor banao. Owner trusted principal se aaye, cursor se nahi. Matching composite index explain karo aur SQL integration fixture equal timestamps include kare. Live status changes snapshot guarantee nahi dete, contract clearly limit karo.',
    followUp:
      'Export ko consistent snapshot chahiye toh normal cursor pagination se kya extra mechanism chahiye?',
    tags: ['machine-coding', 'stretch-practice', 'spring'],
  },
  {
    id: 'iq-machine-notification-service',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-messaging-reliability',
    level: 'Advanced',
    question: 'Machine coding: Notification delivery service prototype banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nApne backend stack + durable store mein enqueueNotification(requestId,userId,channel,payload) aur worker banao. Email/SMS fake adapters hon. Per-user channel preferences enqueue time snapshot hon. Max 3 attempts; provider supports idempotency key.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same request/payload replay one logical notification create kare.\n- Opted-out user ke liye skipped status ho aur provider call zero ho.\n- Provider success then worker crash retry same key se duplicate effect na banaye.',
    answer:
      '**Hint — atakne par padho:** Notification identity, delivery attempts aur provider identity separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Unique request row, preference snapshot aur pending status durable save karo. Worker atomic claim/lease se bounded retries kare; every attempt same provider idempotency key use kare. Permanent failure dead-letter ho aur inspection endpoint reason expose kare. Provider key support is drill assumption hai; without it delivery exactly once guarantee nahi. Payload logs mein sensitive details redact karo.',
    followUp:
      'Preference processing se pehle change ho toh enqueue snapshot ya send-time check kaunsa contract choose karoge?',
    tags: ['machine-coding', 'practice-first', 'system-design'],
  },
  {
    id: 'iq-machine-chat-reconnect',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-realtime-case-study',
    level: 'Advanced',
    question: 'Machine coding: Reconnect-safe chat service prototype banao',
    minutes: 90,
    priority: 'P1',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nLocal durable store aur fake connection adapter se room chat banao. send(room,user,clientMessageId,text), history(afterSequence), subscribe do. Room sequence increasing ho; same sender/clientMessageId replay same message return kare. Auth trusted test principal se ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Lost send acknowledgment ke baad retry new message create na kare.\n- Disconnect ke dauraan missed 3 messages reconnect par once render hon.\n- Room permission nahi toh send/history denied; empty text rejected ho.',
    answer:
      '**Hint — atakne par padho:** Durable ordered history source of truth hai, live channel notification path hai.\n\n**Answer guide — attempt ke baad compare karo:** Message persist/dedupe aur sequence allocation one transaction mein karo; room membership validate karo. Reconnect subscribe buffer start karke history watermark tak fetch karo, then buffered records sequence/ID se merge karo; fetch-then-subscribe gap messages lose karega. Client rendered IDs dedupe kare. One-node adapter se prove ki guarantees multi-region ordering automatically imply nahi karti.',
    followUp:
      'Room sequence bottleneck aur per-room partitioning ke tradeoffs kaise measure karoge?',
    tags: ['machine-coding', 'practice-first', 'system-design'],
  },
  {
    id: 'iq-machine-circuit-breaker',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-security-operations',
    level: 'Advanced',
    question: 'Machine coding: Circuit breaker state machine implement karo',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nBackend library mein closed/open/half-open breaker banao. 3 consecutive eligible failures open karein, 5-second cooldown, half-open max one probe. Other calls open/half-open mein fast reject hon. Clock aur downstream adapter injectable hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Three sequential failures ke baad fourth call downstream tak na jaaye.\n- Cooldown baad parallel calls mein only one probe run ho.\n- Probe success closes/reset; failure reopens full cooldown; late old completion new state overwrite na kare.',
    answer:
      '**Hint — atakne par padho:** Breaker generation token old in-flight results ko current transition se separate karega.\n\n**Answer guide — attempt ke baad compare karo:** Atomic state snapshot/generation rakho; call admission current generation capture kare. Completion current generation match kare tab counter/transition update ho. Open transition generation increment kare; cooldown par CAS-like probe claim karo. Eligible failure policy business validation errors se separate rakho. Breaker timeout khud work cancel nahi karta; timeout adapter contract separately do.',
    followUp:
      'Sliding-window failure ratio aur minimum traffic threshold se low-volume behavior kaise change hoga?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-consistent-hash',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-scaling-caching',
    level: 'Advanced',
    question: 'Machine coding: Consistent-hashing routing simulator banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nJS/Java simulator mein stable unsigned 32-bit hash adapter, node virtual tokens aur key routing banao. Ring clockwise first token >= key hash choose kare, wrap supported. Token collisions deterministic nodeId/replica-index tie-break se resolve hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Fixed fixtures repeat runs mein same routes dein.\n- One node remove ho toh only us node ke owned key ranges remap hon.\n- Empty ring explicit error; key beyond last token first token par route ho.',
    answer:
      '**Hint — atakne par padho:** Sorted ring aur lower-bound search sufficient hai; real network optional hai.\n\n**Answer guide — attempt ke baad compare karo:** Each virtual token tuple hash,nodeId,replicaIndex sort karo; lookup lower-bound on hash then deterministic tie rules follow kare. Add/remove node tokens rebuild ya ordered structure update kare. 10,000 deterministic keys par before/after movement aur per-node load report karo. Equal perfect balance assert mat karo; hash skew aur virtual-token count influence karte hain.',
    followUp:
      'Replication factor 3 ke liye consecutive virtual nodes same physical owner hon toh selection kaise skip karegi?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-leaderboard-service',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-java-api-data',
    level: 'Advanced',
    question: 'Machine coding: Leaderboard with rank aur tie rules banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nDurable backend prototype mein applyScore(eventId,userId,delta), top(k), rank(userId) do. Score signed integer, ties userId ascending; rank ordinal 1-based. Event identity replay no-op, different payload conflict. Fixture max 1000 users.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A=10,B=10,C=5 se ranks A1,B2,C3 hon.\n- Duplicate +5 event score twice change na kare.\n- Parallel deltas neither lost hon; restart ke baad ranks same hon.',
    answer:
      '**Hint — atakne par padho:** Event dedupe aur score update same transaction mein karo.\n\n**Answer guide — attempt ke baad compare karo:** Unique event record aur atomic score increment durable transaction mein rakho. Top/rank query score DESC,userId ASC use kare; ordinal tie rule document karo. Initial implementation sorted SQL query/array acceptable within bounded fixture, cost report karo. Cache add karoge toh DB commit ke baad invalidation aur freshness boundary define karo.',
    followUp:
      'Millions of users ke liye fast rank aur event replay rebuild ko kaise separate karoge?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-resumable-upload',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'system-design-api-contracts',
    level: 'Advanced',
    question: 'Machine coding: Resumable chunked upload service banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nLocal filesystem/object adapter + durable metadata se startUpload,putChunk(index,checksum,bytes),complete banao. Max file 10MiB, fixed 1MiB chunks except final. Chunk checksum SHA-256 helper allowed. Same index/same checksum retry accepted; different bytes conflict.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Missing chunk par complete fail ho; final file chunk-index order mein assemble ho.\n- Interrupted upload restart ke baad existing chunks reuse kare.\n- Wrong checksum/oversized chunk rejected ho; filename path traversal allowed na ho.',
    answer:
      '**Hint — atakne par padho:** Upload session identity aur chunk manifest durable rakho.\n\n**Answer guide — attempt ke baad compare karo:** Server-generated storage keys use karo, supplied filename ko filesystem path mat banao. Validate expected chunk lengths/checksums aur atomic temporary-write/rename adapter use karo. Manifest unique(uploadId,index) conflict-safe ho. Complete all manifest entries verify karke staged assembly aur finalized state coordinate kare; crash retry same finalized object return kare. Abandoned sessions TTL cleanup separate task ho.',
    followUp:
      'Parallel completion aur cleanup worker race karein toh ownership/lease kaise prevent karegi?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-feature-flags',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-requirements-capacity',
    level: 'Intermediate',
    question: 'Machine coding: Deterministic feature flag evaluator banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nIn-memory flag config mein enabled, allowlistedUserIds aur rolloutPercent 0..100 rakho. evaluate(flagKey,userId) deterministic bucket se bool de. Config immutable snapshots se update ho; unknown flag false. Hash adapter supplied/stable ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Same user/flag repeat calls same result dein without per-call randomness.\n- Rollout 20->40 badhe toh previously included non-allowlisted users excluded na hon.\n- Disabled flag allowlist ko bhi override kare; invalid percent config reject ho.',
    answer:
      '**Hint — atakne par padho:** Fixed bucket threshold monotonic rollout preserve karta hai.\n\n**Answer guide — attempt ke baad compare karo:** Hash(flagKey plus unambiguous userId encoding) ko 0..9999 bucket normalize karo, bucket<percent*100 compare karo. Disabled first, then allowlist, then rollout apply karo. Config validation complete hone par whole snapshot atomically swap karo. Hash version change rollout membership reshuffle kar sakti hai, isliye stable version pin karo. Feature flags authorization ka substitute nahi.',
    followUp:
      'Offline client stale config aur emergency kill switch freshness ke liye kya contract chahiye?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-replication-simulator',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'system-design-consistency-limits',
    level: 'Advanced',
    question: 'Machine coding: Replica lag aur read-your-writes simulator banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nDeterministic simulator mein leader log, two lagging replicas aur logical clock banao. write returns version token; eventualRead replica local value de; readAtLeast(token) lagging replica se leader fallback kare. Network delays fixture queue se drive hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Write v2 after v1, lagging replica eventual read v1 dikha sake.\n- Same replica readAtLeast(v2) v2-or-newer de via fallback.\n- Out-of-order delivery v2 then v1 replica state regress na kare; unreachable leader+lagging replica error de.',
    answer:
      '**Hint — atakne par padho:** Version requirement ko availability tradeoff se explicitly jodo.\n\n**Answer guide — attempt ke baad compare karo:** Append-only ordered log aur per-replica applied version maintain karo. Out-of-order records buffer karke contiguous application karo; alternatively full-state snapshots hon toh monotonic replace contract define karo. Read token version compare kare, sufficient replica choose ya leader consult kare. Network failure par promised consistency weaken karke old success return mat karo. Simulated guarantees clock ticks aur protocol tak limited hain.',
    followUp:
      'Concurrent leaders aur conflicting writes allow karne par scalar version token kyun insufficient ho sakta hai?',
    tags: ['machine-coding', 'stretch-practice', 'system-design'],
  },
  {
    id: 'iq-machine-min-stack',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-linear-structures',
    level: 'Intermediate',
    question: 'Machine coding: Min stack aur two-stack queue implement karo',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nJS/Java mein MinStack push/pop/top/getMin aur Queue enqueue/dequeue/peek do. Empty read/remove null return kare, null elements forbidden. MinStack O(1) operations, Queue amortized O(1) chahiye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Push 3,1,1 then pop once: min still 1 ho.\n- Enqueue A,B; dequeue A; enqueue C: next removals B,C hon.\n- Empty operations stable hon aur interleaved calls structure corrupt na karein.',
    answer:
      '**Hint — atakne par padho:** Duplicate minima aur lazy stack transfer ke invariants likho.\n\n**Answer guide — attempt ke baad compare karo:** MinStack each entry ke saath minimum-so-far rakhe ya count-aware min stack maintain kare. Queue inbox/outbox stacks use kare; outbox empty ho tab inbox transfer karo. Every enqueue element at most once transfer hota hai, isliye amortized cost constant hai; individual dequeue O(n) ho sakta hai. Array.shift implementation complexity hide mat karo.',
    followUp:
      'Worst-case constant latency queue requirement aaye toh amortized design ka limitation kya hai?',
    tags: ['machine-coding', 'practice-first', 'dsa'],
  },
  {
    id: 'iq-machine-running-median',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-heaps',
    level: 'Intermediate',
    question: 'Machine coding: Streaming median tracker banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nFinite integer stream ke liye add(value),median() implement karo. Empty median null; even count central two ka average. Duplicates/negative values supported. Range within safe arithmetic bounds assume aur validate karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 5,1,9,3 insert ke baad medians 5,3,5,4 hon.\n- Repeated equal values heap balance preserve karein.\n- 1000 deterministic inputs har prefix sorted-array oracle se match hon.',
    answer:
      '**Hint — atakne par padho:** Lower half max-heap aur upper half min-heap rakho.\n\n**Answer guide — attempt ke baad compare karo:** Heap sizes at most one differ hon aur lower max<=upper min invariant preserve karo. Add appropriate side mein karke rebalance karo. Odd median larger heap top, even mean of both tops. O(log n) insertion aur O(1) median explain karo; storage O(n). Library heap allowed hai toh comparator correct sign verify karo.',
    followUp:
      'Sliding-window median ke liye lazy deletion aur stale heap tops kaise manage karoge?',
    tags: ['machine-coding', 'practice-first', 'dsa'],
  },
  {
    id: 'iq-machine-interval-calendar',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-greedy-intervals',
    level: 'Intermediate',
    question: 'Machine coding: Non-overlapping interval calendar banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nbook(id,start,end),cancel(id),freeSlots(dayStart,dayEnd) implement karo. Integer minutes, [start,end) intervals, positive duration. Overlap reject, touching endpoints allowed. Accepted bookings day bounds ke andar hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- [60,120) plus [120,150) allowed; [119,121) rejected ho.\n- Day [0,180) ke free slots [0,60),[150,180) hon.\n- Cancel unknown safe; rejected booking ID later valid request mein reuse ho.',
    answer:
      '**Hint — atakne par padho:** Sorted intervals mein predecessor/successor overlap checks enough hain.\n\n**Answer guide — attempt ke baad compare karo:** Start-ordered structure aur ID index rakho. Neighbor end/start compare karke only valid booking insert karo; cancelled entry dono structures se remove ho. Free slots sorted scan with running cursor derive karo. Array representation book O(n) insertion leta hai even binary-search lookup O(log n) ho; total complexity honestly state karo.',
    followUp:
      'At most K simultaneous bookings allow karne par sweep-line counter ya segment tree kaise help karega?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-expression-parser',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-linear-structures',
    level: 'Advanced',
    question: 'Machine coding: Arithmetic expression parser banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nIntegers, whitespace, +,-,*,/, parentheses aur unary minus ka evaluator banao. Division real-number result de; division by zero reject. eval/Function use mat karo. Unsupported characters aur incomplete expressions errors hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 2*(3+4)-5 => 9; -3*-2 => 6.\n- 10/(2-2) explicit error de, Infinity success nahi.\n- 1+ aur unmatched brackets reject hon; whitespace result na badle.',
    answer:
      '**Hint — atakne par padho:** Tokenizer aur operator precedence ko separate karo.\n\n**Answer guide — attempt ke baad compare karo:** Recursive-descent grammar expression->term->unary->primary use karo ya shunting-yard with unary token distinction. Token positions error reporting mein retain karo; parser final end-of-input require kare. Unary minus primary se pehle recursively parse ho. Number parsing bounds aur intermediate finite results validate karo. Regex replacement plus eval grammar/security requirements violate karega.',
    followUp: 'Exponent operator right-associative add karne par -2^2 grammar kaise define karoge?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-grid-pathfinder',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Intermediate',
    question: 'Machine coding: Grid shortest-path engine banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRectangular grid mein open/blocked cells, start aur target se shortest 4-direction path return karo. Each move cost 1; deterministic neighbor order Up,Right,Down,Left. No path null; start=target one-cell path.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 3x3 empty grid opposite corners path 4 moves ho.\n- Blocked target/unreachable grid null de; ragged input reject ho.\n- Returned adjacent cells legal hon aur tie choice deterministic ho.',
    answer:
      '**Hint — atakne par padho:** Visited ko enqueue time mark karo aur predecessor store karo.\n\n**Answer guide — attempt ke baad compare karo:** BFS queue with head index use karo taaki dequeue O(1) ho. Each open cell once enqueue karo aur parent record first visit par set karo. Target milne par parent chain reverse karke path banao. O(rows*cols) time/space worst case. DFS valid path de sakta hai lekin shortest guarantee nahi. Coordinate encoding collisions avoid karo.',
    followUp: 'Weighted terrain add ho toh BFS ki jagah Dijkstra ya 0-1 BFS kab choose karoge?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-union-find',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Intermediate',
    question: 'Machine coding: Dynamic connectivity with union-find banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nN users IDs 0..N-1 ke liye connect(a,b),connected(a,b),componentSize(a),componentCount() do. Only edges add honge; deletion unsupported. Path compression aur union by size implement karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- N=5; connect(0,1),connect(1,2): size(0)=3,count=3.\n- Repeated connect(0,2) count dobara decrement na kare.\n- Invalid ID reject; self connection no-op ho.',
    answer:
      '**Hint — atakne par padho:** Component metadata sirf representative root par authoritative hai.\n\n**Answer guide — attempt ke baad compare karo:** Parent array aur root size initialize karo. find compress path, union unequal roots ko size ke hisaab se attach kare; resulting root size add aur global count one decrement ho. Non-root stale size directly return mat karo. Random small graph BFS oracle se connectivity compare karo. Amortized near-constant bound use karo, strict universal O(1) claim nahi.',
    followUp:
      'Historical snapshots ya rollback queries ke liye path compression policy kaise badlegi?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-fenwick-analytics',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-tries-range-bits',
    level: 'Advanced',
    question: 'Machine coding: Fenwick tree range-sum engine banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nInteger array ke liye add(index,delta),prefixSum(endExclusive),rangeSum(left,rightExclusive) banao. External zero-based indexing, internal one-based allowed. Empty range 0; invalid bounds reject; values safe numeric range mein hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- [2,4,1,3] rangeSum(1,4)=8; add(2,5) ke baad 13.\n- prefixSum(0)=0 aur full prefix updated total de.\n- Seeded random updates/queries naive array oracle se match hon.',
    answer:
      '**Hint — atakne par padho:** Inclusive internal prefix ko external half-open API se carefully translate karo.\n\n**Answer guide — attempt ke baad compare karo:** Update index+1 se start karke i+=i&-i ancestors update karo. Prefix external end index se i-=i&-i accumulate karo; range prefix(right)-prefix(left) hai. Build repeated add O(n log n) acceptable, optimized build explain optional. Zero internal index update infinite loop de sakta hai, boundary validation essential hai.',
    followUp:
      'Range add aur point query ya range minimum ke liye same structure kaise change hoga?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-coin-change',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-dynamic-programming',
    level: 'Intermediate',
    question: 'Machine coding: Coin-change solver with reconstruction banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nPositive distinct coin denominations aur nonnegative integer amount se minimum coin count plus chosen coins return karo. Unlimited supply. Impossible null, amount 0 count0/empty. Equal optimal choices mein smaller final coin prefer karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Coins [1,3,4], amount6 => count2, coins 3+3.\n- Coins [4,6], amount5 => null.\n- Reconstructed coins ka sum target aur length minimum count ho.',
    answer:
      '**Hint — atakne par padho:** DP count ke saath chosen predecessor coin store karo.\n\n**Answer guide — attempt ke baad compare karo:** dp[0]=0, baaki infinity rakho; each amount par valid coins evaluate karo. Better count ya equal count/smaller final coin par choice update karo. Target reachable ho toh amount se chosen coin repeatedly subtract karke reconstruct karo. O(amount*coins) time aur O(amount) memory explain karo; greedy 4+1+1 counterexample minimum nahi.',
    followUp:
      'Bounded coin supply aur huge target amounts ke liye recurrence/resource limits kaise badlenge?',
    tags: ['machine-coding', 'stretch-practice', 'dsa'],
  },
  {
    id: 'iq-machine-middleware-pipeline',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-express-rest-errors',
    level: 'Intermediate',
    question: 'Machine coding: Async middleware pipeline implement karo',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nPlain Node mein compose(middlewares)(context) banao; each middleware async (ctx,next). Onion order support ho, next() max once per middleware. Middleware next na call kare toh short-circuit. Error caller tak propagate ho; Express use nahi.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A-before,B-before,B-after,A-after order verify ho.\n- Same middleware next twice call kare toh clear rejection ho.\n- Inner rejection upstream try/catch se handle ho; empty pipeline resolves.',
    answer:
      '**Hint — atakne par padho:** Dispatch index monotonic rakho aur returned promises await karo.\n\n**Answer guide — attempt ke baad compare karo:** Dispatch(i) next function ko dispatch(i+1) return kare; last dispatched index guard repeated next reject kare. Promise.resolve boundary sync throws ko rejection mein normalize kare. Middleware contract next await/return karne ka ho, warna parent completion prematurely resolve ho sakti hai. Context mutations intentional shared request state hain; across invocations context reuse mat karo.',
    followUp: 'Cancellation aur per-middleware timing add karne par finally blocks kahan lagenge?',
    tags: ['machine-coding', 'practice-first', 'node'],
  },
  {
    id: 'iq-machine-graceful-server',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongodb-testing-shutdown',
    level: 'Advanced',
    question: 'Machine coding: Graceful shutdown HTTP server banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode HTTP server mein /ready aur delayed /work endpoints banao. SIGTERM/shutdown call readiness false kare, new work reject kare, in-flight work max 2s drain kare, phir resources close hon. Inject shutdown trigger tests mein, real process kill required nahi.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 500ms existing request shutdown ke baad complete ho sake.\n- New request after shutdown rejected ya connection refused ho.\n- Hung request deadline par terminate ho; repeated shutdown resource close twice na kare.',
    answer:
      '**Hint — atakne par padho:** Shutdown ko idempotent shared promise aur deadline se model karo.\n\n**Answer guide — attempt ke baad compare karo:** Draining flag pehle set karo, server accepting stop karo aur in-flight counter/connection set track karo. Ready endpoint aur new accepted work flag consult karein. Deadline pending sockets/resources force close kare; DB adapter in-flight work ke drain ke baad close ho. Finally timers/listeners cleanup karo. Only process.exit immediately calling successful writes truncate kar sakta hai.',
    followUp:
      'Keep-alive connections aur background jobs ko same drain budget mein kaise include karoge?',
    tags: ['machine-coding', 'practice-first', 'node'],
  },
  {
    id: 'iq-machine-sse-notifications',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Advanced',
    question: 'Machine coding: Server-sent event notifications endpoint banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode HTTP mein SSE endpoint aur fake event source banao. Events IDs increasing, last 100 in-memory replay buffer, Last-Event-ID resume. Older-than-buffer ID par explicit reset event do. Heartbeats aur disconnect cleanup required.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Reconnect lastID=7 par only newer buffered events aayein.\n- Two concurrent clients independent receive karein; disconnect listener count restore kare.\n- Slow writable per-client buffer bound exceed kare toh connection close ho, memory grow na kare.',
    answer:
      '**Hint — atakne par padho:** Event framing aur subscriber lifecycle ko one cleanup path do.\n\n**Answer guide — attempt ke baad compare karo:** SSE fields newline framing se encode karo, multiline data each line prefix ho. Connection register aur replay watermark coordination gap avoid kare. Heartbeat timer, listener aur pending buffer cleanup close/error par idempotently karo. write backpressure respect karo; bounded buffer overflow documented reconnect/reset policy trigger kare. In-memory history restart durable replay guarantee nahi deta.',
    followUp:
      'Multiple Node instances par replay ordering aur fan-out kis shared component ko doge?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-multipart-upload',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-production-integrations',
    level: 'Advanced',
    question: 'Machine coding: Bounded file upload endpoint banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode/Express multipart upload parser adapter use karke one file max 2MiB accept karo. Stream to temporary storage with generated filename; success metadata ID/size return kare. Allowed type fixture text/plain only; malware scanning scope ke bahar.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Oversized stream reject ho aur partial temporary file cleanup ho.\n- Client disconnect parser/storage resources close kare.\n- ../../name.txt storage path escape na kare; two uploads same name collide na hon.',
    answer:
      '**Hint — atakne par padho:** Byte limit streaming path mein enforce karo, final file size check alone late hai.\n\n**Answer guide — attempt ke baad compare karo:** Multipart parser configured field/file/count/byte limits se use karo; body ko whole buffer mat banao. Server-generated IDs/path aur exclusive temp creation rakho. Parser errors/abort/storage failure one cleanup routine invoke karein. Success only flushed/closed stored object ke baad report ho. Client MIME/name trusted content proof nahi; drill type policy limited hai.',
    followUp:
      'Object storage direct uploads mein finalize validation aur abandoned object cleanup kaise chalega?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-worker-pool',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Advanced',
    question: 'Machine coding: CPU job worker-thread pool banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode worker_threads pool with 2 workers aur max waiting queue 5 banao. Job is countPrimes(n), n validated <=100000. submit promise result de; queue full explicit busy error. Worker crash current job reject kare aur replacement spawn ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Long CPU work ke dauraan main-thread health request responsive rahe.\n- Eight simultaneous jobs: two active, five waiting, eighth busy ho.\n- Worker termination pending promise settle kare, next job replacement par chale.',
    answer:
      '**Hint — atakne par padho:** Job ownership worker ID aur request ID se bind karo.\n\n**Answer guide — attempt ke baad compare karo:** Idle workers queue, waiting jobs aur in-flight ownership map rakho. Dispatch par unique ID bhejo; response only matching job settle kare. Exit/error handler current job reject aur worker replace kare; duplicate error/exit events double settlement/refill na karein. Shutdown new submissions reject kare aur chosen drain/cancel policy follow kare. Unbounded worker per request CPU/memory exhaust karega.',
    followUp:
      'Timeout par synchronous CPU job ko truly cancel karne ke liye worker lifecycle kaise change hogi?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-http-client-adapter',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Advanced',
    question: 'Machine coding: Resilient outbound HTTP client wrapper banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nInjected fetch adapter se JSON client banao. 500ms per-attempt timeout, max2 attempts; only GET network errors/503 retry. POST auto-retry forbidden. Body maximum 64KiB via bounded reader, non-JSON response controlled error. Fake adapter tests use karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- GET 503 then 200: two attempts; POST503: one.\n- Headers fast/body hung still timeout ho; oversized body abort ho.\n- Caller abort while waiting future attempt roke; timers/listeners cleanup hon.',
    answer:
      '**Hint — atakne par padho:** Timeout scope response body read tak cover kare.\n\n**Answer guide — attempt ke baad compare karo:** Per-attempt abort controller ko caller signal se coordinate karo aur timer finally clear karo. Status handling se pehle bounded body consumption/cancellation policy rakho; JSON parse failures retryable network error se separate hon. Retry loop method/status allowlist consult kare. Headers milte hi timer clear karna hung body ko unlimited time dega. Request credentials/error logging redact karo.',
    followUp:
      'Global total deadline aur per-attempt timeout dono hon toh remaining budget kaise propagate karoge?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-request-coalescer',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Intermediate',
    question: 'Machine coding: Same-key request coalescer banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode service mein coalesce(key,load) sirf in-flight calls share kare; settled response cache nahi hota. Each caller apna AbortSignal de sakta hai; one caller abort others ka result cancel na kare. All subscribers gone ho toh underlying cooperative load abort ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Two same-key clients one load start karein.\n- A abort, B alive: B success receive kare.\n- All abort then new caller aaye toh fresh load start ho; old finalizer new entry na remove kare.',
    answer:
      '**Hint — atakne par padho:** Shared load lifetime aur individual waiter promises separate hain.\n\n**Answer guide — attempt ke baad compare karo:** Entry mein controller, unique token aur active subscribers store karo. Per-waiter abort listener sirf own promise reject/remove kare; last waiter par entry retire karke load abort karo. Completion matching entry token par registry cleanup kare aur active waiters settle kare. Load rejection handled ho even zero subscribers bach gaye hon. Settled cache intentionally absent hai.',
    followUp:
      'Per-tenant keys aur maximum in-flight entries se memory/isolation kaise bound karoge?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-local-cli',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Intermediate',
    question: 'Machine coding: Node CLI task tracker with atomic file save banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode CLI add/list/done/remove commands se JSON file task store banao. Stable IDs, nonblank title aur useful exit codes chahiye. Single process at a time scope; filesystem adapter tests use karo. Missing file empty store, corrupt file error aur no overwrite.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Add two same-title tasks distinct IDs de; done only supplied ID update kare.\n- Failed write old valid store preserve kare.\n- Unknown command/ID nonzero exit ho, malformed JSON silently reset na ho.',
    answer:
      '**Hint — atakne par padho:** Parse/validate/compute/save steps separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Arguments explicit parser se read karo; persisted schema/version validate karo. Next state calculate karke same-directory temporary file write/flush/close aur atomic rename adapter use karo. Error par temp cleanup aur old file preserve ho. Parent directory/path config resolve karo; shell command construction ki zaroorat nahi. Concurrent process safety assumption document karo.',
    followUp: 'Two simultaneous CLI processes support karne par lost updates kaise prevent karoge?',
    tags: ['machine-coding', 'stretch-practice', 'node'],
  },
  {
    id: 'iq-machine-tenant-crud',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-auth-security',
    level: 'Advanced',
    question: 'Machine coding: Tenant-isolated MongoDB notes repository banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nNode + MongoDB notes {tenantId,ownerId,title} repository banao. Trusted context supplied hai; every CRUD operation tenant-scoped aur owner-scoped ho. Admin context tenant ke all owners read kar sakta hai, cross-tenant nahi.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Other tenant ObjectId known ho tab bhi read/update/delete 404 ho.\n- Body tenantId/ownerId escalation reject ya ignore ho.\n- Admin A tenant B data list na kare; malformed ObjectId controlled 400 ho.',
    answer:
      '**Hint — atakne par padho:** Authorization scope repository query construction ka invariant banao.\n\n**Answer guide — attempt ke baad compare karo:** Context se tenant aur role derive karke allowlisted filter build karo; client filter raw spread mat karo. User mode owner predicate include kare; admin mode only owner relax kare. Updates business fields allowlist karein aur matched count missing/forbidden response decide kare. Index tenant/owner access path ke hisaab se do. Route happy-path test alone hidden delete path leak catch nahi karega.',
    followUp:
      'Background jobs ke trusted tenant context ko accidental global query se kaise protect karoge?',
    tags: ['machine-coding', 'practice-first', 'mongodb'],
  },
  {
    id: 'iq-machine-optimistic-profile',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-mongoose-validation-relations',
    level: 'Advanced',
    question: 'Machine coding: MongoDB profile editor with version checks banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nProfiles {userId,displayName,version} mein update(userId,expectedVersion,changes) banao. Display name nonblank max80. Query matches userId+version, update increments version. Missing profile404, stale version409; request payload protected fields change na kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Version1 se two concurrent edits one success/version2 aur one conflict dein.\n- Invalid name version increment na kare.\n- Payload $set/version/userId injection original identity na change kare.',
    answer:
      '**Hint — atakne par padho:** Version compare database update predicate mein hona chahiye.\n\n**Answer guide — attempt ke baad compare karo:** Validated DTO se explicit $set aur $inc build karo; client update operators forward mat karo. Matched count zero par scoped existence read se missing versus stale decide karo, response current version optional ho. Atomic findOneAndUpdate return policy explicit rakho. Mongoose validation assumptions ke bajay service boundary rules aur real DB race test do.',
    followUp:
      'Nested address partial updates mein omitted field aur explicit null ka contract kya hoga?',
    tags: ['machine-coding', 'practice-first', 'mongodb'],
  },
  {
    id: 'iq-machine-lookup-report',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-indexes-aggregation-transactions',
    level: 'Intermediate',
    question: 'Machine coding: Orders with customer lookup aur missing references banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nOrders {tenantId,customerId,totalPaise} aur customers {tenantId,_id,name} se tenant report banao. Each order once return ho, missing customer name Unknown ho. Lookup tenant mismatch ko missing treat kare; totals preserve hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Dangling customer reference se order drop na ho.\n- Other-tenant customer ID reference uska name expose na kare.\n- Two orders same customer report mein still two rows hon, accidental cartesian multiplication nahi.',
    answer:
      '**Hint — atakne par padho:** Left-join semantics aur tenant predicate dono lookup mein rakho.\n\n**Answer guide — attempt ke baad compare karo:** Initial tenant match ke baad correlated lookup customer ID plus tenant equality kare. Result at most one customer expect karo; unwind preserveNullAndEmptyArrays ya first-element fallback use karo. Projection explicit fields choose kare. Reference validation write time useful hai, lekin deleted/corrupt refs read path par still handle karne hain. Explain plan se lookup index use inspect karo.',
    followUp:
      'Customer name historical order-time snapshot chahiye toh lookup model kaise badlega?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-bulk-upsert',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-documents-crud-modeling',
    level: 'Advanced',
    question: 'Machine coding: Idempotent catalog bulk upsert banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nNode/MongoDB mein tenant catalog import list {sku,name,pricePaise} accept karo. Unique(tenantId,sku), max1000 rows; duplicates within batch invalid whole request. Valid rows independently upsert hon; response per-row success/error de. Replaying same batch same final catalog de.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Existing SKU update ho, new SKU create ho; other tenant unaffected ho.\n- One injected database row failure remaining valid writes ko process karne de.\n- Duplicate input SKU validation se before-write reject ho; negative price row error de.',
    answer:
      '**Hint — atakne par padho:** Input duplicate policy aur database partial failure policy alag define karo.\n\n**Answer guide — attempt ke baad compare karo:** Batch schema/duplicate keys pehle check karo. Per-row business validation aur bounded bulkWrite upsert operations explicit tenant+sku filters se banao. Unique compound index race protection de. Ordered false execution ka partial result original row indexes se map karo. Retry failed subset possible hai; response unknown outcomes ko verified success mat bolo.',
    followUp:
      'Import old feed newer catalog overwrite na kare isliye sourceVersion condition kaise add karoge?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-retention-sessions',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-auth-security',
    level: 'Intermediate',
    question: 'Machine coding: Expiring session store with deterministic checks banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nMongoDB session store create/get/revoke banao. Random opaque token caller ko mile, store only token hash/userId/expiresAt. Inject clock aur hash/token factory tests mein. TTL index cleanup optional delayed housekeeping hai; get expiry application mein enforce kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- now==expiresAt par get rejected ho even row exists.\n- Revoke then get fail; raw token DB record/log mein absent ho.\n- Different tokens same user independent revoke hon; invalid token safe miss ho.',
    answer:
      '**Hint — atakne par padho:** Physical deletion time ko authentication validity boundary mat banao.\n\n**Answer guide — attempt ke baad compare karo:** Cryptographic token adapter se secret generate aur digest store karo, unique digest index ho. Lookup digest ke saath expiresAt>now condition require kare. Revoke matching digest delete kare. TTL deletion eventual cleanup hai, exact expiration guarantee application check own kare. Response mein generic invalid/expired outcome do, token details leak mat karo.',
    followUp:
      'Password reset ke baad all sessions revoke karne ke liye user token-version ya bulk revocation ka tradeoff kya hai?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-materialized-summary',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-indexes-aggregation-transactions',
    level: 'Advanced',
    question: 'Machine coding: Rebuildable daily sales summary banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nMongoDB replica set par paid-event source aur daily summaries {tenantId,day,revenuePaise,count} banao. UTC day; apply event once via event ID inbox and summary increment in transaction. Full rebuild source events se separate summary collection produce kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Duplicate event count/revenue twice increment na kare.\n- Summary write failure inbox insert bhi rollback kare.\n- Fixture rebuild aur incremental summary same totals dein; tenant/day boundaries correct hon.',
    answer:
      '**Hint — atakne par padho:** Source events authoritative hain, summary derived projection hai.\n\n**Answer guide — attempt ke baad compare karo:** Unique processed-event identity aur compound summary key indexes banao. One transaction inbox dedupe, summary upsert/$inc aur completion coordinate kare. Rebuild immutable source snapshot/cutoff se aggregate karo; concurrently arriving events ko watermark/replay strategy ke bina new summary swap mat karo. Compare counts/totals fixture oracle se karo, random current date use na karo.',
    followUp:
      'Refund/correction event late previous day ke liye aaye toh projection aur rebuild semantics kya honge?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-schema-backfill',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongo-documents-crud-modeling',
    level: 'Advanced',
    question: 'Machine coding: Restartable MongoDB schema backfill banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nOld users {fullName} mein displayName/schemaVersion=2 backfill job banao. _id ascending batches100, durable checkpoint. Existing version2 records unchanged; missing/blank fullName errors report hon. New writes already v2 banate hain; _id below checkpoint new insertion scope ke bahar hai.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Crash after committed batch restart remaining old records process kare.\n- Parallel user update sets v2 displayName; backfill usko overwrite na kare.\n- Rerun idempotent ho; invalid old records reported hon aur job infinite retry na kare.',
    answer:
      '**Hint — atakne par padho:** Checkpoint progress aur conditional document update ki roles alag hain.\n\n**Answer guide — attempt ke baad compare karo:** Batch scan checkpoint se aage karo; update filter _id plus old schemaVersion condition rakho. Derive value source fullName snapshot se tabhi write karo jab source field still same ho, warna conflict retry/report karo. Each batch outcomes durable karke checkpoint advance karo; crash before checkpoint may repeat conditional no-ops safely. Final residual scan/manual report missed unsupported records expose kare.',
    followUp:
      'Writers migration ke dauraan old schema bhi create karein toh dual-write aur verification phases kaise add karoge?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-change-stream',
    track: 'mongodb',
    topic: 'mongodb',
    noteId: 'mongodb-testing-shutdown',
    level: 'Advanced',
    question: 'Machine coding: Resumable MongoDB change-stream consumer banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nReplica-set fixture ke orders collection changes consume karke durable audit sink banao. Resume token checkpoint ho; sink insertion and checkpoint atomic via transaction. Sink unique event token identity use kare. Invalid/expired resume token explicit resync-required state de.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Sink commit ke baad process restart event duplicate audit na banaye.\n- Sink failure checkpoint advance na kare.\n- Shutdown stream cursor/session close kare; invalid token silently from-now start na kare.',
    answer:
      '**Hint — atakne par padho:** Event effect aur resume progress ek durability boundary mein chahiye.\n\n**Answer guide — attempt ke baad compare karo:** Stream event token losslessly serialize/store karo. Transaction mein unique audit record aur checkpoint upsert commit karo; restart persisted token se resume kare. Replay duplicate key ko known completed outcome se reconcile karo. Audit collection watch scope se exclude ho warna feedback loop banega. Event document availability configuration-dependent hai, drill required fields envelope se derive kare.',
    followUp:
      'Resume history expire ho jaaye toh snapshot plus stream handoff mein gap kaise avoid karoge?',
    tags: ['machine-coding', 'stretch-practice', 'mongodb'],
  },
  {
    id: 'iq-machine-tabs-widget',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Keyboard-accessible tabs widget banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nPlain HTML/JS mein 3 tabs/panels banao. Arrow Left/Right wrap, Home/End, manual activation Enter/Space. Focused tab aur selected tab distinct ho sakte hain. Tab key selected/focused tab stop se panel content tak jaaye.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Arrow focus shift kare lekin panel Enter tak change na ho.\n- Exactly one tab tabIndex0 ho; selected panel hi visible ho.\n- Every tab/panel ID association valid aur hidden panel controls untabbable hon.',
    answer:
      '**Hint — atakne par padho:** Roving focus index aur active panel index separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Tablist/tab/tabpanel semantics aur aria-selected/controls/labelledby IDs connect karo. Arrow event focus index update kare aur correct element focus ho, activation selected index change kare. Hidden attribute inactive content ko remove from interaction kare. Event delegation target actual tab button tak constrain karo. Sirf visual class active badalna complete keyboard widget nahi.',
    followUp: 'Dynamic selected tab delete hone par focus aur selection fallback kya hoga?',
    tags: ['machine-coding', 'practice-first', 'html'],
  },
  {
    id: 'iq-machine-accordion',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Multi-section accordion with URL deep links banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nHTML/JS FAQ accordion banao; multiple sections open reh sakte hain. Heading buttons aria-expanded reflect karein. Hash #faq-ID initial load aur hashchange par target section open/focus kare; unknown hash ignore. User collapse hash history mutate na kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Enter/Space section toggle kare aur hidden links tabbable na hon.\n- Direct hash load correct section open kare; duplicate titles IDs collide na karein.\n- Hashchange unknown target crash na kare; focus heading button par aaye.',
    answer:
      '**Hint — atakne par padho:** URL identifier stable data ID hai, heading text nahi.\n\n**Answer guide — attempt ke baad compare karo:** Heading ke andar real button aur aria-controls se panel connect karo. Open ID set maintain karo; hidden panel state synchronize karo. Hash ko known ID map se resolve karo, arbitrary selector interpolation avoid karo. Initial browser scroll aur focus handling coordinate karo. Listener cleanup component destroy par do; content re-render unnecessarily focused node replace na kare.',
    followUp:
      'Single-open accordion mode add karoge toh deep link aur manual collapse rules kaise differ karenge?',
    tags: ['machine-coding', 'practice-first', 'html'],
  },
  {
    id: 'iq-machine-upload-preview',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Accessible file picker with image previews banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/JS file picker mein max5 JPEG/PNG files, each <=2MiB accept karo. Preview, remove, duplicate file metadata(name,size,lastModified) rejection aur validation summary do. Upload backend nahi. Object URLs use karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Sixth accepted file reject ho; invalid file reason visible ho.\n- Remove/reset/destroy par matching object URLs revoke hon.\n- Same removed file select again possible ho; keyboard controls labeled hon.',
    answer:
      '**Hint — atakne par padho:** File input value aur accepted file list alag lifecycle rakhte hain.\n\n**Answer guide — attempt ke baad compare karo:** Input change par files validate karke stable local IDs aur object URLs create karo; invalid files ke URLs mat banao. Remove par revoke aur focus neighboring remove/add control par move karo. Input reset se same file reselection event allow karo. MIME/extension client checks server security validation replace nahi karti. Preview image decode failure bhi user-visible state ho.',
    followUp:
      'Drag-and-drop add karne par keyboard equivalent aur directory drops ka contract kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-sortable-table',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Semantic HTML sortable table banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/vanilla JS mein name,age,joinedDate columns ki 20-row table banao. Header buttons toggle ascending/descending; null age/date always last. Dates ISO YYYY-MM-DD, equal values original input order maintain karein.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Age numbers numeric sort hon: 2 before 10.\n- Null last both directions, active header aria-sort correct ho.\n- Sort ke baad clicked header focus preserve ho; row header relationships valid hon.',
    answer:
      '**Hint — atakne par padho:** Data comparison aur DOM semantics independent layers hain.\n\n**Answer guide — attempt ke baad compare karo:** Column-specific comparators use karo; null ordering branch direction multiplier se pehle handle karo. Tie original index se break karo. Only tbody rows reorder karo taaki heading focus stable rahe. Caption, th scopes aur header button names meaningful hon. Sort status concise announce karo; every cell live region banana noise create karega.',
    followUp: 'Locale date display ko sort value se separate kyun rakhoge?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-focus-error-summary',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Long form with linked error summary banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/JS application form mein name,email,age,city fields banao. Submit par all errors summary mein links ke saath dikhaye; summary focus ho. User error link activate kare toh target field focus. Age integer18..100; valid submit fake adapter ko bhejo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Three invalid fields se three linked summary items aur inline messages hon.\n- Correction/resubmit par resolved errors disappear, remaining links valid rahein.\n- Pending submit repeat na ho; server rejection values preserve kare.',
    answer:
      '**Hint — atakne par padho:** Error object by field ID se summary aur inline view derive karo.\n\n**Answer guide — attempt ke baad compare karo:** Pure validation function field-keyed errors return kare. Submit invalid ho toh stable summary container tabindex -1 par focus bhejo; links field IDs target karein. aria-invalid aur describedby messages update karo. Native/custom validation coordination explicit rakho taaki browser popup aur summary conflicting focus na dein. Errors every keystroke announce karna unnecessary distraction hai.',
    followUp: 'Server unknown field error ko global summary mein kaise display karoge?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-accessible-carousel',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Accessible manual image carousel banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/JS carousel mein 5 slides, Previous/Next aur numbered selectors do. Autoplay nahi. Ends wrap; active slide position announce ho. Non-active slide links focusable na hon; images meaningful alt text ya decorative empty alt use karein.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Slide5 Next slide1 dikhaye; selector3 slide3 activate kare.\n- Keyboard controls operate hon aur focus clicked navigation par rahe.\n- Single-slide fixture controls disable/hide sensibly kare; empty fixture message ho.',
    answer:
      '**Hint — atakne par padho:** Slide visibility aur focusable descendant lifecycle synchronize karo.\n\n**Answer guide — attempt ke baad compare karo:** Active index sole navigation state rakho, normalized modulo movement use karo. Hidden slides ko hidden attribute se interaction se remove karo. Live status only change par Slide N of M announce kare. Controls real buttons hon, selector current state accessible ho. Image load failure fallback preserve kare. Visual transform offscreen karna alone tabbability nahi rokta.',
    followUp:
      'Optional autoplay add karoge toh pause-on-focus, reduced motion aur explicit stop control kaise doge?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-search-highlight',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Safe article search and text highlighting banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nPlain article paragraphs mein case-insensitive literal substring search banao. Match count, next/previous occurrence navigation aur clear do. Query regex syntax nahi; existing links/emphasis preserve hon. Search original text nodes par ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Query .* literal text match kare, regex wildcard nahi.\n- Repeated search nested mark elements na banaye; Clear original content restore kare.\n- Matched user text HTML execute na kare; navigation current match announce kare.',
    answer:
      '**Hint — atakne par padho:** Text-node traversal aur safe node splitting use karo.\n\n**Answer guide — attempt ke baad compare karo:** Original DOM/text-node baseline ya mark-unwrapping plus normalize routine maintain karo. TreeWalker-style traversal scripts/styles/controls exclude kare; match offsets text ke andar compute karo aur text/mark nodes create karo. innerHTML string replacement existing markup tod sakta hai. This drill node-boundary-spanning matches support nahi karta; limitation prompt/demo mein clear karo.',
    followUp:
      'Text spanning emphasized nodes ko match karne ke liye global offset-to-node map kaise banega?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-responsive-nav',
    track: 'javascript',
    topic: 'html',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'Machine coding: Accessible mobile navigation disclosure banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/CSS/JS site nav mein small-screen toggle aur wide-screen always-visible links do. Yeh normal navigation disclosure hai, application menu role nahi. Escape small-screen nav close kare aur trigger focus restore kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Toggle aria-expanded visibility se match kare.\n- Hidden mobile links Tab se reachable na hon; wide layout links visible hon.\n- Small->wide->small resize stale invisible focus trap na banaye.',
    answer:
      '**Hint — atakne par padho:** Viewport-derived presentation aur user open state separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Nav landmark, real anchor links aur toggle button aria-controls use karo. Small layout hidden state apply kare; wide layout visibility force true aur toggle hidden ho. Resize par focus disappearing element mein ho toh sensible target move karo. Escape listener only open small disclosure par act kare. Menu role without arrow-key contract use mat karo.',
    followUp:
      'Current-page indication aur nested disclosure groups ka focus behavior kaise extend karoge?',
    tags: ['machine-coding', 'stretch-practice', 'html'],
  },
  {
    id: 'iq-machine-holy-grail',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Holy-grail application shell banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nHTML/CSS app shell mein header/footer, left nav, main aur right context panel banao. Desktop main flexible aur sidebars fixed preferred width hon; <900px context below main, <600px nav above main. Short content par footer viewport bottom ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- 320px,800px,1440px par intended order aur no page overflow ho.\n- Tall main content footer ko overlap na kare.\n- Long unbroken link wrap kare aur focus ring clipped na ho.',
    answer:
      '**Hint — atakne par padho:** Grid areas aur minmax(0,1fr) se flexible middle define karo.\n\n**Answer guide — attempt ke baad compare karo:** Min-height viewport shell aur rows auto/1fr/auto use karo, fixed height se content crop mat karo. Media queries areas rewrite karein while DOM reading order coherent rahe. Sidebars large layout mein bounded columns hon; main min-width0 aur wrapping rule le. Footer normal document flow mein rahe. Absolute-position footer long content overlap karega.',
    followUp:
      'Mobile browser dynamic viewport height aur sticky header ke liye shell sizing kaise test karoge?',
    tags: ['machine-coding', 'practice-first', 'css'],
  },
  {
    id: 'iq-machine-responsive-gallery',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Responsive image gallery without layout shift banao',
    minutes: 45,
    priority: 'P1',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nCSS grid gallery mein 12 images, aspect-ratio 4/3 cards aur captions banao. Small width one column, 600px two, 1000px four columns. Image slow load par card geometry reserved ho; missing image placeholder same ratio rakhe.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Before/after image load card positions stable hon.\n- Different intrinsic image ratios consistent thumbnail box fill karein.\n- Long captions row alignment na tod dein; 200% zoom usable ho.',
    answer:
      '**Hint — atakne par padho:** Intrinsic media dimensions aur layout box dimensions independently control karo.\n\n**Answer guide — attempt ke baad compare karo:** Width-constrained wrapper with aspect-ratio reserve karo; img width/height100% aur object-fit policy choose karo. CSS grid gap aur responsive column counts explicit hon. Captions normal flow mein wrapping karein, forced fixed card height content clip na kare. Alt text accessible rahe; decorative placeholder meaning convey karne ka only source na ho.',
    followUp:
      'Art-directed mobile crops aur high-density image selection HTML markup mein kaise support karoge?',
    tags: ['machine-coding', 'practice-first', 'css'],
  },
  {
    id: 'iq-machine-tooltip-popover',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Focus-aware CSS tooltip banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/CSS plus tiny Escape handler se icon-button tooltip banao. Hover aur keyboard focus par visible, Escape dismiss while focused. Tooltip informational text only; interactive controls tooltip ke andar nahi. Near-edge clipping avoid karne ke liye bounded demo placements do.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Keyboard focus tooltip show kare, accessible button name tooltip par depend na kare.\n- Pointer tooltip tak move ho toh content instantly disappear na ho.\n- Escape dismiss kare; focus leave/re-enter next time show kare.',
    answer:
      '**Hint — atakne par padho:** Trigger aur tooltip ka shared hover region aur dismissal state chahiye.\n\n**Answer guide — attempt ke baad compare karo:** Positioned wrapper mein hover/focus-within visibility rakho, tooltip ID describedby relationship provide kare. Escape dismissed flag selector override kare; re-entry lifecycle reset ho. Trigger accessible name independently define karo. z-index overflow clipping ancestor ko bypass nahi karta; bounded placements ya portal/positioning adapter ki limitation clear rakho.',
    followUp: 'Interactive popover ke liye tooltip se alag focus/role contract kyun chahiye?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-skeleton-loading',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Skeleton and empty/error state layout banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nProduct list ke loading/success/empty/error states CSS se style karo; tiny JS fixture state switch kare. Loading skeleton final card dimensions reserve kare, reduced motion par shimmer disable ho. Retry real button ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Loading->success layout geometry mostly stable rahe, invisible duplicate content na ho.\n- Reduced-motion simulation animation stop kare.\n- Empty/error states readable headings aur retry focus visibility dein.',
    answer:
      '**Hint — atakne par padho:** Shared structural styles aur decorative skeleton markup separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Card layout shared dimensions use kare, skeleton content aria-hidden rakho aur one loading status communicate karo. Error state text actual reason category explain kare bina stack trace. Container busy state pending lifecycle se match ho. CSS animation compositor-friendly properties tak rakho where possible; reduced motion query override add karo. Loading indefinite ho toh failure/retry flow demonstrate karo.',
    followUp: 'Slow network par skeleton ke bajay stale data show karna kab better hoga?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-print-invoice',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Print-friendly invoice layout banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML invoice screen/print CSS banao. Header, customer details, 60 line items, totals aur print button ho. Print view A4/Letter dono par usable, buttons/nav hidden; totals label/value together rahein. Browser print preview verify karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Long invoice multiple pages par text clip na kare.\n- Table column headings page breaks par supported browser mein repeat hon.\n- Dark theme screen background print mein ink-heavy black sheet na banaye.',
    answer:
      '**Hint — atakne par padho:** Print media ka flow screen fixed-height layout se separate rakho.\n\n**Answer guide — attempt ke baad compare karo:** Print media query backgrounds/colors/overflow/fixed positioning reset kare. Semantic table header group preserve karo; row/totals break-inside constraints use karo, overlong content ke liye graceful breaks allow karo. Page margins choose karke actual print preview inspect karo; browser pagination differences acknowledge karo. Price columns right align aur readable units/currency rakho.',
    followUp: 'PDF pixel-exact output chahiye toh browser print CSS ki limits kya hain?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-responsive-form',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Responsive form with resilient labels and errors banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nCSS form mein 8 labeled inputs, helper text, inline errors aur action row style karo. >=800px two columns, below one. Labels variable length; error text 3 lines ho sakta hai. Visual order DOM order follow kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Long error adjacent input ko overlap na kare.\n- 320px par inputs/button row overflow na kare.\n- Focus/disabled/invalid states color ke bina bhi distinguishable hon.',
    answer:
      '**Hint — atakne par padho:** Fixed field heights ki jagah content-driven grid rows use karo.\n\n**Answer guide — attempt ke baad compare karo:** Field wrapper label/control/help/error normal flow mein rakho. Form grid minmax0 tracks aur controls max-width100% use kare. Buttons wrap karein; primary action reading order consistent ho. Error icon/text aur border cues add karo, only red color nahi. Placeholder ko label replacement mat banao; zoom/long translated text fixtures inspect karo.',
    followUp: 'Optional field collapse/expand par layout movement aur focus preserve kaise karoge?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-reduced-motion-spinner',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: Progress indicators with reduced motion banao',
    minutes: 45,
    priority: 'P2',
    promptCode:
      '**Timebox:** 45 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nCSS determinate progress bar aur indeterminate spinner style karo. Tiny JS progress 0..100 update kare; indeterminate operation done/error states bhi ho. Reduced motion static alternative ho, no essential information animation-only ho.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Values below0/above100 clamp hon aur progress label actual value se match kare.\n- Reduced-motion mode spinner moving na ho lekin loading text dikhe.\n- Done/error transition background animation/timer continue na kare.',
    answer:
      '**Hint — atakne par padho:** Status semantics aur decorative movement alag responsibilities hain.\n\n**Answer guide — attempt ke baad compare karo:** Native progress element ya complete progressbar semantics choose karo; determinate current/min/max expose karo. Indeterminate value omit karke status text do. CSS animation reduced-motion query se disable karo; success/error mein active class remove ho. Progress frequency throttle announce karo taaki screen reader har frame na bole. JS demo timer cleanup mandatory hai.',
    followUp:
      'Unknown-size upload progress ko fake percentage dene ke bajay kaise communicate karoge?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-logical-layout',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Machine coding: RTL-ready card and navigation layout banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nHTML/CSS user card, horizontal nav aur settings form ko dir=ltr/rtl toggle ke saath banao. Spacing/alignment logical properties se ho; phone number/code snippets direction-preserved hon. Mixed Hindi/English/Arabic fixture text use karo.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Direction switch leading avatar/trailing action placement naturally mirror kare.\n- Phone/code strings intended LTR order preserve karein without whole page breaking.\n- Long multilingual names wrap hon aur keyboard DOM order sensible ho.',
    answer:
      '**Hint — atakne par padho:** Inline-start/end ko physical left/right se replace karo jahan semantics directional hain.\n\n**Answer guide — attempt ke baad compare karo:** Margin/padding/inset inline logical properties aur text-align start use karo. Flex/grid direction inheritance inspect karo, unnecessary row-reverse plus rtl double reversal avoid karo. Bidi isolation with appropriate markup mixed user strings ke around do; semantic content order CSS visual manipulation se mat badlo. Directional icons deliberate mirror policy lein, universal symbols blindly flip na hon.',
    followUp:
      'Absolute-position badges aur breadcrumbs ke separators ka RTL testing plan kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'css'],
  },
  {
    id: 'iq-machine-undo-editor',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'Machine coding: Redux undo/redo document editor banao',
    minutes: 60,
    priority: 'P1',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nRedux app mein plain text editor with setText,undo,redo banao. Each committed edit history entry ho; commit button use karo, keystrokes local draft. Max50 past snapshots, new edit after undo future clear kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- A->B->C undo twice A, redo once B ho.\n- Undo to B then commit D: redo unavailable ho.\n- No-op same-text commit history add na kare; cap50 oldest snapshots evict kare.',
    answer:
      '**Hint — atakne par padho:** History ko past/present/future state mein express karo.\n\n**Answer guide — attempt ke baad compare karo:** Reducer commit par current present past mein push, cap trim aur future clear kare. Undo latest past ko present aur old present future front mein move kare; redo reverse operation ho. Editor local draft selected present change se reset ho with explicit unsaved discard policy. Selectors availability derive karein, separately flags maintain mat karo. Snapshots immutable hon.',
    followUp:
      'Large documents ke liye snapshots se patches par shift mein inverse operations kaise validate karoge?',
    tags: ['machine-coding', 'practice-first', 'redux'],
  },
  {
    id: 'iq-machine-request-search',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux async search with request ownership banao',
    minutes: 75,
    priority: 'P1',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P1 — pehle practice karo\n\n**Build contract — kya banana hai:**\n\nRedux query page fake API se users search kare. Query update request start kare; state currentRequestId/query/status/items/error rakhe. Old response current results/loading overwrite na kare. Debounce optional, correctness required.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Slow query A aur fast B ke baad only B visible ho.\n- Old request rejection B success ko error mein convert na kare.\n- Clear query pending generation invalidate kare, late results absent rahein.',
    answer:
      '**Hint — atakne par padho:** Reducer fulfilled/rejected actions ko owner ID se gate karo.\n\n**Answer guide — attempt ke baad compare karo:** Pending action new request ID establish kare; async middleware/thunk adapter load invoke kare. Fulfilled/rejected action matching current ID ho tab state transition kare. Query clear ID reset kare. Cancellation work save kare, identity guard correctness protect kare. Derived UI status use karo; abort ko user-visible server error banana avoid karo.',
    followUp:
      'Cache keyed by query add karoge toh active view ownership aur cache population kaise separate honge?',
    tags: ['machine-coding', 'practice-first', 'redux'],
  },
  {
    id: 'iq-machine-filter-url',
    track: 'react',
    topic: 'redux',
    noteId: 'react-routing-url-state',
    level: 'Advanced',
    question: 'Machine coding: Redux product filters synchronized with URL banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux product view mein category,sort,page URL committed source of truth ho. Search text local draft Apply par commit ho. Back/Forward state restore kare; invalid page default1, unknown sort defaultname. Filters change page1 kare.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Share URL reload same filtered state de.\n- Apply one history entry create kare; Back prior filters restore kare.\n- URL->store update effect URL rewrite loop na banaye.',
    answer:
      '**Hint — atakne par padho:** One canonical parser/serializer aur navigation event ownership rakho.\n\n**Answer guide — attempt ke baad compare karo:** Parse URL to validated filter state on initial load/navigation. User Apply route update kare; route subscription store projection dispatch kare. Same canonical state compare karke duplicate navigation avoid karo. Local search draft navigation par documented reset kare. Server response ownership filters key se guard karo. Store aur URL dono independent authority honge toh synchronization loops aayenge.',
    followUp: 'ReplaceState versus pushState typing, pagination aur reset mein kab use karoge?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-offline-actions',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux offline mutation queue banao',
    minutes: 90,
    priority: 'P2',
    promptCode:
      '**Timebox:** 90 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux todos mein offline add queue karo. Durable local-storage adapter schema validation ke saath queue persist kare; network adapter idempotent mutationId accept kare. Replay serial order, permanent failure item blocked, later items paused until discard/retry.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Offline two adds reload ke baad pending rahein.\n- Lost acknowledgment retry same mutationId bheje aur server duplicate todo na banaye.\n- Invalid persisted JSON app crash na kare; storage failure unsaved status dikhaye.',
    answer:
      '**Hint — atakne par padho:** Optimistic entity ID aur stable server mutation identity map karo.\n\n**Answer guide — attempt ke baad compare karo:** Queue records serializable pending/sending/blocked statuses rakhein. Reload sending ko retryable pending normalize kare. Worker one item send kare, success server ID reconcile aur durable queue removal kare. Persistence failure surface karo; in-memory optimistic success ko durable save mat bolo. Reducer network/storage side effects se pure rahe, middleware adapter operations own kare.',
    followUp:
      'Offline edit conflicts server version se milen toh overwrite/merge/manual recovery ka UI kya hoga?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-auth-reset',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux session change and cache reset banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux app fake login/logout adapter use kare. User profile aur private documents separate slices hon; logout global session generation increment kare aur private state clear kare. Auth secrets store/persist nahi; adapter owns session.\n\n**Acceptance checks — demo mein dikhao:**\n\n- User A logout then B login: A private docs never appear.\n- A pending fetch completion B session store populate na kare.\n- Persisted nonprivate theme remain ho, private data reload se restore na ho.',
    answer:
      '**Hint — atakne par padho:** Global session generation every private request ka ownership token hai.\n\n**Answer guide — attempt ke baad compare karo:** Root reducer session-reset action private slices reset kare aur generation increase kare. Each async private action generation capture karke completion reducer guard lagaye. Abort pending requests optional efficiency hai; generation still needed. Persistence allowlist only safe preferences choose kare. UI route guard data authorization replace nahi karta, backend session authority separately required hai.',
    followUp:
      'Multiple browser tabs logout synchronize karte waqt stale storage events kaise handle karoge?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-entity-pagination',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux normalized paginated entities cache banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux fake issues API pages queryKey/cursor se store karo. Entities map by ID aur each page ordered IDs ho. Entity version integer, newer replaces older. Same ID across pages one canonical object ho; invalidation marks pages stale.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Page2 newer issue version update kare, Page1 render bhi latest entity use kare.\n- Late Page1 old version canonical newer entity overwrite na kare.\n- Invalidating one query other query page membership delete na kare.',
    answer:
      '**Hint — atakne par padho:** Entity freshness aur query membership freshness independent hain.\n\n**Answer guide — attempt ke baad compare karo:** Normalized entity map merge per-ID version compare kare; page IDs incoming page order preserve karein. Page cache status/error/requestId separate rakho, matching request gate per page ho. Selector page IDs join kare; missing entity fallback loading/error policy explicit ho. Version-free merge last-arrival overwrite races create karega. Eviction referenced entities blindly remove na kare.',
    followUp:
      'Delete tombstone newer version ke saath aaye toh stale pages deleted issue resurrect na karein, kaise?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-middleware-audit',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'Machine coding: Redux audit middleware with redaction banao',
    minutes: 60,
    priority: 'P2',
    promptCode:
      '**Timebox:** 60 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nRedux middleware action type, timestamp aur changed top-level slice names record kare. Inject clock/sink, redact action payload sensitive keys password/token recursively. Max nesting10, cyclic payload safe marker. Reducers/sink exceptions ke outcomes explicit hon.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Action passes next exactly once aur dispatch return value preserved ho.\n- Reducer throw par failure audit entry ho, error caller tak propagate ho.\n- Sink throw app dispatch failure mein convert na ho; secrets nested objects mein absent hon.',
    answer:
      '**Hint — atakne par padho:** Middleware wrapper observation kare, action object mutate na kare.\n\n**Answer guide — attempt ke baad compare karo:** Before/after slice references compare karo; reducer error separately capture/rethrow karo. Redacted payload fresh bounded traversal se banao, WeakSet cycles mark kare. Audit sink guarded try/catch best-effort policy le. Timestamp injected clock se deterministic ho. Large action traversal overhead limit karo aur payload allowlist production alternative explain karo.',
    followUp:
      'Immutable state requirement violate ho toh reference-based changed-slice audit kya miss karega?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
  {
    id: 'iq-machine-finite-workflow',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Advanced',
    question: 'Machine coding: Redux approval workflow state machine banao',
    minutes: 75,
    priority: 'P2',
    promptCode:
      '**Timebox:** 75 min · **Priority:** P2 — next challenge\n\n**Build contract — kya banana hai:**\n\nExpense request UI mein draft->submitted->approved/rejected transitions Redux reducer se implement karo. Draft edit, submit, reviewer approve/reject aur rejected->draft revise do. Fake role context supplied; approved request immutable. Server authorization scope separate hai.\n\n**Acceptance checks — demo mein dikhao:**\n\n- Submitted state mein draft edit no-op/error ho.\n- Requester approve action reject ho; reviewer rejection reason mandatory ho.\n- Revise preserves values but clears review result; resubmit new revision increment kare.',
    answer:
      '**Hint — atakne par padho:** Allowed event table state aur role pair ke against validate karo.\n\n**Answer guide — attempt ke baad compare karo:** One reducer transitions explicit switch/table se enforce kare, scattered UI flags se nahi. Entity status/revision/review fields consistent one transition mein update hon. Selector allowed actions derive kare; UI hide alone authority nahi. Async approval add karne par expected revision request mein bhejo aur stale response gate karo. Invalid action structured error outcome de without partial mutation.',
    followUp:
      'Two reviewers opposite decisions simultaneously bhejein toh backend version check aur UI reconciliation kaise work karega?',
    tags: ['machine-coding', 'stretch-practice', 'redux'],
  },
];
