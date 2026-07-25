'use strict';

/**
 * ========================================================================
 * COMPONENTS, COMPOSITION & PATTERNS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Component design patterns jo Jonas course me cover hote hain.
 * - Composition, reusability, compound components, render props, HOC.
 */


/**
 * ========================================================================
 * 1. COMPONENT COMPOSITION
 * ========================================================================
 * NOTES:
 * - Composition = components ko combine karna using children prop.
 * - Prop drilling solve karta hai (kuch cases me).
 * - Instead of passing data through 5 levels, component ko SLOT me daalo.
 *
 * PROP DRILLING:
 * - Parent -> Child1 -> Child2 -> Child3 -> target component.
 * - Beech ke components ko woh data chahiye hi nahi, bas forward kar rahe hain.
 * - Solutions: composition, context, or state management library.
 */

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


/**
 * ========================================================================
 * 2. REUSABLE COMPONENTS
 * ========================================================================
 * NOTES:
 * - Good component: props se behavior customize ho.
 * - External state nahi rakhta (stateless/presentational) ya manageable internal state.
 * - Clear prop API (interface).
 *
 * EXAMPLE: StarRating component
 * - Reusable: koi bhi app me import karo.
 * - Configurable via props: maxRating, color, size, defaultRating, onSetRating.
 * - Internal state: hover/selected rating.
 */

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


/**
 * ========================================================================
 * 3. COMPONENT CATEGORIES
 * ========================================================================
 * NOTES:
 * - PRESENTATIONAL (Stateless): sirf props leke UI render.
 *   Zero logic. Reusable. Example: Logo, NumResults, Movie.
 *
 * - STATEFUL: internal state manage karta hai.
 *   UI + logic. Example: SearchBar (input state), MovieList (filtered data).
 *
 * - STRUCTURAL: app structure define karta hai.
 *   Layout components: Pages, App, Sidebar, Header.
 *   Usually composition use karte hain (children prop).
 *
 * NOT RIGID categories — most components are a mix.
 */


/**
 * ========================================================================
 * 4. PROP TYPES
 * ========================================================================
 * NOTES:
 * - PropTypes = runtime type checking for props (development me).
 * - package: prop-types
 * - TypeScript better alternative hai (compile-time check).
 * - But quick projects ya existing codebases me PropTypes useful hain.
 */

// import PropTypes from 'prop-types';
//
// StarRating.propTypes = {
//     maxRating: PropTypes.number,
//     color: PropTypes.string,
//     size: PropTypes.number,
//     onSetRating: PropTypes.func,
// };


/**
 * ========================================================================
 * 5. COMPOUND COMPONENT PATTERN
 * ========================================================================
 * NOTES:
 * - Related components ko ek group me rakho jo TOGETHER kaam karte hain.
 * - Parent component internal state manage karta hai.
 * - Children components parent ke state ko Context se access karte hain.
 * - API clean aur flexible rehti hai.
 *
 * REAL EXAMPLES:
 * - <Select> + <Option>
 * - <Accordion> + <AccordionItem>
 * - <Tabs> + <Tab> + <TabPanel>
 * - HTML: <table> + <thead> + <tr> + <td> (same pattern)
 */

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


/**
 * ========================================================================
 * 6. RENDER PROPS PATTERN
 * ========================================================================
 * NOTES:
 * - Component ko ek function prop pass karo jo JSX return kare.
 * - Component logic handle karta hai, rendering CALLER decide karta hai.
 * - Hooks aane se pehle ye MAIN pattern tha reusable logic ke liye.
 * - Ab custom hooks preferred hain, but legacy code me dikhega.
 */

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


/**
 * ========================================================================
 * 7. HIGHER-ORDER COMPONENT (HOC) PATTERN
 * ========================================================================
 * NOTES:
 * - HOC = function jo component leke ENHANCED component return kare.
 * - Convention: withSomething naming (withAuth, withTooltip).
 * - Ab mostly custom hooks ne replace kar diya.
 * - But libraries me abhi bhi dikhta hai: React Router's withRouter (legacy),
 *   Redux's connect (legacy).
 */

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
