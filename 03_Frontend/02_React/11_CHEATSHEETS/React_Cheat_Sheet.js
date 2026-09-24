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
 * - `useState` — component ki memory; setter next render schedule karta hai.
 * - Snapshot — handler current render ki state dekhta hai.
 * - Functional update — old state se calculate ho toh `setN(n => n + 1)`.
 * - Batching — multiple updates saath process ho sakti hain; turant state variable change nahi hota.
 * - Object state — mutate mat karo; changed nesting tak nayi copies banao.
 * - Controlled input — `value` + `onChange`; checkbox mein `checked`.
 * - Derived state — existing props/state se calculate ho toh duplicate state mat rakho.
 * - Lift state — shared data nearest common parent mein rakho.
 * - Form — submit par validate; pending/error/success states clear rakho.
 * - `useEffect` — external system ke saath sync; render calculation ke liye nahi.
 * - Dependencies — effect mein used reactive values list karo; linter ko ignore mat karo.
 * - Cleanup — next setup se pehle aur unmount par old listener/timer/connection hatao.
 * - `[]` — changing reactive dependency nahi; development checks setup repeat kar sakte hain.
 * - `useRef` — renders ke beech mutable value; update se rerender nahi hota.
 * - Stale closure — old render ki values capture; dependencies/updater se solve karo.
 * - Fetch race — abort + latest-result guard se old response ignore karo.
 * - Custom Hook — stateful logic reuse; har call ka state separate hota hai.
 * - `useLayoutEffect` — paint se pehle layout work; blocking ka cost dhyaan rakho.
 * - Local state — sirf component use kare toh paas rakho.
 * - Context — tree mein value share; changed value consumers rerender kara sakti hai.
 * - `useReducer` — action se next state; reducer pure rakho.
 * - Context split — unrelated fast-changing values alag providers mein rakho.
 * - Redux — predictable shared store; actions se state transitions.
 * - Redux Toolkit — reducers mein draft mutation syntax Immer handle karta hai.
 * - Selector — needed slice padho; unstable return references extra renders kara sakte hain.
 * - Server state — fetching/cache tool ko do; store mein duplicate copy se bacho.
 * - Profiler — pehle slow render/interaction measure karo.
 * - `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
 * - `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
 * - `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
 * - Lazy loading — route/component code zaroorat par load karo.
 * - Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
 * - Transition — non-urgent update mark; computation magically cheap nahi hoti.
 * - Virtualization — visible list window render; stable identity/accessibility preserve karo.
 * - Production — bundle, errors, accessibility aur real-user performance verify karo.
 * - Event prop — handler pass karo: `onClick={save}`; `save()` render ke time call hota hai.
 * - JSX attributes — className aur htmlFor use; inline style JS object hota hai.
 * - Key prop — React identity ke liye; child ko ID chahiye toh separate prop do.
 */

'use strict';


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
