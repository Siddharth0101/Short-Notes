---
id: design-frontend-performance
title: Frontend performance accessibility and resilience
track: system-design
order: 5
level: Intermediate
minutes: 27
summary: Performance aur accessibility user ke observable outcomes hain; unke measurable targets define karo.
tags: performance, accessibility, web-vitals, react
visual: react-render
---

## Mental model — simple soch

Fast frontend ka matlab sirf small bundle nahi. Content jaldi visible ho, interactions responsive hon, layout stable rahe and user task complete kar sake. Accessibility same reliability goal ka part hai: keyboard, screen reader or reduced-motion preference ke saath interface usable rehna chahiye.

> **Core takeaway:** Performance aur accessibility user ke observable outcomes hain; unke measurable targets define karo.

## Measure user experience

Core Web Vitals LCP loading, INP interaction responsiveness and CLS layout stability indicate karte hain. Good thresholds at the 75th percentile are LCP at most 2.5 seconds, INP at most 200 milliseconds, CLS at most 0.1. Lab diagnostics repeatable conditions provide karte hain; real-user data device/network diversity reveal karta hai. [Web Vitals](https://web.dev/articles/vitals)

Instrument route, device class and release version dimensions carefully. Personal user IDs high-cardinality metric labels mein mat daalo. User-visible issue identify karo, trace or profile se expensive work locate karo, then targeted change verify karo. Universal `useMemo` insertion measurement ka substitute nahi.

## A performance budget example

Assume slow-device study reader target: initial compressed JavaScript under a chosen 150 KB budget and useful content visible in roughly two seconds on the selected test network. These are project example budgets, universal standards nahi. Markdown rendering or syntax highlighting ko every navigation par unnecessarily repeat mat karo. Heavy visual lab route lazily load ho sakta hai.

```text
critical path: HTML -> critical CSS -> chapter content
noncritical:  interview bank -> visual simulation -> optional highlighting
```

Independent data requests parallel start karo to avoid waterfall. Long lists virtualize karne se DOM work reduce hota hai, but browser find, focus movement and screen-reader semantics inspect karo. Images ke dimensions reserve karo to prevent layout shifts. Heavy CPU transform worker mein shift karna main thread free kar sakta hai, with serialization cost tradeoff.

### Budget ko line items mein todo

150 KB ka aggregate budget tab tak useless hai jab tak har library ka apna allocation na ho. Ek realistic reader route ka breakdown (compressed sizes, approximate aur version-dependent):

| Item | Compressed | Justification |
| --- | --- | --- |
| React + React DOM | ~45 KB | Framework baseline, non-negotiable |
| Router | ~12 KB | Needed for nested routes |
| Server-data cache library | ~13 KB | Replaces ~500 lines of hand-written fetch logic |
| Markdown renderer | ~25 KB | Core product feature |
| Syntax highlighter (full) | ~120 KB | **Over budget alone** — lazy load ya subset karo |
| App code (reader route) | ~30 KB | Feature code |
| Icons (tree-shaken subset) | ~4 KB | Full icon pack 200 KB+ hota hai |

Total without highlighter ≈ 129 KB, budget ke andar. Highlighter add karte hi 249 KB — 66% over. Yeh table exactly wo conversation enable karti hai jo budget ka point hai: highlighter ko `import()` ke peeche daalo aur sirf tab load karo jab page par actual code block ho, ya sirf 5 languages ka subset bundle karo (~20 KB). Aggregate number "bundle bada hai" batata hai; line items batate hain *kya karna hai*.

Mid-tier Android device par rough parse+execute cost ~1 ms per KB of compressed JavaScript maano (yeh device-dependent estimate hai, guarantee nahi). Matlab 250 KB ≈ 250 ms pure main-thread work, download ke *alawa* — aur wo time ke dauran page frozen rehta hai. Yehi reason hai ki bundle size ko bytes ke bajaye milliseconds mein sochna better framing hai.

### INP aur long tasks

INP 200 ms threshold ka matlab hai: click se next paint tak ka poora chain 200 ms mein fit hona chahiye. Uska breakdown:

```text
input delay      : main thread busy tha, event handler start hi nahi hua
processing time  : handler + React state update + re-render
presentation delay: browser layout, paint, composite
```

Sabse common culprit input delay hota hai, processing nahi — koi aur kaam (analytics script, large JSON parse, un-virtualized list render) main thread 300 ms block kar raha tha, aur user ka click queue mein baitha raha. Isliye INP fix aksar handler optimize karne se nahi, balki *unrelated* long tasks todne se aata hai. 50 ms se lambi koi bhi task "long task" hai; ek 400 ms JSON parse ko chunk karo ya worker mein bhejo.

React-specific pattern: ek badi list par filter type karte waqt input laggy hota hai kyunki har keystroke poori list re-render karti hai. Transition/deferred value se input update urgent rehti hai aur list update interruptible ho jaati hai — lekin yeh CPU cost hataata nahi, sirf usse yield karne layak banata hai. Agar list 50,000 rows ki hai toh asli fix virtualization ya server-side filtering hai.

### Jab backend slow ho jaaye

Frontend performance work ka ek bada hissa backend ki degradation handle karna hai, kyunki p99 backend latency user ke liye frontend problem ki tarah dikhti hai. Teen behaviors explicitly design karo:

- **Timeout with a visible outcome.** Har user-initiated request par client-side timeout ho (jaise 10 s) jiske baad ek retry affordance dikhe. Infinite spinner sabse kharab state hai kyunki user ko na progress pata hai na option.
- **Partial rendering.** Agar page 4 API calls karta hai aur ek slow hai, baaki teen ka content dikhao aur slow section ke liye skeleton rakho. Poora page ek slow dependency par hostage nahi hona chahiye.
- **Degrade, don't disappear.** Recommendation service down ho toh us section ko hide karke baaki page normally chalao, aur error ko silently log karo — user ko har failed sub-request ka error dikhana noise hai.

## React-specific diagnosis

Render function execute hona DOM mutation hona nahi hai. Profiler actual committed work identify kare. Stable keys identity preserve karte hain; index keys reordered editable lists mein state attach to wrong row kar sakti hain. Expensive update ko transition/deferred display se schedule kar sakte ho, lekin this does not debounce network calls or remove compute cost.

## Accessible interaction contract

Native button and link correct semantics provide karte hain. Dialog mein accessible label, focus management, Escape behavior and focus return define karo. Tabs arrow-key behavior and selected state expose karein. Form error field se associate karo; color alone error communicate na kare. Animation mein pause, step and restart controls learning improve karte hain.

```css
@media (prefers-reduced-motion: reduce) {
  .moving-token { animation: none; transition: none; }
}
```

Motion disable hone par meaning static labels and state descriptions se available rahe. Long simulation screen reader ko every frame announce na kare; meaningful step updates announce karo.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `useMemo`/`useCallback` har jagah laga dene se app fast hoti hai. **Why it breaks:** Dono ka apna cost hai — dependency array har render par compare hoti hai, memoized value memory mein retain hoti hai, aur ek unstable dependency (inline object/array) memoization ko har baar invalidate karke pure overhead bana deti hai. Aur agar child `memo` se wrapped nahi hai toh `useCallback` se koi re-render bachta hi nahi. **Fix:** Pehle Profiler se measure karo ki kaun sa component actually expensive hai; memoization ko genuinely costly computation aur genuinely memoized children tak limit rakho.
- **Wrong assumption:** Virtualization long list ka universal fix hai. **Why it breaks:** Virtualized list mein browser ka Ctrl+F kaam nahi karta (off-screen rows DOM mein nahi hain), keyboard focus scroll ke saath unmount hone par lose ho sakta hai, aur screen reader ko total count/position clearly nahi milta — matlab performance win accessibility regression ke saath aata hai. **Fix:** Virtualize karne se pehle poochho ki list itni badi kyun hai; pagination ya better filtering aksar behtar product answer hai. Virtualize karo toh `aria-setsize`/`aria-posinset` expose karo aur keyboard navigation explicitly test karo.
- **Wrong assumption:** Lighthouse 100 score ka matlab hai app fast hai. **Why it breaks:** Lighthouse ek simulated lab run hai, ek route par, ek device profile par, usually cold cache aur no authentication ke saath. Real users logged-in dashboard par 3-year-old phone se aate hain jahan 200 rows aur 6 third-party scripts hain — us journey ko Lighthouse ne kabhi dekha hi nahi. **Fix:** Real-user monitoring (field data) primary signal banao, lab runs ko regression detection ke liye use karo, aur specifically logged-in critical journeys instrument karo.
- **Wrong assumption:** Third-party scripts (analytics, chat widget, A/B testing) performance ko zyada affect nahi karte kyunki wo `async` load hote hain. **Why it breaks:** `async` sirf download ko non-blocking banata hai; execute hone par wo script main thread ko utna hi block karti hai, aur A/B testing scripts toh aksar deliberately render block karti hain taaki flicker na ho. Ek 80 KB chat widget INP ko 200 ms se 500 ms le jaa sakti hai bina kisi app code change ke. **Fix:** Har third-party ko explicit budget do, unhe defer/lazy karo (chat widget user interaction par load ho), aur regularly measure karo ki unka main-thread contribution kitna hai.
- **Wrong assumption:** Accessibility ek final QA checklist item hai. **Why it breaks:** Focus management, semantics aur keyboard flow component structure se determine hote hain — `<div onClick>` ko baad mein accessible banana matlab component rewrite karna, aur modal ka focus trap retrofit karna usually poori dialog architecture touch karta hai. **Fix:** Native elements se start karo (`button`, `a`, `dialog`, `label`), aur har interactive component ke acceptance criteria mein keyboard path shuru se likho.

## Interview questions — bolkar practice karo

**What do you optimize first?** Slow user journey measure karke largest bottleneck identify karta hoon. Network, CPU, rendering and server delay different fixes demand karte hain.

**Is a perfect Lighthouse score enough?** Nahi. It is one lab signal; real traffic, accessibility behavior, correctness and business task completion separately validate karne padte hain.

**Page par ek slow API call hai jo 3 seconds leti hai — frontend se kya kar sakte ho?** Pehle confirm karunga ki wo call critical path par hai ya nahi. Agar nahi, usse defer karke baaki page render karunga aur us section ka skeleton dikhaunga. Agar hai, toh check karunga ki wo waterfall ka hissa toh nahi (kisi aur request ke baad serially chal rahi) — parallel karne se aksar 3 s ka aadha bachta hai. Frontend se latency kam nahi kar sakta, lekin perceived latency control kar sakta hoon: streaming/partial render, cached previous data with an updating indicator, aur optimistic navigation. Saath hi backend team ko p95 data ke saath specific endpoint report karunga, "app slow hai" nahi.

**Bundle 400 KB hai, kahan se cut karoge?** Guess karne ke bajaye bundle analyzer chalaunga aur top 5 contributors dekhungaa. Typical wins predictable hote hain: full icon pack ki jagah tree-shaken imports, moment-style date library ki jagah native `Intl`, poora syntax highlighter ki jagah language subset ya lazy import, aur ek hi kaam ke liye do libraries (jaise do date libraries transitively aayi hui). Uske baad route-level code splitting — sabse bada single win aksar yeh hota hai ki admin/settings routes ko initial bundle se hatao.

**INP kharab hai lekin handlers fast hain — kya dekhoge?** Input delay dekhungaa, processing time nahi. Performance trace mein long tasks (>50 ms) dhoondhungaa jo click ke aas-paas chal rahe hain — analytics flush, large JSON parse, un-throttled scroll handler, ya ek badi list ka re-render. Fix aksar unrelated code ko chunk/defer/worker mein bhejna hota hai, handler optimize karna nahi.

## Practice

Slow device emulation pe reader profile karo. Keyboard-only search-to-chapter journey complete karo. Reduced motion enable karke animation ka explanation usable hai ya nahi verify karo. Before/after evidence capture karo.

Phir ek budget table apne project ke liye banao: top 8 dependencies ki compressed sizes list karo aur decide karo kaun sa initial bundle mein rehna deserve karta hai. Uske baad artificial long task inject karo (ek 400 ms synchronous loop ek `setInterval` mein) aur button click karke INP degradation observe karo — phir usse `requestIdleCallback` ya chunked loop mein todh kar difference measure karo. Last mein ek API ko 5 s delay par mock karke verify karo ki page partial content dikhata hai, infinite spinner nahi.

## Depth walkthrough — andar kya ho raha hai?

### Lab score aur real user distribution same evidence nahi

Fast laptop par one page load record controlled baseline hai. Real mobile users ke slow CPU, network, cache state aur interaction paths different hain. Field distribution affected segment identify kare; lab trace reproduce karke cause isolate kare. One average all slow users hide kar sakti hai.

LCP loading, INP responsiveness aur CLS visual stability ke different symptoms hain. Image dimensions reserve karna layout shift reduce kar sakta hai; JS long task ka separate fix chahiye. Virtualization DOM volume reduce karti hai but focus/reading order aur data transfer cost separately validate ho.

**Practice:** Chosen device/network par same interaction before-after record karo. Visual stability, keyboard operability aur content correctness regress na hon. Performance budget product target hai; arbitrary threshold ko har app par universally sufficient guarantee mat bolo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Grid laptop par fast hai, phone par slow aur hard-to-use. Chhoti validation matrix aur success signal do.

> **Hint — chhota ishara:** Device capability, network aur input method change karke dekho.

**Answer guide — pehle khud karo, phir compare karo:** Realistic rows ke saath narrow viewport, slower CPU/network aur keyboard test karo. Input-to-visible-update timing, loading, focus, labels aur error recovery verify karo. Product requirement se target set karke before/after compare karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Web Vitals](https://web.dev/articles/vitals)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Reduced motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
