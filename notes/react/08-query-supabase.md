---
id: react-query-supabase
title: Server state caching and Supabase integration
track: react
order: 8
level: Advanced
minutes: 3
summary: Server state — remote data; loading, freshness, retry aur invalidation sambhalni padti hai.
tags: tanstack-query, server-state, caching, supabase, mutations
---

## Quick revision

> Revision target — Remote data ki identity, freshness aur authorization alag samjho; cached result ko universal truth mat maano.

- Server state — remote data; loading, freshness, retry aur invalidation sambhalni padti hai.
- Query key — resource + filters + tenant/user scope se cache identity banao.
- Stale time — kitni der fresh maano; cache retention alag setting hai.
- Mutation — server write; success par related queries update/invalidate karo.
- Optimistic update — pehle UI badlo; failure par rollback aur reconcile.
- Race — old response ko newer query/result overwrite na karne do.
- Supabase — client convenience ke saath database RLS policies bhi enforce karo.
- Auth change — old user ka private cache clear/isolate karo.
- Pagination — cursor/page ko query key mein include karo.
- Dependent query — required ID/auth ready ho tab fetch; undefined identity par accidental call avoid.
- Background refresh — cached data dikhate hue refresh status separately handle karo.
- Mutation ordering — rapid writes out-of-order aa sakti hain; version/reconciliation rule chahiye.

### Edge cases aur reasoning

- Query function failure — HTTP non-2xx ko rejected Promise/error banao; fulfilled error payload cache ko success dikha sakta hai.
- Optimistic concurrency — ek mutation ka rollback later successful edit erase na kare; per-operation/version reconciliation chahiye.
- Invalidation scope — related detail/list aggregates identify; every cache clear correctness shortcut hai par avoidable refetch cost badhata hai.

## Research notes: Freshness and retention are different clocks

- TanStack Query v5 mein staleTime freshness aur gcTime inactive data removal control karta hai.

## Example se samjho

```js
const projectKey = ["projects", userId, { status: "open" }];
// Isi identity ke query function mein matching user/filter use karo.
```

- Trace — user A aur user B ke results alag keys use karte hain; filter badalne par distinct result set identify hota hai.
- Catch — cache key access control nahi; server/database authorization har request par enforce hoti hai.
- Check — logout/account switch par private data clear/reset karo; successful mutation ke baad affected query refresh/invalidate policy verify karo.
- Failure path — background refresh fail ho toh existing usable data aur refresh error ko separately represent karo.

## Recall aur practice

- Sawal — Same query key par user A/B ka private data cache karne mein kya risk hai?
- Jawaab — Cached result identities mix hongi; auth/tenant scope key mein include aur auth switch par private cache reset karo.
- Khud try karo — Optimistic item edit banao; rapid two edits, one failure aur logout/login ke baad correct user/version data verify karo.

## Practice questions

### Easy · Query key mein page missing

```jsx
const { data } = useQuery({ queryKey: ['todos'], queryFn: () => fetchTodos(page) });
```

Page badalne par purana data kyun dikhta hai?

<details>
<summary>Answer</summary>

- Kyun — cache key `['todos']` har page ke liye same; Query naya page alag cache entry nahi samajhta.
- Fix — `queryKey: ['todos', { page }]`; queryFn ke saare inputs key mein hone chahiye.
- Smooth UX — `placeholderData: keepPreviousData` se naya page aane tak purana dikhao.

</details>

### Easy · `staleTime` vs `gcTime`

<details>
<summary>Answer</summary>

- `staleTime` — data kitni der "fresh" maana jaaye; fresh rehte refetch nahi hota (default `0`).
- `gcTime` — unused (koi observer nahi) cache entry kitni der memory mein rahe (default 5 min); purana naam `cacheTime`.
- Example — user profile: `staleTime: 5 * 60_000`; stock price: `staleTime: 0` + refetch interval.

</details>

### Medium · Mutation ke baad list update nahi hui

`addTodo` mutation success hoti hai par list purani dikhti hai. Fix?

<details>
<summary>Answer</summary>

```jsx
const queryClient = useQueryClient();
const addTodo = useMutation({
  mutationFn: createTodo,
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

- Invalidate — matching queries stale mark hokar active ho toh refetch.
- Prefix match — `['todos']` saari `['todos', { page }]` entries cover karta hai.
- Fast path — response mein naya todo aaye toh `setQueryData` se turant cache update bhi kar sakte ho.

</details>

### Medium · Supabase anon key public hai — phir data safe kaise?

<details>
<summary>Answer</summary>

- Fact — anon key browser mein hoti hi hai; security uske secret hone par depend nahi karti.
- Row Level Security — table par RLS on karo aur policy likho, e.g. `using (auth.uid() = user_id)`; bina policy ke RLS-enabled table kuch return nahi karti.
- Service role key — sirf server par; woh RLS bypass karti hai, browser bundle mein kabhi nahi.

</details>

### Hard · Optimistic update with rollback (TanStack Query)

Todo ko "done" toggle karo: UI turant update, server fail par rollback, aur end mein server se sync.

<details>
<summary>Answer</summary>

```jsx
const toggle = useMutation({
  mutationFn: (todo) => api.updateTodo(todo.id, { done: !todo.done }),
  onMutate: async (todo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old = []) =>
      old.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
    );
    return { previous };
  },
  onError: (_error, _todo, context) => queryClient.setQueryData(['todos'], context.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

- `cancelQueries` — in-flight refetch optimistic value ko overwrite na kare.
- Snapshot — `onMutate` ka return `onError` ke `context` mein milta hai.
- `onSettled` — success ya fail, end mein server truth se reconcile.

</details>

## Sources — aur padhne ke liye

- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/08-query-supabase.md)
