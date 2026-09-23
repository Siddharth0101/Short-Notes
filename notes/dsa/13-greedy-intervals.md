---
id: dsa-greedy-intervals
title: Greedy aur intervals — choice ka proof aur boundary ka contract
track: dsa
order: 13
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Princeton greedy lecture](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/04GreedyAlgorithmsI.pdf)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/13-greedy-intervals.md)
