'use strict';

/**
 * ========================================================================
 * CASE STUDY 01: INFINITE SCROLL & DOM VIRTUALIZATION [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel & Akshay Saini LLD Case Studies
 *
 * THE PROBLEM:
 * - When users scroll through 5,000 tweets, rendering 5,000 DOM nodes crashes
 *   mobile browser tabs with Out-Of-Memory (OOM) errors.
 * - Scrolling becomes janky (drops from 60 FPS to 15 FPS).
 *
 * THE SOLUTION: VIRTUALIZATION (WINDOWING):
 * - Keep only visible items (e.g. 10 items) + small buffer (3 above, 3 below) in the real DOM.
 * - Replace unmounted items with an invisible spacer div representing total scroll height.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     VIRTUAL LIST WINDOWING MECHANISM                │
 * │                                                                     │
 * │  ┌───────────────────────────────────────────┐                      │
 * │  │ Top Spacer Div (height = startIndex * 50px│                      │
 * │  ├───────────────────────────────────────────┤                      │
 * │  │ [Visible Item #10]                        │ ◄── Viewport Window  │
 * │  │ [Visible Item #11]                        │     (Only ~10 nodes  │
 * │  │ [Visible Item #12]                        │      exist in DOM!)  │
 * │  ├───────────────────────────────────────────┤                      │
 * │  │ Bottom Spacer Div (remaining scroll height│                      │
 * │  └───────────────────────────────────────────┘                      │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. MATHEMATICAL FORMULAS FOR VIRTUALIZATION
 * ========================================================================
 * Assumptions:
 * - Fixed item height = 50px
 * - Viewport container height = 400px
 * - Buffer count = 2 items
 *
 * Calculations:
 * 1. visibleCount = Math.ceil(containerHeight / itemHeight) = 400 / 50 = 8 items
 * 2. startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
 * 3. endIndex = Math.min(totalItems - 1, startIndex + visibleCount + 2 * buffer)
 * 4. offsetY = startIndex * itemHeight (Top padding / spacer)
 * 5. totalHeight = totalItems * itemHeight
 */

// Production Virtualizer calculation simulation
function calculateVirtualWindow({ totalItems, itemHeight, containerHeight, scrollTop, buffer = 2 }) {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(totalItems, startIndex + visibleCount + 2 * buffer);
  const offsetY = startIndex * itemHeight;
  const totalHeight = totalItems * itemHeight;

  return {
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    renderedCount: endIndex - startIndex
  };
}

console.log('--- Virtual List Calculations ---');
const totalItems = 10000;
const itemHeight = 60;
const containerHeight = 600;

// User scrolls to 3000px down
const windowState = calculateVirtualWindow({
  totalItems,
  itemHeight,
  containerHeight,
  scrollTop: 3000,
  buffer: 3
});

console.log('Total list height:', windowState.totalHeight, 'px');
console.log('Rendered item indices:', `${windowState.startIndex} to ${windowState.endIndex}`);
console.log('Total DOM nodes rendered:', windowState.renderedCount, '(out of 10,000 items!)');
console.log('Top Spacer Offset Y:', windowState.offsetY, 'px');

/**
 * ========================================================================
 * 2. CURSOR-BASED VS OFFSET-BASED PAGINATION
 * ========================================================================
 * ❌ OFFSET-BASED (LIMIT 20 OFFSET 40):
 *   - Bad for real-time feeds! If new tweets are posted at top while user scrolls,
 *     offset shifts, causing duplicate posts or skipped posts!
 *
 * ✅ CURSOR-BASED (LIMIT 20 BEFORE_ID=10924):
 *   - Consistent even when new items are added at head.
 *   - O(1) database index lookup on primary key / timestamp.
 */
