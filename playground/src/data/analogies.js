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
  {
    id: 'js-types-operators',
    hinglish: {
      title: '`==` vs `===` = dukaandaar vs bank',
      text: '`==` wala dukaandaar dollar aur rupaye ko pehle apne hisaab se convert karke compare karta hai. `===` wala bank pehle currency dekhta hai — currency alag toh seedha "match nahi".',
      catch:
        'Convert karne ke rules chaunkate hain: `"" == 0` true, `null == 0` false, par `null == undefined` true. `NaN` kisi ke equal nahi, khud ke bhi nahi — `Number.isNaN` use karo.',
    },
    en: {
      title: '`==` vs `===`: a shopkeeper vs a bank',
      text: 'The `==` shopkeeper converts dollars and rupees his own way before comparing. The `===` bank checks the currency first — a different currency is simply "no match".',
      catch:
        'The conversion rules surprise people: `"" == 0` is true, `null == 0` is false, yet `null == undefined` is true. `NaN` equals nothing, not even itself — use `Number.isNaN`.',
    },
  },
  {
    id: 'js-conditionals',
    hinglish: {
      title: 'Truthy/falsy = gate par guard ki "khaali" list',
      text: 'Guard ke paas ek chhoti list hai jo "khaali" maani jaati hai: `false`, `0`, `""`, `null`, `undefined`, `NaN` (aur `0n`). List ke bahar sab andar jaata hai — khaali array `[]` aur `{}` bhi.',
      catch:
        'Isliye `if (count)` zero ko bhi "kuch nahi" samjhega. Jab 0 ya "" sahi value ho sakti hai, `count !== undefined` ya `??` jaisa saaf check likho.',
    },
    en: {
      title: 'Truthy/falsy: the guard\'s list of "empty" things',
      text: 'The guard has a short list of values that count as empty: `false`, `0`, `""`, `null`, `undefined`, `NaN` (and `0n`). Everything else gets in — even an empty array `[]` or `{}`.',
      catch:
        'So `if (count)` treats zero as "nothing". When 0 or "" can be a valid value, write an explicit check such as `count !== undefined` or `??`.',
    },
  },
  {
    id: 'js-loops',
    hinglish: {
      title: '`for` loop = gym trainer ki ginti',
      text: 'Trainer ginti zero se shuru karta hai (initialization), har rep se pehle poochta hai "10 hue?" (condition), rep karwata hai (body), phir ginti ek badhata hai (update).',
      catch:
        'Ginti badhana bhool gaye toh reps kabhi khatam nahi honge (infinite loop). `<` ki jagah `<=` likha toh ek rep zyada — off-by-one sabse common loop bug hai.',
    },
    en: {
      title: 'A `for` loop is a gym trainer counting reps',
      text: 'The trainer starts the count at zero (initialization), asks "ten yet?" before every rep (condition), has you do the rep (body), then adds one to the count (update).',
      catch:
        'Forget to add one and the reps never end (an infinite loop). Write `<=` where you meant `<` and you get one rep too many — off-by-one is the most common loop bug.',
    },
  },
  {
    id: 'js-functions',
    hinglish: {
      title: 'Function = recipe card',
      text: 'Recipe ek baar likho, kitni bhi baar banao. Parameters recipe ki khaali jagah hain ("2 cup ___"), arguments us din daali gayi asli cheez, aur `return` haath mein di gayi bani hui dish.',
      catch:
        '`console.log` dish ki photo dikhana hai, dish dena nahi. `return` na likho toh function `undefined` deta hai — calling code ko kuch nahi milta.',
    },
    en: {
      title: 'A function is a recipe card',
      text: 'Write the recipe once, cook it as often as you like. Parameters are the blanks in the recipe ("2 cups of ___"), arguments are what you actually put in that day, and `return` is the finished dish handed back.',
      catch:
        '`console.log` shows a photo of the dish; it does not hand the dish over. Without `return` the function gives back `undefined` — the calling code receives nothing.',
    },
  },
  {
    id: 'js-arrays-objects',
    hinglish: {
      title: 'Array = numbered dabbe, object = label wali drawers',
      text: 'Array train ke dabbe hain — order matter karta hai aur numbering 0 se shuru. Object almari ki drawers hain — har drawer par naam ka label, aur cheez naam se dhundhte ho, position se nahi.',
      catch:
        '`const b = a` nayi train nahi banata, sirf usi train ka address deta hai — `b` mein badlav `a` mein bhi dikhega. Alag copy chahiye toh spread ya `structuredClone`.',
    },
    en: {
      title: 'An array is numbered coaches; an object is labelled drawers',
      text: 'An array is the coaches of a train — order matters and numbering starts at 0. An object is a cupboard of drawers — each drawer has a name label, and you find things by name, not by position.',
      catch:
        '`const b = a` does not build a new train; it hands over the address of the same one, so a change through `b` shows up in `a`. For a separate copy use spread or `structuredClone`.',
    },
  },
  {
    id: 'js-modern-data-collections',
    hinglish: {
      title: '`map`/`filter`/`reduce` = factory ki assembly line',
      text: 'Pehla station har item ko rang deta hai (`map`), doosra QC kharab items hata deta hai (`filter`), aakhri station sab ko ek box mein pack karta hai (`reduce`).',
      catch:
        'Har station naya array deta hai, purana jaisa tha waisa rehta hai. Khaali array par bina initial value ke `reduce` TypeError deta hai — initial value hamesha do.',
    },
    en: {
      title: '`map`/`filter`/`reduce` is a factory assembly line',
      text: 'The first station paints every item (`map`), the second, quality control, removes the faulty ones (`filter`), and the last packs everything into one box (`reduce`).',
      catch:
        'Each station returns a new array and leaves the old one as it was. On an empty array `reduce` without an initial value throws a TypeError — always pass one.',
    },
  },
  {
    id: 'js-language-foundations',
    hinglish: {
      title: 'User input = courier ka parcel',
      text: 'Parcel lene se pehle dekhte ho ki naam sahi hai aur seal band hai. Input bhi waisa hi hai: `Number("12abc")` `NaN` deta hai, jabki `parseInt("12abc")` chupchaap 12 — dono ka matlab samajh kar check karo.',
      catch:
        'Browser ka `required` ya `type="number"` sirf pehla guard hai; server par phir se validate karo. Aur value ko check ke baad hi aage bhejo, pehle nahi.',
    },
    en: {
      title: 'User input is a courier parcel',
      text: 'Before you sign for a parcel you check the name and the seal. Input is the same: `Number("12abc")` gives `NaN`, while `parseInt("12abc")` quietly gives 12 — know which one you mean and check the result.',
      catch:
        'The browser\'s `required` or `type="number"` is only the first guard; validate again on the server. And pass the value on only after the check, never before.',
    },
  },
  {
    id: 'js-numbers-dates-regex',
    hinglish: {
      title: 'Floating point = 1/3 ko decimal mein likhna',
      text: '1/3 decimal mein likho toh 0.3333… kabhi khatam nahi hota, kahin rukna padta hai. Computer binary mein 0.1 ke saath yahi karta hai, isliye `0.1 + 0.2` `0.30000000000000004` deta hai.',
      catch:
        'Paise ko integer paise (×100) mein rakho, aur `toFixed` sirf dikhane ke liye lagao. `Number.MAX_SAFE_INTEGER` se bade integers ke liye `BigInt` chahiye.',
    },
    en: {
      title: 'Floating point is writing 1/3 as a decimal',
      text: 'Write 1/3 as a decimal and 0.3333… never ends, so you have to stop somewhere. The computer does the same with 0.1 in binary, which is why `0.1 + 0.2` gives `0.30000000000000004`.',
      catch:
        'Keep money as integer paise (×100) and use `toFixed` only for display. Integers beyond `Number.MAX_SAFE_INTEGER` need `BigInt`.',
    },
  },
  {
    id: 'javascript-browser-foundations',
    hinglish: {
      title: 'HTML, CSS, JS = ghar ka dhaancha, rang aur bijli',
      text: 'HTML deewarein aur kamre hain, CSS rang aur furniture, aur JS bijli jo switch dabane par kaam karti hai.',
      catch:
        'Deewar par switch jaisa sticker lagane se switch nahi banta: click wala `div` keyboard aur screen reader ke liye button nahi hai. Asli `<button>` use karo.',
    },
    en: {
      title: "HTML, CSS and JS are a house's walls, paint and wiring",
      text: 'HTML is the walls and rooms, CSS the paint and furniture, and JS the wiring that does something when you press a switch.',
      catch:
        'A sticker shaped like a switch is not a switch: a clickable `div` is not a button for keyboard or screen-reader users. Use a real `<button>`.',
    },
  },
  {
    id: 'js-oop-mini-project',
    hinglish: {
      title: 'Encapsulation = bank ka counter',
      text: 'Tum vault mein haath daal kar paise nahi nikal sakte; counter par cashier (method) se maangte ho, aur woh rules check karta hai — balance se zyada withdrawal nahi.',
      catch:
        '`_balance` sirf "mat chhuo" ka board hai, taala nahi. JavaScript mein asli private field ke liye `#balance` likho.',
    },
    en: {
      title: 'Encapsulation is a bank counter',
      text: 'You cannot reach into the vault yourself; you ask the cashier at the counter (a method), who checks the rules — no withdrawal larger than the balance.',
      catch:
        '`_balance` is only a "do not touch" sign, not a lock. In JavaScript a truly private field is written `#balance`.',
    },
  },
  {
    id: 'js-modules-tooling-debugging',
    hinglish: {
      title: 'ES `import` = live TV channel',
      text: '`import` recording ki DVD nahi, live channel hai: export karne wale module ne value badli toh import karne wale ko nayi value dikhti hai.',
      catch:
        'Channel sirf dekh sakte ho — imported binding ko reassign nahi kar sakte. CommonJS mein `module.exports` par rakhi primitive value ek baar ki copy hoti hai, live nahi.',
    },
    en: {
      title: 'An ES `import` is a live TV channel',
      text: 'An `import` is not a recorded DVD but a live channel: when the exporting module changes the value, the importing module sees the new value.',
      catch:
        'You can only watch the channel — an imported binding cannot be reassigned. In CommonJS a primitive placed on `module.exports` is a one-time copy, not live.',
    },
  },
  {
    id: 'javascript-testing-workflow',
    hinglish: {
      title: 'Test = smoke detector',
      text: 'Ek baar laga do, phir har change par chupchaap check karta hai aur jahan dhuaan (regression) dikhe wahin bajta hai. Bug ko pehle ek failing test mein pakdo, phir fix karo.',
      catch:
        'Detector sirf wahi kamra dekhta hai jahan laga hai: 100% coverage ka matlab sahi behavior nahi. Aur jo test kabhi fail ho hi nahi sakta, woh band pada detector hai.',
    },
    en: {
      title: 'A test is a smoke detector',
      text: 'Fit it once and it quietly checks after every change, sounding the alarm where there is smoke (a regression). Catch a bug in a failing test first, then fix it.',
      catch:
        'A detector only watches the room it is fitted in: 100% coverage does not mean correct behaviour. And a test that can never fail is a detector that is switched off.',
    },
  },
  {
    id: 'javascript-browser-persistence',
    hinglish: {
      title: '`localStorage` = apni desk par chipki parchiyaan',
      text: 'Parchi sirf usi office (origin) ki desk par hai — doosri website use padh nahi sakti, aur doosre device par woh hai hi nahi.',
      catch:
        'Desk saaf karne wala (user ya browser) parchiyaan phenk sakta hai, aur page ka har script unhe padh sakta hai — token ya password yahan mat rakho. Sirf strings jaati hain; objects ke liye JSON.',
    },
    en: {
      title: '`localStorage` is sticky notes on your own desk',
      text: 'The notes are on the desk of one office only (the origin) — another website cannot read them, and on another device they do not exist.',
      catch:
        'Whoever cleans the desk (the user or the browser) can throw them away, and every script on the page can read them — never keep a token or password there. Only strings are stored; use JSON for objects.',
    },
  },
  {
    id: 'javascript-git-workflow',
    hinglish: {
      title: 'Git = parcel pack karna',
      text: 'Working tree tumhara kamra hai jahan sab bikhra hai, staging woh dabba jisme sirf bhejne wali cheezein daali, aur commit dabba seal karke label lagana.',
      catch:
        'Seal ke baad kamre mein jo badla, woh dabbe mein nahi gaya — commit sirf staged snapshot leta hai. Push ho chuke dabbe ko khol kar badalna (history rewrite) team ke liye pareshani hai.',
    },
    en: {
      title: 'Git is packing a parcel',
      text: 'The working tree is your room with everything lying around, staging is the box you put only the things to send into, and a commit seals the box and labels it.',
      catch:
        'What changes in the room after sealing is not in the box — a commit takes only the staged snapshot. Reopening a box that was already pushed (rewriting history) causes trouble for the team.',
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
  {
    id: 'react-jsx-props',
    hinglish: {
      title: 'Props = order ki parchi',
      text: 'Waiter (parent) chef (component) ko parchi deta hai: "2 chai, kam cheeni". Chef usi hisaab se banata hai — parchi badalna uska kaam nahi.',
      catch:
        'Props read-only hain; child ko kuch badalwana ho toh parent ka diya callback bulao. Aur JSX HTML nahi — `className`, `htmlFor`, camelCase events.',
    },
    en: {
      title: 'Props are an order slip',
      text: 'The waiter (the parent) hands the chef (the component) a slip: "2 teas, less sugar". The chef cooks to the slip — editing the slip is not the chef\'s job.',
      catch:
        'Props are read-only; to change something, the child calls a callback the parent passed in. And JSX is not HTML — `className`, `htmlFor`, camelCase events.',
    },
  },
  {
    id: 'react-components-rendering',
    hinglish: {
      title: 'Render vs commit = naksha vs mistri',
      text: 'Render mein React naya naksha banata hai ki screen kaisi dikhni chahiye. Commit mein mistri sirf wahi deewarein todta-jodta hai jo naksha mein badli hain.',
      catch:
        'Naksha baar-baar ban sakta hai aur phenka bhi ja sakta hai, isliye render ke andar fetch ya DOM change jaise side effects mat karo. Re-render ka matlab poora DOM dobara banana nahi.',
    },
    en: {
      title: 'Render vs commit: the plan vs the builder',
      text: 'During render React draws a new plan of how the screen should look. During commit the builder changes only the walls that differ in the plan.',
      catch:
        'A plan can be drawn many times and thrown away, so never put side effects such as a fetch or a DOM change inside render. A re-render does not rebuild the whole DOM.',
    },
  },
  {
    id: 'react-composition-styling',
    hinglish: {
      title: 'Composition = thali aur katoriyan',
      text: 'Thali (`Card`, `Layout`) ek hi rehti hai; usme kaunsi katori rakhni hai woh caller `children` se deta hai. Har naye combination ke liye nayi thali nahi banti.',
      catch:
        'Thali mein katori ki jagah fixed hoti hai, React mein nahi — `children` sirf content deta hai, layout aur styling ka contract (variant, className) alag se tay karo.',
    },
    en: {
      title: 'Composition is a thali and its bowls',
      text: 'The thali (`Card`, `Layout`) stays the same; which bowls go on it the caller decides through `children`. You do not make a new thali for every combination.',
      catch:
        'On a real thali each bowl has a fixed place; in React it does not — `children` supplies only content, so agree the layout and styling contract (a variant, a className) separately.',
    },
  },
  {
    id: 'react-routing-url-state',
    hinglish: {
      title: 'URL = ghar ka pata',
      text: 'Pata (`/library?track=react`) share karo toh doosra bhi wahi jagah pahunchta hai. Nested layout building, floor aur flat jaisa hai — building ka gate (header) har flat ke liye ek hi rehta hai.',
      catch:
        'Jo state pate mein nahi likhi (khula modal, draft text), woh link share karne par saath nahi jaati. Filter aur page jaisi shareable cheezein URL mein, temporary cheezein local state mein.',
    },
    en: {
      title: 'A URL is a home address',
      text: "Share the address (`/library?track=react`) and someone else arrives at the same place. Nested layouts are a building, a floor and a flat — the building's gate (the header) stays the same for every flat.",
      catch:
        'State that is not written into the address (an open modal, draft text) does not travel with a shared link. Keep shareable things such as filters and the page in the URL, temporary things in local state.',
    },
  },
  {
    id: 'react-query-supabase',
    hinglish: {
      title: 'Server cache = subah ka akhbaar',
      text: 'Akhbaar ghar par hai toh turant padh lo (cache), par woh subah ki khabar hai. `staleTime` batata hai kitni der use taaza maano; uske baad naya mangwao (refetch).',
      catch:
        'Tumne khud koi khabar badli (mutation) toh purana akhbaar galat ho gaya — related query invalidate karo. Aur private data ki cache key mein user zaroor rakho, warna agla user pichhle ka akhbaar padhega.',
    },
    en: {
      title: 'A server cache is the morning newspaper',
      text: "With the paper at home you can read it at once (the cache), but it is this morning's news. `staleTime` says how long to treat it as fresh; after that you fetch a new one (refetch).",
      catch:
        "If you changed the news yourself (a mutation), the old paper is now wrong — invalidate the related queries. And put the user in the cache key of private data, or the next user reads the previous one's paper.",
    },
  },
  {
    id: 'react-typescript-contracts',
    hinglish: {
      title: 'TypeScript = naksha pass karwana',
      text: 'Naksha pass hone se pata chalta hai ki design mein galti nahi. TypeScript bhi build se pehle check karta hai ki code apne hi contracts follow karta hai.',
      catch:
        'Naksha pass hone se truck mein aayi eent ki quality prove nahi hoti: API se aaya JSON runtime par validate karo. `as` likhna bina inspection ke stamp lagana hai.',
    },
    en: {
      title: 'TypeScript is getting the building plan approved',
      text: 'An approved plan shows the design has no mistakes. TypeScript likewise checks before the build that the code follows its own contracts.',
      catch:
        'An approved plan does not prove the bricks on the truck are good: validate JSON from an API at runtime. Writing `as` is stamping approval without an inspection.',
    },
  },
  {
    id: 'react-testing-accessibility',
    hinglish: {
      title: 'Testing Library = customer ki tarah check karo',
      text: 'Customer gaadi ka engine nahi kholta; chabi ghumata hai aur dekhta hai gaadi chali ya nahi. Test bhi button ko uske naam se dhundho (`getByRole`), click karo aur screen par result dekho.',
      catch:
        'Jis button ka screen reader ke liye naam nahi, woh `getByRole` se milega hi nahi — yeh accessibility bug hai, test ka nahi. Aur jsdom asli browser nahi: layout, focus aur CSS browser mein check karo.',
    },
    en: {
      title: 'Testing Library tests like a customer',
      text: 'A customer does not open the engine; they turn the key and see whether the car moves. A test likewise finds a button by its name (`getByRole`), clicks it and checks the result on screen.',
      catch:
        'A button with no accessible name will not be found by `getByRole` — that is an accessibility bug, not a test bug. And jsdom is not a real browser: check layout, focus and CSS in a browser.',
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
  {
    id: 'rn-components-layout',
    hinglish: {
      title: 'Safe area = hall ke khambe',
      text: 'Hall mein khambe ke peeche kursi lagao toh us par baitha insaan stage nahi dekh paata. Notch, status bar aur home indicator bhi phone ke khambe hain — content safe area ke andar rakho.',
      catch:
        'Har phone ke khambe alag jagah hain, isliye fixed padding mat likho; insets device se lo. Aur text hamesha `<Text>` ke andar — `<View>` mein seedha string likhoge toh error aati hai.',
    },
    en: {
      title: 'The safe area avoids the pillars in a hall',
      text: "Put a chair behind a pillar and whoever sits there cannot see the stage. The notch, the status bar and the home indicator are a phone's pillars — keep content inside the safe area.",
      catch:
        'Every phone has its pillars in different places, so do not hard-code padding; read the insets from the device. And text always goes inside `<Text>` — a bare string inside `<View>` throws an error.',
    },
  },
  {
    id: 'rn-navigation-links',
    hinglish: {
      title: 'Stack vs tabs = plates ka dher vs TV channels',
      text: 'Stack plates ka dher hai: detail screen upar rakhi, back dabaya toh hat gayi. Tabs TV channels hain: channel badalne se pichla band nahi hota, wahin ruka rehta hai.',
      catch:
        'Deep link se seedha upar wali plate par pahunche toh neeche dher khaali ho sakta hai — back par app band na ho, iske liye initial route socho. Android ka hardware back alag se test karo.',
    },
    en: {
      title: 'Stack vs tabs: a pile of plates vs TV channels',
      text: 'A stack is a pile of plates: a detail screen goes on top, and back removes it. Tabs are TV channels: switching does not switch the previous one off; it stays where it was.',
      catch:
        "Arrive through a deep link straight at the top plate and the pile underneath may be empty — plan an initial route so back does not close the app. Test Android's hardware back button separately.",
    },
  },
  {
    id: 'rn-forms-state',
    hinglish: {
      title: 'Keyboard = aage aakar khada lamba aadmi',
      text: 'Keyboard khulte hi neeche ke inputs ke aage ek lamba aadmi khada ho jaata hai. `KeyboardAvoidingView` aur scroll se screen upar khiskao taaki likhte waqt field dikhti rahe.',
      catch:
        'iOS aur Android par yeh aadmi alag tarah khada hota hai (`behavior` alag), isliye dono par check karo. Aur controlled input mein har keystroke par bhaari kaam mat karo — typing atakti hai.',
    },
    en: {
      title: 'The keyboard is a tall person standing in front of you',
      text: 'When the keyboard opens, a tall person stands in front of the inputs at the bottom. Move the screen up with `KeyboardAvoidingView` and scrolling so the field stays visible while typing.',
      catch:
        'The person stands differently on iOS and Android (`behavior` differs), so check both. And do no heavy work on every keystroke of a controlled input — typing starts to lag.',
    },
  },
  {
    id: 'rn-network-storage',
    hinglish: {
      title: '`fetch` = courier ne dabba de diya',
      text: 'Courier ne dabba de diya matlab delivery hui — saamaan sahi aaya, yeh nahi. `fetch` bhi 404 ya 500 par reject nahi hota; `response.ok` khol kar dekho.',
      catch:
        'Network hi na ho toh courier aata hi nahi (fetch reject), aur dheemi network par ghanton laga sakta hai — timeout lagao. Login token `AsyncStorage` mein nahi, secure storage mein rakho.',
    },
    en: {
      title: '`fetch` is the courier handing over a box',
      text: 'The courier handing over a box means it was delivered — not that the right goods are inside. `fetch` likewise does not reject on a 404 or 500; open `response.ok` and check.',
      catch:
        'With no network the courier never comes (fetch rejects), and on a slow one it can take forever — set a timeout. Keep a login token in secure storage, not `AsyncStorage`.',
    },
  },
  {
    id: 'rn-testing-accessibility',
    hinglish: {
      title: 'Simulator = driving ka video game',
      text: 'Video game mein steering, signal aur rules sab practice ho jaate hain. Simulator aur Jest bhi logic aur screens jaldi check kar dete hain.',
      catch:
        'Asli sadak ke gaddhe game mein nahi: camera permission, dheema phone, chhoti screen aur TalkBack/VoiceOver asli device par hi pakde jaate hain. Release se pehle real device par chalao.',
    },
    en: {
      title: 'A simulator is a driving video game',
      text: 'In a video game you can practise steering, signals and the rules. A simulator and Jest likewise check logic and screens quickly.',
      catch:
        "The real road's potholes are not in the game: camera permissions, a slow phone, a small screen and TalkBack/VoiceOver only show up on a real device. Run on one before a release.",
    },
  },
  {
    id: 'rn-build-release',
    hinglish: {
      title: 'OTA update = sirf menu card badalna',
      text: 'Nayi dish (JS ya asset change) add karni hai toh sirf menu card badlo — har customer ko turant mil jaata hai. Naya oven (native module) chahiye toh kitchen renovation, yaani naya store build.',
      catch:
        'Purane kitchen ko naye oven wali recipe bhejoge toh app crash hoga: runtime version match karke hi OTA bhejo. Store review aur signing keys apna kaam alag se karti hain.',
    },
    en: {
      title: 'An OTA update only changes the menu card',
      text: 'Adding a new dish (a JS or asset change) needs only a new menu card — every customer gets it at once. A new oven (a native module) needs a kitchen renovation: a new store build.',
      catch:
        'Send a recipe that needs the new oven to an old kitchen and the app crashes: ship an OTA only to a matching runtime version. Store review and signing keys still do their own job.',
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
  {
    id: 'java-first-program',
    hinglish: {
      title: 'JVM = har desh ka apna translator',
      text: '`javac` tumhari Java ko bytecode naam ki common bhasha mein likhta hai. Har OS par baitha JVM usi bytecode ko wahan ki bhasha mein samjhata hai — ek baar likho, har jagah chalao.',
      catch:
        'Translator ka version matter karta hai: naye JDK se compile hua bytecode purane JVM par `UnsupportedClassVersionError` deta hai. Native libraries har OS ke liye alag hi rehti hain.',
    },
    en: {
      title: 'The JVM is a translator in every country',
      text: '`javac` writes your Java in a common language called bytecode. The JVM on each operating system explains that same bytecode in the local language — write once, run anywhere.',
      catch:
        "The translator's version matters: bytecode compiled by a newer JDK fails on an older JVM with `UnsupportedClassVersionError`. Native libraries still differ per operating system.",
    },
  },
  {
    id: 'java-decisions-loops',
    hinglish: {
      title: 'Purana `switch` = phisalpatti',
      text: 'Purane `case` mein `break` bhool gaye toh agle case mein phisal jaate ho (fall-through), jaise phisalpatti par beech mein rukna mushkil. Naya arrow form `case X ->` sirf apna block chalata hai.',
      catch:
        'Kabhi fall-through jaan-boojh kar hota hai (do cases ka ek hi kaam) — tab comment likho. Aur `null` par `switch` NullPointerException deta hai, jab tak Java 21 ka `case null` na likho.',
    },
    en: {
      title: 'The old `switch` is a slide',
      text: 'Forget `break` in an old-style `case` and you slide into the next case (fall-through), the way it is hard to stop halfway down a slide. The arrow form `case X ->` runs only its own block.',
      catch:
        "Sometimes falling through is deliberate (two cases, one action) — then leave a comment. And `switch` on `null` throws a NullPointerException unless you write Java 21's `case null`.",
    },
  },
  {
    id: 'java-methods-arrays',
    hinglish: {
      title: 'Java = address ki photocopy dena',
      text: 'Method ko object diya toh use ghar nahi, address ki photocopy milti hai. Woh us address par jaakar furniture badal sakta hai (object mutate), aur tumhe badlav dikhega.',
      catch:
        'Photocopy par naya address likh dene se tumhara ghar nahi badalta: method ke andar parameter ko naya object assign karna caller ko affect nahi karta. Java hamesha pass-by-value hai.',
    },
    en: {
      title: 'Java hands over a photocopy of the address',
      text: 'Pass an object to a method and it gets not the house but a photocopy of the address. It can go to that address and move the furniture (mutate the object), and you will see the change.',
      catch:
        'Writing a new address on the photocopy does not move your house: assigning a new object to the parameter does not affect the caller. Java is always pass-by-value.',
    },
  },
  {
    id: 'java-classes-constructors',
    hinglish: {
      title: 'Class = saancha, object = laddoo',
      text: 'Saancha (class) ek, laddoo (objects) bahut. Constructor woh pal hai jab laddoo banta hai — wahin check karo ki zaroori cheezein (naam, balance) sahi daali gayi.',
      catch:
        'Har laddoo ka apna data hota hai, par `static` field saanche par chipki hoti hai — sab objects ek hi share karte hain. Invalid value aaye toh constructor mein hi exception do, adha bana laddoo bahar mat bhejo.',
    },
    en: {
      title: 'A class is a mould; objects are the sweets',
      text: 'One mould (the class), many sweets (objects). The constructor is the moment a sweet is shaped — that is where you check the essentials (a name, a balance) are right.',
      catch:
        'Each sweet has its own data, but a `static` field is stuck to the mould — every object shares the same one. On an invalid value throw from the constructor; never hand out a half-made object.',
    },
  },
  {
    id: 'java-packages-interfaces',
    hinglish: {
      title: 'Interface = bijli ka socket',
      text: 'Socket ka standard tay hai; jis appliance ka plug fit ho, woh chal jaata hai. `PaymentGateway` interface bhi bas yeh kehta hai ki kya chahiye — UPI ho ya card, dono plug ho sakte hain.',
      catch:
        'Plug fit hona sahi kaam ki guarantee nahi: interface sirf naam aur types check karta hai, behavior (timeout, errors) tests aur docs se pakka karo. Andar ki wiring `private` ya package-private se chhupao.',
    },
    en: {
      title: 'An interface is a power socket',
      text: 'The socket standard is fixed; any appliance whose plug fits will run. A `PaymentGateway` interface likewise only says what is needed — UPI or card, both can plug in.',
      catch:
        'A plug that fits does not guarantee the appliance works: an interface checks only names and types, so pin down behaviour (timeouts, errors) with tests and docs. Hide the inner wiring with `private` or package-private.',
    },
  },
  {
    id: 'java-streams-lambdas',
    hinglish: {
      title: 'Stream = paani ki pipe, nal kholo tab chale',
      text: '`filter` aur `map` pipe ke hisse jodte hain, par paani tab tak nahi behta. `collect` ya `forEach` jaisa terminal operation nal kholta hai — tabhi sab chalta hai.',
      catch:
        'Ek pipe ek hi baar chalti hai: same stream dobara use karoge toh IllegalStateException. Aur `Optional.get()` bina check ke khaali dabba khol kar NoSuchElementException deta hai.',
    },
    en: {
      title: 'A stream is a water pipe that flows only when you open the tap',
      text: '`filter` and `map` join sections of pipe, but no water flows yet. A terminal operation such as `collect` or `forEach` opens the tap — only then does anything run.',
      catch:
        'A pipe runs only once: reusing the same stream throws IllegalStateException. And `Optional.get()` without a check opens an empty box and throws NoSuchElementException.',
    },
  },
  {
    id: 'java-maven-testing',
    hinglish: {
      title: 'Maven = dabbawala system',
      text: '`pom.xml` delivery ki list hai: kaunsa dabba (dependency), kis version ka. Maven unhe central repository se laata hai aur phases ek fixed order mein chalata hai — compile, test, package.',
      catch:
        'Do dabbon mein ek hi cheez alag version mein aaye (transitive conflict) toh "nearest wins" — galat version chupchaap aa sakta hai. `mvn dependency:tree` se dekho.',
    },
    en: {
      title: 'Maven is a dabbawala delivery system',
      text: '`pom.xml` is the delivery list: which box (dependency) and which version. Maven fetches them from the central repository and runs its phases in a fixed order — compile, test, package.',
      catch:
        'When two boxes carry the same thing in different versions (a transitive conflict), "nearest wins" — the wrong version can arrive silently. Check with `mvn dependency:tree`.',
    },
  },
  {
    id: 'java-jdbc-sql',
    hinglish: {
      title: 'Transaction = bank transfer ka form',
      text: 'Transfer mein ek account se paise katenge aur doosre mein judenge — dono hon ya koi nahi. JDBC mein auto-commit band karo, dono updates chalao, phir `commit`; beech mein fail ho toh `rollback`.',
      catch:
        'Form ke box mein customer apni instruction nahi likh sakta, par SQL string jod kar banaoge toh likh sakta hai (SQL injection). Values hamesha `PreparedStatement` ke `?` se bhejo.',
    },
    en: {
      title: 'A transaction is a bank transfer form',
      text: 'In a transfer, money leaves one account and arrives in the other — both happen or neither does. In JDBC turn auto-commit off, run both updates, then `commit`; on a failure in between, `rollback`.',
      catch:
        "A customer cannot write their own instructions into a form's boxes, but they can into SQL built by joining strings (SQL injection). Always send values through `PreparedStatement` placeholders.",
    },
  },
  {
    id: 'java-sql-interview-lab',
    hinglish: {
      title: 'WHERE vs HAVING = tokri bharne se pehle chhantna ya baad mein',
      text: 'WHERE tokri mein daalne se pehle kharab aam hata deta hai. GROUP BY aamon ko tokriyon mein baantta hai. HAVING phir poori tokri dekh kar hatata hai — "jis tokri mein 10 se kam aam".',
      catch:
        'Aggregate (`COUNT`, `SUM`) WHERE mein nahi chalta, kyunki tab tak tokriyan bani hi nahi. Aur LEFT JOIN ke baad right table ki condition WHERE mein likhi toh woh chupchaap INNER JOIN ban jaata hai.',
    },
    en: {
      title: 'WHERE vs HAVING: sorting fruit before or after filling the baskets',
      text: 'WHERE removes bad mangoes before they go into a basket. GROUP BY splits the mangoes into baskets. HAVING then removes whole baskets — "any basket with fewer than 10 mangoes".',
      catch:
        'An aggregate (`COUNT`, `SUM`) cannot go in WHERE, because the baskets do not exist yet. And a condition on the right table placed in WHERE after a LEFT JOIN silently turns it into an INNER JOIN.',
    },
  },
  {
    id: 'java-concurrency-production',
    hinglish: {
      title: 'Thread pool = restaurant ke gine hue table',
      text: 'Tables (threads) gine hue hain aur waiting list (queue) bhi limited. Bheed zyada ho toh naye customers ko politely mana karo (rejection/backpressure), warna kitchen hi baith jaayegi.',
      catch:
        'Unlimited waiting list "kabhi mana nahi" lagti hai, par memory khaati hai aur har customer ka wait badhta jaata hai. Virtual threads se table sasti ho jaati hai, par kitchen (DB connections) utni hi rehti hai.',
    },
    en: {
      title: 'A thread pool is a restaurant with a fixed number of tables',
      text: 'The tables (threads) are counted and the waiting list (queue) is limited too. When the crowd is too big, politely turn new customers away (rejection, backpressure), or the kitchen collapses.',
      catch:
        'An unlimited waiting list feels like "never refuse anyone", but it eats memory and every customer waits longer. Virtual threads make tables cheap, yet the kitchen (database connections) stays the same size.',
    },
  },
  {
    id: 'java-type-metadata',
    hinglish: {
      title: 'Enum = chai ke fixed size',
      text: 'Chai ke sirf teen size hain: small, medium, large — koi "jumbo jaisa kuch" nahi bol sakta. Enum yahi deta hai, aur sealed interface poori guest list tay kar deta hai ki kaun implement kar sakta hai.',
      catch:
        'Database mein enum ka `ordinal` (0, 1, 2) save kiya toh beech mein naya size jodte hi purana data galat padhega — naam ya stable code save karo.',
    },
    en: {
      title: 'An enum is the fixed sizes of a tea',
      text: 'Tea comes in exactly three sizes: small, medium, large — nobody can order "something jumbo-ish". An enum gives you that, and a sealed interface fixes the guest list of who may implement it.',
      catch:
        "Save an enum's `ordinal` (0, 1, 2) in a database and inserting a new size in the middle makes old rows read wrong — store the name or a stable code.",
    },
  },
  {
    id: 'java-schema-migrations',
    hinglish: {
      title: 'Migration = ghar mein rehte hue renovation',
      text: 'Family andar hi reh rahi hai, isliye pehle naya kamra banao (column add), saamaan dheere-dheere shift karo (backfill), aur sab naye kamre mein aa jaayein tab purana todo (drop).',
      catch:
        'Seedha purana kamra tod diya toh jo abhi wahan the (purane app instances) gir jaate hain. App rollback se toota kamra wapas nahi banta — migration ka recovery plan alag rakho.',
    },
    en: {
      title: 'A migration is renovating a house while the family lives in it',
      text: 'The family is still inside, so first build the new room (add the column), move things over gradually (backfill), and knock down the old room only once everyone has moved (drop).',
      catch:
        'Knock the old room down straight away and whoever was still in it (old app instances) falls. Rolling back the app does not rebuild a demolished room — keep a separate recovery plan for the migration.',
    },
  },
  {
    id: 'java-low-level-design',
    hinglish: {
      title: 'LLD = parking ka register',
      text: 'Pehle rules likho: ek spot par ek gaadi, har gaadi ka ek active ticket. Classes (Spot, Ticket, Gate) baad mein aati hain — woh bas in rules ki raksha karti hain.',
      catch:
        'Sundar class diagram se rules safe nahi hote: do gate ek saath ek hi spot de dein, yeh concurrency ka sawal hai. Check aur assign ek hi atomic step mein karo.',
    },
    en: {
      title: 'Low-level design is a parking register',
      text: 'Write the rules first: one car per spot, one active ticket per car. The classes (Spot, Ticket, Gate) come after — their job is only to protect those rules.',
      catch:
        'A neat class diagram does not make the rules safe: two gates handing out the same spot at once is a concurrency question. Do the check and the assignment in one atomic step.',
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
  {
    id: 'spring-boot-first-application',
    hinglish: {
      title: 'Spring Boot = shaadi ka ready package',
      text: 'Spring event manager hai jo caterer, decorator aur band (beans) ko jodta hai. Boot ready package hai: classpath par jo dikha, uske hisaab se default setup laga deta hai (auto-configuration).',
      catch:
        'Package ka default tumhari zaroorat nahi jaanta: apna bean banaya toh Boot ka default hat jaata hai. Aur main class galat package mein ho toh manager doosre kamre ke vendors dhundh hi nahi paata (component scan).',
    },
    en: {
      title: 'Spring Boot is a ready-made wedding package',
      text: 'Spring is the event manager who brings the caterer, the decorator and the band (the beans) together. Boot is the ready package: it sets up defaults based on what it finds on the classpath (auto-configuration).',
      catch:
        "A package default does not know your needs: define your own bean and Boot's default backs off. And with the main class in the wrong package, the manager never finds the vendors in the other room (component scan).",
    },
  },
  {
    id: 'java-spring-rest',
    hinglish: {
      title: 'Dependency injection = supplier se saamaan aana',
      text: 'Chef khud khet mein sabzi nahi ugata; supplier kitchen tak pahuncha deta hai. Service ko bhi repository constructor se milti hai — test mein nakli supplier (mock) dena aasaan.',
      catch:
        'Supplier ek hi hai (singleton bean) aur sab chefs share karte hain — usme kisi ek order ka data field mein mat rakho. Controller sirf waiter hai; business rule service mein rakho.',
    },
    en: {
      title: 'Dependency injection is a supplier delivering to the kitchen',
      text: 'The chef does not grow vegetables; a supplier delivers them to the kitchen. A service likewise receives its repository through the constructor — so a test can hand it a fake supplier (a mock).',
      catch:
        "There is one supplier (a singleton bean) shared by every chef — never keep one order's data in its fields. The controller is only the waiter; business rules belong in the service.",
    },
  },
  {
    id: 'spring-validation-errors',
    hinglish: {
      title: 'Validation = event ka entry check',
      text: 'Gate par guard pass, naam aur umar check karta hai (`@Valid`). Galat ho toh har baar ek hi format ki rejection parchi milti hai — kis field mein kya galat (`ProblemDetail`).',
      catch:
        'Gate check sirf form dekhta hai; "yeh email pehle se registered hai" jaisa rule andar service aur DB unique constraint se pakka hota hai. Error response mein stack trace kabhi mat bhejo.',
    },
    en: {
      title: 'Validation is the entry check at an event',
      text: 'The guard at the gate checks the pass, the name and the age (`@Valid`). If something is wrong, you always get the same kind of rejection slip — which field is wrong and why (`ProblemDetail`).',
      catch:
        'The gate check only looks at the form; a rule such as "this email is already registered" is enforced inside, by the service and a database unique constraint. Never send a stack trace in an error response.',
    },
  },
  {
    id: 'spring-testing',
    hinglish: {
      title: 'Tests = part, assembly aur test drive',
      text: 'Unit test ek part (brake pad) check karta hai, slice test ek assembly (`@WebMvcTest` sirf web layer), aur `@SpringBootTest` poori gaadi ki test drive. Neeche wale saste aur tez, upar wale mehenge par asli.',
      catch:
        'Test ka rollback asli commit nahi: kuch DB constraints commit par hi fail hote hain. Aur H2 par pass hua test PostgreSQL par fail ho sakta hai — asli database Testcontainers se lo.',
    },
    en: {
      title: 'Tests are a part, an assembly and a test drive',
      text: 'A unit test checks one part (a brake pad), a slice test one assembly (`@WebMvcTest` is the web layer only), and `@SpringBootTest` is a test drive of the whole car. The lower ones are cheap and fast; the upper ones costly but real.',
      catch:
        "A test's rollback is not a real commit: some database constraints fail only at commit. And a test that passes on H2 can fail on PostgreSQL — use the real database through Testcontainers.",
    },
  },
  {
    id: 'java-observability-actuator',
    hinglish: {
      title: 'Observability = gaadi ka dashboard, black box aur GPS',
      text: 'Metrics dashboard hain (speed, temperature), logs black box ki recording, aur trace GPS route jo batata hai ki request kis-kis service se guzri.',
      catch:
        'Average speed achhi ho toh bhi kuch safar bahut dheeme ho sakte hain — p95/p99 dekho. Aur har user ID ko metric label banaoge toh dashboard hi phat jaayega (cardinality).',
    },
    en: {
      title: "Observability is a car's dashboard, black box and GPS",
      text: 'Metrics are the dashboard (speed, temperature), logs are the black-box recording, and a trace is the GPS route showing which services a request passed through.',
      catch:
        'A good average speed can hide some very slow journeys — look at p95/p99. And make every user ID a metric label and the dashboard itself bursts (cardinality).',
    },
  },
  {
    id: 'spring-deployment-capstone',
    hinglish: {
      title: 'Graceful shutdown = dukaan ka shutter',
      text: 'Band karne se pehle shutter aadha giraate ho: naye customer andar nahi aate (readiness false), andar wale apna saamaan le kar jaate hain (in-flight requests), phir taala.',
      catch:
        'Shutter ka time limit na ho toh dukaan kabhi band nahi hoti; aur bina shutter ke bijli kaati toh andar wale adhure bill ke saath phans jaate hain. Kubernetes ka grace period shutdown timeout se bada rakho.',
    },
    en: {
      title: "Graceful shutdown is a shop's shutter",
      text: 'Before closing you pull the shutter half down: no new customers come in (readiness false), the ones inside finish and leave (in-flight requests), and then you lock up.',
      catch:
        'Without a time limit the shop never closes; and cutting the power without the shutter strands customers mid-bill. Keep the Kubernetes grace period longer than the shutdown timeout.',
    },
  },
  {
    id: 'spring-background-cache',
    hinglish: {
      title: 'Cache = fridge mein rakha khana',
      text: 'Bana hua khana fridge mein rakh do toh dobara banana nahi padta (cache hit). Par har dabbe par date chahiye (TTL), aur recipe badli toh purana dabba hatao (eviction).',
      catch:
        'Fridge sabka ek hai: key mein user ya tenant nahi rakha toh kisi aur ka khana kisi aur ko milega. Aur `@Scheduled` job har replica par chalti hai — teen server matlab teen baar.',
    },
    en: {
      title: 'A cache is cooked food in the fridge',
      text: 'Put cooked food in the fridge and you need not cook again (a cache hit). But every box needs a date (TTL), and when the recipe changes the old box must go (eviction).',
      catch:
        "The fridge is shared: leave the user or tenant out of the key and someone gets another person's food. And a `@Scheduled` job runs on every replica — three servers means three runs.",
    },
  },
  {
    id: 'spring-servlet-mvc',
    hinglish: {
      title: 'Forward vs redirect = call transfer vs naya number dena',
      text: 'Forward mein receptionist call andar hi doosre department ko transfer karta hai — wahi call, customer ko pata bhi nahi. Redirect mein woh kehta hai "is number par phir se call karo" — browser nayi request bhejta hai.',
      catch:
        'Redirect ke baad pichli call ki baatein (request attributes) saath nahi jaatin. Aur ek servlet instance sab calls ek saath sunta hai — instance field mein kisi ek user ka data mat rakho.',
    },
    en: {
      title: 'Forward vs redirect: transferring a call vs giving a new number',
      text: 'With a forward, the receptionist transfers the call to another department internally — the same call, and the caller never notices. With a redirect they say "call this number instead" — the browser sends a new request.',
      catch:
        "After a redirect, what was said on the first call (request attributes) does not come along. And one servlet instance takes every call at once — never keep one user's data in an instance field.",
    },
  },
  {
    id: 'spring-ai-retrieval',
    hinglish: {
      title: 'RAG = open-book exam',
      text: 'Model yaad se nahi, saamne khuli kitaab ke panne padh kar jawab deta hai (retrieved chunks). Sahi panna mila toh jawab sahi, aur citation batata hai kahan se liya.',
      catch:
        'Galat panna khula toh achhi bhasha mein galat jawab milega — retrieval ko alag se test karo. Aur sirf wahi kitaabein do jo is user ko padhne ki ijazat hai: permission filter retrieval se pehle lagao.',
    },
    en: {
      title: 'RAG is an open-book exam',
      text: 'The model answers not from memory but from the pages of the book open in front of it (the retrieved chunks). Find the right page and the answer is right, and the citation shows where it came from.',
      catch:
        'Open the wrong page and you get a wrong answer in good language — test retrieval separately. And hand over only the books this user may read: apply the permission filter before retrieval.',
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
  {
    id: 'mongo-mongoose-validation-relations',
    hinglish: {
      title: '`populate` = contact list se number dhundhna',
      text: 'Order mein sirf customer ki ID likhi hai; `populate` contact list mein jaakar naam aur number le aata hai. Kaam ka hai, par yeh ek aur query hai.',
      catch:
        'Lambi list ke har order par alag lookup N+1 jaisa bojh hai — `populate` soch kar lagao, ya zaroori field embed karo. Mongoose validation sirf Mongoose se aayi writes par chalti hai; DB level guard ke liye unique index.',
    },
    en: {
      title: '`populate` is looking a number up in your contacts',
      text: "An order stores only the customer's ID; `populate` goes to the contact list and brings back the name and number. Handy, but it is one more query.",
      catch:
        'A separate lookup for every order in a long list is an N+1 burden — use `populate` deliberately, or embed the fields you always need. Mongoose validation runs only on writes made through Mongoose; a unique index guards the database itself.',
    },
  },
  {
    id: 'mongodb-query-production-lab',
    hinglish: {
      title: 'Index = phone diary ke A-Z tab',
      text: 'Tab ke bina "Sharma" dhundhne ke liye poori diary palatni padti hai (COLLSCAN). A-Z tab (index) seedha S par le jaata hai. `explain` batata hai ki tumne diary palti ya tab use kiya.',
      catch:
        'Har field ka tab lagao toh diary moti aur likhna dheema hota hai (writes, memory). Compound index mein order matter karta hai: equality pehle, phir sort, phir range.',
    },
    en: {
      title: 'An index is the A–Z tabs of an address book',
      text: 'Without tabs, finding "Sharma" means turning every page (COLLSCAN). The A–Z tabs (an index) take you straight to S. `explain` tells you whether you turned every page or used a tab.',
      catch:
        'Add a tab for every field and the book gets thick and slow to write in (writes, memory). In a compound index the order matters: equality first, then sort, then range.',
    },
  },
  {
    id: 'mongo-auth-security',
    hinglish: {
      title: 'Auth = office ka ID card aur floors',
      text: 'Gate par ID card dikhana authentication hai — tum kaun ho. Card se kaunse floor ka darwaza khulta hai, yeh authorization hai — tum kya kar sakte ho.',
      catch:
        'Valid card se har cabin nahi khulta: logged-in user ko bhi doosre user ka order mat dikhao (object-level check). Password ko hash karke rakho (bcrypt/argon2), encrypt karke nahi.',
    },
    en: {
      title: 'Auth is an office ID card and its floors',
      text: 'Showing your ID card at the gate is authentication — who you are. Which floors the card opens is authorization — what you may do.',
      catch:
        "A valid card does not open every cabin: a logged-in user must still not see another user's order (an object-level check). Store passwords hashed (bcrypt/argon2), not encrypted.",
    },
  },
  {
    id: 'mongo-production-integrations',
    hinglish: {
      title: 'Payment webhook = bank ka SMS',
      text: 'Customer screenshot dikhaye ki "pay kar diya", tab bhi order confirm nahi; bank ka SMS (provider ka signed webhook) aaye tab. Upload, email aur SSR mein bhi bahar se aayi cheez par seedha bharosa nahi.',
      catch:
        'Bank kabhi wahi SMS do baar bhej deta hai — event ID se duplicate pehchano. Aur SSR mein user ka text bina escape kiye HTML mein daala toh XSS.',
    },
    en: {
      title: "A payment webhook is the bank's SMS",
      text: "A customer's screenshot saying \"paid\" does not confirm the order; the bank's SMS (the provider's signed webhook) does. Uploads, email and SSR follow the same rule: nothing from outside is trusted as is.",
      catch:
        'The bank sometimes sends the same SMS twice — recognise duplicates by the event ID. And user text placed in SSR HTML without escaping is XSS.',
    },
  },
  {
    id: 'mongodb-testing-shutdown',
    hinglish: {
      title: 'HTTP test = mystery shopper',
      text: 'Mystery shopper kitchen mein nahi jhaankta; order deta hai aur dekhta hai kya mila — status, headers, body. Server ko asli port (`listen(0)`) par chala kar aise hi test karo.',
      catch:
        'Shopper ke baad dukaan band karna na bhoolo: har test ke baad server aur DB connection close karo, warna test suite khatam hi nahi hota. Shared database par parallel tests ek-doosre ka data bigaadte hain.',
    },
    en: {
      title: 'An HTTP test is a mystery shopper',
      text: 'A mystery shopper does not peek into the kitchen; they place an order and check what arrives — status, headers, body. Run the server on a real port (`listen(0)`) and test it the same way.',
      catch:
        "Remember to close up after the shopper: close the server and the database connection after each test, or the test run never finishes. Parallel tests on a shared database spoil each other's data.",
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
  {
    id: 'dsa-patterns',
    hinglish: {
      title: 'Two pointers = line ke dono sire se chalna',
      text: 'Height ke order mein khadi line mein do log dono sire se chalte hain: jodi chhoti padi toh left wala aage, badi padi toh right wala peeche. Har kadam ek option hamesha ke liye hata deta hai.',
      catch:
        'Yeh tabhi chalta hai jab line sorted ho; unsorted data par sort ka O(n log n) jodo, ya hash map se frequency gin kar kaam karo.',
    },
    en: {
      title: 'Two pointers walk in from both ends of a line',
      text: 'In a line sorted by height, two people walk in from both ends: if the pair is too short the left one steps forward, if too tall the right one steps back. Every step rules one option out for good.',
      catch:
        'It works only when the line is sorted; on unsorted data add the O(n log n) of sorting, or count frequencies with a hash map instead.',
    },
  },
  {
    id: 'dsa-sorting',
    hinglish: {
      title: 'Merge sort = do sorted dher milana',
      text: 'Do teachers ne apne answer sheets ke dher roll number se sort kar diye. Milane ke liye dono ke upar wale paper dekho aur chhota uthao — har baar ek hi comparison. Yahi baar-baar karne se O(n log n).',
      catch:
        'Milane ke liye ek extra mez chahiye (O(n) memory). Quicksort jagah bachata hai par bura pivot mile toh O(n²); chhoti list par insertion sort aksar tez hota hai.',
    },
    en: {
      title: 'Merge sort merges two sorted piles',
      text: 'Two teachers have each sorted their pile of answer sheets by roll number. To merge, look at the top sheet of each pile and take the smaller — one comparison each time. Doing this repeatedly gives O(n log n).',
      catch:
        'Merging needs an extra table (O(n) memory). Quicksort saves space but turns O(n²) with bad pivots; on a small list insertion sort is often faster.',
    },
  },
  {
    id: 'dsa-monotonic-stack-lab',
    hinglish: {
      title: 'Monotonic stack = line mein pehla lamba aadmi',
      text: 'Line mein har insaan jaanna chahta hai ki uske baad pehla lamba kaun aaya. Naya lamba aadmi aate hi peeche khade sab chhote logon ko jawab mil jaata hai, aur woh stack se nikal jaate hain.',
      catch:
        'Andar loop dikhne par bhi kaam O(n) hai, kyunki har insaan ek hi baar stack mein aata aur jaata hai. "Pehla bada" chahiye ya "bada ya barabar" — pop ki condition (`<` vs `<=`) usi se badalti hai.',
    },
    en: {
      title: 'A monotonic stack finds the first taller person in a line',
      text: 'Everyone in a line wants to know who is the first taller person after them. When a tall person arrives, all the shorter people waiting get their answer and leave the stack.',
      catch:
        'Despite the inner loop the work is O(n), because each person enters and leaves the stack once. Whether you need "first greater" or "greater or equal" decides the pop condition (`<` vs `<=`).',
    },
  },
  {
    id: 'dsa-trees',
    hinglish: {
      title: 'BST = "chhota left, bada right" wale signboard',
      text: 'Har chauraahe par board: chhota number left, bada right. Dhundhne mein har mod par aadha shehar chhoot jaata hai — balanced tree mein O(log n).',
      catch:
        'Sorted order mein numbers daaloge toh shehar ek lambi seedhi gali ban jaata hai (skewed) aur search O(n). Isliye asli systems mein self-balancing tree (red-black, AVL) ya B-tree.',
    },
    en: {
      title: 'A BST is a city of "smaller left, larger right" signposts',
      text: 'Every junction has a sign: smaller numbers to the left, larger to the right. Each turn while searching leaves half the city behind — O(log n) in a balanced tree.',
      catch:
        'Insert numbers in sorted order and the city becomes one long straight street (skewed), so search is O(n). That is why real systems use self-balancing trees (red-black, AVL) or B-trees.',
    },
  },
  {
    id: 'dsa-heaps',
    hinglish: {
      title: 'Heap = emergency ward ka triage',
      text: 'Emergency mein pehle aane wala nahi, sabse serious mareez pehle dekha jaata hai. Heap bhi top par hamesha sabse chhota (ya bada) rakhta hai; naya mareez jodna ya top nikalna O(log n).',
      catch:
        'Triage sirf "sabse serious kaun" batata hai, poori list sorted nahi hoti — beech ka element dhundhna O(n). Aur Java ka `PriorityQueue` default min-heap hai.',
    },
    en: {
      title: 'A heap is triage in an emergency ward',
      text: 'In an emergency the most serious patient is seen first, not the first to arrive. A heap likewise always keeps the smallest (or largest) on top; adding a patient or taking the top is O(log n).',
      catch:
        "Triage only tells you who is most serious; the rest is not sorted — finding an element in the middle is O(n). And Java's `PriorityQueue` is a min-heap by default.",
    },
  },
  {
    id: 'dsa-greedy-intervals',
    hinglish: {
      title: 'Greedy = jo meeting sabse pehle khatam ho',
      text: 'Zyada se zyada meetings attend karni hain? Jo sabse pehle khatam ho, use chuno — din ka zyada time baaki bachta hai. Har kadam par local best choice.',
      catch:
        'Greedy ka proof chahiye, aadat nahi: "sabse chhoti meeting pehle" galat jawab deta hai. Aur meetings ki value alag ho (weighted) toh greedy fail — wahan DP lagta hai.',
    },
    en: {
      title: 'Greedy picks the meeting that ends first',
      text: 'Want to attend as many meetings as possible? Pick the one that ends first — it leaves the most of the day free. A locally best choice at every step.',
      catch:
        'Greedy needs a proof, not a habit: "shortest meeting first" gives wrong answers. And when meetings carry different values (weighted), greedy fails — that needs DP.',
    },
  },
  {
    id: 'dsa-tries-range-bits',
    hinglish: {
      title: 'Trie = type karte hi contact search',
      text: 'Phone mein "Ra" type karte hi Rahul, Ravi, Rani aa jaate hain — sab "R" ke baad "a" wali shaakh par hain. Trie mein lookup word ki length jitna, chahe kitne bhi words hon.',
      catch:
        'Har node mein bachchon ka map memory khaata hai; kam words hon toh sorted array aur binary search sasta. Aur "ca" ki shaakh hone se "ca" word hona prove nahi — end marker chahiye.',
    },
    en: {
      title: 'A trie is contact search as you type',
      text: 'Type "Ra" on a phone and Rahul, Ravi and Rani appear — they all sit on the "a" branch after "R". A trie lookup costs the length of the word, however many words there are.',
      catch:
        'Each node\'s map of children costs memory; for few words a sorted array with binary search is cheaper. And a "ca" branch does not prove "ca" is a word — you need an end marker.',
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
  {
    id: 'design-react-architecture',
    hinglish: {
      title: 'SSG, SSR, CSR = tiffin, restaurant aur ghar ka khana',
      text: 'SSG subah ka bana packed tiffin hai — turant milta hai. SSR order par restaurant mein banta hai — taaza, par thoda wait. CSR mein saamaan ghar aata hai aur khana browser khud banata hai.',
      catch:
        'Packed tiffin sabke liye ek jaisa hai — kisi ka naam likha (personalized) page CDN ki shared cache mein mat rakho. Aur hydration mein ghar ka khana restaurant wale jaisa hi dikhna chahiye, warna mismatch.',
    },
    en: {
      title: 'SSG, SSR, CSR: a packed lunch, a restaurant and cooking at home',
      text: 'SSG is a lunch packed in the morning — you get it at once. SSR is cooked at the restaurant when you order — fresh, with a short wait. CSR delivers the ingredients and the browser cooks at home.',
      catch:
        "A packed lunch is the same for everyone — never put a page with someone's name on it (personalized) in a CDN's shared cache. And during hydration the home-cooked meal must look exactly like the restaurant's, or you get a mismatch.",
    },
  },
  {
    id: 'design-react-data-state',
    hinglish: {
      title: 'State ka ghar = jeb, notice board aur bank',
      text: 'Abhi ka draft jeb mein (local state), share karne wali cheez ghar ke notice board par (URL), aur paisa bank mein (server state) — tumhare paas bas uski passbook copy hai (cache).',
      catch:
        'Passbook purani ho sakti hai: mutation ke baad refetch ya invalidate karo. Aur logout par jeb aur passbook dono khaali karo, warna agla user pichhle ka data dekhega.',
    },
    en: {
      title: 'Where state lives: a pocket, a noticeboard and a bank',
      text: 'The draft you are writing goes in your pocket (local state), things to share on the house noticeboard (the URL), and the money stays in the bank (server state) — you only hold a copy of the passbook (the cache).',
      catch:
        "The passbook can be out of date: refetch or invalidate after a mutation. And on logout empty both the pocket and the passbook, or the next user sees the previous one's data.",
    },
  },
  {
    id: 'design-frontend-performance',
    hinglish: {
      title: 'LCP, INP, CLS = khana, waiter aur hilti plate',
      text: 'LCP: main dish kitni der mein aayi. INP: haath uthaya toh waiter kitni jaldi aaya. CLS: khaate waqt plate khisak toh nahi gayi (layout shift).',
      catch:
        'Apne tez phone par test karna owner ka khud khana chakhna hai — asli users ke p75 numbers (RUM) dekho. Image ki width aur height pehle se do, warna plate khisakti hai.',
    },
    en: {
      title: 'LCP, INP, CLS: the food, the waiter and a sliding plate',
      text: 'LCP: how long the main dish took to arrive. INP: how quickly the waiter came when you raised your hand. CLS: whether your plate slid while you were eating (layout shift).',
      catch:
        "Testing on your own fast phone is the owner tasting the food — look at real users' p75 numbers (RUM). Give images their width and height up front, or the plate slides.",
    },
  },
  {
    id: 'system-design-frontend-design-round',
    hinglish: {
      title: 'Frontend design round = shaadi ki planning',
      text: 'Pehle sawal: kitne guest (scale), kya budget (performance), kaun aayega (devices, accessibility). Phir venue aur layout (components, state), phir khana aur transport (data flow), aur aakhir mein "baarish hui toh?" (failures).',
      catch:
        'Seedha decoration (UI libraries) se shuru kiya toh guest list badalte hi sab dobara karna padega. Har choice ke saath chhode hue option ki keemat bhi bolo.',
    },
    en: {
      title: 'A frontend design round is planning a wedding',
      text: 'First the questions: how many guests (scale), what budget (performance), who is coming (devices, accessibility). Then the venue and layout (components, state), then food and transport (data flow), and finally "what if it rains?" (failures).',
      catch:
        'Start with the decorations (UI libraries) and a changed guest list means redoing everything. With each choice, also state the cost of the option you rejected.',
    },
  },
  {
    id: 'design-java-api-data',
    hinglish: {
      title: 'Idempotency key = order ka token number',
      text: 'Network kat gaya toh customer wahi order dobara bolta hai. Token number (idempotency key) dekh kar counter kehta hai "yeh order ban chuka" aur dobara nahi banata.',
      catch:
        'Token aur order ek hi transaction mein save hon, warna crash ke beech duplicate ban sakta hai. Same token par alag order aaye (payload alag) toh use reject karo, purana jawab mat do.',
    },
    en: {
      title: "An idempotency key is an order's token number",
      text: 'When the network drops, the customer repeats the same order. Seeing the token number (the idempotency key), the counter says "that order is already made" and does not make it again.',
      catch:
        'Save the token and the order in one transaction, or a crash in between can still create a duplicate. A different order with the same token (a different payload) must be rejected, not answered with the old result.',
    },
  },
  {
    id: 'system-design-backend-design-round',
    hinglish: {
      title: 'Reservation = cinema seat ka hold',
      text: 'Seat select karte hi 10 minute ka hold milta hai; payment hua toh seat pakki, timer khatam toh wapas. Do log ek saath aakhri seat dabayein toh database ka conditional update hi decide karta hai kaun jeeta.',
      catch:
        'Timer browser ka nahi, server ya DB ki ghadi ka ho. Payment hold khatam hone ke 5 second baad aaya toh seat ja chuki ho sakti hai — refund ka rasta pehle se socho.',
    },
    en: {
      title: 'A reservation is a hold on a cinema seat',
      text: "Selecting a seat gives you a 10-minute hold; pay and the seat is yours, let the timer run out and it goes back. When two people tap the last seat at once, the database's conditional update decides who wins.",
      catch:
        "The timer must run on the server's or database's clock, not the browser's. If the payment arrives 5 seconds after the hold expired, the seat may be gone — plan the refund path in advance.",
    },
  },
  {
    id: 'design-commerce-case-study',
    hinglish: {
      title: 'Catalog vs checkout = shop window vs billing counter',
      text: 'Window display (catalog) thoda purana bhi chalega, isliye cache karo. Billing counter par price aur stock hamesha taaza aur server ka — customer ka bataya price nahi.',
      catch:
        'Payment page par "success" redirect se order pakka nahi hota; provider ka verified webhook ya status check chahiye. Aur ek hi payment ke do webhook aayein toh order do baar confirm na ho.',
    },
    en: {
      title: 'Catalog vs checkout: the shop window vs the billing counter',
      text: 'The window display (the catalog) may be a little out of date, so cache it. At the billing counter the price and stock are always fresh and come from the server — never the price the customer sends.',
      catch:
        'A "success" redirect after payment does not confirm the order; you need the provider\'s verified webhook or a status check. And two webhooks for one payment must not confirm the order twice.',
    },
  },
  {
    id: 'design-realtime-case-study',
    hinglish: {
      title: 'WebSocket, SSE, polling = phone call, radio aur baar-baar poochna',
      text: 'WebSocket phone call hai — dono taraf baat. SSE radio hai — server bolta hai, client sunta hai. Polling har thodi der mein "kuch aaya kya?" poochna hai — simple, par bahut si bekaar requests.',
      catch:
        'Phone kat bhi jaata hai: reconnect par beech ke messages kahan se laoge? Har message ka sequence ya ID rakho, warna duplicate ya missing. Aur call chalu hone se user ka access abhi bhi valid hai, yeh prove nahi hota.',
    },
    en: {
      title: 'WebSocket, SSE, polling: a phone call, a radio and asking again and again',
      text: 'A WebSocket is a phone call — both sides talk. SSE is a radio — the server speaks and the client listens. Polling is asking "anything new?" every so often — simple, but many wasted requests.',
      catch:
        "Calls drop: after a reconnect, where do the messages in between come from? Give every message a sequence or ID, or you get duplicates and gaps. And an open call does not prove the user's access is still valid.",
    },
  },
  {
    id: 'system-design-os-network-debugging',
    hinglish: {
      title: 'Slow request = parcel tracking',
      text: 'Parcel late hai toh har stage ka time dekho: pata dhundhna (DNS), sadak aur gate (TCP/TLS), godaam mein packing (server), aur raasta (transfer). Jahan time gaya, problem wahi.',
      catch:
        'Packing tez thi par saamaan ke liye line mein khade rahe (connection pool wait) — woh bhi server time mein chhupa hota hai. "SQL 10 ms hai" ka matlab poori request 10 ms nahi.',
    },
    en: {
      title: 'A slow request is parcel tracking',
      text: 'When a parcel is late, check the time at each stage: finding the address (DNS), the road and the gate (TCP/TLS), packing at the warehouse (the server), and the journey (transfer). The problem is where the time went.',
      catch:
        'Packing may be quick while the goods waited in a queue (connection pool wait) — that also hides inside server time. "The SQL takes 10 ms" does not mean the whole request does.',
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
  {
    id: 'interview-javascript',
    hinglish: {
      title: 'Interview answer = raasta batana',
      text: 'Achha raasta batane wala pehle seedhi baat kehta hai ("main road par seedhe"), phir ek mushkil mod batata hai ("petrol pump ke baad left, pehle nahi"). Definition aur ek key catch — bas.',
      catch:
        'Poore shehar ka itihaas sunane se raasta nahi milta: lamba lecture mat do. Output poocha ho toh pehle exact output bolo, phir kyun.',
    },
    en: {
      title: 'An interview answer is giving directions',
      text: 'Someone good at directions says the main thing first ("straight along the main road"), then the one tricky turn ("left after the petrol pump, not before"). A definition and one key catch — that is it.',
      catch:
        'The history of the whole city does not get anyone there: no long lectures. When asked for an output, give the exact output first, then the reason.',
    },
  },
  {
    id: 'interview-java',
    hinglish: {
      title: '`==` vs `.equals()` = wahi insaan vs judwa bhai',
      text: '`==` poochta hai "kya yeh wahi insaan hai?" (same reference). `.equals()` poochta hai "kya dono ek jaise hain?" — judwa bhai bhi equal ho sakte hain, agar class ne aisa define kiya.',
      catch:
        '`equals` override kiya aur `hashCode` nahi, toh HashMap judwa ko alag drawer mein dhundhta hai aur nahi milta. `Integer` -128 se 127 tak cache hota hai, isliye wahan `==` kabhi chal jaata hai — bharosa mat karo.',
    },
    en: {
      title: '`==` vs `.equals()`: the same person vs a twin',
      text: '`==` asks "is this the very same person?" (the same reference). `.equals()` asks "are these two alike?" — twins can be equal if the class defines it that way.',
      catch:
        'Override `equals` without `hashCode` and a HashMap looks for the twin in the wrong drawer and never finds it. `Integer` caches -128 to 127, so `==` sometimes works there — do not rely on it.',
    },
  },
  {
    id: 'interview-react',
    hinglish: {
      title: 'React state = photo, live video nahi',
      text: 'Har render ek photo hai — us photo ke handlers wahi values dekhte hain jo photo khinchte waqt thi. `setCount` nayi photo maangta hai, purani photo nahi badalta.',
      catch:
        'Isliye ek handler mein teen baar `setCount(count + 1)` likho toh value ek hi badhti hai. Pichli value se update karna ho toh `setCount((c) => c + 1)`.',
    },
    en: {
      title: 'React state is a photo, not a live video',
      text: 'Every render is a photo — its handlers see the values from the moment the photo was taken. `setCount` asks for a new photo; it does not change the old one.',
      catch:
        'That is why three `setCount(count + 1)` calls in one handler add only one. To update from the previous value, write `setCount((c) => c + 1)`.',
    },
  },
  {
    id: 'interview-mongodb',
    hinglish: {
      title: 'Embed vs reference = batua vs file cabinet',
      text: 'Jo cheez hamesha saath chahiye aur chhoti hai (address), use batue mein rakho (embed). Jo badhti rahe ya alag se dekhni pade (saare orders), use file cabinet mein rakho aur batue mein sirf number (reference).',
      catch:
        'Batua phat bhi sakta hai: ek document 16 MB se bada nahi ho sakta, aur bina limit badhti array dheemi padti hai. Faisla read/write pattern se karo, aadat se nahi.',
    },
    en: {
      title: 'Embed vs reference: a wallet vs a filing cabinet',
      text: 'What you always need and is small (an address) goes in the wallet (embed). What keeps growing or is looked at on its own (all the orders) goes in the filing cabinet, with only its number in the wallet (a reference).',
      catch:
        'A wallet can burst: a document cannot exceed 16 MB, and an array that grows without a limit gets slow. Decide from the read and write pattern, not by habit.',
    },
  },
  {
    id: 'interview-system-design',
    hinglish: {
      title: 'System design = ghar banane se pehle naksha',
      text: 'Kitne log rahenge (requirements), kitna budget aur zameen (estimate), phir kamre aur raaste (APIs, data), phir bijli-paani (architecture), aur aakhir mein "bhookamp aaye toh?" (failure).',
      catch:
        'Pehle din se 100 manzil ka plan mat banao: estimate se dikhao bottleneck kahan hai, tabhi cache, queue ya shard jodo. Har jod ka kharcha bhi batao.',
    },
    en: {
      title: 'System design is drawing the plan before building a house',
      text: 'How many people will live there (requirements), how much budget and land (the estimate), then rooms and paths (APIs, data), then power and water (architecture), and finally "what if there is an earthquake?" (failure).',
      catch:
        'Do not plan a hundred floors on day one: show with the estimate where the bottleneck is, and only then add a cache, a queue or shards. State what each addition costs.',
    },
  },
];

const byChapter = Object.fromEntries(ANALOGIES.map((item) => [item.id, item]));

export function analogyFor(noteId, lang) {
  const item = byChapter[noteId];
  return item ? item[lang] || item.hinglish : null;
}
