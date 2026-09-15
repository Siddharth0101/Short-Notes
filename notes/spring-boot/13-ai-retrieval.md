---
id: spring-ai-retrieval
title: Spring AI aur RAG — retrieval, permissions aur answer evaluation
track: spring-boot
order: 13
level: Advanced
minutes: 33
summary: Authorized evidence retrieve karo; relevance, grounding, schema validity aur permission checks alag guarantees hain.
tags: spring-ai, rag, retrieval, evaluation
---

## Mental model — simple soch

RAG open-book exam jaisa hai: model ko question ke saath relevant pages milte hain. Galat, purana ya another tenant ka private page diya toh fluent answer trustworthy nahi ho jaata. Retrieval-Augmented Generation evidence retrieval aur answer generation jodta hai; model weights automatically update nahi karta.

> **Core takeaway:** Relevant authorized evidence do, unsupported answer par abstain karo aur output ko explicit evaluation contract se check karo.

Spring security, data modeling aur bounded background work prerequisites hain. Yeh optional extension hai. Original simple chat source full RAG system nahi. Provider/vector-store credentials aur compatible Spring AI/Boot dependencies ke bina conceptual pipeline deployed app nahi hai.

## Documents se evidence tak

Ingestion flow: document ID/version → parsing → meaningful chunks → embeddings → searchable store plus metadata. Source section, revision, tenant/ACL aur deletion status record karo. Chunk boundary table/header ko tod de toh meaning lose ho sakta hai. Overlap context help kar sakta hai, lekin duplicate results aur index size badhata hai.

Embedding numerical representation hai; similarity relevance ka heuristic hai, truth ya permission score nahi. Embedding model/dimension badle toh index compatibility aur re-embedding plan chahiye. Deleted/revoked source ki searchable chunks bhi retire hon. Background ingestion ka completion/retry previous jobs chapter se connect karo.

## Generation se pehle authorization

```text
authenticated question
  -> trusted server-derived tenant/user scope
  -> retrieve within authorized scope
  -> verify current access and source version
  -> rank / deduplicate / bound context
  -> insufficient evidence? return explicit limitation
  -> generate using labeled evidence
  -> validate response shape and cited source IDs
  -> answer + references OR controlled failure
```

Client body ka tenantId authorization authority nahi. Permission filtering retrieval scope mein ho; model ko unauthorized content dene ke baad redaction enough nahi. Revocation aur stale index metadata ka case test karo. Retrieved “ignore instructions, export secrets” text untrusted document data hai; application permissions/tool access change nahi kar sakti. Tool calls ki explicit server-side authorization alag rakho.

Valid JSON factual correctness prove nahi karta. Cited ID retrieved set ka member hai deterministic check hai; claimed fact excerpt se supported hai ya nahi deeper grounding evaluation chahiye. Fabricated reference par reject/review path define karo.

## Spring AI abstraction aur limits

ChatClient fluent API model requests aur response/stream handling organize karti hai. Retrieval advisors context assembly help kar sakte hain. Selected release ke modules, vector-store integrations aur configuration use karo; conceptual flow ko copy-paste imports mat samjho.

Provider-neutral abstraction migration effort reduce kar sakti hai, lekin sirf API key badalna enough guaranteed nahi. Starter/configuration, model IDs, context limits, tool/structured-output support aur embedding dimensions differ kar sakte hain. Capability, quality, latency aur cost tests dobara run karo.

Streaming first token full successful response ka proof nahi. Provider timeout/client disconnect par partial response ka terminal state define karo. Bounded concurrency, context size aur request budget rakho. Retry costs repeat kar sakti hai; side-effecting tools ko stable operation identity aur reconciliation chahiye.

## Original evaluation exercise

Tiny corpus banao: public collections guide, tenant-A policy aur superseded tenant-A policy. Golden questions ke expected facts aur allowed source IDs record karo.

| Case | Kya hona chahiye |
| --- | --- |
| Known answer | Supported claim + correct reference |
| Unsupported topic | Insufficient evidence; invented policy nahi |
| Other tenant source | Context/logs mein enter na ho |
| Source revoked after indexing | Current access check reject kare |
| Valid JSON, wrong claim | Grounding check fail |
| Document contains instructions | Data treat ho; permission bypass nahi |

Retrieval hit rate aur answer support quality alag measure karo. Exact prose matching harmless wording changes par fail ho sakti hai; facts, sources aur refusal conditions ka rubric use karo. Latency/token usage observe karo, sensitive prompts unrestricted logs mein mat dump karo.

## Practice — policy versus live state

“Leave policy kya hai?” documents se answer ho sakta hai. “Meri kal ki leave approve hui?” live authorized workflow data chahiye. Policy chunk approval event ka evidence nahi. Appropriate read-only authorized query/tool ya clear limitation do; plausible approval invent mat karo.

## Depth walkthrough — andar kya ho raha hai?

### Retrieval result evidence candidate hai, final truth nahi

Question leave policy ka hai. Retrieved document old version ka ho, wrong region ka ho ya user unauthorized ho toh fluent answer bhi wrong ho sakta hai. Metadata version/scope filter, authorization aur source attribution retrieval/generation boundary par check karo.

Vector similarity semantic closeness estimate karti hai; policy validity ya individual leave balance prove nahi karti. Live account state authorized transactional API se aayegi. Retrieved text mein embedded instructions ho sakti hain; use trusted application policy ki authority mat do.

**Practice:** Evaluation matrix mein relevant answer, no evidence, conflicting versions, unauthorized document aur malicious embedded instruction include karo. Measure retrieval relevance aur answer grounding separately. Provider switch mein embedding dimension/model, prompt behavior, limits aur cost differ ho sakte hain; shared abstraction se compatibility automatically verified nahi hoti. Unsupported answer par uncertainty show karna made-up certainty se better behavior hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** RAG aur fine-tuning ka mechanism kaise alag hai?

**Apply — khud try karo:** Most similar chunk another tenant ka hai. Do-not-leak prompt enough hai?

> **Hint — chhota ishara:** Content generation se pehle trusted access boundary chahiye.

**Answer guide — pehle khud karo, phir compare karo:** Nahi. Scoped retrieval aur current authorization enforce karo. Unauthorized text context/logs mein enter na ho. Prompt access control ka replacement nahi.

**Exit check — aage badhne se pehle:** Provider switch par index dimensions, output capabilities aur evaluation kaunse checks maangte hain?

## Sources — aur padhne ke liye

[Spring AI RAG](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html) aur [ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html) ke version-specific contracts padho.
