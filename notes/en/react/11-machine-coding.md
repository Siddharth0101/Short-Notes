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

> Revision target — Derive state and acceptance checks from the requirements; demonstrate identity and race bugs along with the happy path.

- Machine coding — requirements → state → components → edge cases → verification.
- List identity — stable IDs; a reorder must not move input state to the wrong item.
- Search — debounce the request, ignore stale results, show empty/error states.
- Pagination — reset/clamp the page when the filters change.
- Modal — focus trap, close on Escape and restore focus to the trigger.
- OTP — handle paste, deletion, arrow keys and labels.
- Tree UI — keep node IDs, recursive rendering and expansion state separate.
- Acceptance — along with the happy path, check the keyboard, a slow request and failure.
- Undo state — keep the needed snapshot/delta before the action; keep the history bounded.
- Empty dataset — pagination, selection and totals must stay valid with zero results.
- Async unmount — the late result of pending work must not update a removed view.

### OTP input

- Input — focus the next box on a valid digit; a sensible previous focus on deletion.
- Paste — sanitize and fill the remaining boxes; bound the length.
- Keyboard — arrows/backspace plus labels; inputMode is useful on mobile.
- Submit — a controlled action on the complete value; a duplicate guard.
- Autofill — align the input design with the browser's one-time-code support; keep a manual entry fallback.
- Focus race — focus the intended box after the value renders; handle a removed/disabled node.

### Progress bar

- ARIA — the progressbar role + min/max/current and an accessible name.
- Unknown duration — an indeterminate state; do not call a fake percentage real progress.
- Progress source — the percent from completed/total work; do not treat an elapsed timer as real task completion.
- Concurrent tasks — define a weighted total; equal weight for every small task is not always meaningful.
- Announce frequency — every tiny percent update must not flood the screen reader.
- Progress value — clamp the numeric value; keep complete, failed and indeterminate states separate.

### File explorer

- Recursive render — show children through nesting; limits/virtualization for a deep tree.
- Expansion — track open folders in a set of IDs.
- Actions — add/rename/delete on the correct parent/node; a contract for duplicate names.
- Async load — a loading/error/retry state for each folder.
- Node rename — the display name changes, not the stable ID; preserve expansion/selection.
- Delete subtree — clean up the selection/expansion state of descendants.
- Lazy children — not-loaded and empty-folder are different states.
- Tree identity — keep a stable node ID; the filename and the file/folder type are separate fields.

### Pagination

- Page count — ceil(total/pageSize); pageSize must be positive.
- Filter change — reset/clamp the current page; sync the URL state.
- Server page — ignore a stale response; a stable sort and loading/error UI.
- Total unknown — in next-cursor pagination do not show a fake last-page count.
- Page accessibility — announce the current page; disable unavailable controls on the first/last page.

### Edge cases and reasoning

- IME input — Enter/filter handling during composition must not submit prematurely; respect the final event of the composed text.
- Selection ownership — define the rule for selecting a filtered-out/removed item; do not keep a hidden stale ID as an actionable selected state.
- Async acceptance — a successful response alone is not enough; the result must be committed for the correct query identity and a mounted owner.

## Understand it with an example

- Scenario — the user types `re`, then `react`; the second request completes first.
- Expected result — the UI keeps the result of the latest query `react`; the late `re` response must not overwrite it.
- Design — give every request an identity and commit only when it matches the active identity; supported abort cleanup also reduces unnecessary work.
- Catch — debounce reduces how many requests start; it does not control the completion order of requests already started.
- Check — test fake delayed responses, an empty query, a failed request and unmount; the typed query must be preserved on failure.

## Recall and practice

- Question — If the responses of a debounced search arrive reversed, does debounce alone guarantee a correct UI?
- Answer — No; debounce reduces starts, it does not control completion order. A latest-request identity or an abort/ignore guard is needed.
- Try it yourself — Build a combobox; verify IME, arrows/Enter/Escape, empty results, reversed responses and removal of the selected option.

## Practice questions

### Easy · Acceptance checks for a todo app

The interviewer says "build a todo app". Which acceptance checks do you clarify before coding?

<details>
<summary>Answer</summary>

- Add — reject empty/whitespace, submit with Enter, clear the input + return focus.
- Toggle/delete — stable `id` keys; where focus goes after a delete.
- Filter — all/active/done; correct counts; the selection logic on a filter change.
- Persistence/edge — is the data needed after a refresh? are duplicates allowed? wrapping of very long text.
- A11y — a real `<button>`/`<input type="checkbox">` with labels.

</details>

### Medium · OTP input (6 boxes)

Support all three: auto-advance, Backspace to the previous box, and pasting the whole code.

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

- Keys — the boxes are a fixed count, so an index key is safe here.
- Autofill — `autocomplete="one-time-code"` suggests the SMS code.
- Edge — filter non-digits, prevent a double submit, and on an error clear the boxes + focus the first.

</details>

### Medium · Pagination component

Given `total` items, `pageSize` and `page`, write the logic: the page count, disabling Prev/Next, and resetting the page on a filter change.

<details>
<summary>Answer</summary>

```jsx
const pageCount = Math.max(1, Math.ceil(total / pageSize));
const current = Math.min(Math.max(1, page), pageCount); // clamp when the URL carries a wrong page
<nav aria-label="Pagination">
  <button disabled={current === 1} onClick={() => setPage(current - 1)}>Prev</button>
  <span aria-current="page">Page {current} of {pageCount}</span>
  <button disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</button>
</nav>;
```

- Filter change — reset to page 1 (in the same state update, not from an effect).
- Empty — even with `total = 0` show `1 of 1` and a "No results" message.
- Server paging — when the total is unknown, control Next with a `hasNextPage` flag.

</details>

### Hard · File explorer tree

Show nested folders/files: expand/collapse, rename, delete a subtree. Describe the state design and render logic.

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

- Expansion state — a `Set` of ids (in the parent), not an `open` flag inside node objects; a rename/move does not break the state.
- Updates — recursive immutable helpers (`updateNode`, `removeNode`) that copy only the changed path.
- Keys — the stable `id`, not the name (avoid a remount on rename).
- Large trees — lazy-load children; flatten + virtualize for deep recursion.

</details>

### Hard · Accessible modal

Describe the requirements and implementation approach of a modal component.

<details>
<summary>Answer</summary>

- Semantics — with a native `<dialog>` + `showModal()` the browser provides the focus trap, Esc and an `inert` background.
- If it is custom — `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the title; on open focus the first focusable element, trap Tab/Shift+Tab, close on Esc.
- On close — return focus to the trigger button; remove the body scroll lock.
- Portal — render at the body level to avoid `z-index`/overflow problems.
- Tests — Esc closes it, Tab does not leave it, the trigger is focused after close.

</details>

## Sources — further reading

- [React identity and state](https://react.dev/learn/preserving-and-resetting-state)
- [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/11-machine-coding.md)
