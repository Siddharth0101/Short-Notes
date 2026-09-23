# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Transport and topology

```text
React clients <-> connection gateways <-> room routing/pub-sub
                         |                       |
                    Java API                fan-out workers
                         |
                durable message/document DB
```

## Wire protocol and data model

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

## The hardest correctness problem: the catch-up gap

```text
t=0     client reconnects
t=0     GET /rooms/r_42/messages?after=10417  -> returns up to seq 10430
t=15ms  message seq 10431 publish hoti hai    -> client abhi subscribed nahi hai
t=20ms  client WebSocket subscribe karta hai
t=50ms  message seq 10432 aati hai            -> client usse render kar deta hai

result: seq 10431 kabhi nahi dikha. Client ko error bhi nahi mila.
        UI mein conversation ka ek hissa permanently missing hai.
```

```text
1. subscribe first  -> incoming live messages ko ek buffer mein daalo, render mat karo
2. fetch history after lastSeq (paginate jab tak current tak na pahunch jao)
3. buffer ko drain karo: seq <= lastRenderedSeq wale drop karo (duplicates),
   baaki ko sorted order mein render karo
4. ab live rendering enable karo
```

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
