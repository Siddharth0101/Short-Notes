---
id: dsa-greedy-intervals
title: Greedy aur intervals — choice ka proof aur boundary ka contract
track: dsa
order: 13
level: Intermediate
minutes: 33
summary: Greedy choice ko exchange argument se justify karo; interval endpoints ka meaning sorting rule se pehle define karo.
tags: greedy, intervals, sweep-line, proofs
---

## Mental model — simple soch

Greedy har step par ek choice fix karta hai aur usually use undo nahi karta. Isliye “abhi best lag raha hai” enough reason nahi. Hume prove karna hai ki is choice ke saath bhi optimal solution possible hai. Jaise meetings choose karna: shortest meeting, earliest start aur earliest finish teen alag rules hain; objective decide karega kaunsa valid hai.

> **Core takeaway:** Pehle objective aur interval semantics likho, phir greedy rule aur uska proof do.

Sorting, heaps aur DP ke baad yeh extension padho. Source folder ke advanced map mein names/examples the; yahan decision aur proof ki depth add kar rahe hain. Inputs finite numeric endpoints hain aur start < end. Half-open interval `[start,end)` mein end instant occupied nahi hai, isliye `[1,3)` aur `[3,5)` compatible hain.

## Maximum meetings — earliest finish kyun?

Goal maximum count of non-overlapping meetings hai; weights/profits nahi hain. End time ascending sort karo aur compatible next meeting lo. Below standalone JavaScript function original input mutate nahi karta.

```js
function selectMeetings(intervals) {
  const sorted = intervals.map(([start, end]) => [start, end]);
  if (sorted.some(([s, e]) => !Number.isFinite(s) || !Number.isFinite(e) || s >= e)) {
    throw new RangeError('Expected finite start < end');
  }
  sorted.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const chosen = [];
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {
      chosen.push([start, end]);
      lastEnd = end;
    }
  }
  return chosen;
}
console.log(selectMeetings([[0, 6], [1, 3], [3, 5], [5, 7]]));
// [[1,3], [3,5], [5,7]]
```

Earliest-start rule `[0,6)` choose karke teen short meetings miss kar sakta hai. Earliest-finish G ko kisi optimal solution ki first meeting O ke saath compare karo. G ka end O se late nahi; O ki jagah G rakho toh remaining selected meetings ab bhi fit karti hain. Count same raha, isliye G se start karne wala optimal solution exists. Bache interval set par same argument repeat karo.

Sorting O(n log n), scan O(n), copied input plus output O(n). Proof maximum count objective ka hai. Weighted meetings mein `[0,6)` profit 100 aur teen short meetings total 30 ho sakti hain; earliest finish maximum profit nahi deta. Us problem mein predecessor search plus DP recurrence chahiye.

## Merge aur select alag questions hain

Merge occupied union nikalta hai; select maximum compatible subset. Merge mein start order use hota hai, current merged end maximum rakha jaata hai. Nested `[1,10)` aur `[2,3)` ko merge karte waqt end 3 kar doge toh data loss hoga. Touching intervals merge karne hain ya separate rakhne hain, output contract bataye; meeting compatibility ka rule blindly copy mat karo.

## Minimum rooms — event order se answer badalta hai

Har start par +1 aur end par -1 event banao. Time ascending sort; same time par half-open intervals ke liye end event pehle. Running count active meetings hai; peak minimum rooms hai. Peak ek lower bound hai kyunki us waqt sab meetings simultaneous hain. Free room reuse karne wali schedule is bound ko achieve kar sakti hai.

`[[0,10],[10,20],[5,15]]` ka peak 2 hai. Time 10 par pehli end aur doosri start hoti hai. Start first karoge toh momentary false peak 3 aa sakta hai. Zero-duration intervals exclude kiye hain; allow karne ho toh empty occupancy ka treatment define karo.

Actual room assignment chahiye toh min-heap of ending times/room IDs use karo. Count-only sweep aur explicit assignment different outputs hain, isliye unnecessary IDs store karne ki need nahi.

## Practice — brute force se greedy ko challenge karo

Small n par all subsets enumerate karke maximum compatible count nikalo. Greedy count se compare karo. Random tiny inputs proof ka replacement nahi, lekin implementation bug ka good detector hain. Empty list, identical intervals, nested intervals aur negative times check karo. Input mutation test bhi do.

## Depth walkthrough — andar kya ho raha hai?

### Greedy proof ko ek exchange se samjho

Maximum non-overlapping meetings mein chosen first meeting earliest finish wali G hai. Koi optimal solution first meeting O se start hoti ho. G ka finish O se late nahi, isliye O replace karke G lo toh remaining meetings ke liye available start time worse nahi hota. Count same rehta hai. Isse at least one optimal solution G se start ho sakti hai; remaining compatible suffix par same argument repeat hota hai.

Shortest duration choose karna same proof satisfy nahi karta. Example [0,4], [4,8], [3,5]: middle duration 2 choose karoge toh dono outer meetings block, count 1; outer pair count 2 deti hai. Earliest start bhi long meeting se fail ho sakta hai.

Merge intervals ka objective union ranges hai; selection ka objective maximum compatible subset. Meeting rooms maximum overlap count poochta hai. Same input category hone se algorithm interchangeable nahi. Half-open intervals [start,end) mein end==next start compatible hai; closed interval convention event tie ordering change kar sakti hai.

**Practice:** Weighted rewards add karo. Earliest finish maximum count proof maximum reward prove nahi karta. Counterexample banao, phir weighted interval DP ke state/transition derive karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Earliest finish ka proof shortest duration par automatically apply kyun nahi hota?

**Apply — khud try karo:** Half-open meetings [1,4), [4,6), [2,5) ka selected maximum count aur minimum rooms do.

> **Hint — chhota ishara:** Subset selection aur simultaneous occupancy separately trace karo.

**Answer guide — pehle khud karo, phir compare karo:** Maximum count 2: [1,4), [4,6). Minimum rooms 2: [2,5) doosre room mein rahegi. Time 4 par end before start process karo.

**Exit check — aage badhne se pehle:** Weighted variant ka counterexample aur appropriate DP state batao.

## Sources — aur padhne ke liye

[Princeton greedy lecture](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/04GreedyAlgorithmsI.pdf) se exchange proof aur interval variants compare karo.
