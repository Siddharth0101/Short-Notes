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

## Recall aur practice

- Sawal — git diff aur git diff --staged same changes kyun nahi dikhate?
- Jawaab — Pehla worktree versus index; doosra index versus HEAD, yani next commit ka snapshot.
- Khud try karo — Disposable repo mein partial stage, staged/unstaged diff aur revert practice karo; final tracked file aur history explain karo.

## Sources — aur padhne ke liye

- [Restore](https://git-scm.com/docs/git-restore)
- [revert](https://git-scm.com/docs/git-revert)
- [diff](https://git-scm.com/docs/git-diff)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/20-git-workflow.md)
