---
id: javascript-git-workflow
title: Git workflow — working tree se reviewed commit tak
track: javascript
order: 20
level: Intermediate
minutes: 28
summary: Working tree, index aur HEAD alag snapshots hain; intended change stage karke review karo aur context ke hisaab se undo choose karo.
tags: git, tooling, collaboration, debugging
---

## Mental model — simple soch

Git upload button se zyada hai. Working tree current files hain; index next commit ka proposed snapshot hai; HEAD current checkout ka commit refer karta hai. Edit se working tree, add se selected index content aur commit se history change hoti hai. Saare tracks mein yeh workflow useful hai; tooling/testing ke baad placed hai taaki practice project ready ho.

> **Core takeaway:** Command se pehle bata sako ki files, index, history ya remote mein kya badlega.

Git installed chahiye. Recovery exercises disposable practice repo mein karo; current shared repo par blindly execute mat karo.

## Pehle read-only inspection

```bash
git status --short
git diff
git diff --staged
git log --oneline -5
```

Unstaged diff working tree ko index se compare karta hai. Staged diff proposed snapshot ko HEAD se compare karta hai. Same file mein staged aur unstaged edits dono ho sakti hain: title stage kiya, phir paragraph edit kiya. Normal commit staged title snapshot lega; later paragraph nahi.

Untracked files ordinary diff mein nahi dikhti; status bhi dekho. `.gitignore` existing tracked secret ko history se remove nahi karta. Exposed credential ho toh rotation aur repository policy follow karo; ignore rule ko security fix mat samjho.

## Small change ka review loop

Clean starting state se `git switch -c practice/title-fix` banao. Edit, relevant tests, `git add -p`, phir `git diff --staged` se intended hunks verify karo. Commit message behavior aur reason explain kare. Working tree tests pass hue lekin half fix stage kiya toh commit independently broken ho sakta hai; staged snapshot coherent bhi ho.

Fetch remote-tracking information update karta hai; merge/rebase integration separate choice hai. Team policy aur graph samjho. Merge histories join karta hai; rebase commits replay karke identities change karta hai. Shared branch history rewrite collaborators ko affect karti hai.

## Undo ka exact target

| Situation | Command | Kya badlega |
| --- | --- | --- |
| Galti se staged file | `git restore --staged -- path` | Default HEAD se index restore; working edit rehti hai |
| Unstaged tracked edit discard | `git restore -- path` | Default index se working file restore; unstaged edit lose ho sakti hai |
| Published ordinary commit undo | `git revert <commit>` | Inverse change ka new commit; shared history preserved |
| Conflicted merge abandon | `git merge --abort` | Pre-merge recovery attempt; dirty starting state complicate kar sakti hai |

“Undo everything” ka universal safe command nahi. Reflog lost commit investigate karne mein useful hai; uncommitted edits ka guaranteed backup nahi. Recovery se pehle remaining valuable edits ki copy/diff preserve karo. Merge commits revert karne ke mainline semantics ordinary commit se different hain; selected context ka documentation padho.

## Conflict markers ke baad bhi reasoning chahiye

Two branches same price calculation change karti hain. Markers remove karna syntax solve karta hai; dono intents preserve hue kya? Base, ours aur theirs versions compare karo. Expected examples run karo, phir resolved files stage karo. “Ours always” se teammate ka valid change lose ho sakta hai.

Revert bhi later dependent changes ke saath conflict kar sakta hai. Review mein test command, behavior, risk aur recovery likho. Large unrelated formatting ko bug fix mein mix karne se useful diff dekhna difficult hota hai.

## Practice — staged snapshot ko dekho

Scratch repo mein first line change karke stage karo, phir second line edit karo. **Expected:** staged diff mein first edit; unstaged diff mein second. Unstage ke baad working file mein dono edits bachni chahiye. Full intended snapshot commit karo; ordinary commit revert karke new history entry dekho.

Doosra drill: test fixes ke saath dependency upgrade aur unrelated CSS accidentally stage hui. Intent ke hisaab se separate reviewable changes banao. Sirf file count kam karna goal nahi; reviewer expected behavior aur verification samajh sake.

## Depth walkthrough — andar kya ho raha hai?

### Commit working folder ki live photo nahi hota

File mein A change karo aur stage karo. Phir same file mein B change karo. Ab index mein A snapshot hai, working tree mein A+B. Commit karoge toh staged A commit hota hai; B automatically include nahi hota. `git diff` unstaged difference aur `git diff --cached` proposed commit difference dikhata hai.

Isliye “maine file test ki” aur “maine staged version test ki” exact same claim nahi, jab unstaged changes present hon. Review mein intended snapshot inspect karo. Kisi aur ke staged work ko reset karke apna clean baseline banana shared workspace mein loss/confusion create kar sakta hai.

Conflict markers remove hona sirf syntactic step hai. Suppose ek branch parameter rename karti hai aur doosri caller add karti hai: both lines keep karke bhi caller old name/contract use kar sakta hai. Combined behavior build/test aur relevant call sites se verify karo.

**Scratch-repo exercise:** A stage, B edit, both diff views explain, phir deliberate staging choose karo. Undo operation se pehle target bolo: working tree, index ya committed history. Public history mein revert compensating commit banata hai; destructive history rewrite alag coordination maangti hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** git diff aur git diff --staged alag content kyun dikha sakte hain?

**Apply — khud try karo:** First edit staged, second unstaged hai. `git restore -- file` ke baad kya bachega?

> **Hint — chhota ishara:** Default source index hai, necessarily HEAD nahi.

**Answer guide — pehle khud karo, phir compare karo:** Working file staged snapshot banegi: first edit bachegi, second discard hogi. Isliye discard se pehle exact diff aur backup need samjho.

**Exit check — aage badhne se pehle:** Published bug undo aur accidental staging undo ke actions separately explain karo.

## Sources — aur padhne ke liye

[Restore](https://git-scm.com/docs/git-restore), [revert](https://git-scm.com/docs/git-revert) aur [diff](https://git-scm.com/docs/git-diff) ke official contracts padho.
