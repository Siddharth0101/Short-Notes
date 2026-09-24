/**
 * ## Quick revision
 *
 * - Composition — small components ko `children`/props se jodo.
 * - Container — data/control sambhalo; presentational component UI dikhaye.
 * - Compound components — related parts shared contract/state ke saath kaam karein.
 * - Controlled API — parent state own kare; uncontrolled API — component own kare.
 * - CSS Modules — class names scoped; global styles ka accidental clash kam.
 * - Tailwind — utility classes se style; repeated pattern ko readable rakho.
 * - Styled components — component ke saath styles; runtime/build tradeoff dekho.
 * - Accessibility — reusable component mein label, keyboard aur focus contract rakho.
 * - Render prop — function prop se caller ko rendering customize karne do.
 * - Prop spreading — internal/private props blindly DOM par forward mat karo.
 * - Component boundary — reusable API small rakho; har styling detail ko configuration prop mat banao.
 */

'use strict';


// ❌ PROP DRILLING approach:
// function App() {
//     const [movies, setMovies] = useState([]);
//     return <Sidebar movies={movies} />; // movies drills through
// }
// function Sidebar({ movies }) {
//     return <MovieList movies={movies} />; // unnecessary pass
// }
// function MovieList({ movies }) {
//     return movies.map(m => <Movie key={m.id} movie={m} />);
// }

// ✅ COMPOSITION approach:
function App2() {
    const [movies, setMovies] = useState([]);

    return (
        <Sidebar>
            <MovieList movies={movies} />
        </Sidebar>
    );
}

function Sidebar({ children }) {
    return <div className="sidebar">{children}</div>;
    // Sidebar ko movies ke baare me pata hi nahi — just renders children
}

function MovieList({ movies }) {
    return movies.map(m => <div key={m.id}>{m.title}</div>);
}


function StarRating({ maxRating = 5, color = '#fcc419', size = 48, onSetRating }) {
    const [rating, setRating] = useState(0);
    const [tempRating, setTempRating] = useState(0);

    function handleRating(rate) {
        setRating(rate);
        onSetRating?.(rate); // optional callback to parent
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex' }}>
                {Array.from({ length: maxRating }, (_, i) => (
                    <span
                        key={i}
                        style={{ cursor: 'pointer', fontSize: `${size}px`, color }}
                        onClick={() => handleRating(i + 1)}
                        onMouseEnter={() => setTempRating(i + 1)}
                        onMouseLeave={() => setTempRating(0)}
                    >
                        {(tempRating || rating) >= i + 1 ? '★' : '☆'}
                    </span>
                ))}
            </div>
            <p style={{ fontSize: `${size / 1.5}px`, color }}>
                {tempRating || rating || ''}
            </p>
        </div>
    );
}

// Usage:
// <StarRating maxRating={10} color="red" onSetRating={setMovieRating} />


// import PropTypes from 'prop-types';
//
// StarRating.propTypes = {
//     maxRating: PropTypes.number,
//     color: PropTypes.string,
//     size: PropTypes.number,
//     onSetRating: PropTypes.func,
// };


// import { createContext, useContext } from 'react';

// const CounterContext = createContext();
//
// function Counter({ children }) {
//     const [count, setCount] = useState(0);
//     const increase = () => setCount(c => c + 1);
//     const decrease = () => setCount(c => c - 1);
//
//     return (
//         <CounterContext.Provider value={{ count, increase, decrease }}>
//             <div>{children}</div>
//         </CounterContext.Provider>
//     );
// }
//
// function Count() {
//     const { count } = useContext(CounterContext);
//     return <span>{count}</span>;
// }
//
// function Increase() {
//     const { increase } = useContext(CounterContext);
//     return <button onClick={increase}>+</button>;
// }
//
// function Decrease() {
//     const { decrease } = useContext(CounterContext);
//     return <button onClick={decrease}>-</button>;
// }
//
// // Attach sub-components:
// Counter.Count = Count;
// Counter.Increase = Increase;
// Counter.Decrease = Decrease;
//
// // Usage (flexible layout!):
// function App() {
//     return (
//         <Counter>
//             <Counter.Decrease />
//             <Counter.Count />
//             <Counter.Increase />
//         </Counter>
//     );
// }


// function List({ items, render }) {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//
//     return (
//         <div>
//             <button onClick={() => setIsCollapsed(c => !c)}>
//                 {isCollapsed ? 'Show' : 'Hide'}
//             </button>
//             {!isCollapsed && (
//                 <ul>{items.map((item, i) => render(item, i))}</ul>
//             )}
//         </div>
//     );
// }
//
// // Usage — caller decides how to render each item:
// <List
//     items={['Apple', 'Banana', 'Cherry']}
//     render={(item, i) => <li key={i}>{item.toUpperCase()}</li>}
// />


// function withToggle(WrappedComponent) {
//     return function EnhancedComponent(props) {
//         const [isOpen, setIsOpen] = useState(false);
//         return (
//             <WrappedComponent
//                 {...props}
//                 isOpen={isOpen}
//                 toggle={() => setIsOpen(o => !o)}
//             />
//         );
//     };
// }
//
// function ProductList({ isOpen, toggle }) {
//     return (
//         <div>
//             <button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</button>
//             {isOpen && <ul><li>Product 1</li><li>Product 2</li></ul>}
//         </div>
//     );
// }
//
// const ProductListWithToggle = withToggle(ProductList);
