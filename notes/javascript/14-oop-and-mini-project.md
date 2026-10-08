---
id: js-oop-mini-project
title: OOP pillars and a banking mini-project
track: javascript
order: 14
level: Advanced
minutes: 3
summary: Encapsulation — data aur rules saath rakho; invalid state ko entry par roko.
tags: oop, encapsulation, inheritance, polymorphism, abstraction, classes, closures, capstone
---

## Quick revision

- Encapsulation — data aur rules saath rakho; invalid state ko entry par roko.
- Abstraction — useful interface dikhao, implementation details chhupao.
- Inheritance — is-a relation; unnecessary deep hierarchy se bacho.
- Composition — chhote behaviors jodkar object banao.
- Polymorphism — same method contract, implementations alag.
- Invariant — har valid operation ke baad rule true rehna chahiye.
- Private state — `#field`/closure se direct outside mutation roko.
- Mini-project — model mein rules, UI mein display aur handlers rakho.
- Serialization — JSON methods/prototypes preserve nahi karta; restore par validate karo.
- Dependency injection — storage/network collaborator bahar se do; testing aur swapping easier.
- Method contract — mutation hoti hai ya naya object milta hai, caller ko clear rakho.
- Deep freeze — `Object.freeze` shallow hai; nested objects separately freeze karne padte hain.

### Edge cases aur reasoning

- Validation before mutation — operation ka precondition pehle check; halfway failure se model ko invalid state mein mat chhodo.
- Composition dependency — collaborating object inject karo; inheritance sirf real substitutable relationship par choose karo.
- Restoration invariant — JSON se object restore karte waqt constructor/domain rules reapply; raw parsed data ko trusted instance mat maano.

## Recall aur practice

- Sawal — Private balance field hone se negative deposit automatically reject hota hai?
- Jawaab — Nahi; privacy access control hai, business validation method contract mein enforce hoti hai.
- Khud try karo — Wallet model banao; positive deposit, insufficient withdraw, invalid amount aur serialization restore par balance invariant verify karo.

## Sources — aur padhne ke liye

- [MDN Object-oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_building_practice)
- [MDN private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/14-oop-and-mini-project.md)
