/**
 * ## Quick revision
 *
 * - Component — props se UI return karne wala function.
 * - JSX — JS mein UI syntax; expressions `{}` ke andar.
 * - Props — parent se input; child mutate nahi karta.
 * - Children — nested content ko composition ke liye pass karo.
 * - Render — pure calculation; network/DOM side effects render mein mat chalao.
 * - Capital name — custom component `<Card />`; lowercase tag native element.
 * - Fragment — extra DOM wrapper bina elements group karo.
 * - Key — siblings ki stable identity; array position se bachna jab list badalti ho.
 * - Event prop — handler pass karo: `onClick={save}`; `save()` render ke time call hota hai.
 * - JSX attributes — className aur htmlFor use; inline style JS object hota hai.
 * - Key prop — React identity ke liye; child ko ID chahiye toh separate prop do.
 */

'use strict';


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


function FragmentExample() {
    return (
        <>
            <h1>Title</h1>
            <p>Description</p>
        </>
    );
}


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
