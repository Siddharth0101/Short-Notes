---
id: system-design-os-network-debugging
title: OS aur networking interviews — slow request ko layer-wise diagnose karo
track: system-design
order: 15
level: Intermediate
minutes: 2
summary: Process — isolated address space; thread — process ke resources share karta hai.
tags: os, networking, tcp, dns, tls, debugging
---

## Quick revision

- Process — isolated address space; thread — process ke resources share karta hai.
- Context switch — execution change ka overhead; zyada threads always faster nahi.
- Memory — heap, native buffers aur file descriptors sab limits rakhte hain.
- DNS — hostname resolve; TCP — connection; TLS — encrypted authenticated channel.
- HTTP latency — DNS/connect/TLS/server/transfer phases alag measure karo.
- Pool wait — slow request ka reason CPU nahi, resource queue bhi ho sakti hai.
- Timeout — write hua ya nahi unclear ho sakta hai; retry idempotent banao.
- Debug — symptoms → layer → evidence → smallest experiment.
- File descriptor — sockets/files count limits; leaks high-load failures bana sakte hain.
- DNS cache — stale resolution aur TTL failover latency affect karte hain.
- Ephemeral ports — outgoing connection churn ports exhaust kar sakta hai; reuse aur connection metrics inspect.

### Web request basics

- Client/server — browser request bhejta hai, server response deta hai.
- HTTPS — HTTP over TLS; traffic encrypt aur server identity verify hoti hai.
- HTTP methods — GET read, POST process/create, PUT replace, PATCH partial update, DELETE remove.
- Headers/body — metadata headers mein; content body mein.
- Cache — browser/CDN/server par reuse; freshness aur invalidation ka rule chahiye.
- Page load — DNS → connection/TLS → HTTP → HTML/CSS/JS → layout/paint.
- HTTP validators — ETag/Last-Modified se unchanged resource revalidate kar sakte ho.
- Connection reuse — repeated handshakes ka cost bachao; idle/connection limits define karo.
- URL fragment — browser-side identifier; HTTP request target mein fragment nahi bheja jaata.

### Realtime transports

- HTTP/1.1 — request connections; HTTP/2 — one connection par multiplexed streams.
- HTTP/3 — QUIC transport; independent streams transport head-of-line issue kam karte hain.
- SSE — server-to-browser event stream; reconnect/event ID useful.
- WebSocket — bidirectional connection; auth, heartbeat aur reconnect protocol chahiye.
- Polling — simple repeated fetch; interval latency/load tradeoff.
- Long polling — server update/timeout tak request hold karta hai.
- Reconnect jitter — saare clients ek saath reconnect karke server overload na karein.
- Slow receiver — outgoing queue bound; drop/disconnect/replay policy explicit.
- Connection auth — long-lived socket par expiry/revocation ka recheck mechanism.
### WebRTC negotiation

- WebRTC — peer audio/video/data; signaling channel alag chahiye.
- SDP — media/session negotiation information.
- ICE — possible network paths gather/test.
- STUN — public-facing address discover; TURN — direct path fail ho toh relay.
- DataChannel — peer data; reliability/ordering options use case se choose.
- Peer media — permissions, device change, bandwidth adaptation aur reconnect handle karo.

## Sources — aur padhne ke liye

- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/15-os-network-debugging.md)
