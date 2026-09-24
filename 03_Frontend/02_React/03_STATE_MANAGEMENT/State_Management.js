/**
 * ## Quick revision
 *
 * - `useState` — component ki memory; setter next render schedule karta hai.
 * - Snapshot — handler current render ki state dekhta hai.
 * - Functional update — old state se calculate ho toh `setN(n => n + 1)`.
 * - Batching — multiple updates saath process ho sakti hain; turant state variable change nahi hota.
 * - Object state — mutate mat karo; changed nesting tak nayi copies banao.
 * - Controlled input — `value` + `onChange`; checkbox mein `checked`.
 * - Derived state — existing props/state se calculate ho toh duplicate state mat rakho.
 * - Lift state — shared data nearest common parent mein rakho.
 * - Form — submit par validate; pending/error/success states clear rakho.
 * - Lazy initializer — `useState(() => initialValue)` se initialization calculation pass karo; initializer pure rakho.
 * - State replacement — hook setter object ko merge nahi karta; needed fields spread karo.
 * - Checkbox input — event.target.checked boolean deta hai; value alag property hai.
 */

'use strict';


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
