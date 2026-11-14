---
id: design-react-architecture
title: React architecture rendering and delivery
track: system-design
order: 3
level: Intermediate
minutes: 4
summary: CSR — the browser renders the UI; there is an initial JS and data cost.
tags: react, architecture, ssr, hydration, cdn
visual: react-render
---

## Quick revision

> Revision target — Choose delivery by separating a route's public content, private data and interaction boundary.

- CSR — the browser renders the UI; an initial JS/data cost.
- SSR — HTML from the server; hydration attaches client interaction.
- SSG — build-time HTML; a rebuild/update strategy for fresh data.
- ISR — cached pages are revalidated; define the stale content window.
- Hydration — the server and client initial output must match.
- CDN — assets/content close to the user; keep the cache key and invalidation correct.
- Architecture — route/feature boundaries; a clear contract for shared components.
- BFF — backend aggregation shaped by the frontend's needs.
- Edge HTML — do not store a personalized response in a shared cache without a user scope.
- Route split — the critical route's code first; prefetch useful links without flooding the network.
- Server/client boundary — secrets and trusted validation on the server; interactive state on the client.

### Config and design systems

- Schema test — validate config fixtures against the renderer contract.
- Design token — shared colour/spacing/type values; update them centrally in the theme.
- Micro-frontend — independent ownership/deploys; the cost is duplicate dependencies, consistency and runtime integration.
- Module federation — runtime module sharing; it needs a version/security/fallback contract.
- Schema-driven UI — renders known components from validated config.
- Registry — maps an allowed component type to its implementation.
- Version — define client/server compatibility and migration/defaults.
- Unknown field/type — an explicit policy of ignore/reject/fallback.
- Form schema — field constraints, dependencies and accessible errors.
- State identity — stable config IDs; do not lose user input on a reorder.

### Server Components

- Server Component — the component code is not shipped to the browser; it runs in a server environment at build or request time.
- RSC interactivity — interactive Hooks such as useState belong in a client component; a server component can compose it.
- `use client` — declares a client module boundary; compose an interactive component with server-rendered content.
- `use server` — the directive for Server Functions; not a directive that marks Server Components.

### Edge cases and reasoning

- Server Function trust — the args of a callable server function are untrusted; enforce authentication/authorization and input validation on every invocation.
- RSC versus SSR — Server Components are a code/data boundary, SSR is initial HTML delivery; they are not the same feature and can be combined.
- Personalized CDN key — the presence of a cookie alone does not prove correct isolation; define the public/private response policy and the permitted Vary/cache key explicitly.

## Understand it with an example

- Scenario — The product description is the same for all users, but the cart count and saved address are user-specific.
- Reasoning — The public description can get suitable shared delivery/caching; fetch/render the private cart/address in the authenticated user's scope. The initial server/client markup must agree.
- Catch — If you shared-cache the whole personalized page by product ID alone, private data can reach the wrong user; a framework name is not an isolation guarantee.

## Recall and practice

- Question — If the use server directive makes a function callable, are auth checks optional?
- Answer — No; the function can be a remote entry point. Verify identity, resource ownership and input rules on the server.
- Try it yourself — Draw the server/client boundary of a product route; justify the public catalog cache, the private cart, the hydration output and the route error fallback.

## Practice questions

### Easy · Choose CSR, SSR, SSG or ISR

A marketing landing page, a logged-in analytics dashboard, and an e-commerce product page (SEO + price changes).

<details>
<summary>Answer</summary>

- Landing — SSG (build-time HTML, fastest from a CDN).
- Dashboard — CSR or an SSR shell + client data; SEO is not needed, the data is personalized.
- Product page — ISR/SSR: HTML for SEO, fresh price/stock (revalidate or a client-side fetch for stock).
- Rule — decide on three axes: freshness, personalization and SEO.

</details>

### Medium · Hydration mismatch

```jsx
function Banner() {
  return <p>Generated at {new Date().toLocaleTimeString()}</p>;
}
```

Why does the warning appear in an SSR app? The fix?

<details>
<summary>Answer</summary>

- Why — the server and client render at a different time/locale → an HTML text mismatch; React re-renders on the client (wasted work, flicker).
- Similar — `Math.random()`, `window` checks during render, locale/timezone formatting.
- Fix — pass the value from the server as a prop, or set a client-only value after `useEffect`; `useId` for stable ids.

</details>

### Medium · When a BFF?

<details>
<summary>Answer</summary>

- Job — a server layer for the frontend that aggregates several backend APIs, shapes the response and hides secrets/tokens.
- Benefits — fewer round trips, payloads tailored for mobile/web, auth cookie handling.
- Cost — one more service to own; do not push business logic into the BFF (that is where it gets duplicated).

</details>

### Medium · The boundary of Server Components

`useState`, `onClick` and a database query in a Server Component — what is allowed? What do you watch for in a Server Function (`'use server'`)?

<details>
<summary>Answer</summary>

- RSC — DB/filesystem access and secrets are allowed; state, effects and event handlers are not.
- Interactivity — in small `'use client'` components; the lower the boundary, the less JS ships.
- Server Function — treat it like a public endpoint: do authentication, authorization and input validation inside; an argument from the client is not trusted.

</details>

### Hard · The CDN showed someone else's page

An SSR personalized page was cached on the CDN and user B saw user A's name. What went wrong, and what is a safe design?

<details>
<summary>Answer</summary>

- Cause — personalized HTML went into a shared cache; the cache key had no user identity.
- Immediate — `Cache-Control: private, no-store` on personalized responses; purge the CDN cache.
- Design — a public shell (cacheable) + personalized data fetched separately on the client/edge; or a segment in the cache key (logged-in/out), not the user id.
- Guard — tests asserting that authenticated responses never get `public` cache headers.

</details>

## Sources — further reading

- [React Server Functions security](https://react.dev/reference/rsc/use-server)

- [React — Server Components](https://react.dev/reference/rsc/server-components)

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/03-react-architecture.md)
