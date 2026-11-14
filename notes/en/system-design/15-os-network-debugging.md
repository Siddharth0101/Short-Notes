---
id: system-design-os-network-debugging
title: OS and networking interviews — diagnose a slow request layer by layer
track: system-design
order: 15
level: Intermediate
minutes: 5
summary: Process — an isolated address space; thread — shares the resources of its process.
tags: os, networking, tcp, dns, tls, debugging
---

## Quick revision

> Revision target — Separate the layers of a slow request with independent measurements and the smallest diagnostic experiment.

- Process — an isolated address space; thread — shares the resources of its process.
- Context switch — the overhead of changing execution; more threads are not always faster.
- Memory — the heap, native buffers and file descriptors all have limits.
- DNS — resolves the hostname; TCP — the connection; TLS — an encrypted, authenticated channel.
- HTTP latency — measure the DNS/connect/TLS/server/transfer phases separately.
- Pool wait — the reason for a slow request can be a resource queue too, not the CPU.
- Timeout — whether the write happened can be unclear; make the retry idempotent.
- Debug — symptoms → layer → evidence → the smallest experiment.
- File descriptor — limits on the count of sockets/files; leaks can cause failures under high load.
- DNS cache — stale resolution and the TTL affect failover latency.
- Ephemeral ports — outgoing connection churn can exhaust ports; inspect reuse and connection metrics.

### Web request basics

- Client/server — the browser sends a request, the server returns a response.
- HTTPS — HTTP over TLS; traffic is encrypted and the server's identity is verified.
- HTTP methods — GET read, POST process/create, PUT replace, PATCH partial update, DELETE remove.
- Headers/body — metadata in the headers; content in the body.
- Cache — reuse at the browser/CDN/server; it needs a rule for freshness and invalidation.
- Page load — DNS → connection/TLS → HTTP → HTML/CSS/JS → layout/paint.
- HTTP validators — you can revalidate an unchanged resource with ETag/Last-Modified.
- Connection reuse — saves the cost of repeated handshakes; define idle/connection limits.
- URL fragment — a browser-side identifier; the fragment is not sent in the HTTP request target.

### Realtime transports

- HTTP/1.1 — request connections; HTTP/2 — multiplexed streams on one connection.
- HTTP/3 — the QUIC transport; independent streams reduce the transport head-of-line issue.
- SSE — a server-to-browser event stream; reconnect/an event ID are useful.
- WebSocket — a bidirectional connection; it needs auth, a heartbeat and a reconnect protocol.
- Polling — a simple repeated fetch; the interval is a latency/load tradeoff.
- Long polling — the server holds the request until an update/timeout.
- Reconnect jitter — so that all clients do not reconnect together and overload the server.
- Slow receiver — bound the outgoing queue; an explicit drop/disconnect/replay policy.
- Connection auth — a mechanism to recheck expiry/revocation on a long-lived socket.
### WebRTC negotiation

- WebRTC — peer audio/video/data; it needs a separate signaling channel.
- SDP — media/session negotiation information.
- ICE — gathers/tests the possible network paths.
- STUN — discovers the public-facing address; TURN — a relay when the direct path fails.
- DataChannel — peer data; choose the reliability/ordering options from the use case.
- Peer media — handle permissions, a device change, bandwidth adaptation and reconnect.

### Edge cases and reasoning

- TCP byte stream — send boundaries are not message boundaries; it needs a framing/length-prefix/delimiter protocol and a bounded payload parser.
- TLS hostname — encryption alone does not prove the intended server identity; certificate trust/hostname verification is required, so avoid an insecure bypass.
- HTTP multiplexing limit — HTTP2 streams stall on one TCP loss through transport head-of-line blocking; HTTP3 stream independence does not eliminate shared congestion limits.

## Understand it with an example

- Scenario — A request totals 800 ms: DNS 20, connection/TLS 80, server wait/work 650 and transfer 50 ms are measured.
- Reasoning — The main time is in the server phase; split pool wait, the dependency call and computation with a correlated trace. A DNS tweak alone does not explain the 650 ms bottleneck.
- Catch — Add phases only when they are defined as non-overlapping; with connection reuse the handshake can be absent. After a timeout, reconcile the write outcome from logs/status.

## Recall and practice

- Question — If the client made two send calls, will the server get exactly two receive callbacks?
- Answer — No; TCP transports ordered bytes, and the chunk grouping can differ. The application reconstructs the framing.
- Try it yourself — Build a triage tree for a slow request; distinguish DNS, a TLS failure, pool wait, connection reuse and an unknown commit using timings/logs.

## Practice questions

### Easy · What happens after you type a URL?

<details>
<summary>Answer</summary>

- DNS — domain → IP (browser/OS/resolver caches).
- TCP connect (or QUIC over UDP for HTTP/3) → the TLS handshake (verifying the certificate hostname).
- HTTP request → the server response (status, headers, body).
- Browser — parses the HTML, fetches CSS/JS, renders (layout, paint); caches and connection reuse shorten every step.

</details>

### Medium · Break a slow request down layer by layer

An API call sometimes takes 3 seconds. Which timings do you look at?

<details>
<summary>Answer</summary>

```bash
curl -o /dev/null -s -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://api.example.com/orders
```

- DNS slow — a resolver/caching issue.
- Connect/TLS slow — network distance, or the connection is not being reused.
- TTFB slow — the server side (app, DB, pool wait).
- Total − TTFB — payload size/bandwidth.

</details>

### Medium · "Too many open files"

<details>
<summary>Answer</summary>

- Meaning — the process has hit its file descriptor limit (sockets are fds too).
- Check — `ulimit -n`, `lsof -p <pid> | wc -l`, and which type of fds is growing.
- Cause — connections/files are not being closed (a leak), or genuinely high concurrency.
- Fix — fix the leak (try-with-resources, close streams), set the limits correctly, connection pooling.

</details>

### Medium · Ephemeral port exhaustion

A service opens a new HTTP connection to its downstream on every request; under load, `cannot assign requested address`.

<details>
<summary>Answer</summary>

- Cause — every outbound connection takes a local ephemeral port; after a close the port stays busy for a while in `TIME_WAIT`.
- Fix — keep-alive connection pooling (reuse), HTTP/2 multiplexing.
- Tuning — widening the port range treats the symptom; the root fix is reuse.

</details>

### Hard · App latency is high, the DB is fast

APM: the endpoint p99 is 2s, but the DB query time is 20ms. How do you diagnose it?

<details>
<summary>Answer</summary>

- Pool wait — the DB connection pool acquire time metric (Hikari `pending threads`, `connection acquire` time); the pool is small or connections are being leaked/held.
- Thread dumps — where the threads are blocked (the pool, locks, external HTTP).
- External calls — HTTP calls inside a transaction hold on to the connection.
- GC — long pauses (GC logs).
- Layered timeouts — client timeout > server timeout > DB statement timeout, so that no layer stays stuck.

</details>

## Sources — further reading

- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/15-os-network-debugging.md)
