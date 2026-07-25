'use strict';

/**
 * ========================================================================
 * REACT FUNDAMENTALS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - React ek JavaScript library hai UI build karne ke liye.
 *
 * REACT RENDER & DATA FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                                                             │
 * │   State / Props Change ──→ Virtual DOM Re-render            │
 * │                                    │                        │
 * │                                    ▼                        │
 * │   Real DOM Update   ◄── Diffing Algorithm (Reconciliation)  │
 * │   (Only changed nodes)                                      │
 * │                                                             │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. WHY REACT?
 * ========================================================================
 * NOTES:
 * - Vanilla JS me complex UIs me DOM manually sync karna painful hai.
 * - React automatically UI ko STATE ke saath sync rakhta hai.
 * - Component = UI piece + uska logic + uska data.
 *
 * REACT VS OTHERS:
 * - React: library. Sirf UI. Routing/state management bahar se lagao.
 * - Angular: full framework. Sab built-in. Opinionated.
 * - Vue: middle ground. Progressive framework.
 *
 * REACT ECOSYSTEM:
 * - Routing: React Router.
 * - State: Context API, Redux, Zustand.
 * - Forms: React Hook Form.
 * - Styling: CSS Modules, styled-components, Tailwind.
 * - Full-stack: Next.js, Remix.
 */


/**
 * ========================================================================
 * 2. COMPONENTS
 * ========================================================================
 * NOTES:
 * - Component = JavaScript function jo JSX return karta hai.
 * - Name MUST start with uppercase: Pizza, Header, App.
 * - Ek component = ek independent UI piece with its own data, logic, appearance.
 * - Components ko nest karte hain (tree structure).
 * - Component re-usable hai: same component different data ke saath.
 *
 * TYPES:
 * - Function components (modern, hooks use karte hain).
 * - Class components (legacy, lifecycle methods use karte hain).
 * - Jonas course me sirf function components use hote hain.
 */

function Pizza() {
    return (
        <div>
            <h2>Pizza Margherita</h2>
            <p>Tomato, mozzarella, basil</p>
        </div>
    );
}

// Nesting:
function App() {
    return (
        <div>
            <h1>Fast React Pizza Co.</h1>
            <Pizza />
            <Pizza />
        </div>
    );
}


/**
 * ========================================================================
 * 3. JSX
 * ========================================================================
 * NOTES:
 * - JSX = JavaScript XML. HTML-like syntax in JS files.
 * - JSX is NOT HTML. It compiles to React.createElement() calls.
 * - JSX me JavaScript expressions likh sakte ho {} ke andar.
 * - Statements (if, for, switch) JSX me directly NAHI likh sakte.
 *
 * JSX RULES:
 * - Sirf EK root element return karna hai (ya <> Fragment).
 * - class -> className.
 * - for -> htmlFor.
 * - Inline styles = object: style={{ color: 'red', fontSize: '20px' }}.
 * - Camelcase for attributes: onClick, onChange, tabIndex.
 * - Self-closing tags zaroori: <img />, <br />, <input />.
 * - Har cheez close honi chahiye.
 */

function Header() {
    const companyName = 'Fast React Pizza Co.';
    const hour = new Date().getHours();
    const isOpen = hour >= 10 && hour <= 22;

    return (
        <header className="header">
            <h1 style={{ color: 'red', fontSize: '48px' }}>
                {companyName}
            </h1>
            <p>{isOpen ? 'We are open!' : 'Sorry, we are closed.'}</p>
        </header>
    );
}


/**
 * ========================================================================
 * 4. PROPS VS STATE
 * ========================================================================
 * NOTES:
 * ┌───────────────────────────┬─────────────────────────────────┐
 * │  PROPS                    │  STATE                          │
 * ├───────────────────────────┼─────────────────────────────────┤
 * │  Passed from parent       │  Created inside component       │
 * │  Read-Only (immutable)    │  Can be updated (setter)        │
 * │  Component configuration  │  Component memory               │
 * │  Triggers re-render       │  Triggers re-render on change   │
 * └───────────────────────────┴─────────────────────────────────┘
 *
 * ONE-WAY DATA FLOW:
 * - Data sirf parent se child jaata hai (top-down).
 * - Child parent ko data bhejne ke liye callback function use karta hai (event up).
 */

// Parent passes data:
function Menu() {
    const pizzaData = { name: 'Focaccia', price: 6, photo: 'pizzas/focaccia.jpg' };

    return (
        <div>
            <PizzaItem
                name={pizzaData.name}
                price={pizzaData.price}
                photoName={pizzaData.photo}
                soldOut={false}
            />
        </div>
    );
}

// Child receives props:
function PizzaItem({ name, price, photoName, soldOut }) {
    return (
        <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
            <img src={photoName} alt={name} />
            <div>
                <h3>{name}</h3>
                <p>{soldOut ? 'SOLD OUT' : `₹${price}`}</p>
            </div>
        </li>
    );
}


/**
 * ========================================================================
 * 5. STATE
 * ========================================================================
 * NOTES:
 * - State = data jo component ke andar store hota hai aur TIME KE SAATH CHANGE hota hai.
 * - State change = React component ko RE-RENDER karta hai.
 * - State React ka most important concept hai.
 *
 * useState RULES:
 * - const [value, setValue] = useState(initialValue);
 * - setValue se state update hota hai aur re-render trigger hota hai.
 * - State update ASYNCHRONOUS hai (batched).
 * - State directly mutate NAHI karna: arr.push() ❌, setArr([...arr, new]) ✅.
 * - Hooks (useState, etc.) sirf top level pe call karo, conditionals/loops me nahi.
 *
 * STALE STATE:
 * - Agar new state purani state pe depend kare, toh callback form use karo:
 *   setCount(prev => prev + 1) ✅
 *   setCount(count + 1)        ⚠️ (stale ho sakta hai batching me)
 */

// import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);

    function handleIncrement() {
        setCount(prev => prev + step); // callback form: safe from stale state
    }

    function handleDecrement() {
        setCount(prev => prev - step);
    }

    return (
        <div>
            <button onClick={handleDecrement}>-</button>
            <span>{count}</span>
            <button onClick={handleIncrement}>+</button>
            <input
                type="range"
                min="1"
                max="10"
                value={step}
                onChange={e => setStep(Number(e.target.value))}
            />
        </div>
    );
}


/**
 * ========================================================================
 * 6. EVENTS
 * ========================================================================
 * NOTES:
 * - React me events camelCase hain: onClick, onChange, onSubmit.
 * - Handler function pass karo, CALL mat karo:
 *   onClick={handleClick} ✅
 *   onClick={handleClick()} ❌ (ye immediately call ho jayega!)
 *
 * - Inline handler: onClick={() => setCount(count + 1)}
 * - Event object automatically milta hai: onClick={(e) => { ... }}
 * - Form submit: onSubmit handler me e.preventDefault() lagao.
 */

function Form() {
    const [description, setDescription] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!description) return;
        console.log(`Item: ${description}`);
        setDescription(''); // reset form
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Item..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button>Add</button>
        </form>
    );
}


/**
 * ========================================================================
 * 7. CONDITIONAL RENDERING
 * ========================================================================
 * NOTES:
 * - JSX me if-else nahi chal sakta (statement hai). Alternatives:
 *   1. && operator: condition && <Component />
 *   2. Ternary: condition ? <A /> : <B />
 *   3. Early return: if (!data) return <p>No data</p>;
 *   4. Element variable: JSX ko variable me store karo.
 *
 * && TRAP:
 * - 0 && <Component /> -> renders "0" on screen! (0 is falsy but renderable)
 * - Fix: (count > 0) && <Component />  ya  !!count && <Component />
 */

function Footer() {
    const hour = new Date().getHours();
    const isOpen = hour >= 10 && hour <= 22;

    // Early return:
    if (!isOpen) return <p>We are closed. Come back at 10:00.</p>;

    // Ternary:
    return (
        <footer>
            {isOpen ? (
                <p>We are currently open!</p>
            ) : (
                <p>Sorry, we are closed.</p>
            )}
        </footer>
    );
}


/**
 * ========================================================================
 * 8. RENDERING LISTS
 * ========================================================================
 * NOTES:
 * - Array.map() se list render karo.
 * - Har list item ko UNIQUE key prop dena ZAROORI hai.
 * - Key React ko batata hai kaunsa item change hua, add hua, ya remove hua.
 *
 * KEY RULES:
 * - Key unique honi chahiye (siblings ke beech).
 * - Key stable honi chahiye: index as key AVOID karo (reorder pe issues).
 * - Database ID best key hai.
 * - Key prop component ke andar accessible nahi hoti.
 */

const pizzaDataArr = [
    { name: 'Focaccia', price: 6, soldOut: false },
    { name: 'Pizza Margherita', price: 10, soldOut: false },
    { name: 'Pizza Capricciosa', price: 14, soldOut: true },
];

function MenuList() {
    return (
        <ul className="menu">
            {pizzaDataArr.map(pizza => (
                <PizzaItem
                    key={pizza.name}
                    name={pizza.name}
                    price={pizza.price}
                    soldOut={pizza.soldOut}
                />
            ))}
        </ul>
    );
}


/**
 * ========================================================================
 * 9. FRAGMENTS
 * ========================================================================
 * NOTES:
 * - JSX me sirf ek root element return ho sakta hai.
 * - Extra <div> nahi add karna -> React.Fragment use karo.
 * - Short syntax: <> ... </>
 * - Agar key chahiye Fragment pe toh: <React.Fragment key={id}> ... </React.Fragment>
 */

function FragmentExample() {
    return (
        <>
            <h1>Title</h1>
            <p>Description</p>
        </>
    );
}


/**
 * ========================================================================
 * 10. COMPONENT TREE AND DATA FLOW
 * ========================================================================
 * NOTES:
 * - React app = component tree. App root pe, baaki sab nest hote hain.
 * - DATA FLOWS DOWN: parent -> child via props (one-way).
 * - EVENTS FLOW UP: child -> parent via callback functions.
 * - Re-render: state change -> component + ALL its children re-render.
 *
 * IMPORTANT:
 * - React re-render ≠ DOM update. React diff karta hai (reconciliation).
 * - Sirf changed parts DOM me update hote hain (efficient).
 *
 * RENDER vs COMMIT:
 * 1. TRIGGER: state update ya initial render.
 * 2. RENDER: React components call karta hai, virtual DOM banata hai.
 * 3. COMMIT: changed parts real DOM me apply (ReactDOM ka kaam).
 * 4. BROWSER PAINT: screen pe dikhata hai.
 */


/**
 * ========================================================================
 * 11. CONTROLLED ELEMENTS
 * ========================================================================
 * NOTES:
 * - By default form elements apna state DOM me rakhte hain.
 * - Controlled element: React state ko single source of truth banao.
 * - value prop + onChange handler = controlled.
 *
 * PATTERN:
 * 1. State create karo for each input.
 * 2. value={state} set karo.
 * 3. onChange={e => setState(e.target.value)} lagao.
 */

function ControlledForm() {
    const [name, setName] = useState('');
    const [age, setAge] = useState(18);

    return (
        <form>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <select value={age} onChange={e => setAge(Number(e.target.value))}>
                <option value={18}>18</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
            </select>
            <p>{name} is {age} years old.</p>
        </form>
    );
}
