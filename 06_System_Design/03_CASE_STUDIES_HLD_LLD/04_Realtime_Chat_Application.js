'use strict';

/**
 * ========================================================================
 * CASE STUDY 04: REALTIME CHAT APPLICATION (WHATSAPP / SLACK) [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * REQUIREMENTS:
 * - Real-time 1:1 and Group chats.
 * - Message lifecycle: Pending ──► Sent ──► Delivered ──► Read.
 * - Optimistic UI updates (message appears immediately before server ACK).
 * - Offline message store (IndexedDB).
 * - Typing indicators with throttling.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   MESSAGE LIFECYCLE & OPTIMISTIC UI                 │
 * │                                                                     │
 * │  [User hits Send] ──► Inject temporary optimistic message (Pending) │
 * │         │                                                           │
 * │         ├── WebSocket Connected?                                    │
 * │         │    ├── YES ──► Emit `chat:send` ──► Receive ACK (Sent)    │
 * │         │    └── NO  ──► Push to IndexedDB Outbox Queue             │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. OPTIMISTIC UI PATTERN
 * ========================================================================
 * - Generate a temporary client-side ID: `temp-178901923-xyz`.
 * - Immediately insert message into React state with status `PENDING` (clock icon).
 * - Once WebSocket receives server ACK with permanent database ID:
 *   Replace temp ID with permanent ID and update status to `SENT` (single tick).
 * - If request fails or times out: Mark status as `FAILED` (red exclamation with Retry button).
 */

// Simulated Optimistic Message Dispatcher
class ChatStateStore {
  constructor() {
    this.messages = [];
  }

  sendOptimisticMessage(text, recipientId) {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const optimisticMsg = {
      id: tempId,
      text,
      recipientId,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    this.messages.push(optimisticMsg);
    console.log('[Optimistic UI] Added message to screen immediately:', optimisticMsg);
    return tempId;
  }

  handleServerAck(tempId, permanentId) {
    const msg = this.messages.find((m) => m.id === tempId);
    if (msg) {
      msg.id = permanentId;
      msg.status = 'SENT';
      console.log(`[Server ACK Received] Replaced ${tempId} with permanent ID ${permanentId}. Status: SENT`);
    }
  }
}

const chatStore = new ChatStateStore();
console.log('--- Chat Optimistic Update Simulation ---');
const tempMsgId = chatStore.sendOptimisticMessage('Hey Sidd, system design notes ready?', 'user_42');

setTimeout(() => {
  chatStore.handleServerAck(tempMsgId, 'msg_db_998124');
}, 50);

/**
 * ========================================================================
 * 2. TYPING INDICATOR PROTOCOL (THROTTLING)
 * ========================================================================
 * - DO NOT emit WebSocket event on every keystroke!
 * - Throttle `typing:start` event to once every 3 seconds.
 * - If user stops typing for 2 seconds, send `typing:stop`.
 *
 * 3. INVERTED SCROLL FOR CHAT HISTORY:
 * - Default list starts pinned at the BOTTOM.
 * - Scrolling UP loads older messages.
 * - Preserving scroll position:
 *   `previousScrollHeight = element.scrollHeight;`
 *   Prepend 50 older messages to state;
 *   `element.scrollTop = element.scrollHeight - previousScrollHeight;`
 *   (Prevents the list from jumping to the very top!)
 */
