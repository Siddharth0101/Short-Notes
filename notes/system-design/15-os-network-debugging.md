---
id: system-design-os-network-debugging
title: OS aur networking interviews — slow request ko layer-wise diagnose karo
track: system-design
order: 15
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/15-os-network-debugging.md)
