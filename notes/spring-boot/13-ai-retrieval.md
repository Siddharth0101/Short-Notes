---
id: spring-ai-retrieval
title: Spring AI aur RAG — retrieval, permissions aur answer evaluation
track: spring-boot
order: 13
level: Advanced
minutes: 1
summary: Spring AI — model/provider integrations ka abstraction.
tags: spring-ai, rag, retrieval, evaluation
---

## Quick revision

- Spring AI — model/provider integrations ka abstraction.
- RAG — relevant documents retrieve karke model ko context do.
- Embedding — semantic similarity ke liye vector representation.
- Chunking — meaningful text pieces; size/overlap retrieval quality par effect.
- Authorization — retrieval se pehle allowed documents filter karo.
- Prompt injection — retrieved text ko instructions ki authority mat do.
- Grounding — answer ke claims ko retrieved evidence se support karo.
- Evaluation — correct, unknown aur unauthorized questions ka test set.
- Cost/latency — token budget, timeout aur fallback define karo.

## Sources — aur padhne ke liye

- [Spring AI RAG](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html)
- [ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/13-ai-retrieval.md)
