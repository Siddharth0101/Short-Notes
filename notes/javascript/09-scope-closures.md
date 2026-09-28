---
id: js-scope-closures
title: Execution contexts scope and closures
track: javascript
order: 9
level: Intermediate
minutes: 2
summary: Scope — variable kahan accessible hai; lexical scope code ki location se decide hota hai.
tags: scope, closures, hoisting, execution-context, memory
visual: closures
---

## Quick revision

- Scope — variable kahan accessible hai; lexical scope code ki location se decide hota hai.
- Block scope — `let`/`const` `{}` tak; `var` nearest function tak.
- Scope chain — naam local se outer scopes mein search hota hai.
- Closure — function outer bindings yaad rakhta hai, outer call khatam hone ke baad bhi.
- Live binding — closure latest binding padhta hai; automatic snapshot nahi.
- Loop trap — `var` callbacks same binding share; `let` har iteration ki binding deta hai.
- Hoisting — declarations pehle register; initialization ka timing alag hai.
- TDZ — lexical binding initialize hone tak access error deta hai.
- Memory — reachable closure captured objects ko alive rakh sakta hai.
- Use — private counters, callbacks aur function factories.
- Factory isolation — outer function ki har call apni local bindings banati hai.
- Captured reference — object reachable rahe toh closure se uske latest mutations dikh sakte hain.
- Shadowing trap — inner same-name binding TDZ mein ho toh outer value fallback nahi milti.

### Execution context

- Execution context — function call ka local execution state; stack active calls track karta hai.
- Call-stack overflow — unbounded synchronous recursion stack exhaust kar sakti hai; base/progress verify karo.
- Engine pipeline — source parse → execute → hot code optimize; engine internals language guarantees se alag.

## Research notes: Live bindings versus snapshots

- Closure binding read karta hai; pehle calculate ki hui string khud update nahi hoti.

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/09-scope-closures.md)
