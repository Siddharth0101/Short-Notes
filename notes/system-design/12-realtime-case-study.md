---
id: design-realtime-case-study
title: Case study collaborative notes and real-time chat
track: system-design
order: 12
level: Advanced
minutes: 31
summary: Reconnect ke liye durable ordering aur missing-message recovery chahiye; live socket akela kaafi nahi.
tags: case-study, websocket, sse, collaboration, java
visual: request-flow
---

## Mental model — simple soch

Real-time ka matlab low-latency updates hai, guaranteed delivery ya automatic conflict resolution nahi. Durable document content, chat messages and temporary presence different data classes hain. Cursor movement drop hona acceptable ho sakta hai; saved edit lose hona nahi. Invariants data type ke according choose karo.

> **Core takeaway:** Reconnect ke liye durable ordering aur missing-message recovery chahiye; live socket akela kaafi nahi.

## Transport and topology

```text
React clients <-> connection gateways <-> room routing/pub-sub
                         |                       |
                    Java API                fan-out workers
                         |
                durable message/document DB
```

SSE server-to-client stream ke liye convenient hai, such as status updates; browser writes normal HTTP se ja sakti hain. WebSocket bidirectional channel deta hai, chat and live presence ke liye useful. Native WebSocket API automatic backpressure provide nahi karti, so application queue bounds and slow-client policy zaroori hain. [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events), [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

Load balancer long-lived connections support kare and idle timeout/heartbeat policy align ho. Gateway process restart se connections reconnect karengi; persistent room history gateway memory mein sole copy nahi honi chahiye.

## Durable chat flow

Client `clientMessageId`, room ID and body send kare. Server room authorization validate kare, then message persist with unique `(sender_id, clientMessageId)` constraint and room sequence. Acknowledge after defined durability point. Publisher committed message event fan out kare. Client optimistic bubble pending state mein show kare and server ID/sequence se reconcile kare.

Reconnect pe client last confirmed room sequence send kare and missed durable messages fetch kare. Pub/sub alone offline history recover nahi karta. Duplicate events ID se deduplicate karo. Ordering scope per room specify karo; global ordering expensive and usually unnecessary hai. Device clock authoritative ordering source nahi.

## Wire protocol and data model

WebSocket par "JSON bhej dena" ek protocol nahi hai. Message types, required fields aur acknowledgment semantics explicitly define karo:

```text
client -> server
{ "t": "send", "clientMsgId": "c_01J8X...", "roomId": "r_42",
  "body": "deploy ho gaya?", "replyTo": null }

{ "t": "sub",  "roomId": "r_42", "lastSeq": 10417 }   // reconnect/catch-up
{ "t": "typing", "roomId": "r_42" }                    // ephemeral, no ack
{ "t": "ping" }

server -> client
{ "t": "ack",  "clientMsgId": "c_01J8X...", "msgId": "m_9931",
  "seq": 10418, "serverTs": "2026-09-11T12:04:11.221Z" }

{ "t": "msg",  "msgId": "m_9932", "roomId": "r_42", "seq": 10419,
  "senderId": "u_7", "body": "haan", "serverTs": "..." }

{ "t": "gap",  "roomId": "r_42", "fromSeq": 10419, "toSeq": 10480 }
{ "t": "error","code": "room_forbidden", "clientMsgId": "c_01J8X..." }
```

`seq` per-room monotonic integer hai — yeh poore design ka backbone hai. Uske bina client ko pata hi nahi chalega ki usne koi message miss kiya. Timestamps ordering ke liye use mat karo: device clocks skewed hote hain, aur server clocks bhi milliseconds mein disagree karte hain, isliye do messages ka "kaun pehle" timestamp se decide karna galat answers deta hai.

```sql
CREATE TABLE message (
  id            text PRIMARY KEY,           -- server-generated, sortable (ULID)
  room_id       text   NOT NULL,
  seq           bigint NOT NULL,            -- per-room monotonic
  sender_id     text   NOT NULL,
  client_msg_id text   NOT NULL,
  body          text   NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, seq),
  UNIQUE (sender_id, client_msg_id)         -- idempotent send, yeh hi dedupe hai
);
CREATE INDEX ON message (room_id, seq DESC);

CREATE TABLE room_cursor (
  room_id text PRIMARY KEY,
  next_seq bigint NOT NULL                  -- atomic increment source
);

CREATE TABLE room_member (
  room_id   text NOT NULL,
  user_id   text NOT NULL,
  last_read_seq bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (room_id, user_id)
);
```

`UNIQUE (sender_id, client_msg_id)` hi wo constraint hai jo send ko idempotent banati hai: client retry kare (network drop ke baad) toh insert unique violation dega, server existing row ka `msgId`/`seq` lookup karke wahi ack wapas bhej dega. Client ko pata bhi nahi chalega ki duplicate tha. `last_read_seq` unread counts ko O(1) banata hai — per-message read receipts ke bajaye ek integer comparison.

Per-room `seq` allocate karna ek serialization point hai. Ek normal room (kuch messages/second) ke liye `UPDATE room_cursor SET next_seq = next_seq + 1 WHERE room_id = ? RETURNING next_seq` bilkul theek hai. Ek 100,000-member broadcast room ke liye yeh hot row ban jaati hai — us case mein gaps allow karo (sequence se contiguity ki guarantee hatakar sirf monotonicity rakho) ya batching use karo.

## Capacity example

Assume 50,000 concurrent connections and average gateway state/buffer budget 20 KB each: roughly 1 GB aggregate connection memory before runtime/network overhead. At 2,000 messages/s with average 20 recipients, fan-out roughly 40,000 deliveries/s hai. Big public room distribution highly skewed ho sakti hai, so average room size alone insufficient hai.

Per-client send queue bound karo. Slow client ke presence events coalesce/drop kar sakte ho; durable message backlog excessive ho toh reconnect-and-catch-up instruct karo. User-visible backpressure states silently freezing browser se better hain.

Fan-out ka asymmetry samajhna zaroori hai: write load chhota hai, delivery load bada. 2,000 messages/s at 20 recipients = 40,000 deliveries/s. Ab ek 50,000-member announcement channel add karo jisme din mein sirf 10 messages jaate hain — ek message ka fan-out 50,000 deliveries hai, matlab ek single write 1.25 seconds ka pura system throughput consume kar leti hai. Isliye large rooms ko chhote rooms jaisa treat karna kaam nahi karta:

| Room size | Strategy | Kyun |
| --- | --- | --- |
| 2-50 (DM, team) | Push to all connected members | Fan-out sasta, latency best |
| 50-1,000 | Push, batched per gateway | Gateway ko ek message bhejo with recipient list |
| 1,000+ (broadcast) | Pull/poll or throttled push | Push storm avoid karo; readers khud catch up karein |

Bade rooms ke liye ek practical hybrid: connected clients ko sirf ek lightweight "new messages available up to seq N" notification bhejo (ek chhoti payload, coalesce-able), aur client actual messages ko ek normal paginated fetch se laaye. Isse fan-out bandwidth message size se independent ho jaata hai, aur multiple rapid messages ek hi notification mein collapse ho jaate hain.

Thundering herd bhi dhyan mein rakho: ek gateway instance restart hui jisme 10,000 connections thi. Sab clients ek saath reconnect karenge, sab catch-up query chalayenge, aur database ko 10,000 simultaneous history reads milengi. Fixes: client-side reconnect backoff with jitter (0-30 s spread), gateway par connection admission rate limit, aur catch-up query ko cheap rakhna (`room_id, seq` index par ek range scan, aur maximum 200 messages per response with a "fetch more" cursor).

Memory bhi budget karo. 50,000 connections × 20 KB ≈ 1 GB, lekin yeh number per-connection buffer ke saath grow karta hai. Agar per-client send queue unbounded hai aur ek slow mobile client 500 messages behind hai, uska buffer 500 × 2 KB = 1 MB ho jaata hai — 1,000 aise clients = 1 GB extra, aur gateway OOM. Isliye per-client queue ka hard bound (jaise 100 messages ya 256 KB) mandatory hai, aur bound cross hone par policy explicit honi chahiye: connection close karke client ko catch-up flow par bhejo, kyunki wo client ab "live" hai hi nahi.

## The hardest correctness problem: the catch-up gap

Sabse mushkil issue transport ya scaling nahi hai — wo yeh hai ki **durable history ek path se aati hai (REST/database) aur live messages doosre path se (WebSocket/pub-sub), aur in dono ke beech ek window hoti hai.** Naive reconnect flow silently messages kho deta hai:

```text
t=0     client reconnects
t=0     GET /rooms/r_42/messages?after=10417  -> returns up to seq 10430
t=15ms  message seq 10431 publish hoti hai    -> client abhi subscribed nahi hai
t=20ms  client WebSocket subscribe karta hai
t=50ms  message seq 10432 aati hai            -> client usse render kar deta hai

result: seq 10431 kabhi nahi dikha. Client ko error bhi nahi mila.
        UI mein conversation ka ek hissa permanently missing hai.
```

Yeh bug production mein months tak chal sakta hai kyunki wo rare hai (window chhoti hai), user-reported symptom vague hai ("kabhi kabhi message nahi dikhta"), aur koi exception log nahi hoti. Aur ulta order karne se (pehle subscribe, phir fetch) loss toh ruk jaata hai lekin duplicates aa jaate hain — jo better hai, lekin sirf tab jab client dedupe kare.

Correct flow yeh hai, aur uske teeno hisse zaroori hain:

```text
1. subscribe first  -> incoming live messages ko ek buffer mein daalo, render mat karo
2. fetch history after lastSeq (paginate jab tak current tak na pahunch jao)
3. buffer ko drain karo: seq <= lastRenderedSeq wale drop karo (duplicates),
   baaki ko sorted order mein render karo
4. ab live rendering enable karo
```

Subscribe-before-fetch ordering se loss structurally impossible ho jaata hai — jo bhi message fetch ke dauran aayi, wo buffer mein hai. Aur `seq` ki wajah se duplicates trivially detect ho jaate hain. Yeh design ka core insight hai: **at-least-once delivery plus client-side dedupe, at-most-once delivery se hamesha better hai, kyunki duplicate detect kiya ja sakta hai aur missing message nahi.**

Lekin ek aur gap bacha hai — steady state mein. Maan lo client connected hai aur pub/sub ek message drop kar deta hai (broker partition, gateway ka buffer overflow, ek transient error). Client ko kaise pata chalega? Yahan `seq` ki contiguity kaam aati hai:

```js
function onMessage(msg) {
  if (msg.seq === lastSeq + 1) {
    render(msg);
    lastSeq = msg.seq;
  } else if (msg.seq <= lastSeq) {
    // duplicate — chup-chaap ignore karo
  } else {
    // GAP detected: seq jump ho gaya, beech ke messages miss hue
    buffer.push(msg);
    fetchRange(lastSeq + 1, msg.seq - 1).then(fillAndDrain);
  }
}
```

Client ab apni correctness khud verify kar sakta hai, bina server par bharosa kiye ki usne sab kuch deliver kiya. Yeh property — **client-verifiable completeness** — is design ka sabse valuable hissa hai, aur wo sirf isliye possible hai kyunki humne per-room contiguous `seq` rakha. Agar sequence sirf monotonic hota (gaps allowed), toh client gap aur legitimate skip mein farq nahi kar paata, aur usse periodic full-refresh par depend karna padta.

Multi-device isse thoda aur complicate karta hai: ek user ke phone aur laptop dono connected hain, dono ka apna `lastSeq` hai, aur dono ko same messages milne chahiye. Isliye `seq` per-room hona chahiye, per-connection ya per-user nahi — tabhi do devices independently catch up kar sakte hain. `last_read_seq` per-user hai (read state user ka hai, device ka nahi), lekin delivery state per-device hai — in dono ko alag rakhna zaroori hai, warna phone par message padhne se laptop par unread badge galat ho jaata hai.

Aakhri detail jo aksar chhut jaati hai: sender ke apne message ka echo. User ne message bheja, client ne optimistic bubble dikha diya, phir server se `ack` aayi (with `msgId` aur `seq`), aur phir pub/sub se wahi message broadcast bhi aayi. Agar client dono ko alag treat kare toh user ko apna message do baar dikhega. Fix `clientMsgId` par reconcile karna hai — ack aane par optimistic bubble ko real message se replace karo, aur broadcast copy ko `msgId` dedupe se drop karo.

## Collaborative editing

Whole document last-write-wins simple hai but simultaneous edits lose kar sakta hai. Version-based optimistic concurrency conflict surface karta hai; real simultaneous editing ke liye proven operational transformation or CRDT implementation evaluate karo. Algorithm convergence document schema, identity, ordering and merge rules par depend karti hai. Homegrown character merging production-ready assume mat karo.

Binary attachments object storage mein store karo. Short-lived upload authorization, size/type validation and access checks define karo; database metadata reference maintain kare. Presence ephemeral TTL data ho sakti hai, durable content transaction path se separate.

Transport choice ko requirement se derive karo, preference se nahi:

| Requirement | Best fit | Kyun |
| --- | --- | --- |
| Server-to-client status updates only | SSE | Simple, auto-reconnect built in, plain HTTP |
| Bidirectional chat, presence, typing | WebSocket | Client writes ko round-trip HTTP overhead nahi chahiye |
| Updates every few minutes, low value | Polling | Connection cost zero, infra simplest |
| 100,000+ idle connections | Reconsider entirely | Idle connections bhi memory aur file descriptors lete hain |

Polling ko underrate mat karo. 10,000 users × 1 poll per 30 s = 333 rps — wo ek chhoti service comfortably handle karti hai, aur uska failure mode trivial hai (ek poll miss ho gayi, agli 30 s mein theek). WebSocket us load ko kam kar deta hai lekin ek poori class ki problems laata hai: sticky routing, connection draining during deploys, idle timeouts across proxies, aur reconnect storms. Agar product requirement "updates within 30 seconds" hai toh polling ka answer defensible hai aur aksar correct hai — real-time transport tab justify hota hai jab sub-second latency ya high message rate genuinely chahiye.

Deployment ka ek specific issue: long-lived connections rolling deploy ko mushkil banate hain. Instance shutdown par 10,000 connections drop hongi. Graceful approach: instance ko unready mark karo (naye connections na aayein), connected clients ko ek `{"t":"reconnect","afterMs":<jittered>}` message bhejo taaki wo controlled rate se dusre instance par jaayein, phir bounded time (jaise 60 s) baad close karo. Bina iske har deploy ek mini thundering herd hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** WebSocket connection open hai toh messages deliver ho rahi hain. **Why it breaks:** TCP connection half-open reh sakti hai — client ka network gaya lekin server ko FIN nahi mila, toh server happily messages ek dead socket mein likhta rehta hai aur koi error nahi milta. Client ko lagta hai wo connected hai, server ko lagta hai delivery ho rahi hai, aur dono galat hain. **Fix:** Application-level heartbeat (ping/pong) with a timeout rakho, aur delivery ko connection state se nahi, client ke acknowledged `seq` se measure karo.
- **Wrong assumption:** Message ordering guaranteed hai kyunki WebSocket TCP par chalta hai. **Why it breaks:** TCP sirf ek connection ke andar ordering deta hai. Multi-instance setup mein do messages do alag gateways se, do alag pub/sub partitions se aa sakti hain, aur reconnect ke baad to connection hi nayi hai. Server-side concurrency bhi ordering todh sakti hai — do handlers same room par parallel chal rahe hain. **Fix:** Ordering ko application-level per-room sequence se establish karo; transport ordering ko incidental maano, guarantee nahi.
- **Wrong assumption:** Client ka timestamp message ordering ke liye use kiya ja sakta hai. **Why it breaks:** Device clocks minutes tak galat ho sakte hain (aur users unhe manually badal sakte hain), timezone handling buggy hoti hai, aur ek client deliberately future timestamp bhejkar apne message ko hamesha top par rakh sakta hai. **Fix:** Ordering ke liye server-assigned sequence use karo; client timestamp ko sirf "sent at" display hint ke roop mein rakho, wo bhi server timestamp se validate karke.
- **Wrong assumption:** Presence (online/offline) ko durable messages jaisi reliability chahiye. **Why it breaks:** Presence events message volume se kai guna zyada hote hain (har tab focus, har typing start/stop) aur unhe durably store karna database ko write load se bhar deta hai — jabki data ki value seconds mein expire ho jaati hai. **Fix:** Presence ko TTL-based ephemeral store (cache) mein rakho, updates ko coalesce karo (per user per 5-10 s maximum ek update), aur uska loss acceptable maano.
- **Wrong assumption:** Reconnect par poora room history dobara fetch kar lena simplest aur safe hai. **Why it breaks:** Ek 50,000-message room ke liye yeh megabytes ka transfer hai, mobile par seconds lagta hai, aur ek reconnect storm mein 10,000 clients ek saath yeh karein toh database aur bandwidth dono collapse ho jaate hain. **Fix:** `lastSeq` se incremental catch-up karo with bounded page size, aur agar gap bahut bada hai (jaise 1,000 messages se zyada) toh history ko truncate karke "load earlier messages" affordance do — client ko sab kuch turant chahiye hi nahi.
- **Wrong assumption:** Authentication connection ke waqt ho gayi toh connection ki poori lifetime ke liye kaafi hai. **Why it breaks:** Ek WebSocket connection ghanton khuli reh sakti hai. Us dauran token expire ho sakta hai, user ka room access revoke ho sakta hai, ya account suspend ho sakta hai — lekin connection ab bhi messages deliver kar rahi hai. **Fix:** Connection par periodic re-authorization karo (token expiry par close ya refresh demand karo), aur membership change events par affected connections ki subscriptions actively revoke karo.

## Interview questions — bolkar practice karo

**Do WebSockets guarantee message persistence?** Nahi. Transport connection ordering persistence or application acknowledgment policy replace nahi karti. Durable store, IDs and reconnect replay protocol chahiye.

**How does authentication work after connection starts?** Initial handshake identity establish kare; every room join and write authorize karo. Expiry, revocation and room-membership changes for existing connections explicitly handle karo.

**Reconnect par client ko koi message miss na ho, yeh kaise guarantee karoge?** Do mechanisms saath mein. Ek, subscribe pehle karo aur history fetch baad mein — incoming live messages ko buffer karke fetch complete hone ke baad drain karo, taaki beech ka koi message drop na ho; duplicates `seq` se filter ho jaate hain. Do, steady state mein client har incoming message ka `seq` verify kare ki wo `lastSeq + 1` hai; gap dikhe toh missing range explicitly fetch kare. Isse client apni completeness khud verify karta hai aur server ki perfect delivery par depend nahi karta.

**WebSocket, SSE ya polling — kaise decide karoge?** Latency requirement aur direction se. Agar updates sirf server se client ko jaani hain aur sub-second latency chahiye, SSE simplest hai kyunki wo plain HTTP hai aur reconnect built-in hai. Agar client ko bhi frequently likhna hai (chat, typing, presence) toh WebSocket justify hota hai. Aur agar requirement "30 seconds ke andar update" hai toh polling choose karta hoon — 10,000 users ka 30-second polling sirf ~333 rps hai, aur uske badle mein sticky routing, connection draining aur reconnect storms wali poori complexity bach jaati hai.

**Ek user ke 3 devices connected hain — state kaise manage karoge?** Delivery state per-connection rakhta hoon (har device ka apna `lastSeq` aur apni catch-up), lekin read state per-user (`last_read_seq` room_member mein). Message sequence per-room hai, per-user nahi — yeh zaroori hai taaki har device independently same stream se catch up kar sake. Read receipt phone par mark hone par laptop ka unread badge bhi update ho, iske liye read-state change ko ek event ki tarah user ke saare connections par broadcast karta hoon.

**Gateway restart hone par kya hota hai?** Us instance ki saari connections drop hongi aur clients reconnect karenge — agar kuch nahi kiya toh yeh ek thundering herd hai jo ek hi second mein hazaaron catch-up queries firing karta hai. Mitigation teen layers mein: deploy se pehle instance ko unready mark karke clients ko jittered reconnect instruction bhejo, client side par exponential backoff with jitter rakho, aur catch-up query ko bounded (max 200 messages, indexed range scan) rakho taaki worst case bhi database ko na gira de.

## Practice

Disconnect immediately after send but before acknowledgment. Reconnect and resend same ID: one durable message expected hai. Two concurrent document edits ke conflict policy explain karo. Slow consumer simulate karke bounded memory verify karo.

Phir catch-up gap deliberately reproduce karo: fetch-then-subscribe order use karo, fetch ke dauran ek message publish karo, aur verify karo ki wo client mein missing hai. Uske baad subscribe-then-fetch plus buffer drain implement karke same test dobara chalao. Uske baad steady-state gap test karo — ek message ko artificially drop karo aur confirm karo ki client `seq` mismatch detect karke missing range fetch karta hai. Last mein backpressure test: ek client ko deliberately slow karo (messages read mat karo) aur verify karo ki server ka per-client buffer bound hit hota hai aur connection close hokar client catch-up flow par jaata hai, server memory grow nahi karti.

## Capstone: reconnectable collaboration service

React client, durable backend aur replayable stream se collaborative notes design karo. Pehle editing semantics choose: whole-document version checks, OT aur CRDT different problems/costs ke tools hain.

### Acceptance criteria

- Active users, edits/user, event size aur retention se workload nikalo; bursts/fan-out include karo.
- Per-document ordering/version contract aur stale writes ka behavior define karo.
- Client disconnect karke elsewhere edits banao; cursor se reconnect, dedup aur expired-retention fallback test karo.
- Connected socket ke dauran access revoke karo; existing/reconnecting sessions access lose karein.
- Slow-client buffers bound aur resync/disconnect policy choose karo.
- Commit/publish ke beech crash trace karke durable outbox/equivalent handoff se recovery dikhao.

### Interview defense

Happy path aur two failure paths draw karo. Har durable fact ka owner aur first scaling bottleneck identify karo. Transport delivery versus exactly-once business effect alag samjhao. Observability, rollout aur claimed consistency tod sakne wala test ke saath finish karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Client ne last message 41 acknowledge kiya; disconnect ke dauran 42–45 aaye. Reconnect par replay aur duplicates kaise handle honge?

> **Hint:** Sirf live subscribe karne se disconnection ke messages miss ho sakte hain.

**Answer guide — compare after attempting:** Durable cursor ke baad messages maango; 42–45 order mein replay karke stable IDs se merge karo. Replay/live handoff coordinate karo taaki beech mein new messages lose na hon. Overlap deduplicate karo. Cursor retained history se purana ho toh recovery behavior define karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye
- [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Yjs shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)
