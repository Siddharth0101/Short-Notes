'use strict';

/**
 * ========================================================================
 * 03. CLASS COMPONENTS & LIFECYCLE METHOD EXECUTION ORDER [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 8)
 *
 * WHY LEARN CLASS COMPONENTS IN 2026?
 * - Legacy enterprise codebases (Airbnb, Facebook, Netflix) still have class components.
 * - Error Boundaries STILL require class components (componentDidCatch, getDerivedStateFromError).
 * - Deeply tests your mental model of the React Render vs Commit lifecycle.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   CLASS COMPONENT LIFECYCLE DIAGRAM                 │
 * │                                                                     │
 * │  [MOUNTING PHASE]                                                   │
 * │  1. Constructor(props)        (State init, super(props))            │
 * │  2. static getDerivedStateFromProps(props, state)                   │
 * │  3. Render()                  (Returns JSX virtual DOM)             │
 * │  4. React updates Real DOM and Refs                                 │
 * │  5. ComponentDidMount()       (API calls, subscriptions, timers)    │
 * │                                                                     │
 * │  [UPDATING PHASE]                                                   │
 * │  1. static getDerivedStateFromProps                                 │
 * │  2. shouldComponentUpdate(nextProps, nextState) (Performance gate) │
 * │  3. Render()                                                        │
 * │  4. getSnapshotBeforeUpdate(prevProps, prevState) (Scroll positions)│
 * │  5. React updates Real DOM                                          │
 * │  6. ComponentDidUpdate(prevProps, prevState, snapshot)              │
 * │                                                                     │
 * │  [UNMOUNTING PHASE]                                                 │
 * │  1. ComponentWillUnmount()    (Clear intervals, cancel fetch, a11y) │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. THE CLASS LIFECYCLE EXECUTION TRAP (INTERVIEW FAVORITE!)
 * ========================================================================
 * SCENARIO: Parent component with two child components: Child A and Child B.
 * What is the EXACT console log order during mounting?
 *
 * TRAP: Many developers answer:
 * Parent Constr -> Parent Render -> Child A Constr -> Child A Render -> Child A DidMount -> Child B... (WRONG!)
 *
 * ACTUAL ORDER:
 * 1. Parent Constructor
 * 2. Parent Render
 * 3. Child A Constructor
 * 4. Child A Render
 * 5. Child B Constructor
 * 6. Child B Render
 * <--- RENDER PHASE ENDS (Batched) --->
 * <--- COMMIT PHASE BEGINS (Real DOM Updates) --->
 * 7. Child A ComponentDidMount
 * 8. Child B ComponentDidMount
 * 9. Parent ComponentDidMount
 *
 * WHY?
 * React optimizes the Render phase by batching virtual DOM creation for all children
 * before triggering the expensive Real DOM commit phase and firing componentDidMount!
 */

// Simulation of Parent-Child Lifecycle Execution
class LifecycleLogger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    this.logs.push(message);
    console.log(message);
  }

  simulateMount() {
    this.log('1. Parent Constructor');
    this.log('2. Parent Render');
    this.log('3.   Child A Constructor');
    this.log('4.   Child A Render');
    this.log('5.   Child B Constructor');
    this.log('6.   Child B Render');
    this.log('--- [React DOM Commit & Ref Update Phase] ---');
    this.log('7.   Child A ComponentDidMount (API call fired)');
    this.log('8.   Child B ComponentDidMount (API call fired)');
    this.log('9. Parent ComponentDidMount');
  }
}

const logger = new LifecycleLogger();
console.log('--- Lifecycle Simulation Output ---');
logger.simulateMount();

/**
 * ========================================================================
 * 2. WHY SUPER(PROPS)?
 * ========================================================================
 * - In ES6 class syntax: `class UserClass extends React.Component`
 * - You cannot use `this` before calling `super()`.
 * - Passing `props` to `super(props)` initializes `this.props` inside the constructor.
 *   If you just called `super()`, `this.props` would be `undefined` inside the constructor
 *   (though React assigns it outside the constructor anyway).
 *
 * ========================================================================
 * 3. COMPONENTWILLUNMOUNT & MEMORY LEAK PREVENTION
 * ========================================================================
 * - If you set `setInterval()` inside componentDidMount:
 *   - When navigating to another route, the component unmounts from DOM.
 *   - BUT the JS timer remains running in the background browser memory!
 *   - It continues logging and referencing stale state, causing massive memory leaks!
 * - In Class: Clear timer inside `componentWillUnmount()`.
 * - In Hooks: Clear timer inside the return cleanup function of `useEffect()`.
 */

// Memory Leak vs Cleanup demonstration
function simulateTimerCleanup() {
  let timerId = null;
  let ticks = 0;

  function mountComponent() {
    console.log('Component Mounted: Starting interval timer');
    timerId = setInterval(() => {
      ticks++;
      if (ticks <= 3) {
        console.log(`Tick count: ${ticks}`);
      }
    }, 100);
  }

  function unmountComponent() {
    console.log('Component Unmounting: Cleaning up interval timer');
    clearInterval(timerId);
    console.log('Cleaned up successfully. No memory leaks!');
  }

  mountComponent();
  setTimeout(unmountComponent, 350);
}

simulateTimerCleanup();
