---
id: javascript-browser-persistence
title: Browser persistence aur offline behavior — save ka meaning clear karo
track: javascript
order: 19
level: Intermediate
minutes: 31
summary: Local save, transaction commit aur server sync alag outcomes hain; storage failure aur version conflict ko explicit states banao.
tags: storage, indexeddb, offline, versioning
---

## Mental model — simple soch

Page reload par memory state chali jaati hai, lekin localStorage ka value reh sakta hai. Isse app server par synced ya backed up nahi ho jaati. Ek notebook browser mein aur ek copy server par hai: dono copies update/merge karne ka protocol alag design karna padta hai. Objects, JSON, promises aur browser lessons is chapter ke prerequisites hain.

> **Core takeaway:** User ko “saved” status tabhi do jab promised operation complete hua ho; local success ko server sync mat bolo.

Is repo ki progress local storage mein hai. Yeh lesson new offline-sync app feature implement karne ka claim nahi.

## Storage workload se choose karo

| Zaroorat | Option | Dhyan rakho |
| --- | --- | --- |
| Temporary UI state | Memory | Reload par reset |
| Small preferences | localStorage | Synchronous strings; access/quota failure possible |
| Tab-specific session | sessionStorage | Page-session scoped; backup nahi |
| Structured drafts/indexed records | IndexedDB | Async transactions aur schema upgrades manage karo |
| HTTP session identifier | Cookie | Matching requests ke saath send; authentication rules alag |

Origin mein scheme, host aur port matter karte hain. Browser policy, partitioning, private mode aur eviction se storage behavior affect ho sakta hai. JS-readable storage injected JavaScript se secret protect nahi karti. Cookie ke HttpOnly/Secure/SameSite attributes aur CSRF contract separately choose karo.

## Preference ko safely decode karo

Neeche pure function Node/browser mein run hota hai. Actual `localStorage.getItem` access caller ke try/catch mein rakho: access itself fail ho sakta hai. Invalid preference par fallback reasonable hai; important draft ko silently discard karna alag product decision hai.

```js
function decodePreferences(raw) {
  const fallback = () => ({ version: 2, theme: 'system', completed: [] });
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback();
    if (![1, 2].includes(value.version)) return fallback();
    const theme = ['light', 'dark', 'system'].includes(value.theme) ? value.theme : 'system';
    const completed = Array.isArray(value.completed)
      ? [...new Set(value.completed.filter(id => typeof id === 'string' && id.length > 0))]
      : [];
    return { version: 2, theme, completed };
  } catch {
    return fallback();
  }
}
console.log(decodePreferences('{"version":1,"theme":"dark","completed":["js-1","js-1",3]}'));
// { version: 2, theme: 'dark', completed: ['js-1'] }
```

Yeh known v1 shape normalize karta hai, generic migration engine nahi. Unknown future version ko automatically fallback se write-back mat karo: newer app ka data lose ho sakta hai. Important data ke liye raw backup preserve aur upgrade-required state do. Import size aur domain-valid IDs bhi boundary par check karo.

## Two tabs mein lost update

A/B dono `[1]` read karte hain. A `[1,2]` write karta hai; B stale snapshot se `[1,3]` write karta hai. Final data mein 2 kho gaya. `storage` event other relevant documents ko notification de sakta hai; writer document ko apni write ka event nahi milta. Notification atomic merge/lock nahi hai.

Append-only completion ke liye set union useful ho sakta hai, lekin “unmark complete” remove operation ko union wapas laa dega. Conflict policy actual operation semantics se choose karo. IndexedDB transaction mein latest record read/update kar sakte ho; arbitrary network await se transaction alive rahegi assume mat karo.

## Offline workflow aur transaction boundary

IndexedDB stores/indexes schema upgrade mein change hote hain. Old tab ka open connection upgrade block kar sakta hai; versionchange par connection close aur refresh flow define karo. Individual request success aur transaction commit alag events hain. Multi-write local save ko transaction complete par acknowledge karo.

Offline edit mein operation ID, base server version aur pending/synced/conflict state rakho. Reconnect retry same operation ID use kare. Two devices same record edit karein toh version conflict/merge policy chahiye; last-write-wins har product ke liye acceptable nahi.

Service worker network interception/cached responses manage kar sakta hai. Local record save se application assets offline available nahi ho jaate. Old shell/new API compatibility, per-user cache separation aur logout cleanup define karo. Cache API storage aur HTTP cache semantics ko interchangeable mat samjho.

## Practice — honest save indicator

Local write failure par “device par saved” nahi; local success/server failure par “sync pending” dikhao. Two-tab conflict aur unsupported schema version ke cases include karo. Important drafts ke export/recovery ko exercise ka part rakho.

## Depth walkthrough — andar kya ho raha hai?

### Saved, queued aur synced teen different states hain

User offline note edit karti hai. React state change screen update karti hai; local persistence success restart ke baad recovery support kar sakti hai; server acknowledgement remote synchronization prove karta hai. UI mein in teen outcomes ko ek “saved” label se collapse karoge toh user ko wrong confidence mil sakta hai.

Two tabs version 4 padhti hain. A version 5 mein title edit karti hai, B stale version 4 se body save karti hai. Last-write-wins full object overwrite title lose kar sakta hai. Notification event conflict automatically merge nahi karta. Version check, field-level merge policy ya explicit conflict resolution choose karo.

Storage data untrusted input jaisa parse karo: old app versions, manual edits, extensions aur interrupted migrations unexpected shapes de sakte hain. Invalid payload par safe fallback aur future version par overwrite avoid karna different choices hain. Sensitive authorization decision localStorage value se mat lo.

**Recovery drill:** Save failure inject karo, reload karo, stale tab edit karo. Har case mein visible status aur retained draft assert karo. Same-tab subscribers aur other-tab storage events ka mechanism separately account karo; shared key likhne se all hook instances magically synchronize nahi hoti.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Local save aur server sync ke beech kaunsa failure gap hai?

**Apply — khud try karo:** A completion add karta hai, B remove karta hai. Kya set union correct merge hai?

> **Hint — chhota ishara:** Remove ki intention final set mein bachi ya nahi?

**Answer guide — pehle khud karo, phir compare karo:** Union hataayi hui ID ko dobara add kar sakta hai. Append-only aur reversible completion alag models hain. Transaction/version-aware update ya explicit operation conflict policy chahiye.

**Exit check — aage badhne se pehle:** Malformed data, unknown future version aur quota failure ke user-visible outcomes batao.

## Sources — aur padhne ke liye

[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB), [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) aur [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) padho.
