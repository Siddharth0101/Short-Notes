---
id: rn-foundations-expo
title: React Native basics aur Expo workflow
track: react-native
order: 1
level: Foundation
minutes: 4
summary: React Native — React components se Android/iOS native UI banao; browser DOM use nahi hota.
tags: react-native, mobile, expo, foundations-expo
---

## Quick revision

### Mobile foundation

- React Native — React components se Android/iOS native UI banao; browser DOM use nahi hota.
- React knowledge — props, state, Hooks aur component identity same concepts; UI primitives mobile wale hain.
- Native vs web — div/button ki jagah View/Text/Pressable; web-only packages direct compatible assume mat karo.
- Platform code — small difference par Platform.select; bigger difference par .ios.tsx/.android.tsx files.
- Metro — development mein JavaScript modules bundle karta hai; native binary build alag step hai.

### Expo workflow

- Expo — React Native ke tools, SDK modules aur build/update services ka ecosystem.
- Expo Go — fixed native libraries wala starter client; arbitrary custom native modules add nahi kar sakte.
- Development build — apni native libraries/config wala debug app; native dependency change par rebuild chahiye.
- Expo install — SDK-compatible package version ke liye `npx expo install package-name` use karo.
- Fast Refresh — edits jaldi reflect; full cold start aur persisted-state behavior separately test karo.
- Device testing — Android aur iOS par check; simulator success physical-device behavior ka proof nahi.

### Native project ownership

- Prebuild — Expo app config se android/ios projects generate; CNG mein generated files ko permanent source of truth mat banao.
- Config plugin — native settings ko repeatable config transformation mein express; manual generated-file edits overwrite ho sakti hain.
- Prebuild clean — native folders regenerate karta hai; unmanaged custom native changes pehle migrate/preserve karo.
- Manual native project — Xcode/Gradle files khud maintain kar sakte ho; Expo services use karne ke liye CNG mandatory nahi.
- Native vs JS dependency — native code wali package ko binary build mein include karna padta hai; JS-only changes ka workflow alag.
- Upgrade compatibility — Expo SDK, React Native aur native library versions ko compatible set mein upgrade/test karo.

### Edge cases aur reasoning

- Backend boundary — Expo app tooling backend authorization/storage automatically implement nahi karta; server API aur credential ownership separately define karo.
- Native support matrix — Android/iOS/web exports/platform behavior differ; package install se all targets supported prove nahi.
- Build reproducibility — lockfile, SDK, config plugins aur native toolchain versions record; local Metro success CI native build proof nahi.

## Recall aur practice

- Sawal — Expo Go mein missing custom native module ko Fast Refresh fix karega?
- Jawaab — Nahi; client binary module contain nahi karti. Compatible native dependency ke saath development build chahiye.
- Khud try karo — Starter app ka JS edit aur native dependency edit compare karo; reload versus rebuild requirement aur Android/iOS smoke checks document karo.

## Sources — aur padhne ke liye

- [Expo — native generation](https://docs.expo.dev/workflow/continuous-native-generation/)
- [Expo — config plugins](https://docs.expo.dev/config-plugins/introduction/)

- [React Native introduction](https://reactnative.dev/docs/getting-started)
- [Platform-specific code](https://reactnative.dev/docs/platform-specific-code)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
