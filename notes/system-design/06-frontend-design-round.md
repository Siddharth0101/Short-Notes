---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 5
summary: Frontend round — requirements → components/state → data flow → performance → failures.
tags: frontend, react, system-design, accessibility, caching
---

## Quick revision

> Revision target — Feature ko state ownership, interaction contracts aur recoverable failure paths ke saath design karo.

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

### Edge cases aur reasoning

- Product freshness — autocomplete results/feed counters/email send har feature ka distinct stale tolerance; one universal TTL blindly apply mat karo.
- Recoverable draft — autosave loading ko empty draft mat samjho; initial restoration gate aur write version se saved text overwrite prevent karo.
- UI failure matrix — each boundary ke loading, partial failure, timeout, permission denial aur retry outcome explicitly define karo.

## Example se samjho

- Scenario — Autocomplete mein query "rea" par three suggestions visible hain; keyboard user ArrowDown, phir Escape press karta hai.
- Reasoning — Active option clear rules se move ho; Escape popup close kare aur typed query preserve rahe. Loading, empty aur error states ko selectable results se distinguish karo.
- Catch — Mouse demo pass hone se keyboard flow prove nahi; IME composition, stale results aur focus return ko acceptance walkthrough mein include karo.

## Recall aur practice

- Sawal — Email send timeout par Send button retry new operation ID banaye toh kya risk?
- Jawaab — First send already accepted ho sakta; stable operation ID/status reconciliation se duplicate mail prevent karo.
- Khud try karo — Email client design defend karo; draft restore, upload retry, failed send, keyboard shortcut aur reconnect mailbox conflict ka flow dikhao.

## Practice questions

### Easy · UI failure matrix

Ek data-driven screen ke liye kaun-kaun se states design karoge?

<details>
<summary>Answer</summary>

- Loading (skeleton, layout shift nahi), Empty (helpful action), Error (retry + message), Partial (kuch data, kuch fail), Offline, Permission denied, Stale data (refreshing indicator).
- Har state ka copy, focus behaviour aur analytics event.

</details>

### Medium · Typeahead/autocomplete design

<details>
<summary>Answer</summary>

- Requests — debounce (~200ms), stale requests abort, recent queries cache.
- Ranking — server; client highlight matching text.
- A11y — combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, arrow keys, Enter, Esc.
- IME — composition events ke dauran search mat chalao (Hindi/Japanese input).
- States — loading, no results, error; min query length.

</details>

### Medium · News feed

<details>
<summary>Answer</summary>

- Pagination — cursor-based; duplicates dedupe by id.
- New posts — top par "N new posts" banner; scroll position achanak jump na ho.
- Reactions — optimistic with rollback; counts server se reconcile.
- Media — lazy load, offscreen videos pause, reserved dimensions.
- Performance — virtualization, image sizes; prefetch next page carefully.

</details>

### Medium · Email client compose

<details>
<summary>Answer</summary>

- Draft — autosave (debounced) server + local recovery; `draftId` stable.
- Send — outbox state: queued → sending → sent/failed; undo-send window.
- Attachments — resumable/chunked upload, progress, retry per file; send tab tak block jab tak upload done.
- Offline — compose allowed, send queue; online par flush.

</details>

### Hard · Comment composer with mentions

`@` mentions, paste, draft recovery aur double-post prevention ke saath composer design.

<details>
<summary>Answer</summary>

- Mentions — `@` par user search (debounced, permission-filtered); model mein text + mention entities (ids), sirf display names nahi.
- Paste — HTML sanitize ya plain text; rendering par server-side bhi sanitize.
- Draft — per-thread local draft, submit success par clear.
- Submit — client-generated id + idempotent API; pending state disable.
- A11y — mention list combobox semantics, keyboard shortcuts documented.

</details>

## Sources — aur padhne ke liye

- [React state structure](https://react.dev/learn/choosing-the-state-structure)
- [WAI combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/06-frontend-design-round.md)
