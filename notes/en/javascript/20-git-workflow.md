---
id: javascript-git-workflow
title: Git workflow — from the working tree to a reviewed commit
track: javascript
order: 20
level: Intermediate
minutes: 3
summary: Working tree — the current edits; staging — the selected snapshot for the next commit.
tags: git, tooling, collaboration, debugging
---

## Quick revision

> Revision target — See the working tree, staging and commit snapshots separately; only an intentional change goes into a commit.

- Working tree — the current edits; staging — the selected snapshot for the next commit.
- Commit — a local snapshot of the tracked changes.
- Branch — a movable pointer to a commit; isolate separate work.
- `fetch` — brings the remote refs; `pull` — integration after a fetch.
- Merge — combines histories; rebase — replays commits on a new base.
- Conflict — resolve to the final intended content, then verify and continue.
- `revert` — a new commit that undoes; useful for shared history.
- `reset` — can change the branch/index/worktree; use it knowing the mode.
- `.gitignore` — does not untrack a file that is already tracked.
- Review — read `git diff` and the staged diff before committing.
- `stash` — puts temporary local changes aside; not a replacement for a long-term backup.
- `cherry-pick` — applies the change of a selected commit to the current branch.
- `reflog` — the local history of ref movements; useful for locating a misplaced commit.

### Edge cases and reasoning

- Restore scope — git restore changes worktree/index content; git revert creates a new commit that is the inverse of a committed change.
- Published rebase — rewritten commit identities affect collaborators; follow the shared-branch policy and coordinate.
- Secret history — deleting a tracked secret does not clean the previous commits; rotating the credential and remediating history are separate steps.

## Understand it with an example

```sh
git status --short
git diff
git add notes/javascript/01-js-variables.md
git diff --staged
```

- Trace — make an extra edit to a file after staging it; the unstaged diff shows the latest edit, the staged diff the snapshot selected earlier.
- Catch — `git add` does not automatically include future edits; review the staged snapshot before committing.
- Check — an unrelated file stays untouched/out of staging; inspect secrets and generated changes in the diff.

## Recall and practice

- Question — Why do git diff and git diff --staged not show the same changes?
- Answer — The first is worktree versus index; the second is index versus HEAD, that is, the snapshot for the next commit.
- Try it yourself — In a disposable repo practise a partial stage, the staged/unstaged diffs and a revert; explain the final tracked file and the history.

## Practice questions

### Easy · `fetch` vs `pull`

<details>
<summary>Answer</summary>

- `git fetch` — downloads the remote's new commits (updates `origin/main`) without touching your branch or working tree.
- `git pull` — `fetch` + a merge into the current branch (or a rebase with `--rebase`).
- Safe habit — run `git fetch`, look at `git log HEAD..origin/main`, then integrate.

</details>

### Easy · Undoing the last commit

A commit went wrong. (a) It is not pushed yet and you want to keep the changes. (b) It is pushed and the team has pulled. What do you do?

<details>
<summary>Answer</summary>

- (a) — `git reset --soft HEAD~1`; the commit is removed and the changes stay staged.
- (b) — `git revert <sha>`; a new commit that reverses the changes, with no history rewrite.
- Avoid — `reset --hard` + a force push on a shared branch; it breaks everyone else's history.

</details>

### Medium · Resolve a merge conflict

```text
<<<<<<< HEAD
const limit = 20;
=======
const limit = 50;
>>>>>>> feature/pagination
```

What does this mean, and what are the steps to resolve it?

<details>
<summary>Answer</summary>

- Markers — above is the version of the current branch (`HEAD`), below is the incoming branch's.
- Steps — write the correct final code (you need not pick only one side), remove the markers, run the tests, `git add file`, then `git commit` (or `git rebase --continue`).
- Context — use `git log -p --merge` or the PR discussion to understand why both sides changed the value.

</details>

### Medium · Bring commits back after `reset --hard`

`git reset --hard HEAD~3` was run by mistake. How do you get the three commits back?

<details>
<summary>Answer</summary>

- `git reflog` — shows the old positions of HEAD (e.g. `abc123 HEAD@{1}: commit: ...`).
- Restore — `git branch rescue abc123` or `git reset --hard abc123`.
- Limit — only committed work is in the reflog; uncommitted changes do not come back after `reset --hard`. Reflog entries are local and they expire.

</details>

### Hard · A secret was pushed

An API key was pushed in a commit to a public repo. What do you do, in the right order?

<details>
<summary>Answer</summary>

- 1. Rotate/revoke — invalidate the key immediately; cleaning history is not enough, the key may already have been copied.
- 2. Code fix — move the key to env/a secret manager; put `.env` in `.gitignore`; if the file is tracked, `git rm --cached .env`.
- 3. History — remove the file/string with `git filter-repo` (or BFG), then a coordinated force push; the team re-clones.
- 4. Prevent — pre-commit/CI secret scanning and push protection; check the audit logs to see whether the key was used.

</details>

## Sources — further reading

- [Restore](https://git-scm.com/docs/git-restore)
- [revert](https://git-scm.com/docs/git-revert)
- [diff](https://git-scm.com/docs/git-diff)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/20-git-workflow.md)
