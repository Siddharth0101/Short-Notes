/**
 * ## Quick revision
 *
 * - Local state — sirf component use kare toh paas rakho.
 * - Context — tree mein value share; changed value consumers rerender kara sakti hai.
 * - `useReducer` — action se next state; reducer pure rakho.
 * - Context split — unrelated fast-changing values alag providers mein rakho.
 * - Redux — predictable shared store; actions se state transitions.
 * - Redux Toolkit — reducers mein draft mutation syntax Immer handle karta hai.
 * - Selector — needed slice padho; unstable return references extra renders kara sakte hain.
 * - Server state — fetching/cache tool ko do; store mein duplicate copy se bacho.
 * - Reducer action — event ka meaning express karo, jaise itemAdded; reducer ke andar network call nahi.
 * - Normalized store — entities ID se rakho; repeated nested copies ka update cost kam.
 * - Dispatch/context — value objects ki identity stable rakhna unnecessary notifications kam kar sakta hai.
 */

'use strict';


// Simulated Redux Store & Reducer Architecture
class SimpleStore {
  constructor(rootReducer) {
    this.reducer = rootReducer;
    this.state = this.reducer(undefined, { type: '@@INIT' });
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach((listener) => listener());
    return action;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

// Cart reducer simulation
function cartReducer(state = { items: [], totalCount: 0 }, action) {
  switch (action.type) {
    case 'cart/addItem':
      return {
        ...state,
        items: [...state.items, action.payload],
        totalCount: state.totalCount + 1
      };
    case 'cart/clearCart':
      return {
        ...state,
        items: [],
        totalCount: 0
      };
    default:
      return state;
  }
}

const store = new SimpleStore(cartReducer);

store.subscribe(() => {
  console.log('[Store Update Notification] Current State:', store.getState());
});

console.log('--- Redux State Management Simulation ---');
store.dispatch({ type: 'cart/addItem', payload: { id: 101, name: 'Paneer Butter Masala', price: 320 } });
store.dispatch({ type: 'cart/addItem', payload: { id: 102, name: 'Garlic Naan', price: 60 } });
store.dispatch({ type: 'cart/clearCart' });
