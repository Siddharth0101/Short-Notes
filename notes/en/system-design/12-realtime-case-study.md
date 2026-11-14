---
id: design-realtime-case-study
title: Case study collaborative notes and real-time chat
track: system-design
order: 12
level: Advanced
minutes: 4
summary: Realtime — choose WebSocket or SSE from the interaction direction and the infrastructure.
tags: case-study, websocket, sse, collaboration, java
visual: request-flow
---

## Quick revision

> Revision target — Define durable message identity, replay and delivery semantics separately from the realtime connection.

- Realtime — choose WebSocket/SSE from the interaction direction and the infra.
- Message ID — a stable client/server identity; dedupe duplicates on reconnect.
- Ack — define the meaning of accepted, persisted and delivered separately.
- Reconnect — replay the missed events from the last cursor/sequence.
- Ordering — scoped to a conversation/document; a global order is not needed.
- Presence — temporary state; expire stale users with a heartbeat/TTL.
- Collaboration — choose the conflict contract of OT/CRDT or server serialization.
- Snapshot — compact durable state + a replay of later operations.
- Permissions — validate access on the subscription and on every write.
- Resume cursor — if cursor retention has expired, fall back to a full snapshot + a new cursor.
- Bounded fan-out — limit the buffers of a slow subscriber; a disconnect/replay policy.
- Tombstone — retain the identity of a deleted item when replay/offline merges could resurrect stale data.

### Chat delivery

- Optimistic message — show it with a temp ID; reconcile on the ack, retry on failure.
- Typing — a throttled temporary signal; remove a stale indicator through expiry.
- History — preserve the scroll anchor on a prepend; auto-scroll for a new message only when appropriate.
- Unread cursor — the last-read position from the server record; a temporary view count alone is not reliable.
- Edit/delete event — if the referenced message is not loaded, a later history fetch must still give a consistent state.

### Collaborative document

- DOM/SVG — semantic elements/objects; Canvas/WebGL — dense custom graphics, with extra accessibility work.
- Presence cursor — ephemeral; interpolation gives smooth movement, separate from the durable document data.
- Coordinate — conversion to the shared document space along with the viewport zoom/scroll.
- Operation base — the protocol tracks which document version an edit was made on.
- Edit conflict — an operation identity + an OT/CRDT/server-order contract; a blind last-write can lose edits.

### Edge cases and reasoning

- Replay/live handoff — handle the gap/double-read of events between the snapshot cursor and the live subscription; define the subscribe-buffer/replay protocol clearly.
- CRDT guarantee scope — compatible operations can converge to an eventual merge; authorization/business invariants are not enforced automatically.
- Delivery status semantics — persisted versus device-delivered versus user-read are separate durable/ephemeral evidence; a socket write alone is not proof the user read it.

## Understand it with an example

- Scenario — The client sends message M; the server persists it and sends the ack, but the connection breaks before the ack arrives.
- Reasoning — On reconnect, retry/reconcile with the same operation identity of M. The server returns the existing persisted result; the client matches the provisional bubble to the confirmed identity.
- Catch — A retry with a new ID can create a duplicate message; a persisted ack does not mean the recipient read it. Read status needs separate evidence.

## Recall and practice

- Question — What is the risk if a message arrives in the gap between loading the snapshot and subscribing to the socket?
- Answer — The message can be missed; close the gap with a consistent cursor-based replay/live handoff or a subscribe buffer.
- Try it yourself — Design a reconnect protocol; verify recovery from a duplicate sequence, an expired cursor, a slow subscriber, a deleted document and a revoked permission.

## Practice questions

### Easy · WebSocket, SSE or polling?

Chat, a notifications badge, and a stock price ticker (server → client only).

<details>
<summary>Answer</summary>

- Chat — WebSocket (bidirectional, low latency).
- Notifications — SSE or short polling (server → client, simple, HTTP-friendly).
- Ticker — SSE (a one-way stream, auto-reconnect).
- Polling — when updates are rare and you want to keep the infra simple.

</details>

### Medium · Message ordering and duplicates

After a reconnect some messages show up duplicated and some are missing.

<details>
<summary>Answer</summary>

- Ids — a client temp id (optimistic) + a server message id + a per-conversation sequence number.
- Dedupe — the client merges duplicates by server id/client id.
- Resume — the client sends the last seen sequence; the server fills the gap from history.
- Ordering — by the server sequence order; not by client timestamps.

</details>

### Medium · Typing indicator and presence

<details>
<summary>Answer</summary>

- Ephemeral — not persisted in the DB; in-memory/pub-sub with a TTL.
- Throttle — typing events not on every keystroke, e.g. one every 3s; a timeout on stop.
- Presence — heartbeats; offline after missed heartbeats (a grace period, to avoid flapping).
- Privacy — presence only to allowed contacts.

</details>

### Medium · Fan-out in a large group

In a group of 10,000 members every message has to reach everyone.

<details>
<summary>Answer</summary>

- Pub/sub — store the message once; connection servers subscribe and push to their connected users.
- Slow consumers — a bounded send queue per connection; when it fills, drop + the client resyncs via history.
- Offline users — push notifications batched/collapsed.
- Read path — "fan-out on read" for huge groups vs "on write" for small: a trade-off.

</details>

### Hard · Collaborative editing

Simultaneous editing like Google Docs — OT vs CRDT, and permissions?

<details>
<summary>Answer</summary>

- OT — a central server transforms operations (against the base version); mature, server-coordinated.
- CRDT — replicas converge without a central order; offline-friendly; metadata overhead.
- Base version — track which version every operation was made on; no gap in the replay/live handoff.
- Permissions — authorize every operation server-side (reject a viewer's edits).
- Snapshots — a periodic snapshot + an op log; a new client joins from the snapshot.

</details>

## Sources — further reading

- [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Yjs shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/12-realtime-case-study.md)
