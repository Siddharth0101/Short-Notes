# Revision — short aur seedha

Notes ko padhne ke saath answer retrieve karo, example trace karo aur ek observable check complete karo. Chapter complete hona self-report hai; correct output aur clear reasoning alag evidence hain.

## Apna session choose karo

| Time | Kya karna hai | Session ke end par evidence |
| --- | --- | --- |
| 5 min | Ek chapter ka target → quick revision → closed-notes recall | Ek answer apne words mein aur ek unclear point |
| 15 min | Ek chapter → worked example → recall → boundary case | Predicted/actual output aur mistake ka reason |
| 30 min | Ek weak topic → linked code → practice → interview follow-up | Working behavior, failure check aur short spoken explanation |
| 60 min | Ek scoped machine-coding round ya live subject interview | Acceptance checks/review aur next manual practice target |

- Timebox — concept reading time estimate hai; implementation/testing ka time usmein included nahi.
- Scope — chhota complete exercise choose karo; ek session mein poora subject finish karna target mat banao.
- AI availability — notes, linked examples aur self-review se independently revise kar sakte ho; live interview ko configured backend chahiye.

## Chapter padhne ka flow

1. **Target dekho** — chapter ke start ka revision target apne words mein repeat karo; prerequisite unclear ho toh syllabus ka previous stage kholo.
2. **Concept samjho** — quick revision mein term aur catch dono padho; unknown word glossary mein check karo.
3. **Pehle predict karo** — worked example ka output/state khud likho, phir trace aur failure case compare karo.
4. **Notes band karo** — recall sawal ka answer do; sirf familiar lagne ko understanding mat samjho.
5. **Proof banao** — practice ke normal, boundary aur failure cases check karo; mismatch ka smallest example save karo.

- Format — `term — meaning / important catch`.
- Order — [syllabus](README.md) se apna subject kholo.
- Recall — term dekho, meaning khud bolo, phir line check karo.
- Chapter sawal — `Recall aur practice` par rukkar answer likho/bolo; jawaab pehle padhkar guess ko mastery mat samjho.
- Reasoning — predicted output ke saath kyun explain; code ke runtime/version assumptions identify karo.
- Exercise — `Khud try karo` ka normal, boundary aur failure behavior check; output expected result se compare karo.

## Answer ka quality check

| Apne answer mein dekho | Example |
| --- | --- |
| Rule | `const` binding reassign nahi hoti. |
| Condition | Object reference `const` ho sakta hai; properties phir bhi mutable ho sakti hain. |
| Counterexample | `const cart = []; cart.push(1)` allowed hai. |
| Observable check | Same binding ko `cart = []` se replace karne par error aata hai. |

- Honest review — observed wrong answer aur self-confidence alag note; unclear fact ka supporting source kholo.
- Weak-topic log — `topic | mera prediction | actual result | kyun | next exercise` likho; sirf wrong/right label se repair clear nahi hota.
- Explanation — definition ke baad example aur catch bolo; unclear premise ho toh runtime/input assumption pehle state karo.

## Agla step choose karo

- Weak topic — bookmark karo aur next revision mein repeat.
- Code — chapter ka optional examples link kholo jab output/implementation dekhna ho.
- Visual — linked visual mein next step pehle predict karo, phir advance; simulation ki limits bhi padho.
- Interview — [priority questions](INTERVIEW_PRIORITY_GUIDE.md) se start karo.
- Build practice — [machine coding](MACHINE_CODING_PRACTICE.md) mein acceptance checks verify karo.
- Progress — samajh aaye tab complete mark karo; sirf page kholna enough nahi.
- Revision log — weak concept, apna counterexample aur next manual revisit date likho; automatic reminders assume mat karo.
- Backup — app ke Bookmarks se progress JSON export karo; browser storage clear hone par local progress lost ho sakti hai.
