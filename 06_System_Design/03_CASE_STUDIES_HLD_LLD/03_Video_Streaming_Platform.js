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
 * - HLS/DASH — video segments + manifest; bandwidth ke hisaab se bitrate switch.
 * - Buffer — startup delay vs stall risk; bounded prefetch.
 * - Seek — target segment load; obsolete fetch/work cancel.
 * - CDN — video near users; authorization aur cache policy clear.
 * - Watch analytics — actual playback intervals measure; retries dedupe.
 * - Accessibility — captions, keyboard controls aur useful loading/error UI.
 * - Startup metric — first playable frame ka time; full download time se alag.
 * - Rebuffer ratio — playback ke comparison mein stalled time; quality switch decision se relate karo.
 * - Segment identity — cache key mein content/version/rendition; wrong variant mix mat karo.
 */

'use strict';


// Simulated ABR Quality Switcher
function decideStreamQuality(estimatedBandwidthKbps) {
  const tiers = [
    { resolution: '1080p', minBandwidth: 4500 },
    { resolution: '720p', minBandwidth: 2200 },
    { resolution: '480p', minBandwidth: 900 },
    { resolution: '360p', minBandwidth: 300 }
  ];

  for (const tier of tiers) {
    if (estimatedBandwidthKbps >= tier.minBandwidth) {
      return tier.resolution;
    }
  }
  return '240p (Low data mode)';
}

console.log('--- ABR Resolution Decision Simulation ---');
console.log('High-speed Wi-Fi (6000 kbps):', decideStreamQuality(6000));
console.log('Moderate 4G (2800 kbps):', decideStreamQuality(2800));
console.log('Weak 3G (600 kbps):', decideStreamQuality(600));
