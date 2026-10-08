---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 3
summary: TypeScript — compile-time checks; runtime input validation alag hai.
tags: typescript, state, narrowing, api, testing
---

## Quick revision

- TypeScript — compile-time checks; runtime input validation alag hai.
- Props type — required/optional fields aur callback contract define karo.
- Union — allowed alternatives; literal `status` se state narrow karo.
- Discriminated union — impossible loading/success/error combinations rokta hai.
- `unknown` — pehle validate/narrow; `any` checks bypass karta hai.
- Generic — type relation preserve; unnecessary flexible API mat banao.
- Event type — actual element/event ka type use karo.
- API response — external JSON ko runtime schema se validate karo.
- Nullability — missing value explicitly handle; `!` se blindly silence mat karo.
- Exhaustive check — union ka har variant handle; missing branch compiler se pakdo.
- Readonly — TypeScript write restriction; runtime deep-freeze guarantee nahi.
- Type assertion — `as Type` runtime conversion/validation nahi karta.

### Edge cases aur reasoning

- Type versus value — interface/type compile ke baad erase; runtime checks ke liye actual schema/predicate chahiye.
- Optional property — absent aur explicit undefined ka contract compiler options/serialization se affect; API input normalization define karo.
- Callback relation — generic callback input/output type connection preserve; caller ko unrelated type return karne ki accidental permission mat do.

## Research notes: Make omitted states visible to the compiler

- Discriminated union state ko valid fields se jodta hai.

## Recall aur practice

- Sawal — const user = json as User invalid server payload ko safe kyun nahi banata?
- Jawaab — Assertion compiler belief badalta hai, runtime data nahi; validate karke trusted model construct karo.
- Khud try karo — Request state union aur exhaustive renderer likho; success missing data compile fail aur malformed JSON runtime reject verify karo.

## Sources — aur padhne ke liye

- [Source yahan padho — TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/09-typescript-contracts.md)
