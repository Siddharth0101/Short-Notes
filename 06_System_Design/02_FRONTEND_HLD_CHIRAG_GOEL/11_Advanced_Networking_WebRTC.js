'use strict';

/**
 * ========================================================================
 * 11. ADVANCED NETWORKING: WEBRTC, WS, SSE, POLLING [⚡ FRONTEND HLD]
 * ========================================================================
 * SOURCE: Namaste Frontend System Design (Chirag Goel & Akshay Saini)
 *
 * Real-time features (chat, live scores, video calls) require advanced
 * network protocols beyond standard HTTP request-response.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   REAL-TIME PROTOCOL COMPARISON                     │
 * ├────────────────┬─────────────┬─────────────┬─────────────┬──────────┤
 * │ Protocol       │ Direction   │ Transport   │ Use Case    │ Overhead │
 * ├────────────────┼─────────────┼─────────────┼─────────────┼──────────┤
 * │ Short Polling  │ Client-pull │ HTTP        │ Simple APIs │ Very High│
 * │ Long Polling   │ Client-pull │ HTTP        │ Legacy Chat │ High     │
 * │ WebSockets     │ Bi-direct   │ TCP         │ Gaming, Chat│ Low      │
 * │ SSE            │ Server-push │ HTTP        │ Live Scores │ Low      │
 * │ WebRTC         │ Peer-to-Peer│ UDP/TCP     │ Video Calls │ Minimal  │
 * └────────────────┴─────────────┴─────────────┴─────────────┴──────────┘
 */


// ========================================================================
// 1. POLLING (SHORT & LONG)
// ========================================================================

/**
 * SHORT POLLING:
 * - Client sends `setInterval(fetch, 5000)`.
 * - Server replies instantly, even if data hasn't changed.
 * - Massive overhead (HTTP headers sent every time, empty responses).
 *
 * LONG POLLING:
 * - Client sends request.
 * - Server HOLDS the connection open until it has new data (or timeout).
 * - When client receives response, it immediately sends a new request.
 * - Better than short polling, but still HTTP overhead. Difficult to scale server connections.
 */


// ========================================================================
// 2. SERVER-SENT EVENTS (SSE)
// ========================================================================

/**
 * UNIDIRECTIONAL (SERVER TO CLIENT ONLY):
 * - Runs over standard HTTP.
 * - Server keeps connection open and streams text data.
 * - Built-in automatic reconnection in the browser!
 *
 * USE CASES:
 * - Stock tickers, Live cricket scores, Social media feed updates, ChatGPT text streaming.
 *
 * ```javascript
 * const eventSource = new EventSource('https://api.example.com/scores');
 *
 * // Listen for messages
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log('Live Score:', data);
 * };
 *
 * // Listen for custom event types
 * eventSource.addEventListener('goal', (event) => {
 *   console.log('GOAL SCORED!', event.data);
 * });
 * ```
 */


// ========================================================================
// 3. WEBSOCKETS (WS / WSS)
// ========================================================================

/**
 * BIDIRECTIONAL (FULL DUPLEX):
 * - Starts as HTTP handshake, then "Upgrades" to a persistent TCP WebSocket connection.
 * - No HTTP headers overhead on subsequent messages.
 * - Binary data support (ArrayBuffer).
 *
 * USE CASES:
 * - Multiplayer games, Collaborative docs (Figma), Real-time Chat (WhatsApp Web).
 *
 * ```javascript
 * const socket = new WebSocket('wss://chat.example.com');
 *
 * socket.onopen = () => {
 *   socket.send(JSON.stringify({ type: 'login', user: 'Sidd' }));
 * };
 *
 * socket.onmessage = (event) => {
 *   console.log('Message from server:', event.data);
 * };
 * ```
 *
 * DRAWBACKS:
 * - No built-in reconnection logic (you must write it yourself or use Socket.io).
 * - Difficult to load balance (requires sticky sessions / Redis pub-sub).
 */


// ========================================================================
// 4. WEBRTC (WEB REAL-TIME COMMUNICATION)
// ========================================================================

/**
 * PEER-TO-PEER (BROWSER TO BROWSER):
 * - Uses UDP (faster, unreliable) or TCP for lowest latency possible (< 50ms).
 * - Primary use case: Video/Audio calls (Google Meet, Zoom Web), P2P File Sharing.
 * - Data flows directly between users, NOT through your backend server (massive bandwidth savings).
 *
 * THE SIGNALING SERVER PROBLEM:
 * - Browsers cannot magically find each other's IP addresses.
 * - You STILL need a WebSockets backend (Signaling Server) just to exchange IP addresses
 *   (ICE Candidates) and Session Descriptions (SDP) to start the call.
 * - Once connected, the WebRTC P2P stream begins, and the Signaling server steps out of the data path.
 *
 * STUN AND TURN SERVERS:
 * - Browsers are behind NAT/Routers.
 * - STUN Server: A public server the browser asks "What is my public IP address?".
 * - TURN Server: If strict firewalls block P2P entirely, the TURN server acts as a relay
 *   (which costs bandwidth/money).
 */

console.log('✅ Advanced Networking (WebRTC, WS, SSE) module parsed successfully.');
