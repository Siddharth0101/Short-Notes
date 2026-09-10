'use strict';

/**
 * ========================================================================
 * CASE STUDY 03: VIDEO STREAMING PLATFORM (YOUTUBE / NETFLIX) [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * REQUIREMENTS:
 * - Play video smoothly across fluctuating mobile bandwidth without pauses.
 * - Custom player UI: Play/Pause, Timeline scrubber, Buffer progress, Speed, Quality.
 * - Adaptive Bitrate Streaming (ABR).
 * - Video analytics & watch time tracking via non-blocking beacons.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   ADAPTIVE STREAMING PIPELINE                       │
 * │                                                                     │
 * │   Server (CDN)             Client Player Engine       HTML5 <video> │
 * │  ┌──────────────┐         ┌─────────────────────┐    ┌────────────┐ │
 * │  │ Master .m3u8 │ ──────► │ MediaSource API     │──► │ Video Tag  │ │
 * │  │ 1080p chunks │         │ ABR Bitrate Decider │    │ Display    │ │
 * │  │ 720p chunks  │         │ SourceBuffer Queue  │    └────────────┘ │
 * │  │ 480p chunks  │         └─────────────────────┘                   │
 * │  └──────────────┘                                                   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. ADAPTIVE BITRATE STREAMING (HLS & MPEG-DASH)
 * ========================================================================
 * - Video is sliced into small 2 to 6-second `.ts` or `.m4s` chunks at different bitrates.
 * - A master manifest (`playlist.m3u8`) lists all available resolutions:
 *   - 1080p (5000 kbps)
 *   - 720p (2500 kbps)
 *   - 480p (1000 kbps)
 *   - 360p (400 kbps)
 *
 * ABR ALGORITHM (ADAPTIVE BITRATE DECIDER):
 * - Measures chunk download time: `bandwidth = chunkSize / downloadDuration`.
 * - If user network degrades: immediately request next 2-second chunk at 480p!
 * - Smooth transition without stalling or showing a loading spinner.
 */

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

/**
 * ========================================================================
 * 2. BUFFER MANAGEMENT & SCRUBBING
 * ========================================================================
 * - Buffer Window: Maintain a sliding window of ~30 seconds of buffered audio/video.
 * - Scrubbing / Hover Thumbnails:
 *   - Generate a single image sprite sheet (`sprites.jpg`) containing mini thumbnails
 *     for every 5 seconds of video.
 *   - Compute CSS `background-position` on hover to show instant preview without downloading full video!
 *
 * 3. ANALYTICS & WATCH TIME BEACONS:
 * - Never use standard `fetch()` or `xhr` on tab close/page unload (browser cancels them!).
 * - Always use `navigator.sendBeacon('/api/analytics/watch-heartbeat', payload)`.
 */
