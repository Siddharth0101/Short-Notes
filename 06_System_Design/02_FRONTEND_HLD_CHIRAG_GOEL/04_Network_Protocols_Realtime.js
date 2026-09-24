/**
 * ## Quick revision
 *
 * - Realtime — WebSocket/SSE choose interaction direction aur infra se.
 * - Message ID — stable client/server identity; reconnect duplicates dedupe karo.
 * - Ack — accepted, persisted aur delivered ka meaning alag define karo.
 * - Reconnect — last cursor/sequence se missed events replay.
 * - Ordering — conversation/document scope; global order zaroori nahi hota.
 * - Presence — temporary state; heartbeat/TTL se stale users expire.
 * - Collaboration — OT/CRDT ya server serialization ka conflict contract choose.
 * - Snapshot — compact durable state + later operations replay.
 * - Permissions — subscription aur every write par access validate.
 * - HTTP/1.1 — request connections; HTTP/2 — one connection par multiplexed streams.
 * - HTTP/3 — QUIC transport; independent streams transport head-of-line issue kam karte hain.
 * - SSE — server-to-browser event stream; reconnect/event ID useful.
 * - WebSocket — bidirectional connection; auth, heartbeat aur reconnect protocol chahiye.
 * - Polling — simple repeated fetch; interval latency/load tradeoff.
 * - Long polling — server update/timeout tak request hold karta hai.
 * - Reconnect jitter — saare clients ek saath reconnect karke server overload na karein.
 * - Slow receiver — outgoing queue bound; drop/disconnect/replay policy explicit.
 * - Connection auth — long-lived socket par expiry/revocation ka recheck mechanism.
 */

'use strict';


// Simulated SSE Stream parser
function simulateEventSourceParser(rawStreamChunks) {
  const events = [];
  rawStreamChunks.forEach((chunk) => {
    const lines = chunk.split('\n');
    lines.forEach((line) => {
      if (line.startsWith('data: ')) {
        events.push(line.replace('data: ', ''));
      }
    });
  });
  return events;
}

const mockChunks = [
  'event: message\ndata: {"token": "Frontend"}\n\n',
  'event: message\ndata: {"token": " System"}\n\n',
  'event: message\ndata: {"token": " Design"}\n\n'
];

console.log('--- Server-Sent Events (SSE) Simulation ---');
const parsed = simulateEventSourceParser(mockChunks);
console.log('Streamed Tokens received:', parsed.map((p) => JSON.parse(p).token).join(''));


// Exponential Backoff with Jitter algorithm
function calculateReconnectDelay(attempt) {
  const baseDelay = 1000;
  const maxDelay = 30000;
  const exponential = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.floor(Math.random() * 500);
  return exponential + jitter;
}

console.log('--- Reconnection Exponential Backoff Delays ---');
for (let i = 0; i < 4; i++) {
  console.log(`Attempt ${i + 1} Reconnect Delay: ${calculateReconnectDelay(i)}ms`);
}
