---
id: design-realtime-case-study
title: Case study collaborative notes and real-time chat
track: system-design
order: 12
level: Advanced
minutes: 1
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

## Sources — aur padhne ke liye

- [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Yjs shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/12-realtime-case-study.md)
