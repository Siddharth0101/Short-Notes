---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 1
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

## Research notes: Make omitted states visible to the compiler

- Discriminated union state ko valid fields se jodta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/09-typescript-contracts.md)
