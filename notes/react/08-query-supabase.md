---
id: react-query-supabase
title: Server state caching and Supabase integration
track: react
order: 8
level: Advanced
minutes: 30
summary: Query keys, staleness, mutations, optimistic updates aur backend access policies ko connect karo.
tags: tanstack-query, server-state, caching, supabase, mutations
---

## Mental model

Server state ka owner remote system hai; client ke paas uski temporary cached copy hoti hai. Loading boolean aur array se shuru kar sakte ho, lekin freshness, retries, race conditions, deduplication aur invalidation quickly complex ho jaate hain. Query library cache lifecycle manage karti hai. Client UI state aur server cache ko separate rakho, jaise selected tab local hai lekin fetched bookings remote data hain.

## Query key defines identity

```jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchTopics(track, signal) {
  const response = await fetch(`/api/topics?track=${encodeURIComponent(track)}`, { signal });
  if (!response.ok) throw new Error("Could not load topics");
  return response.json();
}

export function useTopics(track) {
  return useQuery({
    queryKey: ["topics", { track }],
    queryFn: ({ signal }) => fetchTopics(track, signal),
    staleTime: 60_000
  });
}

export function useCreateTopic() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async input => {
      const response = await fetch("/api/topics", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Save failed");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["topics"] })
  });
}
```

App root par stable QueryClient plus QueryClientProvider required hai. Key mein query function ke changing data inputs include karo. Track missing hoga to JavaScript aur React results same cache entry share kar sakte hain. Query function failure ko throw/reject kare; error object return karoge to success data treat ho sakta hai.

## Dependent and paginated queries

Ek query ka result doosri query ke input ke liye required ho, to `enabled` option se dependent query ko tab tak pause rakho jab tak prerequisite data available na ho:

```jsx
function useTopicDetails(topicId) {
  return useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => fetchTopicDetails(topicId),
    enabled: Boolean(topicId) // topicId null/undefined hote hue query fire hi nahi hogi
  });
}
```

`enabled: false` hone par query `isLoading` mein stuck nahi rehti — usko `isPending` ke saath ek alag "idle" jaisa state milta hai jise UI mein handle karna zaroori hai, warna dependent query resolve hone se pehle screen par galat spinner ya blank state dikh sakta hai.

Pagination mein page badalte hi purana data turant hatana jarring UX deta hai — number flash karke reappear hota hai. `placeholderData` se previous page ka data tab tak dikhaye rakho jab tak next page load nahi ho jaata:

```jsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function useTopicsPage(page) {
  return useQuery({
    queryKey: ["topics", { page }],
    queryFn: () => fetchTopicsPage(page),
    placeholderData: keepPreviousData
  });
}
```

`isPlaceholderData` flag se UI subtle "updating" indicator (jaise dimmed list) dikha sakti hai jabki naya page background mein load ho raha hota hai — user ko blank/loading flash nahi dikhta.

Query object destructure karte waqt `isLoading` aur `isPending` ka difference dhyan rakho: `isPending` matlab data abhi tak nahi mila (chahe query enabled ho ya na ho), jabki `isLoading` specifically "pending aur fetching in progress" combination ko cover karta hai. Dono ko interchangeably use karna kabhi-kabhi galat loading state dikha deta hai jab query `enabled: false` par pause ho.

## Freshness is different from retention

TanStack Query v5 mein cached query data default se stale considered hota hai. Stale data immediately delete nahi hota; UI existing data show karte hue configured triggers par refetch kar sakti hai. `staleTime` freshness control karta hai; `gcTime` inactive cache retention control karta hai. Inactive queries default five minutes baad collect hoti hain. Retries aur focus/reconnect behavior project requirements ke hisaab se configure karo.

Mutation ke baad invalidation related cache ko refresh path par laati hai. Optimistic update mein outgoing query cancel karo, previous data snapshot lo, cache update karo, failure par rollback karo aur settle par reconcile karo. Concurrent mutations ke rollback conflicts ko consider karo. Payment confirmation jaise irreversible result ko optimistic success mat dikhao.

## Supabase boundary

Supabase client database/auth/storage APIs expose karta hai. Browser client mein publishable/anon key use ho sakti hai with correctly configured Row Level Security; service-role secret browser mein kabhi embed mat karo. Authentication sirf identity hai; row policy decide karti hai ki user kaunsa record read/write kar sakta hai. Supabase operation ke `{ data, error }` result ko inspect karke query function mein error throw karo. Frontend filter authorization replace nahi karta.

```jsx
async function fetchMyTopics(userId) {
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, minutes")
    .eq("owner_id", userId);
  if (error) throw new Error(error.message); // Galat: { data, error } ko silently ignore karke sirf `data` return karna
  return data;
}
```

Common mistake yeh hai ki Supabase call ka result directly `return data` kar dena, `error` ko check kiye bina — is case mein failed query bhi TanStack Query ko "success with `undefined` data" dikhegi, aur error UI kabhi trigger nahi hogi. Har Supabase call ke baad `error` explicitly check karna aur throw karna required hai taaki query library ka error handling normally kaam kare.

## Gotchas

- `enabled: false` query ko "never fetch" nahi banata — jaise hi dependency truthy hoti hai, query automatically fire ho jaati hai; ise permanent disable ke liye mat use karo.
- Query key mein object property order matter nahi karta (`{ track, page }` aur `{ page, track }` same key treat hote hain), lekin array order matter karta hai.
- Optimistic update mein rollback logic likhna bhool jaana — network fail hone par UI stale-success state mein stuck reh jaata hai jab tak explicit `onError` rollback na ho.
- Supabase `{ data, error }` result ka error field ignore karke sirf data return karna, jisse failed request bhi "success" dikhti hai.

## Where this shows up in a real app

Ek admin dashboard mein table pagination, search aur sort filters saath-saath chalte hain. Naive implementation page change par poori list ko blank karke reload dikhata hai — user ko lagta hai app crash ho gaya. `placeholderData: keepPreviousData` ke saath previous rows dimmed state mein visible rehti hain jab tak next page ready na ho, jo real products (jaise Gmail ki list view, ya e-commerce admin panels) mein standard expected behavior hai.

## Practice

Track filter switch karke cache behavior observe karo. Mutation ke baad list update verify karo. Network offline karo, retry behavior inspect karo aur optimistic rollback demonstrate karo. Do users ke data separation ko backend policy tests se verify karo. Dependent query implement karo jahan second query sirf first query ka result mil jaane ke baad `enabled` ho, aur verify karo ki `isPending` state correctly dikhti hai jab tak dependency resolve nahi hoti.

## Interview questions

**Q. Stale data unusable hai?** Nahi. Stale cache display ho sakti hai while refresh happens; stale freshness metadata hai.

**Q. Query key mein token rakhna chahiye?** Secrets avoid karo. User-scoped data identity clearly model karo aur logout/user switch par sensitive cache clear/reset karo.

## Sources

[TanStack Query important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) cache timing explain karta hai. [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) authorization policy ka reference hai.
