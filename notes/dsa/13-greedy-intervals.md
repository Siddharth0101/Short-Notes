---
id: dsa-greedy-intervals
title: Greedy aur intervals — choice ka proof aur boundary ka contract
track: dsa
order: 13
level: Intermediate
minutes: 3
summary: Greedy — har step local choice; global correctness ka proof chahiye.
tags: greedy, intervals, sweep-line, proofs
---

## Quick revision

- Greedy — har step local choice; global correctness ka proof chahiye.
- Exchange argument — optimal solution ki choice ko greedy se replace karke quality na gire.
- Interval scheduling — maximum non-overlap count ke liye earliest finish useful.
- Merge intervals — start sort karo; overlap par end extend.
- Boundary — touching intervals overlap hain ya nahi, contract clear karo.
- Meeting rooms — active end-times ka min-heap ya sweep line.
- Weighted intervals — earliest finish alone enough nahi; DP use hota hai.
- Verification — small cases ke brute-force optimum se compare karo.
- Greedy failure — coin denominations arbitrary hon toh largest coin first minimum coins guarantee nahi.
- Sweep tie — same coordinate par starts/ends ka order overlap definition se match.
- Proof habit — chhota counterexample search karo; sample pass hona correctness proof nahi.

### Edge cases aur reasoning

- End-time proof — earliest finishing compatible interval future room maximize karta; longest/earliest-start selection ka counterexample search karo.
- Meeting sweep — half-open intervals [start,end) mein same-time end before start; closed intervals ka tie rule different.
- Weighted recurrence — sorted finishes par best[i]=max(best[i-1],weight[i]+best[p(i)]); p(i) last compatible predecessor, binary search se find karo.

## Recall aur practice

- Sawal — Coins [1,3,4] amount6 par largest-first aur optimal result kya hai?
- Jawaab — Greedy 4+1+1 three coins; optimum 3+3 two. Arbitrary denominations mein local choice proof nahi.
- Khud try karo — Interval scheduler brute force se small cases compare karo; touching, identical, nested intervals aur weighted counterexample cover karo.

## Sources — aur padhne ke liye

- [Princeton greedy lecture](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/04GreedyAlgorithmsI.pdf)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/13-greedy-intervals.md)
