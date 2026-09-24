/**
 * ## Quick revision
 *
 * - HLD — system boundaries/data flow; LLD — components/classes aur detailed contracts.
 * - Requirements — users, features, platform, scale aur constraints clear karo.
 * - Scope — core use case pehle; optional features baad mein.
 * - Quality — latency, availability, accessibility, security aur freshness targets.
 * - Architecture — UI, state/data, BFF/API aur services ki responsibilities.
 * - Tech choice — workload aur tradeoff se justify; tool name alone answer nahi.
 * - Components — props/events, ownership, reuse, theming aur keyboard contract.
 * - State — local UI, URL, shared client aur server cache ka owner define.
 * - Data model — entities, IDs, relations aur normalization.
 * - API — input/output/error, pagination, auth, timeout aur idempotency.
 * - Protocol — REST/GraphQL/gRPC; realtime ke liye SSE/WebSocket as needed.
 * - Rendering — CSR/SSR/SSG/ISR choice SEO, freshness aur interaction se.
 * - Performance — images, JS, requests, cache aur rendering ka budget.
 * - Offline — cached shell/data, queued writes aur conflict recovery.
 * - Operations — logs/metrics/traces, safe rollout aur rollback.
 * - Internationalization — translated messages; locale se dates/currency/direction.
 * - Experiment — feature flags + success metric; permission rules unchanged.
 * - Interview — requirement → architecture → data/API → bottleneck → failure recovery.
 * - Critical path — user action se useful response tak dependent steps identify.
 * - Failure domain — ek region/service/cache fail ho toh kaunsa feature unavailable hoga.
 * - Decision trigger — scale/freshness requirement badle toh architecture kab revisit karna hai, define.
 */

'use strict';

const HLD_COMPLETE_FRAMEWORK = {
  "section1_requirements": [
    "Requirements — users, features, platform, scale aur constraints clear karo.",
    "Scope — core use case pehle; optional features baad mein.",
    "Quality — latency, availability, accessibility, security aur freshness targets."
  ],
  "section2_scoping": [
    "Scope — core use case pehle; optional features baad mein.",
    "Interview — requirement → architecture → data/API → bottleneck → failure recovery."
  ],
  "section3_techChoices": [
    "Tech choice — workload aur tradeoff se justify; tool name alone answer nahi.",
    "Protocol — REST/GraphQL/gRPC; realtime ke liye SSE/WebSocket as needed.",
    "Rendering — CSR/SSR/SSG/ISR choice SEO, freshness aur interaction se.",
    "Performance — images, JS, requests, cache aur rendering ka budget.",
    "Offline — cached shell/data, queued writes aur conflict recovery."
  ],
  "section4_componentArchitecture": [
    "Components — props/events, ownership, reuse, theming aur keyboard contract.",
    "State — local UI, URL, shared client aur server cache ka owner define.",
    "Data model — entities, IDs, relations aur normalization."
  ],
  "section5_dataApiProtocols": [
    "API — input/output/error, pagination, auth, timeout aur idempotency.",
    "Operations — logs/metrics/traces, safe rollout aur rollback.",
    "Internationalization — translated messages; locale se dates/currency/direction.",
    "Experiment — feature flags + success metric; permission rules unchanged."
  ]
};

console.log(HLD_COMPLETE_FRAMEWORK);
