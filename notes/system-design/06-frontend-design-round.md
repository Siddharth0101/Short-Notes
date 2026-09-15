---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 28
summary: Design round mein component boxes ke saath contracts aur failure behavior explain karna hota hai.
tags: frontend, react, system-design, accessibility, caching
---

## Mental model — simple soch

Frontend system design user-visible distributed client ka design hai. Browser storage, network, rendering, accessibility aur API contracts saath work karte hain. User journey se start; har choice ko requirement se justify karo. Loading/error/stale-data ke bina component diagram incomplete hai.

> **Core takeaway:** Design round mein component boxes ke saath contracts aur failure behavior explain karna hota hai.

## Design brief and assumptions

Shareable filters, pagination aur saved topics wala catalog design karo. Mobile, unreliable networks aur authenticated users assume karo. Practice ke liye 200ms local interaction budget propose karo; real-device measurement se pehle achieved target mat bolo. Discoverable pages aur private data clarify karo.

Shareable query/filters URL mein; open panels/unsaved input local state mein; result pages/saved mutations server cache mein. Owners separate rakho taaki Back meaningful view restore kare aur same filter ki three competing copies na hon.

## Contract and component boundary

```text
CatalogRoute
  SearchForm       → query draft, submit, keyboard behavior
  FilterPanel      → URL filter updates
  ResultsRegion    → pending / error / empty / success
    TopicCard      → stable topic identity
    Pagination     → cursor tied to query and sort

GET /topics?q=...&category=...&cursor=...
→ { items, nextCursor, version }
```

Cache key mein result-affecting all inputs, user/tenant bhi. Filters change par pagination reset. Obsolete requests abort aur ownership guard. Save ek item optimistically update karke server se reconcile kar sakta hai; concurrent rollback operation-aware ho, old whole-list snapshot restore na kare.

## Rendering and accessibility

Discoverable content ke liye justified ho toh SSR lo. Hydration initial markup/data match expect karti hai; random IDs/browser-only initial state mismatch la sakti hai. Shared cache se private data leak na ho.

Virtualization mounted rows bound karti hai; keyboard/assistive-tech plan chahiye. Catalog mein pagination simpler ho sakti hai. Save/error ke baad focus preserve aur result updates announce karo. Search input automatically combobox nahi; real suggestions behavior ho tab semantics add karo.

## Failure and measurement plan

Navigation delivery, interaction delay aur API latency separately measure karo. Slow response, stale cache, other-tab logout aur failed lazy chunk test karo. Draft silently discard kiye bina recovery do. Persistent cache bound aur private offline access policy define karo.

CDN public static assets delivery improve karta hai; costly local filter/blocking API fix nahi. Mobile bandwidth ke against expected benefit justify karke prefetch add karo. “Memoization se fast” bolne ke bajay specific before/after trace do.

## Practice

5 minute requirements, 10 API/state diagram, 10 races/failures, 5 measurement do. Ten million topics par filtering backend, page size bound, cancellation/cursor explain karo. Phir fully offline personal notebook requirement se kaunse decisions reverse honge, batao.

## Interview questions — bolkar practice karo

**Microfrontends help karengi?** Tab jab independent ownership/delivery benefit integration, dependencies aur UX consistency cost justify kare.

**First deep dive kya?** Highest-risk requirement choose karo, jaise races ya large-list responsiveness; every known technology list mat karo.

## Depth walkthrough — andar kya ho raha hai?

### Diagram ko ek user journey se challenge karo

User search type, result open, edit save aur back navigation karti hai. Har step par source of truth identify karo: input draft local, shareable filters URL, remote result query cache, committed record server. Same record multiple owners mein independent copies ho toh reconciliation explicitly chahiye.

Slow A search aur fast B search mein stale response handling diagram par arrow ke saath show karo. Save success ke baad list stale ho toh mutation response, detail update aur list invalidation path explain karo. Cache hit authorization substitute nahi.

Accessibility contract mein focus entry/return, loading announcement, keyboard selection aur error association include karo. Performance budget user journey ke measured bottleneck se nikle: network, calculation, render aur layout separate hain.

**Practice:** One happy path aur three failures draw karo: offline save, permission revoked, chunk load fail. Har failure mein retained state, user message, retry owner aur verification method likho. Architecture ka completeness box count se nahi, observable journeys se assess karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Searchable catalog ki next page fail ho jaati hai. Visible state aur retry boundary define karo.

> **Hint — chhota ishara:** Later request fail hone se already-successful data hatana zaroori nahi.

**Answer guide — pehle khud karo, phir compare karo:** Current results visible rakho; page-specific error dikhao aur same query identity se woh page retry karo. Pagination consistency, loading announcements aur duplicate rows handle karo. Rapid filters aur failed retry ko deterministic fake API se demonstrate karo.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React state structure](https://react.dev/learn/choosing-the-state-structure) aur [WAI combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) mein state/interaction contracts padho.
