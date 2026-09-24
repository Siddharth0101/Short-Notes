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
 * - DOM/SVG — semantic elements/objects; Canvas/WebGL — dense custom graphics, accessibility extra work.
 * - Presence cursor — ephemeral; interpolation smooth movement, durable document data se alag.
 * - Coordinate — viewport zoom/scroll ke saath shared document space conversion.
 * - Conflict — operation identity + OT/CRDT/server-order contract; plain last-write can lose edits.
 * - Operation base — edit kis document version par bani, protocol track kare.
 * - Cursor separation — presence updates ko durable edit log ke same reliability cost par mat bhejo.
 * - Reconnect merge — offline edits aur latest snapshot ka supported merge/conflict path.
 */

'use strict';


// LERP (Linear Interpolation) simulation for smooth cursor smoothing
function lerp(start, end, alpha = 0.2) {
  return start + (end - start) * alpha;
}

let renderedX = 0;
const targetX = 100;

console.log('--- Smooth Remote Cursor LERP Simulation ---');
console.log('Initial rendered X:', renderedX);
for (let frame = 1; frame <= 5; frame++) {
  renderedX = lerp(renderedX, targetX, 0.35);
  console.log(`Frame ${frame} smoothed cursor X: ${renderedX.toFixed(2)}px`);
}
