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
 * - Optimistic message — temp ID se show; ack par reconcile, failure par retry.
 * - Typing — throttled temporary signal; expiry se stale indicator hatao.
 * - History — prepend par scroll anchor preserve; new message auto-scroll only when appropriate.
 * - Delivery state — sent/persisted/delivered/read ka clear meaning.
 * - Unread cursor — last-read position server record se; temporary view count alone reliable nahi.
 * - Offline send — queued message ID retry par same; duplicate optimistic bubbles reconcile.
 * - Edit/delete event — referenced message unloaded ho toh later history fetch mein consistent state mile.
 */

'use strict';


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
