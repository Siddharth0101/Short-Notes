'use strict';

/**
 * ========================================================================
 * SYSTEM DESIGN CASE STUDIES - HLD + LLD [⚡ VISUAL]
 * ========================================================================
 * SOURCE: Chirag Goel - Chakde System Design (YouTube)
 */


/**
 * ========================================================================
 * 1. DESIGN NETFLIX / YOUTUBE (Video Streaming)
 * ========================================================================
 *
 * ── HLD ──
 *
 * ARCHITECTURE:
 * ┌──────────────┐     ┌──────────┐     ┌────────────────┐
 * │ React Client │ ←── │   CDN    │ ←── │ Media Storage  │
 * │              │     │(videos,  │     │(S3, encoded    │
 * │ Browse UI    │     │ images)  │     │ in HLS/DASH)   │
 * │ Video Player │     └──────────┘     └────────────────┘
 * │ Search       │
 * │ Auth         │ ──REST── ┌──────────────────┐
 * └──────────────┘          │ API Gateway      │
 *                           ├──────────────────┤
 *                           │ Auth Service     │
 *                           │ Content Catalog  │
 *                           │ Search (Elastic) │
 *                           │ Recommendation   │
 *                           │ Streaming Service│
 *                           └──────────────────┘
 *
 * VIDEO STREAMING - Adaptive Bitrate (ABR):
 * - Video ek file nahi hai. Small segments me split hota hai (2-10 sec).
 * - Multiple quality levels: 4K, 1080p, 720p, 480p, 240p.
 * - Player manifest file (master.m3u8) download karta hai → quality list.
 * - Network speed ke hisaab se quality switch hota hai:
 *   Fast internet → 4K segments | Speed drops → 720p | Recovers → back to 1080p
 *
 * RENDERING: SSR for initial load (SEO + fast FCP), CSR for navigation.
 *
 *
 * ── LLD ──
 *
 * COMPONENT TREE:
 * App
 * ├── Header (Search, Profile, Notifications)
 * ├── HeroBanner (Featured content + trailer autoplay)
 * ├── ContentRow (horizontal scroll list)
 * │   └── ContentCard (thumbnail, hover preview)
 * ├── VideoPlayer (controls, quality selector, subtitles)
 * └── Footer
 *
 * STATE (Redux):
 * - authSlice: { user, isAuthenticated }
 * - contentSlice: { nowPlaying, popular, topRated, continueWatching }
 * - playerSlice: { isPlaying, currentTime, quality, volume }
 * - searchSlice: { query, results, isLoading }
 *
 * API DESIGN:
 * GET  /api/browse?profile_id=p123    → content rows
 * GET  /api/search?q=inception        → search results
 * GET  /api/content/:id               → content details + similar
 * GET  /api/stream/:id                → stream URL + subtitles + qualities
 * PUT  /api/progress                  → save watch progress
 *
 * OPTIMIZATIONS:
 * - Lazy load content rows (Intersection Observer)
 * - Virtualized lists for large catalogs (react-window)
 * - Image CDN with responsive srcset
 * - Video preloading (buffer next episode)
 * - Service Worker for offline support
 */


/**
 * ========================================================================
 * 2. DESIGN WHATSAPP WEB (Chat Application)
 * ========================================================================
 *
 * ── HLD ──
 *
 * ARCHITECTURE:
 * ┌──────────────────┐
 * │   React Client   │
 * │ ┌──────┬───────┐ │     WebSocket (persistent)
 * │ │Chat  │Message│ │ ←─────────────────────────→ ┌──────────────┐
 * │ │List  │Thread │ │                              │ WS Gateway   │
 * │ │      │       │ │                              └──────┬───────┘
 * │ │      │Input  │ │                                     │
 * │ └──────┴───────┘ │                    ┌────────────────┤
 * │  IndexedDB (local)│                   ▼                ▼
 * └──────────────────┘              Message Service   Presence Service
 *                                        │
 *                                   Message Queue (Kafka)
 *
 * REAL-TIME: WebSocket for persistent bidirectional connection.
 * OFFLINE: Messages queue locally (IndexedDB), sync when back online.
 * E2E ENCRYPTION: Web Crypto API → RSA key pairs.
 * MESSAGE DELIVERY: Sent (✓) → Delivered (✓✓) → Read (✓✓ blue)
 *
 *
 * ── LLD ──
 *
 * WEBSOCKET HOOK:
 */

function useWebSocket(url) {
    // const [socket, setSocket] = useState(null);
    // const [isConnected, setIsConnected] = useState(false);
    // const reconnectAttempts = useRef(0);

    // connect = () => {
    //     const ws = new WebSocket(url);
    //     ws.onopen = () => { setIsConnected(true); reconnectAttempts.current = 0; };
    //     ws.onmessage = (event) => handleMessage(JSON.parse(event.data));
    //     ws.onclose = () => {
    //         setIsConnected(false);
    //         // Exponential backoff reconnection
    //         const delay = Math.pow(2, reconnectAttempts.current) * 1000;
    //         setTimeout(() => { reconnectAttempts.current++; connect(); }, delay);
    //     };
    //     setSocket(ws);
    // };

    // sendMessage = (data) => {
    //     if (socket?.readyState === WebSocket.OPEN) {
    //         socket.send(JSON.stringify(data));
    //     }
    // };

    // return { sendMessage, isConnected };
}

/**
 * MESSAGE DATA MODEL:
 * {
 *   id: "msg_abc123",
 *   chatId: "chat_xyz",
 *   senderId: "user_123",
 *   type: "text",          // "text" | "image" | "video" | "audio" | "document"
 *   content: "Hello!",
 *   timestamp: 1700000000,
 *   status: "read",        // "sent" | "delivered" | "read"
 *   replyTo: null
 * }
 *
 * TYPING INDICATORS:
 * - Debounced: user types → send { type: "typing", isTyping: true }
 * - After 3s inactivity → send { type: "typing", isTyping: false }
 *
 * OFFLINE SUPPORT:
 * - IndexedDB stores messages locally.
 * - When offline, messages queue locally.
 * - When back online, sync queued messages to server.
 *
 * E2E ENCRYPTION (Web Crypto API):
 * 1. Generate RSA key pair: crypto.subtle.generateKey(...)
 * 2. Encrypt with recipient's public key: crypto.subtle.encrypt(...)
 * 3. Decrypt with your private key: crypto.subtle.decrypt(...)
 */


/**
 * ========================================================================
 * 3. DESIGN AUTOCOMPLETE / TYPEAHEAD
 * ========================================================================
 *
 * ── HLD ──
 *
 * User types → Debounce (300ms) → Check LRU cache → Miss? → API → Cache → Show
 *
 * ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
 * │ Input   │──→│ Debounce │──→│LRU Cache │──→│ API Call      │
 * │ Field   │   │ (300ms)  │   │(in-memory)│   │(AbortController)
 * └─────────┘   └──────────┘   └──────────┘   └──────────────┘
 *                                                    │
 * ┌───────────────────────────┐                      │
 * │ Dropdown Suggestions     │◄─────────────────────┘
 * │ - Highlight matched text │
 * │ - Keyboard navigation    │
 * │ - ARIA accessible        │
 * └───────────────────────────┘
 *
 * ── LLD ──
 *
 * KEY IMPLEMENTATION DETAILS:
 * - Debounce input: 300ms delay before API call
 * - LRU Cache: Map() with max 50 entries
 * - AbortController: cancel previous request (race condition fix)
 * - Keyboard: ArrowUp/Down to navigate, Enter to select, Escape to close
 * - Highlight: split text by query regex, wrap match in <strong>
 * - ARIA: role="combobox", role="listbox", role="option", aria-activedescendant
 */

function Autocomplete() {
    // const [query, setQuery] = useState('');
    // const [suggestions, setSuggestions] = useState([]);
    // const [activeIndex, setActiveIndex] = useState(-1);
    // const cache = useRef(new Map());
    // const abortRef = useRef(null);

    // Debounced search:
    // 1. If query < 2 chars → clear suggestions
    // 2. Check cache → hit? return cached
    // 3. Cancel previous request (abortRef.current?.abort())
    // 4. Fetch API → cache result → setSuggestions
    // 5. LRU: if cache > 50 entries, delete oldest

    // Keyboard: handleKeyDown switch(e.key)
    //   ArrowDown → setActiveIndex(prev => Math.min(prev+1, len-1))
    //   ArrowUp   → setActiveIndex(prev => Math.max(prev-1, 0))
    //   Enter     → selectSuggestion(suggestions[activeIndex])
    //   Escape    → setShowDropdown(false)

    // Highlight: text.split(regex).map(part => regex.test(part) ? <strong> : plain)
}


/**
 * ========================================================================
 * 4. DESIGN CONFIGURABLE / DYNAMIC UI
 * ========================================================================
 *
 * ── HLD ──
 * - Schema-driven UI: server sends JSON config → client renders components.
 * - Component registry pattern: map type → React component.
 * - Supports A/B testing: different configs for different users.
 *
 * ── LLD ──
 * CONFIG SCHEMA:
 * {
 *   "type": "form",
 *   "children": [
 *     { "type": "input", "label": "Name", "validation": "required" },
 *     { "type": "select", "label": "Country", "options": [...] },
 *     { "type": "checkbox", "label": "Agree to terms" }
 *   ]
 * }
 *
 * Component Factory: componentMap[config.type] → render that component
 * Recursive rendering for nested configs.
 * Dynamic validation based on config rules.
 */


/**
 * ========================================================================
 * 5. DESIGN CODESANDBOX / ONLINE IDE
 * ========================================================================
 *
 * ── HLD ──
 * - Monaco Editor (VS Code's editor) in browser
 * - File system simulation in memory
 * - Bundler in browser (esbuild / SWC)
 * - Preview in sandboxed iframe
 * - Real-time collaboration via WebSocket
 *
 * ── LLD ──
 * - File tree component (recursive expand/collapse)
 * - Tab management (open files, active tab)
 * - Editor state management per file
 * - Console output (capture console.log)
 * - Split pane layout (resizable panels)
 * - Collaboration: OT (Operational Transform) or CRDT for conflict resolution
 */


/**
 * ========================================================================
 * 6. DESIGN WHITEBOARD (Excalidraw / Figma)
 * ========================================================================
 *
 * ── HLD ──
 * - Canvas-based rendering (HTML5 Canvas API) — fast for 1000+ shapes
 * - Real-time collaboration: WebSocket + CRDT
 * - Export: PNG, SVG, PDF
 *
 * ── LLD ──
 * - Shape primitives: rect, circle, line, text, arrow
 * - Canvas events: mousedown → mousemove → mouseup for drawing
 * - Undo/Redo: COMMAND PATTERN
 *
 * COMMAND PATTERN (Undo/Redo):
 * class CommandHistory {
 *     undoStack = []; redoStack = [];
 *     execute(cmd) { cmd.execute(); undoStack.push(cmd); redoStack = []; }
 *     undo()       { cmd = undoStack.pop(); cmd.undo(); redoStack.push(cmd); }
 *     redo()       { cmd = redoStack.pop(); cmd.execute(); undoStack.push(cmd); }
 * }
 *
 * - Pan & Zoom (transform matrix)
 * - Selection & multi-select (bounding box check)
 * - Collaborative cursors (show other users' cursors)
 */


/**
 * ========================================================================
 * 7. DESIGN SNAKE & LADDER GAME
 * ========================================================================
 *
 * ── HLD ──
 * - Client-server for multiplayer (WebSocket)
 * - Turn management + game state sync
 *
 * ── LLD ──
 * - Board: 10x10 grid rendering
 * - Snakes/Ladders: Map data structure { 16: 6, 47: 26 } (snakes), { 2: 38 } (ladders)
 * - Dice roll: Math.ceil(Math.random() * 6)
 * - Player movement animation (CSS transition)
 * - State machine: WAITING → ROLLING → MOVING → CHECK → NEXT_TURN / WIN
 */


/**
 * ========================================================================
 * 8. DESIGN BOOKMYSHOW (Seat Selection)
 * ========================================================================
 *
 * ── LLD ── (Machine Coding Focus)
 *
 * COMPONENT TREE:
 * App
 * ├── MovieList → MovieCard
 * ├── TheaterList → ShowtimeSelector
 * ├── SeatMap
 * │   ├── SeatRow
 * │   └── Seat (available / booked / selected)
 * ├── BookingSummary
 * └── PaymentFlow
 *
 * SEAT MAP:
 * - Grid of buttons: each seat = button with status class
 * - Status: available (green), selected (blue), booked (grey/disabled)
 * - Max 10 seats per booking
 * - 10-minute hold timer on selected seats (setTimeout → clear on unmount)
 * - Real-time availability: poll every 10 seconds
 *
 * SEAT CLICK HANDLER:
 * if (seat.status === 'booked') return;
 * if (already selected) → remove from selection
 * if (selectedSeats.length >= 10) → alert max
 * else → add to selection
 */
