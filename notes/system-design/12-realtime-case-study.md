---
id: design-realtime-case-study
title: Case study collaborative notes and real-time chat
track: system-design
order: 12
level: Advanced
minutes: 4
summary: Realtime — WebSocket/SSE choose interaction direction aur infra se.
tags: case-study, websocket, sse, collaboration, java
visual: request-flow
---

## Quick revision

> Revision target — Realtime connection se alag durable message identity, replay aur delivery semantics define karo.

- Realtime — WebSocket/SSE choose interaction direction aur infra se.
- Message ID — stable client/server identity; reconnect duplicates dedupe karo.
- Ack — accepted, persisted aur delivered ka meaning alag define karo.
- Reconnect — last cursor/sequence se missed events replay.
- Ordering — conversation/document scope; global order zaroori nahi hota.
- Presence — temporary state; heartbeat/TTL se stale users expire.
- Collaboration — OT/CRDT ya server serialization ka conflict contract choose.
- Snapshot — compact durable state + later operations replay.
- Permissions — subscription aur every write par access validate.
- Resume cursor — cursor retention expire ho toh full snapshot + new cursor fallback.
- Bounded fan-out — slow subscriber ke buffers limit; disconnect/replay policy.
- Tombstone — deleted item ki identity retain jab replay/offline merges stale data resurrect kar sakte hon.

### Chat delivery

- Optimistic message — temp ID se show; ack par reconcile, failure par retry.
- Typing — throttled temporary signal; expiry se stale indicator hatao.
- History — prepend par scroll anchor preserve; new message auto-scroll only when appropriate.
- Unread cursor — last-read position server record se; temporary view count alone reliable nahi.
- Edit/delete event — referenced message unloaded ho toh later history fetch mein consistent state mile.

### Collaborative document

- DOM/SVG — semantic elements/objects; Canvas/WebGL — dense custom graphics, accessibility extra work.
- Presence cursor — ephemeral; interpolation smooth movement, durable document data se alag.
- Coordinate — viewport zoom/scroll ke saath shared document space conversion.
- Operation base — edit kis document version par bani, protocol track kare.
- Edit conflict — operation identity + OT/CRDT/server-order contract; blind last-write edits lose kar sakta hai.

### Edge cases aur reasoning

- Replay/live handoff — snapshot cursor aur live subscription ke beech events gap/double-read handle; subscribe-buffer/replay protocol clearly define karo.
- CRDT guarantee scope — compatible operations eventual merge converge kara sakte; authorization/business invariants automatically enforce nahi hote.
- Delivery status semantics — persisted versus device-delivered versus user-read separate durable/ephemeral evidence; socket write alone user-read proof nahi.

## Example se samjho

- Scenario — Client message M send karta hai; server persist karke ack bhejta hai, par connection ack pahunchne se pehle toot jaati hai.
- Reasoning — Reconnect par M ki same operation identity retry/reconcile karo. Server existing persisted result return kare; client provisional bubble ko confirmed identity se match kare.
- Catch — Naya ID banakar retry duplicate message create kar sakta hai; persisted ack ka matlab recipient ne padha nahi. Read status ke liye separate evidence chahiye.

## Recall aur practice

- Sawal — Snapshot load ke baad socket subscribe karne ke gap mein message aaye toh kya risk?
- Jawaab — Message miss ho sakta; consistent cursor-based replay/live handoff ya subscribe buffer se gap close karo.
- Khud try karo — Reconnect protocol design karo; duplicate sequence, expired cursor, slow subscriber, deleted document aur revoked permission recovery verify karo.

## Practice questions

### Easy · WebSocket, SSE ya polling?

Chat, notifications badge, aur stock price ticker (server → client only).

<details>
<summary>Answer</summary>

- Chat — WebSocket (bidirectional, low latency).
- Notifications — SSE ya short polling (server → client, simple, HTTP-friendly).
- Ticker — SSE (one-way stream, auto-reconnect).
- Polling — jab updates rare hon aur infra simple rakhna ho.

</details>

### Medium · Message ordering aur duplicates

Reconnect ke baad kuch messages duplicate aur kuch missing dikhte hain.

<details>
<summary>Answer</summary>

- Ids — client temp id (optimistic) + server message id + per-conversation sequence number.
- Dedupe — client server id/client id se duplicates merge.
- Resume — client last seen sequence bhejta hai; server gap fill karta hai history se.
- Ordering — server sequence order; client timestamps par nahi.

</details>

### Medium · Typing indicator aur presence

<details>
<summary>Answer</summary>

- Ephemeral — DB mein persist nahi; in-memory/pub-sub with TTL.
- Throttle — typing events har keystroke par nahi, e.g. har 3s ek; stop par timeout.
- Presence — heartbeats; missed heartbeats ke baad offline (grace period, flapping avoid).
- Privacy — presence sirf allowed contacts ko.

</details>

### Medium · Bade group mein fan-out

10,000 members wale group mein har message sabko bhejna hai.

<details>
<summary>Answer</summary>

- Pub/sub — message ek baar store, connection servers subscribe karke apne connected users ko push.
- Slow consumers — per-connection bounded send queue; bhar jaaye toh drop + client resync via history.
- Offline users — push notifications batched/collapsed.
- Read path — "fan-out on read" for huge groups vs "on write" for small: trade-off.

</details>

### Hard · Collaborative editing

Google Docs jaisa simultaneous editing — OT vs CRDT aur permissions?

<details>
<summary>Answer</summary>

- OT — central server operations ko transform karta hai (base version ke against); mature, server-coordinated.
- CRDT — replicas bina central order ke converge; offline-friendly; metadata overhead.
- Base version — har operation kis version par bana, track karo; replay/live handoff mein gap na ho.
- Permissions — har operation server-side authorize (viewer edits reject).
- Snapshots — periodic snapshot + op log; naya client snapshot se join kare.

</details>

## Sources — aur padhne ke liye

- [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Yjs shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/12-realtime-case-study.md)
