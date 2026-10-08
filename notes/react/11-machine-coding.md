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

## Recall aur practice

- Sawal — Debounce search ke responses reversed aayein toh debounce alone correct UI guarantee karta hai?
- Jawaab — Nahi; debounce starts reduce karta hai, completion order control nahi. Latest request identity ya abort/ignore guard chahiye.
- Khud try karo — Combobox banao; IME, arrows/Enter/Escape, empty results, reversed responses aur selected option removal verify karo.

## Sources — aur padhne ke liye

- [React identity and state](https://react.dev/learn/preserving-and-resetting-state)
- [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/11-machine-coding.md)
