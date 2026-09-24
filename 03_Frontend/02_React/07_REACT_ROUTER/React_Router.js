/**
 * ## Quick revision
 *
 * - Router — URL ko screen/layout se map karta hai.
 * - Path param — resource identity; query param — filters, sort aur page.
 * - Nested route — shared layout ke andar child route render.
 * - URL state — shareable/bookmarkable state URL mein rakho.
 * - Navigation — link use karo; button action ke liye.
 * - Loader — route data fetch; error/pending handling define karo.
 * - Protected route — UI guard hai; backend authorization phir bhi chahiye.
 * - Back/forward — URL se state derive karo, duplicate local copy drift na kare.
 * - Replace navigation — current history entry replace; push nayi entry banata hai.
 * - 404 handling — unknown route aur resource-not-found ko useful fallback do.
 * - URL encoding — user values encode karo; raw text ko path/query mein concatenate mat karo.
 */

'use strict';


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route index element={<Homepage />} />
//                 <Route path="product" element={<Product />} />
//                 <Route path="pricing" element={<Pricing />} />
//                 <Route path="app" element={<AppLayout />}>
//                     {/* Nested routes */}
//                     <Route index element={<Navigate replace to="cities" />} />
//                     <Route path="cities" element={<CityList />} />
//                     <Route path="cities/:id" element={<City />} />
//                     <Route path="countries" element={<CountryList />} />
//                 </Route>
//                 <Route path="login" element={<Login />} />
//                 <Route path="*" element={<PageNotFound />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }


// import { NavLink } from 'react-router-dom';
//
// function Navbar() {
//     return (
//         <nav>
//             <NavLink to="/" className={({ isActive }) =>
//                 isActive ? 'nav-link active' : 'nav-link'
//             }>
//                 Home
//             </NavLink>
//             <NavLink to="/pricing">Pricing</NavLink>
//         </nav>
//     );
// }


// import { useParams } from 'react-router-dom';
//
// function City() {
//     const { id } = useParams();
//     // fetch city data using id...
//     return <h2>City {id}</h2>;
// }


// import { useSearchParams } from 'react-router-dom';
//
// function Map() {
//     const [searchParams, setSearchParams] = useSearchParams();
//
//     const lat = searchParams.get('lat');
//     const lng = searchParams.get('lng');
//
//     return (
//         <div>
//             <p>Position: {lat}, {lng}</p>
//             <button onClick={() => setSearchParams({ lat: 23, lng: 50 })}>
//                 Change Position
//             </button>
//         </div>
//     );
// }


// import { useNavigate, Navigate } from 'react-router-dom';
//
// function Form() {
//     const navigate = useNavigate();
//
//     function handleSubmit(e) {
//         e.preventDefault();
//         // save data...
//         navigate('/app/cities');   // go to cities page
//     }
//
//     return <form onSubmit={handleSubmit}>...</form>;
// }
//
// // Declarative redirect (inside Route):
// <Route index element={<Navigate replace to="cities" />} />


// import { Outlet } from 'react-router-dom';
//
// function AppLayout() {
//     return (
//         <div className="app">
//             <Sidebar>
//                 <Outlet />  {/* Nested route component renders here */}
//             </Sidebar>
//             <Map />
//         </div>
//     );
// }


// function ProtectedRoute({ children }) {
//     const { isAuthenticated } = useAuth(); // custom hook / context
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (!isAuthenticated) navigate('/login');
//     }, [isAuthenticated, navigate]);
//
//     return isAuthenticated ? children : null;
// }
//
// // Usage in routes:
// <Route path="app" element={
//     <ProtectedRoute>
//         <AppLayout />
//     </ProtectedRoute>
// }>
