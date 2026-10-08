---
id: react-testing-accessibility
title: React testing — user behavior aur accessibility verify karo
track: react
order: 12
level: Intermediate
minutes: 3
summary: Testing Library — user ke visible behavior se tests likho.
tags: testing, accessibility, forms, react
---

## Quick revision

- Testing Library — user ke visible behavior se tests likho.
- Query — accessible role/name prefer; implementation selector se bacho.
- User event — realistic typing/click; async interaction await karo.
- `findBy` — async appearance; `queryBy` — absence check.
- Mock network — loading, error, retry aur out-of-order response cover karo.
- Accessibility — semantic HTML, labels, contrast aur keyboard flow.
- Focus — modal/route/error ke baad focus meaningful jagah par rahe.
- Coverage — line percentage se zyada important user journeys aur failure cases.
- `useId` — accessible label/description IDs banane ke liye; list keys ke liye data ID use karo.
- Accessible name — visible label aur control name match; icon-only button ko label do.
- Test cleanup — mounted UI, mocks aur fake timers next test mein leak na hon.

### Keyboard aur dialogs

- Dialog focus — open par andar focus, modal mein Tab trap, Escape close aur trigger par focus return.
- Live region — status changes announce; alert sirf urgent update, noisy repeated announcements avoid.

### Edge cases aur reasoning

- Browser test boundary — jsdom actual layout, paint aur complete browser accessibility behavior prove nahi; real-browser checks separately rakho.
- Async absence — immediate queryBy absence future disappearance prove nahi; transition complete hone ka suitable wait use karo.
- Test user ownership — label/name se control choose karo; duplicate labels ho toh related region within query se scope karo.

## Recall aur practice

- Sawal — Snapshot test pass hone se modal keyboard accessibility prove hoti hai?
- Jawaab — Nahi; focus movement, Tab boundary, Escape aur restoration ko interaction se check karna hoga.
- Khud try karo — Form journey test karo; role/name query, invalid submit message, failed retry aur successful submit; browser mein focus/zoom manually verify karo.

## Sources — aur padhne ke liye

- [React useId](https://react.dev/reference/react/useId)

- [Testing Library principles](https://testing-library.com/docs/guiding-principles/)
- [queries](https://testing-library.com/docs/queries/about/)
- [user-event](https://testing-library.com/docs/user-event/intro/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/12-testing-accessibility.md)
