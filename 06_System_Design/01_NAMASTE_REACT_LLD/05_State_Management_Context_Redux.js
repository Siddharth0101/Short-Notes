'use strict';

/**
 * ========================================================================
 * 05. STATE MANAGEMENT: CONTEXT API VS REDUX TOOLKIT (RTK) [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 12)
 *
 * THE EVOLUTION OF STATE:
 * - Local Component State: useState (confined to single component)
 * - Shared Sibling State: Lifting State Up
 * - Prop Drilling: Passing props 4-6 levels down (BAD architecture)
 * - Global Application State: Context API vs Redux Toolkit (RTK)
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     REDUX TOOLKIT (RTK) DATA FLOW                   │
 * │                                                                     │
 * │   [UI Component] ──(Dispatches Action)──► [Reducer Function]        │
 * │         ▲                                         │                 │
 * │         │                                         ▼                 │
 * │   (useSelector Subscribes)                [Updates Store]           │
 * │   Only re-renders on slice change!        (Handled by Immer)        │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. CONTEXT API VS REDUX TOOLKIT — ARCHITECTURAL TRADE-OFFS
 * ========================================================================
 *
 * ┌──────────────────────┬────────────────────────┬─────────────────────┐
 * │ Feature              │ Context API            │ Redux Toolkit (RTK) │
 * ├──────────────────────┼────────────────────────┼─────────────────────┤
 * │ Setup Complexity     │ Zero dependencies      │ Requires @reduxjs/..│
 * │ Update Frequency     │ Low (Theme, Auth, i18n)│ High (Cart, Stocks) │
 * │ Re-render Granularity│ Re-renders all subtree │ Selector-level diff │
 * │ DevTools & Tracing   │ Basic                  │ Time-travel debugging│
 * │ Middleware Support   │ Limited (useEffect)    │ RTK Query, Thunks   │
 * └──────────────────────┴────────────────────────┴─────────────────────┘
 */

/**
 * ========================================================================
 * 2. REDUX TOOLKIT ARCHITECTURE UNDER THE HOOD
 * ========================================================================
 * Step 1: Create Store using `configureStore({ reducer: { cart: cartReducer } })`
 * Step 2: Provide Store using `<Provider store={appStore}><App /></Provider>`
 * Step 3: Create Slice using `createSlice({ name, initialState, reducers })`
 * Step 4: Dispatch Action using `dispatch(addItem('Burger'))`
 * Step 5: Read State using `const cartItems = useSelector(store => store.cart.items)`
 *
 * ⚡ CRITICAL INTERVIEW INSIGHT: IMMER IN RTK
 * - In vanilla Redux, you MUST NEVER mutate state directly:
 *   return { ...state, items: [...state.items, action.payload] }
 * - In Redux Toolkit, we write:
 *   state.items.push(action.payload);
 * - HOW DOES THIS WORK?
 *   RTK uses Immer.js under the hood. Immer creates a Proxy "draft state".
 *   You mutate the draft, and Immer automatically produces a new immutable state object!
 */

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
