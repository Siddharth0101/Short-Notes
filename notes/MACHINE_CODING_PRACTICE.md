# Machine coding practice — har subject ke liye build rounds

121 original drills · 11 subjects · 44 P1 practice-first questions · 121 interviewer follow-ups.

[Home](../README.md) · [Study guide](STUDY_GUIDE.md) · [Concept interview priorities](INTERVIEW_PRIORITY_GUIDE.md)

**Top questions ka matlab:** P1 pehle karo kyunki inmein reusable state, async, data aur correctness skills practice hoti hain. Yeh learning-based shortlist hai; company-frequency ranking nahi. P2 next challenge hai. HTML/CSS, JavaScript, React/Redux, Java, Spring Boot/SQL, Node/MongoDB, DSA aur system design sab included hain. Interview playbooks ke mock rounds ke saath apne subject ka drill use karo.

App ke Interview page par search mein **machine-coding** likho; **Interview topic** se subject select karo. Sirf shortlist ke liye **practice-first** search karo. Prompt aur acceptance checks answer reveal se pehle dikhte hain; hint aur answer guide reveal ke andar hain. Yeh guide offline reference hai, executable starter project ya full reference-solution repository nahi.

## Interview jaisa session kaise chalao

1. Apne track ka prerequisite chapter padho, phir blank project se ek prompt choose karo. Existing course runtime use karo; database drill se pehle stated DB ready rakho. Setup time coding timebox se alag hai.
2. Time ka pehla 10% contract aur examples, next 60% working implementation, next 20% acceptance tests, last 10% demo/refactor ke liye rakho. Pehle hint/answer mat padho.
3. Har acceptance bullet ka repeatable test ya visible demo dikhao. UI ke liye keyboard aur failure state; backend ke liye real persistence/concurrency jahan required; data structures ke liye invariant aur complexity explain karo.
4. Interviewer role wala partner midpoint par ek boundary case de; final demo ke baad listed follow-up pooche. Solo ho toh failed scenario likhkar retest karo.
5. Answer guide se apna approach compare karo. Alternate design valid hai agar same contract aur checks satisfy hon; guide full runnable solution nahi hai.

## Scorecard — har round 20 points

| Area | Points | Evidence |
| --- | ---: | --- |
| Contract aur model | 0–4 | Assumptions, identity, state aur scope clear hain |
| Working core | 0–6 | Required operations end-to-end chalti hain |
| Edge cases aur correctness | 0–4 | Prompt ke failure/boundary checks pass hain |
| Verification | 0–4 | Repeatable tests/demo actual behavior prove karte hain |
| Explanation | 0–2 | Tradeoff aur follow-up clearly explain kiya |

16+ target rakho, lekin violated data invariant ya missing core operation ko score se hide mat karo. Incomplete drill ko same contract ke saath dobara attempt karo. First pass mein apne subject ke four P1 rounds, phir seven P2 rounds karo; saare subjects same week mein karna zaroori nahi.

## Practice sequence — apna route choose karo

- Frontend: HTML + CSS → JavaScript → React → Redux → frontend/system design rounds.
- Java backend: Java → Spring Boot (SQL/reporting included) → system design.
- Node backend: JavaScript → Node.js → MongoDB → system design.
- DSA: apni primary language mein data structures implement karo; language/framework rounds ke saath alternate karo.
- Har subject ke sessions 1–4 P1 hain; 5–11 P2 hain. Har third round ke baad ek failed round bina hint repeat karo. Cross-track sequence prerequisite comfort ke hisaab se follow karo.
- Progress ke liye app confidence tracking use karo, aur apne log mein drill ID, date, minutes used, score /20, failed check aur next retry date likho. Follow-up ko implementation ke baad 5-minute spoken question banao.

## Subject directory

| Subject | Build rounds | P1 | Follow-ups | Coding time |
| --- | ---: | ---: | ---: | ---: |
| [HTML](#iq-machine-registration-form) | 11 | 4 | 11 | 45–60 min/round |
| [CSS](#iq-machine-responsive-dashboard) | 11 | 4 | 11 | 45–60 min/round |
| [JavaScript](#iq-machine-debounce) | 11 | 4 | 11 | 45–60 min/round |
| [React](#iq-machine-autocomplete) | 11 | 4 | 11 | 60–90 min/round |
| [Redux](#iq-machine-shopping-cart) | 11 | 4 | 11 | 60–90 min/round |
| [Node.js](#iq-machine-task-api) | 11 | 4 | 11 | 60–90 min/round |
| [Java](#iq-machine-parking-lot) | 11 | 4 | 11 | 60–90 min/round |
| [Spring Boot](#iq-machine-inventory-reservation) | 11 | 4 | 11 | 75–90 min/round |
| [MongoDB](#iq-machine-product-search) | 11 | 4 | 11 | 60–90 min/round |
| [DSA](#iq-machine-lru-cache) | 11 | 4 | 11 | 45–75 min/round |
| [System design](#iq-machine-rate-limiter) | 11 | 4 | 11 | 60–90 min/round |


## Top questions — P1 shortlist

| Subject | Pehle yeh four rounds karo |
| --- | --- |
| HTML | [Accessible registration form banao](#iq-machine-registration-form) · [Accessible confirmation dialog banao](#iq-machine-modal-dialog) · [Keyboard-accessible tabs widget banao](#iq-machine-tabs-widget) · [Multi-section accordion with URL deep links banao](#iq-machine-accordion) |
| CSS | [Responsive dashboard layout banao](#iq-machine-responsive-dashboard) · [Scrollable table with sticky header banao](#iq-machine-sticky-table) · [Holy-grail application shell banao](#iq-machine-holy-grail) · [Responsive image gallery without layout shift banao](#iq-machine-responsive-gallery) |
| JavaScript | [Debounce with cancel aur flush implement karo](#iq-machine-debounce) · [Concurrency-limited async task runner banao](#iq-machine-promise-pool) · [Throttle with leading aur trailing calls banao](#iq-machine-throttle) · [Promise.all-style combinator implement karo](#iq-machine-promise-combinators) |
| React | [Async autocomplete component banao](#iq-machine-autocomplete) · [Kanban task board with undo banao](#iq-machine-kanban) · [Sortable paginated editable React data grid banao](#iq-machine-data-grid) · [React file explorer with rename aur move banao](#iq-machine-file-explorer) |
| Redux | [Redux shopping cart with stock limits banao](#iq-machine-shopping-cart) · [Redux optimistic todo updates with rollback banao](#iq-machine-optimistic-todos) · [Redux undo/redo document editor banao](#iq-machine-undo-editor) · [Redux async search with request ownership banao](#iq-machine-request-search) |
| Node.js | [Express task REST API banao](#iq-machine-task-api) · [Backpressure-aware CSV export banao](#iq-machine-stream-export) · [Async middleware pipeline implement karo](#iq-machine-middleware-pipeline) · [Graceful shutdown HTTP server banao](#iq-machine-graceful-server) |
| Java | [Parking lot low-level design implement karo](#iq-machine-parking-lot) · [Expense sharing ledger implement karo](#iq-machine-splitwise) · [Library lending service implement karo](#iq-machine-library-system) · [Bounded blocking queue implement karo](#iq-machine-bounded-blocking-queue) |
| Spring Boot | [Transactional inventory reservation API banao](#iq-machine-inventory-reservation) · [Room booking with overlap protection banao](#iq-machine-booking-api) · [Owner-scoped Spring Boot notes API banao](#iq-machine-secured-notes) · [Versioned document API with conflict response banao](#iq-machine-optimistic-document-api) |
| MongoDB | [MongoDB product search with cursor pagination banao](#iq-machine-product-search) · [MongoDB atomic stock purchase implement karo](#iq-machine-atomic-stock) · [Tenant-isolated MongoDB notes repository banao](#iq-machine-tenant-crud) · [MongoDB profile editor with version checks banao](#iq-machine-optimistic-profile) |
| DSA | [LRU cache data structure implement karo](#iq-machine-lru-cache) · [Trie prefix suggestion engine banao](#iq-machine-trie-autocomplete) · [Min stack aur two-stack queue implement karo](#iq-machine-min-stack) · [Streaming median tracker banao](#iq-machine-running-median) |
| System design | [Token bucket rate limiter prototype banao](#iq-machine-rate-limiter) · [URL shortener vertical slice banao](#iq-machine-url-shortener) · [Notification delivery service prototype banao](#iq-machine-notification-service) · [Reconnect-safe chat service prototype banao](#iq-machine-chat-reconnect) |

## HTML — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Accessible registration form banao](#iq-machine-registration-form) — P1, 45 min
2. [Accessible confirmation dialog banao](#iq-machine-modal-dialog) — P1, 45 min
3. [Keyboard-accessible tabs widget banao](#iq-machine-tabs-widget) — P1, 45 min
4. [Multi-section accordion with URL deep links banao](#iq-machine-accordion) — P1, 45 min
5. [Semantic nested comments viewer banao](#iq-machine-nested-comments) — P2, 60 min
6. [Accessible file picker with image previews banao](#iq-machine-upload-preview) — P2, 60 min
7. [Semantic HTML sortable table banao](#iq-machine-sortable-table) — P2, 45 min
8. [Long form with linked error summary banao](#iq-machine-focus-error-summary) — P2, 60 min
9. [Accessible manual image carousel banao](#iq-machine-accessible-carousel) — P2, 45 min
10. [Safe article search and text highlighting banao](#iq-machine-search-highlight) — P2, 60 min
11. [Accessible mobile navigation disclosure banao](#iq-machine-responsive-nav) — P2, 45 min

### iq-machine-registration-form

**Machine coding: Accessible registration form banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Browser mein HTML aur vanilla JS use karo. Name, email, password aur consent wala form banao; password minimum 8 characters. Submit fake async adapter ko call kare. Invalid input par request na bhejo; pending submit dobara na chale.

**Acceptance checks — demo mein dikhao:**

- Empty submit par first invalid field focus ho aur uska labeled error mile.
- Valid submit ek request bheje; reject par filled values bachein aur retry chale.
- Sirf keyboard se consent aur submit operate ho; success status readable ho.

**Hint — atakne par padho:** Field validity, request status aur focus destination ko alag socho.

**Answer guide — attempt ke baad compare karo:** Native labels/input types se shuru karo; submit handler validity check karke invalid field par focus bheje. Error IDs ko field descriptions se connect karo. Idle/pending/success/error status rakho, pending guard aur disabled submit dono lagao. finally mein guard release karo. Password ko logs/storage mein mat rakho. Sirf red border error explain nahi karta; text aur accessible status bhi do.

**Interviewer follow-up:** Network timeout ke baad duplicate submission ko server par kaise pehchanoge?

### iq-machine-modal-dialog

**Machine coding: Accessible confirmation dialog banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Browser HTML/JS mein delete-confirmation dialog banao. Open, Cancel aur Confirm controls do; delete callback fake ho. Open trigger remember karo; background dialog khula hone tak interactive na ho.

**Acceptance checks — demo mein dikhao:**

- Open par dialog ke andar focus aaye; Tab background tak na nikle.
- Escape/Cancel delete callback na chalayein; Confirm exactly once chalaye.
- Close par existing trigger ko focus mile; trigger delete ho gaya ho toh list heading ko mile.

**Hint — atakne par padho:** Native modal dialog aur explicit focus-return policy evaluate karo.

**Answer guide — attempt ke baad compare karo:** Dialog ka accessible name do, modal opening use karo aur safe default Cancel par focus set karo. Confirm aur cancel paths separate rakho; close handler mein deletion mat rakho warna Escape bhi delete karega. Closing ke baad trigger connected hai toh restore karo, warna deliberate fallback choose karo. Tab, Shift+Tab aur Escape manually verify karo; visual overlay alone focus management nahi hai.

**Interviewer follow-up:** Nested dialog request aaye toh scope simplify karoge ya focus stack kaise maintain karoge?

### iq-machine-tabs-widget

**Machine coding: Keyboard-accessible tabs widget banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Plain HTML/JS mein 3 tabs/panels banao. Arrow Left/Right wrap, Home/End, manual activation Enter/Space. Focused tab aur selected tab distinct ho sakte hain. Tab key selected/focused tab stop se panel content tak jaaye.

**Acceptance checks — demo mein dikhao:**

- Arrow focus shift kare lekin panel Enter tak change na ho.
- Exactly one tab tabIndex0 ho; selected panel hi visible ho.
- Every tab/panel ID association valid aur hidden panel controls untabbable hon.

**Hint — atakne par padho:** Roving focus index aur active panel index separate rakho.

**Answer guide — attempt ke baad compare karo:** Tablist/tab/tabpanel semantics aur aria-selected/controls/labelledby IDs connect karo. Arrow event focus index update kare aur correct element focus ho, activation selected index change kare. Hidden attribute inactive content ko remove from interaction kare. Event delegation target actual tab button tak constrain karo. Sirf visual class active badalna complete keyboard widget nahi.

**Interviewer follow-up:** Dynamic selected tab delete hone par focus aur selection fallback kya hoga?

### iq-machine-accordion

**Machine coding: Multi-section accordion with URL deep links banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

HTML/JS FAQ accordion banao; multiple sections open reh sakte hain. Heading buttons aria-expanded reflect karein. Hash #faq-ID initial load aur hashchange par target section open/focus kare; unknown hash ignore. User collapse hash history mutate na kare.

**Acceptance checks — demo mein dikhao:**

- Enter/Space section toggle kare aur hidden links tabbable na hon.
- Direct hash load correct section open kare; duplicate titles IDs collide na karein.
- Hashchange unknown target crash na kare; focus heading button par aaye.

**Hint — atakne par padho:** URL identifier stable data ID hai, heading text nahi.

**Answer guide — attempt ke baad compare karo:** Heading ke andar real button aur aria-controls se panel connect karo. Open ID set maintain karo; hidden panel state synchronize karo. Hash ko known ID map se resolve karo, arbitrary selector interpolation avoid karo. Initial browser scroll aur focus handling coordinate karo. Listener cleanup component destroy par do; content re-render unnecessarily focused node replace na kare.

**Interviewer follow-up:** Single-open accordion mode add karoge toh deep link aur manual collapse rules kaise differ karenge?

### iq-machine-nested-comments

**Machine coding: Semantic nested comments viewer banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/JS mein {id,parentId,text} records se threaded comments dikhao. Input ek acyclic forest hai; missing parent ko top level dikhao. Collapse/expand buttons, reply input aur submitted comment insertion do; backend nahi chahiye.

**Acceptance checks — demo mein dikhao:**

- Duplicate text wale comments independent IDs se collapse hon.
- Reply sirf selected parent ke andar aaye; blank reply reject ho.
- User text <img src=x> literal dikhe; keyboard toggle aur reply chale.

**Hint — atakne par padho:** Data identity aur safe text rendering pehle settle karo.

**Answer guide — attempt ke baad compare karo:** ID map aur parent-to-children map ek pass mein banao, phir nested lists render karo. Text ko textContent se insert karo, HTML string interpolate mat karo. Collapse state IDs se key karo aur buttons par expanded state expose karo. Insertion par stable ID generate karke model update karo; full tree replace karke focused input lose mat karo. Rendering cost visible nodes ke saath discuss karo.

**Interviewer follow-up:** Deep tree aur malformed cyclic input ko support karna ho toh kya limits add karoge?

### iq-machine-upload-preview

**Machine coding: Accessible file picker with image previews banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/JS file picker mein max5 JPEG/PNG files, each <=2MiB accept karo. Preview, remove, duplicate file metadata(name,size,lastModified) rejection aur validation summary do. Upload backend nahi. Object URLs use karo.

**Acceptance checks — demo mein dikhao:**

- Sixth accepted file reject ho; invalid file reason visible ho.
- Remove/reset/destroy par matching object URLs revoke hon.
- Same removed file select again possible ho; keyboard controls labeled hon.

**Hint — atakne par padho:** File input value aur accepted file list alag lifecycle rakhte hain.

**Answer guide — attempt ke baad compare karo:** Input change par files validate karke stable local IDs aur object URLs create karo; invalid files ke URLs mat banao. Remove par revoke aur focus neighboring remove/add control par move karo. Input reset se same file reselection event allow karo. MIME/extension client checks server security validation replace nahi karti. Preview image decode failure bhi user-visible state ho.

**Interviewer follow-up:** Drag-and-drop add karne par keyboard equivalent aur directory drops ka contract kya hoga?

### iq-machine-sortable-table

**Machine coding: Semantic HTML sortable table banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/vanilla JS mein name,age,joinedDate columns ki 20-row table banao. Header buttons toggle ascending/descending; null age/date always last. Dates ISO YYYY-MM-DD, equal values original input order maintain karein.

**Acceptance checks — demo mein dikhao:**

- Age numbers numeric sort hon: 2 before 10.
- Null last both directions, active header aria-sort correct ho.
- Sort ke baad clicked header focus preserve ho; row header relationships valid hon.

**Hint — atakne par padho:** Data comparison aur DOM semantics independent layers hain.

**Answer guide — attempt ke baad compare karo:** Column-specific comparators use karo; null ordering branch direction multiplier se pehle handle karo. Tie original index se break karo. Only tbody rows reorder karo taaki heading focus stable rahe. Caption, th scopes aur header button names meaningful hon. Sort status concise announce karo; every cell live region banana noise create karega.

**Interviewer follow-up:** Locale date display ko sort value se separate kyun rakhoge?

### iq-machine-focus-error-summary

**Machine coding: Long form with linked error summary banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/JS application form mein name,email,age,city fields banao. Submit par all errors summary mein links ke saath dikhaye; summary focus ho. User error link activate kare toh target field focus. Age integer18..100; valid submit fake adapter ko bhejo.

**Acceptance checks — demo mein dikhao:**

- Three invalid fields se three linked summary items aur inline messages hon.
- Correction/resubmit par resolved errors disappear, remaining links valid rahein.
- Pending submit repeat na ho; server rejection values preserve kare.

**Hint — atakne par padho:** Error object by field ID se summary aur inline view derive karo.

**Answer guide — attempt ke baad compare karo:** Pure validation function field-keyed errors return kare. Submit invalid ho toh stable summary container tabindex -1 par focus bhejo; links field IDs target karein. aria-invalid aur describedby messages update karo. Native/custom validation coordination explicit rakho taaki browser popup aur summary conflicting focus na dein. Errors every keystroke announce karna unnecessary distraction hai.

**Interviewer follow-up:** Server unknown field error ko global summary mein kaise display karoge?

### iq-machine-accessible-carousel

**Machine coding: Accessible manual image carousel banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/JS carousel mein 5 slides, Previous/Next aur numbered selectors do. Autoplay nahi. Ends wrap; active slide position announce ho. Non-active slide links focusable na hon; images meaningful alt text ya decorative empty alt use karein.

**Acceptance checks — demo mein dikhao:**

- Slide5 Next slide1 dikhaye; selector3 slide3 activate kare.
- Keyboard controls operate hon aur focus clicked navigation par rahe.
- Single-slide fixture controls disable/hide sensibly kare; empty fixture message ho.

**Hint — atakne par padho:** Slide visibility aur focusable descendant lifecycle synchronize karo.

**Answer guide — attempt ke baad compare karo:** Active index sole navigation state rakho, normalized modulo movement use karo. Hidden slides ko hidden attribute se interaction se remove karo. Live status only change par Slide N of M announce kare. Controls real buttons hon, selector current state accessible ho. Image load failure fallback preserve kare. Visual transform offscreen karna alone tabbability nahi rokta.

**Interviewer follow-up:** Optional autoplay add karoge toh pause-on-focus, reduced motion aur explicit stop control kaise doge?

### iq-machine-search-highlight

**Machine coding: Safe article search and text highlighting banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Plain article paragraphs mein case-insensitive literal substring search banao. Match count, next/previous occurrence navigation aur clear do. Query regex syntax nahi; existing links/emphasis preserve hon. Search original text nodes par ho.

**Acceptance checks — demo mein dikhao:**

- Query .* literal text match kare, regex wildcard nahi.
- Repeated search nested mark elements na banaye; Clear original content restore kare.
- Matched user text HTML execute na kare; navigation current match announce kare.

**Hint — atakne par padho:** Text-node traversal aur safe node splitting use karo.

**Answer guide — attempt ke baad compare karo:** Original DOM/text-node baseline ya mark-unwrapping plus normalize routine maintain karo. TreeWalker-style traversal scripts/styles/controls exclude kare; match offsets text ke andar compute karo aur text/mark nodes create karo. innerHTML string replacement existing markup tod sakta hai. This drill node-boundary-spanning matches support nahi karta; limitation prompt/demo mein clear karo.

**Interviewer follow-up:** Text spanning emphasized nodes ko match karne ke liye global offset-to-node map kaise banega?

### iq-machine-responsive-nav

**Machine coding: Accessible mobile navigation disclosure banao**

[Pehle concept padho: DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/CSS/JS site nav mein small-screen toggle aur wide-screen always-visible links do. Yeh normal navigation disclosure hai, application menu role nahi. Escape small-screen nav close kare aur trigger focus restore kare.

**Acceptance checks — demo mein dikhao:**

- Toggle aria-expanded visibility se match kare.
- Hidden mobile links Tab se reachable na hon; wide layout links visible hon.
- Small->wide->small resize stale invisible focus trap na banaye.

**Hint — atakne par padho:** Viewport-derived presentation aur user open state separate rakho.

**Answer guide — attempt ke baad compare karo:** Nav landmark, real anchor links aur toggle button aria-controls use karo. Small layout hidden state apply kare; wide layout visibility force true aur toggle hidden ho. Resize par focus disappearing element mein ho toh sensible target move karo. Escape listener only open small disclosure par act kare. Menu role without arrow-key contract use mat karo.

**Interviewer follow-up:** Current-page indication aur nested disclosure groups ka focus behavior kaise extend karoge?

## CSS — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Responsive dashboard layout banao](#iq-machine-responsive-dashboard) — P1, 45 min
2. [Scrollable table with sticky header banao](#iq-machine-sticky-table) — P1, 45 min
3. [Holy-grail application shell banao](#iq-machine-holy-grail) — P1, 45 min
4. [Responsive image gallery without layout shift banao](#iq-machine-responsive-gallery) — P1, 45 min
5. [Themeable pricing cards banao](#iq-machine-theme-components) — P2, 45 min
6. [Focus-aware CSS tooltip banao](#iq-machine-tooltip-popover) — P2, 45 min
7. [Skeleton and empty/error state layout banao](#iq-machine-skeleton-loading) — P2, 45 min
8. [Print-friendly invoice layout banao](#iq-machine-print-invoice) — P2, 60 min
9. [Responsive form with resilient labels and errors banao](#iq-machine-responsive-form) — P2, 45 min
10. [Progress indicators with reduced motion banao](#iq-machine-reduced-motion-spinner) — P2, 45 min
11. [RTL-ready card and navigation layout banao](#iq-machine-logical-layout) — P2, 60 min

### iq-machine-responsive-dashboard

**Machine coding: Responsive dashboard layout banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

HTML/CSS mein header, sidebar aur 12 product cards banao. 320px par one column aur inline navigation, 768px par two columns, 1200px par sidebar plus three columns chahiye. Card titles variable length hain.

**Acceptance checks — demo mein dikhao:**

- Teen viewport widths par page-level horizontal scroll na ho.
- 200-character title wrap ho; images card bounds mein rahein.
- Keyboard focus visible ho aur DOM reading order visual order se sensible rahe.

**Hint — atakne par padho:** Grid tracks ki minimum width aur content overflow inspect karo.

**Answer guide — attempt ke baad compare karo:** Mobile-first one-column flow rakho; media queries se columns/sidebar add karo. Main content ko min-width:0 aur long strings ko wrapping rule do. Images ko constrained width aur consistent aspect ratio do. CSS order se reading order radically change mat karo. Fixed page widths ki jagah flexible tracks use karo; browser resize aur zoom par layout inspect karo.

**Interviewer follow-up:** Cards mein equal-height action footer kaise rakhoge bina text truncate kiye?

### iq-machine-sticky-table

**Machine coding: Scrollable table with sticky header banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

HTML/CSS mein 50-row, 8-column semantic table banao. Ek bounded scroll container mein header aur first column sticky hon; narrow screens par horizontal scroll isi container mein ho.

**Acceptance checks — demo mein dikhao:**

- Vertical scroll par headings dikhein; horizontal scroll par first column dikhe.
- Top-left cell overlap mein readable rahe; sticky backgrounds opaque hon.
- Header-cell associations aur keyboard se scroll region access verify karo.

**Hint — atakne par padho:** Sticky offsets aur stacking order dono define karne padenge.

**Answer guide — attempt ke baad compare karo:** Table structure preserve karo, overflow wrapper ko bounded height do. Header top:0 aur first-column left:0 rakho; intersection ka z-index dono se high ho. Opaque backgrounds aur borders inspect karo taaki underlying text bleed na kare. Wrapper ko accessible name aur keyboard access do jab zaroorat ho. Ancestor overflow sticky behavior badal sakta hai; actual container mein test karo.

**Interviewer follow-up:** Variable-width first column aur RTL layout ke liye offsets kaise adapt karoge?

### iq-machine-holy-grail

**Machine coding: Holy-grail application shell banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

HTML/CSS app shell mein header/footer, left nav, main aur right context panel banao. Desktop main flexible aur sidebars fixed preferred width hon; <900px context below main, <600px nav above main. Short content par footer viewport bottom ho.

**Acceptance checks — demo mein dikhao:**

- 320px,800px,1440px par intended order aur no page overflow ho.
- Tall main content footer ko overlap na kare.
- Long unbroken link wrap kare aur focus ring clipped na ho.

**Hint — atakne par padho:** Grid areas aur minmax(0,1fr) se flexible middle define karo.

**Answer guide — attempt ke baad compare karo:** Min-height viewport shell aur rows auto/1fr/auto use karo, fixed height se content crop mat karo. Media queries areas rewrite karein while DOM reading order coherent rahe. Sidebars large layout mein bounded columns hon; main min-width0 aur wrapping rule le. Footer normal document flow mein rahe. Absolute-position footer long content overlap karega.

**Interviewer follow-up:** Mobile browser dynamic viewport height aur sticky header ke liye shell sizing kaise test karoge?

### iq-machine-responsive-gallery

**Machine coding: Responsive image gallery without layout shift banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

CSS grid gallery mein 12 images, aspect-ratio 4/3 cards aur captions banao. Small width one column, 600px two, 1000px four columns. Image slow load par card geometry reserved ho; missing image placeholder same ratio rakhe.

**Acceptance checks — demo mein dikhao:**

- Before/after image load card positions stable hon.
- Different intrinsic image ratios consistent thumbnail box fill karein.
- Long captions row alignment na tod dein; 200% zoom usable ho.

**Hint — atakne par padho:** Intrinsic media dimensions aur layout box dimensions independently control karo.

**Answer guide — attempt ke baad compare karo:** Width-constrained wrapper with aspect-ratio reserve karo; img width/height100% aur object-fit policy choose karo. CSS grid gap aur responsive column counts explicit hon. Captions normal flow mein wrapping karein, forced fixed card height content clip na kare. Alt text accessible rahe; decorative placeholder meaning convey karne ka only source na ho.

**Interviewer follow-up:** Art-directed mobile crops aur high-density image selection HTML markup mein kaise support karoge?

### iq-machine-theme-components

**Machine coding: Themeable pricing cards banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Plain HTML/CSS aur tiny JS toggle se three pricing cards banao. Light/dark theme tokens, highlighted plan, disabled CTA aur reduced-motion behavior chahiye. React optional hai.

**Acceptance checks — demo mein dikhao:**

- Theme switch par text, border, focus aur disabled states dono themes mein readable hon.
- 320px par cards stack hon; long price label overflow na kare.
- Keyboard focus visible rahe aur reduced-motion setting par decorative animation band ho.

**Hint — atakne par padho:** Colors ko component selectors mein duplicate karne se pehle semantic tokens define karo.

**Answer guide — attempt ke baad compare karo:** Background, foreground, border, accent aur focus ke CSS custom properties banao. Theme attribute par token values replace karo; component layout same rakho. Native disabled buttons aur visible focus outline use karo. Motion preference query se nonessential transition disable karo. Contrast ko actual foreground/background pairs par inspect karo; opacity alone disabled distinction ke liye weak ho sakti hai.

**Interviewer follow-up:** System theme aur explicit saved user preference ka precedence kaise define karoge?

### iq-machine-tooltip-popover

**Machine coding: Focus-aware CSS tooltip banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/CSS plus tiny Escape handler se icon-button tooltip banao. Hover aur keyboard focus par visible, Escape dismiss while focused. Tooltip informational text only; interactive controls tooltip ke andar nahi. Near-edge clipping avoid karne ke liye bounded demo placements do.

**Acceptance checks — demo mein dikhao:**

- Keyboard focus tooltip show kare, accessible button name tooltip par depend na kare.
- Pointer tooltip tak move ho toh content instantly disappear na ho.
- Escape dismiss kare; focus leave/re-enter next time show kare.

**Hint — atakne par padho:** Trigger aur tooltip ka shared hover region aur dismissal state chahiye.

**Answer guide — attempt ke baad compare karo:** Positioned wrapper mein hover/focus-within visibility rakho, tooltip ID describedby relationship provide kare. Escape dismissed flag selector override kare; re-entry lifecycle reset ho. Trigger accessible name independently define karo. z-index overflow clipping ancestor ko bypass nahi karta; bounded placements ya portal/positioning adapter ki limitation clear rakho.

**Interviewer follow-up:** Interactive popover ke liye tooltip se alag focus/role contract kyun chahiye?

### iq-machine-skeleton-loading

**Machine coding: Skeleton and empty/error state layout banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Product list ke loading/success/empty/error states CSS se style karo; tiny JS fixture state switch kare. Loading skeleton final card dimensions reserve kare, reduced motion par shimmer disable ho. Retry real button ho.

**Acceptance checks — demo mein dikhao:**

- Loading->success layout geometry mostly stable rahe, invisible duplicate content na ho.
- Reduced-motion simulation animation stop kare.
- Empty/error states readable headings aur retry focus visibility dein.

**Hint — atakne par padho:** Shared structural styles aur decorative skeleton markup separate rakho.

**Answer guide — attempt ke baad compare karo:** Card layout shared dimensions use kare, skeleton content aria-hidden rakho aur one loading status communicate karo. Error state text actual reason category explain kare bina stack trace. Container busy state pending lifecycle se match ho. CSS animation compositor-friendly properties tak rakho where possible; reduced motion query override add karo. Loading indefinite ho toh failure/retry flow demonstrate karo.

**Interviewer follow-up:** Slow network par skeleton ke bajay stale data show karna kab better hoga?

### iq-machine-print-invoice

**Machine coding: Print-friendly invoice layout banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML invoice screen/print CSS banao. Header, customer details, 60 line items, totals aur print button ho. Print view A4/Letter dono par usable, buttons/nav hidden; totals label/value together rahein. Browser print preview verify karo.

**Acceptance checks — demo mein dikhao:**

- Long invoice multiple pages par text clip na kare.
- Table column headings page breaks par supported browser mein repeat hon.
- Dark theme screen background print mein ink-heavy black sheet na banaye.

**Hint — atakne par padho:** Print media ka flow screen fixed-height layout se separate rakho.

**Answer guide — attempt ke baad compare karo:** Print media query backgrounds/colors/overflow/fixed positioning reset kare. Semantic table header group preserve karo; row/totals break-inside constraints use karo, overlong content ke liye graceful breaks allow karo. Page margins choose karke actual print preview inspect karo; browser pagination differences acknowledge karo. Price columns right align aur readable units/currency rakho.

**Interviewer follow-up:** PDF pixel-exact output chahiye toh browser print CSS ki limits kya hain?

### iq-machine-responsive-form

**Machine coding: Responsive form with resilient labels and errors banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

CSS form mein 8 labeled inputs, helper text, inline errors aur action row style karo. >=800px two columns, below one. Labels variable length; error text 3 lines ho sakta hai. Visual order DOM order follow kare.

**Acceptance checks — demo mein dikhao:**

- Long error adjacent input ko overlap na kare.
- 320px par inputs/button row overflow na kare.
- Focus/disabled/invalid states color ke bina bhi distinguishable hon.

**Hint — atakne par padho:** Fixed field heights ki jagah content-driven grid rows use karo.

**Answer guide — attempt ke baad compare karo:** Field wrapper label/control/help/error normal flow mein rakho. Form grid minmax0 tracks aur controls max-width100% use kare. Buttons wrap karein; primary action reading order consistent ho. Error icon/text aur border cues add karo, only red color nahi. Placeholder ko label replacement mat banao; zoom/long translated text fixtures inspect karo.

**Interviewer follow-up:** Optional field collapse/expand par layout movement aur focus preserve kaise karoge?

### iq-machine-reduced-motion-spinner

**Machine coding: Progress indicators with reduced motion banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

CSS determinate progress bar aur indeterminate spinner style karo. Tiny JS progress 0..100 update kare; indeterminate operation done/error states bhi ho. Reduced motion static alternative ho, no essential information animation-only ho.

**Acceptance checks — demo mein dikhao:**

- Values below0/above100 clamp hon aur progress label actual value se match kare.
- Reduced-motion mode spinner moving na ho lekin loading text dikhe.
- Done/error transition background animation/timer continue na kare.

**Hint — atakne par padho:** Status semantics aur decorative movement alag responsibilities hain.

**Answer guide — attempt ke baad compare karo:** Native progress element ya complete progressbar semantics choose karo; determinate current/min/max expose karo. Indeterminate value omit karke status text do. CSS animation reduced-motion query se disable karo; success/error mein active class remove ho. Progress frequency throttle announce karo taaki screen reader har frame na bole. JS demo timer cleanup mandatory hai.

**Interviewer follow-up:** Unknown-size upload progress ko fake percentage dene ke bajay kaise communicate karoge?

### iq-machine-logical-layout

**Machine coding: RTL-ready card and navigation layout banao**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

HTML/CSS user card, horizontal nav aur settings form ko dir=ltr/rtl toggle ke saath banao. Spacing/alignment logical properties se ho; phone number/code snippets direction-preserved hon. Mixed Hindi/English/Arabic fixture text use karo.

**Acceptance checks — demo mein dikhao:**

- Direction switch leading avatar/trailing action placement naturally mirror kare.
- Phone/code strings intended LTR order preserve karein without whole page breaking.
- Long multilingual names wrap hon aur keyboard DOM order sensible ho.

**Hint — atakne par padho:** Inline-start/end ko physical left/right se replace karo jahan semantics directional hain.

**Answer guide — attempt ke baad compare karo:** Margin/padding/inset inline logical properties aur text-align start use karo. Flex/grid direction inheritance inspect karo, unnecessary row-reverse plus rtl double reversal avoid karo. Bidi isolation with appropriate markup mixed user strings ke around do; semantic content order CSS visual manipulation se mat badlo. Directional icons deliberate mirror policy lein, universal symbols blindly flip na hon.

**Interviewer follow-up:** Absolute-position badges aur breadcrumbs ke separators ka RTL testing plan kya hoga?

## JavaScript — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Debounce with cancel aur flush implement karo](#iq-machine-debounce) — P1, 45 min
2. [Concurrency-limited async task runner banao](#iq-machine-promise-pool) — P1, 60 min
3. [Throttle with leading aur trailing calls banao](#iq-machine-throttle) — P1, 45 min
4. [Promise.all-style combinator implement karo](#iq-machine-promise-combinators) — P1, 60 min
5. [Event emitter with once aur unsubscribe banao](#iq-machine-event-emitter) — P2, 45 min
6. [Cycles preserve karne wala scoped deep clone banao](#iq-machine-deep-clone) — P2, 60 min
7. [Async memoization with expiry aur in-flight dedupe banao](#iq-machine-async-memo) — P2, 60 min
8. [Abortable retry helper banao](#iq-machine-retry-backoff) — P2, 60 min
9. [groupBy aur stable multi-key sorting utility banao](#iq-machine-array-utils) — P2, 45 min
10. [Flatten aur unflatten nested JSON paths banao](#iq-machine-flatten-paths) — P2, 60 min
11. [Observable state store with batched updates banao](#iq-machine-tiny-store) — P2, 60 min

### iq-machine-debounce

**Machine coding: Debounce with cancel aur flush implement karo**

[Pehle concept padho: Execution contexts scope and closures](javascript/09-scope-closures.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Plain JS mein debounce(fn, wait) banao. Trailing-only execution, latest arguments/this, cancel() aur flush() support karo. wait non-negative finite number ho; invalid wait reject karo. flush pending call immediately execute kare, warna undefined return kare.

**Acceptance checks — demo mein dikhao:**

- Fake clock par t=0 aur t=20 calls, wait=50: t=70 par sirf latest call chale.
- cancel ke baad timer advance karne par call na ho.
- flush ek baar chale aur original timer baad mein duplicate execution na kare.

**Hint — atakne par padho:** Timer handle ke saath latest arguments aur receiver retain karne padenge.

**Answer guide — attempt ke baad compare karo:** Wrapper normal function ho taaki caller ka this capture ho. Har call par previous timer clear karke latest args/context store karo. Shared invoke helper pehle pending state clear kare, phir captured fn apply kare; reentrant invocation naya timer bana sake. cancel timer aur references clear kare. flush pending snapshot invoke karke uska result return kare. Real sleep ki jagah controlled timers se boundaries test karo.

**Interviewer follow-up:** Leading plus trailing support mein single call ko double execute hone se kaise bachaoge?

### iq-machine-promise-pool

**Machine coding: Concurrency-limited async task runner banao**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

runPool(tasks, limit) likho; tasks zero-argument async functions hain. Positive integer limit enforce karo. Sab tasks settle hon aur input-order mein {status,value/reason} outcomes return hon; rejection queue ko stop na kare.

**Acceptance checks — demo mein dikhao:**

- Delayed 5 tasks, limit=2 par active task count kabhi 2 cross na kare.
- Out-of-order completion ke baad results input order mein hon.
- Empty input [], sync throw aur rejected promise handle hon; limit=0 reject ho.

**Hint — atakne par padho:** Promise objects ki jagah task factories se work start time control karo.

**Answer guide — attempt ke baad compare karo:** Shared next-index aur fixed worker count rakho. Har worker await se pehle unique index claim kare, task ko try/catch mein invoke kare aur outcome us index par store kare. Worker loop rejection ke baad bhi continue kare. Workers complete hone par results return karo. Sab tasks pehle call karke Promise.all lagana concurrency cap nahi hai; active-count probe se actual work measure karo.

**Interviewer follow-up:** Abort signal aaye toh queued aur already-running tasks ka distinct contract kya hoga?

### iq-machine-throttle

**Machine coding: Throttle with leading aur trailing calls banao**

[Pehle concept padho: Execution contexts scope and closures](javascript/09-scope-closures.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Plain JS throttle(fn,wait) banao. wait positive finite milliseconds hai. First call immediate; window ke andar latest pending call boundary par chale. Trailing execution next window start kare. cancel pending work aur window reset kare. this/arguments preserve karo.

**Acceptance checks — demo mein dikhao:**

- wait=100: calls t=0,20,80 se executions t=0 aur 100, latest pending args ke saath hon.
- Only t=0 call par t=100 mein extra execution na ho.
- cancel at t=90 pending call roke; next call immediate chale.

**Hint — atakne par padho:** Last actual execution aur pending arguments ki ownership alag rakho.

**Answer guide — attempt ke baad compare karo:** Injectable clock/timers se next eligible execution track karo. Window ke andar arguments overwrite karo lekin one timer rakho. Timer callback pending snapshot clear karke invoke kare aur execution timestamp update kare. cancel handle, args aur timestamp reset kare. Boundary timing test mein caller/timer ordering explicit rakho; real event loop ko exact wall-clock scheduler mat maano.

**Interviewer follow-up:** Continuous calls mein debounce aur throttle ki output timelines kaise differ karengi?

### iq-machine-promise-combinators

**Machine coding: Promise.all-style combinator implement karo**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

allValues(iterable) banao; Promise.all call karna allowed nahi. Native Promise aur Promise.resolve use kar sakte ho. Values/thenables accept karo, result input order mein, first rejection combined promise reject kare; remaining tasks automatically cancel nahi honge.

**Acceptance checks — demo mein dikhao:**

- [slowPromise,7,fastPromise] result input order mein de.
- Empty iterable [] resolve ho; throwing iterator rejection de.
- A rejecting thenable aur two resolving inputs se one final rejection mile.

**Hint — atakne par padho:** Remaining count aur per-position closure rakho.

**Answer guide — attempt ke baad compare karo:** Promise executor ke andar iterable traverse karo aur each input ko Promise.resolve se assimilate karo. Per-index result aur remaining counter use karo; empty input separately settle karo ya initial sentinel count rakho. Synchronous iteration throw reject kare. Har input ko rejection handler attach karo; combined rejection already-started operations abort nahi karti. Thenable double resolution ko native assimilation handle kare.

**Interviewer follow-up:** Isi contract ko allSettled aur any mein badalne ke liye completion state kaise badlegi?

### iq-machine-event-emitter

**Machine coding: Event emitter with once aur unsubscribe banao**

[Pehle concept padho: This binding prototypes and classes](javascript/13-this-prototypes-classes.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

on(event, listener), once(event, listener), off(event, listener), emit(event, payload) implement karo. Duplicate function registration ek subscription maano. Emit registration-order snapshot use kare; listener error caller tak propagate ho aur current emit stop ho.

**Acceptance checks — demo mein dikhao:**

- Unsubscribe idempotent ho aur unknown event emit no-op ho.
- Emit ke beech added listener next emit se chale; removed snapshot listener current emit mein chale.
- once listener recursively emit kare toh same once registration dobara na chale.

**Hint — atakne par padho:** Snapshot iteration aur once registration ki consumed state alag concerns hain.

**Answer guide — attempt ke baad compare karo:** Event se ordered registration records ka map rakho; duplicate function ko reuse/no-op karo. Emit records ka snapshot le. once record ko consumed mark aur live registry se remove callback se pehle karo; nested emit mein woh repeat nahi hoga. Snapshot record already consumed ho toh skip karo. Normal off live registry update kare lekin current snapshot policy preserve ho. Empty event buckets cleanup karo.

**Interviewer follow-up:** Errors isolate karke sab listeners chalane hon toh result/error collection API kaise badlegi?

### iq-machine-deep-clone

**Machine coding: Cycles preserve karne wala scoped deep clone banao**

[Pehle concept padho: Objects arrays and modern data transformations](javascript/07-modern-data-collections.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

clone(value) ka supported domain primitives, plain objects, arrays aur Date hai. Objects ke own enumerable string keys copy karo; symbol keys, functions, accessors aur custom instances reject karo. Cycles, repeated references aur sparse arrays preserve karo; input mutate na ho.

**Acceptance checks — demo mein dikhao:**

- obj.self=obj ka clone.self clone khud ho.
- {a:shared,b:shared} mein cloned a===b, lekin original shared se different ho.
- Sparse array holes/length aur Date timestamp preserve hon; getter execute na ho.

**Hint — atakne par padho:** Recursion se pehle clone identity memoize karo.

**Answer guide — attempt ke baad compare karo:** WeakMap original->clone rakho. Type/descriptor validation karke container allocate, memoize, phir data properties copy karo. Array length preserve karke sirf existing indices/keys define karo. Date timestamp se new instance banao; special types ko silently plain object mat banao. Object.defineProperty se own data keys copy karna __proto__ setter trap se bacha sakta hai. Scope explicitly limited hai, full structured cloning replacement nahi.

**Interviewer follow-up:** Map aur Set add karne par object keys aur shared identity kaise preserve hogi?

### iq-machine-async-memo

**Machine coding: Async memoization with expiry aur in-flight dedupe banao**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

memoAsync(load,ttl,clock) primitive string key accept kare. Same key ke pending calls one load share karein. TTL successful completion se start ho; reject cache se remove ho. invalidate(key) old pending result ko nayi entry overwrite na karne de.

**Acceptance checks — demo mein dikhao:**

- Concurrent get(x) twice se load count 1 ho.
- Rejection ke baad get(x) fresh attempt kare.
- Invalidate, new load resolve, then old load resolve: cache mein new value hi rahe.

**Hint — atakne par padho:** Cached value ke saath entry identity rakho.

**Answer guide — attempt ke baad compare karo:** Map mein pending promise/entry token store karo. Success par entry ab bhi same hai tab expiresAt set karo; failure sirf own current entry remove kare. Pending entry par value TTL apply mat karo. Invalidate entry remove kare; old callers apna result paa sakte hain par shared cache overwrite na ho. Unbounded keys memory retain karengi, is drill ke next step mein capacity policy discuss karo.

**Interviewer follow-up:** Per-user authorization-dependent response cache mein key design kya hoga?

### iq-machine-retry-backoff

**Machine coding: Abortable retry helper banao**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

retry(operation,{maxAttempts,baseDelay,signal}) likho. First attempt immediate; delays baseDelay*2^(attempt-1) hon. Sirf error.retryable=true retry ho. Injectable sleep adapter use karo; abort queued wait aur future attempts roke.

**Acceptance checks — demo mein dikhao:**

- maxAttempts=3, first two transient failures: delays base,2*base aur third success ho.
- Permanent error par one call; maxAttempts=0 validation error ho.
- Backoff mein abort par next attempt na chale; timer/listener cleanup ho.

**Hint — atakne par padho:** Attempt counter aur abort reason ko business failure se separate rakho.

**Answer guide — attempt ke baad compare karo:** Loop mein operation ko signal pass karo, catch par abort/permanent/final-attempt branch pehle handle karo. Retry se pehle abort-aware sleep karo; settled wait listener cleanup kare. Max attempts total calls hain, extra retries nahi. Operation cancellation cooperate na kare toh in-flight effect stop hone ka claim mat karo; idempotent operation ya request key retry contract ka part honi chahiye.

**Interviewer follow-up:** Jitter aur Retry-After hint dono milen toh delay policy kaise define karoge?

### iq-machine-array-utils

**Machine coding: groupBy aur stable multi-key sorting utility banao**

[Pehle concept padho: Objects arrays and modern data transformations](javascript/07-modern-data-collections.md)

**Timebox:** 45 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

groupBy(items,keyFn) Map return kare. stableSortBy(items,comparators) first nonzero comparator use kare aur original array mutate na kare. Comparators synchronous total order dein; malformed comparator scope ke bahar hai.

**Acceptance checks — demo mein dikhao:**

- Keys __proto__ aur constructor normal Map keys ki tarah group hon.
- Same department/score wale items original order preserve karein.
- Empty input aur object-identity keys work karein; original array unchanged rahe.

**Hint — atakne par padho:** Grouping key ko string coercion se bachao aur tie-break index retain karo.

**Answer guide — attempt ke baad compare karo:** One pass Map buckets banao, original item references buckets mein rakho. Sort ke liye {value,index} decorate karo; comparators sequence mein evaluate aur complete tie par original index compare karo. Sorted values project karke return karo. Grouping O(n), comparison sort O(n log n) comparisons use karta hai; keyFn/comparator cost separately count karo.

**Interviewer follow-up:** Locale-aware strings aur missing numeric values ke ordering rules kaise add karoge?

### iq-machine-flatten-paths

**Machine coding: Flatten aur unflatten nested JSON paths banao**

[Pehle concept padho: Arrays objects and simple data modeling](javascript/06-js-arrays-objects.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Plain JSON objects ke string/number/boolean/null leaves ko [pathSegments,value] pairs mein flatten karo. Arrays unsupported aur reject; empty objects explicit {} leaf marker hon. unflatten inverse ho; dangerous prototype segments reject karo.

**Acceptance checks — demo mein dikhao:**

- {"a.b":{"c":1}} key ko one segment maano, dot delimiter se split mat karo.
- Empty object aur null round-trip hon.
- Conflicting paths [a] aur [a,b], duplicate path aur __proto__ segment reject hon.

**Hint — atakne par padho:** Path string ki jagah segment array ambiguity remove karta hai.

**Answer guide — attempt ke baad compare karo:** DFS own entries par path copy karke emit karo. Empty container marker leaf scalar se distinguish karo. Reconstruction null-prototype containers/own checks use kare aur conflicting assignments validate kare. Duplicate/prefix paths detect karke partial success expose mat karo. Cycles JSON domain mein nahi; runtime object cyclic ho toh explicit reject karo. Serialization labels ko executable property expressions mat banao.

**Interviewer follow-up:** Arrays, escaped paths aur maximum nesting depth ko schema mein kaise include karoge?

### iq-machine-tiny-store

**Machine coding: Observable state store with batched updates banao**

[Pehle concept padho: Execution contexts scope and closures](javascript/09-scope-closures.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

createStore(initial) se getState, setState(updater), subscribe(listener), batch(fn) do. State immutable snapshots maana jayega. Listener snapshot iteration ho; Object.is-equal state par notify nahi. Nested batches outer completion par one notification dein.

**Acceptance checks — demo mein dikhao:**

- Two increments in one batch state +2 karein par listener once chale.
- Unsubscribe twice safe ho; subscribe during notify current snapshot mein na chale.
- Batch function throw kare toh already-applied state rahe aur outer cleanup ke baad notify ho.

**Hint — atakne par padho:** Batch depth aur dirty flag se notification lifecycle express karo.

**Answer guide — attempt ke baad compare karo:** State reference, ordered listeners aur depth counter rakho. setState updater result compare karke dirty mark kare; depth zero par notify karo. batch try/finally depth decrement kare, outer exit dirty snapshot publish kare. Notification se pehle dirty clear karo taaki nested updates lost na hon; reentrant writes queue karke recursive stack overflow avoid karo. Listener-error policy document karo.

**Interviewer follow-up:** Listener exception baaki subscribers ko starve na kare toh error reporting kaise change hogi?

## React — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Async autocomplete component banao](#iq-machine-autocomplete) — P1, 60 min
2. [Kanban task board with undo banao](#iq-machine-kanban) — P1, 75 min
3. [Sortable paginated editable React data grid banao](#iq-machine-data-grid) — P1, 90 min
4. [React file explorer with rename aur move banao](#iq-machine-file-explorer) — P1, 75 min
5. [Multi-step checkout form banao](#iq-machine-multi-step-form) — P2, 60 min
6. [Infinite feed with deduplication aur retry banao](#iq-machine-infinite-feed) — P2, 75 min
7. [React toast manager with pause aur queue banao](#iq-machine-toast-manager) — P2, 60 min
8. [Single-month React date range picker banao](#iq-machine-date-picker) — P2, 75 min
9. [Searchable transfer list with bulk selection banao](#iq-machine-transfer-list) — P2, 60 min
10. [Fixed-height virtualized list banao](#iq-machine-virtual-list) — P2, 75 min
11. [React tic-tac-toe with move history banao](#iq-machine-tic-tac-toe) — P2, 60 min

### iq-machine-autocomplete

**Machine coding: Async autocomplete component banao**

[Pehle concept padho: React machine coding and identity bugs](react/11-machine-coding.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

React mein local fake search adapter ke saath autocomplete banao. Query length >=2, 250ms debounce, loading/empty/error/retry states aur keyboard selection chahiye. Label duplicate ho sakta hai; item IDs unique hain.

**Acceptance checks — demo mein dikhao:**

- A-query slow aur AB-query fast ho toh current query ka result hi dikhe.
- Arrow keys, Enter, Escape aur pointer selection chale; input labeled ho.
- Clear/unmount par late response results wapas na laaye; rejected search retry ho.

**Hint — atakne par padho:** Query, selected item aur response ownership ko separate rakho.

**Answer guide — attempt ke baad compare karo:** Controlled input aur stable IDs rakho; effect cleanup request cancel kare aur sequence/query guard current response ko commit kare. Debounce request count reduce karta hai, races solve nahi. Active option index query/result change par reset karo. Complete combobox keyboard/ARIA behavior implement karo, composition ke beech Enter selection avoid karo. Loading/error sirf current request update kare.

**Interviewer follow-up:** Query cache add karne par expired results aur background refresh ko user ko kaise dikhaoge?

### iq-machine-kanban

**Machine coding: Kanban task board with undo banao**

[Pehle concept padho: State snapshots forms and immutable updates](react/02-state-forms.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

React local-state board mein Todo/Doing/Done columns, add/edit/delete, move controls aur last delete ka undo banao. Stable task IDs aur local persistence do. Drag-and-drop stretch hai; keyboard move buttons required hain.

**Acceptance checks — demo mein dikhao:**

- Same-title tasks independent edit/move hon; blank title reject ho.
- Delete then undo original task aur column restore kare.
- Reload state restore kare; corrupt saved data par usable empty board aaye.

**Hint — atakne par padho:** Entity records aur column ordering ko explicit model karo.

**Answer guide — attempt ke baad compare karo:** Tasks by ID aur ordered column IDs rakho; reducer operations se one-column-per-task invariant maintain karo. Undo snapshot mein deleted entity, column aur index store karo; restore par bounded insertion index use karo. Storage parsing ko try/catch aur shape validation do, failed write se in-memory board na todo. Accessible move buttons drag interaction ke equivalent route dein.

**Interviewer follow-up:** Undo ke pehle target column delete ho sakta ho toh restoration contract kya hoga?

### iq-machine-data-grid

**Machine coding: Sortable paginated editable React data grid banao**

[Pehle concept padho: React machine coding and identity bugs](react/11-machine-coding.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

50 local records {id,name,score} se table banao. Case-insensitive name filter, score sort, page size 10 aur inline name editing do. Filter/sort change page 1 reset kare; edits ID se attach hon. Draft tab tak rahe jab tak Save/Cancel ho.

**Acceptance checks — demo mein dikhao:**

- Row edit karke sort karne par draft same ID par rahe.
- Filtered result shrink ho toh nonexistent page na dikhe.
- Duplicate names, empty results aur invalid blank Save handle hon; keyboard edit chale.

**Hint — atakne par padho:** Source records, draft map aur derived visible IDs separate rakho.

**Answer guide — attempt ke baad compare karo:** Canonical records immutable update karo; draft IDs se store karo aur rows ko ID key do. Pipeline filter->stable sort->paginate ho, original array sort mat karo. Save validate karke only target entity update kare; Cancel sirf us draft ko clear kare. Sort controls aria-sort aur labels expose karein. Page bounds derive/clamp karo; index keys wrong row editor reuse kar sakti hain.

**Interviewer follow-up:** Server pagination add karne par unsaved off-page drafts aur stale responses kaise handle karoge?

### iq-machine-file-explorer

**Machine coding: React file explorer with rename aur move banao**

[Pehle concept padho: Components JSX and the render cycle](react/03-components-rendering.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

In-memory tree nodes {id,parentId,name,type} se explorer banao. Expand/collapse, create folder, rename, delete subtree aur Move-to-folder select control do. Same parent mein duplicate names reject; folder ko own descendant mein move na karo.

**Acceptance checks — demo mein dikhao:**

- Rename expanded folder se child state na lose ho.
- Move into descendant reject aur original tree unchanged ho.
- Delete subtree ke baad selection missing ID par na rahe; keyboard buttons work karein.

**Hint — atakne par padho:** Flat node map se ancestry check aur stable identity simplify karo.

**Answer guide — attempt ke baad compare karo:** Nodes normalized rakho; expanded IDs aur selected ID UI state hon. Move se pehle proposed parent ancestors walk karke cycle check karo aur duplicate sibling name validate karo. Delete descendants collect karke one state transition mein remove karo. Selection fallback parent/root par set karo. Visual tree role tabhi use karo jab full tree keyboard behavior implement ho; simple nested lists/buttons acceptable hain.

**Interviewer follow-up:** Lazy-loaded folders mein move validation server authority ke saath kaise coordinate hogi?

### iq-machine-multi-step-form

**Machine coding: Multi-step checkout form banao**

[Pehle concept padho: State snapshots forms and immutable updates](react/02-state-forms.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Contact, Address aur Review steps wala React form banao. Each step validation, Back navigation aur fake submit do. Card/payment details scope mein nahi. Submit failure par draft rahe; pending duplicate submit block ho.

**Acceptance checks — demo mein dikhao:**

- Invalid email par next step block ho; errors fields se associated hon.
- Back/Next se draft preserve ho; review latest fields dikhaye.
- Rejection ke baad retry chale; success confirmation ek baar dikhe.

**Hint — atakne par padho:** Form draft parent/reducer mein rakho, step components ko ownership clear do.

**Answer guide — attempt ke baad compare karo:** Single draft plus current step aur submit state rakho. Validation pure functions hon, step transition se pehle current fields check karo aur final submit par poora draft check karo. Derived review ko duplicate state mat banao. First error ko focus do; successful step change par heading focus manage karo. Async submit finally pending guard release kare aur failure values preserve kare.

**Interviewer follow-up:** Server field errors ko hidden previous step par map karke navigation kaise karoge?

### iq-machine-infinite-feed

**Machine coding: Infinite feed with deduplication aur retry banao**

[Pehle concept padho: Effects refs and reusable synchronization](react/05-effects-custom-hooks.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Fake cursor API se React feed banao. Load More required, intersection auto-load optional. Cursor page records overlap kar sakte hain; stable IDs dedupe karo. One in-flight request per feed generation; filter change resets generation.

**Acceptance checks — demo mein dikhao:**

- Double Load More same cursor twice request na kare.
- Failed page par existing items bachein aur retry same cursor use kare.
- Filter switch ke baad old response ignore ho; end cursor null par loading stop ho.

**Hint — atakne par padho:** Pagination cursor ko last response ownership se bind karo.

**Answer guide — attempt ke baad compare karo:** Current generation, next cursor aur pending state rakho; response matching generation par merge karo. Ordered IDs plus map duplicate records ko defined update policy se reconcile karein. Cursor success ke baad advance ho, failure par same cursor retry ho. Sentinel callback multiple fire ho sakti hai isliye UI disabled state alone enough nahi; request-level guard chahiye.

**Interviewer follow-up:** Feed ke top par new item insertion aaye toh scroll position kaise preserve karoge?

### iq-machine-toast-manager

**Machine coding: React toast manager with pause aur queue banao**

[Pehle concept padho: Effects refs and reusable synchronization](react/05-effects-custom-hooks.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Toast provider mein add/update/dismiss do; max 3 visible, FIFO waiting queue. Auto-dismiss duration visible hone par start ho. Hover ya keyboard focus par timer pause ho; manual close aur unmount cleanup chahiye.

**Acceptance checks — demo mein dikhao:**

- Fourth toast queued ho aur slot free hone par full duration mile.
- Two-second toast 500ms baad pause/resume ho toh remaining 1500ms rahe.
- Update/dismiss unknown ID no-op ho; close button labeled ho.

**Hint — atakne par padho:** Expiry deadline aur remaining duration ko elapsed time se derive karo.

**Answer guide — attempt ke baad compare karo:** Stable IDs, visible queue aur waiting queue maintain karo. Per-toast active timer ownership track karo; hover/focus ka combined paused flag use karo taaki one leave event doosra pause cancel na kare. Pause deadline se remaining compute kare, resume fresh deadline banaye. Live announcements severity ke hisaab se bounded rakho; har rerender par announcement repeat mat karo.

**Interviewer follow-up:** Same operation ke repeated progress updates announcement noise kaise avoid karenge?

### iq-machine-date-picker

**Machine coding: Single-month React date range picker banao**

[Pehle concept padho: State snapshots forms and immutable updates](react/02-state-forms.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Fixed supplied month/year ka calendar banao, start/end inclusive date selection do. Dates YYYY-MM-DD strings hain, times nahi. Disabled dates range ke beech bhi allowed nahi. Second earlier date new start banaye; Clear reset kare.

**Acceptance checks — demo mein dikhao:**

- Month weekday offset aur leap-year February correctly render hon.
- Disabled date ko include karta range reject ho aur prior valid selection preserve ho.
- Keyboard date selection aur labeled day controls hon; Clear dono endpoints remove kare.

**Hint — atakne par padho:** Calendar arithmetic ko UI transition se separate pure functions banao.

**Answer guide — attempt ke baad compare karo:** Year/month/day components se day cells generate karo; local/UTC conversions mix karke off-by-one mat lao. State empty/start-only/complete rakho. Candidate end par whole inclusive interval validate karo, phir commit karo. Day buttons full date names expose karein; selected/start/end state visible aur announced ho. Full date-picker pattern claim karne se pehle arrow/focus navigation test karo.

**Interviewer follow-up:** Multiple months aur timezone-aware booking instants add hon toh date-only boundary kahan convert hogi?

### iq-machine-transfer-list

**Machine coding: Searchable transfer list with bulk selection banao**

[Pehle concept padho: State snapshots forms and immutable updates](react/02-state-forms.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Two lists of unique-ID users banao. Each side search, row selection aur Move selected controls de. Hidden selected rows preserved hon; Select all sirf currently filtered visible rows select kare. Each user exactly one side rahe.

**Acceptance checks — demo mein dikhao:**

- Same-name users independent select hon.
- Search hide kare selected user ko, Move selected still us user ko move kare.
- Repeated move duplicate user na banaye; selection moved IDs ke liye clear ho.

**Hint — atakne par padho:** Location aur selection ko labels ki jagah IDs se model karo.

**Answer guide — attempt ke baad compare karo:** One entity map aur side membership sets rakho. Filter derived ho; selection sets source state hon. Bulk move selected membership intersection compute karke one transition mein source remove/destination add kare. Select-all tri-state visible subset se derive karo. Result count/status announce karo aur move ke baad focus usable control par rahe.

**Interviewer follow-up:** Server permission reject kare kuch users ko toh partial move result ka UI kya hoga?

### iq-machine-virtual-list

**Machine coding: Fixed-height virtualized list banao**

[Pehle concept padho: Performance suspense and production quality](react/10-performance-production.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

React mein 10,000 rows, fixed height 32px, viewport 320px aur overscan 3 rows per side ke saath virtual list banao. Scroll-to-index button do. Row heights dynamic aur inline editing scope ke bahar hain.

**Acceptance checks — demo mein dikhao:**

- Middle viewport mein at most 16 row nodes render hon.
- Index 9999 par scroll last row visible kare aur blank gap na aaye.
- Empty list aur data shrink par scroll/index clamp ho.

**Hint — atakne par padho:** Total spacer height aur visible slice offset separate hain.

**Answer guide — attempt ke baad compare karo:** Start=floor(scrollTop/rowHeight), end viewport se derive karke overscan bounds clamp karo. Full-height spacer ke andar slice ko start*height offset do; stable IDs keys hon. Scroll-to-index ko valid range clamp karo. DOM count aur scroll position test karo; virtualization browser find/accessibility navigation ko affect karti hai, isliye row position metadata aur deliberate focus strategy do.

**Interviewer follow-up:** Dynamic heights mein measurement cache aur prefix sums kaise help karenge?

### iq-machine-tic-tac-toe

**Machine coding: React tic-tac-toe with move history banao**

[Pehle concept padho: State snapshots forms and immutable updates](react/02-state-forms.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

3x3 game banao: alternating X/O, win/draw detection, restart aur jump-to-move history. Old move se new move karne par future branch discard ho. Occupied cell aur finished game par click no-op ho.

**Acceptance checks — demo mein dikhao:**

- Top row X win par next click state na badle.
- Nine-move draw announce ho; restart blank board kare.
- Move 2 par jump then play se old future history remove ho.

**Hint — atakne par padho:** Board snapshot history rakho, derived winner ko separately synchronize mat karo.

**Answer guide — attempt ke baad compare karo:** Immutable boards ka history array aur selected move index rakho. New move history.slice(0,index+1) se branch banaye. Turn move parity se derive karo; win lines pure helper check kare. Cell buttons coordinate aur current value accessible label dein. Winner/draw status live region mein ho. Mutating existing snapshot time travel ko corrupt karega.

**Interviewer follow-up:** N-by-N board aur K-in-a-row rule par winner detection complexity kaise badlegi?

## Redux — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Redux shopping cart with stock limits banao](#iq-machine-shopping-cart) — P1, 60 min
2. [Redux optimistic todo updates with rollback banao](#iq-machine-optimistic-todos) — P1, 75 min
3. [Redux undo/redo document editor banao](#iq-machine-undo-editor) — P1, 60 min
4. [Redux async search with request ownership banao](#iq-machine-request-search) — P1, 75 min
5. [Redux normalized issue tracker selectors banao](#iq-machine-normalized-issues) — P2, 60 min
6. [Redux product filters synchronized with URL banao](#iq-machine-filter-url) — P2, 75 min
7. [Redux offline mutation queue banao](#iq-machine-offline-actions) — P2, 90 min
8. [Redux session change and cache reset banao](#iq-machine-auth-reset) — P2, 75 min
9. [Redux normalized paginated entities cache banao](#iq-machine-entity-pagination) — P2, 75 min
10. [Redux audit middleware with redaction banao](#iq-machine-middleware-audit) — P2, 60 min
11. [Redux approval workflow state machine banao](#iq-machine-finite-workflow) — P2, 75 min

### iq-machine-shopping-cart

**Machine coding: Redux shopping cart with stock limits banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Redux/Redux Toolkit mein local catalog aur cart banao. Prices integer paise mein hain; add/remove/setQuantity aur subtotal selector do. Quantity integer 1..stock hai, remove separate operation. Invalid quantity state change na kare.

**Acceptance checks — demo mein dikhao:**

- Same product twice add par one line with quantity 2 ho.
- Stock=2 par third add reject/no-op ho; invalid negative quantity unchanged rahe.
- 1999 paise x2 + 500 paise x1 ka subtotal 4498 ho.

**Hint — atakne par padho:** Cart identity product ID se banao aur total derive karo.

**Answer guide — attempt ke baad compare karo:** Product IDs se quantities map karo; reducer boundaries par stock/quantity rules enforce karo. Catalog lookup se selector total calculate kare, total field manually synchronize mat karo. UI rejected operation ka feedback de. Reducer tests mein old state unchanged verify karo; Toolkit draft syntax use karo toh plain reducer mutation se distinction samjho. Checkout par server price/stock final authority rahe.

**Interviewer follow-up:** Cart refresh par price badal jaaye toh user confirmation ka flow kya hoga?

### iq-machine-optimistic-todos

**Machine coding: Redux optimistic todo updates with rollback banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Redux app mein fake async adapter se todo status toggle karo. UI immediate update ho. Per todo at most one request allow karo; pending same-row control disable ho, different rows independent hon.

**Acceptance checks — demo mein dikhao:**

- Success optimistic value confirm kare; failure sirf affected row rollback kare.
- Row A fail aur row B succeed: B ka success preserve ho.
- Pending A par second toggle request na bheje; error ke baad retry chale.

**Hint — atakne par padho:** Whole-list backup ki jagah per-entity mutation snapshot rakho.

**Answer guide — attempt ke baad compare karo:** Each entity ke pending request ID, prior value aur error store karo. Start par snapshot aur optimistic update ek transition mein karo. Fulfilled/rejected response ko matching request ID se apply karo; row-level pending guard enforce karo. Failure par sirf matching row ki prior value restore karo. Full-state rollback unrelated successful changes erase karega. Server refresh overlapping ho toh ownership policy separately define karo.

**Interviewer follow-up:** Same row ke rapid parallel edits allow karne par serialization ya versioning kaise add karoge?

### iq-machine-undo-editor

**Machine coding: Redux undo/redo document editor banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Redux app mein plain text editor with setText,undo,redo banao. Each committed edit history entry ho; commit button use karo, keystrokes local draft. Max50 past snapshots, new edit after undo future clear kare.

**Acceptance checks — demo mein dikhao:**

- A->B->C undo twice A, redo once B ho.
- Undo to B then commit D: redo unavailable ho.
- No-op same-text commit history add na kare; cap50 oldest snapshots evict kare.

**Hint — atakne par padho:** History ko past/present/future state mein express karo.

**Answer guide — attempt ke baad compare karo:** Reducer commit par current present past mein push, cap trim aur future clear kare. Undo latest past ko present aur old present future front mein move kare; redo reverse operation ho. Editor local draft selected present change se reset ho with explicit unsaved discard policy. Selectors availability derive karein, separately flags maintain mat karo. Snapshots immutable hon.

**Interviewer follow-up:** Large documents ke liye snapshots se patches par shift mein inverse operations kaise validate karoge?

### iq-machine-request-search

**Machine coding: Redux async search with request ownership banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Redux query page fake API se users search kare. Query update request start kare; state currentRequestId/query/status/items/error rakhe. Old response current results/loading overwrite na kare. Debounce optional, correctness required.

**Acceptance checks — demo mein dikhao:**

- Slow query A aur fast B ke baad only B visible ho.
- Old request rejection B success ko error mein convert na kare.
- Clear query pending generation invalidate kare, late results absent rahein.

**Hint — atakne par padho:** Reducer fulfilled/rejected actions ko owner ID se gate karo.

**Answer guide — attempt ke baad compare karo:** Pending action new request ID establish kare; async middleware/thunk adapter load invoke kare. Fulfilled/rejected action matching current ID ho tab state transition kare. Query clear ID reset kare. Cancellation work save kare, identity guard correctness protect kare. Derived UI status use karo; abort ko user-visible server error banana avoid karo.

**Interviewer follow-up:** Cache keyed by query add karoge toh active view ownership aur cache population kaise separate honge?

### iq-machine-normalized-issues

**Machine coding: Redux normalized issue tracker selectors banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux mein users aur issues by ID store karo. Issue {id,assigneeId,status,title} hai. Assignee/status filters, reassignment aur visible-count selector do; missing user ko Unassigned dikhao.

**Acceptance checks — demo mein dikhao:**

- User rename ke baad sab related rows latest name dikhayein.
- Reassignment ke baad filtered row correctly enter/exit ho.
- Status filter change source entities mutate na kare; unknown assignee crash na kare.

**Hint — atakne par padho:** Joined display data selectors se derive karo, issue mein user name duplicate mat karo.

**Answer guide — attempt ke baad compare karo:** Entities normalized rakho aur filters ko UI state mein store karo. Selector IDs filter kare aur user map join karke display banaye. Reference-stable inputs par memoization use karo jab repeated work measurable ho. Mutation/reducer immutable update kare taaki selectors invalidation samjhein. User delete par fallback policy explicit rakho; derived visible arrays ko independent persisted state banana sync bugs deta hai.

**Interviewer follow-up:** 10,000 issues ke saath selector recomputation aur render cost kaise separately measure karoge?

### iq-machine-filter-url

**Machine coding: Redux product filters synchronized with URL banao**

[Pehle concept padho: Routing nested layouts and URL state](react/06-routing-url-state.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux product view mein category,sort,page URL committed source of truth ho. Search text local draft Apply par commit ho. Back/Forward state restore kare; invalid page default1, unknown sort defaultname. Filters change page1 kare.

**Acceptance checks — demo mein dikhao:**

- Share URL reload same filtered state de.
- Apply one history entry create kare; Back prior filters restore kare.
- URL->store update effect URL rewrite loop na banaye.

**Hint — atakne par padho:** One canonical parser/serializer aur navigation event ownership rakho.

**Answer guide — attempt ke baad compare karo:** Parse URL to validated filter state on initial load/navigation. User Apply route update kare; route subscription store projection dispatch kare. Same canonical state compare karke duplicate navigation avoid karo. Local search draft navigation par documented reset kare. Server response ownership filters key se guard karo. Store aur URL dono independent authority honge toh synchronization loops aayenge.

**Interviewer follow-up:** ReplaceState versus pushState typing, pagination aur reset mein kab use karoge?

### iq-machine-offline-actions

**Machine coding: Redux offline mutation queue banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux todos mein offline add queue karo. Durable local-storage adapter schema validation ke saath queue persist kare; network adapter idempotent mutationId accept kare. Replay serial order, permanent failure item blocked, later items paused until discard/retry.

**Acceptance checks — demo mein dikhao:**

- Offline two adds reload ke baad pending rahein.
- Lost acknowledgment retry same mutationId bheje aur server duplicate todo na banaye.
- Invalid persisted JSON app crash na kare; storage failure unsaved status dikhaye.

**Hint — atakne par padho:** Optimistic entity ID aur stable server mutation identity map karo.

**Answer guide — attempt ke baad compare karo:** Queue records serializable pending/sending/blocked statuses rakhein. Reload sending ko retryable pending normalize kare. Worker one item send kare, success server ID reconcile aur durable queue removal kare. Persistence failure surface karo; in-memory optimistic success ko durable save mat bolo. Reducer network/storage side effects se pure rahe, middleware adapter operations own kare.

**Interviewer follow-up:** Offline edit conflicts server version se milen toh overwrite/merge/manual recovery ka UI kya hoga?

### iq-machine-auth-reset

**Machine coding: Redux session change and cache reset banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux app fake login/logout adapter use kare. User profile aur private documents separate slices hon; logout global session generation increment kare aur private state clear kare. Auth secrets store/persist nahi; adapter owns session.

**Acceptance checks — demo mein dikhao:**

- User A logout then B login: A private docs never appear.
- A pending fetch completion B session store populate na kare.
- Persisted nonprivate theme remain ho, private data reload se restore na ho.

**Hint — atakne par padho:** Global session generation every private request ka ownership token hai.

**Answer guide — attempt ke baad compare karo:** Root reducer session-reset action private slices reset kare aur generation increase kare. Each async private action generation capture karke completion reducer guard lagaye. Abort pending requests optional efficiency hai; generation still needed. Persistence allowlist only safe preferences choose kare. UI route guard data authorization replace nahi karta, backend session authority separately required hai.

**Interviewer follow-up:** Multiple browser tabs logout synchronize karte waqt stale storage events kaise handle karoge?

### iq-machine-entity-pagination

**Machine coding: Redux normalized paginated entities cache banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux fake issues API pages queryKey/cursor se store karo. Entities map by ID aur each page ordered IDs ho. Entity version integer, newer replaces older. Same ID across pages one canonical object ho; invalidation marks pages stale.

**Acceptance checks — demo mein dikhao:**

- Page2 newer issue version update kare, Page1 render bhi latest entity use kare.
- Late Page1 old version canonical newer entity overwrite na kare.
- Invalidating one query other query page membership delete na kare.

**Hint — atakne par padho:** Entity freshness aur query membership freshness independent hain.

**Answer guide — attempt ke baad compare karo:** Normalized entity map merge per-ID version compare kare; page IDs incoming page order preserve karein. Page cache status/error/requestId separate rakho, matching request gate per page ho. Selector page IDs join kare; missing entity fallback loading/error policy explicit ho. Version-free merge last-arrival overwrite races create karega. Eviction referenced entities blindly remove na kare.

**Interviewer follow-up:** Delete tombstone newer version ke saath aaye toh stale pages deleted issue resurrect na karein, kaise?

### iq-machine-middleware-audit

**Machine coding: Redux audit middleware with redaction banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Redux middleware action type, timestamp aur changed top-level slice names record kare. Inject clock/sink, redact action payload sensitive keys password/token recursively. Max nesting10, cyclic payload safe marker. Reducers/sink exceptions ke outcomes explicit hon.

**Acceptance checks — demo mein dikhao:**

- Action passes next exactly once aur dispatch return value preserved ho.
- Reducer throw par failure audit entry ho, error caller tak propagate ho.
- Sink throw app dispatch failure mein convert na ho; secrets nested objects mein absent hon.

**Hint — atakne par padho:** Middleware wrapper observation kare, action object mutate na kare.

**Answer guide — attempt ke baad compare karo:** Before/after slice references compare karo; reducer error separately capture/rethrow karo. Redacted payload fresh bounded traversal se banao, WeakSet cycles mark kare. Audit sink guarded try/catch best-effort policy le. Timestamp injected clock se deterministic ho. Large action traversal overhead limit karo aur payload allowlist production alternative explain karo.

**Interviewer follow-up:** Immutable state requirement violate ho toh reference-based changed-slice audit kya miss karega?

### iq-machine-finite-workflow

**Machine coding: Redux approval workflow state machine banao**

[Pehle concept padho: Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Expense request UI mein draft->submitted->approved/rejected transitions Redux reducer se implement karo. Draft edit, submit, reviewer approve/reject aur rejected->draft revise do. Fake role context supplied; approved request immutable. Server authorization scope separate hai.

**Acceptance checks — demo mein dikhao:**

- Submitted state mein draft edit no-op/error ho.
- Requester approve action reject ho; reviewer rejection reason mandatory ho.
- Revise preserves values but clears review result; resubmit new revision increment kare.

**Hint — atakne par padho:** Allowed event table state aur role pair ke against validate karo.

**Answer guide — attempt ke baad compare karo:** One reducer transitions explicit switch/table se enforce kare, scattered UI flags se nahi. Entity status/revision/review fields consistent one transition mein update hon. Selector allowed actions derive kare; UI hide alone authority nahi. Async approval add karne par expected revision request mein bhejo aur stale response gate karo. Invalid action structured error outcome de without partial mutation.

**Interviewer follow-up:** Two reviewers opposite decisions simultaneously bhejein toh backend version check aur UI reconciliation kaise work karega?

## Node.js — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Express task REST API banao](#iq-machine-task-api) — P1, 75 min
2. [Backpressure-aware CSV export banao](#iq-machine-stream-export) — P1, 75 min
3. [Async middleware pipeline implement karo](#iq-machine-middleware-pipeline) — P1, 60 min
4. [Graceful shutdown HTTP server banao](#iq-machine-graceful-server) — P1, 75 min
5. [Idempotent webhook intake aur worker banao](#iq-machine-webhook-worker) — P2, 90 min
6. [Server-sent event notifications endpoint banao](#iq-machine-sse-notifications) — P2, 75 min
7. [Bounded file upload endpoint banao](#iq-machine-multipart-upload) — P2, 75 min
8. [CPU job worker-thread pool banao](#iq-machine-worker-pool) — P2, 90 min
9. [Resilient outbound HTTP client wrapper banao](#iq-machine-http-client-adapter) — P2, 75 min
10. [Same-key request coalescer banao](#iq-machine-request-coalescer) — P2, 60 min
11. [Node CLI task tracker with atomic file save banao](#iq-machine-local-cli) — P2, 60 min

### iq-machine-task-api

**Machine coding: Express task REST API banao**

[Pehle concept padho: Express REST APIs middleware and errors](mongodb/02-express-rest-errors.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node/Express mein in-memory task API banao: POST /tasks, GET /tasks?limit&after, PATCH /tasks/:id, DELETE /tasks/:id. title nonblank, status todo/done, limit 1..50 default 10. IDs monotonic integers; sorting ascending ID.

**Acceptance checks — demo mein dikhao:**

- Create 201; malformed title/status 400; unknown ID 404.
- after cursor ke baad strict greater IDs aayein; invalid cursor 400.
- Failed patch existing task ko partially mutate na kare; delete ke baad GET list se task hate.

**Hint — atakne par padho:** Validation aur mutation ke beech clear boundary rakho.

**Answer guide — attempt ke baad compare karo:** Router parsing/validation kare, service task rules aur repository data access own kare. Patch ke supplied fields allowlist karke full proposed value validate karo, tab commit karo. Cursor ko numeric ID parse karke strict greater filter/sort/limit apply karo. Central error middleware se stable JSON shape do. In-memory IDs restart par reset honge; drill ko durable production API mat bolo.

**Interviewer follow-up:** Multiple processes aur persistent database ke saath IDs/pagination contract kaise migrate karoge?

### iq-machine-stream-export

**Machine coding: Backpressure-aware CSV export banao**

[Pehle concept padho: MongoDB query plans and Node streaming lab](mongodb/06-query-production-lab.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node HTTP endpoint se async record generator ka CSV stream banao; external DB optional hai. Fields id,name hain. CSV comma/quote/newline escaping, client disconnect cleanup aur bounded buffering chahiye.

**Acceptance checks — demo mein dikhao:**

- name mein comma, quote aur newline ka valid CSV bane.
- Slow writable ke saath producer drain se pehle unbounded next records na pull kare.
- Disconnect par generator cleanup ho; stream error response headers ke baad second JSON response na bheje.

**Hint — atakne par padho:** Writable capacity aur upstream iterator cleanup ko first-class banao.

**Answer guide — attempt ke baad compare karo:** CSV encoder quote-containing/comma/newline fields ko quote kare aur embedded quotes double kare. Async iteration ko backpressure-respecting pipeline se jodo ya write false par drain/close/error wait karo. Abort par upstream iterator return/cleanup karo. Headers bhejne se pehle failure ko normal HTTP error banao; later failure stream terminate kare aur log ho. Saare records array mein materialize karna streaming defeat karega.

**Interviewer follow-up:** Spreadsheet formula injection ke liye raw export aur spreadsheet-safe mode ka contract kya hoga?

### iq-machine-middleware-pipeline

**Machine coding: Async middleware pipeline implement karo**

[Pehle concept padho: Express REST APIs middleware and errors](mongodb/02-express-rest-errors.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Plain Node mein compose(middlewares)(context) banao; each middleware async (ctx,next). Onion order support ho, next() max once per middleware. Middleware next na call kare toh short-circuit. Error caller tak propagate ho; Express use nahi.

**Acceptance checks — demo mein dikhao:**

- A-before,B-before,B-after,A-after order verify ho.
- Same middleware next twice call kare toh clear rejection ho.
- Inner rejection upstream try/catch se handle ho; empty pipeline resolves.

**Hint — atakne par padho:** Dispatch index monotonic rakho aur returned promises await karo.

**Answer guide — attempt ke baad compare karo:** Dispatch(i) next function ko dispatch(i+1) return kare; last dispatched index guard repeated next reject kare. Promise.resolve boundary sync throws ko rejection mein normalize kare. Middleware contract next await/return karne ka ho, warna parent completion prematurely resolve ho sakti hai. Context mutations intentional shared request state hain; across invocations context reuse mat karo.

**Interviewer follow-up:** Cancellation aur per-middleware timing add karne par finally blocks kahan lagenge?

### iq-machine-graceful-server

**Machine coding: Graceful shutdown HTTP server banao**

[Pehle concept padho: Node API testing aur graceful shutdown — request se resource cleanup tak](mongodb/09-testing-shutdown.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node HTTP server mein /ready aur delayed /work endpoints banao. SIGTERM/shutdown call readiness false kare, new work reject kare, in-flight work max 2s drain kare, phir resources close hon. Inject shutdown trigger tests mein, real process kill required nahi.

**Acceptance checks — demo mein dikhao:**

- 500ms existing request shutdown ke baad complete ho sake.
- New request after shutdown rejected ya connection refused ho.
- Hung request deadline par terminate ho; repeated shutdown resource close twice na kare.

**Hint — atakne par padho:** Shutdown ko idempotent shared promise aur deadline se model karo.

**Answer guide — attempt ke baad compare karo:** Draining flag pehle set karo, server accepting stop karo aur in-flight counter/connection set track karo. Ready endpoint aur new accepted work flag consult karein. Deadline pending sockets/resources force close kare; DB adapter in-flight work ke drain ke baad close ho. Finally timers/listeners cleanup karo. Only process.exit immediately calling successful writes truncate kar sakta hai.

**Interviewer follow-up:** Keep-alive connections aur background jobs ko same drain budget mein kaise include karoge?

### iq-machine-webhook-worker

**Machine coding: Idempotent webhook intake aur worker banao**

[Pehle concept padho: SSR uploads payments email and deployment](mongodb/08-production-integrations.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node API aur persistent store se fake payment event intake banao. eventId unique, orderId aur status=paid payload hai. Same ID/same payload replay accepted ho; same ID/different payload conflict ho. Real payments/signature setup scope ke bahar hai; adapter trusted fixture use kare.

**Acceptance checks — demo mein dikhao:**

- Same event parallel do baar aaye toh one durable event aur one paid transition ho.
- Persist ke baad response se pehle crash simulate karke retry safe ho.
- Worker failure pending event ko retryable rakhe; replay bad payload 409 de.

**Hint — atakne par padho:** HTTP receipt aur business processing ko durable event identity se connect karo.

**Answer guide — attempt ke baad compare karo:** Unique event ID ke saath canonical payload/fingerprint persist karo aur durable receipt ke baad acknowledge karo. Worker pending event atomically claim kare. Order paid transition aur event processed marker same DB transaction mein commit karo; failure rollback/retry ho. Duplicate insert par stored payload compare karo. In-memory Set restart recovery nahi deta. External side effect ho toh downstream idempotency alag chahiye.

**Interviewer follow-up:** Worker claim ke baad crash ho toh lease aur duplicate delivery handling kaise recover karegi?

### iq-machine-sse-notifications

**Machine coding: Server-sent event notifications endpoint banao**

[Pehle concept padho: Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node HTTP mein SSE endpoint aur fake event source banao. Events IDs increasing, last 100 in-memory replay buffer, Last-Event-ID resume. Older-than-buffer ID par explicit reset event do. Heartbeats aur disconnect cleanup required.

**Acceptance checks — demo mein dikhao:**

- Reconnect lastID=7 par only newer buffered events aayein.
- Two concurrent clients independent receive karein; disconnect listener count restore kare.
- Slow writable per-client buffer bound exceed kare toh connection close ho, memory grow na kare.

**Hint — atakne par padho:** Event framing aur subscriber lifecycle ko one cleanup path do.

**Answer guide — attempt ke baad compare karo:** SSE fields newline framing se encode karo, multiline data each line prefix ho. Connection register aur replay watermark coordination gap avoid kare. Heartbeat timer, listener aur pending buffer cleanup close/error par idempotently karo. write backpressure respect karo; bounded buffer overflow documented reconnect/reset policy trigger kare. In-memory history restart durable replay guarantee nahi deta.

**Interviewer follow-up:** Multiple Node instances par replay ordering aur fan-out kis shared component ko doge?

### iq-machine-multipart-upload

**Machine coding: Bounded file upload endpoint banao**

[Pehle concept padho: SSR uploads payments email and deployment](mongodb/08-production-integrations.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node/Express multipart upload parser adapter use karke one file max 2MiB accept karo. Stream to temporary storage with generated filename; success metadata ID/size return kare. Allowed type fixture text/plain only; malware scanning scope ke bahar.

**Acceptance checks — demo mein dikhao:**

- Oversized stream reject ho aur partial temporary file cleanup ho.
- Client disconnect parser/storage resources close kare.
- ../../name.txt storage path escape na kare; two uploads same name collide na hon.

**Hint — atakne par padho:** Byte limit streaming path mein enforce karo, final file size check alone late hai.

**Answer guide — attempt ke baad compare karo:** Multipart parser configured field/file/count/byte limits se use karo; body ko whole buffer mat banao. Server-generated IDs/path aur exclusive temp creation rakho. Parser errors/abort/storage failure one cleanup routine invoke karein. Success only flushed/closed stored object ke baad report ho. Client MIME/name trusted content proof nahi; drill type policy limited hai.

**Interviewer follow-up:** Object storage direct uploads mein finalize validation aur abandoned object cleanup kaise chalega?

### iq-machine-worker-pool

**Machine coding: CPU job worker-thread pool banao**

[Pehle concept padho: Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node worker_threads pool with 2 workers aur max waiting queue 5 banao. Job is countPrimes(n), n validated <=100000. submit promise result de; queue full explicit busy error. Worker crash current job reject kare aur replacement spawn ho.

**Acceptance checks — demo mein dikhao:**

- Long CPU work ke dauraan main-thread health request responsive rahe.
- Eight simultaneous jobs: two active, five waiting, eighth busy ho.
- Worker termination pending promise settle kare, next job replacement par chale.

**Hint — atakne par padho:** Job ownership worker ID aur request ID se bind karo.

**Answer guide — attempt ke baad compare karo:** Idle workers queue, waiting jobs aur in-flight ownership map rakho. Dispatch par unique ID bhejo; response only matching job settle kare. Exit/error handler current job reject aur worker replace kare; duplicate error/exit events double settlement/refill na karein. Shutdown new submissions reject kare aur chosen drain/cancel policy follow kare. Unbounded worker per request CPU/memory exhaust karega.

**Interviewer follow-up:** Timeout par synchronous CPU job ko truly cancel karne ke liye worker lifecycle kaise change hogi?

### iq-machine-http-client-adapter

**Machine coding: Resilient outbound HTTP client wrapper banao**

[Pehle concept padho: Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Injected fetch adapter se JSON client banao. 500ms per-attempt timeout, max2 attempts; only GET network errors/503 retry. POST auto-retry forbidden. Body maximum 64KiB via bounded reader, non-JSON response controlled error. Fake adapter tests use karo.

**Acceptance checks — demo mein dikhao:**

- GET 503 then 200: two attempts; POST503: one.
- Headers fast/body hung still timeout ho; oversized body abort ho.
- Caller abort while waiting future attempt roke; timers/listeners cleanup hon.

**Hint — atakne par padho:** Timeout scope response body read tak cover kare.

**Answer guide — attempt ke baad compare karo:** Per-attempt abort controller ko caller signal se coordinate karo aur timer finally clear karo. Status handling se pehle bounded body consumption/cancellation policy rakho; JSON parse failures retryable network error se separate hon. Retry loop method/status allowlist consult kare. Headers milte hi timer clear karna hung body ko unlimited time dega. Request credentials/error logging redact karo.

**Interviewer follow-up:** Global total deadline aur per-attempt timeout dono hon toh remaining budget kaise propagate karoge?

### iq-machine-request-coalescer

**Machine coding: Same-key request coalescer banao**

[Pehle concept padho: Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node service mein coalesce(key,load) sirf in-flight calls share kare; settled response cache nahi hota. Each caller apna AbortSignal de sakta hai; one caller abort others ka result cancel na kare. All subscribers gone ho toh underlying cooperative load abort ho.

**Acceptance checks — demo mein dikhao:**

- Two same-key clients one load start karein.
- A abort, B alive: B success receive kare.
- All abort then new caller aaye toh fresh load start ho; old finalizer new entry na remove kare.

**Hint — atakne par padho:** Shared load lifetime aur individual waiter promises separate hain.

**Answer guide — attempt ke baad compare karo:** Entry mein controller, unique token aur active subscribers store karo. Per-waiter abort listener sirf own promise reject/remove kare; last waiter par entry retire karke load abort karo. Completion matching entry token par registry cleanup kare aur active waiters settle kare. Load rejection handled ho even zero subscribers bach gaye hon. Settled cache intentionally absent hai.

**Interviewer follow-up:** Per-tenant keys aur maximum in-flight entries se memory/isolation kaise bound karoge?

### iq-machine-local-cli

**Machine coding: Node CLI task tracker with atomic file save banao**

[Pehle concept padho: Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node CLI add/list/done/remove commands se JSON file task store banao. Stable IDs, nonblank title aur useful exit codes chahiye. Single process at a time scope; filesystem adapter tests use karo. Missing file empty store, corrupt file error aur no overwrite.

**Acceptance checks — demo mein dikhao:**

- Add two same-title tasks distinct IDs de; done only supplied ID update kare.
- Failed write old valid store preserve kare.
- Unknown command/ID nonzero exit ho, malformed JSON silently reset na ho.

**Hint — atakne par padho:** Parse/validate/compute/save steps separate rakho.

**Answer guide — attempt ke baad compare karo:** Arguments explicit parser se read karo; persisted schema/version validate karo. Next state calculate karke same-directory temporary file write/flush/close aur atomic rename adapter use karo. Error par temp cleanup aur old file preserve ho. Parent directory/path config resolve karo; shell command construction ki zaroorat nahi. Concurrent process safety assumption document karo.

**Interviewer follow-up:** Two simultaneous CLI processes support karne par lost updates kaise prevent karoge?

## Java — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Parking lot low-level design implement karo](#iq-machine-parking-lot) — P1, 75 min
2. [Expense sharing ledger implement karo](#iq-machine-splitwise) — P1, 75 min
3. [Library lending service implement karo](#iq-machine-library-system) — P1, 75 min
4. [Bounded blocking queue implement karo](#iq-machine-bounded-blocking-queue) — P1, 75 min
5. [Vending machine state machine banao](#iq-machine-vending-machine) — P2, 60 min
6. [Streaming log analyzer with top errors banao](#iq-machine-log-aggregator) — P2, 60 min
7. [Cancellable delayed task scheduler banao](#iq-machine-delayed-scheduler) — P2, 90 min
8. [Atomic account transfer service banao](#iq-machine-threadsafe-bank) — P2, 75 min
9. [Checkout pricing engine with coupons banao](#iq-machine-strategy-pricing) — P2, 60 min
10. [Key-value store with snapshot transactions banao](#iq-machine-snapshot-kv) — P2, 90 min
11. [Snakes and ladders game engine banao](#iq-machine-board-game-engine) — P2, 60 min

### iq-machine-parking-lot

**Machine coding: Parking lot low-level design implement karo**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Java console/library mein single-level parking lot banao: park(vehicleId,type), unpark(ticketId), available(type). Fixed car/bike spots hain; same-type allocation only, smallest free spot ID choose karo. Active vehicle dobara park na ho; duplicate unpark no-op ho.

**Acceptance checks — demo mein dikhao:**

- Capacity 1 par second car reject ho; bike capacity independent rahe.
- Unpark ke baad spot reuse ho; old ticket new occupant ko release na kare.
- Two concurrent park calls last spot ke liye aayein toh sirf one succeeds.

**Hint — atakne par padho:** Spot identity, vehicle identity aur parking session identity alag hain.

**Answer guide — attempt ke baad compare karo:** Immutable vehicle/ticket records aur spot occupancy map rakho; allocation service mein lock ke under availability check, ticket create aur occupancy update karo. Active vehicle index duplicate parking roke. Release exact active ticket match kare; stale ticket ko no-op rakho. Free spots sorted structure mein maintain kar sakte ho. God object se bachne ke liye allocation policy alag rakho, lekin atomic invariant multiple locks mein accidentally split mat karo.

**Interviewer follow-up:** Multiple floors aur fee calculation add karne par kaunsi policies replaceable hongi?

### iq-machine-splitwise

**Machine coding: Expense sharing ledger implement karo**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Java mein users, expenseId, payer aur participant shares se in-memory ledger banao. Amount integer paise; equal split aur explicit exact shares support karo. Equal split remainder sorted user IDs ko one paisa each mile. Same expense ID replay no-op, changed payload conflict.

**Acceptance checks — demo mein dikhao:**

- A pays 100 for A/B/C: shares A=34,B=33,C=33; net A=66,B=-33,C=-33.
- Exact shares ka sum amount se different ho toh no mutation ho.
- Duplicate replay balances dobara change na kare; all net balances ka sum zero rahe.

**Hint — atakne par padho:** Expense validate karke hi ledger delta apply karo.

**Answer guide — attempt ke baad compare karo:** Participants unique aur known hon; positive amount aur nonnegative shares validate karo. Canonical expense payload ID ke saath store karo. Payer net mein amount add aur participants se shares subtract karo; all deltas ek atomic operation mein apply karo. Equal split quotient/remainder se exact total preserve kare; floating money rounding avoid karo. Settlement suggestions net balances se derive ho sakti hain, historical debts replace karna alag policy hai.

**Interviewer follow-up:** Expense edit/delete aur concurrent duplicate requests ko atomic kaise banaoge?

### iq-machine-library-system

**Machine coding: Library lending service implement karo**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Java in-memory service mein titles, physical copies aur members model karo. borrow(memberId,copyId), returnLoan(loanId), activeLoans(memberId) do. Member max 3 active loans; copy max 1. Parallel operations supported hon.

**Acceptance checks — demo mein dikhao:**

- Same title ki two copies different members borrow kar sakein.
- Last allowed member slot ke liye concurrent calls limit exceed na karein.
- Old returned loan dobara return karne se new loan release na ho.

**Hint — atakne par padho:** Copy constraint aur member constraint same atomic boundary mein enforce karo.

**Answer guide — attempt ke baad compare karo:** Unique loan identity aur active-copy/member indexes rakho. One service lock simple correct starting point hai: validate both invariants, create loan aur indexes update under same lock. Return exact active loan check kare aur idempotent no-op ho. Fine-grained locks choose karo toh global ordering required hai. Book-title identity se lending track karoge toh multiple physical copies incorrectly conflict karengi.

**Interviewer follow-up:** Database implementation mein copy/member constraints aur lost response retries kaise preserve karoge?

### iq-machine-bounded-blocking-queue

**Machine coding: Bounded blocking queue implement karo**

[Pehle concept padho: Concurrency synchronization and virtual threads](java/15-concurrency.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Java generic queue mein put,take,close do; capacity positive, null forbidden. Library BlockingQueue use mat karo; locks/conditions allowed. Full put wait, empty take wait. close blocked producers reject kare; consumers remaining values drain karke closed result dein.

**Acceptance checks — demo mein dikhao:**

- Capacity 1 par second producer first take tak block ho.
- Close wake kare waiting producers/consumers; queued item lost na ho.
- Interrupted wait interrupt propagate kare aur queue invariant preserve rahe.

**Hint — atakne par padho:** Condition wakeup ko predicate true hone ki guarantee mat maano.

**Answer guide — attempt ke baad compare karo:** Ring buffer, count aur closed flag lock ke under rakho. while loops mein full/empty predicate recheck karo; await lock release/reacquire kare. Insert/remove opposite condition signal karein. Close lock ke under flag set aur signalAll kare. take ka terminal result empty-closed ko null data se distinguish kare, isliye null forbidden hai. finally unlock aur interrupt contract explicit rakho.

**Interviewer follow-up:** Fairness aur timed offer/poll add karne par remaining timeout kaise calculate karoge?

### iq-machine-vending-machine

**Machine coding: Vending machine state machine banao**

[Pehle concept padho: Objects OOP records and equality](java/07-object-model.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java in-memory vending machine mein selectItem, insertCoin, cancel aur dispense operations do. Prices/coins integer units hain. Assume unlimited change supply with coin 1 available; real hardware scope mein nahi. One customer session at a time.

**Acceptance checks — demo mein dikhao:**

- Insufficient credit par dispense reject ho, credit preserve rahe.
- Success par stock one decrement aur exact change mile; session reset ho.
- Cancel full credit refund kare; out-of-stock selection payment se pehle reject ho.

**Hint — atakne par padho:** Allowed transitions aur stock/credit invariant table se start karo.

**Answer guide — attempt ke baad compare karo:** Idle/selected/funded states aur session credit model karo. Invalid transitions explicit errors dein. Dispense pehle stock aur funds recheck karke one atomic in-memory transition mein stock decrement, change compute aur session reset kare. Cancel reset ke saath current credit return kare. Pricing/change algorithm ko state transitions se separate rakho. Physical dispensing failure include karoge toh refund/compensation state chahiye.

**Interviewer follow-up:** Limited coin inventory aaye toh greedy change kab fail hoga aur algorithm kya hoga?

### iq-machine-log-aggregator

**Machine coding: Streaming log analyzer with top errors banao**

[Pehle concept padho: Exceptions resources files and time](java/09-exceptions-io-time.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java Reader se line-delimited timestamp|service|level|message parse karo. UTC instant timestamps hain; message mein | allowed hai. Counts by service/level aur top 5 error messages return karo, ties lexical. Malformed line count karo, processing continue ho; max line length 4096.

**Acceptance checks — demo mein dikhao:**

- Three separators ke baad message ka remaining text preserve ho.
- Malformed date/oversized line counted ho, next valid line process ho.
- Empty input zero summary de; file ownership contract Reader caller close kare.

**Hint — atakne par padho:** Streaming lines aur bounded line parser alag resource concerns hain.

**Answer guide — attempt ke baad compare karo:** Character buffer se length cap enforce karke oversized line discard-until-newline karo; ordinary readLine already huge string allocate kar sakta hai. Split limit 4 ya explicit separators se parse karo, timestamp validation catch karo. Counts map aur deterministic top-k sort/heap use karo. Distinct message count unbounded ho sakti hai; is exact drill mein fixture bound document karo.

**Interviewer follow-up:** Unbounded distinct messages par exact top-k aur approximate heavy hitters ka tradeoff kya hai?

### iq-machine-delayed-scheduler

**Machine coding: Cancellable delayed task scheduler banao**

[Pehle concept padho: Java concurrency under real resource limits](java/16-concurrency-production.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java single dispatcher scheduler mein schedule(task,deadlineNanos), cancel(id), shutdown do. Inject monotonic clock/wakeup abstraction for tests. Task execution separate bounded executor par ho; executor full ho toh task failed mark ho, silently drop nahi.

**Acceptance checks — demo mein dikhao:**

- Earlier task insert hone par dispatcher old deadline tak sleep na kare.
- Cancel before dispatch task execute na kare; duplicate cancel safe ho.
- Shutdown pending tasks cancel kare aur waiting dispatcher wake ho.

**Hint — atakne par padho:** Deadline priority queue ko condition-wait loop se combine karo.

**Answer guide — attempt ke baad compare karo:** Lock-protected min-heap aur ID->state map rakho. Wait loop nearest deadline aur shutdown recheck kare; new earliest insertion signal de. Due task ko atomic pending->dispatched transition ke baad executor handoff karo. Cancel sirf pending state se win kare; already-running interrupt guarantee mat do. Task exception catch/report karo taaki dispatcher alive rahe.

**Interviewer follow-up:** Fixed-rate versus fixed-delay recurring jobs mein overrun behavior kaise define karoge?

### iq-machine-threadsafe-bank

**Machine coding: Atomic account transfer service banao**

[Pehle concept padho: Concurrency synchronization and virtual threads](java/15-concurrency.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java in-memory accounts mein integer paise balances rakho. transfer(from,to,amount) all-or-nothing ho, insufficient funds reject, negative/zero amounts invalid, same account no-op after validation. Parallel transfers supported hon; overflow reject karo.

**Acceptance checks — demo mein dikhao:**

- Concurrent A->B aur B->A bounded timeout mein complete hon, deadlock nahi.
- Failure par dono balances unchanged aur total sum conserved ho.
- Near-maximum long balance transfer overflow kare toh mutation na ho.

**Hint — atakne par padho:** Locks stable account ID order mein acquire karo.

**Answer guide — attempt ke baad compare karo:** Accounts validate karke lower ID lock phir higher ID lock lo. Under locks source funds aur destination exact-add overflow check karo, phir dono updates commit karo. Same-account branch before double lock handling explicit rakho. Reads consistent snapshot chahiye toh same locking discipline follow karein. Money floating point mein model mat karo; distinct invariant tests conservation aur nonnegative balance prove karein.

**Interviewer follow-up:** Crash-safe durable transfer mein in-memory locks ko kis database transaction boundary se replace karoge?

### iq-machine-strategy-pricing

**Machine coding: Checkout pricing engine with coupons banao**

[Pehle concept padho: Packages access control and interface boundaries](java/06-packages-interfaces.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java pricing library mein item subtotal, one coupon aur tax calculate karo. Money integer paise; coupon fixed or percent basis points 0..10000, discount subtotal tak capped. Percent discount floor, tax discounted subtotal par floor. Input immutable ho.

**Acceptance checks — demo mein dikhao:**

- Subtotal 10000, coupon 1000 basis points, tax 1800 basis points => discount 1000, tax 1620, total 10620.
- Oversized fixed coupon total negative na kare.
- Zero quantity/negative price reject; original cart unchanged rahe.

**Hint — atakne par padho:** Calculation order aur rounding contract strategy interface se pehle fix karo.

**Answer guide — attempt ke baad compare karo:** Validated immutable cart lines se subtotal exact arithmetic mein derive karo. Coupon strategy discount de, central service cap apply kare; tax policy discounted base par chale. Wider/exact intermediate arithmetic use karo taaki multiply overflow na ho. Result breakdown subtotal/discount/tax/total expose kare. Strategy extension business order ko implicitly change na kare.

**Interviewer follow-up:** Multiple stackable coupons aur line-level refunds mein rounding allocation kaise preserve hogi?

### iq-machine-snapshot-kv

**Machine coding: Key-value store with snapshot transactions banao**

[Pehle concept padho: Collections generics and choosing data structures](java/08-collections-generics.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java single-process string KV store mein begin,get,put,delete,commit,rollback do. Transaction reads begin snapshot plus own writes. First version mein global-version optimistic conflict: any intervening successful write commit causes conflict. Failed commit no partial writes ho.

**Acceptance checks — demo mein dikhao:**

- Transaction apni put/delete read kare; others uncommitted writes na dekhein.
- Two writers same base version se commit: first success, second conflict.
- Rollback unchanged global state de; closed transaction operations reject hon.

**Hint — atakne par padho:** Snapshot aur staged writes ko live map se detach karo.

**Answer guide — attempt ke baad compare karo:** Begin lock ke under map snapshot/version capture kare. Transaction overlay mein tombstone delete ko missing key se distinguish kare. Commit same lock mein base version compare, complete overlay apply aur version increment kare; read-only commit ko defined no-write path do. Yeh coarse conflict policy independent writes bhi reject karegi, lekin correctness clear hai. Full snapshot copy memory cost explain karo.

**Interviewer follow-up:** Per-key versions se unrelated writes allow karoge toh range-read phantom conflict kaise handle hoga?

### iq-machine-board-game-engine

**Machine coding: Snakes and ladders game engine banao**

[Pehle concept padho: Objects OOP records and equality](java/07-object-model.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Java console-independent engine mein 2–4 players, board 1..100, injected dice 1..6 aur start position 0 rakho. Overshoot par stay, exact 100 wins. Landing square ka at most one snake/ladder jump apply karo; mappings destination 1..100, source 1..99.

**Acceptance checks — demo mein dikhao:**

- Position 98 plus 4 stay 98 kare aur turn advance ho.
- Dice landing 5 with 5->20 jump player ko 20 le jaaye.
- Winner ke baad roll reject; invalid board/dice input state mutate na kare.

**Hint — atakne par padho:** Randomness aur game rules ko presentation se separate karo.

**Answer guide — attempt ke baad compare karo:** Game state positions/current player/status rakho, dice source dependency inject karo. Proposed move validate aur single configured jump apply karo, phir win check aur otherwise next turn. Mapping chain deliberately apply nahi hoti; board contract UI mein clear ho. Deterministic dice sequence se winner/overshoot/turn tests repeat karo. Domain class ko console scanner se couple mat karo.

**Interviewer follow-up:** Chained jumps aur configurable win rules introduce karoge toh cycle validation kahan hogi?

## Spring Boot — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Transactional inventory reservation API banao](#iq-machine-inventory-reservation) — P1, 90 min
2. [Room booking with overlap protection banao](#iq-machine-booking-api) — P1, 90 min
3. [Owner-scoped Spring Boot notes API banao](#iq-machine-secured-notes) — P1, 90 min
4. [Versioned document API with conflict response banao](#iq-machine-optimistic-document-api) — P1, 75 min
5. [Paginated sales report API aur SQL likho](#iq-machine-sql-report) — P2, 75 min
6. [CSV import with row errors aur batch commits banao](#iq-machine-csv-import-job) — P2, 90 min
7. [Transactional outbox publisher implement karo](#iq-machine-outbox-publisher) — P2, 90 min
8. [Cache-aside product read service banao](#iq-machine-cache-aside-api) — P2, 75 min
9. [Spring API integration test harness banao](#iq-machine-api-integration-tests) — P2, 75 min
10. [Soft delete with active-name uniqueness banao](#iq-machine-soft-delete-api) — P2, 75 min
11. [Keyset-paginated order history API banao](#iq-machine-keyset-orders) — P2, 75 min

### iq-machine-inventory-reservation

**Machine coding: Transactional inventory reservation API banao**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Spring Boot + SQL database mein POST /reservations banao: productId, positive quantity, requestId. Product stock nonnegative rahe. Unique requestId/same payload same reservation return kare; changed payload 409. Real DB concurrency test required hai.

**Acceptance checks — demo mein dikhao:**

- Stock 1, distinct request IDs se two parallel quantity=1 calls: exactly one succeeds.
- Same request retry stock dobara decrement na kare.
- Reservation insert fail par decrement rollback ho; invalid quantity 400 ho.

**Hint — atakne par padho:** Check-then-save ke bajay database-enforced atomic condition socho.

**Answer guide — attempt ke baad compare karo:** Transaction mein request identity unique constraint aur conditional stock update quantity<=available use karo; affected row count se success decide karo. Reservation aur stock change ek transaction mein commit hon. Duplicate-key exception ke baad failed transaction mein query continue mat karo; rollback ke baad separate read se canonical reservation/payload compare karo. H2-only happy path ki jagah target DB parallel integration test se invariant prove karo.

**Interviewer follow-up:** Expired reservation release ko duplicate scheduler runs ke against safe kaise banaoge?

### iq-machine-booking-api

**Machine coding: Room booking with overlap protection banao**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Spring Boot + PostgreSQL mein room booking API banao. roomId, start, end UTC instants hain; intervals [start,end) hain. Overlap reject ho; adjacent bookings allowed. Create aur cancel implement karo.

**Acceptance checks — demo mein dikhao:**

- [10:00,11:00) ke baad [11:00,12:00) allowed ho.
- Same room ke overlapping parallel inserts mein one succeeds, one 409 ho.
- end<=start invalid ho; cancel ke baad slot dobara book ho.

**Hint — atakne par padho:** Overlap condition aur per-room serialization transaction mein define karo.

**Answer guide — attempt ke baad compare karo:** ExistingStart < newEnd aur newStart < existingEnd overlap rule hai. Room row lock transaction ke start mein lo, phir active overlap query aur insert karo; sab create/cancel paths same room-lock discipline follow karein. PostgreSQL exclusion constraint alternative database guarantee de sakta hai. Transaction ke bahar overlap check race allow karta hai. Lock wait/timeout ko controlled response do aur UTC parsing clear rakho.

**Interviewer follow-up:** Multi-room booking mein deadlock risk reduce karne ke liye lock order kya hoga?

### iq-machine-secured-notes

**Machine coding: Owner-scoped Spring Boot notes API banao**

[Pehle concept padho: Spring Security and reliable service boundaries](spring-boot/07-security-microservices.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Spring Boot + SQL mein authenticated user-owned notes CRUD banao. Test authentication principal provided hai; login/password issuance scope ke bahar. User apni notes hi list/read/update/delete kar sake. Missing aur other-owner ID dono 404 dein; unauthenticated request 401.

**Acceptance checks — demo mein dikhao:**

- User A User B ka guessed ID read/update na kar sake.
- Request body ownerId spoof field reject ya ignore ho, owner principal se aaye.
- Blank title 400; successful update unrelated note na change kare.

**Hint — atakne par padho:** Repository query mein ownership predicate include karo.

**Answer guide — attempt ke baad compare karo:** Controller validated DTO le, service trusted principal ID use kare. findByIdAndOwner style lookup ya conditional owner-scoped update/delete enforce karo; frontend hidden buttons authorization nahi hain. List query bhi same predicate use kare. Security integration tests two principals aur anonymous client ke saath chalao. Error response entity existence leak na kare aur internal exception stack hide kare.

**Interviewer follow-up:** Admin sharing permission add karne par object-level authorization policy kaise evolve hogi?

### iq-machine-optimistic-document-api

**Machine coding: Versioned document API with conflict response banao**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Spring Boot/JPA + SQL mein GET document aur update(id,expectedVersion,text) banao. Response version include kare. Concurrent same-version updates mein one succeeds, one 409; lost update forbidden. Blank text reject karo.

**Acceptance checks — demo mein dikhao:**

- Version 3 ke two clients update karein toh one version 4 result, one conflict ho.
- Conflict response current text ko overwrite na kare.
- Missing ID 404, malformed version 400; persistence integration test race reproduce kare.

**Hint — atakne par padho:** Client precondition aur database version check dono chahiye.

**Answer guide — attempt ke baad compare karo:** Entity version field aur client expectedVersion compare karo; update transaction ke flush/commit par optimistic failure map karo. Comparison alone race-safe nahi, DB update version predicate required hai. Failure handler transaction ke bahar clean conflict DTO banaye. Client ko reload/merge option explain karo; automatic blind retry user ke newer text overwrite kar sakta hai.

**Interviewer follow-up:** ETag/If-Match HTTP contract choose karoge toh 409 aur 412 mapping kaise settle karoge?

### iq-machine-sql-report

**Machine coding: Paginated sales report API aur SQL likho**

[Pehle concept padho: Spring dependency injection and REST APIs](spring-boot/04-spring-rest.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot + SQL mein customers(id,name), orders(id,customer_id,status,created_at), order_items(order_id,quantity,unit_price_paise) seed karo. GET /reports/customers from/to UTC half-open range mein paid-order totals return kare. Zero-sales customers include karo; total descending then ID ascending, page size <=50.

**Acceptance checks — demo mein dikhao:**

- Customer A ke one paid order mein 2x100 aur 1x50: total 250, paidOrderCount 1 ho.
- Cancelled order exclude ho; no-order customer total/count 0 ho.
- Equal totals deterministic ID order mein aayein; invalid range reject ho.

**Hint — atakne par padho:** Item joins se order count multiply hone aur left join filter trap se bacho.

**Answer guide — attempt ke baad compare karo:** Pehle filtered paid orders ke item totals aggregate karo, phir customer totals/order counts derive karke customers se left join karo. COALESCE zero use karo; right-side paid/date predicates outer WHERE mein rakhoge toh zero-order customer drop hoga. Integer money aggregation ke liye sufficiently wide numeric type lo. Repository projection ko DTO map karo. Static fixture par offset pagination enough hai; live report snapshot consistency alag contract hai.

**Interviewer follow-up:** Large data par query plan aur order-date/status indexes kaise evaluate karoge?

### iq-machine-csv-import-job

**Machine coding: CSV import with row errors aur batch commits banao**

[Pehle concept padho: Spring background jobs aur caching — lifecycle aur ownership samjho](spring-boot/11-spring-background-cache.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot + SQL mein job submit/status API se small CSV product import banao. Fixture local file/object adapter use kare; CSV parsing maintained parser adapter se ho. Rows sku,name,pricePaise; batch 50 valid rows commit hon, invalid rows count/detail report hon. Same job restart already-committed row numbers skip kare.

**Acceptance checks — demo mein dikhao:**

- 120 valid rows mein third batch failure se first 100 durable rahein.
- Invalid price row error report kare, valid rows continue hon.
- Job replay same row product update dobara na apply kare; status totals consistent hon.

**Hint — atakne par padho:** Job checkpoint aur batch writes same transaction mein commit karo.

**Answer guide — attempt ke baad compare karo:** Job/row outcome records durable rakho; unique(jobId,rowNumber) dedupe kare. Parse/validate bounded stream mein karo, errors capped detail table mein store karo. Each batch product writes aur checkpoint atomically commit kare. Async executor bounded ho; HTTP request thread poora import wait na kare. File adapter lifetime aur crash recovery explicit rakho; singleton boolean running restart safety nahi deta.

**Interviewer follow-up:** Two workers same job claim karein toh lease/fencing kaise add karoge?

### iq-machine-outbox-publisher

**Machine coding: Transactional outbox publisher implement karo**

[Pehle concept padho: Spring background jobs aur caching — lifecycle aur ownership samjho](spring-boot/11-spring-background-cache.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot + SQL order create operation mein order aur outbox event atomically save karo. Scheduled worker fake message adapter ko publish kare aur sent mark kare. Duplicate publication allowed, event ID stable; consumer fixture dedupe kare.

**Acceptance checks — demo mein dikhao:**

- Order transaction rollback par outbox row bhi absent ho.
- Publish success then mark-sent failure simulate karne par retry same event ID bheje.
- Consumer repeated event se business effect once apply kare.

**Hint — atakne par padho:** Database atomicity broker delivery ke saath same guarantee nahi hai.

**Answer guide — attempt ke baad compare karo:** Order/outbox inserts same transaction mein rakho. Worker bounded eligible batch claim kare; publish receipt ke baad sent transition kare. Publish/mark gap duplicate allow karta hai, isliye stable event ID aur consumer inbox uniqueness required hai. Concurrent publishers ke liye row claim/lease policy do. Serialization payload version event creation time par persist karo, later entity mutations se event meaning change mat karo.

**Interviewer follow-up:** Per-order event ordering multiple workers ke saath kaise maintain karoge?

### iq-machine-cache-aside-api

**Machine coding: Cache-aside product read service banao**

[Pehle concept padho: Spring background jobs aur caching — lifecycle aur ownership samjho](spring-boot/11-spring-background-cache.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot service mein get/update product, fake cache adapter aur SQL repository use karo. Cache TTL 30 seconds injected clock se ho. Update DB commit ke baad cache invalidate kare. Single-instance drill mein per-key read/write coordination stale refill roke.

**Acceptance checks — demo mein dikhao:**

- Repeated read hit repository once kare, expiry par reload ho.
- Delayed old read overlapping update cache ko old product se refill na kare.
- Cache unavailable par DB fallback ho; DB failure fake success cache na kare.

**Hint — atakne par padho:** Commit ke baad eviction bhi already-running old read ko khud nahi rokta.

**Answer guide — attempt ke baad compare karo:** Per-key lock ke andar DB load/cache populate aur update-commit/evict serialize karo; transaction commit lock release se pehle ho. Alternative generation token design bhi valid hai. Cache errors fallback/metrics se handle karo, failed reads store mat karo. Local lock multi-instance coherence guarantee nahi deta; explicit drill boundary rakho. Avoid cached mutable entity leaking modifications.

**Interviewer follow-up:** Multi-instance deployment mein invalidation delivery aur bounded staleness ka contract kya hoga?

### iq-machine-api-integration-tests

**Machine coding: Spring API integration test harness banao**

[Pehle concept padho: Spring Boot unit slice and integration testing](spring-boot/08-testing.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Existing notes CRUD API ke liye real HTTP boundary aur target SQL DB par repeatable integration suite banao. Unique test users/data namespace, create-read-update-delete, validation aur unauthorized access cover karo. App fake repository use nahi kare.

**Acceptance checks — demo mein dikhao:**

- Suite twice aur two parallel runs without shared-ID collisions pass hon.
- Rollback-only test transaction se HTTP server writes magically rollback assume na ho.
- A deliberately removed ownership predicate ko cross-user test catch kare.

**Hint — atakne par padho:** Test process transaction aur server request transaction separate hote hain.

**Answer guide — attempt ke baad compare karo:** Isolated database/schema ya unique namespace setup karo; cleanup explicit tracked IDs se ho. HTTP client response status/body aur subsequent persisted read verify kare. Authentication fixtures deterministic hon. Assertions sirf mocks called nahi, observable outcomes test karein. Test timeouts bounded hon; race tests synchronized start use karein, arbitrary sleep se race proof mat banao.

**Interviewer follow-up:** External email/payment adapter ko replace karte waqt kaunsi boundaries real rakhoge?

### iq-machine-soft-delete-api

**Machine coding: Soft delete with active-name uniqueness banao**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot + PostgreSQL categories API mein create,list,delete,restore do. Name trimmed lowercase canonical key se unique among active rows ho. Deleted name reuse allowed; restore conflict 409. deletedAt timestamp injected clock se aaye.

**Acceptance checks — demo mein dikhao:**

- Delete category then same canonical name create successful ho.
- Old category restore while new active exists 409 de.
- Concurrent creates of Foo/foo one success dein; active listing deleted rows exclude kare.

**Hint — atakne par padho:** Uniqueness rule active predicate ke saath DB mein enforce karo.

**Answer guide — attempt ke baad compare karo:** Canonical name persist karo aur active rows ke liye partial unique index rakho. Delete/restore transaction state transition hon; restore unique violation controlled conflict bane. Query defaults active filter lagayein lekin admin lookup explicit ho. ORM global filter alone index constraint replace nahi karta. Restore fail par deletedAt unchanged rahe; actual PostgreSQL fixture index behavior test kare.

**Interviewer follow-up:** Foreign-key references to soft-deleted categories ka read/write contract kya hoga?

### iq-machine-keyset-orders

**Machine coding: Keyset-paginated order history API banao**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Spring Boot + SQL mein current-user orders createdAt DESC,id DESC order se list karo. limit 1..50, cursor last timestamp+ID aur filter fingerprint carry kare. createdAt immutable ho; filters status optional. Static fixture no-skip/no-duplicate guarantee do.

**Acceptance checks — demo mein dikhao:**

- Same timestamp ke 12 rows, page size 5 mein each ID exactly once aaye.
- Other-user rows absent, changed filter with old cursor 400 ho.
- Empty page next cursor null; invalid timestamp cursor reject ho.

**Hint — atakne par padho:** Composite sort ka lexicographic inverse predicate likho.

**Answer guide — attempt ke baad compare karo:** Predicate createdAt<last OR (createdAt=last AND id<lastId) plus owner/status filters use karo. limit+1 fetch se hasNext decide karo, returned last visible row se cursor banao. Owner trusted principal se aaye, cursor se nahi. Matching composite index explain karo aur SQL integration fixture equal timestamps include kare. Live status changes snapshot guarantee nahi dete, contract clearly limit karo.

**Interviewer follow-up:** Export ko consistent snapshot chahiye toh normal cursor pagination se kya extra mechanism chahiye?

## MongoDB — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [MongoDB product search with cursor pagination banao](#iq-machine-product-search) — P1, 75 min
2. [MongoDB atomic stock purchase implement karo](#iq-machine-atomic-stock) — P1, 75 min
3. [Tenant-isolated MongoDB notes repository banao](#iq-machine-tenant-crud) — P1, 75 min
4. [MongoDB profile editor with version checks banao](#iq-machine-optimistic-profile) — P1, 75 min
5. [MongoDB sales aggregation dashboard query banao](#iq-machine-aggregation-dashboard) — P2, 60 min
6. [Orders with customer lookup aur missing references banao](#iq-machine-lookup-report) — P2, 60 min
7. [Idempotent catalog bulk upsert banao](#iq-machine-bulk-upsert) — P2, 75 min
8. [Expiring session store with deterministic checks banao](#iq-machine-retention-sessions) — P2, 60 min
9. [Rebuildable daily sales summary banao](#iq-machine-materialized-summary) — P2, 90 min
10. [Restartable MongoDB schema backfill banao](#iq-machine-schema-backfill) — P2, 90 min
11. [Resumable MongoDB change-stream consumer banao](#iq-machine-change-stream) — P2, 90 min

### iq-machine-product-search

**Machine coding: MongoDB product search with cursor pagination banao**

[Pehle concept padho: MongoDB query plans and Node streaming lab](mongodb/06-query-production-lab.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node + MongoDB collection products mein {tenantId,name,pricePaise,_id} use karo. Trusted test tenant context se category-free listing banao: optional min/max price, sort price ascending then _id, limit 1..50, opaque cursor. Cursor filters/tenant se bind ho.

**Acceptance checks — demo mein dikhao:**

- Same-price products page boundary par skip/repeat na hon in unchanged fixture.
- Tenant A request kabhi tenant B record return na kare.
- Malformed/mismatched cursor 400 ho; empty result next cursor na de.

**Hint — atakne par padho:** Compound ordering ke dono values cursor mein chahiye.

**Answer guide — attempt ke baad compare karo:** Predicate tenant aur price range ke saath (price>lastPrice OR price=lastPrice AND _id>lastId) use kare. Cursor payload/schema validate karo aur trusted tenant/filter fingerprint match karo; client-provided tenant ko auth authority mat maano. Compound index tenantId,pricePaise,_id evaluate karo. limit+1 fetch se next-page existence derive karo. Live price changes repeat/skip kar sakte hain; snapshot guarantee claim mat karo.

**Interviewer follow-up:** Pagination ke beech price mutation ho toh stronger consistency ka contract kya hoga?

### iq-machine-atomic-stock

**Machine coding: MongoDB atomic stock purchase implement karo**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node + MongoDB replica set par purchase(requestId,productId,qty) banao. Products aur purchases separate collections hain. Stock decrement aur purchase record ek transaction mein hon; requestId unique. Positive integer quantity enforce karo.

**Acceptance checks — demo mein dikhao:**

- Stock=2 par three distinct concurrent qty=1 requests: two successful purchases, stock 0.
- Same request replay extra stock consume na kare; changed qty conflict ho.
- Forced purchase insert failure se stock decrement rollback ho.

**Hint — atakne par padho:** Atomic single-document update aur multi-document transaction ki roles separate hain.

**Answer guide — attempt ke baad compare karo:** Transaction mein unique purchase identity aur stock>=qty conditional decrement combine karo; matched count zero ho toh insufficient stock outcome do. Purchase payload canonical store karo. Duplicate identity par transaction rollback ke baad existing record read/compare karo. Driver transaction retries ke andar external side effects mat karo. Replica set fixture aur synchronized starts se actual race verify karo; in-memory mutex DB guarantee replace nahi karta.

**Interviewer follow-up:** Unknown commit outcome ke baad caller retry kare toh request identity recovery kaise help karegi?

### iq-machine-tenant-crud

**Machine coding: Tenant-isolated MongoDB notes repository banao**

[Pehle concept padho: Authentication authorization and secure boundaries](mongodb/07-auth-security.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Node + MongoDB notes {tenantId,ownerId,title} repository banao. Trusted context supplied hai; every CRUD operation tenant-scoped aur owner-scoped ho. Admin context tenant ke all owners read kar sakta hai, cross-tenant nahi.

**Acceptance checks — demo mein dikhao:**

- Other tenant ObjectId known ho tab bhi read/update/delete 404 ho.
- Body tenantId/ownerId escalation reject ya ignore ho.
- Admin A tenant B data list na kare; malformed ObjectId controlled 400 ho.

**Hint — atakne par padho:** Authorization scope repository query construction ka invariant banao.

**Answer guide — attempt ke baad compare karo:** Context se tenant aur role derive karke allowlisted filter build karo; client filter raw spread mat karo. User mode owner predicate include kare; admin mode only owner relax kare. Updates business fields allowlist karein aur matched count missing/forbidden response decide kare. Index tenant/owner access path ke hisaab se do. Route happy-path test alone hidden delete path leak catch nahi karega.

**Interviewer follow-up:** Background jobs ke trusted tenant context ko accidental global query se kaise protect karoge?

### iq-machine-optimistic-profile

**Machine coding: MongoDB profile editor with version checks banao**

[Pehle concept padho: Mongoose schemas validation and relationships](mongodb/04-mongoose-validation-relations.md)

**Timebox:** 75 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Profiles {userId,displayName,version} mein update(userId,expectedVersion,changes) banao. Display name nonblank max80. Query matches userId+version, update increments version. Missing profile404, stale version409; request payload protected fields change na kare.

**Acceptance checks — demo mein dikhao:**

- Version1 se two concurrent edits one success/version2 aur one conflict dein.
- Invalid name version increment na kare.
- Payload $set/version/userId injection original identity na change kare.

**Hint — atakne par padho:** Version compare database update predicate mein hona chahiye.

**Answer guide — attempt ke baad compare karo:** Validated DTO se explicit $set aur $inc build karo; client update operators forward mat karo. Matched count zero par scoped existence read se missing versus stale decide karo, response current version optional ho. Atomic findOneAndUpdate return policy explicit rakho. Mongoose validation assumptions ke bajay service boundary rules aur real DB race test do.

**Interviewer follow-up:** Nested address partial updates mein omitted field aur explicit null ka contract kya hoga?

### iq-machine-aggregation-dashboard

**Machine coding: MongoDB sales aggregation dashboard query banao**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Orders documents {tenantId,status,createdAt,items:[{sku,qty,pricePaise}]} se date-range paid revenue by SKU banao. Tenant trusted context se aaye. Output revenue descending then SKU; top 10. Half-open UTC date bounds use karo.

**Acceptance checks — demo mein dikhao:**

- A ke items X:2x100,Y:1x50 aur second X:1x100 se X=300,Y=50 aaye.
- Cancelled, other tenant aur exact end-time orders exclude hon.
- Empty items/empty result crash na kare; bad dates 400 hon.

**Hint — atakne par padho:** Match/unwind/group ordering aur money representation settle karo.

**Answer guide — attempt ke baad compare karo:** Tenant/status/date match early karo, items unwind karke qty*price revenue aur quantity SKU-wise group karo. Stable sort revenue descending, SKU ascending aur limit apply karo. Integer paise fields validation aur aggregate numeric range check karo. Match index query workload se choose karke explain inspect karo; aggregation result schema ko API DTO banate waqt validate karo. Missing malformed item fields ko silently zero maanna data issue hide karega.

**Interviewer follow-up:** Refunds aur daily materialized totals add karoge toh replay/rebuild correctness kaise verify hogi?

### iq-machine-lookup-report

**Machine coding: Orders with customer lookup aur missing references banao**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Orders {tenantId,customerId,totalPaise} aur customers {tenantId,_id,name} se tenant report banao. Each order once return ho, missing customer name Unknown ho. Lookup tenant mismatch ko missing treat kare; totals preserve hon.

**Acceptance checks — demo mein dikhao:**

- Dangling customer reference se order drop na ho.
- Other-tenant customer ID reference uska name expose na kare.
- Two orders same customer report mein still two rows hon, accidental cartesian multiplication nahi.

**Hint — atakne par padho:** Left-join semantics aur tenant predicate dono lookup mein rakho.

**Answer guide — attempt ke baad compare karo:** Initial tenant match ke baad correlated lookup customer ID plus tenant equality kare. Result at most one customer expect karo; unwind preserveNullAndEmptyArrays ya first-element fallback use karo. Projection explicit fields choose kare. Reference validation write time useful hai, lekin deleted/corrupt refs read path par still handle karne hain. Explain plan se lookup index use inspect karo.

**Interviewer follow-up:** Customer name historical order-time snapshot chahiye toh lookup model kaise badlega?

### iq-machine-bulk-upsert

**Machine coding: Idempotent catalog bulk upsert banao**

[Pehle concept padho: Documents CRUD and access-driven modeling](mongodb/03-documents-crud-modeling.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Node/MongoDB mein tenant catalog import list {sku,name,pricePaise} accept karo. Unique(tenantId,sku), max1000 rows; duplicates within batch invalid whole request. Valid rows independently upsert hon; response per-row success/error de. Replaying same batch same final catalog de.

**Acceptance checks — demo mein dikhao:**

- Existing SKU update ho, new SKU create ho; other tenant unaffected ho.
- One injected database row failure remaining valid writes ko process karne de.
- Duplicate input SKU validation se before-write reject ho; negative price row error de.

**Hint — atakne par padho:** Input duplicate policy aur database partial failure policy alag define karo.

**Answer guide — attempt ke baad compare karo:** Batch schema/duplicate keys pehle check karo. Per-row business validation aur bounded bulkWrite upsert operations explicit tenant+sku filters se banao. Unique compound index race protection de. Ordered false execution ka partial result original row indexes se map karo. Retry failed subset possible hai; response unknown outcomes ko verified success mat bolo.

**Interviewer follow-up:** Import old feed newer catalog overwrite na kare isliye sourceVersion condition kaise add karoge?

### iq-machine-retention-sessions

**Machine coding: Expiring session store with deterministic checks banao**

[Pehle concept padho: Authentication authorization and secure boundaries](mongodb/07-auth-security.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

MongoDB session store create/get/revoke banao. Random opaque token caller ko mile, store only token hash/userId/expiresAt. Inject clock aur hash/token factory tests mein. TTL index cleanup optional delayed housekeeping hai; get expiry application mein enforce kare.

**Acceptance checks — demo mein dikhao:**

- now==expiresAt par get rejected ho even row exists.
- Revoke then get fail; raw token DB record/log mein absent ho.
- Different tokens same user independent revoke hon; invalid token safe miss ho.

**Hint — atakne par padho:** Physical deletion time ko authentication validity boundary mat banao.

**Answer guide — attempt ke baad compare karo:** Cryptographic token adapter se secret generate aur digest store karo, unique digest index ho. Lookup digest ke saath expiresAt>now condition require kare. Revoke matching digest delete kare. TTL deletion eventual cleanup hai, exact expiration guarantee application check own kare. Response mein generic invalid/expired outcome do, token details leak mat karo.

**Interviewer follow-up:** Password reset ke baad all sessions revoke karne ke liye user token-version ya bulk revocation ka tradeoff kya hai?

### iq-machine-materialized-summary

**Machine coding: Rebuildable daily sales summary banao**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

MongoDB replica set par paid-event source aur daily summaries {tenantId,day,revenuePaise,count} banao. UTC day; apply event once via event ID inbox and summary increment in transaction. Full rebuild source events se separate summary collection produce kare.

**Acceptance checks — demo mein dikhao:**

- Duplicate event count/revenue twice increment na kare.
- Summary write failure inbox insert bhi rollback kare.
- Fixture rebuild aur incremental summary same totals dein; tenant/day boundaries correct hon.

**Hint — atakne par padho:** Source events authoritative hain, summary derived projection hai.

**Answer guide — attempt ke baad compare karo:** Unique processed-event identity aur compound summary key indexes banao. One transaction inbox dedupe, summary upsert/$inc aur completion coordinate kare. Rebuild immutable source snapshot/cutoff se aggregate karo; concurrently arriving events ko watermark/replay strategy ke bina new summary swap mat karo. Compare counts/totals fixture oracle se karo, random current date use na karo.

**Interviewer follow-up:** Refund/correction event late previous day ke liye aaye toh projection aur rebuild semantics kya honge?

### iq-machine-schema-backfill

**Machine coding: Restartable MongoDB schema backfill banao**

[Pehle concept padho: Documents CRUD and access-driven modeling](mongodb/03-documents-crud-modeling.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Old users {fullName} mein displayName/schemaVersion=2 backfill job banao. _id ascending batches100, durable checkpoint. Existing version2 records unchanged; missing/blank fullName errors report hon. New writes already v2 banate hain; _id below checkpoint new insertion scope ke bahar hai.

**Acceptance checks — demo mein dikhao:**

- Crash after committed batch restart remaining old records process kare.
- Parallel user update sets v2 displayName; backfill usko overwrite na kare.
- Rerun idempotent ho; invalid old records reported hon aur job infinite retry na kare.

**Hint — atakne par padho:** Checkpoint progress aur conditional document update ki roles alag hain.

**Answer guide — attempt ke baad compare karo:** Batch scan checkpoint se aage karo; update filter _id plus old schemaVersion condition rakho. Derive value source fullName snapshot se tabhi write karo jab source field still same ho, warna conflict retry/report karo. Each batch outcomes durable karke checkpoint advance karo; crash before checkpoint may repeat conditional no-ops safely. Final residual scan/manual report missed unsupported records expose kare.

**Interviewer follow-up:** Writers migration ke dauraan old schema bhi create karein toh dual-write aur verification phases kaise add karoge?

### iq-machine-change-stream

**Machine coding: Resumable MongoDB change-stream consumer banao**

[Pehle concept padho: Node API testing aur graceful shutdown — request se resource cleanup tak](mongodb/09-testing-shutdown.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Replica-set fixture ke orders collection changes consume karke durable audit sink banao. Resume token checkpoint ho; sink insertion and checkpoint atomic via transaction. Sink unique event token identity use kare. Invalid/expired resume token explicit resync-required state de.

**Acceptance checks — demo mein dikhao:**

- Sink commit ke baad process restart event duplicate audit na banaye.
- Sink failure checkpoint advance na kare.
- Shutdown stream cursor/session close kare; invalid token silently from-now start na kare.

**Hint — atakne par padho:** Event effect aur resume progress ek durability boundary mein chahiye.

**Answer guide — attempt ke baad compare karo:** Stream event token losslessly serialize/store karo. Transaction mein unique audit record aur checkpoint upsert commit karo; restart persisted token se resume kare. Replay duplicate key ko known completed outcome se reconcile karo. Audit collection watch scope se exclude ho warna feedback loop banega. Event document availability configuration-dependent hai, drill required fields envelope se derive kare.

**Interviewer follow-up:** Resume history expire ho jaaye toh snapshot plus stream handoff mein gap kaise avoid karoge?

## DSA — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [LRU cache data structure implement karo](#iq-machine-lru-cache) — P1, 60 min
2. [Trie prefix suggestion engine banao](#iq-machine-trie-autocomplete) — P1, 60 min
3. [Min stack aur two-stack queue implement karo](#iq-machine-min-stack) — P1, 45 min
4. [Streaming median tracker banao](#iq-machine-running-median) — P1, 60 min
5. [Dependency-aware task scheduler banao](#iq-machine-dependency-runner) — P2, 75 min
6. [Non-overlapping interval calendar banao](#iq-machine-interval-calendar) — P2, 60 min
7. [Arithmetic expression parser banao](#iq-machine-expression-parser) — P2, 75 min
8. [Grid shortest-path engine banao](#iq-machine-grid-pathfinder) — P2, 60 min
9. [Dynamic connectivity with union-find banao](#iq-machine-union-find) — P2, 60 min
10. [Fenwick tree range-sum engine banao](#iq-machine-fenwick-analytics) — P2, 75 min
11. [Coin-change solver with reconstruction banao](#iq-machine-coin-change) — P2, 60 min

### iq-machine-lru-cache

**Machine coding: LRU cache data structure implement karo**

[Pehle concept padho: Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

JS ya Java mein LRUCache(capacity), get(key), put(key,value) banao. Capacity positive integer; get missing par null. null values disallow karo. get aur existing-key put recency refresh kare; expected O(1) operations chahiye.

**Acceptance checks — demo mein dikhao:**

- Capacity 2: put A,put B,get A,put C => B missing, A/C present.
- Existing key update size na badhaye aur most recent bane.
- Capacity 1 aur invalid capacity test karo; head/tail pointers consistent hon.

**Hint — atakne par padho:** Fast lookup aur arbitrary node repositioning ke liye two structures combine karo.

**Answer guide — attempt ke baad compare karo:** Hash map key->node aur doubly linked list with sentinels rakho. Hit/update node unlink karke most-recent end par insert karo. New insertion capacity exceed kare toh least-recent node list/map dono se remove karo. Size, map entries aur list membership same invariant follow karein. Complexity expected O(1) hash lookup assume karti hai; array scan/shift requirement violate karega.

**Interviewer follow-up:** TTL add karne par expiration check aur capacity eviction ka interaction kya hoga?

### iq-machine-trie-autocomplete

**Machine coding: Trie prefix suggestion engine banao**

[Pehle concept padho: Tries, bitmasks aur range queries — advanced structures ka practical bridge](dsa/14-tries-range-bits.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Lowercase a-z words ke liye insert, remove aur suggest(prefix,k) implement karo. Duplicate insert set-like ho; suggestions lexicographic order mein max k unique words hon. Empty prefix allowed, k=0 empty, negative/noninteger k reject.

**Acceptance checks — demo mein dikhao:**

- car,cat,cart insert ke baad suggest(ca,3) => car,cart,cat.
- car remove karne par cart bache; unknown remove no-op ho.
- Word prefix khud terminal ho toh descendants se pehle aaye.

**Hint — atakne par padho:** Terminal marker ko child existence se separate rakho.

**Answer guide — attempt ke baad compare karo:** Character children aur terminal flag store karo. Prefix node locate karke lexical child order mein DFS karo, terminal word collect aur k par stop karo. Remove terminal unset kare; bottom-up sirf nonterminal childless nodes prune karo. Prefix traversal O(prefix length), enumeration visited nodes/output size par depend karegi; O(k) ka blanket claim wrong hai. Deep words par recursion depth discuss karo.

**Interviewer follow-up:** Popularity-ranked suggestions ke liye per-node top-k cache update cost kya hogi?

### iq-machine-min-stack

**Machine coding: Min stack aur two-stack queue implement karo**

[Pehle concept padho: Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)

**Timebox:** 45 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

JS/Java mein MinStack push/pop/top/getMin aur Queue enqueue/dequeue/peek do. Empty read/remove null return kare, null elements forbidden. MinStack O(1) operations, Queue amortized O(1) chahiye.

**Acceptance checks — demo mein dikhao:**

- Push 3,1,1 then pop once: min still 1 ho.
- Enqueue A,B; dequeue A; enqueue C: next removals B,C hon.
- Empty operations stable hon aur interleaved calls structure corrupt na karein.

**Hint — atakne par padho:** Duplicate minima aur lazy stack transfer ke invariants likho.

**Answer guide — attempt ke baad compare karo:** MinStack each entry ke saath minimum-so-far rakhe ya count-aware min stack maintain kare. Queue inbox/outbox stacks use kare; outbox empty ho tab inbox transfer karo. Every enqueue element at most once transfer hota hai, isliye amortized cost constant hai; individual dequeue O(n) ho sakta hai. Array.shift implementation complexity hide mat karo.

**Interviewer follow-up:** Worst-case constant latency queue requirement aaye toh amortized design ka limitation kya hai?

### iq-machine-running-median

**Machine coding: Streaming median tracker banao**

[Pehle concept padho: Heaps and priority queues](dsa/10-heaps-and-priority-queues.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Finite integer stream ke liye add(value),median() implement karo. Empty median null; even count central two ka average. Duplicates/negative values supported. Range within safe arithmetic bounds assume aur validate karo.

**Acceptance checks — demo mein dikhao:**

- 5,1,9,3 insert ke baad medians 5,3,5,4 hon.
- Repeated equal values heap balance preserve karein.
- 1000 deterministic inputs har prefix sorted-array oracle se match hon.

**Hint — atakne par padho:** Lower half max-heap aur upper half min-heap rakho.

**Answer guide — attempt ke baad compare karo:** Heap sizes at most one differ hon aur lower max<=upper min invariant preserve karo. Add appropriate side mein karke rebalance karo. Odd median larger heap top, even mean of both tops. O(log n) insertion aur O(1) median explain karo; storage O(n). Library heap allowed hai toh comparator correct sign verify karo.

**Interviewer follow-up:** Sliding-window median ke liye lazy deletion aur stale heap tops kaise manage karoge?

### iq-machine-dependency-runner

**Machine coding: Dependency-aware task scheduler banao**

[Pehle concept padho: Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Unique tasks {id,deps,run} ka DAG scheduler banao with concurrency limit. Unknown dependency/cycle execution shuru hone se pehle reject ho. Failed task ke descendants skipped hon; independent tasks continue karein. Har task once run ho.

**Acceptance checks — demo mein dikhao:**

- A->B aur A->C: A complete hone se pehle B/C start na hon.
- Independent jobs active limit respect karein.
- Cycle par zero task side effects hon; A failure par B/C skipped hon.

**Hint — atakne par padho:** Validation pass aur execution pass ko separate rakho.

**Answer guide — attempt ke baad compare karo:** Graph build karke unknown/duplicate IDs validate karo. Kahn pass copy of indegrees se cycle detect karo bina run call kiye. Execution mein ready queue aur active count rakho; successful prerequisite completion indegrees decrement kare. Failure descendants ko blocked/skipped mark kare, independent ready jobs run hon. Completion condition sab tasks terminal hain, sirf ready queue empty hona enough nahi. Complexity graph bookkeeping O(V+E), work durations separate hain.

**Interviewer follow-up:** Cancelled prerequisite aur retryable failure ko state machine mein kaise represent karoge?

### iq-machine-interval-calendar

**Machine coding: Non-overlapping interval calendar banao**

[Pehle concept padho: Greedy aur intervals — choice ka proof aur boundary ka contract](dsa/13-greedy-intervals.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

book(id,start,end),cancel(id),freeSlots(dayStart,dayEnd) implement karo. Integer minutes, [start,end) intervals, positive duration. Overlap reject, touching endpoints allowed. Accepted bookings day bounds ke andar hon.

**Acceptance checks — demo mein dikhao:**

- [60,120) plus [120,150) allowed; [119,121) rejected ho.
- Day [0,180) ke free slots [0,60),[150,180) hon.
- Cancel unknown safe; rejected booking ID later valid request mein reuse ho.

**Hint — atakne par padho:** Sorted intervals mein predecessor/successor overlap checks enough hain.

**Answer guide — attempt ke baad compare karo:** Start-ordered structure aur ID index rakho. Neighbor end/start compare karke only valid booking insert karo; cancelled entry dono structures se remove ho. Free slots sorted scan with running cursor derive karo. Array representation book O(n) insertion leta hai even binary-search lookup O(log n) ho; total complexity honestly state karo.

**Interviewer follow-up:** At most K simultaneous bookings allow karne par sweep-line counter ya segment tree kaise help karega?

### iq-machine-expression-parser

**Machine coding: Arithmetic expression parser banao**

[Pehle concept padho: Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Integers, whitespace, +,-,*,/, parentheses aur unary minus ka evaluator banao. Division real-number result de; division by zero reject. eval/Function use mat karo. Unsupported characters aur incomplete expressions errors hon.

**Acceptance checks — demo mein dikhao:**

- 2*(3+4)-5 => 9; -3*-2 => 6.
- 10/(2-2) explicit error de, Infinity success nahi.
- 1+ aur unmatched brackets reject hon; whitespace result na badle.

**Hint — atakne par padho:** Tokenizer aur operator precedence ko separate karo.

**Answer guide — attempt ke baad compare karo:** Recursive-descent grammar expression->term->unary->primary use karo ya shunting-yard with unary token distinction. Token positions error reporting mein retain karo; parser final end-of-input require kare. Unary minus primary se pehle recursively parse ho. Number parsing bounds aur intermediate finite results validate karo. Regex replacement plus eval grammar/security requirements violate karega.

**Interviewer follow-up:** Exponent operator right-associative add karne par -2^2 grammar kaise define karoge?

### iq-machine-grid-pathfinder

**Machine coding: Grid shortest-path engine banao**

[Pehle concept padho: Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Rectangular grid mein open/blocked cells, start aur target se shortest 4-direction path return karo. Each move cost 1; deterministic neighbor order Up,Right,Down,Left. No path null; start=target one-cell path.

**Acceptance checks — demo mein dikhao:**

- 3x3 empty grid opposite corners path 4 moves ho.
- Blocked target/unreachable grid null de; ragged input reject ho.
- Returned adjacent cells legal hon aur tie choice deterministic ho.

**Hint — atakne par padho:** Visited ko enqueue time mark karo aur predecessor store karo.

**Answer guide — attempt ke baad compare karo:** BFS queue with head index use karo taaki dequeue O(1) ho. Each open cell once enqueue karo aur parent record first visit par set karo. Target milne par parent chain reverse karke path banao. O(rows*cols) time/space worst case. DFS valid path de sakta hai lekin shortest guarantee nahi. Coordinate encoding collisions avoid karo.

**Interviewer follow-up:** Weighted terrain add ho toh BFS ki jagah Dijkstra ya 0-1 BFS kab choose karoge?

### iq-machine-union-find

**Machine coding: Dynamic connectivity with union-find banao**

[Pehle concept padho: Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

N users IDs 0..N-1 ke liye connect(a,b),connected(a,b),componentSize(a),componentCount() do. Only edges add honge; deletion unsupported. Path compression aur union by size implement karo.

**Acceptance checks — demo mein dikhao:**

- N=5; connect(0,1),connect(1,2): size(0)=3,count=3.
- Repeated connect(0,2) count dobara decrement na kare.
- Invalid ID reject; self connection no-op ho.

**Hint — atakne par padho:** Component metadata sirf representative root par authoritative hai.

**Answer guide — attempt ke baad compare karo:** Parent array aur root size initialize karo. find compress path, union unequal roots ko size ke hisaab se attach kare; resulting root size add aur global count one decrement ho. Non-root stale size directly return mat karo. Random small graph BFS oracle se connectivity compare karo. Amortized near-constant bound use karo, strict universal O(1) claim nahi.

**Interviewer follow-up:** Historical snapshots ya rollback queries ke liye path compression policy kaise badlegi?

### iq-machine-fenwick-analytics

**Machine coding: Fenwick tree range-sum engine banao**

[Pehle concept padho: Tries, bitmasks aur range queries — advanced structures ka practical bridge](dsa/14-tries-range-bits.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Integer array ke liye add(index,delta),prefixSum(endExclusive),rangeSum(left,rightExclusive) banao. External zero-based indexing, internal one-based allowed. Empty range 0; invalid bounds reject; values safe numeric range mein hon.

**Acceptance checks — demo mein dikhao:**

- [2,4,1,3] rangeSum(1,4)=8; add(2,5) ke baad 13.
- prefixSum(0)=0 aur full prefix updated total de.
- Seeded random updates/queries naive array oracle se match hon.

**Hint — atakne par padho:** Inclusive internal prefix ko external half-open API se carefully translate karo.

**Answer guide — attempt ke baad compare karo:** Update index+1 se start karke i+=i&-i ancestors update karo. Prefix external end index se i-=i&-i accumulate karo; range prefix(right)-prefix(left) hai. Build repeated add O(n log n) acceptable, optimized build explain optional. Zero internal index update infinite loop de sakta hai, boundary validation essential hai.

**Interviewer follow-up:** Range add aur point query ya range minimum ke liye same structure kaise change hoga?

### iq-machine-coin-change

**Machine coding: Coin-change solver with reconstruction banao**

[Pehle concept padho: Dynamic programming from state to recurrence](dsa/12-dynamic-programming.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Positive distinct coin denominations aur nonnegative integer amount se minimum coin count plus chosen coins return karo. Unlimited supply. Impossible null, amount 0 count0/empty. Equal optimal choices mein smaller final coin prefer karo.

**Acceptance checks — demo mein dikhao:**

- Coins [1,3,4], amount6 => count2, coins 3+3.
- Coins [4,6], amount5 => null.
- Reconstructed coins ka sum target aur length minimum count ho.

**Hint — atakne par padho:** DP count ke saath chosen predecessor coin store karo.

**Answer guide — attempt ke baad compare karo:** dp[0]=0, baaki infinity rakho; each amount par valid coins evaluate karo. Better count ya equal count/smaller final coin par choice update karo. Target reachable ho toh amount se chosen coin repeatedly subtract karke reconstruct karo. O(amount*coins) time aur O(amount) memory explain karo; greedy 4+1+1 counterexample minimum nahi.

**Interviewer follow-up:** Bounded coin supply aur huge target amounts ke liye recurrence/resource limits kaise badlenge?

## System design — build rounds

Pehle prompt attempt karo; hint/answer neeche reference ke liye hain.

1. [Token bucket rate limiter prototype banao](#iq-machine-rate-limiter) — P1, 60 min
2. [URL shortener vertical slice banao](#iq-machine-url-shortener) — P1, 90 min
3. [Notification delivery service prototype banao](#iq-machine-notification-service) — P1, 90 min
4. [Reconnect-safe chat service prototype banao](#iq-machine-chat-reconnect) — P1, 90 min
5. [Durable job queue with retry aur lease banao](#iq-machine-job-queue) — P2, 90 min
6. [Circuit breaker state machine implement karo](#iq-machine-circuit-breaker) — P2, 75 min
7. [Consistent-hashing routing simulator banao](#iq-machine-consistent-hash) — P2, 75 min
8. [Leaderboard with rank aur tie rules banao](#iq-machine-leaderboard-service) — P2, 90 min
9. [Resumable chunked upload service banao](#iq-machine-resumable-upload) — P2, 90 min
10. [Deterministic feature flag evaluator banao](#iq-machine-feature-flags) — P2, 60 min
11. [Replica lag aur read-your-writes simulator banao](#iq-machine-replication-simulator) — P2, 90 min

### iq-machine-rate-limiter

**Machine coding: Token bucket rate limiter prototype banao**

[Pehle concept padho: Consistency aur distributed rate limiting — guarantees pehle likho](system-design/13-consistency-limits.md)

**Timebox:** 60 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

In-memory single-process allow(clientId,now) implement karo. Capacity 3, refill 1 token/sec, request cost 1. Injectable monotonic milliseconds clock; first request par full bucket. Return allowed aur retryAfterMs. Backward time ko zero elapsed maano, stored timestamp backward na karo.

**Acceptance checks — demo mein dikhao:**

- t=0 par first three calls allow, fourth reject retryAfterMs=1000.
- t=500 par rejected request ko retryAfterMs=500; t=1000 par one allow.
- Clients independent hon; long idle ke baad tokens capacity se zyada na hon.

**Hint — atakne par padho:** Elapsed time ko fractional tokens mein convert karo; refill par capacity clamp karo.

**Answer guide — attempt ke baad compare karo:** Per client tokens aur last timestamp store karo. elapsed=max(0,now-last), tokens=min(capacity,tokens+elapsed*rate) calculate karo; timestamp max(last,now) rakho. Enough tokens par decrement, warna ceil((1-tokens)/rate) wait return karo. Concurrent implementation mein refill/check/decrement atomic rakho. Yeh process-local prototype hai; multiple instances combined limit enforce nahi karte.

**Interviewer follow-up:** Bounded key memory aur distributed outage policy add karoge toh kya tradeoffs honge?

### iq-machine-url-shortener

**Machine coding: URL shortener vertical slice banao**

[Pehle concept padho: Java backend API and data architecture](system-design/07-java-api-data.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Apne backend stack + persistent store se POST /links aur GET /:code banao. Only http/https destinations allowed. Generated codes unique hon; fixed expiry optional field. Valid link 302 redirect, unknown 404, expired 410. Code factory aur clock injectable hon.

**Acceptance checks — demo mein dikhao:**

- Forced first-code collision par retry se distinct code bane, existing target overwrite na ho.
- javascript: URL reject ho; expiry boundary now>=expiresAt par 410 ho.
- Process restart ke baad link resolve ho; cache expired link redirect na kare.

**Hint — atakne par padho:** Unique constraint correctness own kare, random generation sirf candidate provide kare.

**Answer guide — attempt ke baad compare karo:** URL parser se scheme/shape validate karo aur persisted record code,target,expiresAt store karo. Unique-key conflict par bounded generation retry karo. Resolve par existence/expiry check karke redirect do; cache ho toh TTL remaining lifetime se bounded rakho aur expiry recheck karo. HTTP redirect target ko fetch karne ki zaroorat nahi. Metrics mein create/conflict/resolve/miss measure karo; one-node prototype ko global-scale solution mat bolo.

**Interviewer follow-up:** Abuse controls aur hot-link traffic ke liye kaunsi next boundary implement karoge?

### iq-machine-notification-service

**Machine coding: Notification delivery service prototype banao**

[Pehle concept padho: Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Apne backend stack + durable store mein enqueueNotification(requestId,userId,channel,payload) aur worker banao. Email/SMS fake adapters hon. Per-user channel preferences enqueue time snapshot hon. Max 3 attempts; provider supports idempotency key.

**Acceptance checks — demo mein dikhao:**

- Same request/payload replay one logical notification create kare.
- Opted-out user ke liye skipped status ho aur provider call zero ho.
- Provider success then worker crash retry same key se duplicate effect na banaye.

**Hint — atakne par padho:** Notification identity, delivery attempts aur provider identity separate rakho.

**Answer guide — attempt ke baad compare karo:** Unique request row, preference snapshot aur pending status durable save karo. Worker atomic claim/lease se bounded retries kare; every attempt same provider idempotency key use kare. Permanent failure dead-letter ho aur inspection endpoint reason expose kare. Provider key support is drill assumption hai; without it delivery exactly once guarantee nahi. Payload logs mein sensitive details redact karo.

**Interviewer follow-up:** Preference processing se pehle change ho toh enqueue snapshot ya send-time check kaunsa contract choose karoge?

### iq-machine-chat-reconnect

**Machine coding: Reconnect-safe chat service prototype banao**

[Pehle concept padho: Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md)

**Timebox:** 90 min · **Priority:** P1 — pehle practice karo

**Build contract — kya banana hai:**

Local durable store aur fake connection adapter se room chat banao. send(room,user,clientMessageId,text), history(afterSequence), subscribe do. Room sequence increasing ho; same sender/clientMessageId replay same message return kare. Auth trusted test principal se ho.

**Acceptance checks — demo mein dikhao:**

- Lost send acknowledgment ke baad retry new message create na kare.
- Disconnect ke dauraan missed 3 messages reconnect par once render hon.
- Room permission nahi toh send/history denied; empty text rejected ho.

**Hint — atakne par padho:** Durable ordered history source of truth hai, live channel notification path hai.

**Answer guide — attempt ke baad compare karo:** Message persist/dedupe aur sequence allocation one transaction mein karo; room membership validate karo. Reconnect subscribe buffer start karke history watermark tak fetch karo, then buffered records sequence/ID se merge karo; fetch-then-subscribe gap messages lose karega. Client rendered IDs dedupe kare. One-node adapter se prove ki guarantees multi-region ordering automatically imply nahi karti.

**Interviewer follow-up:** Room sequence bottleneck aur per-room partitioning ke tradeoffs kaise measure karoge?

### iq-machine-job-queue

**Machine coding: Durable job queue with retry aur lease banao**

[Pehle concept padho: Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Local persistent store aur two worker loops se queue prototype banao: enqueue(jobId,payload), claim(workerId), ack(jobId,leaseToken), retry. Max 3 attempts, deterministic backoff aur dead-letter state. Injectable clock use karo; external broker required nahi.

**Acceptance checks — demo mein dikhao:**

- Parallel workers same current lease own na karein.
- Worker crash ke baad lease expiry par job reclaim ho.
- Stale worker ack new lease ko complete na kare; third failed attempt dead-letter ho.

**Hint — atakne par padho:** Lease identity job identity se alag rakho aur transition compare-and-set karo.

**Answer guide — attempt ke baad compare karo:** Durable status, attempts, availableAt, lease expiry aur unique lease token rakho. Claim transaction/conditional update se eligible job transition kare aur attempts increment kare. Ack/fail current unexpired token match karke hi state change kare. Expired lease available ho lekin exhausted attempts dead-letter hon. Backoff next available time set kare. Lease processing duplicate ho sakti hai; side effect idempotency still needed hai, exactly-once execution claim mat karo.

**Interviewer follow-up:** Worker effect commit ke baad ack se pehle crash ho toh downstream duplicate effect kaise rokoge?

### iq-machine-circuit-breaker

**Machine coding: Circuit breaker state machine implement karo**

[Pehle concept padho: Security observability and production operations](system-design/09-security-operations.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Backend library mein closed/open/half-open breaker banao. 3 consecutive eligible failures open karein, 5-second cooldown, half-open max one probe. Other calls open/half-open mein fast reject hon. Clock aur downstream adapter injectable hon.

**Acceptance checks — demo mein dikhao:**

- Three sequential failures ke baad fourth call downstream tak na jaaye.
- Cooldown baad parallel calls mein only one probe run ho.
- Probe success closes/reset; failure reopens full cooldown; late old completion new state overwrite na kare.

**Hint — atakne par padho:** Breaker generation token old in-flight results ko current transition se separate karega.

**Answer guide — attempt ke baad compare karo:** Atomic state snapshot/generation rakho; call admission current generation capture kare. Completion current generation match kare tab counter/transition update ho. Open transition generation increment kare; cooldown par CAS-like probe claim karo. Eligible failure policy business validation errors se separate rakho. Breaker timeout khud work cancel nahi karta; timeout adapter contract separately do.

**Interviewer follow-up:** Sliding-window failure ratio aur minimum traffic threshold se low-volume behavior kaise change hoga?

### iq-machine-consistent-hash

**Machine coding: Consistent-hashing routing simulator banao**

[Pehle concept padho: Scaling caching replication and partitioning](system-design/02-scaling-caching.md)

**Timebox:** 75 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

JS/Java simulator mein stable unsigned 32-bit hash adapter, node virtual tokens aur key routing banao. Ring clockwise first token >= key hash choose kare, wrap supported. Token collisions deterministic nodeId/replica-index tie-break se resolve hon.

**Acceptance checks — demo mein dikhao:**

- Fixed fixtures repeat runs mein same routes dein.
- One node remove ho toh only us node ke owned key ranges remap hon.
- Empty ring explicit error; key beyond last token first token par route ho.

**Hint — atakne par padho:** Sorted ring aur lower-bound search sufficient hai; real network optional hai.

**Answer guide — attempt ke baad compare karo:** Each virtual token tuple hash,nodeId,replicaIndex sort karo; lookup lower-bound on hash then deterministic tie rules follow kare. Add/remove node tokens rebuild ya ordered structure update kare. 10,000 deterministic keys par before/after movement aur per-node load report karo. Equal perfect balance assert mat karo; hash skew aur virtual-token count influence karte hain.

**Interviewer follow-up:** Replication factor 3 ke liye consecutive virtual nodes same physical owner hon toh selection kaise skip karegi?

### iq-machine-leaderboard-service

**Machine coding: Leaderboard with rank aur tie rules banao**

[Pehle concept padho: Java backend API and data architecture](system-design/07-java-api-data.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Durable backend prototype mein applyScore(eventId,userId,delta), top(k), rank(userId) do. Score signed integer, ties userId ascending; rank ordinal 1-based. Event identity replay no-op, different payload conflict. Fixture max 1000 users.

**Acceptance checks — demo mein dikhao:**

- A=10,B=10,C=5 se ranks A1,B2,C3 hon.
- Duplicate +5 event score twice change na kare.
- Parallel deltas neither lost hon; restart ke baad ranks same hon.

**Hint — atakne par padho:** Event dedupe aur score update same transaction mein karo.

**Answer guide — attempt ke baad compare karo:** Unique event record aur atomic score increment durable transaction mein rakho. Top/rank query score DESC,userId ASC use kare; ordinal tie rule document karo. Initial implementation sorted SQL query/array acceptable within bounded fixture, cost report karo. Cache add karoge toh DB commit ke baad invalidation aur freshness boundary define karo.

**Interviewer follow-up:** Millions of users ke liye fast rank aur event replay rebuild ko kaise separate karoge?

### iq-machine-resumable-upload

**Machine coding: Resumable chunked upload service banao**

[Pehle concept padho: REST, GraphQL aur gRPC — protocol se pehle contract choose karo](system-design/14-api-contracts.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Local filesystem/object adapter + durable metadata se startUpload,putChunk(index,checksum,bytes),complete banao. Max file 10MiB, fixed 1MiB chunks except final. Chunk checksum SHA-256 helper allowed. Same index/same checksum retry accepted; different bytes conflict.

**Acceptance checks — demo mein dikhao:**

- Missing chunk par complete fail ho; final file chunk-index order mein assemble ho.
- Interrupted upload restart ke baad existing chunks reuse kare.
- Wrong checksum/oversized chunk rejected ho; filename path traversal allowed na ho.

**Hint — atakne par padho:** Upload session identity aur chunk manifest durable rakho.

**Answer guide — attempt ke baad compare karo:** Server-generated storage keys use karo, supplied filename ko filesystem path mat banao. Validate expected chunk lengths/checksums aur atomic temporary-write/rename adapter use karo. Manifest unique(uploadId,index) conflict-safe ho. Complete all manifest entries verify karke staged assembly aur finalized state coordinate kare; crash retry same finalized object return kare. Abandoned sessions TTL cleanup separate task ho.

**Interviewer follow-up:** Parallel completion aur cleanup worker race karein toh ownership/lease kaise prevent karegi?

### iq-machine-feature-flags

**Machine coding: Deterministic feature flag evaluator banao**

[Pehle concept padho: Requirements capacity and design interviews](system-design/01-requirements-capacity.md)

**Timebox:** 60 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

In-memory flag config mein enabled, allowlistedUserIds aur rolloutPercent 0..100 rakho. evaluate(flagKey,userId) deterministic bucket se bool de. Config immutable snapshots se update ho; unknown flag false. Hash adapter supplied/stable ho.

**Acceptance checks — demo mein dikhao:**

- Same user/flag repeat calls same result dein without per-call randomness.
- Rollout 20->40 badhe toh previously included non-allowlisted users excluded na hon.
- Disabled flag allowlist ko bhi override kare; invalid percent config reject ho.

**Hint — atakne par padho:** Fixed bucket threshold monotonic rollout preserve karta hai.

**Answer guide — attempt ke baad compare karo:** Hash(flagKey plus unambiguous userId encoding) ko 0..9999 bucket normalize karo, bucket<percent*100 compare karo. Disabled first, then allowlist, then rollout apply karo. Config validation complete hone par whole snapshot atomically swap karo. Hash version change rollout membership reshuffle kar sakti hai, isliye stable version pin karo. Feature flags authorization ka substitute nahi.

**Interviewer follow-up:** Offline client stale config aur emergency kill switch freshness ke liye kya contract chahiye?

### iq-machine-replication-simulator

**Machine coding: Replica lag aur read-your-writes simulator banao**

[Pehle concept padho: Consistency aur distributed rate limiting — guarantees pehle likho](system-design/13-consistency-limits.md)

**Timebox:** 90 min · **Priority:** P2 — next challenge

**Build contract — kya banana hai:**

Deterministic simulator mein leader log, two lagging replicas aur logical clock banao. write returns version token; eventualRead replica local value de; readAtLeast(token) lagging replica se leader fallback kare. Network delays fixture queue se drive hon.

**Acceptance checks — demo mein dikhao:**

- Write v2 after v1, lagging replica eventual read v1 dikha sake.
- Same replica readAtLeast(v2) v2-or-newer de via fallback.
- Out-of-order delivery v2 then v1 replica state regress na kare; unreachable leader+lagging replica error de.

**Hint — atakne par padho:** Version requirement ko availability tradeoff se explicitly jodo.

**Answer guide — attempt ke baad compare karo:** Append-only ordered log aur per-replica applied version maintain karo. Out-of-order records buffer karke contiguous application karo; alternatively full-state snapshots hon toh monotonic replace contract define karo. Read token version compare kare, sufficient replica choose ya leader consult kare. Network failure par promised consistency weaken karke old success return mat karo. Simulated guarantees clock ticks aur protocol tak limited hain.

**Interviewer follow-up:** Concurrent leaders aur conflicting writes allow karne par scalar version token kyun insufficient ho sakta hai?
