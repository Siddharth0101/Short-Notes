'use strict';

/**
 * ========================================================================
 * 02. RECONCILIATION, REACT FIBER & HOOKS INTERNALS [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 5 to 7)
 *
 * THE CORE PROBLEM REACT SOLVED:
 * - Direct DOM manipulation (document.getElementById, innerHTML) is SLOW
 *   and causes frequent browser reflows and repaints.
 * - React uses Virtual DOM + Reconciliation to find the MINIMUM mutations
 *   needed and batches DOM updates.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   REACT RECONCILIATION LIFECYCLE                    │
 * │                                                                     │
 * │   [State / Prop Change]                                             │
 * │            │                                                        │
 * │            ▼                                                        │
 * │   1. RENDER PHASE (Virtual DOM Diffing)                             │
 * │      - Builds workInProgress Fiber tree                             │
 * │      - Compares with current Fiber tree (diffing)                   │
 * │      - Pure, no DOM mutations, interruptible in React 18 Concurrent  │
 * │            │                                                        │
 * │            ▼                                                        │
 * │   2. COMMIT PHASE (Real DOM Mutation)                               │
 * │      - Synchronously applies patches to real Browser DOM            │
 * │      - Cannot be interrupted                                        │
 * │      - Runs useLayoutEffect -> DOM Update -> useEffect              │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. REACT FIBER ARCHITECTURE (REACT 16+)
 * ========================================================================
 * - Prior to React 16, the reconciler was "Stack Reconciler" (recursive,
 *   blocking the main thread until the entire tree finished rendering).
 * - React Fiber rewrote the reconciler as a linked-list work-loop.
 * - Fiber Node Structure:
 *   - child: pointer to first child
 *   - sibling: pointer to next sibling
 *   - return: pointer to parent Fiber node
 *   - memoizedState: singly-linked list of hooks for this component!
 *   - alternate: pointer to current/workInProgress counterpart (Double Buffering)
 *
 * DOUBLE BUFFERING IN FIBER:
 * - React maintains two trees:
 *   1. 'current' tree: currently rendered on screen
 *   2. 'workInProgress' tree: being computed in memory during render phase
 * - Once render phase completes, React simply swaps pointers! (Fast!)
 */

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

/**
 * ========================================================================
 * 2. THE DIFFING ALGORITHM & WHY KEYS MATTER (O(n) HEURISTIC)
 * ========================================================================
 * - General tree diffing is O(n^3). React achieves O(n) using 2 assumptions:
 *   1. Elements of different types produce completely different trees.
 *      <div><Counter /></div> -> <span><Counter /></span> destroys Counter!
 *   2. Keys identify which children are stable across re-renders.
 *
 * ⚠️ WHY NOT USE INDEX AS KEY?
 * - If items are filtered, sorted, prepended, or deleted:
 *   - Item 0 becomes Item 1, but its key was 0!
 *   - React thinks the existing component just received new props,
 *     leading to state corruption, input focus bugs, and unnecessary re-renders.
 * - BEST PRACTICE: Always use unique, stable IDs from database (e.g. res.id).
 * - NEVER use Math.random() as key! (Generates new key every render, destroying component).
 */

/**
 * ========================================================================
 * 3. HOOKS UNDER THE HOOD — WHY RULES OF HOOKS EXIST
 * ========================================================================
 * Rule 1: Only call hooks at the TOP level (never in if/for/nested functions).
 * Rule 2: Only call hooks from React function components or custom hooks.
 *
 * WHY?
 * React does NOT know hooks by name. React tracks hooks using an INTERNAL
 * SINGLY-LINKED LIST stored on the Fiber's memoizedState!
 *
 * Render 1:
 *   Hook 1: useState(0)      ──► Hook Node A { memoizedState: 0, next: B }
 *   Hook 2: useEffect(fn)    ──► Hook Node B { memoizedState: fn, next: C }
 *   Hook 3: useState('John') ──► Hook Node C { memoizedState: 'John', next: null }
 *
 * Render 2 (if you put Hook 1 inside `if (condition)` and it skipped):
 *   Hook 2 would read Hook Node A's memory! State gets completely shifted & corrupted!
 */

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

/**
 * ========================================================================
 * 4. USEEFFECT & SHIMMER UI PATTERN
 * ========================================================================
 * - Never block page rendering while fetching data from APIs.
 * - Pattern: Render Page Skeleton (Shimmer UI) ──► Fetch API ──► Re-render with Data.
 *
 * Dependency Array Rules:
 * - No dependency array: useEffect runs on initial mount + EVERY re-render.
 * - Empty array []: runs ONLY ONCE after initial render.
 * - [stateVar]: runs on mount + whenever stateVar changes (Object.is comparison).
 * - Cleanup function (return () => { ... }):
 *   - Runs when component unmounts.
 *   - Runs BEFORE re-running the effect on dependency change (cancelling stale timers/fetch).
 */
