/**
 * ## Quick revision
 *
 * - Requirements — users, core actions, scale aur constraints pehle clear karo.
 * - Functional — system kya kare; non-functional — latency, availability, durability jaise targets.
 * - QPS — requests per second; average ke saath peak factor bhi estimate karo.
 * - Concurrency — steady state mein roughly throughput × average latency.
 * - Storage — records × size × retention; indexes/replicas ka overhead jodo.
 * - SLO — measurable user-visible target; assumptions numbers ke saath bolo.
 * - Tradeoff — choice ka benefit, cost aur failure behavior explain karo.
 * - Percentile — p99 batata hai 99% requests us latency tak; average tail ko hide karta hai.
 * - Availability math — serial required dependencies combined success probability reduce kar sakti hain.
 * - Growth estimate — present peak ke saath retention, traffic growth aur safety headroom.
 */

'use strict';


function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
