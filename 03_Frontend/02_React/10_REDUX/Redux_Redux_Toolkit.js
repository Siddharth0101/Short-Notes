'use strict';

/**
 * ========================================================================
 * REDUX & REDUX TOOLKIT - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Redux = global state management library based on Flux architecture.
 * - Single source of truth (store), read-only state, changes via pure functions (reducers).
 * - Redux Toolkit (RTK) = modern, opinionated, batteries-included standard way to write Redux.
 *
 * REDUX FLOW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                                                                 │
 * │  ┌──────────────┐     dispatch(action)     ┌─────────────────┐  │
 * │  │  UI Component│ ───────────────────────> │ Reducer Function│  │
 * │  └──────▲───────┘                          └────────┬────────┘  │
 * │         │                                           │           │
 * │         │ useSelector                               │ new state │
 * │         │                                           ▼           │
 * │  ┌──────┴───────────────────────────────────────────┴──────┐   │
 * │  │                   REDUX STORE                           │   │
 * │  └─────────────────────────────────────────────────────────┘   │
 * │                                                                 │
 * └─────────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. CLASSIC REDUX VS REDUX TOOLKIT (RTK)
 * ========================================================================
 * NOTES:
 * ┌─────────────────────────────┬─────────────────────────────────┐
 * │ Classic Redux (Legacy)      │ Redux Toolkit (Modern RTK)      │
 * ├─────────────────────────────┼─────────────────────────────────┤
 * │ Boilerplate heavy           │ Minimal boilerplate             │
 * │ Manual action creators      │ Auto-generated actions          │
 * │ Manual immutable updates    │ Immer built-in (mutable syntax) │
 * │ Manual thunk setup          │ createAsyncThunk built-in       │
 * │ Complex store configuration │ configureStore auto setup       │
 * └─────────────────────────────┴─────────────────────────────────┘
 */


/**
 * ========================================================================
 * 2. REDUX TOOLKIT: CREATING A SLICE
 * ========================================================================
 * NOTES:
 * - Slice = state + reducers + actions for a single feature.
 * - createSlice automatically generates action creators and action types.
 * - Mutating syntax (state.value++) is allowed inside createSlice because of Immer!
 */

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     balance: 0,
//     loan: 0,
//     loanReason: '',
//     isLoading: false,
// };
//
// const accountSlice = createSlice({
//     name: 'account',
//     initialState,
//     reducers: {
//         deposit(state, action) {
//             state.balance += action.payload; // Immer allows direct mutation syntax!
//             state.isLoading = false;
//         },
//         withdraw(state, action) {
//             state.balance -= action.payload;
//         },
//         requestLoan: {
//             prepare(amount, reason) {
//                 return { payload: { amount, reason } };
//             },
//             reducer(state, action) {
//                 if (state.loan > 0) return;
//                 state.loan = action.payload.amount;
//                 state.loanReason = action.payload.reason;
//                 state.balance += action.payload.amount;
//             },
//         },
//         payLoan(state) {
//             state.balance -= state.loan;
//             state.loan = 0;
//             state.loanReason = '';
//         },
//         convertingCurrency(state) {
//             state.isLoading = true;
//         },
//     },
// });
//
// export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
// export default accountSlice.reducer;


/**
 * ========================================================================
 * 3. CONFIGURING THE STORE
 * ========================================================================
 * NOTES:
 * - configureStore combines reducers and sets up DevTools & Middleware automatically.
 */

// import { configureStore } from '@reduxjs/toolkit';
// import accountReducer from './accountSlice';
// import userReducer from './userSlice';
//
// const store = configureStore({
//     reducer: {
//         account: accountReducer,
//         user: userReducer,
//     },
// });
//
// export default store;


/**
 * ========================================================================
 * 4. CONNECTING TO REACT (Provider, useSelector, useDispatch)
 * ========================================================================
 * NOTES:
 * - Provider wraps the App.
 * - useSelector reads state.
 * - useDispatch triggers actions.
 */

// import { Provider, useSelector, useDispatch } from 'react-redux';
// import store from './store';
// import { deposit, withdraw } from './accountSlice';

// App entry:
// <Provider store={store}><App /></Provider>

// Inside Component:
// function AccountOperations() {
//     const dispatch = useDispatch();
//     const { balance, loan, isLoading } = useSelector(store => store.account);
//
//     function handleDeposit() {
//         dispatch(deposit(100));
//     }
//     return <div>Balance: {balance}</div>;
// }


/**
 * ========================================================================
 * 5. ASYNC THUNKS (createAsyncThunk)
 * ========================================================================
 * NOTES:
 * - Async logic (API calls) inside Redux requires Thunks.
 * - createAsyncThunk generates pending, fulfilled, rejected action types.
 */

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//
// export const fetchCustomer = createAsyncThunk(
//     'customer/fetchCustomer',
//     async function (id) {
//         const res = await fetch(`https://api.example.com/customers/${id}`);
//         const data = await res.json();
//         return data;
//     }
// );
//
// const customerSlice = createSlice({
//     name: 'customer',
//     initialState: { data: null, status: 'idle', error: null },
//     extraReducers: builder => {
//         builder
//             .addCase(fetchCustomer.pending, state => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchCustomer.fulfilled, (state, action) => {
//                 state.status = 'idle';
//                 state.data = action.payload;
//             })
//             .addCase(fetchCustomer.rejected, (state, action) => {
//                 state.status = 'error';
//                 state.error = action.error.message;
//             });
//     },
// });


/**
 * ========================================================================
 * 6. REDUX VS CONTEXT API VS ZUSTAND / REACT QUERY
 * ========================================================================
 * NOTES:
 * ┌─────────────────────┬──────────────────┬──────────────────┬──────────────────┐
 * │ Feature             │ Context API      │ Redux Toolkit    │ React Query      │
 * ├─────────────────────┼──────────────────┼──────────────────┼──────────────────┤
 * │ Primary Use         │ Shared UI state  │ Complex App state│ Server Data      │
 * │ Boilerplate         │ Low              │ Medium           │ Low              │
 * │ Perf (Re-renders)   │ Re-renders all   │ Optimized (sub)  │ Cache optimized  │
 * │ DevTools            │ React DevTools   │ Redux DevTools   │ RQ DevTools      │
 * └─────────────────────┴──────────────────┴──────────────────┴──────────────────┘
 */
