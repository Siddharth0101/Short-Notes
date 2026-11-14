---
id: react-state-forms
title: State snapshots forms and immutable updates
track: react
order: 2
level: Foundation
minutes: 4
summary: `useState` — a component's memory; the setter schedules the next render.
tags: state, forms, immutability, batching, derived-state
visual: react-render
---

## Quick revision

> Revision target — Understand the difference between the current render's snapshot and a queued update; keep the form draft under the user's control.

- `useState` — a component's memory; the setter schedules the next render.
- Snapshot — a handler sees the state of the current render.
- Functional update — when calculating from the old state use `setN(n => n + 1)`.
- Batching — multiple updates may be processed together; the state variable does not change immediately.
- Object state — do not mutate; make new copies down to the changed nesting.
- Controlled input — `value` + `onChange`; `checked` for a checkbox.
- Derived state — if it can be calculated from existing props/state, do not keep duplicate state.
- Lift state — keep shared data in the nearest common parent.
- Form — validate on submit; keep the pending/error/success states clear.
- Lazy initializer — pass the initialization calculation with `useState(() => initialValue)`; keep the initializer pure.
- State replacement — a hook setter does not merge objects; spread the fields you need.
- Checkbox input — event.target.checked gives the boolean; value is a different property.

### React 19 form Actions

- `useActionState` — gives the action result, a dispatch and the pending status; the action receives the previous state and the payload.
- Action dispatch — dispatch inside a form action or `startTransition`, so the pending state is tracked.
- Action queue — queued actions of the same hook run in order; the previous result becomes the next action's state.
- `useOptimistic` — a temporary UI result while an Action is pending; update the actual saved state separately.
- Optimistic failure — when the Action ends the base state is shown; if the save fails, give a clear error/retry UI.

### Edge cases and reasoning

- Queued updater trace — repeated setN(n+1) from the same snapshot queues one value; functional updaters compose from the previous queued result.
- Controlled lifetime — keep a text value a string; switching from undefined to a string can cause an uncontrolled/controlled mismatch.
- Input reset — clear the draft after a successful save; preserve the learner's/user's input on a validation/network failure.

## Research notes: Represent coherent request states

- Independent loading/success booleans allow contradictory combinations.

## Understand it with an example

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  function addThree() {
    setCount((value) => value + 1);
    setCount((value) => value + 1);
    setCount((value) => value + 1);
  }
  return <button onClick={addThree}>{count}</button>;
}
```

- Setup — import `useState` from React; this is the complete component body.
- Trace — queued updaters take the previous result; on the first click the count becomes `3`.
- Catch — three `setCount(count + 1)` calls request `1` from the same handler snapshot; the setter does not mutate the existing local `count`.

## Recall and practice

- Question — With an initial n=0, what is the final result of three setN(n+1) versus three setN(v=>v+1)?
- Answer — In the same handler the first pattern gives 1, the functional pattern 3; the updater queue uses the previous result.
- Try it yourself — Build a submit form; verify a guard against a pending double submit, a preserved draft on a failed save and an explicit reset on a successful save.

## Practice questions

### Easy · State snapshot

```jsx
const [count, setCount] = useState(0);
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  console.log(count);
}
```

After one click, what is logged and what does `count` become?

<details>
<summary>Answer</summary>

- Log — `0`; the `count` snapshot of this render is fixed.
- New count — `1`; both calls queue `0 + 1`.
- Fix — `setCount((c) => c + 1)` twice → `2`; the updater queue runs on the latest value.

</details>

### Easy · Object state mutated, UI unchanged

```jsx
const [form, setForm] = useState({ name: '', email: '' });
function onName(e) {
  form.name = e.target.value;
  setForm(form);
}
```

<details>
<summary>Answer</summary>

- Problem — the same object reference; React compares with `Object.is` and may skip the update, and the mutation also changes the old snapshot.
- Fix — `setForm((prev) => ({ ...prev, name: e.target.value }))`.

</details>

### Medium · Do not turn derived state into state

```jsx
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(`${first} ${last}`), [first, last]);
```

What is wrong with this pattern?

<details>
<summary>Answer</summary>

- Problem — an extra render (first the old `fullName`, then the new one after the effect) and two sources of truth.
- Fix — calculate it in render: `const fullName = \`${first} ${last}\`.trim();`
- If it is expensive — `useMemo`, and still not state.

</details>

### Medium · The uncontrolled-to-controlled warning

```jsx
const [user, setUser] = useState({});
<input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
```

Why does the console warning appear?

<details>
<summary>Answer</summary>

- Why — in the first render `value={undefined}` → the input is uncontrolled; after typing it is a string → controlled. React warns about switching during the input's lifetime.
- Fix — an initial `{ name: '' }` or `value={user.name ?? ''}`.
- Checkbox — uses `checked` + `onChange`, not `value`.

</details>

### Hard · Optimistic like with rollback

The Like button should show the toggle immediately, roll back if the server fails and show an error. Handle the race of a fast double-click too.

<details>
<summary>Answer</summary>

```jsx
function LikeButton({ postId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function toggle() {
    const previous = liked;
    setLiked(!previous);
    setPending(true);
    setError('');
    try {
      await api.setLike(postId, !previous);
    } catch {
      setLiked(previous);
      setError('Like save nahi hua, dobara try karo.');
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <button aria-pressed={liked} disabled={pending} onClick={toggle}>Like</button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
```

- Rollback — `previous` is saved in the closure and restored on failure.
- Race — disable while `pending`; otherwise the rollback of two in-flight requests can produce a wrong state.
- React 19 — `useOptimistic` shows the optimistic value during the transition and returns to the real state when the transition ends.

</details>

## Sources — further reading

- [React — useActionState](https://react.dev/reference/react/useActionState)
- [React — useOptimistic](https://react.dev/reference/react/useOptimistic)

- [React state snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React choosing state structure](https://react.dev/learn/choosing-the-state-structure)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/02-state-forms.md)
