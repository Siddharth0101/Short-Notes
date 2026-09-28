---
id: rn-build-release
title: Build signing OTA updates aur revision traps
track: react-native
order: 10
level: Advanced
minutes: 2
summary: Development/production — debug tools aur release configuration alag; release build ka smoke test karo.
tags: react-native, mobile, expo, build-release
---

## Quick revision

### Shipping

- Development/production — debug tools aur release configuration alag; release build ka smoke test karo.
- App identity — Android applicationId/iOS bundle identifier stable product identity; display name se alag.
- Signing — release credentials securely manage; build artifact signed hona store approval ke equal nahi.
- EAS Build — configured Android/iOS binaries build service; store submission/review alag steps.
- Build profiles — development, preview aur production config separate; correct API endpoint verify karo.
- Release checks — cold start, auth, deep link, permissions aur upgrade data migration test karo.

### Updates aur interview traps

- OTA update — compatible JS/assets update; installed native binary ko arbitrary change nahi kar sakta.
- Runtime version — update aur native build compatibility boundary; native module badle toh rebuild aur compatible runtime chahiye.
- Rollout — small audience se start; crash/error metrics dekhkar expand ya rollback karo.
- Rollback limit — code revert se server/schema side effects automatically undo nahi hote.
- Revision trap — Expo app bhi React Native hai; Expo Go ki limits ko poore Expo ecosystem ki limits mat samjho.
- Capstone — paginated list → detail → saved preference; offline/error, accessibility aur resume behavior demonstrate karo.

### Configuration aur release versions

- EXPO_PUBLIC variables — client bundle mein inline/readable; environment name secret storage nahi banata.
- Environment match — preview/production API config build aur update dono mein align; wrong backend release se pehle detect karo.
- User version — app ka visible version; Android versionCode/iOS buildNumber upload/build identity se alag.
- Build increment — store upload ke platform rules follow; JS update number ko native build number assume mat karo.
- Gradle/Xcode — Android/iOS native build toolchains; Metro bundling success native compilation success ka proof nahi.
- Build credentials — package/bundle ID, signing config aur intended profile match; wrong identity ka binary alag app ban sakta hai.

## Sources — aur padhne ke liye

- [Expo — environment variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo — app versions](https://docs.expo.dev/build-reference/app-versions/)

- [Expo store builds](https://docs.expo.dev/deploy/build-project/)
- [Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/)
- [Build configuration](https://docs.expo.dev/build/eas-json/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
