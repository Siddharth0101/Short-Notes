---
id: system-design-os-network-debugging
title: OS aur networking interviews — slow request ko layer-wise diagnose karo
track: system-design
order: 15
level: Intermediate
minutes: 5
summary: Process — isolated address space; thread — process ke resources share karta hai.
tags: os, networking, tcp, dns, tls, debugging
---

## Quick revision

> Revision target — Slow request ki layers ko independent measurements aur smallest diagnostic experiment se separate karo.

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

### Edge cases aur reasoning

- TCP byte stream — send boundaries message boundaries nahi; framing/length-prefix/delimiter protocol aur bounded payload parser chahiye.
- TLS hostname — encryption alone intended server identity prove nahi; certificate trust/hostname verification required, insecure bypass avoid karo.
- HTTP multiplexing limit — HTTP2 streams ek TCP loss se transport head-of-line stall; HTTP3 stream independence shared congestion limits eliminate nahi karti.

## Example se samjho

- Scenario — Request total 800 ms: DNS 20, connection/TLS 80, server wait/work 650, transfer 50 ms measured hain.
- Reasoning — Main time server phase mein hai; correlated trace se pool wait, dependency call aur computation split karo. DNS tweak alone 650 ms bottleneck explain nahi karta.
- Catch — Phases defined non-overlapping hon tabhi add karo; connection reuse par handshake absent ho sakti hai. Timeout ke baad write outcome logs/status se reconcile karo.

## Recall aur practice

- Sawal — Client ne two send calls ki toh server ko exactly two receive callbacks milenge?
- Jawaab — Nahi; TCP ordered bytes transport karta, chunk grouping different ho sakti. Application framing reconstruct kare.
- Khud try karo — Slow request triage tree banao; DNS, TLS failure, pool wait, connection reuse aur unknown commit ko timings/logs se distinguish karo.

## Practice questions

### Easy · URL type karne ke baad kya hota hai?

<details>
<summary>Answer</summary>

- DNS — domain → IP (browser/OS/resolver caches).
- TCP connect (ya HTTP/3 ke liye QUIC over UDP) → TLS handshake (certificate hostname verify).
- HTTP request → server response (status, headers, body).
- Browser — HTML parse, CSS/JS fetch, render (layout, paint); caches aur connection reuse har step ko chhota karte hain.

</details>

### Medium · Slow request ko layer-wise todo

Ek API call kabhi 3 second leti hai. Kaunsi timings dekhoge?

<details>
<summary>Answer</summary>

```bash
curl -o /dev/null -s -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://api.example.com/orders
```

- DNS slow — resolver/caching issue.
- Connect/TLS slow — network distance, connection reuse nahi ho raha.
- TTFB slow — server side (app, DB, pool wait).
- Total − TTFB — payload size/bandwidth.

</details>

### Medium · "Too many open files"

<details>
<summary>Answer</summary>

- Matlab — process file descriptor limit tak pahunch gaya (sockets bhi fds hain).
- Check — `ulimit -n`, `lsof -p <pid> | wc -l`, kis type ke fds badh rahe hain.
- Cause — connections/files close nahi ho rahe (leak), ya genuinely high concurrency.
- Fix — leak fix (try-with-resources, close streams), limits sahi set, connection pooling.

</details>

### Medium · Ephemeral port exhaustion

Service downstream ko har request par naya HTTP connection banati hai; load par `cannot assign requested address`.

<details>
<summary>Answer</summary>

- Cause — har outbound connection ek local ephemeral port leta hai; close ke baad `TIME_WAIT` mein port kuch der busy.
- Fix — keep-alive connection pooling (reuse), HTTP/2 multiplexing.
- Tuning — port range badhana symptom treat karta hai; root fix reuse hai.

</details>

### Hard · App latency high, DB fast

APM: endpoint p99 2s, par DB query time 20ms. Kaise diagnose karoge?

<details>
<summary>Answer</summary>

- Pool wait — DB connection pool acquire time metric (Hikari `pending threads`, `connection acquire` time); pool chhota ya connections leak/hold ho rahe.
- Thread dumps — threads kahan blocked hain (pool, locks, external HTTP).
- External calls — transaction ke andar HTTP calls connection pakad kar rakhte hain.
- GC — long pauses (GC logs).
- Timeouts layered — client timeout > server timeout > DB statement timeout, taaki ek layer stuck na rahe.

</details>

## Sources — aur padhne ke liye

- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/15-os-network-debugging.md)
