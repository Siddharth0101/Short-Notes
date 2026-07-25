'use strict';

/**
 * ========================================================================
 * REACT CHEAT SHEET & QUICK REFERENCE [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - A quick reference guide for essential React hooks, patterns, rules, and best practices.
 */


/**
 * ========================================================================
 * 1. HOOKS SUMMARY
 * ========================================================================
 * ┌──────────────────┬─────────────────────────────────────────────────┐
 * │ Hook             │ Primary Use Case                                │
 * ├──────────────────┼─────────────────────────────────────────────────┤
 * │ useState         │ Local state management                          │
 * │ useEffect        │ Side effects (fetching, DOM, subscriptions)     │
 * │ useContext       │ Consume data from React Context                 │
 * │ useReducer       │ Complex state logic & state machines            │
 * │ useRef           │ DOM node reference or non-rendering mutable var │
 * │ useMemo          │ Memoize calculated values                       │
 * │ useCallback      │ Memoize function references                     │
 * │ useNavigate      │ Programmatic routing (React Router)             │
 * │ useParams        │ URL path parameters                             │
 * │ useSearchParams  │ URL query parameters                            │
 * └──────────────────┴─────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 2. COMPONENT TEMPLATE
 * ========================================================================
 */

// import { useState, useEffect } from 'react';

function SampleComponent({ title = 'Default Title', onAction }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('Mounted or count updated:', count);
        return () => console.log('Cleanup before re-run or unmount');
    }, [count]);

    return (
        <div className="card">
            <h2>{title}</h2>
            <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>
            <button onClick={onAction}>Trigger Parent Action</button>
        </div>
    );
}


/**
 * ========================================================================
 * 3. COMMON PATTERNS & ANTI-PATTERNS
 * ========================================================================
 * ┌───────────────────────────────────┬───────────────────────────────────┐
 * │ ❌ DO NOT DO                      │ ✅ DO THIS                        │
 * ├───────────────────────────────────┼───────────────────────────────────┤
 * │ Direct state mutation             │ Immutable updates (spread, map)   │
 * │ Index as key in dynamic lists     │ Unique stable IDs as key          │
 * │ Calling hooks inside loops/ifs    │ Call hooks at top level only      │
 * │ Overusing useEffect for derived   │ Derive state during render        │
 * │ Prop drilling through 5+ levels   │ Context API or Component composition│
 * └───────────────────────────────────┴───────────────────────────────────┘
 */
