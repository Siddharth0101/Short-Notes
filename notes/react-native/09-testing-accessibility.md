---
id: rn-testing-accessibility
title: Testing debugging aur mobile accessibility
track: react-native
order: 9
level: Intermediate
minutes: 2
summary: Unit test — validation/reducer jaise pure logic fast check; device integration ka replacement nahi.
tags: react-native, mobile, expo, testing-accessibility
---

## Quick revision

### Tests aur debugging

- Unit test — validation/reducer jaise pure logic fast check; device integration ka replacement nahi.
- Component test — user-visible text/role aur interaction assert; implementation internals par overfit mat karo.
- Native mocks — mocked camera/storage test JS behavior; actual permissions/native wiring device par verify karo.
- E2E — login, navigation, back aur persistence journey emulator/device par run karo.
- Failure matrix — offline, expired session, denied permission, rotation aur app resume cases cover karo.
- Debugging — JS error aur native crash alag evidence; stack traces, device logs aur network status inspect karo.

### Inclusive UI

- Accessible name — icon-only action ko accessibilityLabel; role aur disabled/selected state expose karo.
- Screen readers — Android TalkBack aur iOS VoiceOver se reading order/actions manually check karo.
- Font scaling — larger system text par truncation/overlap test; critical content fixed-height box mein trap mat karo.
- Touch target — tappable area aur spacing usable rakho; tiny icon ko tiny hit-area tak restrict mat karo.
- Visual feedback — color ke saath text/state indicator bhi; success/error sirf red/green se mat batao.
- Reduced motion — user preference respect; essential meaning animation alone mein mat rakho.

### React Native Testing Library

- getBy query — abhi exactly one matching element expected; missing/multiple par fail.
- queryBy query — absence assert karne ke liye null mile; multiple matches phir bhi error.
- findBy query — async UI appear hone ka awaited query; arbitrary sleep se test slow/flaky mat banao.
- Accessible queries — role/name se user-observable contract check; testID tab jab meaningful semantic query na mile.
- Hidden elements — default accessibility queries hidden UI exclude; expected visible state ke against assertion rakho.

### Diagnostics ki layers

- Repeated-flow test — screen open/close cycles ke baad memory trend dekho; single snapshot leak prove nahi karta.
- Allocation evidence — retained allocations aur release path trace; har memory spike ko leak label mat karo.

## Sources — aur padhne ke liye

- [Callstack — testing queries](https://oss.callstack.com/react-native-testing-library/docs/api/queries)
- [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance)

- [Testing](https://reactnative.dev/docs/testing-overview)
- [Accessibility](https://reactnative.dev/docs/accessibility)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Debugging](https://reactnative.dev/docs/debugging)
