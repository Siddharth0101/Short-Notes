---
id: react-query-supabase
title: Server state caching and Supabase integration
track: react
order: 8
level: Advanced
minutes: 1
summary: Server state — remote data; loading, freshness, retry aur invalidation sambhalni padti hai.
tags: tanstack-query, server-state, caching, supabase, mutations
---

## Quick revision

- Server state — remote data; loading, freshness, retry aur invalidation sambhalni padti hai.
- Query key — resource + filters + tenant/user scope se cache identity banao.
- Stale time — kitni der fresh maano; cache retention alag setting hai.
- Mutation — server write; success par related queries update/invalidate karo.
- Optimistic update — pehle UI badlo; failure par rollback aur reconcile.
- Race — old response ko newer query/result overwrite na karne do.
- Supabase — client convenience ke saath database RLS policies bhi enforce karo.
- Auth change — old user ka private cache clear/isolate karo.
- Pagination — cursor/page ko query key mein include karo.

## Research notes: Freshness and retention are different clocks

- TanStack Query v5 mein staleTime freshness aur gcTime inactive data removal control karta hai.

## Sources — aur padhne ke liye

- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Source yahan padho — TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [TanStack Query important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/08-query-supabase.md)
