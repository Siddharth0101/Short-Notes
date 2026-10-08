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

## Recall aur practice

- Sawal — 100KB compressed image decoded memory bhi exactly100KB hogi?
- Jawaab — Nahi; dimensions/pixel format se decoded allocation much larger ho sakti, JS heap native allocation bhi miss kar sakta.
- Khud try karo — Image list release build profile karo; oversized versus thumbnail assets, repeated navigation retention aur gesture frame drops compare karo.

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
