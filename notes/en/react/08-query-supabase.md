---
id: react-query-supabase
title: Server state caching and Supabase integration
track: react
order: 8
level: Advanced
minutes: 3
summary: Server state — remote data; you must handle loading, freshness, retries and invalidation.
tags: tanstack-query, server-state, caching, supabase, mutations
---

## Quick revision

> Revision target — Understand the identity, freshness and authorization of remote data separately; do not treat a cached result as universal truth.

- Server state — remote data; you must handle loading, freshness, retries and invalidation.
- Query key — build the cache identity from the resource + filters + tenant/user scope.
- Stale time — how long to treat data as fresh; cache retention is a separate setting.
- Mutation — a server write; on success update/invalidate the related queries.
- Optimistic update — change the UI first; roll back and reconcile on failure.
- Race — do not let an old response overwrite a newer query/result.
- Supabase — alongside the client convenience, enforce the database's RLS policies too.
- Auth change — clear/isolate the old user's private cache.
- Pagination — include the cursor/page in the query key.
- Dependent query — fetch once the required ID/auth is ready; avoid an accidental call with an undefined identity.
- Background refresh — handle the refresh status separately while showing cached data.
- Mutation ordering — rapid writes can arrive out of order; a version/reconciliation rule is needed.

### Edge cases and reasoning

- Query function failure — turn an HTTP non-2xx into a rejected Promise/error; a fulfilled error payload can make the cache show success.
- Optimistic concurrency — one mutation's rollback must not erase a later successful edit; per-operation/version reconciliation is needed.
- Invalidation scope — identify the related detail/list aggregates; clearing every cache is a correctness shortcut but adds avoidable refetch cost.

## Research notes: Freshness and retention are different clocks

- In TanStack Query v5, staleTime controls freshness and gcTime controls the removal of inactive data.

## Understand it with an example

```js
const projectKey = ["projects", userId, { status: "open" }];
// Use the matching user/filter in the query function of this same identity.
```

- Trace — the results of user A and user B use different keys; changing the filter identifies a distinct result set.
- Catch — a cache key is not access control; server/database authorization is enforced on every request.
- Check — clear/reset private data on logout/account switch; verify the refresh/invalidate policy of the affected queries after a successful mutation.
- Failure path — if a background refresh fails, represent the existing usable data and the refresh error separately.

## Recall and practice

- Question — What is the risk of caching the private data of users A and B under the same query key?
- Answer — The identities of the cached results get mixed; include the auth/tenant scope in the key and reset the private cache on an auth switch.
- Try it yourself — Build an optimistic item edit; verify the correct user/version data after two rapid edits, one failure and a logout/login.

## Practice questions

### Easy · The page is missing from the query key

```jsx
const { data } = useQuery({ queryKey: ['todos'], queryFn: () => fetchTodos(page) });
```

Why does the old data show when the page changes?

<details>
<summary>Answer</summary>

- Why — the cache key `['todos']` is the same for every page; Query does not see the new page as a separate cache entry.
- Fix — `queryKey: ['todos', { page }]`; every input of the queryFn must be in the key.
- Smooth UX — `placeholderData: keepPreviousData` shows the old page until the new one arrives.

</details>

### Easy · `staleTime` vs `gcTime`

<details>
<summary>Answer</summary>

- `staleTime` — how long the data counts as "fresh"; while fresh there is no refetch (default `0`).
- `gcTime` — how long an unused cache entry (no observers) stays in memory (default 5 min); its old name was `cacheTime`.
- Example — a user profile: `staleTime: 5 * 60_000`; a stock price: `staleTime: 0` + a refetch interval.

</details>

### Medium · The list did not update after a mutation

The `addTodo` mutation succeeds but the list still shows the old data. The fix?

<details>
<summary>Answer</summary>

```jsx
const queryClient = useQueryClient();
const addTodo = useMutation({
  mutationFn: createTodo,
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

- Invalidate — matching queries are marked stale and refetch if they are active.
- Prefix match — `['todos']` covers all the `['todos', { page }]` entries.
- Fast path — if the response contains the new todo, you can also update the cache at once with `setQueryData`.

</details>

### Medium · The Supabase anon key is public — so how is the data safe?

<details>
<summary>Answer</summary>

- Fact — the anon key is in the browser anyway; security does not depend on it being secret.
- Row Level Security — turn RLS on for the table and write a policy, e.g. `using (auth.uid() = user_id)`; without a policy, an RLS-enabled table returns nothing.
- Service role key — on the server only; it bypasses RLS, so it never goes into the browser bundle.

</details>

### Hard · Optimistic update with rollback (TanStack Query)

Toggle a todo to "done": the UI updates immediately, rolls back if the server fails, and syncs with the server at the end.

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

- `cancelQueries` — so an in-flight refetch does not overwrite the optimistic value.
- Snapshot — what `onMutate` returns arrives in the `context` of `onError`.
- `onSettled` — success or failure, reconcile with the server's truth at the end.

</details>

## Sources — further reading

- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/08-query-supabase.md)
