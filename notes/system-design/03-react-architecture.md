---
id: design-react-architecture
title: React architecture rendering and delivery
track: system-design
order: 3
level: Intermediate
minutes: 4
summary: CSR — browser UI render; initial JS/data cost.
tags: react, architecture, ssr, hydration, cdn
visual: react-render
---

## Quick revision

> Revision target — Route ka public content, private data aur interaction boundary alag karke delivery choose karo.

- CSR — browser UI render; initial JS/data cost.
- SSR — server HTML; hydration se client interaction attach.
- SSG — build-time HTML; fresh data ke liye rebuild/update strategy.
- ISR — cached pages revalidate; stale content window define karo.
- Hydration — server/client initial output match hona chahiye.
- CDN — assets/content user ke paas; cache key aur invalidation sahi rakho.
- Architecture — routes/features boundaries; shared components ka clear contract.
- BFF — frontend ke needs ke hisaab se backend aggregation.
- Edge HTML — personalized response shared-cache mein user scope bina store mat karo.
- Route split — critical route code pehle; prefetch useful links without flooding network.
- Server/client boundary — secrets aur trusted validation server par; interactive state client par.

### Config aur design systems

- Schema test — config fixtures ko renderer contract ke against validate karo.
- Design token — shared colors/spacing/type values; theme mein centrally update.
- Micro-frontend — independent ownership/deploy; duplicate dependencies, consistency aur runtime integration cost.
- Module federation — runtime module sharing; version/security/fallback contract chahiye.
- Schema-driven UI — validated config se known components render.
- Registry — allowed component type ko implementation se map.
- Version — client/server compatibility aur migration/defaults define.
- Unknown field/type — ignore/reject/fallback ka explicit policy.
- Form schema — field constraints, dependencies aur accessible errors.
- State identity — stable config IDs; reorder par user input na kho.

### Server Components

- Server Component — component code browser ko ship nahi hota; build ya request ke waqt server environment mein run.
- RSC interactivity — useState jaise interactive Hooks client component mein; server component usko compose kar sakta hai.
- `use client` — client module boundary declare; interactive component ko server-rendered content ke saath compose karo.
- `use server` — Server Functions ka directive; Server Components ko mark karne ka directive nahi.

### Edge cases aur reasoning

- Server Function trust — callable server function ki args untrusted; authentication/authorization aur input validation every invocation par enforce karo.
- RSC versus SSR — Server Components code/data boundary, SSR initial HTML delivery; dono same feature nahi, combine ho sakte hain.
- Personalized CDN key — cookie presence alone correct isolation prove nahi; public/private response policy aur permitted Vary/cache key explicitly define karo.

## Example se samjho

- Scenario — Product description sab users ke liye same hai, lekin cart count aur saved address user-specific hain.
- Reasoning — Public description ko suitable shared delivery/cache mil sakti hai; private cart/address ko authenticated user scope mein fetch/render karo. Initial server/client markup agree kare.
- Catch — Poore personalized page ko product ID alone se shared-cache karoge toh private data wrong user ko mil sakta hai; framework name isolation guarantee nahi hai.

## Recall aur practice

- Sawal — use server directive kisi function ko callable bana de toh auth checks optional hain?
- Jawaab — Nahi; function remote entry ho sakti hai. Identity, resource ownership aur input rules server par verify karo.
- Khud try karo — Product route ki server/client boundary draw karo; public catalog cache, private cart, hydration output aur route error fallback justify karo.

## Practice questions

### Easy · CSR, SSR, SSG, ISR choose karo

Marketing landing page, logged-in analytics dashboard, aur e-commerce product page (SEO + price changes).

<details>
<summary>Answer</summary>

- Landing — SSG (build time HTML, CDN se fastest).
- Dashboard — CSR ya SSR shell + client data; SEO zaroori nahi, personalized data.
- Product page — ISR/SSR: SEO ke liye HTML, price/stock fresh (revalidate ya client-side fetch for stock).
- Rule — freshness, personalization aur SEO teen axes par decide.

</details>

### Medium · Hydration mismatch

```jsx
function Banner() {
  return <p>Generated at {new Date().toLocaleTimeString()}</p>;
}
```

SSR app mein warning kyun aati hai? Fix?

<details>
<summary>Answer</summary>

- Kyun — server aur client render alag time/locale par → HTML text mismatch; React client par re-render karta hai (wasted work, flicker).
- Similar — `Math.random()`, `window` checks render mein, locale/timezone formatting.
- Fix — value server se prop mein pass karo, ya client-only value `useEffect` ke baad set; stable ids ke liye `useId`.

</details>

### Medium · BFF kab?

<details>
<summary>Answer</summary>

- Kaam — frontend ke liye ek server layer jo kai backend APIs aggregate kare, response shape kare, secrets/tokens chhupaye.
- Fayde — kam round trips, mobile/web ke liye tailored payloads, auth cookie handling.
- Cost — ek aur service own karni; business logic BFF mein mat ghusao (wahi duplicate ho jaata hai).

</details>

### Medium · Server Components ki boundary

Server Component mein `useState`, `onClick` aur database query — kya allowed hai? Server Function (`'use server'`) mein kya dhyan?

<details>
<summary>Answer</summary>

- RSC — DB/filesystem access aur secrets allowed; state, effects, event handlers nahi.
- Interactivity — chhote `'use client'` components mein; boundary jitni neeche, utna kam JS ship.
- Server Function — public endpoint jaisa treat karo: authentication, authorization aur input validation andar karo; client se aaya argument trusted nahi.

</details>

### Hard · CDN ne kisi aur ka page dikha diya

SSR personalized page CDN par cache hua aur user B ko user A ka naam dikh gaya. Kya galat hua aur safe design?

<details>
<summary>Answer</summary>

- Cause — personalized HTML shared cache mein gaya; cache key mein user identity nahi thi.
- Immediate — personalized responses par `Cache-Control: private, no-store`; CDN cache purge.
- Design — public shell (cacheable) + personalized data client/edge par alag fetch; ya cache key mein segment (logged-in/out), user id nahi.
- Guard — tests jo assert karein authenticated responses kabhi `public` cache headers na lein.

</details>

## Sources — aur padhne ke liye

- [React Server Functions security](https://react.dev/reference/rsc/use-server)

- [React — Server Components](https://react.dev/reference/rsc/server-components)

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/03-react-architecture.md)
