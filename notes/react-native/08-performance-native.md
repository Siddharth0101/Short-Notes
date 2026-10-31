---
id: rn-performance-native
title: Performance animations aur native architecture
track: react-native
order: 8
level: Advanced
minutes: 5
summary: JS thread — expensive JS work event handling/renders delay kar sakta hai.
tags: react-native, mobile, expo, performance-native
---

## Quick revision

> Revision target — JS, UI aur native memory ke symptoms separate measure karo; optimization same device/build par compare karo.

### Measure pehle

- JS thread — expensive JS work event handling/renders delay kar sakta hai.
- UI thread — native drawing/interactions; smooth native scroll ka matlab JS thread healthy hona zaroori nahi.
- Frame budget — 60Hz par roughly 16.7ms; higher refresh rate par per-frame budget aur chhota.
- Release profiling — development overhead ke bina physical device par startup, scroll aur memory measure karo.
- Render optimization — expensive rows/profiled work optimize; memoization ko automatic speed guarantee mat samjho.

### Animations aur interop

- Animated — values se declarative animation; value ko ref mein retain karo, har render naya object mat banao.
- Native driver — supported opacity/transform animations JS stalls se independent; layout properties supported assume mat karo.
- Gesture work — continuous gesture computation ke liye chosen library ka UI-thread/worklet model samjho.
- JSI — JS aur native/C++ interop interface; old serialized bridge se alag mechanism.
- Fabric — newer renderer; TurboModules native-module system, Codegen typed specs se glue generate karta hai.
- Hermes — React Native ke liye JavaScript engine; UI toolkit ya navigation library nahi.
- Native integration — SDK/device-specific capability expose; thread, lifecycle aur error contract clear rakho.

### Reanimated aur gesture concepts

- Shared value — useSharedValue animation data rakhta hai; React state se different update/render model.
- Animated style — useAnimatedStyle shared values se style derive; plain style object se reactive animation assume mat karo.
- Worklet — short function UI runtime par chal sakta hai; heavy work UI par shift karna jank ka fix nahi.
- Timing/spring/decay — duration-based / spring motion / slowing momentum; motion requirement ke hisaab se choose.
- Gesture competition — race mein first active wins; simultaneous mein saath; exclusive mein priority/failure order.
- Gesture API versions — RNGH 2 Gesture.Race aur RNGH 3 useCompetingGestures same syntax nahi; installed major ke docs follow karo.
- Runtime boundary — worklet se React state/navigation call ke liye supported JS-runtime scheduling API use; synchronous cross-runtime assumption avoid karo.

### Startup aur memory investigation

- Startup baseline — cold/warm/hot launches separate measure; same device/build aur same usable-screen milestone compare karo.
- Bundle cost — dependency size aur module initialization profile; library add karne ka startup effect measure karo.
- Retention leak — repeated navigation ke baad live objects/resources grow hon toh listener, closure aur native allocations inspect karo.
- Native profiling — JS heap alone native image/buffer allocations nahi dikhata; platform/native profiler bhi inspect karo.

### Edge cases aur reasoning

- Image memory budget — decoded width×height×bytes-per-pixel estimate compressed file size se different; thumbnail/source dimensions right-size karo.
- Cross-runtime payload — worklet/native/JS boundaries par large captured data transfer cost; narrow values/events pass karo.
- Animation lifecycle — unmounted/blurred view ki ongoing animation/subscription cancel; background scheduling aur battery cost measure karo.

## Example se samjho

- Scenario — 4,000 × 3,000 image file compressed form mein small hai, par gallery scroll par memory badh rahi hai.
- Estimate — four bytes per pixel assume karo toh one decoded buffer roughly 48 MB hai; compressed download size decoded memory nahi batata.
- Decision — rendered size ke suitable thumbnails use; repeated navigation ke baad retained resources inspect karo.
- Catch — actual allocation pixel format, decoding aur extra buffers se vary karti hai; JS heap alone complete native memory nahi.
- Check — release build ke same device/data par frame drops aur peak/retained memory before/after compare karo.

## Recall aur practice

- Sawal — 100KB compressed image decoded memory bhi exactly100KB hogi?
- Jawaab — Nahi; dimensions/pixel format se decoded allocation much larger ho sakti, JS heap native allocation bhi miss kar sakta.
- Khud try karo — Image list release build profile karo; oversized versus thumbnail assets, repeated navigation retention aur gesture frame drops compare karo.

## Practice questions

### Easy · Button tap par app freeze

Ek tap par 2 second ka sync JSON processing chalta hai aur UI animations/taps ruk jaate hain. Kyun?

<details>
<summary>Answer</summary>

- Kyun — JS thread busy hai; React updates aur JS-driven handlers frame budget (~16.7ms at 60Hz) miss karte hain.
- Fix — kaam chhote chunks mein, server par, ya native/worker side; data pagination.
- Animations — native-driven ho toh JS busy hone par bhi chal sakti hain.

</details>

### Easy · Dev build mein slow, release mein?

<details>
<summary>Answer</summary>

- Dev mode — extra checks, warnings aur unminified JS; performance numbers misleading.
- Rule — profiling aur perf decisions release (production) build par real device par.
- Baseline — startup time, frame drops, memory pehle measure karo, phir fix compare karo.

</details>

### Medium · `useNativeDriver: true` ke saath width animate

```js
Animated.timing(width, { toValue: 300, useNativeDriver: true }).start();
```

<details>
<summary>Answer</summary>

- Result — error: native driver `width` jaisi layout props support nahi karta.
- Supported — `transform` (translate, scale, rotate) aur `opacity`.
- Fix — `transform: [{ scaleX }]` se visual effect, ya layout animation ke liye `useNativeDriver: false` (JS thread par chalegi) / Reanimated.

</details>

### Medium · Reanimated worklet se JS function call

Gesture end par UI thread se `setSelected(id)` (React state) call karna hai. Seedha call kyun nahi aur kya karoge?

<details>
<summary>Answer</summary>

- Kyun — worklet UI runtime par chalta hai; React state aur normal JS functions JS runtime mein hain.
- Fix — library ka bridge helper use karo (Reanimated mein `runOnJS(setSelected)(id)`; naye versions mein worklets ka equivalent helper).
- Payload — runtimes ke beech sirf chhota serializable data bhejo.

</details>

### Hard · Screen leave karne ke baad memory badhti rehti hai

Chat screen open/close karne par memory har baar badhti hai. Debug aur fix plan?

<details>
<summary>Answer</summary>

- Reproduce — same flow 10 baar repeat karke memory graph dekho (Xcode Instruments / Android Studio profiler).
- Common leaks — socket/listener/timer cleanup missing; global cache mein messages bina limit; bade images full resolution mein.
- Fix — har subscription effect cleanup mein unsubscribe; cache LRU/bounded; images display size par.
- Verify — repeated flow ke baad memory plateau kare, linearly na badhe.

</details>

## Sources — aur padhne ke liye

- [Software Mansion — scheduleOnRN](https://docs.swmansion.com/react-native-worklets/docs/threading/scheduleOnRN/)

- [Software Mansion — Reanimated concepts](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/)
- [Software Mansion — Gesture Handler 3 migration](https://docs.swmansion.com/react-native-gesture-handler/docs/guides/upgrading-to-3/)
- [Software Mansion — gesture relationships](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/fundamentals/gesture-composition/)
- [Callstack — optimization guide overview](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization)
- [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance)

- [Performance](https://reactnative.dev/docs/performance)
- [Animations](https://reactnative.dev/docs/animations)
- [New Architecture](https://reactnative.dev/architecture/landing-page)
- [Hermes](https://reactnative.dev/docs/hermes)
