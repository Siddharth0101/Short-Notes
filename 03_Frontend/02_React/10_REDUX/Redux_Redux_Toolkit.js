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
