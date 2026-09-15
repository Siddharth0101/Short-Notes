---
id: system-design-api-contracts
title: REST, GraphQL aur gRPC — protocol se pehle contract choose karo
track: system-design
order: 14
level: Advanced
minutes: 31
summary: API style query/transport shape badalti hai; permissions, bounded work, compatibility aur failure ownership har style mein chahiye.
tags: api, graphql, grpc, rest, batching
---

## Mental model — simple soch

API client ko available operations aur data contract batati hai. REST resource-oriented HTTP interface, GraphQL typed selection/execution model aur gRPC service-method interface express karte hain. “Kaunsa fastest?” se pehle caller, workload, streaming, latency aur infrastructure constraints poochho. HTTP, database queries aur security prerequisites hain.

> **Core takeaway:** Protocol choose karne se backend cost, authorization aur retry semantics disappear nahi hote.

Source folder ki comparison table short overview thi. Yahan actual request shapes aur failure cases se decisions derive karenge.

## Same screen, different contracts

Course card ko title aur teacher name chahiye. REST `GET /courses/42` required representation de sakta hai; multiple calls mandatory nahi. GraphQL fields choose karne deta hai, lekin resolver backend work decide karta hai. Internal gRPC `GetCourse` typed call useful ho sakti hai; browser integration transport/proxy support separately evaluate karo.

```graphql
# Schema excerpt; server, resolvers and auth separately required
type Query { course(id: ID!): Course }
type Course { id: ID!, title: String!, teacher: Teacher }
type Teacher { id: ID!, name: String! }
```

```graphql
# Separate query document against that schema
query CourseCard($id: ID!) {
  course(id: $id) { id title teacher { name } }
}
```

Response fields precise hone se database automatically minimal work nahi karega. Deep nesting, aliases aur large lists ke liye pagination/cost bounds chahiye. GraphQL response mein data plus errors ho sakte hain; HTTP status alone ko business success mat samjho. Field/resource authorization service boundary par enforce karo.

## N+1 aur batching ka contract

50 courses ke each teacher par individual lookup ho toh one list query plus 50 teacher calls ho sakti hain. Batch loader queued IDs ko grouped fetch mein combine kar sakta hai. Result order, duplicates, missing records aur errors us API ka contract hain.

Keys `[7,2,7]`, DB rows `[2,7]` order mein aayein toh positional result `[teacher7,teacher2,teacher7]` banao. Missing key par explicit null/error policy do. Array length keys se match honi chahiye; mismatch se promises pending mat chhodo. Whole batch reject ho toh har waiting caller ko failure mile.

Request-scoped loader memoized data different users ke beech leak hone se bachane ka common design hai. Shared cache ho toh permission-aware identity/invalidation chahiye. Scheduling window ke andar queued work batch hota hai; sequential awaited calls necessarily same batch mein nahi aati.

Repo ka `SimpleDataLoader` teaching helper batching, async completion aur whole-batch failure settle karta hai. Full library ke memoization, per-key error caching, cancellation aur production batch limits implement nahi karta. Actual source example ke success/failure cases regression tests se verify hote hain.

## gRPC deadlines aur schema evolution

Protocol Buffers field numbers wire identity ka part hain. Removed number unrelated field ke liye reuse mat karo. Additive change syntax-compatible ho sakti hai, lekin business meaning badalne se old client phir bhi break ho sakta hai. Unknown fields/enums aur optional presence ka behavior test karo.

Unary aur streaming RPC shapes hain. Caller deadline remaining budget express kar sakti hai; downstream work ko budget/cancellation propagate karna application responsibility hai. Client cancel hone se already committed write rollback nahi hoti. Mutation retry ke liye stable operation ID/status reconciliation chahiye.

Binary encoding apne-aap low latency guarantee nahi. Payload, serialization, connections, queueing aur database time measure karo. Browser gRPC-Web/proxy needs separately verify karo; backend gRPC ko ordinary browser fetch se interchangeable mat samjho.

## Caching aur compatibility

REST GET responses suitable headers ke saath HTTP cache use kar sakte hain; user-specific representation unsafe shared cache mein na jaaye. GraphQL commonly POST use karta hai, lekin query GET/persisted operations bhi possible hain. “GraphQL cannot cache” blanket claim nahi: normalized client cache aur HTTP response cache separate layers hain.

Cursor opaque hone ke saath stable ordering/tie-breaker aur concurrent edits ka behavior define karo. Public error contract mein safe code, retryability aur correlation ID useful hain; internal stack trace nahi. Read timeout ko operation-not-executed assume karne se duplicate writes ho sakti hain.

## Practice — workload se defend karo

Public read-heavy catalog, internal inventory RPC aur personalized mobile dashboard ke liye one defensible choice do. Har answer mein worst-case work, auth, timeout aur compatibility test ho. Mixed approaches valid hain; one technology for everything assumption mat lo.

## Depth walkthrough — andar kya ho raha hai?

### Transport choice domain contract ka substitute nahi

REST endpoint overfetch kar sakta hai, GraphQL requested fields narrow kar sakta hai, gRPC typed binary RPC contract de sakta hai. Lekin backend authorization, query fan-out, deadline aur compatibility sab mein own karni padegi. GraphQL field selection automatically cheap execution prove nahi karti.

Batch loader results input positions preserve kare. Same ID twice aaye toh output two positions fulfill kare, missing item policy explicit ho aur whole-batch rejection every waiter settle kare. Cross-request shared cache unauthorized data mix kar sakti hai; scope deliberately choose karo.

**Practice:** Same dashboard ke three resources ke liye request count, backend queries, transferred bytes, caching aur failure UX compare karo. Public schema evolve karte waqt clients simultaneously upgrade assume mat karo. Removed/renamed field aur changed enum meaning backward compatibility break kar sakti hai even when transport healthy ho.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** GraphQL fields select hone ke baad bhi N+1 kyun ho sakta hai?

**Apply — khud try karo:** Keys [7,2,7] par unordered DB rows ko caller promises se kaise match karoge?

> **Hint — chhota ishara:** Output positions original keys ke order se associated hain.

**Answer guide — pehle khud karo, phir compare karo:** ID-to-row map banao, phir original keys order mein results. Duplicate positions preserve karo; missing ID explicit null/error. Whole-batch rejection har waiter settle kare.

**Exit check — aage badhne se pehle:** Deadline expire hone ke baad mutation committed ho sakti hai? Retry contract samjhao.

## Sources — aur padhne ke liye

[GraphQL queries](https://graphql.org/learn/queries/), [authorization](https://graphql.org/learn/authorization/), [DataLoader](https://github.com/graphql/dataloader) aur [gRPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/) padho.
