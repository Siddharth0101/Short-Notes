---
id: design-react-architecture
title: React architecture rendering and delivery
track: system-design
order: 3
level: Intermediate
minutes: 28
summary: Rendering approach route requirements aur data freshness se choose karo; poori app ko ek hi rule dena zaroori nahi.
tags: react, architecture, ssr, hydration, cdn
visual: react-render
---

## Mental model — simple soch

Frontend architecture UI state ko reliable user experience mein translate karti hai. Component hierarchy, routing, data ownership, accessibility and delivery strategy saath design hote hain. Folder names alone architecture nahi. Feature ko independently reason aur change kar paana more important hai than many abstraction layers.

> **Core takeaway:** Rendering approach route requirements aur data freshness se choose karo; poori app ko ek hi rule dena zaroori nahi.

## Organize around product capabilities

```text
src/
  app/                 routing and top-level providers
  features/
    library/           search, results, filters
    study/             reader, progress, bookmarks
    account/           profile and authentication UI
  shared/
    ui/                buttons, dialogs, form primitives
    api/               transport and error contracts
```

Feature internally components, hooks and tests organize kar sakti hai. Shared directory dumping ground na bane: duplication remove tab karo jab stable common concept emerge ho. State closest common owner mein rakho, and derived data duplicate state mein save mat karo. [Thinking in React](https://react.dev/learn/thinking-in-react)

## Choose rendering per route

| Strategy | Good fit | Cost to manage |
| --- | --- | --- |
| Static generation | Public stable chapters | Rebuild or revalidation strategy |
| Server rendering | Request-specific initial content | Server latency and hydration work |
| Client rendering | Interactive private dashboard | Initial JavaScript and loading states |
| Streaming | Independent slow page regions | Boundary placement and framework support |

One product multiple strategies combine kar sakta hai. Public chapter text pre-render ho, private progress client-side load ho. Server Components aur SSR different concepts hain; Server Components code execution boundary hain, SSR initial HTML generation strategy hai. Chosen framework integration define karti hai.

Numbers se choice concrete hoti hai. Ek notes reader route par rough comparison (assumed 4G-class connection, mid-tier Android device):

| Strategy | TTFB | First meaningful content | Server cost per request | Kab galat choice hai |
| --- | --- | --- | --- | --- |
| Static (CDN hit) | 20-50 ms | ~0.4-0.8 s | ~0 (edge cache) | Per-user personalized content |
| Static (CDN miss, origin fetch) | 150-400 ms | ~1.0-1.5 s | Build/revalidate cost | High miss rate = origin ke liye surprise load |
| SSR per request | 100-400 ms | ~0.8-1.5 s | 10-60 ms CPU/request | Read-heavy public content jahan cache chal jaata |
| Client-only SPA | 20-50 ms (shell) | ~1.5-3.0 s | ~0 | SEO-critical ya first-visit-heavy pages |
| Streaming SSR | 60-150 ms (shell) | Shell fast, slow regions late | SSR + connection hold | Sab regions equally fast hon toh extra complexity |

Sabse important row CDN-miss wali hai. Static generation ko log "free" maante hain, lekin agar 100,000 pages hain aur cache hit rate 60% hai, toh 2,000 rps traffic mein 800 rps origin par jaata hai — wo ek SSR service jaisa load hai, bas usse kisi ne plan nahi kiya. Long-tail content ke liye honest answer yeh hai: on-demand revalidation plus generous TTL, aur origin par ek concurrency limit taaki miss storm origin ko na gira de.

SSR ka cost per-request CPU hai. 50 ms render time par ek 4-core instance theoretically ~80 renders/s handle karti hai (minus GC, serialization, data fetching). Matlab 2,000 rps SSR traffic ke liye ~25+ instances chahiye — wahi traffic CDN se 1-2 origin instances par chal jaata. Yeh exact wo calculation hai jo "SSR hi lagate hain" wale default ko challenge karti hai.

## Hydration and boundaries

Hydration server-produced HTML ko client React behavior se connect karti hai. Initial client output server output se match karna chahiye. Random values, local timezone rendering and browser-only state during initial render mismatch create kar sakte hain. Stable initial data pass karo, intentional browser synchronization lifecycle mein karo. [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)

```text
navigation -> HTML + critical CSS -> visible content
                        |
                  JavaScript arrives
                        |
                     hydration -> interaction
```

Suspense supported async sources ke liye loading boundary coordinate karta hai. Arbitrary fetch inside an Effect automatically Suspense activate nahi karta. Error boundary failure UI handle kare; loading, empty and permission-denied states distinct rakho. [Suspense reference](https://react.dev/reference/react/Suspense)

## Delivery and deployment

Content-hashed assets long cache lifetime use kar sakte hain; HTML ko update freshness policy chahiye. Old HTML references ke liye old assets sufficient period retain karo. Deployment ke baad lazy route chunk missing ho toh recovery UX provide karo. CDN public assets serve kare, private personalized response accidental shared cache mein na jaye.

### Deployment ke waqt kya actually todta hai

Sabse common frontend production incident naya code nahi hai — wo mid-session deployment hai. User ne 10:00 par page load kiya (build `abc123` ki HTML), 10:05 par deploy hua, aur 10:07 par user ne ek lazy route click kiya. Browser `/assets/settings.abc123.js` maangta hai jo ab exist nahi karta, dynamic `import()` reject hota hai, aur React ek blank screen ya error boundary dikhata hai. Yeh zero-bug deployment ke saath bhi hota hai.

```text
10:00  user loads index.html  -> references settings.abc123.js
10:05  deploy replaces bundle -> settings.def456.js, old file purged
10:07  user clicks Settings   -> GET settings.abc123.js -> 404
       dynamic import() rejects -> route never mounts
```

Teen layered fixes hain, aur design review mein teeno poochne chahiye. Ek, purane hashed assets ko turant delete mat karo — kam se kam 24-48 hours (ya do deploy cycles) retain karo, kyunki wo bytes sasta insurance hain. Do, chunk-load failure ko specifically catch karo aur "New version available, reload" UI dikhao, generic error nahi:

```js
const Settings = lazy(() =>
  import("./Settings").catch((error) => {
    // Chunk missing usually deploy ke baad hota hai, code bug nahi
    reportChunkLoadFailure(error);
    return { default: () => <ReloadPrompt reason="stale-build" /> };
  })
);
```

Teen, build version ko HTML meta tag ya API response header mein expose karo taaki app background mein detect kar sake ki server ka build badal gaya hai, aur user ko *unke* convenient moment par reload offer kare — beech mein form fill karte waqt force reload sabse kharab option hai.

CDN cache ka ek aur subtle failure: `Cache-Control: public` accidentally kisi authenticated response par lag gaya toh shared cache ek user ka response doosre ko serve kar sakta hai. Isse avoid karne ka structural tarika hai — authenticated routes ko alag path prefix (`/api/private/*`) par rakho aur CDN behavior us prefix par `no-store` force kare, individual handler ke headers par bharosa mat karo.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** SSR add karne se frontend automatically fast ho jaata hai. **Why it breaks:** SSR sirf *first paint* ko jaldi karta hai; interactive banne ke liye wahi JavaScript download, parse aur hydrate hona padta hai. Agar bundle 400 KB hai toh user ko content 0.8 s par dikhega lekin button 3 s tak kaam nahi karega — yeh pehle se bhi zyada frustrating hai, kyunki UI ready dikhta hai aur respond nahi karta. **Fix:** Pehle bundle size aur hydration cost measure karo; SSR ko client-side JavaScript reduction ke saath pair karo (server components, less interactive code), akela nahi.
- **Wrong assumption:** Folder structure hi architecture hai, toh `components/`, `hooks/`, `utils/` ke type-based folders se code organized rehta hai. **Why it breaks:** Ek feature change karne par developer ko 5 alag folders mein jaana padta hai, aur `utils/` slowly ek 3,000-line dumping ground ban jaata hai jise koi delete nahi kar sakta kyunki dependencies unclear hain. Boundaries visible hi nahi hoti, toh accidental coupling grow karti rehti hai. **Fix:** Feature/capability ke around group karo; shared folder mein cheez tabhi promote karo jab do-teen features usse genuinely use karein aur uska contract stable ho.
- **Wrong assumption:** Hydration mismatch ek cosmetic warning hai, ignore kar sakte hain. **Why it breaks:** Mismatch par React us subtree ka server HTML discard karke client se dobara render karta hai — matlab wo content flash karta hai, uska layout shift CLS ko hit karta hai, aur mismatch ke root par attached event handlers unexpected state se start ho sakte hain. Timezone-dependent date rendering aur `Math.random()` keys classic sources hain. **Fix:** Server aur client dono ke liye deterministic initial render likho; browser-only values (locale time, `window.matchMedia`, stored preferences) ko first render ke baad effect mein apply karo.
- **Wrong assumption:** Micro-frontends independent teams ka natural answer hain. **Why it breaks:** Har micro-frontend apna React copy, apna router state aur apna design system version la sakta hai — user ko 3x JavaScript milta hai, shared auth/session state ko cross-app sync karna padta hai, aur ek visual inconsistency bug ka owner koi nahi hota. Coordination cost build-time se runtime par shift ho jaati hai, khatam nahi hoti. **Fix:** Pehle build-time modularity (separate packages, enforced boundaries, independent CI) try karo; runtime composition tabhi lo jab deployment independence genuinely blocking ho.

## Interview questions — bolkar practice karo

**How would you split components?** User capabilities, independent state and reusable interaction contracts ke around. Every div ko component banana readability necessarily improve nahi karta.

**Does SSR remove JavaScript cost?** Nahi. Interactive client components ka code and hydration still required ho sakta hai. Transferred bytes, main-thread work aur usable interaction tak ka time measure karo.

**When micro-frontends?** Independent teams and deployment ownership strong need ho tab consider karo. Runtime duplication, cross-app state and visual consistency cost explicitly accept karni hogi.

**Ek page par kaun sa data server se aaye aur kaun sa client se?** Main content aur SEO-relevant data server se initial HTML mein aana chahiye, warna crawler aur slow-network user ko empty shell milta hai. Personalized, frequently-changing ya permission-dependent data (unread count, progress, recommendations) client se aa sakta hai kyunki wo cacheable nahi hai aur usse server render block karna sabko slow karta hai. Rule of thumb: agar data cache-friendly hai toh server par, agar per-user aur volatile hai toh client par.

**CDN cache hit rate 60% hai — kya karoge?** Pehle miss ka reason classify karunga: long-tail unique URLs, query-string variations jo unnecessarily cache key todh rahi hain (tracking params jaise `utm_*`), ya short TTL. Sabse common quick win query-param normalization hai — CDN ko batao ki kaunse params cache key ka part hain. Uske baad long-tail ke liye stale-while-revalidate rakho taaki miss par user ko stale copy turant mile aur refresh background mein ho, aur origin par concurrency limit lagao taaki simultaneous misses origin ko na gira dein.

## Practice

Notes product ke routes ko public catalog, reader and private dashboard mein classify karo. Har route ka rendering choice justify karo. Hydration mismatch create karke stable initial state se fix karo.

Phir deployment failure reproduce karo: app build karo, browser mein open karo, phir rebuild karke purane hashed chunks delete kar do aur ek lazy route click karo. Blank screen dekho, phir chunk-load catch plus reload prompt add karke fix karo. Last mein ek rendering-strategy budget likho: har route ke liye estimated CDN hit rate, origin rps at 2,000 total rps, aur us route ka fallback behavior jab origin down ho.

## Depth walkthrough — andar kya ho raha hai?

### Rendering strategy route ke data aur interaction se derive karo

Public mostly-static lesson page cached/static output benefit le sakti hai. Personalized dashboard authorization, freshness aur interaction requirements maangti hai. SSR initial HTML de sakta hai; hydration interactive client behavior attach karti hai, but client work zero nahi.

Server/client first output differ ho toh hydration mismatch aa sakti hai: random values, local timezone ya browser-only storage during first render common causes hain. Initial data snapshot aur client-only changes ki boundary intentional rakho.

**Practice:** One public route aur one private route ke bytes, data fetch timing, cache scope aur failure fallback diagram banao. Route-level chunk loading network bottleneck reduce kar sakti hai but first-open delay introduce karegi. Microfrontend choose karne se pehle team ownership/release independence ka benefit runtime duplication, shared design system aur cross-app state cost se compare karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Public course landing page aur private live progress dashboard ka rendering approach choose karo. Ek deployment risk batao.

> **Hint — chhota ishara:** Discoverability aur personalized fresh data ki priorities alag hain.

**Answer guide — pehle khud karo, phir compare karo:** Generated/server-rendered landing page discoverable content jaldi de sakti hai. Private dashboard ko authenticated data aur interactive update strategy chahiye. Dono techniques combine kar sakte hain. Releases ke assets compatible rakho aur private data shared cache mein na jaane do.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Suspense reference](https://react.dev/reference/react/Suspense)
