/**
 * ## Quick revision
 *
 * - Profiler — pehle slow render/interaction measure karo.
 * - `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
 * - `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
 * - `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
 * - Lazy loading — route/component code zaroorat par load karo.
 * - Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
 * - Transition — non-urgent update mark; computation magically cheap nahi hoti.
 * - Virtualization — visible list window render; stable identity/accessibility preserve karo.
 * - Production — bundle, errors, accessibility aur real-user performance verify karo.
 * - Deferred value — expensive result ko lagging value se render; network requests automatically debounce nahi hoti.
 * - Bundle split — very tiny chunks bhi request overhead badha sakte hain; loading behavior measure karo.
 * - Render purity — memoization hataane par bhi component logically correct rehna chahiye.
 */

'use strict';


// import { memo } from 'react';
//
// const MovieList = memo(function MovieList({ movies, onSelect }) {
//     console.log('MovieList rendered'); // check when it renders
//     return (
//         <ul>
//             {movies.map(m => (
//                 <li key={m.id} onClick={() => onSelect(m.id)}>{m.title}</li>
//             ))}
//         </ul>
//     );
// });


// import { lazy, Suspense } from 'react';
//
// // Lazy load pages:
// const Homepage = lazy(() => import('./pages/Homepage'));
// const Product = lazy(() => import('./pages/Product'));
// const Pricing = lazy(() => import('./pages/Pricing'));
// const AppLayout = lazy(() => import('./pages/AppLayout'));
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Suspense fallback={<SpinnerFullPage />}>
//                 <Routes>
//                     <Route index element={<Homepage />} />
//                     <Route path="product" element={<Product />} />
//                     <Route path="pricing" element={<Pricing />} />
//                     <Route path="app" element={<AppLayout />} />
//                 </Routes>
//             </Suspense>
//         </BrowserRouter>
//     );
// }
