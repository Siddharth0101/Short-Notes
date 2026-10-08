---
id: java-decisions-loops
title: Java operators decisions and loops
track: java
order: 2
level: Foundation
minutes: 2
summary: `if/else` — condition ke hisaab se branch choose.
tags: fundamentals, java, decisions, loops
---

## Quick revision

- `if/else` — condition ke hisaab se branch choose.
- `switch` — value ke cases; arrow cases fall-through nahi karte.
- `for` — counted repetition; `while` — condition-based repetition.
- Enhanced for — array/Iterable ki values traverse karo.
- `break` — loop/switch se exit; `continue` — next iteration.
- Integer division — `5 / 2` → `2`; decimal chahiye toh floating operand.
- Boundary — zero, exact limit aur limit ke aas-paas inputs check karo.
- Short-circuit — &&/|| right expression tabhi evaluate jab result decide karna baaki ho.
- Switch expression — value produce karti hai; block branch mein yield use hota hai.
- Loop mutation — enhanced-for ke andar collection structural change unsafe ho sakta hai; proper iterator/API choose.

### Edge cases aur reasoning

- Boolean condition — Java if ko boolean chahiye; JavaScript jaise numeric/string truthiness automatically apply nahi hoti.
- Promote before divide — (double)(5/2) already truncated 2 ko convert; 5/2.0 directly 2.5 deta hai.
- Null-safe guard — value != null && value.isEmpty() right access skip karta; reversed order null par fail karega.

## Recall aur practice

- Sawal — (double)(7 / 2) versus 7 / 2.0 ka result?
- Jawaab — 3.0 versus 3.5; first expression mein integer division cast se pehle complete ho chuki hai.
- Khud try karo — Grade classifier likho; out-of-range reject aur 0, 59, 60, 100 ke boundary outcomes verify karo.

## Sources — aur padhne ke liye

- [Dev.java language basics](https://dev.java/learn/language-basics/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/02-java-decisions-loops.md)
