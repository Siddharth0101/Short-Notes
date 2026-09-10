'use strict';

/**
 * ========================================================================
 * 04. NETWORK PROTOCOLS & REAL-TIME COMMUNICATION [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * HOW DOES THE CLIENT TALK TO THE SERVER?
 * - Modern web apps require instant live updates (Chat, Stocks, AI streaming, Rideshare).
 * - Picking the wrong network protocol leads to battery drain, server collapse, or high latency.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                REAL-TIME DATA STREAMING MATRIX                      │
 * ├──────────────┬───────────────┬────────────────┬─────────────────────┤
 * │ Protocol     │ Direction     │ Protocol Base  │ Primary Use Case    │
 * ├──────────────┼───────────────┼────────────────┼─────────────────────┤
 * │ Short Poll   │ Client ──► Svr│ Standard HTTP  │ Infrequent checks   │
 * │ Long Poll    │ Client ──► Svr│ Held HTTP conn │ Legacy fallback     │
 * │ SSE (Events) │ Svr ──► Client│ HTTP/2 Stream  │ AI Stream / Stocks  │
 * │ WebSockets   │ Svr ◄──►Client│ ws:// / wss:// │ Chat, Multiplayer   │
 * │ WebRTC       │ Peer ◄──► Peer│ UDP / SCTP     │ Video/Audio Calls   │
 * └──────────────┴───────────────┴────────────────┴─────────────────────┘
 */

/**
 * ========================================================================
 * 1. HTTP/1.1 VS HTTP/2 VS HTTP/3
 * ========================================================================
 * - HTTP/1.1:
 *   - Head-of-line blocking at application level.
 *   - Browsers allow maximum 6 simultaneous TCP connections per domain.
 *   - Requires domain sharding (assets1.cdn.com, assets2.cdn.com).
 *
 * - HTTP/2:
 *   - Single TCP connection with Binary Framing.
 *   - Multiplexing: Multiple requests/responses interleave concurrently.
 *   - HPACK header compression saves huge bandwidth.
 *
 * - HTTP/3 (QUIC):
 *   - Built on UDP instead of TCP!
 *   - Zero Head-of-Line blocking even if packet loss occurs on mobile networks!
 *   - Faster 0-RTT connection establishment.
 */

/**
 * ========================================================================
 * 2. SERVER-SENT EVENTS (SSE) — THE UNSUNG HERO
 * ========================================================================
 * - Used by ChatGPT / Claude for streaming tokens!
 * - Unidirectional (Server sends text streams to Client over standard HTTP).
 * - Content-Type: `text/event-stream`.
 * - Browser has built-in `EventSource` API with AUTOMATIC reconnection!
 * - Works natively through corporate firewalls and standard load balancers without custom proxy config.
 */

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

/**
 * ========================================================================
 * 3. WEBSOCKETS (BIDIRECTIONAL FULL-DUPLEX)
 * ========================================================================
 * - Upgrades standard HTTP/HTTPS connection using `Upgrade: websocket` header.
 * - Persistent TCP socket between browser and server.
 * - Very low framing overhead (only 2 to 10 bytes per frame).
 *
 * PRODUCTION WEBSOCKET ARCHITECTURE REQUIREMENTS:
 * 1. Heartbeat / Ping-Pong: Detect silent socket disconnection (every 30s).
 * 2. Exponential Backoff Reconnection: If network drops, retry with jitter:
 *    retryDelay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 30000).
 * 3. Offline Message Queue: Queue outgoing messages in memory/IndexedDB and flush when reconnected!
 */

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
