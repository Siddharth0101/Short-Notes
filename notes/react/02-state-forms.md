---
id: react-state-forms
title: State snapshots forms and immutable updates
track: react
order: 2
level: Foundation
minutes: 4
summary: `useState` — component ki memory; setter next render schedule karta hai.
tags: state, forms, immutability, batching, derived-state
visual: react-render
---

## Quick revision

> Revision target — Current render ka snapshot aur queued update ka difference samjho; form draft ko user ke control mein rakho.

- `useState` — component ki memory; setter next render schedule karta hai.
- Snapshot — handler current render ki state dekhta hai.
- Functional update — old state se calculate ho toh `setN(n => n + 1)`.
- Batching — multiple updates saath process ho sakti hain; turant state variable change nahi hota.
- Object state — mutate mat karo; changed nesting tak nayi copies banao.
- Controlled input — `value` + `onChange`; checkbox mein `checked`.
- Derived state — existing props/state se calculate ho toh duplicate state mat rakho.
- Lift state — shared data nearest common parent mein rakho.
- Form — submit par validate; pending/error/success states clear rakho.
- Lazy initializer — `useState(() => initialValue)` se initialization calculation pass karo; initializer pure rakho.
- State replacement — hook setter object ko merge nahi karta; needed fields spread karo.
- Checkbox input — event.target.checked boolean deta hai; value alag property hai.

### React 19 form Actions

- `useActionState` — action result, dispatch aur pending status deta hai; action ko previous state aur payload milte hain.
- Action dispatch — form action ya `startTransition` ke andar dispatch karo, taaki pending state track ho.
- Action queue — same hook ke queued actions order mein run; previous result agle action ka state banta hai.
- `useOptimistic` — Action pending ho toh temporary UI result; actual saved state separately update karo.
- Optimistic failure — Action khatam hone par base state dikhegi; save fail ho toh clear error/retry UI do.

### Edge cases aur reasoning

- Queued updater trace — same snapshot se setN(n+1) repeated ek value queue karta; functional updaters previous queued result se compose hote hain.
- Controlled lifetime — text value ko string rakho; undefined se string switch uncontrolled/controlled mismatch kara sakta hai.
- Input reset — draft clear successful save ke baad; validation/network failure par learner/user input preserve karo.

## Research notes: Represent coherent request states

- Independent loading/success booleans contradictory combination allow karti hain.

## Example se samjho

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

- Setup — `useState` React se import karo; yeh complete component body hai.
- Trace — queued updaters previous result lete hain; first click par count `3` hota hai.
- Catch — teen `setCount(count + 1)` same handler snapshot se `1` request karte; setter existing local `count` ko mutate nahi karta.

## Recall aur practice

- Sawal — Initial n=0 par three setN(n+1) versus three setN(v=>v+1) ka final result?
- Jawaab — Same handler mein pehla pattern 1, functional pattern 3; updater queue previous result use karti hai.
- Khud try karo — Submit form banao; pending double-submit guard, failed save par preserved draft aur successful save par explicit reset verify karo.

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

Ek click ke baad log kya hoga aur `count` kya banega?

<details>
<summary>Answer</summary>

- Log — `0`; is render ka `count` snapshot fixed hai.
- Naya count — `1`; dono calls `0 + 1` queue karti hain.
- Fix — `setCount((c) => c + 1)` do baar → `2`; updater queue latest value par chalta hai.

</details>

### Easy · Object state mutate kiya, UI same

```jsx
const [form, setForm] = useState({ name: '', email: '' });
function onName(e) {
  form.name = e.target.value;
  setForm(form);
}
```

<details>
<summary>Answer</summary>

- Problem — same object reference; React `Object.is` se compare karke update skip kar sakta hai, aur mutation purane snapshot ko bhi badal deta hai.
- Fix — `setForm((prev) => ({ ...prev, name: e.target.value }))`.

</details>

### Medium · Derived state ko state mat banao

```jsx
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(`${first} ${last}`), [first, last]);
```

Is pattern mein kya galat hai?

<details>
<summary>Answer</summary>

- Problem — extra render (pehle purana `fullName`, phir effect ke baad naya) aur do sources of truth.
- Fix — render mein calculate karo: `const fullName = \`${first} ${last}\`.trim();`
- Expensive ho toh — `useMemo`, phir bhi state nahi.

</details>

### Medium · Uncontrolled se controlled warning

```jsx
const [user, setUser] = useState({});
<input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
```

Console warning kyun aati hai?

<details>
<summary>Answer</summary>

- Kyun — pehle render mein `value={undefined}` → input uncontrolled; typing ke baad string → controlled. React lifetime mein switch par warn karta hai.
- Fix — initial `{ name: '' }` ya `value={user.name ?? ''}`.
- Checkbox — `checked` + `onChange` use hota hai, `value` nahi.

</details>

### Hard · Optimistic like with rollback

Like button turant toggle dikhaye, server fail ho toh wapas aaye aur error dikhe. Fast double-click ka race bhi handle karo.

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

- Rollback — `previous` closure mein saved hai, fail par wahi restore.
- Race — `pending` ke dauran disable; warna do in-flight requests ka rollback galat state la sakta hai.
- React 19 — `useOptimistic` transition ke dauran optimistic value dikhata hai aur transition khatam hone par real state par laut aata hai.

</details>

## Sources — aur padhne ke liye

- [React — useActionState](https://react.dev/reference/react/useActionState)
- [React — useOptimistic](https://react.dev/reference/react/useOptimistic)

- [React state snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React choosing state structure](https://react.dev/learn/choosing-the-state-structure)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/02-state-forms.md)
