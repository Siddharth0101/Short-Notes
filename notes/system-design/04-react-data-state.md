---
id: design-react-data-state
title: React state server data and cache consistency
track: system-design
order: 4
level: Intermediate
minutes: 25
summary: URL state, local state aur server cache ko clear ownership do.
tags: react, state, caching, optimistic-ui
visual: caching
---

## Mental model

Har state same lifecycle follow nahi karti. Modal open flag ephemeral UI state hai. Search query shareable URL state ho sakti hai. Server note list remote data ka cached snapshot hai. Form draft unsaved local intent hai. In sabko one giant global object mein mix karne se reset, invalidation and synchronization bugs badhte hain.

## State ownership map

| State | Owner | Persistence decision |
| --- | --- | --- |
| Active dialog | Feature component | Usually none |
| Search filters | URL | Back/forward and sharing |
| Note list | Server-data cache | Freshness and invalidation |
| Draft body | Editor state | Optional local recovery |
| Signed-in identity | Auth/session boundary | Server remains authority |

Derived values directly compute karo when cheap. Effect mein filtered list set karna extra render and synchronization surface introduce karta hai. Effects external system synchronization ke liye hain, every calculation ke liye nahi. [When Effects are unnecessary](https://react.dev/learn/you-might-not-need-an-effect)

## Query identity and freshness

Cache key request identity fully represent kare: resource, user/tenant scope, filters, sort and page cursor. `['notes', ownerId, normalizedFilters]` aur `['notes']` equivalent nahi jab users/data differ karte hain. Logout par private cache clear karo, and server authorization always enforce karo. Freshness duration product decision hai: chapter content minutes stale tolerate kare, checkout price revalidate karna padega.

```text
mutation starts
  -> mark specific item pending
  -> optionally apply optimistic patch
  -> server validates and commits
  -> replace with authoritative result
  -> invalidate affected aggregate queries
```

Optimistic UX reversible low-risk changes ke liye useful hai, like bookmark toggles. Payment success ko optimistic show karna misleading ho sakta hai. Rollback entire old snapshot se concurrent newer change overwrite ho sakti hai; mutation version or targeted patch reconciliation use karo.

### Staleness budget per data type

"Stale data acceptable hai ya nahi" ek blanket answer nahi hai — har field ka apna budget hota hai, aur wo budget product consequence se derive hota hai, engineering convenience se nahi:

| Data | Acceptable staleness | Kyun | Mechanism |
| --- | --- | --- | --- |
| Chapter body text | 5-60 minutes | Content rarely badalta, stale copy harmless | Long `staleTime`, CDN cache |
| Search result list | 30-60 seconds | Thoda purana result acceptable, refetch cheap | `staleTime` 30s + refetch on focus |
| Unread/notification count | 10-30 seconds | Galat count annoying hai, dangerous nahi | Poll ya push, background refetch |
| User's own progress after save | 0 (read-your-writes) | Apna save turant dikhna chahiye | Mutation response se cache seed karo |
| Checkout total / payable amount | 0 | Stale price = wrong charge = dispute | Server par recompute, cache mat karo |
| Permission/role | 0 for the write path | Stale permission = authorization bug | Server har request par check kare, UI hint hi hai |

Yeh table interview mein bahut kaam aati hai kyunki "consistency chahiye ya nahi" jaise vague sawaal ko per-field decision bana deti hai. Aur last row important hai: frontend cache kabhi authorization decision ka basis nahi hai — wo sirf UI affordance hide/show karta hai.

### Read-after-write path ko explicitly design karo

Sabse zyada report hone wala "bug" yehi hota hai: user ne save kiya, success toast aaya, list par wapas gaya, aur purana data dikha. Iske teen alag causes hote hain aur teeno ka fix alag hai:

```text
cause 1: list query cache invalidate nahi hui
         -> UI purana cached snapshot dikha raha hai

cause 2: invalidate hui, refetch gaya, lekin backend read replica
         se serve hua jisme write abhi replicate nahi hua

cause 3: invalidate hui, refetch gaya, lekin response purani
         in-flight request ki thi (race), jo baad mein resolve hui
```

Cause 1 ka fix mutation success par targeted invalidation hai. Cause 2 pure frontend se solve nahi hota — backend ko read-your-writes support dena padta hai: same user ke recent writes ke baad primary se read karo, ya write response mein ek version/LSN token do jo client next read mein bhejta hai aur server usse satisfy hone tak wait/route karta hai. Cause 3 ka fix request identity check hai (neeche race conditions section).

Sabse sasta aur underused fix: mutation ke response mein pura updated resource return karo aur usse cache seed kar do, phir background mein hi list invalidate karo. Isse detail view turant correct hota hai chahe replica lag ho:

```js
// Mutation response ko authoritative maan kar cache seed karo
onSuccess: (savedNote) => {
  queryClient.setQueryData(["note", savedNote.id], savedNote);   // instant, correct
  queryClient.invalidateQueries({ queryKey: ["notes", ownerId] }); // list background refresh
}
```

Agar mutation sirf `{ ok: true }` return karti hai, toh client ke paas refetch ke alawa koi option nahi bachta — aur wahi refetch replica lag ka shikaar hota hai. API contract ka yeh chhota sa decision frontend ki poori consistency story decide kar deta hai.

## Race conditions and cancellation

Search term "rea" request slower aur "react" faster ho sakti hai. Older response latest results overwrite nahi karni chahiye. Request identity check, framework query cache or cleanup guard use karo. AbortController unnecessary network/response work cancel kar sakta hai, lekin server-side mutation rollback guarantee nahi deta.

```js
const controller = new AbortController();
fetch(`/api/notes?q=${encodeURIComponent(query)}`, {
  signal: controller.signal,
});
// In the owning lifecycle cleanup:
controller.abort();
```

Sketch intentionally error handling omit karta hai; real caller abort error and actual network failure distinguish kare. Request initiation user input se debounce ho sakti hai, while keyboard feedback immediate remain kare.

## Offline and multi-tab choices

Local storage small synchronous key/value persistence deta hai. Larger structured offline data ke liye IndexedDB more appropriate ho sakta hai. Offline write queue mein operation ID, base version and replay policy chahiye. Multi-tab updates events/channel se coordinate karo where needed. Last-write-wins simple hai, but conflicting user edits silently lose kar sakta hai.

Offline queue ka sabse underestimated failure mode replay storm hai. User 2 ghante offline raha, 40 operations queue hui, phir network wapas aaya — ab client 40 requests ek saath fire karta hai. Agar 10,000 users ek hi network outage se recover kar rahe hain, toh server ko ek instant mein 400,000 queued writes milti hain, jo normal write load se kai guna zyada hai. Fixes: queue ko serially drain karo (parallelism 2-4), har operation par stable ID rakho taaki duplicate replay safe ho, aur client-side jitter add karo taaki sab clients same millisecond par reconnect na karein.

### Cache memory aur cardinality

Client-side cache unbounded nahi ho sakti, aur cache key design hi uska size decide karta hai. Maan lo search query cache key mein raw text hai:

```text
key: ["notes", ownerId, { q: "reac", topic: "java", sort: "recent", page: 1 }]
```

User "react" type karta hai toh 5 keystrokes = 5 distinct cache entries. 20 searches per session × 5 prefixes = 100 entries, har ek 20 items × ~2 KB = ~40 KB → ~4 MB ek session mein. Mobile browser par yeh memory pressure aur GC pauses create karta hai. Do fixes: query ko debounce karke normalize karo (trim, lowercase, collapse spaces) taaki key space chhota rahe, aur `gcTime` short rakho (jaise 5 minutes) taaki unused entries evict ho jaayein. Filters ko serialize karte waqt key order stable rakho — `{a:1,b:2}` aur `{b:2,a:1}` ko alag key banana silent cache-miss doubling hai.

## Common mistakes

- **Wrong assumption:** Optimistic update ka rollback ka matlab hai purana snapshot wapas set kar dena. **Why it breaks:** Optimistic write aur failure ke beech mein agar koi aur mutation ya background refetch cache update kar chuki hai, toh purana snapshot restore karne se wo naya (correct) data mit jaata hai — user ko ek change dikhta hai jo usne undo nahi kiya. **Fix:** Rollback ko targeted rakho (sirf us item ka wo field revert karo), ya rollback ke turant baad affected query invalidate karke server se authoritative state lao.
- **Wrong assumption:** Cache key mein user ID daalne ki zaroorat nahi kyunki logout par page reload ho jaata hai. **Why it breaks:** SPA mein logout aksar client-side navigation hota hai, page reload nahi — agla user (shared device, ya account switch) usi in-memory cache ko hit karta hai aur pichle user ka data dekh sakta hai. Server authorization isse nahi rokta kyunki request jaati hi nahi, cache hit ho jaati hai. **Fix:** Har private query key mein owner/tenant scope include karo, aur logout par cache explicitly clear karo (`queryClient.clear()`), sirf token delete mat karo.
- **Wrong assumption:** Debounce lagane se search race condition solve ho jaati hai. **Why it breaks:** Debounce request *count* kam karta hai, ordering guarantee nahi deta. 300 ms debounce ke baad bhi "rea" ki request slow server path par 800 ms le sakti hai aur "react" ki 200 ms — slow response baad mein aakar correct results overwrite kar dega. **Fix:** Har response ko uske request identity se validate karo (query key match, ya request sequence number), aur stale response ko silently discard karo. AbortController network work bachata hai lekin already-returned stale response ko bhi handle karna padta hai.
- **Wrong assumption:** Server data ko Redux/Context mein rakhna simpler hai kyunki "sab state ek jagah" hoti hai. **Why it breaks:** Server data ko manually manage karne ka matlab hai ki deduplication, retry, staleness tracking, refetch-on-focus, pagination merging aur cache eviction — sab khud likhna padega. Yeh hazaar lines ka accidental library ban jaata hai, aur usme sabse zyada bugs staleness/invalidation mein aate hain. **Fix:** Server cache ko dedicated tool se manage karo; Redux/Context ko genuine client state (wizard step, selection, draft, feature flags) ke liye rakho.
- **Wrong assumption:** `localStorage` mein auth token ya user data rakhna convenient aur safe enough hai. **Why it breaks:** `localStorage` har JavaScript ko readable hai — ek XSS ya ek compromised npm dependency token exfiltrate kar sakti hai, aur wo token expiry tak valid rehta hai. Multi-tab sync bhi manual banti hai. **Fix:** Session credentials ke liye httpOnly, Secure, SameSite cookies prefer karo; `localStorage` ko non-sensitive UI preferences tak limit rakho.

## Interview questions

**Context versus a server-data cache?** Context value distribution mechanism hai. Remote cache additionally deduplication, retries, staleness and mutation reconciliation manage kar sakti hai; Context alone yeh policies provide nahi karta.

**Should every API response go into global state?** Nahi. Ownership and lifecycle ke according store karo. Duplicate server snapshots independently update karoge toh contradictory UI possible hai.

**User save karke list par gaya aur purana data dikha — debug kaise karoge?** Teen possibilities alag karunga. Pehle check karunga ki refetch actually gayi ya nahi (network tab) — nahi gayi toh invalidation key mismatch hai. Gayi hai aur response mein purana data hai toh backend side issue hai, aksar read replica lag — us case mein mutation response se cache seed karna ya primary-read routing chahiye. Aur agar response correct tha lekin UI purana raha toh ek stale in-flight response ne baad mein resolve hokar overwrite kiya — request identity check chahiye.

**Optimistic update kab nahi karoge?** Jab operation irreversible ho ya uska failure user ke liye costly ho — payment, order placement, message send-to-external-party, destructive delete. In cases mein optimistic success dikhana user ko galat mental model deta hai aur rollback confusing hota hai ("paisa kat gaya tha ya nahi?"). Yahan explicit pending state better hai: action disable karo, progress dikhao, aur server confirmation ke baad hi success show karo.

**Multi-tab mein ek tab logout kare toh dusre tabs ka kya?** Server-side session invalidation authority hai, lekin dusre tabs ko turant pata nahi chalega aur wo apni stale cache se UI dikhate rahenge jab tak koi request 401 na de. Practical design: logout par `BroadcastChannel` ya a storage event fire karo jisse sab tabs apni private cache clear karke login screen par jaayein, aur uske saath har API client mein global 401 handler rakho jo same cleanup kare. Dono chahiye — broadcast fast path hai, 401 handler correctness backstop.

## Practice

Bookmark toggle implement karo with delayed success and failure. Two quick toggles, user switch and stale search response simulate karo. Har case mein final UI state explain karo before running it.

Uske baad read-after-write bug deliberately banao: mutation ko sirf `{ ok: true }` return karwao aur list refetch par artificial 500 ms delayed stale response do; observe karo ki UI purana dikhata hai. Phir mutation se full resource return karke cache seed karo aur difference dekho. Last mein offline replay test karo: network offline karke 10 edits karo, online aao, aur count karo ki kitni requests ek saath jaati hain — phir serial drain plus jitter add karke behavior compare karo.

## Sources

- [When Effects are unnecessary](https://react.dev/learn/you-might-not-need-an-effect)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
