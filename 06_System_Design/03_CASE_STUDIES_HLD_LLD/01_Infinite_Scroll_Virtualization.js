/**
 * ## Quick revision
 *
 * - Infinite scroll — next page fetch; virtualization — visible rows hi render.
 * - Fixed row window — start=floor(scrollTop/rowHeight); viewport count=ceil(height/rowHeight).
 * - Overscan — viewport ke aas-paas extra rows; flicker/memory tradeoff.
 * - Spacer — total height preserve; rendered window ko correct offset.
 * - Variable rows — measured heights/prefix offsets; fixed-height formula enough nahi.
 * - Cursor — stable ordered boundary; duplicate pages/items dedupe.
 * - Sentinel — IntersectionObserver se next fetch; in-flight guard aur end state.
 * - Accessibility — focus, keyboard aur loaded-content announcements preserve.
 * - Scroll anchor — data prepend/row resize par same visible item position maintain.
 * - Fetch dedupe — sentinel repeated trigger kare toh same cursor ka duplicate request guard.
 * - End marker — hasMore false par observer/fetch stop; empty page loop avoid.
 */

'use strict';


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
