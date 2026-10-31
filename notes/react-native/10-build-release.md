---
id: rn-build-release
title: Build signing OTA updates aur revision traps
track: react-native
order: 10
level: Advanced
minutes: 4
summary: Development/production — debug tools aur release configuration alag; release build ka smoke test karo.
tags: react-native, mobile, expo, build-release
---

## Quick revision

> Revision target — JS update aur native binary compatibility ka contract samjho; rollout ke saath data rollback bhi rehearse karo.

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

### Edge cases aur reasoning

- Update identity tuple — platform+channel/runtime compatibility inspect; matching channel alone missing native module safe nahi banata.
- Rollback data compatibility — old JS update newer persisted schema read kare toh fail; forward/backward storage migration contract rehearse karo.
- Crash diagnostics — deployed build/update ID aur matching source maps/symbols retain; local source stack unrelated release ko misdiagnose kar sakta.

## Example se samjho

- Scenario — release B naya native module use karti hai, lekin device par release A ki old binary installed hai.
- Trace — JS update missing native implementation create nahi kar sakti; compatible build/runtime boundary enforce karni hogi.
- Decision — required native build distribute karo; update channel ke saath runtime compatibility policy verify karo.
- Catch — code rollback se storage schema ya server side effects automatically reverse nahi hote.
- Check — old install se upgrade, persisted draft read, wrong API config aur rollback par recoverable behavior verify karo.

## Recall aur practice

- Sawal — Native module add karke same runtimeVersion par OTA publish karna compatible kyun nahi?
- Jawaab — Old binary mein native implementation missing; rebuild aur correct compatibility/runtime policy required, channel alone fix nahi.
- Khud try karo — Preview release checklist run karo; installed old binary, native module change, wrong backend, persisted schema upgrade aur rollback data-read verify karo.

## Practice questions

### Easy · OTA update se kya ship nahi hota?

<details>
<summary>Answer</summary>

- OTA — JS bundle aur assets badal sakta hai.
- Nahi — native code, naye native modules, permissions/`Info.plist`/`AndroidManifest` changes; inke liye store build.
- `runtimeVersion` — update sirf compatible native build ko milta hai; mismatch par crash se bachata hai.

</details>

### Easy · `EXPO_PUBLIC_API_KEY` mein secret

<details>
<summary>Answer</summary>

- `EXPO_PUBLIC_` variables build time par JS bundle mein inline hote hain; app download karne wala padh sakta hai.
- Secret — server par rakho; app server se short-lived token le.
- Public values (API base URL, public analytics key) ke liye hi `EXPO_PUBLIC_`.

</details>

### Medium · Store upload reject: "build number already used"

<details>
<summary>Answer</summary>

- `version` — user ko dikhne wala (1.4.0).
- Build number — iOS `buildNumber` / Android `versionCode`; har upload par badhna chahiye.
- Fix — EAS `autoIncrement` ya remote app versioning, taaki manually bhoolna na pade.

</details>

### Medium · Bad OTA update ka rollback

Naye OTA update ke baad crash rate badh gaya. Kya karoge, aur rollback ki limit kya hai?

<details>
<summary>Answer</summary>

- Turant — rollout pause karo, previous update republish/rollback karo.
- Future — staged rollout (e.g. 10% → 50% → 100%) crash monitoring ke saath.
- Limit — rollback code wapas laata hai, data nahi. Naye version ne local DB schema/storage format badla toh purana code use padh nahi payega — migrations backward-compatible rakho.

</details>

### Hard · Release checklist

Production release se pehle kya verify karoge?

<details>
<summary>Answer</summary>

- Build — `production` profile, sahi bundle id/package, signing credentials, incremented build number.
- Config — production env values, no dev menus/logs, `runtimeVersion` policy.
- Quality — real devices (low-end Android bhi), offline/permission-denied flows, accessibility checks.
- Observability — crash reporting with source maps uploaded, release tag.
- Rollout — staged release, monitoring dashboard, rollback plan likha hua.

</details>

## Sources — aur padhne ke liye

- [Expo runtime-version compatibility](https://docs.expo.dev/eas-update/runtime-versions/)

- [Expo — environment variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo — app versions](https://docs.expo.dev/build-reference/app-versions/)

- [Expo store builds](https://docs.expo.dev/deploy/build-project/)
- [Build configuration](https://docs.expo.dev/build/eas-json/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
