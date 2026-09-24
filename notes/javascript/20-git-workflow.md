---
id: javascript-git-workflow
title: Git workflow — working tree se reviewed commit tak
track: javascript
order: 20
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Restore](https://git-scm.com/docs/git-restore)
- [revert](https://git-scm.com/docs/git-revert)
- [diff](https://git-scm.com/docs/git-diff)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/20-git-workflow.md)
