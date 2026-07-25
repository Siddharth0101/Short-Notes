'use strict';

/**
 * ========================================================================
 * STATE MANAGEMENT - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - State kahan rakhna hai, kaise manage karna hai — ye React ka core design step hai.
 *
 * LIFTING STATE UP FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                       COMMON PARENT                         │
 * │                   const [items, setItems]                   │
 * │                     ┌─────────┴─────────┐                   │
 * │        State (props)│                   │Callback (handler) │
 * │                     ▼                   ▼                   │
 * │               <DisplayList>       <AddItemForm>             │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. THINKING ABOUT STATE
 * ========================================================================
 * NOTES:
 * - STATE = data jo time ke saath change hota hai aur UI ko drive karta hai.
 *
 * STATE PLACEMENT DECISION TREE:
 * 1. Sirf ek component use karta hai? -> LOCAL STATE (useState in that component).
 * 2. Sibling components share karte hain? -> LIFT STATE UP (parent me rakho).
 * 3. Deeply nested components? -> CONTEXT API ya REDUX.
 * 4. Server data? -> React Query / SWR (server state).
 *
 * TYPES OF STATE:
 * - LOCAL STATE: ek component ke andar. useState / useReducer.
 * - GLOBAL STATE: puri app ya kaafi components share karte hain. Context / Redux.
 * - SERVER STATE: API se aaya data. React Query best hai.
 * - URL STATE: search params, path params. React Router.
 */


/**
 * ========================================================================
 * 2. WHEN AND WHERE TO CREATE STATE
 * ========================================================================
 * NOTES:
 * - NEED state? Ask:
 *   - Kya ye data time ke saath change hoga?
 *   - Kya ye UI ko affect karta hai?
 *   - Kya ye existing state ya props se derive ho sakta hai? (toh state mat banao!)
 *
 * - WHERE to place state? Ask:
 *   - Sirf ye component use karega? -> yahi rakho.
 *   - Child ko chahiye? -> parent me rakho, prop se pass karo.
 *   - Multiple unrelated components? -> lift to common parent ya context.
 *
 * DERIVED STATE:
 * - State se calculate ho sake -> naya state MAT banao.
 * - Example: cart items hai state, total = items.reduce() -> derived, state nahi.
 */

function PackingList() {
    const [items, setItems] = useState([
        { id: 1, description: 'Passport', packed: false },
        { id: 2, description: 'Charger', packed: true },
        { id: 3, description: 'Sunglasses', packed: false },
    ]);

    // DERIVED STATE (no separate useState needed):
    const numPacked = items.filter(item => item.packed).length;
    const percentage = Math.round((numPacked / items.length) * 100);

    return (
        <div>
            <p>{numPacked}/{items.length} items packed ({percentage}%)</p>
        </div>
    );
}


/**
 * ========================================================================
 * 3. LIFTING STATE UP
 * ========================================================================
 * NOTES:
 * - Problem: sibling components ko same data chahiye.
 * - Solution: state unke COMMON PARENT me rakho.
 * - Parent -> child: data via PROPS.
 * - Child -> parent: event via CALLBACK FUNCTION (handler prop).
 *
 * PATTERN:
 * 1. State parent me create karo.
 * 2. State value child ko prop se bhejo.
 * 3. State setter (handler function) child ko prop se bhejo.
 * 4. Child handler call kare -> parent state update -> sab children re-render.
 */

function ParentApp() {
    const [items, setItems] = useState([]);

    function handleAddItem(newItem) {
        setItems(prev => [...prev, newItem]); // immutable update
    }

    function handleDeleteItem(id) {
        setItems(prev => prev.filter(item => item.id !== id));
    }

    function handleToggleItem(id) {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, packed: !item.packed } : item
            )
        );
    }

    return (
        <div>
            {/* State setter passed down as callback */}
            <AddItemForm onAddItem={handleAddItem} />
            <ItemsList
                items={items}
                onDeleteItem={handleDeleteItem}
                onToggleItem={handleToggleItem}
            />
            <Stats items={items} />
        </div>
    );
}

// Child: calls parent's callback to update state:
function AddItemForm({ onAddItem }) {
    const [description, setDescription] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!description) return;

        const newItem = { id: Date.now(), description, packed: false };
        onAddItem(newItem); // call parent's handler
        setDescription('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={description} onChange={e => setDescription(e.target.value)} />
            <button>Add</button>
        </form>
    );
}

function ItemsList({ items, onDeleteItem, onToggleItem }) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>
                    <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => onToggleItem(item.id)}
                    />
                    <span>{item.description}</span>
                    <button onClick={() => onDeleteItem(item.id)}>❌</button>
                </li>
            ))}
        </ul>
    );
}

function Stats({ items }) {
    if (!items.length) return <p>Start adding items!</p>;

    const numPacked = items.filter(i => i.packed).length;
    return <p>{numPacked}/{items.length} packed</p>;
}


/**
 * ========================================================================
 * 4. IMMUTABLE STATE UPDATES
 * ========================================================================
 * NOTES:
 * ┌─────────────────┬───────────────────────────────┬───────────────────────────┐
 * │ Operation       │ ❌ MUTABLE (DO NOT DO)        │ ✅ IMMUTABLE (DO THIS)    │
 * ├─────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ Add element     │ arr.push(item)                │ [...arr, item]            │
 * │ Remove element  │ arr.splice(index, 1)          │ arr.filter(i => i.id!==id)│
 * │ Update element  │ arr[index].value = 10         │ arr.map(i => i.id===id?...)│
 * │ Update object   │ obj.name = 'New'              │ { ...obj, name: 'New' }   │
 * └─────────────────┴───────────────────────────────┴───────────────────────────┘
 */

// ❌ WRONG (mutation):
// items.push(newItem);
// setItems(items); // same reference -> React ignores!

// ✅ CORRECT (new array):
// setItems(prev => [...prev, newItem]);

// ❌ WRONG (object mutation):
// user.name = 'Jonas';
// setUser(user); // same reference!

// ✅ CORRECT (new object):
// setUser(prev => ({ ...prev, name: 'Jonas' }));


/**
 * ========================================================================
 * 5. CHILDREN PROP
 * ========================================================================
 * NOTES:
 * - children = special prop. Component ke opening and closing tags ke beech
 *   jo bhi likho wo children prop ke through milta hai.
 * - Component composition ke liye essential.
 * - Reusable wrappers (cards, modals, layouts) banane ke liye use hota hai.
 */

function Button({ children, onClick, bgColor = '#7950f2' }) {
    return (
        <button style={{ backgroundColor: bgColor }} onClick={onClick}>
            {children}
        </button>
    );
}

// Usage:
function Example() {
    return (
        <div>
            <Button onClick={() => console.log('prev')}>
                <span>👈</span> Previous
            </Button>
            <Button bgColor="#ff6348" onClick={() => console.log('next')}>
                Next <span>👉</span>
            </Button>
        </div>
    );
}


/**
 * ========================================================================
 * 6. COMPONENT SPLITTING GUIDELINES
 * ========================================================================
 * NOTES:
 * - Component bahut bada hai? Split karo.
 * - Ek component ek kaam kare (Single Responsibility).
 * - Reusable hona chahiye? Alag component banao.
 * - State logic alag, UI logic alag.
 *
 * WHEN TO SPLIT:
 * - Component file 100+ lines ho rahi hai.
 * - Multiple unrelated state pieces hain.
 * - Different parts independently re-render hone chahiye.
 * - JSX me clearly separate sections dikh rahe hain.
 *
 * NAMING:
 * - Descriptive naam: SearchBar, MovieList, StarRating (not Component1, Div2).
 * - Props interface clean rakho: bahut zyada props = component split karo.
 */
