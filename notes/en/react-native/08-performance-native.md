---
id: rn-performance-native
title: Performance, animations and native architecture
track: react-native
order: 8
level: Advanced
minutes: 5
summary: JS thread — expensive JS work can delay event handling and renders.
tags: react-native, mobile, expo, performance-native
---

## Quick revision

> Revision target — Measure the symptoms of JS, UI and native memory separately; compare an optimization on the same device/build.

### Measure first

- JS thread — expensive JS work can delay event handling/renders.
- UI thread — native drawing/interactions; a smooth native scroll does not mean the JS thread is healthy.
- Frame budget — roughly 16.7ms at 60Hz; at a higher refresh rate the per-frame budget is even smaller.
- Release profiling — measure startup, scroll and memory on a physical device without the development overhead.
- Render optimization — optimize expensive rows/profiled work; do not treat memoization as an automatic speed guarantee.

### Animations and interop

- Animated — declarative animation from values; retain the value in a ref, do not create a new object on every render.
- Native driver — supported opacity/transform animations are independent of JS stalls; do not assume layout properties are supported.
- Gesture work — for continuous gesture computation understand the UI-thread/worklet model of the chosen library.
- JSI — the interop interface between JS and native/C++; a different mechanism from the old serialized bridge.
- Fabric — the newer renderer; TurboModules is the native-module system, and Codegen generates the glue from typed specs.
- Hermes — a JavaScript engine for React Native; not a UI toolkit or a navigation library.
- Native integration — exposes an SDK/device-specific capability; keep the thread, lifecycle and error contract clear.

### Reanimated and gesture concepts

- Shared value — useSharedValue holds animation data; a different update/render model from React state.
- Animated style — useAnimatedStyle derives a style from shared values; do not assume reactive animation from a plain style object.
- Worklet — a short function can run on the UI runtime; shifting heavy work to the UI is not a fix for jank.
- Timing/spring/decay — duration-based / spring motion / slowing momentum; choose according to the motion requirement.
- Gesture competition — in a race the first active one wins; simultaneous runs them together; exclusive follows a priority/failure order.
- Gesture API versions — RNGH 2 Gesture.Race and RNGH 3 useCompetingGestures are not the same syntax; follow the docs of the installed major.
- Runtime boundary — use the supported JS-runtime scheduling API to call React state/navigation from a worklet; avoid assuming synchronous cross-runtime calls.

### Startup and memory investigation

- Startup baseline — measure cold/warm/hot launches separately; compare the same device/build and the same usable-screen milestone.
- Bundle cost — profile dependency size and module initialization; measure the startup effect of adding a library.
- Retention leak — if live objects/resources grow after repeated navigation, inspect listeners, closures and native allocations.
- Native profiling — the JS heap alone does not show native image/buffer allocations; inspect with the platform/native profiler too.

### Edge cases and reasoning

- Image memory budget — the decoded width×height×bytes-per-pixel estimate differs from the compressed file size; right-size the thumbnail/source dimensions.
- Cross-runtime payload — large captured data has a transfer cost at worklet/native/JS boundaries; pass narrow values/events.
- Animation lifecycle — cancel the ongoing animation/subscription of an unmounted/blurred view; measure the background scheduling and battery cost.

## Understand it with an example

- Scenario — a 4,000 × 3,000 image file is small in compressed form, yet memory grows while scrolling the gallery.
- Estimate — assuming four bytes per pixel, one decoded buffer is roughly 48 MB; the compressed download size does not tell you the decoded memory.
- Decision — use thumbnails suited to the rendered size; inspect retained resources after repeated navigation.
- Catch — the actual allocation varies with the pixel format, decoding and extra buffers; the JS heap alone is not the complete native memory.
- Check — compare frame drops and peak/retained memory before/after on the same device/data with a release build.

## Recall and practice

- Question — Will a 100KB compressed image also take exactly 100KB of decoded memory?
- Answer — No; depending on the dimensions/pixel format the decoded allocation can be much larger, and the JS heap can miss the native allocation too.
- Try it yourself — Profile an image list in a release build; compare oversized versus thumbnail assets, retention after repeated navigation and gesture frame drops.

## Practice questions

### Easy · The app freezes on a button tap

One tap runs 2 seconds of sync JSON processing and the UI animations/taps stop. Why?

<details>
<summary>Answer</summary>

- Why — the JS thread is busy; React updates and JS-driven handlers miss the frame budget (~16.7ms at 60Hz).
- Fix — do the work in small chunks, on the server, or on the native/worker side; paginate the data.
- Animations — if they are native-driven they can keep running even while JS is busy.

</details>

### Easy · Slow in a dev build — and in release?

<details>
<summary>Answer</summary>

- Dev mode — extra checks, warnings and unminified JS; the performance numbers are misleading.
- Rule — profile and make perf decisions on a release (production) build on a real device.
- Baseline — measure startup time, frame drops and memory first, then compare the fix.

</details>

### Medium · Animating width with `useNativeDriver: true`

```js
Animated.timing(width, { toValue: 300, useNativeDriver: true }).start();
```

<details>
<summary>Answer</summary>

- Result — an error: the native driver does not support layout props such as `width`.
- Supported — `transform` (translate, scale, rotate) and `opacity`.
- Fix — the visual effect with `transform: [{ scaleX }]`, or for a layout animation `useNativeDriver: false` (it runs on the JS thread) / Reanimated.

</details>

### Medium · Calling a JS function from a Reanimated worklet

At the end of a gesture you need to call `setSelected(id)` (React state) from the UI thread. Why not call it directly, and what do you do?

<details>
<summary>Answer</summary>

- Why — a worklet runs on the UI runtime; React state and normal JS functions live in the JS runtime.
- Fix — use the library's bridge helper (`runOnJS(setSelected)(id)` in Reanimated; the equivalent worklets helper in newer versions).
- Payload — send only small serializable data between the runtimes.

</details>

### Hard · Memory keeps growing after leaving the screen

Memory grows every time the chat screen is opened/closed. A debugging and fix plan?

<details>
<summary>Answer</summary>

- Reproduce — repeat the same flow 10 times and watch the memory graph (Xcode Instruments / the Android Studio profiler).
- Common leaks — missing socket/listener/timer cleanup; messages in a global cache with no limit; large images at full resolution.
- Fix — unsubscribe in the effect cleanup of every subscription; an LRU/bounded cache; images at display size.
- Verify — after the repeated flow, memory should plateau, not grow linearly.

</details>

## Sources — further reading

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
