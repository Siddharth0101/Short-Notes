# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Start with simple slots

```jsx
function StudyPanel({ title, actions, children }) {
  return (
    <section className="study-panel">
      <header className="study-panel__header">
        <h2>{title}</h2>
        <div>{actions}</div>
      </header>
      <div className="study-panel__body">{children}</div>
    </section>
  );
}

export default function Example() {
  return (
    <StudyPanel title="React revision"
      actions={<a href="#practice">Practice questions</a>}>
      <p>Start with state ownership, then effects.</p>
    </StudyPanel>
  );
}
```

## Advanced patterns

```jsx
const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button role="tab" aria-selected={active === value}
      tabIndex={active === value ? 0 : -1}
      onClick={() => setActive(value)}>
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { active } = useContext(TabsContext);
  return active === value ? <div role="tabpanel">{children}</div> : null;
}
```

```jsx
function DataList({ items, renderItem, renderEmpty }) {
  if (items.length === 0) return renderEmpty ? renderEmpty() : <p>No items.</p>;
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

// Usage
<DataList
  items={topics}
  renderItem={topic => <span>{topic.title} · {topic.minutes} min</span>}
  renderEmpty={() => <p>No topics match this filter.</p>}
/>
```

## Forwarding refs and DOM props

```jsx
const TextField = forwardRef(function TextField({ label, ...inputProps }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} {...inputProps} />
    </label>
  );
});

// Parent
const inputRef = useRef(null);
<TextField label="Search" ref={inputRef} />;
// inputRef.current.focus() ab actual <input> DOM node par kaam karega
```
