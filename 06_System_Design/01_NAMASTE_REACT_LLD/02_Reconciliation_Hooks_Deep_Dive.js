/**
 * ## Quick revision
 *
 * - Render — next UI calculate; commit — DOM updates apply.
 * - Reconciliation — type, position aur key se identity match hoti hai.
 * - Stable key — item ID use karo; random key har render remount kar sakti hai.
 * - State reset — component type/key badalne se local state reset ho sakti hai.
 * - Conditional UI — `0 && <Item />` zero dikha sakta hai.
 * - Strict Mode — development mein extra checks; render/effect ko safe rakho.
 * - Class lifecycle — mount/update/unmount; Hooks mein responsibilities ke hisaab se socho.
 * - Error boundary — descendant render errors ke fallback; har async/event error nahi pakadti.
 * - Nested component definition — parent render ke andar component type define karna state reset kara sakta hai.
 * - Same-value update — React Object.is comparison se redundant state update skip kar sakta hai.
 * - Portal — DOM location badalti hai; context aur React event propagation parent tree follow karte hain.
 */

'use strict';


// Simulated Fiber node representation
class FiberNode {
  constructor(tag, type) {
    this.tag = tag;
    this.type = type;
    this.child = null;
    this.sibling = null;
    this.return = null;
    this.memoizedProps = null;
    this.memoizedState = null; // head of Hooks linked list
    this.alternate = null;     // double buffering pointer
  }
}

const rootFiber = new FiberNode('HostRoot', 'div');
const childFiber = new FiberNode('FunctionComponent', 'RestaurantList');
rootFiber.child = childFiber;
childFiber.return = rootFiber;

console.log('--- Fiber Linked List Structure ---');
console.log('Root tag:', rootFiber.tag, 'Child type:', rootFiber.child.type);


// Simulated Hook Linked List
class HookNode {
  constructor(initialState) {
    this.memoizedState = initialState;
    this.next = null;
  }
}

function simulateComponentHooks() {
  let hookListHead = new HookNode('Initial Search Term');
  let secondHook = new HookNode(['Pizza Hut', 'Dominos', 'KFC']);
  hookListHead.next = secondHook;

  console.log('--- Hook Linked List Traversal ---');
  let current = hookListHead;
  let idx = 1;
  while (current) {
    console.log(`Hook #${idx} memoizedState:`, current.memoizedState);
    current = current.next;
    idx++;
  }
}

simulateComponentHooks();
