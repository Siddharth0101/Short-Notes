---
id: javascript-git-workflow
title: Git workflow — working tree se reviewed commit tak
track: javascript
order: 20
level: Intermediate
minutes: 3
summary: Working tree — current edits; staging — next commit ka selected snapshot.
tags: git, tooling, collaboration, debugging
---

## Quick revision

> Revision target — Working tree, staging aur commit ke snapshots alag dekho; intentional change hi commit mein jaye.

- Working tree — current edits; staging — next commit ka selected snapshot.
- Commit — tracked changes ka local snapshot.
- Branch — commit ka movable pointer; alag work isolate karo.
- `fetch` — remote refs lao; `pull` — fetch ke baad integration.
- Merge — histories combine; rebase — commits nayi base par replay.
- Conflict — final intended content resolve karo, phir verify aur continue.
- `revert` — undo ka naya commit; shared history ke liye useful.
- `reset` — branch/index/worktree badal sakta hai; mode samajhkar use karo.
- `.gitignore` — already tracked file ko untrack nahi karta.
- Review — commit se pehle `git diff` aur staged diff padho.
- `stash` — temporary local changes side mein; long-term backup ka replacement nahi.
- `cherry-pick` — selected commit ka change current branch par apply.
- `reflog` — local ref movement history; misplaced commit locate karne mein useful.

### Edge cases aur reasoning

- Restore scope — git restore worktree/index content badalta hai; git revert committed change ka inverse naya commit banata hai.
- Published rebase — rewritten commit identities collaborators ko affect karti hain; shared branch policy aur coordination follow karo.
- Secret history — tracked secret delete karne se previous commits clean nahi; credential rotate aur history remediation separately chahiye.

## Example se samjho

```sh
git status --short
git diff
git add notes/javascript/01-js-variables.md
git diff --staged
```

- Trace — file stage karne ke baad usmein extra edit karo; unstaged diff latest edit, staged diff pehle selected snapshot dikhayega.
- Catch — `git add` future edits automatically include nahi karta; commit se pehle staged snapshot review karo.
- Check — unrelated file untouched/stage se bahar rahe; secrets aur generated changes ko diff mein inspect karo.

## Recall aur practice

- Sawal — git diff aur git diff --staged same changes kyun nahi dikhate?
- Jawaab — Pehla worktree versus index; doosra index versus HEAD, yani next commit ka snapshot.
- Khud try karo — Disposable repo mein partial stage, staged/unstaged diff aur revert practice karo; final tracked file aur history explain karo.

## Practice questions

### Easy · `fetch` vs `pull`

<details>
<summary>Answer</summary>

- `git fetch` — remote ke naye commits download karta hai (`origin/main` update), tumhari branch/working tree touch nahi karta.
- `git pull` — `fetch` + current branch mein merge (ya `--rebase` se rebase).
- Safe habit — `git fetch` karke `git log HEAD..origin/main` dekho, phir integrate karo.

</details>

### Easy · Last commit undo karna

Ek commit galat ho gaya. (a) Abhi push nahi hua, changes rakhne hain. (b) Push ho chuka hai aur team ne pull kiya. Kya karoge?

<details>
<summary>Answer</summary>

- (a) — `git reset --soft HEAD~1`; commit hat jaata hai, changes staged rehte hain.
- (b) — `git revert <sha>`; naya commit jo changes ulta karta hai, history rewrite nahi hoti.
- Avoid — shared branch par `reset --hard` + force push; doosron ki history toot jaati hai.

</details>

### Medium · Merge conflict resolve karo

```text
<<<<<<< HEAD
const limit = 20;
=======
const limit = 50;
>>>>>>> feature/pagination
```

Iska matlab aur resolve karne ke steps?

<details>
<summary>Answer</summary>

- Markers — upar current branch (`HEAD`) ka version, neeche incoming branch ka.
- Steps — sahi final code likho (sirf ek pick karna zaroori nahi), markers hatao, tests chalao, `git add file`, phir `git commit` (ya `git rebase --continue`).
- Context — `git log -p --merge` ya PR discussion se samjho kyun dono ne value badli.

</details>

### Medium · `reset --hard` ke baad commit wapas lao

Galti se `git reset --hard HEAD~3` chal gaya. Teen commits wapas kaise milenge?

<details>
<summary>Answer</summary>

- `git reflog` — HEAD ke purane positions dikhata hai (e.g. `abc123 HEAD@{1}: commit: ...`).
- Restore — `git branch rescue abc123` ya `git reset --hard abc123`.
- Limit — sirf committed work reflog mein hai; uncommitted changes `reset --hard` ke baad wapas nahi aate. Reflog entries local hain aur expire hoti hain.

</details>

### Hard · Secret push ho gaya

API key ek commit mein public repo par push ho gayi. Sahi order mein kya karoge?

<details>
<summary>Answer</summary>

- 1. Rotate/revoke — key turant invalid karo; history clean karna kaafi nahi, key already copy ho chuki ho sakti hai.
- 2. Code fix — key env/secret manager mein; `.env` ko `.gitignore` mein; tracked file ho toh `git rm --cached .env`.
- 3. History — `git filter-repo` (ya BFG) se file/string hatao, phir coordinated force push; team re-clone kare.
- 4. Prevent — pre-commit/CI secret scanning, push protection; audit logs check karo ki key use hui ya nahi.

</details>

## Sources — aur padhne ke liye

- [Restore](https://git-scm.com/docs/git-restore)
- [revert](https://git-scm.com/docs/git-revert)
- [diff](https://git-scm.com/docs/git-diff)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/20-git-workflow.md)
