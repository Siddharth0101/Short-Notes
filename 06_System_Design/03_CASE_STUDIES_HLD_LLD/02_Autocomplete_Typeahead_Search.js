'use strict';

/**
 * ========================================================================
 * CASE STUDY 02: AUTOCOMPLETE / TYPEAHEAD SEARCH [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * REQUIREMENTS:
 * - User types query into input. Suggestions appear in dropdown within 100ms.
 * - Minimum network requests (do not fire request on every keystroke).
 * - Avoid race conditions (stale response overwriting fresh response).
 * - Client-side caching (LRU Cache).
 * - Full Keyboard accessibility (ArrowUp/ArrowDown/Enter/Escape).
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   TYPEAHEAD SEARCH ARCHITECTURE                     │
 * │                                                                     │
 * │  [Keypress] ──► [Debounce 300ms] ──► [Check LRU Cache]              │
 * │                                            │                        │
 * │                                    Cache Hit?                       │
 * │                                     ├── YES ──► Display Suggestions │
 * │                                     └── NO  ──► Abort Previous Req  │
 * │                                                  │                  │
 * │                                                  ▼                  │
 * │                                             [Fetch API]             │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. DEBOUNCING VS THROTTLING
 * ========================================================================
 * - Debounce: Wait for a pause in user activity before firing function.
 *   - Perfect for search input, auto-save drafts, window resize.
 * - Throttle: Guarantee function executes at most once every X milliseconds.
 *   - Perfect for scroll listeners, mousemove, infinite scroll sentinels.
 */

// Production Debounce with cancellation
function debounce(fn, delayMs) {
  let timerId = null;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}

/**
 * ========================================================================
 * 2. RACE CONDITIONS & ABORTCONTROLLER
 * ========================================================================
 * SCENARIO:
 * - User types 're' ──► Request 1 fired (takes 400ms due to network jitter).
 * - User types 'react' ──► Request 2 fired (takes 100ms).
 * - Request 2 returns first and renders suggestions for 'react'.
 * - Request 1 returns 300ms LATER and overwrites UI with stale 're' suggestions! (BUG!)
 *
 * FIX: AbortController!
 * Whenever a new fetch is initiated, call `previousController.abort()`.
 */

// LRU Cache implementation for Client-side search caching
class LRUCache {
  constructor(capacity = 5) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    // Refresh position to most recently used
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const searchCache = new LRUCache(3);
searchCache.put('r', ['react', 'redux', 'ruby']);
searchCache.put('re', ['react', 'redux']);
searchCache.put('rea', ['react', 'react native']);

console.log('--- LRU Search Cache Demonstration ---');
console.log('Cache hit for "re":', searchCache.get('re'));

// Eviction test
searchCache.put('react', ['react 19']);
searchCache.put('react hooks', ['use', 'useEffect']); // Causes eviction of oldest ('r')
console.log('Cache lookup for evicted "r":', searchCache.get('r')); // null
