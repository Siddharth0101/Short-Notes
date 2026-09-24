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
 * - Mount — constructor → render → componentDidMount; children commit before parent didMount.
 * - Update — render ke baad componentDidUpdate; repeated state update se loop avoid.
 * - Unmount — componentWillUnmount mein owned listeners/timers cleanup.
 * - `super(props)` — constructor mein props ko parent tak pass karo.
 * - Update guard — componentDidUpdate mein setState condition ke bina infinite update loop ho sakta hai.
 * - Derived data — props se calculate ho toh extra duplicated class state avoid.
 * - Snapshot lifecycle — DOM mutation se pehle measurement aur after-update adjustment ka ownership clear.
 */

'use strict';


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
