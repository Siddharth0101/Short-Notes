---
id: rn-navigation-links
title: Navigation Expo Router aur deep links
track: react-native
order: 4
level: Intermediate
minutes: 4
summary: Navigation — stack detail-flow ke liye, tabs main sections ke liye; history behavior pehle decide karo.
tags: react-native, mobile, expo, navigation-links
---

## Quick revision

### Routes

- Navigation — stack detail-flow ke liye, tabs main sections ke liye; history behavior pehle decide karo.
- Expo Router — file-based navigation; route files app ya src/app directory mein.
- Layout route — `_layout.tsx` shared navigator/providers; har screen mein duplicate root setup mat karo.
- Dynamic route — `[id].tsx` path parameter; `(group)` grouping URL segment add nahi karti.
- Route params — small serializable identifiers; full mutable object ya secret token URL mein mat bhejo.
- Push/replace/back — new history entry / current replace / previous route; login/logout history intentionally handle karo.

### Lifecycle aur links

- Screen focus — screen mounted rehkar blur ho sakti hai; focus-scoped work ke liye navigation focus lifecycle use karo.
- Focus cleanup — blur/unmount par subscription/request cleanup; mount-only assumption duplicate work kara sakti hai.
- Deep link — URL se screen open; cold launch aur already-open app dono paths test karo.
- Auth boundary — protected screen gate useful; actual data authorization backend enforce karta hai.
- Link validation — external params untrusted; ID/schema validate karke resource access authorize karo.
- Android back — navigation history ke saath coordinate; unsaved changes par deliberate confirmation policy rakho.

### Link delivery aur guarded navigation

- Initial URL — Linking.getInitialURL cold-start link deta hai; running app ke liye url event subscription chahiye.
- Universal/App Links — verified HTTPS domain association se app khule; custom scheme registration se alag setup.
- openURL — external URL launch fail/reject ho sakta hai; supported scheme aur fallback handle karo.
- canOpenURL — platform manifest/scheme configuration result affect kar sakti hai; result ko authorization check mat samjho.
- usePreventRemove — unsaved state par route removal guard; gestures/header back samet navigation actions cover karo.
- Process exit — navigation guard OS kill ko stop nahi karta; important draft ko timely persist karo.

### Edge cases aur reasoning

- Auth restoration gate — initial secure storage read pending ko logged-out mat samjho; deep link identity hold karke auth-ready route resolve karo.
- Deep-link replay — same initial URL/event duplicate processing possible; route/action identity se unintended repeated side effects avoid karo.
- Screen lifetime authority — mounted screen background/blur par camera/polling active rakhna waste; focus plus app visibility ka combined ownership define karo.

## Recall aur practice

- Sawal — Logged-out protected deep link ke baad login success par user ko kahan bhejoge?
- Jawaab — Validated intended destination preserve karo, authorization recheck karke route resolve; missing/forbidden resource ka recovery do.
- Khud try karo — Cold/warm deep links test karo; auth load delay, malformed ID, deleted resource, duplicate event aur Android back history verify karo.

## Sources — aur padhne ke liye

- [React Native — Linking](https://reactnative.dev/docs/linking)
- [React Navigation — prevent removal](https://reactnavigation.org/docs/preventing-going-back/)

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Route notation](https://docs.expo.dev/router/basics/notation/)
- [Router navigation](https://docs.expo.dev/router/basics/navigation/)
- [Navigation lifecycle](https://reactnavigation.org/docs/navigation-lifecycle/)
- [Mobile security](https://reactnative.dev/docs/security)
