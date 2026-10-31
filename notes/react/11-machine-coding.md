---
id: react-machine-coding
title: React machine coding and identity bugs
track: react
order: 11
level: Advanced
minutes: 5
summary: Machine coding — requirements → state → components → edge cases → verification.
tags: machine-coding, identity, keys, requests, accessibility
visual: react-identity
---

## Quick revision

> Revision target — Requirements se state aur acceptance checks nikalo; happy path ke saath identity aur race bugs demonstrate karo.

- Machine coding — requirements → state → components → edge cases → verification.
- List identity — stable IDs; reorder par wrong input state move na ho.
- Search — debounce request, stale results ignore, empty/error states dikhao.
- Pagination — filters badlein toh page reset/clamp karo.
- Modal — focus trap, Escape close aur trigger par focus restore.
- OTP — paste, deletion, arrow keys aur labels handle karo.
- Tree UI — node IDs, recursive rendering aur expansion state separate rakho.
- Acceptance — happy path ke saath keyboard, slow request aur failure check karo.
- Undo state — action se pehle needed snapshot/delta rakho; history bounded rakho.
- Empty dataset — zero results par pagination, selection aur totals valid rehne chahiye.
- Async unmount — pending work ka late result removed view ko update na kare.

### OTP input

- Input — valid digit par next focus; deletion par sensible previous focus.
- Paste — sanitize aur remaining boxes fill; length bound.
- Keyboard — arrows/backspace plus labels; mobile inputMode useful.
- Submit — complete value par controlled action; duplicate guard.
- Autofill — browser one-time-code support ko input design se align; manual entry fallback.
- Focus race — value render ke baad intended box focus; removed/disabled node handle.

### Progress bar

- ARIA — progressbar role + min/max/current aur accessible name.
- Unknown duration — indeterminate state; fake percentage ko real progress mat bolo.
- Progress source — completed/total work se percent; elapsed timer ko real task completion mat samjho.
- Concurrent tasks — weighted total define; each small task equal weight hamesha meaningful nahi.
- Announce frequency — every tiny percent update screen reader ko flood na kare.
- Progress value — numeric value clamp karo; complete, failed aur indeterminate states alag rakho.

### File explorer

- Recursive render — children ko nesting se show; deep tree par limits/virtualization.
- Expansion — IDs ke set mein open folders track.
- Actions — add/rename/delete correct parent/node par; duplicate names ka contract.
- Async load — each folder ka loading/error/retry state.
- Node rename — display name badle, stable ID nahi; expansion/selection preserve.
- Delete subtree — descendant selection/expansion state cleanup.
- Lazy children — not-loaded aur empty-folder alag states.
- Tree identity — stable node ID rakho; filename aur file/folder type alag fields.

### Pagination

- Page count — ceil(total/pageSize); pageSize positive hona chahiye.
- Filter change — current page reset/clamp; URL state sync.
- Server page — stale response ignore, stable sort aur loading/error UI.
- Total unknown — next-cursor pagination mein fake last-page count mat dikhao.
- Page accessibility — current page announce; first/last par unavailable controls disable.

### Edge cases aur reasoning

- IME input — composition ke dauran Enter/filter handling premature submit na kare; composed text ke final event ko respect karo.
- Selection ownership — filtered-out/removed item selection ka rule define; hidden stale ID ko actionable selected state mat rakho.
- Async acceptance — response success alone enough nahi; correct query identity aur mounted owner ke liye result commit hona chahiye.

## Example se samjho

- Scenario — user `re` type karta hai, phir `react`; second request pehle complete hoti hai.
- Expected result — UI latest query `react` ka result rakhe; late `re` response usse overwrite na kare.
- Design — har request ko identity do, active identity se match par hi commit karo; supported abort cleanup se unnecessary work bhi reduce karo.
- Catch — debounce request starts ko reduce karta hai; already-started requests ka completion order control nahi karta.
- Check — fake delayed responses, empty query, failed request aur unmount test karo; failure par typed query preserve ho.

## Recall aur practice

- Sawal — Debounce search ke responses reversed aayein toh debounce alone correct UI guarantee karta hai?
- Jawaab — Nahi; debounce starts reduce karta hai, completion order control nahi. Latest request identity ya abort/ignore guard chahiye.
- Khud try karo — Combobox banao; IME, arrows/Enter/Escape, empty results, reversed responses aur selected option removal verify karo.

## Practice questions

### Easy · Todo app ke acceptance checks

Interviewer bole "Todo app banao". Code se pehle kaunse acceptance checks clarify karoge?

<details>
<summary>Answer</summary>

- Add — empty/whitespace reject, Enter se submit, input clear + focus wapas.
- Toggle/delete — stable `id` keys; delete ke baad focus kahan jaayega.
- Filter — all/active/done; counts sahi; filter change par selection logic.
- Persistence/edge — refresh par data chahiye? duplicate allowed? bahut lambe text ka wrap.
- A11y — real `<button>`/`<input type="checkbox">` with labels.

</details>

### Medium · OTP input (6 boxes)

Auto-advance, Backspace se pichla box, aur poora code paste — teeno support karo.

<details>
<summary>Answer</summary>

```jsx
function Otp({ length = 6, onComplete }) {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const refs = useRef([]);
  function update(index, value) {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (next.every(Boolean)) onComplete(next.join(''));
  }
  return digits.map((d, i) => (
    <input
      key={i}
      ref={(el) => (refs.current[i] = el)}
      value={d}
      inputMode="numeric"
      autoComplete={i === 0 ? 'one-time-code' : 'off'}
      aria-label={`Digit ${i + 1}`}
      maxLength={1}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, '').slice(-1);
        update(i, v);
        if (v) refs.current[i + 1]?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && !d) refs.current[i - 1]?.focus();
      }}
      onPaste={(e) => {
        const code = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (!code) return;
        e.preventDefault();
        const next = Array.from({ length }, (_, k) => code[k] ?? '');
        setDigits(next);
        refs.current[Math.min(code.length, length - 1)]?.focus();
        if (code.length === length) onComplete(code);
      }}
    />
  ));
}
```

- Keys — boxes fixed count ke hain, isliye index key yahan safe hai.
- Autofill — `autocomplete="one-time-code"` SMS code suggest karta hai.
- Edge — non-digits filter, double submit rokna, aur error par boxes clear + first focus.

</details>

### Medium · Pagination component

`total` items, `pageSize`, `page` diye hain. Page count, Prev/Next disable, aur filter change par page reset — logic likho.

<details>
<summary>Answer</summary>

```jsx
const pageCount = Math.max(1, Math.ceil(total / pageSize));
const current = Math.min(Math.max(1, page), pageCount); // URL se galat page aaye toh clamp
<nav aria-label="Pagination">
  <button disabled={current === 1} onClick={() => setPage(current - 1)}>Prev</button>
  <span aria-current="page">Page {current} of {pageCount}</span>
  <button disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</button>
</nav>;
```

- Filter change — page 1 par reset (same state update mein, effect se nahi).
- Empty — `total = 0` par bhi `1 of 1` aur "No results" message.
- Server paging — total unknown ho toh `hasNextPage` flag se Next control karo.

</details>

### Hard · File explorer tree

Nested folders/files dikhao: expand/collapse, rename, delete subtree. State design aur render logic batao.

<details>
<summary>Answer</summary>

```jsx
function Node({ node, expanded, onToggle }) {
  const isOpen = expanded.has(node.id);
  return (
    <li role="treeitem" aria-expanded={node.children ? isOpen : undefined}>
      {node.children ? <button onClick={() => onToggle(node.id)}>{node.name}</button> : node.name}
      {node.children && isOpen && (
        <ul role="group">
          {node.children.map((child) => (
            <Node key={child.id} node={child} expanded={expanded} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  );
}
```

- Expansion state — `Set` of ids (parent mein), node objects ke andar `open` flag nahi; rename/move se state nahi tootti.
- Updates — recursive immutable helpers (`updateNode`, `removeNode`) jo sirf changed path copy karein.
- Keys — stable `id`, naam nahi (rename par remount se bacho).
- Bade trees — children lazy load karo; deep recursion par flatten + virtualization.

</details>

### Hard · Accessible modal

Modal component ke requirements aur implementation approach batao.

<details>
<summary>Answer</summary>

- Semantics — native `<dialog>` + `showModal()` se focus trap, Esc aur `inert` background browser deta hai.
- Custom ho toh — `role="dialog"`, `aria-modal="true"`, `aria-labelledby` title par; open par pehle focusable par focus, Tab/Shift+Tab trap, Esc close.
- Close par — focus wapas trigger button par; body scroll lock hatao.
- Portal — `z-index`/overflow problems se bachne ke liye body level par render.
- Tests — Esc band karta hai, Tab bahar nahi jaata, close ke baad trigger focused.

</details>

## Sources — aur padhne ke liye

- [React identity and state](https://react.dev/learn/preserving-and-resetting-state)
- [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/11-machine-coding.md)
