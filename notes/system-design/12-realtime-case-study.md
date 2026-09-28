---
id: design-realtime-case-study
title: Case study collaborative notes and real-time chat
track: system-design
order: 12
level: Advanced
minutes: 2
summary: Realtime — WebSocket/SSE choose interaction direction aur infra se.
tags: case-study, websocket, sse, collaboration, java
visual: request-flow
---

## Quick revision

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

## Sources — aur padhne ke liye

- [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Yjs shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/12-realtime-case-study.md)
