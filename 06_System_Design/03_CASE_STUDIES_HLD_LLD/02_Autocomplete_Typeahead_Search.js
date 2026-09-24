/**
 * ## Quick revision
 *
 * - Frontend round — requirements → components/state → data flow → performance → failures.
 * - API contract — request shape, pagination, errors aur cancellation clear karo.
 * - Search — debounce + request identity + empty/loading/error states.
 * - State — URL shareable data; local transient interaction; server cache remote data.
 * - Performance — measure likely bottleneck; list/image/network budget do.
 * - Accessibility — keyboard/focus behavior design ka part hai.
 * - Tradeoff — choice ke saath rejected alternative ka concrete cost bolo.
 * - Debounce — typing rukne par fetch; query/request ID se old response ignore.
 * - Abort — obsolete request cancel; latest-result guard phir bhi rakho.
 * - Combobox — arrow navigation, Enter select, Escape close aur labeled list.
 * - Cache — normalized query + auth scope; bounded size/freshness.
 * - Empty/error — blank query, no result aur failure ke separate states.
 * - Composition input — IME typing ke intermediate text par premature search/selection avoid.
 * - Active option — result change ho toh highlighted index clamp/reset.
 * - Submit race — Enter press par currently intended option/query use; stale result ko select mat karo.
 */

'use strict';


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
