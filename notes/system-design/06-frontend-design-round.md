---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 2
summary: Frontend round — requirements → components/state → data flow → performance → failures.
tags: frontend, react, system-design, accessibility, caching
---

## Quick revision

- Frontend round — requirements → components/state → data flow → performance → failures.
- API contract — request shape, pagination, errors aur cancellation clear karo.
- Search — debounce + request identity + empty/loading/error states.
- State — URL shareable data; local transient interaction; server cache remote data.
- Performance — measure likely bottleneck; list/image/network budget do.
- Accessibility — keyboard/focus behavior design ka part hai.
- Tradeoff — choice ke saath rejected alternative ka concrete cost bolo.
- Capacity — rendered items, payload size, concurrent requests aur memory budget quantify.
- Recoverable UI — retry action user input preserve kare; whole page reset zaroori nahi.
- Observability plan — error rate, interaction latency aur failed request correlation include.

### Autocomplete

- Combobox — arrow navigation, Enter select, Escape close aur labeled list.
- Empty/error — blank query, no result aur failure ke separate states.
- Composition input — IME typing ke intermediate text par premature search/selection avoid.

### Social feed

- Feed — cursor pagination + dedupe; ranking order ko stable boundary chahiye.
- New posts — indicator dikhao; reading position ko unexpected shift mat karo.
- Media — lazy loading + dimensions + thumbnails.
- Optimistic reaction — local update, server reconcile/rollback.
- Refresh — cancellation, race guard aur scroll restoration.
- Ranking — relevance/freshness objective; personalized cache/auth scope.
- Media pause — off-screen video decoding/playback stop karke resources bachao.

### Email client

- Mailbox — list/detail state; URL se selected folder/message persist.
- Optimistic action — archive/read labels locally; failure par reconcile.
- Attachments — upload progress, limits, safe storage aur cancellation.
- Push — new-message signal; server se authoritative data fetch.
- Draft — autosave/version conflicts aur unsaved-change recovery.
- Thread identity — message ID aur conversation ID separate; actions ka scope clear.
- Attachment retry — already uploaded object reuse; duplicate upload cleanup/expiry define.
- Offline mailbox — IndexedDB data + cached shell; reconnect par server se reconcile.
- Email outbox — stable send-operation ID se retry; duplicate send avoid karo.

### Email interaction

- Rich-text composer — stored/rendered HTML sanitize; attachments aur draft body ke separate lifecycle.
- Keyboard shortcut — editable field/IME mein typing hijack mat karo; discoverable shortcut aur focus return rakho.

## Sources — aur padhne ke liye

- [React state structure](https://react.dev/learn/choosing-the-state-structure)
- [WAI combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/06-frontend-design-round.md)
